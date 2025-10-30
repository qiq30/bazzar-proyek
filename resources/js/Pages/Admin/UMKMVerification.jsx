// resources/js/Pages/Admin/UMKMVerification.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

// Komponen Modal (Tidak berubah)
const Modal = ({ children, show, onClose }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

const FilterForm = ({ filters }) => {
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
    });

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.umkm.verification"), {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setData({ search: "", start_date: "", end_date: "" });
        get(route("admin.umkm.verification"), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Filter UMKM</h3>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label
                            htmlFor="search"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Cari (Nama Usaha / Pemilik)
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={data.search}
                            onChange={(e) => setData("search", e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            placeholder="Ketik nama..."
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="start_date"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tanggal Registrasi (Dari)
                        </label>
                        <input
                            type="date"
                            id="start_date"
                            value={data.start_date}
                            onChange={(e) =>
                                setData("start_date", e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="end_date"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tanggal Registrasi (Sampai)
                        </label>
                        <input
                            type="date"
                            id="end_date"
                            value={data.end_date}
                            onChange={(e) =>
                                setData("end_date", e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={clearFilters}
                        disabled={processing}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? "Mencari..." : "Terapkan Filter"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function UMKMVerification({
    auth,
    pendingUmkmProfiles = [],
    verifiedUmkmProfiles = [],
    filters = {}, // Ambil filters dari props
}) {
    const [viewingUmkm, setViewingUmkm] = useState(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        rejection_reason: "",
    });

    const handleVerifyProfile = (profile) => {
        // Terima seluruh objek 'profile'
        if (confirm("Yakin ingin verifikasi profil UMKM ini?")) {
            post(route("admin.umkm.verify", profile.hashid), {
                onSuccess: () => setViewingUmkm(null),
                preserveScroll: true,
            });
        }
    };

    const openRejectModal = (profile) => {
        setViewingUmkm(profile);
        reset("rejection_reason");
        setIsRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setIsRejectModalOpen(false);
        setViewingUmkm(null);
    };

    const handleRejectSubmit = (e) => {
        e.preventDefault();
        if (!viewingUmkm) return;
        post(route("admin.umkm.reject", viewingUmkm.hashid), {
            onSuccess: () => closeRejectModal(),
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Verifikasi UMKM
                </h2>
            }
        >
            <Head title="Verifikasi UMKM" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <FilterForm filters={filters} />

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Verifikasi Profil UMKM Baru
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Verifikasi profil UMKM yang baru mendaftar ke
                                platform.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            {pendingUmkmProfiles.length > 0 ? (
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama Usaha
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Pemilik
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Tanggal Daftar
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Status
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingUmkmProfiles.map((profile) => (
                                            <tr
                                                key={profile.id}
                                                className="border-b"
                                            >
                                                <td className="py-3 px-6">
                                                    {profile.business_name}
                                                </td>
                                                <td className="py-3 px-6">
                                                    {profile.user.name}
                                                </td>
                                                <td className="py-3 px-6">
                                                    {new Date(
                                                        profile.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-3 px-6">
                                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
                                                        {profile.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-6">
                                                    <button
                                                        onClick={() =>
                                                            setViewingUmkm(
                                                                profile
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700"
                                                    >
                                                        Lihat Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 p-6">
                                    Tidak ada profil UMKM baru yang perlu
                                    diverifikasi.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Daftar Riwayat UMKM
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Berikut adalah riwayat semua profil UMKM yang
                                telah diproses.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            {verifiedUmkmProfiles.length > 0 ? (
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama Usaha
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Pemilik
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Tanggal Diproses
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Status
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {verifiedUmkmProfiles.map((profile) => (
                                            <tr
                                                key={profile.id}
                                                className="border-b"
                                            >
                                                <td className="py-3 px-6 font-medium">
                                                    {profile.business_name}
                                                </td>
                                                <td className="py-3 px-6 text-gray-500">
                                                    {profile.user.name}
                                                </td>
                                                <td className="py-3 px-6 text-sm text-gray-500">
                                                    {new Date(
                                                        profile.updated_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-3 px-6">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            profile.status ===
                                                            "verified"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {profile.status ===
                                                        "verified"
                                                            ? "Terverifikasi"
                                                            : "Ditolak"}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-6">
                                                    <button
                                                        onClick={() =>
                                                            setViewingUmkm(
                                                                profile
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700"
                                                    >
                                                        Lihat Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 p-6">
                                    Belum ada riwayat verifikasi UMKM.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={!!viewingUmkm && !isRejectModalOpen}
                onClose={() => setViewingUmkm(null)}
            >
                {viewingUmkm && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-2">
                            {viewingUmkm.business_name}
                        </h3>
                        <div className="border-t pt-4">
                            <p className="text-sm font-medium text-gray-500">
                                Pemilik
                            </p>
                            <p>
                                {viewingUmkm.user.name} (
                                {viewingUmkm.user.email})
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Jenis Usaha
                            </p>
                            <p>{viewingUmkm.business_type}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Alamat
                            </p>
                            <p>{viewingUmkm.address}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Deskripsi
                            </p>
                            <p className="text-sm">{viewingUmkm.description}</p>
                        </div>
                        <div className="pt-4 border-t">
                            <h4 className="font-bold mb-2">
                                Dokumen & Lampiran
                            </h4>
                            <div className="space-y-1">
                                {viewingUmkm.logo_path && (
                                    <a
                                        href={`/storage/${viewingUmkm.logo_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline block"
                                    >
                                        Lihat Logo Usaha
                                    </a>
                                )}
                                <a
                                    href={route("admin.secure.ktp", {
                                        umkm: viewingUmkm.hashid,
                                    })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline block"
                                >
                                    Lihat Dokumen KTP
                                </a>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2 border-t pt-6">
                            <button
                                onClick={() => setViewingUmkm(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                Tutup
                            </button>
                            {viewingUmkm.status === "pending" && (
                                <>
                                    <button
                                        onClick={() =>
                                            openRejectModal(viewingUmkm)
                                        }
                                        disabled={processing} // Cukup periksa satu 'processing'
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Tolak
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleVerifyProfile(viewingUmkm)
                                        }
                                        disabled={processing}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                    >
                                        Verifikasi
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            <Modal show={isRejectModalOpen} onClose={closeRejectModal}>
                <form onSubmit={handleRejectSubmit} className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Tolak Profil UMKM
                    </h2>
                    <p className="text-sm text-gray-600">
                        Berikan alasan penolakan. Alasan ini akan dikirimkan ke
                        pengguna agar mereka dapat memperbaiki profilnya.
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
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                            disabled={processing}
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            {processing ? "Memproses..." : "Tolak Profil"}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
