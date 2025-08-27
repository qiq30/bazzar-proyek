import { Head, Link, useForm } from "@inertiajs/react";

// --- Komponen Ikon SVG ---
const TicketIcon = (props) => (
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
            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18m-3-9h18M5.25 6h13.5c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H5.25A1.125 1.125 0 014.125 15V7.125A1.125 1.125 0 015.25 6z"
        />
    </svg>
);
const KeyIcon = (props) => (
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
            d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
        />
    </svg>
);
const LoginIcon = (props) => (
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
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
        />
    </svg>
);
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
                        <TicketIcon className="h-6 w-6 text-blue-600" />
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
                                <KeyIcon className="h-5 w-5 text-gray-400" />
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
                                <Spinner />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            <>
                                <LoginIcon className="h-5 w-5" />
                                <span>Masuk</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
