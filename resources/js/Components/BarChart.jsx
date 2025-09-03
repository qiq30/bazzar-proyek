// File: resources/js/Components/BarChart.jsx

import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Tambahkan prop 'useRawData' untuk fleksibilitas
export default function BarChart({ data, label, useRawData = false }) {
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
    };

    // Logika untuk menentukan format data
    const chartData = useRawData
        ? data
        : {
              labels: Object.keys(data),
              datasets: [
                  {
                      label: label || "Data",
                      data: Object.values(data),
                      backgroundColor: "rgba(54, 162, 235, 0.6)",
                      borderColor: "rgba(54, 162, 235, 1)",
                      borderWidth: 1,
                  },
              ],
          };

    return <Bar options={options} data={chartData} />;
}
