// resources/js/Pages/Panitia/Dashboard.jsx

import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";

// --- Komponen Ikon SVG ---
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

// ... Sisa komponen (StatusBadge) tidak berubah ...
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
    const [message, setMessage] = useState(
        "Silakan cari peserta menggunakan PIN atau Nama UMKM."
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;
        setIsLoading(true);
        setResult(null);
        setMessage("Mencari...");

        axios
            .post(`/panitia/${event.id}/search`, { term: searchTerm })
            .then((response) => {
                setResult(response.data);
                if (!response.data) {
                    setMessage(`Data untuk "${searchTerm}" tidak ditemukan.`);
                }
            })
            .catch(() => setMessage("Terjadi kesalahan saat mencari data."))
            .finally(() => setIsLoading(false));
    };

    const handleCheckIn = () => {
        if (!result) return;
        setIsLoading(true);

        axios
            .post(`/panitia/check-in/${result.id}`)
            .then(() => {
                setResult((prev) => ({ ...prev, status: "sudah_check_in" }));
                setMessage("Check-in Berhasil!");
            })
            .catch((error) =>
                setMessage(error.response?.data?.message || "Gagal check-in.")
            )
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                    Check-in Peserta
                </h3>
                <form onSubmit={handleSearch} className="mt-4 relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-base border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Masukkan PIN atau Nama UMKM..."
                        disabled={isLoading}
                    />
                </form>
            </div>
            <div className="p-6 min-h-[250px] flex flex-col items-center justify-center bg-gray-50">
                {isLoading ? (
                    <div className="text-center text-gray-500">
                        <svg
                            className="animate-spin h-8 w-8 text-blue-600 mx-auto"
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
                        <p className="mt-2">Mencari...</p>
                    </div>
                ) : result ? (
                    <div className="w-full text-center bg-white p-6 rounded-lg border">
                        <p className="text-sm text-gray-500">Nama UMKM</p>
                        <p className="text-3xl font-bold text-blue-600 mb-4">
                            {result.umkm_profile.business_name}
                        </p>
                        <div className="grid grid-cols-2 gap-4 border-t border-b py-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Nomor Stand
                                </p>
                                <p className="text-3xl font-bold text-gray-800">
                                    {result.nomor_stand}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <StatusBadge status={result.status} />
                            </div>
                        </div>
                        <button
                            onClick={handleCheckIn}
                            disabled={result.status !== "approved"}
                            className="w-full py-3 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {result.status === "sudah_check_in"
                                ? "✓ Sudah Check-in"
                                : "Check-in Sekarang"}
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <SearchIcon className="h-12 w-12 mx-auto text-gray-300" />
                        <p className="mt-2">{message}</p>
                    </div>
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
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama UMKM
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nomor Stand
                        </th>
                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status Check-in
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {registrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-gray-50">
                            <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
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

export default function PanitiaDashboard({ event }) {
    const [activeTab, setActiveTab] = useState("checkin");
    const participants = event.event_registrations.filter(
        (reg) => reg.status === "approved" || reg.status === "sudah_check_in"
    );
    const checkedInCount = participants.filter(
        (p) => p.status === "sudah_check_in"
    ).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={`Panitia - ${event.nama_event}`} />
            <div className="py-8">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
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
