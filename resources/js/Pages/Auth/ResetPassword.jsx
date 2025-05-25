import { useEffect, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

export default function ResetPassword({
    token,
    email,
    headerData,
    footerData,
}) {
    const { t, i18n } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            token: token,
            email: email,
            password: "",
            password_confirmation: "",
        });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    useEffect(() => {
        clearErrors();
    }, [i18n.language]);

    useEffect(() => {
        if (flash && flash.success) {
            setShowSuccess(true);
            toast.success(flash.success);
            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
        }
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const toastId = toast.loading("درحال بازیابی رمز عبور...");
        post(route("password.store"), {
            onSuccess: () => {
                reset();
                toast.success("رمز عبور با موفقیت بازیابی شد", {
                    id: toastId,
                });
                setIsSubmitting(false);
            },
            onError: () => {
                toast.error("خطا در بازیابی رمز عبور. لطفاً دوباره تلاش کنید", {
                    id: toastId,
                });
                setIsSubmitting(false);
            },
            preserveScroll: true,
        });
    };

    return (
        <GuestLayout headerData={headerData} footerData={footerData}>
            <Head title={t("reset_password.reset_password")} />

            <form  onSubmit={submit}>
                <div>
                    <InputLabel
                        htmlFor="email"
                        value={t("reset_password.email")}
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password"
                        value={t("reset_password.password")}
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={t("reset_password.confirm_password")}
                    />

                    <TextInput
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton
                        className="ms-4"
                        disabled={processing || isSubmitting}
                    >
                        {t("reset_password.reset_password")}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
