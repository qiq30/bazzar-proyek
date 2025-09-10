// resources/js/Pages/Auth/VerifyOtp.jsx

import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { useEffect } from "react";

export default function VerifyOtp({ email }) {
    const { data, setData, post, processing, errors } = useForm({
        email: email,
        otp: "",
    });

    useEffect(() => {
        // Fokus ke input OTP saat halaman dimuat
        document.getElementById("otp").focus();
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register.verify.otp"));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi OTP" />

            <div className="mb-4 text-sm text-center text-gray-600">
                Kami telah mengirimkan kode OTP ke <strong>{email}</strong>.
                Silakan periksa email Anda dan masukkan kode di bawah ini.
            </div>

            <form onSubmit={submit}>
                <div>
                    <TextInput
                        id="otp"
                        type="text"
                        name="otp"
                        value={data.otp}
                        className="block w-full text-center text-2xl tracking-[1rem]"
                        autoComplete="one-time-code"
                        onChange={(e) => setData("otp", e.target.value)}
                        required
                        maxLength="6"
                    />
                    <InputError message={errors.otp} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton
                        className="w-full justify-center"
                        disabled={processing}
                    >
                        Verifikasi
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-4 text-center">
                <Link
                    href={route("register.wizard")}
                    className="text-sm text-gray-600 underline hover:text-gray-900"
                >
                    Kembali ke Pendaftaran
                </Link>
            </div>
        </GuestLayout>
    );
}
