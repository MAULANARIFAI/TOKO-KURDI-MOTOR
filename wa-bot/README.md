# WhatsApp Auto-Reply Bot (WhatsApp Cloud API)

Proyek kecil untuk membalas chat WhatsApp secara otomatis menggunakan WhatsApp Cloud API (resmi Meta). Ditulis dengan Node.js + Express.

## Fitur
- Webhook verifikasi (GET) dan penerimaan pesan (POST)
- Auto-reply berbasis kata kunci/menu sederhana
- Kirim balasan teks via Graph API
- Opsional verifikasi signature `X-Hub-Signature-256` (kalau `APP_SECRET` diisi)

## Prasyarat
1) Akun Meta Developer + WhatsApp Cloud API sudah aktif
2) Memiliki `Phone Number ID` dan `Permanent Access Token` (Bearer token)
3) Buat aplikasi di Meta, aktifkan produk WhatsApp, dan siapkan Webhook `messages`

Referensi: https://developers.facebook.com/docs/whatsapp/cloud-api/

## Konfigurasi Lingkungan
Copy `.env.example` menjadi `.env` lalu isi nilai berikut:

```
PORT=3000
VERIFY_TOKEN=isi_token_anda_untuk_verifikasi_webhook
WHATSAPP_TOKEN=EAAG... (permanent access token)
PHONE_NUMBER_ID=123456789012345 (ID nomor dari Cloud API)
APP_SECRET=opsional_kalau_mau_verify_signature
BUSINESS_NAME=Nama Bisnis Anda (opsional)
```

## Menjalankan Lokal
```
cd wa-bot
npm install
npm run dev
```
Aplikasi berjalan di `http://localhost:3000`.

Untuk menerima webhook dari Meta, gunakan tunnel (pilih salah satu):
- ngrok: `ngrok http 3000`
- cloudflared: `cloudflared tunnel --url http://localhost:3000`

Setel Webhook di Meta App:
- Callback URL: `https://<DOMAIN_OR_TUNNEL>/webhook`
- Verify Token: isi sama dengan `VERIFY_TOKEN` Anda
- Subscribe ke `messages`

## Uji Coba
Kirim pesan ke nomor WhatsApp Cloud Anda. Bot akan:
- Balas menu saat menerima salam/"menu"
- Menjawab angka 1/2/3/0 sesuai pilihan

## Deploy (opsional)
Anda bisa deploy ke platform Node (Render/Heroku/Fly.io/VPS). Pastikan env diisi dan URL webhook diupdate.

## Catatan Penting
- Balasan teks bebas biaya selama dalam jendela 24 jam setelah user mengirim pesan pertama.
- Jika ingin kirim template (HSM) di luar 24 jam, Anda harus menyiapkan template dan menyetujukannya di WhatsApp Manager.

## Lisensi
Gunakan bebas untuk kebutuhan toko Anda.

