// resources/js/Pages/Admin/PublishEventForm.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function PublishEventForm({ auth, proposals }) {
    const [selectedProposal, setSelectedProposal] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        proposal_id: "",
        nama_event: "",
        deskripsi_event: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        lokasi_event: "",
        biaya_pendaftaran_umkm: 0,
        kuota_umkm: 0,
        status: "upcoming",
    });

    useEffect(() => {
        if (selectedProposal) {
            setData({
                ...data,
                proposal_id: selectedProposal.id,
                nama_event: selectedProposal.nama_event,
                deskripsi_event: selectedProposal.deskripsi_event,
                tanggal_mulai: selectedProposal.tanggal_mulai.split("T")[0],
                tanggal_selesai: selectedProposal.tanggal_selesai.split("T")[0],
                lokasi_event: selectedProposal.lokasi_event,
                biaya_pendaftaran_umkm: selectedProposal.biaya_pendaftaran_umkm,
                kuota_umkm: selectedProposal.kuota_umkm,
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
                                        {/* Field-field form yang terisi otomatis */}
                                        <div>
                                            <label className="block text-sm font-medium">
                                                Nama Event
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
                                                className="mt-1 w-full rounded-md"
                                                required
                                            />
                                        </div>
                                        {}
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
