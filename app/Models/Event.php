<?php
// app/Models/Event.php

namespace App\Models;

use App\Models\Concerns\HasHashids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Prunable;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasFactory, SoftDeletes, Prunable, HasHashids;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nama_event',
        'slug',
        'deskripsi_event',
        'poster_event',
        'proposal_document_path',
        'pendaftaran_dibuka',
        'pendaftaran_ditutup',
        'tanggal_mulai_acara',
        'tanggal_selesai_acara',
        'lokasi_event',
        'biaya_pendaftaran_umkm',
        'kuota_umkm',
        'nama_bank_penyelenggara',
        'nomor_rekening_penyelenggara',
        'nama_pemilik_rekening',
        'status_proposal',
        'document_verification_status',
        'rejection_reason',
        'document_rejection_reason',
        'status',
        'panitia_pin',
        'latitude',
        'longitude',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'pendaftaran_dibuka' => 'date',
        'pendaftaran_ditutup' => 'date',
        'tanggal_mulai_acara' => 'date',
        'tanggal_selesai_acara' => 'date',
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
    public function getEventDateRangeAttribute()
    {
        if ($this->tanggal_mulai_acara->equalTo($this->tanggal_selesai_acara)) {
            return $this->tanggal_mulai_acara->format('d M Y');
        }
        return $this->tanggal_mulai_acara->format('d M') . ' - ' . $this->tanggal_selesai_acara->format('d M Y');
    }

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

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            $event->slug = Str::slug($event->nama_event . '-' . uniqid());
        });

        static::updating(function ($event) {
            if ($event->isDirty('nama_event')) {
                $event->slug = Str::slug($event->nama_event . '-' . uniqid());
            }
        });
    }
}
