<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\PenyelenggaraProfile;
use App\Models\UmkmProfile;
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
}
