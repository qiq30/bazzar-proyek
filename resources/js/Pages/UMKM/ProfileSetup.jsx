// resources/js/Pages/UMKM/ProfileSetup.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";

const PendingProfileView = ({ profile }) => (
    // ... Komponen ini tidak berubah
    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 bg-yellow-50 border-b border-yellow-200">
            <h3 className="text-2xl font-bold text-yellow-800">
                Profil Anda Sedang Ditinjau
            </h3>
            <p className="mt-2 text-yellow-700">
                Admin akan segera memverifikasi data Anda. Harap tunggu, Anda
                akan dapat mendaftar event setelah profil disetujui. Anda tidak
                dapat mengubah data selama proses verifikasi.
            </p>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-500 text-sm">
                        Nama Usaha
                    </h4>
                    <p className="text-gray-900 text-lg">
                        {profile.business_name}
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-500 text-sm">
                        Jenis Usaha
                    </h4>
                    <p className="text-gray-900">{profile.business_type}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-500 text-sm">
                        Alamat
                    </h4>
                    <p className="text-gray-900 whitespace-pre-line">
                        {profile.address}
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-500 text-sm">
                        Deskripsi
                    </h4>
                    <p className="text-gray-900 text-sm whitespace-pre-line">
                        {profile.description}
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-500 text-sm">
                        Logo Usaha
                    </h4>
                    {profile.logo_url ? (
                        <a
                            href={profile.logo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={profile.logo_url}
                                alt="Logo"
                                className="mt-2 h-24 w-24 object-cover rounded-lg border hover:opacity-80 transition"
                            />
                        </a>
                    ) : (
                        <p className="text-gray-500 text-sm italic mt-2">
                            Tidak diunggah
                        </p>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-500 text-sm">
                        Dokumen KTP
                    </h4>
                    <a
                        href={
                            profile.ktp_path
                                ? `/storage/${profile.ktp_path}`
                                : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src={
                                profile.ktp_path
                                    ? `/storage/${profile.ktp_path}`
                                    : ""
                            }
                            alt="KTP"
                            className="mt-2 h-24 w-auto rounded-lg border hover:opacity-80 transition"
                        />
                    </a>
                </div>
            </div>
        </div>
        <div className="p-6 bg-gray-50 border-t text-right">
            <Link
                href={route("umkm.dashboard")}
                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
            >
                Kembali ke Dashboard
            </Link>
        </div>
    </div>
);

const ProfileForm = ({ umkmProfile }) => {
    const [logoPreview, setLogoPreview] = useState(
        umkmProfile?.logo_url || null
    );
    const [ktpPreview, setKtpPreview] = useState(
        umkmProfile?.ktp_path ? `/storage/${umkmProfile.ktp_path}` : null
    );

    const businessTypes = [
        "Kuliner",
        "Fashion",
        "Kerajinan",
        "Kecantikan",
        "Elektronik",
        "Pertanian",
        "Jasa",
        "Lainnya",
    ];

    const { data, setData, post, processing, errors } = useForm({
        business_name: umkmProfile?.business_name || "",
        description: umkmProfile?.description || "",
        address: umkmProfile?.address || "",
        business_type: umkmProfile?.business_type || "",
        logo: null,
        ktp: null,
    });

    const handleFileChange = (e, field, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("umkm.profile.store"));
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {umkmProfile && umkmProfile.status === "rejected"
                            ? "Perbaiki Profil UMKM"
                            : "Lengkapi Profil UMKM Anda"}
                    </h3>
                    <p className="text-gray-600">
                        Isi informasi lengkap tentang usaha Anda untuk dapat
                        mengikuti event bazar.
                    </p>

                    {umkmProfile?.status === "rejected" && (
                        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-800">
                            <p className="font-bold">Profil Anda Ditolak</p>
                            <p className="mt-1">
                                <strong>Alasan:</strong>{" "}
                                {umkmProfile.rejection_reason}
                            </p>
                            <p className="mt-2 text-sm">
                                Silakan periksa kembali data Anda, perbaiki jika
                                ada kesalahan, lalu simpan kembali untuk
                                diajukan ulang.
                            </p>
                        </div>
                    )}
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel
                            htmlFor="business_name"
                            value="Nama Usaha *"
                        />
                        <TextInput
                            id="business_name"
                            value={data.business_name}
                            onChange={(e) =>
                                setData("business_name", e.target.value)
                            }
                            className="mt-1 w-full"
                            required
                        />
                        <InputError
                            message={errors.business_name}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="business_type"
                            value="Jenis Usaha *"
                        />
                        <select
                            id="business_type"
                            value={data.business_type}
                            onChange={(e) =>
                                setData("business_type", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            required
                        >
                            <option value="">Pilih Jenis Usaha</option>
                            {businessTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={errors.business_type}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="address" value="Alamat Usaha *" />
                        <textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            rows="3"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            required
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="description"
                            value="Deskripsi Usaha *"
                        />
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows="4"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            required
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                        <div>
                            <InputLabel value="Logo Usaha (Opsional)" />
                            <p className="text-xs text-gray-500 mb-2">
                                Klik area di bawah untuk mengganti gambar.
                            </p>
                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-40 flex items-center justify-center">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Logo"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-gray-500">
                                        Upload Logo
                                    </span>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) =>
                                        handleFileChange(
                                            e,
                                            "logo",
                                            setLogoPreview
                                        )
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            {/* --- ▼▼▼ PERBAIKAN DI SINI ▼▼▼ --- */}
                            <InputLabel
                                value={`Foto KTP ${
                                    umkmProfile
                                        ? "(Opsional jika tidak diubah)"
                                        : "*"
                                }`}
                            />
                            <p className="text-xs text-gray-500 mb-2">
                                {umkmProfile
                                    ? "Unggah baru jika ingin mengganti."
                                    : "Wajib diisi untuk verifikasi."}
                            </p>
                            {/* --- ▲▲▲ AKHIR DARI PERBAIKAN --- */}
                            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-40 flex items-center justify-center">
                                {ktpPreview ? (
                                    <img
                                        src={ktpPreview}
                                        alt="KTP"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-gray-500">
                                        Upload KTP
                                    </span>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) =>
                                        handleFileChange(
                                            e,
                                            "ktp",
                                            setKtpPreview
                                        )
                                    }
                                    required={!umkmProfile} // Hanya required jika profil belum ada
                                />
                            </div>
                            <InputError message={errors.ktp} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                        <Link
                            href={route("umkm.dashboard")}
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            &larr; Kembali ke Dashboard
                        </Link>
                        <PrimaryButton disabled={processing}>
                            {processing
                                ? "Menyimpan..."
                                : umkmProfile?.status === "rejected"
                                ? "Ajukan Ulang Profil"
                                : "Simpan Profil"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function ProfileSetup({ auth, umkmProfile }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Profil UMKM
                </h2>
            }
        >
            <Head title="Profil UMKM" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {umkmProfile && umkmProfile.status === "pending" ? (
                        <PendingProfileView profile={umkmProfile} />
                    ) : (
                        <ProfileForm umkmProfile={umkmProfile} />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// -- Helper Components --
const InputLabel = ({ value, className = "", children, ...props }) => (
    <label
        {...props}
        className={`block text-sm font-medium text-gray-700 ` + className}
    >
        {value ? value : children}
    </label>
);
const TextInput = ({ className = "", ...props }) => (
    <input
        {...props}
        className={
            "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full " +
            className
        }
    />
);
const PrimaryButton = ({ className = "", children, disabled, ...props }) => (
    <button
        {...props}
        disabled={disabled}
        className={
            `inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ` +
            className
        }
    >
        {children}
    </button>
);
const InputError = ({ message, className = "" }) =>
    message ? (
        <p className={"text-sm text-red-600 " + className}>{message}</p>
    ) : null;
