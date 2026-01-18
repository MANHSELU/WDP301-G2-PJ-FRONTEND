import BustripLogoBg from "../components/BusBig";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            <BustripLogoBg />

            {/* CONTENT */}
            <div className="relative z-20">
                {children}
            </div>
        </div>

    );
}
