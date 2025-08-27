// resources/js/Pages/Penyelenggara/CreateProposal.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function CreateProposal({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_event: "",
        deskripsi_event: "",
        poster_event: null,
        tanggal_mulai: "",
        tanggal_selesai: "",
        lokasi_event: "",
        biaya_pendaftaran_umkm: 0,
        kuota_umkm: 10,
        nama_bank_penyelenggara: "",
        nomor_rekening_penyelenggara: "",
        nama_pemilik_rekening: "",
    });
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("penyelenggara.proposal.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pengajuan Proposal Event Baru
                </h2>
            }
        >
            <Head title="Buat Proposal Event" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {}
                            {}
                            <div className="grid md:grid-cols-2 gap-6">
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
                                    {errors.nama_event && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.nama_event}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Lokasi Event
                                    </label>
                                    <input
                                        type="text"
                                        value={data.lokasi_event}
                                        onChange={(e) =>
                                            setData(
                                                "lokasi_event",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full rounded-md"
                                        required
                                    />
                                    {errors.lokasi_event && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.lokasi_event}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Deskripsi Event
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
                                    className="mt-1 w-full rounded-md"
                                    required
                                ></textarea>
                            </div>
                            {/* Tanggal Mulai & Selesai */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        value={data.tanggal_mulai}
                                        // --- ▼▼▼ TAMBAHKAN KODE DI BAWAH INI ▼▼▼ ---
                                        min={getTodayDate()}
                                        // --- ▲▲▲ AKHIR DARI PERUBAHAN ▲▲▲ ---
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_mulai",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Tanggal Selesai
                                    </label>
                                    <input
                                        type="date"
                                        value={data.tanggal_selesai}
                                        // --- ▼▼▼ TAMBAHKAN KODE DI BAWAH INI ▼▼▼ ---
                                        min={
                                            data.tanggal_mulai || getTodayDate()
                                        }
                                        // --- ▲▲▲ AKHIR DARI PERUBAHAN ▲▲▲ ---
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_selesai",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full rounded-md"
                                        required
                                    />
                                </div>
                            </div>
                            {/* ... (Sisa form tidak berubah) ... */}
                            {/* Biaya & Kuota */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium">
                                        Biaya Pendaftaran UMKM (Rp)
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
                                        className="mt-1 w-full rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Kuota UMKM
                                    </label>
                                    <input
                                        type="number"
                                        value={data.kuota_umkm}
                                        onChange={(e) =>
                                            setData(
                                                "kuota_umkm",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 w-full rounded-md"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Info Bank */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium">
                                        Nama Bank
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
                                        className="mt-1 w-full rounded-md"
                                        placeholder="Contoh: BCA"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Nomor Rekening
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
                                        className="mt-1 w-full rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Nama Pemilik Rekening
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
                                        className="mt-1 w-full rounded-md"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Poster */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Poster Event
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "poster_event",
                                            e.target.files[0]
                                        )
                                    }
                                    className="mt-1 block w-full text-sm"
                                    required
                                />
                                {errors.poster_event && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.poster_event}
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Mengajukan..."
                                        : "Ajukan Proposal"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
