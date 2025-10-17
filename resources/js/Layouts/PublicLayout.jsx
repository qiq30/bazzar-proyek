// File: resources/js/Layouts/PublicLayout.jsx

import Footer from "@/Components/Footer";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    FiMenu,
    FiX,
    FiHome,
    FiGrid,
    FiLogOut,
    FiLogIn,
    FiUserPlus,
    FiUser,
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
        return route("umkm.dashboard");
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
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route("login")}
                                        className="flex items-center gap-2 font-medium text-gray-600 hover:text-blue-600"
                                    >
                                        <FiLogIn />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        href={route("register.start", {
                                            role: "umkm",
                                        })}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-200"
                                    >
                                        <FiUserPlus />
                                        <span>Daftar UMKM</span>
                                    </Link>
                                    <Link
                                        href={route("register.start", {
                                            role: "penyelenggara",
                                        })}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700"
                                    >
                                        <span>Jadi Penyelenggara</span>
                                    </Link>
                                </div>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                {isMenuOpen ? (
                                    <FiX className="h-6 w-6" />
                                ) : (
                                    <FiMenu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                        isMenuOpen
                            ? "max-h-screen opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="bg-white border-t border-gray-200 shadow-lg">
                        {/* User Info Section (if logged in) */}
                        {user && (
                            <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white mr-4 shadow-md">
                                        <span className="text-lg font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-lg text-gray-900 truncate">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-600 truncate">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Links Section */}
                    <div className="py-3">
                        <div className="px-4 py-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Navigasi
                            </h3>
                        </div>
                        <div className="space-y-1">
                            <Link
                                href="/"
                                className="flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium text-gray-700 transition-all duration-200 hover:bg-blue-50"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 mr-3">
                                    <FiHome className="h-5 w-5 text-blue-600" />
                                </div>
                                <span>Beranda</span>
                            </Link>
                            {user && (
                                <Link
                                    href={getDashboardRoute()}
                                    className="flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium text-gray-700 transition-all duration-200 hover:bg-green-50"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 mr-3">
                                        <FiGrid className="h-5 w-5 text-green-600" />
                                    </div>
                                    <span>Dashboard</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Authentication Section */}
                    <div className="py-3 border-t border-gray-200 bg-gray-50">
                        <div className="px-4 py-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {user ? "Akun" : "Autentikasi"}
                            </h3>
                        </div>
                        <div className="space-y-1">
                            {user ? (
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium text-gray-700 transition-all duration-200 w-full text-left hover:bg-red-50"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 mr-3">
                                        <FiLogOut className="h-5 w-5 text-red-600" />
                                    </div>
                                    <span>Logout</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium text-gray-700 transition-all duration-200 hover:bg-green-50"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 mr-3">
                                            <FiLogIn className="h-5 w-5 text-green-600" />
                                        </div>
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        href={route("register.start", {
                                            role: "umkm",
                                        })}
                                        className="flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium text-gray-700 transition-all duration-200 hover:bg-orange-50"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 mr-3">
                                            <FiUserPlus className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <span>Daftar sebagai UMKM</span>
                                    </Link>
                                    <Link
                                        href={route("register.start", {
                                            role: "penyelenggara",
                                        })}
                                        className="flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium text-white bg-blue-600 transition-all duration-200 hover:bg-blue-700"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500 mr-3">
                                            <FiUser className="h-5 w-5 text-white" />
                                        </div>
                                        <span>Jadi Penyelenggara</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">{children}</main>

            <Footer user={user} />
        </div>
    );
}
