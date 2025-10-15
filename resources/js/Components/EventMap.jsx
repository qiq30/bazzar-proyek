// File: resources/js/Components/EventMap.jsx

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { FiMaximize, FiMinimize } from "react-icons/fi";

// Mengatasi masalah ikon default di React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ResizeHandler({ isMaximized }) {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 300);
        return () => clearTimeout(timer);
    }, [isMaximized, map]);
    return null;
}

export default function EventMap({ latitude, longitude, popupText }) {
    const [isMaximized, setIsMaximized] = useState(false);
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const mapNode = mapContainerRef.current;
        if (!mapNode) return;

        const handleTouchMove = (e) => {
            e.preventDefault();
        };

        mapNode.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });

        return () => {
            mapNode.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    if (!latitude || !longitude) {
        return (
            <div className="p-4 text-center">Lokasi peta tidak tersedia.</div>
        );
    }

    const position = [latitude, longitude];

    return (
        <div
            ref={mapContainerRef}
            className={`
            ${
                isMaximized
                    ? "fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center"
                    : "relative"
            }
        `}
        >
            <div
                className={`
                    relative w-full rounded-lg overflow-hidden transition-all duration-300
                    ${
                        isMaximized
                            ? "w-full h-full md:w-11/12 md:h-5/6"
                            : "h-64 md:h-80" // <-- PERUBAHAN UTAMA DI SINI
                    }
                `}
            >
                {/* Tombol Maximize/Minimize */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMaximized(!isMaximized);
                    }}
                    className="absolute top-2 right-2 z-[1000] bg-white p-2 rounded-md shadow-lg text-gray-700 hover:bg-gray-100 transition"
                    aria-label={isMaximized ? "Minimize map" : "Maximize map"}
                >
                    {isMaximized ? <FiMinimize /> : <FiMaximize />}
                </button>

                <MapContainer
                    center={position}
                    zoom={15}
                    scrollWheelZoom={true}
                    dragging={true}
                    touchZoom={true}
                    className="w-full h-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <Marker position={position}>
                        <Popup>{popupText || "Lokasi Event"}</Popup>
                    </Marker>
                    <ResizeHandler isMaximized={isMaximized} />
                </MapContainer>
            </div>
        </div>
    );
}
