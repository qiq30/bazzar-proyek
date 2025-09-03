// resources/js/Pages/Admin/AdminDashboard.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useSpring, animated } from "@react-spring/web";
import PieChart from "@/Components/PieChart"; // <-- IMPORT PIE CHART
import BarChart from "@/Components/BarChart"; // <-- IMPORT BAR CHART

// --- Komponen Ikon SVG (tidak berubah) ---
const EventIcon = (p) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...p}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5"
        />
    </svg>
);
const UmkmIcon = (p) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...p}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25a.75.75 0 01-.75-.75V10.5a.75.75 0 01.75-.75h1.5M13.5 21h3.375a.75.75 0 00.75-.75V10.5a.75.75 0 00-.75-.75h-1.5m-4.5 0H9.75v-4.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v4.5m-4.5 0V21m-4.5-10.5h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v3a1.5 1.5 0 001.5 1.5z"
        />
    </svg>
);
const PenyelenggaraIcon = (p) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...p}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
        />
    </svg>
);
const VerificationIcon = (p) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...p}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);
const UserVerificationIcon = (p) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...p}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
    </svg>
);
const ProposalIcon = (p) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...p}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
        />
    </svg>
);
const HomeIcon = (p) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...p}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
    </svg>
);
const ReportIcon = (p) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...p}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.5-1.5m1.5 1.5v4.5m-7.5-4.5h7.5"
        />
    </svg>
);

// --- Komponen Kartu Statistik (Sudah diperbaiki sebelumnya) ---
const AnimatedStatCard = ({ title, value, icon, color, subValue, subText }) => {
    const { number } = useSpring({
        from: { number: 0 },
        number: value,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });

    return (
        <div
            className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color.border}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <animated.p className="text-4xl font-bold text-gray-900">
                        {number.to((n) => Math.round(n))}
                    </animated.p>
                    {(subValue !== undefined || subText) && (
                        <p className="text-xs text-gray-500 mt-1">
                            {subValue !== undefined ? `${subValue} ` : ""}
                            {subText}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color.bg}`}>{icon}</div>
            </div>
        </div>
    );
};

export default function AdminDashboard({ auth, stats, chartData }) {
    // <-- Terima prop chartData
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
                    {/* Welcome Banner */}
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

                    {/* --- Bagian Statistik (tidak berubah) --- */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Statistik Event & Proposal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatedStatCard
                                title="Total Event Diterbitkan"
                                value={stats.totalEvents}
                                icon={
                                    <EventIcon className="h-8 w-8 text-blue-600" />
                                }
                                color={{
                                    border: "border-blue-500",
                                    bg: "bg-blue-100",
                                }}
                                subValue={stats.activeEvents}
                                subText="sedang aktif"
                            />
                            <AnimatedStatCard
                                title="Proposal Masuk"
                                value={stats.pendingProposals}
                                icon={
                                    <ProposalIcon className="h-8 w-8 text-yellow-600" />
                                }
                                color={{
                                    border: "border-yellow-500",
                                    bg: "bg-yellow-100",
                                }}
                                subText="menunggu persetujuan"
                            />
                        </div>
                    </div>
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Statistik Pengguna
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatedStatCard
                                title="Total UMKM"
                                value={stats.totalUmkm}
                                icon={
                                    <UmkmIcon className="h-8 w-8 text-green-600" />
                                }
                                color={{
                                    border: "border-green-500",
                                    bg: "bg-green-100",
                                }}
                                subValue={stats.verifiedUmkm}
                                subText="terverifikasi"
                            />
                            <AnimatedStatCard
                                title="Total Penyelenggara"
                                value={stats.totalPenyelenggara}
                                icon={
                                    <PenyelenggaraIcon className="h-8 w-8 text-purple-600" />
                                }
                                color={{
                                    border: "border-purple-500",
                                    bg: "bg-purple-100",
                                }}
                                subValue={stats.verifiedPenyelenggara}
                                subText="terverifikasi"
                            />
                            <AnimatedStatCard
                                title="Profil Menunggu Verifikasi"
                                value={
                                    stats.pendingUmkm +
                                    stats.pendingPenyelenggara
                                }
                                icon={
                                    <UserVerificationIcon className="h-8 w-8 text-orange-600" />
                                }
                                color={{
                                    border: "border-orange-500",
                                    bg: "bg-orange-100",
                                }}
                                subText={`${stats.pendingUmkm} UMKM, ${stats.pendingPenyelenggara} Penyelenggara`}
                            />
                        </div>
                    </div>

                    {/* --- Quick Actions (tidak berubah) --- */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Aksi Cepat
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                                href={route("admin.reports.index")}
                                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition group"
                            >
                                <div className="text-teal-600 mb-2 transition-transform group-hover:scale-110">
                                    <ReportIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <p className="font-medium text-center text-gray-900">
                                        Laporan
                                    </p>
                                    <p className="text-sm text-center text-gray-600">
                                        Lihat statistik detail
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
                        </div>
                    </div>

                    {/* --- ▼▼▼ BAGIAN GRAFIK BARU ▼▼▼ --- */}
                    <div className="mt-8">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {/* Grafik Komposisi Pengguna */}
                            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    Komposisi Pengguna
                                </h4>
                                <div className="h-72">
                                    <PieChart
                                        data={chartData.userComposition}
                                    />
                                </div>
                            </div>

                            {/* Grafik Event Terpopuler */}
                            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    5 Event Terpopuler (Aktif & Akan Datang)
                                </h4>
                                <div className="h-72">
                                    <BarChart
                                        data={chartData.popularEvents}
                                        label="Jumlah Pendaftar"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* --- ▲▲▲ AKHIR BAGIAN GRAFIK BARU --- */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
