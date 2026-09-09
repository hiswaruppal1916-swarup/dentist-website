export function renderPrivacyPage() {
  return `
    <div class="container section" style="max-width:860px;">
      <h1 style="font-size:2.2rem; margin-bottom:1.5rem;">Privacy Policy</h1>
      <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-xl); padding:2.5rem; line-height:1.8; color:var(--text-main); box-shadow:var(--shadow-sm);">
        <p style="margin-bottom:1.25rem;">
          At <strong>Dental Paradise</strong> (A Complete Oral & Dental Care), we take patient confidentiality and personal medical data privacy very seriously.
        </p>

        <h3 style="font-size:1.25rem; margin:1.5rem 0 0.5rem; color:var(--color-secondary);">1. Information We Collect</h3>
        <p style="margin-bottom:1.25rem;">
          When you book an appointment online or contact our clinic, we collect basic contact information: patient name, telephone number, optional email address, requested dental treatment, and any optional message regarding your dental concerns.
        </p>

        <h3 style="font-size:1.25rem; margin:1.5rem 0 0.5rem; color:var(--color-secondary);">2. How We Use Patient Information</h3>
        <p style="margin-bottom:1.25rem;">
          Your information is solely used to organize your clinical consultation, compute your daily queue number, and communicate appointment status updates via SMS, telephone, WhatsApp, or Push Notifications.
        </p>

        <h3 style="font-size:1.25rem; margin:1.5rem 0 0.5rem; color:var(--color-secondary);">3. Strict Patient Data Isolation</h3>
        <p style="margin-bottom:1.25rem;">
          Patient records and appointment lookups are strictly partitioned through database Row Level Security (RLS). A patient can only view their own appointment status using their designated Appointment ID and verified mobile number.
        </p>

        <h3 style="font-size:1.25rem; margin:1.5rem 0 0.5rem; color:var(--color-secondary);">4. Data Protection & Security</h3>
        <p style="margin-bottom:1.25rem;">
          We do not sell, rent, or trade patient personal data with any third-party marketing companies. All clinical records remain protected under medical ethics standards.
        </p>
      </div>
    </div>
  `;
}

export function renderTermsPage() {
  return `
    <div class="container section" style="max-width:860px;">
      <h1 style="font-size:2.2rem; margin-bottom:1.5rem;">Terms & Conditions</h1>
      <div style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-xl); padding:2.5rem; line-height:1.8; color:var(--text-main); box-shadow:var(--shadow-sm);">
        <h3 style="font-size:1.25rem; margin-bottom:0.5rem; color:var(--color-secondary);">1. Medical & Clinical Disclaimer</h3>
        <p style="margin-bottom:1.25rem;">
          All treatment explanations, procedure descriptions, and educational content on this website are provided for general patient understanding. <strong>Treatment suitability can only be determined after a proper clinical examination by Dr. Supriyo Sahu.</strong> Online booking does not constitute a guaranteed clinical diagnosis.
        </p>

        <h3 style="font-size:1.25rem; margin:1.5rem 0 0.5rem; color:var(--color-secondary);">2. Clinic Working Schedule</h3>
        <p style="margin-bottom:1.25rem;">
          Appointments are accepted exclusively for working clinic days: <strong>Tuesday, Wednesday, Thursday, Saturday, and Sunday</strong> between 8:00 AM – 12:00 PM and 4:00 PM – 8:00 PM. Monday and Friday are strictly closed days.
        </p>

        <h3 style="font-size:1.25rem; margin:1.5rem 0 0.5rem; color:var(--color-secondary);">3. Queue & Arrival Policy</h3>
        <p style="margin-bottom:1.25rem;">
          Patients are requested to arrive 10 minutes prior to their assigned 30-minute slot. In the event of an emergency dental trauma or surgical complication, emergency cases may receive immediate clinical triage.
        </p>

        <h3 style="font-size:1.25rem; margin:1.5rem 0 0.5rem; color:var(--color-secondary);">4. Payment Policy</h3>
        <p style="margin-bottom:1.25rem;">
          All consultation and procedure fees are payable via <strong>Cash at Clinic</strong> upon consultation. Dental Paradise does not ask for online pre-payments or card credentials.
        </p>
      </div>
    </div>
  `;
}
