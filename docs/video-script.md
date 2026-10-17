# VerifiedCare — IBM Z Datathon video script

Target duration: 3–4 minutes.

## 0:00–0:20 — Problem

“Medical fundraising often depends on social posts and screenshots. Donors cannot easily see whether the hospital, treatment estimate, consent, or recipient route has been reviewed. VerifiedCare makes that trust path visible.”

Show the Overview page and the three principles: consent-led verification, explainable AI assistance, and traceable giving.

## 0:20–0:55 — Public campaign

Click **View a verified campaign**.

“This is the public Campaign view. The Trust Passport summarizes hospital confirmation, consent scope, reviewer status, and a verification score. The story card explains the need, the progress bar shows the fictional goal, and the evidence trail explains what is confirmed and what is pending.”

Click `₹50`, then click **Record demo gift**.

“The QR and gift action are intentionally safe in this build. This is a demo donation intent; no money moves. The visible ledger and activity timeline show how a production system would expose a receipt and status event.”

## 0:55–1:45 — Reviewer console

Click **Reviewer**.

“This is the human-in-the-loop reviewer console. AI can extract fields and surface mismatches, but the trained reviewer still owns the decision.”

Upload a synthetic sample PDF and click **Analyze file**.

“The preflight checks the PDF signature, file size, and SHA-256 hash. The production integration point is watsonx.ai Text Extraction. It would extract structured fields, but it would not certify authenticity automatically.”

Uncheck one evidence item.

“The evidence gate prevents a final decision until required checks are complete.”

Recheck the item, click **Move to decision gate**, then **Approve & publish**.

“This creates a reviewer decision and, in the IBM-backed configuration, writes a Cloudant audit event.”

## 1:45–2:20 — Organizer intake

Click **Organizer**.

“The organizer submits consent scope, hospital, fundraising target, recipient route, and the evidence packet. The browser version saves a local draft. In production, private documents would be stored in protected object storage and would never be committed to GitHub.”

Show the QR preview and guardrail copy.

## 2:20–3:15 — IBM Z/LinuxONE integration

Open **IBM architecture**.

“The backend is a Node 20 API that can run on the official IBM Z/LinuxONE environment. It exposes `/health`, `/api/status`, campaign records, reviewer decisions, and audit events. Cloudant stores campaign metadata and append-only audit records. Object Storage is the private evidence layer. Code Engine is an optional cloud front door or worker, but it is not being used as a substitute for the required LinuxONE runtime.”

Show the LinuxONE terminal evidence:

```text
$ uname -m
s390x
$ curl http://localhost:8080/health
{"ok":true,"runtime":"IBM Z/LinuxONE", ...}
```

“The reason IBM Z is appropriate is the combination of resilient enterprise execution, a controlled runtime boundary, auditable decisions, and the ability to keep sensitive verification workflows separate from the public frontend.”

## 3:15–3:40 — Closing

“VerifiedCare makes trust visible before someone gives. AI surfaces evidence signals, a human reviewer decides, Cloudant stores the audit trail, and IBM Z/LinuxONE provides the secure runtime boundary for the working solution.”

## Presenter reminders

- Say `synthetic record` whenever showing sample campaign data.
- Never upload real patient records in the video.
- Never show Cloudant passwords, API keys, access tokens, private IP addresses, or login cookies.
- Do not claim LinuxONE integration until the terminal evidence has been captured.
- Do not claim that a document is genuine because it passed a hash or AI preflight.
