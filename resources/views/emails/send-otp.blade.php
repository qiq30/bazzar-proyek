<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode Verifikasi Email</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }

        .header {
            text-align: center;
            border-bottom: 1px solid #eeeeee;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }

        .header h1 {
            color: #2a75b3;
            margin: 0;
        }

        .content p {
            line-height: 1.6;
            font-size: 16px;
        }

        .otp-code {
            background-color: #eef4f8;
            border: 1px dashed #c0ddee;
            padding: 15px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            margin: 25px 0;
            border-radius: 5px;
            color: #1a5c8e;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Verifikasi Akun Anda</h1>
        </div>
        <div class="content">
            <p>Halo,</p>
            <p>Terima kasih telah mendaftar. Gunakan kode berikut untuk menyelesaikan proses registrasi Anda. Kode ini
                hanya berlaku selama 10 menit.</p>

            <div class="otp-code">
                {{ $otp }}
            </div>

            <p>Jika Anda tidak merasa mendaftar, mohon abaikan email ini.</p>
            <p>Terima kasih,<br>Tim {{ config('app.name') }}</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
