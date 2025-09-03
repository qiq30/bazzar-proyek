// File: resources/js/Pages/UMKM/Dashboard.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";
import {
    FiUser,
    FiCalendar,
    FiGrid,
    FiBox,
    FiHome,
    FiSettings,
    FiTag,
} from "react-icons/fi";

// --- Komponen Kartu Statistik ---
// Disederhanakan untuk hanya menampilkan bagian atas, footer ditangani di luar
const StatCardContent = ({ title, content, icon, color }) => (
    <>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                    {content}
                </div>
            </div>
            <div className={`p-3 rounded-full ${color.bg} ${color.text}`}>
                {icon}
            </div>
        </div>
    </>
);

// --- Komponen Kartu Aksi/Menu (HubCard) ---
const HubCard = ({
    href,
    icon,
    title,
    description,
    color,
    comingSoon = false,
    disabled = false,
}) => {
    const content = (
        <>
            <div
                className={`mb-2 transition-transform ${
                    disabled ? "" : "group-hover:scale-110"
                } ${disabled ? "text-gray-400" : color}`}
            >
                {icon}
            </div>
            <div>
                <p
                    className={`font-medium text-center ${
                        disabled ? "text-gray-500" : "text-gray-900"
                    }`}
                >
                    {title}
                </p>
                <p className="text-sm text-center text-gray-500">
                    {description}
                </p>
            </div>
        </>
    );

    if (disabled || comingSoon) {
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
                .replace(/-\d+$/, "-400")} hover:bg-gray-50`}
        >
            {content}
        </Link>
    );
};

export default function Dashboard({
    auth,
    hasProfile,
    umkmProfile,
    registeredEvents = [],
}) {
    const { impersonating } = usePage().props;
    const isProfileVerified = hasProfile && umkmProfile?.status === "verified";

    const getProfileStatus = () => {
        if (!hasProfile)
            return {
                color: "bg-red-100 text-red-800",
                text: "Profil Belum Dibuat",
                action: "Buat Profil",
            };
        switch (umkmProfile.status) {
            case "pending":
                return {
                    color: "bg-yellow-100 text-yellow-800",
                    text: "Menunggu Verifikasi",
                    action: "Lihat Profil",
                };
            case "verified":
                return {
                    color: "bg-green-100 text-green-800",
                    text: "Terverifikasi",
                    action: "Edit Profil",
                };
            case "rejected":
                return {
                    color: "bg-red-100 text-red-800",
                    text: "Ditolak - Perlu Diperbaiki",
                    action: "Perbaiki Profil",
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-800",
                    text: "Status Tidak Diketahui",
                    action: "Lihat Profil",
                };
        }
    };

    const profileStatus = getProfileStatus();
    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    const formatRegistrationStatus = (status) => {
        const statusMap = {
            approved: {
                text: "Disetujui",
                color: "bg-green-100 text-green-800",
            },
            rejected: { text: "Ditolak", color: "bg-red-100 text-red-800" },
            menunggu_pembayaran: {
                text: "Menunggu Pembayaran",
                color: "bg-yellow-100 text-yellow-800",
            },
            menunggu_konfirmasi_pembayaran: {
                text: "Menunggu Konfirmasi",
                color: "bg-blue-100 text-blue-800",
            },
            pembayaran_terkonfirmasi: {
                text: "Pembayaran Diterima",
                color: "bg-purple-100 text-purple-800",
            },
            sudah_check_in: {
                text: "Sudah Check-in",
                color: "bg-gray-200 text-gray-800",
            },
        };
        const config = statusMap[status] || {
            text: status.replace(/_/g, " "),
            color: "bg-gray-100 text-gray-800",
        };
        return (
            <span
                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
            >
                {config.text}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard UMKM
                </h2>
            }
        >
            <Toaster position="top-right" reverseOrder={false} />
            <Head title="Dashboard UMKM" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold mb-2">
                                Selamat Datang, {auth.user.name}!
                            </h3>
                            <p className="text-gray-600">
                                Kelola profil UMKM Anda dan daftar ke berbagai
                                event bazar.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {/* --- Kartu Status Profil --- */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 flex flex-col justify-between">
                            <StatCardContent
                                title="Status Profil"
                                icon={<FiUser className="h-6 w-6" />}
                                color={{
                                    bg: "bg-blue-100",
                                    text: "text-blue-500",
                                }}
                                content={
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${profileStatus.color}`}
                                    >
                                        {profileStatus.text}
                                    </span>
                                }
                            />
                            <div className="mt-4 text-sm">
                                {umkmProfile?.status !== "verified" ? (
                                    <Link
                                        href="/profile/setup"
                                        className="font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        {profileStatus.action} →
                                    </Link>
                                ) : impersonating ? (
                                    <Link
                                        href={route(
                                            "superadmin.users.edit",
                                            umkmProfile.user_id
                                        )}
                                        className="font-medium text-green-600 hover:text-green-800"
                                    >
                                        Edit Profil ini (Super Admin) →
                                    </Link>
                                ) : (
                                    <p className="text-gray-500">
                                        Profil terkunci. Hubungi admin untuk
                                        perubahan.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* --- Kartu Event Terdaftar --- */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500 flex flex-col justify-between">
                            <StatCardContent
                                title="Event Terdaftar"
                                icon={<FiCalendar className="h-6 w-6" />}
                                color={{
                                    bg: "bg-green-100",
                                    text: "text-green-500",
                                }}
                                content={registeredEvents.length}
                            />
                            <Link
                                href="/events"
                                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                                Lihat Semua Event →
                            </Link>
                        </div>

                        {/* --- Kartu QRIS --- */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500 flex flex-col justify-between">
                            <StatCardContent
                                title="QRIS"
                                icon={<FiGrid className="h-6 w-6" />}
                                color={{
                                    bg: "bg-purple-100",
                                    text: "text-purple-500",
                                }}
                                content={
                                    hasProfile && umkmProfile?.qris_path ? (
                                        <span className="text-green-600">
                                            ✓ Aktif
                                        </span>
                                    ) : (
                                        <span className="text-red-600">
                                            ✗ Belum Diunggah
                                        </span>
                                    )
                                }
                            />
                            <div className="mt-4 text-sm">
                                {isProfileVerified ? (
                                    <Link
                                        href="/qris/upload"
                                        className="font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        {hasProfile && umkmProfile?.qris_path
                                            ? "Update QRIS"
                                            : "Upload QRIS"}{" "}
                                        →
                                    </Link>
                                ) : (
                                    <p className="text-gray-500">
                                        Verifikasi profil dahulu.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Aksi Cepat
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <HubCard
                                href={route("umkm.profile.setup")}
                                icon={<FiSettings className="w-8 h-8" />}
                                title="Profil Setup"
                                description={
                                    isProfileVerified
                                        ? "Profil Terkunci"
                                        : hasProfile
                                        ? "Perbarui Profil"
                                        : "Lengkapi Profil"
                                }
                                color="text-blue-600"
                                disabled={isProfileVerified}
                            />
                            <HubCard
                                href={route("umkm.products")}
                                icon={<FiBox className="w-8 h-8" />}
                                title="Kelola Produk"
                                description="Tambah/edit produk"
                                color="text-purple-600"
                                disabled={!isProfileVerified}
                            />
                            <HubCard
                                href={route("umkm.tickets")}
                                icon={<FiTag className="w-8 h-8" />}
                                title="E-Ticket Saya"
                                description="Lihat tiket event"
                                color="text-teal-600"
                                disabled={!isProfileVerified}
                            />
                            <HubCard
                                href="/events"
                                icon={<FiCalendar className="w-8 h-8" />}
                                title="Daftar Event"
                                description="Ikut event bazar"
                                color="text-green-600"
                                disabled={!isProfileVerified}
                            />
                            <HubCard
                                href="/"
                                icon={<FiHome className="w-8 h-8" />}
                                title="Lihat Public"
                                description="Halaman depan"
                                color="text-orange-600"
                            />
                        </div>
                    </div>

                    {/* Event List */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Event Terbaru yang Anda Ikuti
                        </h4>
                        {registeredEvents.length > 0 ? (
                            <div className="space-y-4">
                                {registeredEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1 mb-3 sm:mb-0">
                                            <Link
                                                href={`/events/${event.id}/umkm`}
                                                className="font-bold text-gray-900 hover:underline"
                                            >
                                                {event.nama_event}
                                            </Link>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(
                                                    event.tanggal_mulai_acara
                                                )}{" "}
                                                -{" "}
                                                {formatDate(
                                                    event.tanggal_selesai_acara
                                                )}
                                            </p>
                                        </div>
                                        <div className="ml-0 sm:ml-4 flex-shrink-0">
                                            {event.pivot.status ===
                                            "menunggu_pembayaran" ? (
                                                <Link
                                                    href={route(
                                                        "umkm.events.pay",
                                                        {
                                                            registration:
                                                                event.pivot.id,
                                                        }
                                                    )}
                                                    className="px-4 py-2 bg-yellow-500 text-white text-xs font-semibold rounded-md hover:bg-yellow-600"
                                                >
                                                    Lanjutkan Pembayaran
                                                </Link>
                                            ) : (
                                                formatRegistrationStatus(
                                                    event.pivot.status
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">
                                Anda belum terdaftar di event manapun.{" "}
                                <Link
                                    href="/events"
                                    className="text-blue-600 hover:underline"
                                >
                                    Cari event sekarang!
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
