import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuMenu } from "react-icons/lu";
import { format } from "date-fns";
import DashboardAdminAside from "@/Components/shared/DashboardAdminAside";
export default function DashboardLayout({ children, auth = {} }) {
    const { i18n } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButtonRef = useRef(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const lang = i18n.language;
        const html = document.documentElement;

        html.lang = lang;
        html.dir = lang === "fa" || lang === "ps" ? "rtl" : "ltr";

        const isRtl = lang === "fa" || lang === "ps";
        document.body.classList.toggle("rtl", isRtl);
        document.body.classList.toggle("farsi-digits", isRtl);
    }, [i18n.language]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("click", (e) => {
            if (
                e.target.closest(".lang-dropdown")
            ) {
                return;
            }

            handleClickOutside(e);
        });

        return () => {
            document.addEventListener("click", (e) => {
                if (
                    e.target.closest(".lang-dropdown")
                ) {
                    return;
                }

                handleClickOutside(e);
            });
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedDate = format(new Date(), "yyyy/MM/dd");

    return (
        <div className="min-h-screen flex flex-col">
            {/* header */}
            <header className="shadow px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-10">
                    <button
                        ref={menuButtonRef}
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="flex items-center w-9 h-9 hover:bg-[#74efd652] justify-center rounded-md primary-color"
                    >
                        <LuMenu className="text-3xl" />
                    </button>

                    <div>{auth.user.name}</div>
                </div>
                <div className="font-bold">{formattedDate}</div>
            </header>
            <div className="flex ">
                <DashboardAdminAside setOpen={setMenuOpen} open={menuOpen} />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
