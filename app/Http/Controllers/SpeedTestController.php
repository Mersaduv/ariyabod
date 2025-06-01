<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SpeedTestController extends Controller
{
    public function ping()
    {
        return response()->json(['pong' => true]);
    }

    public function downloadTestFile(Request $request)
    {
        try {
            if (ob_get_level()) {
                ob_end_clean();
            }

            $sizeInBytes = 10 * 1024 * 1024; // 10MB
            $chunk = str_repeat("0", 1024); // 1KB
            $chunks = $sizeInBytes / 1024;

            return new StreamedResponse(function () use ($chunks, $chunk) {
                for ($i = 0; $i < $chunks; $i++) {
                    echo $chunk;
                    flush();

                    if (connection_aborted()) {
                        Log::warning("Download aborted by client at chunk $i");
                        break;
                    }
                }
            }, 200, [
                'Content-Type' => 'application/octet-stream',
                'Content-Disposition' => 'attachment; filename="testfile.dat"',
                'Cache-Control' => 'no-store, no-cache, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0',
            ]);
        } catch (\Throwable $e) {
            Log::error('Download error: ' . $e->getMessage(), [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl(),
            ]);
            return response('Download error', 500);
        }
    }

    public function uploadTarget(Request $request)
    {
        $length = strlen($request->getContent());
        return response()->json(['received' => $length]);
    }
}
