import { Head } from "@inertiajs/react";
import AppLayoutSwitcher from "../Layouts/AppLayoutSwitcher";
import { useTranslation } from "react-i18next";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function NetworkTest({ auth, headerData, footerData }) {
    const { t } = useTranslation();
    const [downloadSpeed, setDownloadSpeed] = useState({ method1: null, method2: null, method3: null });
    const [uploadSpeed, setUploadSpeed] = useState({ method1: null, method2: null, method3: null });
    const [ping, setPing] = useState({ method1: null, method2: null, method3: null });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [averages, setAverages] = useState({ download: null, upload: null, ping: null });

    // Method 1: File download/upload timing with multiple samples
    const measureSpeedMethod1 = async () => {
        try {
            // Multiple ping samples for accuracy
            let pingResults = [];
            for (let i = 0; i < 5; i++) {
                const pingStart = performance.now();
                await axios.get('/api/ping-test', {
                    params: { timestamp: new Date().getTime() },
                    // Cancel if it takes too long
                    timeout: 5000
                });
                const pingEnd = performance.now();
                pingResults.push(pingEnd - pingStart);
                // Small delay between tests
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Remove outliers (highest and lowest)
            pingResults.sort((a, b) => a - b);
            if (pingResults.length > 2) {
                pingResults = pingResults.slice(1, -1);
            }

            // Calculate average ping
            const avgPing = pingResults.reduce((a, b) => a + b, 0) / pingResults.length;
            setPing(prev => ({ ...prev, method1: avgPing.toFixed(2) }));

            // Multiple download samples of increasing size for better accuracy
            const downloadSizes = [1, 2, 5, 10].map(size => size * 1024 * 1024); // 1MB, 2MB, 5MB, 10MB
            let downloadResults = [];

            for (const fileSize of downloadSizes) {
                const downloadStart = performance.now();
                await axios.get('/api/test-download', {
                    params: {
                        size: fileSize,
                        timestamp: new Date().getTime()
                    },
                    responseType: 'blob',
                    timeout: 30000 // 30 seconds timeout
                });
                const downloadEnd = performance.now();
                const downloadDuration = (downloadEnd - downloadStart) / 1000; // seconds
                // Calculate speed in Mbps (megabits per second)
                const downloadSpeedMbps = (fileSize * 8 / 1024 / 1024) / downloadDuration;
                downloadResults.push(downloadSpeedMbps);
                // Small delay between tests
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Use larger sample sizes with more weight (simple weighted average)
            const totalWeight = downloadSizes.reduce((sum, size, i) => sum + size, 0);
            const weightedAvgDownload = downloadResults.reduce((sum, speed, i) =>
                sum + (speed * downloadSizes[i]), 0) / totalWeight;

            setDownloadSpeed(prev => ({ ...prev, method1: weightedAvgDownload.toFixed(2) }));

            // Multiple upload samples
            const uploadSizes = [1, 2, 5].map(size => size * 1024 * 1024); // 1MB, 2MB, 5MB
            let uploadResults = [];

            for (const uploadSize of uploadSizes) {
                const testData = new Blob([new ArrayBuffer(uploadSize)]);
                const uploadStart = performance.now();
                await axios.post('/api/test-upload', testData, {
                    headers: { 'Content-Type': 'application/octet-stream' },
                    timeout: 30000 // 30 seconds timeout
                });
                const uploadEnd = performance.now();
                const uploadDuration = (uploadEnd - uploadStart) / 1000; // seconds
                const uploadSpeedMbps = (uploadSize * 8 / 1024 / 1024) / uploadDuration; // Mbps
                uploadResults.push(uploadSpeedMbps);
                // Small delay between tests
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Weighted average for upload as well
            const totalUploadWeight = uploadSizes.reduce((sum, size) => sum + size, 0);
            const weightedAvgUpload = uploadResults.reduce((sum, speed, i) =>
                sum + (speed * uploadSizes[i]), 0) / totalUploadWeight;

            setUploadSpeed(prev => ({ ...prev, method1: weightedAvgUpload.toFixed(2) }));
        } catch (error) {
            console.error("Method 1 error:", error);
            setErrorMessage(prev => prev + " Method 1 failed. ");
        }
    };

    // Method 2: WebRTC connection stats with better peer connection handling
    const measureSpeedMethod2 = async () => {
        try {
            // Create RTCPeerConnection with STUN servers
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' }
                ]
            });

            // Create data channel with specific options for speed testing
            const dataChannel = pc.createDataChannel('speedtest', {
                ordered: true,
                maxRetransmits: 1
            });

            // Data tracking variables
            let downloadStart = null;
            let uploadStart = null;
            let downloadBytes = 0;
            let uploadBytes = 0;
            let downloadInterval = null;
            let uploadInterval = null;
            let pingStart = performance.now();
            let pingMeasured = false;
            let pingValue = 0;

            // Add event handlers
            dataChannel.onopen = () => {
                // Start downloading (receiving) data
                downloadStart = performance.now();

                // Send some data to measure upload speed
                uploadStart = performance.now();
                const uploadData = new ArrayBuffer(16 * 1024); // 16KB chunks

                // Send data continuously for 5 seconds to measure upload
                uploadInterval = setInterval(() => {
                    try {
                        dataChannel.send(uploadData);
                        uploadBytes += uploadData.byteLength;
                    } catch (e) {
                        console.warn("Error sending data:", e);
                    }
                }, 10); // Try to send every 10ms

                // Stop upload test after 5 seconds
                setTimeout(() => {
                    if (uploadInterval) {
                        clearInterval(uploadInterval);
                        uploadInterval = null;

                        // Calculate upload speed if we have data
                        if (uploadBytes > 0) {
                            const uploadDuration = (performance.now() - uploadStart) / 1000;
                            const uploadSpeed = ((uploadBytes * 8) / uploadDuration) / 1000000; // Mbps
                            setUploadSpeed(prev => ({ ...prev, method2: uploadSpeed.toFixed(2) }));
                        }
                    }
                }, 5000);
            };

            dataChannel.onmessage = (event) => {
                // Track downloaded data
                downloadBytes += event.data.size || event.data.byteLength || 0;

                // Measure ping on first message if not already measured
                if (!pingMeasured) {
                    pingValue = performance.now() - pingStart;
                    pingMeasured = true;
                    setPing(prev => ({ ...prev, method2: pingValue.toFixed(2) }));
                }
            };

            // Create offer and set local description
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Set timeout to close connection and calculate speeds
            setTimeout(() => {
                // Calculate download speed if we have data
                if (downloadBytes > 0 && downloadStart) {
                    const downloadDuration = (performance.now() - downloadStart) / 1000;
                    const downloadSpeed = ((downloadBytes * 8) / downloadDuration) / 1000000; // Mbps
                    setDownloadSpeed(prev => ({ ...prev, method2: downloadSpeed.toFixed(2) }));
                }

                // Clean up
                if (uploadInterval) clearInterval(uploadInterval);
                if (downloadInterval) clearInterval(downloadInterval);
                dataChannel.close();
                pc.close();
            }, 10000); // Run test for 10 seconds

            // If we haven't received ping after 5 seconds, use ICE candidate round trip time
            pc.onicecandidate = (event) => {
                if (event.candidate && !pingMeasured) {
                    pingValue = performance.now() - pingStart;
                    pingMeasured = true;
                    setPing(prev => ({ ...prev, method2: pingValue.toFixed(2) }));
                }
            };
        } catch (error) {
            console.error("Method 2 error:", error);
            setErrorMessage(prev => prev + " Method 2 failed. ");
        }
    };

    // Method 3: XHR progressive download/upload with multiple sample points
    const measureSpeedMethod3 = async () => {
        try {
            // Multiple ping samples
            let pingSum = 0;
            let pingCount = 0;

            for (let i = 0; i < 5; i++) {
                const pingXhr = new XMLHttpRequest();
                pingXhr.open('GET', '/api/ping-test?timestamp=' + new Date().getTime(), true);
                const pingStart = performance.now();

                await new Promise((resolve, reject) => {
                    pingXhr.onload = () => {
                        if (pingXhr.status === 200) {
                            const pingEnd = performance.now();
                            pingSum += (pingEnd - pingStart);
                            pingCount++;
                            resolve();
                        } else {
                            reject(new Error('Ping request failed'));
                        }
                    };

                    pingXhr.onerror = () => reject(new Error('XHR error on ping'));
                    pingXhr.send();
                });

                // Short delay between pings
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            if (pingCount > 0) {
                setPing(prev => ({ ...prev, method3: (pingSum / pingCount).toFixed(2) }));
            }

            // Download speed test with progressive measurements
            const downloadSizes = [2, 5, 10].map(size => size * 1024 * 1024); // 2MB, 5MB, 10MB
            let downloadResults = [];

            for (const downloadSize of downloadSizes) {
                await new Promise((resolve) => {
                    const downloadXhr = new XMLHttpRequest();
                    downloadXhr.open('GET', `/api/test-download?size=${downloadSize}&timestamp=${new Date().getTime()}`, true);
                    downloadXhr.responseType = 'arraybuffer';

                    const downloadStart = performance.now();
                    let lastDownloadTimestamp = downloadStart;
                    let lastDownloadedBytes = 0;
                    let downloadRates = [];

                    downloadXhr.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const currentTime = performance.now();
                            const elapsedSeconds = (currentTime - lastDownloadTimestamp) / 1000;
                            const bytesLoaded = event.loaded - lastDownloadedBytes;

                            // Only log point if we received substantial data and some time passed
                            if (elapsedSeconds > 0.1 && bytesLoaded > 10000) {
                                lastDownloadTimestamp = currentTime;
                                lastDownloadedBytes = event.loaded;

                                const currentRate = (bytesLoaded * 8 / 1024 / 1024) / elapsedSeconds; // Mbps
                                downloadRates.push(currentRate);
                            }
                        }
                    };

                    downloadXhr.onload = () => {
                        if (downloadRates.length > 0) {
                            // Remove outliers (top and bottom 10%)
                            if (downloadRates.length > 10) {
                                downloadRates.sort((a, b) => a - b);
                                const cutLength = Math.floor(downloadRates.length * 0.1);
                                downloadRates = downloadRates.slice(cutLength, downloadRates.length - cutLength);
                            }

                            const avgDownloadSpeed = downloadRates.reduce((a, b) => a + b, 0) / downloadRates.length;
                            downloadResults.push(avgDownloadSpeed);
                        } else {
                            // Fallback if progressive calculation didn't work
                            const totalTime = (performance.now() - downloadStart) / 1000;
                            const totalSize = downloadSize * 8 / 1024 / 1024; // Mbits
                            downloadResults.push(totalSize / totalTime);
                        }
                        resolve();
                    };

                    downloadXhr.onerror = () => {
                        console.error("XHR download error");
                        resolve();
                    };

                    downloadXhr.send();
                });

                // Short delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Calculate weighted average for download
            if (downloadResults.length > 0) {
                // More weight to larger file sizes
                const weightedAvgDownload = downloadResults.reduce((sum, result, i) =>
                    sum + (result * downloadSizes[i]), 0) / downloadSizes.reduce((a, b) => a + b, 0);
                setDownloadSpeed(prev => ({ ...prev, method3: weightedAvgDownload.toFixed(2) }));
            }

            // Upload speed test with progressive measurements
            const uploadSizes = [1, 3, 5].map(size => size * 1024 * 1024); // 1MB, 3MB, 5MB
            let uploadResults = [];

            for (const uploadSize of uploadSizes) {
                await new Promise((resolve) => {
                    const uploadXhr = new XMLHttpRequest();
                    const uploadData = new Blob([new ArrayBuffer(uploadSize)]);
                    uploadXhr.open('POST', '/api/test-upload', true);

                    const uploadStart = performance.now();
                    let lastUploadTimestamp = uploadStart;
                    let lastUploadedBytes = 0;
                    let uploadRates = [];

                    uploadXhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const currentTime = performance.now();
                            const elapsedSeconds = (currentTime - lastUploadTimestamp) / 1000;
                            const bytesSent = event.loaded - lastUploadedBytes;

                            // Only log point if we sent substantial data and some time passed
                            if (elapsedSeconds > 0.1 && bytesSent > 10000) {
                                lastUploadTimestamp = currentTime;
                                lastUploadedBytes = event.loaded;

                                const currentRate = (bytesSent * 8 / 1024 / 1024) / elapsedSeconds; // Mbps
                                uploadRates.push(currentRate);
                            }
                        }
                    };

                    uploadXhr.onload = () => {
                        if (uploadRates.length > 0) {
                            // Remove outliers (top and bottom 10%)
                            if (uploadRates.length > 10) {
                                uploadRates.sort((a, b) => a - b);
                                const cutLength = Math.floor(uploadRates.length * 0.1);
                                uploadRates = uploadRates.slice(cutLength, uploadRates.length - cutLength);
                            }

                            const avgUploadSpeed = uploadRates.reduce((a, b) => a + b, 0) / uploadRates.length;
                            uploadResults.push(avgUploadSpeed);
                        } else {
                            // Fallback if progressive calculation didn't work
                            const totalTime = (performance.now() - uploadStart) / 1000;
                            const totalSize = uploadSize * 8 / 1024 / 1024; // Mbits
                            uploadResults.push(totalSize / totalTime);
                        }
                        resolve();
                    };

                    uploadXhr.onerror = () => {
                        console.error("XHR upload error");
                        resolve();
                    };

                    uploadXhr.send(uploadData);
                });

                // Short delay between uploads
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Calculate weighted average for upload
            if (uploadResults.length > 0) {
                const weightedAvgUpload = uploadResults.reduce((sum, result, i) =>
                    sum + (result * uploadSizes[i]), 0) / uploadSizes.reduce((a, b) => a + b, 0);
                setUploadSpeed(prev => ({ ...prev, method3: weightedAvgUpload.toFixed(2) }));
            }
        } catch (error) {
            console.error("Method 3 error:", error);
            setErrorMessage(prev => prev + " Method 3 failed. ");
        }
    };

    // Calculate weighted averages from all methods
    const calculateAverages = () => {
        // Filter out null values and convert to numbers
        const downloadValues = Object.values(downloadSpeed).filter(val => val !== null).map(Number);
        const uploadValues = Object.values(uploadSpeed).filter(val => val !== null).map(Number);
        const pingValues = Object.values(ping).filter(val => val !== null).map(Number);

        // Calculate averages if we have values, giving more weight to methods that are more reliable
        if (downloadValues.length > 0) {
            // Method 1 has weight 2, Methods 2&3 have weight 1
            const weights = [2, 1, 1];
            let weightSum = 0;
            let weightedSum = 0;

            downloadValues.forEach((val, idx) => {
                const weight = weights[idx] || 1;
                weightedSum += val * weight;
                weightSum += weight;
            });

            const avgDownload = weightSum > 0 ? weightedSum / weightSum : 0;
            setAverages(prev => ({ ...prev, download: avgDownload.toFixed(2) }));
        }

        if (uploadValues.length > 0) {
            const weights = [2, 1, 1];
            let weightSum = 0;
            let weightedSum = 0;

            uploadValues.forEach((val, idx) => {
                const weight = weights[idx] || 1;
                weightedSum += val * weight;
                weightSum += weight;
            });

            const avgUpload = weightSum > 0 ? weightedSum / weightSum : 0;
            setAverages(prev => ({ ...prev, upload: avgUpload.toFixed(2) }));
        }

        if (pingValues.length > 0) {
            // For ping, method 1 is usually most accurate
            const weights = [3, 1, 1];
            let weightSum = 0;
            let weightedSum = 0;

            pingValues.forEach((val, idx) => {
                const weight = weights[idx] || 1;
                weightedSum += val * weight;
                weightSum += weight;
            });

            const avgPing = weightSum > 0 ? weightedSum / weightSum : 0;
            setAverages(prev => ({ ...prev, ping: avgPing.toFixed(2) }));
        }
    };

    // Run all tests in sequence
    const runSpeedTest = async () => {
        setIsLoading(true);
        setErrorMessage("");
        setDownloadSpeed({ method1: null, method2: null, method3: null });
        setUploadSpeed({ method1: null, method2: null, method3: null });
        setPing({ method1: null, method2: null, method3: null });
        setAverages({ download: null, upload: null, ping: null });

        try {
            // Run methods in parallel for faster results
            await Promise.all([
                measureSpeedMethod1(),
                measureSpeedMethod2(),
                measureSpeedMethod3()
            ]);
            calculateAverages();
        } catch (error) {
            console.error("Speed test error:", error);
            setErrorMessage("Failed to complete speed test. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (Object.values(downloadSpeed).some(val => val !== null) ||
            Object.values(uploadSpeed).some(val => val !== null) ||
            Object.values(ping).some(val => val !== null)) {
            calculateAverages();
        }
    }, [downloadSpeed, uploadSpeed, ping]);

    return (
        <AppLayoutSwitcher
            auth={auth}
            headerData={headerData}
            footerData={footerData}
        >
            <Head title={"Network Test"} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold mb-6">Network Speed Test</h1>

                    <button
                        onClick={runSpeedTest}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isLoading ? "Testing..." : "Start Speed Test"}
                    </button>

                    {errorMessage && (
                        <div className="mt-4 text-red-600">{errorMessage}</div>
                    )}

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Results</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Download Speed</h3>
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-600">Method 1</p>
                                        <p className="text-lg font-medium">{downloadSpeed.method1 ? `${downloadSpeed.method1} Mbps` : '-'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-600">Method 2</p>
                                        <p className="text-lg font-medium">{downloadSpeed.method2 ? `${downloadSpeed.method2} Mbps` : '-'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-600">Method 3</p>
                                        <p className="text-lg font-medium">{downloadSpeed.method3 ? `${downloadSpeed.method3} Mbps` : '-'}</p>
                                    </div>
                                </div>
                                <div className="mt-2 font-bold">
                                    Average: {averages.download ? `${averages.download} Mbps` : '-'}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium">Upload Speed</h3>
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-600">Method 1</p>
                                        <p className="text-lg font-medium">{uploadSpeed.method1 ? `${uploadSpeed.method1} Mbps` : '-'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-600">Method 2</p>
                                        <p className="text-lg font-medium">{uploadSpeed.method2 ? `${uploadSpeed.method2} Mbps` : '-'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-600">Method 3</p>
                                        <p className="text-lg font-medium">{uploadSpeed.method3 ? `${uploadSpeed.method3} Mbps` : '-'}</p>
                                    </div>
                                </div>
                                <div className="mt-2 font-bold">
                                    Average: {averages.upload ? `${averages.upload} Mbps` : '-'}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium">Ping</h3>
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-600">Method 1</p>
                                        <p className="text-lg font-medium">{ping.method1 ? `${ping.method1} ms` : '-'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-600">Method 2</p>
                                        <p className="text-lg font-medium">{ping.method2 ? `${ping.method2} ms` : '-'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-600">Method 3</p>
                                        <p className="text-lg font-medium">{ping.method3 ? `${ping.method3} ms` : '-'}</p>
                                    </div>
                                </div>
                                <div className="mt-2 font-bold">
                                    Average: {averages.ping ? `${averages.ping} ms` : '-'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayoutSwitcher>
    );
}