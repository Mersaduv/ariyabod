import "./bootstrap";
import "../css/app.css";
import "./i18n";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { AlertProvider } from "./Store/AlertContext";
import AlertModal from "./Components/modals/AlertModal";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <AlertProvider>
                <App {...props} />
                <AlertModal />
            </AlertProvider>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
