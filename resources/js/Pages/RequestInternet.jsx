import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { toast } from "react-hot-toast";

export default function RequestInternet({ headerData, footerData }) {
    const { t } = useTranslation();
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
    });

    useEffect(() => {
        if (flash && flash.success) {
            setShowSuccess(true);
            toast.success(flash.success);
            setTimeout(() => {
                setShowSuccess(false);
            }, 5000); // Hide after 5 seconds
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Show immediate toast notification
        const toastId = toast.loading("درخواست شما در حال ارسال است...");

        post(route("request-internet.submit"), {
            onSuccess: () => {
                reset();
                toast.success("درخواست شما با موفقیت ارسال شد", { id: toastId });
                setIsSubmitting(false);
            },
            onError: () => {
                toast.error("خطا در ارسال درخواست. لطفاً دوباره تلاش کنید", { id: toastId });
                setIsSubmitting(false);
            },
            // This allows the user to navigate away while the request is processing
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout headerData={headerData} footerData={footerData}>
            <Head title="درخواست انترنت" />

            <div className="mx-auto px-4 py-16 pt-24 text-center bg-gray-100 mb-10 large-rounded">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h2 className="text-2xl font-bold text-start text-gray-900 mb-2">
                            درخواست انترنت
                        </h2>

                        <div className="mb-6 text-start">
                            <p className="text-gray-600">
                                مشتری عزیز بعد از دریافت پیام و بررسی موقعیت
                                شما، با شما تماس گرفته میشود.
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
                                {Object.values(errors).map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    placeholder="اسم شما"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
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
                                    placeholder="تخلص شما"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
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
                                    placeholder="شماره تلفن شما"
                                    value={data.phone_number}
                                    onChange={(e) =>
                                        setData("phone_number", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <textarea
                                    id="address"
                                    name="address"
                                    placeholder="آدرس شما"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
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
                                    disabled={processing || isSubmitting}
                                >
                                    {(processing || isSubmitting) ? "در حال ارسال..." : "ارسال"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
