# Stay Safe Nigeria website

Static, responsive campaign site. Preview with `python3 -m http.server 8765` and open `http://localhost:8765/index.html`.

## Content and integrations

Edit `config.js` to publish BOH-approved values:

- `forms.volunteer` and `forms.partner`: existing Google Form fallback URLs until the on-site registration service is enabled. `forms.sponsor` is optional.
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

## On-site registration

The Vercel Node function at `/api/registration` validates and stores volunteer and partner submissions. The layouts and server share `registration-schema.js`, based on the existing questionnaires. A successful save is the registration receipt. The corresponding mailbox receives a notification with a response reference. Personal answers are available in the staff CSV.

1. Run `database/registration.sql` in the BOH Supabase project. The table uses row level security and only the server service role has table access.
2. Add these environment variables in the Vercel project. Keep the API keys and export password in Vercel's server environment.

   | Variable | Value |
   | --- | --- |
   | `SSN_SUPABASE_URL` | Supabase project URL |
   | `SSN_SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role JWT used by the function |
   | `SSN_RESEND_API_KEY` | Resend sending key |
   | `SSN_REGISTRATION_FROM` | Email address on a verified Resend sending domain |
   | `SSN_VOLUNTEER_INBOX` | Exact BOH volunteer inbox |
   | `SSN_PARTNER_INBOX` | Exact BOH partnership inbox |
   | `SSN_EXPORT_PASSWORD` | Random password of at least 24 characters, shared only with authorised staff |
   | `SSN_REGISTRATION_ENABLED` | Set to `true` in a private preview for the acceptance check, and in production once ready |

3. In the private preview, send one synthetic response per form and verify it lands in the correct inbox and CSV. Use the BOH-approved privacy policy and confirm who can access the export before enabling production.
4. Staff download CSVs at `/api/registration?export=volunteer` and `/api/registration?export=partner` using the username `staff` and the configured password. The “Email accepted” column shows whether the email provider accepted each notification. A failed notification leaves the saved response available for follow-up.

Without the enabled API and complete configuration, Get Involved displays the existing registration links. A plain Python static preview also uses those links. Set `SSN_REGISTRATION_ENABLED=false` and redeploy to switch back to the fallback links.
