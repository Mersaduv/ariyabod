import React, { useRef, useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import { useForm, usePage } from "@inertiajs/react";
import CircleItemsForm from "@/Components/forms/CircleItemsForm";
import ServiceItemsForm from "@/Components/forms/ServiceItemsForm";

export default function SiteItems({ auth, circleItems, serviceItems }) {
    const { t } = useTranslation();
    const { props } = usePage();
    const message = props.flash?.message;

    return (
        <DashboardLayout auth={auth}>
            <div className="p-4 space-y-6">
                <h2 className="text-xl font-semibold">{t("site_items")}</h2>
                <div className="p-4 sm:p-8 py-8 bg-white shadow border sm:rounded-lg">
                    <CircleItemsForm
                        circleItems={circleItems}
                        message={message}
                    />
                </div>

                <div className="p-4 sm:p-8 py-8 bg-white shadow border sm:rounded-lg">
                    <ServiceItemsForm
                        serviceItems={serviceItems}
                        message={message}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
