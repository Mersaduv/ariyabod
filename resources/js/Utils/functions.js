export function formatPriceWithCommas(value) {
    if (value === null || value === undefined) return "";
    const strValue = value.toString().replace(/,/g, "");
    if (isNaN(strValue)) return "";
    return strValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// تابع برای تبدیل تاریخ به yyyy-MM-dd
export const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
};
export const formatTimeToHumanReadable = (timeString) => {
    const lang = localStorage.getItem("lang") || "fa";
    if (!timeString) return "";

    const hour = parseInt(timeString.substring(0, 2));
    const minutes = timeString.substring(3, 5);

    const timeTerms = {
        fa: {
            night: "شب",
            morning: "صبح",
            noon: "ظهر",
            evening: "عصر",
        },
        en: {
            night: "Night",
            morning: "AM",
            noon: "Noon",
            evening: "PM",
        },
        ps: {
            night: "شپه",
            morning: "سهار",
            noon: "غرمه",
            evening: "مازدیګر",
        },
    };

    const terms = timeTerms[lang] || timeTerms.fa;

    if (hour === 0) {
        return minutes === "00"
            ? `12 ${terms.night}`
            : `12:${minutes} ${terms.night}`;
    } else if (hour < 12) {
        return minutes === "00"
            ? `${hour} ${terms.morning}`
            : `${hour}:${minutes} ${terms.morning}`;
    } else if (hour === 12) {
        return minutes === "00"
            ? `12 ${terms.noon}`
            : `12:${minutes} ${terms.noon}`;
    } else {
        const pmHour = hour - 12;
        return minutes === "00"
            ? `${pmHour} ${terms.evening}`
            : `${pmHour}:${minutes} ${terms.evening}`;
    }
};
export const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "";

    // Extract time portion (HH:MM) from ISO datetime string
    return dateTimeString.substring(11, 16);
};
