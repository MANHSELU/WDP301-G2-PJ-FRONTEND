import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const BustripLogin = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await login({ phone, password });

      const { accessToken, user } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl overflow-hidden relative">
          <div className="relative grid md:grid-cols-2 gap-8">
            {/* LEFT */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center space-y-6 pl-24"
            >
              <h1 className="text-4xl font-bold text-gray-800">
                Trở lại với{" "}
                <span className="text-orange-500">Bustrip</span>
              </h1>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0123456789"
                  required
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
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md transition disabled:opacity-60"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Bạn chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Đăng ký
                </Link>
              </p>
            </form>

            {/* RIGHT IMAGE */}
            <div className="hidden lg:flex items-center justify-center">
              <img
                src="/images/otocheck.png"
                alt="Bus illustration"
                className="w-[90%]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BustripLogin;
