export function renderFaqPage() {
  const faqs = [
    {
      qEn: "What are the clinic working hours and closed days?",
      qBn: "ডেন্টাল প্যারাডাইসের ক্লিনিক খোলা ও বন্ধের সময়সূচী কী?",
      aEn: "The clinic is strictly CLOSED on Mondays and Fridays. We are OPEN on Tuesday, Wednesday, Thursday, Saturday, and Sunday with two daily shifts: Morning 8:00 AM – 12:00 PM and Evening 4:00 PM – 8:00 PM.",
      aBn: "সোমবার এবং শুক্রবার ক্লিনিক সম্পূর্ণ বন্ধ থাকে। মঙ্গলবার, বুধবার, বৃহস্পতিবার, শনিবার এবং রবিবার এই ৫ দিন ক্লিনিক খোলা থাকে: সকাল ৮:০০টা থেকে দুপুর ১২:০০টা এবং বিকাল ৪:০০টা থেকে রাত ৮:০০টা পর্যন্ত।"
    },
    {
      qEn: "Is Root Canal Treatment (RCT) painful?",
      qBn: "রুট ক্যানাল চিকিৎসা কি খুব কষ্টদায়ক বা ব্যথাজনক?",
      aEn: "No. With modern local anesthesia techniques and gentle endodontic procedures, Root Canal Treatment is virtually painless. Its purpose is to relieve severe tooth pain and preserve your natural tooth so you don't need extraction.",
      aBn: "একেবারেই না। আধুনিক এনেস্থেশিয়া প্রযুক্তির কারণে রুট ক্যানাল চিকিৎসা সম্পূর্ণ ব্যথাহীনভাবে সম্পন্ন করা হয়। এই চিকিৎসার মূল উদ্দেশ্যই হলো দাঁতের অসহ্য ব্যথা দূর করা এবং দাঁত না তুলে স্বাভাবিক রাখা।"
    },
    {
      qEn: "How does the appointment queue system work?",
      qBn: "অ্যাপয়েন্টমেন্ট কিউ (Queue) বা সিরিয়াল পদ্ধতি কীভাবে কাজ করে?",
      aEn: "When you book an appointment, you are assigned a designated Queue Number (#1, #2, #3...) for that date based on your selected time slot. This ensures orderly patient consultations without crowded waiting room delays.",
      aBn: "অনলাইনে অ্যাপয়েন্টমেন্ট বুকিং করার সাথে সাথে আপনার নির্বাচিত সময়ের ভিত্তিতে আপনাকে একটি কিউ নম্বর (#1, #2...) দেওয়া হয়। ক্লিনিকে পৌঁছানোর পর সিরিয়াল অনুযায়ী নির্বিঘ্নে চিকিৎসা গ্রহণ করতে পারবেন।"
    },
    {
      qEn: "How do I pay for my dental consultation or treatment?",
      qBn: "চিকিৎসার ফি কীভাবে পরিশোধ করতে হবে?",
      aEn: "Payment is made via Cash at Clinic upon your visit. We do not require any online advance payment to secure your appointment slot.",
      aBn: "ক্লিনিকে সরাসরি এসে 'ক্যাশ' বা নগদে চিকিৎসা ফি প্রদান করা যায়। অনলাইনে বুকিং করার সময় অগ্রিম কোনো পেমেন্টের প্রয়োজন নেই।"
    },
    {
      qEn: "Can I book an appointment on the same day?",
      qBn: "একই দিনে কি অ্যাপয়েন্টমেন্ট নেওয়া সম্ভব?",
      aEn: "Yes, same-day booking is allowed for open days (Tue, Wed, Thu, Sat, Sun) provided you select a future available slot with at least 30 minutes advance notice from the current time.",
      aBn: "হ্যাঁ, ক্লিনিক খোলা থাকার দিনে অন্তত ৩০ মিনিট আগের নোটিশে একই দিনের ভবিষ্যৎ খালি থাকা যেকোনো স্লটে বুকিং করা সম্ভব।"
    },
    {
      qEn: "Does teeth scaling weaken or damage natural enamel?",
      qBn: "স্কেলিং বা দাঁতের পাথর পরিষ্কার করলে কি দাঁত দুর্বল হয়ে যায়?",
      aEn: "No, this is a common myth. Ultrasonic scaling only breaks down hardened calculus and bacteria without abrading natural enamel. Scaling is essential to stop bleeding gums and prevent loose teeth from periodontitis.",
      aBn: "না, এটি একটি সম্পূর্ণ ভুল ধারণা। আল্ট্রাসনিক স্কেলিং কেবল দাঁতে জমে থাকা ক্ষতিকর শক্ত পাথর ও ব্যাকটেরিয়া দূর করে, এনামেলের কোনো ক্ষতি করে না। নিয়মিত স্কেলিং মাড়ি থেকে রক্ত পড়া বন্ধ করে এবং দাঁত অকালে পড়ে যাওয়া রোধ করে।"
    },
    {
      qEn: "Where is Dental Paradise clinic located?",
      qBn: "ডেন্টাল প্যারাডাইস ক্লিনিকটি কোথায় অবস্থিত?",
      aEn: "We are located at Math Chandipur, Chandipur Market area, just behind Life Care Diagnostic Center (PIN- 721659). Direct contact: 9733835105.",
      aBn: "ক্লিনিকটি অবস্থিত: মঠ চণ্ডীপুর, চণ্ডীপুর বাজার এলাকা, লাইফ কেয়ার ডায়াগনস্টিক সেন্টারের ঠিক পেছনে (পিন- ৭২১৬৫৯)। যোগাযোগের নম্বর: ৯৭৩৩৮৩৫১০৫।"
    }
  ];

  const faqItemsHtml = faqs.map((f, idx) => `
    <details style="background:#FFFFFF; border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; margin-bottom:1rem; box-shadow:var(--shadow-sm); cursor:pointer;" ${idx === 0 ? 'open' : ''}>
      <summary style="font-weight:700; font-size:1.05rem; color:var(--color-secondary); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span>${f.qEn}</span>
          <span class="bn-text" style="display:block; font-size:0.9rem; color:var(--color-primary); font-weight:600; margin-top:0.25rem;">${f.qBn}</span>
        </div>
        <span style="font-size:1.25rem; color:var(--color-primary);">▾</span>
      </summary>
      <div style="margin-top:1rem; border-top:1px solid var(--border-light); padding-top:1rem; font-size:0.95rem; color:var(--text-main); line-height:1.7;">
        <p style="margin-bottom:0.75rem;">${f.aEn}</p>
        <p class="bn-text" style="color:#028090; font-size:0.92rem; line-height:1.7;">${f.aBn}</p>
      </div>
    </details>
  `).join('');

  return `
    <div class="container section">
      <div class="section-header">
        <span class="section-tag">Help & Clarity</span>
        <h1 class="section-title">Frequently Asked Questions</h1>
        <p class="section-desc">
          Everything you need to know about our dental procedures, clinic hours, appointment queue, and treatments.
        </p>
      </div>

      <div style="max-width:820px; margin:0 auto;">
        ${faqItemsHtml}
      </div>

      <div style="text-align:center; margin-top:3.5rem;">
        <p style="color:var(--text-muted); margin-bottom:1rem;">Have a question that is not answered here?</p>
        <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
          <a href="https://wa.me/919733835105" target="_blank" class="btn btn-whatsapp">Ask on WhatsApp (9733835105)</a>
          <a href="/contact" class="btn btn-secondary">Contact Clinic</a>
        </div>
      </div>
    </div>
  `;
}
