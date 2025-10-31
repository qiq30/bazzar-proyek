import React from "react";
import { Link, Head } from "@inertiajs/react";

export default function Error({ status }) {
    const titles = {
        503: "503: Layanan Tidak Tersedia",
        500: "500: Kesalahan Server",
        403: "403: Akses Ditolak",
        404: "404: Halaman Tidak Ditemukan",
    };

    const descriptions = {
        503: "Maaf, kami sedang melakukan pemeliharaan. Silakan periksa kembali sebentar lagi.",
        500: "Ups! Terjadi kesalahan di server kami. Kami akan segera memperbaikinya.",
        403: "Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.",
        404: "Maaf, halaman yang Anda cari tidak dapat ditemukan.",
    };

    const title = titles[status] || "Terjadi Kesalahan";
    const description =
        descriptions[status] || "Terjadi kesalahan yang tidak terduga.";

    return (
        <>
            <Head title={title} />
            <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
                        {status}
                    </h1>
                    <h2 className="mt-4 text-2xl font-semibold">{title}</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
