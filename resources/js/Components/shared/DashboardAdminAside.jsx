import { useTranslation } from "react-i18next";
import { CgIfDesign } from "react-icons/cg";
import { LuGrid2X2Plus } from "react-icons/lu";
import { BsGrid } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { BsBoxes } from "react-icons/bs";
import { Link, usePage } from "@inertiajs/react";
import { IoLanguage, IoLogOutOutline } from "react-icons/io5";
import React, { useEffect, useRef, useState } from "react";
import LanguageSwitcher from "../LanguageSwitcher";
import { TfiLayoutSliderAlt } from "react-icons/tfi";
const languages = [
    { code: "fa", label: "دری | فارسی" },
    { code: "ps", label: "پشتو" },
    { code: "en", label: "English" },
];
const menuItems = [
    {
        id: 1,
        name: "dashboard",
        Icon: BsGrid,
        path: ["/admin/dashboard"],
    },
    {
        id: 2,
        name: "general_design",
        Icon: CgIfDesign,
        path: ["/admin/general-design"],
    },
    {
        id: 3,
        name: "site_items",
        Icon: LuGrid2X2Plus,
        path: ["/admin/site-items"],
    },
    {
        id: 4,
        name: "users",
        Icon: FaUsers,
        path: ["/admin/users"],
    },
    {
        id: 5,
        name: "internet_packages_item",
        Icon: BsBoxes,
        path: ["/admin/internet-packages"],
    },
    {
        id: 6,
        name: "slider_items_name",
        Icon: TfiLayoutSliderAlt,
        path: ["/admin/slider-items"],
    },
    {
        id: 7,
        name: "language_switcher",
        path: [],
        Icon: IoLanguage,
        subItems: languages,
    },
    {
        id: 8,
        name: "logout",
        Icon: IoLogOutOutline,
        path: ["logout"],
        isLogout: true,
    },
];
export default function DashboardAdminAside(props) {
    const { open, setOpen } = props;
    const { t, i18n } = useTranslation();
    const lang = localStorage.getItem("lang") || "fa";
    const { url } = usePage();
    const currentPath = window.location.pathname;
    const [openSubMenu, setOpenSubMenu] = useState(null);

    const handleChangeLanguage = (lang) => {
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
            localStorage.setItem("lang", lang);
        }
        setOpenSubMenu(null);
    };
    return (
        // aside section
        <div>
            <aside
                className={`transition-all duration-300 mt-0.3 bg-white border-r shadow sticky top-[61px] ${lang === "fa" ? "left-0" : "right-0"} z-40 ${
                    open ? "w-64" : "w-20"
                } min-h-screen sm:block hidden`}
            >
                <div className="flex flex-col h-full py-6 pt-4 px-4 gap-4 relative">
                    {menuItems.map((item) => {
                        const isActive = item.path?.some((path) =>
                            currentPath.startsWith(path)
                        );

                        if (item.subItems) {
                            return (
                                <div key={item.id}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!open) {
                                                setOpen(true);
                                            } else {
                                                setOpenSubMenu(
                                                    openSubMenu === item.id
                                                        ? null
                                                        : item.id
                                                );
                                            }
                                        }}
                                        className={`flex lang-dropdown items-center gap-3 px-3 py-2 rounded-lg transition-all w-full text-left ${
                                            openSubMenu === item.id
                                                ? "bg-gray-200 font-semibold text-[#428b7c]"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <item.Icon
                                            size={23}
                                            className="shrink-0"
                                        />
                                        {open && (
                                            <span className="text-sm">
                                                {t(`${item.name}`)}
                                            </span>
                                        )}
                                    </button>
                                    {openSubMenu === item.id && open && (
                                        <div className="ml-8 mt-2 flex flex-col gap-1">
                                            {item.subItems.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() =>
                                                        handleChangeLanguage(
                                                            lang.code
                                                        )
                                                    }
                                                    className={`text-sm px-3 py-2 rounded-lg text-left ${
                                                        i18n.language ===
                                                        lang.code
                                                            ? "bg-gray-200 font-semibold text-[#428b7c]"
                                                            : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        if (item.isLogout) {
                            return (
                                <Link
                                    key={item.id}
                                    href={route(item.path[0])}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                        isActive
                                            ? "bg-gray-200 font-semibold text-[#428b7c]"
                                            : "text-red-600 hover:bg-gray-100"
                                    }`}
                                    method="post"
                                    as="button"
                                >
                                    <item.Icon size={23} className="shrink-0" />
                                    {open && (
                                        <span className="text-sm">
                                            {t(`${item.name}`)}
                                        </span>
                                    )}
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.id}
                                href={item.path[0]}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                    isActive
                                        ? "bg-gray-200 font-semibold text-[#428b7c]"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <item.Icon size={23} className="shrink-0" />
                                {open && (
                                    <span className="text-sm">
                                        {t(`${item.name}`)}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </aside>

            {/* Aside کشویی برای نمایش در حالت موبایل */}
            <aside
                className={`sm:hidden fixed top-0 right-0 z-50 transition-all duration-300 transform ${
                    open ? "w-1/2 opacity-100" : "w-0 opacity-0 invisible"
                } h-full bg-white shadow`}
            >
                <div className="flex flex-col h-full py-6 px-4 gap-4">
                    {menuItems.map((item) => {
                        const isActive = item.path?.includes(url);

                        if (item.subItems) {
                            return (
                                <div key={item.id}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!open) {
                                                setOpen(true);
                                            } else {
                                                setOpenSubMenu(
                                                    openSubMenu === item.id
                                                        ? null
                                                        : item.id
                                                );
                                            }
                                        }}
                                        className={`flex lang-dropdown items-center gap-3 px-3 py-2 rounded-lg transition-all w-full text-left ${
                                            openSubMenu === item.id
                                                ? "bg-gray-200 font-semibold text-[#428b7c]"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <item.Icon
                                            size={23}
                                            className="shrink-0"
                                        />
                                        {open && (
                                            <span className="text-sm">
                                                {t(`${item.name}`)}
                                            </span>
                                        )}
                                    </button>
                                    {openSubMenu === item.id && open && (
                                        <div className="ml-8 mt-2 flex flex-col gap-1">
                                            {item.subItems.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() =>
                                                        handleChangeLanguage(
                                                            lang.code
                                                        )
                                                    }
                                                    className={`text-sm px-3 py-2 rounded-lg text-left ${
                                                        i18n.language ===
                                                        lang.code
                                                            ? "bg-gray-200 font-semibold"
                                                            : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        if (item.isLogout) {
                            return (
                                <Link
                                    key={item.id}
                                    href={route(item.path[0])}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                        isActive
                                            ? "bg-gray-200 font-semibold"
                                            : "text-red-600 hover:bg-gray-100"
                                    }`}
                                    method="post"
                                    as="button"
                                >
                                    <item.Icon size={23} className="shrink-0" />
                                    {open && (
                                        <span className="text-sm">
                                            {t(`${item.name}`)}
                                        </span>
                                    )}
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.id}
                                href={item.path[0]}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                    isActive
                                        ? "bg-gray-200 font-semibold text-[#428b7c]"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <item.Icon size={23} className="shrink-0" />
                                {open && (
                                    <span className="text-sm">
                                        {t(`${item.name}`)}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </aside>
        </div>
    );
}
