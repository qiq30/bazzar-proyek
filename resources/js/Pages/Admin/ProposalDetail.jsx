// resources/js/Pages/Admin/ProposalDetail.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function ProposalDetail({ auth, proposal }) {
    const { data, setData, post, processing } = useForm({
        status: "upcoming",
    });

    const handleApprove = () => {
        if (confirm(`Yakin ingin menyetujui event "${proposal.nama_event}"?`)) {
            post(route("admin.proposals.approve", proposal.id));
        }
    };

    const handleReject = () => {
        if (
            confirm(
                `Yakin ingin MENOLAK event "${proposal.nama_event}"? Proposal akan dihapus.`
            )
        ) {
            post(route("admin.proposals.reject", proposal.id));
        }
    };

    const formatRupiah = (number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);

    return (
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
                            <img
                                src={`/storage/${proposal.poster_event}`}
                                alt="Poster Event"
                                className="rounded-lg w-full object-cover"
                            />
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
                                Rp{" "}
                                {Number(
                                    proposal.biaya_pendaftaran_umkm
                                ).toLocaleString("id-ID")}
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

                            {}
                            {proposal.status_proposal ===
                                "menunggu_persetujuan" && (
                                <>
                                    {/* Opsi Persetujuan */}
                                    <div className="pt-4 border-t">
                                        <label className="block font-medium">
                                            Status Event Setelah Disetujui:
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            className="rounded-md mt-1"
                                        >
                                            <option value="upcoming">
                                                Akan Datang (Upcoming)
                                            </option>
                                            <option value="active">
                                                Langsung Aktif (Active)
                                            </option>
                                        </select>
                                    </div>

                                    {/* Tombol Aksi */}
                                    <div className="flex space-x-4 pt-4">
                                        <button
                                            onClick={handleApprove}
                                            disabled={processing}
                                            className="px-6 py-2 bg-green-600 text-white rounded-md"
                                        >
                                            Setujui
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            disabled={processing}
                                            className="px-6 py-2 bg-red-600 text-white rounded-md"
                                        >
                                            Tolak & Hapus
                                        </button>
                                    </div>
                                </>
                            )}
                            {}

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
    );
}
