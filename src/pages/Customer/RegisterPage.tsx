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
        <div className="relative min-h-screen w-full overflow-hidden text-[#2e1f16]">

            {/* ===== Background ===== */}
            <img
                src="/images/bg4.png"
                alt="Background"
                className="absolute inset-0 h-full w-full object-cover object-[72%_center]"
            />

            {/* ===== Overlay bên trái ===== */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/95 via-white/85 to-transparent" />

            <Toaster />
            <div id="recaptcha-container"></div>

            {/* ===== Layout 2 cột ===== */}
            <div className="relative z-20 grid py-20 grid-cols-1 lg:grid-cols-2">


                {/* ================= LEFT - FORM ================= */}
                <div className="flex items-center justify-end px-12 lg:px-20">
                    <div className="w-full max-w-[560px] rounded-3xl border border-[#f2e5d8] bg-white/95 p-12 shadow-[0_30px_60px_-25px_rgba(181,98,27,0.6)] backdrop-blur">

                        <div className="mb-8 text-center space-y-3">
                            <h1 className="text-4xl font-black tracking-tight text-[#2f2118]">
                                Đăng ký{" "}
                                <span className="bg-gradient-to-r from-[#f7a53a] to-[#e8791c] bg-clip-text text-transparent">
                                    CoachTrip
                                </span>
                            </h1>
                            <p className="text-sm text-[#7c5f4a]">
                                Tạo tài khoản để bắt đầu hành trình
                            </p>
                        </div>

                        {/* PHONE */}
                        <div className="mb-4 space-y-2">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#b58460]">
                                Số điện thoại
                            </label>

                            <div className="flex gap-2">
                                <div className="flex-1 rounded-lg border border-[#e6d5c3] bg-[#fffdfb] p-1 focus-within:ring-2 focus-within:ring-[#f39a32]/20">
                                    <PhoneInput
                                        country={"vn"}
                                        value={phone}
                                        onChange={setPhone}
                                        inputClass="!w-full !h-[44px] !bg-transparent !border-0"
                                        buttonClass="!border-0"
                                    />
                                </div>

                                {!isPhoneVerified && (
                                    <button
                                        onClick={sendOTP}
                                        disabled={loading}
                                        className="px-4 h-[44px] rounded-lg bg-gradient-to-r from-[#f7a53a] to-[#e8791c] 
    text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 
    flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                Đang gửi
                                            </>
                                        ) : (
                                            "OTP"
                                        )}
                                    </button>
                                )}

                            </div>
                        </div>

                        {/* OTP */}
                        {showOTP && (
                            <div className="mb-4 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nhập OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="flex-1 rounded-lg border border-[#e6d5c3] px-4 py-2.5 focus:ring-2 focus:ring-[#f39a32]/20"
                                />

                                <button
                                    onClick={verifyOTP}
                                    disabled={loading}
                                    className="px-4 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        )}

                        {isPhoneVerified && (
                            <p className="text-green-600 text-sm mb-4 font-medium">
                                ✔ Số điện thoại đã xác thực
                            </p>
                        )}

                        {/* FULLNAME */}
                        <div className="mb-4">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#b58460] mb-2">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                className="w-full rounded-lg border border-[#e6d5c3] px-4 py-2.5 focus:ring-2 focus:ring-[#f39a32]/20"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="mb-4">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#b58460] mb-2">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ít nhất 8 ký tự"
                                className="w-full rounded-lg border border-[#e6d5c3] px-4 py-2.5 focus:ring-2 focus:ring-[#f39a32]/20"
                            />
                        </div>

                        {/* CONFIRM */}
                        <div className="mb-6">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#b58460] mb-2">
                                Nhập lại mật khẩu
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Xác nhận mật khẩu"
                                className="w-full rounded-lg border border-[#e6d5c3] px-4 py-2.5 focus:ring-2 focus:ring-[#f39a32]/20"
                            />
                        </div>

                        {/* REGISTER BUTTON */}
                        <button
                            onClick={handleRegister}
                            className="w-full rounded-xl bg-gradient-to-r from-[#f7a53a] to-[#e8791c] py-2.5 text-sm font-bold text-white shadow-[0_18px_30px_-14px_rgba(216,113,28,0.9)] hover:opacity-90"
                        >
                            Đăng ký
                        </button>

                        <p className="mt-6 text-center text-sm text-[#6b4b39]">
                            Đã có tài khoản?{" "}
                            <Link
                                to="/login"
                                className="font-bold text-[#e8791c] hover:underline"
                            >
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>

                {/* ================= RIGHT - BUS ================= */}
                <div className="relative hidden items-center justify-center lg:flex">
                    <img
                        src="/images/bus7.png"
                        alt="Bus"
                        className="w-[100%] max-w-[820px] object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)]"
                    />
                </div>

            </div>
        </div>

    );
};

export default BustripRegister;
