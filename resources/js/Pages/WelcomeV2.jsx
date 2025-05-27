import { Link, Head } from "@inertiajs/react";
import AppLayoutSwitcher from "../Layouts/AppLayoutSwitcher";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useMemo } from "react";
import AOS from "aos";
import { FaCheck } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "aos/dist/aos.css";
import { GrMapLocation } from "react-icons/gr";
import { Button } from "@/Components/ui/Buttons";

const formatSpeed = (speedMb, t, lang) => {
    if (!speedMb && speedMb !== 0) return "";

    if (speedMb < 1) {
        const speedKb = Math.round(speedMb * 1024);
        return lang === "en"
            ? `${speedKb} ${t("internet_packages.kb_speed")}`
            : `${t("internet_packages.kb_speed")} ${speedKb}`;
    }

    return lang === "en"
        ? `${speedMb} ${t("internet_packages.mb_speed")}`
        : `${t("internet_packages.mb_speed")} ${speedMb}`;
};

export default function WelcomeV2({
    auth,
    laravelVersion,
    phpVersion,
    footerData,
    circleItems,
    servicesItems,
    internetPackages,
    provinces,
    sliderItems = [],
    sliderBackground = "",
}) {
    const { t } = useTranslation();
    const [lang, setLang] = useState("fa");
    const [activeTab, setActiveTab] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const storedLang = localStorage.getItem("lang") || "fa";
        setLang(storedLang);
    }, []);

    const tabTypes = [
        { key: "volume_fixed", title: t("internet_packages.volume_fixed") },
        { key: "volume_daily", title: t("internet_packages.volume_daily") },
        { key: "unlimited_home", title: t("internet_packages.unlimited_home") },
    ];

    const filteredPackages = useMemo(() => {
        const type = tabTypes[activeTab]?.key;
        if (type === "unlimited_home") {
            return internetPackages.filter((pkg) => pkg.type === "unlimited");
        }
        return internetPackages.filter((pkg) => pkg.type === type);
    }, [activeTab, internetPackages]);

    useEffect(() => {
        if (window.innerWidth > 768) {
            AOS.init({ duration: 1000, once: false });
        }
        const interval = setInterval(() => {
            if (sliderItems.length > 0) {
                setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [sliderItems.length]);

    return (
        <AppLayoutSwitcher
            auth={auth}
            footerData={footerData}
            servicesItems={servicesItems}
        >
            <div>
                <Head title="Ariyabod Companies Group - V2" />

                {/* Slider Section */}
                <div
                    className="relative overflow-hidden -mt-4 md1:mt-0"
                    style={{
                        background: sliderBackground
                            ? `url(${sliderBackground}) center/cover no-repeat`
                            : "linear-gradient(to right, #428b7c, #97c3b9)",
                        objectFit: "contain",
                    }}
                >
                    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24 lg:pt-16 relative z-10">
                        <div className="slider-container overflow-hidden relative">
                            <div
                                className="slider-wrapper flex transition-transform duration-500 ease-in-out"
                                style={{
                                    transform:
                                        lang === "en"
                                            ? `translateX(-${
                                                  currentSlide * 100
                                              }%)`
                                            : `translateX(${
                                                  currentSlide * 100
                                              }%)`,
                                }}
                            >
                                {sliderItems.length > 0 ? (
                                    sliderItems.map((slide, index) => (
                                        <div
                                            key={index}
                                            className={`slider-slide w-full flex-shrink-0 flex ${
                                                lang !== "en"
                                                    ? "justify-start"
                                                    : "justify-end"
                                            }`}
                                        >
                                            <div className="flex flex-col-reverse items-start gap-4">
                                                <div
                                                    className="mb-10 md:mb-0 text-white"
                                                    data-aos="fade-right"
                                                >
                                                    <h1 className="text-2xl font-bold mb-2 max-w-lg">
                                                        {slide.title?.[lang] ||
                                                            ""}
                                                    </h1>
                                                    <p className="mb-8 max-w-lg">
                                                        {slide.description?.[
                                                            lang
                                                        ] || ""}
                                                    </p>
                                                    <div
                                                        className={`mb-6 ${
                                                            lang !== "en"
                                                                ? "text-left"
                                                                : "text-right"
                                                        }`}
                                                    >
                                                        {slide.link && (
                                                            <Link
                                                                href={
                                                                    slide.link
                                                                }
                                                                className="bg-white text-[#428b7c] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition"
                                                            >
                                                                {slide
                                                                    .button_text?.[
                                                                    lang
                                                                ] ||
                                                                    t(
                                                                        "slider.learn_more"
                                                                    )}
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                                <div
                                                    className={`${
                                                        lang !== "en"
                                                            ? ""
                                                            : "w-full flex justify-start"
                                                    }`}
                                                    data-aos="fade-left"
                                                >
                                                    {slide.image && (
                                                        <img
                                                            src={slide.image}
                                                            alt={
                                                                slide.title?.[
                                                                    lang
                                                                ] ||
                                                                "Slider Image"
                                                            }
                                                            className="w-full max-w-lg rounded-lg"
                                                            loading="lazy"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="slider-slide w-full flex-shrink-0">
                                        <div className="flex flex-col md:flex-row items-center justify-between">
                                            <div
                                                className="md:w-1/2 mb-10 md:mb-0 text-white"
                                                data-aos="fade-right"
                                            >
                                                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                                                    {t("hero.title")}
                                                </h1>
                                                <p className="text-xl mb-8 max-w-lg">
                                                    {t("hero.subtitle")}
                                                </p>
                                                <div className="flex flex-wrap gap-4">
                                                    <Link
                                                        href={route("packages")}
                                                        className="bg-white text-[#428b7c] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition"
                                                    >
                                                        {t(
                                                            "hero.explore_packages"
                                                        )}
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "contact-us"
                                                        )}
                                                        className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-[#428b7c] transition"
                                                    >
                                                        {t("hero.contact_us")}
                                                    </Link>
                                                </div>
                                            </div>
                                            <div
                                                className="md:w-1/2"
                                                data-aos="fade-left"
                                            >
                                                <img
                                                    src="/images/hero-illustration.svg"
                                                    alt="Internet Services"
                                                    className="w-full max-w-lg mx-auto"
                                                    loading="lazy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {sliderItems.length > 1 && (
                                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    {sliderItems.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentSlide(index)
                                            }
                                            className={`h-2.5 rounded-full ${
                                                currentSlide === index
                                                    ? "w-8 bg-white"
                                                    : "w-2.5 bg-white bg-opacity-50"
                                            } transition-all duration-300`}
                                            aria-label={`Go to slide ${
                                                index + 1
                                            }`}
                                        ></button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Services Section */}
                <div id="ServicesSection" className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                {t("service_items.title")}
                            </h2>
                            <div className="w-24 h-1 bg-[#428b7c] mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {servicesItems &&
                                servicesItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all border border-gray-100"
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                    >
                                        <div className="flex justify-center mb-6">
                                            <img
                                                src={item.image}
                                                alt={item.title[lang]}
                                                className="w-20 h-20 object-contain"
                                            />
                                        </div>
                                        <h3 className="text-xl font-semibold text-center mb-3">
                                            {item.title[lang]}
                                        </h3>
                                        <p className="text-gray-600 text-center">
                                            {item.description[lang]}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Internet Packages Section */}
                <div className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                {t("internet_packages.main_title")}
                            </h2>
                            <div className="w-24 h-1 bg-[#428b7c] mx-auto mt-4"></div>
                        </div>

                        {/* Package Tabs */}
                        <div className="flex flex-wrap justify-center mb-12 gap-2">
                            {tabTypes.map((tab, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(index)}
                                    className={`px-6 py-3 rounded-full transition-all ${
                                        activeTab === index
                                            ? "bg-[#428b7c] text-white font-medium"
                                            : "bg-white hover:bg-gray-100 border border-gray-200"
                                    }`}
                                >
                                    {tab.title}
                                </button>
                            ))}
                        </div>

                        {/* Package Cards */}
                        {tabTypes.map((tab, tabIndex) => (
                            <div
                                key={tabIndex}
                                className={
                                    activeTab === tabIndex ? "block" : "hidden"
                                }
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {filteredPackages
                                        .slice(0, 4)
                                        .map((pkg, index) => (
                                            <div
                                                key={pkg.id}
                                                data-aos="fade-up"
                                                data-aos-delay={index * 100}
                                                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                            >
                                                <div
                                                    className={`p-4 ${
                                                        pkg.is_featured
                                                            ? "bg-purple-50 border-b border-purple-100"
                                                            : "bg-[#e6f7f4] border-b border-[#d1ebe6]"
                                                    }`}
                                                >
                                                    <h3 className="text-lg font-semibold text-center">
                                                        {pkg.title[lang]}
                                                    </h3>
                                                </div>

                                                <div className="p-6">
                                                    <div className="flex justify-center mb-6">
                                                        <span className="text-3xl font-bold text-[#428b7c]">
                                                            {pkg.price.toLocaleString()}
                                                            <span className="text-sm font-normal ml-1">
                                                                {t(
                                                                    "internet_packages.currency"
                                                                )}
                                                            </span>
                                                        </span>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {/* Type Badge */}
                                                        <div className="mb-4">
                                                            <span className="inline-block bg-gray-100 rounded-full px-4 py-1 text-sm text-gray-700 w-full text-center">
                                                                {t(
                                                                    `internet_packages.${pkg.type}`
                                                                ) || pkg.type}
                                                            </span>
                                                        </div>

                                                        {/* Show province */}
                                                        {pkg.provinces &&
                                                            Array.isArray(
                                                                pkg.provinces
                                                            ) &&
                                                            pkg.provinces
                                                                .length > 0 && (
                                                                <div className="flex items-center gap-2 mt-4 pt-2 text-gray-600">
                                                                    <span>
                                                                        <GrMapLocation className="text-[#428b7c] text-lg" />
                                                                    </span>
                                                                    <span>
                                                                        {pkg.provinces.map(
                                                                            (
                                                                                prov,
                                                                                idx
                                                                            ) => (
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

                                                        {/* Features List */}
                                                        <div className="pt-4 space-y-3">
                                                            {/* Duration */}
                                                            {pkg.duration_days && (
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded-full flex items-center justify-center">
                                                                        <FaCheck className="text-white text-[10px]" />
                                                                    </div>
                                                                    <span className="text-gray-700">
                                                                        {
                                                                            pkg.duration_days
                                                                        }{" "}
                                                                        {t(
                                                                            "internet_packages.days"
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Total Volume */}
                                                            {pkg.total_volume_gb && (
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded-full flex items-center justify-center">
                                                                        <FaCheck className="text-white text-[10px]" />
                                                                    </div>
                                                                    <span className="text-gray-700">
                                                                        {
                                                                            pkg.total_volume_gb
                                                                        }{" "}
                                                                        {t(
                                                                            "internet_packages.gb"
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Daily Limit */}
                                                            {pkg.daily_limit_gb && (
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded-full flex items-center justify-center">
                                                                        <FaCheck className="text-white text-[10px]" />
                                                                    </div>
                                                                    <span className="text-gray-700">
                                                                        {
                                                                            pkg.daily_limit_gb
                                                                        }{" "}
                                                                        {t(
                                                                            "internet_packages.daily_gb"
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Speed */}
                                                            {pkg.speed_mb && (
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded-full flex items-center justify-center">
                                                                        <FaCheck className="text-white text-[10px]" />
                                                                    </div>
                                                                    <span className="text-gray-700">
                                                                        {formatSpeed(
                                                                            pkg.speed_mb,
                                                                            t,
                                                                            lang
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* After Daily Limit Speed */}
                                                            {pkg.daily_limit_gb &&
                                                                pkg.after_daily_limit_speed_mb !==
                                                                    undefined && (
                                                                    <div className="flex gap-2 items-center">
                                                                        <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded-full flex items-center justify-center">
                                                                            <FaCheck className="text-white text-[10px]" />
                                                                        </div>
                                                                        <span className="text-gray-700">
                                                                            {t(
                                                                                "internet_packages.after_daily_limit"
                                                                            )}{" "}
                                                                            {formatSpeed(
                                                                                pkg.after_daily_limit_speed_mb,
                                                                                t,
                                                                                lang
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                <div className="mt-12 text-center">
                                    <Link
                                        href={`/packages`}
                                        className="px-8 py-3 bg-[#428b7c] text-white rounded-full hover:bg-[#357a6c] transition inline-block"
                                    >
                                        {t("internet_packages.view_all")}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* About Us Section */}
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="md:w-1/2" data-aos="fade-right">
                                <img
                                    src="/images/about.png"
                                    alt={t("about_us.image_alt")}
                                    className="w-full h-auto rounded-lg shadow-lg"
                                />
                            </div>
                            <div className="md:w-1/2" data-aos="fade-left">
                                <h2 className="text-3xl font-bold mb-6">
                                    {t("about_us.image_alt")}
                                </h2>
                                <p className="text-gray-600 mb-8 text-lg">
                                    {t("about_us.main_description2")}
                                </p>
                                <Link
                                    href="/about-us"
                                    className="px-8 py-3 bg-[#428b7c] text-white rounded-full hover:bg-[#357a6c] transition inline-block"
                                >
                                    {t("more_info")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tools Section */}
                <div className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                ابزار ها
                            </h2>
                            <div className="w-24 h-1 bg-[#428b7c] mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            <div
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                                data-aos="fade-up"
                            >
                                <img
                                    className="w-full h-[250px] object-contain bg-white p-4"
                                    src="/images/orgtest.png"
                                    alt="Network Test"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-4 text-center text-[#428b7c]">
                                        {t("network_test.about_title")}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {t("network_test.description_long")}
                                    </p>
                                    <div className="text-center">
                                        <Link
                                            href="/network-test"
                                            className="px-6 py-2 bg-[#428b7c] text-white rounded-full hover:bg-[#357a6c] transition inline-block"
                                        >
                                            {t("view")}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                                data-aos="fade-up"
                                data-aos-delay="100"
                            >
                                <img
                                    className="w-full h-[250px] object-contain bg-white p-4"
                                    src="/images/bubdle.png"
                                    alt="Bundle Calculator"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-4 text-center text-[#428b7c]">
                                        {t("calculator.title")}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {t("calculator.description")}
                                    </p>
                                    <div className="text-center">
                                        <Link
                                            href="/calculate-bundle"
                                            className="px-6 py-2 bg-[#428b7c] text-white rounded-full hover:bg-[#357a6c] transition inline-block"
                                        >
                                            {t("view")}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                <img
                                    className="w-full h-[250px] object-contain bg-white p-4"
                                    src="/images/width-band.png"
                                    alt="Bandwidth Calculator"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-4 text-center text-[#428b7c]">
                                        {t("calculator.bandwidth_calculator")}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {t("calculator.note_p2")}
                                    </p>
                                    <div className="text-center">
                                        <Link
                                            href="/bandwidth-calculator"
                                            className="px-6 py-2 bg-[#428b7c] text-white rounded-full hover:bg-[#357a6c] transition inline-block"
                                        >
                                            {t("view")}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                                data-aos="fade-up"
                                data-aos-delay="300"
                            >
                                <img
                                    className="w-full h-[250px] object-contain bg-white p-4"
                                    src="/images/internet-req.png"
                                    alt="Internet Request"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-4 text-center text-[#428b7c]">
                                        {t("request_internet.title")}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {t("request_internet.note_p1")}
                                    </p>
                                    <div className="text-center">
                                        <Link
                                            href="/request-internet"
                                            className="px-6 py-2 bg-[#428b7c] text-white rounded-full hover:bg-[#357a6c] transition inline-block"
                                        >
                                            {t("view")}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Package Management Section */}
                <div className="py-16 bg-[#428b7c] text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                            {t("package_management.title")}
                        </h2>
                        <p className="text-lg mb-8 max-w-3xl mx-auto">
                            {t("package_management.description")}
                        </p>
                        <h3 className="text-xl font-medium mb-8">
                            {t("package_management.note")}
                        </h3>
                        <button className="px-8 py-3 bg-white text-[#428b7c] rounded-full hover:bg-gray-100 transition font-medium">
                            {t("package_management.view_package_info")}
                        </button>
                    </div>
                </div>
            </div>
        </AppLayoutSwitcher>
    );
}
