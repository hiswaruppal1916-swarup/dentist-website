export function renderAboutPage() {
  return `
    <div class="container section">
      <div class="section-header">
        <span class="section-tag">About Dental Paradise</span>
        <h1 class="section-title">A Complete Oral & Dental Care Centre</h1>
        <p class="section-desc">
          Founded on principles of gentle clinical care, strict sterilization, and transparent patient communication in Math Chandipur.
        </p>
      </div>

      <!-- Doctor & Vision Grid -->
      <div class="responsive-card-box responsive-two-col-reverse" style="margin-bottom:3rem;">
        <div>
          <div style="border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg);">
            <img src="/images/dr-supriyo-sahu.jpg?v=2" alt="Dr. Supriyo Sahu" style="width:100%; aspect-ratio:4/5; object-fit:cover; object-position:center 15%;" />
          </div>
          <div style="text-align:center; margin-top:1rem;">
            <strong style="font-size:1.1rem; color:var(--color-secondary);">Dr. Supriyo Sahu</strong>
            <p style="font-size:0.85rem; color:var(--color-primary); font-weight:600;">B.D.S. (Hons), W.B.U.H.S. (Kolkata)</p>
          </div>
        </div>

        <div>
          <span class="section-tag">Clinical Leadership</span>
          <h2 style="font-size:2rem; margin-bottom:1rem;">Excellence in Dental Surgery & Conservative Dentistry</h2>
          <p style="color:var(--text-main); font-size:1rem; line-height:1.8; margin-bottom:1.25rem;">
            <strong>Dental Paradise</strong> was established to bring tertiary hospital-level dental standards to the Math Chandipur and Purba Medinipur region. Under the clinical leadership of Dr. Supriyo Sahu, every patient is treated with gentle hands, thorough explanation, and modern treatment protocols.
          </p>
          <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.7; margin-bottom:1.5rem;">
            Having served as <strong>Former House Surgeon</strong> at two of the state's most historic healthcare institutions — <strong>Dr. R. Ahmed Dental College & Hospital, Kolkata</strong> (Asia's oldest dental college) and <strong>Medical College Hospital, Kolkata</strong> — Dr. Sahu brings rigorous clinical background in Oral & Maxillofacial Surgery, Endodontics, and Prosthodontia.
          </p>

          <div style="background:var(--bg-main); border:1px solid var(--border-light); border-radius:var(--radius-md); padding:1.25rem;">
            <h4 style="font-size:0.95rem; margin-bottom:0.5rem; color:var(--color-secondary);">Clinical Principles at Dental Paradise:</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.4rem; font-size:0.9rem; color:var(--text-muted);">
              <li>✔ <strong>Painless First Approach:</strong> Efficient local anesthesia ensuring virtually discomfort-free procedures.</li>
              <li>✔ <strong>Tooth Preservation Priority:</strong> We strive to save natural teeth whenever clinically feasible via Root Canal Treatment and restorative bonding.</li>
              <li>✔ <strong>Hospital-Grade Autoclave Sterilization:</strong> 100% sterile instruments preventing cross-contamination.</li>
              <li>✔ <strong>Strict Appointment Queuing:</strong> Patients are attended by their designated queue slot without chaotic waiting.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Clinic Infrastructure & Visiting Card -->
      <div class="responsive-card-box">
        <div class="responsive-two-col">
          <div>
            <span class="section-tag">Clinic Location & Credibility</span>
            <h2 style="font-size:1.8rem; margin-bottom:1rem;">Convenient Local Access in Chandipur</h2>
            <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.8; margin-bottom:1.25rem;">
              Conveniently located behind <strong>Life Care Diagnostic Center</strong> at Math Chandipur Market (PIN- 721659), our clinic provides a peaceful, sterile, and reassuring environment for all age groups — from pediatric children to senior citizens requiring dental prosthetics.
            </p>
            <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-top:1.5rem;">
              <a href="/book-appointment" class="btn btn-primary">Book Consultation</a>
              <a href="/treatments" class="btn btn-secondary">Explore Treatments</a>
            </div>
          </div>

          <div style="border-radius:var(--radius-lg); overflow:hidden; border:1px solid var(--border-light); padding:1rem; background:var(--bg-main); text-align:center;">
            <img src="/images/dental-paradise-card.jpg" alt="Official Visiting Card of Dental Paradise" style="width:100%; border-radius:var(--radius-md); box-shadow:var(--shadow-sm);" />
            <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.75rem;">Official Card: Dental Paradise • Dr. Supriyo Sahu</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
