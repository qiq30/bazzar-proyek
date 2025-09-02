import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react"; // Import usePage

// --- Komponen Ikon SVG untuk Dashboard Penyelenggara ---
const ProfileIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
    </svg>
);
const ProposalIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
    </svg>
);
const PublishedIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);
const AddIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);
const VerifyIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
        />
    </svg>
);
const HomeIcon = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
    </svg>
);

const StatusBadge = ({ proposalStatus, eventStatus }) => {
    let config = { text: "Unknown", className: "bg-gray-100 text-gray-800" };

    if (proposalStatus === "menunggu_persetujuan") {
        config = {
            text: "Menunggu Persetujuan",
            className: "bg-yellow-100 text-yellow-800",
        };
    } else if (proposalStatus === "ditolak") {
        config = { text: "Ditolak", className: "bg-red-100 text-red-800" };
    } else if (proposalStatus === "disetujui") {
        if (eventStatus) {
            config = {
                text: "Sudah Diterbitkan",
                className: "bg-green-100 text-green-800",
            };
        } else {
            config = {
                text: "Disetujui (Menunggu Terbit)",
                className: "bg-blue-100 text-blue-800",
            };
        }
    }

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
        >
            {config.text}
        </span>
    );
};

export default function Dashboard({ auth, hasProfile, profile, events = [] }) {
    const { impersonating } = usePage().props; // Ambil 'impersonating' dari props

    const getProfileStatus = () => {
        if (!hasProfile) {
            return {
                color: "bg-red-100 text-red-800",
                text: "Profil Belum Dibuat",
                actionText: "Lengkapi Profil Sekarang",
                actionLink: route("penyelenggara.profile.setup"),
                isVerified: false,
            };
        }
        switch (profile.status) {
            case "pending":
                return {
                    color: "bg-yellow-100 text-yellow-800",
                    text: "Menunggu Verifikasi",
                    actionText: "Profil Anda sedang ditinjau oleh admin.",
                    actionLink: null,
                    isVerified: false,
                };
            case "verified":
                return {
                    color: "bg-green-100 text-green-800",
                    text: "Terverifikasi",
                    actionText:
                        "Anda sekarang dapat mengajukan proposal event.",
                    actionLink: null,
                    isVerified: true,
                };
            case "rejected":
                return {
                    color: "bg-red-100 text-red-800",
                    text: "Ditolak",
                    actionText: "Profil Anda ditolak. Silakan perbaiki.",
                    actionLink: route("penyelenggara.profile.setup"),
                    isVerified: false,
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-800",
                    text: "Status Tidak Diketahui",
                    actionText: "Hubungi admin untuk informasi lebih lanjut.",
                    actionLink: null,
                    isVerified: false,
                };
        }
    };

    const profileStatus = getProfileStatus();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard Penyelenggara
                </h2>
            }
        >
            <Head title="Dashboard Penyelenggara" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold mb-2">
                                Selamat Datang,{" "}
                                {profile?.organizer_name || auth.user.name}!
                            </h3>
                            <p className="text-gray-600">
                                Kelola profil dan ajukan proposal event Anda di
                                sini.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Status Profil
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${profileStatus.color}`}
                                        >
                                            {profileStatus.text}
                                        </span>
                                    </p>
                                </div>
                                <div className="text-blue-500 bg-blue-100 p-3 rounded-full">
                                    <ProfileIcon className="h-6 w-6" />
                                </div>
                            </div>
                            {profileStatus.actionLink ? (
                                <Link
                                    href={profileStatus.actionLink}
                                    className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium text-sm"
                                >
                                    {profileStatus.actionText} →
                                </Link>
                            ) : impersonating &&
                              profile?.status === "verified" ? (
                                <Link
                                    href={route(
                                        "superadmin.users.edit",
                                        profile.user_id
                                    )}
                                    className="mt-4 inline-block text-green-600 hover:text-green-800 font-medium text-sm"
                                >
                                    Edit Profil ini (Super Admin) →
                                </Link>
                            ) : (
                                <p className="mt-4 text-sm text-gray-500">
                                    {profile?.status === "verified"
                                        ? "Profil terkunci. Hubungi admin untuk perubahan."
                                        : profileStatus.actionText}
                                </p>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Proposal Diajukan
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {events.length}
                                    </p>
                                </div>
                                <div className="text-green-500 bg-green-100 p-3 rounded-full">
                                    <ProposalIcon className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-gray-400">
                                Total proposal yang telah Anda buat.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Event Diterbitkan
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {
                                            events.filter(
                                                (e) => e.status !== null
                                            ).length
                                        }
                                    </p>
                                </div>
                                <div className="text-purple-500 bg-purple-100 p-3 rounded-full">
                                    <PublishedIcon className="h-6 w-6" />
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-gray-400">
                                Total event yang telah disetujui dan
                                diterbitkan.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Aksi Cepat
                        </h4>
                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {profileStatus.isVerified ? (
                                <Link
                                    href={route(
                                        "penyelenggara.proposal.create"
                                    )}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition group"
                                >
                                    <div className="text-blue-600 mr-3">
                                        <AddIcon className="w-8 h-8 transition-transform group-hover:scale-110" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Ajukan Proposal
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Buat pengajuan event baru
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                                    <div className="text-gray-400 mr-3">
                                        <AddIcon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            Ajukan Proposal
                                        </p>
                                        <p className="text-sm">
                                            Verifikasi profil dulu
                                        </p>
                                    </div>
                                </div>
                            )}

                            {profileStatus.isVerified ? (
                                <Link
                                    href={route(
                                        "penyelenggara.pendaftar.verifikasi.list"
                                    )}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition group"
                                >
                                    <div className="text-green-600 mr-3">
                                        <VerifyIcon className="w-8 h-8 transition-transform group-hover:scale-110" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            Verifikasi Pendaftar
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Konfirmasi pembayaran
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                                    <div className="text-gray-400 mr-3">
                                        <VerifyIcon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="font-medium">
                                            Verifikasi Pendaftar
                                        </p>
                                        <p className="text-sm">
                                            Verifikasi profil dulu
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Link
                                href="/"
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition group"
                            >
                                <div className="text-orange-600 mr-3">
                                    <HomeIcon className="w-8 h-8 transition-transform group-hover:scale-110" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Lihat Public
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Halaman depan
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6 border-b">
                            <h4 className="text-lg font-semibold text-gray-900">
                                Riwayat Pengajuan Proposal Event
                            </h4>
                        </div>
                        <div className="overflow-x-auto">
                            {events.length > 0 ? (
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                                                Nama Event
                                            </th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                                                Tanggal Diajukan
                                            </th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                                                PIN Panitia
                                            </th>
                                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {events.map((event) => (
                                            <tr key={event.id}>
                                                <td className="py-4 px-6 whitespace-nowrap font-medium text-gray-900">
                                                    {event.nama_event}
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap text-gray-500">
                                                    {new Date(
                                                        event.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <StatusBadge
                                                        proposalStatus={
                                                            event.status_proposal
                                                        }
                                                        eventStatus={
                                                            event.status
                                                        }
                                                    />
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap font-mono text-lg text-gray-700">
                                                    {event.panitia_pin || "-"}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Link
                                                        href={route(
                                                            "penyelenggara.proposals.show",
                                                            event.id
                                                        )}
                                                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700"
                                                    >
                                                        Lihat Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center p-12">
                                    <div className="text-gray-400 mb-4">
                                        <ProposalIcon className="w-16 h-16 mx-auto" />
                                    </div>
                                    <p className="text-gray-500">
                                        Anda belum pernah mengajukan proposal
                                        event.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
