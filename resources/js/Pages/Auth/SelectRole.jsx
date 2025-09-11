import { Head, Link } from "@inertiajs/react";
import { FiBriefcase, FiHome } from "react-icons/fi";
import { motion } from "framer-motion";

export default function SelectRole() {
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <Head title="Pilih Peran Anda" />
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-bold text-gray-800">
                        Satu Langkah Lagi!
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Pilih jenis akun yang ingin Anda buat.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {/* Card UMKM */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden text-center"
                    >
                        <Link
                            href={route("auth.google.save-role")}
                            method="post"
                            data={{ role: "umkm" }}
                            as="button"
                            className="block p-8 md:p-12 w-full h-full transition-colors"
                        >
                            <FiHome className="mx-auto text-5xl text-blue-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800">
                                Saya Pelaku UMKM
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Saya ingin mendaftarkan usaha saya, menjual
                                produk, dan berpartisipasi dalam event bazar.
                            </p>
                        </Link>
                    </motion.div>

                    {/* Card Penyelenggara */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden text-center"
                    >
                        <Link
                            href={route("auth.google.save-role")}
                            method="post"
                            data={{ role: "penyelenggara" }}
                            as="button"
                            className="block p-8 md:p-12 w-full h-full transition-colors"
                        >
                            <FiBriefcase className="mx-auto text-5xl text-yellow-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800">
                                Saya Penyelenggara Event
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Saya ingin membuat dan mengelola event bazar,
                                serta melakukan verifikasi pendaftar UMKM.
                            </p>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
