<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        $servicesItems = \App\Models\SiteItem::where('type', 'service')->get();

        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            'servicesItems' => $servicesItems,
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(ForgotPasswordRequest $request): RedirectResponse
{
    $status = Password::sendResetLink($request->only('email'));

    if ($status == Password::RESET_LINK_SENT) {
        return back()->with('status', __($status));
    }

    throw ValidationException::withMessages([
        'email' => [trans($status)],
    ]);
}
}
