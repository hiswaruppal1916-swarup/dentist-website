import { supabase } from '../services/supabase.js';
import { formatDisplayDate, formatDisplayTime, isClinicClosedOnDate } from '../utils/schedule.js';
import { NotificationService, playNotificationChime } from '../services/notifications.js';

export const AUTHORIZED_DOCTOR_EMAIL = 'supriyosahu96@gmail.com';

export async function renderAdminDashboardPage() {
  // Check auth session
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Redirect unauthenticated user to /doctor-login
    setTimeout(() => {
      window.history.replaceState({}, '', '/doctor-login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 50);
    return `
      <div class="container section" style="text-align:center; padding:5rem 1rem;">
        <span class="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
        <h2 style="font-size:1.25rem; margin-top:1rem; color:var(--color-primary);">Redirecting to Doctor Login...</h2>
        <p style="color:var(--color-on-surface-variant); font-size:0.85rem; margin-top:0.5rem;">Please wait while we verify administrative access.</p>
      </div>
    `;
  }

  const normalizedUserEmail = session.user.email?.trim().toLowerCase();

  // Enforce single authorized doctor account
  if (normalizedUserEmail !== AUTHORIZED_DOCTOR_EMAIL) {
    await supabase.auth.signOut();
    setTimeout(() => {
      window.history.replaceState({}, '', '/doctor-login?error=unauthorized');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, 50);
    return `
      <div class="container section" style="text-align:center; padding:5rem 1rem;">
        <div style="font-size:2.5rem; margin-bottom:1rem;">🚫</div>
        <h2 style="font-size:1.4rem; color:var(--color-error);">Unauthorized Account</h2>
        <p style="color:var(--color-on-surface-variant); font-size:0.9rem; margin-top:0.5rem;">
          Only Dr. Supriyo Sahu can access this dashboard.
        </p>
      </div>
    `;
  }

  let clinicSettings = null;
  try {
    const { data } = await supabase
      .from('clinic_settings')
      .select('*')
      .eq('id', 1)
      .single();
    clinicSettings = data;
  } catch (e) {
    console.error('Error loading clinic settings', e);
  }

  return renderDashboardView(clinicSettings);
}

function renderDashboardView(settings) {
  function getLocalDateString(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const todayStr = getLocalDateString();

  return `
    <div class="admin-container">
      <!-- Executive Doctor Header (No login email displayed) -->
      <div class="doctor-dashboard-header">
        <div class="doctor-dashboard-brand">
          <div class="doctor-brand-icon">
            <span class="material-symbols-outlined text-[24px]">dentistry</span>
          </div>
          <div>
            <div class="doctor-portal-pill">CLINICAL PRACTICE MANAGEMENT</div>
            <h1 class="doctor-dashboard-title">Doctor Dashboard</h1>
            <p class="doctor-dashboard-subtitle">
              Dr. Supriyo Sahu • Real-Time Appointment & Queue Management
            </p>
          </div>
        </div>

        <div class="doctor-dashboard-actions">
          <button id="btn-request-push" class="btn btn-outline btn-sm" title="Receive alerts on this device">
            <span class="material-symbols-outlined text-[16px]">notifications</span>
            <span>Push Alerts</span>
          </button>
          <button id="admin-signout-btn" class="btn btn-secondary btn-sm" title="Sign out of doctor session">
            <span class="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics Grid (Synchronized with filters) -->
      <div class="metric-grid" id="admin-metrics">
        <div class="metric-card clickable-metric" data-filter="today">
          <h3 id="metric-total">0</h3>
          <p>Today's Total</p>
        </div>
        <div class="metric-card clickable-metric" data-filter="pending" style="border-left:4px solid var(--status-pending);">
          <h3 id="metric-pending" style="color:var(--status-pending);">0</h3>
          <p>Pending Review</p>
        </div>
        <div class="metric-card clickable-metric" data-filter="confirmed" style="border-left:4px solid var(--status-confirmed);">
          <h3 id="metric-confirmed" style="color:var(--status-confirmed);">0</h3>
          <p>Confirmed</p>
        </div>
        <div class="metric-card clickable-metric" data-filter="arrived" style="border-left:4px solid var(--status-arrived);">
          <h3 id="metric-arrived" style="color:var(--status-arrived);">0</h3>
          <p>Arrived in Clinic</p>
        </div>
        <div class="metric-card clickable-metric" data-filter="in_consultation" style="border-left:4px solid var(--status-in-consult);">
          <h3 id="metric-in-consult" style="color:var(--status-in-consult);">0</h3>
          <p>In Consultation</p>
        </div>
        <div class="metric-card clickable-metric" data-filter="completed" style="border-left:4px solid var(--status-completed);">
          <h3 id="metric-completed" style="color:var(--status-completed);">0</h3>
          <p>Completed</p>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="admin-filter-bar">
        <div class="admin-filter-pills">
          <button class="btn btn-primary btn-sm date-filter-btn active" data-mode="today">
            <span class="material-symbols-outlined text-[16px]">today</span>
            <span>Today</span>
          </button>
          <button class="btn btn-outline btn-sm date-filter-btn" data-mode="pending">
            <span class="material-symbols-outlined text-[16px]">pending_actions</span>
            <span>Pending Review</span>
          </button>
          <button class="btn btn-outline btn-sm date-filter-btn" data-mode="confirmed">
            <span class="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Confirmed</span>
          </button>
          <button class="btn btn-outline btn-sm date-filter-btn" data-mode="tomorrow">
            <span>Tomorrow</span>
          </button>
          <button class="btn btn-outline btn-sm date-filter-btn" data-mode="upcoming">
            <span>All Upcoming</span>
          </button>
          <button class="btn btn-outline btn-sm date-filter-btn" data-mode="previous">
            <span>History</span>
          </button>
        </div>

        <div class="admin-filter-date-group">
          <label for="admin-date-picker">Date:</label>
          <input type="date" id="admin-date-picker" class="form-control" value="${todayStr}" />
          <button id="btn-refresh-queue" class="btn btn-outline btn-sm" title="Refresh appointment list">
            <span class="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </div>

      <!-- Section Title & Live Status Indicator -->
      <div class="admin-queue-status-bar">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span class="live-dot-pulse"></span>
          <h2 id="queue-view-title" style="font-size:1.15rem; font-weight:700; color:var(--color-primary); margin:0;">Today's Patient Queue</h2>
        </div>
        <span id="queue-count-badge" class="queue-count-badge">Loading...</span>
      </div>

      <!-- Mobile Appointments Queue Cards (Shown on mobile/tablet viewports < 1024px) -->
      <div class="admin-mobile-cards" id="appointments-mobile-cards">
        <div style="text-align:center; padding:2rem 0; color:var(--color-primary);">Loading appointments queue...</div>
      </div>

      <!-- Appointments Queue Table (Shown on Desktop viewports >= 1024px) -->
      <div class="admin-table-wrapper" id="appointments-desktop-table-wrapper">
        <table class="admin-table" id="admin-appointments-table">
          <thead>
            <tr>
              <th style="width:70px;">Queue #</th>
              <th style="width:105px;">Time</th>
              <th>Patient Details</th>
              <th>Treatment</th>
              <th style="width:115px;">Date</th>
              <th style="width:125px;">Status</th>
              <th style="width:170px;">Doctor Actions</th>
            </tr>
          </thead>
          <tbody id="appointments-tbody">
            <tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--color-primary);">Loading appointments queue...</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Clinic Configuration Card -->
      <div class="responsive-card-box" style="margin-top:3.5rem;">
        <span class="section-tag">Practice Controls</span>
        <h2 style="font-size:1.5rem; margin-bottom:0.5rem;">Clinic Timetable & Configuration</h2>
        <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:1.5rem;">
          Operational constraints enforced across online booking and OPD timings.
        </p>

        <div class="responsive-cards-grid">
          <div style="background:var(--bg-main); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
            <h4 style="font-size:0.95rem; margin-bottom:0.75rem; color:var(--color-secondary); display:flex; align-items:center; gap:0.4rem;">
              <span class="material-symbols-outlined text-[18px]">event_busy</span>
              <span>Days & Hours Rule</span>
            </h4>
            <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.6;">
              • <strong>Monday & Friday:</strong> Strictly CLOSED<br/>
              • <strong>Tue, Wed, Thu, Sat, Sun:</strong> 8 AM–12 PM & 4 PM–8 PM<br/>
              • <strong>Default Slot:</strong> 30 Minutes<br/>
              • <strong>Same-Day Notice:</strong> 30 Minutes
            </p>
          </div>

          <div style="background:var(--bg-main); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
            <h4 style="font-size:0.95rem; margin-bottom:0.75rem; color:var(--color-secondary); display:flex; align-items:center; gap:0.4rem;">
              <span class="material-symbols-outlined text-[18px]">location_on</span>
              <span>Clinic Information</span>
            </h4>
            <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.6;">
              • <strong>Calling Number:</strong> 9733835105<br/>
              • <strong>WhatsApp Number:</strong> 9733835105<br/>
              • <strong>Location:</strong> Math Chandipur Market, Behind Life Care Diagnostic Center (PIN 721659)
            </p>
          </div>

          <div style="background:var(--bg-main); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
            <h4 style="font-size:0.95rem; margin-bottom:0.75rem; color:var(--color-secondary); display:flex; align-items:center; gap:0.4rem;">
              <span class="material-symbols-outlined text-[18px]">security</span>
              <span>Authorized Doctor</span>
            </h4>
            <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.6;">
              • <strong>Name:</strong> Dr. Supriyo Sahu<br/>
              • <strong>Role:</strong> Lead Dental Surgeon & Practice Admin<br/>
              • <strong>Security:</strong> Protected via Supabase Authentication & RLS
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initAdminEvents() {
  const signoutBtn = document.getElementById('admin-signout-btn');
  const datePicker = document.getElementById('admin-date-picker');
  const refreshBtn = document.getElementById('btn-refresh-queue');
  const pushBtn = document.getElementById('btn-request-push');

  // Auto-register doctor device if notification permission is already granted
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    NotificationService.requestPermissionAndRegister('doctor', AUTHORIZED_DOCTOR_EMAIL);
  }

  if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
      // Clean up realtime subscriptions on signout
      if (window.__dp_admin_channels) {
        window.__dp_admin_channels.forEach(ch => supabase.removeChannel(ch));
        window.__dp_admin_channels = [];
      }
      signoutBtn.disabled = true;
      signoutBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span><span>Signing Out...</span>';
      await supabase.auth.signOut();
      window.history.replaceState({}, '', '/doctor-login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  }

  if (pushBtn) {
    pushBtn.addEventListener('click', async () => {
      const res = await NotificationService.requestPermissionAndRegister('doctor', AUTHORIZED_DOCTOR_EMAIL);
      if (res) {
        NotificationService.showToast('Doctor Push Alerts enabled on this device!', 'success');
        playNotificationChime('doctor');
      } else {
        alert('Could not enable push notifications. Please check browser permission settings.');
      }
    });
  }

  if (datePicker) {
    let currentFilterMode = 'today';
    const currentAppointmentsMap = new Map();

    function getLocalDateString(d = new Date()) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    async function loadAppointments() {
      const tbody = document.getElementById('appointments-tbody');
      const mobileCards = document.getElementById('appointments-mobile-cards');
      const countBadge = document.getElementById('queue-count-badge');
      const titleEl = document.getElementById('queue-view-title');

      const loadingMsg = '<div style="text-align:center; padding:2rem 0; color:var(--color-secondary);"><span class="material-symbols-outlined text-[28px] animate-spin">sync</span><p style="margin-top:0.5rem; font-size:0.9rem;">Updating patient queue...</p></div>';
      if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1.5rem;">Updating list...</td></tr>';
      if (mobileCards) mobileCards.innerHTML = loadingMsg;

      const todayStr = getLocalDateString();
      let query = supabase.from('appointments').select('*');

      if (currentFilterMode === 'today') {
        if (titleEl) titleEl.textContent = "Today's Patient Queue";
        query = query.eq('appointment_date', todayStr);
      } else if (currentFilterMode === 'pending') {
        if (titleEl) titleEl.textContent = "Pending Review Appointments";
        query = query.eq('status', 'pending');
      } else if (currentFilterMode === 'confirmed') {
        if (titleEl) titleEl.textContent = "Confirmed Appointments";
        query = query.eq('status', 'confirmed');
      } else if (currentFilterMode === 'arrived') {
        if (titleEl) titleEl.textContent = "Patients Arrived in Clinic";
        query = query.eq('status', 'arrived');
      } else if (currentFilterMode === 'in_consultation') {
        if (titleEl) titleEl.textContent = "Patients in Consultation";
        query = query.eq('status', 'in_consultation');
      } else if (currentFilterMode === 'completed') {
        if (titleEl) titleEl.textContent = "Completed Consultations";
        query = query.eq('status', 'completed');
      } else if (currentFilterMode === 'tomorrow') {
        if (titleEl) titleEl.textContent = "Tomorrow's Schedule";
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        query = query.eq('appointment_date', getLocalDateString(tomorrow));
      } else if (currentFilterMode === 'upcoming') {
        if (titleEl) titleEl.textContent = "All Upcoming Appointments";
        query = query.gte('appointment_date', todayStr);
      } else if (currentFilterMode === 'previous') {
        if (titleEl) titleEl.textContent = "Past Appointment History";
        query = query.lt('appointment_date', todayStr);
      } else if (currentFilterMode === 'custom') {
        if (titleEl) titleEl.textContent = `Appointments for ${formatDisplayDate(datePicker.value)}`;
        query = query.eq('appointment_date', datePicker.value);
      }

      // Order by appointment date, time, and creation time (Earliest appointment -> Latest appointment)
      query = query
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .order('created_at', { ascending: true });

      const { data, error } = await query;

      if (error) {
        const errorHtml = `<div style="text-align:center; color:#EF4444; padding:1.5rem;">Failed to load queue: ${error.message}</div>`;
        if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#EF4444; padding:1.5rem;">Failed to load queue: ${error.message}</td></tr>`;
        if (mobileCards) mobileCards.innerHTML = errorHtml;
        return;
      }

      // Cache appointments in map
      currentAppointmentsMap.clear();
      (data || []).forEach(apt => currentAppointmentsMap.set(apt.id, apt));

      // Update metrics for today
      updateTodayMetrics();

      // Check if URL specifies a target appointment to highlight
      const urlParams = new URLSearchParams(window.location.search);
      const targetAptId = urlParams.get('appointment');

      // If notification targeted an appointment not in current view, fetch and prepend it
      if (targetAptId && (!data || !data.some(a => a.id === targetAptId))) {
        try {
          const { data: specificApt } = await supabase.from('appointments').select('*').eq('id', targetAptId).maybeSingle();
          if (specificApt) {
            data = [specificApt, ...(data || [])];
          }
        } catch (e) {
          console.warn('Could not load specific target appointment:', e);
        }
      }

      if (!data || data.length === 0) {
        if (countBadge) countBadge.textContent = '0 Patients';
        const isClosedDay = isClinicClosedOnDate(todayStr);
        const closedNotice = isClosedDay && currentFilterMode === 'today'
          ? `<div style="margin-top:0.75rem; padding:0.6rem 1rem; background:rgba(239,68,68,0.08); color:var(--color-error); border-radius:var(--radius-md); font-size:0.85rem; display:inline-flex; align-items:center; gap:0.4rem;"><span class="material-symbols-outlined text-[18px]">event_busy</span><span><strong>Clinic is closed today.</strong> Consultations resume on the next working day.</span></div>`
          : '';
        const emptyHtml = `<div style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted); background:#FFFFFF; border-radius:var(--radius-lg); border:1px dashed var(--color-outline-variant);"><span class="material-symbols-outlined text-[32px]" style="color:#94A3B8;">event_available</span><p style="margin-top:0.5rem; font-size:0.95rem; font-weight:600;">No appointments found for this filter.</p>${closedNotice}</div>`;
        if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No appointments found for this filter.${closedNotice ? '<br/>' + closedNotice : ''}</td></tr>`;
        if (mobileCards) mobileCards.innerHTML = emptyHtml;
        return;
      }

      if (countBadge) {
        countBadge.textContent = `${data.length} Patient${data.length === 1 ? '' : 's'}`;
      }

      // 1. Desktop Table Rows (contained, responsive)
      if (tbody) {
        tbody.innerHTML = data.map((apt, index) => {
          const isTarget = targetAptId === apt.id;
          return `
            <tr id="apt-row-${apt.id}" class="admin-apt-row ${isTarget ? 'highlight-target' : ''}">
              <td>
                <span class="queue-num-chip">#${apt.queue_number || (index + 1)}</span>
              </td>
              <td>
                <strong style="color:var(--color-primary); font-size:0.95rem;">${formatDisplayTime(apt.appointment_time)}</strong>
              </td>
              <td>
                <div style="font-weight:700; color:var(--color-primary); font-size:0.95rem;">${apt.patient_name}</div>
                <div style="font-size:0.8rem; color:var(--text-muted); display:flex; align-items:center; gap:0.4rem; margin-top:0.2rem;">
                  <span>📞 <a href="tel:${apt.patient_phone}" style="color:var(--color-secondary); font-weight:600;">${apt.patient_phone}</a></span>
                  ${apt.patient_email ? `<span>• ✉️ ${apt.patient_email}</span>` : ''}
                </div>
                ${apt.message ? `<div style="font-size:0.75rem; color:#64748B; font-style:italic; margin-top:0.25rem;">"${apt.message}"</div>` : ''}
              </td>
              <td>
                <span style="font-size:0.88rem; font-weight:600; color:var(--color-primary);">${apt.treatment_name}</span>
              </td>
              <td>
                <span style="font-size:0.82rem; color:var(--text-muted);">${formatDisplayDate(apt.appointment_date)}</span>
              </td>
              <td>
                <span class="status-badge ${apt.status}">● ${apt.status}</span>
              </td>
              <td>
                <div class="desktop-action-cell">
                  ${renderActionButtons(apt)}
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }

      // 2. Mobile Responsive Cards (100% contained, zero button overflow)
      if (mobileCards) {
        mobileCards.innerHTML = data.map((apt, index) => {
          const isTarget = targetAptId === apt.id;
          return `
            <div id="apt-card-${apt.id}" class="admin-apt-card ${isTarget ? 'highlight-target' : ''}">
              <!-- Top Card Bar: Queue #, Date & Status -->
              <div class="admin-apt-card-header">
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <span class="queue-num-chip">#${apt.queue_number || (index + 1)}</span>
                  <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">
                    ${formatDisplayDate(apt.appointment_date)}
                  </span>
                </div>
                <span class="status-badge ${apt.status}">● ${apt.status}</span>
              </div>

              <!-- Main Body: Patient Details & Timetable -->
              <div class="admin-apt-card-body">
                <div class="apt-card-patient-name">${apt.patient_name}</div>
                <div class="apt-card-meta-row">
                  <span class="apt-card-time">
                    <span class="material-symbols-outlined text-[16px]">schedule</span>
                    ${formatDisplayTime(apt.appointment_time)}
                  </span>
                  <span class="apt-card-treatment">
                    <span class="material-symbols-outlined text-[16px]">dentistry</span>
                    ${apt.treatment_name}
                  </span>
                </div>

                <!-- Doctor Contact Action for Patient -->
                <div class="apt-patient-contact-row">
                  <a href="tel:${apt.patient_phone}" class="btn btn-outline btn-sm patient-contact-btn" title="Call patient">
                    <span class="material-symbols-outlined text-[15px]">call</span>
                    <span>${apt.patient_phone}</span>
                  </a>
                  <a href="https://wa.me/91${apt.patient_phone}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm patient-contact-btn" title="Message on WhatsApp">
                    <span>💬 WhatsApp</span>
                  </a>
                </div>

                ${apt.message ? `
                  <div class="apt-card-notes">
                    <span style="font-weight:700;">Note:</span> "${apt.message}"
                  </div>
                ` : ''}
              </div>

              <!-- Action Buttons (Guaranteed inside card, no overflow) -->
              <div class="apt-action-container">
                ${renderActionButtons(apt)}
              </div>
            </div>
          `;
        }).join('');
      }

      // Auto-scroll to target appointment if opened via notification link
      if (targetAptId) {
        setTimeout(() => {
          const targetEl = document.getElementById(`apt-card-${targetAptId}`) || document.getElementById(`apt-row-${targetAptId}`);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetEl.classList.add('pulse-highlight');
          }
        }, 150);
      }

      // Attach action listeners
      attachActionButtonListeners(loadAppointments);
    }

    function renderActionButtons(apt) {
      if (apt.status === 'pending') {
        return `
          <div class="apt-btn-pair">
            <button class="btn btn-primary action-btn btn-accept" data-id="${apt.id}" data-action="confirmed">
              <span class="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Accept</span>
            </button>
            <button class="btn btn-outline action-btn btn-reject" data-id="${apt.id}" data-action="rejected">
              <span class="material-symbols-outlined text-[18px]">cancel</span>
              <span>Reject</span>
            </button>
          </div>
        `;
      }

      if (apt.status === 'confirmed') {
        return `
          <div class="apt-btn-pair">
            <button class="btn btn-outline action-btn btn-arrived" data-id="${apt.id}" data-action="arrived">
              <span class="material-symbols-outlined text-[18px]">how_to_reg</span>
              <span>Mark Arrived</span>
            </button>
            <button class="btn btn-outline action-btn btn-cancel" data-id="${apt.id}" data-action="cancelled">
              <span class="material-symbols-outlined text-[18px]">close</span>
              <span>Cancel</span>
            </button>
          </div>
        `;
      }

      if (apt.status === 'arrived') {
        return `
          <button class="btn btn-primary action-btn btn-start-consult" data-id="${apt.id}" data-action="in_consultation" style="width:100%;">
            <span class="material-symbols-outlined text-[18px]">medical_services</span>
            <span>Start Consultation</span>
          </button>
        `;
      }

      if (apt.status === 'in_consultation') {
        return `
          <button class="btn btn-primary action-btn btn-complete" data-id="${apt.id}" data-action="completed" style="width:100%;">
            <span class="material-symbols-outlined text-[18px]">task_alt</span>
            <span>Mark Completed</span>
          </button>
        `;
      }

      return `
        <div style="font-size:0.8rem; color:#94A3B8; text-align:center; padding:0.4rem; width:100%;">
          ✓ Record Finished (${apt.status})
        </div>
      `;
    }

    function attachActionButtonListeners(reloadCallback) {
      document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const aptId = btn.dataset.id;
          const newStatus = btn.dataset.action;
          let rejectionReason = null;

          if (newStatus === 'rejected') {
            rejectionReason = prompt('Reason for not accepting (optional):', 'Slot unavailable / Doctor on emergency surgery');
            if (rejectionReason === null) return; // User pressed Cancel
          }

          const originalText = btn.innerHTML;
          btn.disabled = true;
          btn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span><span>Saving...</span>';

          try {
            const updates = { status: newStatus, updated_at: new Date().toISOString() };
            if (rejectionReason) updates.rejection_reason = rejectionReason;

            const { error } = await supabase
              .from('appointments')
              .update(updates)
              .eq('id', aptId);

            if (error) throw error;

            // Notify PATIENT (does NOT show local notification on doctor's own device)
            const currentApt = currentAppointmentsMap.get(aptId);
            await NotificationService.notifyPatientStatusChange(
              currentApt || { id: aptId },
              newStatus,
              rejectionReason
            );

            NotificationService.showToast(`Status updated to ${newStatus}. Patient notified!`, 'success');

            reloadCallback();
          } catch (e) {
            alert('Could not update status: ' + e.message);
            btn.disabled = false;
            btn.innerHTML = originalText;
          }
        });
      });
    }

    async function updateTodayMetrics() {
      const todayStr = getLocalDateString();

      try {
        const { data: allAppointments, error } = await supabase
          .from('appointments')
          .select('status, appointment_date');

        if (error || !allAppointments) return;

        // Today's appointments
        const todayApts = allAppointments.filter(a => a.appointment_date === todayStr);

        // Overall pending reviews in the clinic (or today's if today has pending)
        const totalPending = allAppointments.filter(a => a.status === 'pending').length;
        const todayPending = todayApts.filter(a => a.status === 'pending').length;
        const pendingCount = todayPending > 0 ? todayPending : totalPending;

        // Confirmed appointments (today's confirmed, or total confirmed if today is 0)
        const totalConfirmed = allAppointments.filter(a => a.status === 'confirmed').length;
        const todayConfirmed = todayApts.filter(a => a.status === 'confirmed').length;
        const confirmedCount = todayConfirmed > 0 ? todayConfirmed : totalConfirmed;

        // Arrived in clinic (today's arrived, or total arrived if today is 0)
        const totalArrived = allAppointments.filter(a => a.status === 'arrived').length;
        const todayArrived = todayApts.filter(a => a.status === 'arrived').length;
        const arrivedCount = todayArrived > 0 ? todayArrived : totalArrived;

        // In consultation (today's in_consultation, or active in_consultation)
        const totalInConsult = allAppointments.filter(a => a.status === 'in_consultation').length;
        const todayInConsult = todayApts.filter(a => a.status === 'in_consultation').length;
        const inConsultCount = todayInConsult > 0 ? todayInConsult : totalInConsult;

        // Completed (today's completed, or recent completed)
        const totalCompleted = allAppointments.filter(a => a.status === 'completed').length;
        const todayCompleted = todayApts.filter(a => a.status === 'completed').length;
        const completedCount = todayCompleted > 0 ? todayCompleted : totalCompleted;

        const elTotal = document.getElementById('metric-total');
        const elPending = document.getElementById('metric-pending');
        const elConfirmed = document.getElementById('metric-confirmed');
        const elArrived = document.getElementById('metric-arrived');
        const elInConsult = document.getElementById('metric-in-consult');
        const elCompleted = document.getElementById('metric-completed');

        if (elTotal) elTotal.textContent = todayApts.length;
        if (elPending) elPending.textContent = pendingCount;
        if (elConfirmed) elConfirmed.textContent = confirmedCount;
        if (elArrived) elArrived.textContent = arrivedCount;
        if (elInConsult) elInConsult.textContent = inConsultCount;
        if (elCompleted) elCompleted.textContent = completedCount;
      } catch (err) {
        console.error('Error updating metrics:', err);
      }
    }

    // Filter Buttons Click Handling
    document.querySelectorAll('.date-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.date-filter-btn').forEach(b => {
          b.classList.remove('btn-primary', 'active');
          b.classList.add('btn-outline');
        });
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary', 'active');

        // Synchronize active metric card
        document.querySelectorAll('.clickable-metric').forEach(c => {
          if (c.dataset.filter === btn.dataset.mode) {
            c.classList.add('active-metric');
          } else {
            c.classList.remove('active-metric');
          }
        });

        currentFilterMode = btn.dataset.mode;
        loadAppointments();
      });
    });

    // Clickable Metric Cards
    document.querySelectorAll('.clickable-metric').forEach(card => {
      card.addEventListener('click', () => {
        const filter = card.dataset.filter;

        // Highlight this metric card
        document.querySelectorAll('.clickable-metric').forEach(c => c.classList.remove('active-metric'));
        card.classList.add('active-metric');

        // Synchronize with filter pills
        document.querySelectorAll('.date-filter-btn').forEach(b => {
          if (b.dataset.mode === filter) {
            b.classList.remove('btn-outline');
            b.classList.add('btn-primary', 'active');
          } else {
            b.classList.remove('btn-primary', 'active');
            b.classList.add('btn-outline');
          }
        });

        currentFilterMode = filter;
        loadAppointments();
      });
    });

    // Default activate today metric card on load
    const defaultMetricCard = document.querySelector(`.clickable-metric[data-filter="${currentFilterMode}"]`);
    if (defaultMetricCard) defaultMetricCard.classList.add('active-metric');

    datePicker.addEventListener('change', () => {
      document.querySelectorAll('.date-filter-btn').forEach(b => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-outline');
      });
      document.querySelectorAll('.clickable-metric').forEach(c => c.classList.remove('active-metric'));
      currentFilterMode = 'custom';
      loadAppointments();
    });

    if (refreshBtn) refreshBtn.addEventListener('click', loadAppointments);

    loadAppointments(); // Initial load

    // Supabase Realtime Channels for Live Appointments & Doctor Notifications
    if (window.__dp_admin_channels) {
      window.__dp_admin_channels.forEach(ch => supabase.removeChannel(ch));
      window.__dp_admin_channels = [];
    }
    window.__dp_admin_channels = [];

    // 1. Channel for appointments (live queue updates upon booking or status changes)
    const appointmentsRealtimeChannel = supabase
      .channel('doctor-appointments-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('Realtime appointment change event received:', payload);
          loadAppointments();
          updateTodayMetrics();
          if (payload.eventType === 'INSERT') {
            playNotificationChime('doctor');
            NotificationService.showToast(
              `🔔 New Appointment Booked: ${payload.new.patient_name} (${payload.new.treatment_name})`,
              'info'
            );
          }
        }
      )
      .subscribe();

    // 2. Channel for doctor notifications
    const notificationsRealtimeChannel = supabase
      .channel('doctor-notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'recipient_role=eq.doctor'
        },
        (payload) => {
          console.log('Realtime doctor notification received:', payload);
          playNotificationChime('doctor');
          NotificationService.showLocalNotification(
            payload.new.title,
            payload.new.body,
            payload.new.target_url
          );
          window.dispatchEvent(new CustomEvent('dp-notification-updated'));
        }
      )
      .subscribe();

    window.__dp_admin_channels.push(appointmentsRealtimeChannel, notificationsRealtimeChannel);

    // Clean up channels on navigation
    const handlePopStateCleanup = () => {
      if (!window.location.pathname.startsWith('/doctor-dashboard')) {
        if (window.__dp_admin_channels) {
          window.__dp_admin_channels.forEach(ch => supabase.removeChannel(ch));
          window.__dp_admin_channels = [];
        }
        window.removeEventListener('popstate', handlePopStateCleanup);
      }
    };
    window.addEventListener('popstate', handlePopStateCleanup);
  }
}
