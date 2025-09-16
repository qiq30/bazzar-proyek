// resources/js/Pages/UMKM/EventRegistration.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage, router, useForm } from "@inertiajs/react"; // Ditambah useForm
import { useEffect, useState, useMemo, useCallback } from "react";
import Modal from "@/Components/Modal"; // Ditambahkan
import ReCAPTCHA from "react-google-recaptcha"; // Ditambahkan

// --- Komponen Peringatan Waktu --- (TIDAK BERUBAH)
const TimeMismatchWarning = ({ onDismiss }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm relative">
        <h4 className="font-bold">Peringatan Ketidaksesuaian Waktu</h4>
        <p className="mt-1 text-sm">
            Waktu di perangkat Anda tampaknya tidak sinkron dengan waktu server
            kami. Hal ini dapat menyebabkan masalah saat mendaftar.
        </p>
        <p className="mt-2 text-sm">
            <b>
                Tolong sesuaikan tanggal dan waktu di perangkat Anda agar sesuai
                dengan waktu saat ini untuk melanjutkan.
            </b>{" "}
            Jangan memanipulasi tanggal.
        </p>
        <button
            onClick={onDismiss}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    </div>
);

// Komponen ProfileActionNotice (TIDAK BERUBAH)
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

// --- ▼▼▼ PENAMBAHAN BARU: Komponen Modal Konfirmasi Pendaftaran ▼▼▼ ---
const RegistrationConfirmationModal = ({
    event,
    onClose,
    recaptchaSiteKey,
}) => {
    const { post, processing, errors, setData, data } = useForm({
        payment_confirmation: "",
        "g-recaptcha-response": "",
    });

    const amount = event.biaya_pendaftaran_umkm || 0;
    const amountString = String(amount);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("umkm.events.register", event.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Modal show={true} onClose={onClose} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Konfirmasi Akhir Pendaftaran
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Anda akan mendaftar untuk event:
                    <br />
                    <strong className="text-lg">"{event.nama_event}"</strong>
                </p>

                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">Total Nilai Pendaftaran:</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                        }).format(amount)}
                    </p>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                    <p className="font-bold">Peringatan</p>
                    <p className="text-sm">
                        Tindakan ini tidak dapat dibatalkan setelah diproses.
                        Pastikan semua data sudah benar.
                    </p>
                </div>

                <div className="mt-6">
                    <label
                        htmlFor="payment_confirmation"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Untuk menyetujui, silakan ketik total nilai pendaftaran
                        tanpa titik atau koma ({amountString}) di bawah ini.
                    </label>
                    <input
                        id="payment_confirmation"
                        type="text"
                        value={data.payment_confirmation}
                        onChange={(e) =>
                            setData("payment_confirmation", e.target.value)
                        }
                        className={`mt-1 block w-full rounded-md ${
                            errors.payment_confirmation
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        required
                    />
                    {errors.payment_confirmation && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.payment_confirmation}
                        </p>
                    )}
                </div>

                <div className="mt-6">
                    <ReCAPTCHA
                        sitekey={recaptchaSiteKey}
                        onChange={(token) =>
                            setData("g-recaptcha-response", token)
                        }
                    />
                    {errors["g-recaptcha-response"] && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors["g-recaptcha-response"]}
                        </p>
                    )}
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
                        disabled={processing}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={processing}
                    >
                        {processing ? "Memproses..." : "Ya, Lanjutkan"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
// --- ▲▲▲ AKHIR DARI PENAMBAHAN BARU ---

export default function EventRegistration({
    auth,
    events,
    registrationStatus,
    hasProfile,
    isVerified,
    serverTime,
}) {
    const [isTimeMismatched, setIsTimeMismatched] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    // --- ▼▼▼ PENAMBAHAN BARU ▼▼▼ ---
    const [confirmingEvent, setConfirmingEvent] = useState(null); // State untuk modal
    const { recaptcha_v2_site_key } = usePage().props;
    // --- ▲▲▲ AKHIR DARI PENAMBAHAN BARU ---

    // Fungsi lama handleSafeRegisterClick dihapus karena sekarang digantikan oleh modal

    useEffect(() => {
        // Fungsi untuk memeriksa perbedaan waktu
        const checkTime = () => {
            const serverTimestamp = new Date(serverTime).getTime();
            const clientTimestamp = Date.now();
            const timeDifference = Math.abs(serverTimestamp - clientTimestamp);
            const mismatched = timeDifference > 300000; // Toleransi 5 menit

            setIsTimeMismatched(mismatched);
            // Hanya tampilkan peringatan jika waktu tidak cocok
            if (mismatched) {
                setShowWarning(true);
            }
        };

        // Periksa waktu saat komponen pertama kali dimuat
        checkTime();

        // Set interval untuk memeriksa waktu setiap 10 detik.
        const intervalId = setInterval(checkTime, 10000);

        // Hentikan interval saat komponen dilepas untuk mencegah kebocoran memori
        return () => clearInterval(intervalId);
    }, [serverTime]);

    useEffect(() => {
        if (auth.user) {
            const channel = window.Echo.private(`user.${auth.user.id}`);
            channel.listen("RegistrationStatusUpdated", (e) => {
                router.reload({ only: ["events", "registrationStatus"] });
            });
            return () => {
                channel.stopListening("RegistrationStatusUpdated");
            };
        }
    }, [auth.user]);

    // --- ▼▼▼ PENAMBAHAN BARU: Fungsi untuk membuka modal ▼▼▼ ---
    const handleRegisterClick = (event) => {
        if (isTimeMismatched) {
            alert(
                "Waktu pada perangkat Anda tidak sesuai. Mohon perbaiki sebelum mendaftar."
            );
            return;
        }
        setConfirmingEvent(event);
    };
    // --- ▲▲▲ AKHIR DARI PENAMBAHAN BARU ---

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
        if (!config) return null;
        if (config.component) return config.component;

        return (
            <div
                className={`flex items-center justify-between text-center px-6 py-4 border-t ${config.className}`}
            >
                <span className="font-semibold">{config.text}</span>
                <span className="text-xs">{config.note}</span>
            </div>
        );
    };

    // Loading Spinner Component
    const LoadingSpinner = () => (
        <span className="flex items-center justify-center">
            <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            Memproses...
        </span>
    );

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
                    {showWarning && (
                        <TimeMismatchWarning
                            onDismiss={() => setShowWarning(false)}
                        />
                    )}
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
                                    const now = new Date(serverTime);
                                    const startDate = new Date(
                                        event.pendaftaran_dibuka
                                    );
                                    const endDate = new Date(
                                        event.pendaftaran_ditutup
                                    );
                                    endDate.setHours(23, 59, 59, 999);
                                    const isRegistrationOpen =
                                        now >= startDate && now <= endDate;
                                    const isRegistrationUpcoming =
                                        now < startDate;

                                    const isButtonDisabled =
                                        isTimeMismatched ||
                                        isQuotaFull ||
                                        !isRegistrationOpen;

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
                                                            <button
                                                                onClick={() =>
                                                                    // --- ▼▼▼ PERUBAHAN DI SINI ▼▼▼ ---
                                                                    handleRegisterClick(
                                                                        event
                                                                    )
                                                                } // --- ▲▲▲ AKHIR PERUBAHAN ▲▲▲ ---
                                                                className={`w-full block px-4 py-2 text-white text-center rounded-lg transition ${
                                                                    isButtonDisabled
                                                                        ? "bg-gray-400 cursor-not-allowed opacity-50"
                                                                        : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                                                                }`}
                                                                disabled={
                                                                    isButtonDisabled
                                                                }
                                                                aria-disabled={
                                                                    isButtonDisabled
                                                                }
                                                                style={{
                                                                    pointerEvents:
                                                                        isButtonDisabled
                                                                            ? "none"
                                                                            : "auto",
                                                                    userSelect:
                                                                        "none",
                                                                }}
                                                                type="button"
                                                            >
                                                                {isTimeMismatched
                                                                    ? "Perbaiki Waktu Perangkat Anda"
                                                                    : `Daftar Sekarang (${formatRupiah(
                                                                          event.biaya_pendaftaran_umkm
                                                                      )})`}
                                                            </button>
                                                        ) : isRegistrationUpcoming ? (
                                                            <div className="w-full block px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg">
                                                                <p className="text-sm font-semibold">
                                                                    Pendaftaran
                                                                    akan dibuka
                                                                    pada:
                                                                </p>
                                                                <p className="text-xs">
                                                                    {formatDate(
                                                                        event.pendaftaran_dibuka
                                                                    )}
                                                                </p>
                                                            </div>
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
            {confirmingEvent && (
                <RegistrationConfirmationModal
                    event={confirmingEvent}
                    onClose={() => setConfirmingEvent(null)}
                    recaptchaSiteKey={recaptcha_v2_site_key}
                />
            )}
        </AuthenticatedLayout>
    );
}
