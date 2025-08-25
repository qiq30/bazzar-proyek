// resources/js/Pages/Panitia/Dashboard.jsx

import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";

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

        // 🔽 PERUBAHAN LOGIKA DI SINI 🔽
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
            .then((response) => {
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
                <h3 className="text-lg font-semibold">Check-in Peserta</h3>
                <form onSubmit={handleSearch} className="mt-4">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-2 rounded-lg"
                        placeholder="Masukkan PIN atau Nama UMKM..."
                        disabled={isLoading}
                    />
                </form>
            </div>
            <div className="p-6 min-h-[250px] flex items-center justify-center">
                {isLoading ? (
                    <p>Loading...</p>
                ) : result ? (
                    <div className="w-full space-y-4 text-center">
                        <p className="text-2xl font-bold">
                            {result.umkm_profile.business_name}
                        </p>
                        <div className="flex justify-around">
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
                                <p
                                    className={`text-xl font-bold ${
                                        result.status === "sudah_check_in"
                                            ? "text-green-600"
                                            : "text-orange-500"
                                    }`}
                                >
                                    {result.status
                                        .replace("_", " ")
                                        .toUpperCase()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckIn}
                            disabled={result.status !== "approved"}
                            className="w-full py-3 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                        >
                            {result.status === "sudah_check_in"
                                ? "✓ SUDAH CHECK-IN"
                                : "Check-in Sekarang"}
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-500">{message}</p>
                )}
            </div>
        </div>
    );
};

const ParticipantListSection = ({ registrations }) => (
    <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Daftar Semua Peserta</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3 px-6 text-left">Nama UMKM</th>
                        <th className="py-3 px-6 text-left">Nomor Stand</th>
                        <th className="py-3 px-6 text-left">Status Check-in</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {registrations.map((reg) => (
                        <tr key={reg.id}>
                            <td className="py-4 px-6 font-medium">
                                {reg.umkm_profile.business_name}
                            </td>
                            <td className="py-4 px-6">{reg.nomor_stand}</td>
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
        <div className="min-h-screen bg-gray-100">
            <Head title={`Panitia - ${event.nama_event}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 flex justify-between items-center">
                        <div className="text-left">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Dashboard Panitia
                            </h1>
                            <h2 className="text-xl font-medium text-blue-600">
                                {event.nama_event}
                            </h2>
                        </div>
                        <Link
                            href={route("panitia.logout")}
                            method="post"
                            as="button"
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
                        >
                            Keluar
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <p className="text-sm font-medium text-gray-600">
                                Total Peserta Terdaftar
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {participants.length}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <p className="text-sm font-medium text-gray-600">
                                Peserta Sudah Check-in
                            </p>
                            <p className="text-3xl font-bold text-green-600">
                                {checkedInCount}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-2 flex space-x-2">
                        <button
                            onClick={() => setActiveTab("checkin")}
                            className={`w-full py-2 rounded-md font-semibold ${
                                activeTab === "checkin"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            Check-in Peserta
                        </button>
                        <button
                            onClick={() => setActiveTab("list")}
                            className={`w-full py-2 rounded-md font-semibold ${
                                activeTab === "list"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            Lihat Semua Peserta
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
