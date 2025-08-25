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
                <button
                    onClick={onClose}
                    className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};

const EventEditForm = ({ event, onSuccess, onCancel }) => {
    const { data, setData, put, processing, errors } = useForm({
        nama_event: event?.nama_event || "",
        tanggal_mulai: event?.tanggal_mulai
            ? event.tanggal_mulai.split("T")[0]
            : "",
        tanggal_selesai: event?.tanggal_selesai
            ? event.tanggal_selesai.split("T")[0]
            : "",
        lokasi_event: event?.lokasi_event || "",
        status: event?.status || "upcoming",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.events.update", event.id), {
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
                        value={data.tanggal_mulai}
                        onChange={(e) =>
                            setData("tanggal_mulai", e.target.value)
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
                        value={data.tanggal_selesai}
                        onChange={(e) =>
                            setData("tanggal_selesai", e.target.value)
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
            <div>
                <label className="block text-sm font-medium">
                    Status Event
                </label>
                <select
                    value={data.status}
                    onChange={(e) => setData("status", e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                >
                    <option value="upcoming">Akan Datang</option>
                    <option value="active">Aktif</option>
                    <option value="finished">Selesai</option>
                </select>
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

    const handleDelete = (id) => {
        if (
            confirm(
                "Apakah Anda yakin ingin menghapus event ini secara permanen?"
            )
        ) {
            destroyEvent(route("admin.events.destroy", id));
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
                                            Tanggal
                                        </th>
                                        <th className="py-2 px-4 text-left">
                                            Lokasi
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
                                            <td className="py-2 px-4">
                                                {event.nama_event}
                                            </td>
                                            <td className="py-2 px-4">
                                                {new Date(
                                                    event.tanggal_mulai
                                                ).toLocaleDateString(
                                                    "id-ID"
                                                )}{" "}
                                                -{" "}
                                                {new Date(
                                                    event.tanggal_selesai
                                                ).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="py-2 px-4">
                                                {event.lokasi_event}
                                            </td>
                                            <td className="py-2 px-4">
                                                {event.status}
                                            </td>
                                            <td className="py-2 px-4 whitespace-nowrap">
                                                <Link
                                                    href={route(
                                                        "admin.events.participants",
                                                        event.id
                                                    )}
                                                    className="px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-md hover:bg-green-800 mr-3"
                                                >
                                                    Lihat Peserta
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
                                                    onClick={() =>
                                                        handleDelete(event.id)
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
