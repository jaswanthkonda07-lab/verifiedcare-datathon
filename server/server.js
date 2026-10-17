const http = require('node:http');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
const MAX_BODY = 2 * 1024 * 1024;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const CLOUDANT_URL = (process.env.CLOUDANT_URL || '').replace(/\/$/, '');
const CLOUDANT_USERNAME = process.env.CLOUDANT_USERNAME || '';
const CLOUDANT_PASSWORD = process.env.CLOUDANT_PASSWORD || '';
const CAMPAIGN_DB = process.env.CLOUDANT_DATABASE || 'campaigns';
const AUDIT_DB = process.env.CLOUDANT_AUDIT_DATABASE || 'audit_events';
const RUNTIME_NAME = process.env.RUNTIME_NAME || 'IBM Z/LinuxONE target runtime';

const cloudantEnabled = Boolean(CLOUDANT_URL && CLOUDANT_USERNAME && CLOUDANT_PASSWORD);
const memory = {
  campaigns: new Map([['VC-0248', {
    _id: 'VC-0248', campaignId: 'VC-0248', title: 'Aarav’s cardiac surgery', hospital: 'Northstar Children’s Hospital',
    goal: 18000, raised: 12240, status: 'verified', consent: 'Guardian approved limited verification',
    route: 'Hospital bill direct', updatedAt: new Date().toISOString()
  }]]),
  audit: []
};

function json(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  });
  res.end(JSON.stringify(body));
}

function notFound(res) { json(res, 404, { error: 'not_found' }); }
function badRequest(res, message) { json(res, 400, { error: 'bad_request', message }); }
function serverError(res, error) { console.error(error); json(res, 500, { error: 'internal_error' }); }

async function readJson(req) {
  let size = 0;
  let data = '';
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new Error('body_too_large');
    data += chunk;
  }
  return data ? JSON.parse(data) : {};
}

async function cloudant(path, options = {}) {
  if (!cloudantEnabled) return null;
  const token = Buffer.from(`${CLOUDANT_USERNAME}:${CLOUDANT_PASSWORD}`).toString('base64');
  const response = await fetch(`${CLOUDANT_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let body = {};
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  if (!response.ok && response.status !== 404) throw new Error(`Cloudant ${response.status}: ${JSON.stringify(body)}`);
  return { status: response.status, body };
}

async function getCampaign(id) {
  if (cloudantEnabled) {
    const result = await cloudant(`/${encodeURIComponent(CAMPAIGN_DB)}/${encodeURIComponent(id)}`);
    if (result && result.status === 200) return result.body;
  }
  return memory.campaigns.get(id) || null;
}

async function saveCampaign(campaign) {
  memory.campaigns.set(campaign._id, campaign);
  if (cloudantEnabled) {
    await cloudant(`/${encodeURIComponent(CAMPAIGN_DB)}/${encodeURIComponent(campaign._id)}`, {
      method: 'PUT', body: JSON.stringify(campaign)
    });
  }
  return campaign;
}

async function saveAudit(event) {
  memory.audit.unshift(event);
  if (cloudantEnabled) {
    await cloudant(`/${encodeURIComponent(AUDIT_DB)}/${encodeURIComponent(event._id)}`, {
      method: 'PUT', body: JSON.stringify(event)
    });
  }
  return event;
}

function auditEvent(payload) {
  return {
    _id: `${Date.now()}-${crypto.randomBytes(5).toString('hex')}`,
    type: 'audit_event',
    createdAt: new Date().toISOString(),
    ...payload
  };
}

async function route(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const parts = url.pathname.split('/').filter(Boolean);

  if (req.method === 'GET' && url.pathname === '/health') {
    return json(res, 200, { ok: true, service: 'verifiedcare-api', runtime: RUNTIME_NAME, arch: process.arch, cloudant: cloudantEnabled });
  }
  if (req.method === 'GET' && url.pathname === '/api/status') {
    return json(res, 200, { ok: true, mode: cloudantEnabled ? 'cloudant' : 'memory-fallback', runtime: RUNTIME_NAME, arch: process.arch, services: { cloudant: cloudantEnabled, audit: true } });
  }
  if (req.method === 'GET' && parts[0] === 'api' && parts[1] === 'campaigns' && parts[2]) {
    const campaign = await getCampaign(parts[2]);
    return campaign ? json(res, 200, campaign) : notFound(res);
  }
  if (req.method === 'POST' && url.pathname === '/api/campaigns') {
    const body = await readJson(req);
    if (!body.title || !body.hospital || !body.consent || !body.route) return badRequest(res, 'title, hospital, consent, and route are required');
    const id = body.campaignId || `VC-${Date.now().toString().slice(-6)}`;
    const campaign = { ...body, _id: id, campaignId: id, status: 'needs_review', raised: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await saveCampaign(campaign);
    await saveAudit(auditEvent({ campaignId: id, actor: body.actor || 'organizer', action: 'campaign_created', status: campaign.status }));
    return json(res, 201, { ok: true, campaign, persisted: cloudantEnabled });
  }
  if (req.method === 'POST' && url.pathname === '/api/reviewer/decision') {
    const body = await readJson(req);
    if (!body.campaignId || !['approve', 'reject', 'request_evidence'].includes(body.decision)) return badRequest(res, 'campaignId and a valid decision are required');
    const campaign = await getCampaign(body.campaignId);
    if (!campaign) return notFound(res);
    campaign.status = body.decision === 'approve' ? 'verified' : 'needs_follow_up';
    campaign.updatedAt = new Date().toISOString();
    campaign.reviewerId = body.reviewerId || 'reviewer-demo';
    await saveCampaign(campaign);
    await saveAudit(auditEvent({ campaignId: body.campaignId, actor: campaign.reviewerId, action: `review_${body.decision}`, status: campaign.status, reason: body.reason || null }));
    return json(res, 200, { ok: true, campaign, persisted: cloudantEnabled });
  }
  if (req.method === 'POST' && url.pathname === '/api/audit') {
    const body = await readJson(req);
    if (!body.campaignId || !body.action) return badRequest(res, 'campaignId and action are required');
    const event = await saveAudit(auditEvent(body));
    return json(res, 201, { ok: true, event, persisted: cloudantEnabled });
  }
  if (req.method === 'GET' && url.pathname === '/api/audit') {
    return json(res, 200, { ok: true, events: memory.audit, persisted: cloudantEnabled });
  }
  if (req.method === 'POST' && url.pathname === '/api/documents/preflight') {
    const body = await readJson(req);
    const validPdf = body.mime === 'application/pdf' && Number(body.size) <= 5 * 1024 * 1024 && typeof body.sha256 === 'string' && body.sha256.length === 64;
    return json(res, 200, { ok: true, assistiveOnly: true, validPdf, signals: { size: Number(body.size) <= 5 * 1024 * 1024, sha256Present: typeof body.sha256 === 'string', signature: Boolean(body.signature), authenticityGuaranteed: false } });
  }
  return notFound(res);
}

const server = http.createServer((req, res) => route(req, res).catch((error) => error.message === 'body_too_large' ? badRequest(res, 'request body is too large') : serverError(res, error)));
server.listen(PORT, HOST, () => console.log(`VerifiedCare API listening on ${HOST}:${PORT} (${RUNTIME_NAME}, ${process.arch})`));
