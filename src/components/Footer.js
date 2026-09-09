export function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
              <img src="/favicon.svg" alt="Dental Paradise" style="width:36px; height:36px; border-radius:8px;" />
              <div>
                <h3 style="margin:0; font-size:1.3rem;">Dental Paradise</h3>
                <span style="font-size:0.75rem; color:#00A896; text-transform:uppercase; letter-spacing:0.05em;">A Complete Oral & Dental Care</span>
              </div>
            </div>
            <p style="font-size:0.9rem; margin-bottom:1.25rem; line-height:1.5;">
              Led by <strong>Dr. Supriyo Sahu</strong> (B.D.S. Hons, W.B.U.H.S.), Former House Surgeon at Dr. R. Ahmed Dental College & Hospital & Medical College Hospital, Kolkata. Providing patient-first, painless clinical dental care.
            </p>
            <p style="font-size:0.85rem; color:#94A3B8;">
              📍 Math Chandipur, Chandipur Market, Behind Life Care Diagnostic Center, PIN- 721659
            </p>
            <p style="font-size:0.85rem; color:#94A3B8; margin-top:0.35rem;">
              📞 Call: <a href="tel:9733835105" style="color:#00A896;">9733835105</a> | 💬 WhatsApp: <a href="https://wa.me/919733835105" style="color:#00A896;">9733835105</a>
            </p>
          </div>

          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul class="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Clinic</a></li>
              <li><a href="/doctors/dr-supriyo-sahu">Doctor Profile</a></li>
              <li><a href="/treatments">All Treatments</a></li>
              <li><a href="/book-appointment">Book Appointment</a></li>
              <li><a href="/appointment-status">Check Appointment Status</a></li>
              <li><a href="/reviews">Patient Reviews</a></li>
              <li><a href="/gallery">Clinic Photos</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact">Location & Directions</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Clinical Care</h4>
            <ul class="footer-links">
              <li><a href="/treatments/root-canal-treatment">Root Canal Treatment</a></li>
              <li><a href="/treatments/impaction-wisdom-tooth-surgery">Wisdom Tooth Surgery</a></li>
              <li><a href="/treatments/painless-tooth-extraction">Painless Tooth Extraction</a></li>
              <li><a href="/treatments/crown-bridge-prosthesis">Crown & Bridge</a></li>
              <li><a href="/treatments/scaling-polishing">Scaling & Polishing</a></li>
              <li><a href="/treatments/dental-restoration-fillings">Tooth-Colored Fillings</a></li>
              <li><a href="/treatments/pediatric-dental-care">Pediatric Dental Care</a></li>
              <li><a href="/treatments/cosmetic-dentistry-smile-designing">Smile Designing</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Clinic Hours</h4>
            <div style="font-size:0.85rem; line-height:1.6; color:#CBD5E1;">
              <p><strong>Tue, Wed, Thu, Sat, Sun:</strong><br/>
              Morning: 8:00 AM – 12:00 PM<br/>
              Evening: 4:00 PM – 8:00 PM</p>
              <p style="margin-top:0.75rem; color:#F87171;">
                <strong>Monday:</strong> CLOSED<br/>
                <strong>Friday:</strong> CLOSED
              </p>
              <div style="margin-top:1.25rem;">
                <a href="/admin" style="font-size:0.8rem; color:#64748B; text-decoration:underline;">Doctor / Staff Portal</a>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p style="max-width:700px; font-size:0.8rem; color:#64748B;">
            <strong>Medical Disclaimer:</strong> Information provided on this website is for general educational purposes and does not constitute personalized medical advice. Treatment suitability can only be determined after a proper clinical dental examination.
          </p>
          <div style="display:flex; gap:1.5rem; font-size:0.82rem;">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms & Conditions</a>
            <span>© ${new Date().getFullYear()} Dental Paradise. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
