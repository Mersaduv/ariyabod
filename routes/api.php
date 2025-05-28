<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Network Speed Test Routes
Route::get('/ping-test', function (Request $request) {
    return response()->json(['timestamp' => now()->timestamp]);
});

Route::get('/test-download', function (Request $request) {
    $size = $request->input('size', 5 * 1024 * 1024); // Default to 5MB

    // Generate random binary data of the specified size
    $data = Str::random($size);

    return response($data)
        ->header('Content-Type', 'application/octet-stream')
        ->header('Content-Length', strlen($data))
        ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        ->header('Pragma', 'no-cache')
        ->header('Expires', '0');
});

Route::post('/test-upload', function (Request $request) {
    // Just measure the time it takes to upload the data
    // No need to save it
    return response()->json([
        'success' => true,
        'size' => $request->getContent() ? strlen($request->getContent()) : 0,
        'timestamp' => now()->timestamp
    ]);
});
