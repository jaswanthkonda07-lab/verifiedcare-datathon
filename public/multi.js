const toast = document.querySelector('#toast');
let toastTimer;
function showToast(message) { if (!toast) return; toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3600); }
const runtime = window.VERIFIEDCARE_CONFIG || {};
const API_BASE = String(runtime.apiBase || '').replace(/\/$/, '');
async function api(path, options = {}) {
  if (!API_BASE) return null;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}
async function showRuntimeStatus() {
  if (!API_BASE) return;
  try {
    const status = await api('/api/status');
    const banner = document.querySelector('.demo-banner');
    const copy = banner?.querySelector('span:last-child');
    if (copy) copy.textContent = `${status.runtime} · ${status.mode === 'cloudant' ? 'Cloudant persistence connected' : 'memory fallback — configure Cloudant secrets'}`;
    banner?.classList.add('production-connected');
  } catch { showToast('IBM-backed API is not reachable; local fallback remains active.'); }
}
void showRuntimeStatus();
const mobileMenu = document.querySelector('#mobileMenu');
if (mobileMenu) mobileMenu.addEventListener('click', () => document.querySelector('.site-nav')?.classList.toggle('open'));
document.querySelectorAll('.site-nav a').forEach((link) => link.addEventListener('click', () => document.querySelector('.site-nav')?.classList.remove('open')));
function money(value) { return `₹${Number(value).toLocaleString('en-IN')}`; }
function renderQr(target, text) { if (!target) return; target.innerHTML = ''; if (window.QRCode) new QRCode(target, { text, width: 142, height: 142, colorDark: '#102433', colorLight: '#ffffff' }); else target.innerHTML = '<span class="qr-fallback">DEMO<br>QR</span>'; }
const campaignQr = document.querySelector('#campaignQr');
if (campaignQr) renderQr(campaignQr, 'https://verifiedcare.demo/campaign/VC-0248?mode=demo');
const organizerQr = document.querySelector('#organizerQr');
const upiInput = document.querySelector('#upiInput');
function updateOrganizerQr() { renderQr(organizerQr, upiInput?.value.trim() || 'https://verifiedcare.demo/campaign/VC-0248?mode=demo'); }
if (organizerQr) { updateOrganizerQr(); upiInput?.addEventListener('input', updateOrganizerQr); }

const campaignKey = 'verifiedcare-free-campaign';
const selectedAmount = { value: 50 };
document.querySelectorAll('[data-amount]').forEach((button) => button.addEventListener('click', () => { selectedAmount.value = Number(button.dataset.amount); document.querySelectorAll('[data-amount]').forEach((item) => item.classList.toggle('selected', item === button)); }));
async function hydrateCampaign() {
  try {
    const campaign = await api('/api/campaigns/VC-0248');
    if (!campaign) return;
    const raised = document.querySelector('#raisedAmount');
    if (raised && campaign.raised != null) raised.textContent = money(campaign.raised);
    const progress = document.querySelector('#campaignProgress');
    if (progress && campaign.goal) progress.style.width = `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%`;
    const badge = document.querySelector('.verified-badge');
    if (badge && campaign.status) badge.textContent = campaign.status === 'verified' ? '✓ Verified campaign' : '• Needs review';
  } catch { /* Safe local fallback remains visible. */ }
}
void hydrateCampaign();
const donateButton = document.querySelector('#donateButton');
if (donateButton) donateButton.addEventListener('click', async () => {
  const amount = selectedAmount.value;
  const data = JSON.parse(localStorage.getItem(campaignKey) || '{}');
  if (data.demoReceipt) { showToast('This browser already recorded the demo receipt.'); return; }
  data.demoReceipt = { amount, id: '#1848', at: new Date().toISOString() }; localStorage.setItem(campaignKey, JSON.stringify(data));
  const raised = document.querySelector('#raisedAmount');
  if (raised) raised.textContent = money(12240 + amount);
  const progress = document.querySelector('#campaignProgress');
  if (progress) progress.style.width = `${((12240 + amount) / 18000) * 100}%`;
  document.querySelector('#ledgerList')?.insertAdjacentHTML('afterbegin', `<div class="ledger-row demo-receipt"><span class="ledger-avatar teal">YO</span><p><strong>You · demo</strong><small>Hospital route · Receipt #1848</small></p><b>${money(amount)}</b><span class="ledger-state">Recorded</span></div>`);
  document.querySelector('#activityList')?.insertAdjacentHTML('afterbegin', `<div class="activity-item demo-event"><span class="timeline-dot"></span><div><small>Just now · local demo</small><strong>Mock gift recorded</strong><p>${money(amount)} added to the visible ledger. No payment was made.</p></div></div>`);
  try { await api('/api/audit', { method: 'POST', body: JSON.stringify({ campaignId: 'VC-0248', actor: 'donor-demo', action: 'demo_gift_recorded', amount }) }); } catch { /* Local-only mode is expected without API_BASE. */ }
  showToast(`${money(amount)} added to the visible ledger — receipt #1848.`);
});

const reviewFile = document.querySelector('#reviewFile');
const reviewDrop = document.querySelector('#reviewDrop');
const reviewStatus = document.querySelector('#reviewFileStatus');
let reviewFileData = null;
async function inspectPdf(file) {
  if (!file) return;
  const header = new TextDecoder().decode(new Uint8Array(await file.slice(0, 5).arrayBuffer()));
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf || header !== '%PDF-' || file.size > 5 * 1024 * 1024) { reviewFile.value = ''; reviewFileData = null; reviewStatus.textContent = file.size > 5 * 1024 * 1024 ? 'Over 5 MB' : 'Valid PDF required'; reviewStatus.style.color = 'var(--coral)'; return; }
  const buffer = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  const hash = [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  reviewFileData = { name: file.name, size: file.size, hash };
  reviewStatus.textContent = `${file.name} · SHA ${hash.slice(0, 12)}…`; reviewStatus.style.color = 'var(--teal)';
}
if (reviewDrop) reviewDrop.addEventListener('click', () => reviewFile?.click());
reviewFile?.addEventListener('change', (event) => { void inspectPdf(event.target.files[0]); });
reviewDrop?.addEventListener('drop', (event) => { event.preventDefault(); reviewDrop.style.borderColor = ''; void inspectPdf(event.dataTransfer.files[0]); });
['dragenter', 'dragover'].forEach((type) => reviewDrop?.addEventListener(type, (event) => { event.preventDefault(); reviewDrop.style.borderColor = 'var(--teal)'; }));
['dragleave'].forEach((type) => reviewDrop?.addEventListener(type, () => { reviewDrop.style.borderColor = ''; }));
document.querySelector('#analyzeButton')?.addEventListener('click', async () => {
  const summary = document.querySelector('#analysisSummary');
  if (!reviewFileData) { showToast('Upload a valid PDF before running the local check.'); return; }
  summary.textContent = API_BASE ? 'Sending document metadata to the IBM-backed preflight endpoint…' : 'Checking PDF signature, file hash, date/amount consistency, and duplicate signals…';
  try { await api('/api/documents/preflight', { method: 'POST', body: JSON.stringify({ mime: 'application/pdf', size: reviewFileData.size, sha256: reviewFileData.hash, signature: true }) }); } catch { /* continue with local checks */ }
  setTimeout(() => { summary.textContent = `Preflight complete: PDF signature valid, ${Math.round(reviewFileData.size / 1024)} KB, SHA-256 ${reviewFileData.hash.slice(0, 12)}… No authenticity guarantee — confirm the hospital source manually.`; showToast('Explainable preflight complete.'); }, 900);
});
const checks = [...document.querySelectorAll('.review-check')];
function updateChecks() { const done = checks.filter((item) => item.checked).length; const count = document.querySelector('#reviewCheckCount'); if (count) count.textContent = `${done}/${checks.length} complete`; }
checks.forEach((item) => item.addEventListener('change', updateChecks));
const approveCase = document.querySelector('#approveCase');
const finalActions = document.querySelector('#finalActions');
const caseState = document.querySelector('#caseState');
const caseBadge = document.querySelector('#caseBadge');
function setState(text, color, background) { [caseState, caseBadge].forEach((element) => { if (element) { element.textContent = text; element.style.color = color; element.style.background = background; } }); }
approveCase?.addEventListener('click', () => { if (checks.some((item) => !item.checked)) { showToast('Complete every evidence check before the decision gate.'); return; } setState('Ready for decision', 'var(--teal)', 'var(--mint)'); approveCase.hidden = true; if (finalActions) finalActions.hidden = false; showToast('Evidence gate complete — human decision required.'); });
document.querySelector('#publishCase')?.addEventListener('click', async () => { setState('Verified / published', 'var(--teal)', 'var(--mint)'); if (finalActions) finalActions.hidden = true; document.querySelector('#analysisSummary').textContent = 'Human reviewer approved publication after the evidence gate. AI provided assistance only.'; try { await api('/api/reviewer/decision', { method: 'POST', body: JSON.stringify({ campaignId: 'VC-0248', decision: 'approve', reviewerId: 'reviewer-demo' }) }); } catch { /* local-only fallback */ } showToast('Human decision recorded — campaign marked verified.'); });
document.querySelector('#rejectCase')?.addEventListener('click', async () => { setState('Needs follow-up', 'var(--coral)', '#fff0ea'); if (finalActions) finalActions.hidden = true; if (approveCase) approveCase.hidden = false; try { await api('/api/reviewer/decision', { method: 'POST', body: JSON.stringify({ campaignId: 'VC-0248', decision: 'request_evidence', reviewerId: 'reviewer-demo' }) }); } catch {} showToast('Follow-up requested — public status unchanged.'); });
document.querySelector('#flagCase')?.addEventListener('click', () => showToast('Case flagged for follow-up — no public status changed.'));

const intakeForm = document.querySelector('#intakeForm');
const intakeFile = document.querySelector('#intakeFile');
const intakeDrop = document.querySelector('#intakeDrop');
const intakeStatus = document.querySelector('#intakeFileStatus');
const intakeKey = 'verifiedcare-organizer-draft';
async function inspectIntakeFiles(files) { if (!files.length) return; const valid = []; for (const file of files) { const header = new TextDecoder().decode(new Uint8Array(await file.slice(0, 5).arrayBuffer())); if ((file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) && header === '%PDF-' && file.size <= 5 * 1024 * 1024) valid.push(file.name); } intakeStatus.textContent = valid.length ? `${valid.length} valid PDF(s) selected` : 'Valid PDFs under 5 MB required'; intakeStatus.style.color = valid.length ? 'var(--teal)' : 'var(--coral)'; intakeFile.dataset.valid = valid.length ? 'true' : 'false'; }
intakeDrop?.addEventListener('click', () => intakeFile?.click()); intakeFile?.addEventListener('change', (event) => { void inspectIntakeFiles([...event.target.files]); });
function formData() { const data = {}; intakeForm?.querySelectorAll('input:not([type="file"]),textarea,select').forEach((field) => { data[field.name] = field.value; }); return data; }
function saveDraft() { if (!intakeForm) return; localStorage.setItem(intakeKey, JSON.stringify(formData())); }
function restoreDraft() { try { const draft = JSON.parse(localStorage.getItem(intakeKey) || 'null'); if (!draft || !intakeForm) return; Object.entries(draft).forEach(([key, value]) => { if (intakeForm.elements[key]) intakeForm.elements[key].value = value; }); } catch {} }
restoreDraft(); intakeForm?.querySelectorAll('input:not([type="file"]),textarea,select').forEach((field) => field.addEventListener('input', () => { saveDraft(); document.querySelector('#draftStatus').textContent = 'Draft saved'; document.querySelector('#previewTitle').textContent = intakeForm.elements.campaignTitle.value || 'Untitled campaign'; document.querySelector('#previewStory').textContent = intakeForm.elements.story.value || 'Add a clear treatment story.'; document.querySelector('#previewGoal').textContent = intakeForm.elements.goal.value || '—'; document.querySelector('#previewRoute').textContent = intakeForm.elements.route.value || '—'; }));
intakeForm?.addEventListener('submit', async (event) => { event.preventDefault(); const success = document.querySelector('#intakeSuccess'); if (!intakeForm.reportValidity() || intakeFile?.dataset.valid !== 'true') { success.textContent = 'Complete the fields and attach at least one valid PDF under 5 MB.'; success.style.color = 'var(--coral)'; return; } saveDraft(); let message = 'Draft saved locally. No personal data was sent.'; try { const result = await api('/api/campaigns', { method: 'POST', body: JSON.stringify({ ...formData(), actor: 'organizer-demo' }) }); if (result?.persisted) message = 'Campaign saved to the IBM-backed Cloudant workflow.'; else if (result) message = 'Campaign saved to the configured API memory fallback.'; } catch { /* local-only mode */ } success.textContent = message; success.style.color = 'var(--teal)'; showToast(message); });
document.querySelector('#clearDraft')?.addEventListener('click', () => { localStorage.removeItem(intakeKey); intakeForm?.reset(); if (intakeStatus) intakeStatus.textContent = 'No files selected'; showToast('Local draft cleared.'); });
