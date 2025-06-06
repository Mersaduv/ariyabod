import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function Login({
    status,
    canResetPassword,
    headerData,
    footerData,
}) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <GuestLayout headerData={headerData} footerData={footerData}>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <div className="w-full mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <h2 className="mb-5 font-semibold">{t("login_title")}</h2>{" "}
                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="email" value={t("email")} />{" "}
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value={t("password")} />{" "}
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="block mt-4">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                {t("remember_me")}
                            </span>{" "}
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {t("forgot_password")}
                            </Link>
                        )}

                        <PrimaryButton className="ms-4" disabled={processing}>
                            {t("login")}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
            <div className="flex items-center justify-start gap-1 w-full sm:max-w-md my-2 mr-2">
                <div className="text-sm text-gray-600">
                    {t("dont_have_account")}
                </div>{" "}
                <Link
                    href={route("register")}
                    className="primary-color text-sm font-bold underline"
                >
                    {t("register")}
                </Link>
            </div>
        </GuestLayout>
    );
}
