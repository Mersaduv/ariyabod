import { Link, Head } from "@inertiajs/react";
import AppLayoutSwitcher from "../Layouts/AppLayoutSwitcher";
import { useTranslation } from "react-i18next";
import React, {
    useState,
    useEffect,
    useMemo,
    lazy,
    memo,
    useCallback,
    useRef,
} from "react";
import { FaCheck } from "react-icons/fa6";

import "aos/dist/aos.css";
import "keen-slider/keen-slider.min.css";
import { GrMapLocation } from "react-icons/gr";
import { formatTimeToHumanReadable, formatTime } from "@/Utils/functions";
import { useKeenSlider } from "keen-slider/react";

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

// Lazy load heavy components
const AOS = lazy(() => import("aos"));

const ServiceItem = memo(({ item, index, lang }) => (
    <div
        className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all border border-gray-100"
        data-aos="fade-up"
        data-aos-delay={index * 100}
    >
        <div className="flex justify-center mb-6">
            <img
                src={item.image}
                alt={item.title[lang]}
                className="w-20 h-20 object-contain"
                loading="lazy"
                decoding="async"
            />
        </div>
        <h3 className="text-xl font-semibold text-center mb-3">
            {item.title[lang]}
        </h3>
        <p className="text-gray-600 text-center">{item.description[lang]}</p>
    </div>
));

export default memo(function Welcome({
    auth,
    headerData,
    footerData,
    circleItems,
    servicesItems,
    internetPackages,
    provinces,
}) {
    const { t } = useTranslation();
    const [lang, setLang] = useState(() =>
        typeof window !== "undefined"
            ? localStorage.getItem("lang") || "fa"
            : "fa"
    );
    const [activeTab, setActiveTab] = useState(0);
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
    const [aosLoaded, setAosLoaded] = useState(false);
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
    // Memoized values
    const tabTypes = useMemo(
        () => [
            { key: "volume_fixed", title: t("internet_packages.volume_fixed") },
            { key: "volume_daily", title: t("internet_packages.volume_daily") },
            {
                key: "unlimited_home",
                title: t("internet_packages.unlimited_home"),
            },
        ],
        [t]
    );

    const filteredPackages = useMemo(() => {
        const type = tabTypes[activeTab]?.key;
        if (type === "unlimited_home") {
            return internetPackages.filter((pkg) => pkg.type === "unlimited");
        }
        return internetPackages.filter((pkg) => pkg.type === type);
    }, [activeTab, internetPackages, tabTypes]);

    // Effects
    useEffect(() => {
        const storedLang = localStorage.getItem("lang") || "fa";
        setLang(storedLang);
    }, [localStorage.getItem("lang")]);

    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            window.innerWidth > 768 &&
            !aosLoaded
        ) {
            import("aos").then((AOS) => {
                AOS.default.init({ duration: 1000, once: true });
                setAosLoaded(true);
            });
        }
    }, [aosLoaded]);

    // Refresh AOS animations when language changes
    useEffect(() => {
        if (aosLoaded && typeof window !== "undefined") {
            import("aos").then((AOS) => {
                AOS.default.refresh();
            });
        }
    }, [lang, aosLoaded]);

    return (
        <AppLayoutSwitcher
            auth={auth}
            footerData={footerData}
            servicesItems={servicesItems}
        >
            <div>
                <Head title="Ariyabod Companies Group" />

                {/* Slider Section */}
                <div
                    className={`h-[780px]  bg-[#97c3b9] bg-cover bg-center ${
                        headerData && headerData.status
                            ? "pt-[80px]"
                            : "-mt-[30px]"
                    }`}
                    // style={{
                    //     backgroundImage: `url("/images/ChatGPT%20Image%20May%2012,%202025,%2010_08_55%20AM%20(3).png")`,
                    // }}
                >
                    {/* main content */}
                    <div
                        className={`flex flex-col-reverse  pt-20 pb-10 md2:pt-0 md2:pb-0 md2:flex-row items-center h-full w-full ${
                            lang !== "en" ? "md2:pr-[68px]" : "md2:pl-[68px]"
                        } gap-4`}
                    >
                        <div className="flex items-center h-full ">
                            <div id="circle" className="dashed-circle relative">
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
                                                    (item) => item.order === 0
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
                                        transition: "transform 1s ease-in-out",
                                    }}
                                >
                                    {circleItems &&
                                        circleItems
                                            .sort((a, b) => a.order - b.order)
                                            .filter((item) => item.status == 1)
                                            .slice(1)
                                            .map((item, i) => {
                                                const angle = itemAngle * i;
                                                const x =
                                                    radius *
                                                    Math.cos(
                                                        (angle * Math.PI) / 180
                                                    );
                                                const y =
                                                    radius *
                                                    Math.sin(
                                                        (angle * Math.PI) / 180
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
                                                                display: "flex",
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
                                                                src={item.image}
                                                                alt={item.title}
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
                                        .filter((item) => item.status == 1)
                                        .slice(1)
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                className={`keen-slider__slide number-slide${
                                                    index + 1
                                                } flex items-center justify-center`}
                                            >
                                                <p
                                                    className="text-2xl xs2:text-3xl  font-semibold text-center text-white w-auto xs2:w-[550px] md2:w-[400px] lg1:w-[550px] lg3:w-[650px]"
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
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        xmlns:svgjs="http://svgjs.com/svgjs"
                        width="100%"
                        height="250"
                        preserveAspectRatio="none"
                        viewBox="0 0 1440 153"
                    >
                        <g mask='url("#SvgjsMask1060")' fill="#97c3b9">
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

                {/* Services Section */}
                <div id="ServicesSection" className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                {t("service_items.title")}
                            </h2>
                            <div className="w-24 h-1 bg-[#428b7c] mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {servicesItems?.map((item, index) => (
                                <ServiceItem
                                    key={item.id || index}
                                    item={item}
                                    index={index}
                                    lang={lang}
                                />
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
                                                            Array.isArray(
                                                                pkg.provinces
                                                            ) &&
                                                            pkg.provinces
                                                                .length > 0 && (
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
                                                                <div className="flex gap-2">
                                                                    <div className="bg-[#428b7c] border border-[#428b7c] w-5 h-5 rounded flex items-center justify-center">
                                                                        <FaCheck className="text-white text-[15px]" />
                                                                    </div>
                                                                    <span>
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

                                                        {/* Speed Slots for Unlimited packages */}
                                                        {pkg.type ===
                                                            "unlimited" &&
                                                            pkg.speed_slots &&
                                                            Object.keys(
                                                                pkg.speed_slots
                                                            ).length > 0 && (
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
                                                                                    <span>
                                                                                        {t(
                                                                                            "internet_packages.from"
                                                                                        )}{" "}
                                                                                        {formatTimeToHumanReadable(
                                                                                            slot.from
                                                                                        )}{" "}
                                                                                        {t(
                                                                                            "internet_packages.to"
                                                                                        )}{" "}
                                                                                        {formatTimeToHumanReadable(
                                                                                            slot.to
                                                                                        )}{" "}
                                                                                        {formatSpeed(
                                                                                            slot.speed_mb,
                                                                                            t,
                                                                                            lang
                                                                                        )}
                                                                                    </span>
                                                                                </div>
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
                                                                    <span className="text-sm">
                                                                        {t(
                                                                            "internet_packages.from"
                                                                        )}{" "}
                                                                        {formatTimeToHumanReadable(
                                                                            formatTime(
                                                                                pkg.night_free_start_time
                                                                            )
                                                                        )}{" "}
                                                                        {t(
                                                                            "internet_packages.to"
                                                                        )}{" "}
                                                                        {formatTimeToHumanReadable(
                                                                            formatTime(
                                                                                pkg.night_free_end_time
                                                                            )
                                                                        )}{" "}
                                                                        {pkg.is_night_free
                                                                            ? t(
                                                                                  "internet_packages.free"
                                                                              )
                                                                            : formatSpeed(
                                                                                  pkg.night_free_speed_mb,
                                                                                  t,
                                                                                  lang
                                                                              )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
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
                <div className="rotate-180">
                    <svg
                        className="packages_svg"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
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

                {/* About Us Section */}
                <div className="py-16">
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

                <div className="bg-[#428b7c]">
                    {/* tools section */}
                    <div className="px-4 bg-gray-50 mt-20 pb-20">
                        <div className="text-center py-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                {t("tools.title")}
                            </h2>
                            <div className="w-24 h-1 bg-[#428b7c] mx-auto"></div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6  max-w-screen-lg2 mx-auto">
                            <div
                                className="tools-item  bg-white"
                                style={{ "--c": "#428b7c" }}
                            >
                                <img
                                    className="w-full h-[250px] object-contain bg-white"
                                    src="/images/orgtest.png"
                                    alt=""
                                />
                                <div className="p-4">
                                    <h2 className="text-xl text-center font-bold mb-3 text-primary">
                                        {t("network_test.about_title")}
                                    </h2>
                                    <p className="mb-4">
                                        {t("network_test.description_long")}
                                    </p>
                                    <div className="flex justify-center mt-4">
                                        <Link
                                            href="/network-test"
                                            className="px-6 py-2 bg-[#428b7c] text-white rounded-full hover:bg-[#357a6c] transition"
                                        >
                                            {t("view")}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tools-item  bg-white"
                                style={{ "--c": "#428b7c" }}
                            >
                                <img
                                    className="w-full h-[250px] object-contain bg-white"
                                    src="/images/bubdle.png"
                                    alt=""
                                />
                                <div className="p-4">
                                    <h2 className="text-xl text-center font-bold mb-3 text-primary">
                                        {t("calculator.title")}
                                    </h2>
                                    <p className="mb-4">
                                        {t("calculator.description")}
                                    </p>
                                    <div className="flex justify-center mt-4">
                                        <Link
                                            href="/calculate-bundle"
                                            className="px-6 py-2 bg-[#428b7c] text-white rounded-full hover:bg-[#357a6c] transition"
                                        >
                                            {t("view")}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tools-item  bg-white"
                                style={{ "--c": "#428b7c" }}
                            >
                                <img
                                    className="w-full h-[250px] object-contain bg-white"
                                    src="/images/width-band.png"
                                    alt=""
                                />
                                <div className="p-4">
                                    <h2 className="text-xl text-center font-bold mb-3 text-primary">
                                        {t("calculator.bandwidth_calculator")}
                                    </h2>
                                    <p className="mb-4">
                                        {t("calculator.note_p2")}
                                    </p>
                                    <div className="flex justify-center mt-4">
                                        <Link
                                            href="/bandwidth-calculator"
                                            className="px-6 py-2 bg-[#428b7c] text-white rounded-full hover:bg-[#357a6c] transition"
                                        >
                                            {t("view")}
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="tools-item  bg-white"
                                style={{ "--c": "#428b7c" }}
                            >
                                <img
                                    className="w-full h-[250px] object-contain bg-white"
                                    src="/images/internet-req.png"
                                    alt=""
                                />
                                <div className="p-4">
                                    <h2 className="text-xl text-center font-bold mb-3 text-primary">
                                        {t("request_internet.title")}
                                    </h2>
                                    <p className="mb-4">
                                        {t("request_internet.note_p1")}
                                    </p>
                                    <div className="flex justify-center mt-4">
                                        <Link
                                            href="/request-internet"
                                            className="px-6 py-2 bg-[#428b7c] text-white rounded-full hover:bg-[#357a6c] transition"
                                        >
                                            {t("view")}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- curved-div --> */}
                    <div className="rotate-180">
                        <svg
                            className="packages_svg"
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
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
                            <a
                                href="http://user.ariyabod.af/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-white text-[#428b7c] rounded-full hover:bg-gray-100 transition font-medium"
                            >
                                {t("package_management.view_package_info")}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayoutSwitcher>
    );
});
