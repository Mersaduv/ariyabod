<?php

namespace App\Http\Controllers;

use App\Models\InternetPackage;
use App\Models\Festival;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class InternetPackageWebController extends Controller
{
    // Private method to get provinces list
    private function getProvincesList()
    {
        return [
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
    }

    public function index()
    {
        $packages = InternetPackage::with('festivals')->get();

        // فقط جشنواره‌های فعال
        $festivals = Festival::where('is_active', true)->latest()->get();
        $provinces = $this->getProvincesList();

        return Inertia::render('Admin/InternetPackages/Index', [
            'internetPackages' => $packages,
            'festivals' => $festivals,
            'provinces' => $provinces
        ]);
    }

    public function create()
    {
        // فقط جشنواره‌های فعال
        $festivals = Festival::where('is_active', true)->latest()->get();
        $provinces = $this->getProvincesList();

        return Inertia::render('Admin/InternetPackages/Create', [
            'festivals' => $festivals,
            'provinces' => $provinces
        ]);
    }

    public function store(Request $request)
    {
        // Debug received data
        Log::info('Create - Festival data received:', [
            'festival_id' => $request->input('festival_id'),
            'festival_special_price' => $request->input('festival_special_price'),
            'festival_price' => $request->input('festival_price')
        ]);

        $validated = $request->validate([
            'title' => 'required|array',
            'title.en' => 'required|string',
            'title.fa' => 'required|string',
            'title.ps' => 'required|string',
            'type' => 'required|in:unlimited,volume_fixed,volume_daily',
            'price' => 'required|integer|min:0',
            'duration_days' => 'required|integer|min:1',
            'speed_slots' => 'nullable|array',
            'total_volume_gb' => 'nullable|integer|min:0',
            'daily_limit_gb' => 'nullable|integer|min:0',
            'speed_mb' => 'nullable|integer|min:0',
            'after_daily_limit_speed_mb' => 'nullable|numeric|min:0|required_if:type,volume_daily',
            'is_active' => 'boolean',
            'is_special_offer' => 'boolean',
            'special_offer_title' => 'nullable|string|required_if:is_special_offer,1',
            'special_offer_description' => 'nullable|string',
            'special_offer_start_date' => 'nullable|date|required_if:is_special_offer,1',
            'special_offer_end_date' => 'nullable|date|required_if:is_special_offer,1|after_or_equal:special_offer_start_date',
            'is_featured' => 'boolean',
            'festival_id' => 'nullable|exists:festivals,id',
            'festival_special_price' => 'boolean',
            'festival_price' => 'nullable|integer|min:0|required_if:festival_special_price,1',
            // Night mode fields
            'has_night_free' => 'boolean',
            'is_night_free' => 'boolean',
            'night_free_start_time' => 'nullable|required_if:has_night_free,1|date_format:H:i',
            'night_free_end_time' => 'nullable|required_if:has_night_free,1|date_format:H:i',
            'night_free_speed_mb' => 'nullable|required_if:has_night_free,1|numeric|min:0',
            'provinces' => 'nullable|array',
        ]);

        // Extract festival data
        $festivalId = $validated['festival_id'] ?? null;
        $isSpecialPrice = $validated['festival_special_price'] ?? false;
        $festivalPrice = $validated['festival_price'] ?? null;

        // Log validated festival data
        Log::info('Create - Validated festival data:', [
            'festival_id' => $festivalId,
            'is_special_price' => $isSpecialPrice,
            'festival_price' => $festivalPrice
        ]);

        // Remove festival fields from the validated data
        unset($validated['festival_id']);
        unset($validated['festival_special_price']);
        unset($validated['festival_price']);

        // Create the package
        $package = InternetPackage::create($validated);

        // Attach festival if provided
        if ($festivalId) {
            $pivotData = [
                'is_special_price' => $isSpecialPrice,
                'festival_price' => $isSpecialPrice ? $festivalPrice : null,
            ];

            $package->festivals()->attach($festivalId, $pivotData);

            // Log after attaching
            Log::info('Create - Festival attached:', [
                'package_id' => $package->id,
                'festival_id' => $festivalId,
                'pivot_data' => $pivotData
            ]);
        }

        return redirect()->route('admin.internet-packages.index')->with('success', 'بسته با موفقیت اضافه شد');
    }

    public function edit(InternetPackage $internetPackage)
    {
        $festivals = Festival::where('is_active', true)->latest()->get();
        $provinces = $this->getProvincesList();

        $attachedFestival = $internetPackage->festivals()->first();

        return Inertia::render('Admin/InternetPackages/Edit', [
            'internetPackage' => $internetPackage,
            'festivals' => $festivals,
            'attachedFestival' => $attachedFestival,
            'provinces' => $provinces
        ]);
    }

    public function update(Request $request, InternetPackage $internetPackage)
    {
        // Debug received data
        Log::info('Festival data received:', [
            'festival_id' => $request->input('festival_id'),
            'festival_special_price' => $request->input('festival_special_price'),
            'festival_price' => $request->input('festival_price'),
            'all_data' => $request->all()
        ]);

        $validated = $request->validate([
            'title' => 'sometimes|array',
            'title.en' => 'sometimes|string',
            'title.fa' => 'sometimes|string',
            'title.ps' => 'sometimes|string',
            'type' => 'sometimes|in:unlimited,volume_fixed,volume_daily',
            'price' => 'sometimes|integer|min:0',
            'duration_days' => 'sometimes|integer|min:1',
            'speed_slots' => 'nullable|array',
            'total_volume_gb' => 'nullable|integer|min:0',
            'daily_limit_gb' => 'nullable|integer|min:0',
            'speed_mb' => 'nullable|integer|min:0',
            'after_daily_limit_speed_mb' => 'nullable|numeric|min:0|required_if:type,volume_daily',
            'is_active' => 'boolean',
            'is_special_offer' => 'boolean',
            'special_offer_title' => 'nullable|string|required_if:is_special_offer,1',
            'special_offer_description' => 'nullable|string',
            'special_offer_start_date' => 'nullable|date|required_if:is_special_offer,1',
            'special_offer_end_date' => 'nullable|date|required_if:is_special_offer,1|after_or_equal:special_offer_start_date',
            'is_featured' => 'boolean',
            'festival_id' => 'nullable|exists:festivals,id',
            'festival_special_price' => 'boolean',
            'festival_price' => 'nullable|integer|min:0|required_if:festival_special_price,1',
            // Night mode fields
            'has_night_free' => 'boolean',
            'is_night_free' => 'boolean',
            'night_free_start_time' => 'nullable|required_if:has_night_free,1|date_format:H:i',
            'night_free_end_time' => 'nullable|required_if:has_night_free,1|date_format:H:i',
            'night_free_speed_mb' => 'nullable|required_if:has_night_free,1|numeric|min:0',
            'provinces' => 'nullable|array',
        ]);

        // Extract festival data
        $festivalId = $validated['festival_id'] ?? null;
        $isSpecialPrice = $validated['festival_special_price'] ?? false;
        $festivalPrice = $validated['festival_price'] ?? null;

        // Log validated festival data
        Log::info('Validated festival data:', [
            'festival_id' => $festivalId,
            'is_special_price' => $isSpecialPrice,
            'festival_price' => $festivalPrice
        ]);

        // Remove festival fields from the validated data
        unset($validated['festival_id']);
        unset($validated['festival_special_price']);
        unset($validated['festival_price']);

        $internetPackage->update($validated);

        // Handle festival attachment/detachment
        if ($festivalId) {
            // Get existing festivals to check if we need to update or create
            $currentFestivals = $internetPackage->festivals->pluck('id')->toArray();

            $pivotData = [
                'is_special_price' => $isSpecialPrice,
                'festival_price' => $isSpecialPrice ? $festivalPrice : null,
            ];

            // If the festival is already attached, detach it first
            if (in_array($festivalId, $currentFestivals)) {
                $internetPackage->festivals()->detach($festivalId);
            }

            // Attach with new pivot data
            $internetPackage->festivals()->attach($festivalId, $pivotData);

            // Log after attaching
            Log::info('Festival attached:', [
                'package_id' => $internetPackage->id,
                'festival_id' => $festivalId,
                'pivot_data' => $pivotData
            ]);
        } else {
            // If no festival selected, detach all festivals
            $internetPackage->festivals()->detach();
            Log::info('All festivals detached from package:', ['package_id' => $internetPackage->id]);
        }

        return redirect()->route('admin.internet-packages.index')->with('success', 'ویرایش با موفقیت انجام شد');
    }

    public function destroy(InternetPackage $internetPackage)
    {
        $internetPackage->delete();

        return redirect()->route('admin.internet-packages.index')->with('success', 'بسته حذف شد');
    }
}
