<?php
// app/Models/EventRegistration.php

namespace App\Models;

use App\Models\Concerns\HasHashids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventRegistration extends Model
{
    use HasFactory, HasHashids;

    protected $fillable = [
        'event_id',
        'umkm_profile_id',
        'status',
        'notes',
        'kode_pendaftaran',
        'bukti_pembayaran_path',
        'nomor_stand',
        'kode_pin',
        'payment_due',
        'rejection_reason',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'payment_due' => 'datetime',
    ];

    // Relationship dengan Event
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    // Relationship dengan UMKM Profile
    public function umkmProfile()
    {
        return $this->belongsTo(UmkmProfile::class);
    }

    // Check if registration is approved
    public function isApproved()
    {
        return $this->status === 'approved';
    }

    // Check if registration is pending
    public function isPending()
    {
        return $this->status === 'registered';
    }
}
