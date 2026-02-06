import { useLocation } from "react-router-dom";
import BustripLogoBg from "../components/BusBig";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { pathname } = useLocation();

    // 🔥 CHỈ CÁC ROUTE NÀY MỚI CÓ LOGO
    const logoRoutes = [
        "/",
        "/login",
        "/register",
        "/profile",
    ];

    const showLogo = logoRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    return (
        <div className="relative min-h-screen">
            {showLogo && <BustripLogoBg />}

            {/* CONTENT */}
            <div className="relative z-20">
                {children}
            </div>
        </div>
    );
}
