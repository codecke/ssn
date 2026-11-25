# Stay Safe Nigeria website project: dated progress report

**Report date:** 21 November 2026 (Africa/Lagos)  
**Period covered:** 10–20 November 2026  
**Prepared for:** Project owner and Blue Ozone Health stakeholders  
**Project:** Stay Safe Nigeria public website and registration setup

## Executive summary

The team has moved from PRD review and a four-day Phase 1 scope to a responsive campaign website, a GitHub repository, native volunteer and partnership registration code, and a Supabase registration table. The latest copy, photography, countdown and SEO corrections were made locally on 20 November. The public site and native forms are **not verified as updated or live** from those changes. Production release still depends on approved legal and clinical content, email setup, private end-to-end registration tests and deployment.

The full PRD remains larger than the Phase 1 build. The current site does not yet provide a populated centre directory/map, geolocation, sponsorship registration, payment flow, CMS, admin dashboard or analytics. The national 18,500-participant figure is a programme target, not a result achieved to date.

## Dated record of work

| Date | Work completed or decision made | Evidence and status |
| --- | --- | --- |
| **10 Nov** | Reviewed the supplied PRD and identified a scope mismatch between a simple four-day website and the full platform requirements. Drafted a proposed Phase 1 scope, website map, visitor journeys and clarification email to Victor and HR. The user confirmed the four-day Phase 1, with brand direction and design to be addressed before coding. | “Assess Stay Safe Nigeria PRD” chat. The full PRD's backend and content dependencies were explicitly deferred for the first build. |
| **10–11 Nov** | Inspected supplied logos and letterhead. Reviewed a brand presentation; recorded green/yellow palette and logo guidance while keeping copy aligned to the cancer programme. Created a Figma file. | Figma design was **not completed** because the connected Starter plan reached its MCP call limit. |
| **11 Nov** | Built the initial responsive Phase 1 website in `staysafe_nigeria`: landing page, cancer information, centre filtering shell, involvement and legal pages. Checked desktop/mobile layout, navigation and unavailable-form/empty-centre states. | Initial Git commit `26bd8b1`. Missing BOH forms, centres, clinical sign-off and legal text were already flagged. |
| **16 Nov** | Reviewed Prince TCL's earlier website corrections and implemented navigation, page order, cancer content on the homepage, Get Involved page, stronger calls to action, news section and BOH linking. Added and iterated the automatic World Cancer Day countdown. | Commits `8a1aba4` and `d3e8593`; the mobile hero was checked at 320 px and 390 px and motion was made responsive to reduced-motion settings. |
| **16 Nov** | Received separate live Volunteer and Partnership Google Forms URLs after earlier duplicate Google Doc links had proved to be question drafts. Added the URLs as fallback registration paths. Added images to four cancer cards and pushed the work. | Commits `eb1fc79` and `c370801`. The first card images were later superseded by photographic replacements. |
| **17 Nov** | Reviewed Prince TCL's additional feedback: native forms, better visual impact and direct programme language. Clarified requested inputs and implemented clearer Volunteer/Partner/Support cards and national messaging. | Local changes at that point; some requests still needed approved photos, final form recipients and design direction. |
| **18 Nov** | Added a Lagos aerial hero image and outreach imagery; updated the target display during development. Replaced generated cancer card images with stock photos. Built native Volunteer and Partnership forms, shared schema, Vercel API, private Supabase storage path and staff notifications, then pushed the refreshed site. | Commit `b4a2402` on GitHub `main`. Local simulated tests covered validation, duplicate handling, email routing and form layout. Backend settings were not yet live. |
| **19 Nov** | Reviewed Victor TCL's marked WhatsApp screenshots and full website brief, and Prince TCL's SEO request. Saved screenshot-linked corrections and Victor's text verbatim. Captured the requirement for Nigerian imagery, exact hero/section wording, dark forest green CTA, removal of blue arrows, multiple hero visuals and working registration before video release. | Two dated reference files saved outside the repo. Victor's voice note and call were outside the written/screenshot review. No site files were changed during the feedback extraction. |
| **20 Nov** | Implemented Victor's corrections locally except registration forms: exact hero and named headings, four Nigerian-relevant card photos, rotating hero gallery with pause, dark green CTA, removal of blue arrows, BOH social/footer updates, SEO metadata, sitemap and robots file. Fixed countdown to stop at 4 Feb 2027, 00:00 West Africa Time, and changed displayed programme target to 18,500+. Checked wording again and corrected Get Involved labels and eligibility copy. | Chrome checks passed at desktop, 375 px and 320 px. These edits remain uncommitted. The official white logo, approved newsletter link and final image permissions remain outstanding. |
| **20 Nov** | Set up the BOH Supabase organization/project and `ssn_registrations` table with Row Level Security. Saved the Supabase project URL and service role key in the Vercel **Preview** environment, with the key stored as a secret. | Prior chat records verification that anon/authenticated roles could not access registrations and the service role could. Production settings and live submissions were not completed. |
| **20 Nov** | User rejected export passwords. Removed the website's password-protected CSV endpoint and corresponding setup requirement; directed authorized staff to Supabase Table Editor. | Local simulated tests confirmed form submission could work without an export password and old `?export=` URLs returned 404. Change remains uncommitted and not deployed. |

## Blockers, actions and current disposition

| Blocker and date raised | Action taken | Disposition as of 21 Nov |
| --- | --- | --- |
| **10 Nov — four-day timeline versus full PRD** | Proposed and confirmed a narrower Phase 1 public site; detailed longer-term functions separately. | **Scope managed.** Full PRD remains a later workstream, not a completed Phase 1 feature set. |
| **10–11 Nov — incomplete brand inputs and Figma limit** | Extracted visual rules from supplied assets and brand presentation; created Figma file; proceeded with site code after user authorization. | **Partly resolved.** Figma file is not an approved finished design; final logo and design sign-off may still be needed. |
| **11–16 Nov — no real form destinations** | Distinguished question-draft Google Docs from submission forms; added the two distinct live Google Forms links. | **Fallback resolved.** Native forms still await operational activation. |
| **11 Nov onward — no verified centres** | Kept centre data empty rather than inventing listings. | **Open.** Need formally approved facilities, services, addresses and permission to publish. Map and geolocation remain unbuilt. |
| **16 Nov — mobile hero and countdown problems** | Removed mobile overflow, added seconds and motion; later pinned launch time to 4 Feb 2027 and stopped timer at zero. | **Resolved locally** and browser-checked. Latest fixed-date correction is not deployed. |
| **17–19 Nov — photography and copy did not match stakeholder direction** | Reviewed marked screenshots and saved exact source copy; replaced all four card images with Nigerian imagery, rotated multiple hero visuals and aligned named labels. | **Implemented locally.** Final asset rights, approvals and public deployment remain open. |
| **18–20 Nov — native registration needs a database and mail path** | Built forms/API, created Supabase table, checked RLS, stored database URL and secret in Vercel Preview. | **Partly resolved.** Resend, verified sender, recipient inboxes, enable flag, approved privacy text and real Preview tests remain. |
| **20 Nov — shared export password rejected** | Removed website CSV export and password; retained authenticated staff access via Supabase. | **Resolved in local code.** Must be committed and deployed; old deployed behavior should be checked after release. |
| **Throughout — payment, news, newsletter and BOH routing data absent** | Built conditional sections and kept unconfigured links inactive. | **Open.** Need verified BOH payment details, approved articles, newsletter destination and BOH-site routing/linking by its owners. |

## Current deliverables and evidence

- **Repository:** [`staysafe_nigeria`](/Users/mac/Documents/Dev/staysafe_nigeria) with local `main` at `b4a2402`; GitHub remote is `https://github.com/codecke/ssn`.
- **Built pages and functions:** responsive landing page, cancer cards, centre filter shell, Get Involved page, news shell, legal shell, on-site Volunteer/Partnership form code, Vercel API and Supabase schema.
- **Dated stakeholder source files:** Victor's full 19 November brief and the screenshot-linked WhatsApp feedback in `/Users/mac/Documents/Dev/staysafe-nigeria-feedback-2026-11-19`.
- **Programme source:** `/Users/mac/Documents/Dev/SSN National Program Overview TAC.pdf`, including the 4 February 2027 programme date and 18,500 participation target.
- **Local review:** JavaScript/diff checks and browser viewport checks were reported in the prior chat. These establish local behavior; they do not establish live production readiness.

## Open work and recommended sequence

1. **Preserve and review the 20 November local diff.** Verify Victor's exact copy against the saved brief and screenshot record; confirm the new images' rights and obtain the white logo if available.
2. **Finish legal and clinical review.** BOH should approve privacy and terms text before native forms collect personal data; its clinical team should review cancer information, statistics, sources and review dates.
3. **Complete private registration acceptance.** Configure the Resend key, verified sender and exact volunteer/partner inboxes in Vercel Preview; set `SSN_REGISTRATION_ENABLED=true` in Preview; submit one synthetic response per form; verify Supabase records and notification references. Check staff access and confirm the obsolete export URL returns 404.
4. **Prepare public release.** Complete responsive, accessibility, link, SEO and ownership checks; commit/push the approved corrections; configure production settings; deploy and verify the live domain. The user has not reported completion of those steps.
5. **Schedule full-PRD features separately.** Verified centre directory/map, geolocation, sponsorship form, payment flow, CMS/admin dashboard, analytics and dynamic reporting require their own inputs and implementation plan.

## Reporting boundaries

This report covers work evidenced by the project chats, Git history and local files through **20 November 2026**. It does not count planned programme reach, centres or screening activity as delivered outcomes. Remote dashboard configuration and the public website were not independently rechecked on 21 November, and the latest website changes remain local according to the repository status. All dates in this report use **Africa/Lagos** time.
