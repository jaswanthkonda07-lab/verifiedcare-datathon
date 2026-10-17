# IBM Z Datathon compliance checklist

Source checked: [official Hack2skill IBM Z Datathon 2026 page](https://hack2skill.com/event/datathon-2026).

## Official requirements found on the page

- The solution should run on IBM Z / LinuxONE.
- Registered participants receive access to IBM Z / LinuxONE infrastructure at no cost.
- The `Get Your LinuxONE System Ready` session is mandatory.
- Final submission includes a working demo or prototype, source-code repository link, short project description, and pitch deck.
- Evaluation considers innovation, technical implementation, AI for Good relevance, scalability, feasibility, presentation clarity, and why IBM Z is the right platform.
- The page states the actual solution should be built during the official October 17–18, 2026 hackathon window; a substantially completed pre-event project may not be eligible.

## What is implemented in this repository

- Professional multi-page VerifiedCare frontend.
- Larger accessible typography.
- Public campaign, reviewer, organizer, and architecture views.
- Node 20 backend API in `server/server.js`.
- Cloudant persistence adapter using runtime service credentials.
- Append-only audit-event writes for organizer and reviewer actions.
- LinuxONE-compatible container definition.
- `/health` and `/api/status` endpoints that expose runtime architecture and persistence mode without secrets.
- Frontend configuration hook for a public API running on LinuxONE.
- Local fallback mode when an IBM backend is not configured.
- PDF metadata preflight endpoint that explicitly does not claim authenticity.
- Video script and website operating guide.

## Evidence still required from the team

These cannot be truthfully completed inside a generic sandbox:

1. The team must access the official IBM-provided LinuxONE environment.
2. The team must run `uname -m` and capture the environment evidence, normally showing `s390x`.
3. The team must start this API on LinuxONE and capture `/health` and `/api/status`.
4. The team must configure Cloudant credentials as runtime secrets, not GitHub files.
5. The team must set `config.js` to the public LinuxONE API URL.
6. The team must verify the frontend calls the LinuxONE API.
7. The team must create the GitHub repository and upload the source code.
8. The team must record the required video and upload the pitch deck through Hack2skill.

## What must not be claimed

Do not say that VerifiedCare is already running on IBM Z/LinuxONE until the team has captured the LinuxONE runtime evidence. Do not claim that a PDF is genuine because of an AI score. Do not activate a real payment QR without a verified beneficiary, KYC, signed webhook, and appropriate consent and legal controls.
