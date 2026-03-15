import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Loader2, AlertCircle, ArrowLeft, Users, Bus, MapPin, Clock,
    CheckCircle2, XCircle, UserCheck, UserX, ChevronRight, X,
    Navigation, Phone, Mail, CreditCard, Armchair, LogOut,
} from "lucide-react";

/* ═══════════════ TYPES ═══════════════════════════════════════════════════════ */
interface StartEndInfo { city: string; specific_location: string; }
interface Driver {
    name: string; phone: string; status: string;
    shiftStart: string | null; shiftEnd: string | null;
    actualShiftStart: string | null; actualShiftEnd: string | null;
}
interface TripDetail {
    _id: string; departureTime: string; arrivalTime: string; date: string;
    departureLocation: string; departureProvince: string;
    arrivalLocation: string; arrivalProvince: string;
    duration: string; distance: number | null;
    vehicleType: string; licensePlate: string;
    totalSeats: number; totalSeatsBooked: number; totalPassengers: number;
    status: string; drivers: Driver[];
}
interface Passenger {
    _id: string;
    passenger_name: string;
    passenger_phone: string;
    passenger_email: string | null;
    seat_labels: string[];
    total_price: number;
    order_status: "CREATED" | "PAID" | "CANCELLED";
    is_boarded: boolean;
    boarded_at: string | null;
    is_alighted: boolean;
    alighted_at: string | null;
    start_info: StartEndInfo;
    end_info: StartEndInfo;
    boarded_updated: boolean; // FE-only flag
    created_at: string;
}

/* ═══════════════ CONFIG ══════════════════════════════════════════════════════ */
const TRIP_STATUS: Record<string, { label: string; color: string }> = {
    SCHEDULED: { label: "Sắp khởi hành", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    RUNNING: { label: "Đang chạy", color: "bg-blue-100 text-blue-700 border-blue-200" },
    FINISHED: { label: "Hoàn thành", color: "bg-green-100 text-green-700 border-green-200" },
    CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-600 border-red-200" },
};
const ORDER_STATUS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    CREATED: { label: "Chờ TT", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={11} /> },
    PAID: { label: "Đã TT", color: "bg-green-100 text-green-700", icon: <CheckCircle2 size={11} /> },
    CANCELLED: { label: "Đã huỷ", color: "bg-slate-100 text-slate-500", icon: <XCircle size={11} /> },
};
const DRIVER_STATUS: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Chờ", color: "bg-yellow-100 text-yellow-700" },
    RUNNING: { label: "Đang lái", color: "bg-blue-100 text-blue-700" },
    DONE: { label: "Xong", color: "bg-green-100 text-green-700" },
};

/* ═══════════════ PASSENGER DETAIL MODAL ═════════════════════════════════════
   Khai báo NGOÀI component chính để tránh lỗi "Cannot create components during render"
═══════════════════════════════════════════════════════════════════════════════ */
interface PassengerDetailModalProps {
    passenger: Passenger;
    onClose: () => void;
}

function PassengerDetailModal({ passenger, onClose }: PassengerDetailModalProps) {
    const stCfg = ORDER_STATUS[passenger.order_status] ?? ORDER_STATUS.CREATED;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
                    <div>
                        <p className="text-white font-black text-lg">{passenger.passenger_name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                                {stCfg.icon} {stCfg.label}
                            </span>
                            {passenger.is_boarded && !passenger.is_alighted && (
                                <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-green-400/30 text-white">
                                    <UserCheck size={11} /> Đã lên xe
                                </span>
                            )}
                            {passenger.is_alighted && (
                                <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-400/30 text-white">
                                    <LogOut size={11} /> Đã xuống xe
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                    >
                        <X size={18} className="text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-3 max-h-[65vh] overflow-y-auto">

                    {/* Ghế */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {passenger.seat_labels.map((s) => (
                            <span key={s} className="flex items-center gap-1 bg-orange-500 text-white text-sm font-black px-3 py-1.5 rounded-xl">
                                <Armchair size={13} /> {s}
                            </span>
                        ))}
                    </div>

                    {/* Thông tin cá nhân */}
                    <div className="flex items-start gap-3 py-3 border-b border-slate-100">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                            <Phone size={15} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Số điện thoại</p>
                            <p className="text-sm font-semibold text-slate-800">{passenger.passenger_phone || "—"}</p>
                        </div>
                    </div>

                    {passenger.passenger_email && (
                        <div className="flex items-start gap-3 py-3 border-b border-slate-100">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                <Mail size={15} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                                <p className="text-sm font-semibold text-slate-800">{passenger.passenger_email}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3 py-3 border-b border-slate-100">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                            <CreditCard size={15} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tổng tiền</p>
                            <p className="text-sm font-semibold text-slate-800">{passenger.total_price.toLocaleString("vi-VN")} ₫</p>
                        </div>
                    </div>

                    {/* Điểm đón */}
                    <div className="rounded-2xl overflow-hidden border-2 border-green-200">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border-b border-green-200">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">A</div>
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Điểm đón</span>
                        </div>
                        <div className="px-4 py-3 bg-white space-y-1">
                            {passenger.start_info?.city ? (
                                <>
                                    <p className="text-sm font-bold text-green-900 flex items-center gap-1.5">
                                        <MapPin size={13} className="text-green-500 flex-shrink-0" />
                                        {passenger.start_info.city}
                                    </p>
                                    {passenger.start_info.specific_location && (
                                        <p className="text-xs text-green-600 ml-5">{passenger.start_info.specific_location}</p>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-slate-400 italic">Chưa có thông tin</p>
                            )}
                        </div>
                    </div>

                    {/* Điểm trả */}
                    <div className="rounded-2xl overflow-hidden border-2 border-orange-200">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 border-b border-orange-200">
                            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">B</div>
                            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Điểm trả</span>
                        </div>
                        <div className="px-4 py-3 bg-white space-y-1">
                            {passenger.end_info?.city ? (
                                <>
                                    <p className="text-sm font-bold text-orange-900 flex items-center gap-1.5">
                                        <Navigation size={13} className="text-orange-500 flex-shrink-0" />
                                        {passenger.end_info.city}
                                    </p>
                                    {passenger.end_info.specific_location && (
                                        <p className="text-xs text-orange-600 ml-5">{passenger.end_info.specific_location}</p>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-slate-400 italic">Chưa có thông tin</p>
                            )}
                        </div>
                    </div>

                    {/* Timeline lên / xuống xe */}
                    {passenger.boarded_at && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl border border-green-200">
                            <UserCheck size={13} className="text-green-500" />
                            <span className="text-xs text-green-700 font-semibold">
                                Lên xe lúc: {new Date(passenger.boarded_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    )}
                    {passenger.alighted_at && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-200">
                            <LogOut size={13} className="text-blue-500" />
                            <span className="text-xs text-blue-700 font-semibold">
                                Xuống xe lúc: {new Date(passenger.alighted_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════ MAIN COMPONENT ══════════════════════════════════════════════ */
export function ChiTietChuyenDi() {
    const location = useLocation();
    const navigate = useNavigate();
    const tripId = (location.state as any)?.tripId;

    const [trip, setTrip] = useState<TripDetail | null>(null);
    const [passengers, setPassengers] = useState<Passenger[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [detailPassenger, setDetailPassenger] = useState<Passenger | null>(null);

    const token = localStorage.getItem("accessToken");

    /* ── Fetch ──────────────────────────────────────────────────────────────── */
    useEffect(() => {
        if (!tripId) { setError("Không tìm thấy ID chuyến"); setLoading(false); return; }
        const fetchDetail = async () => {
            setLoading(true); setError(null);
            try {
                const res = await fetch(`http://localhost:3000/api/assistant/check/trips/${tripId}`,
                    { headers: { Authorization: `Bearer ${token}` } });
                const json = await res.json();
                if (!res.ok || !json.success) throw new Error(json.message || "Lỗi tải dữ liệu");
                setTrip(json.data.trip);
                const ps = (json.data.passengers || []).map((p: any) => ({
                    ...p,
                    is_alighted: p.is_alighted ?? false,
                    alighted_at: p.alighted_at ?? null,
                    boarded_updated: p.is_boarded === true,
                }));
                setPassengers(ps);
            } catch (e: any) {
                setError(e.message || "Lỗi kết nối");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [tripId]);

    /* ── Helper: gọi API patch + cập nhật local state ──────────────────────── */
    const patchBoarded = async (
        passengerId: string,
        body: object,
        loadingKey: string,
        localPatch: Partial<Passenger>
    ) => {
        if (updatingId) return;
        setUpdatingId(passengerId + loadingKey);
        try {
            const res = await fetch(
                `http://localhost:3000/api/assistant/check/bookings/${passengerId}/boarded`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify(body),
                }
            );
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || "Cập nhật thất bại");

            setPassengers((prev) =>
                prev.map((p) => p._id === passengerId ? { ...p, ...localPatch } : p)
            );
            setDetailPassenger((prev) =>
                prev?._id === passengerId ? { ...prev, ...localPatch } : prev
            );
        } catch (e: any) {
            alert(e.message);
        } finally {
            setUpdatingId(null);
        }
    };

    /* ── Đã lên xe ──────────────────────────────────────────────────────────── */
    const handleBoarded = (p: Passenger) => patchBoarded(
        p._id, { is_boarded: true }, "_on",
        { is_boarded: true, boarded_updated: true, boarded_at: new Date().toISOString(), is_alighted: false, alighted_at: null }
    );

    /* ── Vắng mặt ───────────────────────────────────────────────────────────── */
    const handleAbsent = (p: Passenger) => patchBoarded(
        p._id, { is_boarded: false }, "_off",
        { is_boarded: false, boarded_updated: true, boarded_at: null, is_alighted: false, alighted_at: null }
    );

    /* ── Xuống xe ───────────────────────────────────────────────────────────── */
    const handleAlight = (p: Passenger) => patchBoarded(
        p._id, { is_boarded: true, is_alighted: true }, "_alight",
        {
            is_boarded: true,
            boarded_updated: true,
            is_alighted: true,
            alighted_at: new Date().toISOString(),
        }
    );

    /* ── Hoàn tác vắng mặt ──────────────────────────────────────────────────── */
    const handleUndoAbsent = (p: Passenger) => patchBoarded(
        p._id, { is_boarded: true }, "_on",
        { is_boarded: true, boarded_updated: true, boarded_at: new Date().toISOString(), is_alighted: false, alighted_at: null }
    );

    /* ── Derived ────────────────────────────────────────────────────────────── */
    const boardedCount = passengers.filter((p) => p.is_boarded).length;
    const notBoardedCount = passengers.filter((p) => !p.is_boarded && p.order_status !== "CANCELLED").length;
    const filtered = passengers.filter((p) =>
        p.passenger_name.toLowerCase().includes(search.toLowerCase()) ||
        p.passenger_phone.includes(search) ||
        p.seat_labels.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    );

    /* ── Loading / Error ────────────────────────────────────────────────────── */
    if (loading) return (
        <div className="flex items-center justify-center py-24 gap-3">
            <Loader2 size={30} className="animate-spin text-orange-500" />
            <span className="text-gray-400 font-medium">Đang tải chi tiết...</span>
        </div>
    );
    if (error || !trip) return (
        <div className="flex flex-col items-center py-20 gap-3 text-center">
            <AlertCircle size={36} className="text-red-300" />
            <p className="text-gray-500 font-semibold">{error || "Không tìm thấy chuyến"}</p>
            <button onClick={() => navigate(-1)} className="px-5 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600">
                Quay lại
            </button>
        </div>
    );

    const tripStCfg = TRIP_STATUS[trip.status] ?? TRIP_STATUS.SCHEDULED;
    const canUpdate = ["SCHEDULED", "RUNNING"].includes(trip.status);

    return (
        <div className="space-y-6">

            {/* Modal chi tiết hành khách */}
            {detailPassenger && (
                <PassengerDetailModal
                    passenger={detailPassenger}
                    onClose={() => setDetailPassenger(null)}
                />
            )}

            {/* Back */}
            <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-600 transition-colors">
                <ArrowLeft size={16} /> Quay lại danh sách
            </button>

            {/* ── Trip info card ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <h2 className="text-xl font-extrabold text-gray-800">Chi tiết chuyến</h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tripStCfg.color}`}>
                        {tripStCfg.label}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="text-center min-w-[90px]">
                        <p className="text-3xl font-black text-gray-900">{trip.departureTime}</p>
                        <p className="text-sm font-semibold text-gray-700 mt-0.5">{trip.departureLocation}</p>
                        <p className="text-xs text-gray-400">{trip.departureProvince}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-4 min-w-[100px]">
                        <div className="flex items-center w-full gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                            <div className="flex-1 h-px bg-gradient-to-r from-green-400 to-orange-400" />
                            <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <span className="font-semibold text-gray-600">{trip.duration}</span>
                            {trip.distance && <><span>·</span><span>{trip.distance} km</span></>}
                        </div>
                    </div>
                    <div className="text-center min-w-[90px]">
                        <p className="text-3xl font-black text-gray-900">{trip.arrivalTime}</p>
                        <p className="text-sm font-semibold text-gray-700 mt-0.5">{trip.arrivalLocation}</p>
                        <p className="text-xs text-gray-400">{trip.arrivalProvince}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { icon: <Clock size={14} />, label: "Ngày", value: trip.date },
                        { icon: <Bus size={14} />, label: "Loại xe", value: trip.vehicleType },
                        { icon: <MapPin size={14} />, label: "Biển số", value: trip.licensePlate },
                        { icon: <Users size={14} />, label: "Ghế đã đặt", value: `${trip.totalSeatsBooked} / ${trip.totalSeats}` },
                    ].map(({ icon, label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-2xl p-3">
                            <div className="flex items-center gap-1.5 text-gray-400 mb-1">{icon}<span className="text-xs">{label}</span></div>
                            <p className="font-bold text-gray-800 text-sm">{value}</p>
                        </div>
                    ))}
                </div>

                {trip.drivers.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-400 uppercase">Lái xe</p>
                        <div className="flex flex-wrap gap-2">
                            {trip.drivers.map((d, i) => {
                                const dCfg = DRIVER_STATUS[d.status] ?? DRIVER_STATUS.PENDING;
                                return (
                                    <div key={i} className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
                                        <span className="text-sm font-bold text-gray-800">🚗 {d.name}</span>
                                        {d.phone && <span className="text-xs text-gray-400">{d.phone}</span>}
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${dCfg.color}`}>{dCfg.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Passenger list ─────────────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Users size={18} className="text-orange-500" />
                        <h3 className="text-lg font-extrabold text-gray-800">Danh sách hành khách</h3>
                        <span className="bg-orange-100 text-orange-700 text-xs font-black px-2 py-0.5 rounded-full">
                            {passengers.length} người
                        </span>
                    </div>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm tên, SĐT, số ghế..."
                        className="px-4 py-2 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-orange-400 w-52"
                    />
                </div>

                {/* Progress bar */}
                {passengers.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm font-bold text-green-700">Đã lên xe: {boardedCount}</span>
                        </div>
                        <div className="w-px h-4 bg-gray-300" />
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-300" />
                            <span className="text-sm font-bold text-gray-500">Chưa lên: {notBoardedCount}</span>
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-[80px]">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                                style={{ width: `${Math.round((boardedCount / passengers.length) * 100)}%` }}
                            />
                        </div>
                        <span className="text-xs font-black text-gray-500">
                            {Math.round((boardedCount / passengers.length) * 100)}%
                        </span>
                    </div>
                )}

                {filtered.length === 0 && (
                    <div className="py-12 text-center text-gray-400 font-semibold">
                        {passengers.length === 0 ? "Chưa có hành khách đặt vé" : "Không tìm thấy hành khách"}
                    </div>
                )}

                <div className="space-y-2">
                    {filtered.map((p, idx) => {
                        const stCfg = ORDER_STATUS[p.order_status] ?? ORDER_STATUS.CREATED;
                        const isCancelled = p.order_status === "CANCELLED";

                        const isUpdatingOn = updatingId === p._id + "_on";
                        const isUpdatingOff = updatingId === p._id + "_off";
                        const isUpdatingAlight = updatingId === p._id + "_alight";
                        const isUpdatingAny = isUpdatingOn || isUpdatingOff || isUpdatingAlight;

                        // Logic hiển thị nút:
                        // Chưa bấm gì           → [Đã lên xe] [Vắng mặt]
                        // Đã lên, chưa xuống    → badge lên xe + [Xuống xe]
                        // Đã lên, đã xuống      → badge lên + badge xuống (không còn nút)
                        // Vắng mặt              → badge vắng + [Hoàn tác]
                        const showInitButtons = canUpdate && !isCancelled && !p.boarded_updated;
                        const showOnBoard = canUpdate && !isCancelled && p.is_boarded && !p.is_alighted;
                        const showAlighted = !isCancelled && p.is_boarded && p.is_alighted;
                        const showUndoButton = canUpdate && !isCancelled && p.boarded_updated && !p.is_boarded && !p.is_alighted;
                        const hasActions = showInitButtons || showOnBoard || showAlighted || showUndoButton;

                        return (
                            <div
                                key={p._id}
                                className={`rounded-2xl transition-all border ${p.is_alighted
                                        ? "bg-blue-50 border-blue-200"
                                        : p.is_boarded
                                            ? "bg-green-50 border-green-200"
                                            : p.boarded_updated && !p.is_boarded
                                                ? "bg-red-50/60 border-red-100"
                                                : isCancelled
                                                    ? "bg-gray-50 opacity-50 border-gray-100"
                                                    : "bg-gray-50 hover:bg-orange-50/40 border-transparent"
                                    }`}
                            >
                                {/* ── Row chính ── */}
                                <div className="flex items-center gap-3 p-4 flex-wrap">

                                    {/* Index / icon */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${p.is_alighted ? "bg-blue-200 text-blue-700" :
                                            p.is_boarded ? "bg-green-200 text-green-700" :
                                                p.boarded_updated && !p.is_boarded ? "bg-red-100 text-red-500" :
                                                    "bg-orange-100 text-orange-600"
                                        }`}>
                                        {p.is_alighted
                                            ? <LogOut size={15} />
                                            : p.is_boarded
                                                ? <UserCheck size={15} />
                                                : p.boarded_updated
                                                    ? <UserX size={15} />
                                                    : idx + 1
                                        }
                                    </div>

                                    {/* Name + phone */}
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-gray-800 truncate">{p.passenger_name}</p>
                                        <p className="text-xs text-gray-400">{p.passenger_phone}</p>
                                    </div>

                                    {/* Seats */}
                                    <div className="flex items-center gap-1 flex-wrap">
                                        {p.seat_labels.map((s) => (
                                            <span key={s} className={`text-[11px] font-black px-2 py-0.5 rounded-md ${p.is_alighted ? "bg-blue-500 text-white" :
                                                    p.is_boarded ? "bg-green-500 text-white" :
                                                        p.boarded_updated && !p.is_boarded ? "bg-red-400 text-white" :
                                                            "bg-orange-500 text-white"
                                                }`}>{s}</span>
                                        ))}
                                    </div>

                                    {/* Price */}
                                    <p className="font-black text-orange-600 text-sm whitespace-nowrap">
                                        {p.total_price.toLocaleString("vi-VN")}₫
                                    </p>

                                    {/* Order status badge */}
                                    <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${stCfg.color}`}>
                                        {stCfg.icon} {stCfg.label}
                                    </span>

                                    {/* Nút chi tiết */}
                                    <button
                                        onClick={() => setDetailPassenger(p)}
                                        className="flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1.5 rounded-xl hover:bg-orange-100 transition-all active:scale-95"
                                    >
                                        Chi tiết <ChevronRight size={12} />
                                    </button>
                                </div>

                                {/* ── Action row ── */}
                                {hasActions && (
                                    <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">

                                        {/* Chưa bấm → 2 nút */}
                                        {showInitButtons && (
                                            <>
                                                <button
                                                    onClick={() => handleBoarded(p)}
                                                    disabled={isUpdatingAny}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 border-green-400 bg-white text-green-600 hover:bg-green-500 hover:text-white transition-all disabled:opacity-60"
                                                >
                                                    {isUpdatingOn ? <Loader2 size={13} className="animate-spin" /> : <UserCheck size={13} />}
                                                    Đã lên xe
                                                </button>
                                                <button
                                                    onClick={() => handleAbsent(p)}
                                                    disabled={isUpdatingAny}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 border-red-300 bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-60"
                                                >
                                                    {isUpdatingOff ? <Loader2 size={13} className="animate-spin" /> : <UserX size={13} />}
                                                    Vắng mặt
                                                </button>
                                            </>
                                        )}

                                        {/* Đã lên, chưa xuống → badge + nút Xuống xe */}
                                        {showOnBoard && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                                                    <UserCheck size={11} /> Đã lên xe
                                                    {p.boarded_at && (
                                                        <span className="text-green-500 ml-1">
                                                            · {new Date(p.boarded_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() => handleAlight(p)}
                                                    disabled={isUpdatingAny}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 border-slate-300 bg-white text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all disabled:opacity-60"
                                                >
                                                    {isUpdatingAlight ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
                                                    Xuống xe
                                                </button>
                                            </div>
                                        )}

                                        {/* Đã lên + đã xuống → 2 badge */}
                                        {showAlighted && (
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                                                    <UserCheck size={11} /> Lên
                                                    {p.boarded_at && (
                                                        <span className="ml-1 text-green-500">
                                                            · {new Date(p.boarded_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-gray-300">→</span>
                                                <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                                                    <LogOut size={11} /> Xuống
                                                    {p.alighted_at && (
                                                        <span className="ml-1 text-blue-500">
                                                            · {new Date(p.alighted_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        {/* Vắng mặt → badge + nút Hoàn tác */}
                                        {showUndoButton && (
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">
                                                    <UserX size={11} /> Vắng mặt
                                                </span>
                                                <button
                                                    onClick={() => handleUndoAbsent(p)}
                                                    disabled={isUpdatingAny}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 border-slate-300 bg-white text-slate-600 hover:bg-green-50 hover:border-green-400 hover:text-green-600 transition-all disabled:opacity-60"
                                                >
                                                    {isUpdatingOn ? <Loader2 size={13} className="animate-spin" /> : <UserCheck size={13} />}
                                                    Hoàn tác
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Summary */}
                {passengers.length > 0 && (
                    <div className="pt-3 border-t flex items-center justify-between text-sm flex-wrap gap-2">
                        <span className="text-gray-400">
                            Tổng: <span className="font-bold text-gray-700">{passengers.length} hành khách</span>
                            &nbsp;·&nbsp;<span className="font-bold text-green-600">{boardedCount} đã lên xe</span>
                            &nbsp;·&nbsp;<span className="font-bold text-red-500">{notBoardedCount} vắng</span>
                        </span>
                        <span className="font-black text-orange-600">
                            {passengers
                                .filter((p) => p.order_status !== "CANCELLED")
                                .reduce((s, p) => s + p.total_price, 0)
                                .toLocaleString("vi-VN")}₫
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}