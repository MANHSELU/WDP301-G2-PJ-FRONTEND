import React, { useEffect, useMemo, useState } from "react";
import {
    Edit,
    ChevronLeft,
    ChevronRight,
    X,
    Search as SearchIcon,
    MapPin,
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

    const filteredRoutes = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return routes.filter((route) => {
            if (activeTab === "Hoạt động" && route.status !== "Hoạt động")
                return false;
            if (activeTab === "Tạm ngưng" && route.status !== "Tạm ngưng")
                return false;
            if (!q) return true;
            const hay = `${route.start} ${route.stop} ${route.code ?? ""
                }`.toLowerCase();
            return hay.includes(q);
        });
    }, [routes, activeTab, searchQuery]);

    const handleAddNew = () => {
        window.location.href = "/admin/create-route";
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

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-900">Quản lý tuyến xe</h2>
                    <p className="text-sm text-gray-500 mt-1">Xem và quản lý tuyến xe đang hoạt động</p>
                </div>

                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
                >
                    Thêm Tuyến Xe Mới
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-900">Tổng số tuyến</p>
                    <p className="mt-3 text-2xl font-black text-gray-900">{routes.length} Tuyến</p>
                    <p className="mt-4 text-xs font-medium text-green-500">+2 tuyến mới hôm nay</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-900">Tuyến hoạt động</p>
                    <p className="mt-3 text-2xl font-black text-gray-900">{routes.filter(r => r.status === "Hoạt động").length} Tuyến</p>
                    <p className="mt-4 text-xs font-medium text-green-500">+1 so với hôm qua</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-gray-900">Tuyến tạm ngưng</p>
                    <p className="mt-3 text-2xl font-black text-gray-900">{routes.filter(r => r.status === "Tạm ngưng").length} Tuyến</p>
                    <p className="mt-4 text-xs font-medium text-red-500">-1 so với hôm qua</p>
                </div>
            </div>

            {/* TABLE WRAPPER */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">

                {/* FILTER BAR */}
                <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-end sm:gap-6">
                    <div className="flex-1 max-w-md">
                        <label className="block text-sm font-medium text-gray-900 mb-1">Tìm tên tuyến xe</label>
                        <div className="relative">
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm tên tuyến, điểm đi/đến..."
                                className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <SearchIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Removed unused bus type filter */}

                    <div className="w-full sm:w-40">
                        <label className="block text-sm font-medium text-gray-900 mb-1">Trạng thái</label>
                        <select
                            value={activeTab}
                            onChange={(e) => setActiveTab(e.target.value as "Tất cả" | "Hoạt động" | "Tạm ngưng")}
                            className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="Tất cả">Tất cả</option>
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Tạm ngưng">Tạm ngưng</option>
                        </select>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            Đang tải danh sách tuyến...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-600 text-sm">
                            Lỗi: {error}
                        </div>
                    ) : (
                        <table className="w-full text-sm divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Tuyến đường</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Quãng đường</th>
                                    {/* Removed mock columns: Thời gian, Loại xe, Tình trạng (seat) */}
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Trạng thái</th>
                                    <th className="px-6 py-3 text-right font-semibold text-gray-900">Hành động</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {filteredRoutes.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-sm">
                                            Không có tuyến phù hợp
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRoutes.map((route, idx) => (
                                        <tr
                                            key={route.id ?? idx}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                                        <MapPin size={16} className="text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {route.start} → {route.stop}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            Mã tuyến: {route.code?.substring(0, 8).toUpperCase() ?? `RT-${100 + idx}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">
                                                {route.distance_km} km
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${route.status === "Hoạt động" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                    {route.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleEdit(route)}
                                                    className="text-gray-400 hover:text-orange-500 transition-colors p-1"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={16} />
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
                <div className="border-t border-gray-200 px-6 py-3 text-xs text-gray-500 flex items-center justify-between">
                    <div>
                        Hiển thị 1–{Math.min(10, filteredRoutes.length)} của{" "}
                        {filteredRoutes.length} tuyến
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="rounded p-1 hover:bg-gray-100 disabled:opacity-50" disabled>
                            <ChevronLeft size={16} />
                        </button>
                        <span className="rounded bg-orange-500 px-2 py-1 text-white font-medium">1</span>
                        <button className="rounded p-1 hover:bg-gray-100 disabled:opacity-50" disabled>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && selectedRoute && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                Chỉnh sửa tuyến:{" "}
                                <span className="text-orange-500">
                                    {selectedRoute.start} → {selectedRoute.stop}
                                </span>
                            </h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Đi - Đến
                                </label>
                                <input
                                    value={`${selectedRoute.start} → ${selectedRoute.stop}`}
                                    disabled
                                    className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Tạm ngưng">Tạm ngưng</option>
                                </select>
                            </div>

                            {updateError && (
                                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                    {updateError}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                            <button
                                onClick={closeModal}
                                disabled={updating}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="rounded-md bg-orange-500 px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                            >
                                {updating ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRoute;