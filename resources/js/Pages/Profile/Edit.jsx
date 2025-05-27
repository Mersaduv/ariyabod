import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import AppLayoutSwitcher from '@/Layouts/AppLayoutSwitcher';

export default function Edit({ auth, mustVerifyEmail, status, headerData, footerData, servicesItems }) {
    return (
        <AppLayoutSwitcher
            auth={auth}
            headerData={headerData}
            footerData={footerData}
            servicesItems={servicesItems}
        >
            <Head title="Profile" />

            <div className="py-12 pt-28">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AppLayoutSwitcher>
    );
}
