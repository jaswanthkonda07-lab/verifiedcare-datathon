# VerifiedCare — Free Professional Build Plan

## Goal

Turn VerifiedCare from a single-page datathon demo into a professional, multi-page, zero-cost-to-run prototype for safer medical fundraising. The build must be honest about its boundaries: it can demonstrate donation intent, document evidence checks, local campaign persistence, and IBM-ready architecture without pretending that a static site has a payment gateway, hospital database, or private IBM credentials.

## Pages

- `/` — product landing page that explains the problem, trust model, and product modules.
- `/campaign.html` — donor-facing campaign detail with a clearly labeled demo QR, progress tracking, mock receipt ledger, evidence summary, and activity timeline.
- `/reviewer.html` — reviewer console with local file intake, PDF signature/type/size/hash checks, explainable extraction signals, evidence checklist, and human approve/follow-up actions.
- `/organizer.html` — organizer intake with consent scope, hospital, goal, recipient route, document packet, and demo QR configuration. Draft data stays in browser local storage.
- `/architecture.html` — honest IBM technology map: IBM Cloud Object Storage, Cloudant, Code Engine, watsonx.ai Text Extraction, and IBM Z/LinuxONE confidential-computing target.

## Free-mode product behavior

The donation QR is a demo intent QR and never moves money. A real QR can be activated later by entering a verified beneficiary/payment-provider URI and adding webhook verification on a backend. Uploaded documents are not sent anywhere in this free mode. The reviewer console performs browser-side safety checks: file type, PDF header, size, SHA-256 hash, and visible consistency signals. Those checks can identify suspicious mismatches but cannot prove a hospital bill is authentic; final publication remains a human decision.

The campaign ledger, progress, reviewer status, and organizer drafts use `localStorage` so the experience works on GitHub Pages or any static host. This is intentionally safe for a datathon demo and does not store real medical records.

## IBM technology path

The UI and README distinguish implemented free-mode behavior from the production path. The production architecture uses IBM Cloud Object Storage for private evidence files, Cloudant for campaign/audit metadata, Code Engine for the API and background document-verification jobs, watsonx.ai Text Extraction for OCR/key-value extraction, and IBM Z/LinuxONE or Hyper Protect for a confidential, resilient deployment boundary. The build does not claim those services are live until credentials and an IBM Cloud/Z environment are configured.

## Design

**Movement:** mission-control editorial — Swiss information design meets healthcare trust UX and IBM operational clarity.

**Principles:** evidence before persuasion; calm authority; human decisions remain visible; demo/production boundaries are unmistakable. Deep navy and teal signal institutional trust, cyan marks machine-assisted activity, coral marks follow-up, and a warm paper canvas keeps evidence readable. Pages use strong left rails, compact mono metadata, trust-status chips, and restrained transitions.

**Brand essence:** VerifiedCare makes medical fundraising easier to verify, safer to support, and more accountable to track. Personality: careful, humane, operational.

**Brand voice:** direct, respectful, and specific. Example lines: “Trust should be visible, not assumed.” and “AI can surface a signal; a human still owns the decision.”


## IBM-backed production upgrade

The project now includes a dependency-light Node 20 backend under `server/`. The backend exposes health, runtime status, campaign, reviewer-decision, audit-event, and document-preflight endpoints. Cloudant is accessed through runtime-only service credentials; when credentials are absent, the backend uses a visible memory fallback for local development and reports that mode through `/api/status`.

The frontend keeps secrets out of the browser. `config.js` contains only a public API origin. When configured, Campaign, Organizer, and Reviewer actions call the backend; when unconfigured, the safe local demo behavior remains available. `server/Dockerfile` is compatible with a LinuxONE-compatible Node container runtime and `server/README.md` documents the direct LinuxONE execution path.

The project deliberately does not claim IBM Z/LinuxONE compliance until the team runs the backend in the official IBM-provided environment, captures `uname -m`, verifies `/health` and `/api/status`, configures Cloudant secrets, and records that evidence for the presentation. This is an access-dependent submission requirement, not something a generic sandbox can truthfully complete.

The submission package includes the compliance checklist, full website operating guide, video script, and compiled PDF video script. GitHub and Hack2skill actions remain user-controlled; no repository was created and no Hack2skill form was submitted.
