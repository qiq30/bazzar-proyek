import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    FiDownload,
    FiFileText,
    FiUploadCloud,
    FiCheckCircle,
    FiClipboard,
    FiCalendar,
    FiMapPin,
    FiDollarSign,
    FiUsers,
    FiCreditCard,
    FiImage,
    FiAlertCircle,
} from "react-icons/fi";

// Wizard Steps Component - Improved responsive design
const WizardSteps = ({ currentStep, completedSteps }) => {
    const steps = [
        { id: 1, name: "Unggah Dokumen", icon: FiUploadCloud },
        { id: 2, name: "Lengkapi Detail", icon: FiClipboard },
    ];

    return (
        <nav className="mb-8 px-4 sm:px-0">
            <ol className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <li
                        key={step.id}
                        className={`flex items-center ${
                            index < steps.length - 1 ? "flex-1" : ""
                        }`}
                    >
                        <div className="flex flex-col items-center">
                            <span
                                className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 transition-all duration-300 shadow-lg
                                ${
                                    completedSteps.includes(step.id)
                                        ? "bg-green-500 text-white shadow-green-200"
                                        : ""
                                }
                                ${
                                    currentStep === step.id &&
                                    !completedSteps.includes(step.id)
                                        ? "bg-blue-600 text-white shadow-blue-200"
                                        : ""
                                }
                                ${
                                    currentStep < step.id &&
                                    !completedSteps.includes(step.id)
                                        ? "bg-gray-200 text-gray-500"
                                        : ""
                                }
                            `}
                            >
                                {completedSteps.includes(step.id) ? (
                                    <FiCheckCircle className="w-6 h-6" />
                                ) : (
                                    <step.icon className="w-6 h-6" />
                                )}
                            </span>
                            <div className="mt-2 text-center">
                                <h3
                                    className={`text-sm font-semibold transition-colors ${
                                        currentStep >= step.id ||
                                        completedSteps.includes(step.id)
                                            ? "text-gray-900"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {step.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    Langkah {step.id}
                                </p>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="flex-1 mx-4 sm:mx-8">
                                <div
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        completedSteps.includes(step.id)
                                            ? "bg-green-500"
                                            : "bg-gray-200"
                                    }`}
                                />
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

// Step 1: Upload Component - Enhanced layout
const Step1Upload = ({ onStepComplete }) => {
    const { data, setData, post, processing, errors } = useForm({
        nama_event: "",
        proposal_document: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("penyelenggara.proposal.wizard.step1"), {
            onSuccess: () => {
                onStepComplete(1);
            },
        });
    };

    return (
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <FiUploadCloud className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">
                            Tahap 1: Pengajuan Awal Proposal
                        </h3>
                        <p className="mt-2 text-blue-100">
                            Isi judul event dan unggah proposal lengkap dalam
                            format PDF. Tim kami akan meninjaunya terlebih
                            dahulu.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="p-8">
                {/* Template Download Section */}
                <div className="mb-8 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6">
                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                        <div className="flex-shrink-0 rounded-lg bg-blue-100 p-3">
                            <FiDownload className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="w-full sm:w-auto sm:flex-1">
                            <h4 className="mb-2 font-semibold text-blue-900">
                                Butuh template proposal?
                            </h4>
                            <p className="mb-4 text-sm text-blue-700">
                                Unduh template standar kami untuk memastikan
                                semua informasi yang diperlukan telah tercakup.
                            </p>
                            <a
                                href={route(
                                    "penyelenggara.proposal.template.download"
                                )}
                                className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm transition-all duration-200 hover:bg-blue-50 hover:shadow-md"
                            >
                                <FiDownload className="h-4" />
                                Unduh Template PDF
                            </a>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Event Name Input */}
                    <div>
                        <label
                            htmlFor="nama_event"
                            className="block text-sm font-semibold text-gray-700 mb-3"
                        >
                            Judul Event / Nama Proposal *
                        </label>
                        <input
                            id="nama_event"
                            type="text"
                            value={data.nama_event}
                            onChange={(e) =>
                                setData("nama_event", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                            placeholder="Contoh: Festival Kuliner Banjar 2025"
                            required
                        />
                        {errors.nama_event && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <FiAlertCircle className="w-4 h-4" />
                                {errors.nama_event}
                            </p>
                        )}
                    </div>

                    {/* File Upload Section */}
                    <div>
                        <label
                            htmlFor="proposal_document"
                            className="block text-sm font-semibold text-gray-700 mb-3"
                        >
                            Unggah Dokumen Proposal (PDF) *
                        </label>
                        {!data.proposal_document ? (
                            // STATE 1: No file selected. Show the upload box.
                            <div className="border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-all duration-200">
                                <div className="p-8 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="p-4 bg-gray-50 rounded-full mb-4">
                                            <FiFileText className="h-10 w-10 text-gray-400" />
                                        </div>
                                        <label
                                            htmlFor="proposal_document_input"
                                            className="cursor-pointer"
                                        >
                                            <span className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                                <FiUploadCloud className="w-4 h-4" />
                                                Pilih file untuk diunggah
                                            </span>
                                            <input
                                                id="proposal_document_input"
                                                name="proposal_document"
                                                type="file"
                                                className="sr-only"
                                                onChange={(e) =>
                                                    setData(
                                                        "proposal_document",
                                                        e.target.files[0]
                                                    )
                                                }
                                                accept=".pdf"
                                                required
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-3">
                                            Ukuran maksimal: 5MB • Format: PDF
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // STATE 2: File has been selected. Show file info and a remove button.
                            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm sm:gap-4 sm:p-3">
                                <div className="flex-shrink-0">
                                    {/* Ikon file generik dengan warna brand/aksi */}
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 sm:h-12 sm:w-12">
                                        <FiFileText className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-800">
                                        {data.proposal_document.name}
                                    </p>
                                    <p className="flex items-center gap-1 text-xs text-gray-500">
                                        <FiCheckCircle className="h-3 w-3 text-green-500" />
                                        PDF siap diunggah
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData("proposal_document", null)
                                        }
                                        className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:px-3 sm:py-1.5"
                                    >
                                        Ganti
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Error message remains unchanged */}
                        {errors.proposal_document && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <FiAlertCircle className="w-4 h-4" />
                                {errors.proposal_document}
                            </p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-8 border-t border-gray-200 mt-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Mengajukan...
                            </>
                        ) : (
                            <>
                                <FiUploadCloud className="w-4 h-4" />
                                Lanjut: Ajukan Dokumen
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Step 2: Details Component - Enhanced layout
const Step2Details = ({ event, isAccessible }) => {
    const { data, setData, post, processing, errors } = useForm({
        deskripsi_event: "",
        poster_event: null,
        pendaftaran_dibuka: "",
        pendaftaran_ditutup: "",
        tanggal_mulai_acara: "",
        tanggal_selesai_acara: "",
        lokasi_event: "",
        biaya_pendaftaran_umkm: 0,
        kuota_umkm: 10,
        nama_bank_penyelenggara: "",
        nomor_rekening_penyelenggara: "",
        nama_pemilik_rekening: "",
    });

    const submit = (e) => {
        e.preventDefault();
        if (!isAccessible) return;

        post(route("penyelenggara.proposal.wizard.step2", event.id), {
            forceFormData: true,
        });
    };

    const getMinDate = (dateString) => {
        if (!dateString) return new Date().toISOString().split("T")[0];
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0];
    };

    // If step 1 is not completed, show locked state
    if (!isAccessible) {
        return (
            <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100 relative">
                <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                            <FiClipboard className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Langkah 2 Belum Tersedia
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Selesaikan langkah 1 terlebih dahulu untuk
                            melanjutkan ke tahap ini
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                            <FiAlertCircle className="w-4 h-4" />
                            Menunggu penyelesaian langkah sebelumnya
                        </div>
                    </div>
                </div>

                {/* Blurred content preview */}
                <div className="opacity-30">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                                <FiClipboard className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    Tahap 2: Lengkapi Detail Event
                                </h3>
                                <p className="mt-2 text-green-100">
                                    Lengkapi detail event setelah proposal
                                    disetujui
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="h-12 bg-gray-200 rounded-lg"></div>
                            <div className="h-12 bg-gray-200 rounded-lg"></div>
                        </div>
                        <div className="h-24 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-gray-100">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                        <FiClipboard className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">
                            Tahap 2: Lengkapi Detail Event
                        </h3>
                        <p className="mt-2 text-green-100">
                            Dokumen proposal Anda untuk "
                            <strong>{event.nama_event}</strong>" telah
                            disetujui! Silakan lengkapi detail event di bawah
                            ini.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={submit} className="p-8">
                <div className="space-y-10">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FiClipboard className="h-5 w-5 text-blue-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">
                                Informasi Dasar
                            </h4>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Deskripsi Event *
                            </label>
                            <textarea
                                rows="4"
                                value={data.deskripsi_event}
                                onChange={(e) =>
                                    setData("deskripsi_event", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                placeholder="Deskripsikan event Anda secara detail..."
                                required
                            />
                            {errors.deskripsi_event && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                    <FiAlertCircle className="w-4 h-4" />
                                    {errors.deskripsi_event}
                                </p>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    <FiImage className="inline w-4 h-4 mr-1" />
                                    Poster Event *
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "poster_event",
                                            e.target.files[0]
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    accept="image/*"
                                    required
                                />
                                {errors.poster_event && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.poster_event}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    <FiMapPin className="inline w-4 h-4 mr-1" />
                                    Lokasi Event *
                                </label>
                                <input
                                    type="text"
                                    value={data.lokasi_event}
                                    onChange={(e) =>
                                        setData("lokasi_event", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    placeholder="Alamat lengkap lokasi event"
                                    required
                                />
                                {errors.lokasi_event && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.lokasi_event}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Registration Schedule Section */}
                    <div className="space-y-6 pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FiCalendar className="h-5 w-5 text-purple-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">
                                Jadwal Pendaftaran Peserta
                            </h4>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Pendaftaran Dibuka *
                                </label>
                                <input
                                    type="date"
                                    value={data.pendaftaran_dibuka}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={(e) =>
                                        setData(
                                            "pendaftaran_dibuka",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    required
                                />
                                {errors.pendaftaran_dibuka && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.pendaftaran_dibuka}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Pendaftaran Ditutup *
                                </label>
                                <input
                                    type="date"
                                    value={data.pendaftaran_ditutup}
                                    min={data.pendaftaran_dibuka}
                                    onChange={(e) =>
                                        setData(
                                            "pendaftaran_ditutup",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    required
                                    disabled={!data.pendaftaran_dibuka}
                                />
                                {errors.pendaftaran_ditutup && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.pendaftaran_ditutup}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Event Schedule Section */}
                    <div className="space-y-6 pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <FiCalendar className="h-5 w-5 text-orange-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">
                                Jadwal Pelaksanaan Acara
                            </h4>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Tanggal Mulai Acara *
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_mulai_acara}
                                    min={getMinDate(data.pendaftaran_ditutup)}
                                    onChange={(e) =>
                                        setData(
                                            "tanggal_mulai_acara",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    required
                                    disabled={!data.pendaftaran_ditutup}
                                />
                                {errors.tanggal_mulai_acara && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.tanggal_mulai_acara}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Tanggal Selesai Acara *
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_selesai_acara}
                                    min={data.tanggal_mulai_acara}
                                    onChange={(e) =>
                                        setData(
                                            "tanggal_selesai_acara",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    required
                                    disabled={!data.tanggal_mulai_acara}
                                />
                                {errors.tanggal_selesai_acara && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.tanggal_selesai_acara}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Financial & Quota Section */}
                    <div className="space-y-6 pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FiDollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">
                                Detail Finansial & Kuota
                            </h4>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    <FiDollarSign className="inline w-4 h-4 mr-1" />
                                    Biaya Pendaftaran UMKM (Rp) *
                                </label>
                                <input
                                    type="number"
                                    value={data.biaya_pendaftaran_umkm}
                                    onChange={(e) =>
                                        setData(
                                            "biaya_pendaftaran_umkm",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    min="0"
                                    placeholder="0"
                                    required
                                />
                                {errors.biaya_pendaftaran_umkm && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.biaya_pendaftaran_umkm}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    <FiUsers className="inline w-4 h-4 mr-1" />
                                    Kuota UMKM *
                                </label>
                                <input
                                    type="number"
                                    value={data.kuota_umkm}
                                    onChange={(e) =>
                                        setData("kuota_umkm", e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                    min="1"
                                    placeholder="10"
                                    required
                                />
                                {errors.kuota_umkm && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FiAlertCircle className="w-4 h-4" />
                                        {errors.kuota_umkm}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Banking Information */}
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="flex items-center gap-2 mb-4">
                                <FiCreditCard className="h-5 w-5 text-gray-600" />
                                <h5 className="font-semibold text-gray-800">
                                    Informasi Rekening
                                </h5>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Bank *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_bank_penyelenggara}
                                        onChange={(e) =>
                                            setData(
                                                "nama_bank_penyelenggara",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
                                        placeholder="Contoh: BCA"
                                        required
                                    />
                                    {errors.nama_bank_penyelenggara && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <FiAlertCircle className="w-3 h-3" />
                                            {errors.nama_bank_penyelenggara}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nomor Rekening *
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            data.nomor_rekening_penyelenggara
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "nomor_rekening_penyelenggara",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
                                        placeholder="1234567890"
                                        required
                                    />
                                    {errors.nomor_rekening_penyelenggara && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <FiAlertCircle className="w-3 h-3" />
                                            {
                                                errors.nomor_rekening_penyelenggara
                                            }
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Pemilik Rekening *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama_pemilik_rekening}
                                        onChange={(e) =>
                                            setData(
                                                "nama_pemilik_rekening",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm"
                                        placeholder="Nama lengkap"
                                        required
                                    />
                                    {errors.nama_pemilik_rekening && (
                                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                            <FiAlertCircle className="w-3 h-3" />
                                            {errors.nama_pemilik_rekening}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-8 border-t border-gray-200 mt-10">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Mengajukan...
                            </>
                        ) : (
                            <>
                                <FiCheckCircle className="w-4 h-4" />
                                Kirim & Selesaikan Proposal
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Main Wizard Component
export default function ProposalWizard({ auth, step, event }) {
    const [completedSteps, setCompletedSteps] = useState(step > 1 ? [1] : []);

    const handleStepComplete = (completedStep) => {
        setCompletedSteps((prev) => [...prev, completedStep]);
    };

    const isStep2Accessible = completedSteps.includes(1) || step > 1;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pengajuan Proposal Event
                </h2>
            }
        >
            <Head title="Wizard Pengajuan Proposal" />
            <div className="py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Wizard Steps Indicator */}
                    <WizardSteps
                        currentStep={step}
                        completedSteps={completedSteps}
                    />

                    {/* Step Content */}
                    {step === 1 && (
                        <Step1Upload onStepComplete={handleStepComplete} />
                    )}
                    {step === 2 && (
                        <Step2Details
                            event={event}
                            isAccessible={isStep2Accessible}
                        />
                    )}

                    {/* Step Navigation Info */}
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                            <FiAlertCircle className="w-4 h-4" />
                            {step === 1 &&
                                "Selesaikan unggahan dokumen untuk melanjutkan ke langkah berikutnya"}
                            {step === 2 &&
                                !isStep2Accessible &&
                                "Lengkapi langkah 1 terlebih dahulu"}
                            {step === 2 &&
                                isStep2Accessible &&
                                "Lengkapi semua detail untuk menyelesaikan pengajuan"}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
