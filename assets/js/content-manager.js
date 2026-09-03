/* ==========================================================================
   Content Manager & Data Store (Backend Integrated)
   Reads & Saves permanently to disk via Node.js Backend API
   ========================================================================== */

const DEFAULT_CV_DATA = {
  general: {
    name: "رجب رمضان محمد",
    fullNameEn: "Ragab Ramadan Mohamed Abdelrazik",
    jobTitle: "مشرف عام (General Foreman) - إنشاءات وحدادة ونجارة معمارية",
    yearsExp: "25",
    phone: "01094998289",
    whatsapp: "201094998289",
    birthDate: "28 / 11 / 1974",
    address: "29 ش عزبة عبيدو - الخصوص - القليوبية",
    maritalStatus: "متزوج (لديه 4 أولاد وبنتان)",
    militaryStatus: "إعفاء نهائي من الخدمة العسكرية",
    languages: "العربية (اللغة الأم) | الإنجليزية (مبادئ)",
    interests: "القراءة والتعلم والتطوير المهني المستمر",
    heroDesc: "خبرة ميدانية تتجاوز 25 عاماً في حصر واستلام حديد التسليح، الإشراف الشامل على بنود العزل والردم، وتوجيه أطقم العمل بحرفية عالية. حاصل على تقييم أداء رسمي ممتاز (90.75%) بشركة الاتحاد المصري للإنشاءات (El Hazek Construction).",
    profileImg: "assets/images/profile_portrait.jpg"
  },
  kpis: {
    employeeCode: "11041",
    projectName: "مشروع البروج (Burouj Site)",
    hireDate: "15/06/2022",
    totalScore: "90.75%",
    technicalScore: "92.5%",
    behavioralScore: "26% / 30%",
    safetyCompliance: "100%"
  },
  experiences: [
    {
      id: "exp-1",
      title: "مشرف عام (General Foreman)",
      company: "شركة الاتحاد المصري للإنشاءات - الحاذق (El Hazek Construction)",
      period: "تاريخ التعيين الرسمي: 15/06/2022 – حتى الآن",
      meta: "الكود الوظيفي: 11041 | موقع العمل: مشروع البروج (Burouj Site) | معدل التقييم النهائي (KPIs): 90.75% (أداء ممتاز)",
      duties: [
        "متابعة تنفيذ كافة الأعمال الإنشائية ومطابقتها لخطة التنفيذ وتعليمات المهندس المدني بنسبة 100% وبدون أي انحراف عن معايير الجودة.",
        "التنسيق التام وتأمين تشوين وصرف كافة خامات ومواد البناء لمقاولي الباطن بنسبة 100% وتجنب أي تأخيرات في الموقع.",
        "متابعة الالتزام بالجدول الزمني المحدد لمقاولي الباطن وتحت إشراف واستلام المهندس المدني.",
        "التنسيق المباشر مع مهندس القطاع لحركة المعدات بالموقع وتقليل نسبة التأخير الميداني إلى أقل من 5% (كفاءة 95%).",
        "استلام ومراجعة وإتمام أذونات صرف الخامات والمواد البنائية من مستودعات الشركة بدقة 100%.",
        "المسؤولية الكاملة عن تطبيق والتزام الجميع بإجراءات ومعايير السلامة والصحة المهنية والبيئة (HSE Procedures) بنسبة 100%."
      ]
    },
    {
      id: "exp-2",
      title: "مشرف حدادة ونجارة",
      company: "شركة سامكو الوطنية",
      period: "01/2017 – 12/2019",
      meta: "موقع العمل: مشروعات القليوبية والقاهرة",
      duties: [
        "حصر واستلام الكميات والميات الموردة للمشروع من حديد وخشب التسليح.",
        "متابعة تنفيذ بنود العزل المائي والحراري والردم ومطابقتها للمواصفات.",
        "تشغيل أطقم الحدادة والنجارة وضمان أعلى معدلات الإنتاجية والسلامة.",
        "المراجعة الدورية للمخزون وجرد الهياكل بانتظام."
      ]
    },
    {
      id: "exp-3",
      title: "مشرف حديد تسليح",
      company: "شركة بن لادن للمقاولات (المملكة العربية السعودية)",
      period: "03/1993 – 07/1998",
      meta: "مشروعات إنشائية ضخمة بالمملكة العربية السعودية",
      duties: [
        "الإشراف الميداني على أعمال حديد التسليح للمشاريع الكبرى والضخمة في المملكة.",
        "استلام أعمال التكسيح، الرص، والربط، ومطابقة الأقطار والمشابك مع اللوحات الرسمية.",
        "قيادة أطقم الحدادين، حصر الكميات اليومية، وضبط الجودة الفنية في جميع المواقع."
      ]
    },
    {
      id: "exp-4",
      title: "مشرف حديد تسليح",
      company: "رامو للمقاولات",
      period: "01/1990 – 03/1993",
      meta: "مشروعات المباني السكنية والخرسانات",
      duties: [
        "قراءة لوحات التسليح وحصر وتجهيز حديد التسليح لجميع الهياكل الخرسانية.",
        "توزيع وجدولة أعمال الحدادين والنجارين والتأكد من الدقة في التنفيذ.",
        "متابعة إجراءات السلامة وجودة المواد الخام والمستلزمات في الموقع."
      ]
    }
  ],
  skills: [
    { title: "حصر واستلام حديد التسليح", desc: "دقة عالية في قراءة اللوحات الإنشائية، ومراجعة أقطار وأطوال وأوزان الحديد ومطابقتها التامة مع الاستشارية.", percent: "98%" },
    { title: "الإشراف على العزل والردم", desc: "خبرة متخصصة في الإشراف على بنود العزل المائي والحراري للأساسات والردم الهندسي وفق معايير الجودة.", percent: "95%" },
    { title: "حساب الوزن هندسياً", desc: "القدرة على إجراء الحسابات الهندسية الدقيقة لأوزان الحديد والكميات المطلوبة لكل عنصر إنشائي.", percent: "92%" },
    { title: "إدارة وتوجيه العمالة", desc: "إدارة قيادية ممتازة لأطقم الحدادين والنجارين، توزيع المهام، ورفع كفاءة الإنتاج في الموقع.", percent: "96%" },
    { title: "ترتيب وجرد التشوينات", desc: "تنظيم ورص خامات الحديد والخشب بشكل آمن في الموقع ومتابعة الجرد الدوري لمنع الهدر والإسراف.", percent: "94%" },
    { title: "العمل تحت ضغط والالتزام", desc: "القدرة على التعامل مع المشروعات العاجلة وإنجاز الأعمال الخرسانية في الأوقات المحددة بكفاءة عالية.", percent: "97%" }
  ],
  education: {
    degree: "دبلوم صنايع - قسم منشآت معمارية",
    year: "1993",
    desc: "تخصص متكامل في أساسيات المنشآت المعمارية، رسم وتنفيذ الهياكل الخرسانية وقراءة الخرائط الهندسية."
  },
  gallery: [
    { id: "g-1", src: "assets/images/site_work.jpg", title: "الموقع الإنشائي الميداني", desc: "الإشراف على تنفيذ المباني السكنية بالسترة والخوذة" },
    { id: "g-2", src: "assets/images/profile_portrait.jpg", title: "الملف الشخصي الرسمي", desc: "رجب رمضان محمد - مشرف أول إنشاءات" },
    { id: "g-3", src: "assets/images/profile_casual1.jpg", title: "اجتماعات ولقاءات العمل", desc: "لقاءات مهنية ومناقشات المشروعات" },
    { id: "g-4", src: "assets/images/profile_casual2.jpg", title: "صورة ميدانية", desc: "المهندس رجب رمضان محمد" }
  ]
};

// Fetch data from server API or fallback to localStorage
async function getCVDataAsync() {
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('cv_data_store', JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn("Backend API not reachable, falling back to localStorage.");
  }
  const saved = localStorage.getItem('cv_data_store');
  return saved ? JSON.parse(saved) : DEFAULT_CV_DATA;
}

// Synchronous wrapper
function getCVData() {
  const saved = localStorage.getItem('cv_data_store');
  return saved ? JSON.parse(saved) : DEFAULT_CV_DATA;
}

// Save data permanently to Backend Disk + LocalStorage
async function saveCVData(data) {
  localStorage.setItem('cv_data_store', JSON.stringify(data));
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      console.log("Successfully saved permanently to server data.json!");
    }
  } catch (e) {
    console.error("Error saving to backend API:", e);
  }
}

// Save uploaded image file permanently to server disk assets/images/
async function uploadImageToServer(fileName, base64Data) {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, base64Data })
    });
    if (res.ok) {
      const result = await res.json();
      return result.imagePath;
    }
  } catch (e) {
    console.error("Error uploading image to server:", e);
  }
  return base64Data; // fallback to base64 string if server fails
}

// Reset data
async function resetCVData() {
  localStorage.setItem('cv_data_store', JSON.stringify(DEFAULT_CV_DATA));
  await saveCVData(DEFAULT_CV_DATA);
  return DEFAULT_CV_DATA;
}

// Render dynamic data onto index.html
async function applyDataToWebsite() {
  const data = await getCVDataAsync();
  const g = data.general;
  const k = data.kpis;

  // General fields
  const elName = document.querySelectorAll('.bind-name');
  elName.forEach(el => el.textContent = g.name);

  const elJob = document.querySelectorAll('.bind-job');
  elJob.forEach(el => el.textContent = g.jobTitle);

  const elExp = document.querySelectorAll('.bind-exp');
  elExp.forEach(el => el.textContent = `+${g.yearsExp} سنة`);

  const elExpText = document.querySelectorAll('.bind-exp-badge');
  elExpText.forEach(el => el.textContent = `خبرة تتجاوز ${g.yearsExp} عاماً في موقع البناء`);

  const elHeroDesc = document.querySelector('.bind-hero-desc');
  if (elHeroDesc) elHeroDesc.textContent = g.heroDesc;

  const elPhone = document.querySelectorAll('.bind-phone');
  elPhone.forEach(el => el.textContent = g.phone);

  const elTelLink = document.querySelectorAll('.bind-tel-link');
  elTelLink.forEach(el => el.setAttribute('href', `tel:${g.phone}`));

  const elWaLink = document.querySelectorAll('.bind-wa-link');
  elWaLink.forEach(el => el.setAttribute('href', `https://wa.me/${g.whatsapp}`));

  const elBirth = document.querySelector('.bind-birth');
  if (elBirth) elBirth.textContent = g.birthDate;

  const elAddress = document.querySelector('.bind-address');
  if (elAddress) elAddress.textContent = g.address;

  const elMarital = document.querySelector('.bind-marital');
  if (elMarital) elMarital.textContent = g.maritalStatus;

  const elMilitary = document.querySelector('.bind-military');
  if (elMilitary) elMilitary.textContent = g.militaryStatus;

  const elLang = document.querySelector('.bind-languages');
  if (elLang) elLang.textContent = g.languages;

  const elInterests = document.querySelector('.bind-interests');
  if (elInterests) elInterests.textContent = g.interests;

  // Hero profile image
  const elHeroImg = document.querySelector('.bind-hero-img');
  if (elHeroImg && g.profileImg) {
    elHeroImg.src = g.profileImg;
  }

  // KPIs Bindings
  const elKpiTotal = document.querySelectorAll('.bind-kpi-total');
  elKpiTotal.forEach(el => el.textContent = k.totalScore);

  // Render Experiences with Scroll Reveal from Right
  const timelineContainer = document.getElementById('bind-timeline');
  if (timelineContainer && data.experiences) {
    timelineContainer.innerHTML = data.experiences.map((exp, idx) => `
      <div class="timeline-item reveal-right delay-${(idx % 4 + 1) * 100} ${idx === 0 ? 'active' : ''}">
        <div class="timeline-dot">
          <i class="fa-solid ${idx === 0 ? 'fa-building' : 'fa-trowel-bricks'}"></i>
        </div>
        <div class="timeline-content">
          <div class="timeline-header">
            <div>
              <h3 class="job-title">${exp.title}</h3>
              <div class="company-name">
                <i class="fa-solid fa-city"></i>
                <span>${exp.company}</span>
              </div>
            </div>
            <span class="job-date">${exp.period}</span>
          </div>
          <div class="timeline-body">
            ${exp.meta ? `<p style="font-size: 0.9rem; color: var(--secondary-color); font-weight: 700; margin-bottom: 0.75rem;"><i class="fa-solid fa-clipboard-check"></i> ${exp.meta}</p>` : ''}
            <ul>
              ${exp.duties.map(d => `<li>${d}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Skills with Staggered Up Reveal and Animated Progress Bars
  const skillsContainer = document.getElementById('bind-skills');
  if (skillsContainer && data.skills) {
    skillsContainer.innerHTML = data.skills.map((skill, idx) => `
      <div class="skill-card reveal-up delay-${(idx % 3 + 1) * 100}">
        <div class="skill-header">
          <div class="skill-icon">
            <i class="fa-solid fa-ruler-combined"></i>
          </div>
          <div class="skill-title">${skill.title}</div>
        </div>
        <p class="skill-desc">${skill.desc}</p>
        <div class="skill-progress-bar">
          <div class="skill-progress-fill" style="width: 0%;" data-width="${skill.percent}"></div>
        </div>
      </div>
    `).join('');
  }

  // Render Gallery as Infinite Train Carousel (3 copies for seamless RAF marquee)
  const galleryContainer = document.getElementById('bind-gallery');
  if (galleryContainer && data.gallery) {
    const createItem = (item, copy) => `
      <div class="gallery-item" data-img="${item.src}" data-copy="${copy}">
        <img src="${item.src}" alt="${item.title}" loading="eager">
        <div class="gallery-zoom-icon">
          <i class="fa-solid fa-magnifying-glass-plus"></i>
        </div>
        <div class="gallery-overlay">
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
        </div>
      </div>`;
    
    // 3 copies to fill viewport, JS RAF will recycle items continuously
    galleryContainer.innerHTML = data.gallery.map(i => createItem(i, 1)).join('')
      + data.gallery.map(i => createItem(i, 2)).join('')
      + data.gallery.map(i => createItem(i, 3)).join('');
  }

  // Re-bind Lightbox & Re-observe dynamic elements with Scroll Reveal Engine
  if (window.bindLightboxEvents) window.bindLightboxEvents();
  if (window.reobserveScrollReveals) window.reobserveScrollReveals();
}

// Auto-run on index.html load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyDataToWebsite);
} else {
  applyDataToWebsite();
}
