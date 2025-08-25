// File: resources/js/Components/NotificationDropdown.jsx

import { Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

// Ikon Lonceng
const BellIcon = ({ hasUnread }) => (
    <svg
        className="h-6 w-6 text-gray-500 group-hover:text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
        {hasUnread && <circle cx="19" cy="8" r="4" fill="#EF4444" />}
    </svg>
);

export default function NotificationDropdown() {
    const { auth } = usePage().props;
    const notifications = auth.notifications || [];
    const unreadCount = auth.unreadNotifications || 0;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Menutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    // Gunakan Inertia `router.post` agar tidak terjadi full page reload
    const handleNotificationClick = (notification, e) => {
        e.preventDefault();
        router.post(
            route("notifications.read", notification.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Jika URL ada, Inertia akan otomatis redirect
                    // Jika tidak ada, kita bisa tutup dropdown saja
                    setIsOpen(false);
                },
            }
        );
    };

    const handleClearAll = (e) => {
        e.preventDefault();
        if (
            confirm(
                "Apakah Anda yakin ingin menghapus semua riwayat notifikasi?"
            )
        ) {
            router.delete(route("notifications.clear"), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsOpen(false); // Tutup dropdown setelah berhasil
                },
            });
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative group p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <BellIcon hasUnread={unreadCount > 0} />
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <div className="px-4 py-2 border-b flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-gray-900">
                                Notifikasi
                            </h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Bersihkan Semua
                                </button>
                            )}
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <a
                                        key={notification.id}
                                        href={notification.data.url || "#"}
                                        onClick={(e) =>
                                            handleNotificationClick(
                                                notification,
                                                e
                                            )
                                        }
                                        className={`block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 ${
                                            !notification.read_at
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                    >
                                        <p className="font-bold">
                                            {notification.data.title}
                                        </p>
                                        <p className="text-gray-600 text-xs">
                                            {notification.data.message}
                                        </p>
                                    </a>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 text-sm py-6">
                                    Tidak ada notifikasi.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
