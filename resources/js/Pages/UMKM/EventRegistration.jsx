// resources/js/Pages/UMKM/EventRegistration.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

const ProfileActionNotice = ({ hasProfile }) => (
    <div className="bg-white rounded-lg shadow-sm text-center p-8">
        <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-2xl font-bold text-gray-800">
            {hasProfile
                ? "Profil Sedang Ditinjau"
                : "Satu Langkah Lagi Diperlukan"}
        </h3>
        <p className="text-gray-600 mt-2 mb-6 max-w-md mx-auto">
            {hasProfile
                ? "Profil Anda sedang kami verifikasi. Harap tunggu persetujuan dari Admin untuk dapat mendaftar event."
                : "Anda harus melengkapi profil UMKM terlebih dahulu untuk dapat mendaftar ke event yang tersedia."}
        </p>
        <Link
            href={route("umkm.profile.setup")}
            className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
            {hasProfile
                ? "Lihat Status Profil Anda"
                : "Lengkapi Profil Sekarang"}
        </Link>
    </div>
);

export default function EventRegistration({
    auth,
    events,
    registrationStatus,
    hasProfile,
    isVerified,
}) {
    useEffect(() => {
        if (auth.user) {
            const channel = window.Echo.private(`user.${auth.user.id}`);

            channel.listen("RegistrationStatusUpdated", (e) => {
                console.log("RegistrationStatusUpdated event received:", e);
                router.reload({ only: ["events", "registrationStatus"] });
            });

            return () => {
                channel.stopListening("RegistrationStatusUpdated");
            };
        }
    }, [auth.user]);

    const formatRupiah = (number) => {
        if (number === null || number === undefined || number == 0)
            return "Gratis";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const RegistrationStatusDisplay = ({ status, registrationId }) => {
        const statusConfig = {
            menunggu_pembayaran: {
                component: (
                    <div className="p-6 text-center border-t">
                        <Link
                            href={route("umkm.events.pay", {
                                registration: registrationId,
                            })}
                            className="w-full block px-4 py-2 bg-yellow-500 text-white text-center rounded-lg hover:bg-yellow-600 transition"
                        >
                            Lanjutkan Pembayaran
                        </Link>
                    </div>
                ),
            },
            pembayaran_terkonfirmasi: {
                className: "bg-purple-50 border-purple-200 text-purple-700",
                text: "✓ Pembayaran Diterima",
                note: "Menunggu persetujuan final admin.",
            },
            menunggu_konfirmasi_pembayaran: {
                className: "bg-blue-50 border-blue-200 text-blue-800",
                text: "✓ Pembayaran Diproses",
                note: "Menunggu konfirmasi penyelenggara.",
            },
            sudah_check_in: {
                className: "bg-gray-100 border-gray-300 text-gray-800",
                text: "✓ Anda Sudah Check-in",
                note: "Pendaftaran selesai.",
            },
            approved: {
                className: "bg-green-50 border-green-200 text-green-700",
                text: "✓ Pendaftaran Disetujui",
                note: "Anda terdaftar sebagai peserta.",
            },
            rejected: {
                component: (
                    <div className="p-6 text-center border-t bg-red-50 border-red-200">
                        <p className="text-sm font-bold text-red-700 mb-2">
                            ✗ Pembayaran Ditolak
                        </p>
                        <Link
                            href={route("umkm.events.pay", {
                                registration: registrationId,
                            })}
                            className="w-full block px-4 py-2 bg-red-600 text-white text-center rounded-lg hover:bg-red-700 transition"
                        >
                            Unggah Ulang Bukti Bayar
                        </Link>
                    </div>
                ),
            },
        };

        const config = statusConfig[status];

        if (!config) {
            return (
                <div className="flex items-center justify-between text-center px-6 py-4 border-t bg-gray-50 border-gray-200 text-gray-700">
                    <span className="font-semibold">
                        Status Tidak Diketahui
                    </span>
                    <span className="text-xs">Hubungi admin.</span>
                </div>
            );
        }

        if (config.component) {
            return config.component;
        }

        return (
            <div
                className={`flex items-center justify-between text-center px-6 py-4 border-t ${config.className}`}
            >
                <span className="font-semibold">{config.text}</span>
                <span className="text-xs">{config.note}</span>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Daftar Event
                </h2>
            }
        >
            <Head title="Daftar Event" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6 p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Event Bazar Tersedia
                        </h3>
                        <p className="text-gray-600">
                            Pilih event bazar yang ingin Anda ikuti. Pastikan
                            profil UMKM sudah terverifikasi.
                        </p>
                    </div>

                    {isVerified ? (
                        <div className="grid lg:grid-cols-2 gap-6">
                            {events.length > 0 ? (
                                events.map((event) => {
                                    const registrationInfo =
                                        registrationStatus[event.id];
                                    const currentRegistrationStatus =
                                        registrationInfo?.status;
                                    const registrationId = registrationInfo?.id;
                                    const isQuotaFull =
                                        event.event_registrations_count >=
                                        event.kuota_umkm;

                                    const now = new Date();
                                    const startDate = new Date(
                                        event.pendaftaran_dibuka
                                    );
                                    const endDate = new Date(
                                        event.pendaftaran_ditutup
                                    );
                                    endDate.setHours(23, 59, 59, 999);
                                    const isRegistrationOpen =
                                        now >= startDate && now <= endDate;

                                    return (
                                        <div
                                            key={event.id}
                                            className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col"
                                        >
                                            <div className="h-48 bg-gray-200">
                                                <img
                                                    src={`/storage/${event.poster_event}`}
                                                    alt={event.nama_event}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-6 flex-grow flex flex-col">
                                                <h4 className="text-xl font-semibold text-gray-900 flex-1 mr-3">
                                                    {event.nama_event}
                                                </h4>

                                                {/* --- ▼▼▼ PERBAIKAN TAMPILAN DI SINI ▼▼▼ --- */}
                                                <div className="space-y-3 my-4 text-sm text-gray-600">
                                                    <div>
                                                        <p className="font-semibold text-gray-700">
                                                            Jadwal Pendaftaran:
                                                        </p>
                                                        <div className="flex items-center">
                                                            <span className="mr-2">
                                                                📅
                                                            </span>
                                                            <span>
                                                                {formatDate(
                                                                    event.pendaftaran_dibuka
                                                                )}{" "}
                                                                -{" "}
                                                                {formatDate(
                                                                    event.pendaftaran_ditutup
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-700">
                                                            Jadwal Acara:
                                                        </p>
                                                        <div className="flex items-center">
                                                            <span className="mr-2">
                                                                🗓️
                                                            </span>
                                                            <span>
                                                                {formatDate(
                                                                    event.tanggal_mulai_acara
                                                                )}{" "}
                                                                -{" "}
                                                                {formatDate(
                                                                    event.tanggal_selesai_acara
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="mr-2">
                                                            📍
                                                        </span>
                                                        <span>
                                                            {event.lokasi_event}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="mr-2">
                                                            👥
                                                        </span>
                                                        <span>
                                                            Sisa Kuota:{" "}
                                                            {Math.max(
                                                                0,
                                                                event.kuota_umkm -
                                                                    event.event_registrations_count
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* --- ▲▲▲ AKHIR DARI PERBAIKAN --- */}

                                                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                                                    {event.deskripsi_event}
                                                </p>
                                            </div>

                                            <div className="mt-auto">
                                                {currentRegistrationStatus ? (
                                                    <RegistrationStatusDisplay
                                                        status={
                                                            currentRegistrationStatus
                                                        }
                                                        registrationId={
                                                            registrationId
                                                        }
                                                    />
                                                ) : (
                                                    <div className="p-6 text-center border-t">
                                                        {isQuotaFull ? (
                                                            <button
                                                                disabled
                                                                className="w-full block px-4 py-2 bg-red-500 text-white text-center rounded-lg cursor-not-allowed opacity-75"
                                                            >
                                                                Kuota Penuh
                                                            </button>
                                                        ) : isRegistrationOpen ? (
                                                            <Link
                                                                href={route(
                                                                    "umkm.events.register",
                                                                    event.id
                                                                )}
                                                                method="post"
                                                                as="button"
                                                                className="w-full block px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition"
                                                            >
                                                                Daftar Sekarang
                                                                (
                                                                {formatRupiah(
                                                                    event.biaya_pendaftaran_umkm
                                                                )}
                                                                )
                                                            </Link>
                                                        ) : (
                                                            <button
                                                                disabled
                                                                className="w-full block px-4 py-2 bg-gray-400 text-white text-center rounded-lg cursor-not-allowed"
                                                            >
                                                                Pendaftaran
                                                                Ditutup
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-12 text-center">
                                    <div className="text-gray-400 text-6xl mb-4">
                                        📅
                                    </div>
                                    <h4 className="text-xl font-semibold text-gray-600 mb-2">
                                        Belum Ada Event Tersedia
                                    </h4>
                                    <p className="text-gray-500">
                                        Saat ini belum ada event baru yang
                                        dibuka untuk pendaftaran. Silakan
                                        kembali lagi nanti.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <ProfileActionNotice hasProfile={hasProfile} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
