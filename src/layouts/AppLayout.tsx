import BustripLogoBg from "../components/BusBig";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            {/* DECOR BACKGROUND */}
            <BustripLogoBg
                className="
    right-[0px]
    top-[0px]
    w-[850px]
    h-[850px]
    opacity-20
    z-30
    pointer-events-none
  "
            />


            {/* CONTENT */}
            <div className="relative z-20">
                {children}
            </div>
        </div>
    );
}
