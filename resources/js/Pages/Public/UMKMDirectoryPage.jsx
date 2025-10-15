// File: resources/js/Pages/Public/UMKMDirectoryPage.jsx

import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import {
    FiCalendar,
    FiMapPin,
    FiUsers,
    FiSearch,
    FiShoppingBag,
} from "react-icons/fi";
import EventMap from "@/Components/EventMap";
import "leaflet/dist/leaflet.css";

export default function UMKMDirectoryPage({ event, umkmProfiles }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [activeTab, setActiveTab] = useState("details");
    const [isClient, setIsClient] = useState(false);

    // --- PERUBAHAN 1: State untuk peta maximize dipindahkan ke sini ---
    const [isMapMaximized, setIsMapMaximized] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // --- PERUBAHAN 2: Efek untuk mengunci scroll body saat peta maximize ---
    useEffect(() => {
        if (isMapMaximized) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        // Cleanup function
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isMapMaximized]);

    const hasCoordinates = event.latitude && event.longitude;

    const filteredUmkm = umkmProfiles.filter((umkm) => {
        const matchesSearch =
            umkm.business_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (umkm.description &&
                umkm.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));
        const matchesType =
            selectedType === "" || umkm.business_type === selectedType;
        return matchesSearch && matchesType;
    });

    const businessTypes = [
        ...new Set(umkmProfiles.map((umkm) => umkm.business_type)),
    ];

    return (
        <PublicLayout>
            <Head title={`Peserta UMKM - ${event.nama_event}`} />

            {/* Event Header */}
            <section className="relative z-30 bg-blue-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-4">
                        {event.nama_event}
                    </h2>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-x-8 gap-y-4 text-blue-100">
                        <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-y-3 md:gap-x-6">
                            <span className="flex items-center gap-2">
                                <FiCalendar />
                                {new Date(
                                    event.tanggal_mulai_acara
                                ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                })}{" "}
                                -{" "}
                                {new Date(
                                    event.tanggal_selesai_acara
                                ).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                            <span className="flex items-center gap-2">
                                <FiUsers /> {umkmProfiles.length} UMKM Terdaftar
                            </span>
                            <p className="font-semibold flex items-center gap-2">
                                <FiMapPin /> Lokasi Acara:
                            </p>
                        </div>

                        <div className="w-full md:max-w-md">
                            <div className="border border-blue-400 bg-blue-500/50 rounded-lg overflow-hidden shadow-lg">
                                <div className="flex border-b border-blue-400">
                                    <button
                                        onClick={() => setActiveTab("details")}
                                        className={`flex-1 p-3 text-sm font-medium text-center transition-colors duration-200 ${
                                            activeTab === "details"
                                                ? "text-white border-b-2 border-white"
                                                : "text-blue-200 hover:text-white"
                                        }`}
                                    >
                                        Detail Alamat
                                    </button>
                                    {hasCoordinates && (
                                        <button
                                            onClick={() => setActiveTab("map")}
                                            className={`flex-1 p-3 text-sm font-medium text-center transition-colors duration-200 ${
                                                activeTab === "map"
                                                    ? "text-white border-b-2 border-white"
                                                    : "text-blue-200 hover:text-white"
                                            }`}
                                        >
                                            Lihat Peta
                                        </button>
                                    )}
                                </div>

                                <div className="p-4 bg-white text-gray-800 min-h-[150px]">
                                    {activeTab === "details" && (
                                        <p>{event.lokasi_event}</p>
                                    )}
                                    {activeTab === "map" &&
                                        hasCoordinates &&
                                        isClient && (
                                            <EventMap
                                                latitude={event.latitude}
                                                longitude={event.longitude}
                                                popupText={event.nama_event}
                                                // --- PERUBAHAN 3: Kirim state dan function ke komponen EventMap ---
                                                isMaximized={isMapMaximized}
                                                setIsMaximized={
                                                    setIsMapMaximized
                                                }
                                            />
                                        )}
                                    {activeTab === "map" &&
                                        hasCoordinates &&
                                        !isClient && (
                                            <div className="text-center p-4">
                                                Memuat peta...
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PERUBAHAN 4: Sembunyikan section ini jika peta maximize --- */}
            <section
                className={`sticky top-[88px] bg-white shadow-sm border-b z-40 ${
                    isMapMaximized ? "hidden" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama UMKM atau produk..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:w-64">
                            <select
                                value={selectedType}
                                onChange={(e) =>
                                    setSelectedType(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Semua Jenis Usaha</option>
                                {businessTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* UMKM Grid */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredUmkm.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredUmkm.map((umkm) => (
                                <Link
                                    key={umkm.id}
                                    href={`/umkm/${umkm.id}`}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 group"
                                >
                                    <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {umkm.logo_url ? (
                                            <img
                                                src={umkm.logo_url}
                                                alt={umkm.business_name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <FiShoppingBag className="text-gray-300 text-6xl" />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                            {umkm.business_name}
                                        </h3>
                                        <p className="text-sm text-blue-600 font-medium mb-2">
                                            {umkm.business_type}
                                        </p>
                                        <p className="text-gray-600 text-sm line-clamp-3">
                                            {umkm.description}
                                        </p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <span className="text-xs text-blue-500 font-semibold">
                                                Lihat Detail →
                                            </span>
                                            {umkm.qris_url && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                                    QRIS Ready
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <FiSearch className="text-gray-300 text-6xl mb-4 mx-auto" />
                            <h4 className="text-xl font-semibold text-gray-600 mb-2">
                                Tidak Ada UMKM Ditemukan
                            </h4>
                            <p className="text-gray-500">
                                Coba ubah kata kunci pencarian atau filter yang
                                Anda gunakan.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
