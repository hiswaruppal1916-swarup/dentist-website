export function renderDoctorProfilePage() {
  return `
    <div class="container section" style="padding-top:1.5rem;">
      <div style="margin-bottom:1.5rem;">
        <a href="/" style="display:inline-flex; align-items:center; gap:0.35rem; color:var(--color-secondary); font-weight:600; font-size:0.88rem;">
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Home</span>
        </a>
      </div>

      <div class="responsive-doctor-profile">
        <!-- Left: Doctor Portrait and Direct Contact -->
        <div>
          <div style="position:relative; border-radius:var(--radius-xl); overflow:hidden; box-shadow:var(--shadow-lg); border:2px solid var(--color-outline-variant); margin-bottom:1.25rem;">
            <img src="/images/dr-supriyo-sahu.jpg?v=3" alt="Dr. Supriyo Sahu - Dental Surgeon" style="width:100%; aspect-ratio:4/5; object-fit:cover; object-position:center 15%;" />
            <div style="position:absolute; bottom:12px; right:12px; background:var(--color-secondary); color:#FFFFFF; padding:4px 10px; border-radius:var(--radius-full); font-size:0.75rem; font-weight:700; display:flex; align-items:center; gap:4px; box-shadow:0 2px 8px rgba(0,0,0,0.25);">
              <span class="material-symbols-outlined text-[15px]" style="font-variation-settings: 'FILL' 1;">verified</span>
              <span>Verified Dental Surgeon</span>
            </div>
          </div>

          <div style="background:#FFFFFF; border:1px solid var(--color-outline-variant); border-radius:var(--radius-lg); padding:1.25rem; box-shadow:var(--shadow-sm);">
            <h4 style="font-size:0.95rem; margin-bottom:0.75rem; color:var(--color-primary); display:flex; align-items:center; gap:0.4rem;">
              <span class="material-symbols-outlined text-[18px] text-secondary">contact_phone</span>
              <span>Direct Doctor Contact</span>
            </h4>
            <p style="font-size:0.85rem; color:var(--color-on-surface-variant); margin-bottom:0.5rem;">
              <strong>Call:</strong> <a href="tel:9733835105" style="color:var(--color-secondary); font-weight:700;">9733835105</a>
            </p>
            <p style="font-size:0.85rem; color:var(--color-on-surface-variant); margin-bottom:1.25rem;">
              <strong>WhatsApp:</strong> <a href="https://wa.me/919733835105" target="_blank" rel="noopener noreferrer" style="color:#25D366; font-weight:700;">9733835105</a>
            </p>
            <a href="/book-appointment" class="btn btn-primary" style="width:100%;">
              <span class="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Book Appointment</span>
            </a>
          </div>
        </div>

        <!-- Right: Doctor Qualifications, Training & Departments -->
        <div>
          <span class="section-tag">Clinical Surgeon Profile</span>
          <h1 style="font-size:2.4rem; margin-bottom:0.25rem; color:var(--color-primary);">Dr. Supriyo Sahu</h1>
          <p style="font-size:1.15rem; color:var(--color-secondary); font-weight:700; margin-bottom:1.25rem;">
            B.D.S. (Hons), W.B.U.H.S. (Kolkata)
          </p>

          <!-- Former House Surgeon Credentials -->
          <div style="background:var(--color-surface-container-low); border-left:4px solid var(--color-secondary); padding:1.15rem 1.25rem; border-radius:0 var(--radius-md) var(--radius-md) 0; margin-bottom:1.75rem; border-top:1px solid var(--color-outline-variant); border-right:1px solid var(--color-outline-variant); border-bottom:1px solid var(--color-outline-variant);">
            <strong style="color:var(--color-primary); display:flex; align-items:center; gap:0.4rem; font-size:0.95rem; margin-bottom:0.4rem;">
              <span class="material-symbols-outlined text-[18px] text-secondary">domain</span>
              <span>Former House Surgeon Experience:</span>
            </strong>
            <p style="font-size:0.9rem; color:var(--color-on-surface); line-height:1.6;">
              • <strong>Dr. R. Ahmed Dental College &amp; Hospital, Kolkata</strong> (Asia's Oldest Dental Institution)<br/>
              • <strong>Medical College Hospital, Kolkata</strong> (Premier State Medical College)
            </p>
          </div>

          <!-- Professional Description -->
          <div style="margin-bottom:1.75rem;">
            <h3 style="font-size:1.2rem; margin-bottom:0.65rem; color:var(--color-primary);">Professional Background</h3>
            <p style="color:var(--color-on-surface-variant); font-size:0.92rem; line-height:1.7;">
              Dr. Supriyo Sahu is a distinguished Dental Surgeon trained through the West Bengal University of Health Sciences (WBUHS). His extensive clinical house surgency at Dr. R. Ahmed Dental College and Kolkata Medical College equipped him with advanced surgical and endodontic proficiency, bringing gentle, painless, hospital-grade dental care to the patients of Math Chandipur and Purba Medinipur.
            </p>
          </div>

          <!-- 3 Specialized Departments of Expertise -->
          <div style="margin-bottom:1.75rem;">
            <h3 style="font-size:1.2rem; margin-bottom:0.75rem; color:var(--color-primary);">Core Clinical Departments of Expertise</h3>
            <div style="display:grid; grid-template-columns:1fr; gap:0.75rem;">
              <!-- Dept 1 -->
              <div style="background:#FFFFFF; border:1px solid var(--color-outline-variant); padding:1rem; border-radius:var(--radius-md); box-shadow:var(--shadow-sm); display:flex; gap:0.85rem;">
                <div style="width:36px; height:36px; border-radius:var(--radius-sm); background:var(--color-surface-container-low); color:var(--color-secondary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                  <span class="material-symbols-outlined text-[20px]">medical_services</span>
                </div>
                <div>
                  <strong style="color:var(--color-primary); font-size:0.95rem;">1. Department of Oral &amp; Maxillofacial Surgery</strong>
                  <p style="font-size:0.82rem; color:var(--color-on-surface-variant); margin-top:0.25rem; line-height:1.5;">
                    Specialized in painless extractions, impacted wisdom tooth surgical removal, cystic surgeries, and minor oral trauma management.
                  </p>
                </div>
              </div>

              <!-- Dept 2 -->
              <div style="background:#FFFFFF; border:1px solid var(--color-outline-variant); padding:1rem; border-radius:var(--radius-md); box-shadow:var(--shadow-sm); display:flex; gap:0.85rem;">
                <div style="width:36px; height:36px; border-radius:var(--radius-sm); background:var(--color-surface-container-low); color:var(--color-secondary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                  <span class="material-symbols-outlined text-[20px]">healing</span>
                </div>
                <div>
                  <strong style="color:var(--color-primary); font-size:0.95rem;">2. Department of Conservative Dentistry &amp; Endodontics</strong>
                  <p style="font-size:0.82rem; color:var(--color-on-surface-variant); margin-top:0.25rem; line-height:1.5;">
                    Rotary single and multi-visit root canal treatments (RCT), tooth preservation therapy, and cosmetic tooth-colored fillings.
                  </p>
                </div>
              </div>

              <!-- Dept 3 -->
              <div style="background:#FFFFFF; border:1px solid var(--color-outline-variant); padding:1rem; border-radius:var(--radius-md); box-shadow:var(--shadow-sm); display:flex; gap:0.85rem;">
                <div style="width:36px; height:36px; border-radius:var(--radius-sm); background:var(--color-surface-container-low); color:var(--color-secondary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                  <span class="material-symbols-outlined text-[20px]">dentistry</span>
                </div>
                <div>
                  <strong style="color:var(--color-primary); font-size:0.95rem;">3. Department of Prosthodontia, Crown &amp; Bridge</strong>
                  <p style="font-size:0.82rem; color:var(--color-on-surface-variant); margin-top:0.25rem; line-height:1.5;">
                    Fixed zirconia &amp; ceramic crown restorations, permanent dental bridges, removable dentures, and complete smile aesthetics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Clinic Consultation Schedule -->
          <div style="margin-bottom:2rem;">
            <h3 style="font-size:1.2rem; margin-bottom:0.75rem; color:var(--color-primary);">Clinic Consultation Schedule</h3>
            <div style="background:#FFFFFF; border:1px solid var(--color-outline-variant); border-radius:var(--radius-lg); padding:1.25rem; box-shadow:var(--shadow-sm);">
              <div class="responsive-hours-box">
                <div>
                  <strong style="color:var(--color-primary); font-size:0.9rem;">Consultation Days:</strong>
                  <p style="color:var(--color-secondary); font-weight:700; margin-top:0.25rem;">Tuesday, Wednesday, Thursday, Saturday, Sunday</p>
                  <p style="font-size:0.82rem; color:var(--color-on-surface-variant); margin-top:0.35rem; line-height:1.5;">
                    <strong>Morning:</strong> 8:00 AM – 12:00 PM<br/>
                    <strong>Evening:</strong> 4:00 PM – 8:00 PM
                  </p>
                </div>
                <div style="background:var(--color-surface-container-low); padding:0.85rem; border-radius:var(--radius-md); border:1px solid var(--color-outline-variant);">
                  <strong style="color:var(--color-error); font-size:0.88rem; display:flex; align-items:center; gap:0.35rem;">
                    <span class="material-symbols-outlined text-[16px]">event_busy</span>
                    <span>Clinic Closed Days</span>
                  </strong>
                  <p style="color:var(--color-error); font-weight:700; margin-top:0.25rem; font-size:0.85rem;">
                    Monday &amp; Friday: CLOSED
                  </p>
                  <p style="font-size:0.78rem; color:var(--color-on-surface-variant); margin-top:0.25rem;">
                    No clinical consultations are conducted on Mondays and Fridays. Please book for the next available day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- CTAs -->
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="/book-appointment" class="btn btn-primary btn-lg">
              <span class="material-symbols-outlined text-[20px]">calendar_month</span>
              <span>Book Appointment with Dr. Sahu</span>
            </a>
            <a href="https://wa.me/919733835105" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
              <span>WhatsApp Consultation</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}
