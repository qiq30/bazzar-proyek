// resources/js/Pages/Admin/AdminDashboard.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

// --- Komponen Ikon SVG untuk Dashboard ---
const EventIcon = (props) => (
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
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5"
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
const ActiveEventIcon = (props) => (
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
            d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-6.867 8.209 8.209 0 013 2.48Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z"
        />
    </svg>
);
const VerificationIcon = (props) => (
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
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);
const UserVerificationIcon = (props) => (
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
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
    </svg>
);
const ProposalIcon = (props) => (
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
            d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
        />
    </svg>
);
const HomeIcon = (props) => (
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
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
    </svg>
);
const ReportIcon = (props) => (
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
            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.5-1.5m1.5 1.5v4.5m-7.5-4.5h7.5"
        />
    </svg>
);

export default function AdminDashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard Admin
                </h2>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                            <h3 className="text-2xl font-bold mb-2">
                                Selamat Datang, Admin!
                            </h3>
                            <p className="opacity-90">
                                Kelola event, verifikasi UMKM, dan setujui
                                proposal event dari penyelenggara.
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Event
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stats.totalEvents}
                                    </p>
                                </div>
                                <div className="text-blue-500 bg-blue-100 p-3 rounded-full">
                                    <EventIcon className="h-8 w-8" />
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
                                        {stats.totalUmkm}
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
                                        {stats.totalPenyelenggara}
                                    </p>
                                </div>
                                <div className="text-purple-500 bg-purple-100 p-3 rounded-full">
                                    <PenyelenggaraIcon className="h-8 w-8" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Event Aktif
                                    </p>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {stats.activeEvents}
                                    </p>
                                </div>
                                <div className="text-orange-500 bg-orange-100 p-3 rounded-full">
                                    <ActiveEventIcon className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Aksi Cepat
                        </h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                            <Link
                                href={route("admin.events")}
                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition group"
                            >
                                <div className="text-blue-600 mb-2 transition-transform group-hover:scale-110">
                                    <EventIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="font-medium text-center text-gray-900">
                                        Kelola Event
                                    </p>
                                    <p className="text-sm text-center text-gray-600">
                                        Lihat semua event
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href={route("admin.umkm.verification")}
                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition group"
                            >
                                <div className="text-orange-600 mb-2 transition-transform group-hover:scale-110">
                                    <VerificationIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="font-medium text-center text-gray-900">
                                        Verifikasi UMKM
                                    </p>
                                    <p className="text-sm text-center text-gray-600">
                                        Review pendaftaran
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href={route("admin.penyelenggara.verification")}
                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition group"
                            >
                                <div className="text-purple-600 mb-2 transition-transform group-hover:scale-110">
                                    <UserVerificationIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="font-medium text-center text-gray-900">
                                        Verifikasi Penyelenggara
                                    </p>
                                    <p className="text-sm text-center text-gray-600">
                                        Review pendaftaran
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href={route("admin.proposals.list")}
                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition group"
                            >
                                <div className="text-indigo-600 mb-2 transition-transform group-hover:scale-110">
                                    <ProposalIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="font-medium text-center text-gray-900">
                                        Persetujuan Proposal
                                    </p>
                                    <p className="text-sm text-center text-gray-600">
                                        Review pengajuan event
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/"
                                target="_blank"
                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition group"
                            >
                                <div className="text-green-600 mb-2 transition-transform group-hover:scale-110">
                                    <HomeIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="font-medium text-center text-gray-900">
                                        Lihat Public
                                    </p>
                                    <p className="text-sm text-center text-gray-600">
                                        Halaman depan
                                    </p>
                                </div>
                            </Link>

                            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                                <div className="text-gray-400 mb-2">
                                    <ReportIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="font-medium text-center">
                                        Laporan
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
