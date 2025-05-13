import React, { useRef, useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTranslation } from "react-i18next";
import { useForm, usePage } from "@inertiajs/react";
import HeaderForm from "@/Components/forms/HeaderForm";
import FooterForm from "@/Components/forms/FooterForm";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function GeneralDesign({ auth, headerData, footerData }) {
    const { t } = useTranslation();
    const { props } = usePage();
    const message = props.flash?.message;

    console.log(footerData, "footerData");

    return (
        <DashboardLayout auth={auth}>
            <div className="p-4 space-y-6">
                <h2 className="text-xl font-semibold">دیزاین عمومی سایت</h2>
                <div className="p-4 sm:p-8 bg-white shadow border sm:rounded-lg">
                    <HeaderForm headerData={headerData} message={message} />
                </div>

                <div className="p-4 sm:p-8 bg-white shadow border sm:rounded-lg">
                    <FooterForm footerData={footerData} message={message} />
                </div>
            </div>
        </DashboardLayout>
    );
}
