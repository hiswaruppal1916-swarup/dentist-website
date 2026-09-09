export function renderGalleryPage() {
  return `
    <div class="container section">
      <div class="section-header">
        <span class="section-tag">Visual Tour</span>
        <h1 class="section-title">Clinic & Facility Highlights</h1>
        <p class="section-desc">
          Take a look at the clinical care environment, verified credentials, and sterilization standards at Dental Paradise.
        </p>
      </div>

      <div class="responsive-cards-grid">
        <!-- Card 1: Doctor Photo -->
        <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-sm);">
          <img src="/images/dr-supriyo-sahu.jpg" alt="Dr. Supriyo Sahu" style="width:100%; aspect-ratio:4/5; object-fit:cover;" />
          <div style="padding:1.25rem;">
            <strong style="color:var(--color-secondary); display:block; font-size:1.05rem;">Dr. Supriyo Sahu</strong>
            <span style="font-size:0.85rem; color:var(--color-primary); font-weight:600;">B.D.S. (Hons), W.B.U.H.S. (Kolkata)</span>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">Former House Surgeon at Dr. R. Ahmed Dental College & Medical College Hospital, Kolkata.</p>
          </div>
        </div>

        <!-- Card 2: Official Visiting Card -->
        <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-sm);">
          <img src="/images/dental-paradise-card.jpg" alt="Dental Paradise Clinic Card" style="width:100%; aspect-ratio:16/10; object-fit:contain; background:#F8FAFC;" />
          <div style="padding:1.25rem;">
            <strong style="color:var(--color-secondary); display:block; font-size:1.05rem;">Official Clinic Visiting Card</strong>
            <span style="font-size:0.85rem; color:var(--color-primary); font-weight:600;">Math Chandipur Market Location</span>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">Behind Life Care Diagnostic Center (PIN 721659). Direct contact: 9733835105.</p>
          </div>
        </div>

        <!-- Card 3: Root Canal Operatory -->
        <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-sm);">
          <img src="/images/treatments/root-canal.svg" alt="Root Canal Therapy" style="width:100%; aspect-ratio:16/10; object-fit:cover;" />
          <div style="padding:1.25rem;">
            <strong style="color:var(--color-secondary); display:block; font-size:1.05rem;">Advanced Endodontic Therapy</strong>
            <span style="font-size:0.85rem; color:var(--color-primary); font-weight:600;">Conservative Dentistry</span>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">Painless tooth conservation removing infection from inner tooth canals.</p>
          </div>
        </div>

        <!-- Card 4: Impaction & Oral Surgery -->
        <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-sm);">
          <img src="/images/treatments/wisdom-tooth.svg" alt="Impaction Surgery" style="width:100%; aspect-ratio:16/10; object-fit:cover;" />
          <div style="padding:1.25rem;">
            <strong style="color:var(--color-secondary); display:block; font-size:1.05rem;">Impaction & Wisdom Tooth Surgery</strong>
            <span style="font-size:0.85rem; color:var(--color-primary); font-weight:600;">Maxillofacial Surgery</span>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">Surgical removal of deeply impacted 3rd molar teeth with atraumatic healing.</p>
          </div>
        </div>

        <!-- Card 5: Crown & Prosthetics -->
        <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-sm);">
          <img src="/images/treatments/crown-bridge.svg" alt="Crown & Bridge" style="width:100%; aspect-ratio:16/10; object-fit:cover;" />
          <div style="padding:1.25rem;">
            <strong style="color:var(--color-secondary); display:block; font-size:1.05rem;">Zirconia & Ceramic Prosthesis</strong>
            <span style="font-size:0.85rem; color:var(--color-primary); font-weight:600;">Prosthodontia Department</span>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">Fixed crowns, bridges, and partial/complete dentures for full chewing recovery.</p>
          </div>
        </div>

        <!-- Card 6: Ultrasonic Scaling -->
        <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-sm);">
          <img src="/images/treatments/scaling-polishing.svg" alt="Ultrasonic Scaling" style="width:100%; aspect-ratio:16/10; object-fit:cover;" />
          <div style="padding:1.25rem;">
            <strong style="color:var(--color-secondary); display:block; font-size:1.05rem;">Ultrasonic Scaling & Polishing</strong>
            <span style="font-size:0.85rem; color:var(--color-primary); font-weight:600;">Periodontal Protection</span>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">Gentle tartar removal safeguarding gums from bleeding and periodontitis.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
