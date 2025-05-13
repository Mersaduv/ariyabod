<?php

use App\Http\Controllers\Admin\CircleController;
use App\Http\Controllers\FooterDesignController;
use App\Http\Controllers\GeneralDesignController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiteItemController;
use App\Models\Circle;
use App\Models\CircleItem;
use App\Models\Setting;
use App\Models\Visit;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware(['log.visit'])->group(function () {
    Route::get('/', function () {
        $headerSetting = Setting::where('key', 'header')->first();

        $headerData = $headerSetting ? json_decode($headerSetting->value, true) : [];
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'headerData' => $headerData,
        ]);
    });

    // about, contact
});

Route::middleware(['auth', 'log.visit'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware(['auth', 'admin', 'log.visit'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
});



Route::middleware(['auth', 'admin', 'log.visit'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Admin/Dashboard'))->name('dashboard');
    // Route::get('/banners', fn() => Inertia::render('Admin/Banners'))->name('banners');
    Route::get('/users', fn() => Inertia::render('Admin/Users'))->name('users');
});

Route::middleware(['auth', 'admin', 'log.visit'])->get('/admin/dashboard', function (\Illuminate\Http\Request $request) {
    $filter = $request->query('filter', 'month');

    $to = now();

    $from = match ($filter) {
        'day' => $to->copy()->subDay(),
        'week' => $to->copy()->subWeek(),
        'year' => $to->copy()->subYear(),
        default => $to->copy()->subMonth(),
    };

    $rawData = Visit::whereBetween('visited_at', [$from, $to])
        ->select(DB::raw('DATE(visited_at) as date'), DB::raw('COUNT(*) as count'))
        ->groupBy('date')
        ->pluck('count', 'date');

    $period = new \DatePeriod(
        $from->copy()->startOfDay(),
        new \DateInterval('P1D'),
        $to->copy()->addDay()->startOfDay()
    );

    $visitStats = collect();
    foreach ($period as $date) {
        $formatted = $date->format('Y-m-d');
        $visitStats->push([
            'date' => $formatted,
            'count' => $rawData[$formatted] ?? 0,
        ]);
    }

    return Inertia::render('Admin/Dashboard', [
        'visitStats' => $visitStats,
        'selectedFilter' => $filter,
    ]);
})->name('admin.dashboard');

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/general-design', [GeneralDesignController::class, 'edit'])->name('general-design');
    Route::post('/general-design', [GeneralDesignController::class, 'update'])->name('general-design.save');
    Route::post('/footer-design', [FooterDesignController::class, 'update'])->name('footer-design.save');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/site-items', [SiteItemController::class, 'index'])->name('site-items.index');
    Route::post('/site-items', [SiteItemController::class, 'store'])->name('site-items.store');
    Route::post('/site-items/upload', [SiteItemController::class, 'upload'])->name('site-items.upload');

    Route::delete('/site-items/{siteItem}', [SiteItemController::class, 'destroy'])->name('site-items.destroy');
});



require __DIR__ . '/auth.php';
