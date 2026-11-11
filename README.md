# Stay Safe Nigeria — Phase 1 website

Static, responsive website using the supplied campaign logo and the brand presentation's colour system. No build step is required.

## Preview

Run `python3 -m http.server 8080` in this directory, then open `http://localhost:8080`.

## Before public launch

1. Add BOH-owned volunteer, partner and sponsor form URLs to `config.js`. The registration pages deliberately show an unavailable state until these are supplied.
2. Add official contact and social links to `config.js`.
3. Add only formally approved participating centres to `config.js`, with verified services and directions links. An empty network message appears by default.
4. Replace the pending privacy and terms text with BOH-approved policies.
5. Have BOH's clinical team review all cancer information and supply approved citations, statistics and review dates before publication.
6. Obtain permission for any partner logos or photography added later.

There is no custom backend, admin dashboard, geolocation, payment gateway or automated centre approval in this Phase 1 site. Form submissions are handled by the hosted forms linked in `config.js`.
