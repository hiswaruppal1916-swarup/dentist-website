export function renderStitchHubPage(selectedScreen = 'home') {
  const screens = [
    {
      id: 'home',
      name: 'Home & Doctor Profile',
      bengali: 'হোম ও ডাক্তার প্রোফাইল',
      icon: '🏠',
      desc: 'Mobile-first clinical sanctuary hero with live clinic operational status, verified doctor badge, 7-day OPD availability row, trust badges, and emergency banner.',
      file: '/stitch/home.html',
      sourceId: '950c72bb87174b8786d3a31e797028ea',
      dimensions: '390 × 844 (Fluid)'
    },
    {
      id: 'booking',
      name: '5-Step Appointment Wizard',
      bengali: '৫-ধাপের অনলাইন বুকিং',
      icon: '📅',
      desc: 'Interactive patient scheduling wizard: treatment selector, Monday/Friday closure enforcement, 30-min morning/evening slots, patient details, and cash-at-clinic summary.',
      file: '/stitch/booking.html',
      sourceId: 'c2713fe8d4e94208a5c58a5e0a27ba0e',
      dimensions: '390 × 844 (Fluid)'
    },
    {
      id: 'treatments',
      name: 'Bilingual Treatments Catalog',
      bengali: '১২টি ডেন্টাল চিকিৎসা নির্দেশিকা',
      icon: '🦷',
      desc: 'Complete 12-procedure catalog with English and Bengali translations, starting prices (₹300 - ₹25,000), clinical indicators, and 1-tap booking triggers.',
      file: '/stitch/treatments.html',
      sourceId: 'eaeff478808c4392ad1a11c8e29be82d',
      dimensions: '390 × 844 (Fluid)'
    },
    {
      id: 'admin',
      name: 'Doctor Queue & Appointments Admin',
      bengali: 'ডাক্তার ও স্টাফ ম্যানেজমেন্ট',
      icon: '🩺',
      desc: 'Real-time daily patient queue, OPD slot control, 1-tap status updates (Confirmed, Arrived, In Consult, Completed, Rejected), and clinic holiday toggles.',
      file: '/stitch/admin.html',
      sourceId: '386a370f773a45588ffb0eaed78f5775',
      dimensions: '390 × 844 (Fluid)'
    }
  ];

  const currentScreen = screens.find(s => s.id === selectedScreen) || screens[0];

  const screenNavTabs = screens.map(s => {
    const isActive = s.id === currentScreen.id;
    return `
      <a href="/stitch/${s.id}" class="stitch-tab-btn ${isActive ? 'active' : ''}">
        <span class="stitch-tab-icon">${s.icon}</span>
        <div class="stitch-tab-text">
          <div class="stitch-tab-title">${s.name}</div>
          <div class="stitch-tab-bn bn-text">${s.bengali}</div>
        </div>
      </a>
    `;
  }).join('');

  return `
    <div class="stitch-hub-wrapper">
      <!-- Top Showcase Header -->
      <section class="stitch-hub-hero">
        <div class="container">
          <div class="stitch-hero-badge">
            <span class="stitch-pulse-dot"></span>
            <span>GOOGLE STITCH UI/UX DESIGN SYSTEM • CLINICAL SANCTUARY</span>
          </div>
          <h1 class="stitch-hero-title">Official Google Stitch Screens</h1>
          <p class="stitch-hero-subtitle">
            Crafted specifically for <strong>Dental Paradise</strong> (Project ID: <code>5248741634450652171</code>). 
            Every screen is built mobile-first using Plus Jakarta Sans, Material Symbols Outlined, and calibrated healthcare tokens.
          </p>

          <div class="stitch-meta-pills">
            <span class="stitch-meta-pill">📱 Primary Device: iPhone 15 Pro (390 × 844)</span>
            <span class="stitch-meta-pill">🎨 Theme: Clinical Sanctuary (#0F2942 / #00A896)</span>
            <span class="stitch-meta-pill">⚡ Status: 4 Screens Generated & Integrated</span>
          </div>
        </div>
      </section>

      <!-- Screen Selector Tabs -->
      <div class="stitch-tabs-bar">
        <div class="container stitch-tabs-container">
          ${screenNavTabs}
        </div>
      </div>

      <!-- Preview Workspace -->
      <section class="stitch-preview-section">
        <div class="container">
          
          <div class="stitch-screen-info-card">
            <div class="stitch-screen-info-left">
              <span class="stitch-active-pill">${currentScreen.icon} ${currentScreen.dimensions}</span>
              <h2>${currentScreen.name}</h2>
              <h3 class="bn-text" style="color:var(--color-primary); font-size:1rem; margin-top:0.2rem;">${currentScreen.bengali}</h3>
              <p style="color:var(--text-muted); font-size:0.92rem; margin-top:0.4rem; max-width:650px;">
                ${currentScreen.desc}
              </p>
              <div style="font-size:0.8rem; color:var(--text-light); margin-top:0.5rem;">
                Stitch Screen ID: <code>${currentScreen.sourceId}</code>
              </div>
            </div>

            <div class="stitch-screen-actions">
              <a href="${currentScreen.file}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <span>↗ Open Standalone Page</span>
              </a>
              <button type="button" class="btn btn-outline" id="stitch-refresh-btn" onclick="document.getElementById('stitch-iframe').src='${currentScreen.file}'">
                <span>🔄 Reload Preview</span>
              </button>
            </div>
          </div>

          <!-- Device Frame Mockup Container -->
          <div class="stitch-device-wrapper">
            <!-- Frame Controls -->
            <div class="stitch-viewport-controls">
              <span class="viewport-label">Preview Mode:</span>
              <button type="button" class="viewport-btn active" data-width="390" data-height="844">📱 Phone (390px)</button>
              <button type="button" class="viewport-btn" data-width="420" data-height="880">📱 Large Phone (420px)</button>
              <button type="button" class="viewport-btn" data-width="768" data-height="900">📟 Tablet (768px)</button>
              <button type="button" class="viewport-btn" data-width="100%" data-height="900">💻 Full Width (100%)</button>
            </div>

            <!-- Phone Frame -->
            <div class="stitch-phone-mockup" id="stitch-phone-frame" style="width: 390px; height: 844px;">
              <div class="phone-speaker-bar">
                <div class="phone-dynamic-island"></div>
              </div>
              <iframe 
                id="stitch-iframe" 
                src="${currentScreen.file}" 
                title="${currentScreen.name}"
                class="stitch-preview-frame"
                loading="eager"
              ></iframe>
            </div>

            <div class="stitch-preview-hint">
              <small>👆 You can scroll, click and interact with the live Stitch screen inside this mobile viewport frame.</small>
            </div>
          </div>

          <!-- All 4 Screen Cards Grid -->
          <div class="stitch-all-screens-grid">
            <h3 style="grid-column: 1 / -1; font-size: 1.4rem; margin-bottom: 0.5rem;">All 4 Stitch Screens in Project</h3>
            ${screens.map(s => `
              <div class="stitch-gallery-card ${s.id === currentScreen.id ? 'active-card' : ''}">
                <div class="gallery-card-header">
                  <span class="gallery-card-icon">${s.icon}</span>
                  <div>
                    <h4 class="gallery-card-title">${s.name}</h4>
                    <span class="gallery-card-bn bn-text">${s.bengali}</span>
                  </div>
                </div>
                <p class="gallery-card-desc">${s.desc}</p>
                <div class="gallery-card-footer">
                  <a href="/stitch/${s.id}" class="btn btn-outline btn-sm">Preview in Frame</a>
                  <a href="${s.file}" target="_blank" class="btn btn-secondary btn-sm">Open Page ↗</a>
                </div>
              </div>
            `).join('')}
          </div>

        </div>
      </section>
    </div>
  `;
}

export function initStitchHubEvents() {
  const buttons = document.querySelectorAll('.viewport-btn');
  const frame = document.getElementById('stitch-phone-frame');

  if (buttons && frame) {
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const w = btn.getAttribute('data-width');
        const h = btn.getAttribute('data-height');

        if (w === '100%') {
          frame.style.width = '100%';
          frame.style.maxWidth = '100%';
          frame.style.borderRadius = '16px';
        } else {
          frame.style.width = `${w}px`;
          frame.style.maxWidth = `${w}px`;
          frame.style.borderRadius = '40px';
        }
        frame.style.height = `${h}px`;
      });
    });
  }
}
