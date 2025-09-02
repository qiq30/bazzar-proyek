// resources/js/Pages/SuperAdmin/Dashboard.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

// --- Komponen Ikon SVG untuk Dashboard ---
const AdminIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        />
    </svg>
);
const UmkmIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25a.75.75 0 01-.75-.75V10.5a.75.75 0 01.75-.75h1.5M13.5 21h3.375a.75.75 0 00.75-.75V10.5a.75.75 0 00-.75-.75h-1.5m-4.5 0H9.75v-4.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v4.5m-4.5 0V21m-4.5-10.5h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v3a1.5 1.5 0 001.5 1.5z"
        />
    </svg>
);
const PenyelenggaraIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
        />
    </svg>
);
const SettingsIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226.554-.223 1.197-.223 1.75 0 .554.223 1.02.684 1.11 1.226l.043.25a2.25 2.25 0 013.484 2.25l.21.21a2.25 2.25 0 01-2.25 3.485l-.25.042a2.25 2.25 0 01-2.25 3.484l-.21.21a2.25 2.25 0 01-3.485-2.25l-.042-.25a2.25 2.25 0 01-3.484-2.25l-.21-.21a2.25 2.25 0 012.25-3.485l.25-.042a2.25 2.25 0 012.25-3.484l.21-.21zM12 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
        />
    </svg>
);
const LogIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
        />
    </svg>
);
// --- ▼▼▼ TAMBAHKAN IKON BARU ▼▼▼ ---
const UsersIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 12A3 3 0 1012 6a3 3 0 000 6z"
        />
    </svg>
);

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Super Admin Dashboard
                </h2>
            }
        >
            <Head title="Super Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-gradient-to-r from-gray-700 to-gray-900 text-white">
                            <h3 className="text-2xl font-bold mb-2">
                                Selamat Datang, {auth.user.name}
                            </h3>
                            <p className="opacity-90">
                                Anda memiliki kontrol penuh atas sistem sebagai
                                Super Administrator.
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Admin
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stats.adminCount}
                                    </p>
                                </div>
                                <div className="text-purple-500 bg-purple-100 p-3 rounded-full">
                                    <AdminIcon className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total UMKM
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stats.umkmCount}
                                    </p>
                                </div>
                                <div className="text-green-500 bg-green-100 p-3 rounded-full">
                                    <UmkmIcon className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Penyelenggara
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stats.penyelenggaraCount}
                                    </p>
                                </div>
                                <div className="text-blue-500 bg-blue-100 p-3 rounded-full">
                                    <PenyelenggaraIcon className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Aksi Cepat & Alat Sistem
                        </h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link
                                href={route("superadmin.admins.manage")}
                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition group"
                            >
                                <div className="text-purple-600 mb-2 transition-transform group-hover:scale-110">
                                    <AdminIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="font-medium text-center text-gray-900">
                                        Kelola Admin
                                    </p>
                                    <p className="text-sm text-center text-gray-600">
                                        Tambah/hapus admin
                                    </p>
                                </div>
                            </Link>

                            {/* --- ▼▼▼ TAMBAHKAN TOMBOL MANAJEMEN PENGGUNA ▼▼▼ --- */}
                            <Link
                                href={route("superadmin.users.manage")}
                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition group"
                            >
                                <div className="text-green-600 mb-2 transition-transform group-hover:scale-110">
                                    <UsersIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="font-medium text-center text-gray-900">
                                        Kelola Pengguna
                                    </p>
                                    <p className="text-sm text-center text-gray-600">
                                        Masuk sebagai user lain
                                    </p>
                                </div>
                            </Link>

                            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                                <div className="text-gray-400 mb-2">
                                    <SettingsIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="font-medium text-center">
                                        Pengaturan Sistem
                                    </p>
                                    <p className="text-sm text-center">
                                        Segera hadir
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                                <div className="text-gray-400 mb-2">
                                    <LogIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="font-medium text-center">
                                        Log Aktivitas
                                    </p>
                                    <p className="text-sm text-center">
                                        Segera hadir
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
