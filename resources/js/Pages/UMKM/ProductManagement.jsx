// resources/js/Pages/UMKM/ProductManagement.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";

// Simple Modal Component
const Modal = ({ children, show, onClose }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                {children}
            </div>
        </div>
    );
};

// Product Form Component
const ProductForm = ({ product, onSuccess, onCancel }) => {
    const { data, setData, post, processing, errors } = useForm({
        _method: product ? "POST" : "POST",
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || "",
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = product
            ? route("umkm.products.update", product.hashid)
            : route("umkm.products.store");
        post(url, { onSuccess });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold mb-4">
                {product ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Nama Produk *
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                    required
                />
                {errors.name && (
                    <div className="text-red-500 text-sm">{errors.name}</div>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Deskripsi
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    rows="3"
                    className="w-full mt-1 p-2 border rounded"
                ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Harga (Rp)
                </label>
                <input
                    type="number"
                    value={data.price}
                    onChange={(e) => setData("price", e.target.value)}
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Contoh: 15000"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Gambar Produk
                </label>
                <input
                    type="file"
                    onChange={(e) => setData("image", e.target.files[0])}
                    className="w-full mt-1 text-sm"
                />
                {product?.image_url && (
                    <img
                        src={product.image_url}
                        alt="Preview"
                        className="mt-2 h-20 w-auto rounded"
                    />
                )}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing ? "Menyimpan..." : "Simpan Produk"}
                </button>
            </div>
        </form>
    );
};

export default function ProductManagement({ auth, products = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { delete: destroyProduct } = useForm();

    const openCreateModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = (product) => {
        // Terima objek produk
        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            destroyProduct(route("umkm.products.destroy", product.hashid));
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Produk
                </h2>
            }
        >
            <Head title="Manajemen Produk" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">
                                Daftar Produk Anda
                            </h3>
                            <button
                                onClick={openCreateModal}
                                className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                            >
                                + Tambah Produk
                            </button>
                        </div>

                        <div className="space-y-4">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={
                                                    product.image_url ||
                                                    "https://via.placeholder.com/80"
                                                }
                                                alt={product.name}
                                                className="w-20 h-20 object-cover rounded-md bg-gray-100"
                                            />
                                            <div>
                                                <h4 className="font-bold text-gray-900">
                                                    {product.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {product.description?.substring(
                                                        0,
                                                        50
                                                    )}
                                                    ...
                                                </p>
                                                <p className="text-sm font-semibold text-green-600">
                                                    {formatRupiah(
                                                        product.price
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    openEditModal(product)
                                                }
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(product)
                                                }
                                                className="text-sm text-red-600 hover:text-red-800"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                    <p className="text-gray-500">
                                        Anda belum memiliki produk.
                                    </p>
                                    <p className="text-gray-500">
                                        Klik "Tambah Produk" untuk memulai.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={closeModal}>
                <ProductForm
                    product={editingProduct}
                    onSuccess={closeModal}
                    onCancel={closeModal}
                />
            </Modal>
        </AuthenticatedLayout>
    );
}
