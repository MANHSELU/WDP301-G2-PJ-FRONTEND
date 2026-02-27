import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Edit,
    X,
    Save,
    Loader2,
    Search as SearchIcon,
    Plus,
} from "lucide-react";

type BusTypeModel = {
    _id?: string;
    name?: string;
    category?: string;
    description?: string;
    isActive?: boolean;
};

type SeatColumn = {
    name: "LEFT" | "MIDDLE" | "RIGHT";
    seats_per_row: number;
};

type SeatLayout = {
    template_name?: string;
    floors?: number;
    rows?: number;
    columns?: SeatColumn[];
    row_overrides?: unknown[];
    total_seats?: number;
};

type BusModel = {
    _id?: string;
    id?: string;
    license_plate?: string;
    bus_type_id?: BusTypeModel | string;
    seat_layout?: SeatLayout;
    total_seats?: number;
    seats?: number;
    status?: string;
    created_at?: string;
    [k: string]: unknown;
};

type ApiResponse<T = unknown> = {
    success?: boolean;
    message?: string;
    data?: T;
};

type BusRow = {
    id?: string;
    plate: string;
    type: string;
    typeId?: string;
    seats: number;
    status: "Sẵn sàng" | "Bảo trì";
    raw?: BusModel;
};

type FormDataType = {
    typeId: string;
    typeName: string;
    seats: number;
    status: "Sẵn sàng" | "Bảo trì" | "";
};

const mapStatusToVn = (s?: string): "Sẵn sàng" | "Bảo trì" => {
    if (!s) return "Sẵn sàng";
    const up = String(s).toUpperCase();
    return up === "MAINTENANCE" ? "Bảo trì" : "Sẵn sàng";
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

const isBusModel = (v: unknown): v is BusModel => {
    if (!isRecord(v)) return false;
    const r = v as Record<string, unknown>;
    return (
        typeof r.license_plate === "string" ||
        typeof r._id === "string" ||
        isRecord(r.seat_layout)
    );
};

const extractMessage = (payload: unknown): string | undefined => {
    if (!isRecord(payload)) return undefined;
    if (typeof payload.message === "string") return payload.message;
    if (isRecord(payload.data) && typeof payload.data.message === "string")
        return payload.data.message;
    return undefined;
};

const extractBusArray = (payload: unknown): BusModel[] => {
    if (Array.isArray(payload) && payload.every(isBusModel))
        return payload as BusModel[];

    if (!isRecord(payload)) return [];

    if (
        Array.isArray(payload.data) &&
        (payload.data as unknown[]).every(isBusModel)
    ) {
        return payload.data as BusModel[];
    }

    if (isRecord(payload.data)) {
        const nested = (payload.data as Record<string, unknown>).buses;
        if (Array.isArray(nested) && nested.every(isBusModel))
            return nested as BusModel[];
    }

    const direct = (payload as Record<string, unknown>).buses;
    if (Array.isArray(direct) && direct.every(isBusModel))
        return direct as BusModel[];

    return [];
};

const ManageBus: React.FC = () => {
    const [buses, setBuses] = useState<BusRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<"Tất cả" | "Sẵn sàng" | "Bảo trì">(
        "Tất cả"
    );

    const [searchQuery, setSearchQuery] = useState<string>("");

    // Modal state
    const [selectedBus, setSelectedBus] = useState<BusRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormDataType>({
        typeId: "",
        typeName: "",
        seats: 0,
        status: "",
    });
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const [busTypes, setBusTypes] = useState<{ id: string; name: string }[]>([]);

    // profile dropdown state & ref
    const profileRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!profileRef.current) return;
            if (!(e.target instanceof Node)) return;
        };
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    const getStatusStyle = (status: "Sẵn sàng" | "Bảo trì") =>
        status === "Sẵn sàng"
            ? "bg-green-50 text-green-700 ring-1 ring-green-100"
            : "bg-red-50 text-red-700 ring-1 ring-red-100";

    const buildSeatLayoutFromSeats = (seats: number): SeatLayout => {
        const seatsPerRowTotal = 4;
        const rows = Math.max(1, Math.ceil(seats / seatsPerRowTotal));
        const left = Math.floor(seatsPerRowTotal / 2);
        const right = seatsPerRowTotal - left;
        const columns: SeatColumn[] = [
            { name: "LEFT", seats_per_row: left },
            { name: "RIGHT", seats_per_row: right },
        ];
        return {
            template_name: "manual",
            floors: 1,
            rows,
            columns,
            row_overrides: [],
            total_seats: seats,
        };
    };

    const fetchBuses = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("accessToken") ?? "";
            const url =
                "http://localhost:3000/api/admin/check/buses?page=1&limit=200";
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const parsed = await res.json().catch(() => ({} as ApiResponse<unknown>));

            if (!res.ok) {
                const msg = extractMessage(parsed) ?? "Không thể lấy danh sách xe";
                throw new Error(msg);
            }

            const rawList = extractBusArray(parsed);

            const normalized: BusRow[] = rawList.map((b) => {
                const typeObj = b.bus_type_id;
                const typeName =
                    typeof typeObj === "object" && typeObj !== null
                        ? (typeObj as BusTypeModel).name ?? "N/A"
                        : typeof typeObj === "string"
                            ? typeObj
                            : "N/A";

                const typeId =
                    typeof typeObj === "object" && typeObj !== null
                        ? (typeObj as BusTypeModel)._id
                        : typeof typeObj === "string"
                            ? typeObj
                            : undefined;

                const seats =
                    Number(
                        b?.seat_layout?.total_seats ?? b?.total_seats ?? b?.seats ?? 0
                    ) || 0;

                return {
                    id: b._id ?? b.id,
                    plate: b.license_plate ?? "N/A",
                    type: typeName,
                    typeId,
                    seats,
                    status: mapStatusToVn(b.status),
                    raw: b,
                };
            });

            setBuses(normalized);

            const typeMap = new Map<string, string>();
            rawList.forEach((b) => {
                const bt = b.bus_type_id;
                if (typeof bt === "object" && bt !== null) {
                    const t = bt as BusTypeModel;
                    if (t._id && t.name) typeMap.set(String(t._id), t.name);
                }
            });
            setBusTypes(
                Array.from(typeMap.entries()).map(([id, name]) => ({ id, name }))
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi không xác định");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuses();
    }, []);

    const filteredBuses = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return buses.filter((bus) => {
            if (activeTab !== "Tất cả" && bus.status !== activeTab) return false;
            if (!q) return true;
            return (
                `${bus.plate} ${bus.type} ${bus.seats}`.toLowerCase().indexOf(q) !== -1
            );
        });
    }, [buses, activeTab, searchQuery]);

    const handleAddNew = () => {
        window.location.href = "/admin/buses/new";
    };

    const handleEdit = (bus: BusRow): void => {
        setSelectedBus(bus);
        setFormData({
            typeId: bus.typeId ?? "",
            typeName: bus.type,
            seats: bus.seats,
            status: bus.status === "Bảo trì" ? "Bảo trì" : "Sẵn sàng",
        });
        setUpdateError(null);
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
        setSelectedBus(null);
        setUpdateError(null);
    };

    const handleUpdate = async (): Promise<void> => {
        if (!selectedBus?.id) return;
        setUpdating(true);
        setUpdateError(null);

        try {
            const token = localStorage.getItem("accessToken") ?? "";
            const body: Partial<{
                status: "ACTIVE" | "MAINTENANCE";
                bus_type_id: string;
                seat_layout: SeatLayout;
            }> = {};

            if (formData.status)
                body.status = formData.status === "Bảo trì" ? "MAINTENANCE" : "ACTIVE";
            if (formData.typeId) body.bus_type_id = formData.typeId;
            if (typeof formData.seats === "number" && formData.seats > 0)
                body.seat_layout = buildSeatLayoutFromSeats(formData.seats);

            const res = await fetch(
                `http://localhost:3000/api/admin/check/buses/${selectedBus.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(body),
                }
            );

            const parsed = await res.json().catch(() => ({} as ApiResponse<unknown>));

            if (!res.ok) {
                const msg = extractMessage(parsed) ?? "Cập nhật thất bại";
                throw new Error(msg);
            }

            await fetchBuses();
            closeModal();
        } catch (err) {
            setUpdateError(err instanceof Error ? err.message : "Lỗi khi cập nhật");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
            <div className="flex items-center justify-between">
                <h2 className="text-[30px] font-black text-[#111827]">
                    Quản lý xe
                </h2>

                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 rounded-[4px] bg-[#eb8a45] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
                >
                    <Plus size={14} />
                    Thêm xe mới
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded border border-[#dde2ea] bg-white p-4">
                    <p className="text-[12px] text-[#6b7280]">Tổng số xe</p>
                    <p className="mt-1 text-[24px] font-black">{buses.length}</p>
                </div>

                <div className="rounded border border-[#dde2ea] bg-white p-4">
                    <p className="text-[12px] text-[#6b7280]">Sẵn sàng</p>
                    <p className="mt-1 text-[24px] font-black">
                        {buses.filter((b) => b.status === "Sẵn sàng").length}
                    </p>
                </div>

                <div className="rounded border border-[#dde2ea] bg-white p-4">
                    <p className="text-[12px] text-[#6b7280]">Bảo trì</p>
                    <p className="mt-1 text-[24px] font-black">
                        {buses.filter((b) => b.status === "Bảo trì").length}
                    </p>
                </div>
            </div>

            {/* TABLE */}
            <div className="rounded border border-[#dde2ea] bg-white">

                {/* FILTER BAR */}
                <div className="flex flex-col gap-4 border-b border-[#dde2ea] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        {(["Tất cả", "Sẵn sàng", "Bảo trì"] as const).map((tab) => (
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
                                placeholder="Tìm biển số, loại xe..."
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
                    <table className="w-full text-[13px]">
                        <thead className="bg-[#f9fafb] text-[#6b7280]">
                            <tr>
                                <th className="px-4 py-2 text-left">Biển số</th>
                                <th className="px-4 py-2 text-left">Loại xe</th>
                                <th className="px-4 py-2 text-center">Số ghế</th>
                                <th className="px-4 py-2 text-center">Trạng thái</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredBuses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-[#9ca3af]">
                                        Không có xe phù hợp
                                    </td>
                                </tr>
                            ) : (
                                filteredBuses.map((bus, index) => (
                                    <tr
                                        key={bus.id ?? index}
                                        className="border-t border-[#dde2ea] hover:bg-[#f9fafb]"
                                    >
                                        <td className="px-4 py-2 font-semibold">{bus.plate}</td>
                                        <td className="px-4 py-2">{bus.type}</td>
                                        <td className="px-4 py-2 text-center">{bus.seats}</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`rounded px-2 py-[2px] text-[11px] font-semibold ${getStatusStyle(bus.status)}`}>
                                                {bus.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => handleEdit(bus)}
                                                className="rounded p-1 hover:bg-[#f3f4f6]"
                                            >
                                                <Edit size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {isModalOpen && selectedBus && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Chỉnh sửa xe:{" "}
                                <span className="font-medium text-orange-600">
                                    {selectedBus.plate}
                                </span>
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Biển số
                                </label>
                                <input
                                    type="text"
                                    value={selectedBus.plate}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Loại xe
                                </label>
                                {busTypes.length > 0 ? (
                                    <select
                                        value={formData.typeId}
                                        onChange={(e) => {
                                            const id = e.target.value;
                                            const name =
                                                busTypes.find((t) => t.id === id)?.name ?? "";
                                            setFormData({ ...formData, typeId: id, typeName: name });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    >
                                        <option value="">
                                            {formData.typeName || `Không đổi (${selectedBus.type})`}
                                        </option>
                                        {busTypes.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={formData.typeName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, typeName: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        placeholder={selectedBus.type}
                                    />
                                )}
                                <div className="text-xs text-gray-500 mt-1">
                                    Chọn loại nếu có để gắn bus_type_id, hoặc để trống để không
                                    đổi.
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số ghế
                                </label>
                                <input
                                    type="number"
                                    value={formData.seats}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            seats: Number(e.target.value) || 0,
                                        })
                                    }
                                    min={1}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    Số ghế sẽ được chuyển thành seat_layout khi cập nhật.
                                </div>
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
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                >
                                    <option value="Sẵn sàng">Sẵn sàng</option>
                                    <option value="Bảo trì">Bảo trì</option>
                                </select>
                            </div>

                            {updateError && (
                                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                                    {updateError}
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                disabled={updating}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg flex items-center gap-2 hover:shadow-lg disabled:opacity-50"
                            >
                                {updating ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} /> Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBus;