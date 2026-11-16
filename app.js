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

function renderCancerCards() {
  const grid = $("#cancer-grid");
  if (!grid) return;
  grid.innerHTML = Object.entries(cancerContent).map(([key, data]) => `<details class="cancer-card" id="${key}"><summary><span class="card-number">${esc(data.eyebrow)}</span><span class="card-symbol" aria-hidden="true">✳</span><h3>${esc(data.name)}</h3><span class="card-bottom">Read key facts <span aria-hidden="true">+</span></span></summary><ul>${data.points.map((point) => `<li>${esc(point)}</li>`).join("")}</ul></details>`).join("");
  const selected = location.hash.slice(1);
  if (cancerContent[selected]) document.getElementById(selected).open = true;
}

function renderGetInvolved() {
  if ($("#form-root")) {
    const legacyType = new URLSearchParams(location.search).get("type");
    const anchor = { volunteer: "volunteer", partner: "partner", sponsor: "support" }[legacyType];
    if (anchor && !location.hash) location.replace(`forms.html#${anchor}`);
  }
  document.querySelectorAll("[data-form-cta]").forEach((target) => {
    const type = target.dataset.formCta;
    const url = safeHttpUrl(config.forms?.[type]);
    target.innerHTML = url ? `<a class="button green" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${type === "sponsor" ? "Explore support" : "Register interest"} ↗</a>` : `<p class="pending-action">${type === "sponsor" ? "Support details" : "Registration"} will be available here once confirmed by the programme team.</p>`;
  });
}

function renderDonation() {
  const target = $("#donation-options");
  if (!target) return;
  const donation = config.donation || {};
  const paystack = safeHttpUrl(donation.paystackUrl);
  const hasBank = donation.bankName && donation.accountName && donation.accountNumber;
  target.innerHTML = `${paystack ? `<a class="button green" href="${esc(paystack)}" target="_blank" rel="noopener noreferrer">Donate securely ↗</a>` : ""}${hasBank ? `<div class="bank-details"><strong>Bank transfer</strong><p>${esc(donation.bankName)} · ${esc(donation.accountName)}</p><p class="account-number">${esc(donation.accountNumber)}</p></div>` : ""}${!paystack && !hasBank ? '<p class="pending-action">Donation options will appear here once BOH confirms the payment details.</p>' : ""}`;
}

function approvedNews() {
  return (Array.isArray(config.news) ? config.news : []).filter((item) => item && /^[a-z0-9-]+$/.test(item.slug || "") && item.title && /^\d{4}-\d{2}-\d{2}$/.test(item.date || "") && item.summary && Array.isArray(item.body)).sort((a, b) => b.date.localeCompare(a.date));
}

function newsCard(item) {
  return `<article class="news-card"><time datetime="${esc(item.date)}">${esc(item.date)}</time><h3><a href="news.html?story=${encodeURIComponent(item.slug)}">${esc(item.title)}</a></h3><p>${esc(item.summary)}</p><a class="text-link" href="news.html?story=${encodeURIComponent(item.slug)}">Read update ↗</a></article>`;
}

function renderNews() {
  const items = approvedNews();
  const latest = $("#latest-news");
  const list = $("#news-list");
  const article = $("#news-article");
  const empty = '<p class="news-empty">Approved programme news will appear here soon.</p>';
  if (latest) latest.innerHTML = items.length ? `<div class="news-grid">${items.slice(0, 3).map(newsCard).join("")}</div>` : empty;
  if (list) list.innerHTML = items.length ? `<div class="news-grid">${items.map(newsCard).join("")}</div>` : empty;
  if (!article) return;
  const slug = new URLSearchParams(location.search).get("story");
  if (!slug) return;
  const story = items.find((item) => item.slug === slug);
  if (!story) { article.hidden = false; article.innerHTML = '<h2>Update not found</h2><a href="news.html">All updates ↗</a>'; return; }
  list.hidden = true;
  article.hidden = false;
  document.title = `${story.title} | Stay Safe Nigeria`;
  article.innerHTML = `<a class="text-link" href="news.html">← All updates</a><time datetime="${esc(story.date)}">${esc(story.date)}</time><h2>${esc(story.title)}</h2>${story.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}`;
}

function renderNewsletter() {
  document.querySelectorAll("#newsletter-box").forEach((target) => {
    const url = safeHttpUrl(config.newsletter?.signupUrl);
    target.innerHTML = `<h3>Get updates from Blue Ozone Health</h3><p>Follow the initiative's news and community activities.</p>${url ? `<a class="button green" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Subscribe to the BOH newsletter ↗</a>` : '<p class="pending-action">Newsletter signup will be available when BOH confirms its subscription link.</p>'}`;
  });
}

if ($("#detail-root")) {
  const type = new URLSearchParams(location.search).get("type");
  location.replace(`index.html#${cancerContent[type] ? type : "cancers"}`);
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
renderCancerCards();
renderGetInvolved();
renderDonation();
renderNews();
renderNewsletter();
renderLegalPage();

function updateCancerDay() {
  const target = $("#cancer-day-countdown");
  if (!target) return;
  const now = new Date();
  let year = now.getFullYear();
  let day = new Date(year, 1, 4);
  if (now >= day) day = new Date(++year, 1, 4);
  let remaining = Math.max(0, Math.floor((day - now) / 1000));
  const days = Math.floor(remaining / 86400);
  remaining %= 86400;
  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  target.innerHTML = [[days, "Days"], [hours, "Hours"], [minutes, "Minutes"], [seconds, "Seconds"]].map(([value, label]) => `<span><b>${String(value).padStart(2, "0")}</b><small>${label}</small></span>`).join("");
  target.setAttribute("aria-label", `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds until World Cancer Day`);
}
updateCancerDay();
if ($("#cancer-day-countdown")) setInterval(updateCancerDay, 1000);

const impact = $(".impact-number");
if (impact && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    const start = performance.now();
    const target = Number(impact.dataset.target);
    const tick = (time) => {
      const progress = Math.min((time - start) / 1500, 1);
      impact.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.3 });
  observer.observe(impact);
}

function startPageMotion() {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = document.querySelectorAll(".section-heading, .about-grid, .pillars article, .cancer-card, .impact-strip > *, .centres-section .finder, .involved-card, .updates-section > *, .news-card, .newsletter-box, .involvement-detail section, .closing > *, .footer-top > div");
  if (!targets.length) return;
  targets.forEach((target, index) => {
    target.dataset.reveal = "";
    target.style.setProperty("--reveal-delay", `${index % 4 * 75}ms`);
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });
  targets.forEach((target) => observer.observe(target));
  document.documentElement.classList.add("motion-ready");
}
startPageMotion();
