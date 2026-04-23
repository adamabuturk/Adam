const API_BASE = 'https://api.autoapply.io';

// ── Auth helpers ──────────────────────────────────────────────────────────────

async function getToken() {
  const { authToken } = await chrome.storage.local.get('authToken');
  return authToken || null;
}

async function verifySubscription(token) {
  try {
    const res = await fetch(`${API_BASE}/api/verify-subscription`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.active === true;
  } catch {
    return false;
  }
}

async function getUserProfile(token) {
  const res = await fetch(`${API_BASE}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

async function logApplication(token, payload) {
  await fetch(`${API_BASE}/api/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

// ── Message router ────────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    const token = await getToken();

    switch (msg.type) {
      case 'GET_STATUS': {
        if (!token) return sendResponse({ authenticated: false, active: false });
        const active = await verifySubscription(token);
        sendResponse({ authenticated: true, active });
        break;
      }

      case 'GET_PROFILE': {
        if (!token) return sendResponse({ error: 'Not authenticated' });
        const profile = await getUserProfile(token);
        sendResponse({ profile });
        break;
      }

      case 'LOG_APPLICATION': {
        if (!token) return sendResponse({ ok: false });
        await logApplication(token, msg.payload);
        sendResponse({ ok: true });
        break;
      }

      case 'SIGN_OUT': {
        await chrome.storage.local.remove('authToken');
        sendResponse({ ok: true });
        break;
      }

      default:
        sendResponse({ error: 'Unknown message type' });
    }
  })();
  return true; // keep channel open for async response
});

// ── Installation ──────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.tabs.create({ url: 'https://autoapply.io/download' });
  }
});
