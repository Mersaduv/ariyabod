import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import moment from 'moment';
import jMoment from 'moment-jalaali';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Modal from "@/Components/ui/Modal";
import { useTranslation } from 'react-i18next';

jMoment.loadPersian({ dialect: 'persian-modern' });

export default function UserDetail({ user, auth }) {
    const { t } = useTranslation();
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const lang = localStorage.getItem("lang") || "fa";
    const toggleUserRole = () => {
        router.patch(route('admin.users.toggle-role', user.id), {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteUser = () => {
        setShowDeleteUserModal(true);
    };

    const formatDate = (date) => {
        return date ? jMoment(date).format('YYYY/jMM/jDD - HH:mm') : t('admin.users.not_verified');
    };

    const formatDetailedDate = (date) => {
        return date ? jMoment(date).format('YYYY/jMM/jDD - HH:mm:ss') : t('admin.users.not_verified');
    };

    const formatRelativeTime = (date) => {
        if (!date) return t('admin.users.not_verified');

        // Convert both to local time to avoid timezone issues
        const now = moment();
        const dateTime = moment(date);

        // Calculate difference in milliseconds
        const diffMs = now.valueOf() - dateTime.valueOf();
        const diffInSeconds = Math.floor(diffMs / 1000);

        // Handle timezone offset issues by considering very small differences as "just now"
        if (diffInSeconds < 0 || Math.abs(diffInSeconds) < 60) {
            return 'لحظاتی پیش';
        } else if (diffInSeconds < 3600) { // Less than an hour
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} دقیقه پیش`;
        } else if (diffInSeconds < 86400) { // Less than a day
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} ساعت پیش`;
        } else if (diffInSeconds < 2592000) { // Less than 30 days
            const days = Math.floor(diffInSeconds / 86400);
            return days === 1 ? 'دیروز' : `${days} روز پیش`;
        } else if (diffInSeconds < 31536000) { // Less than a year
            const months = Math.floor(diffInSeconds / 2592000);
            return months === 1 ? 'ماه گذشته' : `${months} ماه پیش`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return years === 1 ? 'سال گذشته' : `${years} سال پیش`;
        }
    };

    return (
        <>
            {/* Modal for Delete user */}
            <Modal
                show={showDeleteUserModal}
                onClose={() => setShowDeleteUserModal(false)}
                title={t('admin.users.delete_user')}
            >
                <>
                    <p className="text-lg font-medium pb-4">
                        {t('admin.users.delete_confirmation')}
                    </p>
                    <hr className="mb-4" />
                    <div className="flex justify-between gap-2">
                        <button
                            className={` ${
                                isSubmitting
                                    ? "bg-gray-300"
                                    : "hover:bg-red-600"
                            }  min-w-24 text-white px-4 py-2 rounded-md ${
                                isSubmitting ? "bg-gray-300" : "bg-red-500"
                            }`}
                            onClick={() => {
                                setIsSubmitting(true);
                                router.delete(
                                    route(
                                        "admin.users.destroy",
                                        user.id
                                    ),
                                    {
                                        onSuccess: () => window.location = route('admin.users'),
                                        onFinish: () => {
                                            setIsSubmitting(false);
                                            setShowDeleteUserModal(false);
                                        },
                                    }
                                );
                            }}
                            disabled={isSubmitting}
                        >
                            {t('admin.users.yes')}
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 min-w-24 text-white px-4 py-2 rounded-md"
                            onClick={() => setShowDeleteUserModal(false)}
                            disabled={isSubmitting}
                        >
                            {t('admin.users.cancel')}
                        </button>
                    </div>
                </>
            </Modal>

            <DashboardLayout auth={auth}>
                <Head title={t('admin.users.user_details', { name: user.name })} />
                <div className="p-4 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{t('admin.users.user_details', { name: user.name })}</h2>
                        <Link href={route('admin.users')} className="bg-gray-200 px-4 py-2 rounded text-gray-700 hover:bg-gray-300">
                            {t('admin.users.back_to_users')}
                        </Link>
                    </div>

                    <div className="p-4 sm:p-8 py-8 bg-white shadow border sm:rounded-lg">
                        <div className="bg-gray-50 p-6 rounded-lg mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">{t('admin.users.main_info')}</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-gray-500">{t('admin.users.table.name')}:</span>
                                            <span className="mr-2 font-medium">{user.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">{t('admin.users.table.email')}:</span>
                                            <span className="mr-2">{user.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">{t('admin.users.table.role')}:</span>
                                            <span className={`mr-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.role === 'admin' ? t('admin.users.role.admin') : t('admin.users.role.user')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">{t('admin.users.time_info')}</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-gray-500">{t('admin.users.table.join_date')}:</span>
                                            <span className="mr-2">{formatDate(user.created_at)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">{t('admin.users.email_verification')}:</span>
                                            <span className="mr-2">{formatDate(user.email_verified_at)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">{t('admin.users.table.last_activity')}:</span>
                                            <span className="mr-2">{user.last_activity ? formatRelativeTime(user.last_activity.visited_at) : t('admin.users.no_activity')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 space-x-reverse mb-6">
                            <button
                                onClick={toggleUserRole}
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                            >
                                {user.role === 'admin' ? t('admin.users.make_regular_user') : t('admin.users.role.make_admin')}
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                {t('admin.users.delete_user')}
                            </button>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-4">{t('admin.users.activity_history')}</h3>
                            {user.visits.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className={`px-6 py-3 ${lang === "fa" ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>{t('admin.users.activity_table.url')}</th>
                                                <th className={`px-6 py-3 ${lang === "fa" ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>{t('admin.users.activity_table.ip')}</th>
                                                <th className={`px-6 py-3 ${lang === "fa" ? "text-right" : "text-left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}>{t('admin.users.activity_table.date')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {user.visits.map(visit => (
                                                <tr key={visit.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.url}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visit.ip_address}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatRelativeTime(visit.visited_at)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500">{t('admin.users.no_activity_for_user')}</p>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
