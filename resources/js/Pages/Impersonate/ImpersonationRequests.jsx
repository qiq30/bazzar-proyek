// resources/js/Pages/Impersonate/ImpersonationRequests.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import React, { useState } from "react";

const CountdownTimer = ({ expiryTime }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(expiryTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());
    const isTimeUp = !timeLeft.minutes && !timeLeft.seconds;

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    return (
        <div
            className={`text-xl font-mono ${
                isTimeUp ? "text-gray-500" : "text-red-600"
            }`}
        >
            {isTimeUp
                ? "Waktu Habis"
                : `${timeLeft.minutes}:${timeLeft.seconds < 10 ? "0" : ""}${
                      timeLeft.seconds
                  }`}
        </div>
    );
};

export default function ImpersonationRequests({
    auth,
    pendingRequest,
    dashboardRoute,
}) {
    const [processing, setProcessing] = useState(false);

    const handleResponse = (decision) => {
        if (
            confirm(
                `Apakah Anda yakin ingin ${
                    decision === "approve" ? "MENYETUJUI" : "MENOLAK"
                } permintaan ini?`
            )
        ) {
            setProcessing(true);
            router.post(
                route("impersonate.requests.respond", pendingRequest.id),
                {
                    decision: decision, // Kirim data 'decision' di body request
                },
                {
                    onFinish: () => setProcessing(false), // Setel ulang status processing setelah selesai
                }
            );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Persetujuan Akses Akun
                </h2>
            }
        >
            <Head title="Persetujuan Akses" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {pendingRequest ? (
                                <div className="text-center">
                                    <div className="text-yellow-500 text-6xl mb-4">
                                        ⚠️
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        Permintaan Akses Masuk
                                    </h3>
                                    <p className="text-gray-600 mt-2 mb-6 max-w-md mx-auto">
                                        Super Admin{" "}
                                        <strong>
                                            '{pendingRequest.super_admin.name}'
                                        </strong>{" "}
                                        meminta izin untuk mengakses akun Anda
                                        untuk tujuan bantuan atau verifikasi.
                                    </p>

                                    <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                                        <p className="text-sm text-gray-500">
                                            Permintaan ini akan berakhir dalam:
                                        </p>
                                        <CountdownTimer
                                            expiryTime={
                                                pendingRequest.expires_at
                                            }
                                        />
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() =>
                                                handleResponse("reject")
                                            }
                                            disabled={processing}
                                            className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                        >
                                            Tolak
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleResponse("approve")
                                            }
                                            disabled={processing}
                                            className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                        >
                                            Izinkan
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="text-green-500 text-6xl mb-4">
                                        ✔️
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        Tidak Ada Permintaan
                                    </h3>
                                    <p className="text-gray-600 mt-2 mb-6">
                                        Saat ini tidak ada permintaan akses yang
                                        menunggu persetujuan Anda.
                                    </p>
                                    <Link
                                        href={route(dashboardRoute)}
                                        className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Kembali ke Dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
