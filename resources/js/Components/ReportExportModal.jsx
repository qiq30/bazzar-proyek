import React from "react";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { FiFileText, FiGrid } from "react-icons/fi";

export default function ReportExportModal({ isOpen, onClose, exportUrl }) {
    const handleDownload = (format) => {
        window.open(`${exportUrl}?format=${format}`, "_blank");
        onClose();
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Download Laporan
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Pilih format laporan yang ingin Anda unduh.
                </p>

                <div className="mt-6 flex justify-end space-x-3">
                    <SecondaryButton onClick={onClose}>Batal</SecondaryButton>

                    <PrimaryButton
                        onClick={() => handleDownload("pdf")}
                        className="bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-900 px-4 py-2"
                    >
                        <FiFileText className="mr-2" />
                        Download PDF
                    </PrimaryButton>

                    <PrimaryButton
                        onClick={() => handleDownload("excel")}
                        className="bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-900 px-4 py-2"
                    >
                        <FiGrid className="mr-2" />
                        Download Excel
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
