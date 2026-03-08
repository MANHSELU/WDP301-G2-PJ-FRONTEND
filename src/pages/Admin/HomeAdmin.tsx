import { NavLink, Outlet } from "react-router-dom";
import {
    BadgeDollarSign,
    Bus,
    BusFront,
    CalendarCheck2,
    LayoutDashboard,
    PlusCircle,
    Shield,
} from "lucide-react";

const ADMIN_SIDEBAR_ITEMS = [
    {
        id: "overview",
        label: "Tổng quan",
        icon: LayoutDashboard,
        path: "/admin",
    },
    {
        id: "roles",
        label: "Quản lý phân quyền",
        icon: Shield,
        path: "/admin/manage-users",
    },
    {
        id: "routes",
        label: "Quản lý tuyến xe",
        icon: CalendarCheck2,
        path: "/admin/manage-routes",
    },
    {
        id: "buses",
        label: "Quản lý xe",
        icon: BusFront,
        path: "/admin/manage-buses",
    },
    {
        id: "create-route",
        label: "Thêm tuyến xe",
        icon: Bus,
        path: "/admin/create-route",
    },
    {
        id: "create-coach",
        label: "Thêm xe mới",
        icon: PlusCircle,
        path: "/admin/create-coach",
    },
    {
        id: "finance",
        label: "Quản lý thu chi",
        icon: BadgeDollarSign,
        path: "/admin/manage-revenue",
    },

    // --- NHÓM TẠO MỚI ---

];

export default function HomeAdmin() {
    return (
        <div className="h-screen bg-[#f6f7f9] text-[#1f2937]">
            <section className="h-full w-full">
                <div className="grid h-full lg:grid-cols-[300px_minmax(0,1fr)]">

                    {/* SIDEBAR */}
                    <aside className="flex h-full flex-col border-r border-[#dde2ea] bg-white">
                        <div className="border-b border-[#dde2ea] bg-white px-5 py-7">
                            <div className="flex items-center gap-2.5">
                                <img
                                    src="/images/logo1.png"
                                    alt="Bustrip logo"
                                    className="h-9 w-9 object-contain opacity-85"
                                />
                                <span className="text-[22px] font-black uppercase tracking-[-0.01em] text-[#eb8a45]">
                                    CoachTrip
                                </span>
                            </div>
                        </div>

                        <div className="px-4 py-4">
                            <div className="overflow-hidden rounded-[2px] border border-[#d8dde6] bg-white">
                                {ADMIN_SIDEBAR_ITEMS.map((item) => {
                                    const ItemIcon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.id}
                                            to={item.path}
                                            end={item.path === "/admin"}
                                            className={({ isActive }) =>
                                                `flex h-10 w-full items-center gap-3 border-b border-[#d8dde6] border-l-4 px-3 text-left text-[13px] font-medium last:border-b-0
            ${isActive
                                                    ? "bg-[#FFF4EB] text-[#1f2937] border-l-[#FF5722]"
                                                    : "border-l-transparent text-[#374151] hover:bg-[#f3f4f6]"
                                                }`
                                            }
                                        >
                                            <ItemIcon size={14} className="shrink-0 text-[#111827]" />
                                            <span>{item.label}</span>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-auto border-t border-[#dde2ea] bg-white px-4 py-4">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-black text-[#6b7280] ring-1 ring-[#d7dbe2]">
                                    AH
                                </span>
                                <div>
                                    <p className="text-[14px] font-black leading-none text-[#111827]">
                                        Admin_Hung
                                    </p>
                                    <p className="mt-1 text-[11px] text-[#9ca3af]">
                                        hung123@gmail.com
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <button className="h-7 rounded-[3px] border border-[#d9dde5] bg-[#f1f2f4] text-[11px] font-semibold text-[#6b7280]">
                                    Chế độ tối
                                </button>
                                <button className="h-7 rounded-[3px] border border-[#d9dde5] bg-[#e5e7eb] text-[11px] font-semibold text-[#b3b8c1]">
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="h-full overflow-y-auto">
                        <div className="mx-auto w-full max-w-[1380px] space-y-6 px-4 pb-16 pt-10">
                            <Outlet />
                        </div>
                    </main>

                </div>
            </section>
        </div>
    );
}
