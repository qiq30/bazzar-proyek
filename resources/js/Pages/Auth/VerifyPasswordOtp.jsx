import { useEffect, useRef, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { motion } from "framer-motion";

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

export default function VerifyPasswordOtp({ email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email,
        otp: "",
        password: "",
        password_confirmation: "",
    });

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputsRef = useRef([]);

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    useEffect(() => {
        setData("otp", otp.join(""));
    }, [otp]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    // --- ▼▼▼ FUNGSI BARU UNTUK BACKSPACE ▼▼▼ ---
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            // Jika input saat ini kosong, pindah ke input sebelumnya
            if (otp[index] === "") {
                if (e.target.previousSibling) {
                    const prevInput = e.target.previousSibling;
                    setOtp([
                        ...otp.map((d, idx) => (idx === index - 1 ? "" : d)),
                    ]);
                    prevInput.focus();
                }
            } else {
                // Jika input saat ini ada isinya, hapus isinya
                setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
            }
        }
    };
    // --- ▲▲▲ AKHIR FUNGSI BARU ▲▲▲ ---

    const handlePaste = (e) => {
        const value = e.clipboardData.getData("text");
        if (isNaN(value) || value.length !== 6) return;
        setOtp(value.split(""));
        inputsRef.current[5]?.focus();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("password.store"));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <Head title="Reset Password" />

            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Atur Ulang Password
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Masukkan kode OTP yang dikirim ke{" "}
                        <strong className="text-gray-800">{email}</strong> dan
                        buat password baru Anda.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="otp" value="Kode OTP" />
                        <div
                            className="flex justify-center gap-2 pt-1"
                            onPaste={handlePaste}
                        >
                            {otp.map((data, index) => (
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="1"
                                    key={index}
                                    value={data}
                                    onChange={(e) =>
                                        handleChange(e.target, index)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, index)} // Tambahkan event handler ini
                                    ref={(el) =>
                                        (inputsRef.current[index] = el)
                                    }
                                    className={`w-12 h-14 text-center text-2xl font-semibold border rounded-lg transition-all duration-200
                                        ${
                                            errors.otp
                                                ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50"
                                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                    required // Tambahkan validasi wajib isi
                                />
                            ))}
                        </div>
                        <InputError message={errors.otp} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password Baru" />
                        <TextInput
                            id="password"
                            type="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required // --- ▼▼▼ TAMBAHKAN INI ▼▼▼
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Konfirmasi Password Baru"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required // --- ▼▼▼ TAMBAHKAN INI ▼▼▼
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="pt-4">
                        <PrimaryButton
                            className="w-full justify-center !py-3 !text-base !font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 !shadow-lg !transform transition-all duration-300"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Reset Password
                        </PrimaryButton>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
