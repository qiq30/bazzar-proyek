import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

// Komponen Modal (tidak berubah)
const Modal = ({ children, show, onClose }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default function PenyelenggaraVerification({
    auth,
    pendingPenyelenggara = [],
    verifiedPenyelenggara = [],
}) {
    const [viewingProfile, setViewingProfile] = useState(null);
    const { post, processing } = useForm();

    const handleVerify = (id) => {
        if (confirm("Yakin ingin verifikasi profil ini?")) {
            post(route("admin.penyelenggara.verify", id), {
                onSuccess: () => setViewingProfile(null),
            });
        }
    };

    const handleReject = (id) => {
        if (confirm("Yakin ingin menolak profil ini?")) {
            post(route("admin.penyelenggara.reject", id), {
                onSuccess: () => setViewingProfile(null),
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Verifikasi Penyelenggara
                </h2>
            }
        >
            <Head title="Verifikasi Penyelenggara" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* BAGIAN 1: Verifikasi Profil Penyelenggara Baru */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Verifikasi Profil Penyelenggara Baru
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Setujui atau tolak profil penyelenggara yang
                                baru mendaftar.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            {pendingPenyelenggara.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama Instansi
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Penanggung Jawab
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
                                    <tbody className="divide-y divide-gray-200">
                                        {pendingPenyelenggara.map((profile) => (
                                            <tr key={profile.id}>
                                                <td className="py-4 px-6 font-medium">
                                                    {profile.organizer_name}
                                                </td>
                                                <td className="py-4 px-6 text-gray-500">
                                                    {profile.user.name}
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-500">
                                                    {new Date(
                                                        profile.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        Menunggu
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button
                                                        onClick={() =>
                                                            setViewingProfile(
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
                                    Tidak ada profil penyelenggara yang menunggu
                                    verifikasi.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* BAGIAN 2: Daftar Penyelenggara Terdaftar */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Daftar Riwayat Penyelenggara
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Berikut adalah riwayat semua penyelenggara yang
                                telah diproses.
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            {verifiedPenyelenggara.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama Instansi
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Penanggung Jawab
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
                                    <tbody className="divide-y divide-gray-200">
                                        {verifiedPenyelenggara.map(
                                            (profile) => (
                                                <tr key={profile.id}>
                                                    <td className="py-4 px-6 font-medium">
                                                        {profile.organizer_name}
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-500">
                                                        {profile.user.name}
                                                    </td>
                                                    <td className="py-4 px-6 text-sm text-gray-500">
                                                        {new Date(
                                                            profile.updated_at
                                                        ).toLocaleDateString(
                                                            "id-ID"
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6">
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
                                                    <td className="py-4 px-6">
                                                        <button
                                                            onClick={() =>
                                                                setViewingProfile(
                                                                    profile
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700"
                                                        >
                                                            Lihat Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 p-6">
                                    Belum ada riwayat verifikasi penyelenggara.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal untuk melihat detail */}
            <Modal
                show={!!viewingProfile}
                onClose={() => setViewingProfile(null)}
            >
                {viewingProfile && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">
                            {viewingProfile.organizer_name}
                        </h3>
                        <p>
                            <strong>Penanggung Jawab:</strong>{" "}
                            {viewingProfile.user.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {viewingProfile.user.email}
                        </p>
                        <p>
                            <strong>Alamat:</strong> {viewingProfile.address}
                        </p>
                        <p className="mt-2">
                            <strong>Deskripsi:</strong>{" "}
                            {viewingProfile.description}
                        </p>
                        <div className="mt-4">
                            <h4 className="font-bold">Dokumen Verifikasi</h4>
                            <a
                                href={`/storage/${viewingProfile.verification_document_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Lihat Dokumen
                            </a>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={() => setViewingProfile(null)}
                                className="bg-gray-300 text-black py-2 px-4 rounded"
                            >
                                Tutup
                            </button>
                            {viewingProfile.status === "pending" && (
                                <>
                                    <button
                                        onClick={() =>
                                            handleReject(viewingProfile.id)
                                        }
                                        disabled={processing}
                                        className="bg-red-600 text-white py-2 px-4 rounded"
                                    >
                                        Tolak
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleVerify(viewingProfile.id)
                                        }
                                        disabled={processing}
                                        className="bg-green-600 text-white py-2 px-4 rounded"
                                    >
                                        Verifikasi
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
