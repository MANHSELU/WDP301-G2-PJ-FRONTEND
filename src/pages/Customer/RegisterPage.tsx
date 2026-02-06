import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    type ConfirmationResult,
} from "firebase/auth";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Toaster, toast } from "react-hot-toast";
import { auth } from "../../util/firebase";

/* =====================
   Extend window (TS)
===================== */
declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
    }
}
const Spinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

const BustripRegister = () => {
    const [fullName, setFullName] = useState<string>("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    /* =====================
       SETUP CAPTCHA
    ===================== */
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                { size: "invisible" }
            );
        }
    };

    /* =====================
       SEND OTP
    ===================== */
    const checkPhoneExists = async (phone: string): Promise<boolean> => {
        try {
            const res = await fetch(
                "http://localhost:3000/api/customer/notcheck/check-phone",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ phone }),
                }
            );

            if (!res.ok) {
                throw new Error("Check phone failed");
            }

            const data: { exists: boolean } = await res.json();
            return data.exists;
        } catch (error) {
            console.error("checkPhoneExists error:", error);
            throw error;
        }
    };


    const sendOTP = async () => {
        if (!phone) {
            toast.error("Vui lòng nhập số điện thoại");
            return;
        }
        const exists = await checkPhoneExists(phone);

        if (exists) {
            toast.error("Số điện thoại đã được đăng ký");
            setLoading(false);
            return;
        }
        setLoading(true);
        setupRecaptcha();

        try {
            const confirmation = await signInWithPhoneNumber(
                auth,
                "+" + phone,
                window.recaptchaVerifier!
            );

            window.confirmationResult = confirmation;
            setShowOTP(true);
            toast.success("Đã gửi mã OTP");
        } catch (err) {
            console.error(err);
            toast.error("Gửi OTP thất bại");
        } finally {
            setLoading(false);
        }
    };

    /* =====================
       VERIFY OTP
    ===================== */
    const verifyOTP = async () => {
        if (!otp) {
            toast.error("Vui lòng nhập OTP");
            return;
        }

        setLoading(true);
        try {
            await window.confirmationResult!.confirm(otp);
            setIsPhoneVerified(true);
            setShowOTP(false);
            toast.success("Xác thực số điện thoại thành công");
        } catch (err) {
            console.log("lỗi chương trình trên là : ", err)
            toast.error("OTP không đúng");
        } finally {
            setLoading(false);
        }
    };

    /* =====================
       REGISTER
    ===================== */
    const navigate = useNavigate()
    const handleRegister = async () => {
        // 🔐 BẮT BUỘC OTP ĐÃ VERIFY
        if (!isPhoneVerified) {
            toast.error("Vui lòng xác thực số điện thoại");
            return;
        }

        if (!fullName.trim()) {
            toast.error("Vui lòng nhập họ tên");
            return;
        }

        if (password.length < 8) {
            toast.error("Mật khẩu phải từ 8 ký tự");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            const payload = {
                name: fullName.trim(),
                phone: phone,          // đã được OTP verify
                password: password,
                confirmPassword: confirmPassword,
            };

            console.log("📦 Sending register payload:", payload);

            const res = await fetch("http://localhost:3000/api/customer/notcheck/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Đăng ký thất bại");
                return;
            }

            toast.success("Đăng ký thành công 🎉");

            // 👉 OPTIONAL: redirect login
            navigate("/login");

        } catch (error) {
            console.error("Register error:", error);
            toast.error("Không thể kết nối server");
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100">
            <Toaster />
            <div id="recaptcha-container"></div>

            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl p-10 grid md:grid-cols-2 gap-8">

                    {/* LEFT */}
                    <div className="space-y-5">
                        <h1 className="text-4xl font-bold">
                            Đăng ký <span className="text-orange-500">Bustrip</span>
                        </h1>

                        {/* PHONE */}
                        <label className="text-sm font-medium">
                            Số điện thoại
                        </label>

                        <div className="flex gap-2 items-center">
                            <div className="flex-1">
                                <PhoneInput
                                    country={"vn"}
                                    value={phone}
                                    onChange={setPhone}
                                    inputClass="!w-full !h-[42px]"
                                />
                            </div>

                            {!isPhoneVerified && (
                                <button
                                    onClick={sendOTP}
                                    disabled={loading}
                                    className={`px-4 h-[42px] flex items-center justify-center gap-2
        text-white text-sm rounded-md whitespace-nowrap
        ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}
    `}
                                >
                                    {loading ? <Spinner /> : "Gửi OTP"}
                                </button>

                            )}
                        </div>

                        {/* OTP */}
                        {showOTP && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nhập OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="flex-1 border px-4 py-2 rounded-md focus:ring-2 focus:ring-green-400"
                                />

                                <button
                                    onClick={verifyOTP}
                                    disabled={loading}
                                    className={`px-4 flex items-center justify-center gap-2
        text-white text-sm rounded-md
        ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}
    `}
                                >
                                    {loading ? <Spinner /> : "Xác nhận"}
                                </button>

                            </div>
                        )}

                        {isPhoneVerified && (
                            <p className="text-green-600 text-sm font-medium">
                                ✔ Số điện thoại đã xác thực
                            </p>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                            />
                        </div>
                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ít nhất 8 ký tự"
                                className="w-full px-4 py-3 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nhập lại  Mật khẩu
                            </label>
                            <input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border px-4 py-3 rounded"
                            />
                        </div>

                        {/* REGISTER */}
                        <button
                            onClick={handleRegister}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
                        >
                            Đăng ký
                        </button>

                        <p className="text-sm text-center">
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="text-blue-600">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>

                    {/* RIGHT IMAGE */}
                    {/* RIGHT IMAGE */}
                    <div className="hidden md:flex items-center justify-center relative">
                        <div className="relative w-full min-h-[420px] flex items-center justify-center">
                            {/* Blur background */}
                            <div className="absolute -top-10 -left-10 w-56 h-56 bg-orange-300 rounded-full opacity-30 blur-2xl" />
                            <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-yellow-300 rounded-full opacity-30 blur-2xl" />

                            {/* Image */}
                            <img
                                src="/images/otocheck.png"
                                alt="Bus illustration"
                                className="relative z-10 w-[97%] max-w-none object-contain ml-8"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BustripRegister;
