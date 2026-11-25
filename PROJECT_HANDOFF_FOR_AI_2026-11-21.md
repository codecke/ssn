# Stay Safe Nigeria: complete project handoff for another AI

**Prepared:** 21 November 2026 (Africa/Lagos)  
**Project owner:** Blue Ozone Health (BOH)  
**Working repository:** `/Users/mac/Documents/Dev/staysafe_nigeria`  
**Git remote:** `https://github.com/codecke/ssn.git`  
**Public host named in the site:** `https://www.staysafenigeria.org`  
**Status:** Phase 1 website exists; the latest corrections are local and uncommitted; native registration is not confirmed live.

For transfer to another AI, upload `STAY_SAFE_NIGERIA_AI_CONTEXT_2026-11-21.zip` from `/Users/mac/Documents/Dev`. It contains this handoff, the dated report, a copy of the current website source and the referenced stakeholder/programme files. Inside that bundle, use `repository/` for code and `references/` for the brief, feedback and programme overview. The absolute paths below identify the original files on this computer; they are not required when using the bundle.

## Paste this into the next AI

> Continue the Stay Safe Nigeria website project from the attached repository and source documents. Read this handoff, then inspect the current files and Git status before making changes. Treat Victor's 19 November 2026 website brief and screenshot feedback as the authority for public copy and placement. Preserve the user's decision to remove password-protected CSV export. Do not describe programme targets as achieved results or claim that the native forms are live until a real Preview submission and production rollout are verified. Ask for BOH approval only where an actual missing business decision or approval is required. Keep credentials out of chat, code, and documents.

## 1. What this project is

Stay Safe Nigeria is Blue Ozone Health's national cancer awareness, prevention, screening, early-detection and referral initiative under the End Cancer Nigeria 2050 Agenda. The public theme is **SENSITIZE. SCREEN. PROTECT.** The programme is designed around **World Cancer Day, 4 February 2027**, across Nigeria's **36 states and Federal Capital Territory**. Breast, cervical, prostate and liver cancer are the four initial focus areas. The National Program Overview sets a **target** of 37 implementation centres, 500 participants per centre, and 18,500 participants in total; these are plans, not current achievements. The proposed National Technical Advisory Council is for clinical and scientific oversight. The website must use approved medical content and distinguish projected scope from actual activity.

The original PRD described a much larger platform: immersive landing page, centre directory and map with geolocation, three registration routes, donations, news and reports, CMS/admin tools, analytics, SEO and accessibility. On **10 November 2026**, the user confirmed a **four-day Phase 1** because the original expectation was a simple website. That phase focused on a responsive public site and participation paths, with advanced backend functions deferred. Subsequent feedback led to native volunteer and partnership forms being built locally, though service configuration and launch remain outstanding.

## 2. Source priority and evidence

1. **Latest direct user decisions in the project chats** take precedence. On 20 November the user explicitly rejected export passwords, and the password-protected website CSV export was removed locally.
2. **Victor's 19 November brief and marked WhatsApp feedback** govern requested wording, placement, imagery and release priority. Read `/Users/mac/Documents/Dev/staysafe-nigeria-feedback-2026-11-19/victor-website-brief-verbatim.txt` and `/Users/mac/Documents/Dev/staysafe-nigeria-feedback-2026-11-19/whatsapp-feedback.txt` before changing copy. The first file preserves the full brief; the second maps screenshots to exact replacements and records the limits of the review.
3. **National programme facts** are in `/Users/mac/Documents/Dev/SSN National Program Overview TAC.pdf`. Its 18,500 target supersedes the earlier 18,000 figure used during development.
4. **Current implementation** is the working repository, especially `README.md`, `config.js`, `index.html`, `forms.html`, `app.js`, `registration-schema.js`, `registration.js`, `api/registration.js` and `database/registration.sql`.
5. **Git history and project chats** establish what was committed, tested and left local. The connected Codex chats were titled “Assess Stay Safe Nigeria PRD” (10–11 November) and “Check WhatsApp access” (16–20 November). A chat title is not a specification; use the actual messages and files.

The brand presentation reviewed on 11 November gave forest green `#00552B`, campaign green `#008C4A`, bright green `#00A85A`, signal yellow `#FFD52A` and warm white `#F7F8F3`. It contained general public-safety slogans inconsistent with the cancer PRD, so the cancer programme copy was used. A [Figma file](https://www.figma.com/design/SIAMEyGYK0vuRXEdy9xLWN) was created, but the editable design was **not completed** because the connected Starter plan reached its MCP call limit. Do not present that Figma file as an approved finished design.

## 3. Current code and content

The site is a mostly static HTML/CSS/JavaScript website with a Vercel Node function for registration. It is not a Next.js app, has no package manifest, and has no CMS or application dashboard.

| File or folder | Purpose and current state |
| --- | --- |
| `index.html` | Main campaign story: animated hero, countdown, programme explanation, four pillars, cancer burden estimates, four expandable cancer cards, national target, centre finder section, involvement cards, news and footer. |
| `styles.css` | Responsive styling, dark forest green identity, page motion and mobile layout. |
| `app.js` | Menu, contact/social links, centre filtering, donation/news/newsletter conditional rendering, legal page copy, countdown, hero gallery and motion. |
| `config.js` | BOH-owned destinations and publishable data. Google Forms fallback URLs are present; donation, newsletter, news and centres are largely empty. |
| `forms.html` | Get Involved page with Volunteer, Partner and Sponsor/Support sections; native form panels mount here when API is ready. |
| `registration-schema.js` | Shared field definitions for volunteer and partner forms, including conditional leadership and State Coordinator interest. |
| `registration.js` | Browser form rendering, validation, submission to `/api/registration`, and fallback to Google Forms when API is not ready. |
| `api/registration.js` | Vercel function: readiness check, server-side validation, Supabase insert, Resend staff notification and duplicate handling. The old `?export=` route now returns 404 in the local version. |
| `database/registration.sql` | Creates `public.ssn_registrations`, enables Row Level Security and grants access to the server role. |
| `news.html` | News listing and detail URL based on manually approved items in `config.js`; no CMS. |
| `legal.html` | Medical disclaimer plus privacy and terms placeholders. Approved privacy/terms text is still needed. |
| `cancer.html` | Legacy redirect/navigation into cancer content on the homepage. |
| `robots.txt`, `sitemap.xml` | Local, untracked SEO files for `www.staysafenigeria.org`. |
| `assets/` | Optimised logo and photography files, including new Nigerian outreach/screening images that remain untracked. Check rights and approval for every image before public release. |

The main navigation currently uses About, Find a Centre, Get Involved and News & Updates. The centre interface is a section on the homepage with state and service filters, **not** the dedicated map and geolocation page described in the full PRD. Because `config.centres` is empty, it shows no participating centres. The four cancer cards link to that section, so ensure visitors are not led to believe an approved screening network exists.

`config.js` currently contains:

- Volunteer and partnership **Google Forms fallback URLs**; these remain available if the native API is not ready.
- No sponsor form URL, Paystack URL, bank details, newsletter signup URL, approved news items or verified centre records.
- `info@blueozonehealth.org` as contact email, a Blue Ozone Health LinkedIn URL, and otherwise mostly empty contact/social fields.

The headline estimates shown in the local homepage are 152,261 new cancer cases, 90,795 deaths and 292,934 five-year prevalence, described in Victor's brief as IARC GLOBOCAN 2024 estimates. The site also shows four cancer-specific estimates from that brief. Have BOH's clinical team verify the source, wording, year and review date before publication.

## 4. Exact feedback and design decisions

Victor's **19 November 2026** screenshot corrections must be applied to their specific slots:

| Placement | Required wording or action |
| --- | --- |
| Programme overview heading | `Why Stay Safe Nigeria` |
| Homepage volunteer card heading | `Volunteer with us` |
| Yellow strip beneath countdown | `Explore the Initiative` |
| Footer attribution | `Initiative by Blue Ozone Health` |
| Hero heading and subcopy | Use the exact block below. |

```text
WELCOME TO

STAY SAFE NIGERIA!

SENSITIZE. SCREEN. PROTECT.

A nationwide movement advancing cancer awareness, prevention, early detection and access to care across Nigeria.

4 Cancers. 36 States. FCT. One Mission.
```

Other recorded instructions: use the four pillar labels **SENSITIZE, SCREEN, PROTECT, CONNECT** and the brief's related copy; remove blue emoji-style arrows throughout; use real imagery with Nigerian representation on all four cancer cards; rotate multiple Nigerian city/outreach/healthcare images in the hero; make the closing CTA dark forest green; add BOH social destinations only when verified; use the official white logo without a white box if Michael supplies it; keep unconfigured actions unclickable and avoid public “coming soon” copy. Newsletter is lower priority. Victor wanted the website ready before a promotional video release because registration needs to start. That release is separate from the **4 February 2027 programme date**.

Prince's earlier feedback led to a sticky menu, cancer information folded into the homepage, a dedicated Get Involved page, clearer Volunteer/Partner/Support paths, and News & Updates naming. On 17 November he asked for forms on the website instead of redirects to Google Forms, stronger programme messaging and better visual treatment. On 19 November he also asked for SEO improvements for Stay Safe Nigeria; separate BOH and Blue Ozone Media sites were outside this repository's scope.

The local **20 November** pass implemented most of Victor's requested copy, Nigerian imagery, multiple hero photos with a pause control, dark green CTA, removal of blue arrows, and SEO metadata. A second pass aligned Get Involved labels and eligibility lists with the brief. The official white logo had **not** been supplied; the footer uses a text treatment in the meantime. Do not silently rewrite Victor's approved wording during visual edits.

## 5. Registration architecture and deployment state

The native registration route covers **volunteer** and **institutional partnership** only. Browser and server share the questionnaire schema. A submitted response gets a UUID, is validated server-side, saved to Supabase, then a Resend notification containing the reference is sent to the corresponding BOH inbox. Personal answers are not included in the notification email. A failed email does not discard a saved response; `notified` records whether notification was accepted. Authorized staff should use their Supabase accounts and Table Editor to view responses. The user's 20 November decision removed the website's shared-password CSV download.

Required Vercel server environment variables are `SSN_SUPABASE_URL`, `SSN_SUPABASE_SERVICE_ROLE_KEY`, `SSN_RESEND_API_KEY`, `SSN_REGISTRATION_FROM`, `SSN_VOLUNTEER_INBOX`, `SSN_PARTNER_INBOX` and `SSN_REGISTRATION_ENABLED`. The service role key must remain server-side; never place it in `config.js` or a handoff. The API reports readiness only when enabled and all required settings are present. Otherwise the public interface uses the existing Google Forms links. Turning it off again requires `SSN_REGISTRATION_ENABLED=false` and redeployment.

On **20 November**, the prior chat recorded that a BOH Supabase organization and Stay Safe Nigeria project were created; `public.ssn_registrations` was created; Row Level Security was checked; anonymous and authenticated users could not access applications through the API; and the service role could read, insert and update. The project dashboard URL recorded in that chat is `https://supabase.com/dashboard/project/iytqmbwlnsoaygckyxwy/editor`. The chat also recorded `SSN_SUPABASE_URL` and `SSN_SUPABASE_SERVICE_ROLE_KEY` saved as **Vercel Preview-only** variables, with the key secret. These are historical observations; verify current dashboard state before rollout. Resend, verified sender, exact recipient inboxes, the enable flag, private Preview submission tests, approved privacy wording and production settings were **not reported complete**.

Local simulated tests on 18 and 20 November covered native form validation, duplicate handling, separate email routing, and the removal of CSV export. Browser checks on 20 November covered desktop plus 375 px and 320 px, countdown behavior, hero pause control and fallback registration links. No real end-to-end Supabase/Resend submission or production registration was reported.

## 6. Git and change state at handoff

Local `main` points to `b4a2402a388eece255376c4f5281d66ae3d4c4ce` and its cached `origin/main` tracking ref points to the same commit. The remote was last explicitly pushed on **18 November 2026**. The substantial **20 November** feedback pass and export-removal change are **uncommitted and not reported deployed**. Do not reset or overwrite them.

| Date (Africa/Lagos) | Commit | Recorded outcome |
| --- | --- | --- |
| 11 Nov | `26bd8b1` | Initial Phase 1 website and branding. |
| 16 Nov | `8a1aba4` | Campaign page, navigation and content updates. |
| 16 Nov | `eb1fc79` | Volunteer and partnership Google Form links. |
| 16 Nov | `d3e8593` | Mobile hero fix, seconds and reduced-motion-friendly motion. |
| 16 Nov | `c370801` | Initial cancer-card imagery, later replaced. |
| 18 Nov | `b4a2402` | Refreshed landing page, photographic cards and native form code; pushed to GitHub. |

Before any new edit, run `git status --short --branch`, inspect the diff and preserve all existing user work. Current modified files: `README.md`, `api/registration.js`, `app.js`, `cancer.html`, `config.js`, `forms.html`, `index.html`, `legal.html`, `news.html`, `registration.js`, `styles.css`. Current untracked files: six new outreach/hero WebP assets, `robots.txt`, and `sitemap.xml`. This handoff file is also untracked until committed.

## 7. Blockers and resolution status

| Blocker | What happened | Status / next dependency |
| --- | --- |
| Four-day brief versus full PRD | PRD included a map, admin, CMS, payments and other backend features beyond a simple landing site. | **Managed by scope decision, 10 Nov:** Phase 1 public site was confirmed; full-platform acceptance criteria remain future work. |
| Brand and Figma | Only logos were first supplied; Figma Starter MCP call limit stopped editable design work. | **Partially managed:** palette and logo rules were extracted and website was built; Figma design is unfinished. |
| Forms first supplied as duplicate Google Doc links | The links were question drafts, not distinct live submission forms. | **Resolved for fallback, 16 Nov:** separate live Google Forms links were supplied and committed. Native forms are coded but not activated. |
| Missing approved centres | No formally onboarded facility list or verified service data was provided. | **Open:** `config.centres` remains empty; no map/geolocation or real directory can be claimed. |
| Photo suitability | Early generated/stock cancer photos did not meet Victor's Nigerian representation request. | **Local correction, 20 Nov:** replaced four cards and expanded the hero gallery. Image rights and final approval still need checking. |
| Countdown first changed to the next February 4 | This could roll past the intended launch instead of stopping. | **Resolved locally, 20 Nov:** fixed target is 4 Feb 2027, 00:00 West Africa Time, clamped at zero. |
| Shared export password | User did not want tables to have export passwords. | **Resolved locally, 20 Nov:** removed password requirement and CSV route; staff access is through Supabase accounts. Not yet deployed. |
| Native registration operations | Supabase table and Preview database variables were set, but mail and policy details remain. | **Open:** configure Resend and inboxes, approve privacy policy, set enable flag, test private Preview, then production. |
| Donation/newsletter/news/SEO | BOH-controlled destinations, payment details and approved updates were absent. | **Open:** actions stay hidden or inactive; SEO files are local and need publishing plus Search Console submission. |
| BOH `/ssn` routing | Workspace contains Blue Ozone Media, not the Blue Ozone Health website infrastructure. | **Open outside this repo:** BOH's host/team must configure its own route or link to the separate SSN domain. |

## 8. What the next AI should do

1. **Inventory and protect the current state.** Read the two feedback files, the programme PDF and the current repo diff. Keep the 20 November local work intact.
2. **Finish the local feedback pass.** Compare on-screen copy and placements against Victor's verbatim brief and screenshot notes. Review the six new photos' provenance and approval. Check the official white logo availability. Commit the approved local changes only after review.
3. **Complete registration prerequisites in private Preview.** Confirm Supabase table and RLS, configure Resend's verified sender and the exact volunteer/partner mailboxes, publish approved privacy text, then enable the API in Preview. Submit one synthetic volunteer and one synthetic partner response. Verify storage, form type, reference and notification delivery. Confirm the old export URL returns 404.
4. **Make a production release decision from evidence.** Review mobile, desktop, keyboard and reduced-motion behavior, links, image permissions, medical content and legal wording. Set production variables and deploy only when the owner authorizes a public release and the checks pass. Confirm the public URL after deployment.
5. **Plan later scope separately.** Full centre directory/map and geolocation, sponsorship form, verified Paystack/bank flow, CMS/admin, analytics, dynamic impact reporting, cookie policy and remaining PRD acceptance criteria are not implemented.

## 9. Guardrails for continued work

- Never substitute an unverified centre, payment account, social URL, health claim, achievement or partner logo merely to fill a gap.
- Keep **18,500+** labeled as a national target. Do not convert it into people already reached. The 37 proposed implementation centres are not 37 approved live listings.
- Do not collect personal data through native registration until the privacy policy, recipients, staff access and Preview flow are verified.
- Preserve exact user-approved copy where placement was specified. Do not treat example text elsewhere in the PRD as an exact replacement for every slot.
- Do not assume the local repository reflects the live deployment. The public URL could not be independently confirmed during this handoff.
- Do not add back shared export passwords or the old CSV route without a new user instruction.

## 10. Source and access manifest

- Repository: `/Users/mac/Documents/Dev/staysafe_nigeria` — source, README, assets and Git history.
- Victor's full 19 Nov brief: `/Users/mac/Documents/Dev/staysafe-nigeria-feedback-2026-11-19/victor-website-brief-verbatim.txt`.
- Screenshot-linked feedback: `/Users/mac/Documents/Dev/staysafe-nigeria-feedback-2026-11-19/whatsapp-feedback.txt`.
- National programme overview: `/Users/mac/Documents/Dev/SSN National Program Overview TAC.pdf`.
- GitHub remote: `https://github.com/codecke/ssn`.
- Figma file created but unfinished: `https://www.figma.com/design/SIAMEyGYK0vuRXEdy9xLWN`.
- Supabase project recorded in prior chat: `https://supabase.com/dashboard/project/iytqmbwlnsoaygckyxwy/editor`.
- Vercel project recorded in prior chat: `https://vercel.com/codeckes-projects/staysafenigeria/settings/environment-variables`.

**Evidence limit:** The dated actions above come from Git history, current local files and the connected project's prior chat records. Remote service settings and live deployment were not rechecked for this handoff. Victor's 19 November voice note and call were not transcribed in the saved feedback record.
