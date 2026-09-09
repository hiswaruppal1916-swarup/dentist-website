# Dental Paradise — A Complete Oral & Dental Care

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-00A896?style=for-the-badge&logo=pwa)](https://dentalparadise.in)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20RLS-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Firebase](https://img.shields.io/badge/Firebase-FCM%20Push-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)

A modern, full-stack, production-grade Progressive Web App (PWA) and clinical appointment booking platform for **Dental Paradise**, founded by **Dr. Supriyo Sahu (B.D.S. Hons, W.B.U.H.S.)** in Math Chandipur, West Bengal.

---

## 👨‍⚕️ Clinical Leadership & Doctor Credentials

- **Lead Dental Surgeon**: **Dr. Supriyo Sahu**
- **Qualifications**: **B.D.S. (Hons), W.B.U.H.S. (Kolkata)**
- **Former House Surgeon**:
  - **Dr. R. Ahmed Dental College & Hospital, Kolkata** (Asia’s oldest dental college)
  - **Medical College Hospital, Kolkata**
- **Specialized Clinical Departments**:
  - Department of Oral & Maxillofacial Surgery
  - Department of Conservative Dentistry & Endodontics
  - Department of Prosthodontia, Crown & Bridge
- **Clinic Address**: Math Chandipur, Chandipur Market, Behind Life Care Diagnostic Center, PIN- 721659
- **Phone / WhatsApp**: `9733835105`

---

## 🕒 Clinic Consultation Schedule

Online booking and clinic consultations are strictly scheduled:

| Day | Status | Morning Hours | Evening Hours |
|---|---|---|---|
| **Monday** | **CLOSED** | No Consultations | No Consultations |
| **Tuesday** | **OPEN** | 8:00 AM – 12:00 PM | 4:00 PM – 8:00 PM |
| **Wednesday** | **OPEN** | 8:00 AM – 12:00 PM | 4:00 PM – 8:00 PM |
| **Thursday** | **OPEN** | 8:00 AM – 12:00 PM | 4:00 PM – 8:00 PM |
| **Friday** | **CLOSED** | No Consultations | No Consultations |
| **Saturday** | **OPEN** | 8:00 AM – 12:00 PM | 4:00 PM – 8:00 PM |
| **Sunday** | **OPEN** | 8:00 AM – 12:00 PM | 4:00 PM – 8:00 PM |

*Enforced both on frontend interactive slot generator and backend database triggers.*

---

## ✨ Features

- **Painless Dental Treatments**: 12 normalized clinical treatments featuring full English & Bengali (বাংলা) explanations, symptoms, procedure steps, and custom SVG illustrations.
- **30-Minute Slot Booking Engine**: Live slot availability with same-day notice enforcement (minimum 30 minutes in advance).
- **Zero Double-Booking Guarantee**: Protected via Supabase PostgreSQL partial unique indexes.
- **Daily Queue Number Assignment**: Patients receive a real-time queue position (`#1`, `#2`, `#3`...) based on appointment time.
- **Cash at Clinic**: Transparent payment model with no advance payment barriers.
- **Patient Privacy Isolation**: Secured through Row Level Security (RLS) — patients can only inspect their own records with their Appointment ID + Phone number.
- **Doctor & Staff Portal (`/admin`)**: Google Sign-In with server-side authorization check against authorized staff emails, today's queue metrics, date filters, and appointment lifecycle controls (Accept, Reject, Arrived, In Consultation, Complete).
- **Push Notifications (FCM)**: Cross-device push notifications and in-app alerts with the clinic favicon.
- **Progressive Web App (PWA)**: Installable on Desktop, Android, and iOS with offline shell caching (`sw.js`).
- **SEO & Local SEO**: Rich structured data (`Dentist`, `MedicalBusiness`, `Person` JSON-LD), `sitemap.xml`, `robots.txt`, and Google Search Console placeholder.

---

## 🦷 12 Normalized Treatments

1. **Root Canal Treatment** (রুট ক্যানাল ট্রিটমেন্ট)
2. **Impaction & Wisdom Tooth Surgery** (ইমপ্যাকশন ও উইজডম দাঁত সার্জারি)
3. **Painless Tooth Extraction** (ব্যথাহীন দাঁত তোলা)
4. **Crown & Bridge / Removable & Fixed Prosthesis** (ক্রাউন ও ব্রিজ / কৃত্রিম দাঁত)
5. **Scaling & Teeth Polishing** (দাঁতের স্কেলিং ও পলিশিং)
6. **Restoration & Tooth-Colored Fillings** (দাঁতের ফিলিং ও রেস্টোরেশন)
7. **Orthodontic Treatment (Braces & Aligners)** (দাঁতের তার বা অর্থোডন্টিক চিকিৎসা)
8. **Pediatric Oral & Dental Care** (শিশুদের দাঁতের বিশেষ যত্ন)
9. **Fractured Teeth & Dental Trauma Care** (ভাঙা দাঁত ও ট্রমা চিকিৎসা)
10. **Cosmetic Dentistry & Smile Designing** (কসমেটিক ডেন্টিস্ট্রি ও স্মাইল ডিজাইনিং)
11. **Minor Oral Surgery & Cystic Surgery** (মাইনর ওরাল সার্জারি ও সিস্ট সার্জারি)
12. **Full Mouth Reconstruction & Bone Grafting** (ফুল মাউথ রিকনস্ট্রাকশন)

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES Modules), Custom Responsive Medical Design System CSS
- **Backend & Database**: Supabase PostgreSQL, Row Level Security (RLS), Stored Procedures & Triggers
- **Notifications**: Firebase Cloud Messaging (FCM) & Web Push
- **Tooling**: Vite, Service Worker API, PWA Manifest

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/hiswaruppal1916-swarup/Dental-Paradise.git
cd Dental-Paradise
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

---

## 📜 Medical Disclaimer
Information provided on this platform is for general patient educational purposes only. Treatment suitability can only be determined after an in-person dental examination by the doctor.

---

© 2026 Dental Paradise. All rights reserved.
