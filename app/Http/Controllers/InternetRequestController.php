<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Models\Setting;

class InternetRequestController extends Controller
{
    /**
     * Display the internet request form.
     */
    public function show()
    {
        return Inertia::render('RequestInternet');
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
            'address' => 'required|string',
        ]);

        try {
            // Send email with the request data
            Mail::raw(
                "درخواست انترنت جدید:\n\n" .
                "نام: " . $validated['first_name'] . "\n" .
                "تخلص: " . $validated['last_name'] . "\n" .
                "شماره تلفن: " . $validated['phone_number'] . "\n" .
                "آدرس: " . $validated['address'] . "\n",
                function ($message) {
                    $message->to('mersadkhahan70@gmail.com')
                        ->subject('درخواست انترنت جدید');
                }
            );

            return redirect()->back()->with('success', 'درخواست شما با موفقیت ارسال شد. به زودی با شما تماس گرفته خواهد شد.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['email_error' => 'خطا در ارسال ایمیل. لطفاً دوباره تلاش کنید.']);
        }
    }
}
