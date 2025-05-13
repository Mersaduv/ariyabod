import { useAlert } from "@/Store/AlertContext";
import { useEffect, useRef } from "react";

export default function useInertiaResponseHandler({
  wasSuccessful,
  recentlySuccessful,
  errors,
  onSuccess,
  onError,
  message,
}) {
  const { showAlert } = useAlert();
  const shownMessageRef = useRef(null);
  const lastSuccessRef = useRef(null); // برای جلوگیری از اجرای تکراری

  useEffect(() => {
    const hasSuccess = wasSuccessful || recentlySuccessful;

    if (hasSuccess) {
      const text = message?.text || "عملیات با موفقیت انجام شد";
      const type = message?.type || "success";

      // فقط اگر پیام جدید باشد یا موفقیت جدیدی رخ داده باشد
      if (lastSuccessRef.current !== text) {
        showAlert(type, text);
        shownMessageRef.current = text;
        lastSuccessRef.current = text; // به‌روزرسانی برای جلوگیری از تکرار
        onSuccess?.();
      }
    } else {
      // ریست کردن در صورت عدم موفقیت
      lastSuccessRef.current = null;
    }
  }, [wasSuccessful, recentlySuccessful, message, showAlert, onSuccess]);

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const text =
        message?.type === "error" && message?.text
          ? message.text
          : "لطفاً خطاهای فرم را بررسی کنید.";

      if (shownMessageRef.current !== text) {
        showAlert("error", text);
        shownMessageRef.current = text;
        onError?.();
      }
    }
  }, [errors, message, showAlert, onError]);
}
