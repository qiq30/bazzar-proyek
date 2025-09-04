// File: resources/js/Pages/Public/UMKMDetailPage.jsx

import { Head, Link } from "@inertiajs/react";
import PublicLayout from "@/Layouts/PublicLayout"; // <-- Gunakan layout baru
import QRISCard from "@/Components/QRISCard";
import { FiUser, FiPhone, FiMapPin, FiShoppingBag } from "react-icons/fi"; // <-- Impor ikon

export default function UMKMDetailPage({ umkm }) {
    /**
     * Helper function to format number into Indonesian Rupiah currency format.
     */
    const formatRupiah = (number) => {
        if (number === null || number === undefined) return "";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <PublicLayout>
            <Head title={`${umkm.business_name} - Detail UMKM`} />

            <div className="bg-gray-50">
                {/* Header Section */}
                <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-1 shadow-md flex-shrink-0">
                                {umkm.logo_url ? (
                                    <img
                                        src={umkm.logo_url}
                                        alt={umkm.business_name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <FiShoppingBag className="text-blue-500 text-5xl" />
                                )}
                            </div>
                            <div>
                                <p className="text-blue-200 font-semibold">
                                    {umkm.business_type}
                                </p>
                                <h1 className="text-3xl md:text-4xl font-bold mb-1">
                                    {umkm.business_name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-blue-100">
                                    <span className="flex items-center gap-2">
                                        <FiUser /> {umkm.user.name}
                                    </span>
                                    {umkm.user.phone && (
                                        <span className="flex items-center gap-2">
                                            <FiPhone /> {umkm.user.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Kolom Kiri: Info dan Produk */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Tentang Usaha */}
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Tentang Usaha
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {umkm.description ||
                                            "Tidak ada deskripsi."}
                                    </p>
                                    {umkm.address && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="mt-1 text-gray-800 flex items-start gap-3">
                                                <FiMapPin className="text-gray-400 mt-1 flex-shrink-0" />
                                                <span>{umkm.address}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Produk Unggulan */}
                                {umkm.products && umkm.products.length > 0 && (
                                    <div className="bg-white p-6 rounded-lg shadow-sm">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                            Produk Unggulan ✨
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {umkm.products.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="border rounded-lg overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105 flex flex-col"
                                                >
                                                    <img
                                                        src={
                                                            product.image_url ||
                                                            "https://via.placeholder.com/300x200?text=Produk"
                                                        }
                                                        alt={product.name}
                                                        className="w-full h-48 object-cover bg-gray-100"
                                                    />
                                                    <div className="p-4 flex flex-col flex-grow">
                                                        <h4 className="font-semibold text-gray-800 truncate">
                                                            {product.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mt-2 flex-grow">
                                                            {
                                                                product.description
                                                            }
                                                        </p>
                                                        {product.price && (
                                                            <p className="text-green-600 font-bold mt-2 text-lg">
                                                                {formatRupiah(
                                                                    product.price
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Kolom Kanan: QRIS */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-28">
                                    <QRISCard umkm={umkm} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
