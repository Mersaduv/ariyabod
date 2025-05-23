<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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


Route::get('/ping', function () {
    return response()->json(['pong' => true]);
});

Route::get('/download-test', function () {
    return response()->file(public_path('test/big-file.bin'));
});

Route::post('/upload-test', function (Request $request) {
    return response()->json(['success' => true]);
});