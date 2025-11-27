<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\PenyelenggaraProfile;
use App\Models\UmkmProfile;
use App\Models\EventRegistration;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SecureFileController extends Controller
{
    // Menampilkan file KTP UMKM
    public function showKtp(UmkmProfile $umkm): StreamedResponse|\Illuminate\Http\Response
    {
        if (!$umkm->ktp_path || !Storage::disk('local_secure')->exists($umkm->ktp_path)) {
            abort(404, 'File KTP tidak ditemukan.');
        }
        // Mengembalikan file sebagai response stream
        return Storage::disk('local_secure')->response($umkm->ktp_path);
    }

    // Menampilkan dokumen verifikasi Penyelenggara
    public function showPenyelenggaraDoc(PenyelenggaraProfile $penyelenggara): StreamedResponse|\Illuminate\Http\Response
    {
        if (!$penyelenggara->verification_document_path || !Storage::disk('local_secure')->exists($penyelenggara->verification_document_path)) {
            abort(404, 'Dokumen verifikasi tidak ditemukan.');
        }
        return Storage::disk('local_secure')->response($penyelenggara->verification_document_path);
    }

    // Menampilkan dokumen proposal Event
    public function showProposalDoc(Event $event): StreamedResponse|\Illuminate\Http\Response
    {
        if (!$event->proposal_document_path || !Storage::disk('local_secure')->exists($event->proposal_document_path)) {
            abort(404, 'Dokumen proposal tidak ditemukan.');
        }
        return Storage::disk('local_secure')->response($event->proposal_document_path);
    }

    // Menampilkan Logo UMKM (Melalui controller untuk menghindari masalah permission 403 di storage link)
    public function showUmkmLogo(UmkmProfile $umkm): StreamedResponse|\Illuminate\Http\Response
    {
        if (!$umkm->logo_path || !Storage::disk('public')->exists($umkm->logo_path)) {
            abort(404, 'Logo tidak ditemukan.');
        }
        // Logo disimpan di disk 'public', bukan 'local_secure'
        return Storage::disk('public')->response($umkm->logo_path);
    }

    //Menampilkan Poster Event untuk Admin
    public function showEventPoster(Event $event): StreamedResponse|\Illuminate\Http\Response
    {
        // Cek apakah poster ada di disk 'public'
        if (!$event->poster_event || !Storage::disk('public')->exists($event->poster_event)) {
            abort(404, 'Poster event tidak ditemukan.');
        }
        return Storage::disk('public')->response($event->poster_event);
    }
    // Menampilkan Bukti Pembayaran
    public function showPaymentProof(EventRegistration $registration): StreamedResponse|\Illuminate\Http\Response
    {
        if (!$registration->bukti_pembayaran_path || !Storage::disk('public')->exists($registration->bukti_pembayaran_path)) {
            abort(404, 'Bukti pembayaran tidak ditemukan.');
        }
        return Storage::disk('public')->response($registration->bukti_pembayaran_path);
    }

    // Menampilkan Gambar Produk (Public)
    public function showProductImage(Product $product): StreamedResponse|\Illuminate\Http\Response
    {
        if (!$product->image_path || !Storage::disk('public')->exists($product->image_path)) {
            abort(404, 'Gambar produk tidak ditemukan.');
        }
        return Storage::disk('public')->response($product->image_path);
    }

    // Menampilkan QRIS UMKM
    public function showQrisImage(UmkmProfile $umkm): StreamedResponse|\Illuminate\Http\Response
    {
        if (!$umkm->qris_path || !Storage::disk('public')->exists($umkm->qris_path)) {
            abort(404, 'QRIS tidak ditemukan.');
        }
        return Storage::disk('public')->response($umkm->qris_path);
    }
}
