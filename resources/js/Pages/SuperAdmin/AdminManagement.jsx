import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function AdminManagement({ auth, admins }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const { delete: destroy } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post(route("superadmin.admins.store"), {
            onSuccess: () => reset(),
        });
    };

    const deleteAdmin = (admin) => {
        // Terima objek admin
        if (confirm("Apakah Anda yakin ingin menghapus admin ini?")) {
            destroy(route("superadmin.admins.destroy", admin.hashid));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Admin
                </h2>
            }
        >
            <Head title="Manajemen Admin" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-bold mb-4">
                                Tambah Admin Baru
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                {/* Form fields */}
                                <div>
                                    <InputLabel htmlFor="name" value="Nama" />
                                    <TextInput
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Konfirmasi Password"
                                    />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>
                                <PrimaryButton disabled={processing}>
                                    {processing
                                        ? "Menyimpan..."
                                        : "Simpan Admin"}
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-bold mb-4">
                                    Daftar Admin Aktif
                                </h3>
                                <div className="space-y-3">
                                    {admins.map((admin) => (
                                        <div
                                            key={admin.id}
                                            className="flex justify-between items-center p-3 border rounded-md"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {admin.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {admin.email}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    deleteAdmin(admin)
                                                }
                                                className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
