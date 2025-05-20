import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { useTranslation } from "react-i18next";
import { FaCheck, FaTimes, FaFilter, FaAngleDown } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
// Helper function to format time from datetime string
const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "";

    // Extract time portion (HH:MM) from ISO datetime string
    return dateTimeString.substring(11, 16);
};

export default function Packages({
    auth,
    headerData,
    internetPackages,
    provinces,
    types,
}) {
    const { t } = useTranslation();
    const lang = localStorage.getItem("lang") || "fa";

    // State for filters
    const [selectedProvinces, setSelectedProvinces] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [filteredPackages, setFilteredPackages] = useState(internetPackages);
    const [activeFilters, setActiveFilters] = useState([]);

    // Separate refs for each dropdown
    const provinceDropdownRef = useRef(null);
    const typeDropdownRef = useRef(null);

    // Dropdown states
    const [provinceDropdownOpen, setProvinceDropdownOpen] = useState(false);
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
    console.log(provinces, "provinces");

    // Apply filters when they change
    useEffect(() => {
        let filtered = internetPackages;
        let activeFiltersList = [];

        if (selectedProvinces.length > 0) {
            filtered = filtered.filter((pkg) =>
                selectedProvinces.some(
                    (selectedProvince) =>
                        pkg.provinces &&
                        Array.isArray(pkg.provinces) &&
                        pkg.provinces.includes(selectedProvince)
                )
            );
            selectedProvinces.forEach((province) => {
                const provinceName = provinces[province]
                    ? provinces[province][lang]
                    : province;
                activeFiltersList.push({
                    type: "province",
                    value: province,
                    label: t("filters.province") + ": " + provinceName,
                });
            });
        }

        if (selectedTypes.length > 0) {
            filtered = filtered.filter((pkg) =>
                selectedTypes.includes(pkg.type)
            );
            selectedTypes.forEach((type) => {
                activeFiltersList.push({
                    type: "type",
                    value: type,
                    label:
                        t("filters.type") +
                            ": " +
                            t(`internet_packages.${type}`) || type,
                });
            });
        }

        setFilteredPackages(filtered);
        setActiveFilters(activeFiltersList);
    }, [selectedProvinces, selectedTypes]);

    // Toggle province selection
    const toggleProvince = (province, e) => {
        // Prevent checkbox click from closing dropdown
        e && e.stopPropagation();

        setSelectedProvinces((prev) =>
            prev.includes(province)
                ? prev.filter((p) => p !== province)
                : [...prev, province]
        );
    };

    // Toggle type selection
    const toggleType = (type, e) => {
        // Prevent checkbox click from closing dropdown
        e && e.stopPropagation();

        setSelectedTypes((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type]
        );
    };

    // Remove a filter
    const removeFilter = (filterType, filterValue) => {
        if (filterType === "province") {
            setSelectedProvinces((prev) =>
                prev.filter((p) => p !== filterValue)
            );
        } else if (filterType === "type") {
            setSelectedTypes((prev) => prev.filter((t) => t !== filterValue));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Handle province dropdown
            if (
                provinceDropdownRef.current &&
                !provinceDropdownRef.current.contains(event.target)
            ) {
                setProvinceDropdownOpen(false);
            }

            // Handle type dropdown separately
            if (
                typeDropdownRef.current &&
                !typeDropdownRef.current.contains(event.target)
            ) {
                setTypeDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <AppLayout auth={auth} headerData={headerData}>
            <Head title="Internet Packages - Ariyabod Companies Group" />

            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-center mb-4 mt-20">
                        {t("internet_packages.packages_title")}
                    </h1>
                    <p className="text-center text-gray-600 mb-12">
                        {t("internet_packages.package_description")}
                    </p>
                    {/* Filter Toolbar */}
                    <div className="bg-white p-4 mb-6 rounded-lg shadow">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2">
                                <FaFilter className="text-gray-500" />
                                <h2 className="font-medium">
                                    {t("filters.title")}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                {/* Province Filter - Multi-select Dropdown */}
                                <div
                                    ref={provinceDropdownRef}
                                    className="w-full md:w-48 relative"
                                >
                                    <button
                                        onClick={() =>
                                            setProvinceDropdownOpen(
                                                !provinceDropdownOpen
                                            )
                                        }
                                        className="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#428b7c] bg-white"
                                    >
                                        <span>
                                            {selectedProvinces.length > 0
                                                ? `${
                                                      selectedProvinces.length
                                                  } ${t(
                                                      "filters.province"
                                                  )}`
                                                : t("filters.all_provinces")}
                                        </span>
                                        <FaAngleDown
                                            className={`transform transition-transform ${
                                                provinceDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {provinceDropdownOpen && (
                                        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                                            {Object.keys(provinces).map(
                                                (provinceKey) => (
                                                    <div
                                                        key={provinceKey}
                                                        className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer gap-1"
                                                        onClick={(e) =>
                                                            toggleProvince(
                                                                provinceKey,
                                                                e
                                                            )
                                                        }
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedProvinces.includes(
                                                                provinceKey
                                                            )}
                                                            onChange={(e) =>
                                                                toggleProvince(
                                                                    provinceKey,
                                                                    e
                                                                )
                                                            }
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            className="mX-1 h-4 w-4 text-[#428b7c] border-gray-300 rounded focus:ring-[#428b7c]"
                                                        />
                                                        <span className="text-sm">
                                                            {
                                                                provinces[
                                                                    provinceKey
                                                                ][lang]
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Type Filter - Multi-select Dropdown */}
                                <div
                                    ref={typeDropdownRef}
                                    className="w-full md:w-48 relative"
                                >
                                    <button
                                        onClick={() =>
                                            setTypeDropdownOpen(
                                                !typeDropdownOpen
                                            )
                                        }
                                        className="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#428b7c] bg-white"
                                    >
                                        <span>
                                            {selectedTypes.length > 0
                                                ? `${selectedTypes.length} ${t(
                                                      "internet_packages.type"
                                                  )}`
                                                : t("filters.all_types")}
                                        </span>
                                        <FaAngleDown
                                            className={`transform transition-transform ${
                                                typeDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {typeDropdownOpen && (
                                        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto py-1">
                                            {types.map((type) => (
                                                <div
                                                    key={type}
                                                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer gap-1"
                                                    onClick={(e) =>
                                                        toggleType(type, e)
                                                    }
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTypes.includes(
                                                            type
                                                        )}
                                                        onChange={(e) =>
                                                            toggleType(type, e)
                                                        }
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        className="mX-1 h-4 w-4 text-[#428b7c] border-gray-300 rounded focus:ring-[#428b7c]"
                                                    />
                                                    <span className="text-sm">
                                                        {t(
                                                            `internet_packages.filter_item.${type}`
                                                        ) || type}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {activeFilters.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {activeFilters.map((filter, index) => (
                                    <div
                                        key={index}
                                        className="bg-[#e6f7f4] border border-[#428b7c] text-[#428b7c] px-3 py-1 rounded-full flex items-center gap-2"
                                    >
                                        <span>{filter.label}</span>
                                        <button
                                            onClick={() =>
                                                removeFilter(
                                                    filter.type,
                                                    filter.value
                                                )
                                            }
                                            className="hover:text-red-500"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}

                                {activeFilters.length > 1 && (
                                    <button
                                        onClick={() => {
                                            setSelectedProvinces([]);
                                            setSelectedTypes([]);
                                        }}
                                        className="text-sm text-gray-500 hover:text-red-500 underline"
                                    >
                                        {t("filters.clear_all")}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {filteredPackages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredPackages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div
                                        className={`p-4 ${
                                            pkg.is_featured
                                                ? "bg-purple-100"
                                                : "bg-[#e6f7f4]"
                                        }`}
                                    >
                                        <h3 className="text-lg font-semibold text-center">
                                            {pkg.title[lang]}
                                        </h3>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-center mb-4">
                                            <span className="text-2xl font-bold text-[#428b7c]">
                                                {pkg.price.toLocaleString()}
                                                <span className="text-sm font-normal">
                                                    {" "}
                                                    {t(
                                                        "internet_packages.currency"
                                                    )}
                                                </span>
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {/* Type Badge */}
                                            <div className="mb-3">
                                                <span className="inline-block bg-gray-100 rounded px-2 py-1 text-sm text-gray-700 w-full text-center">

                                                    {t(
                                                        `internet_packages.${pkg.type}`
                                                    ) || pkg.type}
                                                </span>
                                            </div>

                                            {/* Show province */}
                                            {pkg.provinces &&
                                                Array.isArray(pkg.provinces) &&
                                                pkg.provinces.length > 0 && (
                                                    <div className="flex items-center gap-2 mt-4 pt-2">
                                                        <span className="text-gray-600">
                                                            <GrMapLocation className="primary-color text-lg" />
                                                        </span>
                                                        <span>
                                                            {pkg.provinces.map(
                                                                (prov, idx) => (
                                                                    <span
                                                                        key={
                                                                            idx
                                                                        }
                                                                    >
                                                                        {provinces[
                                                                            prov
                                                                        ] &&
                                                                            provinces[
                                                                                prov
                                                                            ][
                                                                                lang
                                                                            ]}
                                                                        {idx <
                                                                        pkg
                                                                            .provinces
                                                                            .length -
                                                                            1
                                                                            ? ", "
                                                                            : ""}
                                                                    </span>
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                            {/* Duration */}
                                            {pkg.duration_days && (
                                                <div className="flex gap-2">
                                                    <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                        <FaCheck className="text-white text-[15px]" />
                                                    </div>
                                                    <span>
                                                        {pkg.duration_days}{" "}
                                                        {t(
                                                            "internet_packages.days"
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Total Volume */}
                                            {pkg.total_volume_gb && (
                                                <div className="flex gap-2">
                                                    <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                        <FaCheck className="text-white text-[15px]" />
                                                    </div>
                                                    <span>
                                                        {pkg.total_volume_gb}{" "}
                                                        {t(
                                                            "internet_packages.gb"
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Daily Limit */}
                                            {pkg.daily_limit_gb && (
                                                <div className="flex gap-2">
                                                    <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                        <FaCheck className="text-white text-[15px]" />
                                                    </div>
                                                    <span>
                                                        {pkg.daily_limit_gb}{" "}
                                                        {t(
                                                            "internet_packages.daily_gb"
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Speed */}
                                            {pkg.speed_mb && (
                                                <div className="flex gap-2">
                                                    <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                        <FaCheck className="text-white text-[15px]" />
                                                    </div>
                                                    <span>
                                                        {pkg.speed_mb}{" "}
                                                        {t(
                                                            "internet_packages.mb_speed"
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Speed Slots for Unlimited packages */}
                                            {pkg.type === "unlimited" &&
                                                pkg.speed_slots &&
                                                Object.keys(pkg.speed_slots)
                                                    .length > 0 && (
                                                    <div className="space-y-3">
                                                        {Object.entries(
                                                            pkg.speed_slots
                                                        ).map(
                                                            (
                                                                [key, slot],
                                                                idx
                                                            ) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex gap-2 text-sm"
                                                                >
                                                                    <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                                        <FaCheck className="text-white text-[15px]" />
                                                                    </div>
                                                                    <div className="flex gap-1 items-center">
                                                                        {"( "}
                                                                        {slot.from ||
                                                                            ""}{" "}
                                                                        <span className="text-gray-600">
                                                                            -
                                                                        </span>
                                                                        {slot.to ||
                                                                            ""}
                                                                        {" )"}
                                                                    </div>

                                                                    <span>
                                                                        {slot.speed_mb ||
                                                                            ""}{" "}
                                                                        {t(
                                                                            "internet_packages.mb_speed"
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                            {/* Night Mode Information */}
                                            {pkg.has_night_free && (
                                                <div className="flex gap-2">
                                                    <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                        <FaCheck className="text-white text-[15px]" />
                                                    </div>
                                                    <div className="flex gap-1 items-center">
                                                        <div className="text-sm flex gap-1 items-center">
                                                            {"("}
                                                            {formatTime(
                                                                pkg.night_free_start_time
                                                            )}
                                                            <span className="text-gray-600">
                                                                -
                                                            </span>{" "}
                                                            {formatTime(
                                                                pkg.night_free_end_time
                                                            )}
                                                            {")"}
                                                        </div>
                                                        <span className="text-sm whitespace-nowrap">
                                                            {pkg.is_night_free
                                                                ? t(
                                                                      "internet_packages.free"
                                                                  )
                                                                : `${t(
                                                                      "internet_packages.speed"
                                                                  )} ${
                                                                      pkg.night_free_speed_mb
                                                                  } ${t(
                                                                      "internet_packages.mb"
                                                                  )}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-10 rounded-lg shadow text-center">
                            <p className="text-lg text-gray-500">
                                {t("internet_packages.no_packages_found")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
