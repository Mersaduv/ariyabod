import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { usePage } from "@inertiajs/react";
import AppLayoutSwitcher from "@/Layouts/AppLayoutSwitcher";
import { toast } from "react-hot-toast";
import { IoLocationSharp } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";
import TextInput from "@/Components/TextInput";

export default function ContactUs({
    auth,
    headerData,
    footerData,
    servicesItems,
}) {
    const { t, i18n } = useTranslation();
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        message: "",
    });

    const currentLang = i18n.language || "fa";

    // Get addresses and contact numbers from footerData
    const addresses = footerData?.addresses?.[currentLang] || [];
    const contactNumbers = footerData?.contact_numbers?.[currentLang] || [];

    useEffect(() => {
        if (flash && flash.success) {
            setShowSuccess(true);
            toast.success(flash.success);
            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const toastId = toast.loading(t("contact_us.sending_message"));

        post(route("contact-us.submit"), {
            onSuccess: () => {
                reset();
                toast.success(t("contact_us.message_sent_success"), {
                    id: toastId,
                });
                setIsSubmitting(false);
            },
            onError: () => {
                toast.error(t("contact_us.message_sent_error"), {
                    id: toastId,
                });
                setIsSubmitting(false);
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayoutSwitcher
            auth={auth}
            headerData={headerData}
            footerData={footerData}
            servicesItems={servicesItems}
        >
            <Head title={t("nav.contactUs")} />

            <div className={`mb-10 ${"-mt-1.5 md1:pt-[30px]"} `}>
                {/* Google Map Section */}
                <div className="w-full h-[400px] relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d205.83078616704387!2d62.19507565368964!3d34.368478132041325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f3ce724f848d5a1%3A0xd09741257dd6953!2sAriyabod%20Companies%20Group!5e0!3m2!1sfa!2sus!4v1748070934735!5m2!1sfa!2sus"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* Main Content */}
                <div className="mx-auto px-4 py-16 text-center bg-gray-50">
                    <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-semibold mb-4">
                            {t("nav.contactUs")}
                        </h1>

                        {/* Contact Information */}
                        <p className="text-xl mb-1.5">
                            {t("contact_us.intro_text")}
                        </p>

                        {addresses.length > 0 && (
                            <div className="mb-2">
                                {addresses.map((address, index) => (
                                    <div
                                        key={`address-${index}`}
                                        className="flex justify-center text-base text-gray-600 gap-1 mb-1"
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
                            <div className="justify-center mb-6 flex gap-1">
                                <div className="font-semibold flex items-center text-base gap-1">
                                    <BsFillTelephoneFill />
                                    {t("footer.contact_numbers_label")}:
                                </div>
                                <div className="text-base text-gray-600">
                                    {contactNumbers.join(" | ")}
                                </div>
                            </div>
                        )}

                        {/* Contact Form */}
                        <div className="p-4 sm:p-8">
                            <h2 className="text-2xl font-bold text-start text-gray-900 mb-2">
                                {t("contact_us.form_title")}
                            </h2>

                            <div className="mb-6 text-start">
                                <p className="text-gray-600">
                                    {t("contact_us.form_description")}
                                </p>
                            </div>

                            {/* Display success message if exists */}
                            {showSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                                    <span className="block sm:inline">
                                        {flash.success}
                                    </span>
                                </div>
                            )}

                            {/* Display errors */}
                            {errors && Object.keys(errors).length > 0 && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                    {Object.values(errors).map(
                                        (error, index) => (
                                            <p key={index}>{error}</p>
                                        )
                                    )}
                                </div>
                            )}
                            <div className="flex md1:flex-row flex-col-reverse gap-2 w-full">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4 w-full md1:w-1/2"
                                >
                                    <div>
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            placeholder={t(
                                                "contact_us.first_name"
                                            )}
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData(
                                                    "first_name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            placeholder={t(
                                                "contact_us.last_name"
                                            )}
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    "last_name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <input
                                            id="phone_number"
                                            name="phone_number"
                                            type="text"
                                            placeholder={t(
                                                "contact_us.phone_number"
                                            )}
                                            value={data.phone_number}
                                            onChange={(e) =>
                                                setData(
                                                    "phone_number",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder={t("email")}
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <textarea
                                            id="message"
                                            name="message"
                                            placeholder={t(
                                                "contact_us.message"
                                            )}
                                            value={data.message}
                                            onChange={(e) =>
                                                setData(
                                                    "message",
                                                    e.target.value
                                                )
                                            }
                                            rows="4"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            className="px-8 py-2 bg-[#428b7c] text-white rounded-md hover:bg-[#5cae9e] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
                                            disabled={
                                                processing || isSubmitting
                                            }
                                        >
                                            {processing || isSubmitting
                                                ? t("contact_us.sending")
                                                : t("contact_us.send")}
                                        </button>
                                    </div>
                                </form>
                                <div className=" md1:min-w-[452px] md1:h-[371px] w-1/3">
                                    <img
                                        src="/images/contact2.png"
                                        alt={t("contact_us.image_alt")}
                                        className="w-full h-full rounded-lg object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curved div at bottom - same as in AboutUs page */}
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
        </AppLayoutSwitcher>
    );
}
