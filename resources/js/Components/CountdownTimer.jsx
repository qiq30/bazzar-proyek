import React, { useState, useEffect } from "react";

// Fungsi helper untuk menghitung sisa waktu
const calculateTimeLeft = (targetDate) => {
    const target = new Date(targetDate);
    const now = new Date();
    const difference = target - now;

    // Cek jika tanggalnya tidak valid
    if (isNaN(target.getTime())) {
        return { isInvalid: true };
    }

    // Cek jika waktu sudah habis
    if (difference <= 0) {
        return { isTimeUp: true };
    }

    // Hitung sisa waktu
    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isTimeUp: false,
        isInvalid: false,
    };
};

export default function CountdownTimer({ targetDate, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

    useEffect(() => {
        // Jangan jalankan interval jika tanggal tidak valid atau waktu sudah habis
        if (timeLeft.isInvalid || timeLeft.isTimeUp) {
            return;
        }

        // Set interval untuk update timer setiap detik
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(targetDate);
            setTimeLeft(newTimeLeft);

            // Jika waktu habis, bersihkan interval dan panggil callback
            if (newTimeLeft.isTimeUp) {
                clearInterval(timer);
                if (onComplete) {
                    onComplete();
                }
            }
        }, 1000);

        // Bersihkan interval saat komponen di-unmount
        return () => clearInterval(timer);
    }, [targetDate, onComplete, timeLeft.isInvalid, timeLeft.isTimeUp]);

    // Render berdasarkan status
    if (timeLeft.isInvalid) {
        return (
            <div className="text-red-500">Tanggal pendaftaran tidak valid.</div>
        );
    }

    if (timeLeft.isTimeUp) {
        return (
            <div className="text-xl font-semibold text-green-600 dark:text-green-400">
                Pendaftaran telah dibuka!
            </div>
        );
    }

    // Render countdown timer
    return (
        <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Pendaftaran dibuka dalam:
            </h3>
            <div className="flex justify-center space-x-2 sm:space-x-4 mt-3 text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                <div className="text-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg min-w-[60px]">
                    <span className="block">{timeLeft.days}</span>
                    <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400">
                        Hari
                    </span>
                </div>
                <div className="self-center">:</div>
                <div className="text-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg min-w-[60px]">
                    <span className="block">
                        {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400">
                        Jam
                    </span>
                </div>
                <div className="self-center">:</div>
                <div className="text-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg min-w-[60px]">
                    <span className="block">
                        {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400">
                        Menit
                    </span>
                </div>
                <div className="self-center">:</div>
                <div className="text-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg min-w-[60px]">
                    <span className="block">
                        {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-xs sm:text-sm font-normal text-gray-500 dark:text-gray-400">
                        Detik
                    </span>
                </div>
            </div>
        </div>
    );
}
