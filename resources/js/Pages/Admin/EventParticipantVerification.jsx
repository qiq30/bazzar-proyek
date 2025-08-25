// resources/js/Pages/Admin/EventParticipantVerification.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

// Komponen kecil untuk menampilkan badge status
const StatusBadge = ({ status }) => {
    const statusConfig = {
        pembayaran_terkonfirmasi: {
            text: "Pembayaran Diterima",
            className: "bg-purple-100 text-purple-800",
        },
        approved: {
            text: "Disetujui (Peserta)",
            className: "bg-green-100 text-green-800",
        },
        rejected: {
            text: "Ditolak",
            className: "bg-red-100 text-red-800",
        },
        default: {
            text: status.replace(/_/g, " ").toUpperCase(),
            className: "bg-gray-100 text-gray-800",
        },
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

export default function EventParticipantVerification({
    auth,
    event,
    registrations = [],
}) {
    const { post, processing } = useForm();

    const handleApprove = (registrationId) => {
        if (
            confirm(
                "Setujui pendaftaran UMKM ini? Mereka akan resmi menjadi peserta."
            )
        ) {
            post(route("admin.registrations.finalize", registrationId));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Verifikasi Peserta Event: {event.nama_event}
                </h2>
            }
        >
            <Head title={`Peserta - ${event.nama_event}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold">
                                Daftar Pendaftar
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Setujui pendaftar yang pembayarannya sudah
                                dikonfirmasi oleh penyelenggara.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-6 text-left">
                                            Nama UMKM
                                        </th>
                                        <th className="py-3 px-6 text-left">
                                            Pemilik
                                        </th>
                                        <th className="py-3 px-6 text-left">
                                            Status Pendaftaran
                                        </th>
                                        <th className="py-3 px-6 text-left">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {registrations.map((reg) => (
                                        <tr key={reg.id}>
                                            <td className="py-4 px-6 font-medium">
                                                {reg.umkm_profile.business_name}
                                            </td>
                                            <td className="py-4 px-6 text-gray-500">
                                                {reg.umkm_profile.user.name}
                                            </td>
                                            <td className="py-4 px-6">
                                                <StatusBadge
                                                    status={reg.status}
                                                />
                                            </td>
                                            <td className="py-4 px-6">
                                                {/* 🔽 LOGIKA TOMBOL BARU 🔽 */}
                                                {reg.status ===
                                                    "pembayaran_terkonfirmasi" && (
                                                    <button
                                                        onClick={() =>
                                                            handleApprove(
                                                                reg.id
                                                            )
                                                        }
                                                        disabled={processing}
                                                        className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        Setujui
                                                    </button>
                                                )}

                                                {reg.status === "approved" && (
                                                    <span className="text-sm text-gray-500">
                                                        Tidak ada aksi
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {registrations.length === 0 && (
                                <p className="text-center text-gray-500 p-6">
                                    Belum ada UMKM yang mendaftar ke event ini.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
