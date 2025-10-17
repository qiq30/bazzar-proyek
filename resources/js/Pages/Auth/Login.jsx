import { useEffect } from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
        "g-recaptcha-response": "",
    });
    const { recaptcha_v3_site_key } = usePage().props;

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    // Hook ini akan berjalan SETIAP KALI 'g-recaptcha-response' berubah
    useEffect(() => {
        // Hanya jalankan post jika token sudah terisi
        if (data["g-recaptcha-response"]) {
            post(route("login"));
        }
    }, [data["g-recaptcha-response"]]); // Pantau perubahan token

    const submit = (e) => {
        e.preventDefault();

        // Fungsi ini sekarang HANYA bertugas mengambil dan MENYIMPAN token.
        // useEffect di atas yang akan menangani pengiriman form.
        if (window.grecaptcha) {
            window.grecaptcha.ready(() => {
                window.grecaptcha
                    .execute(recaptcha_v3_site_key, { action: "submit" })
                    .then((token) => {
                        setData("g-recaptcha-response", token);
                    });
            });
        } else {
            console.error("reCAPTCHA script not loaded");
        }
    };

    return (
        <>
            <Head title="Log in" />
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Form Section */}
                        <div className="w-full md:w-1/2 order-2 md:order-1">
                            <div className="px-6 py-8 sm:px-8 md:px-12 lg:px-16">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                        delay: 0.2,
                                    }}
                                >
                                    <div className="text-center md:text-left">
                                        <h2 className="mt-10 mb-3 text-3xl sm:text-4xl font-bold text-gray-800">
                                            Selamat Datang
                                        </h2>
                                        <p className="mb-6 sm:mb-8 text-gray-600">
                                            Silakan masuk untuk melanjutkan
                                        </p>
                                    </div>

                                    {status && (
                                        <div className="mb-4 text-sm font-medium text-green-600 text-center md:text-left">
                                            {status}
                                        </div>
                                    )}

                                    <form
                                        onSubmit={submit}
                                        className="space-y-6"
                                    >
                                        {/* FIELD EMAIL */}
                                        <div>
                                            <div className="relative">
                                                <EnvelopeIcon className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    className="block w-full py-3 pl-12 pr-4 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                    autoComplete="username"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Email Anda"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.email}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* FIELD PASSWORD */}
                                        <div>
                                            <div className="relative">
                                                <LockClosedIcon className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                <TextInput
                                                    id="password"
                                                    type="password"
                                                    value={data.password}
                                                    className="block w-full py-3 pl-12 pr-4 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                    autoComplete="current-password"
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Password"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.password}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mt-6">
                                            <label className="flex items-center justify-center sm:justify-start">
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
                                                <div className="text-center sm:text-right">
                                                    <Link
                                                        href={route(
                                                            "password.request"
                                                        )}
                                                        className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
                                                    >
                                                        Lupa password?
                                                    </Link>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-1 text-center text-xs text-gray-500">
                                            Situs ini dilindungi oleh reCAPTCHA
                                            dan berlaku
                                            <a
                                                href="https://policies.google.com/privacy"
                                                className="text-blue-600 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {" "}
                                                Kebijakan Privasi
                                            </a>{" "}
                                            dan
                                            <a
                                                href="https://policies.google.com/terms"
                                                className="text-blue-600 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {" "}
                                                Persyaratan Layanan
                                            </a>{" "}
                                            Google.
                                        </div>

                                        <PrimaryButton
                                            className="flex items-center justify-center w-full py-3 mt-8 font-bold bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:ring-blue-500"
                                            disabled={processing}
                                        >
                                            <AnimatePresence>
                                                {processing && (
                                                    <motion.div
                                                        key="processing-spinner"
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

                                    {/* PEMISAH */}
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

                                    <div className="mt-6 text-center text-sm text-gray-600">
                                        Belum punya akun?
                                        <div className="mt-2 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                                            <Link
                                                href={route("register.start", {
                                                    role: "umkm",
                                                })}
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                Daftar sebagai UMKM
                                            </Link>
                                            <span className="hidden sm:inline text-gray-400">
                                                |
                                            </span>
                                            <Link
                                                href={route("register.start", {
                                                    role: "penyelenggara",
                                                })}
                                                className="font-medium text-purple-600 hover:underline"
                                            >
                                                Daftar sebagai Penyelenggara
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 order-1 md:order-2">
                            <div className="relative h-48 sm:h-64 md:h-full min-h-[300px]">
                                <motion.div
                                    className="absolute inset-0 bg-center bg-cover"
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
                </div>
            </div>
        </>
    );
}
