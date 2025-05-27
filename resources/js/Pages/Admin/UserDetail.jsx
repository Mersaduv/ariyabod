import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import moment from 'moment';
import jMoment from 'moment-jalaali';
import DashboardLayout from '@/Layouts/DashboardLayout';
import Modal from "@/Components/ui/Modal";

jMoment.loadPersian({ dialect: 'persian-modern' });

export default function UserDetail({ user, auth }) {
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleUserRole = () => {
        router.patch(route('admin.users.toggle-role', user.id), {}, {
            preserveScroll: true,
        });
    };

    const handleDeleteUser = () => {
        setShowDeleteUserModal(true);
    };

    const formatDate = (date) => {
        return date ? jMoment(date).format('YYYY/jMM/jDD - HH:mm') : 'تأیید نشده';
    };

    const formatDetailedDate = (date) => {
        return date ? jMoment(date).format('YYYY/jMM/jDD - HH:mm:ss') : 'تأیید نشده';
    };

    const formatRelativeTime = (date) => {
        if (!date) return 'تأیید نشده';

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
                <Head title={`جزئیات کاربر: ${user.name}`} />
                <div className="p-4 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">جزئیات کاربر: {user.name}</h2>
                        <Link href={route('admin.users')} className="bg-gray-200 px-4 py-2 rounded text-gray-700 hover:bg-gray-300">
                            بازگشت به لیست کاربران
                        </Link>
                    </div>

                    <div className="p-4 sm:p-8 py-8 bg-white shadow border sm:rounded-lg">
                        <div className="bg-gray-50 p-6 rounded-lg mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">اطلاعات اصلی</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-gray-500">نام:</span>
                                            <span className="mr-2 font-medium">{user.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">ایمیل:</span>
                                            <span className="mr-2">{user.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">نقش:</span>
                                            <span className={`mr-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">اطلاعات زمانی</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-gray-500">تاریخ عضویت:</span>
                                            <span className="mr-2">{formatDate(user.created_at)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">تأیید ایمیل:</span>
                                            <span className="mr-2">{formatDate(user.email_verified_at)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">آخرین فعالیت:</span>
                                            <span className="mr-2">{user.last_activity ? formatRelativeTime(user.last_activity.visited_at) : 'هیچ فعالیتی ثبت نشده است'}</span>
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
                                {user.role === 'admin' ? 'تبدیل به کاربر عادی' : 'تبدیل به مدیر'}
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                حذف کاربر
                            </button>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-4">تاریخچه فعالیت ها</h3>
                            {user.visits.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آدرس</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">آی‌پی</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
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
                                <p className="text-gray-500">هیچ فعالیتی برای این کاربر ثبت نشده است.</p>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
