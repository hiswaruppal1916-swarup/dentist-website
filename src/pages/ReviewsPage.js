import { supabase } from '../services/supabase.js';

export async function renderReviewsPage() {
  let reviews = [];
  try {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('id', { ascending: false });
    if (data) reviews = data;
  } catch (e) {
    console.error(e);
  }

  const reviewCardsHtml = reviews.map(r => `
    <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:2rem; box-shadow:var(--shadow-sm); display:flex; flex-direction:column;">
      <div style="color:#F59E0B; font-size:1.1rem; margin-bottom:0.75rem;">
        ${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}
      </div>
      <p style="font-size:0.95rem; color:var(--text-main); font-style:italic; line-height:1.7; margin-bottom:1.5rem; flex-grow:1;">
        "${r.review_text}"
      </p>
      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-light); padding-top:1rem;">
        <strong style="color:var(--color-secondary); font-size:0.95rem;">${r.patient_name}</strong>
        <span style="font-size:0.8rem; color:var(--color-primary); font-weight:600;">${r.treatment_name || 'Verified Patient'}</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="container section">
      <div class="section-header">
        <span class="section-tag">Testimonials</span>
        <h1 class="section-title">Patient Reviews & Experiences</h1>
        <p class="section-desc">
          Read genuine feedback from patients treated by Dr. Supriyo Sahu at Dental Paradise in Math Chandipur.
        </p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:2rem; margin-bottom:4rem;">
        ${reviewCardsHtml}
      </div>

      <!-- Submit Review Form -->
      <div style="max-width:680px; margin:0 auto; background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-xl); padding:2.5rem; box-shadow:var(--shadow-md);">
        <h3 style="font-size:1.5rem; margin-bottom:0.5rem; text-align:center;">Share Your Treatment Experience</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; text-align:center; margin-bottom:2rem;">
          Your feedback helps us continuously improve clinical care and comfort for every patient.
        </p>

        <form id="review-submission-form">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem;">
            <div class="form-group">
              <label class="form-label">Your Name *</label>
              <input type="text" id="rev-name" class="form-control" placeholder="e.g. Ananya Das" required />
            </div>
            <div class="form-group">
              <label class="form-label">Treatment Received</label>
              <input type="text" id="rev-treatment" class="form-control" placeholder="e.g. Root Canal Treatment" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Rating *</label>
            <select id="rev-rating" class="form-control" required>
              <option value="5">★★★★★ (5/5) Excellent Care</option>
              <option value="4">★★★★☆ (4/5) Very Good</option>
              <option value="3">★★★☆☆ (3/5) Average</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Your Review / Comments *</label>
            <textarea id="rev-text" class="form-control" rows="4" placeholder="Tell us about your dental visit, pain management, and doctor interaction..." required></textarea>
          </div>

          <button type="submit" id="rev-submit-btn" class="btn btn-primary" style="width:100%;">
            <span>Submit Patient Review</span>
          </button>
        </form>
      </div>
    </div>
  `;
}

export function initReviewsEvents() {
  const form = document.getElementById('review-submission-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('rev-name').value.trim();
    const treatment = document.getElementById('rev-treatment').value.trim();
    const rating = parseInt(document.getElementById('rev-rating').value, 10);
    const text = document.getElementById('rev-text').value.trim();
    const btn = document.getElementById('rev-submit-btn');

    btn.disabled = true;
    btn.innerHTML = 'Submitting...';

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          patient_name: name,
          treatment_name: treatment || 'Dental Consultation',
          rating: rating,
          review_text: text,
          is_approved: true
        });

      if (error) throw error;

      alert('Thank you for your feedback! Your review has been submitted.');
      form.reset();
      window.location.reload();
    } catch (err) {
      alert('Could not submit review: ' + err.message);
      btn.disabled = false;
      btn.innerHTML = 'Submit Patient Review';
    }
  });
}
