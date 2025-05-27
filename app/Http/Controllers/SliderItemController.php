<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\SiteItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SliderItemController extends Controller
{
    public function index()
    {
        // Get all slider items
        $sliderItems = SiteItem::where('type', 'slider')->orderBy('order')->get();

        // Get background image from settings
        $backgroundImage = Setting::where('key', 'slider_background')->first()?->value;

        return Inertia::render('Admin/SliderItems', [
            'sliderItems' => $sliderItems,
            'backgroundImage' => $backgroundImage,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items.*.title.fa' => 'required_with:items|string|max:255',
            'items.*.title.en' => 'required_with:items|string|max:255',
            'items.*.title.ps' => 'required_with:items|string|max:255',
            'items.*.image' => 'required_with:items|string',
            'items.*.link' => 'nullable|string',
            'background_image' => 'nullable|string',
        ]);

        // Save or update background image setting
        if ($request->has('background_image')) {
            Setting::updateOrCreate(
                ['key' => 'slider_background'],
                ['value' => $request->background_image]
            );
        }

        // If there are slider items to save
        if ($request->has('items') && count($request->items) > 0) {
            // First, delete all existing slider items
            SiteItem::where('type', 'slider')->delete();

            // Then create new ones from request
            foreach ($request->items as $index => $item) {
                SiteItem::create([
                    'title' => $item['title'],
                    'description' => $item['description'] ?? null,
                    'button_text' => $item['button_text'] ?? null,
                    'link' => $item['link'] ?? null,
                    'image' => $item['image'],
                    'status' => $item['status'] ?? true,
                    'type' => 'slider',
                    'order' => $index,
                ]);
            }
        }

        return back()->with('message', [
            'type' => 'success',
            'text' => __('slider_items.update_success')
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $path = $request->file('image')->store('slider', 'public');

        return response()->json([
            'url' => Storage::url($path)
        ]);
    }
}
