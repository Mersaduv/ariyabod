<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Visit;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class LogVisit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::id()) {
            Visit::create([
                'ip_address' => $request->ip(),
                'user_id' => Auth::id(),
                'url' => $request->path(),
                'visited_at' => Carbon::now(),
            ]);
        }

        return $next($request);
    }
}
