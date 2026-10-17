# VerifiedCare API

This backend is intentionally dependency-light and uses Node 20 built-in HTTP and `fetch`. It can run on IBM Z/LinuxONE with a Node runtime or a compatible container runtime. Cloudant persistence activates when `CLOUDANT_URL`, `CLOUDANT_USERNAME`, and `CLOUDANT_PASSWORD` are supplied as runtime secrets.

## Endpoints

- `GET /health` — unauthenticated readiness endpoint.
- `GET /api/status` — runtime architecture and persistence mode.
- `GET /api/campaigns/:id` — campaign record.
- `POST /api/campaigns` — create a campaign and audit event.
- `POST /api/reviewer/decision` — approve, reject, or request evidence; writes an audit event.
- `POST /api/audit` — append a status event.
- `GET /api/audit` — development audit view.
- `POST /api/documents/preflight` — assistive metadata check; never claims authenticity.

## Local run

```bash
cp .env.example .env
# Keep real values only in a local ignored .env file.
set -a
source .env
set +a
node server.js
curl http://localhost:8080/health
```

## IBM Z/LinuxONE run

Use the official LinuxONE environment provided by the datathon. First prove the architecture:

```bash
uname -m
node --version
```

The architecture should identify the IBM Z/LinuxONE environment, normally `s390x`. Run the API directly or with the available container runtime:

```bash
set -a
source .env
set +a
PORT=8080 RUNTIME_NAME='IBM Z/LinuxONE' node server.js
curl http://localhost:8080/health
curl http://localhost:8080/api/status
```

If Podman or Docker is available:

```bash
podman build -t verifiedcare-api:linuxone .
podman run --rm -p 8080:8080 --env-file .env verifiedcare-api:linuxone
```

Capture a screenshot of `uname -m`, the server startup line, `/health`, and `/api/status` for the video. Do not expose passwords, API keys, private hostnames, or access tokens.

## Cloudant setup

Create two databases in the IBM Cloudant service:

```text
campaigns
audit_events
```

Create a service credential and provide its `url`, `username`, and `password` to the backend as runtime secrets. Never commit these values to GitHub. The API uses Cloudant document IDs for campaign records and immutable audit event IDs for decisions.

## Code Engine option

Code Engine can host a public API or build/test worker, but it is not a substitute for demonstrating the required IBM Z/LinuxONE runtime. For the datathon evidence, run the final backend on the official IBM Z/LinuxONE environment and explain Code Engine only as an optional cloud front door or worker.


## Internal ML scorer

Set `ML_SERVICE_URL=http://127.0.0.1:9000` after starting the LinuxONE Python scorer. The Node API calls `/score` from `/api/documents/preflight` and returns only an explainable risk result. Raw patient documents are not sent to the scorer. The ML service is documented in `../ml-service/README.md` and must be trained and run on LinuxONE before claiming AI-on-Z evidence.
