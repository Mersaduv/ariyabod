import React, { useRef, useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import { useForm, usePage, Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import Modal from "@/Components/ui/Modal";
import axios from "axios";
// import InternetPackagesForm from "@/Components/forms/InternetPackagesForm";

export default function Index({
    auth,
    internetPackages,
    festivals,
    provinces,
    speedOptions,
}) {
    const { t } = useTranslation();
    const { props } = usePage();
    const message = props.flash?.message;
    console.log(provinces, "provinces");
    // State for filtering packages
    const [filter, setFilter] = useState("all"); // 'all', 'special', 'normal'
    const lang = localStorage.getItem("lang") || "fa";

    // State for speed options modal
    const [openAddSpeedModal, setOpenAddSpeedModal] = useState(false);
    const [showDeleteSpeedOptionModal, setShowDeleteSpeedOptionModal] =
        useState(false);
    const [showDeletePackageModal, setShowDeletePackageModal] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState(null);
    const [speedOptionToDelete, setSpeedOptionToDelete] = useState(null);
    const [speedFormData, setSpeedFormData] = useState({
        value: "",
        unit: "mb",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingSpeedOptionId, setEditingSpeedOptionId] = useState(null);

    // Handle form input changes
    const handleSpeedInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSpeedFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Clear previous errors when user makes changes
        setFormError(null);
    };

    // Submit speed option form
    const handleSpeedFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        try {
            let response;

            if (isEditing) {
                // Update existing speed option
                response = await axios.put(
                    route("admin.speed-options.update", editingSpeedOptionId),
                    {
                        value: speedFormData.value,
                        unit: speedFormData.unit,
                    }
                );
            } else {
                // Create new speed option
                response = await axios.post(
                    route("admin.speed-options.store"),
                    {
                        value: speedFormData.value,
                        unit: speedFormData.unit,
                    }
                );
            }

            if (response.data.success) {
                // Reset form and close modal
                setSpeedFormData({
                    value: "",
                    unit: "mb",
                });
                setOpenAddSpeedModal(false);
                setIsEditing(false);
                setEditingSpeedOptionId(null);

                // Reload the page to show the updated speed options
                router.reload();
            } else {
                setFormError(response.data.message || "خطا در ذخیره اطلاعات");
            }
        } catch (error) {
            console.error("Error:", error);
            setFormError(
                error.response?.data?.message ||
                    "خطا در ارتباط با سرور. لطفا دوباره تلاش کنید."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePackage = (id) => {
        setShowDeletePackageModal(true);
        setPackageToDelete(id);
    };

    const handleDeletePackageConfirm = async (id) => {
        if (confirm(t("internet_packages.delete_confirm"))) {
            setIsSubmitting(true);
            router.delete(route("admin.internet-packages.destroy", id), {
                onFinish: () => setIsSubmitting(false),
            });
        }
    };

    const formatType = (type) => {
        switch (type) {
            case "unlimited":
                return t("internet_packages.unlimited");
            case "volume_fixed":
                return t("internet_packages.volume_fixed");
            case "volume_daily":
                return t("internet_packages.volume_daily");
            default:
                return type;
        }
    };

    // Format package details based on type
    const getPackageDetails = (pkg) => {
        switch (pkg.type) {
            case "unlimited":
                return null;
            case "volume_fixed":
                return t("internet_packages.total_volume", {
                    volume: pkg.total_volume_gb,
                });
            case "volume_daily":
                return (
                    <>
                        <span>
                            {t("internet_packages.total_volume", {
                                volume: pkg.total_volume_gb,
                            })}
                        </span>
                        <br />
                        <span>
                            {t("internet_packages.daily_volume", {
                                volume: pkg.daily_limit_gb,
                            })}
                        </span>
                    </>
                );
            default:
                return null;
        }
    };

    // Check if a special offer is active based on dates
    const isSpecialOfferActive = (pkg) => {
        if (!pkg.is_special_offer) return false;

        const today = new Date();
        const startDate = pkg.special_offer_start_date
            ? new Date(pkg.special_offer_start_date)
            : null;
        const endDate = pkg.special_offer_end_date
            ? new Date(pkg.special_offer_end_date)
            : null;

        if (startDate && endDate) {
            return today >= startDate && today <= endDate;
        }

        return false;
    };

    // Filter packages based on selection
    const filteredPackages = internetPackages.filter((pkg) => {
        if (filter === "all") return true;
        if (filter === "special")
            return pkg.festivals.length > 0 && pkg.festivals[0].is_active;
        if (filter === "normal") return pkg.festivals.length === 0;
        return true;
    });

    // Format date to display
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US");
    };

    // Check if a festival is active
    const isActive = (festival) => {
        if (!festival.is_active) return false;

        const today = new Date();
        const startDate = new Date(festival.start_date);
        const endDate = new Date(festival.end_date);

        return today >= startDate && today <= endDate;
    };

    // Get formatted status text
    const getStatusText = (festival) => {
        if (!festival.is_active) {
            return {
                text: t("internet_packages.inactive"),
                class: "bg-gray-100 text-gray-800",
            };
        }

        const today = new Date();
        const startDate = new Date(festival.start_date);
        const endDate = new Date(festival.end_date);

        if (today < startDate) {
            return {
                text: t("internet_packages.pending"),
                class: "bg-blue-100 text-blue-800",
            };
        } else if (today > endDate) {
            return {
                text: t("internet_packages.expired"),
                class: "bg-red-100 text-red-800",
            };
        } else {
            return {
                text: t("internet_packages.active"),
                class: "bg-green-100 text-green-800",
            };
        }
    };
    console.log(filteredPackages, "filteredPackages");

    // Delete speed option
    const handleDeleteSpeedOption = async (id) => {
        // if (confirm('آیا از حذف این گزینه سرعت مطمئن هستید؟')) {
        //     try {
        //         const response = await fetch(route('admin.speed-options.destroy', id), {
        //             method: 'DELETE',
        //             headers: {
        //                 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        //             }
        //         });

        //         const data = await response.json();

        //         if (data.success) {
        //             // Refresh the page to update the speed options list
        //             router.reload();
        //         } else {
        //             console.error('Error deleting speed option');
        //         }
        //     } catch (error) {
        //         console.error('Error:', error);
        //     }
        // }
        setShowDeleteSpeedOptionModal(true);
        setSpeedOptionToDelete(id);
    };

    // Edit speed option
    const handleEditSpeedOption = (option) => {
        setSpeedFormData({
            value: option.value,
            unit: option.unit,
        });
        setIsEditing(true);
        setEditingSpeedOptionId(option.id);
        setOpenAddSpeedModal(true);
    };

    return (
        <>
            {/* Modal for adding speed options */}
            <Modal
                show={openAddSpeedModal}
                onClose={() => {
                    setOpenAddSpeedModal(false);
                    setIsEditing(false);
                    setEditingSpeedOptionId(null);
                    setSpeedFormData({
                        value: "",
                        unit: "mb",
                    });
                }}
                title={
                    isEditing
                        ? t("speed_options.edit_speed_option")
                        : t("speed_options.add_speed_option")
                }
            >
                <form onSubmit={handleSpeedFormSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            {t("speed_options.value")}
                        </label>
                        <div className="flex">
                            <input
                                type="number"
                                name="value"
                                value={speedFormData.value}
                                onChange={handleSpeedInputChange}
                                className={`shadow appearance-none border ${
                                    lang === "en"
                                        ? "rounded-l-lg"
                                        : "rounded-r-lg"
                                } w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                                required
                                min="0"
                                step="0.01"
                                disabled={isSubmitting}
                            />
                            <select
                                name="unit"
                                value={speedFormData.unit}
                                onChange={handleSpeedInputChange}
                                className={`shadow appearance-none border text-center ${
                                    lang === "en"
                                        ? "rounded-r-lg"
                                        : "rounded-l-lg"
                                } w-1/3 py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline`}
                                disabled={isSubmitting}
                            >
                                <option value="kb">Kbps</option>
                                <option value="mb">Mbps</option>
                                <option value="gb">Gbps</option>
                            </select>
                        </div>
                    </div>

                    {formError && (
                        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                            {formError}
                        </div>
                    )}

                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={() => setOpenAddSpeedModal(false)}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2 `}
                            disabled={isSubmitting}
                        >
                            {t("speed_options.cancel")}
                        </button>
                        <button
                            type="submit"
                            className={`${
                                isSubmitting
                                    ? "bg-blue-300"
                                    : "bg-blue-500 hover:bg-blue-700"
                            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? t("speed_options.saving")
                                : t("speed_options.save")}
                        </button>
                    </div>
                </form>
            </Modal>
            {/* Modal for Delete speed options */}
            <Modal
                show={showDeleteSpeedOptionModal}
                onClose={() => setShowDeleteSpeedOptionModal(false)}
                title={t("speed_options.delete_speed_option")}
            >
                <>
                    <p className="text-lg font-medium pb-4">
                        {t("speed_options.delete_speed_option_confirm")}
                    </p>
                    <hr className="mb-4" />
                    <div className="flex justify-between gap-2">
                        <button
                            className={` ${
                                isSubmitting
                                    ? "bg-gray-300"
                                    : "hover:bg-red-600"
                            }  min-w-24 text-white px-4 py-2 rounded-md ${
                                isSubmitting ? "bg-gray-300" : "bg-red-500"
                            }`}
                            onClick={() => {
                                setIsSubmitting(true);
                                router.delete(
                                    route(
                                        "admin.speed-options.destroy",
                                        speedOptionToDelete
                                    ),
                                    {
                                        onFinish: () => {
                                            setIsSubmitting(false);
                                            setShowDeleteSpeedOptionModal(
                                                false
                                            );
                                        },
                                    }
                                );
                            }}
                            disabled={isSubmitting}
                        >
                            {t("speed_options.yes")}
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 min-w-24 text-white px-4 py-2 rounded-md"
                            onClick={() => setShowDeleteSpeedOptionModal(false)}
                            disabled={isSubmitting}
                        >
                            {t("speed_options.cancel")}
                        </button>
                    </div>
                </>
            </Modal>
            {/* Modal for Delete internet packages */}
            <Modal
                show={showDeletePackageModal}
                onClose={() => setShowDeletePackageModal(false)}
                title={t("internet_packages.delete_package")}
            >
                <>
                    <p className="text-lg font-medium pb-4">
                        {t("internet_packages.delete_package_confirm")}
                    </p>
                    <hr className="mb-4" />
                    <div className="flex justify-between gap-2">
                        <button
                            className={` ${
                                isSubmitting
                                    ? "bg-gray-300"
                                    : "hover:bg-red-600"
                            }  min-w-24 text-white px-4 py-2 rounded-md ${
                                isSubmitting ? "bg-gray-300" : "bg-red-500"
                            }`}
                            onClick={() => {
                                setIsSubmitting(true);
                                router.delete(
                                    route(
                                        "admin.internet-packages.destroy",
                                        packageToDelete
                                    ),
                                    {
                                        onFinish: () => {
                                            setIsSubmitting(false);
                                            setShowDeletePackageModal(false);
                                        },
                                    }
                                );
                            }}
                            disabled={isSubmitting}
                        >
                            {t("internet_packages.yes")}
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 min-w-24 text-white px-4 py-2 rounded-md"
                            onClick={() => setShowDeletePackageModal(false)}
                            disabled={isSubmitting}
                        >
                            {t("internet_packages.cancel")}
                        </button>
                    </div>
                </>
            </Modal>
            <DashboardLayout auth={auth}>
                <div className="p-4 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            {t("internet_packages.main_title")}
                        </h2>
                    </div>

                    {message && (
                        <div className="p-4 bg-green-100 text-green-700 rounded-md border border-green-300">
                            {message}
                        </div>
                    )}

                    {/* Filter controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">
                                {t("internet_packages.filter")}
                            </span>
                            <div className="flex border rounded-md overflow-hidden">
                                <button
                                    className={`px-4 py-2 ${
                                        filter === "all"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100"
                                    }`}
                                    onClick={() => setFilter("all")}
                                >
                                    {t("internet_packages.all_packages")}
                                </button>
                                <button
                                    className={`px-4 py-2 ${
                                        filter === "special"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100"
                                    }`}
                                    onClick={() => setFilter("special")}
                                >
                                    {t("internet_packages.special_packages")}
                                </button>
                                <button
                                    className={`px-4 py-2 ${
                                        filter === "normal"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100"
                                    }`}
                                    onClick={() => setFilter("normal")}
                                >
                                    {t("internet_packages.regular_packages")}
                                </button>
                            </div>
                        </div>

                        <Link
                            href={route("admin.internet-packages.create")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            {t("internet_packages.add_package")}
                        </Link>
                    </div>
                    {/* package table */}
                    <div className="p-4 sm:p-8 py-8 bg-white shadow border sm:rounded-lg">
                        {filteredPackages && filteredPackages.length > 0 ? (
                            <>
                                {/* دسکتاپ: جدول استاندارد */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t(
                                                        "internet_packages.title"
                                                    )}
                                                </th>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t(
                                                        "internet_packages.type"
                                                    )}
                                                </th>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t(
                                                        "internet_packages.price"
                                                    )}
                                                </th>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t(
                                                        "internet_packages.duration"
                                                    )}
                                                </th>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t(
                                                        "internet_packages.details"
                                                    )}
                                                </th>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t(
                                                        "internet_packages.provinces"
                                                    )}
                                                </th>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t(
                                                        "internet_packages.status"
                                                    )}
                                                </th>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t(
                                                        "internet_packages.actions"
                                                    )}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredPackages.map((pkg) => (
                                                <tr
                                                    key={pkg.id}
                                                    // className={
                                                    //     pkg.festivals &&
                                                    //     pkg.festivals.length > 0
                                                    //         ? `border border-[${pkg.festivals[0].color_code}}]`
                                                    //         : ""
                                                    // }
                                                    style={
                                                        pkg.festivals?.length >
                                                        0
                                                            ? {
                                                                  backgroundColor:
                                                                      pkg
                                                                          .festivals[0]
                                                                          .is_active
                                                                          ? pkg
                                                                                .festivals[0]
                                                                                .color_code +
                                                                            "33"
                                                                          : "white",
                                                              } // 33 = 20% opacity
                                                            : {}
                                                    }
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {pkg.title[lang]}
                                                        {pkg.is_featured && (
                                                            <span className="mr-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                                {t(
                                                                    "internet_packages.featured"
                                                                )}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {formatType(pkg.type)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {pkg.price}{" "}
                                                        {
                                                            t(
                                                                "internet_packages.price"
                                                            ).split(" ")[1]
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {pkg.duration_days}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {getPackageDetails(
                                                            pkg
                                                        ) || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {pkg.provinces
                                                            ? pkg.provinces.map(
                                                                  (
                                                                      province,
                                                                      index
                                                                  ) => (
                                                                      <span
                                                                          key={
                                                                              index
                                                                          }
                                                                          className="px-2 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"
                                                                      >
                                                                          {
                                                                              provinces[
                                                                                  province
                                                                              ][
                                                                                  lang
                                                                              ]
                                                                          }
                                                                      </span>
                                                                  )
                                                              )
                                                            : "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <span
                                                            className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                                                                pkg.is_active
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {pkg.is_active
                                                                ? t(
                                                                      "internet_packages.active"
                                                                  )
                                                                : t(
                                                                      "internet_packages.inactive"
                                                                  )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        <div className="flex gap-3">
                                                            <Link
                                                                href={route(
                                                                    "admin.internet-packages.edit",
                                                                    pkg.id
                                                                )}
                                                                className="text-indigo-600 hover:text-indigo-900 ml-2"
                                                            >
                                                                {t(
                                                                    "internet_packages.edit"
                                                                )}
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeletePackage(
                                                                        pkg.id
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                {t(
                                                                    "internet_packages.delete"
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* موبایل: نمایش کارت‌وار */}
                                <div className="md:hidden space-y-4">
                                    {filteredPackages.map((pkg) => (
                                        <div
                                            key={pkg.id}
                                            className={` rounded-md p-4 shadow-sm`}
                                            style={
                                                pkg.festivals?.length > 0
                                                    ? {
                                                          backgroundColor: pkg
                                                              .festivals[0]
                                                              .is_active
                                                              ? pkg.festivals[0]
                                                                    .color_code +
                                                                "33"
                                                              : "white",
                                                          borderColor:
                                                              pkg.festivals[0]
                                                                  .color_code,
                                                      } // 33 = 20% opacity
                                                    : {}
                                            }
                                        >
                                            <div className="mb-2 flex justify-between items-start">
                                                <div>
                                                    <strong>
                                                        {t(
                                                            "internet_packages.title"
                                                        )}
                                                        :
                                                    </strong>{" "}
                                                    {pkg.title[lang]}
                                                    {pkg.is_featured && (
                                                        <span className="mr-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                            {t(
                                                                "internet_packages.featured"
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                <span
                                                    className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                                                        pkg.is_active
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {pkg.is_active
                                                        ? t(
                                                              "internet_packages.active"
                                                          )
                                                        : t(
                                                              "internet_packages.inactive"
                                                          )}
                                                </span>
                                            </div>

                                            {pkg.is_special_offer && (
                                                <div className="mb-2 p-2 bg-yellow-100 rounded-md">
                                                    <div className="font-semibold text-sm text-yellow-800">
                                                        {
                                                            pkg.special_offer_title
                                                        }
                                                    </div>
                                                    {pkg.special_offer_start_date &&
                                                        pkg.special_offer_end_date && (
                                                            <div className="text-xs mt-1 text-gray-700">
                                                                <strong>
                                                                    {t(
                                                                        "internet_packages.duration"
                                                                    )}
                                                                    :{" "}
                                                                </strong>
                                                                {new Date(
                                                                    pkg.special_offer_start_date
                                                                ).toLocaleDateString(
                                                                    "fa-IR"
                                                                )}
                                                                {" الی "}
                                                                {new Date(
                                                                    pkg.special_offer_end_date
                                                                ).toLocaleDateString(
                                                                    "fa-IR"
                                                                )}
                                                            </div>
                                                        )}
                                                    <div className="mt-1">
                                                        <strong>
                                                            {t(
                                                                "internet_packages.status"
                                                            )}
                                                            :{" "}
                                                        </strong>
                                                        {isSpecialOfferActive(
                                                            pkg
                                                        ) ? (
                                                            <span className="text-xs text-green-600">
                                                                {t(
                                                                    "internet_packages.active"
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-red-600">
                                                                {t(
                                                                    "internet_packages.inactive"
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mb-2">
                                                <strong>
                                                    {t(
                                                        "internet_packages.type"
                                                    )}
                                                    :
                                                </strong>{" "}
                                                {formatType(pkg.type)}
                                            </div>
                                            <div className="mb-2">
                                                <strong>
                                                    {t(
                                                        "internet_packages.price"
                                                    )}
                                                    :
                                                </strong>{" "}
                                                {pkg.price}{" "}
                                                {
                                                    t(
                                                        "internet_packages.price"
                                                    ).split(" ")[1]
                                                }
                                            </div>
                                            <div className="mb-2">
                                                <strong>
                                                    {t(
                                                        "internet_packages.duration"
                                                    )}
                                                    :
                                                </strong>{" "}
                                                {pkg.duration_days}
                                            </div>

                                            {getPackageDetails(pkg) && (
                                                <div className="mb-2">
                                                    <strong>
                                                        {t(
                                                            "internet_packages.details"
                                                        )}
                                                        :
                                                    </strong>{" "}
                                                    <div className="text-sm mt-1 pr-3">
                                                        {getPackageDetails(pkg)}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-2 mt-3">
                                                <Link
                                                    href={route(
                                                        "admin.internet-packages.edit",
                                                        pkg.id
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {t(
                                                        "internet_packages.edit"
                                                    )}
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDeletePackage(
                                                            pkg.id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    {t(
                                                        "internet_packages.delete"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                {t("internet_packages.no_packages_found")}
                            </div>
                        )}
                    </div>

                    {/* Festivals Section */}
                    <div className="mt-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {t("internet_packages.festivals_events")}
                            </h2>
                            <Link
                                href={route("admin.festivals.create")}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                            >
                                {t("internet_packages.add_festival")}
                            </Link>
                        </div>

                        <div className="p-4 sm:p-8 py-8 bg-white shadow border sm:rounded-lg">
                            {festivals && festivals.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {festivals.map((festival) => {
                                        const status = getStatusText(festival);
                                        return (
                                            <div
                                                key={festival.id}
                                                className={`border rounded-lg overflow-hidden shadow-sm ${
                                                    isActive(festival)
                                                        ? ``
                                                        : "border-gray-200"
                                                }`}
                                                style={
                                                    isActive(festival)
                                                        ? {
                                                              borderColor:
                                                                  festival.color_code,
                                                          }
                                                        : {}
                                                }
                                            >
                                                {festival.image && (
                                                    <div className="h-40 bg-gray-100">
                                                        <img
                                                            src={`/storage/${festival.image}`}
                                                            alt={
                                                                festival.title[
                                                                    lang
                                                                ]
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}

                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {
                                                                festival.title[
                                                                    lang
                                                                ]
                                                            }
                                                        </h3>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs ${status.class}`}
                                                        >
                                                            {status.text}
                                                        </span>
                                                    </div>

                                                    <div className="text-sm text-gray-600 mb-3">
                                                        {formatDate(
                                                            festival.start_date
                                                        )}{" "}
                                                        {t(
                                                            "internet_packages.to"
                                                        )}{" "}
                                                        {formatDate(
                                                            festival.end_date
                                                        )}
                                                    </div>

                                                    {festival.description
                                                        ?.fa && (
                                                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                                                            {
                                                                festival
                                                                    .description[
                                                                    lang
                                                                ]
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.festivals.edit",
                                                                festival.id
                                                            )}
                                                            className="text-sm underline text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            {t(
                                                                "internet_packages.edit"
                                                            )}
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "admin.festivals.show",
                                                                festival.id
                                                            )}
                                                            className="text-sm underline text-blue-600 hover:text-blue-800 mx-2"
                                                        >
                                                            {t(
                                                                "internet_packages.view_packages"
                                                            )}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {t("internet_packages.no_festivals_found")}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* add speed options section */}
                    <div className="mt-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {t("speed_options.title")}
                            </h2>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                onClick={() => setOpenAddSpeedModal(true)}
                            >
                                {t("speed_options.add")}
                            </button>
                        </div>

                        {/* Speed options table */}
                        <div className="p-4 sm:p-8 py-8 bg-white shadow border sm:rounded-lg">
                            {speedOptions && speedOptions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t("speed_options.value")}
                                                </th>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t("speed_options.unit")}
                                                </th>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t("speed_options.status")}
                                                </th>
                                                <th
                                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase ${
                                                        lang === "fa"
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {t("speed_options.actions")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {speedOptions.map((option) => (
                                                <tr key={option.id}>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {option.value}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {option.unit === "kb"
                                                            ? "Kbps"
                                                            : option.unit ===
                                                              "mb"
                                                            ? "Mbps"
                                                            : "Gbps"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <span
                                                            className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                                                                option.is_active
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {option.is_active
                                                                ? t(
                                                                      "speed_options.active"
                                                                  )
                                                                : t(
                                                                      "speed_options.inactive"
                                                                  )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditSpeedOption(
                                                                        option
                                                                    )
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                {t(
                                                                    "speed_options.edit"
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteSpeedOption(
                                                                        option.id
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                {t(
                                                                    "speed_options.delete"
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    {t("speed_options.no_options_found")}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
