<?php
// app/Models/UmkmProfile.php

namespace App\Models;

use App\Models\Concerns\HasHashids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UmkmProfile extends Model
{
    use HasFactory, HasHashids;

    protected $fillable = [
        'user_id',
        'business_name',
        'slug',
        'logo_path',
        'ktp_path',
        'description',
        'qris_path',
        'status',
        'address',
        'business_type',
        'rejection_reason',
    ];

    /**
     * Append attributes to the model's array form.
     *
     * @var array
     */
    protected $appends = ['logo_url', 'qris_url'];

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
            ->withPivot('id', 'status', 'notes', 'rejection_reason') // Tambahkan rejection_reason
            ->withTimestamps();
    }

    public function isVerified()
    {
        return $this->status === 'verified';
    }

    public function getLogoUrlAttribute()
    {
        if ($this->logo_path) {
            return route('public.umkm.logo', ['umkm' => $this->hashid]);
        }
        return null;
    }

    public function getQrisUrlAttribute()
    {
        if ($this->qris_path) {
            return route('public.umkm.qris', ['umkm' => $this->hashid]);
        }
        return null;
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

        static::creating(function ($profile) {
            $profile->slug = Str::slug($profile->business_name . '-' . uniqid());
        });

        static::updating(function ($profile) {
            if ($profile->isDirty('business_name')) {
                $profile->slug = Str::slug($profile->business_name . '-' . uniqid());
            }
        });
    }
}
