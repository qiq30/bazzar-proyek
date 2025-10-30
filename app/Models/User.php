<?php
// app/Models/User.php

namespace App\Models;

use App\Models\Concerns\HasHashids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasHashids;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'google_id',
        'google_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'otp_code',
        'otp_expires_at',
        'google_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'is_penyelenggara' => 'boolean',
            'is_super_admin' => 'boolean',
            'otp' => 'string',
            'otp_expires_at' => 'datetime',
            'google_id' => 'string',
            'google_token' => 'string',
        ];
    }

    /**
     * Override the default notifications relationship.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class)->orderBy('created_at', 'desc');
    }

    /**
     * Get the user's unread notifications.
     */
    public function unreadNotifications()
    {
        return $this->notifications()->whereNull('read_at');
    }

    // Relationship dengan UMKM Profile
    public function umkmProfile()
    {
        return $this->hasOne(UmkmProfile::class);
    }

    // Relationship dengan Penyelenggara Profile
    public function penyelenggaraProfile()
    {
        return $this->hasOne(PenyelenggaraProfile::class);
    }

    // Check if user is admin
    public function isAdmin()
    {
        return $this->is_admin;
    }

    // Check if user has UMKM profile
    public function hasUmkmProfile()
    {
        return $this->umkmProfile !== null;
    }
}
