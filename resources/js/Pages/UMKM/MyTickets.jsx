import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import html2canvas from "html2canvas";
import { useRef } from "react";

const ETicketCard = ({ ticket, ticketRef }) => {
    // Tentukan warna dan teks banner berdasarkan status tiket
    const isCheckedIn = ticket.status === "sudah_check_in";
    const bannerClass = isCheckedIn ? "bg-gray-500" : "bg-green-500";
    const bannerText = isCheckedIn
        ? "RIWAYAT CHECK-IN"
        : "PENDAFTARAN BERHASIL";

    return (
        <div
            ref={ticketRef}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        >
            <div className="p-6 bg-blue-600 text-white">
                <h3 className="text-2xl font-bold">
                    {ticket.event.nama_event}
                </h3>
                {/* --- ▼▼▼ PERBAIKAN DI SINI ▼▼▼ --- */}
                <p className="opacity-90">
                    {new Date(
                        ticket.event.tanggal_mulai_acara
                    ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
                {/* --- ▲▲▲ AKHIR DARI PERBAIKAN --- */}
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Nama UMKM</p>
                    <p className="font-bold text-lg">
                        {ticket.umkm_profile.business_name}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Nomor Stand</p>
                        <p className="font-bold text-3xl tracking-wider">
                            {ticket.nomor_stand}
                        </p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">
                            Kode Verifikasi / PIN
                        </p>
                        <p className="font-bold text-3xl tracking-wider">
                            {ticket.kode_pin}
                        </p>
                    </div>
                </div>
            </div>
            <div
                className={`px-6 py-4 text-white text-center font-bold text-xl tracking-widest transition-colors ${bannerClass}`}
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

        const canvas = await html2canvas(element, { scale: 2 }); // Tingkatkan skala untuk kualitas lebih baik
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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {tickets.length > 0 ? (
                        <div className="space-y-8">
                            {tickets.map((ticket) => (
                                <div key={ticket.id}>
                                    <ETicketCard
                                        ticket={ticket}
                                        ticketRef={ticketRefs[ticket.id]}
                                    />
                                    <div className="mt-4">
                                        <button
                                            onClick={() =>
                                                handleDownloadImage(ticket)
                                            }
                                            className="w-full block text-center py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                                        >
                                            Unduh E-Ticket (Gambar)
                                        </button>
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
