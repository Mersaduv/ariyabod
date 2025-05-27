import React, { useRef, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/Buttons";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import CustomCheckbox from "@/Components/ui/Checkbox";
import useInertiaResponseHandler from "@/Hooks/useInertiaResponseHandler";
import { useTranslation } from "react-i18next";
import { uploadImage } from "@/Utils/uploadImage";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export default function SliderItemsForm({
    sliderItems = [],
    backgroundImage = "",
    message,
}) {
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
        items: sliderItems.sort((a, b) => a.order - b.order).length
            ? sliderItems
            : [],
        background_image: backgroundImage || "",
    });

    const addItem = () => {
        if (data.items.length >= 5) {
            alert(t("slider_items.max_items_error"));
            return;
        }

        const newItems = [
            ...data.items,
            {
                title: { fa: "", en: "", ps: "" },
                description: { fa: "", en: "", ps: "" },
                button_text: { fa: "", en: "", ps: "" },
                link: "",
                image: "",
                status: true,
                type: "slider",
                order: data.items.length,
            },
        ];

        setData("items", newItems);
    };

    const removeItem = (index) => {
        setData(
            "items",
            data.items.filter((_, i) => i !== index)
        );
    };

    const handleChange = (index, field, value) => {
        const updatedItems = [...data.items];
        if (["title", "description", "button_text"].includes(field)) {
            updatedItems[index][field] = {
                ...updatedItems[index][field],
                ...value,
            };
        } else {
            updatedItems[index][field] = value;
        }
        setData("items", updatedItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.slider-items.store"), {
            preserveScroll: true,
            headers: {
                "X-Lang": localStorage.getItem("lang") || "fa",
            },
        });
    };

    useInertiaResponseHandler({
        wasSuccessful,
        recentlySuccessful,
        errors,
        message,
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Background Image Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">
                    {t("slider_items.title")}
                </h1>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {t("slider_items.background")}
                    </h2>
                    <div className="border border-gray-200 rounded-lg p-6">
                        <ImageUpload
                            imageUrl={data.background_image}
                            onUpload={(url) => setData("background_image", url)}
                            error={errors.background_image}
                            className="h-56 w-full"
                            label={t("slider_items.background_image")}
                        />

                        <div className="mt-6">
                            <Button
                                type="submit"
                                isLoading={processing}
                                className="primary"
                            >
                                {t("slider_items.save_background")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slider Items Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {t("slider_items.slides")}
                    </h2>
                    <span className="text-sm text-gray-500">
                        {data.items.length}/5 {t("slider_items.items")}
                    </span>
                </div>

                {/* Add Button Always Visible at Top */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={addItem}
                        className="inline-flex items-center px-4 py-2 border border-[#428b7c] text-[#428b7c] hover:bg-[#428b7c] hover:text-white transition-all duration-300 rounded-md"
                        disabled={data.items.length >= 5}
                    >
                        <IoMdAdd className="mr-1" />
                        {data.items.length === 0
                            ? t("slider_items.add_first_slide")
                            : t("slider_items.add_slide")}
                    </button>
                </div>

                {data.items.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500 mb-4">
                            {t("slider_items.no_slides")}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {data.items.map((item, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-6 relative"
                            >
                                <div className="absolute top-3 left-3 flex items-center">
                                    {data.items.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="text-red-500 hover:bg-red-50 rounded-md p-2 px-4 border border-red-500 text-sm"
                                        >
                                            حذف
                                        </button>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mt-8">
                                    <div>
                                        <ImageUpload
                                            imageUrl={item.image}
                                            onUpload={(url) =>
                                                handleChange(
                                                    index,
                                                    "image",
                                                    url
                                                )
                                            }
                                            error={
                                                errors[`items.${index}.image`]
                                            }
                                            className="h-60"
                                            label={t(
                                                "slider_items.slide_image"
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        {/* Title Fields */}
                                        <div>
                                            <InputLabel
                                                value={t(
                                                    "slider_items.fields.title_fa"
                                                )}
                                            />
                                            <TextInput
                                                value={item.title?.fa ?? ""}
                                                className="w-full"
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "title",
                                                        {
                                                            fa: e.target.value,
                                                        }
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `items.${index}.title.fa`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                value={t(
                                                    "slider_items.fields.title_en"
                                                )}
                                            />
                                            <TextInput
                                                value={item.title?.en ?? ""}
                                                className="w-full"
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "title",
                                                        {
                                                            en: e.target.value,
                                                        }
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `items.${index}.title.en`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                value={t(
                                                    "slider_items.fields.title_ps"
                                                )}
                                            />
                                            <TextInput
                                                value={item.title?.ps ?? ""}
                                                className="w-full"
                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "title",
                                                        {
                                                            ps: e.target.value,
                                                        }
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `items.${index}.title.ps`
                                                    ]
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description Fields */}
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <InputLabel
                                            value={t(
                                                "slider_items.fields.description_fa"
                                            )}
                                        />
                                        <textarea
                                            value={item.description?.fa ?? ""}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "description",
                                                    {
                                                        fa: e.target.value,
                                                    }
                                                )
                                            }
                                            rows="4"
                                        ></textarea>
                                        <InputError
                                            message={
                                                errors[
                                                    `items.${index}.description.fa`
                                                ]
                                            }
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            value={t(
                                                "slider_items.fields.description_en"
                                            )}
                                        />
                                        <textarea
                                            value={item.description?.en ?? ""}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "description",
                                                    {
                                                        en: e.target.value,
                                                    }
                                                )
                                            }
                                            rows="4"
                                        ></textarea>

                                        <InputError
                                            message={
                                                errors[
                                                    `items.${index}.description.en`
                                                ]
                                            }
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            value={t(
                                                "slider_items.fields.description_ps"
                                            )}
                                        />
                                        <textarea
                                            value={item.description?.ps ?? ""}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "description",
                                                    {
                                                        ps: e.target.value,
                                                    }
                                                )
                                            }
                                            rows="4"
                                        ></textarea>

                                        <InputError
                                            message={
                                                errors[
                                                    `items.${index}.description.ps`
                                                ]
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Button Text and Link */}
                                <div className="mt-6 grid md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel
                                            value={t(
                                                "slider_items.fields.button_text_fa"
                                            )}
                                        />
                                        <TextInput
                                            value={item.button_text?.fa ?? ""}
                                            className="w-full"
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "button_text",
                                                    {
                                                        fa: e.target.value,
                                                    }
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `items.${index}.button_text.fa`
                                                ]
                                            }
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            value={t(
                                                "slider_items.fields.button_text_en"
                                            )}
                                        />
                                        <TextInput
                                            value={item.button_text?.en ?? ""}
                                            className="w-full"
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "button_text",
                                                    {
                                                        en: e.target.value,
                                                    }
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `items.${index}.button_text.en`
                                                ]
                                            }
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            value={t(
                                                "slider_items.fields.button_text_ps"
                                            )}
                                        />
                                        <TextInput
                                            value={item.button_text?.ps ?? ""}
                                            className="w-full"
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "button_text",
                                                    {
                                                        ps: e.target.value,
                                                    }
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `items.${index}.button_text.ps`
                                                ]
                                            }
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            value={t(
                                                "slider_items.fields.link"
                                            )}
                                        />
                                        <TextInput
                                            value={item.link ?? ""}
                                            className="w-full"
                                            onChange={(e) =>
                                                handleChange(
                                                    index,
                                                    "link",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[`items.${index}.link`]
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Status Toggle */}
                                <div className="mt-4">
                                    <InputLabel
                                        value={t("slider_items.fields.status")}
                                    />
                                    <CustomCheckbox
                                        label={t("slider_items.fields.status")}
                                        name={`status-${index}`}
                                        checked={item.status}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "status",
                                                e.target.checked
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {data.items.length > 0 && (
                    <div className="flex justify-end mt-6">
                        <Button
                            type="submit"
                            isLoading={processing}
                            className="primary"
                        >
                            {t("slider_items.save_slides")}
                        </Button>
                    </div>
                )}
            </div>
        </form>
    );
}

function ImageUpload({ imageUrl, onUpload, error, className, label }) {
    const fileInputRef = useRef(null);
    const { t } = useTranslation();

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const imageUrl = await uploadImage(
                file,
                "admin.slider-items.upload",
                "image"
            );
            onUpload(imageUrl);
        } catch (error) {
            console.error("Upload failed");
        }
    };

    return (
        <div className="space-y-2">
            <InputLabel value={label || t("slider_items.select_image")} />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
            />
            <div
                className={`${
                    className ? className : "h-40"
                } border border-dashed border-gray-300 rounded-lg cursor-pointer flex items-center justify-center overflow-hidden`}
                onClick={handleImageClick}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="preview"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="text-center">
                        <span className="text-gray-400 block">
                            {t("slider_items.upload_image")}
                        </span>
                    </div>
                )}
            </div>
            {error && <InputError message={error} />}
        </div>
    );
}
