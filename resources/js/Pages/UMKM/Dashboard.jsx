// File: resources/js/Pages/UMKM/Dashboard.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";

export default function Dashboard({
    auth,
    hasProfile,
    umkmProfile,
    registeredEvents = [],
}) {
    const isProfileVerified = hasProfile && umkmProfile?.status === "verified";

    // ... sisa kode komponen tidak ada perubahan ...
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
                                <div className="text-blue-600 text-3xl">👤</div>
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
                                <div className="text-green-600 text-3xl">
                                    📅
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
                                <div className="text-purple-600 text-3xl">
                                    📱
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
                            {/* Kondisi untuk menonaktifkan Kelola Produk */}
                            {isProfileVerified ? (
                                <Link
                                    href={route("umkm.products")}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition group"
                                >
                                    <div className="text-purple-600 text-2xl mr-3 group-hover:scale-110 transition-transform">
                                        🛍️
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
                                    <div className="text-gray-400 text-2xl mr-3">
                                        🛍️
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
                                <div className="text-orange-600 text-2xl mr-3 group-hover:scale-110 transition-transform">
                                    🏠
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
                                    <div className="text-gray-400 text-2xl mr-3">
                                        ⚙️
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
                                    <div className="text-blue-600 text-2xl mr-3 group-hover:scale-110 transition-transform">
                                        ⚙️
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
                                <div className="text-green-600 text-2xl mr-3 group-hover:scale-110 transition-transform">
                                    🎪
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

                            {/* TOMBOL E-TICKET BARU DENGAN LOGIKA YANG BENAR  */}
                            {isProfileVerified ? (
                                <Link
                                    href={route("umkm.tickets")}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition group"
                                >
                                    <div className="text-teal-600 text-2xl mr-3 group-hover:scale-110 transition-transform">
                                        🎟️
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
                                    <div className="text-gray-400 text-2xl mr-3">
                                        🎟️
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
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex-1">
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
                                        <div className="ml-4">
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
