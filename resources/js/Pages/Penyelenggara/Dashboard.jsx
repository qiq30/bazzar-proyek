// File: resources/js/Pages/Penyelenggara/Dashboard.jsx

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    FiUser,
    FiFileText,
    FiAward,
    FiPlusCircle,
    FiCheckSquare,
    FiHome,
    FiAlertTriangle,
} from "react-icons/fi";

// Hook untuk animasi angka
const useCountAnimation = (end, duration = 1000, start = 0) => {
    const [count, setCount] = useState(start);

    useEffect(() => {
        if (end === start) return;

        const startTime = Date.now();
        const endTime = startTime + duration;

        const updateCount = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Easing function (easeOutCubic)
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);

            const currentCount = Math.round(
                start + (end - start) * easeOutCubic
            );
            setCount(currentCount);

            if (now < endTime) {
                requestAnimationFrame(updateCount);
            }
        };

        requestAnimationFrame(updateCount);
    }, [end, duration, start]);

    return count;
};

// Komponen AnimatedNumber
const AnimatedNumber = ({ value, duration = 1500, className = "" }) => {
    const animatedValue = useCountAnimation(value, duration);
    return <span className={className}>{animatedValue}</span>;
};

// Komponen Notifikasi Status Profil (dari file kedua)
const ProfileStatusNotification = ({ status, rejectionReason }) => {
    if (status === "pending") {
        return (
            <div
                className="p-4 mb-6 text-sm text-yellow-800 rounded-lg bg-yellow-50"
                role="alert"
            >
                <span className="font-bold">Menunggu Verifikasi:</span> Profil
                Anda sedang dalam peninjauan oleh admin. Anda dapat mengajukan
                proposal setelah profil disetujui.
            </div>
        );
    }

    if (status === "rejected") {
        return (
            <div
                className="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50"
                role="alert"
            >
                <p className="font-bold mb-2 flex items-center gap-2">
                    <FiAlertTriangle /> Profil Anda Ditolak.
                </p>
                <p className="font-medium">Alasan Penolakan:</p>
                <p className="italic ml-4 mt-1">
                    {rejectionReason || "Tidak ada alasan spesifik."}
                </p>
                <p className="mt-3">
                    Silakan perbarui profil Anda melalui halaman{" "}
                    <Link
                        href={route("penyelenggara.profile.setup")}
                        className="font-bold underline hover:text-red-900"
                    >
                        pengaturan profil
                    </Link>
                    .
                </p>
            </div>
        );
    }

    return null;
};

const StatCard = ({
    title,
    content,
    icon,
    color,
    link,
    linkText,
    description,
    isAnimatedNumber = false,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color.border} flex flex-col justify-between`}
        >
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">
                            {title}
                        </p>
                        <div className="text-2xl font-bold text-gray-900 mt-1">
                            {isAnimatedNumber && typeof content === "number" ? (
                                isVisible ? (
                                    <AnimatedNumber
                                        value={content}
                                        duration={1500}
                                        className="tabular-nums"
                                    />
                                ) : (
                                    <span className="tabular-nums">0</span>
                                )
                            ) : (
                                content
                            )}
                        </div>
                    </div>
                    <div
                        className={`p-3 rounded-full ${color.bg} ${color.text}`}
                    >
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
};

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

const StatusBadge = ({ proposalStatus, eventStatus, docStatus }) => {
    let config = { text: "Unknown", className: "bg-gray-100 text-gray-800" };

    if (docStatus === "pending_document_verification") {
        config = {
            text: "Verifikasi Dokumen",
            className: "bg-yellow-100 text-yellow-800",
        };
    } else if (docStatus === "document_rejected") {
        config = {
            text: "Dokumen Ditolak",
            className: "bg-red-100 text-red-800",
        };
    } else if (
        docStatus === "document_approved" &&
        proposalStatus === "draft"
    ) {
        config = {
            text: "Lengkapi Detail Event",
            className: "bg-blue-100 text-blue-800",
        };
    } else if (proposalStatus === "menunggu_persetujuan") {
        config = {
            text: "Menunggu Persetujuan Akhir",
            className: "bg-yellow-100 text-yellow-800",
        };
    } else if (proposalStatus === "ditolak") {
        config = {
            text: "Ditolak (Perlu Perbaikan)",
            className: "bg-red-100 text-red-800",
        };
    } else if (proposalStatus === "disetujui") {
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
                    actionText:
                        "Profil terkunci. Hubungi admin untuk perubahan.",
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
                    {/* Welcome Card */}
                    <div className="bg-green-400 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold mb-2">
                                Selamat Datang, {auth.user.name}!
                            </h3>
                            <p className="text-gray-700">
                                Kelola proposal event Anda dan pantau status
                                pengajuan dari sini.
                            </p>
                        </div>
                    </div>

                    {/* Notifikasi Status Profil */}
                    {!hasProfile ? (
                        <div
                            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
                            role="alert"
                        >
                            <p className="font-bold">Profil Belum Lengkap!</p>
                            <p>
                                Anda harus melengkapi profil sebelum dapat
                                mengajukan proposal event.
                            </p>
                            <Link
                                href={route("penyelenggara.profile.setup")}
                                className="mt-3 inline-block bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600"
                            >
                                Lengkapi Profil Sekarang
                            </Link>
                        </div>
                    ) : (
                        <ProfileStatusNotification
                            status={profile?.status}
                            rejectionReason={profile?.rejection_reason}
                        />
                    )}

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
                            isAnimatedNumber={true}
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
                            isAnimatedNumber={true}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Aksi Cepat
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <HubCard
                                href={route("penyelenggara.proposal.wizard")}
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
                                            <tr
                                                key={event.id}
                                                className="hover:bg-gray-50"
                                            >
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
                                                        docStatus={
                                                            event.document_verification_status
                                                        }
                                                    />
                                                </td>
                                                <td className="py-4 px-6 whitespace-nowrap font-mono text-lg text-gray-700">
                                                    {event.panitia_pin || "-"}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {event.status_proposal ===
                                                    "ditolak" ? (
                                                        <Link
                                                            href={route(
                                                                "penyelenggara.proposal.wizard",
                                                                event.id
                                                            )}
                                                            className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700"
                                                        >
                                                            Perbaiki
                                                        </Link>
                                                    ) : event.document_verification_status ===
                                                          "document_approved" &&
                                                      event.status_proposal ===
                                                          "draft" ? (
                                                        <Link
                                                            href={route(
                                                                "penyelenggara.proposal.wizard",
                                                                event.id
                                                            )}
                                                            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700"
                                                        >
                                                            Lanjutkan
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            href={route(
                                                                "penyelenggara.proposals.show",
                                                                event.id
                                                            )}
                                                            className="px-4 py-2 bg-gray-600 text-white text-xs font-semibold rounded-md hover:bg-gray-700"
                                                        >
                                                            Lihat Detail
                                                        </Link>
                                                    )}
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
