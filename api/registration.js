const schema = require("../registration-schema");

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i;
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
  };
}

function isReady(config) {
  return Boolean(config.enabled && config.databaseUrl && config.databaseKey && config.mailKey &&
    EMAIL.test(config.sender || "") && Object.values(config.recipients).every((email) => EMAIL.test(email || "")));
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
      text: `A new ${formName} was saved. Reference: ${id}. Open ssn_registrations in the Stay Safe Nigeria Supabase project to view the response.`,
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
    // Storage is authoritative. Authorised staff can still view the saved response in Supabase.
    console.error("Registration notification remains unconfirmed:", error.message);
  }
  return res.status(inserted.length ? 201 : 200).json({ ok: true });
}

module.exports = async function registration(req, res) {
  const config = settings();
  const ready = isReady(config);
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  try {
    if (req.method === "GET") {
      if (new URL(req.url, "http://localhost").searchParams.has("export")) {
        return res.status(404).json({ error: "Not found." });
      }
      return res.status(200).json({ ready });
    }
    if (!["GET", "POST"].includes(req.method)) {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed." });
    }
    if (!ready) return res.status(503).json({ error: "Registration service is unavailable." });
    return await submit(req, res, config);
  } catch (error) {
    console.error("Registration service error:", error.message);
    return res.status(503).json({ error: "We could not complete this request. Please try again." });
  }
};
