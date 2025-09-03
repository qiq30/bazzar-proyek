// File: resources/js/Pages/Admin/Reports/Index.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import BarChart from "@/Components/BarChart";
import PieChart from "@/Components/PieChart";
import LineChart from "@/Components/LineChart";
import { useSpring, animated } from "@react-spring/web";
// --- Impor Ikon ---
import {
    FiUsers,
    FiCheckSquare,
    FiClock,
    FiTrendingUp,
    FiBriefcase,
    FiXCircle,
    FiArchive,
    FiDollarSign,
    FiBox,
    FiBarChart2,
} from "react-icons/fi";

// Komponen Card Statistik dengan Ikon
const AnimatedStatCard = ({
    title,
    value,
    description,
    color = "blue",
    icon, // <-- Prop baru untuk ikon
    isPercentage = false,
}) => {
    const { number } = useSpring({
        from: { number: 0 },
        number: Number(value) || 0,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });

    const colorClasses = {
        blue: {
            border: "border-blue-500",
            bg: "bg-blue-100",
            text: "text-blue-600",
        },
        green: {
            border: "border-green-500",
            bg: "bg-green-100",
            text: "text-green-600",
        },
        yellow: {
            border: "border-yellow-500",
            bg: "bg-yellow-100",
            text: "text-yellow-600",
        },
        red: {
            border: "border-red-500",
            bg: "bg-red-100",
            text: "text-red-600",
        },
        purple: {
            border: "border-purple-500",
            bg: "bg-purple-100",
            text: "text-purple-600",
        },
        indigo: {
            border: "border-indigo-500",
            bg: "bg-indigo-100",
            text: "text-indigo-600",
        },
        teal: {
            border: "border-teal-500",
            bg: "bg-teal-100",
            text: "text-teal-600",
        },
        orange: {
            border: "border-orange-500",
            bg: "bg-orange-100",
            text: "text-orange-600",
        },
    };

    const selectedColor = colorClasses[color] || colorClasses.blue;

    return (
        <div
            className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${selectedColor.border} transform hover:scale-105 transition-transform duration-300`}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                        {title}
                    </p>
                    <animated.p className="text-3xl font-bold text-gray-900">
                        {number.to((n) =>
                            isPercentage
                                ? `${n.toFixed(1)}%`
                                : Math.floor(n).toLocaleString("id-ID")
                        )}
                    </animated.p>
                    {description && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
                {icon && (
                    <div
                        className={`p-3 rounded-full ${selectedColor.bg} ${selectedColor.text}`}
                    >
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

// Komponen Header Section (Tidak ada perubahan)
const SectionHeader = ({ title, subtitle }) => (
    <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
);

// --- MAIN COMPONENT ---
export default function Reports({
    auth,
    umkmStats,
    penyelenggaraStats,
    eventStats,
    financialAndContentStats,
}) {
    const calculatePercentage = (current, total) =>
        total > 0 ? (current / total) * 100 : 0;

    const eventStatusData = {
        Aktif: eventStats.active,
        "Akan Datang": eventStats.upcoming,
        Selesai: eventStats.finished,
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Laporan & Statistik Platform
                </h2>
            }
        >
            <Head title="Laporan & Statistik" />
            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Pertumbuhan UMKM */}
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-xl">
                        <SectionHeader
                            title="Pertumbuhan UMKM"
                            subtitle="Pendaftaran UMKM baru dalam 6 bulan terakhir"
                        />
                        <div className="p-6">
                            <div className="bg-gray-50 rounded-lg p-4 h-80">
                                <LineChart
                                    data={umkmStats.monthly_growth}
                                    label="UMKM Baru"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Laporan UMKM */}
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-xl">
                        <SectionHeader
                            title="Laporan UMKM"
                            subtitle="Data lengkap registrasi dan verifikasi UMKM"
                        />
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <AnimatedStatCard
                                title="Total UMKM Terdaftar"
                                value={umkmStats.total}
                                color="blue"
                                icon={<FiUsers className="h-6 w-6" />}
                            />
                            <AnimatedStatCard
                                title="UMKM Terverifikasi"
                                value={umkmStats.verified}
                                color="green"
                                icon={<FiCheckSquare className="h-6 w-6" />}
                                description={`${calculatePercentage(
                                    umkmStats.verified,
                                    umkmStats.total
                                ).toFixed(1)}% dari total`}
                            />
                            <AnimatedStatCard
                                title="Menunggu Verifikasi"
                                value={umkmStats.pending}
                                color="yellow"
                                icon={<FiClock className="h-6 w-6" />}
                            />
                            <AnimatedStatCard
                                title="UMKM Baru (30 Hari)"
                                value={umkmStats.new_last_30_days}
                                color="orange"
                                icon={<FiTrendingUp className="h-6 w-6" />}
                                description="Pendaftar baru bulan ini"
                            />
                        </div>
                        <div className="p-6 border-t border-gray-200">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Distribusi UMKM Berdasarkan Jenis Usaha
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4 h-80">
                                <PieChart data={umkmStats.by_type} />
                            </div>
                        </div>
                    </div>

                    {/* Laporan Penyelenggara */}
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-xl">
                        <SectionHeader
                            title="Laporan Penyelenggara"
                            subtitle="Data registrasi dan aktivitas penyelenggara event"
                        />
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <AnimatedStatCard
                                title="Total Penyelenggara"
                                value={penyelenggaraStats.total}
                                color="purple"
                                icon={<FiBriefcase className="h-6 w-6" />}
                            />
                            <AnimatedStatCard
                                title="Terverifikasi"
                                value={penyelenggaraStats.verified}
                                color="green"
                                icon={<FiCheckSquare className="h-6 w-6" />}
                                description={`${calculatePercentage(
                                    penyelenggaraStats.verified,
                                    penyelenggaraStats.total
                                ).toFixed(1)}% dari total`}
                            />
                            <AnimatedStatCard
                                title="Menunggu Verifikasi"
                                value={penyelenggaraStats.pending}
                                color="yellow"
                                icon={<FiClock className="h-6 w-6" />}
                            />
                            <AnimatedStatCard
                                title="Ditolak"
                                value={penyelenggaraStats.rejected}
                                color="red"
                                icon={<FiXCircle className="h-6 w-6" />}
                            />
                        </div>
                    </div>

                    {/* Laporan Event & Keuangan */}
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-xl">
                        <SectionHeader
                            title="Laporan Event & Partisipasi"
                            subtitle="Statistik lengkap event, partisipasi, dan aktivitas lainnya"
                        />
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <AnimatedStatCard
                                title="Total Event"
                                value={eventStats.total}
                                color="indigo"
                                icon={<FiArchive className="h-6 w-6" />}
                            />
                            <AnimatedStatCard
                                title="Pendapatan Registrasi"
                                value={financialAndContentStats.total_revenue}
                                color="teal"
                                icon={<FiDollarSign className="h-6 w-6" />}
                                description="Dari pendaftaran terkonfirmasi"
                            />
                            <AnimatedStatCard
                                title="Total Produk UMKM"
                                value={financialAndContentStats.total_products}
                                color="blue"
                                icon={<FiBox className="h-6 w-6" />}
                            />
                            <AnimatedStatCard
                                title="Rata-rata Pendaftar"
                                value={eventStats.average_registrants_per_event}
                                color="orange"
                                icon={<FiBarChart2 className="h-6 w-6" />}
                                description="Partisipasi per event"
                            />
                        </div>
                        <div className="p-6 border-t grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                                    Top 10 Event Terpopuler
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4 h-96">
                                    <BarChart
                                        data={eventStats.participants_per_event.reduce(
                                            (acc, event) => {
                                                acc[event.nama_event] =
                                                    event.event_registrations_count;
                                                return acc;
                                            },
                                            {}
                                        )}
                                        label="Jumlah Peserta"
                                    />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                                    Distribusi Status Event
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4 h-96">
                                    <PieChart data={eventStatusData} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
