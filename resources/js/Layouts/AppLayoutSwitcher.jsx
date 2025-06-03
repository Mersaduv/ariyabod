import React from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from "./AppLayout";

export default function AppLayoutSwitcher({ children, ...props }) {
    const { url } = usePage();

    // Check if the URL starts with /v2 or /v2/ to support both the home page and nested routes
    // const isV2 = url === '/v2' || url.startsWith('/v2/');

    // Select the appropriate layout based on the URL
    const LayoutComponent =  AppLayout;

    return (
        <LayoutComponent {...props}>
            {children}
        </LayoutComponent>
    );
}
