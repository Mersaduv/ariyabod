import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import { Link, usePage, router } from "@inertiajs/react";
import Modal from "@/Components/ui/Modal";

export default function Index({ auth, festivals }) {
    const { t } = useTranslation();
    const { props } = usePage();
    const message = props.flash?.message;
    const [showModal, setShowModal] = useState(false);
    const [festivalToDelete, setFestivalToDelete] = useState(null);
    const [filter, setFilter] = useState("all"); // 'all', 'active', 'expired'
    const lang = localStorage.getItem("lang") || "fa";

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

    // Delete a festival
    const handleDelete = (id) => {
        console.log(id);
        setShowModal(true);
        setFestivalToDelete(id);
    };

    // Filter festivals based on status
    const filteredFestivals = festivals.filter((festival) => {
        if (filter === "all") return true;

        const today = new Date();
        const startDate = new Date(festival.start_date);
        const endDate = new Date(festival.end_date);

        if (filter === "active") {
            return festival.is_active && today >= startDate && today <= endDate;
        }

        if (filter === "expired") {
            return !festival.is_active || today > endDate;
        }

        return true;
    });
    return (
        <>
            <Modal show={showModal} onClose={() => setShowModal(false)} title={t("festivals.delete_festival")}>
                <>
                    <p className="text-lg font-medium pb-4">
                        {t("festivals.delete_festival_confirm")}
                    </p>
                    <hr className="mb-4" />
                    <div className="flex justify-between gap-2">
                        <button
                            className="bg-red-500 hover:bg-red-600 min-w-24 text-white px-4 py-2 rounded-md"
                            onClick={() => {
                                router.delete(
                                    route(
                                        "admin.festivals.destroy",
                                        festivalToDelete
                                    )
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
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            {t("festivals.management")}
                        </h2>
                        <Link
                            href={route("admin.festivals.create")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            {t("festivals.add_new")}
                        </Link>
                    </div>

                    {message && (
                        <div className="p-4 bg-green-100 text-green-700 rounded-md border border-green-300">
                            {message}
                        </div>
                    )}

                    {/* Filter controls */}
                    <div className="flex items-center gap-x-4">
                        <span className="text-gray-700">{t("festivals.filter")}</span>
                        <div className="flex border rounded-md overflow-hidden">
                            <button
                                className={`px-4 py-2 ${
                                    filter === "all"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100"
                                }`}
                                onClick={() => setFilter("all")}
                            >
                                {t("festivals.all")}
                            </button>
                            <button
                                className={`px-4 py-2 ${
                                    filter === "active"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100"
                                }`}
                                onClick={() => setFilter("active")}
                            >
                                {t("festivals.active")}
                            </button>
                            <button
                                className={`px-4 py-2 ${
                                    filter === "expired"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100"
                                }`}
                                onClick={() => setFilter("expired")}
                            >
                                {t("festivals.expired")}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        {filteredFestivals && filteredFestivals.length > 0 ? (
                            <ul className="space-y-2 divide-gray-200">
                                {filteredFestivals.map((festival) => {
                                    const status = getStatusText(festival);
                                    return (
                                        <li className="sm:rounded-md" key={festival.id}>
                                            <div
                                                className={`px-4 sm:rounded-md border py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between ${
                                                    isActive(festival)
                                                        ? ""
                                                        : ""
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
                                                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center">
                                                    {festival.image && (
                                                        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden mr-0 mb-3 sm:mb-0 sm:mx-4">
                                                            <img
                                                                src={`/storage/${festival.image}`}
                                                                alt={
                                                                    festival
                                                                        .title[lang]
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                                            {festival.title[lang]}
                                                            {festival.is_featured && (
                                                                <span className="mr-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
                                                                    {t("internet_packages.featured")}
                                                                </span>
                                                            )}
                                                        </h3>
                                                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:gap-x-6">
                                                            <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                                                                <span className="ml-1 font-medium">
                                                                    {t("festivals.date_range")}
                                                                </span>
                                                                <span>
                                                                    {formatDate(
                                                                        festival.start_date
                                                                    )}{" "}
                                                                    {t("internet_packages.to")}{" "}
                                                                    {formatDate(
                                                                        festival.end_date
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 flex items-center text-sm">
                                                                <span
                                                                    className={`px-2 py-1 rounded-full ${status.class}`}
                                                                >
                                                                    {
                                                                        status.text
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 sm:mt-0 flex flex-row-reverse sm:flex-row gap-2">
                                                    <Link
                                                        href={route(
                                                            "admin.festivals.edit",
                                                            festival.id
                                                        )}
                                                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
                                                    >
                                                        {t("internet_packages.edit")}
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "admin.festivals.show",
                                                            festival.id
                                                        )}
                                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                                                    >
                                                        {t("festivals.view_packages")}
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                festival.id
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
                                                    >
                                                        {t("internet_packages.delete")}
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                {t("internet_packages.no_festivals_found")}
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
