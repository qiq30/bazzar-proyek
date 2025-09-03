// File: resources/js/Layouts/AuthenticatedLayout.jsx

import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import NotificationDropdown from "@/Components/NotificationDropdown";
import { Link, usePage, router } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

// --- Komponen Banner Impersonasi ---
const ImpersonateBanner = () => {
    const { impersonating } = usePage().props;
    if (!impersonating) return null;
    return (
        <div className="w-full bg-yellow-400 text-center py-2 text-sm font-semibold text-yellow-900">
            Anda sedang masuk sebagai pengguna lain.{" "}
            <Link
                href={route("impersonate.stop")}
                className="underline hover:text-yellow-700"
            >
                Kembali ke akun Super Admin.
            </Link>
        </div>
    );
};

// --- Komponen Alert Permintaan Impersonasi ---
const ImpersonationRequestAlert = ({ user }) => {
    const { pendingImpersonationRequest } = usePage().props;
    if (!pendingImpersonationRequest || user.is_super_admin || user.is_admin) {
        return null;
    }
    return (
        <div className="w-full bg-orange-100 border-b-2 border-orange-500">
            <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 text-center text-sm font-semibold text-orange-800">
                ⚠️ Super Admin meminta izin untuk mengakses akun Anda.{" "}
                <Link
                    href={route("impersonate.requests.index")}
                    className="underline hover:text-orange-600 font-bold"
                >
                    Lihat Permintaan & Respons
                </Link>
            </div>
        </div>
    );
};

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);

        if (user) {
            const privateChannel = window.Echo.private(`user.${user.id}`);

            privateChannel.listen("NotificationReceived", (e) => {
                toast.success(
                    (t) => (
                        <div className="flex flex-col items-start">
                            <b className="mb-1">{e.notification.data.title}</b>
                            <p className="text-sm">
                                {e.notification.data.message}
                            </p>
                            <Link
                                href={e.notification.data.url || "#"}
                                className="mt-3 w-full text-center bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-600"
                                onClick={() => toast.dismiss(t.id)}
                            >
                                Lihat Detail
                            </Link>
                        </div>
                    ),
                    { duration: 10000 }
                );

                router.reload({
                    only: ["auth", "pendingImpersonationRequest"],
                    preserveState: true,
                    preserveScroll: true,
                });

                const notificationType = e.notification.type;
                const currentRoute = route().current();

                if (notificationType.includes("ProfileStatusUpdated")) {
                    if (currentRoute === "dashboard") {
                        router.reload({
                            only: ["hasProfile", "umkmProfile"],
                            preserveState: true,
                            preserveScroll: true,
                        });
                    } else if (currentRoute === "penyelenggara.dashboard") {
                        router.reload({
                            only: ["hasProfile", "profile"],
                            preserveState: true,
                            preserveScroll: true,
                        });
                    }
                }
            });

            if (!user.is_admin && !user.is_penyelenggara) {
                privateChannel.listen("UmkmQrisUpdated", () => {
                    toast.success("Status QRIS berhasil diperbarui!");
                    if (route().current("dashboard")) {
                        router.reload({
                            only: ["umkmProfile", "hasProfile"],
                            preserveState: true,
                            preserveScroll: true,
                        });
                    }
                });
            }

            return () => {
                privateChannel.stopListening("NotificationReceived");
                if (!user.is_admin && !user.is_penyelenggara) {
                    privateChannel.stopListening("UmkmQrisUpdated");
                }
            };
        }
    }, [user, flash]);

    const getDashboardRoute = () => {
        if (user.is_super_admin) return route("superadmin.dashboard");
        if (user.is_admin) return route("admin.dashboard");
        if (user.is_penyelenggara) return route("penyelenggara.dashboard");
        return route("dashboard");
    };

    const isDashboardActive = () => {
        if (user.is_super_admin) return route().current("superadmin.dashboard");
        if (user.is_admin) return route().current("admin.dashboard");
        if (user.is_penyelenggara)
            return route().current("penyelenggara.dashboard");
        return route().current("dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <ImpersonateBanner />
            <ImpersonationRequestAlert user={user} />
            <Toaster position="top-right" reverseOrder={false} />

            {/* Navigasi tetap di atas (sticky) */}
            <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    {/* Menggunakan tag img untuk logo */}
                                    <img
                                        src="/images/Banjarmasin-A-Thousand-River-City-Logo.png"
                                        alt="Logo Banjarmasin"
                                        className="block h-9 w-auto"
                                    />
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={getDashboardRoute()}
                                    active={isDashboardActive()}
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <NotificationDropdown />
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={getDashboardRoute()}
                            active={isDashboardActive()}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>
                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header tidak sticky, akan discroll bersama konten */}
            {header && (
                <header className="bg-white shadow">
                    {" "}
                    {/* Menghapus kelas 'sticky' dan 'z-40' dari sini */}
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
