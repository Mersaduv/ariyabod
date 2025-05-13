<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App;
use Str;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->header('X-Language', 'fa');

        if (in_array($locale, ['fa', 'en', 'ps'])) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}
