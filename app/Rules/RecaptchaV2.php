<?php
// app/Rules/RecaptchaV2.php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Http;

class RecaptchaV2 implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // Jangan jalankan validasi jika environment adalah testing
        if (app()->environment('testing')) {
            return true;
        }

        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => env('RECAPTCHA_V2_SECRET_KEY'),
            'response' => $value,
            'remoteip' => request()->ip(),
        ]);

        return $response->json('success');
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Verifikasi reCAPTCHA gagal. Silakan coba lagi.';
    }
}
