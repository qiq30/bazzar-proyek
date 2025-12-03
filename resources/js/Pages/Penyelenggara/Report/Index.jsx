// File: resources/js/Pages/Penyelenggara/Report/Index.jsx

import React, { Suspense } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useSpring, animated } from "@react-spring/web";
import { FiDollarSign, FiArchive, FiUsers, FiBarChart2 } from "react-icons/fi";

const BarChart = React.lazy(() => import("@/Components/BarChart"));

const AnimatedStatCard = ({
    title,
    value,
    description,
    color = "blue",
    icon,
    allowDecimal = false,
}) => {
    const numericValue = Number(value) || 0;

    const { number } = useSpring({
        from: { number: 0 },
        number: numericValue,
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
        teal: {
            border: "border-teal-500",
            bg: "bg-teal-100",
            text: "text-teal-600",
        },
        indigo: {
            border: "border-indigo-500",
            bg: "bg-indigo-100",
            text: "text-indigo-600",
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
                            allowDecimal
                                ? n.toFixed(1).replace(".", ",")
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

const SectionHeader = ({ title, subtitle }) => (
    <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
);

const ChartLoadingFallback = () => (
    <div className="flex items-center justify-center h-full text-gray-500">
        Memuat data grafik...
    </div>
);

export default function ReportIndex({ auth, stats }) {
    const revenueChartData = stats.revenue_per_event.reduce((acc, event) => {
        acc[event.nama_event] = event.revenue;
        return acc;
    }, {});

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Laporan Pendapatan Event
                </h2>
            }
        >
            <Head title="Laporan Pendapatan" />

            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Ringkasan Statistik */}
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-xl">
                        <SectionHeader
                            title="Ringkasan Pendapatan"
                            subtitle="Statistik keseluruhan dari event yang Anda selenggarakan"
                        />
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AnimatedStatCard
                                title="Total Pendapatan"
                                value={stats.total_revenue.value}
                                description={stats.total_revenue.description}
                                color="green"
                                icon={<FiDollarSign className="h-6 w-6" />}
                            />
                            <AnimatedStatCard
                                title="Total Event Dipublikasikan"
                                value={stats.total_events.value}
                                description={stats.total_events.description}
                                color="indigo"
                                icon={<FiArchive className="h-6 w-6" />}
                            />
                            <AnimatedStatCard
                                title="Total Partisipan UMKM"
                                value={stats.total_registrants.value}
                                description={
                                    stats.total_registrants.description
                                }
                                color="teal"
                                icon={<FiUsers className="h-6 w-6" />}
                            />
                        </div>
                    </div>

                    {/* Grafik Pendapatan per Event */}
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-xl">
                        <SectionHeader
                            title="Pendapatan per Event"
                            subtitle="Perbandingan pendapatan antar event"
                        />
                        <div className="p-6">
                            <div className="bg-gray-50 rounded-lg p-4 h-96">
                                <Suspense fallback={<ChartLoadingFallback />}>
                                    <BarChart
                                        data={revenueChartData}
                                        label="Pendapatan (Rp)"
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Detail Event */}
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-xl">
                        <SectionHeader
                            title="Rincian Event"
                            subtitle="Detail pendapatan dan partisipasi untuk setiap event"
                        />
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Nama Event
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Tanggal Mulai
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Partisipan
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Pendapatan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.revenue_per_event.length > 0 ? (
                                        stats.revenue_per_event.map(
                                            (event, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {event.nama_event}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {new Date(
                                                                event.date
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                                {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {event.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {event.registrants} UMKM
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                                        Rp{" "}
                                                        {event.revenue.toLocaleString(
                                                            "id-ID"
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                            >
                                                Belum ada data event.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
