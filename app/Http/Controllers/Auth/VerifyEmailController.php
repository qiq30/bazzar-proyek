<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->redirectUser($request->user(), '?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return $this->redirectUser($request->user(), '?verified=1');
    }

    /**
     * Redirect user to the correct dashboard.
     */
    protected function redirectUser($user, string $suffix = ''): RedirectResponse
    {
        $home = match (true) {
            $user->is_admin => route('admin.dashboard'),
            $user->is_penyelenggara => route('penyelenggara.dashboard'),
            default => route('umkm.dashboard'),
        };

        return redirect()->intended($home . $suffix);
    }
}
