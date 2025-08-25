// resources/js/Pages/Public/UMKMDirectoryPage.jsx

import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function UMKMDirectoryPage({ event, umkmProfiles }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("");

    // Filter UMKM berdasarkan pencarian dan jenis usaha
    const filteredUmkm = umkmProfiles.filter((umkm) => {
        const matchesSearch =
            umkm.business_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            // Tambahkan pengecekan untuk memastikan deskripsi tidak null
            (umkm.description &&
                umkm.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));
        const matchesType =
            selectedType === "" || umkm.business_type === selectedType;
        return matchesSearch && matchesType;
    });

    // Dapatkan jenis usaha unik
    const businessTypes = [
        ...new Set(umkmProfiles.map((umkm) => umkm.business_type)),
    ];

    return (
        <>
            {}
            <Head title={`Peserta UMKM - ${event.nama_event}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <Link
                                href="/"
                                className="flex items-center space-x-4"
                            >
                                <img
                                    src="/images/logo-banjarmasin.png"
                                    alt="Logo Pemko Banjarmasin"
                                    className="h-12 w-auto"
                                />
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Event Bazar UMKM
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Pemerintah Kota Banjarmasin
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/"
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                ← Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Event Header */}
                <section className="bg-blue-600 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {}
                        <h2 className="text-3xl font-bold mb-2">
                            {event.nama_event}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-blue-100">
                            <span>
                                📅{" "}
                                {new Date(
                                    event.tanggal_mulai
                                ).toLocaleDateString("id-ID")}{" "}
                                -{" "}
                                {new Date(
                                    event.tanggal_selesai
                                ).toLocaleDateString("id-ID")}
                            </span>
                            <span>📍 {event.lokasi_event}</span>
                            <span>👥 {umkmProfiles.length} UMKM Terdaftar</span>
                        </div>
                    </div>
                </section>

                {/* Search & Filter */}
                <section className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Cari nama UMKM atau produk..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                                            {umkm.logo_url ? (
                                                <img
                                                    src={umkm.logo_url}
                                                    alt={umkm.business_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-gray-400 text-4xl">
                                                    🏪
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                {umkm.business_name}
                                            </h3>
                                            <p className="text-sm text-blue-600 mb-2">
                                                {umkm.business_type}
                                            </p>
                                            <p className="text-gray-600 text-sm line-clamp-3">
                                                {umkm.description}
                                            </p>
                                            <div className="mt-3 flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    Klik untuk detail
                                                </span>
                                                {umkm.qris_url && (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                        QRIS Ready
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">
                                    🔍
                                </div>
                                <h4 className="text-xl font-semibold text-gray-600 mb-2">
                                    Tidak Ada UMKM Ditemukan
                                </h4>
                                <p className="text-gray-500">
                                    Coba ubah kata kunci pencarian atau filter
                                    yang Anda gunakan.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}
