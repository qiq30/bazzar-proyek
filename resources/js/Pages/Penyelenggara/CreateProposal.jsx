// resources/js/Pages/Penyelenggara/CreateProposal.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function CreateProposal({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_event: "",
        deskripsi_event: "",
        poster_event: null,
        // --- ▼▼▼ PERUBAHAN STATE DI SINI ▼▼▼ ---
        pendaftaran_dibuka: "",
        pendaftaran_ditutup: "",
        tanggal_mulai_acara: "",
        tanggal_selesai_acara: "",
        // --- ▲▲▲ AKHIR DARI PERUBAHAN ---
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
        const month = String(today.getMonth() + 1).padStart(2, "0");
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
                            {/* Nama & Lokasi Event (Tidak berubah) */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium">
                                        Nama Event *
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
                                        Lokasi Event *
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

                            {/* --- ▼▼▼ PERUBAHAN BESAR PADA BAGIAN TANGGAL ▼▼▼ --- */}
                            <div className="space-y-6 pt-4 border-t">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Jadwal Pendaftaran Peserta
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Pendaftaran Dibuka *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.pendaftaran_dibuka}
                                            min={getTodayDate()}
                                            onChange={(e) =>
                                                setData(
                                                    "pendaftaran_dibuka",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 w-full rounded-md"
                                            required
                                        />
                                        {errors.pendaftaran_dibuka && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.pendaftaran_dibuka}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Pendaftaran Ditutup *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.pendaftaran_ditutup}
                                            min={
                                                data.pendaftaran_dibuka ||
                                                getTodayDate()
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "pendaftaran_ditutup",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 w-full rounded-md"
                                            required
                                            disabled={!data.pendaftaran_dibuka}
                                        />
                                        {errors.pendaftaran_ditutup && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.pendaftaran_ditutup}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-4 border-t">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Jadwal Pelaksanaan Acara
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Tanggal Mulai Acara *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.tanggal_mulai_acara}
                                            min={
                                                data.pendaftaran_ditutup ||
                                                getTodayDate()
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "tanggal_mulai_acara",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 w-full rounded-md"
                                            required
                                            disabled={!data.pendaftaran_ditutup}
                                        />
                                        {errors.tanggal_mulai_acara && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.tanggal_mulai_acara}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">
                                            Tanggal Selesai Acara *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.tanggal_selesai_acara}
                                            min={
                                                data.tanggal_mulai_acara ||
                                                getTodayDate()
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "tanggal_selesai_acara",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 w-full rounded-md"
                                            required
                                            disabled={!data.tanggal_mulai_acara}
                                        />
                                        {errors.tanggal_selesai_acara && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.tanggal_selesai_acara}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* --- ▲▲▲ AKHIR DARI PERUBAHAN TANGGAL --- */}

                            {/* Deskripsi (Tidak berubah) */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Deskripsi Event *
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

                            {/* Biaya & Kuota (Tidak berubah) */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium">
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
                                        className="mt-1 w-full rounded-md"
                                        min="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
                                        Kuota UMKM *
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
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Info Bank (Tidak berubah) */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium">
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
                                        className="mt-1 w-full rounded-md"
                                        placeholder="Contoh: BCA"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
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
                                        className="mt-1 w-full rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">
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
                                        className="mt-1 w-full rounded-md"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Poster (Tidak berubah) */}
                            <div>
                                <label className="block text-sm font-medium">
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
                                    className="mt-1 block w-full text-sm"
                                    required
                                />
                                {errors.poster_event && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.poster_event}
                                    </p>
                                )}
                            </div>

                            {/* Tombol Submit (Tidak berubah) */}
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
