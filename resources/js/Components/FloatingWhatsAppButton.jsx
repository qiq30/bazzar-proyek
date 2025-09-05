// File: resources/js/Components/FloatingWhatsAppButton.jsx

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const FloatingWhatsAppButton = ({ adminPhoneNumber, user }) => {
    if (!adminPhoneNumber || !user) {
        return null; // Jangan tampilkan tombol jika data tidak lengkap
    }

    const role = user.is_penyelenggara ? "Penyelenggara" : "UMKM";

    const message = encodeURIComponent(
        `Halo Admin,\n\nSaya ingin bertanya atau melaporkan sesuatu.\n\nNama: ${user.name}\nPeran: ${role}\n\nMohon bantuannya.`
    );

    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${message}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-fab"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            aria-label="Hubungi Admin via WhatsApp"
        >
            <FaWhatsapp className="whatsapp-fab-icon" />
            <span className="whatsapp-fab-text">Lapor Admin</span>
        </motion.a>
    );
};

export default FloatingWhatsAppButton;
