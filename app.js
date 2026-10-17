const toast = document.querySelector('#toast');
let toastTimer;
const demoKey = 'verifiedcare-intake-draft';

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
}
function scrollToId(id) { document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

document.querySelector('#dismissBanner').addEventListener('click', () => document.querySelector('.demo-banner').remove());
document.querySelector('#exploreCampaign').addEventListener('click', () => scrollToId('#campaign'));
document.querySelector('#seeWorkflow').addEventListener('click', () => switchView('reviewer'));
document.querySelector('#openReviewer').addEventListener('click', () => switchView('reviewer'));
document.querySelector('#openIntake').addEventListener('click', () => switchView('intake'));
document.querySelector('#mobileMenu').addEventListener('click', () => document.querySelector('.site-nav').classList.toggle('open'));
document.querySelectorAll('.site-nav a').forEach((link) => link.addEventListener('click', () => document.querySelector('.site-nav').classList.remove('open')));
document.querySelectorAll('.view-tab').forEach((tab) => tab.addEventListener('click', () => switchView(tab.dataset.view)));

function switchView(name) {
  document.querySelectorAll('.view-tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === name));
  document.querySelectorAll('.app-view').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === name));
  scrollToId('#campaign');
}

document.querySelector('#copyId').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('VC-0248'); } catch {}
  showToast('Campaign ID VC-0248 copied.');
});

document.querySelector('#simulateDonation').addEventListener('click', () => {
  if (document.querySelector('[data-demo-receipt]')) {
    showToast('Receipt #1848 is already visible in the mock ledger.');
    return;
  }
  document.querySelector('#raisedAmount').textContent = '₹12,290';
  document.querySelector('#campaignProgress').style.width = '68.2%';
  document.querySelector('#ledgerList').insertAdjacentHTML('afterbegin', '<div class="ledger-row" data-demo-receipt><span class="ledger-avatar teal">YO</span><p><strong>You · demo</strong><small>Hospital route · Receipt #1848</small></p><b>₹50</b><span class="ledger-state">Recorded</span></div>');
  document.querySelector('#timelineList').insertAdjacentHTML('afterbegin', '<div class="timeline-item current" data-demo-event><span class="timeline-dot"></span><div><small>Just now · local demo</small><strong>Mock gift recorded</strong><p>₹50 added to the visible ledger with receipt #1848. No payment was made.</p></div></div>');
  showToast('₹50 added to the visible mock ledger — receipt #1848.');
});

document.querySelector('#downloadReport').addEventListener('click', () => {
  const donationLine = document.querySelector('[data-demo-receipt]') ? 'Demo ledger: ₹50 · Receipt #1848 · Hospital route' : 'Demo ledger: No local gift simulated';
  const report = `VERIFIEDCARE TRUST REPORT\nCampaign: Aarav’s cardiac surgery\nCampaign ID: VC-0248\nStatus: Verified campaign\nVerification level: 82/100\nHospital: Northstar Children’s Hospital\nConsent: Guardian approved limited verification\nPayment route: Hospital bill direct, where supported\n${donationLine}\nAI role: Field extraction and explainable mismatch triage only\nHuman role: Final verification decision\nSafety: Synthetic demo record. No real donations or patient files.`;
  const blob = new Blob([report], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'verifiedcare-trust-report-vc-0248.txt';
  link.click();
  URL.revokeObjectURL(link.href);
  showToast('Trust report downloaded for review.');
});
document.querySelector('#viewAllLedger').addEventListener('click', () => showToast('The ledger now includes every simulated receipt in this browser session.'));

const reviewChecks = [...document.querySelectorAll('.review-check')];
const reviewCount = document.querySelector('#reviewCheckCount');
function updateReviewCount() {
  const done = reviewChecks.filter((check) => check.checked).length;
  reviewCount.textContent = `${done}/${reviewChecks.length} complete`;
  reviewCount.style.color = done === reviewChecks.length ? 'var(--teal)' : 'var(--coral)';
}
reviewChecks.forEach((check) => check.addEventListener('change', updateReviewCount));

document.querySelector('#runReview').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.innerHTML = 'Scanning synthetic estimate… <span>◌</span>';
  document.querySelector('#aiSummary').textContent = 'AI is extracting fields and comparing them with public directory signals…';
  setTimeout(() => {
    button.disabled = false;
    button.innerHTML = 'Run AI preflight <span>✦</span>';
    document.querySelector('#aiSummary').textContent = 'Fields extracted. No high-risk mismatch found. Human confirmation is required before publishing.';
    showToast('AI preflight complete — reviewer decision still required.');
  }, 1100);
});

const caseState = document.querySelector('#caseState');
const approveCase = document.querySelector('#approveCase');
const finalActions = document.querySelector('#finalActions');
document.querySelector('#approveCase').addEventListener('click', () => {
  if (!reviewChecks.every((check) => check.checked)) {
    showToast('Complete every evidence check before the human decision gate.');
    return;
  }
  caseState.textContent = 'Ready for decision';
  caseState.style.color = 'var(--teal)';
  caseState.style.background = 'var(--mint)';
  approveCase.hidden = true;
  finalActions.hidden = false;
  showToast('Evidence gate complete — the human reviewer can now decide.');
});
document.querySelector('#publishCase').addEventListener('click', () => {
  caseState.textContent = 'Verified / published';
  caseState.style.color = 'var(--teal)';
  caseState.style.background = 'var(--mint)';
  finalActions.hidden = true;
  document.querySelector('#aiSummary').textContent = 'Human reviewer approved publication after the evidence gate. AI provided assistance only.';
  showToast('Human decision recorded — campaign marked verified.');
});
document.querySelector('#rejectCase').addEventListener('click', () => {
  caseState.textContent = 'Needs follow-up';
  caseState.style.color = 'var(--coral)';
  caseState.style.background = '#fff0ea';
  finalActions.hidden = true;
  approveCase.hidden = false;
  showToast('Follow-up requested — no public status changed.');
});
document.querySelector('#flagCase').addEventListener('click', () => showToast('Case flagged for follow-up — no public status changed.'));

const intakeForm = document.querySelector('#intakeForm');
const intakeDrop = document.querySelector('#intakeDrop');
const intakeFile = document.querySelector('#intakeFile');
const intakeFileStatus = document.querySelector('#intakeFileStatus');
let invalidIntakeFile = false;
async function handleIntakeFile(file) {
  if (!file) return;
  invalidIntakeFile = false;
  const header = new TextDecoder().decode(new Uint8Array(await file.slice(0, 5).arrayBuffer()));
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf || header !== '%PDF-' || file.size > 5 * 1024 * 1024) {
    intakeFile.value = '';
    intakeFileStatus.textContent = file.size > 5 * 1024 * 1024 ? 'File is over 5 MB' : 'Valid PDF required';
    intakeFileStatus.style.color = 'var(--coral)';
    invalidIntakeFile = true;
    return;
  }
  intakeFileStatus.textContent = `${file.name} attached`;
  intakeFileStatus.style.color = 'var(--teal)';
}
intakeDrop.addEventListener('click', () => intakeFile.click());
intakeFile.addEventListener('change', (event) => { void handleIntakeFile(event.target.files[0]); });
['dragenter', 'dragover'].forEach((name) => intakeDrop.addEventListener(name, (event) => { event.preventDefault(); intakeDrop.style.borderColor = 'var(--teal)'; }));
['dragleave', 'drop'].forEach((name) => intakeDrop.addEventListener(name, (event) => { event.preventDefault(); intakeDrop.style.borderColor = ''; }));
intakeDrop.addEventListener('drop', (event) => { void handleIntakeFile(event.dataTransfer.files[0]); });

function saveIntakeDraft() {
  const draft = {};
  intakeForm.querySelectorAll('input:not([type="file"]), textarea, select').forEach((field) => { draft[field.name] = field.value; });
  localStorage.setItem(demoKey, JSON.stringify(draft));
}
function restoreIntakeDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(demoKey) || 'null');
    if (!draft) return;
    Object.entries(draft).forEach(([name, value]) => { if (intakeForm.elements[name]) intakeForm.elements[name].value = value; });
  } catch { localStorage.removeItem(demoKey); }
}
restoreIntakeDraft();
intakeForm.querySelectorAll('input:not([type="file"]), textarea, select').forEach((field) => field.addEventListener('input', saveIntakeDraft));
intakeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const success = document.querySelector('#intakeSuccess');
  const missingFile = !intakeFile.files.length;
  if (missingFile || invalidIntakeFile || !intakeForm.reportValidity()) {
    success.textContent = 'Complete the required fields and attach a valid PDF under 5 MB.';
    success.style.color = 'var(--coral)';
    return;
  }
  saveIntakeDraft();
  success.textContent = 'Synthetic campaign saved locally. Ready for reviewer intake.';
  success.style.color = 'var(--teal)';
  showToast('Draft saved — no personal data was sent.');
});

const countdownTarget = new Date('2026-10-18T22:00:00+05:30');
function countdown() {
  const remaining = Math.max(0, countdownTarget.getTime() - Date.now());
  if (!remaining) return;
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  document.querySelector('.demo-banner strong').textContent = `Prototype mode · ${hours}h ${minutes}m to datathon deadline`;
}
countdown();
