// resources/js/Pages/Admin/PublishEventForm.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function PublishEventForm({ auth, proposals }) {
    const [selectedProposal, setSelectedProposal] = useState(null);

    // --- ▼▼▼ PERUBAHAN STATE FORM ▼▼▼ ---
    // State disederhanakan, namun akan diisi lengkap oleh useEffect
    const { data, setData, post, processing, errors, reset } = useForm({
        proposal_id: "",
        nama_event: "",
        deskripsi_event: "",
        status: "upcoming",
        // Field lain akan ditambahkan secara dinamis
    });
    // --- ▲▲▲ AKHIR DARI PERUBAHAN ---

    useEffect(() => {
        if (selectedProposal) {
            setData({
                // Isi semua data dari proposal, meskipun tidak semua ditampilkan
                proposal_id: selectedProposal.id,
                nama_event: selectedProposal.nama_event,
                deskripsi_event: selectedProposal.deskripsi_event,
                pendaftaran_dibuka: selectedProposal.pendaftaran_dibuka,
                pendaftaran_ditutup: selectedProposal.pendaftaran_ditutup,
                tanggal_mulai_acara: selectedProposal.tanggal_mulai_acara,
                tanggal_selesai_acara: selectedProposal.tanggal_selesai_acara,
                lokasi_event: selectedProposal.lokasi_event,
                biaya_pendaftaran_umkm: selectedProposal.biaya_pendaftaran_umkm,
                kuota_umkm: selectedProposal.kuota_umkm,
                status: "upcoming", // Default status saat terbit
            });
        } else {
            reset();
        }
    }, [selectedProposal]);

    const handleSelectProposal = (e) => {
        const proposalId = e.target.value;
        const proposal = proposals.find((p) => p.id == proposalId);
        setSelectedProposal(proposal || null);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.events.publish.store"));
    };

    // Helper untuk format Rupiah
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
                    Terbitkan Event dari Proposal
                </h2>
            }
        >
            <Head title="Terbitkan Event" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium">
                                    Pilih Proposal yang Disetujui *
                                </label>
                                <select
                                    onChange={handleSelectProposal}
                                    className="mt-1 w-full rounded-md"
                                    required
                                >
                                    <option value="">
                                        -- Pilih Proposal --
                                    </option>
                                    {proposals.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nama_event} (oleh {p.user.name})
                                        </option>
                                    ))}
                                </select>
                                {errors.proposal_id && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.proposal_id}
                                    </p>
                                )}
                            </div>

                            {selectedProposal && (
                                <>
                                    <div className="border-t pt-6 space-y-6">
                                        {/* --- ▼▼▼ FORM DISEMPURNAKAN DI SINI ▼▼▼ --- */}
                                        <div>
                                            <label className="block text-sm font-medium">
                                                Nama Event (dapat disesuaikan)
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nama_event}
                                                onChange={(e) =>
                                                    setData(
                                                        "nama_event",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 w-full rounded-md bg-gray-50"
                                            />
                                            {errors.nama_event && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.nama_event}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium">
                                                Deskripsi Event (dapat
                                                disesuaikan)
                                            </label>
                                            <textarea
                                                rows="4"
                                                value={data.deskripsi_event}
                                                onChange={(e) =>
                                                    setData(
                                                        "deskripsi_event",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 w-full rounded-md bg-gray-50"
                                            ></textarea>
                                            {errors.deskripsi_event && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.deskripsi_event}
                                                </p>
                                            )}
                                        </div>

                                        {/* Tampilkan data lain sebagai informasi (read-only) */}
                                        <div className="p-4 bg-gray-100 rounded-lg space-y-2 text-sm">
                                            <p>
                                                <strong>Lokasi:</strong>{" "}
                                                {selectedProposal.lokasi_event}
                                            </p>
                                            <p>
                                                <strong>Pendaftaran:</strong>{" "}
                                                {new Date(
                                                    selectedProposal.pendaftaran_dibuka
                                                ).toLocaleDateString(
                                                    "id-ID"
                                                )}{" "}
                                                -{" "}
                                                {new Date(
                                                    selectedProposal.pendaftaran_ditutup
                                                ).toLocaleDateString("id-ID")}
                                            </p>
                                            <p>
                                                <strong>Acara:</strong>{" "}
                                                {new Date(
                                                    selectedProposal.tanggal_mulai_acara
                                                ).toLocaleDateString(
                                                    "id-ID"
                                                )}{" "}
                                                -{" "}
                                                {new Date(
                                                    selectedProposal.tanggal_selesai_acara
                                                ).toLocaleDateString("id-ID")}
                                            </p>
                                            <p>
                                                <strong>Biaya:</strong>{" "}
                                                {formatRupiah(
                                                    selectedProposal.biaya_pendaftaran_umkm
                                                )}
                                            </p>
                                            <p>
                                                <strong>Kuota:</strong>{" "}
                                                {selectedProposal.kuota_umkm}{" "}
                                                UMKM
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium">
                                                Status Saat Terbit *
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) =>
                                                    setData(
                                                        "status",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 w-full rounded-md"
                                            >
                                                <option value="upcoming">
                                                    Akan Datang
                                                </option>
                                                <option value="active">
                                                    Langsung Aktif
                                                </option>
                                            </select>
                                        </div>
                                        {/* --- ▲▲▲ AKHIR DARI PENYEMPURNAAN --- */}
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-green-600 text-white rounded-md"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Menerbitkan..."
                                                : "Terbitkan Event"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
