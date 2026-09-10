import { supabase } from '../services/supabase.js';
import { formatDisplayDate, formatDisplayTime } from '../utils/schedule.js';
import { NotificationService } from '../services/notifications.js';

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
  const todayStr = new Date().toISOString().split('T')[0];

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

  if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
      signoutBtn.disabled = true;
      signoutBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span><span>Signing Out...</span>';
      await supabase.auth.signOut();
      window.history.replaceState({}, '', '/doctor-login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  }

  if (pushBtn) {
    pushBtn.addEventListener('click', async () => {
      const res = await NotificationService.requestPermissionAndRegister('doctor', 'doctor-primary');
      if (res) {
        alert('Doctor Push Notifications successfully enabled on this device!');
      } else {
        alert('Could not enable push notifications. Please check browser permission settings.');
      }
    });
  }

  if (datePicker) {
    let currentFilterMode = 'today';

    async function loadAppointments() {
      const tbody = document.getElementById('appointments-tbody');
      const mobileCards = document.getElementById('appointments-mobile-cards');
      const countBadge = document.getElementById('queue-count-badge');
      const titleEl = document.getElementById('queue-view-title');

      const loadingMsg = '<div style="text-align:center; padding:2rem 0; color:var(--color-secondary);"><span class="material-symbols-outlined text-[28px] animate-spin">sync</span><p style="margin-top:0.5rem; font-size:0.9rem;">Updating patient queue...</p></div>';
      if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1.5rem;">Updating list...</td></tr>';
      if (mobileCards) mobileCards.innerHTML = loadingMsg;

      const todayStr = new Date().toISOString().split('T')[0];
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
      } else if (currentFilterMode === 'tomorrow') {
        if (titleEl) titleEl.textContent = "Tomorrow's Schedule";
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        query = query.eq('appointment_date', tomorrow.toISOString().split('T')[0]);
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

      // Update metrics for today
      updateTodayMetrics();

      if (!data || data.length === 0) {
        if (countBadge) countBadge.textContent = '0 Patients';
        const emptyHtml = '<div style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted); background:#FFFFFF; border-radius:var(--radius-lg); border:1px dashed var(--color-outline-variant);"><span class="material-symbols-outlined text-[32px]" style="color:#94A3B8;">event_available</span><p style="margin-top:0.5rem; font-size:0.95rem; font-weight:600;">No appointments found for this filter.</p></div>';
        if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No appointments found for this filter.</td></tr>';
        if (mobileCards) mobileCards.innerHTML = emptyHtml;
        return;
      }

      if (countBadge) countBadge.textContent = `${data.length} Patient${data.length > 1 ? 's' : ''}`;

      // 1. Desktop Table Rows (contained, responsive)
      if (tbody) {
        tbody.innerHTML = data.map((apt, index) => {
          return `
            <tr>
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
          return `
            <div class="admin-apt-card">
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

            NotificationService.showLocalNotification(
              'Appointment Status Updated',
              `Appointment #${aptId} is now ${newStatus}.`,
              `/appointment-status?id=${aptId}`
            );

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
      const todayStr = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('appointments')
        .select('status')
        .eq('appointment_date', todayStr);

      if (data) {
        document.getElementById('metric-total').textContent = data.length;
        document.getElementById('metric-pending').textContent = data.filter(d => d.status === 'pending').length;
        document.getElementById('metric-confirmed').textContent = data.filter(d => d.status === 'confirmed').length;
        document.getElementById('metric-arrived').textContent = data.filter(d => d.status === 'arrived').length;
        document.getElementById('metric-in-consult').textContent = data.filter(d => d.status === 'in_consultation').length;
        document.getElementById('metric-completed').textContent = data.filter(d => d.status === 'completed').length;
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

        currentFilterMode = btn.dataset.mode;
        loadAppointments();
      });
    });

    // Clickable Metric Cards
    document.querySelectorAll('.clickable-metric').forEach(card => {
      card.addEventListener('click', () => {
        const filter = card.dataset.filter;
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

    datePicker.addEventListener('change', () => {
      document.querySelectorAll('.date-filter-btn').forEach(b => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-outline');
      });
      currentFilterMode = 'custom';
      loadAppointments();
    });

    if (refreshBtn) refreshBtn.addEventListener('click', loadAppointments);

    loadAppointments(); // Initial load
  }
}
