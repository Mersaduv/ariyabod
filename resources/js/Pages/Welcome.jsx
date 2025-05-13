import { Link, Head } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";
import { useTranslation } from "react-i18next";
import MainSlider from "@/Components/sliders/MainSlider";
import React, { useRef, useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    headerData,
    circleItems,
}) {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderInterval = useRef(null);

    const [sliderRef, slider] = useKeenSlider({
        loop: true,
        vertical: true,
        slideChanged(s) {
            setCurrentSlide(s.track.details.rel);
        },
        created(s) {
            setCurrentSlide(s.track.details.rel);
        },
    });

    // اسلاید خودکار هر ۳ ثانیه
    useEffect(() => {
        if (!slider) return;
        sliderInterval.current = setInterval(() => {
            slider.current?.next();
        }, 3000);

        return () => clearInterval(sliderInterval.current);
    }, [slider]);

    // زاویه چرخش دایره‌ای
    const itemCount = circleItems.length - 1;
    const itemAngle = 360 / itemCount;
    // const angleOffset = -itemAngle * currentSlide;

    const anglePerItem = 360 / (circleItems.length - 1);
    const angleOffset = 180 - anglePerItem * currentSlide;

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
                    <div className="flex items-center h-full w-full mr-[68px]">
                        {/* دایره سمت چپ */}
                        <div className="flex items-center h-full bg-blue-50">
                            <div id="circle" className="dashed-circle relative">
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
                                    />
                                </svg>

                                <div className="bg-[#428b7c] rounded-full w-[460px] h-[460px] absolute top-0 left-0 bottom-0 right-0 m-auto flex items-center justify-center">
                                    <img
                                        src={
                                            circleItems[0].order === 0 &&
                                            circleItems[0].image
                                        }
                                        alt="logo"
                                        className="w-2/3 mb-6 ml-2"
                                    />
                                </div>

                                {/* دایره‌های چرخان */}
                                <div
                                    className="orbit absolute top-0 left-0 w-full h-full z-20"
                                    style={{
                                        transform: `rotate(${angleOffset}deg)`,
                                        transition: "transform 1s ease-in-out",
                                    }}
                                >
                                    {circleItems
                                        .slice(1)
                                        .sort((a, b) => a.order - b.order)
                                        .map((item, i) => {
                                            const angle = itemAngle * i;
                                            const radius = 245;
                                            const x =
                                                radius *
                                                Math.cos(
                                                    (angle * Math.PI) / 180
                                                );
                                            const y =
                                                radius *
                                                Math.sin(
                                                    (angle * Math.PI) / 180
                                                );

                                            return (
                                                <div
                                                    key={i + 1}
                                                    className="w-[150px] h-[150px] bg-[#1eecc3] rounded-full absolute flex items-center justify-center text-center"
                                                    style={{
                                                        top: `calc(50% + ${y}px - 75px)`,
                                                        left: `calc(50% + ${x}px - 75px)`,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            height: "100%",
                                                            width: "100%",
                                                            transformOrigin:
                                                                "center center",
                                                            // direction: "rtl",
                                                            transform: `rotate(${-angleOffset}deg)`,
                                                            transition:
                                                                "transform 1s ease-in-out",
                                                        }}
                                                    >
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="w-[110px] object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>

                        {/* اسلایدر سمت راست */}
                        <div className="w-full">
                            <div
                                ref={sliderRef}
                                className="keen-slider"
                                style={{ height: 200 }}
                            >
                                {circleItems
                                    .sort((a, b) => a.order - b.order)
                                    .slice(1)
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className={`keen-slider__slide number-slide${
                                                index + 1
                                            } flex items-center justify-center`}
                                        >
                                            <p className="text-3xl font-semibold text-center text-white w-[450px]">
                                                {item.title}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
const WheelControls = (slider) => {
    let touchTimeout;
    let position;
    let wheelActive;

    function dispatch(e, name) {
        position.x -= e.deltaX;
        position.y -= e.deltaY;
        slider.container.dispatchEvent(
            new CustomEvent(name, {
                detail: {
                    x: position.x,
                    y: position.y,
                },
            })
        );
    }

    function wheelStart(e) {
        position = {
            x: e.pageX,
            y: e.pageY,
        };
        dispatch(e, "ksDragStart");
    }

    function wheel(e) {
        dispatch(e, "ksDrag");
    }

    function wheelEnd(e) {
        dispatch(e, "ksDragEnd");
    }

    function eventWheel(e) {
        e.preventDefault();
        if (!wheelActive) {
            wheelStart(e);
            wheelActive = true;
        }
        wheel(e);
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            wheelActive = false;
            wheelEnd(e);
        }, 50);
    }

    slider.on("created", () => {
        slider.container.addEventListener("wheel", eventWheel, {
            passive: false,
        });
    });
};
