import { supabase } from '../services/supabase.js';
import { isClinicClosedOnDate, getAvailableSlots, formatDisplayDate, formatDisplayTime } from '../utils/schedule.js';
import { NotificationService } from '../services/notifications.js';

export async function renderBookAppointmentPage(preselectedTreatment = '') {
  // Fetch active treatments for dropdown
  let treatments = [];
  try {
    const { data } = await supabase
      .from('treatments')
      .select('id, name_en, name_bn')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (data) treatments = data;
  } catch (e) {}

  // Get next available open day (skip today if closed, or if past 7:30 PM)
  const now = new Date();
  let defaultDate = new Date();
  
  // If today is Mon or Fri or after 7:30 PM, advance to next open day
  while (isClinicClosedOnDate(defaultDate.toISOString().split('T')[0]) || 
        (defaultDate.toISOString().split('T')[0] === now.toISOString().split('T')[0] && (now.getHours() > 19 || (now.getHours() === 19 && now.getMinutes() >= 30)))) {
    defaultDate.setDate(defaultDate.getDate() + 1);
  }

  const defaultDateStr = defaultDate.toISOString().split('T')[0];
  const minDateStr = now.toISOString().split('T')[0];

  const treatmentOptionsHtml = treatments.map(t => `
    <option value="${t.name_en}" ${preselectedTreatment.toLowerCase() === t.name_en.toLowerCase() ? 'selected' : ''}>
      ${t.name_en} (${t.name_bn})
    </option>
  `).join('');

  return `
    <div class="container section">
      <div class="booking-container">
        <div style="text-align:center; margin-bottom:2.5rem;">
          <span class="section-tag">Direct Clinical Booking</span>
          <h1 style="font-size:2.2rem; margin-bottom:0.5rem;">Book Dental Consultation</h1>
          <p style="color:var(--text-muted); font-size:0.95rem; max-width:540px; margin:0 auto;">
            Reserve your 30-minute slot with Dr. Supriyo Sahu at Dental Paradise, Math Chandipur. No advance payment required — Cash at Clinic.
          </p>
        </div>

        <div id="booking-alert-box" style="display:none; margin-bottom:1.5rem; padding:1rem; border-radius:var(--radius-md); font-size:0.9rem;"></div>

        <form id="appointment-form">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;">
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input type="text" id="patient-name" class="form-control" placeholder="Enter patient's full name" required />
            </div>

            <div class="form-group">
              <label class="form-label">Mobile Number *</label>
              <input type="tel" id="patient-phone" class="form-control" placeholder="10-digit mobile number" pattern="[0-9]{10}" required />
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;">
            <div class="form-group">
              <label class="form-label">Email Address (Optional)</label>
              <input type="email" id="patient-email" class="form-control" placeholder="For appointment receipt" />
            </div>

            <div class="form-group">
              <label class="form-label">Dental Treatment *</label>
              <select id="treatment-select" class="form-control" required>
                <option value="">Select Treatment / Consultation</option>
                <option value="General Dental Consultation">General Dental Consultation (সাধারণ ডেন্টাল চেকআপ)</option>
                ${treatmentOptionsHtml}
              </select>
            </div>
          </div>

          <!-- Appointment Date Selection -->
          <div class="form-group">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <label class="form-label" style="margin:0;">Appointment Date *</label>
              <span style="font-size:0.8rem; color:#EF4444; font-weight:600;">Monday & Friday CLOSED</span>
            </div>
            <input type="date" id="appointment-date" class="form-control" min="${minDateStr}" value="${defaultDateStr}" required />
            <p id="date-helper-text" style="font-size:0.8rem; color:var(--text-muted); margin-top:0.35rem;"></p>
          </div>

          <!-- Time Slot Selection Grid -->
          <div class="form-group">
            <label class="form-label">Select Consultation Slot (30 Minutes) *</label>
            <div id="slots-loading" style="display:none; color:var(--color-primary); font-size:0.85rem; padding:0.5rem 0;">Checking slot availability...</div>
            <div id="slot-grid-container">
              <!-- Morning Slots -->
              <div style="margin-bottom:1rem;">
                <span style="display:block; font-size:0.8rem; font-weight:700; color:var(--color-secondary); text-transform:uppercase; margin-bottom:0.4rem;">Morning Window (8:00 AM – 12:00 PM)</span>
                <div class="slot-grid" id="morning-slots"></div>
              </div>

              <!-- Evening Slots -->
              <div>
                <span style="display:block; font-size:0.8rem; font-weight:700; color:var(--color-secondary); text-transform:uppercase; margin-bottom:0.4rem;">Evening Window (4:00 PM – 8:00 PM)</span>
                <div class="slot-grid" id="evening-slots"></div>
              </div>
            </div>
            <input type="hidden" id="selected-slot" required />
          </div>

          <div class="form-group">
            <label class="form-label">Brief Description of Problem / Message (Optional)</label>
            <textarea id="patient-message" class="form-control" rows="3" placeholder="e.g. Toothache on lower left side since 2 days"></textarea>
          </div>

          <div style="background:var(--bg-main); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1rem; margin-bottom:2rem; font-size:0.88rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong>Payment Method:</strong> Cash at Clinic (No online payment required)
            </div>
            <span style="color:var(--color-primary); font-weight:700;">Pay at Clinic</span>
          </div>

          <button type="submit" id="book-submit-btn" class="btn btn-primary btn-lg" style="width:100%;">
            <span>Confirm Appointment Booking</span>
          </button>
        </form>

        <!-- Success Modal/Card (Hidden by default) -->
        <div id="booking-success-view" style="display:none; text-align:center; padding:1.5rem 0;">
          <div style="width:64px; height:64px; border-radius:50%; background:var(--status-confirmed-bg); color:var(--status-confirmed); display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; font-size:2rem;">
            ✓
          </div>
          <h2 style="font-size:1.8rem; margin-bottom:0.5rem;">Booking Request Submitted!</h2>
          <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem;">
            Your appointment has been registered and is awaiting doctor confirmation.
          </p>

          <div style="background:var(--color-primary-soft); border:1px solid var(--color-primary-light); border-radius:var(--radius-lg); padding:1.5rem; max-width:440px; margin:0 auto 2rem; text-align:left;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem;">
              <span style="color:var(--text-muted);">Appointment ID:</span>
              <strong id="success-apt-id" style="color:var(--color-secondary); font-family:monospace; font-size:1.05rem;"></strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem;">
              <span style="color:var(--text-muted);">Queue Number:</span>
              <strong id="success-queue-num" style="color:var(--color-primary); font-size:1.2rem;"></strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem;">
              <span style="color:var(--text-muted);">Patient Name:</span>
              <strong id="success-patient-name"></strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem;">
              <span style="color:var(--text-muted);">Date & Time:</span>
              <strong id="success-date-time"></strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--text-muted);">Status:</span>
              <span class="status-badge pending">Pending Doctor Review</span>
            </div>
          </div>

          <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
            <a id="success-status-link" href="/appointment-status" class="btn btn-primary">
              Track Appointment Status
            </a>
            <a href="/" class="btn btn-secondary">
              Return Home
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initBookAppointmentEvents() {
  const dateInput = document.getElementById('appointment-date');
  const alertBox = document.getElementById('booking-alert-box');
  const morningContainer = document.getElementById('morning-slots');
  const eveningContainer = document.getElementById('evening-slots');
  const selectedSlotInput = document.getElementById('selected-slot');
  const form = document.getElementById('appointment-form');
  const submitBtn = document.getElementById('book-submit-btn');

  if (!dateInput) return;

  async function loadSlots() {
    const chosenDate = dateInput.value;
    selectedSlotInput.value = '';
    
    // Check closed day
    if (isClinicClosedOnDate(chosenDate)) {
      alertBox.style.display = 'block';
      alertBox.style.background = '#FEE2E2';
      alertBox.style.border = '1px solid #FECACA';
      alertBox.style.color = '#991B1B';
      alertBox.innerHTML = '⚠️ <strong>Clinic is CLOSED on this day.</strong> Monday and Friday are non-working days. Please select an open day (Tuesday, Wednesday, Thursday, Saturday, or Sunday).';
      morningContainer.innerHTML = '<p style="color:#94A3B8; font-size:0.85rem;">No slots on closed days.</p>';
      eveningContainer.innerHTML = '';
      submitBtn.disabled = true;
      return;
    }

    alertBox.style.display = 'none';
    submitBtn.disabled = false;

    // Fetch booked times for this date from Supabase
    let bookedTimes = [];
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', chosenDate)
        .not('status', 'in', '("rejected","cancelled")');
      
      if (data) {
        bookedTimes = data.map(d => d.appointment_time);
      }
    } catch (e) {
      console.error('Error fetching booked slots', e);
    }

    const availableSlots = getAvailableSlots(chosenDate, bookedTimes);

    const morning = availableSlots.filter(s => s.period === 'Morning');
    const evening = availableSlots.filter(s => s.period === 'Evening');

    function renderSlotButtons(slots, container) {
      if (slots.length === 0) {
        container.innerHTML = '<p style="color:#94A3B8; font-size:0.85rem;">No slots available.</p>';
        return;
      }
      container.innerHTML = slots.map(s => `
        <button type="button" class="slot-btn" data-time="${s.time}" ${s.isAvailable ? '' : 'disabled'} title="${s.disabledReason || 'Available'}">
          ${s.label}
        </button>
      `).join('');
    }

    renderSlotButtons(morning, morningContainer);
    renderSlotButtons(evening, eveningContainer);

    // Attach click handlers to active slot buttons
    document.querySelectorAll('.slot-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedSlotInput.value = btn.dataset.time;
      });
    });
  }

  dateInput.addEventListener('change', loadSlots);
  loadSlots(); // Initial load

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('patient-name').value.trim();
    const phone = document.getElementById('patient-phone').value.trim();
    const email = document.getElementById('patient-email').value.trim();
    const treatment = document.getElementById('treatment-select').value;
    const date = dateInput.value;
    const time = selectedSlotInput.value;
    const message = document.getElementById('patient-message').value.trim();

    if (!time) {
      alert('Please select a 30-minute consultation slot.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Securing Your Slot...';

    try {
      // 1. Double-check for double booking
      const { data: conflict } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', date)
        .eq('appointment_time', time)
        .not('status', 'in', '("rejected","cancelled")')
        .maybeSingle();

      if (conflict) {
        alert('Sorry! This slot was just booked by another patient. Please choose another time slot.');
        await loadSlots();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Confirm Appointment Booking';
        return;
      }

      // 2. Compute Queue Number for this date
      const { count } = await supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('appointment_date', date)
        .not('status', 'in', '("rejected","cancelled")');

      const queueNumber = (count || 0) + 1;
      const cleanDate = date.replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const appointmentId = `APT-${cleanDate}-${randomSuffix}`;

      // 3. Insert appointment into Supabase
      const { data: inserted, error: insertErr } = await supabase
        .from('appointments')
        .insert({
          id: appointmentId,
          patient_name: name,
          patient_phone: phone,
          patient_email: email || null,
          treatment_name: treatment,
          appointment_date: date,
          appointment_time: time,
          queue_number: queueNumber,
          status: 'pending',
          payment_method: 'Cash at Clinic',
          message: message || null
        })
        .select()
        .single();

      if (insertErr) {
        throw insertErr;
      }

      // 4. Register notification device for this patient
      NotificationService.requestPermissionAndRegister('patient', phone);

      // 5. Notify Doctor Device (and local alert)
      NotificationService.showLocalNotification(
        'Dental Paradise — New Appointment',
        `New request from ${name} for ${treatment} on ${formatDisplayDate(date)} at ${formatDisplayTime(time)}.`,
        `/admin`
      );

      // Save to localStorage for quick status lookup
      localStorage.setItem('last_apt_id', appointmentId);
      localStorage.setItem('last_apt_phone', phone);

      // Show success view
      form.style.display = 'none';
      const successView = document.getElementById('booking-success-view');
      document.getElementById('success-apt-id').textContent = appointmentId;
      document.getElementById('success-queue-num').textContent = `#${queueNumber}`;
      document.getElementById('success-patient-name').textContent = name;
      document.getElementById('success-date-time').textContent = `${formatDisplayDate(date)} at ${formatDisplayTime(time)}`;
      document.getElementById('success-status-link').href = `/appointment-status?id=${appointmentId}&phone=${encodeURIComponent(phone)}`;
      successView.style.display = 'block';

    } catch (err) {
      console.error('Booking failed', err);
      alert('Could not submit booking: ' + (err.message || 'Please check your connection and try again.'));
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Confirm Appointment Booking';
    }
  });
}
