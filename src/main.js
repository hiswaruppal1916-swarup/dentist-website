import './styles/main.css';
import { renderHeader, initHeaderEvents } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { renderFloatingActions } from './components/FloatingActions.js';
import { initPwaBanner } from './components/PwaBanner.js';

import { renderHomePage } from './pages/HomePage.js';
import { renderAboutPage } from './pages/AboutPage.js';
import { renderDoctorsDirectoryPage } from './pages/DoctorsDirectoryPage.js';
import { renderDoctorProfilePage } from './pages/DoctorProfilePage.js';
import { renderTreatmentsListPage } from './pages/TreatmentsListPage.js';
import { renderTreatmentDetailPage } from './pages/TreatmentDetailPage.js';
import { renderBookAppointmentPage, initBookAppointmentEvents } from './pages/BookAppointmentPage.js';
import { renderAppointmentStatusPage, initAppointmentStatusEvents } from './pages/AppointmentStatusPage.js';
import { renderReviewsPage, initReviewsEvents } from './pages/ReviewsPage.js';
import { renderGalleryPage } from './pages/GalleryPage.js';
import { renderFaqPage } from './pages/FaqPage.js';
import { renderContactPage } from './pages/ContactPage.js';
import { supabase } from './services/supabase.js';
import { renderDoctorLoginPage, initDoctorLoginEvents } from './pages/DoctorLoginPage.js';
import { renderAdminDashboardPage, initAdminEvents } from './pages/AdminDashboardPage.js';

// SEO & Meta updates
function updateMetadata(title, description) {
  document.title = title ? `${title} | Dental Paradise` : 'Dental Paradise - A Complete Oral & Dental Care | Dr. Supriyo Sahu';
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = description || 'Dental Paradise is a premium dental clinic in Math Chandipur led by Dr. Supriyo Sahu (B.D.S. Hons, W.B.U.H.S.). Root canal, painless extraction, crown & bridge, and oral surgery.';
}

// Router
async function route() {
  const path = window.location.pathname;
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div style="min-height:70vh; display:flex; align-items:center; justify-content:center; color:var(--color-primary); font-size:1.1rem;">
      <div style="text-align:center;">
        <img src="/favicon.svg" alt="Loading Dental Paradise" style="width:48px; height:48px; margin:0 auto 1rem; animation:pulse 1.5s infinite;" />
        <p>Loading Dental Paradise...</p>
      </div>
    </div>
  `;

  let mainHtml = '';
  let onRendered = null;

  if (path === '/' || path === '') {
    updateMetadata('Complete Oral & Dental Care in Math Chandipur', 'Painless dental treatment & oral surgery by Dr. Supriyo Sahu at Dental Paradise, Math Chandipur. Book your appointment slot online.');
    mainHtml = await renderHomePage();
  } else if (path === '/about') {
    updateMetadata('About Clinic & Dr. Supriyo Sahu', 'Learn about Dental Paradise, Asia’s oldest dental college training background, and clinical excellence in Math Chandipur.');
    mainHtml = renderAboutPage();
  } else if (path === '/doctors') {
    updateMetadata('Our Dental Surgeons', 'Meet Dr. Supriyo Sahu (B.D.S. Hons, W.B.U.H.S.), Former House Surgeon at Dr. R. Ahmed Dental College & Medical College Hospital, Kolkata.');
    mainHtml = renderDoctorsDirectoryPage();
  } else if (path === '/doctors/dr-supriyo-sahu') {
    updateMetadata('Dr. Supriyo Sahu - Dental Surgeon Profile', 'Complete profile of Dr. Supriyo Sahu, B.D.S. (Hons), W.B.U.H.S. Oral & Maxillofacial Surgery, Endodontics, and Prosthodontia expert.');
    mainHtml = renderDoctorProfilePage();
  } else if (path === '/treatments') {
    updateMetadata('All Dental Treatments & Services', 'Explore all 12 dental treatments with bilingual English and Bengali guides. Root canal, wisdom tooth surgery, scaling, braces.');
    mainHtml = await renderTreatmentsListPage();
  } else if (path.startsWith('/treatments/')) {
    const slug = path.split('/')[2];
    mainHtml = await renderTreatmentDetailPage(slug);
  } else if (path === '/book-appointment') {
    updateMetadata('Book Dental Appointment', 'Reserve your 30-minute consultation slot with Dr. Supriyo Sahu. Real-time queue ordering. Cash at Clinic.');
    const params = new URLSearchParams(window.location.search);
    const preselected = params.get('treatment') || '';
    mainHtml = await renderBookAppointmentPage(preselected);
    onRendered = initBookAppointmentEvents;
  } else if (path === '/appointment-status') {
    updateMetadata('Check Appointment Status', 'Track your appointment confirmation, doctor review status, and daily queue number with Dental Paradise.');
    mainHtml = renderAppointmentStatusPage();
    onRendered = initAppointmentStatusEvents;
  } else if (path === '/reviews') {
    updateMetadata('Patient Reviews & Ratings', 'Genuine feedback and reviews from patients treated at Dental Paradise clinic in Math Chandipur.');
    mainHtml = await renderReviewsPage();
    onRendered = initReviewsEvents;
  } else if (path === '/gallery') {
    updateMetadata('Clinic Photo Gallery', 'Browse photos of Dental Paradise clinic, visiting card, operatory standards, and sterilization facilities.');
    mainHtml = renderGalleryPage();
  } else if (path === '/faq') {
    updateMetadata('Frequently Asked Questions (FAQ)', 'Common patient questions answered in English and Bengali regarding root canal pain, clinic hours, and booking.');
    mainHtml = renderFaqPage();
  } else if (path === '/contact') {
    updateMetadata('Contact & Location in Math Chandipur', 'Visit Dental Paradise behind Life Care Diagnostic Center, Math Chandipur Market (PIN 721659). Call 9733835105.');
    mainHtml = renderContactPage();
  } else if (path === '/privacy') {
    updateMetadata('Privacy Policy', 'Patient confidentiality and privacy standards at Dental Paradise.');
    mainHtml = renderPrivacyPage();
  } else if (path === '/terms') {
    updateMetadata('Terms & Conditions', 'Clinic guidelines, arrival rules, and clinical disclaimer.');
    mainHtml = renderTermsPage();
  } else if (path === '/doctor-login') {
    updateMetadata('Doctor & Staff Login', 'Authorized doctor authentication for Dr. Supriyo Sahu at Dental Paradise.');
    mainHtml = renderDoctorLoginPage();
    onRendered = initDoctorLoginEvents;
  } else if (path === '/doctor-dashboard') {
    updateMetadata('Doctor Consultation Dashboard', 'Authorized clinical administration and live queue for Dr. Supriyo Sahu.');
    mainHtml = await renderAdminDashboardPage();
    onRendered = initAdminEvents;
  } else if (path === '/admin') {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user?.email?.trim().toLowerCase() === 'supriyosahu96@gmail.com') {
      window.history.replaceState({}, '', '/doctor-dashboard');
    } else {
      window.history.replaceState({}, '', '/doctor-login');
    }
    return route();
  } else if (path === '/stitch' || path.startsWith('/stitch/')) {
    window.history.replaceState({}, '', '/');
    return route();
  } else {
    mainHtml = `
      <div class="container section" style="text-align:center; padding:6rem 0;">
        <h1 style="font-size:2.5rem; margin-bottom:1rem;">Page Not Found</h1>
        <p style="color:var(--text-muted); margin-bottom:2rem;">The requested page could not be located on Dental Paradise.</p>
        <a href="/" class="btn btn-primary">Go to Homepage</a>
      </div>
    `;
  }

  app.innerHTML = `
    ${renderHeader(path)}
    <main id="main-content">${mainHtml}</main>
    ${renderFooter()}
    ${renderFloatingActions(path)}
  `;

  initHeaderEvents();
  if (onRendered) onRendered();
  window.scrollTo(0, 0);
}

// Global SPA link interceptor
window.addEventListener('click', (e) => {
  const anchor = e.target.closest('a');
  if (anchor && anchor.href && anchor.origin === window.location.origin) {
    // Only intercept local internal paths, not external or special protocols
    const url = new URL(anchor.href);
    if (!anchor.hasAttribute('download') && !anchor.target && !url.pathname.endsWith('.xml') && !url.pathname.endsWith('.txt')) {
      e.preventDefault();
      window.history.pushState({}, '', anchor.href);
      route();
    }
  }
});

window.addEventListener('popstate', route);

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('Dental Paradise PWA ServiceWorker registered with scope:', reg.scope);
    }).catch((err) => {
      console.warn('ServiceWorker registration error:', err);
    });
  });
}

// Initialize PWA install banner
initPwaBanner();

// Run router on initial load
route();
