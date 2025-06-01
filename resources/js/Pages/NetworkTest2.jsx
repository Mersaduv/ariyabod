import { Head } from "@inertiajs/react";
import AppLayoutSwitcher from "../Layouts/AppLayoutSwitcher";
import { useTranslation } from "react-i18next";
import React, { useState, useRef, useEffect } from "react";

export default function NetworkTest2({ auth, headerData, footerData }) {
    const { t } = useTranslation();
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const lang = localStorage.getItem("lang") || "fa";
    const [ping, setPing] = useState(null);
    const [download, setDownload] = useState(null);
    const [upload, setUpload] = useState(null);
    const [ip, setIP] = useState(null);
    const [location, setLocation] = useState(null);
    const [server, setServer] = useState(t("network_test.server_name"));
    const [country, setCountry] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const [testPhase, setTestPhase] = useState(null);
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [targetSpeed, setTargetSpeed] = useState(0);
    const [showServerSection, setShowServerSection] = useState(false);
    const [showTestInterface, setShowTestInterface] = useState(false);
    const apiKey = import.meta.env.VITE_IP_API_KEY;

    const measureNetwork = async () => {
        if (!showTestInterface) {
            setShowTestInterface(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        setIsTesting(true);
        setTargetSpeed(0);
        setCurrentSpeed(0);
        setShowServerSection(false);

        // Reset all previous test results
        setPing(null);
        setDownload(null);
        setUpload(null);
        setIP(null);
        setLocation(null);
        setServer(t("network_test.server_name"));
        setCountry(null);

        // Ping Test
        setTestPhase("ping");
        let pingSum = 0;
        const pingCount = 3;
        const pingTargets = [
            "https://www.google.com/favicon.ico",
            "https://www.github.com/favicon.ico",
            "https://httpbin.org/get",
        ];

        for (let i = 0; i < pingCount; i++) {
            const target = pingTargets[i % pingTargets.length];
            const start = performance.now();
            try {
                await fetch(`${target}?t=${Date.now()}`, {
                    method: "GET",
                    cache: "no-store",
                    mode: "cors",
                });
                const end = performance.now();
                pingSum += end - start;
            } catch (error) {
                console.error("Ping error:", error);
                pingSum += 300; // Default fallback
            }
            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        const averagePing = Math.round(pingSum / pingCount);
        setPing(averagePing);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // DOWNLOAD TEST - با استفاده از فایل‌های مختلف
        setTestPhase("download");
        setTargetSpeed(0);
        setCurrentSpeed(0);

        let actualDownloadSpeed = 0;

        try {
            console.log("شروع تست دانلود...");

            // استفاده از فایل‌های مختلف برای تست
            const testUrls = [
                { url: "https://httpbin.org/bytes/1048576", size: 1048576 }, // 1MB
                { url: "https://httpbin.org/bytes/2097152", size: 2097152 }, // 2MB
                {
                    url: "https://via.placeholder.com/1000x1000.jpg",
                    size: 500000,
                }, // تقریبی 500KB
            ];

            let bestSpeed = 0;
            let successfulTests = 0;

            for (const testFile of testUrls) {
                try {
                    console.log(`تست فایل: ${testFile.url}`);

                    const controller = new AbortController();
                    const timeoutId = setTimeout(
                        () => controller.abort(),
                        15000
                    );

                    const start = performance.now();
                    const response = await fetch(testFile.url, {
                        cache: "no-store",
                        headers: {
                            "Cache-Control":
                                "no-cache, no-store, must-revalidate",
                            Pragma: "no-cache",
                            Expires: "0",
                        },
                        signal: controller.signal,
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    // خواندن داده‌ها
                    const arrayBuffer = await response.arrayBuffer();
                    const end = performance.now();

                    clearTimeout(timeoutId);

                    const downloadTime = (end - start) / 1000; // تبدیل به ثانیه
                    const actualSize = arrayBuffer.byteLength;

                    console.log(
                        `زمان دانلود: ${downloadTime}s، حجم: ${actualSize} bytes`
                    );

                    if (downloadTime > 0.1) {
                        // اگر حداقل 100ms طول کشید
                        const speedBps = (actualSize * 8) / downloadTime; // bits per second
                        const speedMbps = speedBps / (1024 * 1024); // Megabits per second

                        console.log(
                            `سرعت محاسبه شده: ${speedMbps.toFixed(2)} Mbps`
                        );

                        if (speedMbps > bestSpeed) {
                            bestSpeed = speedMbps;
                        }

                        successfulTests++;

                        // نمایش پیشرفت در طول تست
                        setTargetSpeed(speedMbps);
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1500)
                        );
                    }
                } catch (error) {
                    console.error(`خطا در تست ${testFile.url}:`, error);
                }
            }

            if (successfulTests > 0) {
                actualDownloadSpeed = bestSpeed;
                console.log(
                    `سرعت نهایی دانلود: ${actualDownloadSpeed.toFixed(2)} Mbps`
                );
            } else {
                // تست فالبک ساده
                console.log("انجام تست فالبک...");
                try {
                    const start = performance.now();
                    const response = await fetch(
                        "https://httpbin.org/bytes/524288",
                        {
                            // 512KB
                            cache: "no-store",
                        }
                    );
                    const arrayBuffer = await response.arrayBuffer();
                    const end = performance.now();

                    const downloadTime = (end - start) / 1000;
                    if (downloadTime > 0) {
                        const speedBps =
                            (arrayBuffer.byteLength * 8) / downloadTime;
                        actualDownloadSpeed = speedBps / (1024 * 1024);
                        console.log(
                            `سرعت فالبک: ${actualDownloadSpeed.toFixed(2)} Mbps`
                        );
                    }
                } catch (fallbackError) {
                    console.error("تست فالبک نیز شکست خورد:", fallbackError);
                    actualDownloadSpeed = 0;
                }
            }
        } catch (error) {
            console.error("خطای کلی در تست دانلود:", error);
            actualDownloadSpeed = 0;
        }

        // تنظیم سرعت دانلود واقعی
        if (actualDownloadSpeed > 0) {
            setDownload(actualDownloadSpeed.toFixed(2));
            setTargetSpeed(actualDownloadSpeed);
        } else {
            setDownload("0.00");
            setTargetSpeed(0);
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));

        // UPLOAD TEST
        setTestPhase("upload");
        setTargetSpeed(0);
        setCurrentSpeed(0);

        let actualUploadSpeed = 0;

        try {
            console.log("شروع تست آپلود...");

            // ایجاد داده‌های تست با اندازه‌های مختلف
            const testSizes = [262144, 524288, 1048576]; // 256KB, 512KB, 1MB

            let bestUploadSpeed = 0;
            let successfulUploads = 0;

            for (const size of testSizes) {
                try {
                    console.log(`تست آپلود با حجم: ${size} bytes`);

                    // ایجاد داده تصادفی
                    const testData = new Uint8Array(size);
                    for (let i = 0; i < size; i++) {
                        testData[i] = Math.floor(Math.random() * 256);
                    }

                    const formData = new FormData();
                    formData.append(
                        "file",
                        new Blob([testData]),
                        "speedtest.bin"
                    );

                    const controller = new AbortController();
                    const timeoutId = setTimeout(
                        () => controller.abort(),
                        20000
                    );

                    const start = performance.now();
                    const response = await fetch("https://httpbin.org/post", {
                        method: "POST",
                        body: formData,
                        signal: controller.signal,
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    await response.json(); // اطمینان از تکمیل آپلود
                    const end = performance.now();

                    clearTimeout(timeoutId);

                    const uploadTime = (end - start) / 1000; // تبدیل به ثانیه

                    console.log(
                        `زمان آپلود: ${uploadTime}s، حجم: ${size} bytes`
                    );

                    if (uploadTime > 0.5) {
                        // اگر حداقل 500ms طول کشید
                        const speedBps = (size * 8) / uploadTime; // bits per second
                        const speedMbps = speedBps / (1024 * 1024); // Megabits per second

                        console.log(
                            `سرعت آپلود محاسبه شده: ${speedMbps.toFixed(
                                2
                            )} Mbps`
                        );

                        if (speedMbps > bestUploadSpeed) {
                            bestUploadSpeed = speedMbps;
                        }

                        successfulUploads++;

                        // نمایش پیشرفت در طول تست
                        setTargetSpeed(speedMbps);
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1500)
                        );
                    }
                } catch (error) {
                    console.error(`خطا در آپلود با حجم ${size}:`, error);
                }
            }

            if (successfulUploads > 0) {
                actualUploadSpeed = bestUploadSpeed;
                console.log(
                    `سرعت نهایی آپلود: ${actualUploadSpeed.toFixed(2)} Mbps`
                );
            } else {
                // تست فالبک ساده
                console.log("انجام تست آپلود فالبک...");
                try {
                    const testData = new Uint8Array(131072); // 128KB
                    for (let i = 0; i < 131072; i++) {
                        testData[i] = Math.floor(Math.random() * 256);
                    }

                    const formData = new FormData();
                    formData.append(
                        "file",
                        new Blob([testData]),
                        "speedtest.bin"
                    );

                    const start = performance.now();
                    const response = await fetch("https://httpbin.org/post", {
                        method: "POST",
                        body: formData,
                    });
                    await response.json();
                    const end = performance.now();

                    const uploadTime = (end - start) / 1000;
                    if (uploadTime > 0) {
                        const speedBps = (131072 * 8) / uploadTime;
                        actualUploadSpeed = speedBps / (1024 * 1024);
                        console.log(
                            `سرعت آپلود فالبک: ${actualUploadSpeed.toFixed(
                                2
                            )} Mbps`
                        );
                    }
                } catch (fallbackError) {
                    console.error(
                        "تست آپلود فالبک نیز شکست خورد:",
                        fallbackError
                    );
                    actualUploadSpeed = 0;
                }
            }
        } catch (error) {
            console.error("خطای کلی در تست آپلود:", error);
            actualUploadSpeed = 0;
        }

        // تنظیم سرعت آپلود واقعی
        if (actualUploadSpeed > 0) {
            setUpload(actualUploadSpeed.toFixed(2));
            setTargetSpeed(actualUploadSpeed);
        } else {
            setUpload("0.00");
            setTargetSpeed(0);
        }

        // دریافت اطلاعات IP
        try {
            const res = await fetch(
                `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`
            );
            const data = await res.json();
            setIP(data.ip);
            setLocation(data.city);
            setServer(data.isp);
            setCountry(data.country_name);
        } catch (e) {
            console.error("خطا در دریافت اطلاعات IP:", e);
            try {
                const res = await fetch("https://ipapi.co/json/");
                const data = await res.json();
                setIP(data.ip);
                setLocation(data.city);
                setServer(data.org);
                setCountry(data.country_name);
            } catch (fallbackError) {
                console.error("خطا در سرویس فالبک IP:", fallbackError);
                setIP("نامشخص");
                setLocation("نامشخص");
                setServer("نامشخص");
                setCountry("نامشخص");
            }
        } finally {
            setIsTesting(false);
            setTestPhase(null);
            setShowServerSection(true);
        }
    };

    // باقی کد شما (useEffect و return) بدون تغییر...
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        const updateCanvasSize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        const animateGauge = () => {
            if (Math.abs(currentSpeed - targetSpeed) > 0.1) {
                setCurrentSpeed((prev) => prev + (targetSpeed - prev) * 0.1);
            } else {
                setCurrentSpeed(targetSpeed);
            }

            drawSpeedGauge();
            animationRef.current = requestAnimationFrame(animateGauge);
        };

        const drawSpeedGauge = () => {
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.4;

            ctx.clearRect(0, 0, width, height);

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = "#f8f9fa";
            ctx.fill();
            ctx.strokeStyle = "#dee2e6";
            ctx.lineWidth = 2;
            ctx.stroke();

            const startAngle = Math.PI * 0.75;
            const endAngle = Math.PI * 2.25;
            const totalAngle = endAngle - startAngle;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.85, startAngle, endAngle);
            ctx.lineWidth = radius * 0.1;
            ctx.strokeStyle = "#e9ecef";
            ctx.lineCap = "butt";
            ctx.stroke();

            let fillAngle;
            if (currentSpeed <= 100) {
                fillAngle =
                    startAngle + totalAngle * (currentSpeed / 100) * 0.5;
            } else {
                fillAngle =
                    startAngle +
                    totalAngle * 0.5 +
                    totalAngle *
                        ((Math.min(currentSpeed, 1000) - 100) / 900) *
                        0.5;
            }

            if (currentSpeed > 0) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius * 0.85, startAngle, fillAngle);
                ctx.lineWidth = radius * 0.1;
                ctx.strokeStyle = "#51cf66";
                ctx.lineCap = "butt";
                ctx.stroke();
            }

            for (let i = 0; i <= 20; i++) {
                let value;
                let position;

                if (i <= 10) {
                    value = i * 10;
                    position = i / 20;
                } else {
                    value = 100 + (i - 10) * 90;
                    position = 0.5 + (i - 10) / 20;
                }

                const angle = startAngle + totalAngle * position;

                if (i % 2 === 0 || i === 10) {
                    const textX = centerX + Math.cos(angle) * (radius * 0.65);
                    const textY = centerY + Math.sin(angle) * (radius * 0.65);

                    ctx.font = `${radius * 0.13}px Arial`;
                    ctx.fillStyle = "#495057";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(value.toString(), textX, textY);
                }
            }

            let needlePosition;
            if (currentSpeed <= 100) {
                needlePosition = (currentSpeed / 100) * 0.5;
            } else {
                needlePosition =
                    0.5 + ((Math.min(currentSpeed, 1000) - 100) / 900) * 0.5;
            }

            const needleAngle = startAngle + totalAngle * needlePosition;

            ctx.beginPath();
            ctx.moveTo(
                centerX + Math.cos(needleAngle - Math.PI) * (radius * 0.1),
                centerY + Math.sin(needleAngle - Math.PI) * (radius * 0.1)
            );
            ctx.lineTo(
                centerX + Math.cos(needleAngle) * (radius * 0.8),
                centerY + Math.sin(needleAngle) * (radius * 0.8)
            );
            ctx.strokeStyle = "#fa5252";
            ctx.lineWidth = radius * 0.04;
            ctx.lineCap = "round";
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.12, 0, Math.PI * 2);
            ctx.fillStyle = "#fa5252";
            ctx.fill();
            ctx.strokeStyle = "#e03131";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = `bold ${radius * 0.25}px Arial`;
            ctx.fillStyle = "#212529";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
                `${Math.round(currentSpeed * 10) / 10}`,
                centerX,
                centerY + radius * 0.3
            );

            ctx.font = `${radius * 0.15}px Arial`;
            ctx.fillStyle = "#495057";
            ctx.fillText("Mbps", centerX, centerY + radius * 0.5);
        };

        animationRef.current = requestAnimationFrame(animateGauge);

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [currentSpeed, targetSpeed, testPhase]);

    return (
        <AppLayoutSwitcher
            auth={auth}
            headerData={headerData}
            footerData={footerData}
        >
            <Head title={t("network_test.title")} />

            <div
                className={`flex flex-col items-center justify-start text-center mb-10`}
            >
                <div className="w-full bg-gray-50">
                    <h1 className="text-3xl font-bold mb-14 mt-[120px] px-4">
                        {t("network_test.title")}
                    </h1>

                    {/* Add CSS for smooth animations */}
                    <style jsx>{`
                        .test-section {
                            opacity: 0;
                            max-height: 0;
                            overflow: hidden;
                            transition: opacity 0.5s ease, max-height 0.5s ease;
                        }
                        .test-section.visible {
                            opacity: 1;
                            max-height: 1000px;
                        }
                    `}</style>

                    {!showTestInterface && (
                        <button
                            onClick={measureNetwork}
                            disabled={isTesting}
                            className="my-6 px-8 py-3 primary text-white text-lg rounded-lg shadow hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                            {t("network_test.start_test")}
                        </button>
                    )}

                    <div
                        className={`w-full px-4 space-y-8 test-section ${
                            showTestInterface ? "visible" : ""
                        }`}
                    >
                        {/* Performance section  */}
                        <table className="w-[60%] mx-auto border-collapse">
                            <thead>
                                <tr className="border-y border-gray-200">
                                    <th className="text-lg font-semibold py-2 w-[33.3%]">
                                        {t("network_test.ping")}
                                    </th>
                                    <th className="text-lg font-semibold py-2 w-[33.3%]">
                                        {t("network_test.download")}
                                    </th>
                                    <th className="text-lg font-semibold py-2 w-[33.3%]">
                                        {t("network_test.upload")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td
                                        className={`text-lg relative font-semibold py-2 ${
                                            testPhase === "ping"
                                                ? "text-green-500"
                                                : "text-gray-700 text-center"
                                        }`}
                                    >
                                        {testPhase === "ping" && !ping && (
                                            <div className="middle mt-5 text-center">
                                                <div className="bar bar1"></div>
                                                <div className="bar bar2"></div>
                                                <div className="bar bar3"></div>
                                                <div className="bar bar4"></div>
                                                <div className="bar bar5"></div>
                                                <div className="bar bar6"></div>
                                                <div className="bar bar7"></div>
                                                <div className="bar bar8"></div>
                                            </div>
                                        )}
                                        {ping ? `${ping} ms` : ""}
                                    </td>
                                    <td
                                        className={`text-lg relative font-semibold py-2 ${
                                            testPhase === "download"
                                                ? "text-green-500"
                                                : "text-gray-700 text-center"
                                        }`}
                                    >
                                        {testPhase === "download" &&
                                            !download && (
                                                <div className="middle pt-3 text-center">
                                                    <div className="bar bar1"></div>
                                                    <div className="bar bar2"></div>
                                                    <div className="bar bar3"></div>
                                                    <div className="bar bar4"></div>
                                                    <div className="bar bar5"></div>
                                                    <div className="bar bar6"></div>
                                                    <div className="bar bar7"></div>
                                                    <div className="bar bar8"></div>
                                                </div>
                                            )}
                                        {download ? `${download} Mbps` : ""}
                                    </td>
                                    <td
                                        className={`text-lg relative font-semibold py-2 ${
                                            testPhase === "upload"
                                                ? "text-green-500"
                                                : "text-gray-700 text-center"
                                        }`}
                                    >
                                        {testPhase === "upload" && !upload && (
                                            <div className="middle pt-3 text-center">
                                                <div className="bar bar1"></div>
                                                <div className="bar bar2"></div>
                                                <div className="bar bar3"></div>
                                                <div className="bar bar4"></div>
                                                <div className="bar bar5"></div>
                                                <div className="bar bar6"></div>
                                                <div className="bar bar7"></div>
                                                <div className="bar bar8"></div>
                                            </div>
                                        )}
                                        {upload ? `${upload} Mbps` : ""}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Canvas section - hidden when test is completed */}
                        <div
                            className={`relative mb-6 w-full max-w-md mx-auto ${
                                !isTesting && ping && download && upload
                                    ? "hidden"
                                    : ""
                            }`}
                        >
                            <canvas
                                ref={canvasRef}
                                className="w-full aspect-square"
                            />
                        </div>

                        {/* Server section  */}
                        <table
                            className={`w-[60%] mx-auto border-collapse ${
                                showServerSection ? "" : "hidden"
                            }`}
                        >
                            <thead>
                                <tr className="border-y border-gray-200">
                                    <th className="text-lg font-semibold py-2 w-[33.3%]">
                                        {t("network_test.ip")}
                                    </th>
                                    <th className="text-lg font-semibold py-2 w-[33.3%]">
                                        {t("network_test.location")}
                                    </th>
                                    <th className="text-lg font-semibold py-2 w-[33.3%]">
                                        {t("network_test.server")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td
                                        className={`text-lg font-semibold py-2 ${
                                            testPhase === "ip"
                                                ? "text-green-500"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {ip || "..."}
                                    </td>
                                    <td
                                        className={`text-lg font-semibold py-2 ${
                                            testPhase === "download"
                                                ? "text-green-500"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {location || "..."}
                                    </td>
                                    <td
                                        className={`text-lg font-semibold py-2 ${
                                            testPhase === "upload"
                                                ? "text-green-500"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {server || "..."}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* test button section  */}
                    {showTestInterface && (
                        <button
                            onClick={measureNetwork}
                            disabled={isTesting}
                            className="my-6 px-8 py-3 mx-4 primary text-white text-lg rounded-lg shadow hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                            {isTesting
                                ? t("network_test.testing")
                                : t("network_test.test_again")}
                        </button>
                    )}
                </div>
                {/* description section */}
                <div
                    className={`${
                        lang === "en" ? "text-left" : "text-right"
                    } p-6 bg-gray-50 py-10 w-full`}
                >
                    <h2 className="text-xl font-bold mb-4 text-primary">
                        {t("network_test.about_title")}
                    </h2>
                    <p className="mb-4">{t("network_test.description_long")}</p>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold inline-block ml-2">
                            {t("network_test.guide_title")}:
                        </h3>
                        <span>{t("network_test.guide_description")}</span>
                    </div>
                    <ul className="list-disc px-5 space-y-2 text-gray-800">
                        <li>{t("network_test.guide_item1")}</li>
                        <li>{t("network_test.guide_item2")}</li>
                        <li>{t("network_test.guide_item3")}</li>
                        <li>{t("network_test.guide_item4")}</li>
                        <li>{t("network_test.guide_item5")}</li>
                    </ul>
                    <p className="mt-6 text-gray-800 font-bold">
                        {t("network_test.support_message")}
                    </p>
                </div>
                {/* <!-- curved-div --> */}
                <div className="rotate-180 w-full">
                    <svg
                        class="packages_svg"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        xmlns:svgjs="http://svgjs.com/svgjs"
                        width="100%"
                        height="100"
                        preserveAspectRatio="none"
                        viewBox="0 0 1440 100"
                    >
                        <g mask='url("#SvgjsMask1071")' fill="none">
                            <path
                                d="M 0,40 C 96,50 288,90.2 480,90 C 672,89.8 768,43 960,39 C 1152,35 1344,63.8 1440,70L1440 100L0 100z"
                                fill="#f7f9fc"
                            ></path>
                        </g>
                        <defs>
                            <mask id="SvgjsMask1071">
                                <rect
                                    width="1440"
                                    height="100"
                                    fill="#ffffff"
                                ></rect>
                            </mask>
                        </defs>
                    </svg>
                </div>
            </div>
        </AppLayoutSwitcher>
    );
}
