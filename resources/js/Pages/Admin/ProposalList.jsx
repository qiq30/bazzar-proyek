// resources/js/Pages/Admin/ProposalList.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

const FilterForm = ({ filters }) => {
    const { data, setData, get, processing } = useForm({
        search: filters.search || "",
        start_date: filters.start_date || "",
        end_date: filters.end_date || "",
    });

    const submit = (e) => {
        e.preventDefault();
        get(route("admin.proposals.list"), {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setData({ search: "", start_date: "", end_date: "" });
        // Kirim request dengan form kosong
        get(route("admin.proposals.list"), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                    Filter Proposal
                </h3>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label
                            htmlFor="search"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Cari (Nama Event / Penyelenggara)
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
                            Tanggal Pengajuan (Dari)
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
                            Tanggal Pengajuan (Sampai)
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

export default function ProposalList({
    auth,
    pendingDocumentProposals = [],
    pendingProposals = [],
    approvedProposals = [],
    rejectedProposals = [],
    filters = {}, // Ambil filters dari props
}) {
    // Form hook untuk aksi hapus permanen
    const { delete: forceDelete, processing } = useForm();

    const handleForceDelete = (id) => {
        if (
            confirm(
                "ANDA YAKIN? Aksi ini akan menghapus data proposal secara permanen dan tidak dapat dibatalkan."
            )
        ) {
            forceDelete(route("admin.proposals.forceDelete", id), {
                preserveScroll: true, // Agar halaman tidak scroll ke atas setelah aksi
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Persetujuan Proposal Event
                </h2>
            }
        >
            <Head title="Persetujuan Proposal" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <FilterForm filters={filters} />

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Tahap 1: Verifikasi Dokumen Proposal
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Terdapat{" "}
                                <strong>
                                    {pendingDocumentProposals.length} proposal
                                </strong>{" "}
                                yang dokumennya perlu Anda tinjau.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            {pendingDocumentProposals.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama Event
                                            </th>
                                            <th className="py-3 px-6 text-left hidden sm:table-cell">
                                                Penyelenggara
                                            </th>
                                            <th className="py-3 px-6 text-left hidden md:table-cell">
                                                Tanggal Pengajuan
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {pendingDocumentProposals.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-4 px-6 font-medium">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {p.nama_event}
                                                    </div>
                                                    <div className="text-sm text-gray-500 sm:hidden">
                                                        {p.user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 md:hidden">
                                                        {new Date(
                                                            p.created_at
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-gray-500 hidden sm:table-cell">
                                                    {p.user.name}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500 hidden md:table-cell">
                                                    {new Date(
                                                        p.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.proposals.document.review",
                                                                {
                                                                    event: p.hashid,
                                                                }
                                                            )}
                                                            className="w-full sm:w-auto px-3 py-2 bg-yellow-500 text-white text-xs font-semibold rounded-md hover:bg-yellow-600 text-center inline-block"
                                                        >
                                                            <span className="hidden sm:inline">
                                                                Tinjau Dokumen
                                                            </span>
                                                            <span className="sm:hidden">
                                                                Tinjau
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 p-6">
                                    Tidak ada dokumen proposal baru yang
                                    menunggu persetujuan.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* BAGIAN 1: PROPOSAL MASUK (Ganti judulnya) */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Tahap 2: Persetujuan Detail Event
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Terdapat{" "}
                                <strong>
                                    {pendingProposals.length} proposal
                                </strong>{" "}
                                yang detailnya perlu Anda setujui.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            {pendingProposals.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama Event
                                            </th>
                                            <th className="py-3 px-6 text-left hidden sm:table-cell">
                                                Nama Penyelenggara
                                            </th>
                                            <th className="py-3 px-6 text-left hidden md:table-cell">
                                                Tanggal Pengajuan
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {pendingProposals.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-4 px-6 font-medium">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {p.nama_event}
                                                    </div>
                                                    <div className="text-sm text-gray-500 sm:hidden">
                                                        {p.user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 md:hidden">
                                                        {new Date(
                                                            p.created_at
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-gray-500 hidden sm:table-cell">
                                                    {p.user.name}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500 hidden md:table-cell">
                                                    {new Date(
                                                        p.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.proposals.show",
                                                                {
                                                                    event: p.hashid,
                                                                }
                                                            )}
                                                            className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 text-center inline-block"
                                                        >
                                                            <span className="hidden sm:inline">
                                                                Lihat Detail
                                                            </span>
                                                            <span className="sm:hidden">
                                                                Detail
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 p-6">
                                    Tidak ada detail proposal baru yang menunggu
                                    persetujuan.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* BAGIAN 2: RIWAYAT PROPOSAL DISETUJUI */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Riwayat Proposal Disetujui
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Berikut adalah daftar proposal yang telah Anda
                                setujui.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            {approvedProposals.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama Event
                                            </th>
                                            <th className="py-3 px-6 text-left hidden sm:table-cell">
                                                Penyelenggara
                                            </th>
                                            <th className="py-3 px-6 text-left hidden md:table-cell">
                                                Tanggal Disetujui
                                            </th>
                                            <th className="py-3 px-6 text-left hidden lg:table-cell">
                                                Status Event
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {approvedProposals.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-4 px-6 font-medium">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {p.nama_event}
                                                    </div>
                                                    <div className="text-sm text-gray-500 sm:hidden">
                                                        {p.user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 md:hidden">
                                                        {new Date(
                                                            p.updated_at
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )}
                                                    </div>
                                                    <div className="mt-1 lg:hidden">
                                                        <span
                                                            className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                                                                p.status
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {p.status
                                                                ? "Diterbitkan"
                                                                : "Belum Diterbitkan"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-gray-500 hidden sm:table-cell">
                                                    {p.user.name}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500 hidden md:table-cell">
                                                    {new Date(
                                                        p.updated_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 hidden lg:table-cell">
                                                    <span
                                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            p.status
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}
                                                    >
                                                        {p.status
                                                            ? "Sudah Diterbitkan"
                                                            : "Belum Diterbitkan"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.proposals.show",
                                                                {
                                                                    event: p.hashid,
                                                                }
                                                            )}
                                                            className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 text-center inline-block"
                                                        >
                                                            <span className="hidden sm:inline">
                                                                Lihat Detail
                                                            </span>
                                                            <span className="sm:hidden">
                                                                Detail
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 p-6">
                                    Belum ada proposal yang disetujui.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* BAGIAN 3: RIWAYAT PROPOSAL DITOLAK */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200 bg-red-50">
                            <h3 className="text-xl font-bold text-red-900">
                                Riwayat Proposal Ditolak (Diarsipkan)
                            </h3>
                            <p className="text-red-700 mt-1">
                                Proposal di bawah ini telah ditolak dan
                                diarsipkan. Anda dapat menghapusnya secara
                                permanen.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            {rejectedProposals.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama Event
                                            </th>
                                            <th className="py-3 px-6 text-left hidden sm:table-cell">
                                                Penyelenggara
                                            </th>
                                            <th className="py-3 px-6 text-left hidden md:table-cell">
                                                Alasan Penolakan
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {rejectedProposals.map((p) => (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-4 px-6 font-medium">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {p.nama_event}
                                                    </div>
                                                    <div className="text-sm text-gray-500 sm:hidden">
                                                        {p.user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-600 md:hidden mt-1">
                                                        <span className="font-medium">
                                                            Alasan:
                                                        </span>{" "}
                                                        {p.rejection_reason ||
                                                            p.document_rejection_reason}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-gray-500 hidden sm:table-cell">
                                                    {p.user.name}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600 hidden md:table-cell">
                                                    {p.rejection_reason ||
                                                        p.document_rejection_reason}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleForceDelete(
                                                                    p.id
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                            className="w-full sm:w-auto px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-800 disabled:opacity-50 text-center"
                                                        >
                                                            <span className="hidden sm:inline">
                                                                Hapus Permanen
                                                            </span>
                                                            <span className="sm:hidden">
                                                                Hapus
                                                            </span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 p-6">
                                    Tidak ada proposal yang ditolak.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
