// File: resources/js/Pages/SuperAdmin/SystemReport/Index.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useSpring, animated } from "@react-spring/web";
import PieChart from "@/Components/PieChart";
import BarChart from "@/Components/BarChart";
import LineChart from "@/Components/LineChart";
import {
    FiUsers,
    FiCheckSquare,
    FiArchive,
    FiDollarSign,
    FiBox,
    FiFileText,
} from "react-icons/fi";

// --- Komponen Kartu Statistik yang sudah diperbaiki ---
const StatCard = ({ title, value, description, icon, color }) => {
    const isCurrency = String(value).startsWith("Rp");
    const numericValue = Number(String(value).replace(/[^0-9.-]+/g, "")) || 0;

    const { number } = useSpring({
        from: { number: 0 },
        number: numericValue,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 14 },
    });

    const getStripColor = (colorConfig) => {
        const colorMap = {
            "bg-blue-100": "bg-blue-500",
            "bg-indigo-100": "bg-indigo-500",
            "bg-green-100": "bg-green-500",
            "bg-emerald-100": "bg-emerald-500",
            "bg-yellow-100": "bg-yellow-500",
            "bg-cyan-100": "bg-cyan-500",
            "bg-rose-100": "bg-rose-500",
            "bg-slate-100": "bg-slate-500",
        };
        return colorMap[colorConfig.bg] || "bg-gray-500";
    };

    return (
        <div className="relative bg-white rounded-xl shadow-md border border-gray-100 flex items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
            <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStripColor(
                    color
                )}`}
            ></div>
            <div className="flex items-center space-x-4 p-5 pl-7 w-full">
                <div
                    className={`text-2xl p-4 rounded-lg ${color.bg} ${color.text}`}
                >
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                        {title}
                    </p>
                    <animated.p className="text-2xl font-bold text-gray-900">
                        {number.to((n) =>
                            isCurrency
                                ? `Rp ${Math.floor(n).toLocaleString("id-ID")}`
                                : Math.floor(n).toLocaleString("id-ID")
                        )}
                    </animated.p>
                    {description && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Komponen Wrapper untuk Bagian Laporan ---
const ReportSection = ({ title, subtitle, children }) => (
    <div className="bg-white overflow-hidden shadow-lg sm:rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
        </div>
        <div className="p-6">{children}</div>
    </div>
);

export default function SystemReport({
    auth,
    userStats,
    profileStats,
    eventStats,
    registrationAndContentStats,
}) {
    // Data untuk grafik
    const userRoleData = {
        UMKM: userStats.umkm,
        Penyelenggara: userStats.penyelenggara,
        Admin: userStats.admin,
    };
    const proposalStatusData = {
        Disetujui: eventStats.proposals_approved.value,
        Menunggu: eventStats.proposals_pending,
        Ditolak: eventStats.proposals_rejected,
    };

    const profileComparisonData = {
        labels: ["Terverifikasi", "Menunggu", "Ditolak", "Belum Selesai"],
        datasets: [
            {
                label: "UMKM",
                data: [
                    profileStats.umkm_verified,
                    profileStats.umkm_pending,
                    profileStats.umkm_rejected,
                    profileStats.umkm_incomplete,
                ],
                backgroundColor: "rgba(59, 130, 246, 0.7)",
            },
            {
                label: "Penyelenggara",
                data: [
                    profileStats.penyelenggara_verified,
                    profileStats.penyelenggara_pending,
                    profileStats.penyelenggara_rejected,
                    profileStats.penyelenggara_incomplete,
                ],
                backgroundColor: "rgba(236, 72, 153, 0.7)",
            },
        ],
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dasbor Analitik Sistem
                </h2>
            }
        >
            <Head title="Laporan Sistem" />

            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Section 1: Ringkasan Utama */}
                    <ReportSection
                        title="Ringkasan Platform"
                        subtitle="Gambaran umum dari metrik-metrik kunci sistem."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Pengguna"
                                value={userStats.total.value}
                                description={userStats.total.description}
                                icon={<FiUsers />}
                                color={{
                                    bg: "bg-blue-100",
                                    text: "text-blue-600",
                                }}
                            />
                            <StatCard
                                title="Total Event"
                                value={eventStats.total_published.value}
                                description={
                                    eventStats.total_published.description
                                }
                                icon={<FiArchive />}
                                color={{
                                    bg: "bg-indigo-100",
                                    text: "text-indigo-600",
                                }}
                            />
                            <StatCard
                                title="Total Produk"
                                value={
                                    registrationAndContentStats.total_products
                                        .value
                                }
                                description={
                                    registrationAndContentStats.total_products
                                        .description
                                }
                                icon={<FiBox />}
                                color={{
                                    bg: "bg-green-100",
                                    text: "text-green-600",
                                }}
                            />
                            <StatCard
                                title="Perkiraan Pendapatan"
                                value={`Rp ${registrationAndContentStats.total_revenue.value}`}
                                description={
                                    registrationAndContentStats.total_revenue
                                        .description
                                }
                                icon={<FiDollarSign />}
                                color={{
                                    bg: "bg-emerald-100",
                                    text: "text-emerald-600",
                                }}
                            />
                        </div>
                    </ReportSection>

                    {/* Section 2: Analisis Pengguna */}
                    <ReportSection
                        title="Analisis Pengguna"
                        subtitle="Pertumbuhan dan komposisi pengguna platform."
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                            <div className="lg:col-span-3 h-96">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                    Pertumbuhan Pengguna Baru (6 Bulan)
                                </h4>
                                <LineChart
                                    data={userStats.monthly_growth}
                                    label="Pengguna Baru"
                                />
                            </div>
                            <div className="lg:col-span-2 h-96">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                                    Komposisi Peran
                                </h4>
                                <PieChart data={userRoleData} />
                            </div>
                        </div>
                    </ReportSection>

                    {/* Section 3: Status Verifikasi Profil */}
                    <ReportSection
                        title="Status Verifikasi Profil"
                        subtitle="Perbandingan status profil antara UMKM dan Penyelenggara."
                    >
                        <div className="h-96">
                            <BarChart
                                data={profileComparisonData}
                                useRawData={true}
                            />
                        </div>
                    </ReportSection>

                    {/* Section 4: Analisis Event & Proposal */}
                    <ReportSection
                        title="Analisis Event & Proposal"
                        subtitle="Distribusi status event dan proposal yang diajukan."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <StatCard
                                title="Total Proposal"
                                value={eventStats.total_proposals.value}
                                description={
                                    eventStats.total_proposals.description
                                }
                                icon={<FiFileText />}
                                color={{
                                    bg: "bg-yellow-100",
                                    text: "text-yellow-600",
                                }}
                            />
                            <StatCard
                                title="Proposal Disetujui"
                                value={eventStats.proposals_approved.value}
                                description={
                                    eventStats.proposals_approved.description
                                }
                                icon={<FiCheckSquare />}
                                color={{
                                    bg: "bg-cyan-100",
                                    text: "text-cyan-600",
                                }}
                            />
                            <StatCard
                                title="Event Aktif"
                                value={eventStats.active.value}
                                description={eventStats.active.description}
                                icon={<FiArchive />}
                                color={{
                                    bg: "bg-rose-100",
                                    text: "text-rose-600",
                                }}
                            />
                            <StatCard
                                title="Event Selesai"
                                value={eventStats.finished.value}
                                description={eventStats.finished.description}
                                icon={<FiCheckSquare />}
                                color={{
                                    bg: "bg-slate-100",
                                    text: "text-slate-600",
                                }}
                            />
                        </div>
                        <div className="border-t pt-8">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                                Status Proposal Event
                            </h4>
                            <div className="h-96">
                                <PieChart data={proposalStatusData} />
                            </div>
                        </div>
                    </ReportSection>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
