// resources/js/Components/EventCard.jsx

import { Link } from "@inertiajs/react";
import { FiCalendar, FiMapPin, FiChevronsRight } from "react-icons/fi";

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
        if (!dateString) return "Tanggal tidak valid";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                {event.poster_event ? (
                    <img
                        src={route("public.event.poster", {
                            event: event.hashid,
                        })}
                        alt={event.nama_event}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <FiCalendar className="text-white text-6xl opacity-50" />
                )}
            </div>

            <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {event.nama_event}
                    </h4>
                    {getStatusBadge(event.status)}
                </div>

                <div className="space-y-3 mb-4 text-sm text-gray-600">
                    <div>
                        <p className="font-semibold text-gray-700">
                            Jadwal Pendaftaran:
                        </p>
                        <div className="flex items-center">
                            <FiCalendar className="mr-2 text-gray-500" />
                            <span>
                                {formatDate(event.pendaftaran_dibuka)} -{" "}
                                {formatDate(event.pendaftaran_ditutup)}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-700">
                            Jadwal Acara:
                        </p>
                        <div className="flex items-center">
                            <FiCalendar className="mr-2 text-gray-500" />
                            <span>
                                {formatDate(event.tanggal_mulai_acara)} -{" "}
                                {formatDate(event.tanggal_selesai_acara)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <FiMapPin className="mr-2 text-blue-600" />
                        <span>{event.lokasi_event}</span>
                    </div>
                </div>

                <div className="mt-auto flex justify-between items-center">
                    <Link
                        href={route("public.umkm.directory", event.slug)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center"
                    >
                        Lihat Peserta UMKM
                        <FiChevronsRight className="ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
