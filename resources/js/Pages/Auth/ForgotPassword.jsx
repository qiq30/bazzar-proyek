import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";

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

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <Head title="Lupa Password" />

            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
            >
                <div className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl font-bold text-gray-800"
                    >
                        Lupa Password?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-2 text-gray-600"
                    >
                        Jangan khawatir. Masukkan email Anda dan kami akan
                        mengirimkan kode OTP untuk mengatur ulang password Anda.
                    </motion.p>
                </div>

                {status && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg text-center"
                    >
                        {status}
                    </motion.div>
                )}

                <form onSubmit={submit}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="relative">
                            <FiMail className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full py-3 pl-12 pr-4 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="Masukkan email Anda"
                            />
                        </div>
                        <InputError message={errors.email} className="mt-2" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8"
                    >
                        <PrimaryButton
                            className="w-full justify-center !py-3 !text-base !font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 !shadow-lg !transform transition-all duration-300"
                            disabled={processing}
                        >
                            {/* ▲▲▲ AKHIR DARI PERUBAHAN ▲▲▲ */}
                            {processing && <Spinner />}
                            Kirim Kode OTP
                        </PrimaryButton>
                    </motion.div>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-6 text-center text-sm"
                >
                    <a
                        href={route("login")}
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center gap-2"
                    >
                        <FiArrowLeft />
                        Kembali ke Login
                    </a>
                </motion.div>
            </motion.div>
        </div>
    );
}
