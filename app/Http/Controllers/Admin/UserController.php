<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        // Get fresh data without any caching
        $users = User::withCount(['visits' => function($query) {
                $query->where('visited_at', '<=', now());
            }])
            ->get()
            ->map(function ($user) {
                // Get the latest visit directly from the database to avoid stale data
                $latestVisit = Visit::where('user_id', $user->id)
                    ->orderBy('visited_at', 'desc')
                    ->first();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'visits_count' => $user->visits_count,
                    'last_activity' => $latestVisit ? [
                        'visited_at' => $latestVisit->visited_at,
                    ] : null,
                ];
            });

        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    /**
     * Show the details of a specific user.
     */
    public function show(User $user)
    {
        // Get the latest visit directly from the database
        $latestVisit = Visit::where('user_id', $user->id)
            ->orderBy('visited_at', 'desc')
            ->first();

        // Get recent visits
        $recentVisits = Visit::where('user_id', $user->id)
            ->orderBy('visited_at', 'desc')
            ->take(20)
            ->get()
            ->map(function ($visit) {
                return [
                    'id' => $visit->id,
                    'url' => $visit->url,
                    'ip_address' => $visit->ip_address,
                    'visited_at' => $visit->visited_at,
                ];
            });

        return Inertia::render('Admin/UserDetail', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'email_verified_at' => $user->email_verified_at,
                'last_activity' => $latestVisit ? [
                    'visited_at' => $latestVisit->visited_at,
                ] : null,
                'visits' => $recentVisits,
            ]
        ]);
    }

    /**
     * Toggle user role between 'user' and 'admin'.
     */
    public function toggleRole(User $user)
    {
        $user->role = $user->role === 'admin' ? 'user' : 'admin';
        $user->save();

        return back()->with('success', 'نقش کاربر با موفقیت تغییر کرد.');
    }

    /**
     * Delete a user.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users')->with('success', 'کاربر با موفقیت حذف شد.');
    }
}
