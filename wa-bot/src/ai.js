import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || '';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b';

export function hasLocalAI(){ return !!OLLAMA_URL; }

export async function aiComposeReply({ businessName, userText, candidates }){
  if(!OLLAMA_URL) return null;
  const sys = (
    `Kamu adalah asisten toko onderdil mobil bernama ${businessName||'Toko'}. `+
    `Jawab singkat, ramah, dalam bahasa Indonesia. `+
    `Jika ada kandidat produk yang diberikan, sebutkan 1-3 item terbaik dengan format ringkas "Nama — Brand — SKU". `+
    `Jika informasi kurang (misal kendaraan/tahun/varian), minta detail yang perlu. `+
    `Akhiri dengan opsi: ketik angka produk atau balas "chat admin" untuk dihubungkan.`
  );
  const context = candidates && candidates.length
    ? 'KANDIDAT:\n' + candidates.map((r,i)=>`${i+1}) ${r.name}${r.brand?` — ${r.brand}`:''}${r.sku?` — ${r.sku}`:''}`).join('\n')
    : 'KANDIDAT: (tidak ada)';
  const prompt = `PESAN USER:\n${userText}\n\n${context}`;
  try{
    const { data } = await axios.post(`${OLLAMA_URL.replace(/\/$/,'')}/api/chat`, {
      model: OLLAMA_MODEL,
      stream: false,
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: prompt }
      ]
    }, { timeout: 30000 });
    const content = data?.message?.content || data?.message || data?.response || '';
    return String(content || '').trim().slice(0, 1500);
  }catch(e){
    console.error('ollama error', e?.response?.data || e.message);
    return null;
  }
}

