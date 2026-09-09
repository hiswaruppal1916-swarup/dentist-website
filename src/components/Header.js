import { isClinicClosedOnDate } from '../utils/schedule.js';

export function renderHeader(activeRoute = '/') {
  const todayStr = new Date().toISOString().split('T')[0];
  const isClosedToday = isClinicClosedOnDate(todayStr);

  const statusBadge = isClosedToday 
    ? `<span class="badge-closed">● Clinic Closed Today</span>`
    : `<span class="badge-open">● Open Today: 8 AM–12 PM & 4 PM–8 PM</span>`;

  return `
    <div class="header-banner">
      <div class="container banner-content">
        <div class="banner-left">
          <span>📍 Math Chandipur Market, Behind Life Care Diagnostic Center (PIN 721659)</span>
        </div>
        <div class="banner-right">
          ${statusBadge}
          <a href="tel:9733835105" style="color:#00A896; font-weight:600;">📞 9733835105</a>
        </div>
      </div>
    </div>

    <nav class="site-nav">
      <div class="container nav-content">
        <a href="/" class="logo-brand">
          <img src="/favicon.svg" alt="Dental Paradise Logo" class="logo-img" />
          <div class="logo-text">
            <span class="logo-title">Dental Paradise</span>
            <span class="logo-sub">A Complete Oral & Dental Care</span>
          </div>
        </a>

        <ul class="nav-links">
          <li><a href="/" class="nav-link ${activeRoute === '/' ? 'active' : ''}">Home</a></li>
          <li><a href="/about" class="nav-link ${activeRoute === '/about' ? 'active' : ''}">About</a></li>
          <li><a href="/doctors/dr-supriyo-sahu" class="nav-link ${activeRoute.startsWith('/doctors') ? 'active' : ''}">Doctor Profile</a></li>
          <li><a href="/treatments" class="nav-link ${activeRoute.startsWith('/treatments') ? 'active' : ''}">Treatments</a></li>
          <li><a href="/reviews" class="nav-link ${activeRoute === '/reviews' ? 'active' : ''}">Reviews</a></li>
          <li><a href="/appointment-status" class="nav-link ${activeRoute === '/appointment-status' ? 'active' : ''}">Check Status</a></li>
          <li><a href="/contact" class="nav-link ${activeRoute === '/contact' ? 'active' : ''}">Contact</a></li>
        </ul>

        <div class="nav-actions">
          <a href="https://wa.me/919733835105?text=Hello%20Dental%20Paradise,%20I%20would%20like%20to%20inquire%20about%20dental%20care." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm nav-desktop-only">
            <span>WhatsApp</span>
          </a>
          <a href="/book-appointment" class="btn btn-primary btn-sm nav-desktop-only">
            <span>Book Appointment</span>
          </a>
          
          <!-- Mobile Top Quick Call -->
          <a href="tel:9733835105" class="mobile-quick-call" aria-label="Call Doctor Directly">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </a>

          <button class="mobile-toggle" id="mobile-toggle" aria-label="Open Navigation Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Navigation Drawer -->
    <div class="mobile-drawer" id="mobile-drawer">
      <div class="drawer-panel">
        <div class="drawer-header">
          <div class="logo-text">
            <span class="logo-title">Dental Paradise</span>
            <span class="logo-sub">Dr. Supriyo Sahu</span>
          </div>
          <button id="drawer-close" aria-label="Close Menu" style="background:none; border:none; font-size:1.75rem; cursor:pointer; color:var(--text-main); line-height:1;">&times;</button>
        </div>
        <ul class="drawer-links">
          <li><a href="/" class="${activeRoute === '/' ? 'active' : ''}">🏠 Home</a></li>
          <li><a href="/about" class="${activeRoute === '/about' ? 'active' : ''}">🏥 About Clinic</a></li>
          <li><a href="/doctors/dr-supriyo-sahu" class="${activeRoute.startsWith('/doctors') ? 'active' : ''}">👨‍⚕️ Dr. Supriyo Sahu</a></li>
          <li><a href="/treatments" class="${activeRoute.startsWith('/treatments') ? 'active' : ''}">🦷 All Treatments (12)</a></li>
          <li><a href="/book-appointment" class="${activeRoute === '/book-appointment' ? 'active' : ''}" style="color:var(--color-primary); font-weight:700;">📅 Book Appointment</a></li>
          <li><a href="/appointment-status" class="${activeRoute === '/appointment-status' ? 'active' : ''}">🔍 Check Queue & Status</a></li>
          <li><a href="/reviews" class="${activeRoute === '/reviews' ? 'active' : ''}">⭐ Patient Reviews</a></li>
          <li><a href="/gallery" class="${activeRoute === '/gallery' ? 'active' : ''}">🖼️ Clinic Gallery</a></li>
          <li><a href="/faq" class="${activeRoute === '/faq' ? 'active' : ''}">❓ Frequently Asked Questions</a></li>
          <li><a href="/contact" class="${activeRoute === '/contact' ? 'active' : ''}">📍 Location & Contact</a></li>
          <li style="margin-top:1rem; border-top:1px solid var(--border-light); padding-top:1rem;">
            <a href="/admin" style="color:var(--text-light); font-size:0.85rem; font-weight:600;">🔒 Staff / Doctor Login</a>
          </li>
        </ul>
        <div style="margin-top:auto; display:flex; flex-direction:column; gap:0.6rem; padding-top:1.5rem;">
          <a href="tel:9733835105" class="btn btn-secondary btn-sm" style="width:100%;">📞 Call Dr. Sahu (9733835105)</a>
          <a href="https://wa.me/919733835105" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="width:100%;">💬 WhatsApp Clinic</a>
        </div>
      </div>
    </div>

    <!-- Native Smartphone Bottom Navigation Dock (Thumb-first UX) -->
    <nav class="mobile-bottom-nav" aria-label="Mobile Navigation">
      <a href="/" class="bottom-nav-item ${activeRoute === '/' ? 'active' : ''}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Home</span>
      </a>

      <a href="/treatments" class="bottom-nav-item ${activeRoute.startsWith('/treatments') ? 'active' : ''}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2C8.5 2 7 5 7 8c0 4 2 8 3 12 0 1 1 2 2 2s2-1 2-2c1-4 3-8 3-12 0-3-1.5-6-5-6z"></path>
        </svg>
        <span>Treatments</span>
      </a>

      <a href="/book-appointment" class="bottom-nav-item bottom-nav-fab ${activeRoute === '/book-appointment' ? 'active' : ''}" aria-label="Book Dental Appointment">
        <div class="fab-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <line x1="12" y1="14" x2="12" y2="18"></line>
            <line x1="10" y1="16" x2="14" y2="16"></line>
          </svg>
        </div>
        <span class="fab-label">Book</span>
      </a>

      <a href="/appointment-status" class="bottom-nav-item ${activeRoute === '/appointment-status' ? 'active' : ''}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>Queue</span>
      </a>

      <a href="/contact" class="bottom-nav-item ${activeRoute === '/contact' ? 'active' : ''}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>Clinic</span>
      </a>
    </nav>
  `;
}

export function initHeaderEvents() {
  const toggle = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const close = document.getElementById('drawer-close');

  if (toggle && drawer) {
    toggle.addEventListener('click', () => drawer.classList.add('open'));
  }
  if (close && drawer) {
    close.addEventListener('click', () => drawer.classList.remove('open'));
  }
  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) drawer.classList.remove('open');
    });
  }
}
