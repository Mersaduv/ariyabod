import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "react-hot-toast";

export default function AppLayout({ children, auth = {}, headerData, footerData }) {
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
        <div className="min-h-screen flex flex-col">
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        direction: i18n.language === "fa" || i18n.language === "ps" ? "rtl" : "ltr",
                    },
                }}
            />
            <div className="fixed top-0 left-0 right-0 z-50">
                {headerData && headerData.status && (
                    <div className="relative h-10">
                        <div
                            className="text-lg font-bold absolute top-1 mx-auto left-0 right-0 text-center"
                            style={{ color: headerData.header_color || "#000" }}
                        >
                            {headerData.header_text}
                        </div>
                        {headerData.header_logo && (
                            <img
                                src={headerData.header_logo}
                                alt="لوگو"
                                className="h-full max-h-10 w-full object-cover"
                            />
                        )}
                    </div>
                )}

                <Header auth={auth} />
            </div>

            <main className={`flex-1 ${headerData && headerData.status ? "pt-[40px]" : ""}`}>{children}</main>

            <Footer footerData={footerData} />
        </div>
    );
}
