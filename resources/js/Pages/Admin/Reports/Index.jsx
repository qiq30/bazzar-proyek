// resources/js/Pages/Admin/Reports/Index.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import BarChart from "@/Components/BarChart";
import PieChart from "@/Components/PieChart";
import LineChart from "@/Components/LineChart"; // <-- IMPORT GRAFIK BARU
import { useSpring, animated } from "@react-spring/web";

// Komponen Card Statistik (Tidak ada perubahan)
const AnimatedStatCard = ({
    title,
    value,
    description,
    color = "blue",
    isPercentage = false,
}) => {
    const { number } = useSpring({
        from: { number: 0 },
        number: Number(value) || 0,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });
    const colorClasses = {
        blue: "border-blue-500",
        green: "border-green-500",
        yellow: "border-yellow-500",
        red: "border-red-500",
        purple: "border-purple-500",
        indigo: "border-indigo-500",
        teal: "border-teal-500",
        orange: "border-orange-500",
    };
    return (
        <div
            className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${colorClasses[color]} transform hover:scale-105 transition-transform duration-300`}
        >
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
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

    // --- ▼▼▼ DATA BARU UNTUK GRAFIK STATUS EVENT ▼▼▼ ---
    const eventStatusData = {
        Aktif: eventStats.active,
        "Akan Datang": eventStats.upcoming,
        Selesai: eventStats.finished,
    };
    // --- ▲▲▲ AKHIR DATA BARU ---

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
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* --- ▼▼▼ KARTU BARU: PERTUMBUHAN PLATFORM ▼▼▼ --- */}
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
                        <SectionHeader
                            title="Pertumbuhan Platform"
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
                    {/* --- ▲▲▲ AKHIR KARTU BARU --- */}

                    {/* Laporan UMKM */}
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
                        <SectionHeader
                            title="Laporan UMKM"
                            subtitle="Data lengkap registrasi dan verifikasi UMKM"
                        />
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <AnimatedStatCard
                                title="Total UMKM Terdaftar"
                                value={umkmStats.total}
                                color="blue"
                            />
                            <AnimatedStatCard
                                title="UMKM Terverifikasi"
                                value={umkmStats.verified}
                                color="green"
                                description={`${calculatePercentage(
                                    umkmStats.verified,
                                    umkmStats.total
                                ).toFixed(1)}% dari total`}
                            />
                            <AnimatedStatCard
                                title="Menunggu Verifikasi"
                                value={umkmStats.pending}
                                color="yellow"
                            />
                            <AnimatedStatCard
                                title="UMKM Baru (30 Hari)"
                                value={umkmStats.new_last_30_days}
                                color="orange"
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
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
                        <SectionHeader
                            title="Laporan Penyelenggara"
                            subtitle="Data registrasi dan aktivitas penyelenggara event"
                        />
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <AnimatedStatCard
                                title="Total Penyelenggara"
                                value={penyelenggaraStats.total}
                                color="purple"
                            />
                            <AnimatedStatCard
                                title="Penyelenggara Terverifikasi"
                                value={penyelenggaraStats.verified}
                                color="green"
                                description={`${calculatePercentage(
                                    penyelenggaraStats.verified,
                                    penyelenggaraStats.total
                                ).toFixed(1)}% dari total`}
                            />
                            <AnimatedStatCard
                                title="Menunggu Verifikasi"
                                value={penyelenggaraStats.pending}
                                color="yellow"
                            />
                            <AnimatedStatCard
                                title="Ditolak"
                                value={penyelenggaraStats.rejected}
                                color="red"
                            />
                        </div>
                    </div>

                    {/* Laporan Event & Keuangan */}
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
                        <SectionHeader
                            title="Laporan Event, Keuangan & Konten"
                            subtitle="Statistik lengkap event, partisipasi, dan aktivitas lainnya"
                        />
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <AnimatedStatCard
                                title="Total Event Diterbitkan"
                                value={eventStats.total}
                                color="indigo"
                            />
                            <AnimatedStatCard
                                title="Pendapatan Registrasi"
                                value={financialAndContentStats.total_revenue}
                                color="teal"
                                description="Dari pendaftaran terkonfirmasi"
                            />
                            <AnimatedStatCard
                                title="Total Produk UMKM"
                                value={financialAndContentStats.total_products}
                                color="blue"
                                description="Produk yang diunggah UMKM"
                            />
                            <AnimatedStatCard
                                title="Rata-rata Pendaftar / Event"
                                value={eventStats.average_registrants_per_event}
                                color="orange"
                                description="Tingkat partisipasi UMKM per event"
                            />
                        </div>

                        {/* --- ▼▼▼ GRAFIK BARU DI DALAM KARTU EVENT ▼▼▼ --- */}
                        <div className="p-6 border-t grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    Top 10 Event Berdasarkan Peserta
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
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    Distribusi Status Event
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4 h-96">
                                    {/* Menggunakan komponen PieChart yang sudah ada */}
                                    <PieChart data={eventStatusData} />
                                </div>
                            </div>
                        </div>
                        {/* --- ▲▲▲ AKHIR DARI GRAFIK BARU --- */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
