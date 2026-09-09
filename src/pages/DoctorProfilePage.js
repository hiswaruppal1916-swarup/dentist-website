export function renderDoctorProfilePage() {
  return `
    <div class="container section">
      <div style="margin-bottom:2rem;">
        <a href="/" style="color:var(--color-primary); font-weight:600; font-size:0.9rem;">← Back to Home</a>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1.8fr; gap:3rem; background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-xl); padding:3rem; box-shadow:var(--shadow-md);">
        <!-- Left: Doctor Photo and Quick Stats -->
        <div>
          <div style="border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg); margin-bottom:1.5rem;">
            <img src="/images/dr-supriyo-sahu.jpg" alt="Dr. Supriyo Sahu" style="width:100%; aspect-ratio:4/5; object-fit:cover;" />
          </div>

          <div style="background:var(--bg-main); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.25rem;">
            <h4 style="font-size:0.95rem; margin-bottom:0.75rem; color:var(--color-secondary);">Direct Doctor Contact</h4>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">📞 Call: <a href="tel:9733835105" style="color:var(--color-primary); font-weight:700;">9733835105</a></p>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">💬 WhatsApp: <a href="https://wa.me/919733835105" target="_blank" style="color:#25D366; font-weight:700;">9733835105</a></p>
            <a href="/book-appointment" class="btn btn-primary" style="width:100%;">Book Consultation</a>
          </div>
        </div>

        <!-- Right: Doctor Bio & Credentials -->
        <div>
          <span class="section-tag">Clinical Dental Profile</span>
          <h1 style="font-size:2.6rem; margin-bottom:0.25rem;">Dr. Supriyo Sahu</h1>
          <p style="font-size:1.25rem; color:var(--color-primary); font-weight:700; margin-bottom:1.5rem;">
            B.D.S. (Hons), W.B.U.H.S. (Kolkata)
          </p>

          <div style="background:var(--color-primary-soft); border-left:4px solid var(--color-primary); padding:1rem 1.25rem; border-radius:0 var(--radius-md) var(--radius-md) 0; margin-bottom:2rem;">
            <strong style="color:var(--color-secondary); display:block; font-size:1rem; margin-bottom:0.25rem;">Former House Surgeon:</strong>
            <p style="font-size:0.95rem; color:var(--text-main);">
              • Dr. R. Ahmed Dental College & Hospital, Kolkata<br/>
              • Medical College Hospital, Kolkata
            </p>
          </div>

          <div style="margin-bottom:2rem;">
            <h3 style="font-size:1.3rem; margin-bottom:0.75rem;">Specialized Departments & Clinical Experience</h3>
            <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1rem; line-height:1.7;">
              Trained through prestigious state medical institutions in Kolkata, Dr. Supriyo Sahu brings clinical precision and deep anatomical expertise across core dental surgical and restorative fields:
            </p>
            <div style="display:grid; grid-template-columns:1fr; gap:0.75rem;">
              <div style="background:#FFFFFF; border:1px solid var(--border-light); padding:1rem; border-radius:var(--radius-md);">
                <strong style="color:var(--color-secondary);">1. Department of Oral & Maxillofacial Surgery</strong>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">Minimally traumatic impaction surgeries, wisdom tooth extractions, oral cysts, and jaw minor surgical care.</p>
              </div>
              <div style="background:#FFFFFF; border:1px solid var(--border-light); padding:1rem; border-radius:var(--radius-md);">
                <strong style="color:var(--color-secondary);">2. Department of Conservative Dentistry & Endodontics</strong>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">Micro-biological infection control, painless single & multi-visit root canal treatments, and aesthetic restorations.</p>
              </div>
              <div style="background:#FFFFFF; border:1px solid var(--border-light); padding:1rem; border-radius:var(--radius-md);">
                <strong style="color:var(--color-secondary);">3. Department of Prosthodontia, Crown & Bridge</strong>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">Fixed ceramic and zirconia prosthetics, smile reconstructions, and precision bite rehabilitations.</p>
              </div>
            </div>
          </div>

          <!-- Schedule & Hours -->
          <div style="margin-bottom:2.5rem;">
            <h3 style="font-size:1.3rem; margin-bottom:0.75rem;">Clinic Consultation Schedule</h3>
            <div style="background:var(--bg-main); border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.25rem;">
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.92rem;">
                <div>
                  <strong style="color:var(--color-secondary);">Consultation Days:</strong>
                  <p style="color:var(--color-primary); font-weight:600; margin-top:0.25rem;">Tue, Wed, Thu, Sat, Sun</p>
                  <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">
                    Morning: 8:00 AM – 12:00 PM<br/>
                    Evening: 4:00 PM – 8:00 PM
                  </p>
                </div>
                <div style="border-left:1px solid var(--border-light); padding-left:1rem;">
                  <strong style="color:#EF4444;">Closed Days:</strong>
                  <p style="color:#EF4444; font-weight:600; margin-top:0.25rem;">Monday & Friday CLOSED</p>
                  <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">
                    No clinic consultations are held on Mondays and Fridays.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style="display:flex; gap:1rem; flex-wrap:wrap;">
            <a href="/book-appointment" class="btn btn-primary btn-lg">Book Appointment with Dr. Sahu</a>
            <a href="https://wa.me/919733835105" target="_blank" class="btn btn-whatsapp btn-lg">WhatsApp Consultation</a>
          </div>
        </div>
      </div>
    </div>
  `;
}
