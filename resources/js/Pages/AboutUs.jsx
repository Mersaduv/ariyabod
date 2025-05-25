import React from "react";
import { useTranslation } from "react-i18next";
import AppLayout from "../Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

const AboutUs = ({ headerData, footerData }) => {
    const { t } = useTranslation();
    return (
        <AppLayout headerData={headerData} footerData={footerData}>
            <Head title={t("nav.aboutUs")} />

            <div className="mb-10">
                <div className="mx-auto px-4 py-16 pt-24 text-center bg-gray-50">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                        <h1 className="text-2xl font-bold py-10">{t("nav.aboutUs")}</h1>
                        <div className="flex flex-col md:flex-row gap-4 px-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-start">
                                    {t("about_us.main_description")}
                                </p>
                                <div className="space-y-8 mt-4">
                                    <p className="text-start">
                                        <span className="font-bold">
                                            {t("about_us.advertising_services.title")}
                                        </span>{" "}
                                        {t("about_us.advertising_services.description")}
                                    </p>

                                    <p className="text-start">
                                        <span className="font-bold">
                                            {t("about_us.ict_services.title")}
                                        </span>{" "}
                                        {t("about_us.ict_services.description")}
                                    </p>

                                    <p className="text-start">
                                        <span className="font-bold">
                                            {t("about_us.isp_services.title")}
                                        </span>{" "}
                                        {t("about_us.isp_services.description")}
                                    </p>
                                </div>
                            </div>
                            <div className=" md:min-w-[430px] md:h-[334px]">
                                <img
                                    src="/images/about.png"
                                    alt={t("about_us.image_alt")}
                                    className="w-full h-full rounded-lg object-contain"
                                />
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
            </div>
        </AppLayout>
    );
};

export default AboutUs;
