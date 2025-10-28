// resources/js/Components/QRISCard.jsx

import { useState } from "react";

export default function QRISCard({ umkm }) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!umkm.qris_url) {
        return (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-5xl mb-3">📱</div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                    QRIS Belum Tersedia
                </h4>
                <p className="text-gray-500 text-sm">
                    UMKM ini belum mengupload kode QRIS untuk pembayaran
                    digital.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Scan untuk Pembayaran
                    </h4>
                    <p className="text-sm text-gray-600">
                        Gunakan aplikasi e-wallet favorit Anda
                    </p>
                </div>

                <div
                    className="inline-block bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setIsFullscreen(true)}
                >
                    <img
                        src={umkm.qris_url}
                        alt={`QRIS ${umkm.business_name}`}
                        className="w-48 h-48 object-contain mx-auto"
                        loading="lazy"
                    />
                </div>

                <p className="text-xs text-gray-500 mt-3">
                    Klik gambar untuk memperbesar
                </p>

                {/* Supported Payment Methods */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Mendukung:</p>
                    <div className="flex justify-center space-x-2 text-xs">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            OVO
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                            GoPay
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            DANA
                        </span>
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            ShopeePay
                        </span>
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsFullscreen(false)}
                >
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                QRIS {umkm.business_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Scan dengan aplikasi e-wallet Anda
                            </p>
                        </div>

                        <div className="flex justify-center mb-4">
                            <img
                                src={umkm.qris_url}
                                alt={`QRIS ${umkm.business_name}`}
                                className="w-72 h-72 object-contain"
                                loading="lazy"
                            />
                        </div>

                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
