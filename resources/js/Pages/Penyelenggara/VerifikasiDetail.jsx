// resources/js/Pages/Penyelenggara/VerifikasiDetail.jsx

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

export default function VerifikasiDetail({ auth, registration }) {
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); // 2. State untuk modal

    const {
        data: standData,
        setData: setStandData,
        post: postStand,
        processing: processingStand,
        errors: standErrors,
    } = useForm({
        nomor_stand: registration.nomor_stand || "",
    });

    const {
        data: actionData,
        setData: setActionData,
        post: postAction,
        processing: processingAction,
        errors: actionErrors,
        reset: resetAction,
    } = useForm({
        rejection_reason: "",
    });

    const handleAssignStand = (e) => {
        e.preventDefault();
        postStand(
            route(
                "penyelenggara.pendaftar.verifikasi.assignStand",
                registration.hashid
            ),
            { preserveScroll: true }
        );
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        if (
            confirm(
                "Apakah Anda yakin ingin mengonfirmasi pembayaran ini? Pendaftar akan diteruskan ke Admin untuk persetujuan final."
            )
        ) {
            postAction(
                route(
                    "penyelenggara.pendaftar.verifikasi.confirm",
                    registration.hashid
                )
            );
        }
    };

    const openRejectModal = () => {
        resetAction("rejection_reason");
        setIsRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setIsRejectModalOpen(false);
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        postAction(
            route(
                "penyelenggara.pendaftar.verifikasi.reject",
                registration.hashid
            ),
            { onSuccess: () => closeRejectModal() }
        );
    };

    // Fungsi untuk format mata uang Rupiah
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
                        Detail Verifikasi Pembayaran
                    </h2>
                }
            >
                <Head
                    title={`Verifikasi - ${registration.umkm_profile.business_name}`}
                />

                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Kolom Kiri: Detail Informasi */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold">
                                            {
                                                registration.umkm_profile
                                                    .business_name
                                            }
                                        </h3>
                                        <p className="text-gray-500">
                                            Mendaftar untuk event "
                                            {registration.event.nama_event}"
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-bold text-lg text-blue-800">
                                            Detail Transfer
                                        </h4>
                                        <div className="mt-2 space-y-1">
                                            <p className="font-bold text-xl">
                                                Harus Dibayar:{" "}
                                                <span className="text-red-600">
                                                    {formatRupiah(
                                                        registration.event
                                                            .biaya_pendaftaran_umkm
                                                    )}
                                                </span>
                                            </p>
                                            <hr className="my-2" />
                                            <p>
                                                <strong>
                                                    Kode Pendaftaran (di Berita
                                                    Transfer):
                                                </strong>
                                            </p>
                                            <p className="font-mono text-lg bg-gray-200 p-1 rounded inline-block">
                                                {registration.kode_pendaftaran}
                                            </p>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={handleAssignStand}
                                        className="mt-6 space-y-2"
                                    >
                                        <label
                                            htmlFor="nomor_stand"
                                            className="block text-sm font-medium"
                                        >
                                            Input Nomor Stand *
                                        </label>
                                        <div className="flex items-start space-x-2">
                                            <div className="flex-grow">
                                                <input
                                                    id="nomor_stand"
                                                    type="text"
                                                    value={
                                                        standData.nomor_stand
                                                    }
                                                    onChange={(e) =>
                                                        setStandData(
                                                            "nomor_stand",
                                                            e.target.value.toUpperCase()
                                                        )
                                                    }
                                                    className="w-full rounded-md border-gray-300 shadow-sm"
                                                    placeholder="Contoh: A-01"
                                                    required
                                                />
                                                {standErrors.nomor_stand && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {
                                                            standErrors.nomor_stand
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                                                disabled={processingStand}
                                            >
                                                {processingStand
                                                    ? "..."
                                                    : "Simpan"}
                                            </button>
                                        </div>
                                    </form>

                                    <div className="flex space-x-4 mt-6">
                                        <button
                                            onClick={handleConfirm}
                                            disabled={
                                                processingAction ||
                                                !registration.nomor_stand
                                            }
                                            className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            ✅ Konfirmasi Pembayaran
                                        </button>
                                        <button
                                            onClick={openRejectModal}
                                            disabled={processingAction}
                                            className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 disabled:opacity-50"
                                        >
                                            ❌ Tolak Pembayaran
                                        </button>
                                    </div>
                                    {!registration.nomor_stand && (
                                        <p className="text-xs text-center text-orange-600">
                                            Harap input dan simpan Nomor Stand
                                            sebelum mengonfirmasi pembayaran.
                                        </p>
                                    )}

                                    <Link
                                        href={route(
                                            "penyelenggara.pendaftar.verifikasi.list"
                                        )}
                                        className="text-center block mt-4 text-sm text-blue-600 hover:underline"
                                    >
                                        &larr; Kembali ke daftar
                                    </Link>
                                </div>

                                {/* Kolom Kanan: Bukti Pembayaran */}
                                <div>
                                    <h4 className="font-bold text-lg mb-2">
                                        Bukti Transfer yang Diunggah
                                    </h4>
                                    <a
                                        href={`/storage/${registration.bukti_pembayaran_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={`/storage/${registration.bukti_pembayaran_path}`}
                                            alt="Bukti Pembayaran"
                                            className="rounded-lg w-full object-cover border"
                                            loading="lazy"
                                        />
                                    </a>
                                    <p className="text-xs text-center mt-2 text-gray-500">
                                        Klik gambar untuk melihat ukuran penuh.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

            <Modal show={isRejectModalOpen} onClose={closeRejectModal}>
                <form onSubmit={handleRejectSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Tolak Pembayaran
                    </h2>
                    <p className="text-sm text-gray-600">
                        Berikan alasan penolakan. Alasan ini akan dikirimkan
                        kepada UMKM agar mereka dapat memperbaiki dan mengunggah
                        ulang bukti pembayaran.
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
                            value={actionData.rejection_reason}
                            onChange={(e) =>
                                setActionData(
                                    "rejection_reason",
                                    e.target.value
                                )
                            }
                            required
                        ></textarea>
                        {actionErrors.rejection_reason && (
                            <p className="text-red-500 text-xs mt-1">
                                {actionErrors.rejection_reason}
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
                            disabled={processingAction}
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            {processingAction
                                ? "Memproses..."
                                : "Kirim Penolakan"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
