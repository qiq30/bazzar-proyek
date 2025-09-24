// File: resources/js/Layouts/AuthenticatedLayout.jsx

import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import NotificationDropdown from "@/Components/NotificationDropdown";
import FloatingWhatsAppButton from "@/Components/FloatingWhatsAppButton";
import ImpersonateBanner from "@/Components/ImpersonateBanner";
import { Link, usePage, router } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
    FiGrid,
    FiUser,
    FiLogOut,
    FiInfo,
    FiCheckCircle,
    FiXCircle,
    FiBell,
} from "react-icons/fi";

const CustomToast = ({ t, notification, icon, bgColor }) => (
    <div
        className={`${
            t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
        <div className={`w-2 rounded-l-xl ${bgColor || "bg-gray-500"}`}></div>
        <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5 text-2xl">{icon}</div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-bold text-gray-900">
                        {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                    </p>
                </div>
            </div>
        </div>
        <div className="flex border-l border-gray-200">
            <button
                onClick={() => {
                    toast.dismiss(t.id);
                    if (notification.url) {
                        router.visit(notification.url);
                    }
                }}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Lihat
            </button>
        </div>
    </div>
);

export default function AuthenticatedLayout({ user, header, children }) {
    const { flash, adminContact } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // useEffect hook untuk menampilkan notifikasi
    // Hook 1: Khusus untuk menampilkan notifikasi flash (sukses/error)
    useEffect(() => {
        if (flash) {
            if (flash.success) {
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        notification={{
                            title: "Berhasil!",
                            message: flash.success,
                        }}
                        icon={<FiCheckCircle className="text-green-500" />}
                        bgColor="bg-green-500"
                    />
                ));
            }
            if (flash.error) {
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        notification={{ title: "Gagal!", message: flash.error }}
                        icon={<FiXCircle className="text-red-500" />}
                        bgColor="bg-red-500"
                    />
                ));
            }
        }
    }, [flash]);

    // Hook 2: Khusus untuk listener notifikasi realtime dari Echo (Tampilan Ditingkatkan)
    useEffect(() => {
        if (!user || !user.id) {
            return;
        }

        const channel = Echo.private(`user.${user.id}`);

        const handleNotification = (eventData) => {
            const notificationPayload = eventData.notification.data;

            toast.custom(
                (t) => (
                    <CustomToast
                        t={t}
                        notification={{
                            title:
                                notificationPayload.title || "Notifikasi Baru",
                            message: notificationPayload.message,
                            url: notificationPayload.url,
                        }}
                        icon={<FiBell className="text-blue-500" />}
                        bgColor="bg-blue-500"
                    />
                ),
                {
                    duration: 10000,
                }
            );
            router.reload();
        };

        channel.listen("NotificationReceived", handleNotification);

        return () => {
            channel.stopListening("NotificationReceived", handleNotification);
            Echo.leave(`user.${user.id}`);
        };
    }, [user?.id]);

    // Ini akan mencegah semua error 'Cannot read properties of undefined'.
    if (!user) {
        return null;
    }

    const getDashboardRoute = () => {
        if (user.is_super_admin) return route("superadmin.dashboard");
        if (user.is_admin) return route("admin.dashboard");
        if (user.is_penyelenggara) return route("penyelenggara.dashboard");
        return route("umkm.dashboard");
    };

    const isDashboardActive = () => {
        return (
            route().current("umkm.dashboard") ||
            route().current("penyelenggara.dashboard") ||
            route().current("admin.dashboard") ||
            route().current("superadmin.dashboard")
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Toaster position="top-right" reverseOrder={false} />
            <ImpersonateBanner />
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink
                                    href={getDashboardRoute()}
                                    active={isDashboardActive()}
                                >
                                    <FiGrid className="mr-2" />
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="relative">
                                <NotificationDropdown />
                            </div>
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}
                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
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
                                            className="flex items-center"
                                        >
                                            <FiUser className="mr-3 h-4 w-4" />
                                            <span>Profile</span>
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="flex items-center w-full text-left"
                                        >
                                            <FiLogOut className="mr-3 h-4 w-4" />
                                            <span>Log Out</span>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <div className="mr-2">
                                <NotificationDropdown />
                            </div>

                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
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

                {/* Mobile Navigation Menu - Improved Layout */}
                <div
                    className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                        showingNavigationDropdown
                            ? "max-h-screen opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="bg-white border-t border-gray-200 shadow-lg">
                        {/* User Info Section - Moved to Top */}
                        <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white mr-4 shadow-md">
                                    <span className="text-lg font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-lg text-gray-900 truncate">
                                        {user.name}
                                    </div>
                                    <div className="text-sm text-gray-600 truncate">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links Section */}
                    <div className="py-3">
                        <div className="px-4 py-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Navigasi
                            </h3>
                        </div>
                        <div className="space-y-1">
                            <ResponsiveNavLink
                                href={getDashboardRoute()}
                                active={isDashboardActive()}
                                className="flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-blue-50"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 mr-3">
                                    <FiGrid className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="text-gray-700">Dashboard</span>
                            </ResponsiveNavLink>
                        </div>
                    </div>

                    {/* Account Actions Section */}
                    <div className="py-3 border-t border-gray-200 bg-gray-50">
                        <div className="px-4 py-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Akun
                            </h3>
                        </div>
                        <div className="space-y-1">
                            <ResponsiveNavLink
                                href={route("profile.edit")}
                                className="flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-white hover:shadow-sm"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 mr-3">
                                    <FiUser className="h-5 w-5 text-green-600" />
                                </div>
                                <span className="text-gray-700">
                                    Edit Profile
                                </span>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                                className="flex items-center px-4 py-3 mx-2 rounded-lg text-base font-medium transition-all duration-200 w-full text-left hover:bg-red-50"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 mr-3">
                                    <FiLogOut className="h-5 w-5 text-red-600" />
                                </div>
                                <span className="text-gray-700">Keluar</span>
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <div className="flex-grow">
                <main>{children}</main>
            </div>

            {user &&
                (user.is_penyelenggara ||
                    (!user.is_admin && !user.is_super_admin)) && (
                    <FloatingWhatsAppButton
                        adminPhoneNumber={adminContact}
                        user={user}
                    />
                )}

            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Pemerintah Kota
                    Banjarmasin. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
}
