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
    function newItem() {
        return { title: "", link: "", image: "", status: true };
    }

    const [items, setItems] = useState(
        circleItems.length ? circleItems : [newItem()]
    );

    const {
        data,
        setData,
        post,
        processing,
        errors,
        wasSuccessful,
        recentlySuccessful,
    } = useForm({ items: [] });

    const addItem = () => {
        console.log("افزودن آیتم");
        if (items.length >= 5) {
            toast.error("شما میتوانید فقط 5 آیتم را اضافه کنید");
            return;
        }
        setItems([...items, newItem()]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setData(
            "items",
            items.map((item) => ({ ...item, type: "circle" }))
        );
        post(route("admin.site-items.store"), {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="">
            <h1 className="text-2xl font-bold -mt-2 mb-4">آیتم های دایره ای</h1>
            <div className="flex justify-center flex-wrap gap-6">
                {items.map((item, index) => (
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
                            <InputLabel value="عنوان" />
                            <TextInput
                                value={item.title}
                                className="w-full"
                                onChange={(e) =>
                                    handleChange(index, "title", e.target.value)
                                }
                            />
                            <InputError
                                message={errors[`items.${index}.title`]}
                            />
                        </div>

                        <div>
                            <InputLabel value="لینک (اختیاری)" />
                            <TextInput
                                value={item.link}
                                className="w-full"
                                onChange={(e) =>
                                    handleChange(index, "link", e.target.value)
                                }
                            />
                            <InputError
                                message={errors[`items.${index}.link`]}
                            />
                        </div>

                        {items.length > 1 && (
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
                    اولین آیتم وارد شده تصویر وسط آیتم دایره قرار میگیرد, ادامه آیتم های که اضافه میشود دایره های اطراف آن میباشد.
             </p>
                <div className="flex gap-2">
                    <div
                        onClick={addItem}
                        className="border cursor-pointer border-[#428b7c] text-[#428b7c] hover:bg-[#428b7c] hover:text-white transition-all duration-300 rounded-md flex justify-center items-center p-2 gap-1 whitespace-nowrap"
                    >
                        <IoMdAdd /> افزودن آیتم
                    </div>
                    <Button
                        type="submit"
                        isLoading={processing}
                        className="primary"
                    >
                        ذخیره
                    </Button>
                </div>
            </div>
        </form>
    );
}

function ImageUpload({ imageUrl, onUpload, error }) {
    const fileInputRef = useRef(null);

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
            console.error("آپلود ناموفق");
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
                    <span className="text-gray-400">آپلود تصویر</span>
                )}
            </div>
            {error && <InputError message={error} />}
        </div>
    );
}
