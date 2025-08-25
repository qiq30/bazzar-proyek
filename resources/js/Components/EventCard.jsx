// resources/js/Components/EventCard.jsx

import { Link } from "@inertiajs/react";

export default function EventCard({ event }) {
    const getStatusBadge = (status) => {
        const badges = {
            upcoming: "bg-yellow-100 text-yellow-800",
            active: "bg-green-100 text-green-800",
            finished: "bg-gray-100 text-gray-800",
        };

        const statusText = {
            upcoming: "Akan Datang",
            active: "Sedang Berlangsung",
            finished: "Selesai",
        };

        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}
            >
                {statusText[status]}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Tanggal tidak valid"; // Pencegahan error
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Event Image */}
            <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                {/* 🔽 PERUBAHAN: Gunakan 'poster_event' jika ada, fallback ke 'image_url' untuk data lama 🔽 */}
                {event.poster_event ? (
                    <img
                        src={`/storage/${event.poster_event}`}
                        alt={event.nama_event}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-white text-6xl">🎪</div>
                )}
            </div>

            {/* Event Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    {/* 🔽 PERUBAHAN NAMA PROPS 🔽 */}
                    <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {event.nama_event}
                    </h4>
                    {getStatusBadge(event.status)}
                </div>

                <div className="space-y-2 mb-4">
                    {/* 🔽 PERUBAHAN NAMA PROPS 🔽 */}
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📅</span>
                        <span>
                            {formatDate(event.tanggal_mulai)} -{" "}
                            {formatDate(event.tanggal_selesai)}
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📍</span>
                        <span>{event.lokasi_event}</span>
                    </div>
                </div>

                {event.deskripsi_event && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {event.deskripsi_event}
                    </p>
                )}

                <div className="flex justify-between items-center">
                    <Link
                        href={`/events/${event.id}/umkm`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                        Lihat Peserta UMKM →
                    </Link>

                    {event.status === "active" && (
                        <span className="text-xs text-green-600 font-medium">
                            Berlangsung Sekarang
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
