import { supabase } from '../services/supabase.js';
import { isClinicClosedOnDate } from '../utils/schedule.js';

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
      .order('display_order', { ascending: true })
      .limit(6);
    if (data && data.length > 0) treatments = data;
  } catch (e) {
    console.warn('Failed to load treatments from DB, using fallback', e);
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

  const treatmentCardsHtml = treatments.map(t => `
    <div class="treatment-card">
      <div class="treatment-image-box">
        <img src="${t.image_url}" alt="${t.name_en}" loading="lazy" />
      </div>
      <div class="treatment-body">
        <h3 class="treatment-title-en">${t.name_en}</h3>
        <h4 class="treatment-title-bn bn-text">${t.name_bn}</h4>
        <p class="treatment-summary">${t.summary_en}</p>
        <div class="treatment-footer">
          <a href="/treatments/${t.slug}" class="treatment-link">
            <span>Learn More & Bengali Guide</span> →
          </a>
          <a href="/book-appointment?treatment=${encodeURIComponent(t.name_en)}" class="btn btn-outline btn-sm">Book</a>
        </div>
      </div>
    </div>
  `).join('');

  const reviewsHtml = reviews.map(r => `
    <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.75rem; box-shadow:var(--shadow-sm);">
      <div style="display:flex; align-items:center; gap:0.25rem; color:#F59E0B; margin-bottom:0.75rem;">
        ${'★'.repeat(r.rating || 5)}
      </div>
      <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:1rem; font-style:italic;">"${r.review_text}"</p>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong style="color:var(--color-secondary); font-size:0.95rem;">${r.patient_name}</strong>
        <span style="font-size:0.8rem; color:var(--color-primary); font-weight:600;">${r.treatment_name || 'Patient'}</span>
      </div>
    </div>
  `).join('');

  return `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-glow"></div>
      <div class="container hero-grid">
        <div>
          <div class="hero-badge-pill">
            <span>🌿</span>
            <span>A Complete Oral & Dental Care • Math Chandipur</span>
          </div>
          <h1 class="hero-title">
            Gentle, Advanced & Trusted <span>Dental Care</span>
          </h1>
          <p class="hero-subtitle">
            Experience painless dentistry and specialized oral care by <strong>Dr. Supriyo Sahu</strong> (B.D.S. Hons, W.B.U.H.S.), Former House Surgeon at Dr. R. Ahmed Dental College & Hospital, Kolkata.
          </p>
          <div class="hero-actions">
            <a href="/book-appointment" class="btn btn-primary btn-lg">
              <span>Book Appointment</span>
            </a>
            <a href="tel:9733835105" class="btn btn-secondary btn-lg">
              <span>📞 Call 9733835105</span>
            </a>
            <a href="https://wa.me/919733835105?text=Hello%20Dental%20Paradise,%20I%20would%20like%20to%20book%20an%20appointment." target="_blank" class="btn btn-whatsapp btn-lg">
              <span>WhatsApp Us</span>
            </a>
          </div>

          <div class="hero-stats">
            <div class="stat-item">
              <h4>Dr. R. Ahmed</h4>
              <p>Ex-House Surgeon Training</p>
            </div>
            <div class="stat-item">
              <h4>Painless Care</h4>
              <p>Modern Anesthesia & RCT</p>
            </div>
            <div class="stat-item">
              <h4>${isClosedToday ? 'Closed Today' : 'Open Today'}</h4>
              <p>${isClosedToday ? 'Book for next open day' : '8 AM–12 PM & 4 PM–8 PM'}</p>
            </div>
          </div>
        </div>

        <!-- Doctor Profile Card in Hero -->
        <div class="hero-doctor-card">
          <div class="doctor-photo-wrapper">
            <img src="/images/dr-supriyo-sahu.jpg" alt="Dr. Supriyo Sahu - Dental Paradise" />
            <div class="doctor-floating-badge">
              <div class="doctor-name-badge">Dr. Supriyo Sahu</div>
              <div class="doctor-degree-badge">B.D.S. (Hons), W.B.U.H.S. (Kolkata)</div>
              <div class="doctor-inst-badge">Former House Surgeon • Dr. R. Ahmed Dental College & Medical College Hospital, Kolkata</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Highlights Bar -->
    <section class="trust-bar">
      <div class="container trust-grid">
        <div class="trust-item">
          <div class="trust-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="trust-text">
            <h4>Painless Treatments</h4>
            <p>Gentle root canal & extractions using calibrated local numbing.</p>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="trust-text">
            <h4>Live Queue Ordering</h4>
            <p>Know your real-time queue position with no crowded waiting.</p>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <div class="trust-text">
            <h4>Strict Clinical Hours</h4>
            <p>Morning 8 AM–12 PM & Evening 4 PM–8 PM (Mon & Fri Closed).</p>
          </div>
        </div>

        <div class="trust-item">
          <div class="trust-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="trust-text">
            <h4>Specialized Departments</h4>
            <p>Oral Surgery, Endodontics, Prosthodontia & Cosmetic Dentistry.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Clinic Schedule Card -->
    <section class="section" style="padding-bottom:1rem;">
      <div class="container">
        <div class="schedule-card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
            <div>
              <span class="section-tag">Clinic Availability</span>
              <h2 style="font-size:1.8rem; margin-top:0.25rem;">Weekly Consultation Hours</h2>
              <p style="color:var(--text-muted); font-size:0.95rem; margin-top:0.25rem;">
                Please note our strict schedule. Online appointments are only accepted for open days and valid future slots.
              </p>
            </div>
            <a href="/book-appointment" class="btn btn-primary">Book Consultation Slot</a>
          </div>

          <div class="schedule-grid">
            <div class="schedule-day-box is-closed">
              <div class="day-name">Monday</div>
              <div class="day-status-closed">CLOSED</div>
              <div class="day-time">No Consultations</div>
            </div>
            <div class="schedule-day-box">
              <div class="day-name">Tuesday</div>
              <div class="day-status-open">OPEN</div>
              <div class="day-time">8–12 & 4–8</div>
            </div>
            <div class="schedule-day-box">
              <div class="day-name">Wednesday</div>
              <div class="day-status-open">OPEN</div>
              <div class="day-time">8–12 & 4–8</div>
            </div>
            <div class="schedule-day-box">
              <div class="day-name">Thursday</div>
              <div class="day-status-open">OPEN</div>
              <div class="day-time">8–12 & 4–8</div>
            </div>
            <div class="schedule-day-box is-closed">
              <div class="day-name">Friday</div>
              <div class="day-status-closed">CLOSED</div>
              <div class="day-time">No Consultations</div>
            </div>
            <div class="schedule-day-box">
              <div class="day-name">Saturday</div>
              <div class="day-status-open">OPEN</div>
              <div class="day-time">8–12 & 4–8</div>
            </div>
            <div class="schedule-day-box">
              <div class="day-name">Sunday</div>
              <div class="day-status-open">OPEN</div>
              <div class="day-time">8–12 & 4–8</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Treatments Overview Section -->
    <section class="section" style="background:#FFFFFF;">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Specialized Dental Services</span>
          <h2 class="section-title">Comprehensive Dental Treatments</h2>
          <p class="section-desc">
            Bilingual clinical guides in English and Bengali to help you understand your dental needs.
          </p>
        </div>

        <div class="treatments-grid">
          ${treatmentCardsHtml}
        </div>

        <div style="text-align:center; margin-top:3rem;">
          <a href="/treatments" class="btn btn-secondary btn-lg">
            <span>View All 12 Dental Treatments</span> →
          </a>
        </div>
      </div>
    </section>

    <!-- Doctor Profile Preview Section -->
    <section class="section">
      <div class="container">
        <div style="display:grid; grid-template-columns:1fr 1.2fr; gap:3.5rem; align-items:center; background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-xl); padding:3rem; box-shadow:var(--shadow-md);">
          <div>
            <div style="border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg);">
              <img src="/images/dr-supriyo-sahu.jpg" alt="Dr. Supriyo Sahu" style="width:100%; height:100%; object-fit:cover;" />
            </div>
          </div>
          <div>
            <span class="section-tag">Lead Dental Surgeon</span>
            <h2 style="font-size:2.2rem; margin-bottom:0.5rem;">Dr. Supriyo Sahu</h2>
            <p style="color:var(--color-primary); font-weight:700; font-size:1.1rem; margin-bottom:1rem;">
              B.D.S. (Hons), W.B.U.H.S. (Kolkata)
            </p>
            <p style="color:var(--text-muted); margin-bottom:1.5rem; line-height:1.7;">
              Former House Surgeon at two premier institutions: <strong>Dr. R. Ahmed Dental College & Hospital, Kolkata</strong> and <strong>Medical College Hospital, Kolkata</strong>.
            </p>
            <div style="margin-bottom:1.75rem;">
              <h4 style="font-size:0.95rem; text-transform:uppercase; color:var(--color-secondary); margin-bottom:0.5rem; letter-spacing:0.05em;">Clinical Training Areas:</h4>
              <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; font-size:0.92rem; color:var(--text-muted);">
                <li>🔹 Department of Oral and Maxillofacial Surgery</li>
                <li>🔹 Department of Conservative Dentistry & Endodontics</li>
                <li>🔹 Department of Prosthodontia, Crown & Bridge</li>
              </ul>
            </div>
            <div style="display:flex; gap:1rem; flex-wrap:wrap;">
              <a href="/doctors/dr-supriyo-sahu" class="btn btn-secondary">Read Full Profile</a>
              <a href="/book-appointment" class="btn btn-primary">Book Consultation</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How Appointment Works -->
    <section class="section" style="background:var(--color-primary-soft);">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Seamless Patient Flow</span>
          <h2 class="section-title">How Appointments Work</h2>
          <p class="section-desc">Four simple steps to secure your dental consultation without waiting in line.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:2rem;">
          <div style="background:#FFFFFF; padding:2rem; border-radius:var(--radius-lg); border:1px solid var(--border-light); text-align:center;">
            <div style="width:48px; height:48px; border-radius:var(--radius-full); background:var(--color-primary); color:#FFFFFF; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; font-weight:800; font-size:1.25rem;">1</div>
            <h4 style="margin-bottom:0.5rem;">Select Date & Slot</h4>
            <p style="font-size:0.88rem; color:var(--text-muted);">Pick any open day (Tue, Wed, Thu, Sat, Sun) and choose an available 30-min slot.</p>
          </div>

          <div style="background:#FFFFFF; padding:2rem; border-radius:var(--radius-lg); border:1px solid var(--border-light); text-align:center;">
            <div style="width:48px; height:48px; border-radius:var(--radius-full); background:var(--color-secondary); color:#FFFFFF; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; font-weight:800; font-size:1.25rem;">2</div>
            <h4 style="margin-bottom:0.5rem;">Doctor Review</h4>
            <p style="font-size:0.88rem; color:var(--text-muted);">Dr. Sahu reviews and accepts your request. You receive an instant confirmation update.</p>
          </div>

          <div style="background:#FFFFFF; padding:2rem; border-radius:var(--radius-lg); border:1px solid var(--border-light); text-align:center;">
            <div style="width:48px; height:48px; border-radius:var(--radius-full); background:var(--color-primary-dark); color:#FFFFFF; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; font-weight:800; font-size:1.25rem;">3</div>
            <h4 style="margin-bottom:0.5rem;">Live Queue Status</h4>
            <p style="font-size:0.88rem; color:var(--text-muted);">Track your appointment status and queue number (#1, #2...) anytime from your phone.</p>
          </div>

          <div style="background:#FFFFFF; padding:2rem; border-radius:var(--radius-lg); border:1px solid var(--border-light); text-align:center;">
            <div style="width:48px; height:48px; border-radius:var(--radius-full); background:#10B981; color:#FFFFFF; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; font-weight:800; font-size:1.25rem;">4</div>
            <h4 style="margin-bottom:0.5rem;">Clinic Visit & Care</h4>
            <p style="font-size:0.88rem; color:var(--text-muted);">Visit the clinic at Math Chandipur, receive painless dental care, and pay cash at clinic.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews Section -->
    <section class="section" style="background:#FFFFFF;">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Patient Experiences</span>
          <h2 class="section-title">What Our Patients Say</h2>
          <p class="section-desc">Honest reviews from families and patients in Math Chandipur and nearby areas.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:2rem;">
          ${reviewsHtml}
        </div>

        <div style="text-align:center; margin-top:2.5rem;">
          <a href="/reviews" class="btn btn-outline">Read All Reviews or Share Feedback</a>
        </div>
      </div>
    </section>

    <!-- Location & Directions Section -->
    <section class="section">
      <div class="container">
        <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-xl); padding:3rem; box-shadow:var(--shadow-md);">
          <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:3rem; align-items:center;">
            <div>
              <span class="section-tag">Visit Our Clinic</span>
              <h2 style="font-size:2rem; margin-bottom:1rem;">Convenient Location in Math Chandipur</h2>
              <p style="color:var(--text-muted); margin-bottom:1.5rem; font-size:1rem; line-height:1.7;">
                <strong>Dental Paradise</strong> is easily accessible for patients from Chandipur Market and surrounding localities. Located just behind Life Care Diagnostic Center.
              </p>
              <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.95rem; margin-bottom:1.75rem;">
                <div>📍 <strong>Address:</strong> Math Chandipur, Chandipur Market, Behind Life Care Diagnostic Center, PIN- 721659</div>
                <div>📞 <strong>Phone:</strong> <a href="tel:9733835105" style="color:var(--color-primary); font-weight:700;">9733835105</a></div>
                <div>💬 <strong>WhatsApp:</strong> <a href="https://wa.me/919733835105" target="_blank" style="color:#25D366; font-weight:700;">9733835105</a></div>
                <div>💵 <strong>Payment:</strong> Cash at Clinic</div>
              </div>
              <div style="display:flex; gap:1rem; flex-wrap:wrap;">
                <a href="https://maps.google.com/?q=Math+Chandipur+Market+Life+Care+Diagnostic+Center+721659" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                  <span>Open in Google Maps</span> ↗
                </a>
                <a href="/contact" class="btn btn-secondary">Contact Details</a>
              </div>
            </div>

            <div style="border-radius:var(--radius-lg); overflow:hidden; border:1px solid var(--border-light); background:var(--bg-main); padding:1.5rem; text-align:center;">
              <img src="/images/dental-paradise-card.jpg" alt="Dental Paradise Clinic Card" style="width:100%; border-radius:var(--radius-md); box-shadow:var(--shadow-sm); margin-bottom:1rem;" />
              <p style="font-size:0.8rem; color:var(--text-muted);">Official Clinic Information & Visiting Card</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Strong Final CTA -->
    <section style="background:linear-gradient(135deg, #0B2545 0%, #00A896 100%); color:#FFFFFF; padding:4.5rem 0; text-align:center;">
      <div class="container">
        <h2 style="color:#FFFFFF; font-size:2.5rem; margin-bottom:1rem;">Ready for Healthy, Pain-Free Teeth?</h2>
        <p style="color:#E8F6F5; font-size:1.15rem; max-width:600px; margin:0 auto 2.5rem;">
          Book your consultation slot online in less than a minute. Cash payment at clinic.
        </p>
        <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
          <a href="/book-appointment" class="btn btn-secondary btn-lg" style="background:#FFFFFF; color:var(--color-secondary);">
            <span>Book Your Appointment</span>
          </a>
          <a href="tel:9733835105" class="btn btn-outline btn-lg" style="border-color:#FFFFFF; color:#FFFFFF;">
            <span>Call 9733835105</span>
          </a>
        </div>
      </div>
    </section>
  `;
}
