// Lightweight product renderer (keeps main.js untouched)
(function(){
  const FALLBACK_PHONE = '6287817133172';
  const getLang = () => {
    try { return localStorage.getItem('lang') || 'id'; } catch { return 'id'; }
  };
  const getPhone = () => {
    try { return (typeof SITE !== 'undefined' && SITE.phoneIntl) ? SITE.phoneIntl : FALLBACK_PHONE; } catch { return FALLBACK_PHONE; }
  };
  const buildWaLink = (text) => `https://wa.me/${getPhone()}?text=${encodeURIComponent(text||'')}`;
  const copy = (lang) => lang === 'en' ? {
    listTitle: 'Product List', search: 'Search product or part number', price: 'Price', brand: 'Brand', sku: 'Part Number', compat: 'Compatibility', ask: 'Ask Stock', badge: { original: 'Genuine', aftermarket: 'Aftermarket' }, empty: 'No matching products.'
  } : {
    listTitle: 'Daftar Produk', search: 'Cari produk atau part number', price: 'Harga', brand: 'Merek', sku: 'Part Number', compat: 'Kompatibilitas', ask: 'Tanya Stok', badge: { original: 'Original', aftermarket: 'Aftermarket' }, empty: 'Tidak ada produk yang cocok.'
  };
  const formatPrice = (n, lang) => (typeof n !== 'number') ? (lang==='en'?'Contact':'Hubungi') : new Intl.NumberFormat(lang==='en'?'en-US':'id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);

  // Edit your products here (fallback jika tidak ada CSV)
  let PRODUCTS = [
    { id:'of-avanza', name:{id:'Filter Oli Avanza/Xenia',en:'Oil Filter Avanza/Xenia'}, brand:'Genuine/Aftermarket', sku:'90915-10003', compat:{id:'Avanza/Xenia 2004-2019',en:'Avanza/Xenia 2004-2019'}, price:85000, img:'assets/img/products/oil-filter.jpg', badge:'aftermarket' },
    { id:'pads-jazz', name:{id:'Kampas Rem Depan Honda Jazz',en:'Front Brake Pads Honda Jazz'}, brand:'Aftermarket', sku:'GP-HJZ-FBP', compat:{id:'Jazz GE8/RS',en:'Jazz GE8/RS'}, price:275000, img:'assets/img/products/brake-pads.jpg', badge:'aftermarket' },
    { id:'plug-iridium', name:{id:'Busi Iridium',en:'Iridium Spark Plug'}, brand:'Denso NGK', sku:'IK20', compat:{id:'Universal (cek tipe)',en:'Universal (check type)'}, price:120000, img:'assets/img/products/spark-plug.jpg', badge:'original' },
  ];

  // Try to load products from CSV if present
  async function tryLoadCSV(){
    try {
      const res = await fetch('assets/data/products.csv', { cache: 'no-store' });
      if (!res.ok) return;
      const text = await res.text();
      const rows = parseCSV(text);
      if (!rows || rows.length < 2) return; // need header + at least 1 row
      const objs = rowsToObjects(rows);
      const mapped = objectsToProducts(objs);
      if (mapped.length) PRODUCTS = mapped;
    } catch (e) {
      console.warn('CSV load failed', e);
    }
  }

  // Minimal CSV parser with quotes support
  function parseCSV(str){
    const out = [];
    let row = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (inQuotes) {
        if (ch === '"') {
          if (str[i+1] === '"') { cur += '"'; i++; } else { inQuotes = false; }
        } else { cur += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ',') { row.push(cur); cur = ''; }
        else if (ch === '\n') { row.push(cur); out.push(row); row = []; cur = ''; }
        else if (ch === '\r') { /* skip */ }
        else { cur += ch; }
      }
    }
    if (cur.length > 0 || row.length) { row.push(cur); out.push(row); }
    return out;
  }

  function rowsToObjects(rows){
    const header = rows[0].map(h => String(h||'').trim().toLowerCase());
    const objs = [];
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.every(v => String(v||'').trim() === '')) continue;
      const obj = {};
      for (let c = 0; c < header.length; c++) obj[header[c]] = row[c] !== undefined ? row[c] : '';
      objs.push(obj);
    }
    return objs;
  }

  function toNum(v){ const n = parseFloat(String(v).replace(/[^0-9.-]/g,'')); return isNaN(n) ? undefined : n; }
  function slug(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
  function truthy(v){ return /^(ya|yes|true|1)$/i.test(String(v||'').trim()); }

  function objectsToProducts(objs){
    return objs.map(o => ({
      id: o.id || slug(o.name_id || o.name || o.sku || Math.random().toString(36).slice(2)),
      name: { id: o.name_id || o.name || '', en: o.name_en || o.name || '' },
      brand: o.brand || '',
      sku: o.sku || '',
      compat: { id: o.compat_id || '', en: o.compat_en || '' },
      price: toNum(o.price),
      img: o.img || '',
      badge: (String(o.badge||'').toLowerCase() === 'original') ? 'original' : 'aftermarket',
      vehicles: (o.vehicles || o.vehicle || o.compat_tags || '').split(/[,;|]/).map(s => s.trim()).filter(Boolean),
      group: o.group || o.nm_grup || '',
      hasPhoto: truthy(o.has_photo || o.foto) || Boolean((o.img||'').trim()),
    }));
  }

  // Auto-detect vehicle tags from product text
  const VEHICLE_KEYWORDS = [
    { label:'Avanza', re: /(\bavanza\b)/i },
    { label:'Xenia', re: /(\bxenia\b)/i },
    { label:'Rush', re: /(\brush\b)/i },
    { label:'Terios', re: /(\bterios\b)/i },
    { label:'Innova', re: /(\binnova\b|\bkijang\s*innova\b)/i },
    { label:'Fortuner', re: /(\bfortuner\b)/i },
    { label:'Calya', re: /(\bcalya\b)/i },
    { label:'Sigra', re: /(\bsigra\b)/i },
    { label:'Agya', re: /(\bagya\b)/i },
    { label:'Ayla', re: /(\bayla\b)/i },
    { label:'Brio', re: /(\bbrio\b)/i },
    { label:'Jazz', re: /(\bjazz\b)/i },
    { label:'Civic', re: /(\bcivic\b)/i },
    { label:'CR-V', re: /(\bcr[- ]?v\b)/i },
    { label:'HR-V', re: /(\bhr[- ]?v\b)/i },
    { label:'Mobilio', re: /(\bmobilio\b)/i },
    { label:'Ertiga', re: /(\bertiga\b)/i },
    { label:'Carry', re: /(\bcarry\b)/i },
    { label:'Gran Max', re: /(\bgran?d?\s*max\b|\bgran?max\b)/i },
    { label:'Luxio', re: /(\bluxio\b)/i },
    { label:'Pajero', re: /(\bpajero\b)/i },
    { label:'Triton', re: /(\btriton\b)/i },
    { label:'Hino', re: /(\bhino\b)/i },
    { label:'Dutro', re: /(\bdutro\b)/i },
    { label:'Fuso', re: /(\bfuso\b|\bps\s?\d{2,3}\b|\bcanter\b)/i },
    { label:'Isuzu ELF', re: /(\belf\b|\bisuzu\s*n[pr]\w*\b)/i },
    { label:'Colt Diesel', re: /(\bcolt\s*diesel\b|\bcd\s?\d+\b)/i },
  ];

  function detectVehiclesFromText(text){
    if (!text) return [];
    const out = [];
    for (const {label, re} of VEHICLE_KEYWORDS) {
      if (re.test(text)) out.push(label);
    }
    return Array.from(new Set(out));
  }

  function autoTagVehicles(){
    PRODUCTS.forEach(p => {
      if (!p) return;
      if (!Array.isArray(p.vehicles) || p.vehicles.length === 0) {
        const text = `${p.name?.id||''} ${p.name?.en||''} ${p.brand||''} ${p.sku||''}`;
        const tags = detectVehiclesFromText(text);
        if (tags.length) p.vehicles = tags;
      }
    });
  }

  function buildCard(p, lang, t){
    const div = document.createElement('div');
    div.className = 'card product-card';
    const name = p.name?.[lang] || p.name?.id || '';
    const compat = p.compat?.[lang] || p.compat?.id || '';
    const imgSrc = p.img || `https://placehold.co/640x420/0f151d/e6e8eb?text=${encodeURIComponent(p.group||'Produk')}`;
    const badge = t.badge[(p.badge==='original')?'original':'aftermarket'];
    div.innerHTML = `
      <img class="thumb" src="${imgSrc}" alt="${name}" loading="lazy" />
      <div class="badges"><span class="badge">${badge}</span></div>
      <h4 class="prod-name">${name}</h4>
      <div class="product-meta">${t.brand}: ${p.brand||'-'} • ${t.sku}: ${p.sku||'-'}</div>
      <div class="product-meta">${t.compat}: ${compat||'-'}</div>
      <div class="price">${t.price}: ${formatPrice(p.price, lang)}</div>
      <div class="product-actions">
        <a class="btn btn-primary" target="_blank" rel="noopener" href="${buildWaLink(`Halo ${ (typeof SITE!=='undefined' && SITE.name) ? SITE.name : 'TOKO KURDI MOTOR' }. Tanya stok: ${name} (${p.brand||''}) SKU: ${p.sku||''}. Mohon info harga & ketersediaan.`)}">${t.ask}</a>
      </div>
    `;
    return div;
  }

  async function render(){
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    const lang = getLang();
    const t = copy(lang);
    const title = document.getElementById('prodTitle');
    const search = document.getElementById('prodSearch');
    const brandSel = document.getElementById('prodBrand');
    const badgeSel = document.getElementById('prodBadge');
    const vehicleSel = document.getElementById('prodVehicle');
    const empty = document.getElementById('productsEmpty');
    if (title) title.textContent = t.listTitle;
    if (search && search.placeholder !== t.search) search.placeholder = t.search;
    // Ensure CSV loaded before first render (static file only)
    if (!render._loaded) { await tryLoadCSV(); autoTagVehicles(); render._loaded = true; buildFilters(); }
    const q = (search && search.value || '').toLowerCase();
    const brandVal = (brandSel && brandSel.value || '').toLowerCase();
    const badgeVal = (badgeSel && badgeSel.value || '').toLowerCase();
    const photoSel = document.getElementById('prodPhoto');
    const photoVal = (photoSel && photoSel.value || '').toLowerCase();
    const items = PRODUCTS.filter(p => {
      const name = (p.name?.[lang] || p.name?.id || '').toLowerCase();
      const sku = (p.sku||'').toLowerCase();
      const brand = (p.brand||'').toLowerCase();
      const matchesQ = !q || name.includes(q) || sku.includes(q) || brand.includes(q);
      const matchesBrand = !brandVal || brand === brandVal;
      const matchesBadge = !badgeVal || (p.badge||'').toLowerCase() === badgeVal;
      const vehVal = (vehicleSel && vehicleSel.value || '').toLowerCase();
      const vehs = (p.vehicles||[]).map(v => v.toLowerCase());
      const matchesVehicle = !vehVal || vehs.includes(vehVal);
      const hasPhoto = !!p.hasPhoto;
      const matchesPhoto = !photoVal || (photoVal==='with' ? hasPhoto : !hasPhoto);
      return matchesQ && matchesBrand && matchesBadge && matchesVehicle && matchesPhoto;
    });
    const pager = document.getElementById('prodPager');
    const pageInfo = document.getElementById('pageInfo');
    if (!render.state) render.state = { page: 1, perPage: 24 };
    const state = render.state;
    const totalPages = Math.max(1, Math.ceil(items.length / state.perPage));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * state.perPage;
    const pageItems = items.slice(start, start + state.perPage);
    grid.innerHTML = '';
    pageItems.forEach(p => grid.appendChild(buildCard(p, lang, t)));
    if (pager) {
      pager.style.display = items.length > state.perPage ? 'flex' : 'none';
      if (pageInfo) pageInfo.textContent = `Halaman ${state.page} / ${totalPages} • ${items.length} produk`;
      const prev = document.getElementById('prevPage');
      const next = document.getElementById('nextPage');
      if (prev) prev.onclick = () => { if (state.page > 1) { state.page--; render(); } };
      if (next) next.onclick = () => { if (state.page < totalPages) { state.page++; render(); } };
    }
    if (empty) empty.style.display = items.length ? 'none' : 'block';
  }

  function wire(){
    const search = document.getElementById('prodSearch');
    if (search) ['input','change'].forEach(e => search.addEventListener(e, () => { if (render.state) render.state.page = 1; render(); }));
    const brandSel = document.getElementById('prodBrand');
    if (brandSel) brandSel.addEventListener('change', () => { if (render.state) render.state.page = 1; render(); });
    const badgeSel = document.getElementById('prodBadge');
    if (badgeSel) badgeSel.addEventListener('change', () => { if (render.state) render.state.page = 1; render(); });
    const vehicleSel = document.getElementById('prodVehicle');
    if (vehicleSel) vehicleSel.addEventListener('change', () => { if (render.state) render.state.page = 1; render(); });
    const photoSel = document.getElementById('prodPhoto');
    if (photoSel) photoSel.addEventListener('change', () => { if (render.state) render.state.page = 1; render(); });
  }

  document.addEventListener('DOMContentLoaded', () => { render(); wire(); });

  function buildFilters(){
    const brandSel = document.getElementById('prodBrand');
    const vehicleSel = document.getElementById('prodVehicle');
    if (brandSel) {
      const brands = Array.from(new Set(PRODUCTS.map(p => (p.brand||'').trim()).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'id'));
      brandSel.innerHTML = '<option value="">Semua merek</option>' + brands.map(b=>`<option value="${b}">${b}</option>`).join('');
    }
    if (vehicleSel) {
      const vehicles = Array.from(new Set(PRODUCTS.flatMap(p => (p.vehicles||[])).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'id'));
      vehicleSel.innerHTML = '<option value="">Semua mobil</option>' + vehicles.map(v=>`<option value="${v}">${v}</option>`).join('');
    }
  }
})();
