// File: resources/js/Components/ImpersonateBanner.jsx

import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function ImpersonateBanner() {
    // Ambil status 'impersonating' dari props yang dibagikan oleh Inertia
    const { impersonating } = usePage().props;

    // Jika tidak dalam mode impersonate, jangan tampilkan apa-apa
    if (!impersonating) {
        return null;
    }

    // Jika dalam mode impersonate, tampilkan banner peringatan
    return (
        <div className="bg-yellow-400 text-yellow-900 font-bold p-3 w-full text-center z-50 animate-pulse-slow">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <FiAlertTriangle className="mr-3 h-5 w-5" />
                    <span>
                        Anda saat ini masuk sebagai pengguna lain. Sesi ini
                        hanya untuk tujuan dukungan.
                    </span>
                </div>
                <Link
                    href={route("superadmin.impersonate.stop")}
                    method="post"
                    as="button"
                    className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-900 bg-yellow-300 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                    <FiX className="mr-1 h-4 w-4" />
                    Kembali ke Akun Super Admin
                </Link>
            </div>
        </div>
    );
}
