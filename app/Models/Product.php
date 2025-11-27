<?php
// app/Models/Product.php

namespace App\Models;

use App\Models\Concerns\HasHashids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory, HasHashids;

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
            return route('public.product.image', ['product' => $this->hashid]);
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
