# VerifiedCare: start-to-finish guide

This guide begins from zero. Follow the stages in order. Do not skip the IBM Z/LinuxONE evidence stage, because the official Hack2skill page says the working solution must run on IBM Z/LinuxONE.

## First understand the three environments

There are three different places involved:

**Your computer** is where you download the ZIP, extract it, edit `config.js`, and push code to GitHub.

**GitHub** stores the public source repository and can host the static frontend through GitHub Pages.

**IBM LinuxONE** is where the backend must run for the datathon requirement. It stores campaign and reviewer data through Cloudant when Cloudant credentials are configured.

A GitHub Pages website cannot safely contain Cloudant passwords. The browser talks to the LinuxONE backend, and only the backend talks to Cloudant.

The final architecture is:

```text
Visitor browser
    |
    | HTTPS
    v
GitHub Pages frontend
    |
    | HTTPS API calls
    v
VerifiedCare API running on IBM Z/LinuxONE
    |
    +--> IBM Cloudant: campaigns and audit_events
    +--> Private object storage: evidence files in a future production step
```

## Stage 0 — Download the updated project

Download:

- `verifiedcare-ibm-z-submission.zip`
- `VerifiedCare-IBM-Z-Datathon-Video-Script.pdf`

Extract the ZIP into a folder named `verifiedcare-datathon`.

On Windows, right-click the ZIP and choose **Extract All**. On macOS, double-click the ZIP. On Linux:

```bash
unzip verifiedcare-ibm-z-submission.zip -d verifiedcare-datathon
cd verifiedcare-datathon
```

Confirm that these paths exist:

```text
index.html
campaign.html
reviewer.html
organizer.html
architecture.html
config.js
server/server.js
server/Dockerfile
server/.env.example
README.md
docs/hackathon-compliance.md
docs/video-script.md
```

Do not rename `server/server.js`, `config.js`, or the HTML files.

## Stage 1 — Check your datathon eligibility first

Open the official [Hack2skill IBM Z Datathon 2026 page](https://hack2skill.com/event/datathon-2026).

Confirm that:

1. Every team member registered individually.
2. Your team lead registered the team.
3. Your team has the required 4–6 members.
4. Your abstract was submitted if the portal shows it as required.
5. Every participant attended the mandatory `Get Your LinuxONE System Ready` session.
6. You have access to the official LinuxONE environment.
7. You know the official final submission deadline.

The page states that the actual solution must be built during October 17–18, 2026. If your team did not register, did not attend the mandatory readiness session, or missed the abstract deadline, contact the official Hack2skill/IBM Z Datathon support channel immediately. The code cannot fix an eligibility problem.

## Stage 2 — Create the GitHub repository

Open [https://github.com/new](https://github.com/new).

Use:

```text
Repository name: verifiedcare-datathon
Visibility: Public
```

Do not create an additional README, `.gitignore`, or license because the ZIP already contains these project files.

After creating the empty repository, open a terminal inside the extracted project folder:

```bash
cd verifiedcare-datathon
git init
git branch -M main
git add .
git commit -m "Build VerifiedCare IBM Z Datathon solution"
git remote add origin https://github.com/YOUR-USERNAME/verifiedcare-datathon.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

Before pushing, check for secrets:

```bash
find . -name ".env" -o -name "*.key" -o -name "*.pem"
```

The command must not show a real credential file. `.env.example` is safe because it contains placeholders only.

## Stage 3 — Test the website locally

From the project root:

```bash
python3 -m http.server 3000 --bind 127.0.0.1
```

Open:

```text
http://localhost:3000/
http://localhost:3000/campaign.html
http://localhost:3000/reviewer.html
http://localhost:3000/organizer.html
http://localhost:3000/architecture.html
```

Click through every navigation item. Use synthetic data only. Do not upload real patient documents.

At this stage `config.js` intentionally contains:

```javascript
window.VERIFIEDCARE_CONFIG = {
  apiBase: ''
};
```

That means the frontend uses safe local fallback mode.

## Stage 4 — Obtain IBM LinuxONE access

Use your registered datathon account and the official access instructions. You need a shell or terminal inside the IBM-provided LinuxONE environment.

When connected, run:

```bash
uname -m
node --version
```

The expected architecture is usually:

```text
s390x
```

If `uname -m` returns `x86_64`, you are not currently inside the required IBM Z/LinuxONE runtime. Stop and contact the datathon support channel rather than claiming IBM Z execution.

## Stage 5 — Clone the repository on LinuxONE

On the LinuxONE terminal:

```bash
git clone https://github.com/YOUR-USERNAME/verifiedcare-datathon.git
cd verifiedcare-datathon/server
```

Check the files:

```bash
ls
```

You should see:

```text
Dockerfile
package.json
server.js
.env.example
README.md
```

## Stage 6 — Configure Cloudant

In IBM Cloud:

1. Open the Catalog.
2. Search for `IBM Cloudant`.
3. Create a free/Lite service if that option is available.
4. Name it `verifiedcare-cloudant`.
5. Create a database named `campaigns`.
6. Create a database named `audit_events`.
7. Open **Service credentials**.
8. Create a credential called `verifiedcare-backend`.
9. Keep the URL, username, and password private.

On LinuxONE, create a private environment file:

```bash
cd verifiedcare-datathon/server
cp .env.example .env
nano .env
```

Enter values similar to:

```text
PORT=8080
HOST=0.0.0.0
RUNTIME_NAME=IBM Z/LinuxONE
ALLOWED_ORIGIN=https://YOUR-USERNAME.github.io
CLOUDANT_URL=https://YOUR-CLOUDANT-URL
CLOUDANT_USERNAME=YOUR-CLOUDANT-USERNAME
CLOUDANT_PASSWORD=YOUR-CLOUDANT-PASSWORD
CLOUDANT_DATABASE=campaigns
CLOUDANT_AUDIT_DATABASE=audit_events
```

Replace the placeholders with the actual IBM Cloudant values. Do not commit `.env`.

## Stage 7 — Start the backend on LinuxONE

From `verifiedcare-datathon/server`:

```bash
node server.js
```

You should see a startup line containing `IBM Z/LinuxONE` and the architecture.

Open a second LinuxONE terminal and run:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/status
```

The `/health` response should include:

```json
{
  "ok": true,
  "service": "verifiedcare-api",
  "runtime": "IBM Z/LinuxONE",
  "arch": "s390x"
}
```

The `/api/status` response should include:

```json
{
  "mode": "cloudant",
  "services": {
    "cloudant": true,
    "audit": true
  }
}
```

If it says `memory-fallback`, Cloudant is not connected yet. Check the URL, username, password, database names, and region.

Capture screenshots of:

- `uname -m`
- Node version
- API startup line
- `/health`
- `/api/status` showing Cloudant mode

Do not show passwords or access tokens in the screenshots.

## Stage 8 — Make the LinuxONE API reachable over HTTPS

`localhost:8080` is reachable only from the LinuxONE machine. A GitHub Pages visitor cannot call it. You need the official datathon environment’s approved public HTTPS exposure method, such as its assigned ingress, reverse proxy, or documented tunnel.

Ask the official support channel:

> “What approved public HTTPS URL or ingress should we use so our GitHub Pages frontend can call the VerifiedCare API running on LinuxONE?”

Do not expose an unprotected random port to the public internet. Do not use a temporary tunnel unless the datathon rules permit it and the URL remains available during judging.

When you have the approved URL, test it:

```bash
curl https://YOUR-LINUXONE-API-URL/health
curl https://YOUR-LINUXONE-API-URL/api/status
```

The responses must show `runtime: IBM Z/LinuxONE` and `arch: s390x`.

## Stage 9 — Connect the frontend to LinuxONE

On your computer, edit the root file:

```text
config.js
```

Change it to:

```javascript
window.VERIFIEDCARE_CONFIG = {
  apiBase: 'https://YOUR-LINUXONE-API-URL'
};
```

Use only the public HTTPS API URL. Never put Cloudant credentials here.

Commit and push:

```bash
git add config.js
git commit -m "Connect frontend to IBM Z LinuxONE API"
git push origin main
```

Also update `public/config.js` to the same browser-safe API URL if you are deploying the `public` output directly.

## Stage 10 — Test the integrated website

Open the GitHub Pages website after it rebuilds.

On the top banner, the text should indicate that the IBM runtime is connected. If the banner still says free demo mode, inspect `config.js` and the browser console.

Test the Campaign page:

1. Open Campaign.
2. Confirm campaign data loads.
3. Choose a demo amount.
4. Record the demo gift.
5. Confirm an audit event is sent to the API.

Test Reviewer:

1. Open Reviewer.
2. Upload a synthetic PDF under 5 MB.
3. Click Analyze file.
4. Complete the four checks.
5. Click Move to decision gate.
6. Click Approve & publish.
7. Check the LinuxONE API audit endpoint or Cloudant `audit_events` database.

Test Organizer:

1. Open Organizer.
2. Complete the campaign fields.
3. Select a synthetic PDF.
4. Save the campaign draft.
5. Check that the API returns a campaign ID.
6. Check that Cloudant contains the campaign document.

## Stage 11 — Deploy the frontend with GitHub Pages

In GitHub:

1. Open the repository.
2. Click **Settings**.
3. Click **Pages**.
4. Select **Deploy from a branch**.
5. Select branch `main`.
6. Select folder `/root`.
7. Click **Save**.

Your URL will look like:

```text
https://YOUR-USERNAME.github.io/verifiedcare-datathon/
```

Test these pages:

```text
/
campaign.html
reviewer.html
organizer.html
architecture.html
```

Do not use the temporary Manus preview URL as the official GitHub repository URL.

## Stage 12 — Prepare the video

Use the PDF file `VerifiedCare-IBM-Z-Datathon-Video-Script.pdf`.

The video should show the website first, then the technical proof:

1. Overview page.
2. View a verified campaign.
3. Trust Passport and evidence trail.
4. Demo amount and visible ledger event.
5. Reviewer PDF preflight.
6. Human verification checklist.
7. Approve & publish.
8. Organizer intake.
9. IBM architecture page.
10. GitHub repository.
11. LinuxONE `uname -m` showing `s390x`.
12. LinuxONE `/health` response.
13. LinuxONE `/api/status` showing Cloudant mode.
14. Cloudant audit event after reviewer approval.

Say clearly:

> “VerifiedCare runs its backend verification API on IBM Z/LinuxONE. The public frontend communicates with the LinuxONE API through HTTPS. Cloudant stores campaign metadata and append-only reviewer audit events. AI assists with document fields and mismatch signals, but a human reviewer remains responsible for the final decision.”

## Stage 13 — Submit to Hack2skill

Only after the previous stages work:

1. Open the official Hack2skill submission area.
2. Enter the GitHub repository URL.
3. Enter the GitHub Pages working demo URL.
4. Add the short project description.
5. Upload the pitch deck PDF.
6. Add the video link.
7. Explain why IBM Z/LinuxONE is appropriate.
8. Confirm that the solution actually ran on LinuxONE.
9. Submit.
10. Save the confirmation screenshot.

Do not say `IBM Z integrated` if you have not captured the `s390x`, `/health`, and Cloudant evidence.

## Common problems

### The browser says the API is unreachable

The API URL may be wrong, HTTP instead of HTTPS, blocked by CORS, or accessible only from LinuxONE localhost. Check the approved public URL and `ALLOWED_ORIGIN`.

### `/api/status` says memory fallback

Cloudant environment variables are missing or incorrect. Check `.env`, database names, and service credentials. Restart the Node process after editing `.env`.

### The architecture says `x86_64`

You are not on the IBM Z/LinuxONE environment. Do not use that screenshot as proof.

### GitHub Pages shows a blank page

Confirm that GitHub Pages is using branch `main` and folder `/root`. Also confirm that `index.html`, `styles.css`, `config.js`, and `multi.js` are in the repository root.

### The website loads but the IBM status stays hidden

Check that `config.js` contains the public API URL, that the API has HTTPS, and that the API permits the GitHub Pages origin through `ALLOWED_ORIGIN`.

### You accidentally created a secret file

Delete it locally before committing, rotate the credential in IBM Cloud, and create a new service credential. Removing a secret from the newest commit is not enough if it was already pushed; rotate it immediately.

## Final truth check

You can call the project technically IBM Z/LinuxONE-backed only when all of the following are true:

- LinuxONE terminal shows `s390x`.
- The backend runs there.
- `/health` succeeds there.
- `/api/status` identifies IBM Z/LinuxONE.
- `/api/status` shows `cloudant: true`.
- The GitHub Pages frontend calls the LinuxONE HTTPS API.
- A reviewer decision creates a Cloudant audit event.
- The video shows this evidence.
