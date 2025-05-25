<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class GeneralDesignController extends Controller
{
    public function edit()
    {
        $header = Setting::where('key', 'header')->first();
        $footer = Setting::where('key', 'footer')->first();

        $headerData = $header ? json_decode($header->value, true) : [];
        $footerData = $footer ? json_decode($footer->value, true) : []; 

        return Inertia::render('Admin/GeneralDesign', [
            'headerData' => $headerData,
            'footerData' => $footerData,
        ]);
    }



    public function update(Request $request)
    {
        $request->validate([
            'header_text' => 'required|string|max:255',
            'header_logo' => 'nullable|image|max:2048',
            'header_color' => 'nullable|string|max:7',
            'status' => 'nullable|boolean',
        ]);

        $data = [
            'header_text' => $request->header_text,
            'header_color' => $request->header_color,
            'status' => $request->boolean('status'),
        ];

        // حذف فایل قبلی در صورت تغییر
        if ($request->hasFile('header_logo')) {
            $existing = Setting::where('key', 'header')->first();
            if ($existing) {
                $old = json_decode($existing->value, true);
                if (isset($old['header_logo'])) {
                    $oldPath = public_path('storage/' . ltrim($old['header_logo'], '/'));
                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                    }
                }
            }

            $path = $request->file('header_logo')->store('headers', 'public');
            $data['header_logo'] = Storage::url($path);
        } else {
            $existing = Setting::where('key', 'header')->first();
            if ($existing) {
                $old = json_decode($existing->value, true);
                $data['header_logo'] = $old['header_logo'] ?? null;
            }
        }

        Setting::updateOrCreate(
            ['key' => 'header'],
            ['value' => json_encode($data)]
        );
        var_dump($request->footer);
        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'دیزاین عمومی با موفقیت ذخیره شد.',
        ]);
    }
}
