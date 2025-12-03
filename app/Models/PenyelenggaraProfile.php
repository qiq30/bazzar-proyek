<?php

// app/Models/PenyelenggaraProfile.php
namespace App\Models;

use App\Models\Concerns\HasHashids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PenyelenggaraProfile extends Model
{
    use HasFactory, HasHashids;

    const STATUS_VERIFIED = 'verified';
    const STATUS_PENDING = 'pending';
    const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'user_id',
        'organizer_name',
        'description',
        'address',
        'logo_path',
        'verification_document_path',
        'status',
        'rejection_reason',
    ];

    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute()
    {
        if ($this->logo_path) {
            return $this->logo_path ? Storage::url($this->logo_path) : null;
        }
        return null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
