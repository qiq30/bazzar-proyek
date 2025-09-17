// resources/js/Pages/Penyelenggara/ProfileSetup.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function ProfileSetup({ auth, profile }) {
    const [logoPreview, setLogoPreview] = useState(profile?.logo_url || null);
    const [documentPreview, setDocumentPreview] = useState(
        profile ? `/storage/${profile.verification_document_path}` : null
    );

    const { data, setData, post, processing, errors, progress } = useForm({
        organizer_name: profile?.organizer_name || "",
        description: profile?.description || "",
        address: profile?.address || "",
        verification_document: null,
        logo: null,
    });

    const handleFileChange = (e, field, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("penyelenggara.profile.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Setup Profil Penyelenggara
                </h2>
            }
        >
            <Head title="Setup Profil Penyelenggara" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Lengkapi Profil Penyelenggara
                                </h3>
                                <p className="text-gray-600">
                                    Isi informasi lengkap tentang instansi atau
                                    organisasi Anda untuk dapat membuat event.
                                </p>
                                {profile?.status === "rejected" && (
                                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-800">
                                        <p className="font-bold">
                                            Profil Anda Ditolak
                                        </p>
                                        <p className="mt-1">
                                            <strong>Alasan:</strong>{" "}
                                            {profile.rejection_reason}
                                        </p>
                                        <p className="mt-2 text-sm">
                                            Silakan perbarui data Anda dan
                                            simpan kembali untuk diajukan ulang.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Penyelenggara/Instansi *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.organizer_name}
                                        onChange={(e) =>
                                            setData(
                                                "organizer_name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Contoh: Event Organizer Pro"
                                        required
                                    />
                                    {errors.organizer_name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.organizer_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Deskripsi *
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Jelaskan tentang instansi atau jenis event yang biasa Anda selenggarakan..."
                                        required
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alamat *
                                    </label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Alamat lengkap kantor atau instansi Anda..."
                                        required
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Logo (Opsional)
                                        </label>
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition h-40 flex items-center justify-center">
                                            {logoPreview ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={logoPreview}
                                                        alt="Logo Preview"
                                                        className="mx-auto h-24 w-24 object-cover rounded-lg"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-gray-400 text-4xl mb-2">
                                                        🏢
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Upload logo
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        "logo",
                                                        setLogoPreview
                                                    )
                                                }
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dokumen Verifikasi{" "}
                                            {profile
                                                ? "(Opsional jika tidak diubah)"
                                                : "*"}
                                        </label>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {profile
                                                ? "Unggah baru jika ingin mengganti."
                                                : "Wajib diisi. Bisa berupa KTP Penanggung Jawab atau Surat Izin Usaha."}
                                        </p>
                                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition h-40 flex items-center justify-center">
                                            {documentPreview ? (
                                                <div className="space-y-2">
                                                    <img
                                                        src={documentPreview}
                                                        alt="Document Preview"
                                                        className="mx-auto h-24 w-auto object-cover rounded-lg"
                                                    />
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-gray-400 text-4xl mb-2">
                                                        📄
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Upload Dokumen
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleFileChange(
                                                        e,
                                                        "verification_document",
                                                        setDocumentPreview
                                                    )
                                                }
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                required={!profile}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {progress && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="w-full bg-blue-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${progress.percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Menyimpan..."
                                            : "Simpan Profil"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
