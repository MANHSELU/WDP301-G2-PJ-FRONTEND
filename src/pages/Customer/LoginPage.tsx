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
                _id: dataProfile.data.id,
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
        <div className="relative min-h-screen w-full overflow-hidden text-[#2e1f16]">

            {/* ===== Background Image ===== */}
            <img
                src="/images/bg4.png"
                alt="Background"
                className="absolute inset-0 h-full w-full object-cover object-[80%_center]"
            />
            <div className="absolute inset-0 bg-white/40"></div>


            {/* ===== Overlay chỉ phủ bên trái, điều chỉnh độ rộng và gradient để cân đối hơn ===== */}
            <div className="absolute left-0 top-0 h-full w-[50%] bg-gradient-to-r from-white/95 via-white/85 to-transparent" />

            {/* ===== Bus bên phải, điều chỉnh vị trí và kích thước để cân bằng hơn với bên trái ===== */}
            <div className="pointer-events-none absolute bottom-[8%] right-[5%] w-[50%] max-w-[780px] z-10">
                <img
                    src="/images/bus7.png"
                    alt="Bus"
                    className="w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)]"
                />
            </div>

            {/* ===== Form Container - Điều chỉnh để gần giữa hơn một chút, giữ left nhưng tăng padding ===== */}
            <div className="relative z-20 flex min-h-screen w-1/2 items-center justify-end px-12 lg:px-20">
                <div className="w-full max-w-[560px] rounded-3xl border border-[#f2e5d8] bg-white/95 p-12 shadow-[0_30px_60px_-25px_rgba(181,98,27,0.6)] backdrop-blur">
                    {/* Title - Giữ nguyên nhưng thêm text-center để đối xứng nội bộ */}
                    <div className="mb-8 space-y-3 text-center">
                        <h1 className="text-4xl font-black tracking-tight text-[#2f2118]">
                            Trở lại với{" "}
                            <span className="bg-gradient-to-r from-[#f7a53a] to-[#e8791c] bg-clip-text text-transparent">
                                CoachTrip
                            </span>
                        </h1>
                        <p className="text-sm text-[#7c5f4a]">
                            Đăng nhập để tiếp tục hành trình của bạn
                        </p>
                    </div>

                    {/* Phone */}
                    <div className="mb-5 space-y-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#b58460]">
                            Số điện thoại
                        </label>

                        <div className="rounded-lg border border-[#e6d5c3] bg-[#fffdfb] p-1 focus-within:border-[#f39a32] focus-within:ring-2 focus-within:ring-[#f39a32]/20">
                            <PhoneInput
                                country={"vn"}
                                value={phone}
                                onChange={setPhone}
                                inputClass="!w-full !h-[44px] !bg-transparent !border-0 !text-[#4a3426] !font-semibold"
                                buttonClass="!bg-transparent !border-0"
                                containerClass="!bg-transparent"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-3 space-y-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#b58460]">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ít nhất 8 ký tự"
                            className="w-full rounded-lg border border-[#e6d5c3] bg-[#fffdfb] px-4 py-3 text-sm font-semibold text-[#4a3426] outline-none transition focus:border-[#f39a32] focus:ring-2 focus:ring-[#f39a32]/20"
                        />
                    </div>

                    {/* Forgot - Text center để đối xứng */}
                    <div className="mb-6 text-center">
                        <Link
                            to="/forgot"
                            className="text-sm font-semibold text-[#e8791c] hover:underline"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full rounded-xl bg-gradient-to-r from-[#f7a53a] to-[#e8791c] px-6 py-3.5 text-sm font-bold text-white shadow-[0_18px_30px_-14px_rgba(216,113,28,0.9)] transition hover:opacity-90 disabled:opacity-60"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    {/* Register - Text center */}
                    <p className="mt-6 text-center text-sm text-[#6b4b39]">
                        Bạn chưa có tài khoản?{" "}
                        <Link
                            to="/register"
                            className="font-bold text-[#e8791c] hover:underline"
                        >
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BustripLogin;
