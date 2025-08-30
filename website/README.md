Toko Kurdi Motor — Website

Struktur proyek berada di folder `website/` dengan halaman multi‑bahasa (Indonesia/Inggris) tanpa backend. Semua teks bisa diganti via sistem i18n di `assets/js/main.js`.

Cara pakai cepat:

1) Ganti detail toko di `assets/js/main.js` pada konstanta `SITE` (saat ini sudah diisi untuk Toko Kurdi Motor):

   - `phoneIntl`: nomor WhatsApp format internasional, tanpa tanda +, contoh: `62812999xxxx`
   - `phoneDisplay`: format tampilan nomor di situs
   - `address`: alamat toko
   - `hours`: jam operasional
   - `mapsQuery`: nama tempat/alamat untuk peta Google

2) Letakkan logo PNG di `assets/img/logo.png` (ganti file placeholder). Favicon opsional di `assets/img/favicon.png`.

3) Ubah warna brand di `assets/css/styles.css` pada variabel CSS `--primary` (dan `--accent` bila perlu).

4) Buka `index.html` di browser. Klik tombol "ID/EN" di navbar untuk ganti bahasa. Bahasa tersimpan di localStorage, berlaku di semua halaman.

5) Halaman yang tersedia:
   - `index.html` (Beranda)
   - `services.html` (Layanan)
   - `products.html` (Produk)
   - `gallery.html` (Galeri)
   - `about.html` (Tentang)
   - `contact.html` (Kontak) + form WhatsApp

Catatan teknis:
- Seluruh translasi disimpan inline di `assets/js/main.js` untuk menghindari masalah CORS saat dibuka langsung dari file sistem.
- Tombol WhatsApp otomatis membuat link ke nomor di `SITE.phoneIntl` dengan pesan awal.
- Embed peta Google menggunakan `SITE.mapsQuery`. Link peta juga ada di tombol "Lihat Peta" pada halaman Kontak.
- Galeri menggunakan gambar placeholder `picsum.photos`. Anda dapat menaruh foto sendiri di `assets/img/gallery/` dan mengganti `src` pada `gallery.html`.
  
Galeri otomatis:
- Daftar foto diatur di `assets/js/main.js` pada konstanta `GALLERY`.
- Tambahkan item: `{ src: 'assets/img/gallery/nama-file.jpg', alt: { id: 'Deskripsi ID', en: 'English description' } }`.
- Tidak perlu mengedit `gallery.html`; gambar akan dirender otomatis ke elemen `#galleryGrid`.

Produk:
- Data produk ditarik dari `assets/js/products.js` (fallback) atau CSV statis `assets/data/products.csv` jika ada.
- Kelola via Excel: pakai `assets/data/products-template.csv` sebagai contoh, simpan menjadi `products.csv`, lalu letakkan di `assets/data/`.
- Kolom CSV: `id,name_id,name_en,brand,sku,compat_id,compat_en,price,img,badge`. Kolom `compat_*` opsional; jika kosong, situs menampilkan "Tanya via WhatsApp".
- Pengunjung tidak bisa mengubah data; tidak ada upload di situs publik. Perbarui produk dengan mengganti file CSV lalu deploy.
