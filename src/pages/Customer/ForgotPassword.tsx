import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "../../util/firebase";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Toaster, toast } from "react-hot-toast";

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

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const navigate = useNavigate();

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
       CHECK PHONE EXISTS
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

  /* =====================
       SEND OTP
    ===================== */
  const sendOTP = async () => {
    if (!phone) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    setLoading(true);

    try {
      // Kiểm tra số điện thoại có tồn tại không
      const exists = await checkPhoneExists(phone);

      if (!exists) {
        toast.error("Số điện thoại chưa được đăng ký");
        setLoading(false);
        return;
      }

      setupRecaptcha();

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
      console.log("Lỗi xác thực OTP:", err);
      toast.error("OTP không đúng");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
       RESET PASSWORD
    ===================== */
  const handleResetPassword = async () => {
    if (!isPhoneVerified) {
      toast.error("Vui lòng xác thực số điện thoại");
      return;
    }

    if (newPassword.length < 9) {
      toast.error("Mật khẩu phải từ 9 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        phone: phone,
        password: newPassword, // ✅ FIX Ở ĐÂY
        confirmPassword: confirmPassword,
      };

      console.log("📦 Sending reset password payload:", payload);

      const res = await fetch(
        "http://localhost:3000/api/customer/notcheck/resetPass",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Đặt lại mật khẩu thất bại");
        return;
      }

      toast.success("Đặt lại mật khẩu thành công 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Không thể kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100 flex items-center justify-center p-4">
      <Toaster />
      <div id="recaptcha-container"></div>

      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* LEFT - FORM */}
          <div className="space-y-5 px-2 sm:px-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">Quên mật khẩu</h1>
              <p className="text-gray-600 mt-2">
                Nhập số điện thoại để đặt lại mật khẩu của bạn
              </p>
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>

              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <div className="flex-1 min-w-0">
                  <PhoneInput
                    country={"vn"}
                    value={phone}
                    onChange={setPhone}
                    inputClass="!w-full !h-[42px]"
                    disabled={isPhoneVerified}
                  />
                </div>

                {!isPhoneVerified && (
                  <button
                    onClick={sendOTP}
                    disabled={loading}
                    className={`w-full sm:w-auto px-4 h-[42px] flex items-center justify-center gap-2
                                            text-white text-sm rounded-md whitespace-nowrap
                                            ${
                                              loading
                                                ? "bg-blue-400 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600"
                                            }
                                        `}
                  >
                    {loading ? <Spinner /> : "Gửi OTP"}
                  </button>
                )}
              </div>
            </div>

            {/* OTP */}
            {showOTP && (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Nhập OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 min-w-0 border px-4 py-2 rounded-md focus:ring-2 focus:ring-green-400"
                />

                <button
                  onClick={verifyOTP}
                  disabled={loading}
                  className={`w-full sm:w-auto px-4 flex items-center justify-center gap-2
                                        text-white text-sm rounded-md
                                        ${
                                          loading
                                            ? "bg-green-400 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600"
                                        }
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

            {/* NEW PASSWORD - Only show after phone verified */}
            {isPhoneVerified && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ít nhất 8 ký tự"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhập lại mật khẩu mới
                  </label>
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border px-4 py-3 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

                {/* RESET PASSWORD BUTTON */}
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white
                                        ${
                                          loading
                                            ? "bg-orange-400 cursor-not-allowed"
                                            : "bg-orange-500 hover:bg-orange-600"
                                        }
                                    `}
                >
                  {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </button>
              </>
            )}

            <p className="text-sm text-center sm:text-left mt-2">
              Nhớ mật khẩu?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* RIGHT IMAGE - show on md+ beside form, and show a smaller version below on small screens */}
          <div className="flex items-center justify-center">
            <div className="hidden md:flex items-center justify-center relative w-full min-h-[340px]">
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

            {/* Small image for mobile: placed under form visually when grid collapses */}
            <div className="md:hidden flex items-center justify-center mt-4">
              <div className="relative w-full max-w-sm">
                <div className="absolute -top-6 -left-6 w-36 h-36 bg-orange-300 rounded-full opacity-30 blur-2xl" />
                <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-yellow-300 rounded-full opacity-30 blur-2xl" />
                <img
                  src="/images/otocheck.png"
                  alt="Bus illustration"
                  className="relative z-10 w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
