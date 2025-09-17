import { Head, Link, useForm } from "@inertiajs/react";
import { FiTag, FiKey, FiLogIn, FiLoader } from "react-icons/fi";

export default function PinLogin({ errors }) {
    const { data, setData, post, processing } = useForm({ pin: "" });

    const submit = (e) => {
        e.preventDefault();
        post(route("panitia.login.handle"));
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
            <Head title="Login Panitia" />

            {/* Logo dan Judul Aplikasi */}
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center space-x-4">
                    <img
                        src="/images/logo-banjarmasin.png"
                        alt="Logo Pemko Banjarmasin"
                        className="h-16 w-auto"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Event Bazar UMKM
                        </h1>
                        <p className="text-base text-gray-600">
                            Pemerintah Kota Banjarmasin
                        </p>
                    </div>
                </Link>
            </div>

            {/* Kartu Login */}
            <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-xl">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                        <FiTag className="h-6 w-6 text-blue-600" />{" "}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Akses Panel Panitia
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Masukkan PIN 6 digit yang diberikan.
                    </p>
                </div>

                <form onSubmit={submit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="pin" className="sr-only">
                            PIN
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FiKey className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="pin"
                                name="pin"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={data.pin}
                                onChange={(e) =>
                                    setData(
                                        "pin",
                                        e.target.value.replace(/[^0-9]/g, "")
                                    )
                                }
                                className="w-full pl-10 pr-4 py-3 text-center text-2xl tracking-[.5em] font-semibold border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="------"
                                maxLength="6"
                                required
                                autoComplete="off"
                            />
                        </div>
                        {errors.pin && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.pin}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center items-center space-x-2 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300"
                    >
                        {processing ? (
                            <>
                                <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <FiLogIn className="h-5 w-5" />
                                <span>Masuk</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
