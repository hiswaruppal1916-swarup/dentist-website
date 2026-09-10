import { supabase } from '../services/supabase.js';

export async function renderTreatmentsListPage() {
  let treatments = [];
  try {
    const { data } = await supabase
      .from('treatments')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (data && data.length > 0) treatments = data;
  } catch (e) {
    console.error('Failed to load treatments from DB', e);
  }

  // Fallback complete 12 treatments from supplied visiting card & doctor profile
  if (!treatments || treatments.length === 0) {
    treatments = [
      {
        slug: 'root-canal-treatment',
        name_en: 'Root Canal Treatment (RCT)',
        name_bn: 'রুট ক্যানাল ট্রিটমেন্ট',
        category: 'Endodontics',
        summary_en: 'Single-sitting or dual-visit rotary endodontics with electronic apex locator precision to save severely infected teeth.',
        summary_bn: 'দাঁতের গভীর ইনফেকশন দূর করে আসল দাঁত স্থায়ীভাবে রক্ষা করার ব্যথাহীন অত্যাধুনিক চিকিৎসা।',
        image_url: '/images/treatments/root-canal.svg'
      },
      {
        slug: 'impaction-wisdom-tooth-surgery',
        name_en: 'Wisdom Tooth & Impaction Surgery',
        name_bn: 'ইমপ্যাকশন ও উইজডম দাঁত সার্জারি',
        category: 'Oral Surgery',
        summary_en: 'Atraumatic surgical extraction of impacted, horizontally angled 3rd molars with rapid post-operative healing.',
        summary_bn: 'মাড়ির ভেতরে আটকে থাকা বা বাঁকা আক্কেল দাঁতের বিশেষজ্ঞ সার্জিক্যাল অপসারণ।',
        image_url: '/images/treatments/wisdom-tooth.svg'
      },
      {
        slug: 'painless-tooth-extraction',
        name_en: 'Painless Tooth Extraction',
        name_bn: 'ব্যথাহীন দাঁত তোলা',
        category: 'General Surgery',
        summary_en: 'Gentle atraumatic tooth removal using calibrated local numbing agents and sterile surgical precision.',
        summary_bn: 'আধুনিক অবশকরণ পদ্ধতির মাধ্যমে কোনো প্রকার ব্যথা বা কষ্ট ছাড়া নিরাপদে দাঁত তোলা।',
        image_url: '/images/treatments/tooth-extraction.svg'
      },
      {
        slug: 'crown-bridge-prosthesis',
        name_en: 'Dental Crowns & Fixed Bridges',
        name_bn: 'দাঁতের ক্যাপ ও ফিক্সড ব্রিজ',
        category: 'Prosthodontia',
        summary_en: 'Permanent zirconia and ceramic tooth caps and bridges for flawless chewing capability and natural smile aesthetics.',
        summary_bn: 'ভাঙা বা নষ্ট দাঁত মজবুত করতে এবং ফাঁকা স্থানে স্থায়ী সুন্দর দাঁত বসাতে ক্যাপ ও ব্রিজ।',
        image_url: '/images/treatments/crown-bridge.svg'
      },
      {
        slug: 'scaling-polishing',
        name_en: 'Teeth Scaling & Ultrasonic Polishing',
        name_bn: 'দাঁতের স্কেলিং ও পলিশিং',
        category: 'Preventive Hygiene',
        summary_en: 'Ultrasonic piezoelectric plaque and calculus removal with stain polishing to treat bleeding gums and bad breath.',
        summary_bn: 'দাঁতের পাথর (ক্যালকুলাস), তামাকের দাগ দূরীকরণ এবং মাড়ি থেকে রক্ত পড়া বন্ধ করার ওয়াশ।',
        image_url: '/images/treatments/scaling-polishing.svg'
      },
      {
        slug: 'dental-restoration-fillings',
        name_en: 'Restoration & Tooth-Colored Fillings',
        name_bn: 'দাঁতের ফিলিং ও রেস্টোরেশন',
        category: 'Conservative Care',
        summary_en: 'Nano-hybrid composite tooth-colored fillings to seal cavity holes invisibly and halt bacterial decay.',
        summary_bn: 'দাঁতের গর্ত বা পোকা লাগা অংশ পরিষ্কার করে স্বাভাবিক দাঁতের মতো ফিলিং করা।',
        image_url: '/images/treatments/dental-filling.svg'
      },
      {
        slug: 'orthodontic-teeth-alignment',
        name_en: 'Orthodontic Teeth Alignment (Braces)',
        name_bn: 'দাঁতের তার বা অর্থোডন্টিক চিকিৎসা',
        category: 'Orthodontics',
        summary_en: 'Correction of crooked, crowded, spaced, or forward-protruding teeth with modern braces and aligners.',
        summary_bn: 'উঁচু-নিচু, ফাঁকা বা আঁকাবাঁকা দাঁত সমান ও সুন্দরভাবে সাজানোর তারের চিকিৎসা।',
        image_url: '/images/treatments/orthodontics.svg'
      },
      {
        slug: 'pediatric-dental-care',
        name_en: 'Pediatric Oral & Dental Care',
        name_bn: 'শিশুদের দাঁতের বিশেষ যত্ন',
        category: 'Pediatric Dentistry',
        summary_en: 'Child-friendly gentle dental checkups, milk tooth restoration, pulpectomy, and fluoride decay prevention.',
        summary_bn: 'শিশুদের দুধদাঁতের সুরক্ষা, ব্যথাহীন ক্যাভিটি ফিলিং ও সচেতনতামূলক দাঁতের যত্ন।',
        image_url: '/images/treatments/pediatric-dentistry.svg'
      },
      {
        slug: 'fractured-teeth-trauma',
        name_en: 'Fractured Teeth & Dental Trauma Care',
        name_bn: 'ভাঙা দাঁত ও জরুরি ট্রমা চিকিৎসা',
        category: 'Emergency Care',
        summary_en: 'Immediate emergency management of chipped, fractured, or accidentally dislodged teeth with composite bonding.',
        summary_bn: 'দুর্ঘটনায় ভেঙে যাওয়া বা নড়ে যাওয়া দাঁত জোড়া লাগানো ও জরুরি ট্রমা প্রতিস্থাপন।',
        image_url: '/images/treatments/fractured-tooth.svg'
      },
      {
        slug: 'cosmetic-dentistry-smile-designing',
        name_en: 'Cosmetic Dentistry & Smile Designing',
        name_bn: 'কসমেটিক ডেন্টিস্ট্রি ও স্মাইল ডিজাইনিং',
        category: 'Cosmetic Care',
        summary_en: 'Aesthetic veneers, tooth whitening, composite diastema closure, and digital smile enhancement.',
        summary_bn: 'দাঁতের ফাঁকা বন্ধ করা, দাগ দূর করা ও হাসিকে আকর্ষণীয় করার কসমেটিক চিকিৎসা।',
        image_url: '/images/treatments/smile-design.svg'
      },
      {
        slug: 'minor-oral-cystic-surgery',
        name_en: 'Minor Oral & Cystic Surgery',
        name_bn: 'মাইনর ওরাল সার্জারি ও সিস্ট সার্জারি',
        category: 'Oral Surgery',
        summary_en: 'Surgical excision of oral cysts, mucoceles, frenectomy, and biopsy with strict aseptic protocol.',
        summary_bn: 'মুখের ভেতরের সিস্ট, পলিপ বা অস্বাভাবিক মাংসপিণ্ডের নিরাপদ মাইনর অপারেশন।',
        image_url: '/images/treatments/oral-surgery.svg'
      },
      {
        slug: 'full-mouth-reconstruction',
        name_en: 'Full Mouth Reconstruction & Bone Grafting',
        name_bn: 'ফুল মাউথ রিকনস্ট্রাকশন ও বোন গ্রাফটিং',
        category: 'Advanced Surgery',
        summary_en: 'Comprehensive occlusal rehabilitation and alveolar bone preservation for severely damaged dentition.',
        summary_bn: 'পুরো মুখের অধিকাংশ ক্ষয়ে যাওয়া দাঁতের পূর্ণাঙ্গ কার্যক্ষমতা ও সৌন্দর্য ফিরিয়ে আনা।',
        image_url: '/images/treatments/full-reconstruction.svg'
      }
    ];
  }

  const cardsHtml = treatments.map(t => {
    const category = t.category || 'Specialized Care';
    return `
      <article class="treatment-card">
        <div class="treatment-image-box">
          <img src="${t.image_url}" alt="${t.name_en}" loading="lazy" />
          <span class="treatment-badge-tag">${category}</span>
        </div>
        <div class="treatment-body">
          <h2 class="treatment-title-en" style="font-size:1.05rem;">${t.name_en}</h2>
          <h3 class="treatment-title-bn bn-text">${t.name_bn || ''}</h3>
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

  return `
    <div class="container section" style="padding-top:1.5rem;">
      <div class="section-header">
        <span class="section-tag">Clinical Dental Care</span>
        <h1 class="section-title">All Dental Treatments &amp; Services</h1>
        <p class="section-desc">
          Comprehensive, painless dental and oral surgical procedures conducted by Dr. Supriyo Sahu at Dental Paradise in Math Chandipur. Detailed bilingual explanations in English and বাংলা.
        </p>
      </div>

      <!-- Quick Category Chips -->
      <div style="display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:1.25rem; margin-bottom:1.5rem; scrollbar-width:none;">
        <span style="background:var(--color-primary); color:#FFF; font-size:0.78rem; font-weight:700; padding:0.35rem 0.85rem; border-radius:var(--radius-full); white-space:nowrap;">
          All Treatments (12)
        </span>
        <span style="background:var(--color-surface-container-low); border:1px solid var(--color-outline-variant); color:var(--color-on-surface); font-size:0.78rem; font-weight:600; padding:0.35rem 0.85rem; border-radius:var(--radius-full); white-space:nowrap;">
          Endodontics (RCT)
        </span>
        <span style="background:var(--color-surface-container-low); border:1px solid var(--color-outline-variant); color:var(--color-on-surface); font-size:0.78rem; font-weight:600; padding:0.35rem 0.85rem; border-radius:var(--radius-full); white-space:nowrap;">
          Oral &amp; Wisdom Surgery
        </span>
        <span style="background:var(--color-surface-container-low); border:1px solid var(--color-outline-variant); color:var(--color-on-surface); font-size:0.78rem; font-weight:600; padding:0.35rem 0.85rem; border-radius:var(--radius-full); white-space:nowrap;">
          Prosthodontia (Crown &amp; Bridge)
        </span>
        <span style="background:var(--color-surface-container-low); border:1px solid var(--color-outline-variant); color:var(--color-on-surface); font-size:0.78rem; font-weight:600; padding:0.35rem 0.85rem; border-radius:var(--radius-full); white-space:nowrap;">
          Orthodontics
        </span>
        <span style="background:var(--color-surface-container-low); border:1px solid var(--color-outline-variant); color:var(--color-on-surface); font-size:0.78rem; font-weight:600; padding:0.35rem 0.85rem; border-radius:var(--radius-full); white-space:nowrap;">
          Pediatric
        </span>
      </div>

      <!-- 12 Treatments Grid -->
      <div class="treatments-grid">
        ${cardsHtml}
      </div>

      <!-- Unsure Box -->
      <div style="margin-top:3.5rem; background:var(--color-surface-container-low); border-radius:var(--radius-xl); padding:2rem; text-align:center; border:1px solid var(--color-outline-variant); box-shadow:var(--shadow-sm);">
        <span class="section-tag">Clinical Diagnostic Visit</span>
        <h3 style="font-size:1.4rem; margin-bottom:0.5rem; color:var(--color-primary);">Unsure Which Dental Treatment You Need?</h3>
        <p style="color:var(--color-on-surface-variant); max-width:620px; margin:0 auto 1.5rem; font-size:0.92rem; line-height:1.6;">
          Schedule an in-person clinical examination with Dr. Supriyo Sahu. We will inspect your teeth, perform digital radiographs if required, and clearly explain all treatment options and transparent costs.
        </p>
        <a href="/book-appointment" class="btn btn-primary btn-lg">
          <span class="material-symbols-outlined text-[20px]">calendar_month</span>
          <span>Book Consultation Visit</span>
        </a>
      </div>
    </div>
  `;
}
