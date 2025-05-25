<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $isAdminRoute = $request->is('admin/*') || $request->is('admin');

        $headerData = null;
        $footerData = null;

        if (!$isAdminRoute) {
            $headerSetting = Setting::where('key', 'header')->first();
            $footerSetting = Setting::where('key', 'footer')->first();
            $headerData = $headerSetting ? json_decode($headerSetting->value, true) : [];
            $footerData = $footerSetting ? json_decode($footerSetting->value, true) : [];
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
            ],
            'headerData' => $headerData,
            'footerData' => $footerData,
        ]);
    }
}
