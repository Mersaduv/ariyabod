<?php

namespace App\Http\Controllers;

use App\Models\Festival;
use App\Models\InternetPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class FestivalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $festivals = Festival::latest()->get();

        return Inertia::render('Admin/Festivals/Index', [
            'festivals' => $festivals
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Festivals/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|array',
            'title.en' => 'required|string',
            'title.fa' => 'required|string',
            'title.ps' => 'required|string',
            'description' => 'nullable|array',
            'description.en' => 'nullable|string',
            'description.fa' => 'nullable|string',
            'description.ps' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'image' => 'nullable|string',
            'additional_images' => 'nullable|array',
            'additional_images.*' => 'nullable|string',
            'color_code' => 'nullable|string|max:7',
        ]);

        // Process image URLs to store just the paths
        if (isset($validated['image']) && $validated['image']) {
            // Extract path from full URL
            $path = str_replace('/storage/', '', $validated['image']);
            $validated['image'] = $path;
        }

        // Process additional images URLs
        if (isset($validated['additional_images']) && is_array($validated['additional_images'])) {
            $processedImages = [];
            foreach ($validated['additional_images'] as $imageUrl) {
                if ($imageUrl) {
                    // Extract path from full URL
                    $path = str_replace('/storage/', '', $imageUrl);
                    $processedImages[] = $path;
                }
            }
            $validated['additional_images'] = $processedImages;
        }

        Festival::create($validated);

        return redirect()->route('admin.festivals.index')->with('success', 'جشنواره با موفقیت ایجاد شد');
    }

    /**
     * Display the specified resource.
     */
    public function show(Festival $festival)
    {
        $festival->load('internetPackages');

        return Inertia::render('Admin/Festivals/Show', [
            'festival' => $festival
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Festival $festival)
    {
        $internetPackages = InternetPackage::where('is_active', true)->get();

        // Get the packages already associated with this festival
        $assignedPackages = $festival->internetPackages->pluck('id')->toArray();

        return Inertia::render('Admin/Festivals/Edit', [
            'festival' => $festival,
            'internetPackages' => $internetPackages,
            'assignedPackages' => $assignedPackages
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Festival $festival)
    {
        // Log the incoming request data for debugging
        Log::info('Festival update request data:', $request->all());

        $validated = $request->validate([
            'title' => 'sometimes|array',
            'title.en' => 'sometimes|string',
            'title.fa' => 'sometimes|string',
            'title.ps' => 'sometimes|string',
            'description' => 'nullable|array',
            'description.en' => 'nullable|string',
            'description.fa' => 'nullable|string',
            'description.ps' => 'nullable|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'image' => 'nullable|string',
            'remove_image' => 'nullable|boolean',
            'additional_images' => 'nullable|array',
            'additional_images.*' => 'nullable|string',
            'remove_additional_images' => 'nullable|array',
            'color_code' => 'nullable|string|max:7',
        ]);

        // Log validated data
        Log::info('Festival update validated data:', $validated);

        // Handle main image URL or removal
        if (isset($validated['image']) && $validated['image']) {
            // Check if it's a new image (URL) or an existing one
            if (strpos($validated['image'], '/storage/') === 0) {
                // Extract path from full URL
                $path = str_replace('/storage/', '', $validated['image']);

                // Compare with existing path to see if it's actually a new image
                if ($path !== $festival->image) {
                    // It's a new image, remove old image if exists
                    if ($festival->image) {
                        Storage::disk('public')->delete($festival->image);
                    }
                }

                $validated['image'] = $path;
            }
        } elseif ($request->boolean('remove_image')) {
            if ($festival->image) {
                Storage::disk('public')->delete($festival->image);
            }
            $validated['image'] = null;
        }

        // Handle additional images upload and removal
        if (isset($validated['additional_images']) && is_array($validated['additional_images'])) {
            $currentImages = $festival->additional_images ?? [];
            $newImages = [];

            // Log current images and removal list
            Log::info('Current additional images:', ['images' => $currentImages]);
            Log::info('Images to remove:', ['remove_list' => $request->input('remove_additional_images', [])]);

            // Process existing images (keep them)
            foreach ($currentImages as $imagePath) {
                // Skip if this image is marked for removal
                if ($request->has('remove_additional_images') &&
                    is_array($request->remove_additional_images) &&
                    in_array($imagePath, $request->remove_additional_images)) {
                    Log::info('Removing image:', ['path' => $imagePath]);
                    Storage::disk('public')->delete($imagePath);
                    continue;
                }

                $newImages[] = $imagePath;
            }

            // Process new images (if any)
            foreach ($validated['additional_images'] as $imageUrl) {
                if ($imageUrl && strpos($imageUrl, '/storage/') === 0) {
                    // It's a new image URL with /storage/ prefix
                    $path = str_replace('/storage/', '', $imageUrl);
                    $newImages[] = $path;
                } else if ($imageUrl && !in_array($imageUrl, $newImages)) {
                    // It's an existing path without /storage/ prefix
                    // Check if it already exists in the filesystem
                    if (Storage::disk('public')->exists($imageUrl)) {
                        $newImages[] = $imageUrl;
                    }
                }
            }

            Log::info('Final additional images:', ['images' => $newImages]);
            $validated['additional_images'] = $newImages;
        }

        $festival->update($validated);

        Log::info('Festival updated successfully:', ['id' => $festival->id]);

        return redirect()->route('admin.festivals.index')->with('success', 'جشنواره با موفقیت بروزرسانی شد');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Festival $festival)
    {
        // Delete images
        if ($festival->image) {
            Storage::disk('public')->delete($festival->image);
        }

        if ($festival->additional_images) {
            foreach ($festival->additional_images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $festival->delete();

        return redirect()->route('admin.festivals.index')->with('success', 'جشنواره با موفقیت حذف شد');
    }

    /**
     * Attach internet packages to a festival.
     */
    public function attachPackages(Request $request, Festival $festival)
    {
        $validated = $request->validate([
            'packages' => 'required|array',
            'packages.*.id' => 'required|exists:internet_packages,id',
            'packages.*.is_special_price' => 'boolean',
            'packages.*.festival_price' => 'nullable|integer|min:0|required_if:packages.*.is_special_price,true',
        ]);

        // Sync packages with pivot data
        $syncData = [];
        foreach ($validated['packages'] as $package) {
            $syncData[$package['id']] = [
                'is_special_price' => $package['is_special_price'] ?? false,
                'festival_price' => $package['is_special_price'] ? $package['festival_price'] : null,
            ];
        }

        $festival->internetPackages()->sync($syncData);

        return redirect()->back()->with('success', 'بسته های اینترنتی با موفقیت به جشنواره اضافه شدند');
    }

    /**
     * Detach an internet package from a festival.
     */
    public function detachPackage(Festival $festival, InternetPackage $internetPackage)
    {
        $festival->internetPackages()->detach($internetPackage->id);

        return redirect()->back()->with('success', 'بسته اینترنتی با موفقیت از جشنواره حذف شد');
    }

    /**
     * Upload an image for a festival.
     */
    public function upload(Request $request)
    {
        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('festivals', $filename, 'public');
                $url = Storage::url($path);

                return response()->json(['url' => $url]);
            }

            return response()->json(['error' => 'هیچ فایلی آپلود نشد'], 400);
        } catch (\Throwable $e) {
            Log::error('Festival image upload failed: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در آپلود تصویر'], 500);
        }
    }
}
