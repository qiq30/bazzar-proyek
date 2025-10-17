// resources/js/Pages/UMKM/PaymentPage.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

// KOMPONEN COUNTDOWN TIMER
const CountdownTimer = ({ expiryTime, serverTime }) => {
    const calculateTimeLeft = () => {
        const serverNow = new Date(serverTime).getTime();
        const now = Date.now();
        const elapsed = now - serverNow;
        const difference = +new Date(expiryTime) - serverNow - elapsed;

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    const isTimeUp = !timeLeft.minutes && !timeLeft.seconds;

    useEffect(() => {
        const timer = setTimeout(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (!newTimeLeft.minutes && !newTimeLeft.seconds) {
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]); // Tambahkan timeLeft sebagai dependency

    const addLeadingZero = (value) => {
        return value < 10 ? `0${value}` : value;
    };

    return (
        <div
            className={`text-2xl font-mono tracking-widest text-center p-3 my-2 rounded-lg ${
                isTimeUp
                    ? "bg-gray-200 text-gray-500"
                    : "bg-red-100 text-red-700"
            }`}
        >
            {isTimeUp ? (
                <span>Waktu Habis!</span>
            ) : (
                <span>
                    {addLeadingZero(timeLeft.minutes || 0)}:
                    {addLeadingZero(timeLeft.seconds || 0)}
                </span>
            )}
        </div>
    );
};

export default function PaymentPage({ auth, event, registration, serverTime }) {
    const { setData, post, processing, errors } = useForm({
        bukti_pembayaran: null,
    });

    const submit = (e) => {
        e.preventDefault();
        // Menggunakan hashid, bukan id biasa, untuk route parameter
        post(route("umkm.events.uploadProof", registration.hashid));
    };

    const formatRupiah = (number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pembayaran Pendaftaran Event
                </h2>
            }
        >
            <Head title={`Pembayaran - ${event.nama_event}`} />
            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-2">
                            Selesaikan Pembayaran untuk "{event.nama_event}"
                        </h3>

                        {/* Tampilan Countdown Waktu  */}
                        <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg">
                            <h4 className="font-bold text-lg text-red-900 text-center">
                                Sisa Waktu Pembayaran
                            </h4>
                            <CountdownTimer
                                expiryTime={registration.payment_due}
                                serverTime={serverTime}
                            />
                            <p className="text-sm text-red-800 mt-2 text-center">
                                <strong>PENTING:</strong> Segera selesaikan
                                pembayaran dan unggah bukti sebelum waktu habis
                                untuk mengamankan slot Anda.
                            </p>
                        </div>

                        {/* Detail Pembayaran */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-bold text-lg text-blue-800">
                                Detail Pembayaran
                            </h4>
                            <div className="mt-2 space-y-1 text-gray-700">
                                <p>
                                    <strong>Transfer ke Rekening:</strong>
                                </p>
                                <p>Bank: {event.nama_bank_penyelenggara}</p>
                                <p>
                                    No. Rekening:{" "}
                                    {event.nomor_rekening_penyelenggara}
                                </p>
                                <p>Atas Nama: {event.nama_pemilik_rekening}</p>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between items-center text-xl font-bold mt-2 pt-2 border-t">
                                <span>TOTAL BAYAR:</span>
                                <span className="text-red-600">
                                    {formatRupiah(event.biaya_pendaftaran_umkm)}
                                </span>
                            </div>
                        </div>

                        {/* Kode Pendaftaran & Instruksi */}
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                            <h4 className="font-bold text-lg text-yellow-900">
                                Kode Pendaftaran Anda
                            </h4>
                            <p className="text-2xl font-mono tracking-widest text-center bg-gray-200 p-2 my-2 rounded">
                                {registration.kode_pendaftaran}
                            </p>
                            <p className="text-sm text-red-700 mt-2 text-center">
                                <strong>PENTING:</strong> Mohon masukkan{" "}
                                <strong>Kode Pendaftaran</strong> di atas pada
                                kolom <strong>Berita/Keterangan</strong> saat
                                melakukan transfer.
                            </p>
                        </div>

                        {/* Form Upload Bukti */}
                        <form onSubmit={submit} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium">
                                    Upload Bukti Transfer *
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "bukti_pembayaran",
                                            e.target.files[0]
                                        )
                                    }
                                    className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                />
                                {errors.bukti_pembayaran && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.bukti_pembayaran}
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Mengunggah..."
                                        : "Saya Sudah Membayar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
