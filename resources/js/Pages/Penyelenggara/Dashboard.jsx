// File: resources/js/Pages/Penyelenggara/Dashboard.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
// --- Impor Ikon dari React-Icons ---
import {
    FiUser,
    FiFileText,
    FiAward,
    FiPlusCircle,
    FiCheckSquare,
    FiHome,
} from "react-icons/fi";

// --- Komponen Kartu Statistik dengan Garis Warna di Kiri ---
const StatCard = ({
    title,
    content,
    icon,
    color,
    link,
    linkText,
    description,
}) => (
    <div
        className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color.border} flex flex-col justify-between`}
    >
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                        {content}
                    </div>
                </div>
                <div className={`p-3 rounded-full ${color.bg} ${color.text}`}>
                    {icon}
                </div>
            </div>
        </div>
        <div className="mt-4 text-sm">
            {link && linkText ? (
                <Link
                    href={link}
                    className="font-medium text-blue-600 hover:text-blue-800"
                >
                    {linkText} →
                </Link>
            ) : description ? (
                <p className="text-gray-500">{description}</p>
            ) : null}
        </div>
    </div>
);

// --- Komponen Kartu Aksi/Menu (HubCard) ---
const HubCard = ({
    href,
    icon,
    title,
    description,
    color,
    disabled = false,
}) => {
    const content = (
        <>
            <div
                className={`mb-2 transition-transform ${
                    disabled ? "" : "group-hover:scale-110"
                } ${disabled ? "text-gray-400" : color}`}
            >
                {icon}
            </div>
            <div>
                <p
                    className={`font-medium text-center ${
                        disabled ? "text-gray-500" : "text-gray-900"
                    }`}
                >
                    {title}
                </p>
                <p className="text-sm text-center text-gray-500">
                    {description}
                </p>
            </div>
        </>
    );

    if (disabled) {
        return (
            <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                {content}
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg transition group ${color
                .replace("text-", "hover:border-")
                .replace(/-\d+$/, "-400")} hover:bg-gray-50`}
        >
            {content}
        </Link>
    );
};

// Komponen Badge Status
const StatusBadge = ({ proposalStatus, eventStatus }) => {
    let config = { text: "Unknown", className: "bg-gray-100 text-gray-800" };
    if (proposalStatus === "menunggu_persetujuan")
        config = {
            text: "Menunggu Persetujuan",
            className: "bg-yellow-100 text-yellow-800",
        };
    else if (proposalStatus === "ditolak")
        config = { text: "Ditolak", className: "bg-red-100 text-red-800" };
    else if (proposalStatus === "disetujui") {
        config = eventStatus
            ? {
                  text: "Sudah Diterbitkan",
                  className: "bg-green-100 text-green-800",
              }
            : {
                  text: "Disetujui (Menunggu Terbit)",
                  className: "bg-blue-100 text-blue-800",
              };
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
    const { impersonating } = usePage().props;

    const getProfileStatus = () => {
        if (!hasProfile)
            return {
                color: "bg-red-100 text-red-800",
                text: "Profil Belum Dibuat",
                actionText: "Lengkapi Profil Sekarang",
                actionLink: route("penyelenggara.profile.setup"),
                isVerified: false,
            };
        switch (profile.status) {
            case "pending":
                return {
                    color: "bg-yellow-100 text-yellow-800",
                    text: "Menunggu Verifikasi",
                    actionText: "Profil Anda sedang ditinjau.",
                    actionLink: null,
                    isVerified: false,
                };
            case "verified":
                return {
                    color: "bg-green-100 text-green-800",
                    text: "Terverifikasi",
                    actionText: "Anda dapat mengajukan proposal.",
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
                    actionText: "Hubungi admin.",
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
                        <StatCard
                            title="Status Profil"
                            icon={<FiUser className="h-6 w-6" />}
                            color={{
                                border: "border-blue-500",
                                bg: "bg-blue-100",
                                text: "text-blue-500",
                            }}
                            content={
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${profileStatus.color}`}
                                >
                                    {profileStatus.text}
                                </span>
                            }
                            link={profileStatus.actionLink}
                            linkText={
                                profileStatus.actionLink
                                    ? profileStatus.actionText
                                    : null
                            }
                            description={
                                !profileStatus.actionLink
                                    ? profileStatus.actionText
                                    : null
                            }
                        />
                        <StatCard
                            title="Proposal Diajukan"
                            icon={<FiFileText className="h-6 w-6" />}
                            color={{
                                border: "border-green-500",
                                bg: "bg-green-100",
                                text: "text-green-500",
                            }}
                            content={events.length}
                            description="Total proposal yang telah Anda buat."
                        />
                        <StatCard
                            title="Event Diterbitkan"
                            icon={<FiAward className="h-6 w-6" />}
                            color={{
                                border: "border-purple-500",
                                bg: "bg-purple-100",
                                text: "text-purple-500",
                            }}
                            content={
                                events.filter((e) => e.status !== null).length
                            }
                            description="Total event yang telah disetujui & terbit."
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Aksi Cepat
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <HubCard
                                href={route("penyelenggara.proposal.create")}
                                icon={<FiPlusCircle className="w-8 h-8" />}
                                title="Ajukan Proposal"
                                description="Buat pengajuan event baru"
                                color="text-blue-600"
                                disabled={!profileStatus.isVerified}
                            />
                            <HubCard
                                href={route(
                                    "penyelenggara.pendaftar.verifikasi.list"
                                )}
                                icon={<FiCheckSquare className="w-8 h-8" />}
                                title="Verifikasi Pendaftar"
                                description="Konfirmasi pembayaran"
                                color="text-green-600"
                                disabled={!profileStatus.isVerified}
                            />
                            <HubCard
                                href="/"
                                icon={<FiHome className="w-8 h-8" />}
                                title="Lihat Public"
                                description="Halaman depan"
                                color="text-orange-600"
                            />
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
                                        <FiFileText className="w-16 h-16 mx-auto" />
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
