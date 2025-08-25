<?php
// app/Models/Product.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'umkm_profile_id',
        'name',
        'description',
        'price',
        'image_path',
    ];

    /**
     * Get the full URL for the product image.
     */
    public function getImageUrlAttribute()
    {
        if ($this->image_path) {
            return Storage::url($this->image_path);
        }
        return null;
    }

    /**
     * Append attributes to the model's array form.
     */
    protected $appends = ['image_url'];

    public function umkmProfile()
    {
        return $this->belongsTo(UmkmProfile::class);
    }
}
