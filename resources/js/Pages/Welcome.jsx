import { Link, Head } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";
import { useTranslation } from "react-i18next";
export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    headerData,
}) {
    const { t } = useTranslation();

    return (
        <AppLayout auth={auth} headerData={headerData}>
            <div>
                <Head title="Ariyabod Companies Group" />

                <div
                    className="h-[780px] bg-[#97c3b9] bg-cover bg-center pt-[10px]"
                    style={{
                        backgroundImage: `url("/images/ChatGPT%20Image%20May%2012,%202025,%2010_08_55%20AM%20(3).png")`,
                    }}
                >
                    <div className="flex items-center h-full">
                        {/* <h1 className="text-2xl">{t("welcome")}</h1> */}
                        <div id="circle" class="dashed-circle  relative">
                            <svg
                                className="absolute"
                                width="100%"
                                height="100%"
                                viewBox="0 0 590 590"
                            >
                                <circle
                                    cx="295"
                                    cy="295"
                                    r="285"
                                    fill="none"
                                    stroke="black"
                                    strokeWidth="4"
                                ></circle>
                            </svg>
                            <div className="bg-[#428b7c] rounded-full w-[460px] h-[460px] absolute top-0 left-0 bottom-0 right-0 m-auto flex items-center justify-center">
                                <img //main image circle
                                    src="/images/astronaut.png"
                                    alt="logo"
                                    className="w-2/3 mb-6 ml-2"
                                />
                            </div>
                            <div className="orbit absolute top-0 left-0 w-full h-full z-20 animate-spin-slow">
                                {[...Array(5)].map((_, i) => {
                                    // circle Items
                                    const angle = (360 / 5) * i;
                                    const radius = 245;
                                    const x =
                                        radius *
                                        Math.cos((angle * Math.PI) / 180);
                                    const y =
                                        radius *
                                        Math.sin((angle * Math.PI) / 180);

                                    return (
                                        <div
                                            key={i}
                                            className="w-[150px] h-[150px] bg-[#1eecc3] rounded-full absolute flex items-center justify-center text-center"
                                            style={{
                                                top: `calc(50% + ${y}px - 75px)`,
                                                left: `calc(50% + ${x}px - 75px)`,
                                            }}
                                        >
                                            <div
                                                className="animate-spin-reverse"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    height: "100%",
                                                    width: "100%",
                                                    transformOrigin:
                                                        "center center",
                                                    direction: "rtl",
                                                }}
                                            >
                                                تست
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex"></div>
            </div>
        </AppLayout>
    );
}
