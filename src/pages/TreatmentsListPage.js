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
    console.error('Failed to load treatments', e);
  }

  const cardsHtml = treatments.map(t => `
    <div class="treatment-card">
      <div class="treatment-image-box">
        <img src="${t.image_url}" alt="${t.name_en}" loading="lazy" />
      </div>
      <div class="treatment-body">
        <h3 class="treatment-title-en">${t.name_en}</h3>
        <h4 class="treatment-title-bn bn-text">${t.name_bn}</h4>
        <p class="treatment-summary">${t.summary_en}</p>
        <p class="treatment-summary bn-text" style="font-size:0.85rem; color:#028090; margin-top:-0.5rem; margin-bottom:1.25rem;">${t.summary_bn}</p>
        <div class="treatment-footer">
          <a href="/treatments/${t.slug}" class="treatment-link">
            <span>Clinical Details & Bengali Guide</span> →
          </a>
          <a href="/book-appointment?treatment=${encodeURIComponent(t.name_en)}" class="btn btn-outline btn-sm">Book</a>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="container section">
      <div class="section-header">
        <span class="section-tag">Clinical Dental Care</span>
        <h1 class="section-title">All Dental Treatments & Services</h1>
        <p class="section-desc">
          Comprehensive, painless dental and oral surgical procedures available at Dental Paradise in Math Chandipur. Detailed bilingual explanations in English and বাংলা.
        </p>
      </div>

      <div class="treatments-grid">
        ${cardsHtml}
      </div>

      <div style="margin-top:4rem; background:var(--color-primary-soft); border-radius:var(--radius-lg); padding:2rem; text-align:center; border:1px solid var(--color-primary-light);">
        <h3 style="margin-bottom:0.5rem;">Unsure Which Dental Treatment You Need?</h3>
        <p style="color:var(--text-muted); max-width:650px; margin:0 auto 1.5rem; font-size:0.95rem;">
          Schedule an in-person clinical examination with Dr. Supriyo Sahu. We will inspect your teeth, take digital radiographs if required, and discuss all treatment options transparently.
        </p>
        <a href="/book-appointment" class="btn btn-primary btn-lg">Book Consultation Visit</a>
      </div>
    </div>
  `;
}
