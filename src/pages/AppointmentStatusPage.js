import { supabase } from '../services/supabase.js';
import { formatDisplayDate, formatDisplayTime } from '../utils/schedule.js';

export function renderAppointmentStatusPage() {
  const params = new URLSearchParams(window.location.search);
  const initialId = params.get('id') || localStorage.getItem('last_apt_id') || '';
  const initialPhone = params.get('phone') || localStorage.getItem('last_apt_phone') || '';

  return `
    <div class="container section">
      <div class="status-lookup-card">
        <div style="text-align:center; margin-bottom:2rem;">
          <span class="section-tag">Patient Portal</span>
          <h1 style="font-size:2.2rem; margin-bottom:0.5rem;">Check Appointment Status</h1>
          <p style="color:var(--text-muted); font-size:0.92rem;">
            Enter your Appointment ID and registered Mobile Number to track your queue position and doctor confirmation.
          </p>
        </div>

        <form id="status-lookup-form" style="margin-bottom:2rem;">
          <div class="form-group">
            <label class="form-label">Appointment ID *</label>
            <input type="text" id="lookup-id" class="form-control" placeholder="e.g. APT-20260910-1234" value="${initialId}" required />
          </div>

          <div class="form-group">
            <label class="form-label">Registered 10-Digit Mobile Number *</label>
            <input type="tel" id="lookup-phone" class="form-control" placeholder="Mobile number used while booking" value="${initialPhone}" pattern="[0-9]{10}" required />
          </div>

          <button type="submit" id="lookup-submit-btn" class="btn btn-primary" style="width:100%;">
            <span>Track My Appointment</span>
          </button>
        </form>

        <!-- Result Container -->
        <div id="status-result-container" style="display:none;"></div>
      </div>
    </div>
  `;
}

export function initAppointmentStatusEvents() {
  const form = document.getElementById('status-lookup-form');
  const resultBox = document.getElementById('status-result-container');
  const submitBtn = document.getElementById('lookup-submit-btn');

  if (!form) return;

  async function performLookup(aptId, phone) {
    resultBox.style.display = 'block';
    resultBox.innerHTML = '<div style="text-align:center; padding:1.5rem; color:var(--color-primary);">Fetching appointment details...</div>';

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', aptId)
        .eq('patient_phone', phone)
        .maybeSingle();

      if (error || !data) {
        resultBox.innerHTML = `
          <div style="background:#FEE2E2; border:1px solid #FECACA; border-radius:var(--radius-md); padding:1.25rem; color:#991B1B; text-align:center;">
            <strong>No appointment found.</strong>
            <p style="font-size:0.85rem; margin-top:0.35rem;">
              Please check that your Appointment ID and Mobile Number are typed correctly. Patient privacy is strictly protected.
            </p>
          </div>
        `;
        return;
      }

      // Map status badge
      let statusLabel = data.status;
      let statusDesc = '';

      switch (data.status) {
        case 'pending':
          statusLabel = 'Pending Review';
          statusDesc = 'Your booking request is submitted and awaiting review by Dr. Supriyo Sahu.';
          break;
        case 'confirmed':
          statusLabel = 'Confirmed';
          statusDesc = 'Your appointment has been approved! Please arrive 10 minutes before your slot.';
          break;
        case 'arrived':
          statusLabel = 'Patient Arrived';
          statusDesc = 'You are checked in at the clinic reception. The doctor will call you shortly.';
          break;
        case 'in_consultation':
          statusLabel = 'In Consultation';
          statusDesc = 'Your consultation with Dr. Supriyo Sahu is currently underway.';
          break;
        case 'completed':
          statusLabel = 'Completed';
          statusDesc = 'Consultation successfully completed. Thank you for visiting Dental Paradise.';
          break;
        case 'rejected':
          statusLabel = 'Not Accepted';
          statusDesc = data.rejection_reason || 'This slot could not be accommodated. Please choose an alternative slot.';
          break;
        case 'cancelled':
          statusLabel = 'Cancelled';
          statusDesc = 'This appointment was cancelled.';
          break;
      }

      resultBox.innerHTML = `
        <div style="border-top:1px solid var(--border-light); padding-top:2rem;">
          <div class="queue-display">
            <span class="queue-number">#${data.queue_number}</span>
            <span class="queue-label">Your Queue Number for Today</span>
          </div>

          <div style="text-align:center; margin-bottom:1.5rem;">
            <span class="status-badge ${data.status}" style="font-size:0.95rem; padding:0.45rem 1.25rem;">
              ● ${statusLabel}
            </span>
            <p style="font-size:0.88rem; color:var(--text-muted); margin-top:0.75rem;">${statusDesc}</p>
          </div>

          <div style="background:var(--bg-main); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.5rem; font-size:0.92rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; border-bottom:1px solid var(--border-light); padding-bottom:0.5rem;">
              <span style="color:var(--text-muted);">Appointment ID:</span>
              <strong style="font-family:monospace;">${data.id}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; border-bottom:1px solid var(--border-light); padding-bottom:0.5rem;">
              <span style="color:var(--text-muted);">Patient Name:</span>
              <strong>${data.patient_name}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; border-bottom:1px solid var(--border-light); padding-bottom:0.5rem;">
              <span style="color:var(--text-muted);">Treatment:</span>
              <strong>${data.treatment_name}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; border-bottom:1px solid var(--border-light); padding-bottom:0.5rem;">
              <span style="color:var(--text-muted);">Appointment Date:</span>
              <strong>${formatDisplayDate(data.appointment_date)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; border-bottom:1px solid var(--border-light); padding-bottom:0.5rem;">
              <span style="color:var(--text-muted);">Consultation Time:</span>
              <strong>${formatDisplayTime(data.appointment_time)}</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Payment:</span>
              <strong>Cash at Clinic</strong>
            </div>
          </div>

          <div style="margin-top:1.5rem; display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
            <a href="https://maps.google.com/?q=Math+Chandipur+Market+Life+Care+Diagnostic+Center+721659" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
              📍 Get Directions to Clinic
            </a>
            <a href="tel:9733835105" class="btn btn-secondary btn-sm">
              📞 Call Clinic (9733835105)
            </a>
          </div>
        </div>
      `;
    } catch (e) {
      console.error(e);
      resultBox.innerHTML = '<div style="color:#EF4444; text-align:center;">Failed to fetch status. Please try again.</div>';
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('lookup-id').value.trim();
    const phone = document.getElementById('lookup-phone').value.trim();
    if (id && phone) performLookup(id, phone);
  });

  // Auto-trigger if URL has id and phone
  const initialId = document.getElementById('lookup-id').value.trim();
  const initialPhone = document.getElementById('lookup-phone').value.trim();
  if (initialId && initialPhone) {
    performLookup(initialId, initialPhone);
  }
}
