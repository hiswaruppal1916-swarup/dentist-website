export function renderGalleryPage() {
  if (typeof window !== 'undefined' && !window.__galleryLightboxInitialized) {
    window.__galleryLightboxInitialized = true;

    window.openGalleryLightbox = function(src, title, subtitle) {
      const modal = document.getElementById('gallery-lightbox-modal');
      const img = document.getElementById('gallery-lightbox-img');
      const titleEl = document.getElementById('gallery-lightbox-title');
      const subtitleEl = document.getElementById('gallery-lightbox-subtitle');
      if (!modal || !img || !titleEl) return;
      img.src = src;
      img.alt = title;
      titleEl.textContent = title;
      if (subtitleEl) subtitleEl.textContent = subtitle || '';
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    window.closeGalleryLightbox = function() {
      const modal = document.getElementById('gallery-lightbox-modal');
      if (!modal) return;
      modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    window.filterGallery = function(category, clickedBtn) {
      const cards = document.querySelectorAll('.gallery-item-card');
      const buttons = document.querySelectorAll('.gallery-filter-pill');
      buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'var(--color-surface-container-lowest, #ffffff)';
        btn.style.color = 'var(--color-on-surface-variant, #43474d)';
        btn.style.borderColor = 'var(--color-outline-variant, #c3c6ce)';
      });
      if (clickedBtn) {
        clickedBtn.classList.add('active');
        clickedBtn.style.background = 'var(--color-primary, #001428)';
        clickedBtn.style.color = '#ffffff';
        clickedBtn.style.borderColor = 'var(--color-primary, #001428)';
      }
      cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    };

    // Close on Escape key
    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        window.closeGalleryLightbox();
      }
    });
  }

  const galleryItems = [
    // --- AUTHENTIC CLINIC PREMISES & ENVIRONMENT ---
    {
      id: 'clinic-entrance',
      category: 'premises',
      badge: 'Math Chandipur',
      title: 'Dental Paradise Clinic Entrance',
      subtitle: 'Official Location Landmark',
      desc: 'Official clinic exterior and prominent illuminated bilingual signboard at Math Chandipur Market, located behind Life Care Diagnostic Center.',
      image: '/images/clinic/clinic-entrance.jpg',
      alt: 'Dental Paradise Clinic Entrance with illuminated sign at Math Chandipur',
      objectFit: 'cover'
    },
    {
      id: 'clinic-reception',
      category: 'premises',
      badge: 'Sanitized Area',
      title: 'Modern Reception & Waiting Lounge',
      subtitle: 'Clean & Comfortable Ambience',
      desc: 'Sanitized, air-cooled patient reception cabin featuring comfortable seating, consultation desk, and clinical health advisories.',
      image: '/images/clinic/clinic-reception.jpg',
      alt: 'Dental Paradise Clinic Reception and Patient Waiting Lounge',
      objectFit: 'cover'
    },
    {
      id: 'operatory-1',
      category: 'premises',
      badge: 'Active Treatment',
      title: 'In-Chair Patient Dental Treatment',
      subtitle: 'Modern Operatory Unit',
      desc: 'Dr. Supriyo Sahu attending to patient care using an ergonomic motorized dental chair unit, sterile tray, and high-illumination operatory light.',
      image: '/images/clinic/dr-sahu-operatory-1.jpg',
      alt: 'Dr. Supriyo Sahu treating patient in operatory chair',
      objectFit: 'cover'
    },
    {
      id: 'operatory-2',
      category: 'premises',
      badge: 'Sterile Care',
      title: 'Precision Clinical Procedures',
      subtitle: 'Strict Aseptic Protocol',
      desc: 'Hands-on patient care conducted with strict infection-control standards, sterile surgical gown, surgical cap, gloves, and protective mask.',
      image: '/images/clinic/dr-sahu-operatory-2.jpg',
      alt: 'Dr. Supriyo Sahu conducting precision clinical procedure',
      objectFit: 'cover'
    },
    {
      id: 'examination',
      category: 'premises',
      badge: 'Diagnostics',
      title: 'Oral Examination & Diagnostic Checkup',
      subtitle: 'Preventive Smile Care',
      desc: 'High-precision intraoral inspection using sterile dental mirrors and probes to detect cavities, plaque formation, and periodontal health.',
      image: '/images/clinic/dental-examination.jpg',
      alt: 'Clinical dental checkup and oral examination',
      objectFit: 'cover'
    },

    // --- DOCTOR & CLINIC CREDENTIALS ---
    {
      id: 'dr-photo',
      category: 'doctor',
      badge: 'Lead Doctor',
      title: 'Dr. Supriyo Sahu',
      subtitle: 'B.D.S. (Hons), W.B.U.H.S. (Kolkata)',
      desc: 'Chief Dental Surgeon, Former House Surgeon at Dr. R. Ahmed Dental College & Hospital, Kolkata. Dedicated to gentle, painless oral health.',
      image: '/images/dr-supriyo-sahu.jpg',
      alt: 'Dr. Supriyo Sahu - Lead Dental Surgeon',
      objectFit: 'cover',
      objectPosition: 'center 15%'
    },
    {
      id: 'clinic-card',
      category: 'doctor',
      badge: 'Verified Card',
      title: 'Official Clinic Visiting Card',
      subtitle: 'Verified Schedule & Contact',
      desc: 'Official visiting card showing clinic location behind Life Care Diagnostic Center, Math Chandipur (PIN 721659). Direct contact: 9733835105.',
      image: '/images/dental-paradise-card.jpg',
      alt: 'Official Dental Paradise Clinic Visiting Card',
      objectFit: 'contain',
      bg: '#F8FAFC'
    },

    // --- REAL CLINICAL PROCEDURES (REPLACING OLD SVG ICONS) ---
    {
      id: 'treatment-rct',
      category: 'treatments',
      badge: 'Endodontics',
      title: 'Advanced Endodontic Therapy (RCT)',
      subtitle: 'Conservative Dentistry',
      desc: 'Painless rotary root canal treatment eliminating deep pulp infections and relieving acute toothache while preserving natural tooth structure.',
      image: '/images/treatments/root-canal.jpg',
      alt: 'Rotary endodontics operatory setup for root canal treatment',
      objectFit: 'cover'
    },
    {
      id: 'treatment-surgery',
      category: 'treatments',
      badge: 'Oral Surgery',
      title: 'Wisdom Tooth & Impaction Surgery',
      subtitle: 'Maxillofacial Surgery',
      desc: 'Specialized atraumatic surgical removal of deeply impacted and angled 3rd molars with calibrated local numbing and quick recovery.',
      image: '/images/treatments/wisdom-tooth.jpg',
      alt: 'Oral surgery and surgical extraction of impacted wisdom tooth',
      objectFit: 'cover'
    },
    {
      id: 'treatment-crown',
      category: 'treatments',
      badge: 'Prosthodontia',
      title: 'Zirconia & Ceramic Prosthesis',
      subtitle: 'Restorative Care',
      desc: 'High-strength biocompatible zirconia and porcelain crowns and fixed bridges restoring chewing stability and natural smile aesthetics.',
      image: '/images/treatments/crown-bridge.jpg?v=2',
      alt: 'Dental crowns and ceramic fixed bridge prosthetics',
      objectFit: 'cover'
    },
    {
      id: 'treatment-scaling',
      category: 'treatments',
      badge: 'Periodontics',
      title: 'Ultrasonic Scaling & Polishing',
      subtitle: 'Periodontal Protection',
      desc: 'Gentle ultrasonic calculus and plaque debridement protecting gums from inflammation, bad breath, bleeding, and bone loss.',
      image: '/images/treatments/scaling-polishing.jpg',
      alt: 'Ultrasonic scaling and enamel polishing dental procedure',
      objectFit: 'cover'
    }
  ];

  const cardsHtml = galleryItems.map(item => `
    <article class="treatment-card gallery-item-card" data-category="${item.category}" style="cursor:pointer; border-radius:var(--radius-xl); overflow:hidden; transition:transform 0.25s ease, box-shadow 0.25s ease;" onclick="window.openGalleryLightbox('${item.image}', '${item.title.replace(/'/g, "\\'")}', '${item.subtitle.replace(/'/g, "\\'")}')">
      <div class="treatment-image-box" style="position:relative; aspect-ratio:16/10; overflow:hidden; background:${item.bg || 'var(--color-surface-container-low)'};">
        <img 
          src="${item.image}" 
          alt="${item.alt}" 
          loading="lazy" 
          style="width:100%; height:100%; object-fit:${item.objectFit || 'cover'}; ${item.objectPosition ? `object-position:${item.objectPosition};` : ''} transition:transform 0.35s ease;"
        />
        <div style="position:absolute; top:0.75rem; right:0.75rem; background:rgba(0,20,40,0.7); backdrop-filter:blur(4px); color:#ffffff; padding:0.25rem 0.55rem; border-radius:var(--radius-full); font-size:0.7rem; font-weight:700; display:flex; align-items:center; gap:0.25rem;">
          <span class="material-symbols-outlined" style="font-size:14px;">zoom_in</span>
          <span>Enlarge</span>
        </div>
        <div style="position:absolute; bottom:0.75rem; left:0.75rem;">
          <span class="treatment-category-chip" style="margin:0; box-shadow:0 2px 8px rgba(0,0,0,0.15); background:#ffffff; color:var(--color-secondary); font-size:0.7rem; font-weight:700; padding:0.2rem 0.55rem;">${item.badge}</span>
        </div>
      </div>
      <div class="treatment-body" style="padding:1.25rem; display:flex; flex-direction:column; flex-grow:1; background:var(--color-surface-container-lowest);">
        <strong style="color:var(--color-secondary); display:block; font-size:1.05rem; line-height:1.35; margin-bottom:0.2rem;">${item.title}</strong>
        <span style="font-size:0.85rem; color:var(--color-primary); font-weight:600; display:block; margin-bottom:0.4rem;">${item.subtitle}</span>
        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5; margin:0;">${item.desc}</p>
      </div>
    </article>
  `).join('');

  return `
    <div class="container section" style="padding-top:1.5rem; padding-bottom:4rem;">
      <div class="section-header" style="text-align:center; max-width:760px; margin:0 auto 2rem;">
        <span class="section-tag" style="background:var(--color-secondary-container); color:var(--color-on-secondary-container); padding:0.35rem 0.85rem; border-radius:var(--radius-full); font-weight:700; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; display:inline-block; margin-bottom:0.75rem;">Visual Tour & Facility</span>
        <h1 class="section-title" style="font-size:2rem; font-weight:800; color:var(--color-primary); margin-bottom:0.75rem;">Clinic & Facility Photo Gallery</h1>
        <p class="section-desc" style="font-size:1rem; color:var(--text-muted); line-height:1.6;">
          Real photographs of Dental Paradise clinic premises, sterilization standards, operatory facilities, and clinical care led by Dr. Supriyo Sahu in Math Chandipur.
        </p>

        <!-- Filter Pills -->
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.5rem; margin-top:1.5rem;" role="tablist">
          <button 
            type="button" 
            class="gallery-filter-pill active" 
            data-filter="all" 
            onclick="window.filterGallery('all', this)"
            style="cursor:pointer; font-size:0.85rem; font-weight:600; padding:0.5rem 1rem; border-radius:var(--radius-full); border:1px solid var(--color-primary); background:var(--color-primary); color:#ffffff; transition:all 0.2s ease;">
            All Photos (${galleryItems.length})
          </button>
          <button 
            type="button" 
            class="gallery-filter-pill" 
            data-filter="premises" 
            onclick="window.filterGallery('premises', this)"
            style="cursor:pointer; font-size:0.85rem; font-weight:600; padding:0.5rem 1rem; border-radius:var(--radius-full); border:1px solid var(--color-outline-variant); background:var(--color-surface-container-lowest); color:var(--color-on-surface-variant); transition:all 0.2s ease;">
            Clinic & Operatory (5)
          </button>
          <button 
            type="button" 
            class="gallery-filter-pill" 
            data-filter="doctor" 
            onclick="window.filterGallery('doctor', this)"
            style="cursor:pointer; font-size:0.85rem; font-weight:600; padding:0.5rem 1rem; border-radius:var(--radius-full); border:1px solid var(--color-outline-variant); background:var(--color-surface-container-lowest); color:var(--color-on-surface-variant); transition:all 0.2s ease;">
            Doctor & Credentials (2)
          </button>
          <button 
            type="button" 
            class="gallery-filter-pill" 
            data-filter="treatments" 
            onclick="window.filterGallery('treatments', this)"
            style="cursor:pointer; font-size:0.85rem; font-weight:600; padding:0.5rem 1rem; border-radius:var(--radius-full); border:1px solid var(--color-outline-variant); background:var(--color-surface-container-lowest); color:var(--color-on-surface-variant); transition:all 0.2s ease;">
            Clinical Procedures (4)
          </button>
        </div>
      </div>

      <!-- Responsive Grid for Gallery Cards -->
      <div class="treatments-grid" id="gallery-cards-container">
        ${cardsHtml}
      </div>

      <!-- Quick Booking CTA Banner at Bottom of Gallery -->
      <div style="margin-top:3.5rem; background:linear-gradient(135deg, var(--color-primary) 0%, #0f2942 100%); border-radius:var(--radius-xl); padding:2rem; color:#ffffff; text-align:center; box-shadow:var(--shadow-md);">
        <h3 style="font-size:1.4rem; font-weight:700; margin-bottom:0.5rem;">Ready to Visit Dental Paradise?</h3>
        <p style="font-size:0.95rem; color:rgba(255,255,255,0.85); max-width:550px; margin:0 auto 1.25rem;">
          Consult Dr. Supriyo Sahu at Math Chandipur Market for gentle, high-precision dental treatments. Walk-in and online queue booking available.
        </p>
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.75rem;">
          <a href="/book-appointment" class="btn btn-secondary" style="background:#00A896; color:#ffffff; font-weight:700; border:none; padding:0.65rem 1.5rem; border-radius:var(--radius-full);">
            <span>Book Appointment Online</span>
          </a>
          <a href="tel:9733835105" class="btn btn-outline" style="background:transparent; color:#ffffff; border:1px solid rgba(255,255,255,0.4); font-weight:600; padding:0.65rem 1.5rem; border-radius:var(--radius-full);">
            <span>Call: 9733835105</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Fullscreen Lightbox Modal -->
    <div 
      id="gallery-lightbox-modal" 
      style="display:none; position:fixed; inset:0; z-index:99999; background:rgba(0,10,20,0.88); backdrop-filter:blur(8px); align-items:center; justify-content:center; padding:1.25rem; touch-action:manipulation;" 
      onclick="if(event.target === this || event.target.closest('.gallery-lightbox-close')) window.closeGalleryLightbox();"
    >
      <div style="position:relative; max-width:960px; width:100%; max-height:92vh; display:flex; flex-direction:column; align-items:center; animation:galleryZoomIn 0.25s ease;">
        <button 
          type="button" 
          class="gallery-lightbox-close" 
          onclick="window.closeGalleryLightbox()" 
          style="position:absolute; top:-44px; right:0; background:rgba(255,255,255,0.15); border:none; color:#ffffff; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background 0.2s ease;"
          aria-label="Close image modal"
        >
          <span class="material-symbols-outlined" style="font-size:22px;">close</span>
        </button>
        <div style="width:100%; border-radius:var(--radius-lg); overflow:hidden; box-shadow:0 25px 50px -12px rgba(0,0,0,0.6); background:#000000; display:flex; align-items:center; justify-content:center;">
          <img 
            id="gallery-lightbox-img" 
            src="" 
            alt="Enlarged photo" 
            style="max-width:100%; max-height:75vh; object-fit:contain; display:block;" 
          />
        </div>
        <div style="color:#ffffff; margin-top:0.85rem; text-align:center; max-width:650px;">
          <h4 id="gallery-lightbox-title" style="margin:0 0 0.25rem; font-size:1.1rem; font-weight:700; color:#ffffff;"></h4>
          <p id="gallery-lightbox-subtitle" style="margin:0; font-size:0.85rem; color:rgba(255,255,255,0.75);"></p>
        </div>
      </div>
    </div>

    <style>
      @keyframes galleryZoomIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .gallery-item-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--color-secondary);
      }
      .gallery-item-card:hover .treatment-image-box img {
        transform: scale(1.04);
      }
    </style>
  `;
}
