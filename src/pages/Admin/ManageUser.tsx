import React, { useEffect, useMemo, useState } from "react";
import { Edit, X, Save, Loader2, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";

const API_BASE = "http://localhost:3000";

type ApiResponse<T = unknown> = {
    success?: boolean;
    message?: string;
    data?: T;
};

type RoleRef = {
    _id?: string;
    name?: string;
    description?: string;
};

type AccountModel = {
    _id?: string;
    name?: string;
    phone?: string;
    email?: string;
    role?: RoleRef | string;
    status?: string;
    createdAt?: string;
    created_at?: string;
    [k: string]: unknown;
};

type UserRow = {
    id?: string;
    name: string;
    contact: string;
    role: string;
    roleKey?: string;
    status?: string;
    created_at?: string;
    raw?: AccountModel;
};

// Màu badge vai trò theo ảnh: Khách hàng #F3E5F5, Lễ Tân #E8F5E9, Tài xế #FFF3E0, Lơ xe #E3F2FD
const getRoleStyle = (role: string) => {
    const lower = (role ?? "").toLowerCase();
    if (lower.includes("customer") || lower.includes("khách")) return "bg-[#F3E5F5] text-violet-800";
    if (lower.includes("tài xế") || lower.includes("driver") || lower.includes("tài"))
        return "bg-[#FFF3E0] text-amber-800";
    if (lower.includes("lễ tân") || lower.includes("lê tân") || lower.includes("reception"))
        return "bg-[#E8F5E9] text-green-800";
    if (lower.includes("phụ xe") || lower.includes("lơ xe") || lower.includes("phụ") || lower.includes("lơ") || lower.includes("assistant"))
        return "bg-[#E3F2FD] text-blue-800";
    return "bg-gray-100 text-gray-700";
};

const getRoleDisplayName = (role: string): string => {
    const lower = (role ?? "").toLowerCase();
    if (lower.includes("customer") || lower.includes("khách")) return "Khách hàng";
    if (lower.includes("reception")) return "Lễ Tân";
    if (lower.includes("driver") && !lower.includes("assistant")) return "Tài xế";
    if (lower.includes("assistant") || lower.includes("lơ xe") || lower.includes("phụ xe")) return "Lơ xe";
    return role || "—";
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

const extractMessage = (payload: unknown): string | undefined => {
    if (!isRecord(payload)) return undefined;
    if (typeof payload.message === "string") return payload.message;
    if (isRecord(payload.data) && typeof payload.data.message === "string")
        return payload.data.message;
    return undefined;
};

const extractAccounts = (payload: unknown): AccountModel[] => {
    if (Array.isArray(payload)) {
        if (payload.every(isRecord)) return payload as AccountModel[];
        return [];
    }
    if (!isRecord(payload)) return [];
    const p = payload as Record<string, unknown>;
    if (isRecord(p.data)) {
        const d = p.data as Record<string, unknown>;
        if (Array.isArray(d.accounts) && d.accounts.every(isRecord))
            return d.accounts as AccountModel[];
        if (Array.isArray(d) && d.every(isRecord)) return d as AccountModel[];
    }
    if (Array.isArray(p.accounts) && p.accounts.every(isRecord))
        return p.accounts as AccountModel[];
    if (Array.isArray(p.data) && p.data.every(isRecord))
        return p.data as AccountModel[];
    return [];
};

type PermissionKey =
    | "view_revenue_report"
    | "manage_staff"
    | "edit_route_schedule"
    | "manage_booking"
    | "cancel_refund";

const DEFAULT_PERMISSIONS: Record<PermissionKey, boolean> = {
    view_revenue_report: true,
    manage_staff: false,
    edit_route_schedule: true,
    manage_booking: true,
    cancel_refund: false,
};

const ManageUser: React.FC = () => {
    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<"list" | "search">("list");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<{ name: string; contact: string; role: string; roleKey: string; status: string }>({
        name: "",
        contact: "",
        role: "",
        roleKey: "",
        status: "active",
    });
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    // Quyền hạn (theo ảnh) - có thể gắn với selectedUser sau khi có API
    const [permissions, setPermissions] = useState<Record<PermissionKey, boolean>>(DEFAULT_PERMISSIONS);

    // Modal Thêm nhân sự mới
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addFormData, setAddFormData] = useState({
        name: "",
        phone: "",
        password: "",
        roleKey: "",
    });
    const [addError, setAddError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("accessToken") ?? "";
            const res = await fetch(
                `${API_BASE}/api/admin/check/accounts?page=1&limit=200`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                }
            );
            const parsed = (await res.json().catch(() => ({} as unknown))) as ApiResponse<unknown>;
            if (!res.ok) {
                const msg = extractMessage(parsed) ?? "Không thể lấy danh sách người dùng";
                throw new Error(msg);
            }
            const rawAccounts = extractAccounts(parsed.data ?? parsed);
            const normalized: UserRow[] = rawAccounts.map((a) => {
                const roleName =
                    typeof a.role === "string"
                        ? a.role
                        : isRecord(a.role)
                            ? (a.role as RoleRef).name ?? "Không xác định"
                            : "Không xác định";
                const contact =
                    typeof a.phone === "string" && a.phone.trim() !== ""
                        ? a.phone
                        : "—";
                const created = (a.created_at as string) ?? (a.createdAt as string) ?? undefined;
                return {
                    id: a._id,
                    name: a.name ?? "N/A",
                    contact,
                    role: getRoleDisplayName(roleName ?? ""),
                    roleKey: (a.role as RoleRef)?.name ?? (typeof a.role === "string" ? a.role : undefined),
                    status: a.status ?? "active",
                    created_at: created,
                    raw: a,
                };
            });
            setUsers(normalized);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi không xác định");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) => {
            const name = u.name?.toLowerCase?.() ?? "";
            const contact = u.contact?.toLowerCase?.() ?? "";
            const role = u.role?.toLowerCase?.() ?? "";
            return name.includes(q) || contact.includes(q) || role.includes(q);
        });
    }, [users, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);

    const ROLE_OPTIONS = [
        { value: "CUSTOMER", label: "Khách hàng" },
        { value: "RECEPTIONIST", label: "Lễ Tân" },
        { value: "DRIVER", label: "Tài xế" },
        { value: "BUS_ASSISTANT", label: "Lơ xe" },
    ];

    const STATUS_OPTIONS = [
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Tạm khóa" },
        { value: "banned", label: "Chặn" },
    ];

    const handleEdit = (user: UserRow) => {
        setSelectedUser(user);
        const currentStatus = (user.raw?.status as string) || "active";
        setFormData({
            name: user.name,
            contact: user.contact,
            role: user.role,
            roleKey: user.roleKey ?? "",
            status: currentStatus === "inactive" || currentStatus === "banned" ? currentStatus : "active",
        });
        setUpdateError(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setUpdateError(null);
    };

    const handleUpdate = async () => {
        if (!selectedUser?.id) return;
        setUpdating(true);
        setUpdateError(null);
        try {
            const token = localStorage.getItem("accessToken") ?? "";
            const payload: { name?: string; phone?: string; email?: string; role?: string; status?: string } = {};
            if (formData.name?.trim()) payload.name = formData.name.trim();
            if (formData.contact?.trim()) {
                payload.phone = formData.contact.trim();
            }
            if (formData.roleKey?.trim()) payload.role = formData.roleKey.trim();
            else if (formData.role?.trim()) payload.role = formData.role.trim();
            if (formData.status && ["active", "inactive", "banned"].includes(formData.status))
                payload.status = formData.status;

            const res = await fetch(
                `${API_BASE}/api/admin/check/accounts/${selectedUser.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(payload),
                }
            );
            const parsed = (await res.json().catch(() => ({} as unknown))) as ApiResponse<unknown>;
            if (!res.ok) {
                const msg = extractMessage(parsed) ?? "Cập nhật thất bại";
                throw new Error(msg);
            }
            await fetchUsers();
            closeModal();
        } catch (err) {
            setUpdateError(err instanceof Error ? err.message : "Lỗi khi cập nhật");
        } finally {
            setUpdating(false);
        }
    };

    const togglePermission = (key: PermissionKey) => {
        setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const openAddModal = () => {
        setAddFormData({ name: "", phone: "", password: "", roleKey: "" });
        setAddError(null);
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setAddError(null);
    };

    const handleCreateStaff = async () => {
        const { name, phone, password, roleKey } = addFormData;
        if (!name?.trim()) {
            setAddError("Họ tên là bắt buộc");
            return;
        }
        if (!phone?.trim()) {
            setAddError("Số điện thoại là bắt buộc");
            return;
        }
        const phoneDigits = phone.replace(/\D/g, "");
        if (phoneDigits.length < 9 || phoneDigits.length > 11) {
            setAddError("Số điện thoại phải từ 9 đến 11 chữ số");
            return;
        }
        if (!password || password.length < 6) {
            setAddError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }
        if (!roleKey) {
            setAddError("Vui lòng chọn vai trò");
            return;
        }
        setCreating(true);
        setAddError(null);
        try {
            const token = localStorage.getItem("accessToken") ?? "";
            const res = await fetch(`${API_BASE}/api/admin/check/accounts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phoneDigits,
                    password,
                    role: roleKey,
                }),
            });
            const parsed = (await res.json().catch(() => ({} as unknown))) as ApiResponse<unknown>;
            if (!res.ok) {
                const msg = extractMessage(parsed) ?? "Tạo nhân sự thất bại";
                throw new Error(msg);
            }
            await fetchUsers();
            closeAddModal();
        } catch (err) {
            setAddError(err instanceof Error ? err.message : "Lỗi khi tạo nhân sự");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Đầu trang: tiêu đề + mô tả trái, nút Thêm nhân sự phải */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-black">Quản lý phân quyền</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Quản lý danh sách và thiết lập giới hạn quyền truy cập hệ thống
                    </p>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF5722] text-white font-semibold rounded-lg hover:opacity-90 transition shrink-0"
                    onClick={openAddModal}
                >
                    <UserPlus size={18} />
                    Thêm nhân sự mới
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái: Tab + Bảng + Phân trang */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                    {/* Tab: Danh sách nhân sự | Tìm nhân sự */}
                    <div className="border-b border-gray-200 flex">
                        <button
                            type="button"
                            onClick={() => setActiveTab("list")}
                            className={`px-5 py-3 text-sm font-medium transition ${activeTab === "list"
                                    ? "text-black border-b-2 border-[#FF5722]"
                                    : "text-gray-500 border-b-2 border-transparent"
                                }`}
                        >
                            Danh sách nhân sự
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("search")}
                            className={`px-5 py-3 text-sm font-medium transition ${activeTab === "search"
                                    ? "text-black border-b-2 border-[#FF5722]"
                                    : "text-gray-500 border-b-2 border-transparent"
                                }`}
                        >
                            Tìm nhân sự
                        </button>
                    </div>

                    {activeTab === "search" && (
                        <div className="px-6 py-4 border-b border-gray-100">
                            <input
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Tìm theo tên, email, vai trò..."
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300"
                            />
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-600">
                                Đang tải danh sách nhân sự...
                            </div>
                        ) : error ? (
                            <div className="p-8 text-center text-red-600">Lỗi: {error}</div>
                        ) : (
                            <>
                                <table className="w-full text-sm border-collapse">
                                    <thead className="bg-[#F5F5F5]">
                                        <tr className="text-left text-black font-semibold">
                                            <th className="px-6 py-3">Tên</th>
                                            <th className="px-6 py-3">Số điện thoại</th>
                                            <th className="px-6 py-3">Vai Trò</th>
                                            <th className="px-6 py-3">Trạng thái</th>
                                            <th className="px-6 py-3 text-right w-14"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {paginatedUsers.map((u, idx) => (
                                            <tr
                                                key={u.id ?? idx}
                                                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50"
                                            >
                                                <td className="px-6 py-4 text-black">{u.name}</td>
                                                <td className="px-6 py-4 text-gray-700">{u.contact}</td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleStyle(u.roleKey ?? (u.raw?.role as RoleRef)?.name ?? u.role)}`}
                                                    >
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${u.status === "active"
                                                                ? "bg-green-100 text-green-800 border border-green-200"
                                                                : u.status === "inactive"
                                                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                                    : "bg-red-100 text-red-800 border border-red-200"
                                                            }`}
                                                    >
                                                        {u.status === "active" ? "Hoạt động" : u.status === "inactive" ? "Tạm khóa" : "Chặn"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleEdit(u)}
                                                        className="inline-flex items-center justify-center p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                                                        aria-label="Chỉnh sửa"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage <= 1}
                                        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                                        aria-label="Trang trước"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    {[1, 2, 3].filter((p) => p <= totalPages).map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setCurrentPage(p)}
                                            className={`min-w-[32px] h-8 rounded-full text-sm font-medium transition ${currentPage === p
                                                    ? "bg-[#FF5722] text-white"
                                                    : "text-gray-700 bg-transparent hover:bg-gray-100"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage >= totalPages}
                                        className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                                        aria-label="Trang sau"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Cột phải: Quản lý quyền hạn */}
                <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden p-5">
                    <h3 className="text-sm font-semibold text-black mb-4">Quản lý quyền hạn</h3>

                    <div className="space-y-5">
                        <div>
                            <p className="text-xs font-medium text-gray-600 mb-3">Hệ thống và báo cáo</p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-800">Xem báo cáo doanh thu</span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={permissions.view_revenue_report}
                                        onClick={() => togglePermission("view_revenue_report")}
                                        className={`relative w-10 h-6 rounded-full transition ${permissions.view_revenue_report ? "bg-[#FF5722]" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition left-1 ${permissions.view_revenue_report ? "translate-x-5" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-800">Quản lý nhân sự</span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={permissions.manage_staff}
                                        onClick={() => togglePermission("manage_staff")}
                                        className={`relative w-10 h-6 rounded-full transition ${permissions.manage_staff ? "bg-[#FF5722]" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition left-1 ${permissions.manage_staff ? "translate-x-5" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-600 mb-3">Vận hành</p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-800">Sửa tuyến xe/Lịch trình</span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={permissions.edit_route_schedule}
                                        onClick={() => togglePermission("edit_route_schedule")}
                                        className={`relative w-10 h-6 rounded-full transition ${permissions.edit_route_schedule ? "bg-[#FF5722]" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition left-1 ${permissions.edit_route_schedule ? "translate-x-5" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-800">Quản lý đặt vé</span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={permissions.manage_booking}
                                        onClick={() => togglePermission("manage_booking")}
                                        className={`relative w-10 h-6 rounded-full transition ${permissions.manage_booking ? "bg-[#FF5722]" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition left-1 ${permissions.manage_booking ? "translate-x-5" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-800">Hủy vé / Hoàn tiền</span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={permissions.cancel_refund}
                                        onClick={() => togglePermission("cancel_refund")}
                                        className={`relative w-10 h-6 rounded-full transition ${permissions.cancel_refund ? "bg-[#FF5722]" : "bg-gray-300"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition left-1 ${permissions.cancel_refund ? "translate-x-5" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Thêm nhân sự mới */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Thêm nhân sự mới</h3>
                            <button onClick={closeAddModal} className="text-gray-500 hover:text-gray-800">
                                <X size={22} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={addFormData.name}
                                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                                    placeholder="Nhập họ tên"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    value={addFormData.phone}
                                    onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                                    placeholder="09xxxxxxxx"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                                <input
                                    type="password"
                                    value={addFormData.password}
                                    onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                                    placeholder="Ít nhất 6 ký tự"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò <span className="text-red-500">*</span></label>
                                <select
                                    value={addFormData.roleKey}
                                    onChange={(e) => setAddFormData({ ...addFormData, roleKey: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                >
                                    <option value="">-- Chọn vai trò --</option>
                                    {ROLE_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {addError && (
                                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{addError}</div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end gap-3">
                            <button
                                onClick={closeAddModal}
                                disabled={creating}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleCreateStaff}
                                disabled={creating}
                                className="px-4 py-2 bg-[#FF5722] text-white rounded-lg flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
                            >
                                {creating ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={16} /> Tạo nhân sự
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chỉnh sửa */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Chỉnh sửa:{" "}
                                <span className="text-[#FF5722] font-medium">{selectedUser.name}</span>
                            </h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vai Trò</label>
                                <select
                                    value={formData.roleKey}
                                    onChange={(e) => {
                                        const opt = ROLE_OPTIONS.find((o) => o.value === e.target.value);
                                        setFormData({
                                            ...formData,
                                            roleKey: e.target.value,
                                            role: opt?.label ?? e.target.value,
                                        });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                >
                                    {ROLE_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                                >
                                    {STATUS_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    Hoạt động: cho phép đăng nhập. Chặn: khóa tài khoản.
                                </p>
                            </div>
                            {updateError && (
                                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{updateError}</div>
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
                                className="px-4 py-2 bg-[#FF5722] text-white rounded-lg flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
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

export default ManageUser;