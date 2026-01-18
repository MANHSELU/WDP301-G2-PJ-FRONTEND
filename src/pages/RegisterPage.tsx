import { useState } from "react";
import { Link } from "react-router-dom";

const BustripRegister = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100">
            <div className="max-w-7xl mx-auto">
                {/* Main Card */}
                <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl overflow-hidden relative">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 opacity-30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100 opacity-30 rounded-full blur-3xl"></div>

                    <div className="relative grid md:grid-cols-2 gap-8">
                        {/* Left Side - Content */}
                        <div className="flex flex-col justify-center space-y-6 pl-24">

                            {/* Title */}
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">
                                    Chào Mừng Tới
                                    {" "}
                                    <span className="text-orange-500">Bustrip</span>
                                </h1>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    required
                                    autoComplete="email"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                                />
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Xác nhận Mật khẩu
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số Điện thoại
                                </label>
                                <input
                                    type="number"
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
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
                            >
                                Đăng Ký
                            </button>

                            {/* Register */}
                            <p className="text-center text-sm text-gray-600">
                                Bạn chưa có tài khoản?{" "}
                                <Link to={"/login"}
                                    type="button"
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    Đăng Nhập
                                </Link>
                            </p>
                        </div>

                        {/* RIGHT - IMAGE */}
                        <div className="flex items-center justify-center relative">
                            <div className="hidden lg:flex items-center justify-center relative">
                                <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-2xl" />
                                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-300 rounded-full opacity-30 blur-2xl" />

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

export default BustripRegister;
