# VerifiedCare Website Guide

## Purpose of the website

VerifiedCare is a trust and review workflow for medical fundraising. It is designed to make the evidence behind a campaign easier to understand before someone contributes.

The website has four roles:

1. **Visitor or donor** — views the public campaign and understands the verification status.
2. **Reviewer** — checks submitted evidence and makes the final human decision.
3. **Organizer** — submits campaign information, consent, hospital details, and evidence.
4. **Technical judge** — views the IBM architecture and understands how the prototype can run on IBM Z/LinuxONE.

The current version is a safe prototype. It uses synthetic records and browser-local demo behavior. It does not accept real money, diagnose patients, or prove that a medical document is genuine.

## Global website elements

### Free demo mode banner

The dark strip at the top identifies the safety mode of the prototype. It tells the visitor that the records are synthetic, no live payment is being processed, and local browser storage is being used.

This banner is important because it prevents a visitor from thinking the demo is a real medical fundraising or payment platform.

### VerifiedCare logo

The logo identifies the product. The small descriptor, `TRUST-LED GIVING`, summarizes the product philosophy: make evidence and decisions visible rather than asking donors to trust an unverified post.

### Navigation

The navigation appears on every page:

- **Overview** opens the landing page.
- **Campaign** opens the public Aarav campaign demonstration.
- **Reviewer** opens the human-in-the-loop reviewer console.
- **Organizer** opens the campaign intake workflow.
- **IBM architecture** explains the IBM Cloud and IBM Z/LinuxONE production path.
- **Open console** opens the reviewer area.
- **Explore campaign** opens the public campaign.
- **Start a campaign** opens the organizer intake page.

On mobile, the navigation collapses behind the menu icon.

## Overview page

### Hero heading: “Trust should be visible, not assumed.”

This is the main product statement. It explains that VerifiedCare is not merely a donation page. It creates a visible path from consent to evidence review to traceable giving.

### “View a verified campaign”

This button opens the Campaign page. Use it when demonstrating the product from the donor’s perspective.

The visitor can see:

- Who presented the campaign.
- Whether consent was recorded.
- The hospital confirmation status.
- The amount raised.
- The fundraising goal.
- The approved recipient route.
- The evidence summary.
- The activity history.

### “See the technology path”

This link opens the IBM architecture page. Use it during the technical part of the datathon presentation to explain how the prototype can be extended to IBM Cloud services and IBM Z/LinuxONE.

### Trust Passport visual

The circular Trust Passport represents the campaign’s evidence summary. The surrounding labels represent three important trust signals:

- **Hospital confirmed** — an authorized reviewer has recorded a hospital-related confirmation.
- **Consent recorded** — the organizer has provided a defined consent scope.
- **Human decision** — the final status is owned by a reviewer, not automatically by AI.

### Three principles

The three short labels below the hero are the product’s core principles:

1. **Consent-led verification** — information should be collected with a defined purpose and permission.
2. **Explainable AI assistance** — AI may extract fields and surface inconsistencies, but it should show why a signal appeared.
3. **Traceable giving** — the visitor should understand the intended recipient route and see status events.

### Metrics strip

The dark metrics strip communicates the product’s safety posture:

- **3-layer trust model** — consent, evidence, and human review.
- **100% human final decision** — the reviewer remains accountable.
- **0 real patient files in demo** — the prototype uses synthetic records.
- **Auditable status history** — important actions appear as timeline events.

### Product modules

The overview page presents three product views:

- **Public campaign** — what a donor sees.
- **Reviewer console** — how evidence is reviewed.
- **Organizer intake** — how a campaign is prepared.

Use these cards to explain that VerifiedCare is a workflow, not only a landing page.

## Campaign page

### Breadcrumb and synthetic record label

The breadcrumb shows that this is a public campaign record. The synthetic record label makes clear that Aarav’s campaign is fictional and exists only for demonstration.

### Verified campaign badge

The green badge indicates that the demonstration campaign has passed the prototype’s sample verification state. It is not a medical or legal guarantee.

### Campaign title and description

The campaign title presents a clear need. The description explains that the campaign is hospital-confirmed in the demonstration and includes a visible evidence trail.

### Organizer consent row

The row beginning with `Presented by Aarav’s guardian` shows who presented the campaign and what consent was recorded. In a production system, this would be backed by an authenticated consent record rather than static text.

### Trust Passport score card

The dark card shows an example score of `82 / 100 verified`. It also shows:

- Hospital confirmation
- Hospital name
- Reviewer identity label
- Progress toward the evidence score

This score is a prototype communication device. It is not a medical, fraud, or credit score.

### Story card

The Story card explains the campaign in plain language. It provides enough context for a donor to understand:

- The treatment need.
- The hospital estimate.
- The consent status.
- The intended payment route.

### Fundraising progress

The progress block shows:

- Current amount raised.
- Fundraising goal.
- Percentage funded.
- Supporter count.
- Remaining days.

The values are fictional demonstration values.

### “Choose a demo amount”

The amount buttons allow the visitor to select a simulated contribution such as `₹50`, `₹250`, or `₹500`.

### Demo QR code

The QR code is intentionally a demo donation-intent preview. It is not connected to a bank account and does not move money.

In a real deployment, the QR code would only be activated after:

- A verified beneficiary account exists.
- Payment-provider KYC is complete.
- A signed webhook is implemented.
- The payment recipient and hospital route are confirmed.
- The legal and consent requirements are reviewed.

### “Record demo gift”

This button writes a simulated donation event into the browser’s local storage. It updates the displayed progress and ledger for the current browser only.

It is useful in the datathon demo because it shows how a receipt event could appear without processing real money.

### Evidence summary

The evidence area shows example evidence categories such as:

- Hospital estimate.
- Guardian consent.
- Recipient route.
- Reviewer confirmation.

Each item has a status such as confirmed or pending. This explains how a public campaign could communicate evidence without exposing private documents.

### Donation ledger

The ledger shows simulated contribution events with:

- A transaction marker.
- A masked or synthetic contributor label.
- Amount.
- Event time.
- Intended route.

A production system should use a real backend, signed payment events, and privacy controls.

### Activity timeline

The timeline shows campaign events such as:

- Consent recorded.
- Hospital estimate added.
- Reviewer evidence checked.
- Campaign published.
- Demo gift recorded.

This is the audit-history concept that would later be stored in Cloudant or another protected backend.

## Reviewer page

### Human-in-the-loop heading

The reviewer page explains that AI can help surface fields or inconsistencies, but a trained reviewer owns the final status.

### Reviewer metrics

The four dashboard metrics are demonstration values:

- **Queue** — cases waiting for review.
- **Average review time** — target operational response time.
- **Extraction accuracy** — a synthetic benchmark for extracted fields.
- **Duplicate flags** — possible similarity matches requiring human inspection.

These values are not calculated from real cases in the current prototype.

### Review queue

The queue shows example campaigns with status dots:

- Amber indicates needs review.
- Coral indicates a mismatch or issue.
- Blue indicates a new intake.
- Teal indicates ready for a decision.

Selecting a queue item loads its evidence review panel.

### AI preflight panel

The AI preflight panel has an `Analyze file` action. In the current browser demo, it does not call an AI provider. It demonstrates where a future extraction service would report:

- Extracted hospital.
- Estimate amount.
- Recipient route.
- Possible duplicate or mismatch signals.

A production system could use watsonx.ai Text Extraction for document fields, but the result would still require human review.

### Hospital estimate PDF upload

The reviewer can select a local PDF file. The browser checks:

- Whether the file appears to be a PDF.
- Whether it is within the size limit.
- The file signature.
- A SHA-256 hash.
- Basic visible consistency signals.

The current browser demo does not upload the document to a server.

### Extracted fields

The four field cards show how structured information could be displayed after document extraction:

- Hospital.
- Estimate amount.
- Recipient route.
- Potential duplicate.

The green confidence text indicates that the value is an assistive signal, not a final decision.

### Evidence checklist

The checklist prevents a reviewer from making a final decision before required evidence items are marked complete.

The checklist demonstrates a safety gate. A production system should store checklist changes with reviewer identity and timestamps.

### “Approve & publish”

This is the human decision button. It changes the prototype state to an approved demonstration state.

In a production system, it should:

1. Require authenticated reviewer access.
2. Store the reviewer decision.
3. Write an audit event.
4. Publish only the minimum public campaign fields.
5. Keep private evidence in protected storage.

### “Reject / request evidence”

This button demonstrates the alternative human decision. It would return the case to the organizer with a reason and evidence request.

## Organizer page

### Organizer steps

The left panel shows four preparation steps:

1. **Consent** — define who gave permission and what can be reviewed.
2. **Campaign** — describe the need, hospital, target, and beneficiary route.
3. **Evidence** — add the documents required for review.
4. **Publish** — wait for the human reviewer decision.

### Safety box

The safety box reminds organizers not to upload real medical files to the public GitHub repository or to the free demo.

### Organizer form

The form collects:

- Campaign title.
- Hospital name.
- Fundraising goal.
- Recipient route.
- Story or problem description.
- Consent scope.
- Evidence packet.

### Local draft saving

The organizer form saves a local draft in the browser. This demonstrates the user experience without sending sensitive information to an unsecured backend.

### Evidence packet upload

The upload area allows local sample documents for the demonstration. A real system would store documents in private object storage and apply access control, retention, deletion, and encryption policies.

### QR preview

The organizer preview shows what the campaign’s donation intent could look like after a verified recipient route is configured.

### Create campaign

The create action displays a local success state. It does not create a real public medical fundraising campaign in the current static build.

## IBM architecture page

### IBM Cloud Object Storage

Intended role:

- Store private hospital estimates.
- Store consent evidence.
- Store evidence packets.
- Keep public campaign data separate from private documents.

### IBM Cloudant

Intended role:

- Store campaign metadata.
- Store consent status.
- Store reviewer decisions.
- Store append-only audit events.

### IBM Code Engine

Intended role:

- Host the backend API.
- Receive verified payment webhooks.
- Run document-processing workers.
- Expose health checks and public API endpoints.

### watsonx.ai Text Extraction

Intended role:

- Extract text from PDF documents.
- Extract structured key-value fields.
- Surface document fields for reviewer inspection.

It should not automatically declare a document genuine or fake.

### IBM Z/LinuxONE

Datathon relevance:

- Run the verification API or worker on IBM Z/LinuxONE.
- Provide an enterprise-grade execution environment.
- Support sensitive and auditable workloads.
- Demonstrate why IBM Z is appropriate for the project.

For the official IBM Z Datathon, the working solution should actually run on the IBM-provided IBM Z/LinuxONE environment. An architecture diagram alone is not enough.

## Recommended demonstration sequence

1. Open Overview and explain the problem.
2. Click `View a verified campaign`.
3. Explain the Trust Passport and campaign evidence.
4. Select `₹50` and click `Record demo gift`.
5. Open Reviewer.
6. Upload a sample PDF.
7. Run the local preflight check.
8. Mark the evidence checklist complete.
9. Demonstrate the human approval or request-evidence decision.
10. Open Organizer and show consent, campaign details, and local draft behavior.
11. Open IBM architecture and explain the IBM Z/LinuxONE integration path.
12. If you have access to the official LinuxONE environment, show the backend running there and explain that evidence clearly in the video.

## What the current site does not do

The current site does not:

- Process real donations.
- Connect to a bank account.
- Verify a hospital directly.
- Prove that an uploaded bill is authentic.
- Diagnose a patient.
- Store real medical documents securely.
- Run its backend on IBM Z/LinuxONE.
- Submit anything to Hack2skill automatically.

Those capabilities require authenticated services, secure backend deployment, legal and consent controls, and the official IBM Z/LinuxONE environment.
