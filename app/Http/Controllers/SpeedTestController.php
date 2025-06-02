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

            // 10MB random data
            $sizeInBytes = 10 * 1024 * 1024;
            $chunkSize = 1024; // 1KB
            $chunks = $sizeInBytes / $chunkSize;

            return new StreamedResponse(function () use ($chunks, $chunkSize) {
                for ($i = 0; $i < $chunks; $i++) {
                    echo random_bytes($chunkSize);
                    flush();

                    if (connection_aborted()) {
                        Log::warning("Download aborted by client at chunk $i");
                        break;
                    }
                }
            }, 200, [
                'Content-Type' => 'application/octet-stream',
                'Content-Disposition' => 'attachment; filename="testfile.dat"',
                'Content-Encoding' => 'identity', // جلوگیری از فشرده‌سازی
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
