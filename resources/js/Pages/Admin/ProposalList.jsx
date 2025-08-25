// resources/js/Pages/Admin/ProposalList.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function ProposalList({
    auth,
    pendingProposals = [],
    approvedProposals = [],
}) {
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
                    {/* BAGIAN 1: PROPOSAL MASUK */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Proposal Masuk
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Terdapat{" "}
                                <strong>
                                    {pendingProposals.length} proposal
                                </strong>{" "}
                                baru yang memerlukan persetujuan Anda.
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
                                            <th className="py-3 px-6 text-left">
                                                Nama Penyelenggara
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Tanggal Pengajuan
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
                                                    <span className="px-3 py-1 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        Pending
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-wrap gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.proposals.show",
                                                                p.id
                                                            )}
                                                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-blue-700 text-center"
                                                        >
                                                            Lihat Detail
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 p-6">
                                    Tidak ada proposal baru yang menunggu
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
                                                        className={`px-3 py-1 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full ${
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
                                                    <div className="flex flex-wrap gap-2">
                                                        <Link
                                                            href={route(
                                                                "admin.proposals.show",
                                                                p.id
                                                            )}
                                                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-md hover:bg-blue-700 text-center"
                                                        >
                                                            Lihat Detail
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
