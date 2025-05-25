import React, { useRef } from "react";
import { useForm } from "@inertiajs/react";
import useInertiaResponseHandler from "@/Hooks/useInertiaResponseHandler";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Buttons";
import { FaPlus, FaTrash } from "react-icons/fa";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { uploadImage } from "@/Utils/uploadImage";

export default function FooterForm({ footerData, message }) {
    const { t, i18n } = useTranslation();
    const lang = localStorage.getItem("lang") || "fa";

    // Ensure we have a complete data structure with all required properties
    const initialData = {
        addresses: {
            fa: [""],
            en: [""],
            ps: [""],
        },
        contact_numbers: [""],
        social_media: [
            {
                title: { fa: "", en: "", ps: "" },
                link: "",
                image: "",
            },
        ],
    };

    // Merge with footerData if it exists
    if (footerData) {
        initialData.addresses.fa = footerData.addresses?.fa?.length
            ? footerData.addresses.fa
            : [""];
        initialData.addresses.en = footerData.addresses?.en?.length
            ? footerData.addresses.en
            : [""];
        initialData.addresses.ps = footerData.addresses?.ps?.length
            ? footerData.addresses.ps
            : [""];

        initialData.contact_numbers = footerData.contact_numbers?.length
            ? footerData.contact_numbers
            : [""];

        initialData.social_media = footerData.social_media?.length
            ? footerData.social_media
            : [
                  {
                      title: { fa: "", en: "", ps: "" },
                      link: "",
                      image: "",
                  },
              ];
    }

    const {
        data,
        setData,
        post,
        processing,
        errors,
        wasSuccessful,
        recentlySuccessful,
    } = useForm(initialData);

    // Address functions
    const addAddress = (lang) => {
        const updatedAddresses = { ...data.addresses };
        updatedAddresses[lang] = [...(updatedAddresses[lang] || []), ""];
        setData("addresses", updatedAddresses);
    };

    const removeAddress = (lang, index) => {
        if (data.addresses[lang].length <= 1) return; // Keep at least one address field
        const updatedAddresses = { ...data.addresses };
        updatedAddresses[lang] = updatedAddresses[lang].filter(
            (_, i) => i !== index
        );
        setData("addresses", updatedAddresses);
    };

    const handleAddressChange = (lang, index, value) => {
        const updatedAddresses = { ...data.addresses };
        updatedAddresses[lang][index] = value;
        setData("addresses", updatedAddresses);
    };

    // Contact numbers functions
    const addContactNumber = () => {
        setData("contact_numbers", [...data.contact_numbers, ""]);
    };

    const removeContactNumber = (index) => {
        if (data.contact_numbers.length <= 1) return; // Keep at least one contact number field
        setData(
            "contact_numbers",
            data.contact_numbers.filter((_, i) => i !== index)
        );
    };

    const handleContactNumberChange = (index, value) => {
        const updatedContactNumbers = [...data.contact_numbers];
        updatedContactNumbers[index] = value;
        setData("contact_numbers", updatedContactNumbers);
    };

    // Social media functions
    const addSocialMedia = () => {
        setData("social_media", [
            ...data.social_media,
            {
                title: { fa: "", en: "", ps: "" },
                link: "",
                image: "",
            },
        ]);
    };

    const removeSocialMedia = (index) => {
        if (data.social_media.length <= 1) return; // Keep at least one social media field
        setData(
            "social_media",
            data.social_media.filter((_, i) => i !== index)
        );
    };

    const handleSocialMediaChange = (index, field, value) => {
        const updatedSocialMedia = [...data.social_media];
        if (field === "title") {
            updatedSocialMedia[index].title = {
                ...updatedSocialMedia[index].title,
                ...value,
            };
        } else {
            updatedSocialMedia[index][field] = value;
        }
        setData("social_media", updatedSocialMedia);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.footer-design.save"), {
            preserveScroll: true,
            headers: {
                "X-Lang": lang,
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
        <form onSubmit={submit} className="space-y-8">
            <h3 className="font-semibold text-xl mb-6">{t("edit_footer")}</h3>

            {/* Addresses Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-lg mb-4">
                    {t("footer.address_label")}
                </h4>

                <div className="space-y-6">
                    {/* Persian Addresses */}
                    <div className="border-b pb-4">
                        <h5 className="font-medium mb-2">
                            {t("internet_packages.title_fa")}
                        </h5>
                        {data.addresses.fa &&
                            data.addresses.fa.map((address, index) => (
                                <div
                                    key={`fa-address-${index}`}
                                    className="flex items-center gap-2 mb-2"
                                >
                                    <TextInput
                                        value={address}
                                        className="flex-grow"
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "fa",
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeAddress("fa", index)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <IoClose className="text-xl" />
                                    </button>
                                </div>
                            ))}
                        <button
                            type="button"
                            onClick={() => addAddress("fa")}
                            className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                            <IoMdAdd /> {t("circle_items.add_item")}
                        </button>
                    </div>

                    {/* English Addresses */}
                    <div className="border-b pb-4">
                        <h5 className="font-medium mb-2">
                            {t("internet_packages.title_en")}
                        </h5>
                        {data.addresses.en &&
                            data.addresses.en.map((address, index) => (
                                <div
                                    key={`en-address-${index}`}
                                    className="flex items-center gap-2 mb-2"
                                >
                                    <TextInput
                                        value={address}
                                        className="flex-grow"
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "en",
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeAddress("en", index)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <IoClose className="text-xl" />
                                    </button>
                                </div>
                            ))}
                        <button
                            type="button"
                            onClick={() => addAddress("en")}
                            className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                            <IoMdAdd /> {t("circle_items.add_item")}
                        </button>
                    </div>

                    {/* Pashto Addresses */}
                    <div>
                        <h5 className="font-medium mb-2">
                            {t("internet_packages.title_ps")}
                        </h5>
                        {data.addresses.ps &&
                            data.addresses.ps.map((address, index) => (
                                <div
                                    key={`ps-address-${index}`}
                                    className="flex items-center gap-2 mb-2"
                                >
                                    <TextInput
                                        value={address}
                                        className="flex-grow"
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "ps",
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeAddress("ps", index)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <IoClose className="text-xl" />
                                    </button>
                                </div>
                            ))}
                        <button
                            type="button"
                            onClick={() => addAddress("ps")}
                            className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                            <IoMdAdd /> {t("circle_items.add_item")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Contact Numbers Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-lg mb-4">
                    {t("footer.contact_numbers_label")}
                </h4>

                <div className="space-y-4">
                    {data.contact_numbers.map((number, index) => (
                        <div
                            key={`number-${index}`}
                            className="flex items-center gap-2 mb-2"
                        >
                            <TextInput
                                value={number}
                                className="flex-grow"
                                onChange={(e) =>
                                    handleContactNumberChange(
                                        index,
                                        e.target.value
                                    )
                                }
                            />
                            <button
                                type="button"
                                onClick={() => removeContactNumber(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <IoClose className="text-xl" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addContactNumber()}
                        className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                        <IoMdAdd /> {t("circle_items.add_item")}
                    </button>
                </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-lg mb-4">
                    {t("social_media")}
                </h4>

                <div className="flex justify-center flex-wrap gap-6">
                    {data.social_media.map((item, index) => (
                        <div
                            key={`social-${index}`}
                            className="p-4 border border-gray-300 rounded-md space-y-4 relative w-fit"
                        >
                            <ImageUpload
                                imageUrl={item.image}
                                onUpload={(url) =>
                                    handleSocialMediaChange(index, "image", url)
                                }
                                error={errors[`social_media.${index}.image`]}
                                className="h-44"
                            />

                            <div>
                                <InputLabel
                                    value={t("circle_items.fields.title_fa")}
                                />
                                <TextInput
                                    value={item.title?.fa ?? ""}
                                    onChange={(e) =>
                                        handleSocialMediaChange(
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
                                        errors[`social_media.${index}.title.fa`]
                                    }
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={t("circle_items.fields.title_en")}
                                />
                                <TextInput
                                    value={item.title?.en ?? ""}
                                    onChange={(e) =>
                                        handleSocialMediaChange(
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
                                        errors[`social_media.${index}.title.en`]
                                    }
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={t("circle_items.fields.title_ps")}
                                />
                                <TextInput
                                    value={item.title?.ps ?? ""}
                                    onChange={(e) =>
                                        handleSocialMediaChange(
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
                                        errors[`social_media.${index}.title.ps`]
                                    }
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={t("circle_items.fields.link")}
                                />
                                <TextInput
                                    value={item.link ?? ""}
                                    className="w-full"
                                    onChange={(e) =>
                                        handleSocialMediaChange(
                                            index,
                                            "link",
                                            e.target.value
                                        )
                                    }
                                />
                                <InputError
                                    message={
                                        errors[`social_media.${index}.link`]
                                    }
                                />
                            </div>

                            {data.social_media.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeSocialMedia(index)}
                                    className="text-red-500 text-2xl border border-red-500 rounded-full p-0.5 absolute -top-7 bg-white -left-2 hover:bg-red-500 hover:text-white transition-all duration-300"
                                >
                                    <IoClose />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full items-end justify-end mt-4">
                    <div
                        onClick={addSocialMedia}
                        className="border cursor-pointer border-[#428b7c] text-[#428b7c] hover:bg-[#428b7c] hover:text-white transition-all duration-300 rounded-md flex justify-center items-center p-2 gap-1 whitespace-nowrap"
                    >
                        <IoMdAdd /> {t("add_social_media")}
                    </div>
                </div>
            </div>

            <Button type="submit" isLoading={processing} className="primary">
                {t("actions.save")}
            </Button>
        </form>
    );
}

function ImageUpload({ imageUrl, onUpload, error, className }) {
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
                "admin.footer-design.upload",
                "image"
            );
            onUpload(imageUrl);
        } catch (error) {
            console.error("Upload failed");
        }
    };

    return (
        <div className="space-y-1">
            <InputLabel value={t("social_media_image")} />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
            />
            <div
                className={`${
                    className || "h-20 w-20"
                } border border-dashed border-gray-300 rounded cursor-pointer flex items-center justify-center overflow-hidden`}
                onClick={handleImageClick}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="preview"
                        className="h-full object-contain w-full"
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
