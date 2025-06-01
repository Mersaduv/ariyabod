import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes, FaUserAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { BiEnvelope, BiPhone } from "react-icons/bi";
import Footer from "@/Components/Footer";
import Dropdown from "@/Components/Dropdown";
import { IoIosArrowDown } from "react-icons/io";
import { AiTwotoneMail } from "react-icons/ai";
import HeaderV2 from "@/Components/HeaderV2";
import { Toaster } from "react-hot-toast";

export default function AppLayoutV2({
    auth,
    children,
    footerData,
    servicesItems,
}) {
    const { t } = useTranslation();
    const { url } = usePage();
    const { i18n } = useTranslation();
    useEffect(() => {
        const lang = i18n.language;
        const html = document.documentElement;

        html.lang = lang;
        html.dir = lang === "fa" || lang === "ps" ? "rtl" : "ltr";

        const isRtl = lang === "fa" || lang === "ps";
        document.body.classList.toggle("rtl", isRtl);
        document.body.classList.toggle("farsi-digits", isRtl);
    }, [i18n.language]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        direction:
                            i18n.language === "fa" || i18n.language === "ps"
                                ? "rtl"
                                : "ltr",
                    },
                }}
            />
            {/* Header */}
            <HeaderV2 auth={auth} servicesItems={servicesItems} />

            {/* Adjusted main content spacing based on headerData status */}
            <main className={`flex-1 pt-20`}>{children}</main>

            {/* Footer */}
            <Footer footerData={footerData} />
        </div>
    );
}
