<?php

use App\Http\Controllers\Admin\CircleController;
use App\Http\Controllers\ContactUsController;
use App\Http\Controllers\FooterDesignController;
use App\Http\Controllers\FestivalController;
use App\Http\Controllers\GeneralDesignController;
use App\Http\Controllers\InternetPackageWebController;
use App\Http\Controllers\InternetRequestController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiteItemController;
use App\Models\Circle;
use App\Models\CircleItem;
use App\Models\InternetPackage;
use App\Models\Setting;
use App\Models\SiteItem;
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
        $circleItems = SiteItem::where('type', 'circle')->get();
        $servicesItems = SiteItem::where('type', 'service')->get();
        $internetPackages = InternetPackage::all();
        // Define provinces list
        $provincesList = [
            'kabul' => ['en' => 'Kabul', 'fa' => 'کابل', 'ps' => 'کابل'],
            'herat' => ['en' => 'Herat', 'fa' => 'هرات', 'ps' => 'هرات'],
            'mazar' => ['en' => 'Mazar-i-Sharif', 'fa' => 'مزار شریف', 'ps' => 'مزار شریف'],
            'kandahar' => ['en' => 'Kandahar', 'fa' => 'قندهار', 'ps' => 'کندهار'],
            'jalalabad' => ['en' => 'Jalalabad', 'fa' => 'جلال آباد', 'ps' => 'جلال آباد'],
            'kunduz' => ['en' => 'Kunduz', 'fa' => 'کندز', 'ps' => 'کندز'],
            'ghazni' => ['en' => 'Ghazni', 'fa' => 'غزنی', 'ps' => 'غزني'],
            'balkh' => ['en' => 'Balkh', 'fa' => 'بلخ', 'ps' => 'بلخ'],
            'baghlan' => ['en' => 'Baghlan', 'fa' => 'بغلان', 'ps' => 'بغلان'],
            'bamyan' => ['en' => 'Bamyan', 'fa' => 'بامیان', 'ps' => 'بامیان'],
        ];
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'circleItems' => $circleItems,
            'servicesItems' => $servicesItems,
            'internetPackages' => $internetPackages,
            'provinces' => $provincesList,
        ]);
    });

    // V2 Homepage Route
    Route::get('/v2', function () {
        $circleItems = SiteItem::where('type', 'circle')->get();
        $servicesItems = SiteItem::where('type', 'service')->get();
        $sliderItems = SiteItem::where('type', 'slider')->where('status', true)->orderBy('order')->get();
        $sliderBackground = Setting::where('key', 'slider_background')->first()?->value;
        $internetPackages = InternetPackage::all();
        // Define provinces list
        $provincesList = [
            'kabul' => ['en' => 'Kabul', 'fa' => 'کابل', 'ps' => 'کابل'],
            'herat' => ['en' => 'Herat', 'fa' => 'هرات', 'ps' => 'هرات'],
            'mazar' => ['en' => 'Mazar-i-Sharif', 'fa' => 'مزار شریف', 'ps' => 'مزار شریف'],
            'kandahar' => ['en' => 'Kandahar', 'fa' => 'قندهار', 'ps' => 'کندهار'],
            'jalalabad' => ['en' => 'Jalalabad', 'fa' => 'جلال آباد', 'ps' => 'جلال آباد'],
            'kunduz' => ['en' => 'Kunduz', 'fa' => 'کندز', 'ps' => 'کندز'],
            'ghazni' => ['en' => 'Ghazni', 'fa' => 'غزنی', 'ps' => 'غزني'],
            'balkh' => ['en' => 'Balkh', 'fa' => 'بلخ', 'ps' => 'بلخ'],
            'baghlan' => ['en' => 'Baghlan', 'fa' => 'بغلان', 'ps' => 'بغلان'],
            'bamyan' => ['en' => 'Bamyan', 'fa' => 'بامیان', 'ps' => 'بامیان'],
        ];
        return Inertia::render('WelcomeV2', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'circleItems' => $circleItems,
            'servicesItems' => $servicesItems,
            'internetPackages' => $internetPackages,
            'provinces' => $provincesList,
            'sliderItems' => $sliderItems,
            'sliderBackground' => $sliderBackground,
        ]);
    })->name('homepage.v2');

    // V2 nested routes
    Route::prefix('v2')->group(function () {
        // V2 Packages route
        Route::get('/packages', function () {
            $internetPackages = InternetPackage::all();
            $servicesItems = SiteItem::where('type', 'service')->get();

            // Define provinces list
            $provincesList = [
                'kabul' => ['en' => 'Kabul', 'fa' => 'کابل', 'ps' => 'کابل'],
                'herat' => ['en' => 'Herat', 'fa' => 'هرات', 'ps' => 'هرات'],
                'mazar' => ['en' => 'Mazar-i-Sharif', 'fa' => 'مزار شریف', 'ps' => 'مزار شریف'],
                'kandahar' => ['en' => 'Kandahar', 'fa' => 'قندهار', 'ps' => 'کندهار'],
                'jalalabad' => ['en' => 'Jalalabad', 'fa' => 'جلال آباد', 'ps' => 'جلال آباد'],
                'kunduz' => ['en' => 'Kunduz', 'fa' => 'کندز', 'ps' => 'کندز'],
                'ghazni' => ['en' => 'Ghazni', 'fa' => 'غزنی', 'ps' => 'غزني'],
                'balkh' => ['en' => 'Balkh', 'fa' => 'بلخ', 'ps' => 'بلخ'],
                'baghlan' => ['en' => 'Baghlan', 'fa' => 'بغلان', 'ps' => 'بغلان'],
                'bamyan' => ['en' => 'Bamyan', 'fa' => 'بامیان', 'ps' => 'بامیان'],
            ];

            // Get unique provinces and types for filters
            $allProvinces = [];
            foreach ($internetPackages as $package) {
                if (!empty($package->provinces) && is_array($package->provinces)) {
                    foreach ($package->provinces as $province) {
                        if (!empty($province) && isset($provincesList[$province])) {
                            $allProvinces[$province] = $provincesList[$province];
                        }
                    }
                }
            }

            $types = InternetPackage::distinct('type')->whereNotNull('type')->pluck('type');

            return Inertia::render('Packages', [
                'internetPackages' => $internetPackages,
                'provinces' => $allProvinces,
                'types' => $types,
                'servicesItems' => $servicesItems,
            ]);
        })->name('v2.packages');

        // V2 Network Test route
        Route::get('/network-test', function () {
            $servicesItems = SiteItem::where('type', 'service')->get();
            return Inertia::render('NetworkTest', [
                'servicesItems' => $servicesItems,
            ]);
        })->name('v2.network-test');

        // V2 Calculate Bundle route
        Route::get('/calculate-bundle', function () {
            // Get active speed options for calculator
            $speedOptions = App\Models\SpeedOption::getActiveOptions();
            $servicesItems = SiteItem::where('type', 'service')->get();

            return Inertia::render('CalculateBundle', [
                'speedOptions' => $speedOptions,
                'servicesItems' => $servicesItems,
            ]);
        })->name('v2.calculate-bundle');

        // V2 Internet Bandwidth Calculator route
        Route::get('/bandwidth-calculator', function () {
            // Get active speed options for calculator
            $speedOptions = App\Models\SpeedOption::getActiveOptions();
            $servicesItems = SiteItem::where('type', 'service')->get();

            return Inertia::render('InternetBandwidthCalculator', [
                'speedOptions' => $speedOptions,
                'servicesItems' => $servicesItems,
            ]);
        })->name('v2.bandwidth-calculator');

        // V2 Internet Request route
        Route::get('/request-internet', [InternetRequestController::class, 'show'])->name('v2.request-internet');
        Route::post('/request-internet', [InternetRequestController::class, 'submit'])->name('v2.request-internet.submit');

        // V2 about, contact
        Route::get('/about-us', function () {
            $servicesItems = SiteItem::where('type', 'service')->get();
            return Inertia::render('AboutUs', [
                'servicesItems' => $servicesItems,
            ]);
        })->name('v2.about-us');

        Route::get('/contact-us', function () {
            $servicesItems = SiteItem::where('type', 'service')->get();
            return Inertia::render('ContactUs', [
                'servicesItems' => $servicesItems,
            ]);
        })->name('v2.contact-us');
        Route::post('/contact-us', [ContactUsController::class, 'submit'])->name('v2.contact-us.submit');
        Route::get('/profile', [ProfileController::class, 'edit'])->name('v2.profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('v2.profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('v2.profile.destroy');
    });

    // Packages route
    Route::get('/packages', function () {
        $internetPackages = InternetPackage::all();
        $servicesItems = SiteItem::where('type', 'service')->get();

        // Define provinces list
        $provincesList = [
            'kabul' => ['en' => 'Kabul', 'fa' => 'کابل', 'ps' => 'کابل'],
            'herat' => ['en' => 'Herat', 'fa' => 'هرات', 'ps' => 'هرات'],
            'mazar' => ['en' => 'Mazar-i-Sharif', 'fa' => 'مزار شریف', 'ps' => 'مزار شریف'],
            'kandahar' => ['en' => 'Kandahar', 'fa' => 'قندهار', 'ps' => 'کندهار'],
            'jalalabad' => ['en' => 'Jalalabad', 'fa' => 'جلال آباد', 'ps' => 'جلال آباد'],
            'kunduz' => ['en' => 'Kunduz', 'fa' => 'کندز', 'ps' => 'کندز'],
            'ghazni' => ['en' => 'Ghazni', 'fa' => 'غزنی', 'ps' => 'غزني'],
            'balkh' => ['en' => 'Balkh', 'fa' => 'بلخ', 'ps' => 'بلخ'],
            'baghlan' => ['en' => 'Baghlan', 'fa' => 'بغلان', 'ps' => 'بغلان'],
            'bamyan' => ['en' => 'Bamyan', 'fa' => 'بامیان', 'ps' => 'بامیان'],
        ];

        // Get unique provinces and types for filters
        $allProvinces = [];
        foreach ($internetPackages as $package) {
            if (!empty($package->provinces) && is_array($package->provinces)) {
                foreach ($package->provinces as $province) {
                    if (!empty($province) && isset($provincesList[$province])) {
                        $allProvinces[$province] = $provincesList[$province];
                    }
                }
            }
        }

        $types = InternetPackage::distinct('type')->whereNotNull('type')->pluck('type');

        return Inertia::render('Packages', [
            'internetPackages' => $internetPackages,
            'provinces' => $allProvinces,
            'types' => $types,
            'servicesItems' => $servicesItems,
        ]);
    })->name('packages');

    // Network Test route
    Route::get('/network-test', function () {
        $servicesItems = SiteItem::where('type', 'service')->get();
        return Inertia::render('NetworkTest', [
            'servicesItems' => $servicesItems,
        ]);
    })->name('network-test');

    // Calculate Bundle route
    Route::get('/calculate-bundle', function () {
        // Get active speed options for calculator
        $speedOptions = App\Models\SpeedOption::getActiveOptions();
        $servicesItems = SiteItem::where('type', 'service')->get();

        return Inertia::render('CalculateBundle', [
            'speedOptions' => $speedOptions,
            'servicesItems' => $servicesItems,
        ]);
    })->name('calculate-bundle');

    // Internet Bandwidth Calculator route
    Route::get('/bandwidth-calculator', function () {
        // Get active speed options for calculator
        $speedOptions = App\Models\SpeedOption::getActiveOptions();
        $servicesItems = SiteItem::where('type', 'service')->get();

        return Inertia::render('InternetBandwidthCalculator', [
            'speedOptions' => $speedOptions,
            'servicesItems' => $servicesItems,
        ]);
    })->name('bandwidth-calculator');

    // Internet Request route
    Route::get('/request-internet', [InternetRequestController::class, 'show'])->name('request-internet');
    Route::post('/request-internet', [InternetRequestController::class, 'submit'])->name('request-internet.submit');

    // about, contact
    Route::get('/about-us', function () {
        $servicesItems = SiteItem::where('type', 'service')->get();
        return Inertia::render('AboutUs', [
            'servicesItems' => $servicesItems,
        ]);
    })->name('about-us');

    Route::get('/contact-us', function () {
        $servicesItems = SiteItem::where('type', 'service')->get();
        return Inertia::render('ContactUs', [
            'servicesItems' => $servicesItems,
        ]);
    })->name('contact-us');
    Route::post('/contact-us', [ContactUsController::class, 'submit'])->name('contact-us.submit');
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

    // User routes
    Route::get('/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('users');
    Route::get('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'show'])->name('users.show');
    Route::patch('/users/{user}/toggle-role', [App\Http\Controllers\Admin\UserController::class, 'toggleRole'])->name('users.toggle-role');
    Route::delete('/users/{user}', [App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
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
    Route::post('/footer-design/upload', [FooterDesignController::class, 'upload'])->name('footer-design.upload');

    // Slider Items routes
    Route::get('/slider-items', [\App\Http\Controllers\SliderItemController::class, 'index'])->name('slider-items.index');
    Route::post('/slider-items', [\App\Http\Controllers\SliderItemController::class, 'store'])->name('slider-items.store');
    Route::post('/slider-items/upload', [\App\Http\Controllers\SliderItemController::class, 'upload'])->name('slider-items.upload');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/site-items', [SiteItemController::class, 'index'])->name('site-items.index');
    Route::post('/site-items', [SiteItemController::class, 'store'])->name('site-items.store');
    Route::post('/site-items/upload', [SiteItemController::class, 'upload'])->name('site-items.upload');

    Route::delete('/site-items/{siteItem}', [SiteItemController::class, 'destroy'])->name('site-items.destroy');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/internet-packages', [InternetPackageWebController::class, 'index'])->name('internet-packages.index');
    Route::get('/internet-packages/create', [InternetPackageWebController::class, 'create'])->name('internet-packages.create');
    Route::post('/internet-packages', [InternetPackageWebController::class, 'store'])->name('internet-packages.store');
    Route::get('/internet-packages/{internetPackage}/edit', [InternetPackageWebController::class, 'edit'])->name('internet-packages.edit');
    Route::put('/internet-packages/{internetPackage}', [InternetPackageWebController::class, 'update'])->name('internet-packages.update');
    Route::delete('/internet-packages/{internetPackage}', [InternetPackageWebController::class, 'destroy'])->name('internet-packages.destroy');

    // Speed options routes
    Route::get('/speed-options', [InternetPackageWebController::class, 'getSpeedOptions'])->name('speed-options.index');
    Route::post('/speed-options', [InternetPackageWebController::class, 'storeSpeedOption'])->name('speed-options.store');
    Route::put('/speed-options/{speedOption}', [InternetPackageWebController::class, 'updateSpeedOption'])->name('speed-options.update');
    Route::delete('/speed-options/{speedOption}', [InternetPackageWebController::class, 'destroySpeedOption'])->name('speed-options.destroy');

    // Festival routes
    Route::resource('festivals', FestivalController::class);
    Route::post('/festivals/{festival}/packages', [FestivalController::class, 'attachPackages'])->name('festivals.packages.attach');
    Route::delete('/festivals/{festival}/packages/{internetPackage}', [FestivalController::class, 'detachPackage'])->name('festivals.packages.detach');
    Route::post('/festivals/upload', [FestivalController::class, 'upload'])->name('festivals.upload');
});



require __DIR__ . '/auth.php';

// V2 auth routes
Route::prefix('v2')->middleware(['log.visit'])->group(function () {
    Route::get('/login', function () {
        $servicesItems = SiteItem::where('type', 'service')->get();
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'servicesItems' => $servicesItems,
        ]);
    })->middleware('guest')->name('v2.login');

    Route::post('/login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store'])
        ->middleware('guest')
        ->name('v2.login.store');

    Route::get('/register', function () {
        $servicesItems = SiteItem::where('type', 'service')->get();
        return Inertia::render('Auth/Register', [
            'servicesItems' => $servicesItems,
        ]);
    })->middleware('guest')->name('v2.register');

    Route::post('/register', [App\Http\Controllers\Auth\RegisteredUserController::class, 'store'])
        ->middleware('guest')
        ->name('v2.register.store');

    Route::get('/forgot-password', function () {
        $servicesItems = SiteItem::where('type', 'service')->get();
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            'servicesItems' => $servicesItems,
        ]);
    })->middleware('guest')->name('v2.password.request');

    Route::post('/forgot-password', [App\Http\Controllers\Auth\PasswordResetLinkController::class, 'store'])
        ->middleware('guest')
        ->name('v2.password.email');

    Route::get('/reset-password/{token}', function (string $token) {
        $servicesItems = SiteItem::where('type', 'service')->get();
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => request()->input('email'),
            'servicesItems' => $servicesItems,
        ]);
    })->middleware('guest')->name('v2.password.reset');

    Route::post('/reset-password', [App\Http\Controllers\Auth\NewPasswordController::class, 'store'])
        ->middleware('guest')
        ->name('v2.password.store');

    Route::get('/verify-email', function () {
        $servicesItems = SiteItem::where('type', 'service')->get();
        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status'),
            'servicesItems' => $servicesItems,
        ]);
    })->middleware('auth')->name('v2.verification.notice');

    Route::get('/verify-email/{id}/{hash}', [App\Http\Controllers\Auth\VerifyEmailController::class, 'verify'])
        ->middleware(['auth', 'signed', 'throttle:6,1'])
        ->name('v2.verification.verify');

    Route::post('/email/verification-notification', [App\Http\Controllers\Auth\EmailVerificationNotificationController::class, 'store'])
        ->middleware(['auth', 'throttle:6,1'])
        ->name('v2.verification.send');

    Route::get('/confirm-password', function () {
        $servicesItems = SiteItem::where('type', 'service')->get();
        return Inertia::render('Auth/ConfirmPassword', [
            'servicesItems' => $servicesItems,
        ]);
    })->middleware('auth')->name('v2.password.confirm');

    Route::post('/confirm-password', [App\Http\Controllers\Auth\ConfirmablePasswordController::class, 'store'])
        ->middleware('auth')
        ->name('v2.password.confirm.store');

    Route::post('/logout', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'destroy'])
        ->middleware('auth')
        ->name('v2.logout');
});
