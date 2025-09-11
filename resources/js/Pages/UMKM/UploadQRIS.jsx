// resources/js/Pages/UMKM/UploadQRIS.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";

export default function UploadQRIS({ auth, umkmProfile }) {
    const [qrisPreview, setQrisPreview] = useState(
        umkmProfile?.qris_url || null
    );

    const { data, setData, post, processing, errors, progress } = useForm({
        qris: null,
    });

    const handleQrisChange = (e) => {
        const file = e.target.files[0];
        setData("qris", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setQrisPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("umkm.qris.store"));
    };

    if (!umkmProfile) {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Upload QRIS
                    </h2>
                }
            >
                <Head title="Upload QRIS" />

                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <div className="text-red-500 text-6xl mb-4">
                                    ⚠️
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Profile UMKM Belum Dibuat
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Anda perlu membuat profile UMKM terlebih
                                    dahulu sebelum dapat mengupload QRIS.
                                </p>
                                <a
                                    href="/profile/setup"
                                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Buat Profile UMKM
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Upload QRIS
                </h2>
            }
        >
            <Head title="Upload QRIS" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Upload Kode QRIS
                                </h3>
                                <p className="text-gray-600">
                                    Upload kode QRIS untuk memudahkan pembayaran
                                    digital dari pelanggan.
                                </p>
                            </div>

                            {/* Info Section */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-blue-900 mb-2">
                                    💡 Tips Upload QRIS:
                                </h4>
                                <ul className="text-blue-800 text-sm space-y-1">
                                    <li>
                                        • Pastikan gambar QRIS jelas dan tidak
                                        buram
                                    </li>
                                    <li>• Format yang didukung: JPG, PNG</li>
                                    <li>• Maksimal ukuran file 2MB</li>
                                    <li>
                                        • QRIS harus dalam kondisi aktif dan
                                        valid
                                    </li>
                                </ul>
                            </div>

                            <form onSubmit={submit}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Upload Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-4">
                                            File QRIS *
                                        </label>

                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition relative">
                                            {qrisPreview ? (
                                                <div className="space-y-4">
                                                    <img
                                                        src={qrisPreview}
                                                        alt="QRIS Preview"
                                                        className="mx-auto max-h-64 w-auto object-contain border rounded-lg"
                                                    />
                                                    <div className="space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setQrisPreview(
                                                                    umkmProfile?.qris_url ||
                                                                        null
                                                                );
                                                                setData(
                                                                    "qris",
                                                                    null
                                                                );
                                                            }}
                                                            className="text-red-600 text-sm hover:text-red-800"
                                                        >
                                                            Reset
                                                        </button>
                                                        <span className="text-gray-400">
                                                            |
                                                        </span>
                                                        <label className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer">
                                                            Ganti File
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={
                                                                    handleQrisChange
                                                                }
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-gray-400 text-6xl mb-4">
                                                        📱
                                                    </div>
                                                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                        Upload Kode QRIS
                                                    </h4>
                                                    <p className="text-gray-600 mb-4">
                                                        Klik atau drag & drop
                                                        file QRIS Anda di sini
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        JPG, PNG (Maks. 2MB)
                                                    </p>
                                                </div>
                                            )}

                                            {!qrisPreview && (
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleQrisChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    required
                                                />
                                            )}
                                        </div>

                                        {errors.qris && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.qris}
                                            </p>
                                        )}
                                    </div>

                                    {/* Info Section */}
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">
                                            Informasi QRIS
                                        </h4>

                                        <div className="space-y-4 text-sm">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h5 className="font-medium text-gray-900 mb-2">
                                                    Apa itu QRIS?
                                                </h5>
                                                <p className="text-gray-600">
                                                    QRIS (Quick Response Code
                                                    Indonesian Standard) adalah
                                                    sistem pembayaran digital
                                                    yang memungkinkan pelanggan
                                                    membayar menggunakan
                                                    berbagai aplikasi e-wallet.
                                                </p>
                                            </div>

                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <h5 className="font-medium text-green-900 mb-2">
                                                    Keuntungan QRIS:
                                                </h5>
                                                <ul className="text-green-800 space-y-1">
                                                    <li>
                                                        • Pembayaran lebih cepat
                                                        dan mudah
                                                    </li>
                                                    <li>
                                                        • Mendukung semua
                                                        e-wallet populer
                                                    </li>
                                                    <li>
                                                        • Transaksi tercatat
                                                        otomatis
                                                    </li>
                                                    <li>
                                                        • Mengurangi kontak
                                                        fisik
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="bg-purple-50 p-4 rounded-lg">
                                                <h5 className="font-medium text-purple-900 mb-2">
                                                    Aplikasi yang Didukung:
                                                </h5>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                                                        OVO
                                                    </span>
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                                        GoPay
                                                    </span>
                                                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                                                        DANA
                                                    </span>
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                                        ShopeePay
                                                    </span>
                                                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                                                        LinkAja
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                {progress && (
                                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-blue-700">
                                                Mengupload QRIS...
                                            </span>
                                            <span className="text-sm text-blue-700">
                                                {progress.percentage}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-blue-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${progress.percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Buttons */}
                                <div className="flex justify-between mt-8">
                                    <Link
                                        href={route("umkm.dashboard")}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Kembali
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing || !data.qris}
                                        className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing
                                            ? "Mengupload..."
                                            : umkmProfile?.qris_path
                                            ? "Update QRIS"
                                            : "Upload QRIS"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
