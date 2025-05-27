import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import SliderItemsForm from '@/Components/forms/SliderItemsForm';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function SliderItems({ auth, sliderItems, backgroundImage, message }) {
    const { t } = useTranslation();

    return (
        <DashboardLayout auth={auth}>
            <Head title={t('slider_items.management')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <SliderItemsForm
                        sliderItems={sliderItems}
                        backgroundImage={backgroundImage}
                        message={message}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
