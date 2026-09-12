export function renderContactPage() {
  return `
    <div class="container section">
      <div class="section-header">
        <span class="section-tag">Get In Touch</span>
        <h1 class="section-title">Contact & Clinic Location</h1>
        <p class="section-desc">
          Visit Dental Paradise in Math Chandipur, or reach Dr. Supriyo Sahu directly via phone or WhatsApp.
        </p>
      </div>

      <div class="responsive-two-col" style="align-items:flex-start; margin-bottom:3rem;">
        <!-- Left: Clinic Details -->
        <div class="responsive-card-box">
          <h2 style="font-size:1.8rem; margin-bottom:1.5rem; color:var(--color-secondary);">Dental Paradise</h2>

          <div style="display:flex; flex-direction:column; gap:1.25rem; font-size:0.95rem; margin-bottom:2rem;">
            <div style="display:flex; gap:1rem;">
              <span style="font-size:1.4rem;">📍</span>
              <div>
                <strong>Clinic Address:</strong>
                <p style="color:var(--text-muted); margin-top:0.25rem;">
                  Math Chandipur, Chandipur Market area,<br/>
                  Behind Life Care Diagnostic Center,<br/>
                  PIN - 721659, West Bengal
                </p>
              </div>
            </div>

            <div style="display:flex; gap:1rem;">
              <span style="font-size:1.4rem;">📞</span>
              <div>
                <strong>Telephone Consultation:</strong>
                <p style="margin-top:0.25rem;">
                  <a href="tel:9733835105" style="color:var(--color-primary); font-weight:700; font-size:1.1rem;">9733835105</a>
                </p>
              </div>
            </div>

            <div style="display:flex; gap:1rem;">
              <span style="font-size:1.4rem;">💬</span>
              <div>
                <strong>WhatsApp Direct:</strong>
                <p style="margin-top:0.25rem;">
                  <a href="https://wa.me/919733835105" target="_blank" style="color:#25D366; font-weight:700; font-size:1.1rem;">9733835105</a>
                </p>
              </div>
            </div>

            <div style="display:flex; gap:1rem;">
              <span style="font-size:1.4rem;">🕒</span>
              <div>
                <strong>Weekly Consultation Hours:</strong>
                <p style="color:var(--text-muted); margin-top:0.25rem;">
                  <strong>Tue, Wed, Thu, Sat, Sun:</strong><br/>
                  Morning: 8:00 AM – 12:00 PM<br/>
                  Evening: 4:00 PM – 8:00 PM
                </p>
                <p style="color:#EF4444; font-weight:700; margin-top:0.5rem;">
                  Monday & Friday: CLOSED
                </p>
              </div>
            </div>
          </div>

          <div style="display:flex; gap:1rem; flex-wrap:wrap;">
            <a href="https://maps.app.goo.gl/VAck4xKaiP7ASAQSA?g_st=ac" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              <span>Open in Google Maps</span> ↗
            </a>
            <a href="/book-appointment" class="btn btn-secondary">
              <span>Book Appointment Online</span>
            </a>
          </div>
        </div>

        <!-- Right: Official Card & Directions Help -->
        <div>
          <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-xl); padding:2rem; box-shadow:var(--shadow-md); margin-bottom:1.5rem; text-align:center;">
            <img src="/images/dental-paradise-card.jpg" alt="Dental Paradise Official Card" style="width:100%; border-radius:var(--radius-md); box-shadow:var(--shadow-sm); margin-bottom:1rem;" />
            <strong style="color:var(--color-secondary);">Official Clinic Banner / Card</strong>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">Recognize our clinic easily in the Chandipur Market area.</p>
          </div>

          <div style="background:var(--color-primary-soft); border:1px solid var(--color-primary-light); border-radius:var(--radius-lg); padding:1.5rem;">
            <h4 style="font-size:1rem; margin-bottom:0.5rem; color:var(--color-secondary);">Landmark Assistance</h4>
            <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.6;">
              If you are coming from Chandipur Bus Stand or Main Market, head towards Life Care Diagnostic Center. Our clinic entrance is located directly behind it. Call us at <strong>9733835105</strong> if you need directions.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}
