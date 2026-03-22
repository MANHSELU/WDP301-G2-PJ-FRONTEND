import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BustripChangePassword: React.FC = () => {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmNewPass, setConfirmNewPass] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");
    const url = import.meta.env.VITE_API_URL
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!token) {
            alert("Bạn chưa đăng nhập");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${url}/api/customer/check/changPassword`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        oldPass,
                        newPass,
                        confirmNewPass,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Đổi mật khẩu thất bại");
            }

            alert("✅ Đổi mật khẩu thành công, vui lòng đăng nhập lại");
            // localStorage.removeItem("accessToken");
            // navigate("/login");

        } catch (error) {
            console.log("lỗi trong chương trình là : ", error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100 flex items-start justify-center pt-4">

            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg mt-4">

                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                    Đổi <span className="text-orange-500">Mật Khẩu</span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Old Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu cũ
                        </label>
                        <input
                            type="password"
                            value={oldPass}
                            onChange={(e) => setOldPass(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                        />
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu mới
                        </label>
                        <input
                            type="password"
                            value={confirmNewPass}
                            onChange={(e) => setConfirmNewPass(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-50"
                    >
                        {loading ? "Đang xử lý..." : "Xác Nhận Đổi Mật Khẩu"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Quay lại{" "}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default BustripChangePassword;