import { useLocation } from "react-router-dom";
import BustripLogoBg from "../components/BusBig";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const location = useLocation();
    const hideBg = location.pathname.startsWith("/home2");

    return (
        <div className="relative min-h-screen overflow-hidden">
            {!hideBg && <BustripLogoBg />}

            {/* CONTENT */}
            <div className="relative z-20">
                {children}
            </div>
        </div>
    );
}
