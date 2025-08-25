// resources/js/Pages/Penyelenggara/ProposalDetail.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function ProposalDetail({ auth, proposal }) {
    const formatRupiah = (number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);

    const statusConfig = {
        menunggu_persetujuan: {
            text: "Menunggu Persetujuan",
            className: "bg-yellow-100 text-yellow-800",
        },
        disetujui: {
            text: "Disetujui",
            className: "bg-green-100 text-green-800",
        },
        ditolak: { text: "Ditolak", className: "bg-red-100 text-red-800" },
    };

    const currentStatus = statusConfig[proposal.status_proposal] || {
        text: "Unknown",
        className: "bg-gray-100",
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail Proposal Anda
                </h2>
            }
        >
            <Head title={`Detail Proposal - ${proposal.nama_event}`} />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8 grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <img
                                src={`/storage/${proposal.poster_event}`}
                                alt="Poster Event"
                                className="rounded-lg w-full object-cover"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold">
                                    {proposal.nama_event}
                                </h3>
                                <div className="mt-2">
                                    <span
                                        className={`px-3 py-1 text-sm font-semibold rounded-full ${currentStatus.className}`}
                                    >
                                        {currentStatus.text}
                                    </span>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <span className="font-bold">Deskripsi:</span>{" "}
                                {proposal.deskripsi_event}
                            </div>
                            <div>
                                <span className="font-bold">Lokasi:</span>{" "}
                                {proposal.lokasi_event}
                            </div>
                            <div>
                                <span className="font-bold">Tanggal:</span>{" "}
                                {new Date(
                                    proposal.tanggal_mulai
                                ).toLocaleDateString("id-ID")}{" "}
                                s/d{" "}
                                {new Date(
                                    proposal.tanggal_selesai
                                ).toLocaleDateString("id-ID")}
                            </div>
                            <div>
                                <span className="font-bold">
                                    Biaya Pendaftaran:
                                </span>{" "}
                                {formatRupiah(proposal.biaya_pendaftaran_umkm)}
                            </div>
                            <div>
                                <span className="font-bold">Kuota:</span>{" "}
                                {proposal.kuota_umkm} UMKM
                            </div>
                            <hr />
                            <h4 className="font-bold text-lg">
                                Info Pembayaran
                            </h4>
                            <div>
                                <span className="font-bold">Bank:</span>{" "}
                                {proposal.nama_bank_penyelenggara}
                            </div>
                            <div>
                                <span className="font-bold">No. Rekening:</span>{" "}
                                {proposal.nomor_rekening_penyelenggara}
                            </div>
                            <div>
                                <span className="font-bold">Atas Nama:</span>{" "}
                                {proposal.nama_pemilik_rekening}
                            </div>

                            <Link
                                href={route("penyelenggara.dashboard")}
                                className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700"
                            >
                                &larr; Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
