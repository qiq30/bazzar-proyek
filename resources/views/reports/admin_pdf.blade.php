<!DOCTYPE html>
<html>

<head>
    <title>Laporan Admin</title>
    <style>
        body {
            font-family: sans-serif;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        h2 {
            margin-top: 30px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Laporan Admin Pemko Bazzar</h1>
        <p>Tanggal: {{ now()->format('d F Y') }}</p>
    </div>

    <h2>Statistik UMKM</h2>
    <table>
        <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Total UMKM</td>
            <td>{{ $umkmStats['total']['value'] }}</td>
            <td>{{ $umkmStats['total']['description'] }}</td>
        </tr>
        <tr>
            <td>Verified</td>
            <td>{{ $umkmStats['verified']['value'] }}</td>
            <td>{{ $umkmStats['verified']['description'] }}</td>
        </tr>
        <tr>
            <td>Pending</td>
            <td>{{ $umkmStats['pending']['value'] }}</td>
            <td>{{ $umkmStats['pending']['description'] }}</td>
        </tr>
        <tr>
            <td>Rejected</td>
            <td>{{ $umkmStats['rejected']['value'] }}</td>
            <td>{{ $umkmStats['rejected']['description'] }}</td>
        </tr>
        <tr>
            <td>New (Last 30 Days)</td>
            <td>{{ $umkmStats['new_last_30_days']['value'] }}</td>
            <td>{{ $umkmStats['new_last_30_days']['description'] }}</td>
        </tr>
        <tr>
            <td>Incomplete Profiles</td>
            <td>{{ $umkmStats['incomplete_profiles']['value'] }}</td>
            <td>{{ $umkmStats['incomplete_profiles']['description'] }}</td>
        </tr>
    </table>

    <h2>Statistik Penyelenggara</h2>
    <table>
        <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Total Penyelenggara</td>
            <td>{{ $penyelenggaraStats['total']['value'] }}</td>
            <td>{{ $penyelenggaraStats['total']['description'] }}</td>
        </tr>
        <tr>
            <td>Verified</td>
            <td>{{ $penyelenggaraStats['verified']['value'] }}</td>
            <td>{{ $penyelenggaraStats['verified']['description'] }}</td>
        </tr>
        <tr>
            <td>Pending</td>
            <td>{{ $penyelenggaraStats['pending']['value'] }}</td>
            <td>{{ $penyelenggaraStats['pending']['description'] }}</td>
        </tr>
        <tr>
            <td>Rejected</td>
            <td>{{ $penyelenggaraStats['rejected']['value'] }}</td>
            <td>{{ $penyelenggaraStats['rejected']['description'] }}</td>
        </tr>
        <tr>
            <td>Incomplete Profiles</td>
            <td>{{ $penyelenggaraStats['incomplete_profiles']['value'] }}</td>
            <td>{{ $penyelenggaraStats['incomplete_profiles']['description'] }}</td>
        </tr>
    </table>

    <h2>Statistik Event</h2>
    <table>
        <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Total Events</td>
            <td>{{ $eventStats['total']['value'] }}</td>
            <td>{{ $eventStats['total']['description'] }}</td>
        </tr>
        <tr>
            <td>Active</td>
            <td>{{ $eventStats['active']['value'] }}</td>
            <td>{{ $eventStats['active']['description'] }}</td>
        </tr>
        <tr>
            <td>Upcoming</td>
            <td>{{ $eventStats['upcoming']['value'] }}</td>
            <td>{{ $eventStats['upcoming']['description'] }}</td>
        </tr>
        <tr>
            <td>Finished</td>
            <td>{{ $eventStats['finished']['value'] }}</td>
            <td>{{ $eventStats['finished']['description'] }}</td>
        </tr>
        <tr>
            <td>Avg Registrants/Event</td>
            <td>{{ $eventStats['average_registrants_per_event']['value'] }}</td>
            <td>{{ $eventStats['average_registrants_per_event']['description'] }}</td>
        </tr>
    </table>

    <h2>Statistik Keuangan & Konten</h2>
    <table>
        <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Total Revenue</td>
            <td>Rp {{ number_format($financialAndContentStats['total_revenue']['value'], 0, ',', '.') }}</td>
            <td>{{ $financialAndContentStats['total_revenue']['description'] }}</td>
        </tr>
        <tr>
            <td>Total Products</td>
            <td>{{ $financialAndContentStats['total_products']['value'] }}</td>
            <td>{{ $financialAndContentStats['total_products']['description'] }}</td>
        </tr>
    </table>
</body>

</html>
