<?php
// app/Models/UmkmProfile.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class UmkmProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'logo_path',
        'ktp_path',
        'description',
        'qris_path',
        'status',
        'address',
        'business_type',
    ];

    /**
     * Append attributes to the model's array form.
     *
     * @var array
     */
    protected $appends = ['logo_url', 'qris_url'];

    // ... (relasi lainnya)

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function eventRegistrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_registrations')
            ->withPivot('id', 'status', 'notes') // Tambahkan 'id' di sini
            ->withTimestamps();
    }

    public function isVerified()
    {
        return $this->status === 'verified';
    }

    // 🔽 Perubahan: Menggunakan Storage::url() untuk path yang benar
    public function getLogoUrlAttribute()
    {
        return $this->logo_path ? Storage::url($this->logo_path) : null;
    }

    // 🔽 Perubahan: Menggunakan Storage::url() untuk path yang benar
    public function getQrisUrlAttribute()
    {
        return $this->qris_path ? Storage::url($this->qris_path) : null;
    }
}
