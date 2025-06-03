import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import AppLayoutSwitcher from "./AppLayoutSwitcher";

export default function Guest({ children, headerData, footerData, servicesItems }) {
    const { url } = usePage();

    return (
        <AppLayoutSwitcher headerData={headerData} footerData={footerData} servicesItems={servicesItems}>
            <div className={`min-h-screen ${headerData && headerData.status ? "pt-[136px]" : "pt-[100px]"} flex flex-col sm:justify-start items-center bg-gray-50`}>
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
        </AppLayoutSwitcher>
    );
}
