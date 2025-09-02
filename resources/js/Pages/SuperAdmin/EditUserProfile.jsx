// resources/js/Pages/SuperAdmin/EditUserProfile.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link, router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import { useState } from "react";

// Form untuk profil UMKM
const UmkmProfileForm = ({ user, profile, onCancel }) => {
    const [logoPreview, setLogoPreview] = useState(profile?.logo_url || null);
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        name: user.name || "",
        email: user.email || "",
        business_name: profile.business_name || "",
        description: profile.description || "",
        address: profile.address || "",
        business_type: profile.business_type || "",
        logo: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("logo", file);
            const reader = new FileReader();
            reader.onload = (ev) => setLogoPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("superadmin.users.update", user.id));
    };

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

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <InputLabel htmlFor="name" value="Nama Pemilik *" />
                    <TextInput
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="mt-1 w-full"
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="email" value="Email Login *" />
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="mt-1 w-full"
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
            </div>
            <div className="border-t pt-6 grid md:grid-cols-2 gap-6">
                <div>
                    <InputLabel htmlFor="business_name" value="Nama Usaha *" />
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
                    <InputLabel htmlFor="business_type" value="Jenis Usaha *" />
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
                <InputLabel htmlFor="description" value="Deskripsi Usaha *" />
                <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    rows="4"
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    required
                />
                <InputError message={errors.description} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="logo" value="Logo Usaha (Opsional)" />
                <div className="mt-2 flex items-center gap-x-3">
                    {logoPreview ? (
                        <img
                            src={logoPreview}
                            alt="Logo"
                            className="h-20 w-20 object-cover rounded-full"
                        />
                    ) : (
                        <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <svg
                                className="h-10 w-10"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                />
                            </svg>
                        </div>
                    )}
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                </div>
                <InputError message={errors.logo} className="mt-2" />
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
                >
                    Batal
                </button>
                <PrimaryButton disabled={processing}>
                    {processing ? "Menyimpan..." : "Simpan Perubahan"}
                </PrimaryButton>
            </div>
        </form>
    );
};

// Form untuk profil Penyelenggara
const PenyelenggaraProfileForm = ({ user, profile, onCancel }) => {
    const [logoPreview, setLogoPreview] = useState(profile?.logo_url || null);
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        name: user.name || "",
        email: user.email || "",
        organizer_name: profile.organizer_name || "",
        description: profile.description || "",
        address: profile.address || "",
        logo: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("logo", file);
            const reader = new FileReader();
            reader.onload = (ev) => setLogoPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("superadmin.users.update", user.id));
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nama Penanggung Jawab *"
                    />
                    <TextInput
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="mt-1 w-full"
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div>
                    <InputLabel htmlFor="email" value="Email Login *" />
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className="mt-1 w-full"
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>
            </div>
            <div className="border-t pt-6 grid md:grid-cols-2 gap-6">
                <div>
                    <InputLabel
                        htmlFor="organizer_name"
                        value="Nama Instansi/Organisasi *"
                    />
                    <TextInput
                        id="organizer_name"
                        value={data.organizer_name}
                        onChange={(e) =>
                            setData("organizer_name", e.target.value)
                        }
                        className="mt-1 w-full"
                        required
                    />
                    <InputError
                        message={errors.organizer_name}
                        className="mt-2"
                    />
                </div>
            </div>
            <div>
                <InputLabel htmlFor="address" value="Alamat Instansi *" />
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
                    value="Deskripsi Instansi *"
                />
                <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    rows="4"
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    required
                />
                <InputError message={errors.description} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="logo" value="Logo Instansi (Opsional)" />
                <div className="mt-2 flex items-center gap-x-3">
                    {logoPreview ? (
                        <img
                            src={logoPreview}
                            alt="Logo"
                            className="h-20 w-20 object-cover rounded-full"
                        />
                    ) : (
                        <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <svg
                                className="h-10 w-10"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                />
                            </svg>
                        </div>
                    )}
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                </div>
                <InputError message={errors.logo} className="mt-2" />
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border rounded-md text-sm font-medium hover:bg-gray-100"
                >
                    Batal
                </button>
                <PrimaryButton disabled={processing}>
                    {processing ? "Menyimpan..." : "Simpan Perubahan"}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default function EditUserProfile({ auth, user, profile }) {
    const isUmkm = user.role === "UMKM";
    const profileTitle = isUmkm
        ? `UMKM: ${profile.business_name}`
        : `Penyelenggara: ${profile.organizer_name}`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Profil Pengguna
                    </h2>
                    <Link
                        href={route("superadmin.users.manage")}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        &larr; Kembali ke Manajemen Pengguna
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Profil - ${user.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {profileTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Anda mengedit sebagai Super Admin. Dokumen sensitif
                            seperti KTP dan dokumen verifikasi tidak ditampilkan
                            dan tidak dapat diubah di sini.
                        </p>

                        {isUmkm ? (
                            <UmkmProfileForm
                                user={user}
                                profile={profile}
                                onCancel={() => window.history.back()}
                            />
                        ) : (
                            <PenyelenggaraProfileForm
                                user={user}
                                profile={profile}
                                onCancel={() => window.history.back()}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
