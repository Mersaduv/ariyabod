import AppLayoutSwitcher from "../Layouts/AppLayoutSwitcher";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";

export default function InternetBandwidthCalculator({ auth, headerData, footerData, speedOptions }) {
    const { t, i18n } = useTranslation();
    const lang = localStorage.getItem("lang") || "fa";

    // Default speed options if none provided
    const defaultSpeedOptions = [
        { id: 1, speed_in_kbps: 128, formatted_speed: "Kb 128" },
        { id: 2, speed_in_kbps: 256, formatted_speed: "Kb 256" },
        { id: 3, speed_in_kbps: 512, formatted_speed: "Kb 512" },
        { id: 4, speed_in_kbps: 750, formatted_speed: "Kb 750" },
        { id: 5, speed_in_kbps: 1024, formatted_speed: "MB 1" },
        { id: 6, speed_in_kbps: 2048, formatted_speed: "MB 2" },
        { id: 7, speed_in_kbps: 3072, formatted_speed: "MB 3" },
        { id: 8, speed_in_kbps: 4096, formatted_speed: "MB 4" },
        { id: 9, speed_in_kbps: 5120, formatted_speed: "MB 5" },
    ];

    const speedList = speedOptions || defaultSpeedOptions;

    const [volume, setVolume] = useState("");
    const [volumeUnit, setVolumeUnit] = useState("MB");
    const [speed, setSpeed] = useState(speedList[0]?.speed_in_kbps || 128);
    const [calculationResult, setCalculationResult] = useState(null);
    const [volumeDropdownOpen, setVolumeDropdownOpen] = useState(false);
    const [showTable, setShowTable] = useState(false);

    const volumeDropdownRef = useRef(null);

    // Handle clicks outside dropdowns
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                volumeDropdownRef.current &&
                !volumeDropdownRef.current.contains(event.target)
            ) {
                setVolumeDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Format time to appropriate format (hours, minutes, seconds)
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        let displayText = "";

        if (hours > 0) {
            displayText += `${hours} ${t("calculator.hour")}، `;
        }

        if (minutes > 0 || hours > 0) {
            displayText += `${minutes} ${t("calculator.minute")}، `;
        }

        displayText += `${remainingSeconds} ${t("calculator.second")}`;

        return displayText;
    };

    const calculateConnectionTime = () => {
        // Convert volume to MB
        let volumeInMB = parseFloat(volume);
        if (volumeUnit === "GB") volumeInMB *= 1024;
        if (volumeUnit === "TB") volumeInMB *= 1024 * 1024;

        // Convert speed from Kbps to KB/s (divide by 8)
        const speedInKBps = speed / 8;

        // Calculate time in seconds
        const timeInSeconds = (volumeInMB * 1024) / speedInKBps;

        return formatTime(timeInSeconds);
    };

    const handleCalculate = () => {
        const result = calculateConnectionTime();
        setCalculationResult(result);
        setShowTable(true);
    };

    // Calculate connection time for the default speeds (for the table)
    const calculateConnectionTimeForSpeed = (speedInKbps) => {
        // Convert volume to MB
        let volumeInMB = parseFloat(volume);
        if (volumeUnit === "GB") volumeInMB *= 1024;
        if (volumeUnit === "TB") volumeInMB *= 1024 * 1024;

        // Convert speed from Kbps to KB/s (divide by 8)
        const speedInKBps = speedInKbps / 8;

        // Calculate time in seconds
        const timeInSeconds = (volumeInMB * 1024) / speedInKBps;

        return formatTime(timeInSeconds);
    };

    const getConnectionTimeTable = () => {
        return speedList.map(option => ({
            speed: option.formatted_speed,
            time: calculateConnectionTimeForSpeed(option.speed_in_kbps)
        }));
    };

    return (
        <AppLayoutSwitcher auth={auth} headerData={headerData} footerData={footerData}>
            <Head title={t("calculator.bandwidth_calculator") || "محاسبه پهنای اینترنت"} />

            <div className="container mx-auto px-4 py-16 pt-24 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-4">
                        {t("calculator.bandwidth_calculator")}
                    </h2>

                    <p className="text-center mb-8">
                        {t("calculator.note_p2")}
                    </p>

                    <div className="bg-white rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <input
                                    type="number"
                                    value={volume}
                                    onChange={(e) => setVolume(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />

                                <div className="relative mx-2 z-50" ref={volumeDropdownRef}>
                                    <button
                                        onClick={() => setVolumeDropdownOpen(!volumeDropdownOpen)}
                                        className="border border-gray-300 bg-gray-100 px-4 py-2 rounded-lg flex items-center justify-center"
                                    >
                                        <span>{volumeUnit}</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    {volumeDropdownOpen && (
                                        <div className={`absolute z-50 ${lang !== 'en' ? 'left-0' : 'right-0'} mt-1 w-32 bg-white border border-gray-300 rounded shadow-lg`}>
                                            <div className="flex flex-col">
                                                <label className="inline-flex cursor-pointer hover:bg-gray-100 items-center px-4 py-2">
                                                    <input
                                                        type="radio"
                                                        checked={volumeUnit === "MB"}
                                                        onChange={() => {
                                                            setVolumeUnit("MB");
                                                            setCalculationResult(null);
                                                            setShowTable(false);
                                                            setVolumeDropdownOpen(false);
                                                        }}
                                                        className="form-radio"
                                                    />
                                                    <span className="mr-2">{t("calculator.MB")}</span>
                                                </label>
                                                <label className="inline-flex cursor-pointer hover:bg-gray-100 items-center px-4 py-2">
                                                    <input
                                                        type="radio"
                                                        checked={volumeUnit === "GB"}
                                                        onChange={() => {
                                                            setVolumeUnit("GB");
                                                            setCalculationResult(null);
                                                            setShowTable(false);
                                                            setVolumeDropdownOpen(false);
                                                        }}
                                                        className="form-radio"
                                                    />
                                                    <span className="mr-2">{t("calculator.GB")}</span>
                                                </label>
                                                <label className="inline-flex cursor-pointer hover:bg-gray-100 items-center px-4 py-2">
                                                    <input
                                                        type="radio"
                                                        checked={volumeUnit === "TB"}
                                                        onChange={() => {
                                                            setVolumeUnit("TB");
                                                            setCalculationResult(null);
                                                            setShowTable(false);
                                                            setVolumeDropdownOpen(false);
                                                        }}
                                                        className="form-radio"
                                                    />
                                                    <span className="mr-2">{t("calculator.TB")}</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleCalculate}
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition duration-200"
                                disabled={!volume}
                            >
                                {t("calculator.start_calculation")}
                            </button>
                        </div>

                        {showTable && (
                            <div className="mt-6">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-teal-600 text-white">
                                            <th className="py-3 px-4 text-center border-r border-teal-500">{t("calculator.connection_speed")}</th>
                                            <th className="py-3 px-4 text-center">{t("calculator.connection_time")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getConnectionTimeTable().map((item, index) => (
                                            <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                <td className="py-3 px-4 text-center border-r border-gray-200">
                                                    {item.speed}
                                                </td>
                                                <td className="py-3 px-4 text-center">{item.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayoutSwitcher>
    );
}
