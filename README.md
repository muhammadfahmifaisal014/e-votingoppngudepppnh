# E-Voting OPPN & GUDEP - PPNH Malati

![Project Banner](https://img.shields.io/badge/PPNH-E_Voting_System-green?style=for-the-badge&logo=react)

**E-Voting OPPN & GUDEP** adalah aplikasi pemungutan suara berbasis web (*web-based*) yang dirancang khusus untuk memodernisasi proses demokrasi di lingkungan **Pondok Pesantren Nurul Huda Malati**. Aplikasi ini digunakan untuk pemilihan ketua **OPPN (Organisasi Pelajar Pesantren Nurul Huda)** Putra & Putri serta kepengurusan **GUDEP (Gugus Depan)**.

Proyek ini bertujuan untuk menciptakan sistem pemilihan yang **Efisien**, **Akurat**, dan **Transparan** dengan menggantikan surat suara kertas menjadi sistem digital yang modern.

---

## ✨ Fitur Utama (Key Features)

### 🗳️ Bilik Suara Virtual (Voting System)
*   **Token Unik**: Validasi pemilih menggunakan token khusus untuk memastikan "Satu Santri, Satu Suara".
*   **Antarmuka User-Friendly**: Desain intuitif memudahkan santri memilih kandidat OPPN Putra, OPPN Putri, dan GUDEP.
*   **Profil Kandidat**: Menampilkan foto serta Visi & Misi setiap kandidat untuk membantu pemilih menentukan pilihan.
*   **Konfirmasi Pilihan**: Fitur review sebelum kirim suara untuk mencegah kesalahan pilih.

### 📊 Real-Time Dashboard (Quick Count)
*   **Live Counting**: Penghitungan suara otomatis detik itu juga setelah pemilih mengirimkan hak suaranya.
*   **Visualisasi Data**: Grafik interaktif (menggunakan Recharts) yang menampilkan perolehan suara secara *real-time*.
*   **Admin Access**: Halaman khusus panitia yang dilindungi password untuk memantau jalannya pemilihan.
*   **Statistik Partisipasi**: Memantau jumlah suara masuk dan tingkat partisipasi pemilih.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Aplikasi ini dibangun menggunakan teknologi web modern untuk performa yang cepat dan ringan:

*   **Frontend Framework**: [React](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charting**: [Recharts](https://recharts.org/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **Language**: TypeScript

---

## 🚀 Cara Menjalankan (Installation & Setup)

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di komputer lokal Anda:

1.  **Clone Repository**
    ```bash
    git clone https://github.com/MuhammadFahmiFaisal/Evoting-OPPN-GUDEP.git
    cd Evoting-OPPN-GUDEP
    ```

2.  **Install Dependencies**
    Pastikan Anda sudah menginstall [Node.js](https://nodejs.org/).
    ```bash
    npm install
    ```

3.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173`.

4.  **Build untuk Produksi**
    ```bash
    npm run build
    npm run preview
    ```

---

## 📖 Panduan Penggunaan (User Guide)

### Alur Pemilihan bagi Santri:
1.  **Login**: Masukkan **Token Unik** yang diberikan panitia pada halaman awal.
2.  **Pilih Kandidat**:
    *   Pilih Ketua **OPPN Putra**.
    *   Pilih Ketua **OPPN Putri**.
    *   Pilih Ketua **GUDEP**.
    *   *(Klik foto kandidat untuk melihat Visi & Misi)*.
3.  **Konfirmasi**: Periksa kembali pilihan Anda di halaman konfirmasi.
4.  **Selesai**: Tekan tombol **"Kirim Suara"**. Terima kasih telah berpartisipasi!

---

## 👥 Kredit & Apresiasi

Proyek ini dipersembahkan untuk keluarga besar **Pondok Pesantren Nurul Huda Malati**.

**Tim Pengembang & Panitia:**
*   Pondok Pesantren Nurul Huda Malati
*   Panitia Pemilihan OPPN & GUDEP

---
*Dibuat dengan ❤️ untuk kemajuan demokrasi santri.*
