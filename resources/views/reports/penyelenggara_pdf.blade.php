<!DOCTYPE html>
<html>

<head>
    <title>Laporan Penyelenggara</title>
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
        <h1>Laporan Penyelenggara</h1>
        <p>Tanggal: {{ now()->format('d F Y') }}</p>
    </div>

    <h2>Ringkasan Laporan</h2>
    <table>
        <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Description</th>
        </tr>
        <tr>
            <td>Total Revenue</td>
            <td>Rp {{ number_format($stats['total_revenue']['value'], 0, ',', '.') }}</td>
            <td>{{ $stats['total_revenue']['description'] }}</td>
        </tr>
        <tr>
            <td>Total Events</td>
            <td>{{ $stats['total_events']['value'] }}</td>
            <td>{{ $stats['total_events']['description'] }}</td>
        </tr>
        <tr>
            <td>Total Registrants</td>
            <td>{{ $stats['total_registrants']['value'] }}</td>
            <td>{{ $stats['total_registrants']['description'] }}</td>
        </tr>
    </table>

    <h2>Detail Per Event</h2>
    <table>
        <thead>
            <tr>
                <th>Nama Event</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Partisipan</th>
                <th>Pendapatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($stats['revenue_per_event'] as $event)
                <tr>
                    <td>{{ $event['nama_event'] }}</td>
                    <td>{{ $event['date'] }}</td>
                    <td>{{ $event['status'] }}</td>
                    <td>{{ $event['registrants'] }}</td>
                    <td>Rp {{ number_format($event['revenue'], 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>
