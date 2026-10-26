# Vectoreal Education - Portal Akademik SIAKAD UNG

Sistem Informasi Akademik (SIAKAD) terintegrasi PDDikti untuk Universitas Negeri Gorontalo, dibangun dengan **React + TypeScript + Tailwind CSS** dan siap di-deploy langsung ke **Vercel**.

---

## 🚀 Cara Deploy ke Vercel

### Opsi 1: Deploy Otomatis via GitHub (Paling Mudah)
1. **Push ke GitHub**:
   - Di AI Studio, buka menu pengaturan (titik tiga atau icon GitHub di kanan atas) lalu pilih **Push to GitHub** atau unduh file sebagai ZIP dan upload ke repositori GitHub Anda.
2. **Buka Vercel**:
   - Masuk ke dashboard [vercel.com](https://vercel.com).
   - Klik **"Add New..."** → **"Project"**.
   - Pilih repository GitHub Anda (`vectoreal-education-siakad`).
3. **Konfigurasi Vercel (Otomatis Terdeteksi)**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Klik Deploy**:
   - Vercel akan langsung mem-build dan menyediakan domain gratis seperti:  
     `https://vectoreal-education-siakad.vercel.app` 🎉

---

### Opsi 2: Deploy Menggunakan Vercel CLI
Jika Anda memiliki Node.js di komputer:
```bash
npm install -g vercel
vercel
```
Ikuti instruksi di terminal, dan situs akan langsung aktif dalam hitungan detik.

---

## ✨ Fitur-Fitur Utama

1. **Autentikasi & Peran Mahasiswa**:
   - Masuk sebagai **Ketua Kelas**: Memiliki hak akses khusus menambah & mengatur jadwal kuliah, serta membuat dan menyiarkan tugas kelas.
   - Masuk sebagai **Mahasiswa Biasa**: Melihat jadwal, kalender, dan mencentang tugas yang sudah diselesaikan.
   - Verifikasi Cloudflare Turnstile human verification.
2. **Dashboard Akademik**:
   - **3 Kartu KPI**: IPK (3.48 - Sangat Memuaskan), Total Tunggakan (Rp. 0), dan Jumlah SKS (40 / 144 SKS dengan progress bar).
   - **4 Tab Cepat (Semua, Jadwal MK, Tugas, Kalender)** dalam 1 layar tanpa slide.
3. **Jadwal Perkuliahan**:
   - Filter hari singkat: `Sen`, `Sel`, `Rab`, `Kam`, `Jum`, `Sab`.
   - Informasi detail mata kuliah: Dosen, Ruangan, Waktu, SKS.
4. **Kalender Interaktif**:
   - Kalender bulanan penuh.
   - Klik tanggal mana pun untuk memunculkan daftar tugas dan deadline pada tanggal tersebut.
5. **Biodata Mahasiswa (PDDikti)**:
   - Data lengkap akademik, program studi, status keaktifan, dan pembimbing akademik.
6. **Penyimpanan Lokal (localStorage)**:
   - Perubahan tugas, jadwal, dan status login tersimpan secara otomatis di browser.
