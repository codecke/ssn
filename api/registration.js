const { createHash, timingSafeEqual } = require("node:crypto");
const schema = require("../registration-schema");

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
const PAGE_SIZE = 500;
const TABLE = "ssn_registrations";

function settings() {
  const env = process.env;
  return {
    enabled: env.SSN_REGISTRATION_ENABLED === "true",
    databaseUrl: env.SSN_SUPABASE_URL,
    databaseKey: env.SSN_SUPABASE_SERVICE_ROLE_KEY,
    mailKey: env.SSN_RESEND_API_KEY,
    sender: env.SSN_REGISTRATION_FROM,
    recipients: { volunteer: env.SSN_VOLUNTEER_INBOX, partner: env.SSN_PARTNER_INBOX },
    exportPassword: env.SSN_EXPORT_PASSWORD,
  };
}

function isReady(config) {
  return Boolean(config.enabled && config.databaseUrl && config.databaseKey && config.mailKey &&
    EMAIL.test(config.sender || "") && Object.values(config.recipients).every((email) => EMAIL.test(email || "")) &&
    (config.exportPassword?.length || 0) >= 24);
}

function validate(type, raw) {
  const answers = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return { error: "Enter your registration details." };
  for (const field of schema.fields(type)) {
    if (!schema.isVisible(field, answers)) continue;
    const value = raw[field.name];
    if (field.type === "multi") {
      if (!value || (Array.isArray(value) && !value.length)) {
        if (field.required) return { field: field.name, error: "Select at least one option." };
        continue;
      }
      if (!Array.isArray(value) || value.some((choice) => !field.options.includes(choice))) {
        return { field: field.name, error: "Choose from the options shown." };
      }
      answers[field.name] = [...new Set(value)];
      continue;
    }
    if (value !== undefined && typeof value !== "string") return { field: field.name, error: "Enter a valid answer." };
    const answer = value?.trim() || "";
    if (!answer) {
      if (field.required) return { field: field.name, error: "Complete this required field." };
      continue;
    }
    if (answer.length > schema.maxLength(field) || (field.options && !field.options.includes(answer))) {
      return { field: field.name, error: "Check this answer and try again." };
    }
    if (field.type === "email" && !EMAIL.test(answer)) return { field: field.name, error: "Enter a valid email address." };
    if (field.type === "url" && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(answer)) {
      return { field: field.name, error: "Enter a website starting with https:// or http://." };
    }
    answers[field.name] = answer;
  }
  return { answers };
}

async function database(config, query, options = {}) {
  const response = await fetch(new URL(`/rest/v1/${TABLE}${query}`, config.databaseUrl), {
    ...options,
    headers: {
      apikey: config.databaseKey,
      Authorization: `Bearer ${config.databaseKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal: AbortSignal.timeout(6500),
  });
  if (!response.ok) throw new Error(`Registration database returned ${response.status}`);
  return response.status === 204 ? null : response.json();
}

async function notifyTeam(config, type, id) {
  const formName = type === "volunteer" ? "volunteer registration" : "partnership enquiry";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.mailKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `ssn-registration/${id}`,
    },
    body: JSON.stringify({
      from: config.sender,
      to: [config.recipients[type]],
      subject: `Stay Safe Nigeria: new ${formName}`,
      text: `A new ${formName} was saved. Reference: ${id}. Download the staff CSV to view the response.`,
    }),
    signal: AbortSignal.timeout(6500),
  });
  if (!response.ok) throw new Error(`Registration mail returned ${response.status}`);
}

async function submit(req, res, config) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] || "")) {
    return res.status(415).json({ error: "Send a JSON request." });
  }
  const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? null);
  if (Buffer.byteLength(raw) > 32000) return res.status(413).json({ error: "This response is too long." });
  let body;
  try { body = JSON.parse(raw); }
  catch { return res.status(400).json({ error: "Invalid request." }); }
  const { type, id, answers, websiteConfirmation } = body || {};
  if (typeof type !== "string" || !schema.fields(type).length || typeof id !== "string" || !UUID.test(id)) {
    return res.status(400).json({ error: "Invalid registration request." });
  }
  if (websiteConfirmation) return res.status(200).json({ ok: true });
  const result = validate(type, answers);
  if (result.error) return res.status(422).json(result);

  const inserted = await database(config, "?on_conflict=id&select=id", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: JSON.stringify({ id, form_type: type, answers: result.answers }),
  });
  if (!inserted.length) {
    const [existing] = await database(config, `?id=eq.${id}&select=form_type,notified`);
    if (!existing || existing.form_type !== type) return res.status(409).json({ error: "Start a new registration and try again." });
    if (existing.notified) return res.status(200).json({ ok: true });
  }

  try {
    await notifyTeam(config, type, id);
    await database(config, `?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({ notified: true }),
    });
  } catch (error) {
    // Storage is authoritative. Staff can still download the saved response.
    console.error("Registration notification remains unconfirmed:", error.message);
  }
  return res.status(inserted.length ? 201 : 200).json({ ok: true });
}

function authorised(header, password) {
  if (!header?.startsWith("Basic ")) return false;
  const digest = (value) => createHash("sha256").update(value).digest();
  const supplied = Buffer.from(header.slice(6), "base64");
  return timingSafeEqual(digest(supplied), digest(`staff:${password}`));
}

function csvCell(value) {
  let text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  if (/^[\s\uFEFF]*[=+\-@]|^[\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}

async function exportResponses(req, res, config, type) {
  if (!authorised(req.headers.authorization, config.exportPassword)) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Stay Safe Nigeria staff"');
    return res.status(401).send("Staff sign-in required.");
  }
  const fields = schema.fields(type);
  if (!fields.length) return res.status(400).send("Choose volunteer or partner.");
  const rows = [["Reference", "Submitted at (UTC)", "Email accepted", ...fields.map((field) => field.label)]];
  const snapshot = new Date().toISOString();
  let cursor;
  while (true) {
    const query = new URLSearchParams({
      select: "id,submitted_at,notified,answers",
      form_type: `eq.${type}`,
      submitted_at: `lte.${snapshot}`,
      order: "id.asc",
      limit: String(PAGE_SIZE),
    });
    if (cursor) query.set("id", `gt.${cursor}`);
    const page = await database(config, `?${query}`);
    for (const row of page) {
      rows.push([row.id, row.submitted_at, row.notified ? "Yes" : "No", ...fields.map((field) => row.answers[field.name])]);
    }
    if (page.length < PAGE_SIZE) break;
    cursor = page.at(-1).id;
  }
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="ssn-${type}-responses.csv"`);
  return res.status(200).send("\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n"));
}

module.exports = async function registration(req, res) {
  const config = settings();
  const ready = isReady(config);
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  try {
    const exportType = new URL(req.url, "http://localhost").searchParams.get("export");
    if (req.method === "GET" && exportType === null) return res.status(200).json({ ready });
    if (!["GET", "POST"].includes(req.method)) {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed." });
    }
    if (!ready) return res.status(503).json({ error: "Registration service is unavailable." });
    if (req.method === "GET") return await exportResponses(req, res, config, exportType);
    return await submit(req, res, config);
  } catch (error) {
    console.error("Registration service error:", error.message);
    return res.status(503).json({ error: "We could not complete this request. Please try again." });
  }
};
