// resources/js/Pages/Public/UMKMDetailPage.jsx

import { Head, Link } from "@inertiajs/react";
import QRISCard from "@/Components/QRISCard";

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
        <>
            <Head title={`${umkm.business_name} - Detail UMKM`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-10">
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

                            <button
                                onClick={() => window.history.back()}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                ← Kembali
                            </button>
                        </div>
                    </div>
                </header>

                {/* UMKM Profile Section */}
                <section className="py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {/* Header Card */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
                                <div className="flex items-center space-x-6">
                                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center p-1">
                                        {umkm.logo_url ? (
                                            <img
                                                src={umkm.logo_url}
                                                alt={umkm.business_name}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="text-blue-600 text-3xl">
                                                🏪
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">
                                            {umkm.business_name}
                                        </h2>
                                        <p className="text-blue-100 mb-2">
                                            {umkm.business_type}
                                        </p>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-blue-100">
                                            <span>👤 {umkm.user.name}</span>
                                            {umkm.user.phone && (
                                                <span>
                                                    📞 {umkm.user.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className="p-8">
                                <div className="grid lg:grid-cols-2 gap-8">
                                    {/* Business Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Tentang Usaha
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">
                                                    Deskripsi
                                                </label>
                                                <p className="mt-1 text-gray-900">
                                                    {umkm.description}
                                                </p>
                                            </div>
                                            {umkm.address && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">
                                                        Alamat
                                                    </label>
                                                    <p className="mt-1 text-gray-900 flex items-start">
                                                        <span className="mr-2 mt-1">
                                                            📍
                                                        </span>
                                                        {umkm.address}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* QRIS Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Pembayaran Digital
                                        </h3>
                                        <QRISCard umkm={umkm} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                {umkm.products && umkm.products.length > 0 && (
                    <section className="pb-12">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
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
                                                    {product.description}
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
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
