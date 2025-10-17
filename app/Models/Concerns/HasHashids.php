<?php

namespace App\Models\Concerns;

use Vinkla\Hashids\Facades\Hashids;

trait HasHashids
{
    /**
     * Boot the trait.
     */
    public function initializeHasHashids()
    {
        $this->append('hashid');
    }

    /**
     * Override the default route model binding resolution.
     *
     * @param  string  $value
     * @param  string|null  $field
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function resolveRouteBinding($value, $field = null)
    {
        // Jika route key adalah 'hashid', kita decode secara manual.
        if ($field === 'hashid') {
            $decodedId = Hashids::decode($value)[0] ?? null;
            return $this->where($this->getKeyName(), $decodedId)->first();
        }

        // Untuk semua field lain (seperti 'slug' atau 'id'),
        // biarkan Laravel menanganinya seperti biasa.
        return parent::resolveRouteBinding($value, $field);
    }

    /**
     * Accessor untuk mendapatkan hashid.
     *
     * @return string
     */
    public function getHashidAttribute()
    {
        return Hashids::encode($this->getKey());
    }
}
