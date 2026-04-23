// LinkedIn Easy Apply automation

(async function linkedInAutoApply() {
  const active = await AutoApply.isActive();
  if (!active) return;

  const profile = await AutoApply.getProfile();
  if (!profile) return;

  // Inject floating control button
  injectControlButton();

  // Watch for Easy Apply modal
  observeEasyApply(profile);
})();

function injectControlButton() {
  if (document.getElementById('aa-control')) return;
  const btn = document.createElement('button');
  btn.id = 'aa-control';
  btn.textContent = '⚡ AutoApply ON';
  btn.style.cssText = `
    position: fixed; top: 80px; right: 16px; z-index: 99999;
    background: #2563eb; color: #fff; border: none; border-radius: 24px;
    padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer;
    box-shadow: 0 4px 14px rgba(37,99,235,.4);
  `;
  let enabled = true;
  btn.addEventListener('click', () => {
    enabled = !enabled;
    btn.textContent = enabled ? '⚡ AutoApply ON' : '⏸ AutoApply OFF';
    btn.style.background = enabled ? '#2563eb' : '#6b7280';
    window._aaEnabled = enabled;
  });
  window._aaEnabled = true;
  document.body.appendChild(btn);
}

function observeEasyApply(profile) {
  const observer = new MutationObserver(() => {
    const modal = document.querySelector('[data-test-modal]') ||
      document.querySelector('.jobs-easy-apply-modal');
    if (modal && !modal.dataset.aaProcessed && window._aaEnabled) {
      modal.dataset.aaProcessed = '1';
      handleEasyApplyModal(modal, profile);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

async function handleEasyApplyModal(modal, profile) {
  await AutoApply.sleep(800);

  // Grab job context from page
  const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title')?.textContent?.trim()
    || document.querySelector('h1.t-24')?.textContent?.trim() || 'Unknown Role';
  const company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.textContent?.trim()
    || document.querySelector('.jobs-unified-top-card__company-name')?.textContent?.trim() || 'Unknown Company';
  const jobUrl = window.location.href;

  let step = 0;
  const maxSteps = 10;

  while (step < maxSteps) {
    await AutoApply.sleep(600);
    await fillCurrentStep(modal, profile);

    // Check for submit button
    const submitBtn = modal.querySelector('[aria-label="Submit application"]') ||
      findButtonByText(modal, 'Submit application');
    if (submitBtn) {
      submitBtn.click();
      AutoApply.showToast(`Applied to ${jobTitle} at ${company}`);
      AutoApply.logApplication({ jobTitle, company, platform: 'linkedin', jobUrl, status: 'applied' });
      return;
    }

    // Next button
    const nextBtn = modal.querySelector('[aria-label="Continue to next step"]') ||
      findButtonByText(modal, 'Next') ||
      findButtonByText(modal, 'Review');
    if (nextBtn) {
      nextBtn.click();
      step++;
    } else {
      break;
    }
  }
}

async function fillCurrentStep(modal, profile) {
  const inputs = modal.querySelectorAll('input, textarea, select');

  for (const input of inputs) {
    if (input.dataset.aaFilled) continue;

    const label = getLabel(input);
    const value = resolveValue(label, profile);

    if (value !== null) {
      if (input.tagName === 'SELECT') {
        fillSelect(input, value);
      } else {
        AutoApply.fillField(`#${input.id}`, value) || fillDirect(input, value);
      }
      input.dataset.aaFilled = '1';
    }
    await AutoApply.sleep(80);
  }

  // Handle radio buttons (e.g. "Are you legally authorized?")
  const radioGroups = modal.querySelectorAll('fieldset');
  for (const fieldset of radioGroups) {
    if (fieldset.dataset.aaFilled) continue;
    const legend = fieldset.querySelector('legend')?.textContent?.toLowerCase() || '';
    const yesRadio = fieldset.querySelector('[value="Yes"], [value="yes"]') ||
      Array.from(fieldset.querySelectorAll('input[type=radio]')).find(
        (r) => r.value.toLowerCase() === 'yes' || r.labels?.[0]?.textContent?.toLowerCase().includes('yes')
      );
    if (yesRadio && (legend.includes('authorized') || legend.includes('sponsor') || legend.includes('legally'))) {
      yesRadio.click();
      fieldset.dataset.aaFilled = '1';
    }
  }
}

function getLabel(input) {
  const id = input.id;
  if (id) {
    const lbl = document.querySelector(`label[for="${id}"]`);
    if (lbl) return lbl.textContent.trim().toLowerCase();
  }
  const closest = input.closest('div[class*="field"], div[class*="form-group"]');
  return closest?.querySelector('label')?.textContent?.trim()?.toLowerCase() || input.placeholder?.toLowerCase() || '';
}

function resolveValue(label, profile) {
  if (!label) return null;
  if (label.includes('first name') || label.includes('first')) return profile.firstName;
  if (label.includes('last name') || label.includes('last')) return profile.lastName;
  if (label.includes('email')) return profile.user?.email;
  if (label.includes('phone') || label.includes('mobile')) return profile.phone;
  if (label.includes('city') || label.includes('location')) return profile.location;
  if (label.includes('linkedin') && label.includes('url')) return profile.linkedin;
  if (label.includes('website') || label.includes('portfolio')) return profile.linkedin;
  if (label.includes('years of experience') || label.includes('experience')) return '3';
  if (label.includes('salary') || label.includes('expected')) return '80000';
  if (label.includes('notice') || label.includes('start date')) return '2 weeks';
  return null;
}

function fillSelect(select, value) {
  const options = Array.from(select.options);
  const match = options.find((o) => o.text.toLowerCase().includes(value.toLowerCase()));
  if (match) {
    select.value = match.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function fillDirect(input, value) {
  input.focus();
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.blur();
}

function findButtonByText(container, text) {
  return Array.from(container.querySelectorAll('button')).find(
    (b) => b.textContent.trim().toLowerCase().includes(text.toLowerCase())
  );
}
