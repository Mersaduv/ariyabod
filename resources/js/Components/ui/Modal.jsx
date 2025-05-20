import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const Modal = ({ show, onClose, title, children }) => {
    useEffect(() => {
        document.body.style.overflow = show ? "hidden" : "unset";

        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (show) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [show, onClose]);

    const backdropClasses = `
        fixed inset-0 z-50 bg-black/50 transition-opacity duration-700 ease-in-out
        ${show ? 'visible opacity-100' : 'invisible opacity-0'}
        flex items-center justify-center
    `;

    const modalClasses = `
        bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all duration-700 ease-in-out
        ${show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 scale-95 opacity-0'}
    `;

    return (
        <div className={backdropClasses} onClick={onClose}>
            <div
                className={modalClasses}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black transition duration-300"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
