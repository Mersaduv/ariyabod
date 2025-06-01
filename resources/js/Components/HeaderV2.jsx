import { IoIosArrowDown } from "react-icons/io";
import LanguageSwitcher from "./LanguageSwitcher";
import { LuMenu } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { AiTwotoneMail } from "react-icons/ai";
import React from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import { useTranslation } from "react-i18next";

export default function HeaderV2({ auth, servicesItems }) {
    const { t } = useTranslation();
    const lang = localStorage.getItem("lang") || "fa";
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef(null);
    const menuButtonRef = useRef(null);
    const { url } = usePage();

    // Check if current URL is in v2 mode
    const isV2 = url === "/v2" || url.startsWith("/v2/");

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Helper function to get the correct route based on V2 status
    const getRoute = (routeName) => {
        if (
            isV2 &&
            routeName !== "login" &&
            routeName !== "logout" &&
            routeName !== "profile.edit" &&
            routeName !== "admin.dashboard"
        ) {
            return route(`v2.${routeName}`);
        }
        return route(routeName);
    };

    return (
        <>
            <header
                className={`bg-white shadow-md fixed w-full z-50 transition-all duration-300 pt-4`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center pb-4">
                            <Link href={isV2 ? "/v2" : "/"}>
                                <img
                                    src="/images/logo.png"
                                    alt="Ariyabod Logo"
                                    className={`transition-all duration-300 ${
                                        isScrolled ? "h-9" : "h-10"
                                    }`}
                                />
                            </Link>
                        </div>
                        <div className="flex items-center gap-4 -mt-4">
                            <LanguageSwitcher v2 />
                            {auth && auth.user ? (
                                <div className="hidden md1:flex items-center justify-center h-9 hover:bg-[#8585850e] rounded-t-md text-black border-b-2 border-[#428b7c] gap-1 -ml-1">
                                    <Dropdown>
                                        {({ open }) => (
                                            <>
                                                <Dropdown.Trigger>
                                                    <span className="rounded-md">
                                                        <button
                                                            type="button"
                                                            className={`w-[110px] flex justify-between items-center px-1 ${
                                                                localStorage.getItem(
                                                                    "lang"
                                                                ) === "en"
                                                                    ? "pl-2"
                                                                    : "pr-2"
                                                            } py-2 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none transition ease-in-out duration-150`}
                                                        >
                                                            <div
                                                                title={
                                                                    auth.user
                                                                        .name
                                                                }
                                                                dir={
                                                                    localStorage.getItem(
                                                                        "lang"
                                                                    ) === "en"
                                                                        ? "rtl"
                                                                        : ""
                                                                }
                                                                className=" text-ellipsis overflow-hidden whitespace-nowrap"
                                                            >
                                                                {auth.user.name}
                                                            </div>

                                                            <IoIosArrowDown
                                                                className={`text-lg transition-transform duration-200 ${
                                                                    open
                                                                        ? "rotate-180"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </button>
                                                    </span>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content>
                                                    <Dropdown.Item>
                                                        <div
                                                            title={
                                                                auth.user.email
                                                            }
                                                            dir={
                                                                localStorage.getItem(
                                                                    "lang"
                                                                ) === "en"
                                                                    ? ""
                                                                    : "ltr"
                                                            }
                                                            className="text-sm text-ellipsis overflow-hidden whitespace-nowrap"
                                                        >
                                                            {auth.user.email}
                                                        </div>
                                                    </Dropdown.Item>
                                                    {auth.user.role ===
                                                        "admin" && (
                                                        <Dropdown.Link
                                                            href={route(
                                                                "admin.dashboard"
                                                            )}
                                                        >
                                                            {t("dashboard")}
                                                        </Dropdown.Link>
                                                    )}
                                                    <Dropdown.Link
                                                        href={route(
                                                            isV2
                                                                ? "v2.profile.edit"
                                                                : "profile.edit"
                                                        )}
                                                    >
                                                        {t("profile")}
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route(
                                                            isV2
                                                                ? "v2.logout"
                                                                : "logout"
                                                        )}
                                                        method="post"
                                                        as="button"
                                                        className="text-red-500"
                                                    >
                                                        {t("logout")}
                                                    </Dropdown.Link>
                                                </Dropdown.Content>
                                            </>
                                        )}
                                    </Dropdown>
                                </div>
                            ) : (
                                <Link
                                    href={route(isV2 ? "v2.login" : "login")}
                                    className="hidden md1:flex items-center justify-center rounded-t-md h-9 px-2 hover:bg-[#8585850e] text-black border-b-2 border-[#428b7c] gap-2"
                                >
                                    <FaUserAlt className="text-[#428b7c]" />
                                    <div className="text-[15px]">
                                        {t("login")}
                                    </div>
                                </Link>
                            )}

                            {/* Mobile menu button */}
                            <button
                                type="button"
                                className="md1:hidden text-gray-800"
                                onClick={toggleMobileMenu}
                            >
                                {mobileMenuOpen ? (
                                    <FaTimes className="h-6 w-6" />
                                ) : (
                                    <FaBars className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div
                        id="nav-menu"
                        className={`flex justify-between items-center transition-all duration-500 ease-in-out transform ${
                            isScrolled
                                ? "opacity-0 -translate-y-full max-h-0"
                                : "opacity-100 translate-y-0 max-h-[500px]"
                        }`}
                    >
                        <div id="nav" className="w-fit hidden md1:block">
                            <div className="v2-menu">
                                <div className="v2-item">
                                    <Link
                                        className="py-3 px-3 text-gray-600"
                                        href={isV2 ? "/v2" : "/"}
                                    >
                                        {t("nav.home")}
                                    </Link>
                                </div>

                                {/* Dropdown Tools */}
                                <div className="relative group">
                                    <div className="v2-item">
                                        <div
                                            className={`flex items-center gap-2 cursor-pointer ${
                                                lang === "en" ? "-mt-1" : ""
                                            }`}
                                        >
                                            <div className="text-gray-600 text-base">
                                                {t("nav.tools.title")}
                                            </div>
                                            <IoIosArrowDown className="transition-transform group-hover:rotate-180" />
                                        </div>
                                    </div>
                                    <div
                                        className={`absolute top-full  ${
                                            localStorage.getItem("lang") ===
                                            "en"
                                                ? "left-0 text-left"
                                                : "right-0 text-right"
                                        }  text-gray-600 bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition duration-200 w-[250px] z-50`}
                                    >
                                        <Link
                                            href={getRoute("network-test")}
                                            className="block px-6 py-3 hover:bg-gray-50 rounded-md"
                                        >
                                            <div className="mb-[6px] mt-[1px] text-base">
                                                {t("nav.tools.speedTest.title")}
                                            </div>
                                            <div className="text-[13px]">
                                                {t(
                                                    "nav.tools.speedTest.description"
                                                )}
                                            </div>
                                        </Link>
                                        <hr />
                                        <Link
                                            href={getRoute("calculate-bundle")}
                                            className="block px-6 py-3 hover:bg-gray-50"
                                        >
                                            <div className="mb-[6px] mt-[1px] text-base">
                                                {t(
                                                    "nav.tools.packageCalculator.title"
                                                )}
                                            </div>
                                            <div className="text-[13px]">
                                                {t(
                                                    "nav.tools.packageCalculator.description"
                                                )}
                                            </div>
                                        </Link>
                                        <hr />
                                        <Link
                                            href={getRoute(
                                                "bandwidth-calculator"
                                            )}
                                            className="block px-6 py-3 hover:bg-gray-50 rounded-md"
                                        >
                                            <div className="mb-[6px] mt-[1px] text-base">
                                                {t(
                                                    "nav.tools.bandwidthCalculator"
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                {/* Services Dropdown */}
                                <div className="relative group">
                                    <div className="v2-item">
                                        <div
                                            className={`flex items-center gap-2 cursor-pointer ${
                                                lang === "en" ? "-mt-1" : ""
                                            }`}
                                        >
                                            <div className="text-gray-600 text-base">
                                                {t("nav.services")}
                                            </div>
                                            <IoIosArrowDown className="transition-transform group-hover:rotate-180" />
                                        </div>
                                    </div>
                                    <div
                                        className={`absolute top-full  ${
                                            localStorage.getItem("lang") ===
                                            "en"
                                                ? "left-0 text-left"
                                                : "right-0 text-right"
                                        }  text-gray-600 bg-white rounded-md shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition duration-200 w-[250px] z-50 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#428b7c] scrollbar-track-gray-100`}
                                    >
                                        {servicesItems &&
                                            servicesItems.map(
                                                (service, index) => (
                                                    <React.Fragment key={index}>
                                                        <Link
                                                            href={
                                                                service.link ||
                                                                "#"
                                                            }
                                                            className="block px-6 py-2 hover:bg-gray-50 rounded-md"
                                                        >
                                                            <div className="mb-1 text-base">
                                                                {service
                                                                    .title?.[
                                                                    lang
                                                                ] ||
                                                                    service.title}
                                                            </div>
                                                            {service.description && (
                                                                <div className="text-[13px]">
                                                                    {service
                                                                        .description?.[
                                                                        lang
                                                                    ] ||
                                                                        service.description}
                                                                </div>
                                                            )}
                                                        </Link>
                                                        {index <
                                                            servicesItems.length -
                                                                1 && <hr />}
                                                    </React.Fragment>
                                                )
                                            )}
                                    </div>
                                </div>

                                <Link
                                    className="v2-item py-3 px-3 text-gray-600"
                                    href={getRoute("request-internet")}
                                >
                                    {t("nav.internetRequest")}
                                </Link>
                                <Link
                                    className="v2-item py-3 px-3 text-gray-600"
                                    href={getRoute("packages")}
                                >
                                    {t("nav.packages")}
                                </Link>
                                <Link
                                    className="v2-item py-3 px-3 text-gray-600"
                                    href={getRoute("about-us")}
                                >
                                    {t("nav.aboutUs")}
                                </Link>
                                <Link
                                    className="v2-item py-3 px-3 text-gray-600"
                                    href={getRoute("contact-us")}
                                >
                                    {t("nav.contactUs")}
                                </Link>
                            </div>
                        </div>
                        <div className="hidden md1:flex items-center gap-2 text-gray-600">
                            <a
                                href="mailto:Info@ariyabod.af"
                                className="hover:text-[#428b7c]"
                            >
                                Info@ariyabod.af
                            </a>
                            <AiTwotoneMail className="text-[#428b7c] text-xl" />
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md1:hidden bg-white py-4 px-6 shadow-lg max-h-[80vh] overflow-y-auto">
                        <div className="flex flex-col space-y-4">
                            <Link
                                className="py-3 px-3 text-gray-600 hover:bg-gray-50 rounded-md"
                                href={isV2 ? "/v2" : "/"}
                            >
                                {t("nav.home")}
                            </Link>

                            {/* Mobile Tools Dropdown */}
                            <div className="relative">
                                <button
                                    className="w-full flex items-center justify-between py-3 px-3 text-gray-600 hover:bg-gray-50 rounded-md"
                                    onClick={() => {
                                        const toolsMenu =
                                            document.getElementById(
                                                "mobile-tools-menu"
                                            );
                                        toolsMenu.classList.toggle("hidden");
                                    }}
                                >
                                    <span>{t("nav.tools.title")}</span>
                                    <IoIosArrowDown className="transition-transform" />
                                </button>
                                <div
                                    id="mobile-tools-menu"
                                    className="hidden bg-gray-50 rounded-md mt-1 px-2"
                                >
                                    <Link
                                        href={getRoute("network-test")}
                                        className="block py-3 px-3 text-gray-600 hover:bg-gray-100 rounded-md"
                                    >
                                        <div className="text-base">
                                            {t("nav.tools.speedTest.title")}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {t(
                                                "nav.tools.speedTest.description"
                                            )}
                                        </div>
                                    </Link>
                                    <Link
                                        href={getRoute("calculate-bundle")}
                                        className="block py-3 px-3 text-gray-600 hover:bg-gray-100 rounded-md"
                                    >
                                        <div className="text-base">
                                            {t(
                                                "nav.tools.packageCalculator.title"
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {t(
                                                "nav.tools.packageCalculator.description"
                                            )}
                                        </div>
                                    </Link>
                                    <Link
                                        href={getRoute("bandwidth-calculator")}
                                        className="block py-3 px-3 text-gray-600 hover:bg-gray-100 rounded-md"
                                    >
                                        <div className="text-base">
                                            {t("nav.tools.bandwidthCalculator")}
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Services Dropdown */}
                            {servicesItems && servicesItems.length > 0 && (
                                <div className="relative">
                                    <button
                                        className="w-full flex items-center justify-between py-3 px-3 text-gray-600 hover:bg-gray-50 rounded-md"
                                        onClick={() => {
                                            const servicesMenu =
                                                document.getElementById(
                                                    "mobile-services-menu"
                                                );
                                            servicesMenu.classList.toggle(
                                                "hidden"
                                            );
                                        }}
                                    >
                                        <span>{t("nav.services")}</span>
                                        <IoIosArrowDown className="transition-transform" />
                                    </button>
                                    <div
                                        id="mobile-services-menu"
                                        className="hidden bg-gray-50 rounded-md mt-1 px-2"
                                    >
                                        {servicesItems.map((service, index) => (
                                            <React.Fragment key={index}>
                                                <Link
                                                    href={service.link}
                                                    className="block py-3 px-3 text-gray-600 hover:bg-gray-100 rounded-md"
                                                >
                                                    <div className="text-base">
                                                        {service.title?.[
                                                            lang
                                                        ] || service.title}
                                                    </div>
                                                    {service.description && (
                                                        <div className="text-xs text-gray-500">
                                                            {service
                                                                .description?.[
                                                                lang
                                                            ] ||
                                                                service.description}
                                                        </div>
                                                    )}
                                                </Link>
                                                {index <
                                                    servicesItems.length -
                                                        1 && (
                                                    <hr className="mx-3" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Link
                                className="py-3 px-3 text-gray-600 hover:bg-gray-50 rounded-md"
                                href={getRoute("request-internet")}
                            >
                                {t("nav.internetRequest")}
                            </Link>
                            <Link
                                className="py-3 px-3 text-gray-600 hover:bg-gray-50 rounded-md"
                                href={getRoute("packages")}
                            >
                                {t("nav.packages")}
                            </Link>
                            <Link
                                className="py-3 px-3 text-gray-600 hover:bg-gray-50 rounded-md"
                                href={getRoute("about-us")}
                            >
                                {t("nav.aboutUs")}
                            </Link>
                            <Link
                                className="py-3 px-3 text-gray-600 hover:bg-gray-50 rounded-md"
                                href={getRoute("contact-us")}
                            >
                                {t("nav.contactUs")}
                            </Link>
                            <div className="pt-2 border-t border-gray-200">
                                <a
                                    href="mailto:Info@ariyabod.af"
                                    className="flex items-center gap-2 py-3 px-3 text-gray-600 hover:text-[#428b7c]"
                                >
                                    <AiTwotoneMail className="text-[#428b7c] text-xl" />
                                    <span>Info@ariyabod.af</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}
