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

    const getStatusConfig = () => {
        if (
            proposal.document_verification_status ===
            "pending_document_verification"
        ) {
            return {
                text: "Verifikasi Dokumen",
                className: "bg-yellow-100 text-yellow-800",
            };
        }
        if (proposal.document_verification_status === "document_rejected") {
            return {
                text: "Dokumen Ditolak",
                className: "bg-red-100 text-red-800",
            };
        }
        if (proposal.status_proposal === "draft") {
            return {
                text: "Lengkapi Detail Event",
                className: "bg-blue-100 text-blue-800",
            };
        }
        if (proposal.status_proposal === "menunggu_persetujuan") {
            return {
                text: "Menunggu Persetujuan",
                className: "bg-yellow-100 text-yellow-800",
            };
        }
        if (proposal.status_proposal === "disetujui") {
            return {
                text: "Disetujui",
                className: "bg-green-100 text-green-800",
            };
        }
        if (proposal.status_proposal === "ditolak") {
            return { text: "Ditolak", className: "bg-red-100 text-red-800" };
        }
        return { text: "Unknown", className: "bg-gray-100" };
    };

    const currentStatus = getStatusConfig();
    const isStep1 =
        ["pending_document_verification", "document_rejected"].includes(
            proposal.document_verification_status
        ) || proposal.status_proposal === "draft";

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
                            {proposal.poster_event ? (
                                <img
                                    src={route(
                                        "penyelenggara.secure.event.poster",
                                        {
                                            event: proposal.hashid,
                                        }
                                    )}
                                    alt="Poster Event"
                                    className="rounded-lg w-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 md:h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500">
                                        {isStep1
                                            ? "Poster belum diunggah"
                                            : "No Image"}
                                    </span>
                                </div>
                            )}
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

                            {(proposal.status_proposal === "ditolak" ||
                                proposal.document_verification_status ===
                                    "document_rejected") && (
                                <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-800">
                                    <p className="font-bold">
                                        Alasan Penolakan:
                                    </p>
                                    <p className="mt-1">
                                        {proposal.rejection_reason ||
                                            proposal.document_rejection_reason}
                                    </p>
                                </div>
                            )}

                            {!isStep1 ? (
                                <>
                                    <hr />
                                    <div>
                                        <span className="font-bold">
                                            Deskripsi:
                                        </span>{" "}
                                        {proposal.deskripsi_event}
                                    </div>
                                    <div>
                                        <span className="font-bold">
                                            Lokasi:
                                        </span>{" "}
                                        {proposal.lokasi_event}
                                    </div>
                                    <div>
                                        <span className="font-bold">
                                            Jadwal Pendaftaran:
                                        </span>{" "}
                                        {new Date(
                                            proposal.pendaftaran_dibuka
                                        ).toLocaleDateString("id-ID")}{" "}
                                        s/d{" "}
                                        {new Date(
                                            proposal.pendaftaran_ditutup
                                        ).toLocaleDateString("id-ID")}
                                    </div>
                                    <div>
                                        <span className="font-bold">
                                            Jadwal Acara:
                                        </span>{" "}
                                        {new Date(
                                            proposal.tanggal_mulai_acara
                                        ).toLocaleDateString("id-ID")}{" "}
                                        s/d{" "}
                                        {new Date(
                                            proposal.tanggal_selesai_acara
                                        ).toLocaleDateString("id-ID")}
                                    </div>
                                    <div>
                                        <span className="font-bold">
                                            Biaya Pendaftaran:
                                        </span>{" "}
                                        {formatRupiah(
                                            proposal.biaya_pendaftaran_umkm
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-bold">
                                            Kuota:
                                        </span>{" "}
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
                                        <span className="font-bold">
                                            No. Rekening:
                                        </span>{" "}
                                        {proposal.nomor_rekening_penyelenggara}
                                    </div>
                                    <div>
                                        <span className="font-bold">
                                            Atas Nama:
                                        </span>{" "}
                                        {proposal.nama_pemilik_rekening}
                                    </div>
                                </>
                            ) : (
                                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800">
                                    <p className="font-bold">
                                        Menunggu Detail Event
                                    </p>
                                    <p className="text-sm mt-1">
                                        Detail lengkap event akan ditampilkan di
                                        sini setelah Anda melengkapi proposal
                                        tahap 2.
                                    </p>
                                </div>
                            )}

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
