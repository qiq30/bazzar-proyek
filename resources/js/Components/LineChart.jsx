// File: resources/js/Components/LineChart.jsx

import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler, // Import Filler untuk area di bawah garis
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // Daftarkan Filler
);

export default function LineChart({ data, label }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        elements: {
            line: {
                tension: 0.3, // Membuat garis sedikit melengkung
            },
        },
    };

    const chartData = {
        labels: Object.keys(data).map((month) =>
            new Date(month + "-01").toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
            })
        ),
        datasets: [
            {
                fill: true, // Aktifkan fill
                label: label || "Data",
                data: Object.values(data),
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "rgba(54, 162, 235, 0.2)", // Warna area di bawah garis
            },
        ],
    };

    return <Line options={options} data={chartData} />;
}
