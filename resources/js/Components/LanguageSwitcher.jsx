import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowDown } from "react-icons/io";
import { IoLanguage } from "react-icons/io5";
import { MdOutlineLanguage } from "react-icons/md";

const languages = [
    { code: "fa", label: "دری | فارسی" },
    { code: "ps", label: "پشتو" },
    { code: "en", label: "English" },
];

export default function LanguageSwitcher({ v2 }) {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleChange = (lang) => {
        if (currentLang !== lang) {
            i18n.changeLanguage(lang);
            localStorage.setItem("lang", lang);
        }
        setOpen(false);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className=" px-2 flex items-center gap-1 border p-[5px] rounded-lg hover:bg-[#ffffff2b]"
            >
                {v2 ? <MdOutlineLanguage /> : <IoLanguage />}
                <div className="text-sm">
                    {v2 ? languages.find((lang) => lang.code === currentLang)?.code : languages.find((lang) => lang.code === currentLang)?.label}
                </div>
                {v2 ? (
                    <IoIosArrowDown
                        className={`${open ? "rotate-180" : ""}`}
                    />
                ) : null}
            </button>

            {open && (
                <div
                    className={`absolute z-10 mt-2 w-36 bg-white border rounded shadow-lg ${
                        currentLang === "en" ? "right-0" : "left-0"
                    }`}
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleChange(lang.code)}
                            className={`block w-full text-left  px-4 py-2 rounded text-sm ${
                                currentLang === lang.code
                                    ? "primary text-white"
                                    : "hover:bg-gray-100 text-black"
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
