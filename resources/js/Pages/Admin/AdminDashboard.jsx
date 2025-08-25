// resources/js/Pages/Admin/AdminDashboard.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

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
                                <div className="text-blue-600 text-4xl">🎪</div>
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
                                <div className="text-green-600 text-4xl">
                                    🏪
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
                                <div className="text-gray-600 text-4xl">🏢</div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Event Aktif
                                    </p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {stats.activeEvents}
                                    </p>
                                </div>
                                <div className="text-green-600 text-4xl">
                                    🔥
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
                                <div className="text-blue-600 text-4xl mb-2 transition-transform group-hover:scale-110">
                                    🎪
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
                                <div className="text-orange-600 text-4xl mb-2 transition-transform group-hover:scale-110">
                                    ✅
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
                                <div className="text-purple-600 text-4xl mb-2 transition-transform group-hover:scale-110">
                                    👔
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
                                <div className="text-indigo-600 text-4xl mb-2 transition-transform group-hover:scale-110">
                                    📬
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
                                <div className="text-green-600 text-4xl mb-2 transition-transform group-hover:scale-110">
                                    🏠
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
                                <div className="text-gray-400 text-4xl mb-2">
                                    📊
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
