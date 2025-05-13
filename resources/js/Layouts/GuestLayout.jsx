import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import AppLayout from "./AppLayout";

export default function Guest({ children }) {
    return (
        <AppLayout>
            <div className="min-h-screen flex flex-col sm:justify-start items-center pt-4 sm:pt-24 bg-gray-50">
                <div className="mb-4">
                    <Link href="/">
                        <ApplicationLogo
                            className={"inline-block w-[250px] mr-2"}
                        />
                    </Link>
                </div>

                {/* <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg"> */}
                <div className="w-full sm:max-w-md">
                    {/* <h2 className="mb-5 font-semibold">ورود به حساب کاربری</h2> */}
                    {children}
                </div>
                {/* <div className="flex items-center justify-start gap-1 w-full  sm:max-w-md my-2 mr-2">
                    <div className="text-sm text-gray-600">ثبت نام نکردی؟</div>
                    <Link
                        href={route("register")}
                        className="primary-color text-sm font-bold underline"
                    >
                        ثبت نام
                    </Link>
                </div> */}
            </div>
        </AppLayout>
    );
}
