// resources/js/Pages/SuperAdmin/UserManagementHub.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

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

const ViewAllIcon = (props) => (
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
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
    </svg>
);

const DeactivateIcon = (props) => (
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
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        />
    </svg>
);

export default function UserManagementHub({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Pengguna
                </h2>
            }
        >
            <Head title="Manajemen Pengguna" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Pilih Opsi Manajemen
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Pilih salah satu menu di bawah untuk mengelola akun
                            admin atau akun pengguna (UMKM & Penyelenggara).
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Link
                                href={route("superadmin.admins.manage")}
                                className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center mb-3">
                                    <AdminIcon className="h-8 w-8 text-purple-600 mr-4" />
                                    <h5 className="text-xl font-bold tracking-tight text-gray-900">
                                        Akun Admin
                                    </h5>
                                </div>
                                <p className="font-normal text-gray-700">
                                    Tambah atau hapus akun untuk administrator
                                    sistem.
                                </p>
                            </Link>
                            <Link
                                href={route("superadmin.users.manage")}
                                className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center mb-3">
                                    <UsersIcon className="h-8 w-8 text-green-600 mr-4" />
                                    <h5 className="text-xl font-bold tracking-tight text-gray-900">
                                        Akun Pengguna
                                    </h5>
                                </div>
                                <p className="font-normal text-gray-700">
                                    Lihat, edit, dan masuk sebagai pengguna UMKM
                                    atau Penyelenggara.
                                </p>
                            </Link>
                            <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
                                <div className="flex items-center mb-3">
                                    <ViewAllIcon className="h-8 w-8 text-gray-400 mr-4" />
                                    <h5 className="text-xl font-bold tracking-tight text-gray-400">
                                        Melihat Semua Pengguna
                                    </h5>
                                </div>
                                <p className="font-normal text-gray-500">
                                    Segera hadir. Fitur untuk melihat daftar
                                    lengkap semua pengguna dalam satu tabel.
                                </p>
                            </div>

                            <div className="block p-6 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
                                <div className="flex items-center mb-3">
                                    <DeactivateIcon className="h-8 w-8 text-gray-400 mr-4" />
                                    <h5 className="text-xl font-bold tracking-tight text-gray-400">
                                        Menonaktifkan Akun
                                    </h5>
                                </div>
                                <p className="font-normal text-gray-500">
                                    Segera hadir. Fitur untuk menonaktifkan
                                    sementara akun pengguna tanpa menghapusnya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
