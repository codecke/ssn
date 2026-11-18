(() => {
  const schema = window.SSNRegistrationSchema;
  const endpoint = "/api/registration";
  const targets = [...document.querySelectorAll("[data-form-cta]")];
  if (!schema || !targets.length || !crypto.randomUUID) return;

  const escape = (text) => String(text).replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

  function renderField(field, type) {
    const id = `${type}-${field.name}`;
    const required = field.required ? " required" : "";
    const label = escape(field.label);
    const marker = field.required ? '<span aria-hidden="true"> *</span>' : "";
    const options = field.options || [];
    if (field.type === "multi" || field.type === "check") {
      return `<fieldset class="registration-choices" data-field="${field.name}">
        <legend>${label}${marker}</legend>
        ${options.map((option) => `<label><input type="checkbox" name="${field.name}" value="${escape(option)}"${field.type === "check" ? required : ""}> ${escape(option)}</label>`).join("")}
      </fieldset>`;
    }
    let input;
    if (field.type === "select") {
      input = `<select id="${id}" name="${field.name}"${required}><option value="">Choose an option</option>
        ${options.map((option) => `<option value="${escape(option)}">${escape(option)}</option>`).join("")}</select>`;
    } else if (field.type === "textarea") {
      input = `<textarea id="${id}" name="${field.name}" rows="3" maxlength="${schema.maxLength(field)}"${required}></textarea>`;
    } else {
      const autocomplete = { fullName: "name", email: "email", whatsapp: "tel", organisation: "organization", country: "country-name" }[field.name];
      input = `<input id="${id}" name="${field.name}" type="${field.type}" maxlength="${schema.maxLength(field)}"${autocomplete ? ` autocomplete="${autocomplete}"` : ""}${required}>`;
    }
    return `<div class="registration-field" data-field="${field.name}"><label for="${id}">${label}${marker}</label>${input}</div>`;
  }

  function mount(target) {
    const type = target.dataset.formCta;
    if (!Object.hasOwn(schema.forms, type)) return;
    const volunteer = type === "volunteer";
    const fallback = target.querySelector("a");
    target.innerHTML = `<details class="registration-panel">
      <summary>${volunteer ? "Open volunteer registration" : "Open partnership enquiry"}</summary>
      <form class="registration-form">
        <p>Fields marked * are required.</p>
        ${schema.forms[type].map(({ title, fields }) => `<fieldset class="registration-group">
          <legend>${escape(title)}</legend>
          <div class="registration-fields">${fields.map((field) => renderField(field, type)).join("")}</div>
        </fieldset>`).join("")}
        <div hidden><label>Leave this blank <input name="websiteConfirmation" tabindex="-1" autocomplete="off"></label></div>
        <p>Blue Ozone Health uses your answers to review your registration or enquiry and contact you about the programme. <a href="legal.html?type=privacy">Read the privacy policy</a>.</p>
        <button class="button green" type="submit">${volunteer ? "Submit volunteer registration" : "Submit partnership enquiry"}</button>
        <p class="registration-status" role="status" tabindex="-1"></p>
      </form>
    </details>`;
    const form = target.querySelector("form");
    const button = form.querySelector("button");
    const status = form.querySelector(".registration-status");
    const fields = schema.fields(type).map((field) => {
      const wrapper = form.querySelector(`[data-field="${field.name}"]`);
      return { field, wrapper, controls: [...wrapper.querySelectorAll("input, select, textarea")] };
    });
    let id = crypto.randomUUID();

    function collect() {
      const answers = {};
      for (const { field, wrapper, controls } of fields) {
        const visible = schema.isVisible(field, answers);
        wrapper.hidden = !visible;
        for (const control of controls) control.disabled = !visible;
        if (!visible) continue;
        if (field.type === "multi") {
          answers[field.name] = controls.filter((control) => control.checked).map((control) => control.value);
        } else {
          const first = controls[0];
          if (first.type !== "checkbox" || first.checked) answers[field.name] = first.value.trim();
        }
      }
      return answers;
    }

    function showError(message, fieldName) {
      status.textContent = message;
      status.classList.add("is-error");
      const field = fields.find(({ field }) => field.name === fieldName);
      if (field) {
        field.controls[0].setAttribute("aria-invalid", "true");
        field.controls[0].focus();
      }
    }

    form.addEventListener("change", (event) => {
      event.target.removeAttribute("aria-invalid");
      collect();
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (button.disabled) return;
      status.classList.remove("is-error");
      const answers = collect();
      const missing = fields.find(({ field, wrapper }) =>
        !wrapper.hidden && field.required && field.type === "multi" && !answers[field.name].length);
      if (missing) {
        showError(`${missing.field.label} Select at least one option.`, missing.field.name);
        return;
      }
      button.disabled = true;
      status.textContent = "Submitting…";
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, type, answers, websiteConfirmation: form.elements.websiteConfirmation.value }),
        });
        const result = await response.json();
        if (!response.ok || !result.ok) {
          showError(result.error || "We could not submit your details. Please try again.", result.field);
          if (response.status === 503 && fallback && !target.contains(fallback)) target.append(fallback);
          return;
        }
        form.reset();
        collect();
        id = crypto.randomUUID();
        status.textContent = "Thank you. We received your details.";
        status.focus();
      } catch {
        showError("We could not reach the registration service. Your answers are still here. Please try again.");
        if (fallback && !target.contains(fallback)) target.append(fallback);
      } finally {
        button.disabled = false;
      }
    });
    collect();
  }

  fetch(endpoint, { cache: "no-store" })
    .then((response) => response.ok ? response.json() : null)
    .then((data) => { if (data?.ready) targets.forEach(mount); })
    .catch(() => { /* The existing registration links are available on static hosting. */ });
})();
