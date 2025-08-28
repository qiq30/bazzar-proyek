// resources/js/Pages/Admin/ProposalDetail.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

const Modal = ({ show, onClose, children }) => {
    if (!show) return null;
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default function ProposalDetail({ auth, proposal }) {
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    // Form untuk aksi penolakan
    const {
        data,
        setData,
        post: postReject,
        processing: processingReject,
        errors,
        reset,
    } = useForm({
        rejection_reason: "",
    });

    // --- ▼▼▼ PERBAIKAN DI SINI ▼▼▼ ---
    // Buat form terpisah khusus untuk aksi persetujuan
    const { post: postApprove, processing: processingApprove } = useForm();

    const handleApprove = () => {
        if (confirm(`Yakin ingin menyetujui event "${proposal.nama_event}"?`)) {
            postApprove(route("admin.proposals.approve", proposal.id));
        }
    };
    // --- ▲▲▲ AKHIR DARI PERBAIKAN ---

    const openRejectModal = () => {
        reset("rejection_reason");
        setIsRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setIsRejectModalOpen(false);
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        postReject(route("admin.proposals.reject", proposal.id), {
            onSuccess: () => closeRejectModal(),
        });
    };

    const formatRupiah = (number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);

    return (
        <>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Proposal: {proposal.nama_event}
                    </h2>
                }
            >
                <Head title="Detail Proposal Event" />
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8 grid md:grid-cols-3 gap-8">
                            {/* Kolom Kiri: Poster */}
                            <div className="md:col-span-1">
                                {proposal.poster_event ? (
                                    <img
                                        src={`/storage/${proposal.poster_event}`}
                                        alt="Poster Event"
                                        className="rounded-lg w-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-500">
                                            No Image
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Kolom Kanan: Detail Info */}
                            <div className="md:col-span-2 space-y-4">
                                <div>
                                    <span className="font-bold">
                                        Penyelenggara:
                                    </span>{" "}
                                    {proposal.user.name}
                                </div>
                                <div>
                                    <span className="font-bold">
                                        Deskripsi:
                                    </span>{" "}
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
                                    {formatRupiah(
                                        proposal.biaya_pendaftaran_umkm
                                    )}
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

                                {proposal.status_proposal ===
                                    "menunggu_persetujuan" && (
                                    <div className="flex space-x-4 pt-4 border-t">
                                        <button
                                            onClick={handleApprove}
                                            disabled={
                                                processingApprove ||
                                                processingReject
                                            }
                                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                        >
                                            Setujui Proposal
                                        </button>
                                        <button
                                            onClick={openRejectModal}
                                            disabled={
                                                processingApprove ||
                                                processingReject
                                            }
                                            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Tolak Proposal
                                        </button>
                                    </div>
                                )}

                                <Link
                                    href={route("admin.proposals.list")}
                                    className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700"
                                >
                                    &larr; Kembali ke daftar proposal
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <Modal show={isRejectModalOpen} onClose={closeRejectModal}>
                <form onSubmit={handleRejectSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Tolak Proposal Event
                    </h2>
                    <p className="text-sm text-gray-600">
                        Berikan alasan mengapa proposal ini ditolak. Alasan ini
                        akan dikirimkan ke penyelenggara.
                    </p>
                    <div>
                        <label
                            htmlFor="rejection_reason"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Alasan Penolakan *
                        </label>
                        <textarea
                            id="rejection_reason"
                            rows="4"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.rejection_reason}
                            onChange={(e) =>
                                setData("rejection_reason", e.target.value)
                            }
                            required
                        ></textarea>
                        {errors.rejection_reason && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.rejection_reason}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={closeRejectModal}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processingReject}
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            {processingReject
                                ? "Memproses..."
                                : "Tolak & Arsipkan"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
