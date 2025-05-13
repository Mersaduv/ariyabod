<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;

class SetLanguageFromHeader
{
    public function handle($request, Closure $next)
    {
        $lang = $request->header('X-Language', 'fa'); // پیش‌فرض fa

        if (in_array($lang, ['fa', 'en', 'ps'])) {
            App::setLocale($lang);
        }

        return $next($request);
    }
}

