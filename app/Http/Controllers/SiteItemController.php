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
        $lang = $request->header('X-Lang', 'fa');

        $messages = [
            'items.*.title.fa.required' => [
                'fa' => 'عنوان فارسی الزامی است.',
                'en' => 'Persian title is required.',
                'ps' => 'د فارسی سرلیک اړین دی.',
            ],
            'items.*.title.en.required' => [
                'fa' => 'عنوان انگلیسی الزامی است.',
                'en' => 'English title is required.',
                'ps' => 'د انګلیسي سرلیک اړین دی.',
            ],
            'items.*.title.ps.required' => [
                'fa' => 'عنوان پشتو الزامی است.',
                'en' => 'Pashto title is required.',
                'ps' => 'د پښتو سرلیک اړین دی.',
            ],
            'items.*.description.fa.required' => [
                'fa' => 'توضیح فارسی الزامی است.',
                'en' => 'Persian description is required.',
                'ps' => 'د پښتو توضیح اړین دی.',
            ],
            'items.*.description.en.required' => [
                'fa' => 'توضیح انگلیسی الزامی است.',
                'en' => 'English description is required.',
                'ps' => 'د انګلیسي توضیح اړین دی.',
            ],
            'items.*.description.ps.required' => [
                'fa' => 'توضیح پشتو الزامی است.',
                'en' => 'Pashto description is required.',
                'ps' => 'د پښتو توضیح اړین دی.',
            ],
        ];

        $selectedMessages = [];
        foreach ($messages as $key => $value) {
            $selectedMessages[$key] = $value[$lang] ?? $value['fa'];
        }

        $type = $request->items[0]['type'];

        $baseRules = [
            'items' => 'required|array',
            'items.*.type' => 'required|string|in:circle,service',
            'items.*.title' => 'required|array',
            'items.*.title.fa' => 'required|string|max:255',
            'items.*.title.en' => 'required|string|max:255',
            'items.*.title.ps' => 'required|string|max:255',
            'items.*.link' => 'nullable|string',
            'items.*.image' => 'required|string',
            'items.*.status' => 'boolean',
        ];

        // اگر type برابر با service بود، فیلد description هم باید اعتبارسنجی شود
        if ($type === 'service') {
            $baseRules['items.*.description'] = 'required|array';
            $baseRules['items.*.description.fa'] = 'required|string|max:1000';
            $baseRules['items.*.description.en'] = 'required|string|max:1000';
            $baseRules['items.*.description.ps'] = 'required|string|max:1000';
        }

        $request->validate($baseRules, $selectedMessages);

        // حذف آیتم‌های قبلی از نوع مربوطه
        SiteItem::where('type', $type)->delete();

        foreach ($request->items as $index => $itemData) {
            if (empty($itemData['image'])) {
                return redirect()->back()->with('message', [
                    'type' => 'error',
                    'text' => 'تصویر آیتم دایره ای الزامی است.',
                ]);
            }

            SiteItem::create([
                'type' => $itemData['type'],
                'title' => $itemData['title'],
                'description' => $type === 'service' ? $itemData['description'] : null,
                'link' => $itemData['link'] ?? null,
                'image' => $itemData['image'],
                'status' => $itemData['status'] ?? true,
                'order' => $index,
            ]);
        }

        $messages = [
            'fa' => 'آیتم‌ها با موفقیت ذخیره شدند.',
            'en' => 'Items saved successfully.',
            'ps' => 'توکي په بریالیتوب سره ثبت شول.',
        ];

        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => $messages[$lang] ?? $messages['fa'],
        ]);
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
