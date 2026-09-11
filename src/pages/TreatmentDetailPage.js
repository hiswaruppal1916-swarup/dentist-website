import { supabase } from '../services/supabase.js';

export async function renderTreatmentDetailPage(slug) {
  let treatment = null;
  try {
    const { data } = await supabase
      .from('treatments')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (data) treatment = data;
  } catch (e) {
    console.error('Error loading treatment detail from DB', e);
  }

  // Comprehensive fallback if DB row is missing
  if (!treatment) {
    const fallbackDb = {
      'root-canal-treatment': {
        name_en: 'Root Canal Treatment (RCT)',
        name_bn: 'রুট ক্যানাল ট্রিটমেন্ট',
        image_url: '/images/treatments/root-canal.jpg',
        description_en: 'Root Canal Treatment is a specialized endodontic procedure performed to save a severely decayed, cracked, or infected tooth. Inside each tooth lies the dental pulp containing nerves and blood vessels. When bacterial decay penetrates into the pulp chamber, it causes excruciating throbbing pain and abscess formation. During modern RCT, Dr. Supriyo Sahu gently removes the diseased pulp using flexible nickel-titanium rotary files under precision electronic apex locator guidance, cleans and disinfects the microscopic root canals, and seals them with biocompatible gutta-percha. A protective dental crown is then placed over the treated tooth to restore full biting strength and prevent fracture.',
        description_bn: 'রুট ক্যানাল ট্রিটমেন্ট হলো দাঁতের ভেতরের সংক্রামিত বা নষ্ট হয়ে যাওয়া মজ্জা (Dental Pulp) অপসারণ করে আসল দাঁতটিকে বাঁচানোর একটি নির্ভরযোগ্য চিকিৎসা। দাঁতে গভীর গর্ত বা ক্যাভিটি হলে এবং ব্যাকটেরিয়ার সংক্রমণ স্নায়ু পর্যন্ত পৌঁছে গেলে তীব্র যন্ত্রণা শুরু হয়। এই চিকিৎসায় ডঃ সুপ্রিয় সাহু আধুনিক রোটারি মেশিনের সাহায্যে দাঁতের ভেতর সম্পূর্ণ ব্যথাহীনভাবে পরিষ্কার ও জীবাণুমুক্ত করেন এবং বিশেষ সিলিং দ্বারা স্থায়ীভাবে ভরাট করে দেন। পরবর্তীতে দাঁতের ওপর একটি মজবুত ক্যাপ পরিয়ে দিলে দাঁতটি আজীবন স্বাভাবিক দাঁতের মতো কাজ করে।',
        who_needs_it_en: [
          'Persistent throbbing toothache, especially while lying down or sleeping',
          'Prolonged acute sensitivity to hot or cold drinks and food',
          'Gum swelling, pimple, or pus discharge adjacent to the painful tooth',
          'Dark discoloration or deep darkening of a traumatized tooth'
        ],
        who_needs_it_bn: [
          'দাঁতে তীব্র ও ক্রমাগত যন্ত্রণা, বিশেষ করে রাতে বা শুয়ে থাকলে বেড়ে যাওয়া',
          'গরম বা ঠান্ডা খাবার ও পানীয় খেলে দীর্ঘক্ষণ শিরশির বা ব্যথা অনুভূত হওয়া',
          'দাঁতের গোড়ার মাড়ি ফুলে যাওয়া বা পুঁজ নির্গত হওয়া',
          'আঘাতের কারণে দাঁতের ভেতরের অংশ কালো বা বিবর্ণ হয়ে যাওয়া'
        ],
        procedure_steps_en: [
          'Pre-operative digital radiographic imaging and diagnostic pulp vitality assessment.',
          'Calibrated local numbing ensuring complete comfort and zero procedural pain.',
          'Microscopic access cavity preparation and thorough removal of infected dental pulp.',
          'Rotary canal shaping, antimicrobial irrigation, and electronic apex length measurement.',
          'Hermetic 3D obturation with sterile gutta-percha and permanent coronal restoration.',
          'Placement of a custom-milled zirconia or porcelain crown to protect against fracture.'
        ],
        procedure_steps_bn: [
          'ডিজিটাল এক্স-রে দ্বারা দাঁতের শিকড় ও ইনফেকশনের গভীরতা নিখুঁতভাবে নির্ধারণ।',
          'বিশেষ লোকাল অবশকরণ ইনজেকশন প্রদান, যাতে পুরো চিকিৎসায় কোনো ব্যথা অনুভূত না হয়।',
          'দাঁতের ভেতরের নষ্ট মজ্জা পরিষ্কার ও জীবাণুমুক্ত করা।',
          'রোটারি যন্ত্র দ্বারা শিকড়ের ক্যানাল নিখুঁত আকৃতিতে প্রস্তুত করা।',
          'বিশেষ সিলিং উপাদান (Gutta-Percha) দ্বারা ক্যানাল স্থায়ীভাবে বন্ধ করে দেওয়া।',
          'দাঁতকে আজীবন মজবুত ও সুরক্ষিত রাখতে পরিমাপ নিয়ে ক্যাপ বা ক্রাউন পরিয়ে দেওয়া।'
        ]
      }
    };

    treatment = fallbackDb[slug];
  }

  if (!treatment) {
    return `
      <div class="container section" style="text-align:center; padding:5rem 1rem;">
        <span class="material-symbols-outlined text-[48px] text-secondary" style="margin-bottom:1rem;">medical_services</span>
        <h1 style="font-size:2rem; margin-bottom:0.75rem;">Treatment Guide</h1>
        <p style="color:var(--color-on-surface-variant); max-width:520px; margin:0 auto 1.5rem;">
          Detailed information for this specific procedure is available during your in-person clinical consultation with Dr. Supriyo Sahu.
        </p>
        <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap;">
          <a href="/treatments" class="btn btn-outline">Browse All 12 Treatments</a>
          <a href="/book-appointment" class="btn btn-primary">Book Consultation</a>
        </div>
      </div>
    `;
  }

  const whoNeedsEnList = (treatment.who_needs_it_en || []).map(item => `
    <li style="display:flex; align-items:flex-start; gap:0.5rem;">
      <span class="material-symbols-outlined text-[16px] text-secondary" style="flex-shrink:0; margin-top:2px;">check_circle</span>
      <span>${item}</span>
    </li>
  `).join('');

  const whoNeedsBnList = (treatment.who_needs_it_bn || []).map(item => `
    <li style="display:flex; align-items:flex-start; gap:0.5rem;" class="bn-text">
      <span class="material-symbols-outlined text-[16px] text-secondary" style="flex-shrink:0; margin-top:2px;">check_circle</span>
      <span>${item}</span>
    </li>
  `).join('');

  const stepsEnList = (treatment.procedure_steps_en || []).map((step, idx) => `
    <div style="display:flex; gap:0.85rem; margin-bottom:1rem; align-items:flex-start;">
      <div style="width:26px; height:26px; border-radius:50%; background:var(--color-primary); color:#FFF; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:700; flex-shrink:0;">${idx + 1}</div>
      <p style="font-size:0.9rem; color:var(--color-on-surface); line-height:1.5;">${step}</p>
    </div>
  `).join('');

  const stepsBnList = (treatment.procedure_steps_bn || []).map((step, idx) => `
    <div style="display:flex; gap:0.85rem; margin-bottom:1rem; align-items:flex-start;">
      <div style="width:26px; height:26px; border-radius:50%; background:var(--color-secondary); color:#FFF; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:700; flex-shrink:0;">${idx + 1}</div>
      <p style="font-size:0.9rem; color:var(--color-on-surface); line-height:1.5;" class="bn-text">${step}</p>
    </div>
  `).join('');

  const detailImgSrc = treatment.image_url
    ? `${treatment.image_url.split('?')[0]}?v=3`
    : '';

  return `
    <div class="container section" style="padding-top:1.5rem;">
      <div style="margin-bottom:1.5rem;">
        <a href="/treatments" style="display:inline-flex; align-items:center; gap:0.35rem; color:var(--color-secondary); font-weight:600; font-size:0.88rem;">
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to All Treatments</span>
        </a>
      </div>

      <div class="responsive-detail-grid">
        <!-- Left Column: Detailed Clinical Information -->
        <div>
          <span class="section-tag">Clinical Dental Care</span>
          <h1 style="font-size:2.2rem; margin-bottom:0.25rem; color:var(--color-primary);">${treatment.name_en}</h1>
          <h2 class="bn-text" style="font-size:1.35rem; color:var(--color-secondary); font-weight:700; margin-bottom:1.5rem;">
            ${treatment.name_bn || ''}
          </h2>

          <div style="border-radius:var(--radius-xl); overflow:hidden; border:1px solid var(--color-outline-variant); margin-bottom:2rem; box-shadow:var(--shadow-sm); background:var(--color-surface-container-low); display:flex; justify-content:center; align-items:center;">
            <img src="${detailImgSrc}" alt="${treatment.name_en}" style="width:100%; max-height:520px; aspect-ratio:1/1; object-fit:contain;" />
          </div>

          <!-- English Overview -->
          <div style="margin-bottom:2rem;">
            <h3 style="font-size:1.25rem; margin-bottom:0.65rem; color:var(--color-primary); display:flex; align-items:center; gap:0.4rem;">
              <span class="material-symbols-outlined text-secondary">info</span>
              <span>Clinical Overview</span>
            </h3>
            <p style="font-size:0.95rem; color:var(--color-on-surface-variant); line-height:1.7;">
              ${treatment.description_en || treatment.summary_en || ''}
            </p>
          </div>

          <!-- Bengali Overview (চিকিৎসার সহজ ব্যাখ্যা) -->
          <div style="background:var(--color-surface-container-low); border-left:4px solid var(--color-secondary); border-radius:0 var(--radius-lg) var(--radius-lg) 0; padding:1.5rem; margin-bottom:2rem; border-top:1px solid var(--color-outline-variant); border-right:1px solid var(--color-outline-variant); border-bottom:1px solid var(--color-outline-variant);">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.65rem;">
              <span style="background:var(--color-secondary); color:#FFF; font-size:0.72rem; font-weight:700; padding:0.2rem 0.6rem; border-radius:var(--radius-full);">বাংলা বিবরণ</span>
              <h3 class="bn-text" style="font-size:1.15rem; color:var(--color-primary); margin:0;">চিকিৎসার সহজ ব্যাখ্যা</h3>
            </div>
            <p class="bn-text" style="font-size:0.95rem; color:var(--color-on-surface); line-height:1.8;">
              ${treatment.description_bn || treatment.summary_bn || ''}
            </p>
          </div>

          <!-- Who May Need It (Bilingual Grid) -->
          <div style="margin-bottom:2rem;">
            <h3 style="font-size:1.25rem; margin-bottom:0.85rem; color:var(--color-primary);">Symptoms &amp; Who May Need Consultation</h3>
            
            <div class="responsive-hours-box" style="background:#FFFFFF; border:1px solid var(--color-outline-variant); border-radius:var(--radius-lg); padding:1.25rem; box-shadow:var(--shadow-sm);">
              <div>
                <h4 style="font-size:0.85rem; color:var(--color-primary); margin-bottom:0.65rem; text-transform:uppercase; letter-spacing:0.04em;">Clinical Indications</h4>
                <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; font-size:0.88rem; color:var(--color-on-surface-variant);">
                  ${whoNeedsEnList}
                </ul>
              </div>
              <div style="border-top:1px solid var(--color-outline-variant); padding-top:1rem;">
                <h4 class="bn-text" style="font-size:0.9rem; color:var(--color-secondary); margin-bottom:0.65rem; font-weight:700;">লক্ষণসমূহ (বাংলায়)</h4>
                <ul class="bn-text" style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; font-size:0.88rem; color:var(--color-on-surface-variant);">
                  ${whoNeedsBnList}
                </ul>
              </div>
            </div>
          </div>

          <!-- Procedure Steps (English + Bengali) -->
          <div style="margin-bottom:2rem;">
            <h3 style="font-size:1.25rem; margin-bottom:0.85rem; color:var(--color-primary);">Step-by-Step Procedure</h3>
            
            <div style="background:#FFFFFF; border:1px solid var(--color-outline-variant); border-radius:var(--radius-lg); padding:1.5rem; box-shadow:var(--shadow-sm);">
              <div style="margin-bottom:1.5rem;">
                <h4 style="font-size:0.85rem; color:var(--color-primary); text-transform:uppercase; margin-bottom:0.85rem; letter-spacing:0.04em;">Clinical Protocol (English)</h4>
                ${stepsEnList}
              </div>

              <div style="border-top:1px solid var(--color-outline-variant); padding-top:1.5rem;">
                <h4 class="bn-text" style="font-size:0.95rem; color:var(--color-secondary); text-transform:uppercase; margin-bottom:0.85rem; font-weight:700;">চিকিৎসা পদ্ধতি (বাংলা)</h4>
                ${stepsBnList}
              </div>
            </div>
          </div>

          <!-- Clinical Disclaimer -->
          <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:var(--radius-md); padding:1rem; display:flex; gap:0.65rem; align-items:flex-start;">
            <span class="material-symbols-outlined text-[20px]" style="color:#D97706; flex-shrink:0; margin-top:2px;">warning</span>
            <p style="font-size:0.82rem; color:#92400E; line-height:1.5;">
              <strong>Clinical Examination Required:</strong> The information provided above is for patient education. Exact treatment feasibility, number of visits, and customized requirements are determined after an in-person clinical checkup by Dr. Supriyo Sahu.
            </p>
          </div>
        </div>

        <!-- Right Column: Quick Booking & Clinic Card -->
        <div>
          <div style="position:sticky; top:5.5rem; background:#FFFFFF; border:1px solid var(--color-outline-variant); border-radius:var(--radius-xl); padding:1.5rem; box-shadow:var(--shadow-md);">
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid var(--color-surface-container);">
              <img src="/images/dr-supriyo-sahu.jpg" alt="Dr. Supriyo Sahu" style="width:52px; height:52px; border-radius:50%; object-fit:cover;" />
              <div>
                <strong style="font-size:0.95rem; color:var(--color-primary); display:block;">Dr. Supriyo Sahu</strong>
                <span style="font-size:0.78rem; color:var(--color-secondary); font-weight:600;">B.D.S. (Hons), W.B.U.H.S.</span>
              </div>
            </div>

            <div style="margin-bottom:1.25rem;">
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.4rem;">
                <span style="color:var(--color-on-surface-variant);">Consultation Fee:</span>
                <strong style="color:var(--color-primary);">Pay at Clinic</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:0.4rem;">
                <span style="color:var(--color-on-surface-variant);">Advance Required:</span>
                <strong style="color:var(--color-secondary);">₹0 Advance (Free Online Slot)</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                <span style="color:var(--color-on-surface-variant);">Clinic Days:</span>
                <strong style="color:var(--color-primary);">Tue, Wed, Thu, Sat, Sun</strong>
              </div>
            </div>

            <div style="background:var(--color-surface-container-low); padding:0.75rem; border-radius:var(--radius-md); font-size:0.78rem; color:var(--color-error); font-weight:700; text-align:center; margin-bottom:1.25rem;">
              ⚠️ Clinic Closed on Monday &amp; Friday
            </div>

            <a href="/book-appointment?treatment=${encodeURIComponent(treatment.name_en)}" class="btn btn-primary" style="width:100%; margin-bottom:0.75rem;">
              <span class="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Book For This Treatment</span>
            </a>

            <a href="https://wa.me/919733835105?text=Hello%20Dr.%20Supriyo%20Sahu,%20I%20have%20a%20question%20regarding%20${encodeURIComponent(treatment.name_en)}." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="width:100%;">
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}
