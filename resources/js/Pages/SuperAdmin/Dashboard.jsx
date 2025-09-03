// File: resources/js/Pages/SuperAdmin/Dashboard.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useSpring, animated } from "@react-spring/web";
import { FiUsers, FiSettings, FiFileText, FiUserCheck } from "react-icons/fi";
import PieChart from "@/Components/PieChart";
import LineChart from "@/Components/LineChart";

// --- Komponen Kartu Statistik dengan Garis Warna di Kiri ---
const AnimatedStatCard = ({ title, value, icon, color }) => {
    const { number } = useSpring({
        from: { number: 0 },
        number: Number(value) || 0,
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
                    <animated.p className="text-3xl font-bold text-gray-900">
                        {number.to((n) => Math.floor(n))}
                    </animated.p>
                </div>
                <div className={`p-3 rounded-full ${color.bg} ${color.text}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// --- Komponen Kartu Aksi/Menu (HubCard) ---
const HubCard = ({
    href,
    icon,
    title,
    description,
    color,
    comingSoon = false,
}) => {
    const content = (
        <>
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
        </>
    );

    if (comingSoon) {
        return (
            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                {content}
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg transition group ${color
                .replace("text-", "hover:border-")
                .replace(/-\d+$/, "-400")} hover:bg-purple-50`}
        >
            {content}
        </Link>
    );
};

export default function Dashboard({ auth, stats, chartData }) {
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
                        <AnimatedStatCard
                            title="Total Admin"
                            value={stats.adminCount}
                            icon={<FiUserCheck className="h-8 w-8" />}
                            color={{
                                border: "border-purple-500",
                                bg: "bg-purple-100",
                                text: "text-purple-600",
                            }}
                        />
                        <AnimatedStatCard
                            title="Total UMKM"
                            value={stats.umkmCount}
                            icon={<FiUsers className="h-8 w-8" />}
                            color={{
                                border: "border-green-500",
                                bg: "bg-green-100",
                                text: "text-green-600",
                            }}
                        />
                        <AnimatedStatCard
                            title="Total Penyelenggara"
                            value={stats.penyelenggaraCount}
                            icon={<FiUsers className="h-8 w-8" />}
                            color={{
                                border: "border-blue-500",
                                bg: "bg-blue-100",
                                text: "text-blue-600",
                            }}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Aksi Cepat & Alat Sistem
                        </h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <HubCard
                                href={route("superadmin.users.hub")}
                                icon={<FiUsers className="h-10 w-10" />}
                                title="Manajemen Pengguna"
                                description="Kelola semua pengguna & admin"
                                color="text-purple-600"
                            />
                            <HubCard
                                href={route("superadmin.log.hub")}
                                icon={<FiFileText className="h-10 w-10" />}
                                title="Laporan & Aktivitas"
                                description="Lihat laporan sistem"
                                color="text-blue-600"
                            />
                            <HubCard
                                icon={<FiSettings className="h-10 w-10" />}
                                title="Pengaturan Sistem"
                                description="Segera Hadir"
                                comingSoon={true}
                                color="text-gray-400"
                            />
                        </div>
                    </div>

                    {/* --- Bagian Grafik --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Pertumbuhan Pengguna Baru (6 Bulan)
                            </h3>
                            <div className="h-80">
                                <LineChart
                                    data={chartData.monthlyGrowth}
                                    label="Pengguna Baru"
                                />
                            </div>
                        </div>
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Komposisi Pengguna
                            </h3>
                            <div className="h-80">
                                <PieChart data={chartData.userComposition} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
