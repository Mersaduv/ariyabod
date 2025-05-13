<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FooterDesignController extends Controller
{
    public function edit()
    {
        $footer = Setting::where('key', 'footer')->first();
        $footerData = $footer ? $footer->value : '';

        return Inertia::render('Admin/GeneralDesign', [
            'footerData' => $footerData,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'footer' => 'nullable|string',
        ]);

        Setting::updateOrCreate(
            ['key' => 'footer'],
            ['value' => $request->footer]
        );

        return redirect()->back()->with('message', [
            'type' => 'success',
            'text' => 'تنظیمات فوتر با موفقیت ذخیره شد.',
        ]);
    }
}
