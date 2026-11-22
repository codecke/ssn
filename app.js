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
  if (whatsapp) links.push(`<a href="${esc(whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp</a>`);
  target.innerHTML = links.join("");
  const socialTarget = $("#social-links");
  const socialLinks = Object.entries(config.social || {}).map(([name, value]) => {
    const url = safeHttpUrl(value);
    return url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name.charAt(0).toUpperCase() + name.slice(1))}</a>` : "";
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
  const findButton = $("#find-button");
  [stateSelect, serviceSelect, findButton].forEach((control) => { if (control) control.disabled = !centres.length; });
  const update = () => {
    const state = stateSelect.value;
    const service = serviceSelect.value;
    const visible = centres.filter((centre) => (!state || centre.state === state) && (!service || (centre.services || []).includes(service)));
    if (!centres.length) {
      result.innerHTML = `<div class="empty-state"><span class="empty-icon" aria-hidden="true">⌖</span><h3>No participating centres listed.</h3></div>`;
      return;
    }
    if (!visible.length) {
      result.innerHTML = `<div class="empty-state"><h3>No matching centres yet.</h3><p>Try another state or service.</p></div>`;
      return;
    }
    result.innerHTML = `<p class="result-count">${visible.length} approved ${visible.length === 1 ? "centre" : "centres"}</p><div class="centre-grid">${visible.map((centre) => {
      const directions = safeHttpUrl(centre.directionsUrl);
      const phone = centre.phone ? centre.phone.replace(/[^+\d]/g, "") : "";
      return `<article class="centre-card"><span>${esc(centre.state)}${centre.city ? ` / ${esc(centre.city)}` : ""}</span><h3>${esc(centre.name)}</h3><p>${esc(centre.address || "")}</p><p class="centre-services">${(centre.services || []).map(esc).join(" · ")}</p><div>${phone ? `<a href="tel:${esc(phone)}">Call centre</a>` : ""}${directions ? `<a href="${esc(directions)}" target="_blank" rel="noopener noreferrer">Directions</a>` : ""}</div></article>`;
    }).join("")}</div>`;
  };
  $("#find-button")?.addEventListener("click", update);
  stateSelect?.addEventListener("change", update);
  serviceSelect?.addEventListener("change", update);
  update();
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
    const label = target.dataset.ctaLabel;
    target.innerHTML = url && label ? `<a class="button green" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>` : "";
  });
}

function renderDonation() {
  const target = $("#donation-options");
  if (!target) return;
  const donation = config.donation || {};
  const paystack = safeHttpUrl(donation.paystackUrl);
  const hasBank = donation.bankName && donation.accountName && donation.accountNumber;
  target.hidden = !paystack && !hasBank;
  target.innerHTML = target.hidden ? "" : `<h3>SUPPORT THE MISSION. HELP SAVE LIVES.</h3>${paystack ? `<a class="button green" href="${esc(paystack)}" target="_blank" rel="noopener noreferrer">DONATE ONLINE</a>` : ""}${hasBank ? `<div class="bank-details"><strong>DIRECT BANK TRANSFER</strong><p>${esc(donation.bankName)} · ${esc(donation.accountName)}</p><p class="account-number">${esc(donation.accountNumber)}</p></div>` : ""}`;
}

function approvedNews() {
  return (Array.isArray(config.news) ? config.news : []).filter((item) => item && /^[a-z0-9-]+$/.test(item.slug || "") && item.title && /^\d{4}-\d{2}-\d{2}$/.test(item.date || "") && item.summary && Array.isArray(item.body)).sort((a, b) => b.date.localeCompare(a.date));
}

function newsCard(item) {
  return `<article class="news-card"><time datetime="${esc(item.date)}">${esc(item.date)}</time><h3><a href="news.html?story=${encodeURIComponent(item.slug)}">${esc(item.title)}</a></h3><p>${esc(item.summary)}</p><a class="text-link" href="news.html?story=${encodeURIComponent(item.slug)}">Read update</a></article>`;
}

function renderNews() {
  const items = approvedNews();
  const latest = $("#latest-news");
  const list = $("#news-list");
  const article = $("#news-article");
  const empty = "";
  if (latest) latest.innerHTML = items.length ? `<div class="news-grid">${items.slice(0, 3).map(newsCard).join("")}</div>` : empty;
  if (list) list.innerHTML = items.length ? `<div class="news-grid">${items.map(newsCard).join("")}</div>` : empty;
  if (!article) return;
  const slug = new URLSearchParams(location.search).get("story");
  if (!slug) return;
  const story = items.find((item) => item.slug === slug);
  if (!story) { article.hidden = false; article.innerHTML = '<h2>Update not found</h2><a href="news.html">All updates</a>'; return; }
  list.hidden = true;
  article.hidden = false;
  document.title = `${story.title} | Stay Safe Nigeria`;
  article.innerHTML = `<a class="text-link" href="news.html">All updates</a><time datetime="${esc(story.date)}">${esc(story.date)}</time><h2>${esc(story.title)}</h2>${story.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("")}`;
}

function renderNewsletter() {
  document.querySelectorAll("#newsletter-box").forEach((target) => {
    const url = safeHttpUrl(config.newsletter?.signupUrl);
    target.hidden = !url;
    target.innerHTML = url ? `<h3>Get updates from Blue Ozone Health</h3><a class="button green" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Subscribe to the BOH newsletter</a>` : "";
  });
}

function revealCancerFromHash() {
  const id = location.hash.slice(1);
  const card = document.getElementById(id);
  if (card?.matches(".cancer-card")) card.open = true;
}
revealCancerFromHash();
window.addEventListener("hashchange", revealCancerFromHash);

if ($("#detail-root")) {
  const type = new URLSearchParams(location.search).get("type");
  location.replace(`index.html#${["breast", "cervical", "prostate", "liver"].includes(type) ? type : "cancers"}`);
}

function renderLegalPage() {
  const root = $("#legal-root");
  if (!root) return;
  const type = new URLSearchParams(location.search).get("type");
  const titles = { privacy: "Privacy Policy", terms: "Terms of Use", medical: "Medical Disclaimer" };
  const title = titles[type];
  if (!title) { root.innerHTML = `<section class="detail-main"><h1>Page not found</h1></section>`; return; }
  document.title = `${title} | Stay Safe Nigeria`;
  const content = {
    privacy: `<p>Last updated: 22 November 2026.</p>
      <p>Blue Ozone Health runs the Stay Safe Nigeria website and is responsible for personal information submitted through its volunteer and partnership forms. Contact us at <a href="mailto:info@blueozonehealth.org">info@blueozonehealth.org</a> about this notice or your information.</p>
      <h2>Information we collect</h2>
      <p>The forms ask for your name, contact details, location and the answers you choose to provide. Volunteer answers can include your profession or studies, skills, interests and availability. Partnership answers can include organisation details, proposed support and coverage areas. Please do not enter patient records or medical information about another person in the free-text fields.</p>
      <h2>How we use it</h2>
      <p>We use your answers to review your registration or enquiry, contact you about the programme, and plan relevant volunteer or partnership activities. The forms ask for your permission to be contacted. You can withdraw that permission by emailing us; this will not affect processing that already took place.</p>
      <h2>Who can access it</h2>
      <p>Authorised Blue Ozone Health programme staff can view responses in the registration database. We also email the complete submitted answers to designated programme inboxes so staff can review and follow up on registrations. Our hosting, database and email service providers process information needed to run the forms and deliver those messages. Information may be processed outside Nigeria by these providers, subject to their safeguards and applicable law. We do not publish form responses on the website.</p>
      <h2>How long we keep it</h2>
      <p>We keep responses while they are needed to assess registrations, manage programme activity, handle related enquiries and meet applicable record-keeping obligations. We then delete or de-identify information that is no longer needed. You can ask about the retention of your own response using the email address above.</p>
      <h2>Your choices and rights</h2>
      <p>You may ask to see or correct your information, request deletion or restriction, object to processing, or withdraw consent where consent is the basis for processing. Some requests may be limited by applicable law. Email <a href="mailto:info@blueozonehealth.org">info@blueozonehealth.org</a> and include enough detail for us to identify your response securely. You may also complain to the Nigeria Data Protection Commission.</p>
      <h2>Updates</h2>
      <p>We will update this page when our data practices change and show the new date above.</p>`,
    terms: `<p>Last updated: 22 November 2026.</p>
      <p>This website shares information about Stay Safe Nigeria, a Blue Ozone Health initiative. You may read and share its public pages for lawful, non-commercial information purposes. Do not misuse the website or submit false information through its forms.</p>
      <h2>Registration and participation</h2>
      <p>Submitting a volunteer or partnership form is an expression of interest. It does not guarantee selection, a role, a placement, funding, a partnership or access to a service. Blue Ozone Health may contact you to discuss the information you submitted. See our <a href="legal.html?type=privacy">Privacy Policy</a> for how form details are handled.</p>
      <h2>Health information</h2>
      <p>Website content is general education and is not a diagnosis or a substitute for professional medical advice. See the <a href="legal.html?type=medical">Medical Disclaimer</a>. If you have a personal health concern, speak with a qualified healthcare professional.</p>
      <h2>External websites and changes</h2>
      <p>Links to external websites are provided for convenience; those sites have their own content and policies. We may update website information and these terms. Contact <a href="mailto:info@blueozonehealth.org">info@blueozonehealth.org</a> with questions.</p>`,
    medical: `<p>Information on this website is intended for general educational purposes and does not replace professional medical consultation, diagnosis or treatment. Reading this information does not constitute a clinical diagnosis. Seek advice from a qualified healthcare professional for personal health concerns.</p>`,
  };
  root.innerHTML = `<section class="detail-hero"><div class="detail-wrap"><a class="back-link" href="index.html">Home</a><p class="eyebrow light">Website information</p><h1>${title}</h1></div></section><section class="detail-main"><div class="detail-wrap legal-copy">${content[type]}</div></section>`;
}

renderContact();
renderCentres();
renderGetInvolved();
renderDonation();
renderNews();
renderNewsletter();
renderLegalPage();

function startCountdown() {
  const target = $("#cancer-day-countdown");
  if (!target) return;

  // The programme activates on 4 February 2027 in Nigeria (WAT, UTC+1).
  const launch = Date.parse("2027-02-04T00:00:00+01:00");
  const units = ["Days", "Hours", "Minutes", "Seconds"];
  let timer;
  target.innerHTML = units.map((unit) => `<span><b>00</b><small>${unit}</small></span>`).join("");
  const digits = [...target.querySelectorAll("b")];

  function update() {
    const remaining = Math.max(0, Math.ceil((launch - Date.now()) / 1000));
    const values = [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
    digits.forEach((digit, index) => {
      const value = String(values[index]).padStart(2, "0");
      if (digit.textContent !== value) digit.textContent = value;
    });
    target.setAttribute("aria-label", values.map((value, index) => `${value} ${units[index].toLowerCase()}`).join(", ") + " until World Cancer Day");
    if (remaining === 0 && timer !== undefined) window.clearInterval(timer);
    return remaining > 0;
  }

  if (update()) timer = window.setInterval(update, 1000);
  target.hidden = false;
}
startCountdown();

function startHeroGallery() {
  const gallery = $(".hero-gallery");
  const toggle = $(".hero-motion-toggle");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  if (!gallery || !toggle) return;
  let slides = [...gallery.querySelectorAll(".hero-backdrop")];
  if (slides.length < 2) return;

  let current = 0;
  let timer;
  let visible = true;
  let paused = motion.matches;
  let busy = false;

  async function advance() {
    if (busy || slides.length < 2) return;
    busy = true;
    const index = (current + 1) % slides.length;
    const slide = slides[index];
    if (slide.dataset.slide && !slide.firstElementChild) {
      const img = new Image();
      img.alt = "";
      img.className = "gallery-image";
      img.src = slide.dataset.slide;
      try {
        await img.decode();
        slide.append(img);
      } catch {
        slide.remove();
        slides = slides.filter((candidate) => candidate !== slide);
        current = slides.findIndex((candidate) => candidate.classList.contains("is-current"));
        busy = false;
        sync();
        return;
      }
    }
    if (!paused && visible && !document.hidden) {
      slide.classList.add("is-current");
      slides[current].classList.remove("is-current");
      current = index;
    }
    busy = false;
  }

  function sync() {
    toggle.hidden = slides.length < 2;
    toggle.textContent = paused ? "Play images" : "Pause images";
    window.clearInterval(timer);
    if (!toggle.hidden && !paused && visible && !document.hidden) timer = window.setInterval(advance, 5500);
  }
  toggle.addEventListener("click", () => { paused = !paused; sync(); });
  motion.addEventListener("change", (event) => { paused = event.matches; sync(); });
  document.addEventListener("visibilitychange", sync);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(gallery);
  }
  sync();
}
startHeroGallery();

function startStatMotion() {
  const numbers = document.querySelectorAll(".impact-number");
  if (!numbers.length || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const format = new Intl.NumberFormat("en-NG");
  const observer = new IntersectionObserver((entries) => {
    for (const { isIntersecting, target } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      const start = performance.now();
      const final = Number(target.dataset.target);
      const suffix = target.dataset.suffix || "";
      const tick = (time) => {
        const progress = Math.min((time - start) / 1350, 1);
        target.textContent = format.format(Math.round(final * (1 - (1 - progress) ** 3))) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.3 });
  numbers.forEach((number) => observer.observe(number));
}
startStatMotion();

function startPageMotion() {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = document.querySelectorAll(".section-heading, .about-grid > *, .pillars article, .burden-copy, .burden-stats li, .world-cancer-countdown > div, .intro-strip > *, .cancer-card, .impact-strip > *, .centres-section .finder, .involved-card, .updates-section > *, .news-card, .newsletter-box, .involvement-detail section, .closing > *, .footer-top > div");
  if (!targets.length) return;
  targets.forEach((target, index) => {
    target.dataset.reveal = "";
    target.style.setProperty("--reveal-delay", `${index % 4 * 65}ms`);
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
