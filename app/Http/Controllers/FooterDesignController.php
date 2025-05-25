<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FooterDesignController extends Controller
{
    public function edit()
    {
        $footer = Setting::where('key', 'footer')->first();
        $footerData = $footer ? json_decode($footer->value, true) : null;

        return Inertia::render('Admin/GeneralDesign', [
            'footerData' => $footerData,
        ]);
    }

    public function upload(Request $request)
    {
        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('footer-design', $filename, 'public');
                $url = Storage::url($path);

                return response()->json(['url' => $url]);
            }

            return response()->json(['error' => 'هیچ فایلی آپلود نشد'], 400);
        } catch (\Throwable $e) {
            Log::error('Image upload failed: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در آپلود تصویر'], 500);
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'addresses' => 'required|array',
            'contact_numbers' => 'required|array',
            'social_media' => 'required|array',
        ]);

        // Handle file uploads for social media images
        $socialMedia = $request->social_media;
        foreach ($socialMedia as $index => $item) {
            if (isset($item['image']) && !is_string($item['image'])) {
                $path = $item['image']->store('social_media', 'public');
                $socialMedia[$index]['image'] = '/storage/' . $path;
            }
        }

        $footerData = [
            'addresses' => $request->addresses,
            'contact_numbers' => $request->contact_numbers,
            'social_media' => $socialMedia,
        ];

        Setting::updateOrCreate(
            ['key' => 'footer'],
            ['value' => json_encode($footerData)]
        );

        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'تنظیمات فوتر با موفقیت ذخیره شد.',
        ]);
    }
}
