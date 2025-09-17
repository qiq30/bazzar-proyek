// resources/js/Pages/UMKM/MyTickets.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import html2canvas from "html2canvas";
import { useRef } from "react";

const ETicketCard = ({ ticket, ticketRef }) => {
    const isCheckedIn = ticket.status === "sudah_check_in";
    const bannerClass = isCheckedIn ? "bg-slate-600" : "bg-blue-600";
    const bannerText = isCheckedIn
        ? "RIWAYAT CHECK-IN"
        : "PENDAFTARAN BERHASIL";

    const formatEventDate = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const options = { day: "numeric", month: "long", year: "numeric" };

        if (startDate.getTime() === endDate.getTime()) {
            return startDate.toLocaleDateString("id-ID", options);
        }
        return `${startDate.toLocaleDateString(
            "id-ID",
            options
        )} - ${endDate.toLocaleDateString("id-ID", options)}`;
    };

    return (
        <div
            ref={ticketRef}
            className="bg-white rounded-xl shadow-lg font-sans overflow-hidden border border-gray-200"
        >
            {/* Wrapper utama untuk layout responsif */}
            <div className="md:flex">
                {/* Bagian Informasi Utama (Kiri di desktop) */}
                <div className="p-6 md:p-8 flex-grow">
                    <div className="mb-6">
                        <p className="text-sm text-blue-600 font-semibold">
                            {formatEventDate(
                                ticket.event.tanggal_mulai_acara,
                                ticket.event.tanggal_selesai_acara
                            )}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                            {ticket.event.nama_event}
                        </h3>
                    </div>

                    <div className="mb-6">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                            Nama UMKM
                        </p>
                        <p className="font-bold text-xl text-gray-900">
                            {ticket.umkm_profile.business_name}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 text-center">
                        <div className="flex-1 bg-gray-50 p-4 rounded-lg border">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">
                                Nomor Stand
                            </p>
                            <p className="font-mono font-bold text-3xl text-gray-900 tracking-wider">
                                {ticket.nomor_stand}
                            </p>
                        </div>
                        <div className="flex-1 bg-gray-50 p-4 rounded-lg border">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">
                                Kode Verifikasi / PIN
                            </p>
                            <p className="font-mono font-bold text-3xl text-gray-900 tracking-wider">
                                {ticket.kode_pin}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Garis Pemisah (dashed) */}
                <div className="relative md:w-auto w-full">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:left-0 md:-translate-x-1/2 md:-translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full"></div>
                    <div className="border-t-2 md:border-t-0 md:border-l-2 border-dashed border-gray-300 h-full w-full"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 md:bottom-1/2 md:left-0 md:-translate-x-1/2 md:translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full"></div>
                </div>

                {/* Bagian QR Code (Kanan di desktop) */}
                <div className="p-6 md:p-8 flex flex-col items-center justify-center md:w-64 bg-gray-50">
                    <img
                        src={`data:image/svg+xml;base64,${ticket.qr_code_svg}`}
                        alt="QR Code"
                        className="w-40 h-40 mb-2 rounded-lg"
                    />
                    <p className="text-sm text-gray-600 font-mono tracking-widest">
                        {ticket.kode_pendaftaran}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Pindai kode ini saat check-in
                    </p>
                </div>
            </div>

            {/* Banner Status di bagian bawah */}
            <div
                className={`px-6 py-3 text-white text-center font-bold text-base tracking-widest transition-colors ${bannerClass}`}
            >
                {bannerText}
            </div>
        </div>
    );
};

export default function MyTickets({ auth, tickets = [] }) {
    const ticketRefs = tickets.reduce((acc, ticket) => {
        acc[ticket.id] = useRef(null);
        return acc;
    }, {});

    const handleDownloadImage = async (ticket) => {
        const element = ticketRefs[ticket.id].current;
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const dataUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `e-ticket-${ticket.event.nama_event
            .toLowerCase()
            .replace(/\s+/g, "-")}.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    E-Ticket Saya
                </h2>
            }
        >
            <Head title="E-Ticket Saya" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {tickets.length > 0 ? (
                        <div className="space-y-8">
                            {tickets.map((ticket) => (
                                <div key={ticket.id}>
                                    <ETicketCard
                                        ticket={ticket}
                                        ticketRef={ticketRefs[ticket.id]}
                                    />
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() =>
                                                handleDownloadImage(ticket)
                                            }
                                            className="w-full block text-center py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
                                        >
                                            Unduh E-Ticket (Gambar)
                                        </button>
                                        <a
                                            href={route(
                                                "umkm.tickets.download",
                                                { registration: ticket.id }
                                            )}
                                            className="w-full block text-center py-3 px-4 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-transform transform hover:scale-105"
                                        >
                                            Unduh E-Ticket (PDF)
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-12 rounded-lg shadow-sm">
                            <h3 className="text-xl font-medium text-gray-800">
                                Anda Belum Memiliki E-Ticket
                            </h3>
                            <p className="text-gray-500 mt-2">
                                Daftar ke sebuah event dan selesaikan
                                pendaftaran untuk mendapatkan E-Ticket Anda.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
