import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    FiFileText,
    FiUser,
    FiCheck,
    FiX,
    FiAlertCircle,
} from "react-icons/fi";

// Komponen Modal yang sama
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

export default function ProposalDocumentReview({ auth, proposal }) {
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        document_rejection_reason: "",
    });

    const handleApprove = () => {
        if (
            confirm(`Setujui dokumen untuk proposal "${proposal.nama_event}"?`)
        ) {
            post(
                route("admin.proposals.document.approve", {
                    event: proposal.hashid,
                })
            );
        }
    };

    const openRejectModal = () => {
        reset("document_rejection_reason");
        setIsRejectModalOpen(true);
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        post(
            route("admin.proposals.document.reject", {
                event: proposal.hashid,
            }),
            { onSuccess: () => setIsRejectModalOpen(false) }
        );
    };

    return (
        <>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Tinjau Dokumen Proposal
                    </h2>
                }
            >
                <Head title={`Tinjau Dokumen - ${proposal.nama_event}`} />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 grid md:grid-cols-2 gap-8">
                                {/* Kolom Kiri: Informasi dan Aksi */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {proposal.nama_event}
                                        </h3>
                                        <p className="flex items-center gap-2 text-gray-600 mt-2">
                                            <FiUser /> Diajukan oleh:{" "}
                                            <strong>
                                                {proposal.user.name}
                                            </strong>
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-r-lg">
                                        <div className="flex">
                                            <div className="py-1">
                                                <FiAlertCircle className="h-5 w-5 text-blue-500 mr-3" />
                                            </div>
                                            <div>
                                                <p className="font-bold">
                                                    Tugas Anda
                                                </p>
                                                <p className="text-sm">
                                                    Periksa kelengkapan dan
                                                    kelayakan dokumen proposal.
                                                    Jika disetujui,
                                                    penyelenggara dapat
                                                    melanjutkan ke tahap
                                                    pengisian detail event.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-4 pt-4 border-t">
                                        <button
                                            onClick={handleApprove}
                                            disabled={processing}
                                            className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:opacity-50"
                                        >
                                            <FiCheck /> Setujui Dokumen
                                        </button>
                                        <button
                                            onClick={openRejectModal}
                                            disabled={processing}
                                            className="flex-1 inline-flex justify-center items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 disabled:opacity-50"
                                        >
                                            <FiX /> Tolak Dokumen
                                        </button>
                                    </div>
                                    <Link
                                        href={route("admin.proposals.list")}
                                        className="inline-block mt-4 text-sm text-blue-600 hover:underline"
                                    >
                                        &larr; Kembali ke daftar proposal
                                    </Link>
                                </div>

                                {/* Kolom Kanan: Tampilan PDF */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                                        Dokumen Proposal
                                    </h4>
                                    <iframe
                                        src={route(
                                            "admin.secure.proposal.doc",
                                            {
                                                event: proposal.hashid,
                                            }
                                        )}
                                        className="w-full h-[70vh] rounded-lg border"
                                        title="Dokumen Proposal"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <Modal
                show={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
            >
                <form onSubmit={handleRejectSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Tolak Dokumen Proposal
                    </h2>
                    <p className="text-sm text-gray-600">
                        Berikan alasan penolakan. Informasi ini akan dikirimkan
                        ke penyelenggara.
                    </p>
                    <div>
                        <label
                            htmlFor="document_rejection_reason"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Alasan Penolakan *
                        </label>
                        <textarea
                            id="document_rejection_reason"
                            rows="4"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            value={data.document_rejection_reason}
                            onChange={(e) =>
                                setData(
                                    "document_rejection_reason",
                                    e.target.value
                                )
                            }
                            required
                        ></textarea>
                        {errors.document_rejection_reason && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.document_rejection_reason}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setIsRejectModalOpen(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            {processing ? "Memproses..." : "Kirim Penolakan"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
