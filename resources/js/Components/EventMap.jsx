// File: resources/js/Components/EventMap.jsx

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { FiMaximize, FiMinimize, FiNavigation } from "react-icons/fi";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapResizer({ isMaximized }) {
    const map = useMap();

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);

        return () => clearTimeout(timer);
    }, [map, isMaximized]);

    return null;
}

function ZoomToLocation({ latitude, longitude }) {
    const map = useMap();

    const handleZoomToLocation = () => {
        map.setView([latitude, longitude], 15, {
            animate: true,
            duration: 1,
        });
    };

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleZoomToLocation();
            }}
            className="absolute top-[130px] right-3 z-[1001] bg-white w-10 h-10 flex items-center justify-center rounded-md shadow-lg text-gray-700 hover:bg-gray-100 transition"
            aria-label="Zoom to location"
            title="Zoom ke lokasi"
        >
            <FiNavigation className="w-5 h-5" />
        </button>
    );
}

export default function EventMap({
    latitude,
    longitude,
    popupText,
    isMaximized,
    setIsMaximized,
}) {
    if (!latitude || !longitude) {
        return (
            <div className="p-4 text-center">Lokasi peta tidak tersedia.</div>
        );
    }

    const position = [latitude, longitude];

    return (
        <div
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
                            ? "w-full h-full md:w-11/12 md:h-3/4"
                            : "h-64 md:h-80"
                    }
                `}
            >
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
                    <MapResizer isMaximized={isMaximized} />
                    <ZoomToLocation latitude={latitude} longitude={longitude} />
                </MapContainer>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMaximized(!isMaximized);
                    }}
                    className="absolute top-[180px] right-3 z-[1001] bg-white w-10 h-10 flex items-center justify-center rounded-md shadow-lg text-gray-700 hover:bg-gray-100 transition"
                    aria-label={isMaximized ? "Minimize map" : "Maximize map"}
                >
                    {isMaximized ? (
                        <FiMinimize className="w-5 h-5" />
                    ) : (
                        <FiMaximize className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
}
