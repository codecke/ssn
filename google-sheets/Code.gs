// Bound to the private registration spreadsheet. SSN_INGEST_TOKEN is a Script Property.
const RAW_SHEET = 'ssn_registrations_rows.csv';
const VIEWS = {
  volunteer: {
    title: 'Volunteers',
    columns: [
      ['fullName', 'Full name'], ['email', 'Email'], ['whatsapp', 'WhatsApp'],
      ['state', 'State'], ['localGovernmentArea', 'LGA'], ['country', 'Country'],
      ['gender', 'Gender'], ['profession', 'Profession'], ['student', 'Student'],
      ['studentDetails', 'Student details'], ['specialisation', 'Specialisation'],
      ['interestAreas', 'Interest areas'], ['leadershipInterest', 'Leadership interest'],
      ['leadershipRole', 'Leadership role'], ['coordinationStates', 'Coordination states'],
      ['basedInState', 'Based in state'], ['leadershipExperience', 'Leadership experience'],
      ['leadershipDetails', 'Leadership details'], ['coordinatorMotivation', 'Coordinator motivation'],
      ['coordinatorSkills', 'Coordinator skills'], ['volunteerMode', 'Volunteer mode'],
      ['preferredLocation', 'Preferred location'], ['availability', 'Availability'],
      ['previousVolunteering', 'Previous volunteering'], ['volunteeringDetails', 'Volunteering details'],
      ['motivation', 'Motivation'], ['accuracy', 'Accuracy declaration'],
      ['contactConsent', 'Contact consent'],
    ],
  },
  partner: {
    title: 'Partners',
    columns: [
      ['organisation', 'Organisation'], ['organisationType', 'Organisation type'],
      ['otherOrganisationType', 'Other organisation type'], ['country', 'Country'],
      ['state', 'State'], ['website', 'Website'], ['officialEmail', 'Official email'],
      ['organisationPhone', 'Organisation phone'], ['fullName', 'Contact full name'],
      ['position', 'Position'], ['email', 'Contact email'], ['whatsapp', 'WhatsApp'],
      ['partnershipAreas', 'Partnership areas'], ['otherPartnershipArea', 'Other partnership area'],
      ['resources', 'Resources'], ['coverage', 'Coverage'], ['coverageDetails', 'Coverage details'],
      ['proposal', 'Proposal'], ['contactConsent', 'Contact consent'],
    ],
  },
};

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const expected = PropertiesService.getScriptProperties().getProperty('SSN_INGEST_TOKEN');
    if (!expected || payload.token !== expected) return reply_({ ok: false, error: 'unauthorized' });
    const row = payload.registration;
    if (!validRow_(row)) return reply_({ ok: false, error: 'invalid registration' });
    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      const book = SpreadsheetApp.getActiveSpreadsheet();
      const raw = book.getSheetByName(RAW_SHEET);
      if (!raw) throw new Error('Registration sheet missing');
      const rawExists = hasReference_(raw, row.id);
      if (!rawExists) {
        raw.appendRow([row.id, row.form_type, row.submitted_at || new Date().toISOString(),
          JSON.stringify(row.answers), Boolean(row.notified)]);
      }
      writeView_(book, row);
      SpreadsheetApp.flush();
      return reply_({ ok: true, duplicate: rawExists });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error);
    return reply_({ ok: false, error: 'write failed' });
  }
}

// Run once after deployment to turn earlier raw registrations into readable rows.
// It is safe to run again; references already present in a view are skipped.
function backfill() {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const raw = book.getSheetByName(RAW_SHEET);
    if (!raw) throw new Error('Registration sheet missing');
    const last = raw.getLastRow();
    const rows = last > 1 ? raw.getRange(2, 1, last - 1, 5).getValues() : [];
    const added = { volunteer: 0, partner: 0 };
    for (const [id, formType, submittedAt, answersText, notified] of rows) {
      try {
        const row = { id: String(id), form_type: String(formType),
          submitted_at: submittedAt instanceof Date ? submittedAt.toISOString() : String(submittedAt),
          answers: JSON.parse(answersText),
          notified: notified === true || String(notified).toUpperCase() === 'TRUE' };
        if (validRow_(row) && writeView_(book, row)) added[row.form_type]++;
      } catch (error) {
        console.error('Skipped invalid raw registration', id, error);
      }
    }
    SpreadsheetApp.flush();
    console.log(JSON.stringify(added));
    return added;
  } finally {
    lock.releaseLock();
  }
}

function validRow_(row) {
  return Boolean(row && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(row.id) &&
    Object.prototype.hasOwnProperty.call(VIEWS, row.form_type) &&
    (!row.submitted_at || /^\d{4}-\d{2}-\d{2}[T ]/.test(row.submitted_at)) &&
    row.answers && typeof row.answers === 'object' && !Array.isArray(row.answers));
}

function hasReference_(sheet, id) {
  const last = sheet.getLastRow();
  return Boolean(last > 1 && sheet.getRange(2, 1, last - 1, 1)
    .createTextFinder(id).matchEntireCell(true).findNext());
}

function writeView_(book, row) {
  const view = VIEWS[row.form_type];
  const sheet = viewSheet_(book, view);
  if (hasReference_(sheet, row.id)) return false;
  sheet.appendRow([row.id, row.submitted_at || '',
    ...view.columns.map(([key]) => safeCell_(row.answers[key])), Boolean(row.notified)]);
  return true;
}

function viewSheet_(book, view) {
  const headings = ['Reference', 'Submitted at (UTC)',
    ...view.columns.map(([, heading]) => heading), 'Email notified'];
  let sheet = book.getSheetByName(view.title);
  if (!sheet) {
    sheet = book.insertSheet(view.title, view.title === 'Volunteers' ? 0 : 1);
    if (sheet.getMaxColumns() < headings.length) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), headings.length - sheet.getMaxColumns());
    }
    sheet.getRange(1, 1, 1, headings.length).setValues([headings]);
    sheet.getRange(1, 1, 1, headings.length).setBackground('#e8eaed').setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(2);
    sheet.setColumnWidth(1, 285);
    sheet.setColumnWidth(2, 220);
    sheet.setColumnWidths(3, headings.length - 3, 170);
    sheet.setColumnWidth(headings.length, 120);
    sheet.getRange(1, 1, sheet.getMaxRows(), headings.length).createFilter();
  } else {
    const actual = sheet.getRange(1, 1, 1, headings.length).getDisplayValues()[0];
    if (actual.some((heading, index) => heading !== headings[index])) {
      throw new Error('Registration view headers changed: ' + view.title);
    }
  }
  return sheet;
}

function safeCell_(value) {
  const text = Array.isArray(value) ? value.join('; ') : value == null ? '' : String(value);
  return /^\s*[=+\-@]/.test(text) ? "'" + text : text;
}

function reply_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
