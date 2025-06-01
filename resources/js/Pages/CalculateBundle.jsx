import AppLayoutSwitcher from "../Layouts/AppLayoutSwitcher";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

export default function CalculateBundle({
    auth,
    headerData,
    footerData,
    speedOptions,
    servicesItems,
}) {
    const { t, i18n } = useTranslation(); // translation text and i18n instance
    const lang = localStorage.getItem("lang") || "fa";

    // Get default speed from the first speed option or use 420 Kbps as fallback
    const defaultSpeed =
        speedOptions && speedOptions.length > 0
            ? speedOptions[0].speed_in_kbps
            : 420;

    const [speed, setSpeed] = useState(defaultSpeed);
    const [speedUnit, setSpeedUnit] = useState("Kb"); // Unit for speed
    const [volume, setVolume] = useState(""); // Volume amount
    const [volumeUnit, setVolumeUnit] = useState("MB"); // Unit for volume (MB, GB, TB)
    const [time, setTime] = useState(""); // Time amount
    const [timeUnit, setTimeUnit] = useState("second"); // Unit for time - use keys instead of translated text
    const [calculationType, setCalculationType] = useState("calculate_time"); // Set default calc type - use keys instead of translated text
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [speedDropdownOpen, setSpeedDropdownOpen] = useState(false);
    const [volumeDropdownOpen, setVolumeDropdownOpen] = useState(false);
    const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
    const [displayResult, setDisplayResult] = useState({
        value: "",
        unit: "",
    });

    // Refs for detecting clicks outside of dropdowns
    const typeDropdownRef = useRef(null);
    const volumeDropdownRef = useRef(null);
    const timeDropdownRef = useRef(null);

    // Handle clicks outside dropdowns
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                typeDropdownRef.current &&
                !typeDropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
            if (
                volumeDropdownRef.current &&
                !volumeDropdownRef.current.contains(event.target)
            ) {
                setVolumeDropdownOpen(false);
            }
            if (
                timeDropdownRef.current &&
                !timeDropdownRef.current.contains(event.target)
            ) {
                setTimeDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Update translations when language changes
    useEffect(() => {
        // Force update of calculations when language changes
        const { baseSpeed, baseVolume, baseTime } = convertToBaseUnits();
        recalculate(baseSpeed, baseVolume, baseTime);
    }, [i18n.language]);

    // Helper function to convert units to base units for calculation
    const convertToBaseUnits = () => {
        // Convert speed to KB/s (divide by 8 for Kb to KB)
        let baseSpeed = speedUnit === "Kb" ? speed / 8 : speed * 125; // If Mb, convert to KB/s

        // Convert volume to MB
        let baseVolume = parseFloat(volume);
        if (volumeUnit === "GB") baseVolume *= 1024;
        if (volumeUnit === "TB") baseVolume *= 1024 * 1024;

        // Convert time to seconds
        let baseTime = parseFloat(time);
        if (timeUnit === "minute") baseTime *= 60;
        if (timeUnit === "hour") baseTime *= 3600;

        return { baseSpeed, baseVolume, baseTime };
    };

    // Format time to appropriate unit
    const formatTime = (seconds) => {
        // Handle different time ranges
        if (seconds < 1) {
            return {
                value: seconds.toFixed(2),
                unit: "second",
                displayText: `${seconds.toFixed(0)} ${t("calculator.second")}`,
            };
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        let displayText = "";
        let primaryUnit = "second";
        let primaryValue = seconds.toFixed(2);

        if (hours > 0) {
            displayText += `${hours} ${t("calculator.hour")}`;
            primaryUnit = "hour";
            primaryValue = hours;

            if (minutes > 0 || remainingSeconds > 0) displayText += "، ";
        }

        if (minutes > 0) {
            displayText += `${minutes} ${t("calculator.minute")}`;
            if (hours === 0) {
                primaryUnit = "minute";
                primaryValue = minutes;
            }

            if (remainingSeconds > 0) displayText += "، ";
        }

        if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
            displayText += `${remainingSeconds} ${t("calculator.second")}`;
            if (hours === 0 && minutes === 0) {
                primaryValue = remainingSeconds;
            }
        }

        return {
            value: primaryValue,
            unit: primaryUnit,
            displayText: displayText,
        };
    };

    // Format volume to appropriate unit
    const formatVolume = (mbValue) => {
        if (mbValue >= 1024 * 1024) {
            // Convert to TB only if >= 1024 GB (1 TB)
            return {
                value: (mbValue / (1024 * 1024)).toFixed(2),
                unit: "TB",
                displayText: `${(mbValue / (1024 * 1024)).toFixed(2)} TB`,
            };
        } else if (mbValue >= 1024) {
            // Convert to GB only if >= 1024 MB (1 GB)
            return {
                value: (mbValue / 1024).toFixed(2),
                unit: "GB",
                displayText: `${(mbValue / 1024).toFixed(2)} GB`,
            };
        } else if (mbValue < 1) {
            // Display in KB if less than 1 MB
            const kbValue = Math.round(mbValue * 1024);
            return {
                value: kbValue,
                unit: "KB",
                displayText: `${kbValue} KB`,
            };
        } else {
            return {
                value: mbValue.toFixed(2),
                unit: "MB",
                displayText: `${mbValue.toFixed(2)} MB`,
            };
        }
    };

    // Format speed to appropriate unit (Kb, Mb or Gb)
    const formatSpeed = (kbValue) => {
        if (kbValue >= 1000 * 1000) {
            // If more than 1000 Mb (1000000 Kb)
            return {
                value: (kbValue / (1000 * 1000)).toFixed(2),
                unit: "Gb",
                displayText: `${(kbValue / (1000 * 1000)).toFixed(2)} Gb`,
            };
        } else if (kbValue >= 1000) {
            // If more than 1000 Kb
            return {
                value: (kbValue / 1000).toFixed(2),
                unit: "Mb",
                displayText: `${(kbValue / 1000).toFixed(2)} Mb`,
            };
        } else {
            return {
                value: kbValue.toFixed(2),
                unit: "Kb",
                displayText: `${kbValue.toFixed(2)} Kb`,
            };
        }
    };

    // Recalculate function for calculation logic
    const recalculate = (baseSpeed, baseVolume, baseTime) => {
        if (!calculationType) return;

        try {
            if (
                calculationType === "calculate_time" &&
                baseSpeed &&
                baseVolume
            ) {
                // Calculate time in seconds
                const calculatedTime = (baseVolume * 1024) / baseSpeed;
                const formattedTime = formatTime(calculatedTime);
                setTime(formattedTime.value);
                setTimeUnit(formattedTime.unit);
                setDisplayResult({
                    value: formattedTime.value,
                    unit: formattedTime.unit,
                    displayText: formattedTime.displayText,
                });
            } else if (
                calculationType === "calculate_volume" &&
                baseSpeed &&
                baseTime
            ) {
                // Calculate volume in MB
                const calculatedVolume = (baseSpeed * baseTime) / 1024;
                const formattedVolume = formatVolume(calculatedVolume);
                setVolume(formattedVolume.value);
                setVolumeUnit(formattedVolume.unit);
                setDisplayResult({
                    value: formattedVolume.value,
                    unit: formattedVolume.unit,
                    displayText: formattedVolume.displayText,
                });
            } else if (
                calculationType === "calculate_speed" &&
                baseVolume &&
                baseTime
            ) {
                // Calculate speed in Kb/s
                const calculatedSpeedKB = (baseVolume * 1024) / baseTime;
                const calculatedSpeedKb = calculatedSpeedKB * 8; // Convert KB/s to Kb/s
                const formattedSpeed = formatSpeed(calculatedSpeedKb);
                setSpeed(formattedSpeed.value);
                setSpeedUnit(formattedSpeed.unit);
                setDisplayResult({
                    value: formattedSpeed.value,
                    unit: formattedSpeed.unit,
                    displayText: formattedSpeed.displayText,
                });
            }
        } catch (error) {
            console.error("Calculation error:", error);
        }
    };

    // Calculate based on selected type
    useEffect(() => {
        const { baseSpeed, baseVolume, baseTime } = convertToBaseUnits();
        recalculate(baseSpeed, baseVolume, baseTime);
    }, [calculationType, speed, speedUnit, volume, volumeUnit, time, timeUnit]);

    const handleTypeSelection = (type) => {
        setCalculationType(type);
        setDropdownOpen(false);
        setDisplayResult({ value: "", unit: "" });

        // Reset all fields to default values
        setSpeed(defaultSpeed);
        setSpeedUnit("Kb");
        setVolume("");
        setVolumeUnit("MB");
        setTime("");
        setTimeUnit("second");

        // Then disable only the field that will be calculated based on selected type
        if (type === "calculate_time") {
            setTime("");
        } else if (type === "calculate_volume") {
            setVolume("");
        } else if (type === "calculate_speed") {
            setSpeed("");
            setSpeedUnit("Kb");
        }
    };

    const handleSpeedChange = (e) => {
        const inputValue = parseFloat(e.target.value);

        if (!isNaN(inputValue)) {
            // If in Kb and value exceeds 1024, convert to Mb
            if (speedUnit === "Kb" && inputValue >= 1024) {
                setSpeed((inputValue / 1024).toFixed(2));
                setSpeedUnit("Mb");
            }
            // If in Mb and value is less than 1, convert back to Kb
            else if (speedUnit === "Mb" && inputValue < 1) {
                setSpeed((inputValue * 1024).toFixed(2));
                setSpeedUnit("Kb");
            } else {
                setSpeed(inputValue);
            }
        } else {
            setSpeed("");
        }
    };

    const handleSpeedSelection = (speedValue) => {
        setSpeed(speedValue);
        setSpeedDropdownOpen(false);
    };

    // Get translated time unit
    const getTranslatedTimeUnit = (unit) => {
        return t(`calculator.${unit}`);
    };

    // Get translated calculation type
    const getTranslatedCalculationType = (type) => {
        return t(`calculator.${type}`);
    };

    const renderFields = () => {
        // Define the fields
        const speedField = (
            <div className="mb-4 flex items-center">
                <label
                    className={`w-24 ${
                        lang === "en" ? "text-left" : "text-right"
                    }`}
                >
                    {t("calculator.speed")}
                </label>
                <div className="flex-1">
                    <select
                        value={speed}
                        onChange={(e) => setSpeed(e.target.value)}
                        className="w-full border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        {speedOptions && speedOptions.length > 0
                            ? speedOptions.map((option) => (
                                  <option
                                      key={option.id}
                                      value={option.speed_in_kbps}
                                  >
                                      {option.formatted_speed}
                                  </option>
                              ))
                            : // Fallback options if no speed options are available
                              [128, 256, 512, 1024, 2048, 4096].map((value) => (
                                  <option key={value} value={value}>
                                      {value < 1000
                                          ? `${value} Kb`
                                          : `${value / 1000} Mb`}
                                  </option>
                              ))}
                    </select>
                </div>
            </div>
        );

        const volumeField = (
            <div className="mb-4 flex items-center">
                <label
                    className={`w-24 ${
                        lang === "en" ? "text-left" : "text-right"
                    }`}
                >
                    {t("calculator.volume")}
                </label>
                <div className="flex-1 flex">
                    <input
                        type="number"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        className={`w-full border-gray-300 ${
                            lang === "en" ? "rounded-l-lg" : "rounded-r-lg"
                        }  focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
                    />
                    <div className="relative" ref={volumeDropdownRef}>
                        <button
                            onClick={() =>
                                setVolumeDropdownOpen(!volumeDropdownOpen)
                            }
                            className={`border border-gray-300  bg-gray-100 px-4 py-2 flex items-center justify-center ${
                                lang === "en"
                                    ? "rounded-r-lg border-l-0"
                                    : "rounded-l-lg border-r-0"
                            } `}
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
                            <div className="absolute left-0 mt-1 w-32 bg-white border border-gray-300 rounded shadow-lg z-20">
                                <div className="p-2 bg-gray-200 text-center font-bold">
                                    {t("calculator.volume_unit")}
                                </div>
                                <button
                                    onClick={() => {
                                        setVolumeUnit("MB");
                                        setVolumeDropdownOpen(false);
                                    }}
                                    className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                                >
                                    MB
                                </button>
                                <button
                                    onClick={() => {
                                        setVolumeUnit("GB");
                                        setVolumeDropdownOpen(false);
                                    }}
                                    className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                                >
                                    GB
                                </button>
                                <button
                                    onClick={() => {
                                        setVolumeUnit("TB");
                                        setVolumeDropdownOpen(false);
                                    }}
                                    className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                                >
                                    TB
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );

        const timeField = (
            <div className="mb-4 flex items-center">
                <label
                    className={`w-24 ${
                        lang === "en" ? "text-left" : "text-right"
                    } `}
                >
                    {t("calculator.time")}
                </label>
                <div className="flex-1 flex">
                    <input
                        type="number"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={`w-full border-gray-300 ${
                            lang === "en" ? "rounded-l-lg" : "rounded-r-lg"
                        }  focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
                    />
                    <div className="relative" ref={timeDropdownRef}>
                        <button
                            onClick={() =>
                                setTimeDropdownOpen(!timeDropdownOpen)
                            }
                            className={`border border-gray-300  bg-gray-100 px-4 py-2 flex items-center justify-center ${
                                lang === "en"
                                    ? "rounded-r-lg border-l-0"
                                    : "rounded-l-lg border-r-0"
                            } `}
                        >
                            <span>{getTranslatedTimeUnit(timeUnit)}</span>
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

                        {timeDropdownOpen && (
                            <div className="absolute left-0 mt-1 w-32 bg-white border border-gray-300 rounded shadow-lg z-20">
                                <div className="p-2 bg-gray-200 text-center font-bold">
                                    {t("calculator.time_unit")}
                                </div>
                                <button
                                    onClick={() => {
                                        setTimeUnit("second");
                                        setTimeDropdownOpen(false);
                                    }}
                                    className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                                >
                                    {t("calculator.second")}
                                </button>
                                <button
                                    onClick={() => {
                                        setTimeUnit("minute");
                                        setTimeDropdownOpen(false);
                                    }}
                                    className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                                >
                                    {t("calculator.minute")}
                                </button>
                                <button
                                    onClick={() => {
                                        setTimeUnit("hour");
                                        setTimeDropdownOpen(false);
                                    }}
                                    className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                                >
                                    {t("calculator.hour")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );

        // Define result field - this is a display-only field showing the calculated result
        const resultField = (
            <div className="mb-4 flex items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
                <label
                    className={`w-24 font-bold text-indigo-600 ${
                        lang === "en" ? "text-left" : "text-right"
                    }`}
                >
                    {getTranslatedCalculationType(calculationType)}
                </label>
                <div className="flex-1">
                    {displayResult.displayText ? (
                        <div
                            className={`bg-white border border-gray-300 rounded-lg py-2 px-4 ${
                                lang === "en" ? "text-left" : "text-right"
                            } `}
                        >
                            {displayResult.displayText}
                        </div>
                    ) : (
                        <div className="flex">
                            <input
                                type="text"
                                value={displayResult.value}
                                readOnly
                                className="w-full bg-white border-gray-300 rounded-lg"
                            />
                        </div>
                    )}
                </div>
            </div>
        );

        // Arrange fields based on calculation type
        if (calculationType === "calculate_time") {
            return (
                <>
                    {speedField}
                    {volumeField}
                    {calculationType && resultField}
                </>
            );
        } else if (calculationType === "calculate_volume") {
            return (
                <>
                    {speedField}
                    {timeField}
                    {calculationType && resultField}
                </>
            );
        } else if (calculationType === "calculate_speed") {
            return (
                <>
                    {volumeField}
                    {timeField}
                    {calculationType && resultField}
                </>
            );
        }

        // Default order if no calculation type is selected
        return (
            <>
                {speedField}
                {volumeField}
                {timeField}
            </>
        );
    };

    return (
        <AppLayoutSwitcher
            auth={auth}
            headerData={headerData}
            footerData={footerData}
            servicesItems={servicesItems}
        >
            <Head title={t("calculator.title")} />

            <div className="container mx-auto px-4 py-16 pt-24 text-center">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md">
                    <h2 className="text-xl flex items-center justify-center text-white font-bold primary h-[69px] rounded-t-lg">
                        {t("calculator.title")}
                    </h2>
                    <div className="p-6">
                        {renderFields()}

                        <div className="mb-4 flex gap-1 items-start">
                            <div className="font-bold whitespace-nowrap">
                                {t("calculator.note").split(":")[0] || "Note"} :
                            </div>
                            <p className="">{t("calculator.note_p1")}</p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <div className="text-sm font-semibold">
                                {t("calculator.calculation_type")}:
                            </div>
                            <div className="relative">
                                <div className="flex justify-end">
                                    <div
                                        className="w- relative"
                                        ref={typeDropdownRef}
                                    >
                                        <button
                                            onClick={() =>
                                                setDropdownOpen(!dropdownOpen)
                                            }
                                            className="w-full gap-1 bg-gray-200 py-2 px-4 rounded flex items-center justify-between"
                                        >
                                            <span className="whitespace-nowrap">
                                                {getTranslatedCalculationType(
                                                    calculationType
                                                ) ||
                                                    t("calculator.select_type")}
                                            </span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 transform ${
                                                    dropdownOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
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

                                        {dropdownOpen && (
                                            <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
                                                <div className="p-2 bg-gray-200 text-center font-bold">
                                                    {t(
                                                        "calculator.select_type"
                                                    )}
                                                </div>
                                                <div className="py-1">
                                                    <button
                                                        onClick={() =>
                                                            handleTypeSelection(
                                                                "calculate_time"
                                                            )
                                                        }
                                                        className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                                                    >
                                                        {t(
                                                            "calculator.calculate_time"
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleTypeSelection(
                                                                "calculate_volume"
                                                            )
                                                        }
                                                        className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                                                    >
                                                        {t(
                                                            "calculator.calculate_volume"
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleTypeSelection(
                                                                "calculate_speed"
                                                            )
                                                        }
                                                        className="block w-full text-right px-4 py-2 hover:bg-gray-100"
                                                    >
                                                        {t(
                                                            "calculator.calculate_speed"
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayoutSwitcher>
    );
}
