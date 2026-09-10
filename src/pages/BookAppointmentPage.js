import { supabase } from '../services/supabase.js';
import { isClinicClosedOnDate, getAvailableSlots, formatDisplayDate, formatDisplayTime } from '../utils/schedule.js';
import { NotificationService } from '../services/notifications.js';

export async function renderBookAppointmentPage(preselectedTreatment = '') {
  // Fetch active treatments
  let treatments = [];
  try {
    const { data } = await supabase
      .from('treatments')
      .select('id, name_en, name_bn, image_url, icon_svg')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (data && data.length > 0) treatments = data;
  } catch (e) {
    console.warn('Could not fetch treatments from db, using fallback');
  }

  // Fallback treatments if database is offline/empty
  if (!treatments || treatments.length === 0) {
    treatments = [
      { id: '1', name_en: 'Root Canal Treatment (RCT)', name_bn: 'রুট ক্যানাল ট্রিটমেন্ট', image_url: '/images/treatments/root-canal.jpg' },
      { id: '2', name_en: 'Impaction Surgery / Wisdom Tooth Removal', name_bn: 'ইমপ্যাকশন ও উইজডম দাঁত সার্জারি', image_url: '/images/treatments/wisdom-tooth.jpg' },
      { id: '3', name_en: 'Painless Tooth Extraction', name_bn: 'ব্যথাহীন দাঁত তোলা', image_url: '/images/treatments/tooth-extraction.jpg' },
      { id: '4', name_en: 'Crown, Bridge & Dental Prosthesis', name_bn: 'ক্রাউন ও ব্রিজ / কৃত্রিম দাঁত', image_url: '/images/treatments/crown-bridge.jpg' },
      { id: '5', name_en: 'Scaling & Teeth Polishing', name_bn: 'দাঁতের স্কেলিং ও পলিশিং', image_url: '/images/treatments/scaling-polishing.jpg' },
      { id: '6', name_en: 'Restoration & Tooth-Colored Fillings', name_bn: 'দাঁতের ফিলিং ও রেস্টোরেশন', image_url: '/images/treatments/dental-filling.jpg' },
      { id: '7', name_en: 'Orthodontic Treatment (Braces & Aligners)', name_bn: 'দাঁতের তার বা অর্থোডন্টিক চিকিৎসা', image_url: '/images/treatments/orthodontics.jpg' },
      { id: '8', name_en: 'Pediatric Oral & Dental Care', name_bn: 'শিশুদের দাঁতের বিশেষ যত্ন', image_url: '/images/treatments/pediatric-dentistry.jpg' },
      { id: '9', name_en: 'Fractured Teeth & Dental Trauma Care', name_bn: 'ভাঙা দাঁত ও ট্রমা চিকিৎসা', image_url: '/images/treatments/fractured-tooth.jpg' },
      { id: '10', name_en: 'Cosmetic Dentistry & Smile Designing', name_bn: 'কসমেটিক ডেন্টিস্ট্রি ও স্মাইল ডিজাইনিং', image_url: '/images/treatments/smile-design.jpg' },
      { id: '11', name_en: 'Minor Oral Surgery & Cystic Surgery', name_bn: 'মাইনর ওরাল সার্জারি ও সিস্ট সার্জারি', image_url: '/images/treatments/oral-surgery.jpg' },
      { id: '12', name_en: 'Full Mouth Reconstruction & Bone Grafting', name_bn: 'ফুল মাউথ রিকনস্ট্রাকশন ও বোন গ্রাফটিং', image_url: '/images/treatments/full-reconstruction.jpg' }
    ];
  }

  // Calculate default valid date (skip today if closed or past 7:30 PM)
  const now = new Date();
  let defaultDate = new Date();
  while (isClinicClosedOnDate(defaultDate.toISOString().split('T')[0]) || 
        (defaultDate.toISOString().split('T')[0] === now.toISOString().split('T')[0] && (now.getHours() > 19 || (now.getHours() === 19 && now.getMinutes() >= 30)))) {
    defaultDate.setDate(defaultDate.getDate() + 1);
  }

  const defaultDateStr = defaultDate.toISOString().split('T')[0];
  const minDateStr = now.toISOString().split('T')[0];

  const treatmentCardsHtml = treatments.map(t => {
    const isSelected = preselectedTreatment && preselectedTreatment.toLowerCase() === t.name_en.toLowerCase();
    const iconPath = t.image_url || t.icon_svg || '/images/treatments/general-consultation.svg';
    return `
      <div class="treatment-select-card ${isSelected ? 'selected' : ''}" data-treatment="${t.name_en}" data-treatment-bn="${t.name_bn || ''}" role="button" tabindex="0">
        <img src="${iconPath}" alt="${t.name_en}" class="treatment-select-icon" onerror="this.src='/icons/icon-192.png'" />
        <div class="treatment-select-info">
          <div class="treatment-select-title">${t.name_en}</div>
          <div class="treatment-select-bn bn-text">${t.name_bn || ''}</div>
        </div>
        <div class="treatment-select-indicator">
          <span class="material-symbols-outlined check-icon">check</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="container section">
      <div class="booking-container">
        
        <!-- Header -->
        <div style="text-align:center; margin-bottom:1.75rem;">
          <span class="section-tag">Direct Clinical Booking</span>
          <h1 style="font-size:2rem; margin-bottom:0.35rem;">Book Consultation</h1>
          <p style="color:var(--text-muted); font-size:0.9rem; max-width:520px; margin:0 auto;">
            Reserve your 30-minute consultation with Dr. Supriyo Sahu at Dental Paradise, Math Chandipur.
          </p>
        </div>

        <!-- 5-Step Progress Tracker -->
        <div class="wizard-progress-bar-container" id="wizard-tracker">
          <div class="wizard-step-tracker">
            <span id="step-counter-text">STEP 1 OF 5</span>
            <span class="wizard-step-active-label" id="step-label-text">CHOOSE TREATMENT</span>
          </div>
          <div class="wizard-track-bg">
            <div class="wizard-track-fill" id="wizard-progress-fill" style="width: 20%;"></div>
          </div>
        </div>

        <div id="booking-alert-box" style="display:none; margin-bottom:1.25rem; padding:0.85rem 1rem; border-radius:var(--radius-md); font-size:0.88rem;"></div>

        <form id="appointment-form">
          <input type="hidden" id="selected-treatment" value="${preselectedTreatment || ''}" />
          <input type="hidden" id="selected-slot" value="" />

          <!-- STEP 1: Choose Treatment -->
          <div class="wizard-step-panel active" id="step-panel-1">
            <div class="step-heading-group">
              <span class="step-badge-pill">Step 1 of 5</span>
              <h2 class="step-main-heading">Select Treatment or Care Required</h2>
              <p class="step-subheading">Choose your dental concern below or pick General Consultation</p>
            </div>

            <!-- Instant Active Selection Banner (Visible immediately as soon as ANY treatment is selected) -->
            <div class="step1-active-banner" id="step1-selection-banner" style="${preselectedTreatment ? 'display:flex;' : 'display:none;'}">
              <div class="active-banner-text">
                <span class="active-banner-label">
                  <span class="material-symbols-outlined text-[15px]">check_circle</span>
                  <span>Treatment Selected:</span>
                </span>
                <span class="active-banner-title" id="selection-banner-treatment-name">${preselectedTreatment || 'Root Canal Treatment (RCT)'}</span>
              </div>
              <button type="button" class="btn btn-primary btn-sm active-banner-btn" id="step1-banner-next-btn">
                <span>Continue to Date →</span>
              </button>
            </div>

            <div class="treatment-selection-grid" id="treatment-cards-grid">
              ${treatmentCardsHtml}
            </div>

            <div class="wizard-nav-btns">
              <div></div>
              <button type="button" class="btn btn-primary btn-lg" id="step1-next-btn" ${preselectedTreatment ? '' : 'disabled'}>
                <span>Continue to Date Selection →</span>
              </button>
            </div>
          </div>

          <!-- STEP 2: Choose Date -->
          <div class="wizard-step-panel" id="step-panel-2">
            <div class="step-heading-group">
              <h2 style="font-size:1.25rem; color:var(--color-secondary);">Choose Appointment Date</h2>
              <p class="step-subheading">Clinic is strictly open 5 days a week: <strong>Tue, Wed, Thu, Sat, Sun</strong></p>
            </div>

            <div class="form-group">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <label class="form-label" style="margin:0;">Select Consultation Date *</label>
                <span style="font-size:0.75rem; color:#EF4444; font-weight:700; background:#FEF2F2; padding:0.2rem 0.6rem; border-radius:var(--radius-full);">Mon & Fri CLOSED</span>
              </div>
              <input type="date" id="appointment-date" class="form-control" min="${minDateStr}" value="${defaultDateStr}" required />
            </div>

            <!-- Quick Date Jump Chips -->
            <div style="margin-bottom:1.5rem;">
              <span style="font-size:0.8rem; font-weight:600; color:var(--text-light);">Quick Options:</span>
              <div class="quick-date-chips" id="quick-date-chips">
                <button type="button" class="quick-date-chip" data-days="0">Today</button>
                <button type="button" class="quick-date-chip" data-days="1">Tomorrow</button>
                <button type="button" class="quick-date-chip" data-days="2">In 2 Days</button>
                <button type="button" class="quick-date-chip" data-target-day="0">Next Sunday</button>
              </div>
            </div>

            <div class="wizard-nav-btns">
              <button type="button" class="btn btn-outline" id="step2-prev-btn">
                <span>← Back</span>
              </button>
              <button type="button" class="btn btn-primary" id="step2-next-btn">
                <span>Choose Time Slot →</span>
              </button>
            </div>
          </div>

          <!-- STEP 3: Choose Time Slot -->
          <div class="wizard-step-panel" id="step-panel-3">
            <div class="step-heading-group">
              <h2 style="font-size:1.25rem; color:var(--color-secondary);">Select 30-Minute Consultation Slot</h2>
              <p class="step-subheading" id="selected-date-display">Consultation hours: 8 AM–12 PM & 4 PM–8 PM</p>
            </div>

            <div id="slots-loading" style="display:none; color:var(--color-primary); font-size:0.85rem; padding:0.5rem 0;">
              Checking live doctor availability...
            </div>

            <div id="slot-grid-container">
              <!-- Morning Slots (8:00 AM – 12:00 PM) -->
              <div style="margin-bottom:1.25rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                  <span style="font-size:0.82rem; font-weight:700; color:var(--color-secondary); text-transform:uppercase;">
                    🌅 Morning Window (8:00 AM – 12:00 PM)
                  </span>
                  <span style="font-size:0.75rem; color:var(--text-light);">8 slots (30 min)</span>
                </div>
                <div class="slot-grid" id="morning-slots"></div>
              </div>

              <!-- Evening Slots (4:00 PM – 8:00 PM) -->
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                  <span style="font-size:0.82rem; font-weight:700; color:var(--color-secondary); text-transform:uppercase;">
                    🌆 Evening Window (4:00 PM – 8:00 PM)
                  </span>
                  <span style="font-size:0.75rem; color:var(--text-light);">8 slots (30 min)</span>
                </div>
                <div class="slot-grid" id="evening-slots"></div>
              </div>
            </div>

            <div class="wizard-nav-btns">
              <button type="button" class="btn btn-outline" id="step3-prev-btn">
                <span>← Back</span>
              </button>
              <button type="button" class="btn btn-primary" id="step3-next-btn">
                <span>Enter Patient Details →</span>
              </button>
            </div>
          </div>

          <!-- STEP 4: Patient Details -->
          <div class="wizard-step-panel" id="step-panel-4">
            <div class="step-heading-group">
              <h2 style="font-size:1.25rem; color:var(--color-secondary);">Patient Information</h2>
              <p class="step-subheading">Your details are strictly confidential and used for clinic check-in & SMS/WhatsApp updates.</p>
            </div>

            <div class="form-group">
              <label class="form-label">Patient Full Name *</label>
              <input type="text" id="patient-name" class="form-control" placeholder="e.g. Swarup Pal" required />
            </div>

            <div class="form-group">
              <label class="form-label">Mobile Number *</label>
              <input type="tel" id="patient-phone" class="form-control" placeholder="10-digit mobile (e.g. 9876543210)" pattern="[0-9]{10}" required />
              <span style="font-size:0.75rem; color:var(--text-light); margin-top:0.25rem; display:block;">We will send appointment status updates to this number.</span>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address (Optional)</label>
              <input type="email" id="patient-email" class="form-control" placeholder="For digital clinic receipt" />
            </div>

            <div class="form-group">
              <label class="form-label">Describe Your Problem / Symptoms (Optional)</label>
              <textarea id="patient-message" class="form-control" rows="2" placeholder="e.g. Tooth sensitivity with cold water, pain in lower molar since 2 days"></textarea>
            </div>

            <div class="wizard-nav-btns">
              <button type="button" class="btn btn-outline" id="step4-prev-btn">
                <span>← Back</span>
              </button>
              <button type="button" class="btn btn-primary" id="step4-next-btn">
                <span>Review & Confirm →</span>
              </button>
            </div>
          </div>

          <!-- STEP 5: Review Summary & Confirmation -->
          <div class="wizard-step-panel" id="step-panel-5">
            <div class="step-heading-group">
              <h2 style="font-size:1.25rem; color:var(--color-secondary);">Review & Confirm Appointment</h2>
              <p class="step-subheading">Please verify your booking details before final submission.</p>
            </div>

            <div class="booking-review-card">
              <div class="review-row">
                <span class="review-label">Treatment</span>
                <span class="review-value" id="review-treatment">—</span>
              </div>
              <div class="review-row">
                <span class="review-label">Consulting Doctor</span>
                <span class="review-value">Dr. Supriyo Sahu (B.D.S. Hons)</span>
              </div>
              <div class="review-row">
                <span class="review-label">Appointment Date</span>
                <span class="review-value" id="review-date">—</span>
              </div>
              <div class="review-row">
                <span class="review-label">Time Slot</span>
                <span class="review-value" id="review-time" style="color:var(--color-primary); font-size:1.05rem;">—</span>
              </div>
              <div class="review-row">
                <span class="review-label">Patient Name</span>
                <span class="review-value" id="review-name">—</span>
              </div>
              <div class="review-row">
                <span class="review-label">Mobile Number</span>
                <span class="review-value" id="review-phone">—</span>
              </div>
              <div class="review-row">
                <span class="review-label">Payment Method</span>
                <span class="review-value" style="color:#059669;">Cash at Clinic (₹0 Advance)</span>
              </div>
            </div>

            <div style="background:var(--color-primary-soft); border:1px solid var(--color-primary-light); border-radius:var(--radius-md); padding:0.85rem 1rem; font-size:0.82rem; color:var(--color-secondary); margin-bottom:1.5rem; display:flex; align-items:center; gap:0.6rem;">
              <span style="font-size:1.2rem;">🛡️</span>
              <span><strong>Guaranteed Consultation:</strong> Your appointment token will be generated instantly and doctor schedule reserved.</span>
            </div>

            <div class="wizard-nav-btns">
              <button type="button" class="btn btn-outline" id="step5-prev-btn">
                <span>← Back</span>
              </button>
              <button type="submit" id="book-submit-btn" class="btn btn-primary" style="flex:1.5;">
                <span>Confirm & Generate Queue #</span>
              </button>
            </div>
          </div>
        </form>

        <!-- STEP 5 SUCCESS VIEW: Confirmation & Queue Pass -->
        <div id="booking-success-view" style="display:none; text-align:center; padding:1rem 0;">
          <div style="width:68px; height:68px; border-radius:50%; background:var(--status-confirmed-bg); color:var(--status-confirmed); display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem; font-size:2.2rem; box-shadow:0 4px 16px rgba(16, 185, 129, 0.25);">
            ✓
          </div>
          <h2 style="font-size:1.75rem; margin-bottom:0.35rem; color:var(--color-secondary);">Appointment Reserved!</h2>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">
            Your booking request has been submitted to Dr. Supriyo Sahu at Dental Paradise.
          </p>

          <div style="background:var(--bg-card); border:2px solid var(--color-primary); border-radius:var(--radius-xl); padding:1.75rem; max-width:460px; margin:0 auto 1.75rem; text-align:left; box-shadow:var(--shadow-md);">
            <div style="text-align:center; padding-bottom:1rem; border-bottom:1px dashed var(--border-light); margin-bottom:1rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-light); text-transform:uppercase; letter-spacing:0.05em;">YOUR CLINIC QUEUE NUMBER</span>
              <div id="success-queue-num" style="font-size:2.8rem; font-weight:800; color:var(--color-primary); font-family:var(--font-heading); line-height:1; margin-top:0.25rem;"></div>
              <span style="font-size:0.75rem; color:var(--text-muted);">Please present this queue number at reception</span>
            </div>

            <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem; font-size:0.88rem;">
              <span style="color:var(--text-muted);">Appointment ID:</span>
              <strong id="success-apt-id" style="color:var(--color-secondary); font-family:monospace; font-size:0.95rem;"></strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem; font-size:0.88rem;">
              <span style="color:var(--text-muted);">Patient Name:</span>
              <strong id="success-patient-name" style="color:var(--color-secondary);"></strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem; font-size:0.88rem;">
              <span style="color:var(--text-muted);">Treatment:</span>
              <strong id="success-treatment" style="color:var(--color-secondary);"></strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem; font-size:0.88rem;">
              <span style="color:var(--text-muted);">Date & Time:</span>
              <strong id="success-date-time" style="color:var(--color-primary);"></strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.88rem; padding-top:0.5rem; border-top:1px solid var(--border-light);">
              <span style="color:var(--text-muted);">Payment:</span>
              <span style="color:#059669; font-weight:700;">Cash at Clinic</span>
            </div>
          </div>

          <!-- Post-booking Action Buttons -->
          <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap; max-width:460px; margin:0 auto;">
            <a id="success-status-link" href="/appointment-status" class="btn btn-primary" style="flex:1;">
              Track Queue Status
            </a>
            <a id="success-whatsapp-btn" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="flex:1;">
              Share to WhatsApp
            </a>
          </div>
          <div style="margin-top:1rem;">
            <a href="/" style="font-size:0.85rem; color:var(--text-light); text-decoration:underline;">Return to Homepage</a>
          </div>
        </div>

        <!-- Sticky Mobile Bottom Action Dock for Step 1 -->
        <div class="step1-sticky-dock" id="step1-sticky-dock" style="${preselectedTreatment ? 'display:flex;' : 'display:none;'}">
          <div class="sticky-dock-inner">
            <div class="sticky-dock-treatment-summary">
              <span class="sticky-dock-label">Selected Treatment</span>
              <div class="sticky-dock-name" id="sticky-dock-name">${preselectedTreatment || 'Root Canal Treatment (RCT)'}</div>
            </div>
            <button type="button" class="btn btn-primary sticky-dock-continue-btn" id="step1-sticky-next-btn">
              <span>Continue to Date Selection</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function initBookAppointmentEvents() {
  let currentStep = 1;
  const totalSteps = 5;

  const stepCounterText = document.getElementById('step-counter-text');
  const stepLabelText = document.getElementById('step-label-text');
  const progressFill = document.getElementById('wizard-progress-fill');
  const alertBox = document.getElementById('booking-alert-box');

  const selectedTreatmentInput = document.getElementById('selected-treatment');
  const dateInput = document.getElementById('appointment-date');
  const selectedSlotInput = document.getElementById('selected-slot');
  const morningContainer = document.getElementById('morning-slots');
  const eveningContainer = document.getElementById('evening-slots');
  const slotsLoading = document.getElementById('slots-loading');

  const patientNameInput = document.getElementById('patient-name');
  const patientPhoneInput = document.getElementById('patient-phone');
  const patientEmailInput = document.getElementById('patient-email');
  const patientMessageInput = document.getElementById('patient-message');

  const form = document.getElementById('appointment-form');
  const submitBtn = document.getElementById('book-submit-btn');

  const stepLabels = [
    'CHOOSE TREATMENT',
    'CHOOSE DATE',
    'CHOOSE TIME SLOT',
    'PATIENT DETAILS',
    'REVIEW & CONFIRM'
  ];

  function showStep(step) {
    currentStep = step;
    for (let i = 1; i <= totalSteps; i++) {
      const panel = document.getElementById(`step-panel-${i}`);
      if (panel) {
        if (i === step) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      }
    }

    if (stepCounterText) stepCounterText.textContent = `STEP ${step} OF ${totalSteps}`;
    if (stepLabelText) stepLabelText.textContent = stepLabels[step - 1];
    if (progressFill) progressFill.style.width = `${(step / totalSteps) * 100}%`;

    // Only show Step 1 sticky action dock when on step 1 and treatment is selected
    const stickyDock = document.getElementById('step1-sticky-dock');
    const isDockActive = (step === 1 && !!selectedTreatmentInput.value);
    if (stickyDock) {
      stickyDock.style.display = isDockActive ? 'flex' : 'none';
    }
    document.body.classList.toggle('has-sticky-dock', isDockActive);

    // Clear alerts when switching steps
    if (alertBox) alertBox.style.display = 'none';

    // Scroll container smoothly to top of wizard
    const wizardEl = document.querySelector('.booking-container');
    if (wizardEl && window.innerWidth <= 768) {
      wizardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --- Step 1: Treatment Cards Selection & Instant Visibility ---
  const cards = document.querySelectorAll('.treatment-select-card');
  const bannerEl = document.getElementById('step1-selection-banner');
  const bannerName = document.getElementById('selection-banner-treatment-name');
  const stickyDock = document.getElementById('step1-sticky-dock');
  const stickyName = document.getElementById('sticky-dock-name');

  function updateSelectedTreatmentUI(treatmentName) {
    if (!treatmentName) return;
    selectedTreatmentInput.value = treatmentName;

    if (bannerName) bannerName.textContent = treatmentName;
    if (stickyName) stickyName.textContent = treatmentName;

    if (bannerEl) bannerEl.style.display = 'flex';
    if (stickyDock && currentStep === 1) {
      stickyDock.style.display = 'flex';
      document.body.classList.add('has-sticky-dock');
    }

    const nextBtn = document.getElementById('step1-next-btn');
    if (nextBtn) nextBtn.disabled = false;
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      updateSelectedTreatmentUI(card.dataset.treatment);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // If initial treatment preselected from URL or state
  if (selectedTreatmentInput.value) {
    updateSelectedTreatmentUI(selectedTreatmentInput.value);
  } else {
    const nextBtn = document.getElementById('step1-next-btn');
    if (nextBtn) nextBtn.disabled = true;
  }

  const handleStep1Proceed = () => {
    if (!selectedTreatmentInput.value) {
      alert('Please choose a treatment or general consultation to proceed.');
      return;
    }
    showStep(2);
  };

  document.getElementById('step1-next-btn')?.addEventListener('click', handleStep1Proceed);
  document.getElementById('step1-banner-next-btn')?.addEventListener('click', handleStep1Proceed);
  document.getElementById('step1-sticky-next-btn')?.addEventListener('click', handleStep1Proceed);

  // --- Step 2: Date Selection & Quick Date Chips ---
  function validateDateChoice(dateStr) {
    if (isClinicClosedOnDate(dateStr)) {
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.style.background = '#FEE2E2';
        alertBox.style.border = '1px solid #FECACA';
        alertBox.style.color = '#991B1B';
        alertBox.innerHTML = '⚠️ <strong>Clinic is CLOSED on Monday and Friday.</strong> Please choose Tuesday, Wednesday, Thursday, Saturday, or Sunday.';
      }
      return false;
    }
    if (alertBox) alertBox.style.display = 'none';
    return true;
  }

  dateInput?.addEventListener('change', () => {
    validateDateChoice(dateInput.value);
    // Unselect quick chips
    document.querySelectorAll('.quick-date-chip').forEach(c => c.classList.remove('active'));
  });

  // Quick date chips handlers
  document.querySelectorAll('.quick-date-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const daysOffset = chip.dataset.days;
      const targetDay = chip.dataset.targetDay;
      const d = new Date();

      if (daysOffset !== undefined) {
        d.setDate(d.getDate() + parseInt(daysOffset, 10));
      } else if (targetDay !== undefined) {
        const target = parseInt(targetDay, 10);
        while (d.getDay() !== target) {
          d.setDate(d.getDate() + 1);
        }
      }

      const iso = d.toISOString().split('T')[0];
      if (dateInput) {
        dateInput.value = iso;
        validateDateChoice(iso);
      }
      document.querySelectorAll('.quick-date-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  document.getElementById('step2-prev-btn')?.addEventListener('click', () => showStep(1));
  document.getElementById('step2-next-btn')?.addEventListener('click', () => {
    if (!dateInput.value) {
      alert('Please choose an appointment date.');
      return;
    }
    if (!validateDateChoice(dateInput.value)) {
      return;
    }
    loadSlotsForDate(dateInput.value);
    showStep(3);
  });

  // --- Step 3: Slots Loader ---
  async function loadSlotsForDate(chosenDate) {
    if (!morningContainer || !eveningContainer) return;
    if (slotsLoading) slotsLoading.style.display = 'block';
    morningContainer.innerHTML = '';
    eveningContainer.innerHTML = '';
    selectedSlotInput.value = '';

    const dateDisplay = document.getElementById('selected-date-display');
    if (dateDisplay) {
      dateDisplay.textContent = `Consultation Slots for ${formatDisplayDate(chosenDate)}:`;
    }

    let bookedTimes = [];
    try {
      const { data } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', chosenDate)
        .not('status', 'in', '("rejected","cancelled")');
      if (data) {
        bookedTimes = data.map(d => d.appointment_time);
      }
    } catch (err) {
      console.warn('Error fetching booked appointments', err);
    }

    if (slotsLoading) slotsLoading.style.display = 'none';

    const availableSlots = getAvailableSlots(chosenDate, bookedTimes);
    const morning = availableSlots.filter(s => s.period === 'Morning');
    const evening = availableSlots.filter(s => s.period === 'Evening');

    function renderSlots(slots, container) {
      if (slots.length === 0) {
        container.innerHTML = '<p style="color:#94A3B8; font-size:0.82rem;">No slots available in this window.</p>';
        return;
      }
      container.innerHTML = slots.map(s => `
        <button type="button" class="slot-btn ${s.isAvailable ? '' : 'disabled'}" data-time="${s.time}" ${s.isAvailable ? '' : 'disabled'} title="${s.disabledReason || 'Available'}">
          ${s.label}
        </button>
      `).join('');
    }

    renderSlots(morning, morningContainer);
    renderSlots(evening, eveningContainer);

    document.querySelectorAll('.slot-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedSlotInput.value = btn.dataset.time;
      });
    });
  }

  document.getElementById('step3-prev-btn')?.addEventListener('click', () => showStep(2));
  document.getElementById('step3-next-btn')?.addEventListener('click', () => {
    if (!selectedSlotInput.value) {
      alert('Please tap on an available 30-minute time slot.');
      return;
    }
    showStep(4);
  });

  // --- Step 4: Patient Details Validation & Step 5 Populate ---
  document.getElementById('step4-prev-btn')?.addEventListener('click', () => showStep(3));
  document.getElementById('step4-next-btn')?.addEventListener('click', () => {
    const name = patientNameInput.value.trim();
    const phone = patientPhoneInput.value.trim();

    if (!name) {
      alert('Please enter the patient full name.');
      patientNameInput.focus();
      return;
    }
    if (!phone || phone.length < 10 || !/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit mobile number.');
      patientPhoneInput.focus();
      return;
    }

    // Populate review summary card in Step 5
    document.getElementById('review-treatment').textContent = selectedTreatmentInput.value;
    document.getElementById('review-date').textContent = formatDisplayDate(dateInput.value);
    document.getElementById('review-time').textContent = formatDisplayTime(selectedSlotInput.value);
    document.getElementById('review-name').textContent = name;
    document.getElementById('review-phone').textContent = phone;

    showStep(5);
  });

  document.getElementById('step5-prev-btn')?.addEventListener('click', () => showStep(4));

  // --- Step 5: Final Submission ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = patientNameInput.value.trim();
    const phone = patientPhoneInput.value.trim();
    const email = patientEmailInput.value.trim();
    const treatment = selectedTreatmentInput.value;
    const date = dateInput.value;
    const time = selectedSlotInput.value;
    const message = patientMessageInput.value.trim();

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Reserving Your Slot...';

    try {
      // 1. Double booking check
      const { data: conflict } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', date)
        .eq('appointment_time', time)
        .not('status', 'in', '("rejected","cancelled")')
        .maybeSingle();

      if (conflict) {
        alert('This slot was just claimed by another patient. Please choose another slot.');
        showStep(3);
        await loadSlotsForDate(date);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Confirm & Generate Queue #';
        return;
      }

      // 2. Queue Number Calculation
      const { count } = await supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('appointment_date', date)
        .not('status', 'in', '("rejected","cancelled")');

      const queueNumber = (count || 0) + 1;
      const cleanDate = date.replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const appointmentId = `APT-${cleanDate}-${randomSuffix}`;

      // 3. Supabase insert
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

      if (insertErr) throw insertErr;

      // 4. Register Notification & Local trigger
      NotificationService.requestPermissionAndRegister('patient', phone);
      NotificationService.showLocalNotification(
        'Dental Paradise — Appointment Booked',
        `Queue #${queueNumber} registered for ${name} on ${formatDisplayDate(date)} at ${formatDisplayTime(time)}.`,
        `/appointment-status?id=${appointmentId}&phone=${encodeURIComponent(phone)}`
      );

      const aptRecord = inserted || {
        id: appointmentId,
        patient_name: name,
        patient_phone: phone,
        treatment_name: treatment,
        appointment_date: date,
        appointment_time: time,
        queue_number: queueNumber
      };

      // 5. Create Patient Confirmation notification in DB & patient bell
      try {
        await NotificationService.notifyPatientBookingConfirmation(aptRecord);
      } catch (patNotifErr) {
        console.warn('Could not record patient confirmation notification:', patNotifErr);
      }

      // 6. Notify Dr. Supriyo Sahu across all active doctor devices & database
      try {
        await NotificationService.notifyDoctorNewAppointment(aptRecord);
      } catch (docNotifErr) {
        console.warn('Could not dispatch doctor notification:', docNotifErr);
      }

      // Save to localStorage for automatic lookup
      localStorage.setItem('last_apt_id', appointmentId);
      localStorage.setItem('last_apt_phone', phone);

      // Hide wizard & tracker
      form.style.display = 'none';
      document.getElementById('wizard-tracker').style.display = 'none';

      // Populate Success View
      document.getElementById('success-apt-id').textContent = appointmentId;
      document.getElementById('success-queue-num').textContent = `#${queueNumber}`;
      document.getElementById('success-patient-name').textContent = name;
      document.getElementById('success-treatment').textContent = treatment;
      document.getElementById('success-date-time').textContent = `${formatDisplayDate(date)} at ${formatDisplayTime(time)}`;
      document.getElementById('success-status-link').href = `/appointment-status?id=${appointmentId}&phone=${encodeURIComponent(phone)}`;

      // Setup WhatsApp share button
      const waText = encodeURIComponent(`Hello Dental Paradise! I have booked an appointment.\n\nQueue Number: #${queueNumber}\nAppointment ID: ${appointmentId}\nPatient: ${name}\nTreatment: ${treatment}\nDate: ${formatDisplayDate(date)}\nTime: ${formatDisplayTime(time)}\nPayment: Cash at Clinic\n\nPlease confirm my visit.`);
      document.getElementById('success-whatsapp-btn').href = `https://wa.me/919733835105?text=${waText}`;

      document.getElementById('booking-success-view').style.display = 'block';

    } catch (err) {
      console.error('Booking submission failed', err);
      alert('Could not submit booking: ' + (err.message || 'Please check your connection and try again.'));
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Confirm & Generate Queue #';
    }
  });
}
