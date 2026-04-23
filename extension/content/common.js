// Shared utilities for all content scripts

window.AutoApply = window.AutoApply || {};

/**
 * Fill a visible input/textarea/select by label text or placeholder.
 */
AutoApply.fillField = function (selector, value) {
  const el = document.querySelector(selector);
  if (!el || !value) return false;
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;
  if (nativeInputValueSetter) {
    nativeInputValueSetter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  return true;
};

AutoApply.fillFieldByLabel = function (labelText, value) {
  const labels = Array.from(document.querySelectorAll('label'));
  const label = labels.find((l) =>
    l.textContent.trim().toLowerCase().includes(labelText.toLowerCase())
  );
  if (!label) return false;
  const targetId = label.getAttribute('for');
  const input = targetId
    ? document.getElementById(targetId)
    : label.querySelector('input, textarea, select');
  if (!input || !value) return false;
  return AutoApply.fillField(`#${input.id || ''}`, value) || (() => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })();
};

AutoApply.clickButton = function (selector) {
  const btn = document.querySelector(selector);
  if (btn) { btn.click(); return true; }
  return false;
};

AutoApply.waitFor = function (selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) { observer.disconnect(); resolve(found); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => { observer.disconnect(); reject(new Error(`Timeout: ${selector}`)); }, timeout);
  });
};

AutoApply.sleep = (ms) => new Promise((r) => setTimeout(r, ms));

AutoApply.getProfile = function () {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'GET_PROFILE' }, (res) => {
      resolve(res?.profile || null);
    });
  });
};

AutoApply.isActive = function () {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (res) => {
      resolve(res?.active === true);
    });
  });
};

AutoApply.logApplication = function (payload) {
  chrome.runtime.sendMessage({ type: 'LOG_APPLICATION', payload });
};

AutoApply.showToast = function (message, type = 'success') {
  const existing = document.getElementById('autoapply-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'autoapply-toast';
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 999999;
    background: ${type === 'success' ? '#16a34a' : '#dc2626'};
    color: #fff; padding: 12px 20px; border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,.25);
    display: flex; align-items: center; gap: 8px;
  `;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
};
