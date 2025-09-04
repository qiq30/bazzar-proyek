// File: resources/js/Layouts/PublicLayout.jsx

import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
// --- Impor ikon yang dibutuhkan ---
import {
    FiMenu,
    FiX,
    FiHome,
    FiGrid,
    FiLogOut,
    FiLogIn,
    FiUserPlus,
} from "react-icons/fi";

export default function PublicLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getDashboardRoute = () => {
        if (!user) return "/";
        if (user.is_super_admin) return route("superadmin.dashboard");
        if (user.is_admin) return route("admin.dashboard");
        if (user.is_penyelenggara) return route("penyelenggara.dashboard");
        return route("dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" className="flex items-center space-x-4">
                            <img
                                src="/images/Banjarmasin-A-Thousand-River-City-Logo.png"
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

                        {/* --- Desktop Menu with Icons --- */}
                        <nav className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/"
                                className="flex items-center gap-2 font-medium text-gray-600 hover:text-blue-600"
                            >
                                <FiHome />
                                <span>Beranda</span>
                            </Link>
                            {user ? (
                                <>
                                    <Link
                                        href={getDashboardRoute()}
                                        className="flex items-center gap-2 font-medium text-gray-600 hover:text-blue-600"
                                    >
                                        <FiGrid />
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700"
                                    >
                                        <FiLogOut />
                                        <span>Logout</span>
                                    </Link>
                                </>
                            ) : (
                                // --- ▼▼▼ PERBAIKAN DI SINI (MENU DESKTOP) ▼▼▼ ---
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route("login")}
                                        className="flex items-center gap-2 font-medium text-gray-600 hover:text-blue-600"
                                    >
                                        <FiLogIn />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        href={route("register.wizard", {
                                            role: "umkm",
                                        })}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-200"
                                    >
                                        <FiUserPlus />
                                        <span>Daftar UMKM</span>
                                    </Link>
                                    <Link
                                        href={route("register.wizard", {
                                            role: "penyelenggara",
                                        })}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700"
                                    >
                                        <span>Jadi Penyelenggara</span>
                                    </Link>
                                </div>
                                // --- ▲▲▲ AKHIR PERBAIKAN ---
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? (
                                    <FiX className="h-6 w-6" />
                                ) : (
                                    <FiMenu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Mobile Menu Dropdown with Icons --- */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t py-4 px-4 space-y-4">
                        <Link
                            href="/"
                            className="flex items-center gap-3 font-medium text-gray-600 hover:text-blue-600"
                        >
                            <FiHome />
                            <span>Beranda</span>
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    href={getDashboardRoute()}
                                    className="flex items-center gap-3 font-medium text-gray-600 hover:text-blue-600"
                                >
                                    <FiGrid />
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex items-center justify-center gap-2 w-full text-center px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700"
                                >
                                    <FiLogOut />
                                    <span>Logout</span>
                                </Link>
                            </>
                        ) : (
                            // --- ▼▼▼ PERBAIKAN DI SINI (MENU MOBILE) ▼▼▼ ---
                            <>
                                <Link
                                    href={route("login")}
                                    className="flex items-center gap-3 font-medium text-gray-600 hover:text-blue-600"
                                >
                                    <FiLogIn />
                                    <span>Login</span>
                                </Link>
                                <Link
                                    href={route("register.wizard", {
                                        role: "umkm",
                                    })}
                                    className="flex items-center gap-3 font-medium text-gray-600 hover:text-blue-600"
                                >
                                    <FiUserPlus />
                                    <span>Daftar sebagai UMKM</span>
                                </Link>
                                <Link
                                    href={route("register.wizard", {
                                        role: "penyelenggara",
                                    })}
                                    className="flex items-center justify-center gap-2 w-full text-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700"
                                >
                                    <span>Jadi Penyelenggara</span>
                                </Link>
                            </>
                            // --- ▲▲▲ AKHIR PERBAIKAN ---
                        )}
                    </div>
                )}
            </header>

            <main className="flex-grow">{children}</main>

            <footer className="bg-white border-t mt-12">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                    &copy; {new Date().getFullYear()} Pemerintah Kota
                    Banjarmasin. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
