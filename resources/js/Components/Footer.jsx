// File: resources/js/Components/Footer.jsx

import {
    FiMapPin,
    FiPhone,
    FiMail,
    FiInstagram,
    FiFacebook,
    FiYoutube,
    FiTwitter,
    FiShield,
    FiSettings,
    FiHelpCircle,
    FiFileText,
} from "react-icons/fi";

export default function Footer({ user = null }) {
    // Simple footer untuk admin dan super admin
    if (user && (user.is_admin || user.is_super_admin)) {
        return (
            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Admin Footer Content */}
                    <div className="py-6">
                        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                            {/* Left Side - Brand */}
                            <div className="flex items-center space-x-4">
                                <img
                                    src="/images/Banjarmasin-A-Thousand-River-City-Logo.png"
                                    alt="Logo Banjarmasin"
                                    className="h-8 w-auto"
                                />
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-gray-900">
                                        Admin Panel - Event Bazar UMKM
                                    </div>
                                    <div className="text-xs text-blue-600">
                                        Pemerintah Kota Banjarmasin
                                    </div>
                                </div>
                            </div>

                            {/* Center - Quick Links for Admin */}
                            <div className="flex items-center space-x-6 text-xs">
                                <a
                                    href="#"
                                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <FiHelpCircle className="w-3 h-3" />
                                    <span>Bantuan</span>
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <FiFileText className="w-3 h-3" />
                                    <span>Dokumentasi</span>
                                </a>
                                {user.is_super_admin && (
                                    <a
                                        href="#"
                                        className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        <FiSettings className="w-3 h-3" />
                                        <span>System Config</span>
                                    </a>
                                )}
                                <div className="flex items-center space-x-1 text-blue-600">
                                    <FiShield className="w-3 h-3" />
                                    <span className="font-medium">
                                        {user.is_super_admin
                                            ? "Super Admin"
                                            : "Administrator"}
                                    </span>
                                </div>
                            </div>

                            {/* Right Side - Contact */}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <FiPhone className="w-3 h-3" />
                                    <span>(0511) 3252741</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <FiMail className="w-3 h-3" />
                                    <span>admin@banjarmasinkota.go.id</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="border-t border-gray-200 py-3 text-center">
                        <p className="text-xs text-gray-500">
                            &copy; {new Date().getFullYear()} Pemerintah Kota
                            Banjarmasin. All Rights Reserved.
                            <span className="mx-2">|</span>
                            <span className="text-gray-400">
                                Dikelola oleh Dinas Koperasi dan UMKM
                            </span>
                        </p>
                    </div>
                </div>
            </footer>
        );
    }

    // Full footer untuk public dan user biasa (UMKM, Penyelenggara)
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                        {/* Tentang Kami - Takes more space */}
                        <div className="lg:col-span-4">
                            <h3 className="text-base font-bold text-gray-900 mb-6">
                                Event Bazar UMKM Banjarmasin
                            </h3>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Platform resmi untuk menyelenggarakan dan
                                    mengikuti event serta bazar UMKM di Kota
                                    Banjarmasin. Bergabunglah dengan komunitas
                                    UMKM untuk mengembangkan usaha Anda.
                                </p>
                                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                                    <img
                                        src="/images/Banjarmasin-A-Thousand-River-City-Logo.png"
                                        alt="Logo Banjarmasin"
                                        className="h-10 w-auto flex-shrink-0"
                                    />
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            Pemerintah Kota Banjarmasin
                                        </div>
                                        <div className="text-xs text-blue-600 font-medium">
                                            A Thousand River City
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Link Berguna */}
                        <div className="lg:col-span-3">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
                                Link Berguna
                            </h3>
                            <div className="space-y-3">
                                <a
                                    href="https://banjarmasinkota.go.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1"
                                >
                                    → Portal Pemko Banjarmasin
                                </a>
                                <a
                                    href="https://disperindag.banjarmasinkota.go.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1"
                                >
                                    → Dinas Perindustrian & Perdagangan
                                </a>
                                <a
                                    href="https://diskop-umkm.banjarmasinkota.go.id"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1"
                                >
                                    → Diskop & UMKM
                                </a>
                                <a
                                    href="#"
                                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1"
                                >
                                    → Panduan UMKM
                                </a>
                                <a
                                    href="#"
                                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 hover:translate-x-1"
                                >
                                    → Syarat & Ketentuan
                                </a>
                            </div>
                        </div>

                        {/* Kontak */}
                        <div className="lg:col-span-3">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
                                Kontak Kami
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FiMapPin className="text-blue-600 w-3 h-3" />
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <div className="font-medium text-gray-900 mb-1">
                                            Alamat
                                        </div>
                                        <div>Balai Kota Banjarmasin</div>
                                        <div>Jl. Sultan Adam No.18</div>
                                        <div>
                                            Banjarmasin, Kalimantan Selatan
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                        <FiPhone className="text-green-600 w-3 h-3" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900">
                                            Telepon
                                        </div>
                                        <div className="text-gray-600">
                                            (0511) 3252741
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                        <FiMail className="text-purple-600 w-3 h-3" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900">
                                            Email
                                        </div>
                                        <div className="text-gray-600">
                                            info@banjarmasinkota.go.id
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Media Sosial */}
                        <div className="lg:col-span-2">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
                                Ikuti Kami
                            </h3>
                            <div className="space-y-3">
                                <a
                                    href="https://instagram.com/pemko_banjarmasin"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors duration-200 group"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                        <FiInstagram className="text-white w-4 h-4" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900 group-hover:text-pink-600">
                                            Instagram
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                            @pemko_banjarmasin
                                        </div>
                                    </div>
                                </a>
                                <a
                                    href="https://facebook.com/PemerintahKotaBanjarmasin"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors duration-200 group"
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <FiFacebook className="text-white w-4 h-4" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900 group-hover:text-blue-600">
                                            Facebook
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                            Pemko Banjarmasin
                                        </div>
                                    </div>
                                </a>
                                <a
                                    href="https://youtube.com/@banjarmasinpostnewsvideo"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors duration-200 group"
                                >
                                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                        <FiYoutube className="text-white w-4 h-4" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900 group-hover:text-red-600">
                                            YouTube
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                            Pemko Banjarmasin
                                        </div>
                                    </div>
                                </a>
                                <a
                                    href="https://twitter.com/pemkobanjarmasin"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors duration-200 group"
                                >
                                    <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                                        <FiTwitter className="text-white w-4 h-4" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900 group-hover:text-sky-600">
                                            Twitter
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                            @pemkobanjarmasin
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-300 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                            <div className="text-center lg:text-left">
                                <p className="text-sm text-gray-600 font-medium">
                                    &copy; {new Date().getFullYear()} Pemerintah
                                    Kota Banjarmasin. All Rights Reserved.
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Dikelola oleh Dinas Koperasi dan UMKM Kota
                                    Banjarmasin
                                </p>
                            </div>
                            <div className="flex items-center space-x-6">
                                <a
                                    href="#"
                                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200"
                                >
                                    Kebijakan Privasi
                                </a>
                                <span className="text-gray-300">|</span>
                                <a
                                    href="#"
                                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200"
                                >
                                    FAQ
                                </a>
                                <span className="text-gray-300">|</span>
                                <a
                                    href="#"
                                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200"
                                >
                                    Bantuan
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
