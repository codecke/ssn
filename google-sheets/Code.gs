// Bound to the restricted registration spreadsheet. Set SSN_INGEST_TOKEN in Script Properties.
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const expected = PropertiesService.getScriptProperties().getProperty('SSN_INGEST_TOKEN');
    if (!expected || payload.token !== expected) return reply_({ ok: false, error: 'unauthorized' });
    const row = payload.registration;
    if (!row || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(row.id) ||
        !['volunteer', 'partner'].includes(row.form_type) ||
        (row.submitted_at && !/^\d{4}-\d{2}-\d{2}T/.test(row.submitted_at)) ||
        !row.answers || typeof row.answers !== 'object' || Array.isArray(row.answers)) {
      return reply_({ ok: false, error: 'invalid registration' });
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ssn_registrations_rows.csv');
      if (!sheet) throw new Error('Registration sheet missing');
      const last = sheet.getLastRow();
      const found = last > 1 ? sheet.getRange(2, 1, last - 1, 1).createTextFinder(row.id).matchEntireCell(true).findNext() : null;
      if (!found) {
        sheet.appendRow([row.id, row.form_type, row.submitted_at || new Date().toISOString(),
          JSON.stringify(row.answers), Boolean(row.notified)]);
        SpreadsheetApp.flush();
      }
      return reply_({ ok: true, duplicate: Boolean(found) });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error);
    return reply_({ ok: false, error: 'write failed' });
  }
}

function reply_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
