import { useState, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiUser,
    FiMail,
    FiLock,
    FiUploadCloud,
    FiCheck,
    FiBriefcase,
    FiAlertCircle,
} from "react-icons/fi";

// Asumsi komponen ini sudah ada dari proyek Laravel Breeze/Jetstream Anda
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

// --- Komponen Bantuan ---
const Spinner = () => (
    <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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

const IconTextInput = ({
    icon,
    className = "",
    isInvalid = false,
    ...props
}) => (
    <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <div
                className={`transition-colors duration-200 ${
                    isInvalid ? "text-red-500" : "text-gray-400"
                }`}
            >
                {icon}
            </div>
        </div>
        <TextInput
            {...props}
            className={`mt-1 block w-full pl-10 transition-all duration-200 ${
                isInvalid
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
                    : "focus:border-blue-500 focus:ring-blue-500"
            } ${className}`}
        />
    </div>
);

const FileUpload = ({
    label,
    required,
    preview,
    error,
    onFileChange,
    isInvalid = false,
    ...props
}) => (
    <div>
        <InputLabel
            value={`${label}${required ? " *" : ""}`}
            className={isInvalid ? "text-red-600" : ""}
        />
        <div
            className={`group mt-2 relative border-2 border-dashed rounded-lg p-4 text-center h-40 flex flex-col items-center justify-center transition-all duration-300 ${
                isInvalid
                    ? "border-red-500 bg-red-50"
                    : error
                    ? "border-red-500"
                    : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            }`}
        >
            <AnimatePresence mode="wait">
                {preview ? (
                    <motion.img
                        key="preview"
                        src={preview}
                        alt="Preview"
                        className="max-h-full w-auto object-contain rounded"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                ) : (
                    <motion.div
                        key="placeholder"
                        className="text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <FiUploadCloud className="mx-auto h-10 w-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span
                            className={`mt-2 block text-sm transition-colors ${
                                isInvalid ? "text-red-500" : "text-gray-500"
                            }`}
                        >
                            Klik atau seret file untuk mengunggah
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
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

// --- Komponen Langkah (Steps) ---
const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3, ease: "easeIn" },
    },
};

const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

const Step1Account = ({ data, setData, errors, requiredFields }) => {
    const isFieldInvalid = (field) => {
        return (
            requiredFields.includes(field) &&
            (!data[field] || data[field].trim() === "")
        );
    };

    return (
        <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
        >
            <motion.div className="text-center" variants={inputVariants}>
                <h2 className="text-3xl font-bold text-gray-800">
                    Buat Akun Anda
                </h2>
                <p className="mt-2 text-gray-600">
                    Mulai perjalanan Anda bersama kami.
                </p>
            </motion.div>

            <motion.div variants={inputVariants}>
                <InputLabel
                    htmlFor="name"
                    value="Nama Lengkap *"
                    className={isFieldInvalid("name") ? "text-red-600" : ""}
                />
                <IconTextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    isFocused
                    icon={<FiUser className="h-5 w-5" />}
                    isInvalid={isFieldInvalid("name") || errors.name}
                />
                <InputError message={errors.name} className="mt-2" />
            </motion.div>

            <motion.div variants={inputVariants}>
                <InputLabel
                    htmlFor="email"
                    value="Email *"
                    className={isFieldInvalid("email") ? "text-red-600" : ""}
                />
                <IconTextInput
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    icon={<FiMail className="h-5 w-5" />}
                    isInvalid={isFieldInvalid("email") || errors.email}
                />
                <InputError message={errors.email} className="mt-2" />
            </motion.div>

            <motion.div variants={inputVariants}>
                <InputLabel
                    htmlFor="password"
                    value="Password *"
                    className={isFieldInvalid("password") ? "text-red-600" : ""}
                />
                <IconTextInput
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    required
                    icon={<FiLock className="h-5 w-5" />}
                    isInvalid={isFieldInvalid("password") || errors.password}
                />
                <InputError message={errors.password} className="mt-2" />
            </motion.div>

            <motion.div variants={inputVariants}>
                <InputLabel
                    htmlFor="password_confirmation"
                    value="Konfirmasi Password *"
                    className={
                        isFieldInvalid("password_confirmation")
                            ? "text-red-600"
                            : ""
                    }
                />
                <IconTextInput
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    required
                    icon={<FiLock className="h-5 w-5" />}
                    isInvalid={
                        isFieldInvalid("password_confirmation") ||
                        errors.password_confirmation
                    }
                />
                <InputError
                    message={errors.password_confirmation}
                    className="mt-2"
                />
            </motion.div>
        </motion.div>
    );
};

const Step2UmkmProfile = ({
    data,
    setData,
    errors,
    handleFileChange,
    logoPreview,
    ktpPreview,
    requiredFields,
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

    const isFieldInvalid = (field) => {
        if (field === "ktp") {
            return requiredFields.includes(field) && !data[field];
        }
        return (
            requiredFields.includes(field) &&
            (!data[field] || data[field].trim() === "")
        );
    };

    const inputErrorClass =
        "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50";
    const inputDefaultClass =
        "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

    return (
        <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.div className="text-center mb-6" variants={inputVariants}>
                <h2 className="text-3xl font-bold text-gray-800">
                    Profil UMKM
                </h2>
                <p className="mt-2 text-gray-600">
                    Ceritakan lebih banyak tentang usaha Anda.
                </p>
            </motion.div>

            <div className="space-y-4">
                <motion.div variants={inputVariants}>
                    <InputLabel
                        htmlFor="business_name"
                        value="Nama Usaha *"
                        className={
                            isFieldInvalid("business_name")
                                ? "text-red-600"
                                : ""
                        }
                    />
                    <TextInput
                        id="business_name"
                        value={data.business_name}
                        onChange={(e) =>
                            setData("business_name", e.target.value)
                        }
                        className={`mt-1 block w-full transition-all duration-200 ${
                            isFieldInvalid("business_name") ||
                            errors.business_name
                                ? inputErrorClass
                                : inputDefaultClass
                        }`}
                        required
                    />
                    <InputError
                        message={errors.business_name}
                        className="mt-2"
                    />
                </motion.div>

                <motion.div variants={inputVariants}>
                    <InputLabel
                        htmlFor="description"
                        value="Deskripsi Usaha *"
                        className={
                            isFieldInvalid("description") ? "text-red-600" : ""
                        }
                    />
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        rows="3"
                        className={`mt-1 block w-full rounded-md shadow-sm transition-all duration-200 ${
                            isFieldInvalid("description") || errors.description
                                ? inputErrorClass
                                : inputDefaultClass
                        }`}
                        required
                    />
                    <InputError message={errors.description} className="mt-2" />
                </motion.div>

                <motion.div variants={inputVariants}>
                    <InputLabel
                        htmlFor="business_type"
                        value="Jenis Usaha *"
                        className={
                            isFieldInvalid("business_type")
                                ? "text-red-600"
                                : ""
                        }
                    />
                    <select
                        id="business_type"
                        value={data.business_type}
                        onChange={(e) =>
                            setData("business_type", e.target.value)
                        }
                        className={`mt-1 block w-full rounded-md shadow-sm transition-all duration-200 ${
                            isFieldInvalid("business_type") ||
                            errors.business_type
                                ? inputErrorClass
                                : inputDefaultClass
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
                </motion.div>

                <motion.div variants={inputVariants}>
                    <InputLabel
                        htmlFor="address"
                        value="Alamat Usaha *"
                        className={
                            isFieldInvalid("address") ? "text-red-600" : ""
                        }
                    />
                    <textarea
                        id="address"
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        rows="3"
                        className={`mt-1 block w-full rounded-md shadow-sm transition-all duration-200 ${
                            isFieldInvalid("address") || errors.address
                                ? inputErrorClass
                                : inputDefaultClass
                        }`}
                        required
                    />
                    <InputError message={errors.address} className="mt-2" />
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 gap-6"
                    variants={inputVariants}
                >
                    <FileUpload
                        label="Logo Usaha (Opsional)"
                        preview={logoPreview}
                        onFileChange={(e) => handleFileChange(e, "logo")}
                        error={errors.logo}
                    />
                    <FileUpload
                        label="Foto KTP"
                        required
                        preview={ktpPreview}
                        error={errors.ktp}
                        isInvalid={isFieldInvalid("ktp")}
                        onFileChange={(e) => handleFileChange(e, "ktp")}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

const Step2PenyelenggaraProfile = ({
    data,
    setData,
    errors,
    handleFileChange,
    logoPreview,
    docPreview,
    requiredFields,
}) => {
    const isFieldInvalid = (field) => {
        if (field === "verification_document") {
            return requiredFields.includes(field) && !data[field];
        }
        return (
            requiredFields.includes(field) &&
            (!data[field] || data[field].trim() === "")
        );
    };

    const inputErrorClass =
        "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50";
    const inputDefaultClass =
        "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

    return (
        <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.div className="text-center mb-6" variants={inputVariants}>
                <h2 className="text-3xl font-bold text-gray-800">
                    Profil Penyelenggara
                </h2>
                <p className="mt-2 text-gray-600">
                    Lengkapi informasi instansi Anda.
                </p>
            </motion.div>

            <div className="space-y-4">
                <motion.div variants={inputVariants}>
                    <InputLabel
                        htmlFor="organizer_name"
                        value="Nama Instansi/Organisasi *"
                        className={
                            isFieldInvalid("organizer_name")
                                ? "text-red-600"
                                : ""
                        }
                    />
                    <TextInput
                        id="organizer_name"
                        value={data.organizer_name}
                        onChange={(e) =>
                            setData("organizer_name", e.target.value)
                        }
                        className={`mt-1 block w-full transition-all duration-200 ${
                            isFieldInvalid("organizer_name") ||
                            errors.organizer_name
                                ? inputErrorClass
                                : inputDefaultClass
                        }`}
                        required
                    />
                    <InputError
                        message={errors.organizer_name}
                        className="mt-2"
                    />
                </motion.div>

                <motion.div variants={inputVariants}>
                    <InputLabel
                        htmlFor="description"
                        value="Deskripsi Instansi/Organisasi *"
                        className={
                            isFieldInvalid("description") ? "text-red-600" : ""
                        }
                    />
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        rows="3"
                        className={`mt-1 block w-full rounded-md shadow-sm transition-all duration-200 ${
                            isFieldInvalid("description") || errors.description
                                ? inputErrorClass
                                : inputDefaultClass
                        }`}
                        required
                    />
                    <InputError message={errors.description} className="mt-2" />
                </motion.div>

                <motion.div variants={inputVariants}>
                    <InputLabel
                        htmlFor="address"
                        value="Alamat Instansi *"
                        className={
                            isFieldInvalid("address") ? "text-red-600" : ""
                        }
                    />
                    <textarea
                        id="address"
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        rows="3"
                        className={`mt-1 block w-full rounded-md shadow-sm transition-all duration-200 ${
                            isFieldInvalid("address") || errors.address
                                ? inputErrorClass
                                : inputDefaultClass
                        }`}
                        required
                    />
                    <InputError message={errors.address} className="mt-2" />
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 gap-6"
                    variants={inputVariants}
                >
                    <FileUpload
                        label="Logo Instansi (Opsional)"
                        preview={logoPreview}
                        onFileChange={(e) => handleFileChange(e, "logo")}
                        error={errors.logo}
                    />
                    <FileUpload
                        label="Dokumen (KTP/Surat Izin)"
                        required
                        preview={docPreview}
                        error={errors.verification_document}
                        isInvalid={isFieldInvalid("verification_document")}
                        onFileChange={(e) =>
                            handleFileChange(e, "verification_document")
                        }
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

// --- Komponen Wizard Utama ---
export default function RegisterWizard({ role, initialStep }) {
    const [logoPreview, setLogoPreview] = useState(null);
    const [ktpPreview, setKtpPreview] = useState(null);
    const [docPreview, setDocPreview] = useState(null);
    const [requiredFields, setRequiredFields] = useState([]);

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

    // Update required fields based on step and role
    useEffect(() => {
        if (initialStep === 1) {
            setRequiredFields([
                "name",
                "email",
                "password",
                "password_confirmation",
            ]);
        } else if (initialStep === 2) {
            if (role === "umkm") {
                setRequiredFields([
                    "business_name",
                    "description",
                    "business_type",
                    "address",
                    "ktp",
                ]);
            } else {
                setRequiredFields([
                    "organizer_name",
                    "description",
                    "address",
                    "verification_document",
                ]);
            }
        }
    }, [initialStep, role]);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (field === "logo") setLogoPreview(ev.target.result);
                else if (field === "ktp") setKtpPreview(ev.target.result);
                else if (field === "verification_document")
                    setDocPreview(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (initialStep === 1) {
            post(route("register.wizard.step1"));
        } else {
            post(route("register.wizard.finish"), {
                forceFormData: true,
                onSuccess: () => {
                    console.log(
                        "Form submitted successfully, Inertia will now redirect."
                    );
                },
                onError: (errors) => {
                    console.error("Validation errors:", errors);
                },
            });
        }
    };

    const isStepComplete = (step) => {
        if (step === 1) {
            return (
                data.name &&
                data.email &&
                data.password &&
                data.password_confirmation
            );
        } else if (step === 2) {
            if (role === "umkm") {
                return (
                    data.business_name &&
                    data.description &&
                    data.business_type &&
                    data.address &&
                    data.ktp
                );
            } else {
                return (
                    data.organizer_name &&
                    data.description &&
                    data.address &&
                    data.verification_document
                );
            }
        }
        return false;
    };

    const StepIcon = ({ step, currentStep, icon, label }) => {
        const isActive = currentStep >= step;
        const isComplete =
            currentStep > step ||
            (currentStep === step && isStepComplete(step));
        const hasErrors = currentStep === step && !isStepComplete(step);

        return (
            <div className="flex flex-col items-center">
                <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 relative
                            ${
                                isComplete
                                    ? "bg-green-600 text-white shadow-lg"
                                    : isActive
                                    ? hasErrors
                                        ? "bg-red-500 text-white shadow-lg"
                                        : "bg-blue-600 text-white shadow-lg"
                                    : "bg-gray-200 text-gray-500"
                            }`}
                    animate={{ scale: currentStep === step ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    whileHover={{ scale: 1.15 }}
                >
                    <AnimatePresence mode="wait">
                        {isComplete ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FiCheck size={24} />
                            </motion.div>
                        ) : hasErrors ? (
                            <motion.div
                                key="error"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FiAlertCircle size={24} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="icon"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {icon}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                <p
                    className={`mt-2 text-sm font-semibold transition-colors duration-300 ${
                        isComplete
                            ? "text-green-600"
                            : isActive
                            ? hasErrors
                                ? "text-red-500"
                                : "text-blue-600"
                            : "text-gray-500"
                    }`}
                >
                    {label}
                </p>
            </div>
        );
    };

    return (
        <motion.div
            className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <Head
                title={`Daftar sebagai ${
                    role === "umkm" ? "UMKM" : "Penyelenggara"
                }`}
            />
            <motion.div
                className="relative w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-xl overflow-hidden"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                {/* Kolom Kiri - Gambar & Branding (DIKEMBALIKAN KE VERSI ASLI) */}
                <div className="hidden md:block relative overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('images/fotobajardig.png')",
                        }}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2 }}
                    ></motion.div>

                    <div className="absolute inset-0 bg-blue-800 bg-opacity-60"></div>

                    <motion.div
                        className="relative h-full flex flex-col justify-start p-12 text-white z-10"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <h1 className="text-4xl font-bold leading-tight">
                            Wadah Kreatif, Wadah Usaha
                        </h1>
                        <p className="mt-4 text-blue-100">
                            Digital website bazar Banjarmasin hadir gasan UMKM
                            supaya makin maju, gasan penyelenggara supaya bisa
                            ngatur acara bamanfaat, lawan gasan masyarakat umum
                            supaya bisa marasai raminya, manungkar, lawan
                            balilihat bazar UMKM Online
                        </p>
                    </motion.div>

                    <motion.div
                        className="absolute inset-0 flex items-center justify-center z-20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        <img
                            src="images/bajardiglogo.png"
                            alt="Logo"
                            className="mt-20"
                            style={{ width: "800px", height: "auto" }}
                        />
                    </motion.div>
                </div>

                {/* Kolom Kanan - Form Wizard */}
                <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
                    <motion.div
                        className="flex justify-center items-center mb-10"
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <StepIcon
                            step={1}
                            currentStep={initialStep}
                            icon={<FiUser size={24} />}
                            label="Akun"
                        />
                        <div className="flex-1 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                    width: initialStep === 2 ? "100%" : "0%",
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeInOut",
                                    delay: 0.3,
                                }}
                            />
                        </div>
                        <StepIcon
                            step={2}
                            currentStep={initialStep}
                            icon={<FiBriefcase size={24} />}
                            label="Profil"
                        />
                    </motion.div>

                    <form onSubmit={handleFormSubmit}>
                        <AnimatePresence mode="wait">
                            {initialStep === 1 && (
                                <Step1Account
                                    key="step1"
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    requiredFields={requiredFields}
                                />
                            )}
                            {initialStep === 2 && role === "umkm" && (
                                <Step2UmkmProfile
                                    key="step2umkm"
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    handleFileChange={handleFileChange}
                                    logoPreview={logoPreview}
                                    ktpPreview={ktpPreview}
                                    requiredFields={requiredFields}
                                />
                            )}
                            {initialStep === 2 && role === "penyelenggara" && (
                                <Step2PenyelenggaraProfile
                                    key="step2penyelenggara"
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    handleFileChange={handleFileChange}
                                    logoPreview={logoPreview}
                                    docPreview={docPreview}
                                    requiredFields={requiredFields}
                                />
                            )}
                            <div className="my-6 flex items-center">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="mx-4 flex-shrink text-sm text-gray-500">
                                    Atau lanjutkan dengan
                                </span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            {/* TOMBOL GOOGLE */}
                            <a
                                href={route("auth.google.redirect")}
                                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Login Google</span>
                            </a>
                        </AnimatePresence>

                        <motion.div
                            className="flex items-center justify-between mt-8"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            {initialStep === 1 ? (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={route("login")}
                                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                    >
                                        Sudah punya akun?
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={route("register.wizard", {
                                            role,
                                        })}
                                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                    >
                                        &larr; Kembali
                                    </Link>
                                </motion.div>
                            )}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <PrimaryButton
                                    className="ms-4 !px-6 !py-3 !bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 !shadow-lg !transform transition-all duration-200"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    {initialStep === 1
                                        ? "Lanjutkan"
                                        : "Selesaikan Pendaftaran"}
                                </PrimaryButton>
                            </motion.div>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
}
