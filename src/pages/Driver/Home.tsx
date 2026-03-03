import { MapPin } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function TransportBooking() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="w-64 shrink-0 mt-6">
                        <div className="bg-white rounded-2xl shadow-md border border-black/10 overflow-hidden">
                            <Link
                                to="viewtrip"
                                className="flex items-center gap-3 p-4 font-bold text-gray-800
                                hover:bg-orange-100 transition"
                            >
                                <div className="w-6 h-6 bg-orange-500 rounded"></div>
                                Danh sách chuyến lái
                            </Link>

                            <div className="border-t border-black/10 p-4">
                                <button className="w-full flex items-center gap-3 text-gray-700 hover:text-orange-600">
                                    <MapPin size={20} />
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
