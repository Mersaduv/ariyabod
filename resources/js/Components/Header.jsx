import { IoIosArrowDown } from "react-icons/io";
import LanguageSwitcher from "./LanguageSwitcher";
import { LuMenu } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { Link, Head } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import { useTranslation } from "react-i18next";
export default function Header({ auth }) {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [subOpen, setSubOpen] = useState(false);
    const [subOpen2, setSubOpen2] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const dropdownRef = useRef(null);
    const menuButtonRef = useRef(null);
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

    return (
        <>
            <header className="primary text-white shadow-md">
                <div className="mx-auto px-6 h-[70px] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-9">
                        <Link href="/" className="flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                                className="h-10 min-w-[132px]"
                            />
                        </Link>

                        <nav className="hidden gap-1 font-medium rtl md2:flex">
                            <Link
                                className="py-3 px-3 hover:text-[#4adcbf]"
                                href="/"
                            >
                                {t("nav.home")}
                            </Link>

                            <div className="relative group">
                                <Link
                                    className="py-3 px-2 hover:text-[#4adcbf] flex items-center gap-1 cursor-pointer"
                                    href="#"
                                >
                                    <div>{t("nav.tools.title")}</div>
                                    <IoIosArrowDown className="transition-transform group-hover:rotate-180" />
                                </Link>
                                <div
                                    className={`absolute top-full -mt-2 ${
                                        localStorage.getItem("lang") === "en"
                                            ? "left-0 text-left"
                                            : "right-0 text-right"
                                    }  bg-[#2c5f59] text-white rounded-md shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition duration-200 w-[250px] z-50`}
                                >
                                    <Link
                                        href="/network-test"
                                        className="block px-4 py-2 hover:text-[#4adcbf]"
                                    >
                                        <div className="mb-[6px] mt-[1px]">
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
                                        href="/calculate-bundle"
                                        className="block px-4 py-2 hover:text-[#4adcbf]"
                                    >
                                        <div className="mb-[6px] mt-[1px]">
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
                                        href="/bandwidth-calculator"
                                        className="block px-4 py-3 hover:text-[#4adcbf]"
                                    >
                                        {t("nav.tools.bandwidthCalculator")}
                                    </Link>
                                </div>
                            </div>

                            <Link
                                className="py-3 px-2 hover:text-[#4adcbf]"
                                href="/request-internet"
                            >
                                {t("nav.internetRequest")}
                            </Link>
                            <Link
                                className="py-3 px-2 hover:text-[#4adcbf]"
                                href="/packages"
                            >
                                {t("nav.packages")}
                            </Link>
                            <Link
                                className="py-3 px-2 hover:text-[#4adcbf]"
                                href="/about-us"
                            >
                                {t("nav.aboutUs")}
                            </Link>
                            <Link
                                className="py-3 px-2 hover:text-[#4adcbf]"
                                href="/contact-us"
                            >
                                {t("nav.contactUs")}
                            </Link>
                        </nav>
                    </div>

                    <div
                        className={`flex items-center gap-4 ${
                            localStorage.getItem("lang") === "en"
                                ? "md2:-mr-4"
                                : "md2:-ml-2"
                        } `}
                    >
                        <div className="flex items-center gap-3">
                            <LanguageSwitcher />
                            {auth.user ? (
                                <div className="hidden md2:flex items-center justify-center rounded-md bg-[#034f408e] h-9 hover:bg-[#42d4b73e] text-white gap-1 -ml-1">
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
                                                            "profile.edit"
                                                        )}
                                                    >
                                                        {t("profile")}
                                                    </Dropdown.Link>
                                                    <Dropdown.Link
                                                        href={route("logout")}
                                                        method="post"
                                                        as="button"
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
                                    href={route("login")}
                                    className="hidden md2:flex items-center justify-center rounded-md bg-[#034f408e] h-9 px-2 hover:bg-[#42d4b73e] text-white gap-1"
                                >
                                    <FaUserAlt />
                                    <div>{t("login")}</div>
                                </Link>
                            )}
                        </div>
                        <button
                            ref={menuButtonRef}
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="md2:hidden flex items-center justify-center w-9 h-9 rounded-md bg-[#034f408e] hover:bg-[#42d4b73e] text-white"
                        >
                            <LuMenu className="text-2xl" />
                        </button>
                    </div>
                </div>

                {/* mobile nav menu */}
                {menuOpen && (
                    <div
                        ref={dropdownRef}
                        className="md2:hidden fixed top-[70px] inset-x-0 bg-[#2c5f59] text-white shadow-md z-40"
                    >
                        <nav className="flex flex-col px-4 py-4 space-y-3">
                        {auth.user ? (
                                <div className="w-full">
                                    <button
                                        id="sample-dropdown"
                                        onClick={() =>
                                            setSubOpen2((prev) => !prev)
                                        }
                                        className="flex justify-between items-center w-full"
                                    >
                                        <span> {auth.user.name}</span>
                                        <IoIosArrowDown
                                            className={`${
                                                subOpen2 ? "rotate-180" : ""
                                            } text-xl`}
                                        />
                                    </button>
                                    {subOpen2 && (
                                        <div className="flex flex-col space-y-2 pt-2 px-2 mb-1">
                                            <hr />
                                            <div
                                                title={auth.user.email}
                                                dir={
                                                    localStorage.getItem(
                                                        "lang"
                                                    ) === "en"
                                                        ? ""
                                                        : "ltr"
                                                }
                                                className="text-sm hover:text-[#4adcbf] text-ellipsis overflow-hidden whitespace-nowrap"
                                            >
                                                {auth.user.email}
                                            </div>
                                            <hr />
                                            {auth.user.role === "admin" && (
                                                <Link
                                                    href={route(
                                                        "admin.dashboard"
                                                    )}
                                                    className="hover:text-[#4adcbf] text-sm"
                                                >
                                                    {t("dashboard")}
                                                </Link>
                                            )}
                                            <hr />
                                            <Link
                                                href={route("profile.edit")}
                                                className="hover:text-[#4adcbf] text-sm "
                                            >
                                                {t("profile")}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="flex items-center justify-center rounded-md bg-[#034f408e] h-9 px-2 hover:bg-[#42d4b73e] text-white gap-1"
                                >
                                    <FaUserAlt />
                                    <div>{t("login")}</div>
                                </Link>
                            )}
                            <hr />
                            <Link href="#" className="hover:text-[#4adcbf]">
                                {t("nav.home")}
                            </Link>
                            <hr />
                            <button
                                id="sample-dropdown"
                                onClick={() => setSubOpen((prev) => !prev)}
                                className="flex justify-between items-center"
                            >
                                <span>{t("nav.tools.title")}</span>
                                <IoIosArrowDown
                                    className={`${
                                        subOpen ? "rotate-180" : ""
                                    } text-xl`}
                                />
                            </button>
                            {subOpen && (
                                <div className="flex flex-col space-y-2 pt-1 px-2 mb-1">
                                    <hr />
                                    <Link
                                        href="/network-test"
                                        className="hover:text-[#4adcbf] text-sm"
                                    >
                                        {t("nav.tools.speedTest.title")}
                                    </Link>
                                    <hr />
                                    <Link
                                        href="/calculate-bundle"
                                        className="hover:text-[#4adcbf] text-sm"
                                    >
                                        {t("nav.tools.packageCalculator.title")}
                                    </Link>
                                    <hr />
                                    <Link
                                        href="/bandwidth-calculator"
                                        className="hover:text-[#4adcbf] text-sm"
                                    >
                                        {t("nav.tools.bandwidthCalculator")}
                                    </Link>
                                </div>
                            )}
                            <hr />
                            <Link href="#" className="hover:text-[#4adcbf]">
                                {t("nav.internetRequest")}
                            </Link>
                            <hr />
                            <Link href="#" className="hover:text-[#4adcbf]">
                                {t("nav.packages")}
                            </Link>
                            <hr />
                            <Link href="#" className="hover:text-[#4adcbf]">
                                {t("nav.aboutUs")}
                            </Link>
                            <hr />
                            <Link href="#" className="hover:text-[#4adcbf]">
                                {t("nav.contactUs")}
                            </Link>
                            <hr />
                            {/* <Link href="#" className="hover:text-[#4adcbf]">
                                {t("login")}
                            </Link> */}
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="hover:text-[#4adcbf] font-semibold text-start"
                            >
                                {t("logout")}
                            </Link>
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
}
