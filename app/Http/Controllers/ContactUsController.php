<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Models\Setting;

class ContactUsController extends Controller
{
    public function show()
    {
        $headerSetting = Setting::where('key', 'header')->first();
        $headerData = $headerSetting ? json_decode($headerSetting->value, true) : [];

        return Inertia::render('ContactUs', [
            'headerData' => $headerData,
        ]);
    }

    /**
     * Handle the incoming request and send email.
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'phone_number' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string'
        ]);

        try {
            // Send email with the request data
            Mail::raw(
                " نظرات، پیشنهادات و انتقادات:\n\n" .
                    "نام: " . $validated['first_name'] . "\n" .
                    "تخلص: " . $validated['last_name'] . "\n" .
                    "شماره تلفن: " . $validated['phone_number'] . "\n" .
                    "ایمیل: " . $validated['email'] . "\n" .
                    "پیام: " . $validated['message'] . "\n",
                function ($message) {
                    $message->to('mersadkhahan70@gmail.com')
                        ->subject('نظرات، پیشنهادات و انتقادات');
                }
            );

            return redirect()->back()->with('success', 'درخواست شما با موفقیت ارسال شد. به زودی با شما تماس گرفته خواهد شد.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['email_error' => 'خطا در ارسال ایمیل. لطفاً دوباره تلاش کنید. ' . $e->getMessage()]);
        }
    }
}
