# TODO — VerifiedCare IBM Z Datathon submission

## Outcome 1 — Provide a professional multi-page product surface

- [x] Replace the single-page-only experience with separate landing, campaign, reviewer, organizer, and architecture pages.
- [x] Navigation, status language, product framing, responsive layout, and safety copy remain consistent across pages.
- [x] The product name shown to users is VerifiedCare; MVP is not part of the visible brand name.
- [x] Increase typography across navigation, body copy, buttons, cards, forms, and mobile layouts.

## Outcome 2 — Demonstrate safe donation and fundraising tracking

- [x] Campaign page shows fundraising goal, amount raised, progress, supporter count, payment route, receipts, and activity history.
- [x] QR is clearly labeled as a demo intent QR and cannot be mistaken for a live payment gateway.
- [x] Simulating a donation appends a visible receipt to the ledger, updates progress, and records an activity event locally.
- [ ] A real payment provider and signed webhook must be configured before live donations are enabled.

## Outcome 3 — Demonstrate evidence intake and explainable document review

- [x] Organizer page accepts a consent scope, hospital, goal, recipient route, and document packet in local demo mode.
- [x] Reviewer page validates PDF type, PDF signature, file size, SHA-256 hash, and local-only handling.
- [x] Reviewer page displays explainable extraction/consistency signals and keeps a human approve/follow-up decision gate.
- [x] Backend provides a metadata preflight endpoint that explicitly does not claim authenticity.
- [ ] Production rollout still requires authenticated access, private storage, retention/deletion policy, and hospital-side verification.

## Outcome 4 — Run the working solution on IBM Z/LinuxONE

- [x] Architecture page maps IBM Cloud Object Storage, Cloudant, Code Engine, watsonx.ai Text Extraction, and IBM Z/LinuxONE to concrete responsibilities.
- [x] `server/server.js` provides campaign, reviewer decision, audit, preflight, health, and runtime-status endpoints.
- [x] `server/Dockerfile` and `server/README.md` provide a Node 20 LinuxONE-compatible run path.
- [x] Frontend has a browser-safe `config.js` API hook and falls back locally when no backend is configured.
- [ ] The team must run the backend in the official IBM-provided LinuxONE environment and capture `uname -m`, `/health`, and `/api/status` evidence.
- [ ] The team must configure Cloudant runtime secrets and verify that organizer/reviewer actions persist in Cloudant.

## Outcome 5 — Preserve secure IBM service boundaries

- [x] Cloudant adapter uses runtime service credentials and never exposes credentials to the browser.
- [x] Campaign and reviewer actions create append-only audit events when Cloudant is configured.
- [x] `.env.example` contains placeholders only.
- [ ] Do not commit Cloudant credentials, IBM API keys, payment secrets, real hospital bills, or patient identifiers.
- [ ] Do not claim IBM Z compliance until the actual LinuxONE runtime evidence is captured.

## Outcome 6 — Finish the official submission package

- [x] README contains GitHub upload, deployment, and backend run instructions.
- [x] `docs/hackathon-compliance.md` records the official requirements and remaining access-dependent evidence.
- [x] `docs/video-script.md` provides the screen sequence and speaking script.
- [x] `docs/website-guide.md` explains every website page, card, button, and workflow.
- [ ] The team must create a public GitHub repository and push the repository.
- [ ] The team must configure the public LinuxONE API URL in `config.js` after LinuxONE deployment.
- [ ] The team must verify the frontend reads campaign data and reviewer decisions through the IBM-backed API.
- [ ] The team must record the video, upload the pitch deck, and submit through the official Hack2skill platform.
- [ ] The team must separately confirm registration, team size, mandatory LinuxONE readiness-session attendance, abstract status, and event-window eligibility with the organizers.
