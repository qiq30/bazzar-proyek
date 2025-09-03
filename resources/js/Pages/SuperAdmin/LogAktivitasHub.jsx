// File: resources/js/Pages/SuperAdmin/LogAktivitasHub.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { FiBarChart2, FiGlobe, FiHeart } from "react-icons/fi";

const HubCard = ({ href, icon, title, description, comingSoon = false }) => {
    const cardClasses = `
        relative block p-8 bg-white border border-gray-200 rounded-lg shadow-sm 
        transition-all duration-300 transform hover:-translate-y-1
        ${
            comingSoon
                ? "cursor-not-allowed bg-gray-50"
                : "hover:shadow-lg hover:border-blue-500"
        }
    `;

    const content = (
        <>
            {comingSoon && (
                <span className="absolute top-4 right-4 text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    Segera Hadir
                </span>
            )}
            <div
                className={`text-4xl mb-4 ${
                    comingSoon ? "text-gray-400" : "text-blue-600"
                }`}
            >
                {icon}
            </div>
            <h3
                className={`text-xl font-bold ${
                    comingSoon ? "text-gray-500" : "text-gray-900"
                }`}
            >
                {title}
            </h3>
            <p
                className={`mt-2 text-sm ${
                    comingSoon ? "text-gray-400" : "text-gray-600"
                }`}
            >
                {description}
            </p>
        </>
    );

    return comingSoon ? (
        <div className={cardClasses}>{content}</div>
    ) : (
        <Link href={href} className={cardClasses}>
            {content}
        </Link>
    );
};

export default function LogAktivitasHub({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pusat Laporan & Aktivitas
                </h2>
            }
        >
            <Head title="Pusat Laporan & Aktivitas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <HubCard
                            href={route("superadmin.system.report")}
                            icon={<FiBarChart2 />}
                            title="Statistik Sistem"
                            description="Lihat laporan lengkap dan statistik dari seluruh aktivitas, pengguna, dan event di dalam sistem."
                        />
                        <HubCard
                            icon={<FiGlobe />}
                            title="Log Aktivitas Global"
                            description="Jejak audit terperinci dari semua tindakan penting yang dilakukan oleh admin dan pengguna."
                            comingSoon={true}
                        />
                        <HubCard
                            icon={<FiHeart />}
                            title="Kesehatan Sistem"
                            description="Pantau status, antrian, dan performa database untuk memastikan sistem berjalan lancar."
                            comingSoon={true}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
