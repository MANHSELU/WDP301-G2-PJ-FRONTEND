import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";

const BustripLogin = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (): Promise<void> => {
        if (!phone || !password) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setLoading(true);

        try {
            // FORMAT PHONE: +84xxxxxxxxx
            const payload = {
                phone: phone.replace(/^\+/, ""), // xoá dấu + nếu có
                password: password,
            };


            const response = await fetch("http://localhost:3000/api/customer/notcheck/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // ❌ HTTP status không phải 2xx
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Đăng nhập thất bại");
            }

            // ✅ Parse JSON
            const data: {
                token: string;
            } = await response.json();

            const { token } = data;

            // 💾 LƯU LOCALSTORAGE
            localStorage.setItem("accessToken", token);
            alert("Đăng nhập thành công");
            const ResponseProfile = await fetch(
                "http://localhost:3000/api/customer/check/getuser",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // ⭐ QUAN TRỌNG
                    },
                }
            );

            const dataProfile = await ResponseProfile.json();

            if (!ResponseProfile.ok) {
                throw new Error(dataProfile.message || "Profile fail");
            }

            // ✅ Chỉ lưu trạng thái đăng nhập (KHÔNG token)
            dispatch(loginSuccess({
                id: dataProfile.data.id,
                name: dataProfile.data.name,
                phone: dataProfile.data.phone,
                avatar: dataProfile.data.avatar,
                role_id: dataProfile.data.role,
            }));

            navigate("/home");

            // 🔁 CHUYỂN TRANG
            navigate("/");
        } catch (error: unknown) {
            console.error(error);

            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Sai số điện thoại hoặc mật khẩu");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100">
            <div className="max-w-7xl mx-auto">
                {/* Main Card */}
                <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl overflow-hidden relative">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 opacity-30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100 opacity-30 rounded-full blur-3xl"></div>

                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Left Side - Content */}
                        <div className="flex flex-col justify-center space-y-6 pl-24">

                            {/* Title */}
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">
                                    Trở lại với{" "}
                                    <span className="text-orange-500">Bustrip</span>
                                </h1>
                            </div>

                            {/* Email */}
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
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ít nhất 8 ký tự"
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                                />
                            </div>

                            {/* Forgot password */}
                            <div className="text-right">
                                <Link to={"/forgot"}
                                    type="button"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>

                            {/* Submit */}
                            <button
                                type="button"
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
                            >
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>

                            {/* Register */}
                            <p className="text-center text-sm text-gray-600">
                                Bạn chưa có tài khoản?{" "}
                                <Link to={"/register"}
                                    type="button"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    Đăng ký
                                </Link>
                            </p>
                        </div>

                        {/* RIGHT - IMAGE */}
                        <div className="flex items-center justify-center relative">
                            <div className="hidden lg:flex items-center justify-center relative">
                                <div className="absolute -top-10 -left-10 w-56 h-56 bg-orange-300 rounded-full opacity-30 blur-2xl" />
                                <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-yellow-300 rounded-full opacity-30 blur-2xl" />

                                <img
                                    src="/images/otocheck.png"
                                    alt="Bus illustration"
                                    className="relative z-10 w-[90%] max-w-none object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default BustripLogin;
