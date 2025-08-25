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
    protected $fillable = [
        'user_id',
        'nama_event',
        'deskripsi_event',
        'poster_event',
        'tanggal_mulai',
        'tanggal_selesai',
        'lokasi_event',
        'biaya_pendaftaran_umkm',
        'kuota_umkm',
        'nama_bank_penyelenggara',
        'nomor_rekening_penyelenggara',
        'nama_pemilik_rekening',
        'status_proposal',
        'status',
        'status_proposal',
        'status',
        'panitia_pin'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'biaya_pendaftaran_umkm' => 'decimal:2',
        'kuota_umkm' => 'integer',
    ];

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
            ->wherePivot('status', 'approved')
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
    public function getDateRangeAttribute()
    {
        if ($this->tanggal_mulai->equalTo($this->tanggal_selesai)) {
            return $this->tanggal_mulai->format('d M Y');
        }
        return $this->tanggal_mulai->format('d M') . ' - ' . $this->tanggal_selesai->format('d M Y');
    }

    /**
     * Check if event is active.
     */
    public function isActive()
    {
        $now = Carbon::now()->toDateString();
        return $this->tanggal_mulai <= $now && $this->tanggal_selesai >= $now;
    }

    /**
     * Check if event is upcoming.
     */
    public function isUpcoming()
    {
        return $this->tanggal_mulai > Carbon::now()->toDateString();
    }

    public function prunable()
    {
        // Hapus permanen semua event yang di-soft delete
        // lebih dari 30 hari yang lalu.
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
        // Filter berdasarkan kata kunci pencarian
        $query->when($filters['search'] ?? false, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nama_event', 'like', '%' . $search . '%')
                    ->orWhere('deskripsi_event', 'like', '%' . $search . '%')
                    ->orWhere('lokasi_event', 'like', '%' . $search . '%');
            });
        });

        // Filter berdasarkan status event
        $query->when($filters['status'] ?? false, function ($query, $status) {
            $query->where('status', $status);
        });

        return $query;
    }
}
