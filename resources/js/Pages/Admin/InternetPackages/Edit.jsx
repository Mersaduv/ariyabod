import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import { useForm, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SelectInput from "@/Components/SelectInput";
import Checkbox from "@/Components/Checkbox";
import { formatPriceWithCommas } from "@/Utils/functions";
import CustomCheckbox from "@/Components/ui/Checkbox";

export default function Edit({
    auth,
    internetPackage,
    festivals,
    attachedFestival,
    provinces,
}) {
    const { t } = useTranslation();
    const lang = localStorage.getItem("lang") || "fa";
    const [speedSlots, setSpeedSlots] = useState(
        internetPackage.speed_slots || [
            { from: "07:00", to: "06:00", speed_mb: 1.5 },
        ]
    );

    // Initialize festival selection state
    const [showFestivalPriceField, setShowFestivalPriceField] = useState(
        attachedFestival?.pivot?.is_special_price || false
    );
    const [isOpenProvinces, setIsOpenProvinces] = useState(false);
    const dropdownProvincesRef = useRef(null);

    const { data, setData, put, processing, errors } = useForm({
        title: internetPackage.title || {
            en: "",
            fa: "",
            ps: "",
        },
        type: internetPackage.type || "unlimited",
        price: internetPackage.price || "",
        duration_days: internetPackage.duration_days || "30",
        speed_slots: internetPackage.speed_slots || speedSlots,
        total_volume_gb: internetPackage.total_volume_gb || "",
        daily_limit_gb: internetPackage.daily_limit_gb || "",
        speed_mb: internetPackage.speed_mb || "",
        after_daily_limit_speed_mb:
            internetPackage.after_daily_limit_speed_mb || "",
        is_active:
            internetPackage.is_active !== undefined
                ? internetPackage.is_active
                : true,
        is_special_offer: internetPackage.is_special_offer || false,
        special_offer_title: internetPackage.special_offer_title || "",
        special_offer_description:
            internetPackage.special_offer_description || "",
        special_offer_start_date: internetPackage.special_offer_start_date
            ? new Date(internetPackage.special_offer_start_date)
                  .toISOString()
                  .split("T")[0]
            : "",
        special_offer_end_date: internetPackage.special_offer_end_date
            ? new Date(internetPackage.special_offer_end_date)
                  .toISOString()
                  .split("T")[0]
            : "",
        is_featured: internetPackage.is_featured || false,
        // Festival related fields
        festival_id: attachedFestival ? attachedFestival.id : "",
        festival_special_price:
            attachedFestival?.pivot?.is_special_price || false,
        festival_price: attachedFestival?.pivot?.festival_price || "",
        // Night mode fields
        has_night_free: internetPackage.has_night_free || false,
        is_night_free: internetPackage.is_night_free || false,
        night_free_start_time: internetPackage.night_free_start_time
            ? internetPackage.night_free_start_time.substring(11, 16)
            : "22:00",
        night_free_end_time: internetPackage.night_free_end_time
            ? internetPackage.night_free_end_time.substring(11, 16)
            : "06:00",
        night_free_speed_mb: internetPackage.night_free_speed_mb || "",
        // Province selection
        provinces: internetPackage.provinces || [],
    });

    const handleSpeedSlotChange = (index, field, value) => {
        const updatedSlots = [...speedSlots];
        updatedSlots[index][field] = value;
        setSpeedSlots(updatedSlots);
        setData("speed_slots", updatedSlots);
    };

    const addSpeedSlot = () => {
        const newSlots = [
            ...speedSlots,
            { from: "00:00", to: "23:59", speed_mb: 1.0 },
        ];
        setSpeedSlots(newSlots);
        setData("speed_slots", newSlots);
    };

    const removeSpeedSlot = (index) => {
        if (speedSlots.length > 1) {
            const newSlots = speedSlots.filter((_, i) => i !== index);
            setSpeedSlots(newSlots);
            setData("speed_slots", newSlots);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US");
    };

    const onSubmit = (e) => {
        e.preventDefault();

        // Set speed_slots to null if package type is not unlimited
        if (data.type !== "unlimited") {
            setData("speed_slots", null);
        }

        // No need to set festival_id here, it's already in the data state
        put(route("admin.internet-packages.update", internetPackage.id));
    };

    // Update festival price field visibility when special price option changes
    useEffect(() => {
        setShowFestivalPriceField(data.festival_special_price);
    }, [data.festival_special_price]);

    // Handle festival selection change
    const handleFestivalChange = (e) => {
        const festivalId = e.target.value;
        setData("festival_id", festivalId);

        // Reset festival price data if no festival selected
        if (!festivalId) {
            setData("festival_special_price", false);
            setData("festival_price", "");
            setShowFestivalPriceField(false);
        }
    };

    const getFestivalStatusClass = (festival) => {
        if (!festival.is_active) {
            return { text: "غیرفعال", class: "bg-gray-100 text-gray-800" };
        }

        const today = new Date();
        const startDate = new Date(festival.start_date);
        const endDate = new Date(festival.end_date);

        if (today < startDate) {
            return {
                text: "در انتظار شروع",
                class: "bg-blue-100 text-blue-800",
            };
        } else if (today > endDate) {
            return { text: "منقضی شده", class: "bg-red-100 text-red-800" };
        } else {
            return { text: "فعال", class: "bg-green-100 text-green-800" };
        }
    };

    console.log(internetPackage, "data.festival_id");

    // Province selection handler
    const handleProvinceToggle = (provinceKey) => {
        const currentProvinces = [...(data.provinces || [])];
        const index = currentProvinces.indexOf(provinceKey);

        if (index >= 0) {
            currentProvinces.splice(index, 1);
        } else {
            currentProvinces.push(provinceKey);
        }

        setData("provinces", currentProvinces);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownProvincesRef.current &&
                !dropdownProvincesRef.current.contains(event.target)
            ) {
                setIsOpenProvinces(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <DashboardLayout auth={auth}>
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        {/* ویرایش بسته اینترنتی */}
                        {t("internet_packages.edit_package")}
                    </h2>
                    <Link
                        href={route("admin.internet-packages.index")}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                        {t("internet_packages.back")}
                    </Link>
                </div>

                <div className="p-4 sm:p-8 py-8 bg-white shadow border sm:rounded-lg">
                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Basic Information Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                {t("internet_packages.basic_info")}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Title fields */}
                                <div>
                                    <InputLabel
                                        htmlFor="title_fa"
                                        value={t("internet_packages.title_fa")}
                                    />
                                    <TextInput
                                        id="title_fa"
                                        type="text"
                                        name="title_fa"
                                        value={data.title.fa}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("title", {
                                                ...data.title,
                                                fa: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors["title.fa"]}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="title_en"
                                        value={t("internet_packages.title_en")}
                                    />
                                    <TextInput
                                        id="title_en"
                                        type="text"
                                        name="title_en"
                                        value={data.title.en}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("title", {
                                                ...data.title,
                                                en: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors["title.en"]}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="title_ps"
                                        value={t("internet_packages.title_ps")}
                                    />
                                    <TextInput
                                        id="title_ps"
                                        type="text"
                                        name="title_ps"
                                        value={data.title.ps}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("title", {
                                                ...data.title,
                                                ps: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors["title.ps"]}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Type, Price, Duration */}
                                <div>
                                    <InputLabel
                                        htmlFor="type"
                                        value={t("internet_packages.type")}
                                    />
                                    <SelectInput
                                        id="type"
                                        name="type"
                                        value={data.type}
                                        className="mt-1 block w-full"
                                        onChange={(e) => {
                                            const newType = e.target.value;
                                            setData("type", newType);

                                            // Reset speed_slots if type is not unlimited
                                            if (newType !== "unlimited") {
                                                setSpeedSlots([]);
                                                setData("speed_slots", null);
                                            } else if (speedSlots.length === 0) {
                                                // If switching back to unlimited and slots are empty, initialize with default
                                                const defaultSlots = [{ from: "07:00", to: "06:00", speed_mb: 1.5 }];
                                                setSpeedSlots(defaultSlots);
                                                setData("speed_slots", defaultSlots);
                                            }
                                        }}
                                        required
                                    >
                                        <option value="unlimited">
                                            {t("internet_packages.unlimited")}
                                        </option>
                                        <option value="volume_fixed">
                                            {t(
                                                "internet_packages.volume_fixed"
                                            )}
                                        </option>
                                        <option value="volume_daily">
                                            {t(
                                                "internet_packages.volume_daily"
                                            )}
                                        </option>
                                    </SelectInput>
                                    <InputError
                                        message={errors.type}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="price"
                                        value={t("internet_packages.price")}
                                    />
                                    <TextInput
                                        id="price"
                                        type="text"
                                        name="price"
                                        value={formatPriceWithCommas(
                                            data.price
                                        )}
                                        className="mt-1 block w-full"
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(
                                                /,/g,
                                                ""
                                            );
                                            if (!isNaN(raw)) {
                                                setData("price", raw);
                                            }
                                        }}
                                        required
                                    />
                                    <InputError
                                        message={errors.price}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="duration_days"
                                        value={t(
                                            "internet_packages.duration_days"
                                        )}
                                    />
                                    <TextInput
                                        id="duration_days"
                                        type="number"
                                        name="duration_days"
                                        value={data.duration_days}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "duration_days",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.duration_days}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Volume fields based on type */}
                        {data.type !== "unlimited" && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                    {t("internet_packages.volume_information")}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(data.type === "volume_fixed" ||
                                        data.type === "volume_daily") && (
                                        <div>
                                            <InputLabel
                                                htmlFor="total_volume_gb"
                                                value={t(
                                                    "internet_packages.total_volume_gb"
                                                )}
                                            />
                                            <TextInput
                                                id="total_volume_gb"
                                                type="number"
                                                name="total_volume_gb"
                                                value={data.total_volume_gb}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "total_volume_gb",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.total_volume_gb}
                                                className="mt-2"
                                            />
                                        </div>
                                    )}

                                    {data.type === "volume_daily" && (
                                        <div>
                                            <InputLabel
                                                htmlFor="daily_limit_gb"
                                                value={t(
                                                    "internet_packages.daily_limit_gb"
                                                )}
                                            />
                                            <TextInput
                                                id="daily_limit_gb"
                                                type="number"
                                                name="daily_limit_gb"
                                                value={data.daily_limit_gb}
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "daily_limit_gb",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.daily_limit_gb}
                                                className="mt-2"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <InputLabel
                                            htmlFor="speed_mb"
                                            value={t(
                                                "internet_packages.speed_mb"
                                            )}
                                        />
                                        <TextInput
                                            id="speed_mb"
                                            type="number"
                                            name="speed_mb"
                                            value={data.speed_mb}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "speed_mb",
                                                    e.target.value
                                                )
                                            }
                                            required
                                            step="0.1"
                                        />
                                        <InputError
                                            message={errors.speed_mb}
                                            className="mt-2"
                                        />
                                    </div>

                                    {data.type === "volume_daily" && (
                                        <div>
                                            <InputLabel
                                                htmlFor="after_daily_limit_speed_mb"
                                                value={
                                                    t(
                                                        "internet_packages.after_daily_limit_speed_mb"
                                                    ) ||
                                                    "سرعت پس از اتمام حجم روزانه (Mb/s)"
                                                }
                                            />
                                            <TextInput
                                                id="after_daily_limit_speed_mb"
                                                type="number"
                                                name="after_daily_limit_speed_mb"
                                                value={
                                                    data.after_daily_limit_speed_mb
                                                }
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "after_daily_limit_speed_mb",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                step="0.1"
                                            />
                                            <InputError
                                                message={
                                                    errors.after_daily_limit_speed_mb
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                    )}

                                    {data.type === "volume_daily" && (
                                        <div>
                                            <InputLabel
                                                htmlFor="after_daily_limit_speed_mb"
                                                value={
                                                    t(
                                                        "internet_packages.after_daily_limit_speed_mb"
                                                    ) ||
                                                    "سرعت پس از اتمام حجم روزانه (Mb/s)"
                                                }
                                            />
                                            <TextInput
                                                id="after_daily_limit_speed_mb"
                                                type="number"
                                                name="after_daily_limit_speed_mb"
                                                value={
                                                    data.after_daily_limit_speed_mb
                                                }
                                                className="mt-1 block w-full"
                                                onChange={(e) =>
                                                    setData(
                                                        "after_daily_limit_speed_mb",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                step="0.1"
                                            />
                                            <InputError
                                                message={
                                                    errors.after_daily_limit_speed_mb
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Speed Slots for Unlimited type */}
                        {data.type === "unlimited" && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                    {t("internet_packages.speed_settings")}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-md font-medium">
                                            {t(
                                                "internet_packages.speed_ranges"
                                            )}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={addSpeedSlot}
                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
                                        >
                                            {t("internet_packages.add_range")}
                                        </button>
                                    </div>

                                    {speedSlots.map((slot, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md bg-gray-50"
                                        >
                                            <div>
                                                <InputLabel
                                                    htmlFor={`from_${index}`}
                                                    value={t(
                                                        "internet_packages.from_hour"
                                                    )}
                                                />
                                                <TextInput
                                                    id={`from_${index}`}
                                                    type="time"
                                                    value={slot.from}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        handleSpeedSlotChange(
                                                            index,
                                                            "from",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <InputLabel
                                                    htmlFor={`to_${index}`}
                                                    value={t(
                                                        "internet_packages.to_hour"
                                                    )}
                                                />
                                                <TextInput
                                                    id={`to_${index}`}
                                                    type="time"
                                                    value={slot.to}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        handleSpeedSlotChange(
                                                            index,
                                                            "to",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <InputLabel
                                                    htmlFor={`speed_${index}`}
                                                    value={t(
                                                        "internet_packages.speed_mb"
                                                    )}
                                                />
                                                <TextInput
                                                    id={`speed_${index}`}
                                                    type="number"
                                                    value={slot.speed_mb}
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        handleSpeedSlotChange(
                                                            index,
                                                            "speed_mb",
                                                            parseFloat(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    required
                                                    step="0.1"
                                                />
                                            </div>

                                            <div className="flex items-end">
                                                {speedSlots.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeSpeedSlot(
                                                                index
                                                            )
                                                        }
                                                        className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition mt-1"
                                                    >
                                                        {t(
                                                            "internet_packages.delete_range"
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <InputError
                                        message={errors.speed_slots}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Night Mode Settings */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                {t("internet_packages.night_mode")}
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <CustomCheckbox
                                        name="has_night_free"
                                        checked={data.has_night_free}
                                        onChange={(e) =>
                                            setData(
                                                "has_night_free",
                                                e.target.checked
                                            )
                                        }
                                        statusClass="w-fit"
                                    />
                                    <InputLabel
                                        htmlFor="has_night_free"
                                        value={t(
                                            "internet_packages.enable_night_mode"
                                        )}
                                    />
                                </div>

                                {data.has_night_free && (
                                    <>
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2">
                                                <CustomCheckbox
                                                    name="is_night_free"
                                                    checked={data.is_night_free}
                                                    onChange={(e) =>
                                                        setData(
                                                            "is_night_free",
                                                            e.target.checked
                                                        )
                                                    }
                                                    statusClass="w-fit"
                                                />
                                                <InputLabel
                                                    htmlFor="is_night_free"
                                                    value={t(
                                                        "internet_packages.free_night_usage"
                                                    )}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1 mx-2">
                                                {data.is_night_free
                                                    ? t(
                                                          "internet_packages.night_free_msg"
                                                      )
                                                    : t(
                                                          "internet_packages.night_speed_msg"
                                                      )}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <InputLabel
                                                    htmlFor="night_free_start_time"
                                                    value={t(
                                                        "internet_packages.start_time"
                                                    )}
                                                />
                                                <TextInput
                                                    id="night_free_start_time"
                                                    type="time"
                                                    name="night_free_start_time"
                                                    value={
                                                        data.night_free_start_time
                                                    }
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        setData(
                                                            "night_free_start_time",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors.night_free_start_time
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div>
                                                <InputLabel
                                                    htmlFor="night_free_end_time"
                                                    value={t(
                                                        "internet_packages.end_time"
                                                    )}
                                                />
                                                <TextInput
                                                    id="night_free_end_time"
                                                    type="time"
                                                    name="night_free_end_time"
                                                    value={
                                                        data.night_free_end_time
                                                    }
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        setData(
                                                            "night_free_end_time",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors.night_free_end_time
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div>
                                                <InputLabel
                                                    htmlFor="night_free_speed_mb"
                                                    value={
                                                        data.is_night_free
                                                            ? t(
                                                                  "internet_packages.night_free_speed"
                                                              )
                                                            : t(
                                                                  "internet_packages.night_speed"
                                                              )
                                                    }
                                                />
                                                <TextInput
                                                    id="night_free_speed_mb"
                                                    type="number"
                                                    name="night_free_speed_mb"
                                                    value={
                                                        data.night_free_speed_mb
                                                    }
                                                    className="mt-1 block w-full"
                                                    onChange={(e) =>
                                                        setData(
                                                            "night_free_speed_mb",
                                                            e.target.value
                                                        )
                                                    }
                                                    step="0.1"
                                                    required
                                                />
                                                <InputError
                                                    message={
                                                        errors.night_free_speed_mb
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Province Selection */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                {t("internet_packages.province_selection")}
                            </h3>
                            <div className="space-y-2 mb-4">
                                <p className="text-sm text-gray-700">
                                    {t("internet_packages.select_provinces")}
                                </p>
                                <div
                                    className="relative"
                                    ref={dropdownProvincesRef}
                                >
                                    <button
                                        type="button"
                                        className="relative cursor-pointer w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-right focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        onClick={() =>
                                            setIsOpenProvinces(!isOpenProvinces)
                                        }
                                        aria-haspopup="listbox"
                                        aria-expanded="true"
                                        aria-labelledby="listbox-label"
                                    >
                                        <span className="block truncate">
                                            {data.provinces.length > 0
                                                ? t(
                                                      "internet_packages.selected_provinces",
                                                      {
                                                          count: data.provinces
                                                              .length,
                                                      }
                                                  )
                                                : t(
                                                      "internet_packages.select_provinces_placeholder"
                                                  )}
                                        </span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    </button>

                                    {isOpenProvinces && (
                                        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-50">
                                            <ul
                                                tabIndex="-1"
                                                role="listbox"
                                                aria-labelledby="listbox-label"
                                                className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                                            >
                                                {Object.entries(provinces).map(
                                                    ([key, value]) => (
                                                        <li
                                                            key={key}
                                                            className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
                                                            id={`listbox-item-${key}`}
                                                            role="option"
                                                            onClick={() =>
                                                                handleProvinceToggle(
                                                                    key
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-center">
                                                                <input
                                                                    id={`checkbox-${key}`}
                                                                    type="checkbox"
                                                                    className="form-checkbox h-4 w-4 cursor-pointer text-indigo-600 transition duration-150 ease-in-out"
                                                                    checked={data.provinces.includes(
                                                                        key
                                                                    )}
                                                                    onChange={() => {}}
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        e.stopPropagation()
                                                                    }
                                                                />
                                                                <label
                                                                    htmlFor={`checkbox-${key}`}
                                                                    className="mx-3 block font-normal truncate cursor-pointer"
                                                                >
                                                                    {
                                                                        value[
                                                                            lang
                                                                        ]
                                                                    }
                                                                </label>
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <InputError
                                    message={errors.provinces}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* Festival Selection Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                {t("internet_packages.festival_selection")}
                            </h3>

                            {festivals && festivals.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-700 mb-4">
                                        {t(
                                            "internet_packages.assign_to_festival"
                                        )}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {festivals.map((festival) => {
                                            const status =
                                                getFestivalStatusClass(
                                                    festival
                                                );
                                            return (
                                                <div
                                                    key={festival.id}
                                                    onClick={() => {
                                                        if (
                                                            data.festival_id ===
                                                            festival.id
                                                        ) {
                                                            // If clicking the already selected festival, deselect it
                                                            setData(
                                                                "festival_id",
                                                                ""
                                                            );
                                                            setData(
                                                                "festival_special_price",
                                                                false
                                                            );
                                                            setData(
                                                                "festival_price",
                                                                ""
                                                            );
                                                        } else {
                                                            // Otherwise select the new festival
                                                            setData(
                                                                "festival_id",
                                                                festival.id
                                                            );
                                                        }
                                                    }}
                                                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                        data.festival_id ===
                                                        festival.id
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-200 hover:border-blue-300"
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900">
                                                                {
                                                                    festival
                                                                        .title[
                                                                        lang
                                                                    ]
                                                                }
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {formatDate(
                                                                    festival.start_date
                                                                )}{" "}
                                                                {t(
                                                                    "internet_packages.to"
                                                                )}{" "}
                                                                {formatDate(
                                                                    festival.end_date
                                                                )}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs ${status.class}`}
                                                        >
                                                            {status.text}
                                                        </span>
                                                    </div>

                                                    {festival.image && (
                                                        <div className="mt-2 h-20 bg-gray-100 rounded overflow-hidden">
                                                            <img
                                                                src={`/storage/${festival.image}`}
                                                                alt={
                                                                    festival
                                                                        .title[
                                                                        lang
                                                                    ]
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    {t("internet_packages.no_festival_defined")}
                                </div>
                            )}
                        </div>

                        {/* Status Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                {t("internet_packages.status")}
                            </h3>
                            <div className="flex items-center">
                                <div>
                                    <CustomCheckbox
                                        label={t("internet_packages.status")}
                                        name="is_active"
                                        checked={data.is_active}
                                        onChange={(e) =>
                                            setData(
                                                "is_active",
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                                <InputError
                                    message={errors.is_active}
                                    className="mt-2 mr-2"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end">
                            <PrimaryButton
                                disabled={processing}
                                className="mr-4"
                            >
                                {t("internet_packages.save_changes")}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
