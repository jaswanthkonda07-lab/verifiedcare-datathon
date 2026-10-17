# VerifiedCare IBM Architecture Note

VerifiedCare uses a safe free-mode default for the datathon demo. The browser stores only synthetic/demo state locally. The production path is designed around IBM services but is not falsely presented as activated without credentials.

## Service mapping

- IBM Cloud Object Storage: private evidence packet storage, versioning, retention, and signed reviewer access.
- IBM Cloudant: campaign metadata, consent scope, reviewer status, append-only audit events, and donation webhook records.
- IBM Cloud Code Engine: API, webhook receiver, document verification worker, and scale-to-zero deployment target.
- watsonx.ai Text Extraction: OCR and semantic key-value extraction from hospital estimates and receipts. It surfaces fields; it does not certify authenticity.
- IBM Z/LinuxONE or Hyper Protect: confidential and resilient execution boundary for sensitive review workloads when an IBM Z/LinuxONE environment is available.

## Safe trust flow

1. Organizer uploads an evidence packet to private storage.
2. Backend hashes the file and creates an immutable intake event.
3. Text extraction returns structured fields and confidence values.
4. Rule checks compare hospital name, amount, dates, and campaign claims.
5. Reviewer confirms the hospital through an independently sourced channel.
6. Only the reviewer can approve public listing.
7. Payment webhook events update the ledger idempotently; the client never marks money as received on its own.

A static free deployment can demonstrate steps 3–6 with local synthetic data. It cannot safely do steps 1, 2, or 7 for real records without a backend and private credentials.
