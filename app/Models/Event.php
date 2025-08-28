<?php
// app/Models/Event.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Prunable;

class Event extends Model
{
    use HasFactory, SoftDeletes, Prunable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // --- ▼▼▼ PERUBAHAN DI SINI ▼▼▼ ---
    protected $fillable = [
        'user_id',
        'nama_event',
        'deskripsi_event',
        'poster_event',
        'pendaftaran_dibuka',         // TAMBAHKAN INI
        'pendaftaran_ditutup',        // TAMBAHKAN INI
        'tanggal_mulai_acara',        // UBAH NAMA KOLOM
        'tanggal_selesai_acara',      // UBAH NAMA KOLOM
        'lokasi_event',
        'biaya_pendaftaran_umkm',
        'kuota_umkm',
        'nama_bank_penyelenggara',
        'nomor_rekening_penyelenggara',
        'nama_pemilik_rekening',
        'status_proposal',
        'status',
        'panitia_pin',
        'rejection_reason',
    ];
    // --- ▲▲▲ AKHIR DARI PERUBAHAN ---

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    // --- ▼▼▼ PERUBAHAN DI SINI ▼▼▼ ---
    protected $casts = [
        'pendaftaran_dibuka' => 'date',      // TAMBAHKAN INI
        'pendaftaran_ditutup' => 'date',     // TAMBAHKAN INI
        'tanggal_mulai_acara' => 'date',     // UBAH NAMA KOLOM
        'tanggal_selesai_acara' => 'date',   // UBAH NAMA KOLOM
        'biaya_pendaftaran_umkm' => 'decimal:2',
        'kuota_umkm' => 'integer',
    ];
    // --- ▲▲▲ AKHIR DARI PERUBAHAN ---

    /**
     * Relasi ke user penyelenggara yang mengajukan event.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke pendaftaran UMKM di event ini.
     */
    public function eventRegistrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    /**
     * Relasi ke profil UMKM yang terdaftar di event ini.
     */
    public function umkmProfiles()
    {
        return $this->belongsToMany(UmkmProfile::class, 'event_registrations')
            ->withPivot('status', 'notes')
            ->withTimestamps();
    }

    /**
     * Mendapatkan peserta UMKM yang sudah disetujui.
     */
    public function verifiedParticipants()
    {
        return $this->umkmProfiles()
            ->wherePivotIn('status', ['approved', 'sudah_check_in'])
            ->where('umkm_profiles.status', 'verified');
    }

    /**
     * Accessor untuk mendapatkan URL publik dari poster event.
     */
    public function getImageUrlAttribute()
    {
        return $this->poster_event ? Storage::url($this->poster_event) : null;
    }

    /**
     * Accessor untuk mendapatkan rentang tanggal yang sudah diformat.
     */
    // --- ▼▼▼ PERUBAHAN DI SINI ▼▼▼ ---
    public function getEventDateRangeAttribute()
    {
        if ($this->tanggal_mulai_acara->equalTo($this->tanggal_selesai_acara)) {
            return $this->tanggal_mulai_acara->format('d M Y');
        }
        return $this->tanggal_mulai_acara->format('d M') . ' - ' . $this->tanggal_selesai_acara->format('d M Y');
    }
    // --- ▲▲▲ AKHIR DARI PERUBAHAN ---

    // --- ▼▼▼ TAMBAHKAN ACCESSOR BARU INI ▼▼▼ ---
    /**
     * Accessor untuk mendapatkan rentang tanggal pendaftaran yang sudah diformat.
     */
    public function getRegistrationDateRangeAttribute()
    {
        if ($this->pendaftaran_dibuka->equalTo($this->pendaftaran_ditutup)) {
            return $this->pendaftaran_dibuka->format('d M Y');
        }
        return $this->pendaftaran_dibuka->format('d M') . ' - ' . $this->pendaftaran_ditutup->format('d M Y');
    }
    // --- ▲▲▲ AKHIR DARI PENAMBAHAN ---


    /**
     * Check if event is active.
     */
    public function isActive()
    {
        $now = Carbon::now()->toDateString();
        return $this->tanggal_mulai_acara <= $now && $this->tanggal_selesai_acara >= $now;
    }

    /**
     * Check if event is upcoming.
     */
    public function isUpcoming()
    {
        return $this->tanggal_mulai_acara > Carbon::now()->toDateString();
    }

    public function prunable()
    {
        return static::where('deleted_at', '<=', now()->subDays(20));
    }

    /**
     * Menerapkan filter pencarian dan status pada query event.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $filters
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nama_event', 'like', '%' . $search . '%')
                    ->orWhere('deskripsi_event', 'like', '%' . $search . '%')
                    ->orWhere('lokasi_event', 'like', '%' . $search . '%');
            });
        });

        $query->when($filters['status'] ?? false, function ($query, $status) {
            $query->where('status', $status);
        });

        return $query;
    }
}
