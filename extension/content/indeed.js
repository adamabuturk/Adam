// Indeed application automation

(async function indeedAutoApply() {
  const active = await AutoApply.isActive();
  if (!active) return;

  const profile = await AutoApply.getProfile();
  if (!profile) return;

  injectControlButton();
  await AutoApply.sleep(1500);
  tryFillIndeedForm(profile);

  // Re-run on navigation (Indeed is an SPA)
  const observer = new MutationObserver(() => tryFillIndeedForm(profile));
  observer.observe(document.body, { childList: true, subtree: true });
})();

function injectControlButton() {
  if (document.getElementById('aa-control-indeed')) return;
  const btn = document.createElement('button');
  btn.id = 'aa-control-indeed';
  btn.textContent = '⚡ AutoApply ON';
  btn.style.cssText = `
    position: fixed; top: 80px; right: 16px; z-index: 99999;
    background: #2557a7; color: #fff; border: none; border-radius: 24px;
    padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer;
    box-shadow: 0 4px 14px rgba(37,87,167,.4);
  `;
  let enabled = true;
  btn.addEventListener('click', () => {
    enabled = !enabled;
    btn.textContent = enabled ? '⚡ AutoApply ON' : '⏸ AutoApply OFF';
    btn.style.background = enabled ? '#2557a7' : '#6b7280';
    window._aaEnabled = enabled;
  });
  window._aaEnabled = true;
  document.body.appendChild(btn);
}

function tryFillIndeedForm(profile) {
  const form = document.querySelector('form#ia-container, form[data-testid="ia-form"], form.ia-BasePage-form');
  if (!form || form.dataset.aaProcessed || !window._aaEnabled) return;
  form.dataset.aaProcessed = '1';
  fillIndeedForm(form, profile);
}

async function fillIndeedForm(form, profile) {
  await AutoApply.sleep(500);

  const jobTitle = document.querySelector('[data-testid="jobTitle"], h1')?.textContent?.trim() || 'Unknown Role';
  const company = document.querySelector('[data-testid="inlineHeader-companyName"], [data-company-name]')?.textContent?.trim() || 'Unknown Company';
  const jobUrl = window.location.href;

  const fieldMap = [
    { labels: ['first name', 'given name'], value: profile.firstName },
    { labels: ['last name', 'surname', 'family name'], value: profile.lastName },
    { labels: ['email', 'e-mail'], value: profile.user?.email },
    { labels: ['phone', 'mobile', 'telephone'], value: profile.phone },
    { labels: ['city', 'location', 'address'], value: profile.location },
    { labels: ['linkedin'], value: profile.linkedin },
    { labels: ['years of experience', 'experience'], value: '3' },
    { labels: ['salary', 'expected compensation'], value: '80000' },
  ];

  for (const { labels, value } of fieldMap) {
    if (!value) continue;
    for (const label of labels) {
      const filled = AutoApply.fillFieldByLabel(label, value);
      if (filled) break;
    }
    await AutoApply.sleep(80);
  }

  // Handle yes/no questions — default yes for authorization questions
  const radioGroups = form.querySelectorAll('fieldset, [role=group]');
  for (const group of radioGroups) {
    const text = group.textContent.toLowerCase();
    if (text.includes('authorized') || text.includes('eligible') || text.includes('legally')) {
      const yes = Array.from(group.querySelectorAll('input[type=radio]'))
        .find((r) => r.value?.toLowerCase() === 'yes' || r.nextSibling?.textContent?.toLowerCase().includes('yes'));
      if (yes) { yes.click(); await AutoApply.sleep(100); }
    }
    if (text.includes('sponsorship') || text.includes('visa')) {
      const no = Array.from(group.querySelectorAll('input[type=radio]'))
        .find((r) => r.value?.toLowerCase() === 'no' || r.nextSibling?.textContent?.toLowerCase().includes('no'));
      if (no) { no.click(); await AutoApply.sleep(100); }
    }
  }

  // Try to submit or advance
  await AutoApply.sleep(400);
  const continueBtn = findButtonByText(form, 'Continue') || findButtonByText(form, 'Next');
  const submitBtn = findButtonByText(form, 'Submit') || findButtonByText(form, 'Apply');

  if (submitBtn) {
    submitBtn.click();
    AutoApply.showToast(`Applied to ${jobTitle} at ${company}`);
    AutoApply.logApplication({ jobTitle, company, platform: 'indeed', jobUrl, status: 'applied' });
  } else if (continueBtn) {
    continueBtn.click();
    form.dataset.aaProcessed = '';
  }
}

function findButtonByText(container, text) {
  return Array.from(container.querySelectorAll('button, [role=button]')).find(
    (b) => b.textContent.trim().toLowerCase().includes(text.toLowerCase())
  );
}
