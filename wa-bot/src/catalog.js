import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';

function parseDSV(text) {
  // Auto-detect comma/semicolon by first non-empty line
  const first = (text.split(/\r?\n/).find(l=>l.trim().length>0) || '');
  const semi = (first.match(/;/g)||[]).length;
  const comma = (first.match(/,/g)||[]).length;
  const delimiter = semi>comma ? ';' : ',';
  const parsed = Papa.parse(text, { header: true, delimiter, skipEmptyLines: true });
  return parsed.data || [];
}

function normalizeItem(o){
  const name = o.name_id || o.name || o['nm_brg'] || '';
  const brand = o.brand || o.merk || '';
  const sku = o.sku || o.plu || '';
  const id = o.id || sku || name || Math.random().toString(36).slice(2);
  return { id, name, brand, sku };
}

export async function loadCatalog(opts={}){
  const base = opts.baseDir || path.resolve(process.cwd(), '..');
  const files = [
    opts.productsCsv || path.resolve(base, 'assets/data/products.csv'),
    opts.partCsv || path.resolve(base, 'assets/data/part.csv'),
  ];
  const items = [];
  for(const f of files){
    try{
      const txt = await fs.readFile(f, 'utf8');
      const rows = parseDSV(txt);
      for(const r of rows){ items.push(normalizeItem(r)); }
    }catch(e){ /* ignore */ }
  }
  // dedupe by (sku or name)
  const seen = new Set();
  const out=[];
  for(const it of items){
    const key = (it.sku||'') + '|' + (it.name||'');
    if(seen.has(key)) continue; seen.add(key); out.push(it);
  }
  return out;
}

function tokenize(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(Boolean); }

export function searchProducts(items, query, limit=5){
  const q = String(query||'').trim();
  if(!q) return [];
  const qTokens = tokenize(q);
  const hasNum = /\d/.test(q);
  const scored = items.map(it=>{
    const name = (it.name||'').toLowerCase();
    const brand = (it.brand||'').toLowerCase();
    const sku = (it.sku||'').toLowerCase();
    let score=0;
    for(const t of qTokens){
      if(!t) continue;
      if(sku.includes(t)) score+=10;
      if(name.includes(t)) score+=4;
      if(brand.includes(t)) score+=3;
      // numeric boost
      if(/\d/.test(t) && (sku.includes(t) || name.includes(t))) score+=3;
    }
    // phrase substring
    const lowQ = q.toLowerCase();
    if(name.includes(lowQ)) score+=2;
    if(sku.includes(lowQ)) score+=2;
    return { item: it, score };
  }).filter(x=>x.score>0);
  scored.sort((a,b)=> b.score - a.score);
  return scored.slice(0, limit).map(x=>x.item);
}

export function formatCandidates(results){
  if(!results || !results.length) return 'Belum ditemukan item yang cocok.';
  const lines = results.map((r,i)=> `${i+1}) ${r.name}${r.brand?` — ${r.brand}`:''}${r.sku?` — ${r.sku}`:''}`);
  return lines.join('\n');
}

