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

The World Cancer Day countdown shows days, hours, minutes, and seconds to 4 February 2027 at 00:00 West Africa Time, then stops at zero. The 18,500+ figure is a programme target. Page motion respects the visitor's reduced-motion preference, and the homepage photo sequence has a pause button.

The public canonical host is `https://www.staysafenigeria.org`. Keep SEO metadata, `robots.txt` and `sitemap.xml` in sync if the primary domain changes. After publishing, submit the sitemap in the site’s verified Google Search Console property.

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

The Vercel Node function at `/api/registration` validates and stores volunteer and partner submissions. The layouts and server share `registration-schema.js`, based on the existing questionnaires. A successful save is the registration receipt. Designated programme inboxes receive the full submitted answers and a response reference. Additional recipients are BCC'd. Authorised staff can also view the answers in Supabase.

1. Run `database/registration.sql` in the BOH Supabase project. The table uses row level security and only the server service role has table access.
2. Add these environment variables in the Vercel project. Keep the API keys in Vercel's server environment.

   | Variable | Value |
   | --- | --- |
   | `SSN_SUPABASE_URL` | Supabase project URL |
   | `SSN_SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role JWT used by the function |
   | `SSN_RESEND_API_KEY` | Resend sending key |
   | `SSN_REGISTRATION_FROM` | Email address on a verified Resend sending domain |
   | `SSN_VOLUNTEER_INBOX` | Comma-separated addresses for volunteer notifications |
   | `SSN_PARTNER_INBOX` | Comma-separated addresses for partnership notifications |
   | `SSN_REGISTRATION_ENABLED` | Set to `true` in a private preview for the acceptance check, and in production once ready |

3. In the private preview, send one synthetic response per form. Verify each is saved in `public.ssn_registrations` and that its reference reaches the correct inbox. Publish the BOH-approved privacy policy and confirm staff access before enabling production.
4. Staff with authorised Supabase project access can open **Table Editor → public → ssn_registrations** and filter by `form_type` or the reference (`id`). The `notified` column shows whether the email provider accepted the notification; it is not proof that every recipient opened the message. A failed notification leaves the saved response available for follow-up.

### Preview connection check (21 November 2026)

The protected Vercel Preview deployment has registration enabled. Resend verified `blueozonehealth.org`, and Preview sends from `info@blueozonehealth.org` to that same inbox for both form types. The sending-only Resend key is restricted to that domain and stored as a Preview secret. Synthetic volunteer (`d3b23659-15ba-42cc-83bc-54a81505ffd6`) and partner (`0d9a3061-1d66-402a-96ba-8f61e1193e54`) submissions each returned HTTP 201. Both rows appear in Supabase with `notified = true`, and Resend marked both notifications **Delivered**. The retired `?export=` endpoint returned HTTP 404.

This check did not itself authorize a production rollout. The two Supabase records above contain synthetic test data.

### Production launch (22 November 2026)

The owner approved the new Privacy Policy and Terms of Use text and activation of the native forms. Vercel Production now has the seven registration settings, including the server-only Supabase and domain-scoped Resend secrets. The public deployment at `https://www.staysafenigeria.org/forms.html` reports `{"ready":true}` from `/api/registration` and displays native volunteer and partner forms. Synthetic Production volunteer (`b9dc5997-eb9e-4429-8f58-8d535b26ab72`) and partner (`9c7d3030-ba16-4171-8f1e-1b1f9a6ed2b1`) submissions returned HTTP 201; both appear in Supabase with `notified = true`, and Resend marked both messages to `info@blueozonehealth.org` **Delivered**. These are synthetic test records. The old `?export=` route still returns HTTP 404.

Without the enabled API and complete configuration, Get Involved displays the existing registration links. A plain Python static preview also uses those links. Set `SSN_REGISTRATION_ENABLED=false` and redeploy to switch back to the fallback links.
