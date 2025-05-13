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
import { FaPlusSquare } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export default function CircleItemsForm({ circleItems = [], message }) {
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
        items: circleItems.sort((a, b) => a.order - b.order).length
            ? circleItems
            : [
                  {
                      title: "",
                      link: "",
                      image: "",
                      status: true,
                      type: "circle",
                      order: 0,
                  },
              ],
    });

    const addItem = () => {
        if (data.items.length >= 6) {
            toast.error(t("circle_items.max_items_error"));
            return;
        }
        setData("items", [
            ...data.items,
            {
                title: "",
                link: "",
                image: "",
                status: true,
                type: "circle",
                order: data.items.length,
            },
        ]);
    };

    const removeItem = (index) => {
        setData(
            "items",
            data.items.filter((_, i) => i !== index)
        );
    };

    const handleChange = (index, field, value) => {
        const updatedItems = [...data.items];
        updatedItems[index][field] = value;
        setData("items", updatedItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.site-items.store"), { preserveScroll: true });
    };

    useInertiaResponseHandler({
        wasSuccessful,
        recentlySuccessful,
        errors,
        message,
    });
    console.log(data.items, "data.items");
    return (
        <form onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold -mt-2 mb-4">
                {t("circle_items.title")}
            </h1>
            <div className="flex justify-center flex-wrap gap-6">
                {[...data.items]
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                        <div
                            key={index}
                            className="p-4 border border-gray-300 rounded-md space-y-4 relative w-fit"
                        >
                            <ImageUpload
                                imageUrl={item.image}
                                onUpload={(url) =>
                                    handleChange(index, "image", url)
                                }
                                error={errors[`items.${index}.image`]}
                            />

                            <div>
                                <InputLabel
                                    value={t("circle_items.fields.title")}
                                />
                                <TextInput
                                    value={item.title}
                                    className="w-full"
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                />
                                <InputError
                                    message={errors[`items.${index}.title`]}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={t("circle_items.fields.link")}
                                />
                                <TextInput
                                    value={item.link}
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
                                    message={errors[`items.${index}.link`]}
                                />
                            </div>

                            {data.items.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-500 text-2xl border border-red-500 rounded-full p-0.5 absolute -top-7 bg-white -left-2 hover:bg-red-500 hover:text-white transition-all duration-300"
                                >
                                    <IoClose />
                                </button>
                            )}
                        </div>
                    ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full items-end justify-between mt-4">
                <p className="text-sm text-gray-500">
                    {t("circle_items.description")}
                </p>
                <div className="flex gap-2">
                    <div
                        onClick={addItem}
                        className="border cursor-pointer border-[#428b7c] text-[#428b7c] hover:bg-[#428b7c] hover:text-white transition-all duration-300 rounded-md flex justify-center items-center p-2 gap-1 whitespace-nowrap"
                    >
                        <IoMdAdd /> {t("circle_items.add_item")}
                    </div>
                    <Button
                        type="submit"
                        isLoading={processing}
                        className="primary"
                    >
                        {t("circle_items.save")}
                    </Button>
                </div>
            </div>
        </form>
    );
}

function ImageUpload({ imageUrl, onUpload, error }) {
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
                "admin.site-items.upload",
                "image"
            );
            onUpload(imageUrl);
        } catch (error) {
            console.error("Upload failed");
        }
    };

    return (
        <div className="space-y-1">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
            />
            <div
                className="h-28 w-full border border-dashed border-gray-300 rounded cursor-pointer flex items-center justify-center overflow-hidden"
                onClick={handleImageClick}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="preview"
                        className="h-full object-cover w-full"
                    />
                ) : (
                    <span className="text-gray-400">
                        {t("circle_items.upload_image")}
                    </span>
                )}
            </div>
            {error && <InputError message={error} />}
        </div>
    );
}
