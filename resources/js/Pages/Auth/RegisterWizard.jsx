import { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

// --- Step 1 ---
const Step1Account = ({ data, setData, errors }) => (
    <>
        <h2 className="text-2xl font-bold text-center mb-1">
            Langkah 1: Buat Akun Anda
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
            Mulai dengan informasi dasar untuk login.
        </p>
        <div>
            <InputLabel htmlFor="name" value="Nama Lengkap" />
            <TextInput
                id="name"
                value={data.name}
                className={`mt-1 block w-full ${
                    !data.name && "border-red-500"
                }`}
                onChange={(e) => setData("name", e.target.value)}
                required
                isFocused
            />
            <InputError message={errors.name} className="mt-2" />
        </div>
        <div className="mt-4">
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
                id="email"
                type="email"
                value={data.email}
                className={`mt-1 block w-full ${
                    !data.email && "border-red-500"
                }`}
                onChange={(e) => setData("email", e.target.value)}
                required
            />
            <InputError message={errors.email} className="mt-2" />
        </div>
        <div className="mt-4">
            <InputLabel htmlFor="password" value="Password" />
            <TextInput
                id="password"
                type="password"
                value={data.password}
                className={`mt-1 block w-full ${
                    !data.password && "border-red-500"
                }`}
                onChange={(e) => setData("password", e.target.value)}
                required
            />
            <InputError message={errors.password} className="mt-2" />
        </div>
        <div className="mt-4">
            <InputLabel
                htmlFor="password_confirmation"
                value="Konfirmasi Password"
            />
            <TextInput
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                className={`mt-1 block w-full ${
                    !data.password_confirmation ||
                    data.password !== data.password_confirmation
                        ? "border-red-500"
                        : ""
                }`}
                onChange={(e) =>
                    setData("password_confirmation", e.target.value)
                }
                required
            />
            <InputError
                message={errors.password_confirmation}
                className="mt-2"
            />
        </div>
    </>
);

// --- Step 2 UMKM ---
const Step2UmkmProfile = ({
    data,
    setData,
    errors,
    handleFileChange,
    logoPreview,
    ktpPreview,
}) => {
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
        <>
            <h2 className="text-2xl font-bold text-center mb-1">
                Lengkapi Profil UMKM
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">
                Informasi ini akan ditampilkan di halaman publik setelah
                diverifikasi.
            </p>
            <div className="space-y-6">
                <div>
                    <InputLabel htmlFor="business_name" value="Nama Usaha *" />
                    <TextInput
                        id="business_name"
                        value={data.business_name}
                        onChange={(e) =>
                            setData("business_name", e.target.value)
                        }
                        className={`mt-1 block w-full ${
                            !data.business_name && "border-red-500"
                        }`}
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
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                            !data.business_type && "border-red-500"
                        }`}
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
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                            !data.address && "border-red-500"
                        }`}
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
                        onChange={(e) => setData("description", e.target.value)}
                        rows="4"
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                            !data.description && "border-red-500"
                        }`}
                        required
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel
                            htmlFor="logo"
                            value="Logo Usaha (Opsional)"
                        />
                        <div
                            className={`mt-2 relative border-2 border-dashed rounded-lg p-4 text-center h-32 flex items-center justify-center ${
                                data.logo === null
                                    ? "border-gray-300"
                                    : "border-blue-400"
                            }`}
                        >
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Preview"
                                    className="max-h-full w-auto object-contain rounded"
                                />
                            ) : (
                                <div className="text-gray-400 text-3xl">🏪</div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleFileChange(
                                        e,
                                        "logo",
                                        "setLogoPreview"
                                    )
                                }
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                    <div>
                        <InputLabel htmlFor="ktp" value="Foto KTP *" />
                        <div
                            className={`mt-2 relative border-2 border-dashed rounded-lg p-4 text-center h-32 flex items-center justify-center ${
                                !data.ktp ? "border-red-500" : "border-blue-400"
                            }`}
                        >
                            {ktpPreview ? (
                                <img
                                    src={ktpPreview}
                                    alt="Preview"
                                    className="max-h-full w-auto object-contain rounded"
                                />
                            ) : (
                                <div className="text-gray-400 text-3xl">🆔</div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleFileChange(e, "ktp", "setKtpPreview")
                                }
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                required
                            />
                        </div>
                        <InputError message={errors.ktp} className="mt-2" />
                    </div>
                </div>
            </div>
        </>
    );
};

// --- Step 2 Penyelenggara ---
const Step2PenyelenggaraProfile = ({
    data,
    setData,
    errors,
    handleFileChange,
    logoPreview,
    docPreview,
}) => (
    <>
        <h2 className="text-2xl font-bold text-center mb-1">
            Lengkapi Profil Penyelenggara
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
            Profil ini akan diverifikasi oleh Admin.
        </p>
        <div className="space-y-6">
            <div>
                <InputLabel
                    htmlFor="organizer_name"
                    value="Nama Instansi/Organisasi *"
                />
                <TextInput
                    id="organizer_name"
                    value={data.organizer_name}
                    onChange={(e) => setData("organizer_name", e.target.value)}
                    className={`mt-1 block w-full ${
                        !data.organizer_name && "border-red-500"
                    }`}
                    required
                />
                <InputError message={errors.organizer_name} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="address" value="Alamat Instansi *" />
                <textarea
                    id="address"
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    rows="3"
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                        !data.address && "border-red-500"
                    }`}
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
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${
                        !data.description && "border-red-500"
                    }`}
                    required
                />
                <InputError message={errors.description} className="mt-2" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <InputLabel
                        htmlFor="logo"
                        value="Logo Instansi (Opsional)"
                    />
                    <div
                        className={`mt-7 relative border-2 border-dashed rounded-lg p-4 text-center h-32 flex items-center justify-center ${
                            data.logo === null
                                ? "border-gray-300"
                                : "border-blue-400"
                        }`}
                    >
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Preview"
                                className="max-h-full w-auto object-contain rounded"
                            />
                        ) : (
                            <div className="text-gray-400 text-3xl">🏢</div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                handleFileChange(e, "logo", "setLogoPreview")
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
                <div>
                    <InputLabel
                        htmlFor="verification_document"
                        value="Dokumen (KTP/Surat Izin Organisasi) *"
                    />
                    <div
                        className={`mt-2 relative border-2 border-dashed rounded-lg p-4 text-center h-32 flex items-center justify-center ${
                            !data.verification_document
                                ? "border-red-500"
                                : "border-blue-400"
                        }`}
                    >
                        {docPreview ? (
                            <img
                                src={docPreview}
                                alt="Preview"
                                className="max-h-full w-auto object-contain rounded"
                            />
                        ) : (
                            <div className="text-gray-400 text-3xl">📄</div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                handleFileChange(
                                    e,
                                    "verification_document",
                                    "setDocPreview"
                                )
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            required
                        />
                    </div>
                    <InputError
                        message={errors.verification_document}
                        className="mt-2"
                    />
                </div>
            </div>
        </div>
    </>
);

export default function RegisterWizard({ role, initialStep }) {
    const [logoPreview, setLogoPreview] = useState(null);
    const [ktpPreview, setKtpPreview] = useState(null);
    const [docPreview, setDocPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: role,
        business_name: "",
        description: "",
        address: "",
        business_type: "",
        logo: null,
        ktp: null,
        organizer_name: "",
        verification_document: null,
    });

    const handleFileChange = (e, field, previewSetter) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (previewSetter === "setLogoPreview")
                    setLogoPreview(ev.target.result);
                else if (previewSetter === "setKtpPreview")
                    setKtpPreview(ev.target.result);
                else if (previewSetter === "setDocPreview")
                    setDocPreview(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const isStep1Invalid =
        !data.name ||
        !data.email ||
        !data.password ||
        !data.password_confirmation ||
        data.password !== data.password_confirmation;

    const isStep2Invalid =
        role === "umkm"
            ? !data.business_name ||
              !data.business_type ||
              !data.address ||
              !data.description ||
              !data.ktp
            : !data.organizer_name ||
              !data.address ||
              !data.description ||
              !data.verification_document;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (initialStep === 1) {
            if (!isStep1Invalid) {
                post(route("register.wizard.step1"));
            }
        } else {
            if (!isStep2Invalid) {
                post(route("register.wizard.finish"), { forceFormData: true });
            }
        }
    };

    return (
        <GuestLayout>
            <Head
                title={`Daftar sebagai ${
                    role === "umkm" ? "UMKM" : "Penyelenggara"
                }`}
            />

            <div className="flex justify-center items-center mb-8">
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        initialStep === 1 && isStep1Invalid
                            ? "bg-red-500 text-white"
                            : initialStep >= 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300 text-gray-600"
                    }`}
                >
                    1
                </div>
                <div
                    className={`flex-1 h-1 mx-2 ${
                        initialStep > 1 ? "bg-blue-600" : "bg-gray-300"
                    }`}
                ></div>
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        initialStep === 2 && isStep2Invalid
                            ? "bg-red-500 text-white"
                            : initialStep >= 2
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300 text-gray-600"
                    }`}
                >
                    2
                </div>
            </div>

            <form onSubmit={handleFormSubmit}>
                {initialStep === 1 && (
                    <Step1Account
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                )}

                {initialStep === 2 && role === "umkm" && (
                    <Step2UmkmProfile
                        data={data}
                        setData={setData}
                        errors={errors}
                        handleFileChange={handleFileChange}
                        logoPreview={logoPreview}
                        ktpPreview={ktpPreview}
                    />
                )}

                {initialStep === 2 && role === "penyelenggara" && (
                    <Step2PenyelenggaraProfile
                        data={data}
                        setData={setData}
                        errors={errors}
                        handleFileChange={handleFileChange}
                        logoPreview={logoPreview}
                        docPreview={docPreview}
                    />
                )}

                <div className="flex items-center justify-between mt-6">
                    {initialStep === 1 ? (
                        <Link
                            href={route("login")}
                            className="underline text-sm text-gray-600 hover:text-gray-900"
                        >
                            Sudah punya akun?
                        </Link>
                    ) : (
                        <Link
                            href={route("register.wizard", { role })}
                            className="underline text-sm text-gray-600 hover:text-gray-900"
                        >
                            &larr; Kembali
                        </Link>
                    )}
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing
                            ? "Memproses..."
                            : initialStep === 1
                            ? "Lanjutkan"
                            : "Selesaikan Pendaftaran"}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
