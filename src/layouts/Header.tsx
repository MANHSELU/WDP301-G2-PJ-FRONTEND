import { Link, Outlet } from "react-router-dom";
import BustripLogo from "../components/BustripLogo";
import Footer from "./Footer";
import { NavLink } from "react-router-dom";

export default function Header() {

    const menus = [
        { label: "Trang chủ", path: "/" },
        { label: "Lịch trình", path: "/lich-trinh" },
        { label: "Tra cứu vé", path: "/tra-cuu-ve" },
        { label: "Hóa đơn", path: "/hoa-don" },
        { label: "Thêm", path: "/them" },
    ];

    return (
        <>
            <nav className="relative z-20 overflow-visible">
                {/* Header background */}
                <div
                    className="
          absolute inset-0
          bg-gradient-to-r from-orange-50 via-pink-50 to-orange-50
          z-0
        "
                />

                {/* Header content */}
                <div
                    className="
          relative z-10
          max-w-7xl mx-auto
          px-6
          h-16
          flex items-center justify-between
        "
                >
                    {/* Logo */}
                    <div className="flex items-center space-x-3 relative z-10">
                        <div className="p-2">
                            <BustripLogo className="w-14 h-14" />
                        </div>
                        <span className="text-orange-500 font-bold text-2xl">
                            BUSTRIP
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {menus.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `transition-colors font-medium ${isActive
                                        ? "text-orange-500"
                                        : "text-gray-700 hover:text-orange-500"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>


                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        <Link to={"/register"} className="text-gray-700 hover:text-orange-500 transition-colors px-4 py-2">
                            Sign in
                        </Link>
                        <Link to={"/login"} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
                            Sign up
                        </Link>
                    </div>

                    {/* Mobile menu */}
                    <div className="md:hidden">
                        <button className="text-gray-700 hover:text-orange-500">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
            <Outlet />
            <Footer />
        </>
    );
}
