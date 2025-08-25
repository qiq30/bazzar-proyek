// resources/js/Pages/Public/HomePage.jsx

import { Head, Link, usePage, router } from "@inertiajs/react";
import EventCard from "@/Components/EventCard";
import { useState, useEffect, Fragment } from "react";
import { Transition } from "@headlessui/react";

// Komponen untuk Hero Section yang dinamis (tidak ada perubahan)
const HeroSection = ({ auth }) => {
    if (!auth.user) {
        return null;
    }
    let title, description, link, linkText;
    if (auth.user.is_admin) {
        title = `Selamat Datang, Admin ${auth.user.name}!`;
        description =
            "Kelola semua event, pengguna, dan proposal dari dasbor utama Anda.";
        link = route("admin.dashboard");
        linkText = "Buka Dashboard Admin";
    } else if (auth.user.is_penyelenggara) {
        title = `Selamat Datang, Penyelenggara ${auth.user.name}!`;
        description =
            "Siap untuk membuat event selanjutnya? Ajukan proposal Anda sekarang.";
        link = route("penyelenggara.proposal.create");
        linkText = "Buat Proposal Event";
    } else {
        title = `Selamat Datang, ${auth.user.name}!`;
        description =
            "Temukan peluang baru dan kembangkan bisnis Anda dengan mengikuti event bazar terbaik di kota ini.";
        link = "#events";
        linkText = "Lihat Event Tersedia";
    }
    return (
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-bold mb-4">{title}</h2>
                <p className="text-xl mb-8 opacity-90">{description}</p>
                <Link
                    href={link}
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                    {linkText}
                </Link>
            </div>
        </section>
    );
};

export default function HomePage({ events, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (status !== (filters.status || "")) {
            const query = { status };
            if (search) query.search = search;
            router.get(route("home"), query, {
                preserveState: true,
                replace: true,
            });
        }
    }, [status]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = { search };
        if (status) query.status = status;
        router.get(route("home"), query, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatusFilter = (newStatus) => {
        setStatus((currentStatus) =>
            currentStatus === newStatus ? "" : newStatus
        );
    };

    return (
        <>
            <Head title="Event Bazar UMKM - Pemko Banjarmasin" />

            <div className="min-h-screen bg-gray-50">
                {/* Header (tidak ada perubahan) */}
                <header className="bg-white shadow-sm sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-start items-center py-4 space-x-4">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setMenuOpen(true)}
                                    className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                                >
                                    <span className="sr-only">Buka menu</span>
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                            </div>
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
                        </div>
                    </div>
                </header>

                {/* Menu Slide-Out dari Kiri dengan Ikon */}
                <Transition show={menuOpen} as={Fragment}>
                    <div
                        className="relative z-40"
                        role="dialog"
                        aria-modal="true"
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div
                                className="fixed inset-0 bg-black bg-opacity-40"
                                onClick={() => setMenuOpen(false)}
                            />
                        </Transition.Child>

                        <div className="fixed inset-0 flex justify-start">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <div className="relative w-72 max-w-[80vw] bg-white shadow-xl flex flex-col">
                                    <div className="flex items-center justify-between px-4 py-3 border-b">
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Menu
                                        </h2>
                                        <button
                                            onClick={() => setMenuOpen(false)}
                                            className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                        >
                                            <span className="sr-only">
                                                Tutup menu
                                            </span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* 🔽 PERUBAHAN DI SINI: Link Navigasi dengan Emoji 🔽 */}
                                    <nav className="flex-1 px-2 py-4 space-y-2">
                                        {auth.user ? (
                                            <>
                                                <Link
                                                    href={
                                                        auth.user.is_admin
                                                            ? route(
                                                                  "admin.dashboard"
                                                              )
                                                            : auth.user
                                                                  .is_penyelenggara
                                                            ? route(
                                                                  "penyelenggara.dashboard"
                                                              )
                                                            : route("dashboard")
                                                    }
                                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                                >
                                                    <span className="mr-3 text-xl">
                                                        🏠
                                                    </span>
                                                    <span>Dashboard</span>
                                                </Link>
                                                <Link
                                                    href={route("logout")}
                                                    method="post"
                                                    as="button"
                                                    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                                >
                                                    <span className="mr-3 text-xl">
                                                        🚪
                                                    </span>
                                                    <span>Logout</span>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href={route("login")}
                                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                                >
                                                    <span className="mr-3 text-xl">
                                                        🔑
                                                    </span>
                                                    <span>Login</span>
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "register.wizard",
                                                        { role: "umkm" }
                                                    )}
                                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                                >
                                                    <span className="mr-3 text-xl">
                                                        🏪
                                                    </span>
                                                    <span>
                                                        Daftar sebagai UMKM
                                                    </span>
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "register.wizard",
                                                        {
                                                            role: "penyelenggara",
                                                        }
                                                    )}
                                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                                >
                                                    <span className="mr-3 text-xl">
                                                        🎪
                                                    </span>
                                                    <span>
                                                        Daftar sebagai
                                                        Penyelenggara
                                                    </span>
                                                </Link>
                                            </>
                                        )}
                                    </nav>
                                    {/* 🔼 AKHIR PERUBAHAN 🔼 */}
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Transition>

                <HeroSection auth={auth} />

                <section id="events" className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                Temukan Event Bazar
                            </h3>
                            <p className="text-lg text-gray-600">
                                Cari dan ikuti event yang paling sesuai untuk
                                bisnis Anda.
                            </p>
                        </div>

                        <div className="mb-10 p-6 bg-white rounded-lg shadow-md">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="grid md:grid-cols-3 gap-4 items-center"
                            >
                                <div className="md:col-span-2 flex">
                                    <input
                                        type="text"
                                        placeholder="Cari nama, lokasi, atau deskripsi event..."
                                        className="w-full px-4 py-3 border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700"
                                    >
                                        Cari
                                    </button>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStatusFilter("active")
                                        }
                                        className={`w-full py-3 rounded-lg font-semibold transition ${
                                            status === "active"
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    >
                                        Aktif
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStatusFilter("upcoming")
                                        }
                                        className={`w-full py-3 rounded-lg font-semibold transition ${
                                            status === "upcoming"
                                                ? "bg-yellow-500 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                    >
                                        Akan Datang
                                    </button>
                                </div>
                            </form>
                        </div>

                        {events && events.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {events.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">
                                    🧐
                                </div>
                                <h4 className="text-xl font-semibold text-gray-600 mb-2">
                                    Event Tidak Ditemukan
                                </h4>
                                <p className="text-gray-500">
                                    Coba ubah kata kunci pencarian atau filter
                                    Anda.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <footer className="bg-gray-800 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <p className="text-sm">
                                    © {new Date().getFullYear()} Pemerintah Kota
                                    Banjarmasin. All rights reserved.
                                </p>
                            </div>
                            <div className="flex space-x-6">
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    Tentang
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    Kontak
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    Bantuan
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
