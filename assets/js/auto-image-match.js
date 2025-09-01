// Auto-match product images on the client by name/brand/SKU using a manifest
(function(){
  const MANIFEST_URL = 'assets/data/product-images.json';
  const MAP_URL = 'assets/data/image-map.json';
  let IMG_INDEX = [];
  let IMG_MAP = {};

  function alnum(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,''); }
  function tokens(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(Boolean); }

  function buildImageIndex(files){
    return files.map(f=>{
      const base = String(f||'');
      const stem = base.replace(/\.[^.]+$/,'');
      return { file: base, path: `assets/img/products/${base}`, stem, tks: tokens(stem), joined: alnum(stem) };
    });
  }

  function scoreImageFor(name, brand, sku, img){
    let score = 0;
    const skuClean = alnum(sku||'');
    if(skuClean && img.joined.includes(skuClean)) score += 10;
    const nameT = tokens(name||'');
    const brandT = tokens(brand||'');
    const numName = nameT.filter(t=>/\d/.test(t) && t.replace(/\D/g,'').length>=4);
    for(const bt of brandT){ if(img.tks.includes(bt)) score += 3; }
    let matched = 0; for(const nt of nameT){ if(img.tks.includes(nt)){ score += 1; matched++; if(matched>=6) break; } }
    for(const nt of numName){ if(img.joined.includes(alnum(nt))) score += 2; }
    return score;
  }

  function extractMeta(card){
    const name = (card.querySelector('h4.prod-name')?.textContent||'').trim();
    const meta = (card.querySelector('.product-meta')?.textContent||'').trim();
    // Try to get SKU from last ':' segment
    let sku = '';
    if(meta.includes(':')){
      const parts = meta.split(':');
      sku = (parts[parts.length-1]||'').replace(/[|•�]/g,' ').trim();
    }
    // Try to get brand from first ':' segment before any separator or next label
    let brand = '';
    if(meta.includes(':')){
      const first = meta.split(':')[1]||'';
      brand = first.replace(/(\||•|�|Part Number.*|SKU.*)/i,' ').trim();
    }
    return { name, brand, sku };
  }

  function setPreferWebp(imgEl, path){
    const tryWebp = path.replace(/\.[^.]+$/, '.webp');
    const tmp = new Image();
    tmp.onload = () => { imgEl.src = tryWebp; };
    tmp.onerror = () => { imgEl.src = path; };
    tmp.src = tryWebp;
  }

  function matchAndSet(card){
    const imgEl = card.querySelector('img.thumb');
    if(!imgEl) return;
    const src = imgEl.getAttribute('src')||'';
    if(src && !/placehold\.co/.test(src)) return; // already has real image
    const { name, brand, sku } = extractMeta(card);
    // 1) Explicit map by SKU
    if(sku && IMG_MAP && typeof IMG_MAP === 'object' && IMG_MAP[sku]){
      const mapped = IMG_MAP[sku];
      const final = mapped.startsWith('assets/') ? mapped : `assets/img/products/${mapped}`;
      setPreferWebp(imgEl, final);
      return;
    }
    if(!name && !brand && !sku) return;
    let best = null; let bestScore = -1; let second = -1;
    for(const ii of IMG_INDEX){
      const s = scoreImageFor(name, brand, sku, ii);
      if(s > bestScore){ second = bestScore; bestScore = s; best = ii; }
      else if(s > second){ second = s; }
    }
    if(!best) return;
    const strong = (alnum(sku).length && best.joined.includes(alnum(sku))) || bestScore >= 6 || (bestScore>=4 && bestScore-second>=2);
    if(strong){ setPreferWebp(imgEl, best.path); }
  }

  async function init(){
    try {
      const [res,resMap] = await Promise.all([
        fetch(MANIFEST_URL, { cache: 'no-store' }),
        fetch(MAP_URL, { cache: 'no-store' })
      ]);
      if(!res.ok) return;
      const files = await res.json();
      if(resMap.ok){ try { IMG_MAP = await resMap.json(); } catch { IMG_MAP = {}; } }
      if(!Array.isArray(files) || !files.length) return;
      IMG_INDEX = buildImageIndex(files);

      const grid = document.getElementById('productsGrid');
      if(!grid) return;
      // Apply to existing
      grid.querySelectorAll('.product-card').forEach(matchAndSet);
      // Observe future changes (pagination/filter/rerender)
      const mo = new MutationObserver(()=>{
        grid.querySelectorAll('.product-card').forEach(matchAndSet);
      });
      mo.observe(grid, { childList: true, subtree: false });
    } catch(e){ /* ignore */ }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
