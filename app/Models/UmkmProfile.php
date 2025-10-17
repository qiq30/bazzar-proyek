<?php
// app/Models/UmkmProfile.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UmkmProfile extends Model
{
    use HasFactory;

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
        return $this->logo_path ? Storage::url($this->logo_path) : null;
    }

    public function getQrisUrlAttribute()
    {
        return $this->qris_path ? Storage::url($this->qris_path) : null;
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
