// Basic site config - edit these to customize your store info
const SITE = {
  name: "TOKO KURDI MOTOR",
  phoneIntl: "6287817133172", // ganti ke nomor WhatsApp (format internasional, tanpa +)
  phoneDisplay: "+62 878-1713-3172", // teks yang ditampilkan
  address: "Jl. Raya Babadan, Karangwuni, Demangharjo, Kec. Warureja, Kabupaten Tegal, Jawa Tengah 52183",
  hours: "Buka 24 jam",
  mapsQuery: "Jl. Raya Babadan, Karangwuni, Demangharjo, Kec. Warureja, Kabupaten Tegal, Jawa Tengah 52183", // dipakai untuk embed peta
  mapsUrl: "https://maps.app.goo.gl/4JvsAFLxmq36jreW6", // dipakai untuk tombol peta
  // Set ke file logo Anda. Jika nanti diganti ke 'assets/img/logo.png', tinggal ubah properti ini saja.
  logo: "assets/img/logo.png", // ditemukan di folder: perhatikan ada dua ekstensi
  // Opsi peta yang lebih presisi:
  // 1) Pakai URL Embed penuh dari Google Maps (Share > Embed a map > Copy HTML, ambil nilai src)
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d588.8302204795469!2d109.3209819095382!3d-6.871211035307601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fc57aa3a116b7%3A0xa011b4b92629b74e!2sTOKO%20KURDI%20MOTOR!5e0!3m2!1sen!2sid!4v1756529955344!5m2!1sen!2sid", // embed Google Maps
  // 2) Atau pakai koordinat (lat, lng). Jika diisi, embed memakai koordinat ini.
  mapsLat: null, // contoh: -6.921234
  mapsLng: null, // contoh: 109.142345
  // Opsi ikon fitur (jika file ada, akan dipakai menggantikan SVG default)
  featureIcons: {
    servis: "assets/img/icons/servis.png", // Servis Lengkap
    onderdil: "assets/img/icons/onderdil-terpercaya.png", // Onder1dil Terpercaya
    cepat: "assets/img/icons/cepat-transparan.png", // Cepat & Transparan
  }
};

// Translations (no network fetch to avoid local file CORS issues)
const translations = {
  id: {
    "brand.name": "TOKO KURDI MOTOR",
    "nav.home": "Beranda",
    "nav.services": "Layanan",
    "nav.products": "Produk",
    "nav.gallery": "Galeri",
    "nav.about": "Tentang",
    "nav.contact": "Kontak",
    "nav.whatsapp": "WhatsApp",

    "hero.title": "Sparepart Mobil & Bengkel Profesional",
    "hero.subtitle": "Satu tempat untuk onderdil berkualitas dan servis mobil tepercaya.",
    "hero.cta_primary": "Chat WhatsApp",
    "hero.cta_secondary": "Lihat Layanan",
    "hero.points.genuine": "Pilihan onderdil original & aftermarket terkurasi",
    "hero.points.warranty": "Garansi servis & aftersales jelas",
    "hero.points.experienced": "Mekanik berpengalaman & peralatan modern",
    "hero.quick.title": "Butuh cepat?",
    "hero.quick.desc": "Klik tombol di bawah untuk booking servis atau tanya stok.",
    "hero.quick.button": "Booking / Tanya Stok",

    "hours.title": "Jam Operasional",

    "features.title": "Mengapa TOKO KURDI MOTOR?",
    "features.items.services.title": "Servis Lengkap",
    "features.items.services.desc": "Tune-up, ganti oli, rem, AC, balancing, spooring, dan lainnya.",
    "features.items.parts.title": "Onder­dil Terpercaya",
    "features.items.parts.desc": "Original dan aftermarket pilihan dengan garansi toko.",
    "features.items.fast.title": "Cepat & Transparan",
    "features.items.fast.desc": "Estimasi jelas, proses rapi, komunikasi mudah.",

    "testimonials.title": "Apa kata pelanggan",
    "testimonials.q1": "Pelayanan ramah, harga jelas, mobil jadi lebih enak dibawa.",
    "testimonials.q2": "Cari sparepart gampang, stok lengkap. Rekomendasi!",

    "cta.title": "Siap servis atau tanya stok?",
    "cta.subtitle": "Klik tombol untuk terhubung via WhatsApp sekarang.",
    "cta.button": "Chat WhatsApp",

    "footer.tagline": "Sparepart mobil dan bengkel tepercaya di kota Anda.",
    "footer.links.title": "Tautan",
    "footer.contact.title": "Kontak",
    "footer.rights": "Seluruh hak cipta.",
    
    "gallery.title": "Galeri",
    "gallery.subtitle": "Dokumentasi pekerjaan bengkel dan stok onderdil.",
    "gallery.cta.title": "Ingin lihat lebih banyak?",
    "gallery.cta.subtitle": "Kirim kebutuhan Anda, kami kirim contoh/portofolio terkait.",

    "services.title": "Layanan Bengkel",
    "services.subtitle": "Servis lengkap dengan mekanik berpengalaman dan garansi pekerjaan.",
    "services.items.tuneup.title": "Tune‑up & General Check",
    "services.items.tuneup.desc": "Inspeksi menyeluruh, cek sistem, dan penyetelan untuk performa optimal.",
    "services.items.oil.title": "Ganti Oli & Filter",
    "services.items.oil.desc": "Oli berkualitas, filter orisinil/aftermarket, sesuai rekomendasi pabrik.",
    "services.items.brake.title": "Sistem Rem",
    "services.items.brake.desc": "Kampas, cakram, minyak rem, bleeding, dan pengecekan menyeluruh.",
    "services.items.ac.title": "AC Mobil",
    "services.items.ac.desc": "Cek kebocoran, tambah freon, kompresor, cleaning evaporator & blower.",
    "services.items.susp.title": "Suspensi & Kaki‑kaki",
    "services.items.susp.desc": "Shockbreaker, bushing, tie rod, ball joint, spooring & balancing.",
    "services.items.electrical.title": "Kelistrikan & Diagnostik",
    "services.items.electrical.desc": "Scan OBD, aki, alternator, starter, dan problem kelistrikan lain.",
    "services.cta.title": "Ingin booking servis?",
    "services.cta.subtitle": "Hubungi kami via WhatsApp untuk jadwal dan estimasi.",

    "products.title": "Produk & Kategori",
    "products.subtitle": "Onder­dil original dan aftermarket pilihan. Tanya stok via WhatsApp.",
    "products.items.filters.title": "Filter & Pelumas",
    "products.items.filters.desc": "Oli mesin, ATF, coolant, filter oli/udara/kabin.",
    "products.items.brake.title": "Sistem Rem",
    "products.items.brake.desc": "Kampas rem, cakram, master, minyak rem, flexible hose.",
    "products.items.susp.title": "Suspensi & Kaki‑kaki",
    "products.items.susp.desc": "Shockbreaker, ball joint, tie rod, bushing, arm.",
    "products.items.electrical.title": "Kelistrikan",
    "products.items.electrical.desc": "Aki, alternator, starter, bohlam, sensor, sekering.",
    "products.items.engine.title": "Mesin",
    "products.items.engine.desc": "Belt, gasket, waterpump, timing kit, busi, coil.",
    "products.items.ac.title": "AC & Pendingin",
    "products.items.ac.desc": "Kompresor, kondensor, evaporator, expansion valve.",
    "products.cta.title": "Cari part tertentu?",
    "products.cta.subtitle": "Kirim nama/part number via WhatsApp, kami bantu cek.",

    "about.title": "Tentang TOKO KURDI MOTOR",
    "about.subtitle": "Sejak awal, fokus kami adalah keamanan, kejujuran, dan kualitas.",
    "about.story.title": "Cerita Kami",
    "about.story.p1": "Toko Kurdi Motor hadir untuk memudahkan pemilik mobil mendapatkan onderdil berkualitas serta layanan bengkel yang transparan dan profesional.",
    "about.story.p2": "Kami mengutamakan komunikasi yang jelas dan solusi yang tepat, sehingga mobil Anda kembali prima dengan biaya yang wajar.",
    "about.values.title": "Nilai Utama",
    "about.values.quality": "Kualitas produk & pekerjaan",
    "about.values.honesty": "Kejujuran & transparansi",
    "about.values.speed": "Kecepatan & ketepatan",
    "about.values.care": "Perhatian pada detail",
    "about.location.title": "Lokasi Kami",

    "contact.title": "Hubungi Kami",
    "contact.subtitle": "Kami siap membantu kebutuhan servis dan onderdil Anda.",
    "contact.card.title": "Info Kontak",
    "contact.map": "Lihat Peta",
    "contact.form.title": "Kirim Pertanyaan",
    "contact.form.name": "Nama",
    "contact.form.phone": "No. WhatsApp",
    "contact.form.message": "Pesan",
    "contact.form.submit": "Kirim via WhatsApp",
    "contact.form.help": "Form ini akan membuka WhatsApp dengan pesan otomatis.",
    "contact.form.name_ph": "Nama Anda",
    "contact.form.phone_ph": "08xxxxxxxxxx",
    "contact.form.message_ph": "Tulis kebutuhan Anda",
  },
  en: {
    "brand.name": "TOKO KURDI MOTOR",
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.products": "Products",
    "nav.gallery": "Gallery",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.whatsapp": "WhatsApp",

    "hero.title": "Professional Auto Parts & Workshop",
    "hero.subtitle": "One place for quality parts and trusted car service.",
    "hero.cta_primary": "Chat on WhatsApp",
    "hero.cta_secondary": "View Services",
    "hero.points.genuine": "Curated genuine & aftermarket parts",
    "hero.points.warranty": "Clear service warranty & aftersales",
    "hero.points.experienced": "Experienced mechanics & modern tools",
    "hero.quick.title": "In a hurry?",
    "hero.quick.desc": "Tap below to book a service or ask for stock.",
    "hero.quick.button": "Book / Ask Stock",

    "hours.title": "Opening Hours",

    "features.title": "Why TOKO KURDI MOTOR?",
    "features.items.services.title": "Full Services",
    "features.items.services.desc": "Tune-up, oil change, brakes, AC, balancing, alignment, more.",
    "features.items.parts.title": "Trusted Parts",
    "features.items.parts.desc": "Genuine and selected aftermarket with store warranty.",
    "features.items.fast.title": "Fast & Transparent",
    "features.items.fast.desc": "Clear estimates, neat process, easy communication.",

    "testimonials.title": "What customers say",
    "testimonials.q1": "Friendly service, clear price, car feels better to drive.",
    "testimonials.q2": "Parts are easy to find, complete stock. Recommended!",

    "cta.title": "Ready to service or check stock?",
    "cta.subtitle": "Tap the button to connect via WhatsApp now.",
    "cta.button": "Chat on WhatsApp",

    "footer.tagline": "Trusted auto parts and workshop in your city.",
    "footer.links.title": "Links",
    "footer.contact.title": "Contact",
    "footer.rights": "All rights reserved.",
    
    "gallery.title": "Gallery",
    "gallery.subtitle": "Workshop work and parts stock documentation.",
    "gallery.cta.title": "Want to see more?",
    "gallery.cta.subtitle": "Tell us your needs and we’ll share relevant samples/portfolio.",

    "services.title": "Workshop Services",
    "services.subtitle": "Complete services by experienced mechanics with workmanship warranty.",
    "services.items.tuneup.title": "Tune‑up & General Check",
    "services.items.tuneup.desc": "Full inspection, system checks, and adjustments for optimal performance.",
    "services.items.oil.title": "Oil & Filter Change",
    "services.items.oil.desc": "Quality oils, genuine/aftermarket filters per manufacturer specs.",
    "services.items.brake.title": "Brake System",
    "services.items.brake.desc": "Pads, rotors, brake fluid, bleeding, and full inspection.",
    "services.items.ac.title": "Car AC",
    "services.items.ac.desc": "Leak test, refrigerant, compressor, evaporator & blower cleaning.",
    "services.items.susp.title": "Suspension & Steering",
    "services.items.susp.desc": "Shocks, bushings, tie rod, ball joint, alignment & balancing.",
    "services.items.electrical.title": "Electrical & Diagnostics",
    "services.items.electrical.desc": "OBD scan, battery, alternator, starter, and other electrical issues.",
    "services.cta.title": "Want to book a service?",
    "services.cta.subtitle": "Contact us via WhatsApp for schedule and estimate.",

    "products.title": "Products & Categories",
    "products.subtitle": "Selected genuine and aftermarket parts. Ask stock via WhatsApp.",
    "products.items.filters.title": "Filters & Lubricants",
    "products.items.filters.desc": "Engine oil, ATF, coolant, oil/air/cabin filters.",
    "products.items.brake.title": "Brake System",
    "products.items.brake.desc": "Brake pads, rotors, master, brake fluid, flexible hose.",
    "products.items.susp.title": "Suspension & Steering",
    "products.items.susp.desc": "Shocks, ball joint, tie rod, bushings, arms.",
    "products.items.electrical.title": "Electrical",
    "products.items.electrical.desc": "Battery, alternator, starter, bulbs, sensors, fuses.",
    "products.items.engine.title": "Engine",
    "products.items.engine.desc": "Belts, gaskets, water pump, timing kit, spark plugs, coil.",
    "products.items.ac.title": "AC & Cooling",
    "products.items.ac.desc": "Compressor, condenser, evaporator, expansion valve.",
    "products.cta.title": "Looking for a specific part?",
    "products.cta.subtitle": "Send the name/part number via WhatsApp and we will check.",

    "about.title": "About TOKO KURDI MOTOR",
    "about.subtitle": "From day one, we focus on safety, honesty, and quality.",
    "about.story.title": "Our Story",
    "about.story.p1": "We help car owners get quality parts and a professional, transparent workshop service.",
    "about.story.p2": "We value clear communication and the right solution so your car runs great at a fair cost.",
    "about.values.title": "Core Values",
    "about.values.quality": "Quality products & workmanship",
    "about.values.honesty": "Honesty & transparency",
    "about.values.speed": "Speed & accuracy",
    "about.values.care": "Attention to detail",
    "about.location.title": "Our Location",

    "contact.title": "Contact Us",
    "contact.subtitle": "We are ready to help with your service and parts needs.",
    "contact.card.title": "Contact Info",
    "contact.map": "Open Map",
    "contact.form.title": "Send an Inquiry",
    "contact.form.name": "Name",
    "contact.form.phone": "WhatsApp No.",
    "contact.form.message": "Message",
    "contact.form.submit": "Send via WhatsApp",
    "contact.form.help": "This form opens WhatsApp with a pre-filled message.",
    "contact.form.name_ph": "Your name",
    "contact.form.phone_ph": "08xxxxxxxxxx",
    "contact.form.message_ph": "Type your request",
  }
};

// Gallery config: add your images here
// Example item: { src: 'assets/img/gallery/bengkel-1.jpg', alt: { id: 'Servis rem', en: 'Brake service' } }
const GALLERY = [
  { src: 'assets/img/IMG_20250624_115846.jpg', alt: { id: 'Dokumentasi bengkel', en: 'Workshop documentation' } },
  { src: 'assets/img/IMG_20250824_090239.jpg', alt: { id: 'Dokumentasi bengkel', en: 'Workshop documentation' } },
  { src: 'assets/img/IMG_20250824_090334.jpg', alt: { id: 'Dokumentasi bengkel', en: 'Workshop documentation' } },
  { src: 'assets/img/IMG_20250824_090344.jpg', alt: { id: 'Dokumentasi bengkel', en: 'Workshop documentation' } },
  { src: 'assets/img/IMG_20250825_224829.jpg', alt: { id: 'Dokumentasi bengkel', en: 'Workshop documentation' } },
  { src: 'assets/img/IMG_20250825_224944.jpg', alt: { id: 'Dokumentasi bengkel', en: 'Workshop documentation' } },
  { src: 'assets/img/IMG_20250825_225031.jpg', alt: { id: 'Dokumentasi bengkel', en: 'Workshop documentation' } },
  { src: 'assets/img/IMG_20250825_225120.jpg', alt: { id: 'Dokumentasi bengkel', en: 'Workshop documentation' } },
];

function setYear() {
  const el = document.getElementById('yearNow');
  if (el) el.textContent = String(new Date().getFullYear());
}

function buildWaLink(text = "") {
  const base = `https://wa.me/${SITE.phoneIntl}`;
  const msg = text ? `?text=${encodeURIComponent(text)}` : "";
  return base + msg;
}

function applyContactInfo() {
  const phoneEls = document.querySelectorAll('#phoneText');
  phoneEls.forEach(a => { a.textContent = SITE.phoneDisplay; a.href = buildWaLink(); });
  const addr = document.getElementById('addressText');
  if (addr) addr.textContent = SITE.address;
  const h1 = document.getElementById('hoursText');
  if (h1) h1.textContent = SITE.hours;
  const h2 = document.getElementById('hoursTextFoot');
  if (h2) h2.textContent = SITE.hours;
  const mapBtn = document.getElementById('mapBtn');
  if (mapBtn) {
    if (SITE.mapsUrl && SITE.mapsUrl.trim()) {
      mapBtn.href = SITE.mapsUrl;
    } else if (typeof SITE.mapsLat === 'number' && typeof SITE.mapsLng === 'number') {
      mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${SITE.mapsLat},${SITE.mapsLng}`;
    } else {
      mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;
    }
  }
  const mapFrame = document.getElementById('mapFrame');
  if (mapFrame) {
    let src;
    if (SITE.mapEmbedUrl && SITE.mapEmbedUrl.includes('google.com/maps')) {
      src = SITE.mapEmbedUrl;
    } else if (typeof SITE.mapsLat === 'number' && typeof SITE.mapsLng === 'number') {
      src = `https://www.google.com/maps?q=${SITE.mapsLat},${SITE.mapsLng}&z=17&output=embed`;
    } else {
      src = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&z=16&output=embed`;
    }
    mapFrame.src = src;
  }
}

function wireWhatsAppButtons() {
  const waTop = document.getElementById('waTop');
  const waHero = document.getElementById('waHero');
  const waQuick = document.getElementById('waQuick');
  const waCta = document.getElementById('waCta');
  const defaultMsg = `Halo ${SITE.name}, saya ingin bertanya/booking.`;
  const link = buildWaLink(defaultMsg);
  [waTop, waHero, waQuick, waCta].forEach(btn => { if (btn) btn.href = link; });
}

function applyLogo() {
  const imgs = document.querySelectorAll('img.logo');
  if (!imgs.length) return;
  const candidates = [];
  if (SITE.logo) candidates.push(SITE.logo);
  // common alternatives (case differences or double extension)
  candidates.push('assets/img/logo.png', 'assets/img/LOGO.PNG', 'assets/img/logo.png.png');

  imgs.forEach(img => {
    let i = 0;
    const tryNext = () => {
      if (i >= candidates.length) return;
      const src = encodeURI(candidates[i++]);
      img.onerror = () => {
        console.warn('Logo not found, trying next:', src);
        tryNext();
      };
      img.src = src;
    };
    tryNext();
  });
}

function wireContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !phone || !message) { alert('Lengkapi semua kolom.'); return; }
    const text = `Halo ${SITE.name}.\nNama: ${name}\nNo: ${phone}\nPesan: ${message}`;
    window.open(buildWaLink(text), '_blank');
  });
}

function wireMenu() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
}

// i18n engine
function setText(el, value) {
  if (el) el.textContent = value;
}

function applyI18n(lang) {
  const dict = translations[lang] || translations.id;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && dict[key]) setText(el, dict[key]);
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const parts = el.getAttribute('data-i18n-attr').split(':');
    const attr = parts[0];
    const key = parts[1];
    const dictVal = dict[key];
    if (attr && key && dictVal) el.setAttribute(attr, dictVal);
  });
  const langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.textContent = (lang === 'id') ? 'ID ▾' : 'EN ▾';
  document.documentElement.lang = lang;
}

function getLang() {
  return localStorage.getItem('lang') || 'id';
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
  applyI18n(lang);
  renderGallery();
}

function wireLangToggle() {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = getLang();
    const next = current === 'id' ? 'en' : 'id';
    setLang(next);
  });
}

function init() {
  setYear();
  applyContactInfo();
  applyLogo();
  wireWhatsAppButtons();
  wireContactForm();
  wireMenu();
  wireLangToggle();
  applyI18n(getLang());
  renderGallery();
  applyFeatureIcons();
}

document.addEventListener('DOMContentLoaded', init);

// Render gallery items into #galleryGrid
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const lang = getLang();
  grid.innerHTML = '';
  GALLERY.forEach(item => {
    const img = document.createElement('img');
    img.src = item.src;
    img.loading = 'lazy';
    if (item.alt) {
      img.alt = typeof item.alt === 'string' ? item.alt : (item.alt[lang] || item.alt.id || 'Galeri');
    } else {
      img.alt = 'Galeri';
    }
    grid.appendChild(img);
  });
}

// Replace default SVG icons with custom images when available
function applyFeatureIcons() {
  if (!SITE.featureIcons) return;
  document.querySelectorAll('[data-icon]').forEach(el => {
    const key = el.getAttribute('data-icon');
    const src = SITE.featureIcons[key];
    if (!src) return;
    const img = new Image();
    img.loading = 'lazy';
    img.className = 'icon icon-img';
    img.alt = key;
    img.onload = () => {
      // Only swap when the image is loadable
      img.src = src;
      el.replaceWith(img);
    };
    img.onerror = () => {
      // keep default SVG mask icon
      console.warn('Custom icon not found or failed to load:', src);
    };
    // trigger load
    img.src = src;
  });
}
