import React, { useRef } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/Buttons";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import CustomCheckbox from "@/Components/ui/Checkbox";
import useInertiaResponseHandler from "@/Hooks/useInertiaResponseHandler";
import { useTranslation } from "react-i18next";

export default function HeaderForm({ headerData, message }) {
    const { t } = useTranslation();
    const {
        data,
        setData,
        post,
        processing,
        errors,
        wasSuccessful,
        recentlySuccessful,
    } = useForm({
        header_text: headerData?.header_text || "",
        header_logo: null,
        header_color: headerData?.header_color || "#000000",
        status: headerData?.status ?? true,
    });

    useInertiaResponseHandler({
        wasSuccessful,
        recentlySuccessful,
        errors,
        message,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.general-design.save"), {
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <ImageUpload
                    headerData={headerData}
                    data={data}
                    setData={setData}
                    errors={errors}
                />
                <InputError message={errors.header_logo} />
            </div>
            <div className="space-y-1">
                <InputLabel value={t("header_form.header_text")} />
                <TextInput
                    type="text"
                    className="w-full"
                    value={data.header_text}
                    onChange={(e) => setData("header_text", e.target.value)}
                />
                <InputError message={errors.header_text} />
            </div>
            <div className="space-y-1">
                <InputLabel value={t("header_form.header_color")} />
                <TextInput
                    type="color"
                    className="w-full"
                    value={data.header_color}
                    onChange={(e) => setData("header_color", e.target.value)}
                />
                <InputError message={errors.header_color} />
            </div>
            <div>
                <InputLabel value={t("header_form.enable_header")} />
                <CustomCheckbox
                    label={t("header_form.is_enabled")}
                    name="status"
                    checked={data.status}
                    onChange={(e) => setData("status", e.target.checked)}
                />
            </div>
            <Button type="submit" isLoading={processing} className="primary">
                {t("actions.save")}
            </Button>
        </form>
    );
}

function ImageUpload({ headerData, data, setData, errors }) {
    const fileInputRef = useRef(null);
    const { t } = useTranslation();

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const renderImageOrPlaceholder = () => {
        if (data.header_logo) {
            return (
                <img
                    src={URL.createObjectURL(data.header_logo)}
                    alt={t("header_form.header_background")}
                    className="max-h-20 h-20 w-full object-cover rounded border cursor-pointer"
                    onClick={handleImageClick}
                />
            );
        } else if (headerData?.header_logo) {
            return (
                <img
                    src={headerData.header_logo}
                    alt={t("header_form.header_background")}
                    className="max-h-20 h-20 w-full object-cover rounded border cursor-pointer"
                    onClick={handleImageClick}
                />
            );
        } else {
            return (
                <div
                    className="max-h-20 h-20 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer"
                    onClick={handleImageClick}
                >
                    <span className="text-gray-500">
                        {t("header_form.upload_header_background")}
                    </span>
                </div>
            );
        }
    };

    return (
        <div>
            <InputLabel value={t("header_form.header_background")} />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => setData("header_logo", e.target.files[0])}
                accept="image/*"
            />
            <div className="mt-2">{renderImageOrPlaceholder()}</div>
            <InputError message={errors.header_logo} />
        </div>
    );
}
