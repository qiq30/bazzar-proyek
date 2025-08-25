import { Head, useForm } from "@inertiajs/react";

export default function PinLogin({ errors }) {
    const { data, setData, post, processing } = useForm({ pin: "" });

    const submit = (e) => {
        e.preventDefault();
        post(route("panitia.login.handle"));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <Head title="Login Panitia" />
            <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Akses Panel Panitia
                </h1>
                <form onSubmit={submit}>
                    <input
                        type="text"
                        value={data.pin}
                        onChange={(e) => setData("pin", e.target.value)}
                        className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 rounded-lg"
                        placeholder="Masukkan PIN"
                        maxLength="6"
                    />
                    {errors.pin && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.pin}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-lg"
                    >
                        Masuk
                    </button>
                </form>
            </div>
        </div>
    );
}
