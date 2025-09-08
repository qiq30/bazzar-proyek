// File: resources/js/Pages/Admin/AdminDashboard.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useSpring, animated } from "@react-spring/web";
import PieChart from "@/Components/PieChart";
import BarChart from "@/Components/BarChart";
// --- Impor Ikon dari React-Icons ---
import {
    FiGrid,
    FiUsers,
    FiUserCheck,
    FiFileText,
    FiBarChart2,
    FiHome,
    FiCheckSquare,
    FiFilePlus,
} from "react-icons/fi";

// --- Komponen Kartu Statistik ---
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
                <div className={`p-3 rounded-full ${color.bg} ${color.text}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// --- Komponen Kartu Aksi/Menu (HubCard) ---
const HubCard = ({ href, icon, title, description, color }) => {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg transition group ${color
                .replace("text-", "hover:border-")
                .replace(/-\d+$/, "-400")} hover:bg-blue-50`}
        >
            <div
                className={`mb-2 transition-transform group-hover:scale-110 ${color}`}
            >
                {icon}
            </div>
            <div>
                <p className="font-medium text-center text-gray-900">{title}</p>
                <p className="text-sm text-center text-gray-600">
                    {description}
                </p>
            </div>
        </Link>
    );
};

export default function AdminDashboard({ auth, stats, chartData }) {
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

                    {/* Bagian Statistik */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Statistik Event & Proposal
                        </h3>
                        {/* --- ▼▼▼ PERBAIKAN GRID DI SINI ▼▼▼ --- */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AnimatedStatCard
                                title="Total Event Diterbitkan"
                                value={stats.totalEvents}
                                icon={<FiGrid className="h-8 w-8" />}
                                color={{
                                    border: "border-blue-500",
                                    bg: "bg-blue-100",
                                    text: "text-blue-600",
                                }}
                                subValue={stats.activeEvents}
                                subText="sedang aktif"
                            />
                            <AnimatedStatCard
                                title="Proposal Masuk (Tahap 1)"
                                value={stats.pendingProposalsStep1}
                                icon={<FiFileText className="h-8 w-8" />}
                                color={{
                                    border: "border-yellow-500",
                                    bg: "bg-yellow-100",
                                    text: "text-yellow-600",
                                }}
                                subText="verifikasi dokumen"
                            />
                            {}
                            <AnimatedStatCard
                                title="Proposal Masuk (Tahap 2)"
                                value={stats.pendingProposalsStep2}
                                icon={<FiFilePlus className="h-8 w-8" />}
                                color={{
                                    border: "border-red-500",
                                    bg: "bg-red-100",
                                    text: "text-red-600",
                                }}
                                subText="persetujuan detail"
                            />
                        </div>
                        {}
                    </div>
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Statistik Pengguna
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatedStatCard
                                title="Total UMKM"
                                value={stats.totalUmkm}
                                icon={<FiUsers className="h-8 w-8" />}
                                color={{
                                    border: "border-green-500",
                                    bg: "bg-green-100",
                                    text: "text-green-600",
                                }}
                                subValue={stats.verifiedUmkm}
                                subText="terverifikasi"
                            />
                            <AnimatedStatCard
                                title="Total Penyelenggara"
                                value={stats.totalPenyelenggara}
                                icon={<FiUserCheck className="h-8 w-8" />}
                                color={{
                                    border: "border-purple-500",
                                    bg: "bg-purple-100",
                                    text: "text-purple-600",
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
                                icon={<FiUserCheck className="h-8 w-8" />}
                                color={{
                                    border: "border-orange-500",
                                    bg: "bg-orange-100",
                                    text: "text-orange-600",
                                }}
                                subText={`${stats.pendingUmkm} UMKM, ${stats.pendingPenyelenggara} Penyelenggara`}
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Aksi Cepat
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <HubCard
                                href={route("admin.events")}
                                icon={<FiGrid className="h-10 w-10" />}
                                title="Kelola Event"
                                description="Lihat semua event"
                                color="text-blue-600"
                            />
                            <HubCard
                                href={route("admin.umkm.verification")}
                                icon={<FiCheckSquare className="h-10 w-10" />}
                                title="Verifikasi UMKM"
                                description="Review pendaftaran"
                                color="text-orange-600"
                            />
                            <HubCard
                                href={route("admin.penyelenggara.verification")}
                                icon={<FiUserCheck className="h-10 w-10" />}
                                title="Verifikasi Penyelenggara"
                                description="Review pendaftaran"
                                color="text-purple-600"
                            />
                            <HubCard
                                href={route("admin.proposals.list")}
                                icon={<FiFileText className="h-10 w-10" />}
                                title="Persetujuan Proposal"
                                description="Review pengajuan event"
                                color="text-indigo-600"
                            />
                            <HubCard
                                href={route("admin.reports.index")}
                                icon={<FiBarChart2 className="h-10 w-10" />}
                                title="Laporan"
                                description="Lihat statistik detail"
                                color="text-teal-600"
                            />
                            <HubCard
                                href="/"
                                icon={<FiHome className="h-10 w-10" />}
                                title="Lihat Public"
                                description="Halaman depan"
                                color="text-green-600"
                            />
                        </div>
                    </div>

                    {/* Bagian Grafik */}
                    <div className="mt-8">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
