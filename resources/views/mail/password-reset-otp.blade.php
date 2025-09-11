<!DOCTYPE html>
<html>

<head>
    <title>Kode OTP Reset Password</title>
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Reset Password Akun Anda</h2>
        <p>Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.</p>
        <p>Gunakan kode One-Time Password (OTP) berikut untuk menyelesaikan proses:</p>
        <div
            style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; padding: 15px; background-color: #f2f2f2; border-radius: 5px; letter-spacing: 5px;">
            {{ $otp }}
        </div>
        <p>Kode OTP ini akan kedaluwarsa dalam 10 menit.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
        <p style="font-size: 0.9em; color: #aaa;">Email ini dikirim secara otomatis. Mohon untuk tidak membalas.</p>
    </div>
</body>

</html>
