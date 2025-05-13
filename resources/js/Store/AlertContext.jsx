import { createContext, useContext, useState, useCallback, useRef } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({
        isShow: false,
        status: "",
        message: "",
    });

    const timeoutRef = useRef(null);

    const showAlert = useCallback((status, message) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setAlert({ isShow: true, status, message });

        timeoutRef.current = setTimeout(() => {
            setAlert({ isShow: false, status: "", message: "" });
            timeoutRef.current = null;
        }, 2000);
    }, []);

    const hideAlert = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setAlert({ isShow: false, status: "", message: "" });
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
            {children}
        </AlertContext.Provider>
    );
};

