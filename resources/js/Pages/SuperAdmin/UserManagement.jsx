// resources/js/Pages/SuperAdmin/UserManagement.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function UserManagement({ auth, users }) {
    const handleRequestImpersonate = (userId, userName) => {
        if (
            confirm(
                `Kirim permintaan untuk masuk sebagai ${userName}? Pengguna akan menerima notifikasi.`
            )
        ) {
            router.post(
                route("superadmin.impersonate.request", userId),
                {},
                {
                    preserveScroll: true,
                }
            );
        }
    };

    const getRoleBadge = (role) => {
        const roles = {
            Admin: "bg-red-100 text-red-800",
            Penyelenggara: "bg-blue-100 text-blue-800",
            UMKM: "bg-green-100 text-green-800",
        };
        return (
            <span
                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    roles[role] || "bg-gray-100 text-gray-800"
                }`}
            >
                {role}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Pengguna
                </h2>
            }
        >
            <Head title="Manajemen Pengguna" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-bold mb-4">
                                Daftar Semua Pengguna
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left">
                                                Nama
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Email
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Peran
                                            </th>
                                            <th className="py-3 px-6 text-left">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="py-4 px-6 font-medium">
                                                    {user.name}
                                                </td>
                                                <td className="py-4 px-6 text-gray-500">
                                                    {user.email}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {getRoleBadge(user.role)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleRequestImpersonate(
                                                                    user.id,
                                                                    user.name
                                                                )
                                                            }
                                                            className="px-3 py-1 w-full sm:w-auto text-center bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-150"
                                                        >
                                                            Masuk sebagai
                                                        </button>

                                                        {(user.role ===
                                                            "UMKM" ||
                                                            user.role ===
                                                                "Penyelenggara") && (
                                                            <Link
                                                                href={route(
                                                                    "superadmin.users.edit",
                                                                    user.id
                                                                )}
                                                                className="px-3 py-1 w-full sm:w-auto text-center bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition duration-150"
                                                            >
                                                                Edit Profil
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
