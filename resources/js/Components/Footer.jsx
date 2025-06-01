import { IoLocationSharp, IoPhonePortrait } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";

import { useTranslation } from "react-i18next";

export default function Footer({ footerData }) {
    const { t, i18n } = useTranslation();
    const currentYear = new Date().getFullYear();
    const persianYear = currentYear - 621;

    const currentLang = i18n.language || "fa";

    // Set default empty data if footerData is not provided
    const addresses = footerData?.addresses?.[currentLang] || [];
    const contactNumbers = footerData?.contact_numbers || [];

    // Get social media items with titles in the current language
    const socialMedia = footerData?.social_media || [];

    return (
        <footer className="bg-gray-100 text-center h-auto min-h-[397px] py-[80px]">
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center h-full">
                <div className="">
                    <img
                        src={"/images/logo.png"}
                        alt={t("footer.company_name")}
                        className="inline-block w-[250px] mr-2"
                    />
                </div>

                {addresses.length > 0 && (
                    <div className="my-6">
                        {addresses.map((address, index) => (
                            <div
                                key={`address-${index}`}
                                className="text-sm text-gray-600 flex gap-1 mb-2"
                            >
                                {index === 0 && (
                                    <div className="flex items-start gap-0.5 text-black font-semibold">
                                        <IoLocationSharp className="text-lg" />
                                        <div className="whitespace-nowrap">
                                            {t("footer.address_label")}
                                        </div>
                                    </div>
                                )}
                                {index === 0 ? ` ${address}` : address}
                            </div>
                        ))}
                    </div>
                )}

                {contactNumbers.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-1 justify-center">
                        <div className="font-semibold flex items-center text-sm gap-1">
                            <BsFillTelephoneFill />
                            {t("footer.contact_numbers_label")}:
                        </div>
                        <div className="text-sm text-gray-600">
                            {contactNumbers.join(" | ")}
                        </div>
                    </div>
                )}

                {/* Social Media Links */}
                {socialMedia.length > 0 && (
                    <div className="flex justify-center gap-6 mb-8 flex-wrap">
                        {socialMedia.map((item, index) => (
                            <a
                                key={`social-${index}`}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-500 hover:text-blue-700 text-sm gap-1"
                            >
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.title?.[currentLang] || ""}
                                        className="w-5 mr-1"
                                    />
                                )}
                                {item.title?.[currentLang] || ""}
                            </a>
                        ))}
                    </div>
                )}

                <div>
                    <div dir="ltr" className="text-sm text-gray-500 flex gap-2">
                        <div>
                            © Copyright {persianYear} - {currentYear}
                        </div>{" "}
                        | <div className="text-black font-medium">Ariyabod</div>{" "}
                        | <div>{t("footer.all_rights_reserved")}</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
