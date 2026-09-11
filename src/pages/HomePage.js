import { supabase } from '../services/supabase.js';
import { isClinicClosedOnDate, formatDisplayDate, formatDisplayTime } from '../utils/schedule.js';
import { NotificationService, playNotificationChime } from '../services/notifications.js';

export async function renderHomePage() {
  const todayStr = new Date().toISOString().split('T')[0];
  const isClosedToday = isClinicClosedOnDate(todayStr);

  // Fetch treatments from Supabase
  let treatments = [];
  try {
    const { data } = await supabase
      .from('treatments')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (data && data.length > 0) treatments = data;
  } catch (e) {
    console.warn('Failed to load treatments from DB, using fallback', e);
  }

  // Fallback 12 treatments if DB is offline
  if (!treatments || treatments.length === 0) {
    treatments = [
      {
        slug: 'root-canal-treatment',
        name_en: 'Root Canal Treatment (RCT)',
        name_bn: 'রুট ক্যানাল ট্রিটমেন্ট',
        summary_en: 'Painless single-sitting or dual-visit rotary endodontics to eliminate tooth infection and save natural teeth.',
        summary_bn: 'দাঁতের তীব্র ব্যথা ও ইনফেকশন দূর করে আসল দাঁত বাঁচানোর ব্যথাহীন আধুনিক চিকিৎসা।',
        image_url: '/images/treatments/root-canal.jpg'
      },
      {
        slug: 'orthodontic-teeth-alignment',
        name_en: 'Orthodontic Treatment (Braces & Aligners)',
        name_bn: 'দাঁতের তার বা অর্থোডন্টিক চিকিৎসা',
        summary_en: 'Correction of crooked, crowded, spaced, or protruding teeth with modern braces and aligners for a harmonious smile.',
        summary_bn: 'উঁচু, নিচু, ফাঁকা বা আঁকাবাঁকা দাঁত সোজা ও সুন্দর করার দীর্ঘস্থায়ী চিকিৎসা।',
        image_url: '/images/treatments/orthodontics.jpg'
      },
      {
        slug: 'painless-tooth-extraction',
        name_en: 'Painless Tooth Extraction',
        name_bn: 'ব্যথাহীন দাঁত তোলা',
        summary_en: 'Gentle, atraumatic tooth removal using calibrated local numbing and sterile surgical instruments.',
        summary_bn: 'সঠিক মাত্রার লোকাল অবশকরণ দ্বারা কোনো প্রকার কষ্ট ছাড়া নিরাপদে দাঁত তোলা।',
        image_url: '/images/treatments/tooth-extraction.jpg'
      },
      {
        slug: 'impaction-wisdom-tooth-surgery',
        name_en: 'Wisdom Tooth & Impaction Surgery',
        name_bn: 'উইজডম দাঁত ও ইমপ্যাকশন সার্জারি',
        summary_en: 'Specialized oral surgery for impacted, angled 3rd molars causing severe jaw swelling and gum pain.',
        summary_bn: 'বাঁকা ও মাড়ির ভেতর আটকে থাকা আক্কেল দাঁতের বিশেষজ্ঞ সার্জিক্যাল সমাধান।',
        image_url: '/images/treatments/wisdom-tooth.jpg'
      },
      {
        slug: 'crown-bridge-prosthesis',
        name_en: 'Dental Crowns & Bridges',
        name_bn: 'দাঁতের ক্যাপ ও ব্রিজ',
        summary_en: 'Precision zirconia, ceramic, and metal prosthetics to restore chewing function and natural smile.',
        summary_bn: 'ভাঙা বা তোলা দাঁতের স্থানে নিখুঁত ও মজবুত কৃত্রিম দাঁত ও ক্যাপ প্রতিস্থাপন।',
        image_url: '/images/treatments/crown-bridge.jpg'
      },
      {
        slug: 'scaling-polishing',
        name_en: 'Teeth Scaling & Polishing',
        name_bn: 'দাঁতের স্কেলিং ও পলিশিং',
        summary_en: 'Ultrasonic piezoelectric cleaning to safely remove hard tartar, tobacco stains, and bad breath.',
        summary_bn: 'দাঁতের ক্ষতিকর পাথর (টারটার), দাগ ও মুখের দুর্গন্ধ দূর করার আধুনিক ক্লিনিক্যাল ওয়াশ।',
        image_url: '/images/treatments/scaling-polishing.jpg'
      },
      {
        slug: 'dental-restoration-fillings',
        name_en: 'Restoration & Tooth-Colored Fillings',
        name_bn: 'দাঁতের ফিলিং ও রেস্টোরেশন',
        summary_en: 'Composite aesthetic fillings to restore cavity holes invisibly and prevent deep nerve infection.',
        summary_bn: 'দাঁতের গর্ত বা ক্যাভিটি দাঁতের স্বাভাবিক রঙের মতো নিখুঁতভাবে ভরাট করার চিকিৎসা।',
        image_url: '/images/treatments/dental-filling.jpg'
      }
    ];
  }

  // Ensure Orthodontic Treatment (Braces) is positioned right after Root Canal Treatment in Clinical Care section
  const orthoIdx = treatments.findIndex(t => t.slug === 'orthodontic-teeth-alignment' || (t.name_en && t.name_en.toLowerCase().includes('orthodontic')));
  if (orthoIdx > -1) {
    const [orthoItem] = treatments.splice(orthoIdx, 1);
    const rctIdx = treatments.findIndex(t => t.slug === 'root-canal-treatment' || (t.name_en && t.name_en.toLowerCase().includes('root canal')));
    if (rctIdx > -1) {
      treatments.splice(rctIdx + 1, 0, orthoItem);
    } else {
      treatments.unshift(orthoItem);
    }
  }

  // Fetch reviews from Supabase
  let reviews = [];
  try {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('id', { ascending: false })
      .limit(3);
    if (data && data.length > 0) reviews = data;
  } catch (e) {}

  if (reviews.length === 0) {
    reviews = [
      {
        patient_name: 'Subhashish Jana',
        treatment_name: 'Root Canal Treatment',
        review_text: 'Dr. Supriyo Sahu is extremely gentle and explained every step. The root canal was totally painless. Best dental care in Chandipur.',
        rating: 5
      },
      {
        patient_name: 'Priyanka Maity',
        treatment_name: 'Wisdom Tooth Surgery',
        review_text: 'I was very scared of surgical extraction, but Dr. Sahu did it smoothly in 20 minutes with zero discomfort. Highly recommended.',
        rating: 5
      },
      {
        patient_name: 'Debabrata Das',
        treatment_name: 'Crown & Bridge',
        review_text: 'Very professional clinic with hospital-level sterilization. The online queue system saved me from unnecessary waiting.',
        rating: 5
      }
    ];
  }

  // Display top 6 on homepage
  const featuredTreatments = treatments.slice(0, 6);

  const treatmentCardsHtml = featuredTreatments.map(t => {
    const imgSrc = t.image_url ? `${t.image_url.split('?')[0]}?v=3` : '';
    return `
    <article class="treatment-card">
      <div class="treatment-image-box">
        <img src="${imgSrc}" alt="${t.name_en}" loading="lazy" />
      </div>
      <div class="treatment-body">
        <span class="treatment-category-chip">Clinical Care</span>
        <h3 class="treatment-title-en">${t.name_en}</h3>
        <h4 class="treatment-title-bn bn-text">${t.name_bn || ''}</h4>
        <p class="treatment-summary">${t.summary_en || ''}</p>
        <p class="treatment-summary-bn bn-text">${t.summary_bn || ''}</p>
        <div class="treatment-footer">
          <a href="/treatments/${t.slug}" class="treatment-link">
            <span>Learn More &amp; Bengali Guide</span> →
          </a>
          <a href="/book-appointment?treatment=${encodeURIComponent(t.name_en)}" class="btn btn-secondary btn-sm">
            <span>Book</span>
          </a>
        </div>
      </div>
    </article>
  `;
  }).join('');

  const reviewsHtml = reviews.map(r => `
    <div style="background:#FFFFFF; border:1px solid var(--color-outline-variant); border-radius:var(--radius-lg); padding:1.5rem; box-shadow:var(--shadow-sm);">
      <div style="display:flex; align-items:center; gap:0.2rem; color:#F59E0B; margin-bottom:0.65rem;">
        ${'★'.repeat(r.rating || 5)}
      </div>
      <p style="font-size:0.9rem; color:var(--color-on-surface-variant); margin-bottom:1rem; font-style:italic; line-height:1.6;">
        "${r.review_text}"
      </p>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-surface-container); padding-top:0.65rem;">
        <strong style="color:var(--color-primary); font-size:0.9rem;">${r.patient_name}</strong>
        <span style="font-size:0.78rem; color:var(--color-secondary); font-weight:700;">${r.treatment_name || 'Patient'}</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="container" style="padding-top:1.25rem;">
      <!-- DOCTOR PROFILE HERO SECTION (Google Stitch Layout) -->
      <section class="hero-doctor-card">
        <div class="doctor-flex-box">
          <!-- Doctor Portrait / Avatar -->
          <div class="doctor-avatar-wrapper">
            <img class="doctor-avatar-img" alt="Dr. Supriyo Sahu" src="/images/dr-supriyo-sahu.jpg" />
            <div class="verified-doctor-badge" title="Verified BDS Surgeon">
              <span class="material-symbols-outlined text-[16px] font-bold" style="font-variation-settings: 'FILL' 1;">verified</span>
            </div>
          </div>

          <!-- Doctor Bio Info -->
          <div class="doctor-meta" style="flex:1; min-width:0;">
            <h2>Dr. Supriyo Sahu</h2>
            <p class="doctor-degree">B.D.S. (Hons), W.B.U.H.S. (Kolkata)</p>
            <p class="doctor-ex-hosp">Former House Surgeon • Dr. R. Ahmed Dental College &amp; Hospital &amp; Medical College Hospital, Kolkata</p>

            <div class="doctor-badges-row">
              <span class="doctor-badge-chip">
                <span class="material-symbols-outlined text-[14px] text-secondary">military_tech</span>
                Ex-R. Ahmed
              </span>
              <span class="doctor-badge-chip">
                <span class="material-symbols-outlined text-[14px]" style="color:#F59E0B; font-variation-settings: 'FILL' 1;">star</span>
                4.9 (1,850+)
              </span>
              <span class="doctor-badge-chip" style="color:var(--color-secondary);">
                <span class="material-symbols-outlined text-[14px]">thumb_up</span>
                99%
              </span>
            </div>
          </div>
        </div>

        <!-- Doctor CTAs / Quick Actions -->
        <div class="hero-cta-grid">
          <a href="/book-appointment" class="btn btn-primary" style="font-weight:700;">
            <span class="material-symbols-outlined text-[20px]">calendar_month</span>
            <span>Book Appointment</span>
          </a>
          <a href="tel:9733835105" class="btn btn-outline" style="border-radius:var(--radius-md);" aria-label="Call Doctor Directly">
            <span class="material-symbols-outlined text-[20px] text-secondary">call</span>
            <span style="font-weight:700;">Call Now</span>
          </a>
        </div>
      </section>

      <!-- LIVE PATIENT APPOINTMENT TRACKER (If patient has active booking) -->
      <div id="patient-active-appointment-container"></div>

      <!-- CLINICAL TRUST HIGHLIGHTS STRIP -->
      <section class="trust-strip-grid">
        <div class="trust-card">
          <div class="trust-icon-box">
            <span class="material-symbols-outlined text-[18px]">sanitizer</span>
          </div>
          <div class="trust-info">
            <h4>100% Sterilized</h4>
            <p>Class-B Autoclave</p>
          </div>
        </div>

        <div class="trust-card">
          <div class="trust-icon-box">
            <span class="material-symbols-outlined text-[18px]">healing</span>
          </div>
          <div class="trust-info">
            <h4>Painless Care</h4>
            <p>Calibrated Numbing</p>
          </div>
        </div>

        <div class="trust-card">
          <div class="trust-icon-box">
            <span class="material-symbols-outlined text-[18px]">schedule</span>
          </div>
          <div class="trust-info">
            <h4>Live Queue #</h4>
            <p>Zero Waiting Rush</p>
          </div>
        </div>

        <div class="trust-card">
          <div class="trust-icon-box">
            <span class="material-symbols-outlined text-[18px]">payments</span>
          </div>
          <div class="trust-info">
            <h4>Cash at Clinic</h4>
            <p>₹0 Advance Needed</p>
          </div>
        </div>
      </section>

      <!-- WEEKLY OPD SCHEDULE CARD (Strict Monday & Friday Closed) -->
      <section class="schedule-card">
        <div class="schedule-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="material-symbols-outlined text-secondary text-[20px]">calendar_clock</span>
            <h3 style="font-size:1.05rem; margin:0;">Weekly OPD Consultation Schedule</h3>
          </div>
          <span style="font-size:0.72rem; background:var(--color-surface-container); color:var(--color-primary); padding:0.2rem 0.6rem; border-radius:var(--radius-full); font-weight:700;">
            Regular Timings
          </span>
        </div>

        <div class="schedule-hours-pill">
          <div>
            <strong style="color:var(--color-primary);">Morning Session:</strong> 8:00 AM – 12:00 PM
          </div>
          <div>
            <strong style="color:var(--color-primary);">Evening Session:</strong> 4:00 PM – 8:00 PM
          </div>
        </div>

        <!-- 7-Days Operational Status Row -->
        <div class="seven-days-row">
          <div class="day-col-item">
            <span>Sun</span>
            <span class="day-status-dot"></span>
            <span class="day-status-label">Open</span>
          </div>
          <div class="day-col-item closed">
            <span>Mon</span>
            <span class="day-status-dot"></span>
            <span class="day-status-label">Closed</span>
          </div>
          <div class="day-col-item">
            <span>Tue</span>
            <span class="day-status-dot"></span>
            <span class="day-status-label">Open</span>
          </div>
          <div class="day-col-item">
            <span>Wed</span>
            <span class="day-status-dot"></span>
            <span class="day-status-label">Open</span>
          </div>
          <div class="day-col-item">
            <span>Thu</span>
            <span class="day-status-dot"></span>
            <span class="day-status-label">Open</span>
          </div>
          <div class="day-col-item closed">
            <span>Fri</span>
            <span class="day-status-dot"></span>
            <span class="day-status-label">Closed</span>
          </div>
          <div class="day-col-item">
            <span>Sat</span>
            <span class="day-status-dot"></span>
            <span class="day-status-label">Open</span>
          </div>
        </div>
      </section>

      <!-- SPECIALIZED DENTAL TREATMENTS (BILINGUAL) -->
      <section style="margin-top:2.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1.25rem;">
          <div>
            <span class="section-tag">Clinical Dental Procedures</span>
            <h2 style="font-size:1.6rem; margin-top:0.25rem;">Specialized Treatments</h2>
            <p style="font-size:0.88rem; color:var(--color-secondary); font-weight:600;" class="bn-text">বিশেষায়িত দাঁতের চিকিৎসা (১২টি সেবা)</p>
          </div>
          <a href="/treatments" class="btn btn-outline btn-sm" style="white-space:nowrap;">
            <span>View All 12 →</span>
          </a>
        </div>

        <div class="treatments-grid">
          ${treatmentCardsHtml}
        </div>
      </section>

      <!-- DENTAL EMERGENCY ACTION BANNER -->
      <section class="emergency-banner">
        <div class="emergency-info">
          <span class="emergency-tag">
            <span class="material-symbols-outlined text-[16px]">emergency</span>
            <span>Dental Emergency?</span>
          </span>
          <h3>Severe Toothache or Accident Trauma?</h3>
          <p>Get immediate clinical assistance or telephone guidance from Dr. Sahu.</p>
          <a href="tel:9733835105" style="color:var(--color-secondary-container); font-weight:800; font-size:1.05rem; margin-top:0.4rem; display:inline-flex; align-items:center; gap:0.35rem;">
            <span class="material-symbols-outlined text-[18px]">call</span>
            <span>9733835105</span>
          </a>
        </div>
        <a href="tel:9733835105" class="emergency-call-btn" aria-label="Call Emergency Number">
          <span class="material-symbols-outlined text-[24px]">call</span>
        </a>
      </section>

      <!-- PATIENT REVIEWS & RATINGS -->
      <section style="margin-top:2.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:1.25rem;">
          <div>
            <span class="section-tag">Patient Satisfaction</span>
            <h2 style="font-size:1.5rem; margin-top:0.25rem;">Patient Experiences</h2>
          </div>
          <a href="/reviews" style="font-size:0.85rem; font-weight:700; color:var(--color-secondary);">Read All Reviews →</a>
        </div>
        <div style="display:grid; grid-template-columns:1fr; gap:1rem;">
          ${reviewsHtml}
        </div>
      </section>

      <!-- CLINIC LOCATION & DIRECT VISIT SECTION -->
      <section style="margin-top:2.5rem; margin-bottom:2rem;">
        <div class="responsive-card-box">
          <div class="responsive-two-col" style="align-items:center;">
            <div>
              <span class="section-tag">Direct Clinical Visit</span>
              <h2 style="font-size:1.6rem; margin-bottom:0.75rem;">Dental Paradise Clinic</h2>
              <p style="font-size:0.92rem; color:var(--color-on-surface-variant); margin-bottom:1rem; line-height:1.6;">
                <strong>Math Chandipur, Chandipur Market area</strong><br/>
                Behind Life Care Diagnostic Center,<br/>
                PIN- 721659, West Bengal
              </p>
              <p style="font-size:0.85rem; color:var(--color-on-surface-variant); margin-bottom:1.5rem;">
                Near Chandipur bus stop. Easily accessible with ample parking space and wheelchair-friendly entrance.
              </p>
              <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                <a href="/book-appointment" class="btn btn-primary">Book Consultation</a>
                <a href="https://maps.google.com/?q=Math+Chandipur+Market+Life+Care+Diagnostic+Center+721659" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                  <span class="material-symbols-outlined text-[18px]">map</span>
                  <span>Google Maps</span>
                </a>
              </div>
            </div>

            <div style="text-align:center;">
              <img src="/images/dental-paradise-card.jpg" alt="Dental Paradise Visiting Card" style="width:100%; border-radius:var(--radius-lg); box-shadow:var(--shadow-md);" />
              <p style="font-size:0.78rem; color:var(--color-outline); margin-top:0.5rem;">Official Clinic Board &amp; Visiting Card</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

export async function initHomePageEvents() {
  const trackerContainer = document.getElementById('patient-active-appointment-container');
  if (!trackerContainer) return;

  const lastAptId = localStorage.getItem('last_apt_id');
  if (!lastAptId) return;

  async function loadActiveAppointment() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', lastAptId)
        .maybeSingle();

      if (error || !data) return;

      // Do not show completed or cancelled appointments on the live active widget
      if (data.status === 'completed' || data.status === 'cancelled') {
        trackerContainer.innerHTML = '';
        return;
      }

      let statusBadgeClass = data.status;
      let statusLabel = data.status;
      if (data.status === 'confirmed') statusLabel = 'Accepted & Confirmed';
      else if (data.status === 'pending') statusLabel = 'Pending Review';
      else if (data.status === 'arrived') statusLabel = 'Patient Arrived';
      else if (data.status === 'in_consultation') statusLabel = 'In Consultation';
      else if (data.status === 'rejected') statusLabel = 'Not Accepted';

      trackerContainer.innerHTML = `
        <div class="active-apt-tracker-card">
          <div class="active-apt-tracker-header">
            <span class="active-apt-tag">
              <span class="material-symbols-outlined text-[14px]">schedule</span>
              <span>Your Live Consultation • Queue #${data.queue_number || '•'}</span>
            </span>
            <span class="status-badge ${statusBadgeClass}">● ${statusLabel}</span>
          </div>

          <div class="active-apt-body">
            <div class="active-apt-info">
              <h3>${data.treatment_name}</h3>
              <div class="active-apt-meta">
                <span>🗓️ ${formatDisplayDate(data.appointment_date)}</span>
                <span>⏰ ${formatDisplayTime(data.appointment_time)}</span>
                <span>👤 ${data.patient_name}</span>
              </div>
            </div>

            <a href="/appointment-status?id=${data.id}&phone=${encodeURIComponent(data.patient_phone || '')}" class="btn btn-secondary btn-sm" style="white-space:nowrap;">
              <span>Track Queue &amp; Directions →</span>
            </a>
          </div>
        </div>
      `;

      // Realtime subscription for live patient status changes on homepage
      if (window.__dp_home_channel) {
        supabase.removeChannel(window.__dp_home_channel);
        window.__dp_home_channel = null;
      }

      window.__dp_home_channel = supabase
        .channel(`home-apt-${data.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'appointments',
            filter: `id=eq.${data.id}`
          },
          (payload) => {
            console.log('Realtime status change received on homepage:', payload);
            playNotificationChime('patient');
            NotificationService.showToast(
              `🔔 Your appointment status updated to: ${payload.new.status.toUpperCase()}!`,
              'success'
            );
            loadActiveAppointment();
          }
        )
        .subscribe();

    } catch (e) {
      console.warn('Could not load patient active appointment for homepage tracker:', e);
    }
  }

  loadActiveAppointment();
}

