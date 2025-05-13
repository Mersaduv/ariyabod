<?php

namespace App\Http\Controllers;

use App\Models\SiteItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SiteItemController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $circleItems = SiteItem::where('type', 'circle')->get();
        $serviceItems = SiteItem::where('type', 'service')->get();

        return Inertia::render('Admin/SiteItems', [
            'circleItems' => $circleItems,
            'serviceItems' => $serviceItems,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.type' => 'required|string',
            'items.*.title' => 'required|string|max:255',
            'items.*.link' => 'nullable|string|url',
            'items.*.image' => 'nullable|string|url', // تصویر به‌صورت URL
            'items.*.status' => 'boolean',
        ]);

        $items = [];

        foreach ($request->items as $itemData) {
            $item = SiteItem::create([
                'type' => $itemData['type'],
                'title' => $itemData['title'],
                'link' => $itemData['link'] ?? null,
                'image' => $itemData['image'] ?? null,
                'status' => $itemData['status'] ?? true,
            ]);

            $items[] = $item;
        }

        return response()->json($items, 201);
    }

    public function upload(Request $request)
    {
        try {
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('site-items', $filename, 'public');
                $url = Storage::url($path);

                return response()->json(['url' => $url]);
            }

            return response()->json(['error' => 'هیچ فایلی آپلود نشد'], 400);
        } catch (\Throwable $e) {
            Log::error('Image upload failed: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در آپلود تصویر'], 500);
        }
    }

    public function destroy(SiteItem $siteItem)
    {
        if ($siteItem->image) {
            $imagePath = str_replace('/storage/', '', $siteItem->image);
            Storage::disk('public')->delete($imagePath);
        }

        $siteItem->delete();

        return response()->json(['message' => 'آیتم با موفقیت حذف شد.']);
    }
}
