import { IoLocationSharp, IoPhonePortrait } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";

import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();
    const persianYear = currentYear - 621;

    return (
        <footer className="bg-gray-100 py-6 text-center h-[397px]">
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center h-full">
                <div className="">
                    <img
                        src={"/images/logo.png"}
                        alt={t("footer.company_name")}
                        className="inline-block w-[250px] mr-2"
                    />
                </div>

                <div className="my-6">
                    <div className="text-sm text-gray-600 flex gap-1">
                        <div className="flex items-start gap-0.5 text-black font-semibold">
                            <IoLocationSharp className="text-lg" />
                            <div className="whitespace-nowrap">
                                {t("footer.address_label")}
                            </div>
                        </div>{" "}
                        {t("footer.address")}
                    </div>
                </div>

                <div className="mb-6 flex gap-1">
                    <div className="font-semibold flex items-center text-sm gap-1">
                        <BsFillTelephoneFill />
                        {t("footer.contact_numbers_label")}:
                    </div>
                    <div className="text-sm text-gray-600 ">
                        {t("footer.phone_numbers")}
                    </div>
                </div>

                {/* شبکه‌های اجتماعی */}
                <div className="flex justify-center gap-6 mb-8">
                    <a
                        href="https://telegram.me/ariyabodisp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500 hover:text-blue-700 text-sm gap-1"
                    >
                        <img
                            src={"/icons/icons8-telegram.svg"}
                            alt={t("footer.telegram")}
                            className="w-5 mr-1"
                        />
                        {t("footer.telegram_channel")}
                    </a>
                    <a
                        href="https://instagram.com/ariyabodisp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500 hover:text-blue-700 text-sm gap-1"
                    >
                        <img
                            src={"/icons/icons8-telegram.svg"}
                            alt={t("footer.instagram")}
                            className="w-5 mr-1"
                        />
                        {t("footer.contact_admin")}
                    </a>
                </div>

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
