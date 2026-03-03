import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Edit,
    ChevronLeft,
    ChevronRight,
    X,
    Search as SearchIcon,
    Plus,
} from "lucide-react";

type ApiResponse<T = unknown> = {
    success?: boolean;
    message?: string;
    data?: T;
};

type StopRef = {
    _id?: string;
    name?: string;
    type?: string;
    latitude?: number;
    longitude?: number;
    [k: string]: unknown;
};

type RouteModel = {
    _id?: string;
    start?: StopRef | string;
    end?: StopRef | string;
    start_id?: StopRef | string;
    stop_id?: StopRef | string;
    distance_km?: number;
    is_active?: boolean;
    created_at?: string;
    createdAt?: string;
    stops?: unknown[];
    [k: string]: unknown;
};

type RouteRow = {
    id?: string;
    code?: string;
    start: string;
    stop: string;
    distance_km: number;
    status: "Hoạt động" | "Tạm ngưng";
    created_at?: string;
    raw?: RouteModel;
};

type FormDataType = {
    distance_km: number;
    status: "Hoạt động" | "Tạm ngưng" | "";
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

const extractMessage = (payload: unknown): string | undefined => {
    if (!isRecord(payload)) return undefined;
    if (typeof payload.message === "string") return payload.message;
    if (
        isRecord(payload.data) &&
        typeof (payload.data as Record<string, unknown>).message === "string"
    )
        return (payload.data as Record<string, unknown>).message as string;
    return undefined;
};

const extractRouteArray = (payload: unknown): RouteModel[] => {
    if (Array.isArray(payload) && payload.every(isRecord))
        return payload as RouteModel[];
    if (!isRecord(payload)) return [];

    const p = payload as Record<string, unknown>;
    if (isRecord(p.data)) {
        const d = p.data as Record<string, unknown>;
        if (Array.isArray(d.routes) && d.routes.every(isRecord))
            return d.routes as RouteModel[];
        if (Array.isArray(d) && d.every(isRecord)) return d as RouteModel[];
    }
    if (Array.isArray(p.routes) && p.routes.every(isRecord))
        return p.routes as RouteModel[];
    if (Array.isArray(p.data) && p.data.every(isRecord))
        return p.data as RouteModel[];

    return [];
};

const mapStatusToVn = (v?: unknown): "Hoạt động" | "Tạm ngưng" => {
    if (v === undefined || v === null) return "Tạm ngưng";
    if (typeof v === "boolean") return v ? "Hoạt động" : "Tạm ngưng";
    const up = String(v).toUpperCase();
    if (up === "ACTIVE" || up === "ENABLED") return "Hoạt động";
    return "Tạm ngưng";
};

const ManageRoute: React.FC = () => {
    const [routes, setRoutes] = useState<RouteRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<
        "Tất cả" | "Hoạt động" | "Tạm ngưng"
    >("Tất cả");

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedRoute, setSelectedRoute] = useState<RouteRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormDataType>({
        distance_km: 0,
        status: "",
    });
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const profileRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!profileRef.current) return;
            if (!(e.target instanceof Node)) return;
        };
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Hoạt động":
                return "bg-green-50 text-green-700 ring-1 ring-green-100";
            case "Tạm ngưng":
                return "bg-red-50 text-red-700 ring-1 ring-red-100";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const fetchRoutes = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("accessToken") ?? "";
            const url =
                "http://localhost:3000/api/admin/check/routes?page=1&limit=200";
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const parsed = await res.json().catch(() => ({} as ApiResponse<unknown>));
            if (!res.ok) {
                const msg = extractMessage(parsed) ?? "Không thể lấy danh sách tuyến";
                throw new Error(msg);
            }

            const rawList = extractRouteArray(parsed);

            const normalized: RouteRow[] = rawList.map((r) => {
                const resolveStop = (v?: unknown): string => {
                    if (!v) return "N/A";
                    if (isRecord(v))
                        return String(
                            (v as Record<string, unknown>).name ??
                            (v as Record<string, unknown>)._id ??
                            "N/A"
                        );
                    return String(v);
                };

                const start = resolveStop(
                    (r as RouteModel).start ?? (r as RouteModel).start_id
                );
                const stop = resolveStop(
                    (r as RouteModel).end ?? (r as RouteModel).stop_id
                );
                const distance = Number((r as RouteModel).distance_km ?? 0) || 0;
                const created =
                    (r as RouteModel).created_at ??
                    (r as RouteModel).createdAt ??
                    undefined;

                return {
                    id: r._id,
                    code: r._id,
                    start,
                    stop,
                    distance_km: distance,
                    status: mapStatusToVn((r as RouteModel).is_active),
                    created_at: created,
                    raw: r,
                };
            });

            setRoutes(normalized);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi không xác định");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    // combined filtering: tab + search
    const filteredRoutes = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return routes.filter((route) => {
            if (activeTab === "Hoạt động" && route.status !== "Hoạt động")
                return false;
            if (activeTab === "Tạm ngưng" && route.status !== "Tạm ngưng")
                return false;
            if (!q) return true;
            // search by start, stop or code
            const hay = `${route.start} ${route.stop} ${route.code ?? ""
                }`.toLowerCase();
            return hay.includes(q);
        });
    }, [routes, activeTab, searchQuery]);

    const handleAddNew = () => {
        // simple navigation to add page; adjust route if app uses router
        window.location.href = "/admin/routes/new";
    };

    const handleEdit = (route: RouteRow) => {
        setSelectedRoute(route);
        setFormData({ distance_km: route.distance_km, status: route.status });
        setUpdateError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRoute(null);
        setUpdateError(null);
    };

    const vnStatusToIsActive = (vn: string): boolean => vn === "Hoạt động";

    const handleUpdate = async () => {
        if (!selectedRoute?.id) return;
        setUpdating(true);
        setUpdateError(null);
        try {
            const token = localStorage.getItem("accessToken") ?? "";
            const payload: { distance_km?: number; is_active?: boolean } = {};
            if (typeof formData.distance_km === "number")
                payload.distance_km = formData.distance_km;
            if (formData.status)
                payload.is_active = vnStatusToIsActive(formData.status);

            const res = await fetch(
                `http://localhost:3000/api/admin/check/routes/${selectedRoute.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(payload),
                }
            );

            const parsed = await res.json().catch(() => ({} as ApiResponse<unknown>));
            if (!res.ok) {
                const msg = extractMessage(parsed) ?? "Cập nhật tuyến thất bại";
                throw new Error(msg);
            }

            await fetchRoutes();
            closeModal();
        } catch (err) {
            setUpdateError(err instanceof Error ? err.message : "Lỗi khi cập nhật");
        } finally {
            setUpdating(false);
        }
    };

    const fmtDate = (iso?: string): string => {
        if (!iso) return "—";
        const d = new Date(iso);
        if (isNaN(d.getTime())) return String(iso);
        return d.toLocaleString();
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-black text-[#111827]">
                    Quản lý tuyến xe
                </h2>

                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 rounded-[4px] bg-[#eb8a45] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
                >
                    <Plus size={14} />
                    Thêm tuyến mới
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded border border-[#dde2ea] bg-white p-4">
                    <p className="text-[12px] text-[#6b7280]">Tổng số tuyến</p>
                    <p className="mt-1 text-[24px] font-black">{routes.length}</p>
                </div>

                <div className="rounded border border-[#dde2ea] bg-white p-4">
                    <p className="text-[12px] text-[#6b7280]">Hoạt động</p>
                    <p className="mt-1 text-[24px] font-black">
                        {routes.filter((r) => r.status === "Hoạt động").length}
                    </p>
                </div>

                <div className="rounded border border-[#dde2ea] bg-white p-4">
                    <p className="text-[12px] text-[#6b7280]">Tạm ngưng</p>
                    <p className="mt-1 text-[24px] font-black">
                        {routes.filter((r) => r.status === "Tạm ngưng").length}
                    </p>
                </div>
            </div>

            {/* TABLE WRAPPER */}
            <div className="rounded border border-[#dde2ea] bg-white">

                {/* FILTER BAR */}
                <div className="flex flex-col gap-4 border-b border-[#dde2ea] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        {(["Tất cả", "Hoạt động", "Tạm ngưng"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded px-3 py-1 text-[12px] font-semibold ${activeTab === tab
                                    ? "bg-[#f4d5b4] text-[#1f2937]"
                                    : "text-[#6b7280] hover:bg-[#f3f4f6]"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded border border-[#dde2ea] bg-[#f9fafb] px-2 py-1">
                            <SearchIcon size={14} className="text-[#9ca3af]" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm tên tuyến, điểm đi hoặc điểm đến..."
                                className="ml-2 bg-transparent text-[12px] outline-none"
                            />
                        </div>

                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-[12px] text-[#6b7280]"
                        >
                            Xóa
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-[#6b7280]">
                            Đang tải danh sách tuyến...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-600">
                            Lỗi: {error}
                        </div>
                    ) : (
                        <table className="w-full text-[13px]">
                            <thead className="bg-[#f9fafb] text-[#6b7280]">
                                <tr>
                                    <th className="px-4 py-2 text-left">Đi → Đến</th>
                                    <th className="px-4 py-2 text-left">Ngày tạo</th>
                                    <th className="px-4 py-2 text-left">Khoảng cách (km)</th>
                                    <th className="px-4 py-2 text-center">Trạng thái</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRoutes.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-10 text-center text-[#9ca3af]">
                                            Không có tuyến phù hợp
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRoutes.map((route, idx) => (
                                        <tr
                                            key={route.id ?? idx}
                                            className="border-t border-[#dde2ea] hover:bg-[#f9fafb]"
                                        >
                                            <td className="px-4 py-2">
                                                <div className="font-semibold text-[#111827]">
                                                    {route.start} → {route.stop}
                                                </div>
                                                <div className="text-[11px] text-[#9ca3af]">
                                                    Mã: {route.code ?? "—"}
                                                </div>
                                            </td>

                                            <td className="px-4 py-2">
                                                {fmtDate(route.created_at)}
                                            </td>

                                            <td className="px-4 py-2">
                                                {route.distance_km}
                                            </td>

                                            <td className="px-4 py-2 text-center">
                                                <span
                                                    className={`rounded px-2 py-[2px] text-[11px] font-semibold ${getStatusStyle(
                                                        route.status
                                                    )}`}
                                                >
                                                    {route.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleEdit(route)}
                                                    className="rounded p-1 hover:bg-[#f3f4f6]"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* FOOTER */}
                <div className="border-t border-[#dde2ea] px-4 py-3 text-[12px] text-[#6b7280] flex items-center justify-between">
                    <div>
                        Hiển thị 1–{Math.min(10, filteredRoutes.length)} của{" "}
                        {filteredRoutes.length} tuyến
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="rounded p-1 hover:bg-[#f3f4f6]" disabled>
                            <ChevronLeft size={16} />
                        </button>
                        <span className="rounded bg-[#eb8a45] px-2 py-[2px] text-white">1</span>
                        <button className="rounded p-1 hover:bg-[#f3f4f6]" disabled>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL (GIỮ LOGIC CŨ) */}
            {isModalOpen && selectedRoute && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-5 py-3">
                            <h3 className="text-[15px] font-bold text-[#111827]">
                                Chỉnh sửa tuyến:{" "}
                                <span className="text-[#eb8a45]">
                                    {selectedRoute.start} → {selectedRoute.stop}
                                </span>
                            </h3>
                            <button onClick={closeModal}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 p-5">
                            <div>
                                <label className="block text-[12px] font-medium text-[#374151]">
                                    Đi - Đến
                                </label>
                                <input
                                    value={`${selectedRoute.start} → ${selectedRoute.stop}`}
                                    disabled
                                    className="mt-1 w-full rounded border border-[#dde2ea] bg-[#f9fafb] px-2 py-1 text-[13px]"
                                />
                            </div>

                            <div>
                                <label className="block text-[12px] font-medium text-[#374151]">
                                    Khoảng cách (km)
                                </label>
                                <input
                                    type="number"
                                    value={formData.distance_km}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            distance_km: Number(e.target.value) || 0,
                                        })
                                    }
                                    className="mt-1 w-full rounded border border-[#dde2ea] px-2 py-1 text-[13px]"
                                />
                            </div>

                            <div>
                                <label className="block text-[12px] font-medium text-[#374151]">
                                    Trạng thái
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            status: e.target.value as FormDataType["status"],
                                        })
                                    }
                                    className="mt-1 w-full rounded border border-[#dde2ea] px-2 py-1 text-[13px]"
                                >
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Tạm ngưng">Tạm ngưng</option>
                                </select>
                            </div>

                            {updateError && (
                                <div className="rounded bg-red-50 p-2 text-[12px] text-red-600">
                                    {updateError}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 border-t px-5 py-3">
                            <button
                                onClick={closeModal}
                                disabled={updating}
                                className="rounded border border-[#dde2ea] px-3 py-1 text-[12px]"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="rounded bg-[#eb8a45] px-3 py-1 text-[12px] text-white"
                            >
                                {updating ? "Đang lưu..." : "Lưu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );

};

export default ManageRoute;