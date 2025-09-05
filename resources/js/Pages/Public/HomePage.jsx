// File: resources/js/Pages/Public/HomePage.jsx

import { Head, Link, usePage, router } from "@inertiajs/react";
import EventCard from "@/Components/EventCard";
import { useState, useEffect } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { FiSearch } from "react-icons/fi";

// Komponen untuk Hero Section yang dinamis
const HeroSection = () => {
    const { auth } = usePage().props;

    if (!auth.user) {
        // Hero for guests
        return (
            <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Wadah Kreatif, Wadah Usaha
                    </h2>
                    <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                        Digital website bazar Banjarmasin hadir gasan UMKM
                        supaya makin maju, gasan penyelenggara supaya bisa
                        ngatur acara bamanfaat, lawan gasan masyarakat umum
                        supaya bisa marasai raminya, manungkar, lawan balilihat
                        bazar UMKM Online
                    </p>
                </div>
            </section>
        );
    }

    // Hero for logged-in users
    let title, description, link, linkText;
    if (auth.user.is_super_admin) {
        title = `Selamat Datang, Super Admin!`;
        description = "Anda memiliki kontrol penuh atas sistem.";
        link = route("superadmin.dashboard");
        linkText = "Buka Dashboard Super Admin";
    } else if (auth.user.is_admin) {
        title = `Selamat Datang, Admin ${auth.user.name}!`;
        description =
            "Kelola semua event, pengguna, dan proposal dari dasbor utama Anda.";
        link = route("admin.dashboard");
        linkText = "Buka Dashboard Admin";
    } else if (auth.user.is_penyelenggara) {
        title = `Selamat Datang, Penyelenggara!`;
        description =
            "Siap untuk membuat event selanjutnya? Ajukan proposal Anda sekarang.";
        link = route("penyelenggara.dashboard");
        linkText = "Buka Dashboard";
    } else {
        title = `Selamat Datang, ${auth.user.name}!`;
        description =
            "Temukan peluang baru dan kembangkan bisnis Anda di sini.";
        link = route("umkm.dashboard");
        linkText = "Lihat Dashboard Saya";
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
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");

    useEffect(() => {
        // Hindari pemanggilan ganda saat pertama kali render
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
        <PublicLayout>
            <Head title="Event Bazar UMKM - Pemko Banjarmasin" />

            <HeroSection />

            <section id="events" className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Temukan Event Bazar
                        </h3>
                        <p className="text-lg text-gray-600">
                            Cari dan ikuti event yang paling sesuai untuk bisnis
                            Anda.
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
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <FiSearch />
                                    <span>Cari</span>
                                </button>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={() => handleStatusFilter("active")}
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
                            <FiSearch className="text-gray-300 text-6xl mb-4 mx-auto" />
                            <h4 className="text-xl font-semibold text-gray-600 mb-2">
                                Event Tidak Ditemukan
                            </h4>
                            <p className="text-gray-500">
                                Coba ubah kata kunci pencarian atau filter Anda.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
