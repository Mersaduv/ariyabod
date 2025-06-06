import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Register({ headerData, footerData }) {
    const { t } = useTranslation();
    const recaptchaRef = useRef(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        recaptcha: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation", "recaptcha");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    const handleRecaptchaChange = (value) => {
        setData("recaptcha", value);
    };

    // Important: Replace 'YOUR_RECAPTCHA_SITE_KEY' with your actual Google reCAPTCHA site key
    // Add RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY to your .env file
    const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "YOUR_RECAPTCHA_SITE_KEY";

    return (
        <GuestLayout headerData={headerData} footerData={footerData}>
            <Head title="Register" />

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <h2 className="mb-5 font-semibold">{t("register_title")}</h2>
                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="name" value={t("name")} />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value={t("email")} />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value={t("password")} />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData("password", e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value={t("confirm_password")}
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={recaptchaSiteKey}
                            onChange={handleRecaptchaChange}
                        />
                        <InputError message={errors.recaptcha} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <PrimaryButton className="ms-4" disabled={processing}>
                            {t("register")}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
            <div className="flex items-center justify-start gap-1 w-full sm:max-w-md my-2 mr-2">
                <div className="text-sm text-gray-600">{t("have_account")}</div>
                <Link
                    href={route("login")}
                    className="primary-color text-sm font-bold underline"
                >
                    {t("login")}
                </Link>
            </div>
        </GuestLayout>
    );
}
