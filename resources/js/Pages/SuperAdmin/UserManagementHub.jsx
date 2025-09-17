// File: resources/js/Pages/SuperAdmin/UserManagementHub.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { FiUserCheck, FiUsers, FiEye, FiUserX } from "react-icons/fi";
const HubCard = ({ href, icon, title, description, comingSoon = false }) => {
    const cardClasses = `
        relative block p-8 bg-white border border-gray-200 rounded-lg shadow-sm 
        transition-all duration-300 transform hover:-translate-y-1
        ${
            comingSoon
                ? "cursor-not-allowed bg-gray-50"
                : "hover:shadow-lg hover:border-purple-500"
        }
    `;

    const content = (
        <>
            {comingSoon && (
                <span className="absolute top-4 right-4 text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    Segera Hadir
                </span>
            )}
            <div
                className={`text-4xl mb-4 ${
                    comingSoon ? "text-gray-400" : "text-purple-600"
                }`}
            >
                {icon}
            </div>
            <h3
                className={`text-xl font-bold ${
                    comingSoon ? "text-gray-500" : "text-gray-900"
                }`}
            >
                {title}
            </h3>
            <p
                className={`mt-2 text-sm ${
                    comingSoon ? "text-gray-400" : "text-gray-600"
                }`}
            >
                {description}
            </p>
        </>
    );

    return comingSoon ? (
        <div className={cardClasses}>{content}</div>
    ) : (
        <Link href={href} className={cardClasses}>
            {content}
        </Link>
    );
};

export default function UserManagementHub({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pusat Manajemen Pengguna
                </h2>
            }
        >
            <Head title="Manajemen Pengguna" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        <HubCard
                            href={route("superadmin.admins.manage")}
                            icon={<FiUserCheck />}
                            title="Manajemen Akun Admin"
                            description="Tambah atau hapus akun untuk administrator sistem."
                        />
                        <HubCard
                            href={route("superadmin.users.manage")}
                            icon={<FiUsers />}
                            title="Manajemen Akun Pengguna"
                            description="Lihat, edit, dan masuk sebagai pengguna UMKM atau Penyelenggara."
                        />
                        <HubCard
                            icon={<FiEye />}
                            title="Melihat Semua Pengguna"
                            description="Fitur untuk melihat daftar lengkap semua pengguna dalam satu tabel."
                            comingSoon={true}
                        />
                        <HubCard
                            icon={<FiUserX />}
                            title="Menonaktifkan Akun"
                            description="Fitur untuk menonaktifkan sementara akun pengguna tanpa menghapusnya."
                            comingSoon={true}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
