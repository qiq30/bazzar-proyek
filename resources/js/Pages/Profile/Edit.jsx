import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <>
            <Head title="Profile" />

            {/* DIUBAH: Latar belakang dibuat lebih simpel */}
            <div className="min-h-screen bg-slate-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        {/* DIUBAH: Gradient diganti warna solid khas (teal) */}
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4 shadow-lg">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Pengaturan Profil
                        </h1>
                        <p className="text-slate-600 max-w-md mx-auto">
                            Kelola informasi akun, pengaturan keamanan, dan
                            preferensi Anda.
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Profile Information Card */}
                        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                            {/* DIUBAH: Gradient biru/ungu menjadi warna biru langit yang tenang */}
                            <div className="bg-sky-700 px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            Informasi Profil
                                        </h3>
                                        {/* DIUBAH: Disesuaikan dengan warna header baru */}
                                        <p className="text-sky-100 text-sm">
                                            Perbarui detail akun dan alamat
                                            email Anda.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-none"
                                />
                            </div>
                        </div>

                        {/* Security Settings Card */}
                        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                            {/* DIUBAH: Gradient hijau menjadi warna hijau emerald yang terinspirasi alam */}
                            <div className="bg-emerald-700 px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            Pengaturan Keamanan
                                        </h3>
                                        <p className="text-emerald-100 text-sm">
                                            Jaga keamanan akun Anda dengan kata
                                            sandi yang kuat.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <UpdatePasswordForm className="max-w-none" />
                            </div>
                        </div>

                        {/* Danger Zone Card */}
                        <div className="bg-white shadow-xl rounded-2xl border border-red-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                            {/* DIUBAH: Gradient merah/pink menjadi warna merah solid yang tegas */}
                            <div className="bg-red-700 px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <svg
                                            className="w-5 h-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 18.5c-.77.833.192 2.5 1.732 2.5z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">
                                            Zona Berbahaya
                                        </h3>
                                        <p className="text-red-100 text-sm">
                                            Hapus akun dan semua data Anda
                                            secara permanen.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <DeleteUserForm className="max-w-none" />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-slate-500">
                            Butuh bantuan? Hubungi{" "}
                            <a
                                href="#"
                                className="text-teal-600 hover:text-teal-500 font-medium transition-colors"
                            >
                                tim support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

Edit.layout = (page) => (
    <AuthenticatedLayout user={page.props.auth.user}>
        {page}
    </AuthenticatedLayout>
);
