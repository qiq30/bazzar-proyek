import { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

// --- Komponen Ikon SVG ---
const UserCircleIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
        />
    </svg>
);
const EnvelopeIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
    </svg>
);
const LockIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
    </svg>
);
const IdCardIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z"
        />
    </svg>
);
const UploadIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
    </svg>
);
const Spinner = () => (
    <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
    </svg>
);

// Komponen Input dengan Ikon
const IconTextInput = ({ icon, ...props }) => (
    <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
        </div>
        <TextInput
            {...props}
            className={`mt-1 block w-full pl-10 ${props.className || ""}`}
        />
    </div>
);

// Komponen Upload File yang Diperbarui
const FileUpload = ({
    label,
    required,
    preview,
    error,
    isInvalid,
    onFileChange,
    ...props
}) => (
    <div>
        <InputLabel value={`${label}${required ? " *" : ""}`} />
        <div
            className={`mt-2 relative border-2 border-dashed rounded-lg p-4 text-center h-32 flex flex-col items-center justify-center transition-colors ${
                isInvalid
                    ? "border-red-500"
                    : "border-gray-300 hover:border-blue-400"
            }`}
        >
            {preview ? (
                <img
                    src={preview}
                    alt="Preview"
                    className="max-h-full w-auto object-contain rounded"
                />
            ) : (
                <>
                    <UploadIcon className="h-8 w-8 text-gray-400 mb-1" />
                    <span className="text-sm text-gray-500">
                        Klik untuk mengunggah
                    </span>
                </>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                {...props}
            />
        </div>
        <InputError message={error} className="mt-2" />
    </div>
);

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
            <IconTextInput
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                required
                isFocused
                icon={<UserCircleIcon className="h-5 w-5 text-gray-400" />}
                className={!data.name ? "border-red-500" : ""}
            />
            <InputError message={errors.name} className="mt-2" />
        </div>
        <div className="mt-4">
            <InputLabel htmlFor="email" value="Email" />
            <IconTextInput
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                required
                icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                className={!data.email ? "border-red-500" : ""}
            />
            <InputError message={errors.email} className="mt-2" />
        </div>
        <div className="mt-4">
            <InputLabel htmlFor="password" value="Password" />
            <IconTextInput
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                required
                icon={<LockIcon className="h-5 w-5 text-gray-400" />}
                className={!data.password ? "border-red-500" : ""}
            />
            <InputError message={errors.password} className="mt-2" />
        </div>
        <div className="mt-4">
            <InputLabel
                htmlFor="password_confirmation"
                value="Konfirmasi Password"
            />
            <IconTextInput
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) =>
                    setData("password_confirmation", e.target.value)
                }
                required
                icon={<LockIcon className="h-5 w-5 text-gray-400" />}
                className={
                    !data.password_confirmation ||
                    data.password !== data.password_confirmation
                        ? "border-red-500"
                        : ""
                }
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
                            !data.business_name ? "border-red-500" : ""
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
                        className={`mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${
                            !data.business_type ? "border-red-500" : ""
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
                        className={`mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${
                            !data.address ? "border-red-500" : ""
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
                        className={`mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${
                            !data.description ? "border-red-500" : ""
                        }`}
                        required
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <FileUpload
                        label="Logo Usaha (Opsional)"
                        preview={logoPreview}
                        onFileChange={(e) =>
                            handleFileChange(e, "logo", "setLogoPreview")
                        }
                    />
                    <FileUpload
                        label="Foto KTP"
                        required
                        preview={ktpPreview}
                        error={errors.ktp}
                        isInvalid={!data.ktp}
                        onFileChange={(e) =>
                            handleFileChange(e, "ktp", "setKtpPreview")
                        }
                    />
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
                        !data.organizer_name ? "border-red-500" : ""
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
                    className={`mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${
                        !data.address ? "border-red-500" : ""
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
                    className={`mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${
                        !data.description ? "border-red-500" : ""
                    }`}
                    required
                />
                <InputError message={errors.description} className="mt-2" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <FileUpload
                    label="Logo Instansi (Opsional)"
                    preview={logoPreview}
                    onFileChange={(e) =>
                        handleFileChange(e, "logo", "setLogoPreview")
                    }
                />
                <FileUpload
                    label="Dokumen (KTP/Surat Izin)"
                    required
                    preview={docPreview}
                    error={errors.verification_document}
                    isInvalid={!data.verification_document}
                    onFileChange={(e) =>
                        handleFileChange(
                            e,
                            "verification_document",
                            "setDocPreview"
                        )
                    }
                />
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
            if (!isStep1Invalid) post(route("register.wizard.step1"));
        } else {
            if (!isStep2Invalid)
                post(route("register.wizard.finish"), { forceFormData: true });
        }
    };

    const StepIcon = ({ step, currentStep, icon }) => {
        const isActive = currentStep >= step;
        const isInvalid =
            (step === 1 && isStep1Invalid) || (step === 2 && isStep2Invalid);
        let bgColor = isActive
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-500";
        if (currentStep === step && isInvalid) {
            bgColor = "bg-red-500 text-white";
        }
        return (
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${bgColor}`}
            >
                {icon}
            </div>
        );
    };

    return (
        <GuestLayout>
            <Head
                title={`Daftar sebagai ${
                    role === "umkm" ? "UMKM" : "Penyelenggara"
                }`}
            />

            <div className="flex justify-center items-center mb-8">
                <StepIcon
                    step={1}
                    currentStep={initialStep}
                    icon={<UserCircleIcon className="w-6 h-6" />}
                />
                <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                        initialStep > 1 ? "bg-blue-600" : "bg-gray-200"
                    }`}
                ></div>
                <StepIcon
                    step={2}
                    currentStep={initialStep}
                    icon={<IdCardIcon className="w-6 h-6" />}
                />
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
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sudah punya akun?
                        </Link>
                    ) : (
                        <Link
                            href={route("register.wizard", { role })}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            &larr; Kembali
                        </Link>
                    )}
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing && <Spinner />}
                        {initialStep === 1
                            ? "Lanjutkan"
                            : "Selesaikan Pendaftaran"}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
