const WEB_BASE = 'https://autoapply.io';

const $ = (id) => document.getElementById(id);

async function init() {
  show('loading');

  const { authToken, userProfile, appStats } = await chrome.storage.local.get([
    'authToken', 'userProfile', 'appStats',
  ]);

  if (!authToken) {
    $('signin-btn').href = `${WEB_BASE}/auth/signin?from=extension`;
    show('unauthenticated');
    return;
  }

  chrome.runtime.sendMessage({ type: 'GET_STATUS' }, async (res) => {
    if (!res?.authenticated) {
      $('signin-btn').href = `${WEB_BASE}/auth/signin?from=extension`;
      show('unauthenticated');
      return;
    }

    if (!res.active) {
      $('upgrade-btn').href = `${WEB_BASE}/pricing`;
      show('no-subscription');
      return;
    }

    // Load profile for display
    chrome.runtime.sendMessage({ type: 'GET_PROFILE' }, (profileRes) => {
      const profile = profileRes?.profile;
      if (profile) {
        $('user-name').textContent =
          `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Ready to apply';
        $('user-email').textContent = profile.user?.email || '';
      }
    });

    // Load stats from storage (updated by content scripts)
    const stats = appStats || { total: 0, today: 0 };
    $('stat-total').textContent = stats.total;
    $('stat-today').textContent = stats.today;

    $('dashboard-link').href = `${WEB_BASE}/dashboard`;
    show('active');
  });
}

function show(section) {
  ['loading', 'unauthenticated', 'no-subscription', 'active'].forEach((id) => {
    $(id).classList.toggle('hidden', id !== section);
  });
}

$('signout-btn')?.addEventListener('click', async () => {
  await chrome.storage.local.clear();
  chrome.runtime.sendMessage({ type: 'SIGN_OUT' });
  $('signin-btn').href = `${WEB_BASE}/auth/signin?from=extension`;
  show('unauthenticated');
});

// Listen for token passed from web app via URL hash on extension page
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (hash.startsWith('#token=')) {
    const token = hash.slice(7);
    chrome.storage.local.set({ authToken: token }, init);
    return;
  }
  init();
});
