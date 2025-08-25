// resources/js/Pages/Penyelenggara/VerifikasiPendaftarList.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

// Komponen kecil untuk badge status agar lebih rapi
const StatusBadge = ({ status }) => {
    const statusConfig = {
        pembayaran_terkonfirmasi: {
            text: "Menunggu Persetujuan Admin",
            className: "bg-purple-100 text-purple-800",
        },
        approved: {
            text: "Disetujui (Peserta Resmi)",
            className: "bg-green-100 text-green-800",
        },
        sudah_check_in: {
            text: "Sudah Check-in",
            className: "bg-gray-200 text-gray-800",
        },
        rejected: { text: "Ditolak", className: "bg-red-100 text-red-800" },
        default: { text: status, className: "bg-gray-100 text-gray-800" },
    };
    const config = statusConfig[status] || statusConfig.default;
    return (
        <span
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.className}`}
        >
            {config.text}
        </span>
    );
};

export default function VerifikasiPendaftarList({
    auth,
    pendingRegistrations = [],
    confirmedRegistrations = [],
}) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Verifikasi Pembayaran Pendaftar
                </h2>
            }
        >
            <Head title="Verifikasi Pendaftar" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* BAGIAN 1: PENDAFTAR BARU YANG PERLU DIKONFIRMASI */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Menunggu Konfirmasi Pembayaran
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Terdapat{" "}
                                <strong>
                                    {pendingRegistrations.length} UMKM
                                </strong>{" "}
                                yang telah mengunggah bukti pembayaran dan
                                menunggu konfirmasi dari Anda.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            {pendingRegistrations.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama UMKM
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Event
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Total Bayar
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pendingRegistrations.map((reg) => (
                                            <tr key={reg.id}>
                                                <td className="py-4 px-6 font-medium">
                                                    {
                                                        reg.umkm_profile
                                                            .business_name
                                                    }
                                                </td>
                                                <td className="py-4 px-6 text-gray-500">
                                                    {reg.event.nama_event}
                                                </td>
                                                <td className="py-4 px-6 font-semibold text-red-600">
                                                    {formatRupiah(
                                                        reg.event
                                                            .biaya_pendaftaran_umkm
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Link
                                                        href={route(
                                                            "penyelenggara.pendaftar.verifikasi.show",
                                                            reg.id
                                                        )}
                                                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700"
                                                    >
                                                        Verifikasi
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 p-6">
                                    Tidak ada pendaftar yang menunggu verifikasi
                                    saat ini.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* BAGIAN 2: RIWAYAT SEMUA PENDAFTAR */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Riwayat Pendaftar
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Berikut adalah riwayat semua UMKM yang telah
                                mendaftar ke event Anda.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            {confirmedRegistrations.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama UMKM
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Event
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Tanggal Diproses
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Status Final
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {confirmedRegistrations.map((reg) => (
                                            <tr key={reg.id}>
                                                <td className="py-4 px-6 font-medium">
                                                    {
                                                        reg.umkm_profile
                                                            .business_name
                                                    }
                                                </td>
                                                <td className="py-4 px-6 text-gray-500">
                                                    {reg.event.nama_event}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500">
                                                    {new Date(
                                                        reg.updated_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <StatusBadge
                                                        status={reg.status}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 p-6">
                                    Belum ada riwayat pendaftar.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
