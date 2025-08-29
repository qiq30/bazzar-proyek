<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>E-Ticket {{ $registration->event->nama_event }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

        body {
            font-family: 'Poppins', sans-serif;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .ticket-container {
            width: 700px;
            margin: 20px auto;
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background-color: #004080;
            color: white;
            padding: 25px;
            text-align: center;
        }

        .header img {
            height: 60px;
            margin-bottom: 10px;
        }

        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
        }

        .header p {
            margin: 5px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }

        .content {
            padding: 30px;
            display: table;
            width: 100%;
        }

        .left-panel,
        .right-panel {
            display: table-cell;
            vertical-align: top;
        }

        .left-panel {
            width: 65%;
            padding-right: 30px;
        }

        .right-panel {
            width: 35%;
            text-align: center;
        }

        .info-group {
            margin-bottom: 20px;
        }

        .info-group .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .info-group .value {
            font-size: 20px;
            font-weight: 600;
        }

        .info-group .value.small {
            font-size: 16px;
        }

        .stand-pin-container {
            margin-top: 25px;
            display: table;
            width: 100%;
        }

        .stand-box,
        .pin-box {
            display: table-cell;
            text-align: center;
            padding: 15px;
            border-radius: 8px;
            background-color: #f0f5fa;
            border: 1px solid #d9e2ec;
        }

        .pin-box {
            margin-left: 15px;
        }

        .stand-box .value,
        .pin-box .value {
            font-size: 36px;
            font-weight: 700;
            line-height: 1;
        }

        .qr-code-box .label {
            margin-top: 8px;
            font-size: 12px;
            color: #666;
        }

        .footer-banner {
            padding: 15px;
            text-align: center;
            font-weight: 700;
            font-size: 18px;
            color: white;
            letter-spacing: 2px;
        }

        .status-ok {
            background-color: #28a745;
        }

        .status-checked-in {
            background-color: #6c757d;
        }
    </style>
</head>

<body>
    <div class="ticket-container">
        <div class="header">
            <img src="{{ $logoBase64 }}" alt="Logo Pemko Banjarmasin">
            <h1>{{ $registration->event->nama_event }}</h1>
            <p>{{ \Carbon\Carbon::parse($registration->event->tanggal_mulai_acara)->translatedFormat('d F Y') }} -
                {{ \Carbon\Carbon::parse($registration->event->tanggal_selesai_acara)->translatedFormat('d F Y') }}</p>
        </div>

        <div class="content">
            <div class="left-panel">
                <div class="info-group">
                    <div class="label">Nama UMKM</div>
                    <div class="value">{{ $registration->umkmProfile->business_name }}</div>
                </div>
                <div class="info-group">
                    <div class="label">Penanggung Jawab</div>
                    <div class="value small">{{ $registration->umkmProfile->user->name }}</div>
                </div>
                <div class="info-group">
                    <div class="label">Lokasi Event</div>
                    <div class="value small">{{ $registration->event->lokasi_event }}</div>
                </div>

                <div class="stand-pin-container">
                    <div class="stand-box">
                        <div class="label">NOMOR STAND</div>
                        <div class="value">{{ $registration->nomor_stand }}</div>
                    </div>
                    <div style="display: table-cell; width: 15px;"></div>
                    <div class="pin-box">
                        <div class="label">KODE VERIFIKASI PIN</div>
                        <div class="value">{{ $registration->kode_pin }}</div>
                    </div>
                </div>
            </div>
            <div class="right-panel">
                <div class="qr-code-box">
                    <img src="data:image/svg+xml;base64,{{ $qrCode }}" alt="QR Code">
                    <div class="label">{{ $registration->kode_pendaftaran }}</div>
                </div>
            </div>
        </div>

        @if ($registration->status == 'sudah_check_in')
            <div class="footer-banner status-checked-in">RIWAYAT CHECK-IN</div>
        @else
            <div class="footer-banner status-ok">PENDAFTARAN BERHASIL</div>
        @endif
    </div>
</body>

</html>
