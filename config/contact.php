<?php
// File: config/contact.php

return [
    /*
    |--------------------------------------------------------------------------
    | Kontak Administrator
    |--------------------------------------------------------------------------
    |
    | Simpan nomor kontak admin di sini.
    | Pastikan formatnya adalah kode negara diikuti nomor tanpa spasi atau simbol.
    | Contoh: 6281234567890
    |
    */
    'admin_whatsapp' => env('ADMIN_WHATSAPP_NUMBER', ''),
];
