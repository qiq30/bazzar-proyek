// resources/js/Pages/Auth/VerifyOtp.jsx

import { Head, Link, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShield, FiMail } from "react-icons/fi";

// Komponen Spinner untuk status loading
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

// Terima prop 'initialOtpExpiryTimestamp'
export default function VerifyOtp({ email, token, initialOtpExpiryTimestamp }) {
    const { data, setData, post, processing, errors } = useForm({
        otp: "",
    }); // Form helper baru & state untuk timer

    const { post: resendPost, processing: resending } = useForm();
    const [countdown, setCountdown] = useState(0); // Tetap mulai dari 0

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputsRef = useRef([]); // Sinkronisasi state OTP lokal dengan state form helper

    useEffect(() => {
        setData("otp", otp.join(""));
    }, [otp]);

    // Efek ini sekarang menggunakan prop untuk inisialisasi pertama
    useEffect(() => {
        let expiryTime = null; // Prioritaskan prop dari controller untuk inisialisasi pertama

        if (initialOtpExpiryTimestamp) {
            expiryTime = initialOtpExpiryTimestamp; // Simpan ke localStorage untuk refresh halaman
            localStorage.setItem("otpExpiryTime", expiryTime);
        } else {
            // Jika tidak ada prop (misal: refresh), coba baca dari localStorage
            expiryTime = localStorage.getItem("otpExpiryTime");
        }

        if (expiryTime) {
            const remaining = Math.round(
                (expiryTime - new Date().getTime()) / 1000
            );
            if (remaining > 0) {
                setCountdown(remaining);
            } else {
                // Jika waktu dari storage sudah habis, hapus itemnya
                localStorage.removeItem("otpExpiryTime");
                setCountdown(0); // Pastikan countdown 0 jika waktu habis
            }
        } else {
            setCountdown(0); // Jika tidak ada expiry time, pastikan countdown 0
        }
    }, [initialOtpExpiryTimestamp]); // Tambahkan initialOtpExpiryTimestamp sebagai dependency

    // Efek ini berjalan setiap kali nilai countdown berubah untuk mengurangi waktu
    useEffect(() => {
        if (countdown <= 0) {
            // Hapus localStorage jika timer habis
            localStorage.removeItem("otpExpiryTime");
            return;
        }

        const timerId = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [countdown]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            if (otp[index] === "") {
                if (e.target.previousSibling) {
                    const prevInput = e.target.previousSibling;
                    setOtp([
                        ...otp.map((d, idx) => (idx === index - 1 ? "" : d)),
                    ]);
                    prevInput.focus();
                }
            } else {
                setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
            }
        }
    };

    const handlePaste = (e) => {
        const value = e.clipboardData.getData("text");
        if (isNaN(value) || value.length !== 6) {
            return;
        }
        const newOtp = value.split("");
        setOtp(newOtp);
        inputsRef.current[5]?.focus();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("register.verify.otp"));
    };

    // Fungsi untuk handle kirim ulang OTP
    const handleResendOtp = (e) => {
        e.preventDefault();
        if (countdown > 0 || resending) return;

        const newExpiryTime = new Date().getTime() + 60 * 1000;
        localStorage.setItem("otpExpiryTime", newExpiryTime);
        setCountdown(60);

        resendPost(route("register.resend.otp"));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <Head title="Verifikasi OTP" />

            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2,
                    }}
                    className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center"
                >
                    <FiShield size={32} />
                </motion.div>

                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-3xl font-bold text-gray-800"
                    >
                        Verifikasi Akun Anda
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-2 text-gray-600"
                    >
                        Kami telah mengirimkan 6 digit kode ke{" "}
                        <strong className="text-gray-800">{email}</strong>.
                    </motion.p>
                </div>

                <form onSubmit={submit}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div
                            className="flex justify-center gap-2 sm:gap-3"
                            onPaste={handlePaste}
                        >
                            {otp.map((data, index) => {
                                return (
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        name="otp[]"
                                        maxLength="1"
                                        key={index}
                                        value={data}
                                        onChange={(e) =>
                                            handleChange(e.target, index)
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(e, index)
                                        }
                                        onFocus={(e) => e.target.select()}
                                        ref={(el) =>
                                            (inputsRef.current[index] = el)
                                        }
                                        className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold border rounded-lg transition-all duration-200
                                            ${
                                                errors.otp
                                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50"
                                                    : "border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                                            }
                                        `}
                                    />
                                );
                            })}
                        </div>
                        <InputError
                            message={errors.otp}
                            className="mt-3 text-center"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-8"
                    >
                        <PrimaryButton
                            className="w-full justify-center !py-3 !text-base !font-bold bg-yellow-500 hover:bg-yellow-600 !shadow-lg !transform transition-all duration-300"
                            disabled={processing}
                        >
                            <AnimatePresence>
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <FiMail className="mr-2" />
                                )}
                            </AnimatePresence>
                            Verifikasi Kode
                        </PrimaryButton>
                    </motion.div>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-6 text-center text-sm"
                >
                    {countdown > 0 ? (
                        <p className="text-gray-500">
                            Kirim ulang kode dalam {countdown} detik
                        </p>
                    ) : (
                        <p className="text-gray-500">
                            Tidak menerima kode?{" "}
                            <button
                                onClick={handleResendOtp}
                                disabled={resending}
                                className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {resending ? "Mengirim..." : "Kirim Ulang"}
                            </button>
                        </p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-4 text-center text-sm"
                >
                    <p className="text-gray-500">
                        Salah memasukkan email?{" "}
                        <Link
                            // Gunakan prop 'token' di sini
                            href={route("register.wizard", { token: token })}
                            className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
                        >
                            Kembali ke Pendaftaran
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
