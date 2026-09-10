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
          The account <strong>${session.user.email}</strong> is not permitted. Only Dr. Supriyo Sahu can access this dashboard.
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

  return renderDashboardView(normalizedUserEmail, clinicSettings);
}

function renderLoginView() {
  return `
    <div class="container section" style="max-width:480px; margin:4rem auto; text-align:center;">
      <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-xl); padding:3rem; box-shadow:var(--shadow-lg);">
        <img src="/favicon.svg" alt="Dental Paradise" style="width:56px; height:56px; margin:0 auto 1.5rem;" />
        <span class="section-tag">Staff Portal</span>
        <h1 style="font-size:1.8rem; margin-bottom:0.5rem;">Doctor & Admin Login</h1>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:2rem;">
          Sign in with your authorized Google Account to manage the clinical appointment queue and schedule.
        </p>

        <button id="google-login-btn" class="btn btn-secondary btn-lg" style="width:100%; display:flex; gap:0.75rem; justify-content:center;">
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.56 0 2.97.55 4.08 1.45l3.05-3.05C17.29 1.7 14.84 1 12 1 7.5 1 3.65 3.56 1.77 7.28l3.66 2.84C6.31 7.15 8.92 5 12 5z"/><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.69-4.97 3.69-8.71z"/><path fill="#FBBC05" d="M5.43 14.88c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.77 7.48C.64 9.74 0 12.3 0 15s.64 5.26 1.77 7.52l3.66-2.84z"/><path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.73-2.89c-1.07.73-2.45 1.16-4.2 1.16-3.08 0-5.69-2.15-6.57-5.12L1.77 16.08C3.65 19.8 7.5 23 12 23z"/></svg>
          <span>Sign In with Google</span>
        </button>

        <div style="margin-top:1.5rem; font-size:0.8rem; color:#94A3B8;">
          Authorized email accounts only. Patient appointments cannot be managed without verified credentials.
        </div>
      </div>
    </div>
  `;
}

function renderUnauthorizedView(email) {
  return `
    <div class="container section" style="max-width:540px; margin:4rem auto; text-align:center;">
      <div style="background:#FFFFFF; border:1px solid #FCA5A5; border-radius:var(--radius-xl); padding:3rem; box-shadow:var(--shadow-lg);">
        <div style="font-size:3rem; margin-bottom:1rem;">🚫</div>
        <h2 style="color:#DC2626; font-size:1.8rem; margin-bottom:0.75rem;">Access Denied</h2>
        <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem;">
          The signed-in account <strong>${email}</strong> is not in the authorized doctor/staff administrator list for Dental Paradise.
        </p>
        <p style="font-size:0.85rem; color:#64748B; margin-bottom:2rem;">
          To grant access, add this email to the <code>authorized_admin_emails</code> list in Supabase.
        </p>
        <button id="admin-signout-btn" class="btn btn-secondary">
          <span>Sign Out / Switch Account</span>
        </button>
      </div>
    </div>
  `;
}

function renderDashboardView(userEmail, settings) {
  const todayStr = new Date().toISOString().split('T')[0];

  return `
    <div class="admin-container">
      <div class="admin-header">
        <div>
          <span class="section-tag">Clinical Administration</span>
          <h1 style="font-size:2.2rem; margin-top:0.25rem;">Doctor Appointment Queue</h1>
          <p style="color:var(--text-muted); font-size:0.9rem;">
            Logged in as <strong>${userEmail}</strong> • Real-time clinical queue & schedule controls
          </p>
        </div>
        <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;">
          <button id="btn-request-push" class="btn btn-outline btn-sm">🔔 Enable Doctor Push Alerts</button>
          <button id="admin-signout-btn" class="btn btn-secondary btn-sm">Sign Out</button>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="metric-grid" id="admin-metrics">
        <div class="metric-card">
          <h3 id="metric-total">0</h3>
          <p>Today's Total</p>
        </div>
        <div class="metric-card" style="border-left:4px solid var(--status-pending);">
          <h3 id="metric-pending" style="color:var(--status-pending);">0</h3>
          <p>Pending Review</p>
        </div>
        <div class="metric-card" style="border-left:4px solid var(--status-confirmed);">
          <h3 id="metric-confirmed" style="color:var(--status-confirmed);">0</h3>
          <p>Confirmed</p>
        </div>
        <div class="metric-card" style="border-left:4px solid var(--status-arrived);">
          <h3 id="metric-arrived" style="color:var(--status-arrived);">0</h3>
          <p>Arrived in Clinic</p>
        </div>
        <div class="metric-card" style="border-left:4px solid var(--status-in-consult);">
          <h3 id="metric-in-consult" style="color:var(--status-in-consult);">0</h3>
          <p>In Consultation</p>
        </div>
        <div class="metric-card" style="border-left:4px solid var(--status-completed);">
          <h3 id="metric-completed" style="color:var(--status-completed);">0</h3>
          <p>Completed</p>
        </div>
      </div>

      <!-- Date Filter Bar -->
      <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
          <strong style="font-size:0.9rem; color:var(--color-secondary); margin-right:0.5rem;">Filter Appointments:</strong>
          <button class="btn btn-primary btn-sm date-filter-btn" data-mode="today">Today</button>
          <button class="btn btn-outline btn-sm date-filter-btn" data-mode="tomorrow">Tomorrow</button>
          <button class="btn btn-outline btn-sm date-filter-btn" data-mode="upcoming">All Upcoming</button>
          <button class="btn btn-outline btn-sm date-filter-btn" data-mode="previous">Previous History</button>
        </div>

        <div style="display:flex; gap:0.5rem; align-items:center;">
          <label style="font-size:0.85rem; color:var(--text-muted);">Specific Date:</label>
          <input type="date" id="admin-date-picker" class="form-control" style="padding:0.4rem 0.65rem; font-size:0.85rem; width:auto;" value="${todayStr}" />
          <button id="btn-refresh-queue" class="btn btn-outline btn-sm" title="Refresh list">🔄</button>
        </div>
      </div>

      <!-- Appointments Queue Table (Desktop View) -->
      <div class="admin-table-wrapper">
        <table class="admin-table" id="admin-appointments-table">
          <thead>
            <tr>
              <th>Queue #</th>
              <th>Time</th>
              <th>Patient Details</th>
              <th>Treatment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="appointments-tbody">
            <tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--color-primary);">Loading appointments queue...</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Appointments Queue Cards (Shown on mobile devices <= 768px) -->
      <div class="admin-mobile-cards" id="appointments-mobile-cards">
        <div style="text-align:center; padding:2rem 0; color:var(--color-primary);">Loading appointments queue...</div>
      </div>

      <!-- Quick Schedule Settings Section -->
      <div class="responsive-card-box" style="margin-top:3.5rem;">
        <span class="section-tag">Clinical Controls</span>
        <h2 style="font-size:1.6rem; margin-bottom:0.5rem;">Schedule & Clinic Configuration</h2>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">
          Enforce working days, adjust slot intervals, and update direct patient contact channels.
        </p>

        <div class="responsive-cards-grid">
          <div style="background:var(--bg-main); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
            <h4 style="font-size:1rem; margin-bottom:0.75rem;">Days & Hours Rule</h4>
            <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.6;">
              • <strong>Monday & Friday:</strong> Hard-coded CLOSED<br/>
              • <strong>Tue, Wed, Thu, Sat, Sun:</strong> 8 AM–12 PM & 4 PM–8 PM<br/>
              • <strong>Default Slot:</strong> 30 Minutes<br/>
              • <strong>Same-Day Notice:</strong> 30 Minutes
            </p>
          </div>

          <div style="background:var(--bg-main); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
            <h4 style="font-size:1rem; margin-bottom:0.75rem;">Clinic Phone & WhatsApp</h4>
            <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.6;">
              • <strong>Calling Number:</strong> 9733835105<br/>
              • <strong>WhatsApp Number:</strong> 9733835105<br/>
              • <strong>Location:</strong> Math Chandipur Market, Behind Life Care Diagnostic Center (PIN 721659)
            </p>
          </div>

          <div style="background:var(--bg-main); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-light);">
            <h4 style="font-size:1rem; margin-bottom:0.75rem;">Authorized Administrators</h4>
            <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.6;">
              ${(settings?.authorized_admin_emails || ['hiswaruppal1916@gmail.com']).join('<br/>• ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initAdminEvents() {
  const loginBtn = document.getElementById('google-login-btn');
  const signoutBtn = document.getElementById('admin-signout-btn');
  const datePicker = document.getElementById('admin-date-picker');
  const refreshBtn = document.getElementById('btn-refresh-queue');
  const pushBtn = document.getElementById('btn-request-push');

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      loginBtn.disabled = true;
      loginBtn.innerHTML = 'Connecting to Google...';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/admin'
        }
      });
      if (error) {
        alert('Login failed: ' + error.message);
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'Sign In with Google';
      }
    });
  }

  if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
      signoutBtn.disabled = true;
      signoutBtn.innerHTML = 'Signing Out...';
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
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:1.5rem;">Updating list...</td></tr>';

      const todayStr = new Date().toISOString().split('T')[0];
      let query = supabase.from('appointments').select('*');

      if (currentFilterMode === 'today') {
        query = query.eq('appointment_date', todayStr);
      } else if (currentFilterMode === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        query = query.eq('appointment_date', tomorrow.toISOString().split('T')[0]);
      } else if (currentFilterMode === 'upcoming') {
        query = query.gte('appointment_date', todayStr);
      } else if (currentFilterMode === 'previous') {
        query = query.lt('appointment_date', todayStr);
      } else if (currentFilterMode === 'custom') {
        query = query.eq('appointment_date', datePicker.value);
      }

      // Order by appointment date, time, and creation time
      query = query
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })
        .order('created_at', { ascending: true });

      const { data, error } = await query;

      if (error) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#EF4444; padding:1.5rem;">Failed to load queue: ${error.message}</td></tr>`;
        return;
      }

      // Update metrics for today
      updateTodayMetrics();

      const mobileCards = document.getElementById('appointments-mobile-cards');

      if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No appointments found for this filter.</td></tr>';
        if (mobileCards) mobileCards.innerHTML = '<div style="text-align:center; padding:2rem 0; color:var(--text-muted);">No appointments found for this filter.</div>';
        return;
      }

      // 1. Desktop Table Rows
      tbody.innerHTML = data.map((apt, index) => {
        return `
          <tr>
            <td>
              <span style="font-weight:800; font-size:1.1rem; color:var(--color-primary);">#${apt.queue_number || (index + 1)}</span>
            </td>
            <td>
              <strong>${formatDisplayTime(apt.appointment_time)}</strong>
            </td>
            <td>
              <div style="font-weight:700; color:var(--color-secondary);">${apt.patient_name}</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">
                📞 <a href="tel:${apt.patient_phone}" style="color:var(--color-primary); font-weight:600;">${apt.patient_phone}</a>
                ${apt.patient_email ? ` • ✉️ ${apt.patient_email}` : ''}
              </div>
              ${apt.message ? `<div style="font-size:0.78rem; color:#64748B; font-style:italic; margin-top:0.25rem;">"${apt.message}"</div>` : ''}
            </td>
            <td>
              <span style="font-size:0.9rem; font-weight:600;">${apt.treatment_name}</span>
            </td>
            <td>
              <span style="font-size:0.85rem; color:var(--text-muted);">${formatDisplayDate(apt.appointment_date)}</span>
            </td>
            <td>
              <span class="status-badge ${apt.status}">● ${apt.status}</span>
            </td>
            <td>
              <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                ${apt.status === 'pending' ? `
                  <button class="btn btn-primary btn-sm action-btn" data-id="${apt.id}" data-action="confirmed">Accept</button>
                  <button class="btn btn-outline btn-sm action-btn" data-id="${apt.id}" data-action="rejected" style="border-color:#EF4444; color:#EF4444;">Reject</button>
                ` : ''}

                ${apt.status === 'confirmed' ? `
                  <button class="btn btn-outline btn-sm action-btn" data-id="${apt.id}" data-action="arrived" style="border-color:#3B82F6; color:#3B82F6;">Mark Arrived</button>
                  <button class="btn btn-outline btn-sm action-btn" data-id="${apt.id}" data-action="cancelled" style="border-color:#6B7280; color:#6B7280;">Cancel</button>
                ` : ''}

                ${apt.status === 'arrived' ? `
                  <button class="btn btn-primary btn-sm action-btn" data-id="${apt.id}" data-action="in_consultation" style="background:#8B5CF6;">Start Consult</button>
                ` : ''}

                ${apt.status === 'in_consultation' ? `
                  <button class="btn btn-primary btn-sm action-btn" data-id="${apt.id}" data-action="completed" style="background:#059669;">Mark Completed</button>
                ` : ''}

                ${apt.status === 'completed' || apt.status === 'rejected' || apt.status === 'cancelled' ? `
                  <span style="font-size:0.75rem; color:#94A3B8;">Done</span>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('');

      // 2. Mobile Responsive Cards
      if (mobileCards) {
        mobileCards.innerHTML = data.map((apt, index) => {
          return `
            <div class="admin-apt-card">
              <div class="admin-apt-card-header">
                <div>
                  <span style="font-weight:800; font-size:1.25rem; color:var(--color-primary);">#${apt.queue_number || (index + 1)}</span>
                  <span style="font-size:0.8rem; color:var(--text-light); margin-left:0.5rem;">${formatDisplayDate(apt.appointment_date)}</span>
                </div>
                <span class="status-badge ${apt.status}">● ${apt.status}</span>
              </div>

              <div class="admin-apt-card-body">
                <div style="font-size:1.05rem; font-weight:700; color:var(--color-secondary);">${apt.patient_name}</div>
                <div style="font-size:0.88rem; color:var(--color-primary); font-weight:600;">⏰ ${formatDisplayTime(apt.appointment_time)} • 🦷 ${apt.treatment_name}</div>
                <div style="display:flex; gap:0.75rem; align-items:center; margin-top:0.25rem;">
                  <a href="tel:${apt.patient_phone}" class="btn btn-outline btn-sm" style="flex:1;">📞 Call ${apt.patient_phone}</a>
                  <a href="https://wa.me/91${apt.patient_phone}" target="_blank" class="btn btn-whatsapp btn-sm" style="flex:1;">💬 WhatsApp</a>
                </div>
                ${apt.message ? `<div style="font-size:0.8rem; color:#64748B; font-style:italic; background:var(--bg-main); padding:0.5rem; border-radius:var(--radius-sm); margin-top:0.4rem;">"${apt.message}"</div>` : ''}
              </div>

              <div class="admin-apt-card-actions">
                ${apt.status === 'pending' ? `
                  <button class="btn btn-primary btn-sm action-btn" data-id="${apt.id}" data-action="confirmed">✓ Accept</button>
                  <button class="btn btn-outline btn-sm action-btn" data-id="${apt.id}" data-action="rejected" style="border-color:#EF4444; color:#EF4444;">✕ Reject</button>
                ` : ''}

                ${apt.status === 'confirmed' ? `
                  <button class="btn btn-outline btn-sm action-btn" data-id="${apt.id}" data-action="arrived" style="border-color:#3B82F6; color:#3B82F6;">Mark Arrived</button>
                  <button class="btn btn-outline btn-sm action-btn" data-id="${apt.id}" data-action="cancelled" style="border-color:#6B7280; color:#6B7280;">Cancel</button>
                ` : ''}

                ${apt.status === 'arrived' ? `
                  <button class="btn btn-primary btn-sm action-btn" data-id="${apt.id}" data-action="in_consultation" style="background:#8B5CF6; color:#FFFFFF;">Start Consult</button>
                ` : ''}

                ${apt.status === 'in_consultation' ? `
                  <button class="btn btn-primary btn-sm action-btn" data-id="${apt.id}" data-action="completed" style="background:#059669; color:#FFFFFF;">Mark Completed</button>
                ` : ''}

                ${apt.status === 'completed' || apt.status === 'rejected' || apt.status === 'cancelled' ? `
                  <span style="font-size:0.8rem; color:#94A3B8; padding:0.4rem;">Status Finished</span>
                ` : ''}
              </div>
            </div>
          `;
        }).join('');
      }


      // Attach action listeners
      document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const aptId = btn.dataset.id;
          const newStatus = btn.dataset.action;
          let rejectionReason = null;

          if (newStatus === 'rejected') {
            rejectionReason = prompt('Reason for not accepting (optional):', 'Slot unavailable / Doctor on emergency surgery');
          }

          btn.disabled = true;
          try {
            const updates = { status: newStatus, updated_at: new Date().toISOString() };
            if (rejectionReason) updates.rejection_reason = rejectionReason;

            await supabase
              .from('appointments')
              .update(updates)
              .eq('id', aptId);

            NotificationService.showLocalNotification(
              'Appointment Status Updated',
              `Appointment ${aptId} status changed to ${newStatus}.`,
              `/appointment-status?id=${aptId}`
            );

            loadAppointments();
          } catch (e) {
            alert('Could not update status: ' + e.message);
            btn.disabled = false;
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

    // Filter Buttons
    document.querySelectorAll('.date-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.date-filter-btn').forEach(b => {
          b.classList.remove('btn-primary');
          b.classList.add('btn-outline');
        });
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-primary');

        currentFilterMode = btn.dataset.mode;
        loadAppointments();
      });
    });

    datePicker.addEventListener('change', () => {
      document.querySelectorAll('.date-filter-btn').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
      });
      currentFilterMode = 'custom';
      loadAppointments();
    });

    if (refreshBtn) refreshBtn.addEventListener('click', loadAppointments);

    loadAppointments(); // Initial queue load
  }
}
