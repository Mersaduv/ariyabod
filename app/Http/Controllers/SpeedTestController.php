<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Process;

class SpeedTestController extends Controller
{
    public function run()
    {
        $result = Process::run('node speedtest.js');

        if ($result->failed()) {
            return response()->json(['error' => 'Speedtest failed'], 500);
        }

        return response($result->output, 200)->header('Content-Type', 'application/json');
    }
}
