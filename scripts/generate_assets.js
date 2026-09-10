import fs from 'fs';
import path from 'path';

const treatmentDir = 'public/images/treatments';
const iconsDir = 'public/icons';
fs.mkdirSync(treatmentDir, { recursive: true });
fs.mkdirSync(iconsDir, { recursive: true });

// 1. Favicon SVG: Premium Medical Tooth with Teal Cross & Glow
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00A896"/>
      <stop offset="100%" stop-color="#028090"/>
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B2545"/>
      <stop offset="100%" stop-color="#134074"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="24" fill="url(#blueGrad)"/>
  <!-- Tooth Silhouette -->
  <path d="M32 26 C36 16, 64 16, 68 26 C76 34, 76 50, 68 62 C64 68, 62 82, 56 82 C52 82, 52 68, 50 68 C48 68, 48 82, 44 82 C38 82, 36 68, 32 62 C24 50, 24 34, 32 26 Z" fill="#FFFFFF"/>
  <!-- Medical Cross on Tooth -->
  <rect x="46" y="36" width="8" height="20" rx="3" fill="url(#tealGrad)"/>
  <rect x="40" y="42" width="20" height="8" rx="3" fill="url(#tealGrad)"/>
  <!-- Sparkle Accent -->
  <path d="M70 20 L72 26 L78 28 L72 30 L70 36 L68 30 L62 28 L68 26 Z" fill="#FFD166"/>
</svg>`;

fs.writeFileSync('public/favicon.svg', faviconSvg, 'utf8');
fs.writeFileSync('public/favicon.ico', faviconSvg, 'utf8');
fs.writeFileSync('public/icons/icon-192.svg', faviconSvg, 'utf8');
fs.writeFileSync('public/icons/icon-512.svg', faviconSvg, 'utf8');

function createTreatmentSvg(title, iconContent, theme = { bgStart: '#F0F9F8', bgEnd: '#E6F4F1', accent: '#006a61', badgeBg: '#001428', badgeText: '#FFFFFF', glow: '#00A896' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad_${title.replace(/[^a-zA-Z0-9]/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bgStart}"/>
      <stop offset="100%" stop-color="${theme.bgEnd}"/>
    </linearGradient>
    <filter id="cardGlow_${title.replace(/[^a-zA-Z0-9]/g, '')}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${theme.accent}" flood-opacity="0.18"/>
    </filter>
    <radialGradient id="mesh_${title.replace(/[^a-zA-Z0-9]/g, '')}" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="${theme.glow}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${theme.glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  
  <!-- Outer Card Canvas -->
  <rect width="480" height="320" rx="20" fill="url(#bgGrad_${title.replace(/[^a-zA-Z0-9]/g, '')})"/>
  <rect width="480" height="320" rx="20" fill="url(#mesh_${title.replace(/[^a-zA-Z0-9]/g, '')})"/>
  
  <!-- Ambient Graphic Rings -->
  <circle cx="410" cy="70" r="90" fill="${theme.accent}" opacity="0.08"/>
  <circle cx="70" cy="250" r="110" fill="#001428" opacity="0.04"/>
  
  <!-- Central Sterile Medical Emblem Container -->
  <g filter="url(#cardGlow_${title.replace(/[^a-zA-Z0-9]/g, '')})">
    <rect x="135" y="45" width="210" height="185" rx="24" fill="#FFFFFF"/>
    <rect x="135" y="45" width="210" height="185" rx="24" fill="none" stroke="${theme.accent}" stroke-width="1.5" stroke-opacity="0.2"/>
    <circle cx="240" cy="138" r="60" fill="${theme.bgStart}" stroke="${theme.accent}" stroke-width="1" stroke-dasharray="4 4" stroke-opacity="0.4"/>
    <g transform="translate(192, 90) scale(2.0)">
      ${iconContent}
    </g>
  </g>
  
  <!-- Lower Title Pill -->
  <g transform="translate(85, 252)">
    <rect width="310" height="42" rx="21" fill="${theme.badgeBg}" filter="drop-shadow(0 4px 8px rgba(0, 20, 40, 0.2))"/>
    <circle cx="24" cy="21" r="6" fill="${theme.glow}"/>
    <text x="160" y="26" fill="${theme.badgeText}" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="0.6">${title}</text>
  </g>
</svg>`;
}

const items = {
  'general-consultation': {
    title: 'GENERAL CONSULTATION',
    theme: { bgStart: '#EFF6FF', bgEnd: '#DBEAFE', accent: '#2563EB', badgeBg: '#0F2942', badgeText: '#FFFFFF', glow: '#60A5FA' },
    icon: `<path d="M12 12 C12 6, 36 6, 36 12 C36 20, 28 28, 24 32 C20 28, 12 20, 12 12 Z" fill="none" stroke="#2563EB" stroke-width="2.2"/>
           <circle cx="24" cy="14" r="5" fill="#2563EB" opacity="0.2"/>
           <path d="M21 21 L27 27 M27 21 L21 27" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round"/>`
  },
  'root-canal': {
    title: 'ROOT CANAL THERAPY (RCT)',
    theme: { bgStart: '#F0FDFA', bgEnd: '#CCFBF1', accent: '#0D9488', badgeBg: '#001428', badgeText: '#FFFFFF', glow: '#14B8A6' },
    icon: `<path d="M15 6 C17 2, 33 2, 35 6 C39 10, 39 18, 35 24 C33 27, 32 34, 29 34 C27 34, 27 27, 25 27 C23 27, 23 34, 21 34 C18 34, 17 27, 15 24 C11 18, 11 10, 15 6 Z" fill="none" stroke="#0D9488" stroke-width="2"/>
           <path d="M22 13 L22 30" stroke="#EF4444" stroke-width="2.2" stroke-linecap="round"/>
           <path d="M26 13 L26 30" stroke="#EF4444" stroke-width="2.2" stroke-linecap="round"/>
           <circle cx="24" cy="11" r="2.5" fill="#EF4444"/>`
  },
  'wisdom-tooth': {
    title: 'IMPACTION & WISDOM SURGERY',
    theme: { bgStart: '#FFF7ED', bgEnd: '#FFEDD5', accent: '#EA580C', badgeBg: '#0B2545', badgeText: '#FFFFFF', glow: '#F97316' },
    icon: `<path d="M14 8 C17 3, 31 3, 34 8 C38 13, 37 22, 33 28 C30 32, 29 40, 26 40 C23 40, 23 32, 21 32 C19 32, 19 40, 16 40 C13 40, 12 32, 9 28 C5 22, 4 13, 8 8 Z" fill="none" stroke="#EA580C" stroke-width="2" transform="rotate(-20 24 24)"/>
           <path d="M8 38 L40 38" stroke="#64748B" stroke-width="2.5" stroke-linecap="round"/>
           <path d="M30 8 L36 14" stroke="#F97316" stroke-width="2" stroke-linecap="round"/>`
  },
  'tooth-extraction': {
    title: 'PAINLESS TOOTH EXTRACTION',
    theme: { bgStart: '#F0F9FF', bgEnd: '#E0F2FE', accent: '#0284C7', badgeBg: '#001428', badgeText: '#FFFFFF', glow: '#38BDF8' },
    icon: `<path d="M16 10 C18 6, 32 6, 34 10 C38 14, 38 22, 34 26 C32 30, 31 38, 28 38 C26 38, 26 30, 25 30 C24 30, 24 38, 22 38 C19 38, 18 30, 16 26 C12 22, 12 14, 16 10 Z" fill="#0284C7" opacity="0.15"/>
           <path d="M16 10 C18 6, 32 6, 34 10 C38 14, 38 22, 34 26 C32 30, 31 38, 28 38 C26 38, 26 30, 25 30 C24 30, 24 38, 22 38 C19 38, 18 30, 16 26 C12 22, 12 14, 16 10 Z" fill="none" stroke="#0284C7" stroke-width="2"/>
           <path d="M25 2 L25 8 M22 5 L25 2 L28 5" stroke="#0284C7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`
  },
  'crown-bridge': {
    title: 'CROWNS, BRIDGES & PROSTHESIS',
    theme: { bgStart: '#FFFBEB', bgEnd: '#FEF3C7', accent: '#D97706', badgeBg: '#0F2942', badgeText: '#FFFFFF', glow: '#FBBF24' },
    icon: `<path d="M13 14 L17 28 L33 28 L37 14 L29 18 L25 10 L21 18 Z" fill="none" stroke="#D97706" stroke-width="2.2" stroke-linejoin="round"/>
           <circle cx="13" cy="12" r="2.2" fill="#D97706"/>
           <circle cx="25" cy="8" r="2.2" fill="#D97706"/>
           <circle cx="37" cy="12" r="2.2" fill="#D97706"/>
           <path d="M17 32 L33 32" stroke="#0D9488" stroke-width="2.2" stroke-linecap="round"/>`
  },
  'scaling-polishing': {
    title: 'TEETH SCALING & POLISHING',
    theme: { bgStart: '#F0FDF4', bgEnd: '#DCFCE7', accent: '#16A34A', badgeBg: '#001428', badgeText: '#FFFFFF', glow: '#4ADE80' },
    icon: `<path d="M16 8 C18 4, 32 4, 34 8 C38 12, 38 20, 34 24 C32 28, 31 36, 28 36 C26 36, 26 28, 25 28 C24 28, 24 36, 22 36 C19 36, 18 28, 16 24 C12 20, 12 12, 16 8 Z" fill="none" stroke="#16A34A" stroke-width="2"/>
           <path d="M34 10 L40 7 M37 16 L43 16 M35 22 L40 25" stroke="#16A34A" stroke-width="2" stroke-linecap="round"/>
           <path d="M14 10 L8 7 M11 16 L5 16 M13 22 L8 25" stroke="#16A34A" stroke-width="2" stroke-linecap="round"/>`
  },
  'dental-filling': {
    title: 'RESTORATION & FILLINGS',
    theme: { bgStart: '#F5F3FF', bgEnd: '#EDE9FE', accent: '#7C3AED', badgeBg: '#0B2545', badgeText: '#FFFFFF', glow: '#A78BFA' },
    icon: `<path d="M16 8 C18 4, 32 4, 34 8 C38 12, 38 20, 34 24 C32 28, 31 36, 28 36 C26 36, 26 28, 25 28 C24 28, 24 36, 22 36 C19 36, 18 28, 16 24 C12 20, 12 12, 16 8 Z" fill="none" stroke="#7C3AED" stroke-width="2"/>
           <path d="M21 12 C23 10, 27 10, 29 12 C30 14, 29 18, 28 19 C27 20, 23 20, 22 19 C21 18, 20 14, 21 12 Z" fill="#7C3AED" opacity="0.4"/>
           <path d="M36 6 L30 11" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round"/>`
  },
  'orthodontics': {
    title: 'ORTHODONTICS & BRACES',
    theme: { bgStart: '#EEF2FF', bgEnd: '#E0E7FF', accent: '#4F46E5', badgeBg: '#001428', badgeText: '#FFFFFF', glow: '#818CF8' },
    icon: `<path d="M12 24 C16 16, 34 16, 38 24" stroke="#4F46E5" stroke-width="2.2" stroke-linecap="round"/>
           <rect x="15" y="20" width="5" height="7" rx="1.5" fill="#0B2545"/>
           <rect x="23" y="18" width="5" height="7" rx="1.5" fill="#0B2545"/>
           <rect x="31" y="20" width="5" height="7" rx="1.5" fill="#0B2545"/>
           <path d="M10 23 L40 23" stroke="#E11D48" stroke-width="2" stroke-linecap="round"/>`
  },
  'pediatric-dentistry': {
    title: 'PEDIATRIC DENTAL CARE',
    theme: { bgStart: '#FEF2F2', bgEnd: '#FEE2E2', accent: '#E11D48', badgeBg: '#0F2942', badgeText: '#FFFFFF', glow: '#FB7185' },
    icon: `<path d="M18 12 C20 8, 30 8, 32 12 C36 16, 36 22, 32 26 C30 29, 29 35, 27 35 C25 35, 25 29, 24 29 C23 29, 23 35, 21 35 C19 35, 18 29, 16 26 C12 22, 12 16, 18 12 Z" fill="none" stroke="#E11D48" stroke-width="2"/>
           <circle cx="21" cy="17" r="1.5" fill="#E11D48"/>
           <circle cx="27" cy="17" r="1.5" fill="#E11D48"/>
           <path d="M21 21 Q24 25 27 21" stroke="#E11D48" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
  },
  'fractured-tooth': {
    title: 'FRACTURED TOOTH CARE',
    theme: { bgStart: '#FEF2F2', bgEnd: '#FFE4E6', accent: '#DC2626', badgeBg: '#001428', badgeText: '#FFFFFF', glow: '#F87171' },
    icon: `<path d="M16 8 C18 4, 32 4, 34 8 C38 12, 38 20, 34 24 C32 28, 31 36, 28 36 C26 36, 26 28, 25 28 C24 28, 24 36, 22 36 C19 36, 18 28, 16 24 C12 20, 12 12, 16 8 Z" fill="none" stroke="#DC2626" stroke-width="2"/>
           <path d="M25 6 L23 13 L27 18 L25 26" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`
  },
  'smile-design': {
    title: 'COSMETIC SMILE DESIGN',
    theme: { bgStart: '#FAF5FF', bgEnd: '#F3E8FF', accent: '#9333EA', badgeBg: '#001428', badgeText: '#FFFFFF', glow: '#C084FC' },
    icon: `<path d="M10 20 Q25 36 40 20" stroke="#9333EA" stroke-width="3" fill="none" stroke-linecap="round"/>
           <path d="M14 20 Q25 30 36 20" stroke="#0D9488" stroke-width="2" fill="#FFFFFF" stroke-linecap="round"/>
           <path d="M25 6 L27 10 L31 11 L27 12 L25 16 L23 12 L19 11 L23 10 Z" fill="#F59E0B"/>`
  },
  'oral-surgery': {
    title: 'MINOR ORAL & CYSTIC SURGERY',
    theme: { bgStart: '#F0FDFA', bgEnd: '#E6FFFA', accent: '#0D9488', badgeBg: '#0B2545', badgeText: '#FFFFFF', glow: '#2DD4BF' },
    icon: `<path d="M12 18 C12 10, 38 10, 38 18 C38 28, 25 38, 25 38 C25 38, 12 28, 12 18 Z" fill="none" stroke="#0D9488" stroke-width="2"/>
           <circle cx="25" cy="20" r="6" fill="#0D9488" opacity="0.25"/>
           <circle cx="25" cy="20" r="6" fill="none" stroke="#0D9488" stroke-width="1.5"/>
           <path d="M34 8 L28 14" stroke="#DC2626" stroke-width="2" stroke-linecap="round"/>`
  },
  'full-reconstruction': {
    title: 'FULL MOUTH RECONSTRUCTION',
    theme: { bgStart: '#F8FAFC', bgEnd: '#E2E8F0', accent: '#334155', badgeBg: '#001428', badgeText: '#FFFFFF', glow: '#64748B' },
    icon: `<path d="M8 26 C8 12, 42 12, 42 26" stroke="#334155" stroke-width="2.5" fill="none" stroke-linecap="round"/>
           <circle cx="14" cy="24" r="3.2" fill="#0D9488"/>
           <circle cx="21" cy="20" r="3.2" fill="#0D9488"/>
           <circle cx="29" cy="20" r="3.2" fill="#0D9488"/>
           <circle cx="36" cy="24" r="3.2" fill="#0D9488"/>
           <path d="M10 32 L40 32 M12 36 L38 36" stroke="#EA580C" stroke-width="2" stroke-linecap="round"/>`
  }
};

for (const [key, val] of Object.entries(items)) {
  const svg = createTreatmentSvg(val.title, val.icon, val.theme);
  fs.writeFileSync(path.join(treatmentDir, `${key}.svg`), svg, 'utf8');
}

console.log('Successfully generated favicon and all 13 enhanced treatment illustration SVGs.');

