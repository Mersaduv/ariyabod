import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import { useForm, Link, usePage } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import Checkbox from "@/Components/Checkbox";
import Modal from "@/Components/ui/Modal";

export default function Show({ auth, festival }) {
    const { t } = useTranslation();
    const { props } = usePage();
    const message = props.flash?.message;
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [showPackageForm, setShowPackageForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [packageId, setPackageId] = useState(null);
    const lang = localStorage.getItem("lang") || "fa";

    const { data, setData, post, processing, errors, reset } = useForm({
        packages: [],
    });

    // Format date for display
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US");
    };

    // Check if a festival is active
    const isActive = () => {
        if (!festival.is_active) return false;

        const today = new Date();
        const startDate = new Date(festival.start_date);
        const endDate = new Date(festival.end_date);

        return today >= startDate && today <= endDate;
    };

    // Get status text
    const getStatusText = () => {
        if (!festival.is_active) {
            return { text: t("festivals.inactive"), class: "bg-gray-100 text-gray-800" };
        }

        const today = new Date();
        const startDate = new Date(festival.start_date);
        const endDate = new Date(festival.end_date);

        if (today < startDate) {
            return {
                text: t("festivals.pending_start"),
                class: "bg-blue-100 text-blue-800",
            };
        } else if (today > endDate) {
            return { text: t("festivals.expired"), class: "bg-red-100 text-red-800" };
        } else {
            return { text: t("festivals.active"), class: "bg-green-100 text-green-800" };
        }
    };

    // Format type
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

    // Format package details
    const getPackageDetails = (pkg) => {
        switch (pkg.type) {
            case "unlimited":
                return null;
            case "volume_fixed":
                return `${pkg.total_volume_gb} ${t("internet_packages.total_volume_gb").split(" ")[0]}`;
            case "volume_daily":
                return (
                    <>
                        <span>{t("internet_packages.total_volume", { volume: pkg.total_volume_gb })}</span>
                        <br />
                        <span>{t("internet_packages.daily_volume", { volume: pkg.daily_limit_gb })}</span>
                    </>
                );
            default:
                return null;
        }
    };

    // Handle detaching a package from festival
    const handleDetachPackage = (packageId) => {
        setPackageId(packageId);
        setShowModal(true);
    };

    // Add selected package to form data
    const togglePackageSelection = (pkg, isChecked) => {
        const packageData = {
            id: pkg.id,
            is_special_price: pkg.pivot?.is_special_price || false,
            festival_price: pkg.pivot?.festival_price || "",
        };

        if (isChecked) {
            const updatedPackages = [...data.packages, packageData];
            setData("packages", updatedPackages);
            setSelectedPackages([...selectedPackages, pkg.id]);
        } else {
            const updatedPackages = data.packages.filter(
                (p) => p.id !== pkg.id
            );
            setData("packages", updatedPackages);
            setSelectedPackages(selectedPackages.filter((id) => id !== pkg.id));
        }
    };

    // Update package special price settings
    const updatePackageData = (packageId, field, value) => {
        const updatedPackages = data.packages.map((pkg) => {
            if (pkg.id === packageId) {
                return {
                    ...pkg,
                    [field]:
                        field === "is_special_price" ? value : Number(value),
                };
            }
            return pkg;
        });
        setData("packages", updatedPackages);
    };

    // Submit the form to attach packages
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.festivals.packages.attach", festival.id), {
            onSuccess: () => {
                reset();
                setSelectedPackages([]);
                setShowPackageForm(false);
            },
        });
    };

    const status = getStatusText();

    return (
        <>
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={t("festivals.delete_from_festival")}
            >
                <>
                    <p className="text-lg font-medium pb-4">
                        {t("festivals.delete_package_confirm")}
                    </p>
                    <hr className="mb-4" />
                    <div className="flex justify-between gap-2">
                        <button
                            className="bg-red-500 hover:bg-red-600 min-w-24 text-white px-4 py-2 rounded-md"
                            onClick={() => {
                                router.delete(
                                    route("admin.festivals.packages.detach", [
                                        festival.id,
                                        packageId,
                                    ])
                                );

                                setShowModal(false);
                            }}
                        >
                            {t("festivals.yes")}
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 min-w-24 text-white px-4 py-2 rounded-md"
                            onClick={() => setShowModal(false)}
                        >
                            {t("festivals.cancel")}
                        </button>
                    </div>
                </>
            </Modal>
            <DashboardLayout auth={auth}>
                <div className="p-4 space-y-6">
                    <div className="flex justify-between items-center gap-2">
                        <h2 className="text-xl font-semibold">
                            {t("festivals.festival_packages")}
                        </h2>
                        <div className="flex gap-2">
                            <Link
                                href={route("admin.festivals.index")}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                                {t("festivals.back")}
                            </Link>
                            <Link
                                href={route(
                                    "admin.festivals.edit",
                                    festival.id
                                )}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                            >
                                {t("internet_packages.edit")}
                            </Link>
                        </div>
                    </div>

                    {message && (
                        <div className="p-4 bg-green-100 text-green-700 rounded-md border border-green-300">
                            {message}
                        </div>
                    )}

                    {/* Festival Info Card */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start">
                                {festival.image && (
                                    <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-md overflow-hidden mx-4">
                                        <img
                                            src={`/storage/${festival.image}`}
                                            alt={festival.title[lang]}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {festival.title[lang]}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${status.class}`}
                                        >
                                            {status.text}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-700">
                                        <p>
                                            <span className="font-semibold">
                                                {t("festivals.date_range")}{" "}
                                            </span>
                                            {formatDate(festival.start_date)}{" "}
                                            {t("internet_packages.to")}{" "}
                                            {formatDate(festival.end_date)}
                                        </p>
                                        {festival.description?.[lang] && (
                                            <p className="mt-2">
                                                <span className="font-semibold">
                                                    {t("festivals.description")}{" "}
                                                </span>
                                                {festival.description[lang]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Packages Management */}
                    <div className="bg-white shadow rounded-lg overflow-hidden p-6">
                        {/* List of attached packages */}
                        {festival.internet_packages &&
                        festival.internet_packages.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className={`px-6 py-3 ${lang === "fa" ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase`}>
                                                {t("festivals.package_title")}
                                            </th>
                                            <th className={`px-6 py-3 ${lang === "fa" ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase`}>
                                                {t("festivals.package_type")}
                                            </th>
                                            <th className={`px-6 py-3 ${lang === "fa" ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase`}>
                                                {t("festivals.regular_price")}
                                            </th>
                                            <th className={`px-6 py-3 ${lang === "fa" ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase`}>
                                                {t("festivals.duration")}
                                            </th>
                                            <th className={`px-6 py-3 ${lang === "fa" ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase`}>
                                                {t("festivals.details")}
                                            </th>
                                            <th className={`px-6 py-3 ${lang === "fa" ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase`}>
                                                {t("festivals.actions")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {festival.internet_packages.map(
                                            (pkg) => (
                                                <tr
                                                    key={pkg.id}
                                                    className={
                                                        pkg.pivot
                                                            ?.is_special_price
                                                            ? "bg-yellow-50"
                                                            : ""
                                                    }
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {pkg.title[lang]}
                                                        {pkg.is_featured && (
                                                            <span className="mr-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                                {t("internet_packages.featured")}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {formatType(pkg.type)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {pkg.price} {t("internet_packages.price").split(" ")[1]}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {pkg.duration_days}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {getPackageDetails(
                                                            pkg
                                                        ) || "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        <button
                                                            onClick={() =>
                                                                handleDetachPackage(
                                                                    pkg.id
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            {t("festivals.remove_from_festival")}
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                {t("festivals.no_packages")}
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
