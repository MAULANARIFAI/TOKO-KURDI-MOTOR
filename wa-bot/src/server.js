import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import axios from 'axios';
import { loadCatalog, searchProducts, formatCandidates } from './catalog.js';
import { hasLocalAI, aiComposeReply } from './ai.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'verify-token';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || '';
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '';
const APP_SECRET = process.env.APP_SECRET || '';
const BUSINESS_NAME = process.env.BUSINESS_NAME || 'Toko Kami';

if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
  console.warn('[WARN] Env WHATSAPP_TOKEN/PHONE_NUMBER_ID belum diisi. Kirim pesan akan gagal.');
}

// Optional: verify X-Hub-Signature-256
function verifySignature(req) {
  try {
    if (!APP_SECRET) return true; // skip if not provided
    const signature = req.get('x-hub-signature-256');
    if (!signature) return false;
    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', APP_SECRET).update(payload).digest('hex');
    return signature === `sha256=${hmac}`;
  } catch (e) { return false; }
}

// Webhook verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

let CATALOG = [];
(async()=>{
  try { CATALOG = await loadCatalog({}); console.log(`[CATALOG] Loaded ${CATALOG.length} items`); } catch(e){ console.warn('Load catalog failed', e.message); }
})();

// Simple in-memory session per user (stores last search candidates)
const SESSIONS = new Map();

// Webhook receiver (POST)
app.post('/webhook', async (req, res) => {
  if (!verifySignature(req)) {
    return res.sendStatus(403);
  }
  const body = req.body;
  try {
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const messages = value?.messages;
      if (Array.isArray(messages) && messages.length) {
        for (const msg of messages) {
          await handleIncomingMessage(msg, value?.metadata);
        }
      }
    }
  } catch (e) {
    console.error('webhook error:', e);
  }
  // WhatsApp expects 200 quickly
  return res.sendStatus(200);
});

async function handleIncomingMessage(msg, metadata) {
  const from = msg.from; // user number in international format
  const type = msg.type;
  let text = '';
  if (type === 'text') text = (msg.text?.body || '').trim();
  else if (type === 'button') text = (msg.button?.text || '').trim();
  else if (type === 'interactive') text = (msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || '').trim();

  let reply;
  // gunakan AI lokal bila ada, dengan hasil pencarian katalog sebagai konteks
  const results = CATALOG && text ? searchProducts(CATALOG, text, 5) : [];

  // handle numeric selection (1..5) based on last suggestions
  const isNumberPick = /^\s*[1-5]\s*$/.test(text);
  if (isNumberPick) {
    const idx = parseInt(text,10) - 1;
    const session = SESSIONS.get(from);
    const chosen = session && session.candidates && session.candidates[idx];
    if (chosen) {
      const detail = `${chosen.name}${chosen.brand?` — ${chosen.brand}`:''}${chosen.sku?` — ${chosen.sku}`:''}`;
      await sendText(from, `Baik, yang Anda pilih:\n${detail}\n\nUntuk cek stok & harga, balas "admin" atau kirim foto/part number tambahan.`);
      return;
    }
  }
  if (hasLocalAI()) {
    reply = await aiComposeReply({ businessName: BUSINESS_NAME, userText: text, candidates: results.slice(0,3) });
  }
  // fallback rule-based
  if (!reply) {
    reply = composeAutoReply(text, results);
  }
  if (reply) await sendText(from, reply);

  // store candidates for quick numeric selection next message
  if (results && results.length) {
    SESSIONS.set(from, { candidates: results.slice(0,5), ts: Date.now() });
  }
}

function composeAutoReply(input, results=[]) {
  const t = (input || '').toLowerCase();
  if (!t || ['hi','hai','halo','menu','start','mulai','/start'].includes(t)) {
    return (
      `Halo, terima kasih telah menghubungi ${BUSINESS_NAME}.\n`+
      `Silakan pilih: \n`+
      `1) Tanya stok / harga\n`+
      `2) Booking servis\n`+
      `3) Lokasi toko\n`+
      `0) Chat dengan admin`
    );
  }
  if (t === '1' || /stok|harga/i.test(input)) {
    const list = results && results.length ? `\n\nKandidat:\n${formatCandidates(results)}` : '';
    return 'Silakan kirim nama barang/part number & merek. Contoh: "Filter oli 90915-YZZZ2 Toyota".' + list;
  }
  if (t === '2' || /booking|servis|service/i.test(input)) {
    return 'Untuk booking servis, kirimkan: nama, nomor polisi, jenis servis/keluhan, dan waktu yang diinginkan.';
  }
  if (t === '3' || /lokasi|alamat|maps/i.test(input)) {
    return 'Lokasi kami: Jl. Raya Babadan, Karangwuni, Warureja, Tegal. Google Maps: https://maps.app.goo.gl/4JvsAFLxmq36jreW6';
  }
  if (t === '0' || /admin|cs|operator/i.test(input)) {
    return 'Baik, admin kami akan segera membalas. Mohon tunggu.';
  }
  // fallback cari di katalog
  if (results && results.length) {
    return (
      'Kami menemukan beberapa kandidat terkait pesan Anda:\n' +
      formatCandidates(results) +
      '\n\nSilakan balas angka item, atau kirim foto/part number yang lebih spesifik. Ketik "admin" untuk dihubungkan.'
    );
  }
  return 'Maaf, kami belum mengerti. Balas dengan kata "menu" untuk melihat pilihan, atau kirim nama barang/part number & merek.';
}

async function sendText(to, body) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) return;
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    text: { body }
  };
  try {
    await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('send error:', e?.response?.data || e.message);
  }
}

async function sendButtons(to, body, buttons){
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) return;
  const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
  const btns = (buttons||[]).slice(0,3).map(b=>({ type:'reply', reply:{ id: b.id, title: b.title } }));
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: body },
      action: { buttons: btns }
    }
  };
  try {
    await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('send buttons error:', e?.response?.data || e.message);
  }
}

app.get('/', (req, res) => res.send('WhatsApp Auto-Reply Bot OK'));

app.listen(PORT, () => {
  console.log(`WA bot on http://localhost:${PORT}`);
});
