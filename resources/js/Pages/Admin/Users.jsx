import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import moment from 'moment';
import jMoment from 'moment-jalaali';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Modal from "@/Components/ui/Modal";

jMoment.loadPersian({ dialect: 'persian-modern' });

export default function Users({ auth, users }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(null);
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleUserRole = (userId) => {
        router.patch(route('admin.users.toggle-role', userId), {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteUser = (userId) => {
        setShowDeleteUserModal(true);
        setUserToDelete(userId);
    };

    const formatDate = (date) => {
        return jMoment(date).format('YYYY/jMM/jDD - HH:mm');
    };

    const formatRelativeTime = (date) => {
        if (!date) return 'هیچ فعالیتی ثبت نشده است';

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
                title="حذف کاربر"
            >
                <>
                    <p className="text-lg font-medium pb-4">
                        آیا از حذف این کاربر اطمینان دارید؟ این عمل قابل بازگشت نیست.
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
                                        userToDelete
                                    ),
                                    {
                                        onFinish: () => {
                                            setIsSubmitting(false);
                                            setShowDeleteUserModal(false);
                                        },
                                    }
                                );
                            }}
                            disabled={isSubmitting}
                        >
                            بله
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 min-w-24 text-white px-4 py-2 rounded-md"
                            onClick={() => setShowDeleteUserModal(false)}
                            disabled={isSubmitting}
                        >
                            انصراف
                        </button>
                    </div>
                </>
            </Modal>

            <DashboardLayout auth={auth}>
                <div className="p-4 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">مدیریت کاربران</h2>
                    </div>

                    {/* User table */}
                    <div className="p-4 sm:p-8 py-8 bg-white shadow border sm:rounded-lg">
                        {users && users.length > 0 ? (
                            <>
                                {/* دسکتاپ: جدول استاندارد */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    نام
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ایمیل
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    نقش
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    تاریخ عضویت
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    تعداد بازدیدها
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    آخرین فعالیت
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    عملیات
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map(user => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            <Link href={route('admin.users.show', user.id)} className="text-indigo-600 hover:text-indigo-900">
                                                                {user.name}
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                            {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {formatDate(user.created_at)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {user.visits_count}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {user.last_activity ? formatRelativeTime(user.last_activity.visited_at) : 'هیچ فعالیتی ثبت نشده است'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => toggleUserRole(user.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 ml-4"
                                                            >
                                                                {user.role === 'admin' ? 'تبدیل به کاربر' : 'تبدیل به مدیر'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(user.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                حذف
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* موبایل: نمایش کارت‌وار */}
                                <div className="md:hidden space-y-4">
                                    {users.map(user => (
                                        <div
                                            key={user.id}
                                            className="rounded-md p-4 shadow-sm border"
                                        >
                                            <div className="mb-2 flex justify-between items-start">
                                                <div>
                                                    <strong>نام:</strong>{" "}
                                                    <Link href={route('admin.users.show', user.id)} className="text-indigo-600 hover:text-indigo-900">
                                                        {user.name}
                                                    </Link>
                                                </div>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                                                </span>
                                            </div>

                                            <div className="mb-2">
                                                <strong>ایمیل:</strong>{" "}
                                                {user.email}
                                            </div>
                                            <div className="mb-2">
                                                <strong>تاریخ عضویت:</strong>{" "}
                                                {formatDate(user.created_at)}
                                            </div>
                                            <div className="mb-2">
                                                <strong>تعداد بازدیدها:</strong>{" "}
                                                {user.visits_count}
                                            </div>
                                            <div className="mb-2">
                                                <strong>آخرین فعالیت:</strong>{" "}
                                                <span className="text-gray-600">
                                                    {user.last_activity ? formatRelativeTime(user.last_activity.visited_at) : 'هیچ فعالیتی ثبت نشده است'}
                                                </span>
                                            </div>

                                            <div className="flex justify-end gap-2 mt-3">
                                                <button
                                                    onClick={() => toggleUserRole(user.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                                                >
                                                    {user.role === 'admin' ? 'تبدیل به کاربر' : 'تبدیل به مدیر'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-600 hover:text-red-900 text-sm"
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                هیچ کاربری یافت نشد
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
