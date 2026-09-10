import { isClinicClosedOnDate } from '../utils/schedule.js';
import { supabase } from '../services/supabase.js';
import { NotificationService } from '../services/notifications.js';

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  return `${diffDays}d ago`;
}

export function renderHeader(activeRoute = '/') {
  const todayStr = new Date().toISOString().split('T')[0];
  const isClosedToday = isClinicClosedOnDate(todayStr);

  return `
    <!-- Operational Status Sub-Bar -->
    <div class="operational-status-strip">
      <div class="status-pulse-group">
        <span class="pulse-dot" style="${isClosedToday ? 'background:var(--color-error); box-shadow:none;' : ''}"></span>
        <span style="font-weight:700; color:${isClosedToday ? 'var(--color-error)' : 'var(--color-secondary)'};">
          ${isClosedToday ? 'Closed Today' : 'Open Today'}
        </span>
        <span style="color:var(--color-on-surface-variant); font-size:0.75rem;">
          • ${isClosedToday ? 'Next open: 8 AM-12 PM' : '8:00 AM – 12:00 PM & 4:00 PM – 8:00 PM'}
        </span>
      </div>
      <div class="closed-badge-pill">
        Closed: Mon &amp; Fri
      </div>
    </div>

    <!-- Main Header Bar -->
    <header class="site-header">
      <div class="container site-nav-container">
        <!-- Brand / Clinic Name -->
        <a href="/" class="brand-wrapper" aria-label="Dental Paradise Home">
          <div class="brand-icon-box">
            <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">dentistry</span>
          </div>
          <div class="brand-text-box">
            <span class="brand-name">Dental Paradise</span>
            <span class="brand-sub">Dr. Supriyo Sahu • Math Chandipur</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <ul class="desktop-nav-links">
          <li><a href="/" class="desktop-nav-link ${activeRoute === '/' ? 'active' : ''}">Home</a></li>
          <li><a href="/doctors/dr-supriyo-sahu" class="desktop-nav-link ${activeRoute.startsWith('/doctors') ? 'active' : ''}">Doctor Profile</a></li>
          <li><a href="/treatments" class="desktop-nav-link ${activeRoute.startsWith('/treatments') ? 'active' : ''}">Treatments</a></li>
          <li><a href="/appointment-status" class="desktop-nav-link ${activeRoute === '/appointment-status' ? 'active' : ''}">Check Queue</a></li>
          <li><a href="/about" class="desktop-nav-link ${activeRoute === '/about' ? 'active' : ''}">About Clinic</a></li>
          <li><a href="/contact" class="desktop-nav-link ${activeRoute === '/contact' ? 'active' : ''}">Contact</a></li>
        </ul>

        <!-- Right Header Actions (Visible on Mobile & Desktop) -->
        <div class="header-right-actions">
          <!-- Notification Bell with Live Unread Counter -->
          <div class="header-notif-wrapper" id="header-notif-wrapper">
            <button class="header-notif-btn" id="header-notif-btn" aria-label="Notifications" title="Clinic Notifications">
              <span class="material-symbols-outlined text-[20px]">notifications</span>
              <span class="header-notif-badge" id="header-notif-badge" style="display:none;">0</span>
            </button>
            <div class="header-notif-dropdown" id="header-notif-dropdown" style="display:none;">
              <div class="notif-dropdown-header">
                <span class="notif-dropdown-title">Clinic Alerts</span>
                <button class="notif-mark-all-btn" id="notif-mark-all-btn">Mark read</button>
              </div>
              <div class="notif-dropdown-list" id="notif-dropdown-list">
                <div class="notif-empty-state">Loading notifications...</div>
              </div>
              <div class="notif-dropdown-footer">
                <span id="notif-role-indicator" style="font-size:0.7rem; color:var(--text-muted);">Real-Time Updates</span>
              </div>
            </div>
          </div>

          <!-- Direct Doctor Portal Access Button (Top Area Requirement) -->
          <a href="/doctor-login" class="doctor-portal-pill" title="Authorized Doctor Portal" aria-label="Doctor Portal">
            <span class="material-symbols-outlined text-[16px]">lock</span>
            <span>Doctor Portal</span>
          </a>

          <!-- Quick Call Direct Button -->
          <a href="tel:9733835105" class="quick-call-btn" aria-label="Call Doctor Directly" title="Call Clinic Directly">
            <span class="material-symbols-outlined text-[18px]">call</span>
          </a>

          <!-- Book CTA for Desktop -->
          <a href="/book-appointment" class="btn btn-secondary btn-sm" style="display:none;" id="desktop-book-btn">
            <span>Book Appointment</span>
          </a>

          <!-- Mobile Hamburger Menu Button -->
          <button class="menu-toggle-btn" id="mobile-toggle" aria-label="Open Mobile Menu">
            <span class="material-symbols-outlined text-[22px]">menu</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Slide-over Drawer -->
    <div class="mobile-drawer" id="mobile-drawer">
      <div class="drawer-panel">
        <div class="drawer-header">
          <div class="brand-text-box">
            <span class="brand-name">Dental Paradise</span>
            <span class="brand-sub">Dr. Supriyo Sahu</span>
          </div>
          <button id="drawer-close" aria-label="Close Menu" style="background:none; border:none; font-size:1.75rem; cursor:pointer; color:var(--color-primary); line-height:1;">&times;</button>
        </div>

        <ul class="drawer-links">
          <li><a href="/" class="${activeRoute === '/' ? 'active' : ''}"><span class="material-symbols-outlined">home</span> Home</a></li>
          <li><a href="/doctors/dr-supriyo-sahu" class="${activeRoute.startsWith('/doctors') ? 'active' : ''}"><span class="material-symbols-outlined">person</span> Doctor Profile</a></li>
          <li><a href="/treatments" class="${activeRoute.startsWith('/treatments') ? 'active' : ''}"><span class="material-symbols-outlined">medical_services</span> All Treatments (12)</a></li>
          <li><a href="/book-appointment" class="${activeRoute === '/book-appointment' ? 'active' : ''}" style="color:var(--color-secondary); font-weight:700;"><span class="material-symbols-outlined">calendar_month</span> Book Appointment</a></li>
          <li><a href="/appointment-status" class="${activeRoute === '/appointment-status' ? 'active' : ''}"><span class="material-symbols-outlined">schedule</span> Check Queue Status</a></li>
          <li><a href="/reviews" class="${activeRoute === '/reviews' ? 'active' : ''}"><span class="material-symbols-outlined">star</span> Patient Reviews</a></li>
          <li><a href="/about" class="${activeRoute === '/about' ? 'active' : ''}"><span class="material-symbols-outlined">apartment</span> About Clinic</a></li>
          <li><a href="/gallery" class="${activeRoute === '/gallery' ? 'active' : ''}"><span class="material-symbols-outlined">photo_library</span> Clinic Gallery</a></li>
          <li><a href="/faq" class="${activeRoute === '/faq' ? 'active' : ''}"><span class="material-symbols-outlined">help</span> FAQs</a></li>
          <li><a href="/contact" class="${activeRoute === '/contact' ? 'active' : ''}"><span class="material-symbols-outlined">location_on</span> Location &amp; Contact</a></li>
          <li style="margin-top:0.75rem; border-top:1px solid var(--color-outline-variant); padding-top:0.75rem;">
            <a href="/doctor-login" style="color:var(--color-primary); font-weight:700;"><span class="material-symbols-outlined">lock</span> 🔐 Doctor Portal Login</a>
          </li>
        </ul>

        <div style="margin-top:auto; display:flex; flex-direction:column; gap:0.5rem; padding-top:1.5rem;">
          <a href="tel:9733835105" class="btn btn-secondary btn-sm" style="width:100%;">
            <span class="material-symbols-outlined text-[18px]">call</span>
            <span>Call 9733835105</span>
          </a>
          <a href="https://wa.me/919733835105" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="width:100%;">
            <span>WhatsApp Clinic</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation Dock (Thumb-First 1-Handed UX) -->
    <nav class="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <a href="/" class="bottom-nav-item ${activeRoute === '/' ? 'active' : ''}">
        <span class="material-symbols-outlined text-[22px]" ${activeRoute === '/' ? "style=\"font-variation-settings: 'FILL' 1;\"" : ''}>home</span>
        <span>Home</span>
      </a>

      <a href="/treatments" class="bottom-nav-item ${activeRoute.startsWith('/treatments') ? 'active' : ''}">
        <span class="material-symbols-outlined text-[22px]" ${activeRoute.startsWith('/treatments') ? "style=\"font-variation-settings: 'FILL' 1;\"" : ''}>medical_services</span>
        <span>Treatments</span>
      </a>

      <a href="/book-appointment" class="bottom-nav-item bottom-nav-fab ${activeRoute === '/book-appointment' ? 'active' : ''}" aria-label="Book Dental Appointment">
        <div class="fab-circle">
          <span class="material-symbols-outlined text-[22px]" style="font-variation-settings: 'FILL' 1;">calendar_month</span>
        </div>
        <span style="font-size:0.7rem; font-weight:700; color:var(--color-secondary); margin-top:2px;">Book</span>
      </a>

      <a href="/appointment-status" class="bottom-nav-item ${activeRoute === '/appointment-status' ? 'active' : ''}">
        <span class="material-symbols-outlined text-[22px]" ${activeRoute === '/appointment-status' ? "style=\"font-variation-settings: 'FILL' 1;\"" : ''}>schedule</span>
        <span>Queue</span>
      </a>

      <a href="/contact" class="bottom-nav-item ${activeRoute === '/contact' ? 'active' : ''}">
        <span class="material-symbols-outlined text-[22px]" ${activeRoute === '/contact' ? "style=\"font-variation-settings: 'FILL' 1;\"" : ''}>location_on</span>
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

  // Adjust desktop book button visibility
  const desktopBookBtn = document.getElementById('desktop-book-btn');
  if (desktopBookBtn && window.innerWidth >= 1024) {
    desktopBookBtn.style.display = 'inline-flex';
  }

  // Header Notification Bell & Live Dropdown Logic
  const notifBtn = document.getElementById('header-notif-btn');
  const notifBadge = document.getElementById('header-notif-badge');
  const notifDropdown = document.getElementById('header-notif-dropdown');
  const notifList = document.getElementById('notif-dropdown-list');
  const markAllBtn = document.getElementById('notif-mark-all-btn');
  const roleIndicator = document.getElementById('notif-role-indicator');

  if (notifBtn && notifDropdown) {
    let currentRole = 'patient';
    let currentIdentifier = localStorage.getItem('last_apt_phone') || '';

    // Detect role (doctor session vs patient phone)
    supabase.auth.getSession().then(({ data: { session } }) => {
      const isDoctor = session?.user?.email?.trim().toLowerCase() === 'supriyosahu96@gmail.com';
      if (isDoctor) {
        currentRole = 'doctor';
        currentIdentifier = 'supriyosahu96@gmail.com';
      }
      if (roleIndicator) {
        roleIndicator.textContent = isDoctor ? '👨‍⚕️ Dr. Supriyo Sahu Alerts' : '👤 Patient Live Updates';
      }
      refreshUnreadCount();
      setupRealtimeHeaderNotifications();
    });

    async function refreshUnreadCount() {
      const count = await NotificationService.getUnreadCount(currentRole, currentIdentifier);
      if (notifBadge) {
        if (count > 0) {
          notifBadge.style.display = 'flex';
          notifBadge.textContent = count > 9 ? '9+' : count;
        } else {
          notifBadge.style.display = 'none';
        }
      }
    }

    async function loadDropdownNotifications() {
      if (!notifList) return;
      notifList.innerHTML = '<div class="notif-empty-state"><span class="material-symbols-outlined animate-spin text-[20px]">sync</span><p style="margin-top:0.3rem;">Loading...</p></div>';
      const items = await NotificationService.getNotifications(currentRole, currentIdentifier);
      if (!items || items.length === 0) {
        notifList.innerHTML = '<div class="notif-empty-state">No notifications right now.</div>';
        return;
      }

      notifList.innerHTML = items.map(item => `
        <div class="notif-item ${item.is_read ? 'read' : 'unread'}" data-id="${item.id}" data-url="${item.target_url || '/'}">
          <div class="notif-item-dot"></div>
          <div class="notif-item-content">
            <div class="notif-item-title">${item.title}</div>
            <div class="notif-item-body">${item.body}</div>
            <div class="notif-item-time">${formatRelativeTime(item.created_at)}</div>
          </div>
        </div>
      `).join('');

      notifList.querySelectorAll('.notif-item').forEach(el => {
        el.addEventListener('click', async () => {
          const id = el.dataset.id;
          const targetUrl = el.dataset.url;
          await NotificationService.markAsRead(id);
          notifDropdown.style.display = 'none';
          refreshUnreadCount();
          if (targetUrl && targetUrl !== '/') {
            window.history.pushState({}, '', targetUrl);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
        });
      });
    }

    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = notifDropdown.style.display === 'block';
      if (isOpen) {
        notifDropdown.style.display = 'none';
      } else {
        notifDropdown.style.display = 'block';
        loadDropdownNotifications();
      }
    });

    if (markAllBtn) {
      markAllBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await NotificationService.markAllAsRead(currentRole, currentIdentifier);
        refreshUnreadCount();
        loadDropdownNotifications();
      });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
        notifDropdown.style.display = 'none';
      }
    });

    window.addEventListener('dp-notification-updated', () => {
      refreshUnreadCount();
      if (notifDropdown.style.display === 'block') {
        loadDropdownNotifications();
      }
    });

    function setupRealtimeHeaderNotifications() {
      if (window.__dp_header_channel) {
        supabase.removeChannel(window.__dp_header_channel);
      }
      window.__dp_header_channel = supabase
        .channel(`header-notifs-${currentRole}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_role=eq.${currentRole}`
        }, () => {
          refreshUnreadCount();
          if (notifDropdown.style.display === 'block') {
            loadDropdownNotifications();
          }
        })
        .subscribe();
    }
  }
}
