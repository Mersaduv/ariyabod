// مسیر: resources/js/Pages/NetworkTest.jsx
import React, { useState, useRef, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";
import { useTranslation } from "react-i18next";
import AppLayoutSwitcher from "@/Layouts/AppLayoutSwitcher";
const TEST_DURATION = 13000;
const PING_COUNT = 10;
const DOWNLOAD_CONNECTIONS = 6;
const UPLOAD_CONNECTIONS = 4;
// Network protocol overhead factor (accounts for TCP/IP headers, etc.)
const NETWORK_OVERHEAD_FACTOR = 0.94; // Approximately 6% overhead

export default function NetworkTest({
    auth,
    headerData,
    footerData,
    servicesItems,
}) {
    const { t } = useTranslation();
    const [ping, setPing] = useState(null);
    const [downloadSpeed, setDownloadSpeed] = useState(null);
    const [uploadSpeed, setUploadSpeed] = useState(null);
    const [rawDownloadSpeed, setRawDownloadSpeed] = useState(null); // Store raw speed before overhead correction
    const [rawUploadSpeed, setRawUploadSpeed] = useState(null); // Store raw speed before overhead correction
    const [testing, setTesting] = useState(false);
    const [testPhase, setTestPhase] = useState(null);
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [targetSpeed, setTargetSpeed] = useState(0);
    const [ip, setIP] = useState(null);
    const [location, setLocation] = useState(null);
    const [server, setServer] = useState("آریابد");
    const [country, setCountry] = useState(null);
    const [showServerSection, setShowServerSection] = useState(false);
    const [showTestInterface, setShowTestInterface] = useState(false);

    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const lang = localStorage.getItem("lang") || "fa";
    // اگر از API استفاده می‌کنید، کلید API را اینجا قرار دهید یا از env استفاده کنید
    const apiKey = import.meta.env.VITE_IP_API_KEY || "";

    const measurePing = async () => {
        setTestPhase("ping");
        let total = 0;
        for (let i = 0; i < PING_COUNT; i++) {
            const start = performance.now();
            await fetch("/speedtest/ping?_t=" + Date.now());
            const duration = performance.now() - start;
            total += duration;
        }
        return total / PING_COUNT;
    };

    const runDownloadTest = async () => {
        setTestPhase("download");
        setTargetSpeed(0);
        setCurrentSpeed(0);

        let totalBytes = 0;
        const startTime = performance.now();
        const controllers = [];

        const download = async (ctrl) => {
            try {
                const response = await fetch("/speedtest/download-file", {
                    signal: ctrl.signal,
                });
                const reader = response.body.getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    totalBytes += value.length;

                    // Update current speed during test
                    const currentDuration =
                        (performance.now() - startTime) / 1000;
                    if (currentDuration > 0) {
                        const rawSpeedMbps =
                            (totalBytes * 8) / currentDuration / 1024 / 1024;
                        const adjustedSpeedMbps =
                            rawSpeedMbps * NETWORK_OVERHEAD_FACTOR;
                        setTargetSpeed(adjustedSpeedMbps);
                    }
                }
            } catch {}
        };

        for (let i = 0; i < DOWNLOAD_CONNECTIONS; i++) {
            const controller = new AbortController();
            controllers.push(controller);
            download(controller);
        }

        await new Promise((resolve) => setTimeout(resolve, TEST_DURATION));
        controllers.forEach((ctrl) => ctrl.abort());

        const duration = (performance.now() - startTime) / 1000;
        const rawSpeedMbps = (totalBytes * 8) / duration / 1024 / 1024;
        const adjustedSpeedMbps = rawSpeedMbps * NETWORK_OVERHEAD_FACTOR;

        setRawDownloadSpeed(rawSpeedMbps.toFixed(2));
        setTargetSpeed(adjustedSpeedMbps);
        return adjustedSpeedMbps;
    };

    const runUploadTest = async () => {
        setTestPhase("upload");
        setTargetSpeed(0);
        setCurrentSpeed(0);

        let totalBytes = 0;
        const startTime = performance.now();
        const dummyData = new Uint8Array(1024 * 1024); // 1MB
        const shouldStop = { stop: false };

        const upload = async () => {
            try {
                while (!shouldStop.stop) {
                    await fetch("/speedtest/upload-target", {
                        method: "POST",
                        body: dummyData,
                        headers: { "Content-Type": "application/octet-stream" },
                    });
                    totalBytes += dummyData.length;

                    // Update current speed during test
                    const currentDuration =
                        (performance.now() - startTime) / 1000;
                    if (currentDuration > 0) {
                        const rawSpeedMbps =
                            (totalBytes * 8) / currentDuration / 1024 / 1024;
                        const adjustedSpeedMbps =
                            rawSpeedMbps * NETWORK_OVERHEAD_FACTOR;
                        setTargetSpeed(adjustedSpeedMbps);
                    }
                }
            } catch {}
        };

        const uploaders = [];
        for (let i = 0; i < UPLOAD_CONNECTIONS; i++) {
            uploaders.push(upload());
        }

        await new Promise((resolve) => setTimeout(resolve, TEST_DURATION));
        shouldStop.stop = true;

        const duration = (performance.now() - startTime) / 1000;
        const rawSpeedMbps = (totalBytes * 8) / duration / 1024 / 1024;
        const adjustedSpeedMbps = rawSpeedMbps * NETWORK_OVERHEAD_FACTOR;

        setRawUploadSpeed(rawSpeedMbps.toFixed(2));
        setTargetSpeed(adjustedSpeedMbps);
        return adjustedSpeedMbps;
    };

    // دریافت اطلاعات IP و موقعیت
    const fetchIPInfo = async () => {
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
                // سرویس جایگزین در صورت خطا
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
                setServer("آریابد");
                setCountry("نامشخص");
            }
        }
    };

    const startTest = async () => {
        if (!showTestInterface) {
            setShowTestInterface(true);
        }

        setTesting(true);
        setPing(null);
        setDownloadSpeed(null);
        setUploadSpeed(null);
        setRawDownloadSpeed(null);
        setRawUploadSpeed(null);
        setTestPhase(null);
        setTargetSpeed(0);
        setCurrentSpeed(0);
        setShowServerSection(false);
        setIP(null);
        setLocation(null);
        setServer("آریابد");
        setCountry(null);

        const pingResult = await measurePing();
        setPing(pingResult.toFixed(2));

        const downloadResult = await runDownloadTest();
        setDownloadSpeed(downloadResult.toFixed(2));

        const uploadResult = await runUploadTest();
        setUploadSpeed(uploadResult.toFixed(2));

        // بعد از تکمیل تست‌ها، اطلاعات IP را دریافت می‌کنیم
        await fetchIPInfo();

        setTestPhase(null);
        setTesting(false);
        setShowServerSection(true);
    };

    // Canvas setup and animation
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
            servicesItems={servicesItems}
        >
            <Head title="Speed Test" />
            <div className="w-full bg-gray-50">
                <h1 className="text-3xl text-center font-bold mb-14 pt-[120px] px-4">
                    {t("network_test.title")}
                </h1>
                {/* Initial test button */}
                <div className="flex justify-center">
                    {!showTestInterface && (
                        <button
                            className="my-6 px-8 py-3 primary text-white text-lg rounded-lg shadow hover:bg-green-600 disabled:opacity-50 transition-colors"
                            onClick={startTest}
                            disabled={testing}
                        >
                            {t("network_test.start_test")}
                        </button>
                    )}
                </div>

                <div
                    className={`w-full px-4 space-y-8 test-section ${
                        showTestInterface ? "visible" : ""
                    }`}
                >
                    {/* Performance section */}
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

                        @media (max-width: 600px) {
                            .test-section {
                                padding: 0 10px;
                            }
                            .test-section.visible {
                                max-height: 800px;
                            }
                        }

                        @media (max-width: 430px) {
                            .test-section {
                                padding: 0 5px;
                            }
                            .test-section.visible {
                                max-height: 700px;
                            }
                        }

                        /* Bar animation styles */
                        .middle {
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            position: absolute;
                            white-space: nowrap;
                            text-align: center;
                            min-width: 80px;
                        }
                        .bar {
                            width: 7px;
                            height: 30px;
                            display: inline-block;
                            transform-origin: bottom center;
                            border-top-right-radius: 20px;
                            border-top-left-radius: 20px;
                            animation: loader 1.2s linear infinite;
                            margin: 0 1px;
                        }

                        @media (max-width: 600px) {
                            .middle {
                                transform: translate(-50%, -50%) scale(0.8);
                            }
                            .bar {
                                width: 5px;
                                height: 22px;
                            }
                        }

                        @media (max-width: 430px) {
                            .middle {
                                transform: translate(-50%, -50%) scale(0.65);
                            }
                            .bar {
                                width: 4px;
                                height: 18px;
                                margin: 0 1px;
                            }
                        }

                        .bar1 {
                            animation-delay: 0.1s;
                        }
                        .bar2 {
                            animation-delay: 0.2s;
                        }
                        .bar3 {
                            animation-delay: 0.3s;
                        }
                        .bar4 {
                            animation-delay: 0.4s;
                        }
                        .bar5 {
                            animation-delay: 0.5s;
                        }
                        .bar6 {
                            animation-delay: 0.6s;
                        }
                        .bar7 {
                            animation-delay: 0.7s;
                        }
                        .bar8 {
                            animation-delay: 0.8s;
                        }

                        @keyframes loader {
                            0% {
                                transform: scaleY(0.1);
                                background: #428b7c;
                            }
                            50% {
                                transform: scaleY(1);
                                background: yellowgreen;
                            }
                            100% {
                                transform: scaleY(0.1);
                                background: transparent;
                            }
                        }
                    `}</style>

                    {!showTestInterface && (
                        <button
                            onClick={startTest}
                            disabled={testing}
                            className="my-6 px-8 py-3 primary text-white text-lg rounded-lg shadow hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                            {t("network_test.start_test")}
                        </button>
                    )}

                    <table className="w-[60%] mx-auto border-collapse">
                        <thead>
                            <tr className="border-y border-gray-200">
                                <th className="text-[14px] xs:text-base sm:text-lg font-semibold py-2 w-[33.3%] text-center">
                                    {t("network_test.ping")}
                                </th>
                                <th className="text-[14px] xs:text-base sm:text-lg font-semibold py-2 w-[33.3%] text-center">
                                    {t("network_test.download")}
                                </th>
                                <th className="text-[14px] xs:text-base sm:text-lg font-semibold py-2 w-[33.3%] text-center">
                                    {t("network_test.upload")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td
                                    className={`text-[14px] xs:text-base sm:text-lg relative text-center font-semibold py-2 ${
                                        testPhase === "ping"
                                            ? "text-green-500"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {testPhase === "ping" && !ping && (
                                        <div className="middle mt-5">
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
                                    className={`text-[14px] xs:text-base sm:text-lg relative text-center font-semibold py-2 ${
                                        testPhase === "download"
                                            ? "text-green-500"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {testPhase === "download" &&
                                        !downloadSpeed && (
                                            <div className="middle pt-3">
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
                                    {downloadSpeed ? (
                                        <div>
                                            <div className="text-green-600 font-bold">{`${downloadSpeed} Mbps`}</div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </td>
                                <td
                                    className={`text-[14px] xs:text-base sm:text-lg relative text-center font-semibold py-2 ${
                                        testPhase === "upload"
                                            ? "text-green-500"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {testPhase === "upload" && !uploadSpeed && (
                                        <div className="middle pt-3">
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
                                    {uploadSpeed ? (
                                        <div>
                                            <div className="text-green-600 font-bold">{`${uploadSpeed} Mbps`}</div>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Canvas gauge */}
                    <div
                        className={`relative mb-6 w-full max-w-md mx-auto ${
                            !testing && !testPhase ? "hidden" : ""
                        }`}
                    >
                        <canvas
                            ref={canvasRef}
                            className="w-full aspect-square"
                        />
                    </div>

                    {/* Server section */}
                    <table
                        className={`w-[60%] mx-auto border-collapse ${
                            showServerSection ? "" : "hidden"
                        }`}
                    >
                        <thead>
                            <tr className="border-y border-gray-200">
                                <th className="text-[14px] xs:text-base sm:text-lg font-semibold py-2 w-[33.3%] text-center">
                                    {t("network_test.ip")}
                                </th>
                                <th className="text-[14px] xs:text-base sm:text-lg font-semibold py-2 w-[33.3%] text-center">
                                    {t("network_test.location")}
                                </th>
                                <th className="text-[14px] xs:text-base sm:text-lg font-semibold py-2 w-[33.3%] text-center">
                                    {t("network_test.server")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="text-[14px] xs:text-base sm:text-lg font-semibold py-2 text-gray-700 text-center">
                                    {ip || "..."}
                                </td>
                                <td className="text-[14px] xs:text-base sm:text-lg font-semibold py-2 text-gray-700 text-center">
                                    {location || "..."}
                                </td>
                                <td className="text-[14px] xs:text-base sm:text-lg font-semibold py-2 text-gray-700 text-center">
                                    {server || "..."}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Test button section */}
                <div className="flex justify-center">
                    {showTestInterface && (
                        <button
                            onClick={startTest}
                            disabled={testing}
                            className="my-6 px-8 py-3 mx-4 primary text-white text-lg rounded-lg shadow hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                            {testing
                                ? t("network_test.testing")
                                : t("network_test.test_again")}
                        </button>
                    )}
                </div>

                {/* Description section */}
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

                {/* Curved div */}
                <div className="rotate-180 w-full">
                    <svg
                        className="packages_svg"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
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
