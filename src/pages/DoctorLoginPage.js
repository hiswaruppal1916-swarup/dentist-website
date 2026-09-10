import { supabase } from '../services/supabase.js';

export const AUTHORIZED_DOCTOR_EMAIL = 'supriyosahu96@gmail.com';

export function renderDoctorLoginPage() {
  return `
    <div class="container section" style="max-width:440px; margin:2rem auto; padding:1rem;">
      <div style="background:#FFFFFF; border:1px solid var(--color-outline-variant); border-radius:var(--radius-xl); padding:2rem 1.5rem; box-shadow:var(--shadow-md); text-align:center;">
        
        <!-- Clinic Icon & Header -->
        <div style="width:54px; height:54px; border-radius:var(--radius-md); background:var(--color-surface-container-low); border:1px solid var(--color-surface-container-high); display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; color:var(--color-secondary);">
          <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">dentistry</span>
        </div>

        <span class="section-tag">Clinical Portal</span>
        <h1 style="font-size:1.6rem; color:var(--color-primary); margin-bottom:0.35rem;">Doctor / Staff Login</h1>
        <p style="color:var(--color-on-surface-variant); font-size:0.85rem; margin-bottom:1.5rem; line-height:1.5;">
          Dedicated administrative access for <strong>Dr. Supriyo Sahu</strong> to manage real-time patient queue and appointments.
        </p>

        <!-- Alert Notification Box -->
        <div id="login-alert" style="display:none; padding:0.75rem 1rem; border-radius:var(--radius-md); font-size:0.85rem; margin-bottom:1.25rem; text-align:left;"></div>

        <!-- Login Form -->
        <form id="doctor-login-form" style="text-align:left;">
          <div class="form-group">
            <label class="form-label" for="doctor-email">Authorized Email Address *</label>
            <div style="position:relative;">
              <input 
                type="email" 
                id="doctor-email" 
                class="form-control" 
                placeholder="e.g. doctor@example.com" 
                autocomplete="username" 
                required 
                style="padding-left:2.5rem;"
              />
              <span class="material-symbols-outlined" style="position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); color:var(--color-outline); font-size:18px;">mail</span>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
              <label class="form-label" for="doctor-password" style="margin:0;">Password *</label>
            </div>
            <div style="position:relative;">
              <input 
                type="password" 
                id="doctor-password" 
                class="form-control" 
                placeholder="Enter doctor account password" 
                autocomplete="current-password" 
                required 
                style="padding-left:2.5rem; padding-right:2.5rem;"
              />
              <span class="material-symbols-outlined" style="position:absolute; left:0.75rem; top:50%; transform:translateY(-50%); color:var(--color-outline); font-size:18px;">lock</span>
              <button 
                type="button" 
                id="toggle-password-btn" 
                aria-label="Toggle password visibility" 
                style="position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--color-outline); cursor:pointer; padding:0; display:flex; align-items:center;"
              >
                <span class="material-symbols-outlined" id="password-eye-icon" style="font-size:18px;">visibility</span>
              </button>
            </div>
          </div>

          <button type="submit" id="doctor-submit-btn" class="btn btn-primary" style="width:100%; font-weight:700; padding:0.85rem;">
            <span class="material-symbols-outlined text-[18px]">login</span>
            <span>Sign In to Dashboard</span>
          </button>
        </form>

        <div style="margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid var(--color-surface-container); font-size:0.78rem; color:var(--color-outline); line-height:1.5;">
          🔒 Strictly confidential. Unauthorized login attempts are monitored and recorded by Supabase security.
        </div>

        <div style="margin-top:1rem;">
          <a href="/" style="font-size:0.85rem; color:var(--color-secondary); font-weight:600; display:inline-flex; align-items:center; gap:0.25rem;">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Return to Dental Paradise Home</span>
          </a>
        </div>

      </div>
    </div>
  `;
}

export function initDoctorLoginEvents() {
  const form = document.getElementById('doctor-login-form');
  const emailInput = document.getElementById('doctor-email');
  const passwordInput = document.getElementById('doctor-password');
  const submitBtn = document.getElementById('doctor-submit-btn');
  const alertBox = document.getElementById('login-alert');
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const eyeIcon = document.getElementById('password-eye-icon');

  if (!form) return;

  function showAlert(message, isError = true) {
    if (!alertBox) return;
    alertBox.style.display = 'block';
    if (isError) {
      alertBox.style.background = '#FEE2E2';
      alertBox.style.border = '1px solid #FECACA';
      alertBox.style.color = '#991B1B';
      alertBox.innerHTML = `⚠️ <strong>Error:</strong> ${message}`;
    } else {
      alertBox.style.background = '#D1FAE5';
      alertBox.style.border = '1px solid #A7F3D0';
      alertBox.style.color = '#065F46';
      alertBox.innerHTML = `✓ ${message}`;
    }
  }

  // Check URL params for error messages
  const params = new URLSearchParams(window.location.search);
  if (params.get('error') === 'unauthorized') {
    showAlert('Access denied: You were signed in with an unauthorized account. Only Dr. Supriyo Sahu is allowed.', true);
  }

  // Check if already authenticated as the doctor
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session && session.user?.email?.trim().toLowerCase() === AUTHORIZED_DOCTOR_EMAIL) {
      window.history.replaceState({}, '', '/doctor-dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  });

  // Toggle password visibility
  if (togglePasswordBtn && passwordInput && eyeIcon) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      eyeIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rawEmail = emailInput.value || '';
    const normalizedEmail = rawEmail.trim().toLowerCase();
    const password = passwordInput.value || '';

    // Enforce authorized doctor email rule
    if (normalizedEmail !== AUTHORIZED_DOCTOR_EMAIL) {
      showAlert(`Access Denied: "${rawEmail}" is not the authorized Doctor account for Dental Paradise. Only Dr. Supriyo Sahu (${AUTHORIZED_DOCTOR_EMAIL}) is permitted.`, true);
      return;
    }

    if (!password) {
      showAlert('Please enter your password.', true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="material-symbols-outlined text-[18px] animate-spin">sync</span>
      <span>Authenticating...</span>
    `;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password
      });

      if (error) {
        showAlert(error.message || 'Invalid email or password. Please verify your credentials.', true);
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span class="material-symbols-outlined text-[18px]">login</span>
          <span>Sign In to Dashboard</span>
        `;
        return;
      }

      // Verify user email after sign-in
      const loggedEmail = data?.user?.email?.trim().toLowerCase();
      if (loggedEmail !== AUTHORIZED_DOCTOR_EMAIL) {
        await supabase.auth.signOut();
        showAlert('Unauthorized account. Access denied.', true);
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span class="material-symbols-outlined text-[18px]">login</span>
          <span>Sign In to Dashboard</span>
        `;
        return;
      }

      showAlert('Login successful! Redirecting to Doctor Dashboard...', false);

      // Redirect to /doctor-dashboard
      setTimeout(() => {
        window.history.pushState({}, '', '/doctor-dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 500);

    } catch (err) {
      showAlert('Authentication request failed: ' + (err.message || 'Network error'), true);
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined text-[18px]">login</span>
        <span>Sign In to Dashboard</span>
      `;
    }
  });
}
