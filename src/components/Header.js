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
          <a href="https://wa.me/919733835105?text=Hello%20Dental%20Paradise,%20I%20would%20like%20to%20inquire%20about%20dental%20care." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
            <span>WhatsApp</span>
          </a>
          <a href="/book-appointment" class="btn btn-primary btn-sm">
            <span>Book Appointment</span>
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

    <!-- Mobile Drawer -->
    <div class="mobile-drawer" id="mobile-drawer">
      <div class="drawer-panel">
        <div class="drawer-header">
          <div class="logo-text">
            <span class="logo-title">Dental Paradise</span>
            <span class="logo-sub">Dr. Supriyo Sahu</span>
          </div>
          <button id="drawer-close" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">&times;</button>
        </div>
        <ul class="drawer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About Clinic</a></li>
          <li><a href="/doctors/dr-supriyo-sahu">Dr. Supriyo Sahu</a></li>
          <li><a href="/treatments">All Treatments</a></li>
          <li><a href="/book-appointment" style="color:var(--color-primary); font-weight:700;">Book Appointment</a></li>
          <li><a href="/appointment-status">Check Appointment Status</a></li>
          <li><a href="/reviews">Patient Reviews</a></li>
          <li><a href="/gallery">Clinic Gallery</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/contact">Location & Contact</a></li>
          <li><a href="/admin" style="color:var(--text-light); font-size:0.85rem; border:none;">Staff / Admin Login</a></li>
        </ul>
        <div style="margin-top:auto; display:flex; flex-direction:column; gap:0.5rem;">
          <a href="tel:9733835105" class="btn btn-secondary btn-sm" style="width:100%;">📞 Call 9733835105</a>
          <a href="https://wa.me/919733835105" target="_blank" class="btn btn-whatsapp btn-sm" style="width:100%;">💬 WhatsApp Clinic</a>
        </div>
      </div>
    </div>
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
