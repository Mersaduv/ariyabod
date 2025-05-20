import { Link, Head } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";
import { useTranslation } from "react-i18next";
import MainSlider from "@/Components/sliders/MainSlider";
import React, { useRef, useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import AOS from "aos";
import { FaCheck } from "react-icons/fa6";

import "aos/dist/aos.css";
import "keen-slider/keen-slider.min.css";
import { GrMapLocation } from "react-icons/gr";

const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "";

    // Extract time portion (HH:MM) from ISO datetime string
    return dateTimeString.substring(11, 16);
};

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    headerData,
    circleItems,
    servicesItems,
    internetPackages,
    provinces,
}) {
    const { t } = useTranslation();
    const lang = localStorage.getItem("lang") || "fa";
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderInterval = useRef(null);
    const [radius, setRadius] = useState(() =>
        window.innerWidth >= 1280
            ? 240
            : window.innerWidth >= 768
            ? 180
            : window.innerWidth >= 475
            ? 100
            : 80
    );

    // Added for internet packages tabs
    const [activeTab, setActiveTab] = useState(0);
    const tabTypes = [
        { key: "volume_fixed", title: t("internet_packages.volume_fixed") },
        { key: "volume_daily", title: t("internet_packages.volume_daily") },
        { key: "unlimited_home", title: t("internet_packages.unlimited_home") },
    ];

    // Filter packages based on type and additional criteria
    const getFilteredPackages = (type) => {
        if (type === "unlimited_home") {
            // Filter all unlimited packages for the home tab
            return internetPackages.filter((pkg) => pkg.type === "unlimited");
        } else {
            // Regular filtering by type
            return internetPackages.filter((pkg) => pkg.type === type);
        }
    };

    const [sliderRef, slider] = useKeenSlider({
        loop: true,
        vertical: true,
        slideChanged(s) {
            setCurrentSlide(s.track.details.rel);
        },
        created(s) {
            setCurrentSlide(s.track.details.rel);
        },
    });

    useEffect(() => {
        if (!slider) return;
        sliderInterval.current = setInterval(() => {
            slider.current?.next();
        }, 3000);

        return () => clearInterval(sliderInterval.current);
    }, [slider]);

    const itemCount = circleItems.length - 1;
    const itemAngle = 360 / itemCount;
    // const angleOffset = -itemAngle * currentSlide;

    const anglePerItem = 360 / (circleItems.length - 1);
    const angleOffset =
        window.innerWidth >= 1280 && lang === "fa"
            ? 180 - anglePerItem * currentSlide
            : window.innerWidth >= 1280 && lang === "en"
            ? 1 - anglePerItem * currentSlide
            : 180 - anglePerItem * currentSlide;

    useEffect(() => {
        const handleResize = () => {
            setRadius(
                window.innerWidth >= 1280
                    ? 240
                    : window.innerWidth >= 768
                    ? 180
                    : window.innerWidth >= 475
                    ? 100
                    : 80
            );
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 1000, // مدت زمان انیمیشن‌ها (ms)
            once: true, // فقط یک بار هنگام scroll ظاهر بشه
        });
    }, []);

    return (
        <AppLayout auth={auth} headerData={headerData}>
            <div>
                <Head title="Ariyabod Companies Group" />

                <>
                    <div
                        className={`h-[780px] bg-[#97c3b9] bg-cover bg-center ${
                            headerData && headerData.status
                                ? "pt-[80px]"
                                : "pt-[10px]"
                        }`}
                        // style={{
                        //     backgroundImage: `url("/images/ChatGPT%20Image%20May%2012,%202025,%2010_08_55%20AM%20(3).png")`,
                        // }}
                    >
                        {/* main content */}
                        <div
                            className={`flex flex-col-reverse  pt-20 pb-10 md2:pt-0 md2:pb-0 md2:flex-row items-center h-full w-full ${
                                lang !== "en"
                                    ? "md2:pr-[68px]"
                                    : "md2:pl-[68px]"
                            } gap-4`}
                        >
                            <div className="flex items-center h-full ">
                                <div
                                    id="circle"
                                    className="dashed-circle relative"
                                >
                                    <svg
                                        className="absolute"
                                        width="100%"
                                        height="100%"
                                        viewBox="0 0 590 590"
                                    >
                                        <circle
                                            cx="295"
                                            cy="295"
                                            r="285"
                                            fill="none"
                                            stroke="black"
                                            strokeWidth="4"
                                        />
                                    </svg>

                                    <div className="bg-[#428b7c] rounded-full w-[130px] h-[130px] xs2:w-[180px] xs2:h-[180px] md:w-[300px] md:h-[300px] xl:w-[460px] xl:h-[460px] absolute top-0 left-0 bottom-0 right-0 m-auto flex items-center justify-center">
                                        {circleItems.length && (
                                            <img
                                                src={
                                                    circleItems.find(
                                                        (item) =>
                                                            item.order === 0
                                                    ).image
                                                }
                                                alt="logo"
                                                className="w-2/3 mb-6 ml-2"
                                            />
                                        )}
                                    </div>

                                    {/* دایره‌های چرخان */}
                                    <div
                                        className="orbit absolute top-0 left-0 w-full h-full z-20"
                                        style={{
                                            transform: `rotate(${angleOffset}deg)`,
                                            transition:
                                                "transform 1s ease-in-out",
                                        }}
                                    >
                                        {circleItems &&
                                            circleItems
                                                .slice(1)
                                                .sort(
                                                    (a, b) => a.order - b.order
                                                )
                                                .map((item, i) => {
                                                    const angle = itemAngle * i;
                                                    const x =
                                                        radius *
                                                        Math.cos(
                                                            (angle * Math.PI) /
                                                                180
                                                        );
                                                    const y =
                                                        radius *
                                                        Math.sin(
                                                            (angle * Math.PI) /
                                                                180
                                                        );

                                                    return (
                                                        <div
                                                            key={i + 1}
                                                            className="circle-item w-[60px] h-[60px] xs2:w-[85px] xs2:h-[85px] md:w-[120px] md:h-[120px] xl:w-[150px] xl:h-[150px] bg-[#1eecc3] rounded-full flex items-center justify-center text-center"
                                                            style={{
                                                                "--x": `${x}px`,
                                                                "--y": `${y}px`,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    height: "100%",
                                                                    width: "100%",
                                                                    transformOrigin:
                                                                        "center center",
                                                                    // direction: "rtl",
                                                                    transform: `rotate(${-angleOffset}deg)`,
                                                                    transition:
                                                                        "transform 1s ease-in-out",
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        item.image
                                                                    }
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                    className="w-[60px] md:w-[80px] xl:w-[130px] object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                    </div>
                                </div>
                            </div>

                            {/* اسلایدر سمت راست */}
                            <div className="w-full px-4 sm:px-0">
                                <div className="flex flex-col items-center">
                                    <div
                                        ref={sliderRef}
                                        className="keen-slider"
                                        style={{ height: 200 }}
                                    >
                                        {circleItems
                                            .sort((a, b) => a.order - b.order)
                                            .slice(1)
                                            .map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={`keen-slider__slide number-slide${
                                                        index + 1
                                                    } flex items-center justify-center`}
                                                >
                                                    <p
                                                        className="text-2xl xs2:text-3xl  font-semibold text-center text-white w-auto xs2:w-[550px] md2:w-[400px] lg1:w-[650px]"
                                                        style={{
                                                            textShadow:
                                                                "2px 2px 4px rgba(0, 0, 0, 0.5)",
                                                        }}
                                                    >
                                                        {item.title[lang]}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="flex justify-center mt-4  md2:mb-0 sm:mb-20">
                                        {circleItems.slice(1).map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (slider.current) {
                                                        slider.current.moveToIdx(
                                                            idx
                                                        );
                                                    }
                                                }}
                                                className={`h-3 w-3 hover:bg-[#87edd9] rounded-full mx-1 ${
                                                    currentSlide === idx
                                                        ? " primary"
                                                        : "bg-white"
                                                }`}
                                            ></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- curved-div --> */}
                    <div className="rotate-180">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            xmlns:svgjs="http://svgjs.com/svgjs"
                            width="100%"
                            height="250"
                            preserveAspectRatio="none"
                            viewBox="0 0 1440 153"
                        >
                            <g mask='url("#SvgjsMask1060")' fill="none">
                                <path
                                    d="M 0,50 C 96,59 288,98.2 480,95 C 672,91.8 768,29.4 960,34 C 1152,38.6 1344,101.2 1440,118L1440 153L0 153z"
                                    fill="#97c3b9"
                                ></path>
                            </g>
                            <defs>
                                <mask id="SvgjsMask1060">
                                    <rect
                                        width="1440"
                                        height="153"
                                        fill="#ffffff"
                                    ></rect>
                                </mask>
                            </defs>
                        </svg>
                    </div>
                    {/* second content */}
                    <div id="SecondContent" className="py-10 pt-6">
                        <h1 className="text-4xl px-4 font-semibold text-center border-b-2 mx-4 mb-4 pb-6">
                            {t("service_items.title")}
                        </h1>
                        <div className="grid px-4 pb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {servicesItems &&
                                servicesItems.map((item, index) => (
                                    <div
                                        key={index}
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                    >
                                        <div className="rounded-full flex flex-col items-center justify-center mb-4">
                                            <img
                                                src={item.image}
                                                alt={item.title[lang]}
                                                className="w-[200px] h-[200px] object-contain rounded-full"
                                            />
                                        </div>
                                        <h1 className="text-2xl text-center">
                                            {item.title[lang]}
                                        </h1>
                                        <p className="text-center">
                                            {item.description[lang]}
                                        </p>
                                    </div>
                                ))}
                        </div>

                        {/* Internet Packages Section */}
                        <div className="bg-gray-50 px-4 py-10">
                            <div className="">
                                {/* <h1 className="text-2xl font-semibold text-center border-b-2 mx-4 mb-8 pb-2">
                                    بسته های اینترنتی
                                </h1> */}

                                {/* Tabs */}
                                <div className="flex flex-wrap justify-center mb-8 gap-2">
                                    {tabTypes.map((tab, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveTab(index)}
                                            className={`px-4 py-2 rounded-md transition-all ${
                                                activeTab === index
                                                    ? "bg-[#428b7c] text-white font-medium"
                                                    : "bg-gray-100 hover:bg-gray-200"
                                            }`}
                                        >
                                            {tab.title}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                {tabTypes.map((tab, tabIndex) => (
                                    <div
                                        key={tabIndex}
                                        className={
                                            activeTab === tabIndex
                                                ? "block"
                                                : "hidden"
                                        }
                                    >
                                        <h1 className="text-3xl font-semibold text-center mx-4 mb-10 mt-14 pb-2 primary-color">
                                            {t(`internet_packages.${tab.key}`)}
                                        </h1>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {getFilteredPackages(tab.key)
                                                .slice(0, 4)
                                                .map((pkg, index) => (
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
                                                                {
                                                                    pkg.title[
                                                                        lang
                                                                    ]
                                                                }
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
                                                                        ) ||
                                                                            pkg.type}
                                                                    </span>
                                                                </div>

                                                                {/* Show province */}
                                                                {pkg.provinces &&
                                                                    Array.isArray(
                                                                        pkg.provinces
                                                                    ) &&
                                                                    pkg
                                                                        .provinces
                                                                        .length >
                                                                        0 && (
                                                                        <div className="flex items-center gap-2 mt-4 pt-2">
                                                                            <span className="text-gray-600">
                                                                                <GrMapLocation className="primary-color text-lg" />
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

                                                                {/* Duration */}
                                                                {pkg.duration_days && (
                                                                    <div className="flex gap-2">
                                                                        <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                                            <FaCheck className="text-white text-[15px]" />
                                                                        </div>
                                                                        <span>
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
                                                                    <div className="flex gap-2">
                                                                        <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                                            <FaCheck className="text-white text-[15px]" />
                                                                        </div>
                                                                        <span>
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
                                                                    <div className="flex gap-2">
                                                                        <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                                            <FaCheck className="text-white text-[15px]" />
                                                                        </div>
                                                                        <span>
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
                                                                    <div className="flex gap-2">
                                                                        <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                                            <FaCheck className="text-white text-[15px]" />
                                                                        </div>
                                                                        <span>
                                                                            {
                                                                                pkg.speed_mb
                                                                            }{" "}
                                                                            {t(
                                                                                "internet_packages.mb_speed"
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {/* Speed Slots for Unlimited packages */}
                                                                {pkg.type ===
                                                                    "unlimited" &&
                                                                    pkg.speed_slots &&
                                                                    Object.keys(
                                                                        pkg.speed_slots
                                                                    ).length >
                                                                        0 && (
                                                                        <div className="space-y-3">
                                                                            {Object.entries(
                                                                                pkg.speed_slots
                                                                            ).map(
                                                                                (
                                                                                    [
                                                                                        key,
                                                                                        slot,
                                                                                    ],
                                                                                    idx
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            idx
                                                                                        }
                                                                                        className="flex gap-2 text-sm"
                                                                                    >
                                                                                        <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                                                            <FaCheck className="text-white text-[15px]" />
                                                                                        </div>
                                                                                        <div className="flex gap-1 items-center">
                                                                                            {
                                                                                                "( "
                                                                                            }
                                                                                            {slot.from ||
                                                                                                ""}{" "}
                                                                                            <span className="text-gray-600">
                                                                                                -
                                                                                            </span>
                                                                                            {slot.to ||
                                                                                                ""}
                                                                                            {
                                                                                                " )"
                                                                                            }
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
                                                                                {
                                                                                    "("
                                                                                }
                                                                                {formatTime(
                                                                                    pkg.night_free_start_time
                                                                                )}
                                                                                <span className="text-gray-600">
                                                                                    -
                                                                                </span>{" "}
                                                                                {formatTime(
                                                                                    pkg.night_free_end_time
                                                                                )}
                                                                                {
                                                                                    ")"
                                                                                }
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

                                        <div className="mt-8 text-center">
                                            <Link
                                                href={`/packages`}
                                                className="px-6 py-2 bg-[#428b7c] text-white rounded-full hover:bg-[#357a6c] transition"
                                            >
                                                {t(
                                                    "internet_packages.view_all"
                                                )}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* <!-- curved-div --> */}
                        <div className="rotate-180">
                            <svg
                                class="packages_svg"
                                xmlns="http://www.w3.org/2000/svg"
                                version="1.1"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                xmlns:svgjs="http://svgjs.com/svgjs"
                                width="100%"
                                height="100"
                                preserveAspectRatio="none"
                                viewBox="0 0 1440 100"
                            >
                                <g mask='url("#SvgjsMask1071")' fill="none">
                                    <path
                                        d="M 0,40 C 96,50 288,90.2 480,90 C 672,89.8 768,43 960,39 C 1152,35 1344,63.8 1440,70L1440 100L0 100z"
                                        fill="#f7f9fc"
                                    ></path>
                                </g>
                                <defs>
                                    <mask id="SvgjsMask1071">
                                        <rect
                                            width="1440"
                                            height="100"
                                            fill="#ffffff"
                                        ></rect>
                                    </mask>
                                </defs>
                            </svg>
                        </div>

                        {/* about us section */}
                        <div className="flex flex-col md:flex-row gap-4 px-4">
                            <div className=" md:min-w-[383px] md:h-[280px] px-6">
                                <img
                                    src="/images/about.png"
                                    alt="about us"
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-2xl font-bold">
                                    درباره ما
                                </h1>
                                <p>
                                    گروپ کمپنی های آریابُد یک شرکت منطقه ای واقع
                                    در شهر هرات، افغانستان میباشد. که نخستین
                                    فعالیت های خویش را درسال 2019 میلادی در بخش
                                    خدمات تبلیغاتی که خود آغازنموده، و در ابتدای
                                    سال 2020 میلادی به منظور ارائه خدمات بهتر و
                                    بروزتر در زمینه خدمات تکنولوژی (ICT) فعالیت
                                    های خود را گسترش داد. تیم آریابُد فعالیت های
                                    خودرا در بخش تبلیغاتی که شامل طراحی،
                                    برندسازی ، مدیریت صفحات اجتماعی، ست اداری، و
                                    چاپ و در بخش تکنالوژی که شامل نصب دوربین های
                                    امنیتی،دامنه و میزبانی، انتقال تصویر،حاضری
                                    های آنلاین، قفل های الکترونیکی و مشاوره و
                                    راه اندازی سیستم ها و شبکه های هوشمند و در
                                    بخش خدمات انترنتی که شامل وایرلس، مایکرویو،
                                    و اینترنت ماهواره ای با خدمات استاندارد و
                                    معیاری تحت بروزترین پروتکل های امنیتی شبکه
                                    میباشد،
                                </p>
                            </div>
                        </div>

                        <div className="px-4 bg-gray-50 mt-20">
                            <h1 className="text-4xl font-semibold w-full text-center py-10">
                                ابزار ها
                            </h1>
                            <div>

                            </div>
                        </div>
                    </div>
                </>
            </div>
        </AppLayout>
    );
}
const WheelControls = (slider) => {
    let touchTimeout;
    let position;
    let wheelActive;

    function dispatch(e, name) {
        position.x -= e.deltaX;
        position.y -= e.deltaY;
        slider.container.dispatchEvent(
            new CustomEvent(name, {
                detail: {
                    x: position.x,
                    y: position.y,
                },
            })
        );
    }

    function wheelStart(e) {
        position = {
            x: e.pageX,
            y: e.pageY,
        };
        dispatch(e, "ksDragStart");
    }

    function wheel(e) {
        dispatch(e, "ksDrag");
    }

    function wheelEnd(e) {
        dispatch(e, "ksDragEnd");
    }

    function eventWheel(e) {
        e.preventDefault();
        if (!wheelActive) {
            wheelStart(e);
            wheelActive = true;
        }
        wheel(e);
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            wheelActive = false;
            wheelEnd(e);
        }, 50);
    }

    slider.on("created", () => {
        slider.container.addEventListener("wheel", eventWheel, {
            passive: false,
        });
    });
};
