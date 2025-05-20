import axios from "axios";

/**
 * آپلود تصویر به URL مشخص
 *
 * @param {File} file فایل انتخاب‌شده توسط کاربر
 * @param {string} uploadUrl آدرس کنترلر آپلود در سرور
 * @param {string} fieldName نام فیلدی که فایل باید با آن ارسال شود (پیش‌فرض: 'image')
 * @returns {Promise<string>} URL نهایی تصویر آپلود شده
 */
export async function uploadImage(file, uploadUrl, fieldName = "image") {
    const formData = new FormData();
    formData.append(fieldName, file);

    try {

        const response = await axios.post(
            route(uploadUrl),
            formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
        );

        const url = response.data.url;

        return url;
    } catch (error) {
        console.error("خطا در آپلود تصویر:", error);
        throw error;
    }
}
