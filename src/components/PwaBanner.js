let deferredPrompt = null;

export function initPwaBanner() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showBanner();
  });

  // Check if iOS Safari
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };
  const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

  if (isIos() && !isInStandaloneMode() && !sessionStorage.getItem('pwa_ios_dismissed')) {
    setTimeout(showIosBanner, 3000);
  }
}

function showBanner() {
  if (document.getElementById('pwa-install-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.className = 'pwa-banner';
  banner.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.75rem;">
      <img src="/favicon.svg" alt="App Icon" style="width:40px; height:40px; border-radius:8px;"/>
      <div>
        <strong style="display:block; font-size:0.95rem; color:#0B2545;">Install Dental Paradise App</strong>
        <span style="font-size:0.78rem; color:#64748B;">Fast appointment booking & instant push alerts</span>
      </div>
    </div>
    <div style="display:flex; gap:0.5rem; align-items:center;">
      <button id="pwa-install-btn" class="btn btn-primary btn-sm">Install</button>
      <button id="pwa-dismiss-btn" style="background:none; border:none; font-size:1.25rem; color:#94A3B8; cursor:pointer;">&times;</button>
    </div>
  `;

  document.body.appendChild(banner);

  document.getElementById('pwa-install-btn').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        banner.remove();
      }
      deferredPrompt = null;
    }
  });

  document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
    banner.remove();
  });
}

function showIosBanner() {
  if (document.getElementById('pwa-ios-banner')) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-ios-banner';
  banner.className = 'pwa-banner';
  banner.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.75rem;">
      <img src="/favicon.svg" alt="App Icon" style="width:36px; height:36px; border-radius:8px;"/>
      <div>
        <strong style="display:block; font-size:0.9rem; color:#0B2545;">Add Dental Paradise to Home Screen</strong>
        <span style="font-size:0.75rem; color:#64748B;">Tap <strong>Share</strong> ( <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> ) then <strong>"Add to Home Screen"</strong></span>
      </div>
    </div>
    <button id="pwa-ios-dismiss" style="background:none; border:none; font-size:1.25rem; color:#94A3B8; cursor:pointer;">&times;</button>
  `;
  document.body.appendChild(banner);

  document.getElementById('pwa-ios-dismiss').addEventListener('click', () => {
    sessionStorage.setItem('pwa_ios_dismissed', 'true');
    banner.remove();
  });
}
