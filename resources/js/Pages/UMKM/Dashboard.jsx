// File: resources/js/Pages/UMKM/Dashboard.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";

// --- Komponen Ikon SVG untuk Dashboard UMKM ---
const ProfileIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
    </svg>
);
const CalendarIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M3.75 12h16.5"
        />
    </svg>
);
const QrisIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 4.5A.75.75 0 014.5 3.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5zM3.75 14.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5zM13.5 4.5a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5zM13.5 14.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5z"
        />
    </svg>
);
const ProductIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
    </svg>
);
const HomeIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
    </svg>
);
const SettingsIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226.554-.223 1.197-.223 1.75 0 .554.223 1.02.684 1.11 1.226l.043.25a2.25 2.25 0 013.484 2.25l.21.21a2.25 2.25 0 01-2.25 3.485l-.25.042a2.25 2.25 0 01-2.25 3.484l-.21.21a2.25 2.25 0 01-3.485-2.25l-.042-.25a2.25 2.25 0 01-3.484-2.25l-.21-.21a2.25 2.25 0 012.25-3.485l.25-.042a2.25 2.25 0 012.25-3.484l.21-.21zM12 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
        />
    </svg>
);
const TicketIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18m-3-9h18M5.25 6h13.5c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H5.25A1.125 1.125 0 014.125 15V7.125A1.125 1.125 0 015.25 6z"
        />
    </svg>
);

export default function Dashboard({
    auth,
    hasProfile,
    umkmProfile,
    registeredEvents = [],
}) {
    const isProfileVerified = hasProfile && umkmProfile?.status === "verified";

    const getProfileStatus = () => {
        if (!hasProfile) {
            return {
                color: "bg-red-100 text-red-800",
                text: "Profil Belum Dibuat",
                action: "Buat Profil",
            };
        }
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

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
                    {/* Welcome Section */}
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

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {/* Profile Status Card */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Status Profil
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${profileStatus.color}`}
                                        >
                                            {profileStatus.text}
                                        </span>
                                    </p>
                                </div>
                                <div className="text-blue-500 bg-blue-100 p-3 rounded-full">
                                    <ProfileIcon className="h-6 w-6" />
                                </div>
                            </div>
                            {umkmProfile?.status !== "verified" ? (
                                <Link
                                    href="/profile/setup"
                                    className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium text-sm"
                                >
                                    {profileStatus.action} →
                                </Link>
                            ) : (
                                <p className="mt-4 text-sm text-gray-500">
                                    Profil terkunci. Hubungi admin untuk
                                    perubahan.
                                </p>
                            )}
                        </div>

                        {/* Events Registered Card */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Event Terdaftar
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {registeredEvents.length}
                                    </p>
                                </div>
                                <div className="text-green-500 bg-green-100 p-3 rounded-full">
                                    <CalendarIcon className="h-6 w-6" />
                                </div>
                            </div>
                            <Link
                                href="/events"
                                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                                Lihat Event →
                            </Link>
                        </div>

                        {/* QRIS Status Card */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        QRIS
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {hasProfile &&
                                        umkmProfile?.qris_path ? (
                                            <span className="text-green-600">
                                                ✓ Aktif
                                            </span>
                                        ) : (
                                            <span className="text-red-600">
                                                ✗ Belum
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="text-purple-500 bg-purple-100 p-3 rounded-full">
                                    <QrisIcon className="h-6 w-6" />
                                </div>
                            </div>
                            <Link
                                className={`mt-4 inline-block font-medium text-sm ${
                                    isProfileVerified
                                        ? "text-blue-600 hover:text-blue-800"
                                        : "text-gray-400 cursor-not-allowed"
                                }`}
                                as={isProfileVerified ? "a" : "div"}
                                href={
                                    isProfileVerified
                                        ? "/qris/upload"
                                        : undefined
                                }
                            >
                                {hasProfile && umkmProfile?.qris_path
                                    ? "Update QRIS"
                                    : "Upload QRIS"}{" "}
                                →
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Aksi Cepat
                        </h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {isProfileVerified ? (
                                <Link
                                    href={route("umkm.products")}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition group"
                                >
                                    <div className="text-purple-600 mr-3">
                                        <ProductIcon className="w-7 h-7 transition-transform group-hover:scale-110" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Kelola Produk
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Tambah/edit produk
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                                    <div className="text-gray-400 mr-3">
                                        <ProductIcon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            Kelola Produk
                                        </p>
                                        <p className="text-sm">
                                            Verifikasi profil dulu
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Link
                                href="/"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition group"
                            >
                                <div className="text-orange-600 mr-3">
                                    <HomeIcon className="w-7 h-7 transition-transform group-hover:scale-110" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Lihat Public
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Halaman depan
                                    </p>
                                </div>
                            </Link>

                            {umkmProfile?.status === "verified" ? (
                                <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed">
                                    <div className="text-gray-400 mr-3">
                                        <SettingsIcon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">
                                            Profile Setup
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Profil terkunci
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={route("umkm.profile.setup")}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition group"
                                >
                                    <div className="text-blue-600 mr-3">
                                        <SettingsIcon className="w-7 h-7 transition-transform group-hover:scale-110" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Profile Setup
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Atur profil UMKM
                                        </p>
                                    </div>
                                </Link>
                            )}

                            <Link
                                href="/events"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition group"
                            >
                                <div className="text-green-600 mr-3">
                                    <TicketIcon className="w-7 h-7 transition-transform group-hover:scale-110" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Daftar Event
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Ikut event bazar
                                    </p>
                                </div>
                            </Link>

                            {isProfileVerified ? (
                                <Link
                                    href={route("umkm.tickets")}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition group"
                                >
                                    <div className="text-teal-600 mr-3">
                                        <TicketIcon className="w-7 h-7 transition-transform group-hover:scale-110" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            E-Ticket Saya
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Lihat tiket event
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                                    <div className="text-gray-400 mr-3">
                                        <TicketIcon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            E-Ticket Saya
                                        </p>
                                        <p className="text-sm">
                                            Verifikasi profil dulu
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Events Section */}
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
                                                    event.tanggal_mulai
                                                )}{" "}
                                                -{" "}
                                                {formatDate(
                                                    event.tanggal_selesai
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
