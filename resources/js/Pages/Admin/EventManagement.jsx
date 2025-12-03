// resources/js/Pages/Admin/EventManagement.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

const Modal = ({ children, show, onClose }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <div className="max-h-[80vh] overflow-y-auto pr-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

const EventEditForm = ({ event, onSuccess, onCancel }) => {
    const { data, setData, put, processing, errors } = useForm({
        nama_event: event?.nama_event || "",
        tanggal_mulai_acara: event?.tanggal_mulai_acara
            ? event.tanggal_mulai_acara.split("T")[0]
            : "",
        tanggal_selesai_acara: event?.tanggal_selesai_acara
            ? event.tanggal_selesai_acara.split("T")[0]
            : "",
        lokasi_event: event?.lokasi_event || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Menggunakan objek parameter untuk mencocokkan nama rute {event}
        put(route("admin.events.update", { event: event.hashid }), {
            onSuccess: onSuccess,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Edit Event</h3>
            <div>
                <label className="block text-sm font-medium">Nama Event</label>
                <input
                    type="text"
                    value={data.nama_event}
                    onChange={(e) => setData("nama_event", e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                />
                {errors.nama_event && (
                    <div className="text-red-500 text-sm">
                        {errors.nama_event}
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">
                        Tanggal Mulai
                    </label>
                    <input
                        type="date"
                        value={data.tanggal_mulai_acara}
                        onChange={(e) =>
                            setData("tanggal_mulai_acara", e.target.value)
                        }
                        className="w-full p-2 border rounded mt-1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Tanggal Selesai
                    </label>
                    <input
                        type="date"
                        value={data.tanggal_selesai_acara}
                        onChange={(e) =>
                            setData("tanggal_selesai_acara", e.target.value)
                        }
                        className="w-full p-2 border rounded mt-1"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium">Lokasi</label>
                <input
                    type="text"
                    value={data.lokasi_event}
                    onChange={(e) => setData("lokasi_event", e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    {processing ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </div>
        </form>
    );
};

// Komponen Utama
export default function EventManagement({ auth, events }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const { delete: destroyEvent, processing } = useForm();

    const openEditModal = (event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleDelete = (event) => {
        if (
            confirm(
                "Apakah Anda yakin ingin menghapus event ini secara permanen?"
            )
        ) {
            // PERBAIKAN: Menggunakan objek parameter { event: event.hashid }
            destroyEvent(
                route("admin.events.destroy", { event: event.hashid })
            );
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Event
                </h2>
            }
        >
            <Head title="Manajemen Event" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <Link
                            href={route("admin.events.publish.form")}
                            className="mb-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            + Terbitkan Event dari Proposal
                        </Link>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-2 px-4 text-left">
                                            Nama Event
                                        </th>
                                        <th className="py-2 px-4 text-left">
                                            Jadwal Pendaftaran
                                        </th>
                                        <th className="py-2 px-4 text-left">
                                            Jadwal Acara
                                        </th>
                                        <th className="py-2 px-4 text-left">
                                            Status
                                        </th>
                                        <th className="py-2 px-4 text-left">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event.id} className="border-b">
                                            <td className="py-2 px-4 font-medium">
                                                {event.nama_event}
                                            </td>
                                            <td className="py-2 px-4 text-sm">
                                                {new Date(
                                                    event.pendaftaran_dibuka
                                                ).toLocaleDateString(
                                                    "id-ID"
                                                )}{" "}
                                                -{" "}
                                                {new Date(
                                                    event.pendaftaran_ditutup
                                                ).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="py-2 px-4 text-sm">
                                                {new Date(
                                                    event.tanggal_mulai_acara
                                                ).toLocaleDateString(
                                                    "id-ID"
                                                )}{" "}
                                                -{" "}
                                                {new Date(
                                                    event.tanggal_selesai_acara
                                                ).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="py-2 px-4">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        event.status ===
                                                        "active"
                                                            ? "bg-green-100 text-green-800"
                                                            : event.status ===
                                                              "upcoming"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 whitespace-nowrap">
                                                <Link
                                                    // PERBAIKAN 1: Menggunakan objek parameter { event: event.hashid }
                                                    href={route(
                                                        "admin.events.participants",
                                                        { event: event.hashid }
                                                    )}
                                                    className="px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-800 mr-3"
                                                >
                                                    Peserta
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        openEditModal(event)
                                                    }
                                                    className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-800 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    // PERBAIKAN 2: Mengirim seluruh objek 'event' ke fungsi
                                                    onClick={() =>
                                                        handleDelete(event)
                                                    }
                                                    className="px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-800 mr-3"
                                                    disabled={processing}
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <EventEditForm
                    event={editingEvent}
                    onSuccess={closeModal}
                    onCancel={closeModal}
                />
            </Modal>
        </AuthenticatedLayout>
    );
}
