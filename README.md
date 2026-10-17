# VerifiedCare — IBM Z Datathon project

VerifiedCare is a consent-led, hospital-confirmed pathway for medical fundraising. This free prototype demonstrates a donor campaign, organizer intake, reviewer evidence checks, explainable AI-assistance boundaries, a traceable simulated ledger, and an IBM technology architecture path.

## Important honesty boundary

The default build is safe demo mode. It uses synthetic records, browser local storage, a demo donation-intent QR, and local document checks. It does not process money, upload medical files, diagnose patients, or certify that a hospital bill is genuine. A real release needs authenticated backend services, private storage, a verified payment provider with signed webhooks, consent/retention policy, hospital-side verification, and IBM credentials.

## Pages

- `/` — product overview and trust model.
- `/campaign.html` — donor-facing campaign with progress, demo QR, receipt ledger, evidence trail, and activity history.
- `/reviewer.html` — reviewer queue, PDF signature/size/hash checks, explainable local preflight, checklist, and human approve/follow-up gate.
- `/organizer.html` — organizer consent and evidence intake with local draft saving and QR preview.
- `/architecture.html` — IBM Cloud Object Storage, Cloudant, Code Engine, watsonx.ai Text Extraction, and IBM Z/LinuxONE mapping.

## Run locally

The project is dependency-free except for the optional QR renderer loaded from jsDelivr. From the project folder:

```bash
python3 -m http.server 3000 --bind 0.0.0.0
```

Open `http://localhost:3000`.

## Demo flow for judges

First open the landing page and explain the three roles. Open **Campaign**, choose `₹50`, and click **Record demo gift**. The visible progress, receipt ledger, and activity timeline update in the browser. Explain that this is a simulated donation intent and not a payment.

Open **Reviewer** and upload a small sample PDF. The browser checks the PDF header, size, SHA-256 hash, and visible consistency signals. Run the preflight, uncheck one evidence item to show the gate, then complete the checklist and move the case to the human decision gate. Choose **Approve & publish** or **Reject / request evidence**. Emphasize that AI assists; the reviewer decides.

Open **Organizer**, show consent scope, hospital, goal, recipient route, and the local evidence packet. The form saves a draft in the browser. Open **IBM architecture** to explain how the production version would use IBM Cloud Object Storage, Cloudant, Code Engine, watsonx.ai Text Extraction, and IBM Z/LinuxONE or Hyper Protect.

## Free deployment on GitHub Pages

1. Create a **public** GitHub repository named `verifiedcare-datathon`.
2. Upload all files from this folder, including the `public` and `docs` folders.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/root`, then save.
6. Wait for the Pages URL, normally `https://YOUR-USERNAME.github.io/verifiedcare-datathon/`.
7. Open that URL in an incognito browser and test every page.

Command-line upload is also possible:

```bash
git init
git branch -M main
git add .
git commit -m "Build VerifiedCare IBM Datathon project"
git remote add origin https://github.com/YOUR-USERNAME/verifiedcare-datathon.git
git push -u origin main
```

Never commit real medical documents, API keys, payment secrets, `.env` files, or real patient identifiers to GitHub.

## IBM technology language for the submission

Use this accurate wording: “VerifiedCare is implemented as a free frontend prototype with a production architecture mapped to IBM services. IBM Cloud Object Storage is the private evidence layer; Cloudant stores campaign metadata and append-only audit events; Code Engine hosts the API, webhook receiver, and document-check worker; watsonx.ai Text Extraction turns PDFs into structured fields; and IBM Z/LinuxONE is the target confidential and resilient execution boundary for sensitive verification workloads. The prototype does not claim these private services are live until credentials and deployment access are configured.”

IBM’s current documentation supports PDF text and semantic key-value extraction in watsonx.ai Text Extraction, a Cloud Object Storage Free Tier of 5 GB monthly for up to 12 months, and IBM Secure Execution for Linux on LinuxONE for protecting workload integrity and confidentiality. Free-tier availability and limits can change; verify them in your IBM Cloud account before deployment.

## Video submission plan

Record a 2–3 minute screen capture. Spend 15 seconds on the problem. Spend 35 seconds on the Campaign page and Trust Passport. Spend 35 seconds on Reviewer: upload a sample PDF, run the local check, show the checklist, and approve through the human gate. Spend 20 seconds on Organizer and explain local-only document safety. Spend 20 seconds on the IBM architecture page. Close by stating that the free build never takes money or publishes a medical claim automatically, which is an intentional safety boundary.

Suggested closing line: “VerifiedCare makes trust visible before someone gives. AI surfaces evidence signals, a human reviewer decides, and IBM’s secure cloud and Z/LinuxONE path provide the production foundation for private, auditable records.”

## Hack2skill submission checklist

Use the public GitHub Pages URL in the required GitHub/project link field. Upload the pitch deck PDF under the portal’s 5 MB limit. Add the public demo video URL. Use the IBM technology wording above. Link the repository README as supporting documentation. For open-source resources, state `None` unless your team adds a licensed dependency or dataset. Submit before the deadline shown in the portal and save the confirmation screenshot.


## Production-ready IBM Z/LinuxONE package

The `server/` directory now contains a Node 20 backend that can run on the official IBM Z/LinuxONE environment. It includes a Cloudant persistence adapter, append-only audit events, reviewer decision endpoints, document metadata preflight, a health endpoint, and a LinuxONE-compatible Dockerfile. The frontend reads the browser-safe API URL from `config.js`.

This repository is technically prepared for IBM-backed deployment, but the datathon requirement is only truthfully satisfied after the team runs the backend on the IBM-provided LinuxONE environment. Capture `uname -m`, `/health`, and `/api/status` as evidence. `s390x` is the expected architecture indicator; do not replace this evidence with a screenshot of an architecture page.

Read these documents before submission:

- `docs/hackathon-compliance.md` — requirements, completed items, and remaining access-dependent evidence.
- `docs/video-script.md` — complete presentation script and screen sequence.
- `docs/website-guide.md` — explanation of every page, button, card, and workflow.
- `server/README.md` — LinuxONE runbook, Cloudant secrets, API endpoints, and Code Engine boundary.

### Backend run

```bash
cd server
cp .env.example .env
node server.js
curl http://localhost:8080/health
curl http://localhost:8080/api/status
```

Never commit `.env`, Cloudant credentials, IBM API keys, payment secrets, real hospital files, or patient identifiers.


## Start-to-finish setup guide

For a beginner-friendly sequence from downloading the ZIP through LinuxONE execution, Cloudant configuration, GitHub Pages, integration testing, video recording, and Hack2skill submission, read `docs/start-to-finish-guide.md`.


## LinuxONE AI/ML service

The `ml-service/` directory now contains synthetic-data training, an explainable scikit-learn/XGBoost-compatible scoring service, and a Jupyter notebook. Run it on LinuxONE, capture the actual architecture/model/latency output, then set `ML_SERVICE_URL=http://127.0.0.1:9000` in the backend `.env`. The Node API will include the ML result in `/api/documents/preflight` without sending raw patient documents to the model.
