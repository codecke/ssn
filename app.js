const config = window.STAY_SAFE_CONFIG || {};
const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character]));

const menu = $(".menu-toggle");
menu?.addEventListener("click", () => {
  const expanded = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!expanded));
  $("#site-nav")?.classList.toggle("open", !expanded);
});
document.querySelectorAll(".site-nav a").forEach((link) => link.addEventListener("click", () => {
  menu?.setAttribute("aria-expanded", "false");
  $("#site-nav")?.classList.remove("open");
}));
if ($("#year")) $("#year").textContent = new Date().getFullYear();

function safeHttpUrl(value) {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; }
  catch { return ""; }
}

function renderContact() {
  const target = $("#contact-links");
  if (!target) return;
  const contact = config.contact || {};
  const links = [];
  if (contact.email) links.push(`<a href="mailto:${encodeURIComponent(contact.email)}">${esc(contact.email)}</a>`);
  if (contact.phone) links.push(`<a href="tel:${esc(contact.phone.replace(/[^+\d]/g, ""))}">${esc(contact.phone)}</a>`);
  const whatsapp = safeHttpUrl(contact.whatsapp);
  if (whatsapp) links.push(`<a href="${esc(whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>`);
  target.innerHTML = links.length ? links.join("") : "<p>Official contact details are being confirmed.</p>";
  const socialTarget = $("#social-links");
  const socialLinks = Object.entries(config.social || {}).map(([name, value]) => {
    const url = safeHttpUrl(value);
    return url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name.charAt(0).toUpperCase() + name.slice(1))} ↗</a>` : "";
  }).filter(Boolean);
  if (socialTarget) socialTarget.innerHTML = socialLinks.join("");
}

function renderCentres() {
  const result = $("#centre-results");
  if (!result) return;
  const centres = Array.isArray(config.centres) ? config.centres.filter((centre) => centre && centre.name && centre.state) : [];
  const stateSelect = $("#state-filter");
  const serviceSelect = $("#service-filter");
  [...new Set(centres.map((centre) => centre.state))].sort().forEach((state) => stateSelect.add(new Option(state, state)));
  [...new Set(centres.flatMap((centre) => centre.services || []))].sort().forEach((service) => serviceSelect.add(new Option(service, service)));
  const update = () => {
    const state = stateSelect.value;
    const service = serviceSelect.value;
    const visible = centres.filter((centre) => (!state || centre.state === state) && (!service || (centre.services || []).includes(service)));
    if (!centres.length) {
      result.innerHTML = `<div class="empty-state"><span class="empty-icon" aria-hidden="true">⌖</span><h3>Our centre network is being onboarded.</h3><p>Verified participating centres will appear here once they have been formally approved. Please check back for updates.</p></div>`;
      return;
    }
    if (!visible.length) {
      result.innerHTML = `<div class="empty-state"><h3>No matching centres yet.</h3><p>Try another state or service.</p></div>`;
      return;
    }
    result.innerHTML = `<p class="result-count">${visible.length} approved ${visible.length === 1 ? "centre" : "centres"}</p><div class="centre-grid">${visible.map((centre) => {
      const directions = safeHttpUrl(centre.directionsUrl);
      const phone = centre.phone ? centre.phone.replace(/[^+\d]/g, "") : "";
      return `<article class="centre-card"><span>${esc(centre.state)}${centre.city ? ` / ${esc(centre.city)}` : ""}</span><h3>${esc(centre.name)}</h3><p>${esc(centre.address || "")}</p><p class="centre-services">${(centre.services || []).map(esc).join(" · ")}</p><div>${phone ? `<a href="tel:${esc(phone)}">Call centre ↗</a>` : ""}${directions ? `<a href="${esc(directions)}" target="_blank" rel="noopener noreferrer">Directions ↗</a>` : ""}</div></article>`;
    }).join("")}</div>`;
  };
  $("#find-button")?.addEventListener("click", update);
  stateSelect?.addEventListener("change", update);
  serviceSelect?.addEventListener("change", update);
  update();
}

const cancerContent = {
  breast: { name: "Breast cancer", eyebrow: "01 / 04", intro: "Changes in the breast deserve attention and, when unusual, clinical assessment.", points: ["Breast cancer can affect women and men.", "A new lump, change in breast shape, nipple change or unusual discharge should be assessed by a healthcare professional.", "Appropriate screening depends on age, risk and clinical guidance."] },
  cervical: { name: "Cervical cancer", eyebrow: "02 / 04", intro: "HPV vaccination and appropriate screening are important tools for prevention and early detection.", points: ["Persistent infection with high-risk HPV is the main cause of cervical cancer.", "Screening can identify precancerous changes before cancer develops.", "Abnormal vaginal bleeding or unusual discharge needs medical evaluation."] },
  prostate: { name: "Prostate cancer", eyebrow: "03 / 04", intro: "Screening decisions should be made through informed discussion with a qualified healthcare professional.", points: ["Age and family history can affect risk.", "Urinary symptoms can have many causes and are not specific to prostate cancer.", "Discuss the potential benefits and harms of PSA testing and clinical assessment with a healthcare professional."] },
  liver: { name: "Liver cancer", eyebrow: "04 / 04", intro: "Prevention and management of liver disease can help address important risk factors.", points: ["Chronic hepatitis B and C infection are important risk factors.", "Hepatitis B vaccination and hepatitis testing are important prevention measures.", "People with chronic liver disease may need individualised surveillance under clinical guidance."] }
};

function renderDetailPage() {
  const root = $("#detail-root");
  if (!root) return;
  const type = new URLSearchParams(location.search).get("type");
  const data = cancerContent[type];
  if (!data) { root.innerHTML = `<section class="detail-main"><h1>Page not found</h1><a class="button green" href="index.html#cancers">Explore cancer information</a></section>`; return; }
  document.title = `${data.name} | Stay Safe Nigeria`;
  root.innerHTML = `<section class="detail-hero"><div class="detail-wrap"><a class="back-link" href="index.html#cancers">← All cancer information</a><p class="eyebrow light">${data.eyebrow} / Know the facts</p><h1>${data.name}<span class="dot yellow-dot">.</span></h1><p>${data.intro}</p></div></section><section class="detail-main"><div class="detail-wrap detail-columns"><div><p class="eyebrow">What to know</p><h2>Start with accurate information.</h2></div><div><ul class="fact-list">${data.points.map((point) => `<li>${esc(point)}</li>`).join("")}</ul><div class="medical-note"><strong>Medical information notice</strong><p>This content is for general education only and does not replace professional consultation, diagnosis or treatment. Clinical review by Blue Ozone Health is required before publication.</p></div><a class="button green" href="index.html#centres">Find a participating centre ↗</a></div></div></section>`;
}

function renderFormPage() {
  const root = $("#form-root");
  if (!root) return;
  const type = new URLSearchParams(location.search).get("type");
  const forms = {
    volunteer: { title: "Volunteer with us", intro: "Share your interest in supporting cancer awareness, prevention and access to care. State Coordinator interest is handled through this registration path." },
    partner: { title: "Partner with us", intro: "Healthcare institutions and organisations can express interest in working with the initiative." },
    sponsor: { title: "Support the initiative", intro: "Individuals and organisations can express interest in financial or resource support. No payment is collected on this website." }
  };
  const data = forms[type];
  if (!data) { root.innerHTML = `<section class="detail-main"><h1>Page not found</h1></section>`; return; }
  document.title = `${data.title} | Stay Safe Nigeria`;
  const url = safeHttpUrl(config.forms?.[type]);
  root.innerHTML = `<section class="detail-hero"><div class="detail-wrap"><a class="back-link" href="index.html#involved">← Get involved</a><p class="eyebrow light">Join the movement</p><h1>${data.title}<span class="dot yellow-dot">.</span></h1><p>${data.intro}</p></div></section><section class="detail-main"><div class="detail-wrap form-area"><div><p class="eyebrow">Your next step</p><h2>${url ? "Register your interest" : "Registration is being prepared"}</h2><p>${url ? "Your registration will open in a secure form managed by the programme team." : "The official registration form is not yet connected. Please check back once Blue Ozone Health has opened this application."}</p>${url ? `<a class="button green" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Open registration form ↗</a>` : `<a class="button green" href="index.html#involved">Back to opportunities ↗</a>`}</div></div></section>`;
}

function renderLegalPage() {
  const root = $("#legal-root");
  if (!root) return;
  const type = new URLSearchParams(location.search).get("type");
  const titles = { privacy: "Privacy policy", terms: "Terms of use", medical: "Medical disclaimer" };
  const title = titles[type];
  if (!title) { root.innerHTML = `<section class="detail-main"><h1>Page not found</h1></section>`; return; }
  document.title = `${title} | Stay Safe Nigeria`;
  const body = type === "medical" ? "Information on this website is intended for general educational purposes and does not replace professional medical consultation, diagnosis or treatment. Reading this information does not constitute a clinical diagnosis. Seek advice from a qualified healthcare professional for personal health concerns." : "The final policy text is awaiting review and approval by Blue Ozone Health. This page must be completed before the website collects personal information or launches publicly.";
  root.innerHTML = `<section class="detail-hero"><div class="detail-wrap"><a class="back-link" href="index.html">← Home</a><p class="eyebrow light">Website information</p><h1>${title}<span class="dot yellow-dot">.</span></h1></div></section><section class="detail-main"><div class="detail-wrap legal-copy"><p>${body}</p></div></section>`;
}

renderContact();
renderCentres();
renderDetailPage();
renderFormPage();
renderLegalPage();
