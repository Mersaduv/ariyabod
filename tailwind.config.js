import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
const rtl = require("tailwindcss-rtl");
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        screens: {
            sm: "640px",
            xxm: "374px",
            mxx: "330px",
            md: "768px",
            md1: "830px",
            md2: "980px",
            lg: "1024px",
            lg1: "1100px",
            lg2: "1170px",
            sxl: "1200px",
            xl: "1280px",
            xl2: "1400px",
            "2xl": "1536px",
            xs: "450px",
            xs2: "475px",
            xs2: "600px",
            xxs: "395px",
        },
        extend: {
            fontFamily: {
                iran: ["IRANSansX", "sans-serif"],
            },
            keyframes: {
                slideDown: {
                    "0%": { transform: "translateY(-100%)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                fadeSlide: {
                    "0%": { opacity: 0, transform: "translateY(-20%)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
                fadeIn: {
                    "0%": { opacity: 0, transform: "scale(0.95)" },
                    "100%": { opacity: 1, transform: "scale(1)" },
                },
                spinSlow: {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                },
            },
            animation: {
                slideDown: "slideDown 0.4s ease-out forwards",
                "fade-slide": "fadeSlide 0.4s ease-out",
                "spin-slow": "spinSlow 4s linear infinite",
            },
        },
    },

    plugins: [rtl, forms],
};
