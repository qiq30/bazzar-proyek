# Platform Manajemen Acara & Bazar UMKM

Proyek ini adalah sebuah platform web canggih yang dirancang untuk mengelola seluruh siklus hidup sebuah acara atau bazar, dengan fokus pada partisipasi UMKM (Usaha Mikro, Kecil, dan Menengah). Aplikasi ini mempertemukan Penyelenggara Acara, Peserta UMKM, Admin, dan Panitia Lapangan dalam satu ekosistem yang terintegrasi.

Dibangun dengan **Laravel** untuk backend dan **React** untuk frontend, aplikasi ini menawarkan pengalaman pengguna yang modern dan reaktif, lengkap dengan notifikasi real-time.

---

## Fitur Utama

Aplikasi ini memiliki sistem multi-peran yang kompleks, di mana setiap peran memiliki dasbor dan fungsionalitasnya sendiri.

### Peran & Fungsionalitas

-   **UMKM (Peserta)**

    -   Mendaftar dan membuat profil usaha.
    -   Mengelola produk yang akan ditampilkan.
    -   Mencari dan mendaftar pada acara yang tersedia.
    -   Melakukan pembayaran dan mengunggah bukti transfer.
    -   Menerima dan mengunduh E-Ticket dengan QR code.
    -   Mengunggah QRIS pribadi untuk transaksi di lokasi.

-   **Penyelenggara Acara**

    -   Mengajukan proposal acara baru melalui wizard multi-langkah.
    -   Memantau status persetujuan proposal.
    -   Memverifikasi pembayaran dari UMKM yang mendaftar.
    -   Menetapkan nomor stand/lapak untuk peserta.

-   **Admin**

    -   Memverifikasi dan mengelola akun UMKM dan Penyelenggara.
    -   Meninjau, menyetujui, atau menolak proposal acara.
    -   Mempublikasikan acara agar dapat dilihat oleh UMKM.
    -   Memantau dan memverifikasi semua transaksi keuangan.
    -   Mengakses laporan dan analitik dasar.

-   **Panitia Lapangan**

    -   Login cepat menggunakan PIN khusus di lokasi acara.
    -   Melakukan check-in peserta dengan memindai QR code pada E-Ticket.
    -   Mencari data peserta secara real-time.

-   **Super Admin**
    -   Manajemen penuh atas semua pengguna dan peran.
    -   Membuat dan menghapus akun Admin.
    -   Fitur "Impersonate" untuk masuk sebagai pengguna lain guna troubleshooting.
    -   Mengakses log dan laporan sistem tingkat lanjut.

---

## Teknologi yang Digunakan (Tech Stack)

-   **Backend**: Laravel 12, PHP 8.2
-   **Frontend**: React, Vite, Inertia.js
-   **Styling**: TailwindCSS
-   **Database**: MySQL (direkomendasikan), atau database lain yang didukung Laravel.
-   **Real-time**: Laravel Reverb (WebSockets)
-   **Fitur Tambahan**:
    -   PDF Generation: `barryvdh/laravel-dompdf`
    -   QR Code Generation: `simplesoftwareio/simple-qrcode`
    -   Social Login: `laravel/socialite`
    -   Security: `react-google-recaptcha`

---

## Instalasi & Setup

Berikut adalah panduan langkah-demi-langkah untuk meng-clone dan menjalankan proyek ini di lingkungan pengembangan lokal.

### 1. Prasyarat (Prerequisites)

-   PHP 8.2 atau lebih tinggi
-   Composer
-   Node.js & NPM
-   Database (misalnya MySQL, MariaDB)
-   Git

### 2. Langkah-langkah Instalasi

1.  **Clone Repository**

    ```bash
    git clone [URL_REPOSITORY_ANDA]
    cd [NAMA_DIREKTORI_PROYEK]
    ```

2.  **Konfigurasi Environment**

    -   Salin file `.env.example` menjadi `.env`. File ini berisi semua variabel lingkungan yang dibutuhkan proyek.
        ```bash
        cp .env.example .env
        ```
    -   Buka file `.env` dan isi semua nilai yang diperlukan, terutama:
        -   **Konfigurasi Database**: `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
        -   **Konfigurasi Email (SMTP)**: `MAIL_USERNAME`, `MAIL_PASSWORD` (Dibutuhkan untuk verifikasi OTP).
        -   **Kunci API Google**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Dibutuhkan untuk Google Login).
        -   **Kunci reCAPTCHA**: `RECAPTCHA_V...` (Jika ingin fitur reCAPTCHA aktif).

3.  **Install Dependensi Backend**

    ```bash
    composer install
    ```

4.  **Install Dependensi Frontend**

    ```bash
    npm install
    ```

5.  **Generate Application Key**
    Setiap aplikasi Laravel memerlukan kunci enkripsi unik.

    ```bash
    php artisan key:generate
    ```

6.  **Jalankan Migrasi & Seeder Database**

    -   Perintah `migrate` akan membuat semua tabel yang diperlukan di database Anda.
    -   Perintah `db:seed` akan mengisi database dengan data awal (termasuk akun admin/superadmin default) sesuai arahan dari `DatabaseSeeder.php`.

    ```bash
    php artisan migrate
    php artisan db:seed --class=DatabaseSeeder
    ```

7.  **Jalankan Server Pengembangan**
    Proyek ini menggunakan Vite untuk me-manage aset frontend dan Reverb untuk WebSockets. Anda bisa menjalankan semuanya dengan satu perintah:

    ```bash
    npm run dev
    ```

    Perintah ini akan:

    -   Menjalankan server pengembangan PHP (`php artisan serve`).
    -   Menjalankan server Vite. (`npm run dev`)
    -   Menjalankan listener untuk antrian (queue). (`php artisan queue:work`)
    -   Menjalankan server Laravel Reverb.(`php artisan reverb:start`)

8.  **Akses Aplikasi**
    Setelah semua server berjalan, Anda bisa membuka aplikasi di browser pada alamat yang ditampilkan (biasanya `http://127.0.0.1:8000`).

Selamat! Proyek sekarang sudah berjalan di mesin lokal Anda.
