export function formatPriceWithCommas(value) {
    if (value === null || value === undefined) return '';
    const strValue = value.toString().replace(/,/g, '');
    if (isNaN(strValue)) return '';
    return strValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// تابع برای تبدیل تاریخ به yyyy-MM-dd
export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};
