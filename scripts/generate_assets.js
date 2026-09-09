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

function createTreatmentSvg(title, iconContent, accentColor = '#00A896') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0F9F8"/>
      <stop offset="100%" stop-color="#E1F3F1"/>
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#0B2545" flood-opacity="0.08"/>
    </filter>
  </defs>
  <rect width="400" height="280" rx="16" fill="url(#bgGrad)"/>
  <circle cx="340" cy="50" r="70" fill="#00A896" opacity="0.08"/>
  <circle cx="60" cy="220" r="90" fill="#0B2545" opacity="0.05"/>
  
  <g filter="url(#cardShadow)">
    <rect x="110" y="35" width="180" height="160" rx="20" fill="#FFFFFF"/>
    <circle cx="200" cy="115" r="48" fill="#F0F9F8"/>
    <g transform="translate(160, 75) scale(1.6)">
      ${iconContent}
    </g>
  </g>
  
  <rect x="70" y="215" width="260" height="34" rx="17" fill="#0B2545"/>
  <text x="200" y="237" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" letter-spacing="0.5">${title}</text>
</svg>`;
}

const items = {
  'root-canal': {
    title: 'ROOT CANAL THERAPY',
    icon: `<path d="M15 6 C17 2, 33 2, 35 6 C39 10, 39 18, 35 24 C33 27, 32 34, 29 34 C27 34, 27 27, 25 27 C23 27, 23 34, 21 34 C18 34, 17 27, 15 24 C11 18, 11 10, 15 6 Z" fill="none" stroke="#00A896" stroke-width="2"/>
           <path d="M23 14 L23 30" stroke="#E63946" stroke-width="2" stroke-linecap="round"/>
           <path d="M27 14 L27 30" stroke="#E63946" stroke-width="2" stroke-linecap="round"/>
           <circle cx="25" cy="12" r="2" fill="#E63946"/>`
  },
  'wisdom-tooth': {
    title: 'IMPACTION & WISDOM SURGERY',
    icon: `<path d="M14 8 C17 3, 31 3, 34 8 C38 13, 37 22, 33 28 C30 32, 29 40, 26 40 C23 40, 23 32, 21 32 C19 32, 19 40, 16 40 C13 40, 12 32, 9 28 C5 22, 4 13, 8 8 Z" fill="none" stroke="#028090" stroke-width="2" transform="rotate(-20 24 24)"/>
           <path d="M8 38 L40 38" stroke="#6C757D" stroke-width="2.5" stroke-linecap="round"/>
           <path d="M30 8 L36 14" stroke="#F4A261" stroke-width="2" stroke-linecap="round"/>`
  },
  'tooth-extraction': {
    title: 'PAINLESS EXTRACTION',
    icon: `<path d="M16 10 C18 6, 32 6, 34 10 C38 14, 38 22, 34 26 C32 30, 31 38, 28 38 C26 38, 26 30, 25 30 C24 30, 24 38, 22 38 C19 38, 18 30, 16 26 C12 22, 12 14, 16 10 Z" fill="#00A896" opacity="0.2"/>
           <path d="M16 10 C18 6, 32 6, 34 10 C38 14, 38 22, 34 26 C32 30, 31 38, 28 38 C26 38, 26 30, 25 30 C24 30, 24 38, 22 38 C19 38, 18 30, 16 26 C12 22, 12 14, 16 10 Z" fill="none" stroke="#00A896" stroke-width="2"/>
           <path d="M25 2 L25 8 M22 5 L25 2 L28 5" stroke="#028090" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
  },
  'crown-bridge': {
    title: 'CROWN & PROSTHESIS',
    icon: `<path d="M13 14 L17 28 L33 28 L37 14 L29 18 L25 10 L21 18 Z" fill="none" stroke="#E76F51" stroke-width="2.5" stroke-linejoin="round"/>
           <circle cx="13" cy="12" r="2" fill="#E76F51"/>
           <circle cx="25" cy="8" r="2" fill="#E76F51"/>
           <circle cx="37" cy="12" r="2" fill="#E76F51"/>
           <path d="M17 32 L33 32" stroke="#00A896" stroke-width="2" stroke-linecap="round"/>`
  },
  'scaling-polishing': {
    title: 'SCALING & POLISHING',
    icon: `<path d="M16 8 C18 4, 32 4, 34 8 C38 12, 38 20, 34 24 C32 28, 31 36, 28 36 C26 36, 26 28, 25 28 C24 28, 24 36, 22 36 C19 36, 18 28, 16 24 C12 20, 12 12, 16 8 Z" fill="none" stroke="#00A896" stroke-width="2"/>
           <path d="M34 10 L39 7 M36 16 L42 16 M34 22 L39 25" stroke="#028090" stroke-width="2" stroke-linecap="round"/>
           <path d="M14 10 L9 7 M12 16 L6 16 M14 22 L9 25" stroke="#028090" stroke-width="2" stroke-linecap="round"/>`
  },
  'dental-filling': {
    title: 'RESTORATION & FILLINGS',
    icon: `<path d="M16 8 C18 4, 32 4, 34 8 C38 12, 38 20, 34 24 C32 28, 31 36, 28 36 C26 36, 26 28, 25 28 C24 28, 24 36, 22 36 C19 36, 18 28, 16 24 C12 20, 12 12, 16 8 Z" fill="none" stroke="#00A896" stroke-width="2"/>
           <path d="M21 12 C23 10, 27 10, 29 12 C30 14, 29 18, 28 19 C27 20, 23 20, 22 19 C21 18, 20 14, 21 12 Z" fill="#00A896"/>
           <path d="M36 6 L30 11" stroke="#F4A261" stroke-width="2.5" stroke-linecap="round"/>`
  },
  'orthodontics': {
    title: 'BRACES & ALIGNMENT',
    icon: `<path d="M12 24 C16 16, 34 16, 38 24" stroke="#00A896" stroke-width="2" stroke-linecap="round"/>
           <rect x="15" y="20" width="5" height="7" rx="1" fill="#0B2545"/>
           <rect x="23" y="18" width="5" height="7" rx="1" fill="#0B2545"/>
           <rect x="31" y="20" width="5" height="7" rx="1" fill="#0B2545"/>
           <path d="M10 23 L40 23" stroke="#E76F51" stroke-width="2" stroke-linecap="round"/>`
  },
  'pediatric-dentistry': {
    title: 'PEDIATRIC DENTAL CARE',
    icon: `<path d="M18 12 C20 8, 30 8, 32 12 C36 16, 36 22, 32 26 C30 29, 29 35, 27 35 C25 35, 25 29, 24 29 C23 29, 23 35, 21 35 C19 35, 18 29, 16 26 C12 22, 12 16, 18 12 Z" fill="none" stroke="#00A896" stroke-width="2"/>
           <circle cx="21" cy="17" r="1.5" fill="#028090"/>
           <circle cx="27" cy="17" r="1.5" fill="#028090"/>
           <path d="M21 21 Q24 25 27 21" stroke="#028090" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
  },
  'fractured-tooth': {
    title: 'FRACTURED TOOTH CARE',
    icon: `<path d="M16 8 C18 4, 32 4, 34 8 C38 12, 38 20, 34 24 C32 28, 31 36, 28 36 C26 36, 26 28, 25 28 C24 28, 24 36, 22 36 C19 36, 18 28, 16 24 C12 20, 12 12, 16 8 Z" fill="none" stroke="#00A896" stroke-width="2"/>
           <path d="M25 6 L23 13 L27 18 L25 26" stroke="#E63946" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
  },
  'smile-design': {
    title: 'SMILE DESIGNING',
    icon: `<path d="M10 20 Q25 36 40 20" stroke="#E76F51" stroke-width="3" fill="none" stroke-linecap="round"/>
           <path d="M14 20 Q25 30 36 20" stroke="#00A896" stroke-width="2" fill="#FFFFFF" stroke-linecap="round"/>
           <path d="M25 6 L27 10 L31 11 L27 12 L25 16 L23 12 L19 11 L23 10 Z" fill="#FFD166"/>`
  },
  'oral-surgery': {
    title: 'ORAL & CYSTIC SURGERY',
    icon: `<path d="M12 18 C12 10, 38 10, 38 18 C38 28, 25 38, 25 38 C25 38, 12 28, 12 18 Z" fill="none" stroke="#028090" stroke-width="2"/>
           <circle cx="25" cy="20" r="6" fill="#00A896" opacity="0.3"/>
           <circle cx="25" cy="20" r="6" fill="none" stroke="#00A896" stroke-width="1.5"/>
           <path d="M34 8 L28 14" stroke="#E76F51" stroke-width="2" stroke-linecap="round"/>`
  },
  'full-reconstruction': {
    title: 'FULL MOUTH RECONSTRUCTION',
    icon: `<path d="M8 26 C8 12, 42 12, 42 26" stroke="#0B2545" stroke-width="2.5" fill="none" stroke-linecap="round"/>
           <circle cx="14" cy="24" r="3" fill="#00A896"/>
           <circle cx="21" cy="20" r="3" fill="#00A896"/>
           <circle cx="29" cy="20" r="3" fill="#00A896"/>
           <circle cx="36" cy="24" r="3" fill="#00A896"/>
           <path d="M10 32 L40 32 M12 36 L38 36" stroke="#E76F51" stroke-width="2" stroke-linecap="round"/>`
  }
};

for (const [key, val] of Object.entries(items)) {
  const svg = createTreatmentSvg(val.title, val.icon);
  fs.writeFileSync(path.join(treatmentDir, `${key}.svg`), svg, 'utf8');
}

console.log('Successfully generated favicon and all 12 treatment illustration SVGs.');
