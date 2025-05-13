import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoLanguage } from "react-icons/io5";
const languages = [
    { code: "fa", label: "دری | فارسی" },
    { code: "ps", label: "پشتو" },
    { code: "en", label: "English" },
];

export default function LanguageSwitcher() {
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
                className=" flex items-center gap-1 border p-[5px] rounded-lg hover:bg-[#ffffff2b]"
            >
                <IoLanguage />
                <div className="text-sm">
                    {languages.find((lang) => lang.code === currentLang)?.label}
                </div>
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
