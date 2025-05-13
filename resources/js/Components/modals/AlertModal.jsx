import { useAlert } from "@/Store/AlertContext";
import { IoMdClose } from "react-icons/io";
export default function AlertModal() {
    const { alert, hideAlert } = useAlert();

    const iconMap = {
        success: "/icons/success.svg",
        error: "/icons/error.svg",
        exclamation: "/icons/exclamation.svg",
        question: "/icons/question.svg",
    };

    if (!alert.isShow) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
            onClick={hideAlert}
        >
            <div
                className="bg-white rounded-md shadow p-6 text-center max-w-md w-full mx-4 animate-fade-slide relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-2 left-2 text-gray-500 hover:text-red-500"
                    onClick={hideAlert}
                >
                    <IoMdClose size={24} />
                </button>
                <img
                    src={iconMap[alert.status] || iconMap.exclamation}
                    alt="icon"
                    className="mx-auto w-20 h-20"
                />
                <p className="mt-4 text-lg font-medium">{alert.message}</p>
            </div>
        </div>
    );
}
