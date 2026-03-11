import { MapPin } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

export default function TransportBooking() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="w-64 shrink-0 mt-12">
                        <div className="bg-white rounded-2xl shadow-md border border-black/10 overflow-hidden">

                            <NavLink
                                to="viewtrip"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-4 font-semibold transition
            ${isActive
                                        ? "bg-orange-100 text-orange-600"
                                        : "text-gray-800 hover:bg-orange-50"}`
                                }
                            >
                                <div className="w-6 h-6 bg-orange-500 rounded"></div>
                                Danh sách chuyến lái
                            </NavLink>

                            <NavLink
                                to="viewSlot"
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-4 font-semibold transition
            ${isActive
                                        ? "bg-orange-100 text-orange-600"
                                        : "text-gray-800 hover:bg-orange-50"}`
                                }
                            >
                                <div className="w-6 h-6 bg-orange-500 rounded"></div>
                                Danh sách Ca làm
                            </NavLink>

                            <div className="border-t border-black/10 p-4">
                                <button className="w-full flex items-center gap-3 text-gray-700 hover:text-orange-600 transition">
                                    <MapPin size={20} />
                                    Đăng xuất
                                </button>
                            </div>

                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 min-w-0 mt-12">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
