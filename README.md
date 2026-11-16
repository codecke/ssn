# Stay Safe Nigeria website

Static, responsive campaign site. Preview with `python3 -m http.server 8765` and open `http://localhost:8765/index.html`.

## Content and integrations

Edit `config.js` to publish BOH-approved values:

- `forms.volunteer`, `forms.partner`, `forms.sponsor`: live submission URLs. The shared Google Docs are question drafts and must not be used as submission destinations. Until live URLs are supplied, Get Involved shows a clear pending state.
- `donation.paystackUrl`: a BOH-owned Paystack payment page; `bankName`, `accountName`, and `accountNumber`: verified bank transfer details. Neither payment option is shown until configured.
- `newsletter.signupUrl`: the existing BOH newsletter subscription page. No email collection happens on this site until it is configured.
- `news`: approved items with `slug`, `title`, `date` (`YYYY-MM-DD`), `summary`, and `body` (array of paragraphs). These populate the homepage and `news.html`; each item receives a detail URL at `news.html?story=<slug>`.
- `centres`: only verified participating locations, with their actual services. The centre finder filters by state and service.
- `contact` and `social`: approved official links.

The World Cancer Day countdown recalculates days, hours, minutes, and seconds to the next February 4. The 18,000 figure is labelled as an impact target. Page motion respects the visitor's reduced-motion preference.

## BOH site connection

This workspace has Blue Ozone **Media** code, but no Blue Ozone **Health** website code. Link the BOH site to the public Stay Safe Nigeria URL from its own navigation or campaign page. A BOH `/ssn` path requires routing on BOH's hosting; it cannot be configured in this standalone static site. The Stay Safe Nigeria footer links back to `blueozonehealth.org`.

## Before public launch

1. Connect and test live volunteer and partnership forms using test submissions. Confirm where responses are stored and who receives them.
2. Verify BOH-owned donation links and bank details; complete a controlled payment-flow test before displaying them.
3. Add approved news content and newsletter signup URL.
4. Replace pending privacy and terms text with BOH-approved policies before collecting personal data.
5. Have BOH's clinical team approve cancer information, citations, statistics, and review dates.
6. Add only approved centre data and permitted photography.
7. Check desktop/mobile layout, keyboard navigation, links, and destination ownership before publishing.

No custom backend, payment processing, or email database is part of this static site. Donations, subscriptions, and registrations open their BOH-owned external destinations when configured.
