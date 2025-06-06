import React, { useState, useRef } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useTranslation } from 'react-i18next';
import { useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';
import { uploadImage } from '@/Utils/uploadImage';

export default function Create({ auth }) {
    const { t } = useTranslation();
    const [additionalImages, setAdditionalImages] = useState([]);
    const additionalFileInputRef = useRef(null);

    const { data, setData, post, processing, progress, errors } = useForm({
        title: {
            en: '',
            fa: '',
            ps: '',
        },
        description: {
            en: '',
            fa: '',
            ps: '',
        },
        start_date: '',
        end_date: '',
        is_active: true,
        is_featured: false,
        image: null,
        additional_images: [],
        color_code: '#FFD700', // Default gold color
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.festivals.store'), {
            forceFormData: true,
        });
    };

    const handleMainImageUpload = (url) => {
        setData('image', url);
    };

    const handleAdditionalImagesClick = () => {
        additionalFileInputRef.current?.click();
    };

    const handleAdditionalImagesChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const newImages = [];
            const uploadPromises = [];

            // Process each file
            for (let file of files) {
                try {
                    // Create an upload promise for each file
                    const uploadPromise = uploadImage(
                        file,
                        'admin.festivals.upload',
                        'image'
                    ).then(url => {
                        newImages.push({
                            url,
                            preview: url,
                            file
                        });
                    });

                    uploadPromises.push(uploadPromise);
                } catch (error) {
                    console.error("Upload failed for file:", file.name, error);
                }
            }

            // Wait for all uploads to complete
            await Promise.all(uploadPromises);

            // Update state with all successfully uploaded images
            if (newImages.length > 0) {
                setAdditionalImages(prevImages => [...prevImages, ...newImages]);

                // Update form data with new URLs
                const currentUrls = data.additional_images || [];
                const newUrls = newImages.map(img => img.url);
                setData('additional_images', [...currentUrls, ...newUrls]);
            }
        }
    };

    const removeAdditionalImage = (index) => {
        const newImages = [...additionalImages];
        newImages.splice(index, 1);
        setAdditionalImages(newImages);

        const newUrls = [...data.additional_images];
        newUrls.splice(index, 1);
        setData('additional_images', newUrls);
    };

    return (
        <DashboardLayout auth={auth}>
            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{t("festivals.create_festival")}</h2>
                    <Link
                        href={route('admin.festivals.index')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                        {t("festivals.back")}
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Titles Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                {t("festivals.festival_title")}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <InputLabel htmlFor="title_fa" value={t("festivals.title_fa")} />
                                    <TextInput
                                        id="title_fa"
                                        type="text"
                                        name="title_fa"
                                        value={data.title.fa}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('title', { ...data.title, fa: e.target.value })}
                                        required
                                    />
                                    <InputError message={errors['title.fa']} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="title_en" value={t("festivals.title_en")} />
                                    <TextInput
                                        id="title_en"
                                        type="text"
                                        name="title_en"
                                        value={data.title.en}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('title', { ...data.title, en: e.target.value })}
                                        required
                                    />
                                    <InputError message={errors['title.en']} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="title_ps" value={t("festivals.title_ps")} />
                                    <TextInput
                                        id="title_ps"
                                        type="text"
                                        name="title_ps"
                                        value={data.title.ps}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('title', { ...data.title, ps: e.target.value })}
                                        required
                                    />
                                    <InputError message={errors['title.ps']} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                {t("festivals.festival_description")}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="description_fa" value={t("festivals.description_fa")} />
                                    <textarea
                                        id="description_fa"
                                        name="description_fa"
                                        value={data.description.fa}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        onChange={(e) => setData('description', { ...data.description, fa: e.target.value })}
                                    />
                                    <InputError message={errors['description.fa']} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description_en" value={t("festivals.description_en")} />
                                    <textarea
                                        id="description_en"
                                        name="description_en"
                                        value={data.description.en}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        onChange={(e) => setData('description', { ...data.description, en: e.target.value })}
                                    />
                                    <InputError message={errors['description.en']} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description_ps" value={t("festivals.description_ps")} />
                                    <textarea
                                        id="description_ps"
                                        name="description_ps"
                                        value={data.description.ps}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        rows={3}
                                        onChange={(e) => setData('description', { ...data.description, ps: e.target.value })}
                                    />
                                    <InputError message={errors['description.ps']} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Date Range Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                {t("festivals.festival_date_range")}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="start_date" value={t("festivals.start_date")} />
                                    <TextInput
                                        id="start_date"
                                        type="date"
                                        name="start_date"
                                        value={data.start_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.start_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="end_date" value={t("festivals.end_date")} />
                                    <TextInput
                                        id="end_date"
                                        type="date"
                                        name="end_date"
                                        value={data.end_date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.end_date} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Images & Design Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                {t("festivals.images_design")}
                            </h3>

                            <div className="space-y-6">
                                {/* Main Image */}
                                <div>
                                    <InputLabel htmlFor="image" value={t("festivals.main_image")} />
                                    <div className="mt-2">
                                        <ImageUpload
                                            imageUrl={data.image}
                                            onUpload={handleMainImageUpload}
                                            error={errors.image}
                                            className="h-40"
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{t("festivals.main_image_desc")}</p>
                                </div>

                                {/* Additional Images */}
                                <div>
                                    <InputLabel htmlFor="additional_images" value={t("festivals.additional_images")} />
                                    <div className="mt-2">
                                        <input
                                            ref={additionalFileInputRef}
                                            type="file"
                                            className="hidden"
                                            onChange={handleAdditionalImagesChange}
                                            accept="image/*"
                                            multiple
                                        />
                                        <div
                                            onClick={handleAdditionalImagesClick}
                                            className="h-28 w-full border border-dashed border-gray-300 rounded cursor-pointer flex items-center justify-center"
                                        >
                                            <span className="text-gray-400">
                                                {t("festivals.select_additional_images")}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{t("festivals.additional_images_desc")}</p>
                                    <InputError message={errors.additional_images} className="mt-2" />

                                    {/* Previews */}
                                    {additionalImages.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {additionalImages.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={image.preview}
                                                        alt={`Preview ${index+1}`}
                                                        className="w-full h-24 object-cover rounded-md border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAdditionalImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Color Code */}
                                <div>
                                    <InputLabel htmlFor="color_code" value={t("festivals.festival_color")} />
                                    <div className="mt-2 flex items-center gap-x-4">
                                        <input
                                            id="color_code"
                                            type="color"
                                            name="color_code"
                                            value={data.color_code}
                                            className="h-10 w-16 cursor-pointer"
                                            onChange={(e) => setData('color_code', e.target.value)}
                                        />
                                        <TextInput
                                            type="text"
                                            value={data.color_code}
                                            className="mt-0 block w-32"
                                            onChange={(e) => setData('color_code', e.target.value)}
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{t("festivals.color_desc")}</p>
                                    <InputError message={errors.color_code} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                {t("festivals.display_status")}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-x-2">
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                    />
                                    <InputLabel htmlFor="is_active" value={t("festivals.is_active")} className="mr-2" />
                                    <InputError message={errors.is_active} className="mt-0 mr-2" />
                                </div>

                                <div className="flex items-center gap-x-2">
                                    <Checkbox
                                        id="is_featured"
                                        name="is_featured"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                    />
                                    <InputLabel htmlFor="is_featured" value={t("festivals.is_featured")} className="mr-2" />
                                    <InputError message={errors.is_featured} className="mt-0 mr-2" />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end pt-4">
                            {progress && (
                                <progress value={progress.percentage} max="100" className="w-full h-2 mr-2">
                                    {progress.percentage}%
                                </progress>
                            )}
                            <PrimaryButton disabled={processing} className="mr-4">
                                {t("festivals.save_festival")}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
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
                "admin.festivals.upload",
                "image"
            );
            onUpload(imageUrl);
        } catch (error) {
            console.error("Upload failed", error);
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
                className={`${
                    className ? className : "h-28"
                } w-full border border-dashed border-gray-300 rounded cursor-pointer flex items-center justify-center overflow-hidden ${className}`}
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
