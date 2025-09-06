import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function ProposalList({
    auth,
    pendingDocumentProposals = [], // <-- TERIMA PROPS BARU
    pendingProposals = [],
    approvedProposals = [],
    rejectedProposals = [],
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
                    {/* --- ▼▼▼ TAMBAHKAN BAGIAN BARU UNTUK VERIFIKASI DOKUMEN ▼▼▼ --- */}
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
                                            <th className="py-3 px-6 text-left">
                                                Penyelenggara
                                            </th>
                                            <th className="py-3 px-6 text-left">
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
                                                    {p.nama_event}
                                                </td>
                                                <td className="py-4 px-6 text-gray-500">
                                                    {p.user.name}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500">
                                                    {new Date(
                                                        p.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Link
                                                        href={route(
                                                            "admin.proposals.document.review",
                                                            p.id
                                                        )}
                                                        className="px-4 py-2 bg-yellow-500 text-white text-xs font-semibold rounded-md hover:bg-yellow-600"
                                                    >
                                                        Tinjau Dokumen
                                                    </Link>
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
                    {/* --- ▲▲▲ AKHIR DARI BAGIAN BARU --- */}

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
                        {/* ... (isi tabel proposal masuk yang sudah ada tidak berubah) ... */}
                        <div className="overflow-x-auto">
                            {pendingProposals.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama Event
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Nama Penyelenggara
                                            </th>
                                            <th className="py-3 px-6 text-left">
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
                                                    {p.nama_event}
                                                </td>
                                                <td className="py-4 px-6 text-gray-500">
                                                    {p.user.name}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500">
                                                    {new Date(
                                                        p.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Link
                                                        href={route(
                                                            "admin.proposals.show",
                                                            p.id
                                                        )}
                                                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700"
                                                    >
                                                        Lihat Detail
                                                    </Link>
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
                                            <th className="py-3 px-6 text-left">
                                                Penyelenggara
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Tanggal Disetujui
                                            </th>
                                            <th className="py-3 px-6 text-left">
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
                                                    {p.nama_event}
                                                </td>
                                                <td className="py-4 px-6 text-gray-500">
                                                    {p.user.name}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500">
                                                    {new Date(
                                                        p.updated_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
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
                                                    <Link
                                                        href={route(
                                                            "admin.proposals.show",
                                                            p.id
                                                        )}
                                                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700"
                                                    >
                                                        Lihat Detail
                                                    </Link>
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
                                            <th className="py-3 px-6 text-left">
                                                Penyelenggara
                                            </th>
                                            <th className="py-3 px-6 text-left">
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
                                                    {p.nama_event}
                                                </td>
                                                <td className="py-4 px-6 text-gray-500">
                                                    {p.user.name}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600">
                                                    {p.rejection_reason ||
                                                        p.document_rejection_reason}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button
                                                        onClick={() =>
                                                            handleForceDelete(
                                                                p.id
                                                            )
                                                        }
                                                        disabled={processing}
                                                        className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-800 disabled:opacity-50"
                                                    >
                                                        Hapus Permanen
                                                    </button>
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
