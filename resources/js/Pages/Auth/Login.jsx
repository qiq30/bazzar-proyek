import { useEffect } from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

// Import untuk ikon dan animasi
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <>
            <Head title="Log in" />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
                {/* PENYESUAIAN RESPONSIVE:
                  - flex-col-reverse: Di layar kecil, gambar akan muncul di ATAS form.
                  - md:flex-row: Di layar medium ke atas, layout kembali menjadi berdampingan.
                  - overflow-hidden: Memastikan sudut rounded-2xl teraplikasi sempurna ke gambar dan form.
                */}
                <div className="relative flex flex-col-reverse w-full max-w-4xl bg-white shadow-2xl rounded-2xl md:flex-row overflow-hidden">
                    {/* Kolom Kiri (Form Login) */}
                    <div className="flex flex-col justify-center w-full md:w-1/2 p-8 md:p-14">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: 0.4,
                            }}
                        >
                            <div className="text-center">
                                <h2 className="mb-3 text-4xl font-bold text-gray-800">
                                    Selamat Datang
                                </h2>
                                <p className="mb-8 text-gray-600">
                                    Silakan masuk untuk melanjutkan
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div className="relative">
                                    <EnvelopeIcon className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        className="block w-full py-3 pl-12 pr-4 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="Email Anda"
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="relative">
                                    <LockClosedIcon className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        className="block w-full py-3 pl-12 pr-4 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Password"
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex flex-col items-center justify-between mt-6 sm:flex-row">
                                    <label className="flex items-center mb-4 sm:mb-0">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked
                                                )
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-600 ms-2">
                                            Ingat saya
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
                                        >
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>

                                <PrimaryButton
                                    className="flex items-center justify-center w-full py-3 mt-8 font-bold bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:ring-blue-500"
                                    disabled={processing}
                                >
                                    <AnimatePresence>
                                        {processing && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.5,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.5,
                                                }}
                                                className="mr-2"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-white animate-spin"
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <span>Masuk</span>
                                </PrimaryButton>
                            </form>
                        </motion.div>
                    </div>

                    {/* Kolom Kanan (Gambar) */}
                    <div className="relative w-full h-64 md:w-1/2 md:h-auto">
                        <motion.div
                            className="w-full h-full bg-center bg-cover"
                            style={{
                                backgroundImage: `url('/images/BAJARDIGG.png')`,
                            }}
                            initial={{ scale: 1.2, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                duration: 1.2,
                                ease: [0.43, 0.13, 0.23, 0.96],
                            }}
                        ></motion.div>
                        <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ x: 0 }}
                            animate={{ x: "100%" }}
                            transition={{
                                duration: 0.8,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        ></motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
