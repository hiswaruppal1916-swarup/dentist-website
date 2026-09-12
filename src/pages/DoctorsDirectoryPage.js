export function renderDoctorsDirectoryPage() {
  return `
    <div class="container section">
      <div class="section-header">
        <span class="section-tag">Clinical Team</span>
        <h1 class="section-title">Our Dental Surgeons</h1>
        <p class="section-desc">
          Meet the verified dental surgeon heading clinical care at Dental Paradise, Math Chandipur.
        </p>
      </div>

      <div class="responsive-card-box responsive-doctor-card" style="max-width:850px; margin:0 auto;">
        <div style="border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg);">
          <img src="/images/dr-supriyo-sahu.jpg?v=3" alt="Dr. Supriyo Sahu" style="width:100%; aspect-ratio:4/5; object-fit:cover; object-position:center 15%;" />
        </div>

        <div>
          <span class="section-tag">Lead Dental Surgeon</span>
          <h2 style="font-size:2rem; margin-bottom:0.35rem;">Dr. Supriyo Sahu</h2>
          <p style="font-size:1.1rem; color:var(--color-primary); font-weight:700; margin-bottom:0.75rem;">
            B.D.S. (Hons), W.B.U.H.S. (Kolkata)
          </p>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.25rem;">
            Former House Surgeon at <strong>Dr. R. Ahmed Dental College & Hospital, Kolkata</strong> & <strong>Medical College Hospital, Kolkata</strong>. Special focus on Oral & Maxillofacial Surgery, Conservative Dentistry & Endodontics, and Prosthodontia (Crown & Bridge).
          </p>

          <div style="margin-bottom:1.5rem; font-size:0.88rem; color:var(--color-secondary);">
            <strong>Consultation Hours:</strong> Tue, Wed, Thu, Sat, Sun (8 AM–12 PM & 4 PM–8 PM)<br/>
            <span style="color:#EF4444; font-weight:600;">Mon & Fri: CLOSED</span>
          </div>

          <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <a href="/doctors/dr-supriyo-sahu" class="btn btn-secondary btn-sm">Full Profile</a>
            <a href="/book-appointment" class="btn btn-primary btn-sm">Book Consultation</a>
            <a href="tel:9733835105" class="btn btn-outline btn-sm">📞 Call 9733835105</a>
          </div>
        </div>
      </div>
    </div>
  `;
}
