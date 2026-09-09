import { supabase } from '../services/supabase.js';

export async function renderTreatmentDetailPage(slug) {
  let treatment = null;
  try {
    const { data } = await supabase
      .from('treatments')
      .select('*')
      .eq('slug', slug)
      .single();
    treatment = data;
  } catch (e) {
    console.error('Error loading treatment detail', e);
  }

  if (!treatment) {
    return `
      <div class="container section" style="text-align:center; padding:6rem 0;">
        <h2>Treatment Not Found</h2>
        <p style="color:var(--text-muted); margin:1rem 0 2rem;">The requested dental treatment page could not be found.</p>
        <a href="/treatments" class="btn btn-primary">Browse All Treatments</a>
      </div>
    `;
  }

  const whoNeedsEnList = (treatment.who_needs_it_en || []).map(item => `<li>✔ ${item}</li>`).join('');
  const whoNeedsBnList = (treatment.who_needs_it_bn || []).map(item => `<li>✔ ${item}</li>`).join('');

  const stepsEnList = (treatment.procedure_steps_en || []).map((step, idx) => `
    <div style="display:flex; gap:1rem; margin-bottom:1rem; align-items:flex-start;">
      <div style="width:28px; height:28px; border-radius:50%; background:var(--color-primary); color:#FFF; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; flex-shrink:0;">${idx + 1}</div>
      <p style="font-size:0.95rem; color:var(--text-main);">${step}</p>
    </div>
  `).join('');

  const stepsBnList = (treatment.procedure_steps_bn || []).map((step, idx) => `
    <div style="display:flex; gap:1rem; margin-bottom:1rem; align-items:flex-start;">
      <div style="width:28px; height:28px; border-radius:50%; background:var(--color-secondary); color:#FFF; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; flex-shrink:0;">${idx + 1}</div>
      <p style="font-size:0.95rem; color:var(--text-main);" class="bn-text">${step}</p>
    </div>
  `).join('');

  return `
    <div class="container section">
      <div style="margin-bottom:2rem;">
        <a href="/treatments" style="color:var(--color-primary); font-weight:600; font-size:0.9rem;">← Back to All Treatments</a>
      </div>

      <div class="responsive-detail-grid">
        <!-- Left Column: Clinical Information -->
        <div>
          <span class="section-tag">Specialized Dental Care</span>
          <h1 style="font-size:2.5rem; margin-bottom:0.25rem;">${treatment.name_en}</h1>
          <h2 class="bn-text" style="font-size:1.5rem; color:var(--color-primary); font-weight:700; margin-bottom:1.5rem;">
            ${treatment.name_bn}
          </h2>

          <div style="border-radius:var(--radius-xl); overflow:hidden; border:1px solid var(--border-light); margin-bottom:2.5rem; box-shadow:var(--shadow-sm);">
            <img src="${treatment.image_url}" alt="${treatment.name_en}" style="width:100%; height:auto;" />
          </div>

          <!-- English Description -->
          <div style="margin-bottom:2.5rem;">
            <h3 style="font-size:1.35rem; margin-bottom:0.75rem; color:var(--color-secondary);">Clinical Overview</h3>
            <p style="font-size:1.02rem; color:var(--text-main); line-height:1.8;">
              ${treatment.description_en}
            </p>
          </div>

          <!-- Bengali Explanation (বাংলা বিবরণ) -->
          <div style="background:var(--color-primary-soft); border:1px solid var(--color-primary-light); border-radius:var(--radius-lg); padding:1.75rem; margin-bottom:2.5rem;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
              <span style="background:var(--color-primary); color:#FFF; font-size:0.75rem; font-weight:700; padding:0.2rem 0.6rem; border-radius:var(--radius-full);">বাংলা বিবরণ</span>
              <h3 class="bn-text" style="font-size:1.25rem; color:var(--color-secondary); margin:0;">চিকিৎসার সহজ ব্যাখ্যা</h3>
            </div>
            <p class="bn-text" style="font-size:1.05rem; color:var(--text-main); line-height:1.9;">
              ${treatment.description_bn}
            </p>
          </div>

          <!-- Who may need it (English + Bengali) -->
          <div style="margin-bottom:2.5rem;">
            <h3 style="font-size:1.35rem; margin-bottom:1rem; color:var(--color-secondary);">Symptoms & Who May Need Consultation</h3>
            
            <div class="responsive-hours-box" style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.5rem;">
              <div>
                <h4 style="font-size:0.95rem; color:var(--color-primary); margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">English Signs</h4>
                <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; font-size:0.92rem; color:var(--text-muted);">
                  ${whoNeedsEnList}
                </ul>
              </div>
              <div style="border-left:1px solid var(--border-light); padding-left:1.5rem;">
                <h4 class="bn-text" style="font-size:0.95rem; color:var(--color-secondary); margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">লক্ষণসমূহ (বাংলা)</h4>
                <ul class="bn-text" style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; font-size:0.92rem; color:var(--text-muted);">
                  ${whoNeedsBnList}
                </ul>
              </div>
            </div>
          </div>

          <!-- General Treatment Steps -->
          <div style="margin-bottom:2.5rem;">
            <h3 style="font-size:1.35rem; margin-bottom:1rem; color:var(--color-secondary);">General Procedure Steps</h3>
            
            <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.75rem;">
              <div style="margin-bottom:1.5rem;">
                <h4 style="font-size:0.9rem; color:var(--color-primary); text-transform:uppercase; margin-bottom:1rem; letter-spacing:0.05em;">Clinical Steps (English)</h4>
                ${stepsEnList}
              </div>

              <div style="border-top:1px solid var(--border-light); padding-top:1.5rem;">
                <h4 class="bn-text" style="font-size:0.95rem; color:var(--color-secondary); text-transform:uppercase; margin-bottom:1rem; letter-spacing:0.05em;">ধাপসমূহ (বাংলা)</h4>
                ${stepsBnList}
              </div>
            </div>
          </div>

          <!-- Mandatory Clinical Disclaimer -->
          <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:var(--radius-md); padding:1.25rem; display:flex; gap:0.75rem; align-items:flex-start;">
            <span style="font-size:1.5rem;">⚠️</span>
            <div>
              <strong style="color:#92400E; display:block; font-size:0.95rem; margin-bottom:0.25rem;">Important Medical Disclaimer:</strong>
              <p style="font-size:0.88rem; color:#B45309; line-height:1.6;">
                Treatment suitability can only be determined after a proper clinical dental examination by the doctor. This information is intended for educational purposes and should not be considered self-diagnosis.
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column: Booking Card & Doctor Contact -->
        <div style="position:sticky; top:6rem; display:flex; flex-direction:column; gap:1.5rem;">
          <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-xl); padding:2rem; box-shadow:var(--shadow-md);">
            <h3 style="font-size:1.3rem; margin-bottom:0.5rem; color:var(--color-secondary);">Book Consultation</h3>
            <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.5rem;">
              Reserve your 30-minute consultation slot with Dr. Supriyo Sahu.
            </p>

            <div style="background:var(--bg-main); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.5rem; font-size:0.88rem;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                <span style="color:var(--text-muted);">Consulting Doctor:</span>
                <strong>Dr. Supriyo Sahu</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                <span style="color:var(--text-muted);">Slot Duration:</span>
                <strong>30 Minutes</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="color:var(--text-muted);">Payment:</span>
                <strong>Cash at Clinic</strong>
              </div>
            </div>

            <a href="/book-appointment?treatment=${encodeURIComponent(treatment.name_en)}" class="btn btn-primary btn-lg" style="width:100%; margin-bottom:0.75rem;">
              <span>Select Date & Slot</span>
            </a>

            <a href="https://wa.me/919733835105?text=Hello%20Dr.%20Supriyo%20Sahu,%20I%20would%20like%20to%20ask%20about%20${encodeURIComponent(treatment.name_en)}." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="width:100%;">
              <span>Inquire via WhatsApp</span>
            </a>
          </div>

          <!-- Clinic Hours Card -->
          <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.5rem;">
            <h4 style="font-size:1rem; margin-bottom:0.75rem;">Clinic Consultation Hours</h4>
            <div style="font-size:0.85rem; line-height:1.6; color:var(--text-muted);">
              <p><strong>Open Days:</strong> Tue, Wed, Thu, Sat, Sun<br/>
              8:00 AM – 12:00 PM & 4:00 PM – 8:00 PM</p>
              <p style="color:#EF4444; margin-top:0.5rem;"><strong>Closed Days:</strong> Monday & Friday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
