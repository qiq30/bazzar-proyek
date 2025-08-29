// resources/js/Pages/Panitia/Dashboard.jsx

import { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

// --- Komponen Ikon SVG (Tidak ada perubahan) ---
const UsersIcon = (props) => (
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
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023-.194-2.34-.974-3.32a8.963 8.963 0 00-4.962 0c-.78.98-.546 2.297.194 3.32m8.737 2.062a8.963 8.963 0 01-4.962 0m8.737 2.062a8.963 8.963 0 01-4.962 0M12 19.252a8.963 8.963 0 01-4.962 0m4.962 0a8.963 8.963 0 004.962 0M12 6.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM12 12.75a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
        />
    </svg>
);
const UserCheckIcon = (props) => (
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
            d="M9 12.75L11.25 15 15 9.75M21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m8-11a4 4 0 100-8 4 4 0 000 8z"
        />
    </svg>
);
const LogoutIcon = (props) => (
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
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
        />
    </svg>
);
const QrCodeIcon = (props) => (
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
const ListIcon = (props) => (
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
            d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
    </svg>
);
const SearchIcon = (props) => (
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
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
    </svg>
);
const Spinner = () => (
    <svg
        className="animate-spin h-5 w-5 text-white"
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
);

const StatusBadge = ({ status }) => {
    const statusConfig = {
        approved: {
            text: "Belum Check-in",
            className: "bg-yellow-100 text-yellow-800",
        },
        sudah_check_in: {
            text: "Sudah Check-in",
            className: "bg-green-100 text-green-800",
        },
        default: { text: status, className: "bg-gray-100 text-gray-800" },
    };
    const config = statusConfig[status] || statusConfig.default;
    return (
        <span
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.className}`}
        >
            {config.text}
        </span>
    );
};

const CheckInSection = ({ event }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef(null);

    useEffect(() => {
        if (isScanning) {
            // ▼▼▼ PERUBAHAN DI SINI ▼▼▼
            const config = {
                qrbox: { width: 250, height: 250 },
                fps: 10,
                // Baris ini secara eksplisit meminta kamera belakang
                facingMode: "environment",
            };
            // ▲▲▲ AKHIR PERUBAHAN ▲▲▲

            const scanner = new Html5QrcodeScanner(
                "qr-scanner-region",
                config,
                false
            );

            const onScanSuccess = (decodedText) => {
                if (!isLoading) {
                    handleSearch(decodedText);
                }
            };

            scanner.render(onScanSuccess, (error) => {});
            scannerRef.current = scanner;
        } else {
            if (
                scannerRef.current &&
                scannerRef.current.getState() !== "NOT_STARTED"
            ) {
                scannerRef.current
                    .clear()
                    .catch((err) =>
                        console.error("Error clearing scanner:", err)
                    );
            }
        }

        return () => {
            if (
                scannerRef.current &&
                scannerRef.current.getState() !== "NOT_STARTED"
            ) {
                scannerRef.current
                    .clear()
                    .catch((err) =>
                        console.error("Error clearing scanner on cleanup:", err)
                    );
            }
        };
    }, [isScanning, isLoading]);

    const handleSearch = (term) => {
        if (!term || isLoading) return;
        setIsLoading(true);
        setResult(null);
        setIsScanning(false);
        setMessage({ type: "info", text: "Mencari data..." });

        axios
            .post(route("panitia.search", { event: event.id }), { term })
            .then((response) => {
                setResult(response.data || null);
                setMessage(
                    response.data
                        ? null
                        : {
                              type: "error",
                              text: `Data "${term}" tidak ditemukan.`,
                          }
                );
            })
            .catch(() =>
                setMessage({
                    type: "error",
                    text: "Terjadi kesalahan saat mencari.",
                })
            )
            .finally(() => setIsLoading(false));
    };

    const handleCheckIn = () => {
        if (!result || result.status !== "approved" || isLoading) return;
        setIsLoading(true);
        setMessage({ type: "info", text: "Memproses check-in..." });

        axios
            .post(route("panitia.processCheckIn", { registration: result.id }))
            .then(() => {
                setResult((prev) => ({ ...prev, status: "sudah_check_in" }));
                setMessage({ type: "success", text: "Check-in Berhasil!" });
            })
            .catch((error) =>
                setMessage({
                    type: "error",
                    text: error.response?.data?.message || "Gagal check-in.",
                })
            )
            .finally(() => setIsLoading(false));
    };

    const resetState = () => {
        setResult(null);
        setMessage(null);
        setSearchTerm("");
        setIsScanning(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                    Check-in Peserta
                </h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch(searchTerm);
                    }}
                    className="mt-4 flex gap-2"
                >
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-gray-300 rounded-lg"
                        placeholder="Cari Nama / PIN..."
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !searchTerm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        <SearchIcon className="h-5 w-5" />
                    </button>
                </form>
                <div className="mt-4 border-t pt-4">
                    <button
                        onClick={() => setIsScanning((prev) => !prev)}
                        className={`w-full py-2 font-semibold rounded-lg flex items-center justify-center gap-2 ${
                            isScanning
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                    >
                        <QrCodeIcon className="h-5 w-5" />
                        {isScanning ? "Stop Scan" : "Mulai Scan QR Code"}
                    </button>
                </div>
            </div>

            {isScanning && (
                <div
                    id="qr-scanner-region"
                    className="w-full bg-gray-900"
                ></div>
            )}

            <div className="p-6 min-h-[150px]">
                {result ? (
                    <div className="w-full text-center">
                        <p className="text-sm text-gray-500">Nama UMKM</p>
                        <p className="text-2xl font-bold text-blue-600 mb-2">
                            {result.umkm_profile.business_name}
                        </p>
                        <div className="flex justify-around items-center mb-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Nomor Stand
                                </p>
                                <p className="text-2xl font-bold">
                                    {result.nomor_stand}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <StatusBadge status={result.status} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={resetState}
                                className="w-full py-3 font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleCheckIn}
                                disabled={
                                    isLoading || result.status !== "approved"
                                }
                                className="w-full py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner /> Memproses...
                                    </>
                                ) : result.status === "sudah_check_in" ? (
                                    "✓ Sudah Check-in"
                                ) : (
                                    "Konfirmasi Check-in"
                                )}
                            </button>
                        </div>
                    </div>
                ) : message ? (
                    <div
                        className={`text-center p-4 rounded-lg ${
                            message.type === "success"
                                ? "bg-green-100 text-green-800"
                                : message.type === "error"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                    >
                        <p>{message.text}</p>
                        <button
                            onClick={resetState}
                            className="mt-4 px-4 py-2 bg-white/50 rounded-lg text-sm font-semibold"
                        >
                            OK
                        </button>
                    </div>
                ) : (
                    !isScanning && (
                        <p className="text-center text-gray-500">
                            Silakan pindai QR Code atau cari peserta secara
                            manual.
                        </p>
                    )
                )}
            </div>
        </div>
    );
};

const ParticipantListSection = ({ registrations }) => (
    <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
                Daftar Semua Peserta
            </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                            Nama UMKM
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                            Nomor Stand
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-gray-50">
                            <td className="py-4 px-6 font-medium text-gray-900">
                                {reg.umkm_profile.business_name}
                            </td>
                            <td className="py-4 px-6 text-gray-700">
                                {reg.nomor_stand}
                            </td>
                            <td className="py-4 px-6">
                                <StatusBadge status={reg.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- KOMPONEN UTAMA DASHBOARD ---
export default function PanitiaDashboard({ event }) {
    const [activeTab, setActiveTab] = useState("checkin");
    const participants = event.event_registrations.filter(
        (reg) => reg.status === "approved" || reg.status === "sudah_check_in"
    );
    const checkedInCount = participants.filter(
        (p) => p.status === "sudah_check_in"
    ).length;

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={`Panitia - ${event.nama_event}`} />
            <div className="py-8">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden shadow-lg sm:rounded-lg p-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Dashboard Panitia
                            </h1>
                            <h2 className="text-xl font-medium opacity-90">
                                {event.nama_event}
                            </h2>
                        </div>
                        <Link
                            href={route("panitia.logout")}
                            method="post"
                            as="button"
                            className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/30 transition-colors"
                        >
                            <LogoutIcon className="h-5 w-5" />
                            <span>Keluar</span>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Peserta
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {participants.length}
                                </p>
                            </div>
                            <div className="text-blue-500 bg-blue-100 p-3 rounded-full">
                                <UsersIcon className="h-8 w-8" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Sudah Check-in
                                </p>
                                <p className="text-3xl font-bold text-green-600">
                                    {checkedInCount}
                                </p>
                            </div>
                            <div className="text-green-500 bg-green-100 p-3 rounded-full">
                                <UserCheckIcon className="h-8 w-8" />
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-sm p-2 flex space-x-2">
                        <button
                            onClick={() => setActiveTab("checkin")}
                            className={`w-full py-2.5 rounded-md font-semibold flex items-center justify-center space-x-2 transition-colors ${
                                activeTab === "checkin"
                                    ? "bg-blue-600 text-white shadow"
                                    : "text-gray-600 hover:bg-blue-50"
                            }`}
                        >
                            <QrCodeIcon className="h-5 w-5" />
                            <span>Check-in Peserta</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("list")}
                            className={`w-full py-2.5 rounded-md font-semibold flex items-center justify-center space-x-2 transition-colors ${
                                activeTab === "list"
                                    ? "bg-blue-600 text-white shadow"
                                    : "text-gray-600 hover:bg-blue-50"
                            }`}
                        >
                            <ListIcon className="h-5 w-5" />
                            <span>Lihat Semua Peserta</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div>
                        {activeTab === "checkin" && (
                            <CheckInSection event={event} />
                        )}
                        {activeTab === "list" && (
                            <ParticipantListSection
                                registrations={participants}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
