import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

export default function ForgotPassword({ headerData, footerData, status }) {
    const { t } = useTranslation();
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    useEffect(() => {
        if (flash && flash.success) {
            setShowSuccess(true);
            toast.success(flash.success);
        }
        setTimeout(() => {
            setShowSuccess(false);
        }, 5000);
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const toastId = toast.loading("درخواست شما در حال ارسال است...");
        post(route("password.email"), {
            onSuccess: () => {
                setShowSuccess(true);
                toast.success("ایمیل بازیابی رمز عبور با موفقیت ارسال شد", { id: toastId });
                setIsSubmitting(false);
            },
            onError: () => {
                toast.error("خطا در ارسال ایمیل بازیابی رمز عبور. لطفاً دوباره تلاش کنید", { id: toastId });
                setIsSubmitting(false);
            },
            preserveScroll: true,
        });
    };

    return (
        <GuestLayout headerData={headerData} footerData={footerData}>
            <Head title={t("forgot_password_p.title")} />

            <div className="mb-4 text-sm text-gray-600">
                {t("forgot_password_p.description")}
            </div>

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ms-4" disabled={processing || isSubmitting}>
                        {t("forgot_password_p.button")}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
