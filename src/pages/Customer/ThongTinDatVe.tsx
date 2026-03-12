import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Armchair, MapPin, Navigation, Loader2 } from "lucide-react";

/* ================= TYPES ================= */
type SeatStatus = "available" | "selected" | "booked";
type Seat = {
    id: string;
    floor: number;
    row: number;
    col: number;
    status: SeatStatus;
    label: string;
};

type StopPoint = {
    _id: string;
    route_id: string;
    stop_order: number;
    is_pickup: boolean;
    stop_id: {
        _id: string;
        name: string;
        province: string;
        is_active: boolean;
        location: { type: string; coordinates: number[] };
    };
};

type LocationPoint = {
    _id: string;
    stop_id: string;
    location_name: string;
    status: boolean;
    location_type: "PICKUP" | "DROPOFF";
    is_active: boolean;
    location: { type: string; coordinates: number[] };
};

/* ================= HELPERS ================= */

/** Decode JWT payload (không verify — chỉ để lấy user_id) */
function decodeJwt(token: string): Record<string, any> | null {
    try {
        const payload = token.split(".")[1];
        const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

/* ================= COMPONENT ================= */
export default function BusBookingUI() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        selectedSeats = [] as string[],
        selectedSeatLabels = [] as string[],
        trip = null,
        pickupPoint = null as StopPoint | null,
        dropoffPoint = null as StopPoint | null,
        pickupLocationPoint = null as LocationPoint | null,
        dropoffLocationPoint = null as LocationPoint | null,
        ticketPrice = 0,
    } = location.state || {};

    const activeFloor = 1;
    const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", email: "" });
    const [paymentMethod, setPaymentMethod] = useState<"CASH_ON_BOARD" | "ONLINE">("CASH_ON_BOARD");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    // Sau khi đặt xong: lưu order_id và chuyển ghế sang "booked"
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
    const [bookedLabels, setBookedLabels] = useState<string[]>([]);

    // ✅ Dùng cả 2 array — trang trước có thể truyền 1 trong 2
    const seatList: string[] = selectedSeatLabels.length > 0 ? selectedSeatLabels : selectedSeats;
    const selectedCount = seatList.length;
    const totalPrice = selectedCount * ticketPrice;
    const isFormValid =
        customerInfo.name.trim() !== "" &&
        customerInfo.phone.trim() !== "" &&
        selectedCount > 0;

    /* ── Helpers ── */
    const formatTime = (d?: string) => {
        if (!d) return "--:--";
        return new Date(d).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const formatDate = (d?: string) => {
        if (!d) return "--/--/----";
        return new Date(d).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };
    const calcDuration = (s?: string, e?: string) => {
        if (!s || !e) return "--";
        const h = Math.floor(
            (new Date(e).getTime() - new Date(s).getTime()) / 3600000
        );
        return `~${h} giờ`;
    };

    const startLabel = trip?.route_id?.start_id
        ? `${trip.route_id.start_id.province} (${trip.route_id.start_id.name})`
        : "Điểm đi";
    const stopLabel = trip?.route_id?.stop_id
        ? `${trip.route_id.stop_id.province} (${trip.route_id.stop_id.name})`
        : "Điểm đến";
    const routeLabel = `${startLabel} → ${stopLabel}`;

    /* ── Tái tạo sơ đồ ghế ── */
    const generateSeatsFromLayout = (floor: number): Seat[] => {
        if (!trip?.bus_id?.seat_layout) return [];
        const { rows, columns, row_overrides } = trip.bus_id.seat_layout;
        const seats: Seat[] = [];
        let seatCounter = 1;
        for (let row = 1; row <= rows; row++) {
            const override = row_overrides?.find(
                (r: any) => r.row_index === row && r.floor === floor
            );
            columns.forEach((col: any, colIndex: number) => {
                let seatsInColumn = col.seats_per_row;
                if (override) {
                    const colOverride = override.column_overrides.find(
                        (c: any) => c.column_name === col.name
                    );
                    if (colOverride) seatsInColumn = colOverride.seats;
                }
                for (let i = 0; i < seatsInColumn; i++) {
                    const id = `${floor}-${row}-${colIndex}-${i}`;
                    const label = `A${seatCounter++}`;
                    const isBooked = bookedLabels.includes(label);
                    const isSelected = !isBooked && (selectedSeats.includes(id) || selectedSeatLabels.includes(label));
                    const status: SeatStatus = isBooked ? "booked" : isSelected ? "selected" : "available";
                    seats.push({ id, floor, row, col: colIndex, status, label });
                }
            });
        }
        return seats;
    };

    const floor1Seats = useMemo(() => generateSeatsFromLayout(1), [trip, selectedSeats, selectedSeatLabels, bookedLabels]);

    const groupedSeats = useMemo(() => {
        const grouped: Record<number, { LEFT: Seat[]; RIGHT: Seat[] }> = {};
        floor1Seats.forEach((seat) => {
            if (!grouped[seat.row]) grouped[seat.row] = { LEFT: [], RIGHT: [] };
            if (seat.col === 0) grouped[seat.row].LEFT.push(seat);
            else grouped[seat.row].RIGHT.push(seat);
        });
        return grouped;
    }, [floor1Seats]);

    const renderSeat = (seat: Seat) => {
        const status = seat.status;
        const v = {
            available: {
                detail: "border-green-400 bg-green-50",
                frame: "border-green-400 bg-white text-green-700",
                leg: "bg-green-400",
            },
            selected: {
                detail: "border-orange-500 bg-orange-100",
                frame:
                    "border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg",
                leg: "bg-orange-500",
            },
            booked: {
                detail: "border-slate-300 bg-slate-100",
                frame: "border-slate-300 bg-slate-200 text-slate-400",
                leg: "bg-slate-300",
            },
        }[status];
        return (
            <div
                key={seat.id}
                title={seat.label}
                className={`relative h-[32px] w-[62px] transition-all duration-300 ${status === "selected" ? "scale-110" : ""
                    }`}
            >
                <span
                    className={`pointer-events-none absolute left-[13px] top-0.5 h-1.5 w-[35px] rounded-t-[4px] border-[1.5px] border-b-0 ${v.detail}`}
                />
                <span
                    className={`pointer-events-none absolute left-[7px] top-2 flex h-[14px] w-[48px] items-center justify-center rounded-[4px] border-[1.5px] text-[9px] font-black ${v.frame}`}
                >
                    {seat.label}
                </span>
                <span
                    className={`pointer-events-none absolute left-[20px] top-[18px] h-[4px] w-[2px] ${v.leg}`}
                />
                <span
                    className={`pointer-events-none absolute right-[20px] top-[18px] h-[4px] w-[2px] ${v.leg}`}
                />
            </div>
        );
    };

    /* ════════════════════════════════════════
         GỌI API ĐẶT VÉ
      ════════════════════════════════════════ */
    const handleBooking = async () => {
        setErrorMsg(null);

        /* 1. Lấy token */
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            setErrorMsg("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
            return;
        }

        /* 2. Decode lấy user_id */
        const payload = decodeJwt(accessToken);
        const user_id =
            payload?.id || payload?.userId || payload?._id || payload?.sub;
        if (!user_id) {
            setErrorMsg("Không xác định được tài khoản. Vui lòng đăng nhập lại.");
            return;
        }

        /* 3. Kiểm tra các trường bắt buộc */
        if (!trip?._id || !pickupPoint?._id || !dropoffPoint?._id) {
            setErrorMsg("Thiếu thông tin chuyến xe hoặc điểm đón/trả.");
            return;
        }

        setIsSubmitting(true);
        try {
            const body = {
                user_id,
                trip_id: trip._id,
                start_id: pickupPoint._id,
                end_id: dropoffPoint._id,
                // Snapshot điểm đón
                start_info: {
                    city: pickupPoint?.stop_id?.province ?? pickupPoint?.stop_id?.name ?? "",
                    specific_location: pickupLocationPoint?.location_name ?? "",
                },
                // Snapshot điểm trả
                end_info: {
                    city: dropoffPoint?.stop_id?.province ?? dropoffPoint?.stop_id?.name ?? "",
                    specific_location: dropoffLocationPoint?.location_name ?? "",
                },
                seat_labels: seatList,
                ticket_price: ticketPrice,
                payment_method: paymentMethod,
                passenger_name: customerInfo.name.trim(),
                passenger_phone: customerInfo.phone.trim(),
            };

            const res = await fetch("http://localhost:3000/api/customer/check/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                // BE trả về message lỗi cụ thể (ghế trùng, ghế đã đặt, v.v.)
                setErrorMsg(data.message || "Đặt vé thất bại. Vui lòng thử lại.");
                return;
            }

            /* 4. Thành công → chuyển sang view xác nhận */
            setBookedLabels(seatList);
            setConfirmedOrderId(data?.data?._id || data?.order?._id || null);
            setBookingConfirmed(true);
        } catch (err) {
            console.error("[handleBooking]", err);
            setErrorMsg("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const tripInfoRows = [
        { label: "Tuyến xe", value: routeLabel },
        { label: "Ngày đi", value: formatDate(trip?.departure_time) },
        { label: "Giờ khởi hành", value: formatTime(trip?.departure_time) },
        { label: "Giờ đến dự kiến", value: formatTime(trip?.arrival_time) },
        {
            label: "Thời gian hành trình",
            value: calcDuration(trip?.departure_time, trip?.arrival_time),
        },
        { label: "Loại xe", value: trip?.bus_id?.bus_type_id?.name || "---" },
        { label: "Số ghế đã chọn", value: `${selectedCount} ghế` },
    ];

    /* ── RENDER ── */

    /* ════════════════════════════════════════
       VIEW XÁC NHẬN — sau khi đặt vé thành công
    ════════════════════════════════════════ */
    if (bookingConfirmed) {
        const actualSeatList = bookedLabels.length > 0 ? bookedLabels : seatList;
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100 py-10 px-4">
                <div className="max-w-2xl mx-auto space-y-6">

                    {/* Header thành công */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-green-200 p-8 text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-1">Đặt vé thành công! 🎉</h2>
                        <p className="text-slate-500 text-sm">
                            Cảm ơn <span className="font-bold text-slate-700">{customerInfo.name}</span> đã đặt vé.
                            Chúng tôi sẽ liên hệ qua <span className="font-bold text-slate-700">{customerInfo.phone}</span>.
                        </p>
                        {confirmedOrderId && (
                            <p className="mt-2 text-xs text-slate-400">Mã đơn: <span className="font-mono font-bold text-slate-600">{confirmedOrderId}</span></p>
                        )}
                    </div>

                    {/* Thông tin chuyến */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-100 p-6 space-y-3">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">🚌 Thông tin chuyến xe</h3>
                        {[
                            { label: "Tuyến xe", value: routeLabel },
                            { label: "Ngày đi", value: formatDate(trip?.departure_time) },
                            { label: "Giờ khởi hành", value: formatTime(trip?.departure_time) },
                            { label: "Giờ đến dự kiến", value: formatTime(trip?.arrival_time) },
                            { label: "Loại xe", value: trip?.bus_id?.bus_type_id?.name || "---" },
                            { label: "Điểm đón", value: pickupPoint?.stop_id?.name || "---" },
                            { label: "Điểm trả", value: dropoffPoint?.stop_id?.name || "---" },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                <span className="text-sm text-slate-500">{label}</span>
                                <span className="text-sm font-semibold text-slate-800 text-right max-w-[60%]">{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Thông tin hành khách */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-100 p-6 space-y-3">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">👤 Hành khách</h3>
                        {[
                            { label: "Họ tên", value: customerInfo.name },
                            { label: "Số điện thoại", value: customerInfo.phone },
                            { label: "Email", value: customerInfo.email || "---" },
                            { label: "Thanh toán", value: paymentMethod === "CASH_ON_BOARD" ? "💵 Trả tiền trên xe" : "📱 Online" },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                <span className="text-sm text-slate-500">{label}</span>
                                <span className="text-sm font-semibold text-slate-800">{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Ghế đã đặt + tổng tiền */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">🪑 Ghế đã đặt</h3>
                            <div className="flex flex-wrap gap-1.5 justify-end">
                                {actualSeatList.map((s: string) => (
                                    <span key={s} className="bg-white/25 text-white text-xs font-black px-2.5 py-1 rounded-lg">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-white/30 pt-4 flex items-center justify-between">
                            <span className="text-orange-100 text-sm font-medium">{actualSeatList.length} ghế × {ticketPrice.toLocaleString("vi-VN")}₫</span>
                            <span className="text-3xl font-black">{totalPrice.toLocaleString("vi-VN")}₫</span>
                        </div>
                    </div>

                    {/* Sơ đồ ghế — ghế vừa đặt đã chuyển sang xám */}
                    <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-100 p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">🗺️ Sơ đồ chỗ ngồi</h3>
                        <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
                            <div className="w-full max-w-lg mx-auto border-2 border-slate-300 rounded-[32px] p-8 bg-white shadow-inner">
                                <div className="text-center text-slate-400 font-bold mb-8 tracking-widest text-sm">🚍 ĐẦU XE</div>
                                <div className="flex flex-col gap-8 items-center w-full">
                                    {Object.keys(groupedSeats).map(rowKey => {
                                        const row = groupedSeats[Number(rowKey)];
                                        const total = row.LEFT.length + row.RIGHT.length;
                                        if (total % 2 !== 0) {
                                            return (
                                                <div key={rowKey} className="flex justify-center gap-5">
                                                    {[...row.LEFT, ...row.RIGHT].map(renderSeat)}
                                                </div>
                                            );
                                        }
                                        return (
                                            <div key={rowKey} className="grid grid-cols-[1fr_80px_1fr] items-center w-full max-w-sm mx-auto">
                                                <div className="flex justify-end gap-5">{row.LEFT.map(renderSeat)}</div>
                                                <div />
                                                <div className="flex justify-start gap-5">{row.RIGHT.map(renderSeat)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="flex items-center justify-center gap-5 mt-4 flex-wrap">
                            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-white border-2 border-green-400" /><span className="text-xs text-slate-600">Trống</span></div>
                            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-gradient-to-br from-orange-500 to-orange-600" /><span className="text-xs text-slate-600">Vừa đặt</span></div>
                            <div className="flex items-center gap-2"><div className="w-5 h-5 rounded bg-slate-200 border-2 border-slate-300" /><span className="text-xs text-slate-600">Đã bán</span></div>
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => navigate("/")}
                            className="flex-1 py-3.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-md min-w-[140px]"
                        >
                            🏠 Về trang chủ
                        </button>
                        <button
                            onClick={() => navigate("/datve", {
                                state: {
                                    tripId: trip?._id,
                                    bus_type_id: trip?.bus_id?.bus_type_id?._id,
                                    // Truyền ghế vừa đặt để BusSeatSelection tô xám ngay
                                    justBookedLabels: bookedLabels,
                                    // Khôi phục lại điểm đón/trả đã chọn
                                    restoredPickupId: pickupPoint?._id,
                                    restoredDropoffId: dropoffPoint?._id,
                                }
                            })}
                            className="flex-1 py-3.5 rounded-xl bg-white border-2 border-orange-300 text-orange-600 font-bold hover:bg-orange-50 transition-all shadow-md min-w-[140px]"
                        >
                            🪑 Chọn thêm ghế
                        </button>
                        <button
                            onClick={() => navigate("/user/orderhistory")}
                            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold shadow-lg transition-all active:scale-95 min-w-[140px]"
                        >
                            📋 Lịch sử đặt vé
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100">



            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#f3ece5] to-[#ece7e2]" />

            {/* Bus animation */}
            <div className="pointer-events-none absolute top-[18%] right-[0%] z-10 w-[66%] max-w-[860px] md:top-[7%] md:w-[62%]">
                <div className="bus-bob relative z-10">
                    <img
                        src="/images/bus7.png"
                        alt="Bus"
                        className="w-full object-contain"
                        style={{ filter: "drop-shadow(0 24px 28px rgba(15,23,42,0.28))" }}
                    />
                </div>
            </div>

            {/* Hero */}
            <div className="relative z-20 mx-auto flex min-h-[600px] w-full max-w-[1240px] items-center px-4 pb-20 pt-20">
                <div className="page-enter-copy relative -ml-8 max-w-[760px] space-y-6 sm:-ml-14 lg:-ml-24">
                    <h1 className="hero-title text-[48px] font-black leading-[1.05] tracking-[-0.03em] text-[#0d142a] sm:text-[58px] lg:text-[72px]">
                        <span className="hero-title-line block whitespace-nowrap">
                            Tìm và đặt ngay
                        </span>
                        <span className="hero-title-line mt-2 block whitespace-nowrap">
                            những chuyến xe
                        </span>
                        <span className="hero-title-line mt-2 block whitespace-nowrap font-extrabold italic">
                            <span className="text-[#0d142a]">thật</span>{" "}
                            <span className="hero-title-shimmer">Dễ Dàng</span>
                        </span>
                    </h1>
                    <p className="text-base leading-relaxed text-[#475569] lg:text-lg max-w-[510px]">
                        Đặt vé mọi lúc mọi nơi, đi vững ngàn hành trình đa dạng và dịch vụ
                        chất lượng cao nhất.
                    </p>
                </div>
            </div>

            {/* ══ BOOKING SECTION ══ */}
            <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Banner */}
                    <div className="mb-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-lg shadow-lg">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-orange-100 hover:text-white text-sm font-semibold mb-4 transition-colors"
                        >
                            <ArrowLeft size={15} /> Quay lại chọn ghế
                        </button>
                        <h1 className="text-4xl font-bold mb-2">Đặt Vé Xe Khách</h1>
                        <p className="text-orange-100 flex items-center gap-2">
                            <span>📍</span> {routeLabel} • {formatDate(trip?.departure_time)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* ════ LEFT ════ */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* ĐIỂM ĐÓN & ĐIỂM TRẢ */}
                            <div className="bg-white rounded-lg shadow-lg border-2 border-orange-300 overflow-hidden">
                                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                                        <MapPin size={16} className="text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold text-white">
                                        Thông tin lộ trình
                                    </h2>
                                </div>

                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* ĐIỂM ĐÓN */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-[11px] font-black flex-shrink-0">
                                                A
                                            </span>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Điểm đón
                                            </span>
                                        </div>
                                        <div className="rounded-xl border-2 border-green-200 bg-green-50 overflow-hidden">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border-b border-green-200">
                                                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                                <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">
                                                    Khu vực
                                                </span>
                                                {pickupPoint && (
                                                    <span className="ml-auto text-[10px] font-semibold text-green-600 bg-green-200 px-2 py-0.5 rounded-full">
                                                        Điểm {pickupPoint.stop_order}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="px-4 py-3">
                                                {pickupPoint ? (
                                                    <>
                                                        <p className="text-sm font-bold text-green-900">
                                                            {pickupPoint.stop_id.name}
                                                        </p>
                                                        <p className="text-xs text-green-600 mt-0.5">
                                                            {pickupPoint.stop_id.province}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-slate-400 italic">
                                                        Chưa có thông tin
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {pickupLocationPoint && (
                                            <div className="rounded-xl border-2 border-green-300 bg-white overflow-hidden">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-b border-green-200">
                                                    <MapPin
                                                        size={12}
                                                        className="text-green-500 flex-shrink-0"
                                                    />
                                                    <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">
                                                        Vị trí cụ thể
                                                    </span>
                                                </div>
                                                <div className="px-4 py-3 space-y-1.5">
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {pickupLocationPoint.location_name}
                                                    </p>
                                                    {pickupLocationPoint.location?.coordinates?.length ===
                                                        2 && (
                                                            <a
                                                                href={`https://maps.google.com/?q=${pickupLocationPoint.location.coordinates[1]},${pickupLocationPoint.location.coordinates[0]}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-600 hover:text-green-700 transition-colors"
                                                            >
                                                                <MapPin size={11} /> Xem trên bản đồ
                                                            </a>
                                                        )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* ĐIỂM TRẢ */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white text-[11px] font-black flex-shrink-0">
                                                B
                                            </span>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                Điểm trả
                                            </span>
                                        </div>
                                        <div className="rounded-xl border-2 border-orange-200 bg-orange-50 overflow-hidden">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 border-b border-orange-200">
                                                <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                                                <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider">
                                                    Khu vực
                                                </span>
                                                {dropoffPoint && (
                                                    <span className="ml-auto text-[10px] font-semibold text-orange-600 bg-orange-200 px-2 py-0.5 rounded-full">
                                                        Điểm {dropoffPoint.stop_order}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="px-4 py-3">
                                                {dropoffPoint ? (
                                                    <>
                                                        <p className="text-sm font-bold text-orange-900">
                                                            {dropoffPoint.stop_id.name}
                                                        </p>
                                                        <p className="text-xs text-orange-600 mt-0.5">
                                                            {dropoffPoint.stop_id.province}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-slate-400 italic">
                                                        Chưa có thông tin
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {dropoffLocationPoint && (
                                            <div className="rounded-xl border-2 border-orange-300 bg-white overflow-hidden">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border-b border-orange-200">
                                                    <Navigation
                                                        size={12}
                                                        className="text-orange-500 flex-shrink-0"
                                                    />
                                                    <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider">
                                                        Vị trí cụ thể
                                                    </span>
                                                </div>
                                                <div className="px-4 py-3 space-y-1.5">
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {dropoffLocationPoint.location_name}
                                                    </p>
                                                    {dropoffLocationPoint.location?.coordinates
                                                        ?.length === 2 && (
                                                            <a
                                                                href={`https://maps.google.com/?q=${dropoffLocationPoint.location.coordinates[1]},${dropoffLocationPoint.location.coordinates[0]}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                                                            >
                                                                <MapPin size={11} /> Xem trên bản đồ
                                                            </a>
                                                        )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {pickupPoint && dropoffPoint && (
                                    <div className="mx-6 mb-5 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-50 to-orange-50 border-2 border-orange-200 rounded-xl">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-green-800 truncate">
                                                    {pickupPoint.stop_id.name}
                                                </p>
                                                {pickupLocationPoint && (
                                                    <p className="text-[10px] text-green-600 truncate">
                                                        {pickupLocationPoint.location_name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <div className="w-12 h-px bg-gradient-to-r from-green-400 to-orange-400" />
                                            <div className="text-[10px] font-bold text-slate-500 px-1 whitespace-nowrap">
                                                {calcDuration(trip?.departure_time, trip?.arrival_time)}
                                            </div>
                                            <div className="w-12 h-px bg-gradient-to-r from-orange-400 to-orange-500" />
                                        </div>
                                        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                                            <div className="min-w-0 text-right">
                                                <p className="text-xs font-bold text-orange-800 truncate">
                                                    {dropoffPoint.stop_id.name}
                                                </p>
                                                {dropoffLocationPoint && (
                                                    <p className="text-[10px] text-orange-600 truncate">
                                                        {dropoffLocationPoint.location_name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sơ đồ chỗ ngồi */}
                            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-orange-300">
                                <h2 className="text-2xl font-bold text-orange-900 mb-6">
                                    🪑 Sơ đồ chỗ ngồi
                                </h2>
                                {selectedCount > 0 && (
                                    <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                                        <p className="text-sm font-bold text-orange-700 mb-3">
                                            ✅ Ghế đã chọn ({selectedCount} ghế):
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {(selectedSeatLabels.length > 0
                                                ? selectedSeatLabels
                                                : selectedSeats
                                            ).map((s: string) => (
                                                <span
                                                    key={s}
                                                    className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow"
                                                >
                                                    Ghế {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-3 mb-8 border-b-2 border-orange-300 pb-4">
                                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md flex items-center gap-2">
                                        <Armchair size={17} /> Tầng {activeFloor}
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-slate-50 to-orange-50/30 rounded-2xl p-10 mb-8 border-2 border-orange-100">
                                    <div className="w-full max-w-6xl mx-auto border-2 border-slate-300 rounded-[40px] p-12 bg-white shadow-inner">
                                        <div className="text-center text-slate-400 font-bold mb-10 tracking-widest">
                                            🚍 ĐẦU XE
                                        </div>
                                        <div className="flex flex-col gap-10 items-center w-full">
                                            {Object.keys(groupedSeats).map((rowKey) => {
                                                const row = groupedSeats[Number(rowKey)];
                                                const totalSeats = row.LEFT.length + row.RIGHT.length;
                                                if (totalSeats % 2 !== 0) {
                                                    return (
                                                        <div
                                                            key={rowKey}
                                                            className="flex justify-center gap-6 mb-10"
                                                        >
                                                            {[...row.LEFT, ...row.RIGHT].map(renderSeat)}
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div
                                                        key={rowKey}
                                                        className="grid grid-cols-[1fr_120px_1fr] items-center mb-10 w-full max-w-3xl mx-auto"
                                                    >
                                                        <div className="flex justify-end gap-6">
                                                            {row.LEFT.map(renderSeat)}
                                                        </div>
                                                        <div />
                                                        <div className="flex justify-start gap-6">
                                                            {row.RIGHT.map(renderSeat)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-8 text-sm bg-orange-50 p-6 rounded-lg border-2 border-orange-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-white border-2 border-green-400" />
                                        <span className="text-slate-700 font-bold">Trống</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-orange-600" />
                                        <span className="text-slate-700 font-bold">Đã chọn</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-slate-200 border-2 border-slate-400" />
                                        <span className="text-slate-700 font-bold">Đã bán</span>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin khách hàng */}
                            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-orange-300">
                                <h2 className="text-2xl font-bold text-orange-900 mb-6">👤 Thông tin khách hàng</h2>
                                <div className="space-y-5">
                                    {[
                                        { key: "name", type: "text", label: "Họ và Tên", placeholder: "Nhập họ và tên", required: true },
                                        { key: "phone", type: "tel", label: "Số điện thoại", placeholder: "Nhập số điện thoại", required: true },
                                    ].map((field) => (
                                        <div key={field.key}>
                                            <label className="block text-sm font-bold text-orange-700 mb-3 uppercase">
                                                {field.label}{" "}
                                                {field.required ? <span className="text-red-500">*</span> : <span className="text-orange-400">(Tùy chọn)</span>}
                                            </label>
                                            <input
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                                value={(customerInfo as any)[field.key]}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, [field.key]: e.target.value })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Phương thức thanh toán */}
                            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-orange-300">
                                <h2 className="text-2xl font-bold text-orange-900 mb-6">💳 Phương thức thanh toán</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { value: "CASH_ON_BOARD", label: "Trả tiền trên xe", desc: "Thanh toán khi lên xe", icon: "💵" },
                                        { value: "ONLINE", label: "Thanh toán online", desc: "Chuyển khoản / ví điện tử", icon: "📱" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setPaymentMethod(opt.value as any)}
                                            className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === opt.value
                                                ? "border-orange-500 bg-orange-50"
                                                : "border-slate-200 hover:border-orange-300"
                                                }`}
                                        >
                                            <span className="text-2xl">{opt.icon}</span>
                                            <div>
                                                <p className={`font-bold text-sm ${paymentMethod === opt.value ? "text-orange-700" : "text-slate-700"}`}>{opt.label}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                                            </div>
                                            <div className={`ml-auto mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${paymentMethod === opt.value ? "border-orange-500 bg-orange-500" : "border-slate-300"
                                                }`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Điều khoản */}
                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-lg p-6 shadow-md">
                                <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-orange-300">
                                    <span className="text-2xl">📋</span>
                                    <h3 className="text-lg font-bold text-orange-900">Điều Khoản & Lưu Ý Quan Trọng</h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { num: "1", icon: "🆔", title: "Chuẩn Bị Giấy Tờ Tùy Thân", desc: "Hành khách bắt buộc phải mang theo giấy CMND/CCCD/Hộ chiếu hợp lệ khi lên xe." },
                                        { num: "2", icon: "⏱️", title: "Giờ Khởi Hành", desc: "Xe khởi hành đúng theo giờ quy định. Quý khách vui lòng có mặt 15 phút trước." },
                                        { num: "3", icon: "📍", title: "Địa Điểm Xuất Phát", desc: "Có mặt tại bến xe ít nhất 30 phút trước giờ khởi hành. Không chịu trách nhiệm cho khách lỡ chuyến." },
                                        { num: "4", icon: "🎒", title: "Quy Định Về Hành Lý", desc: "Miễn phí: Tối đa 1 hành lý 50×40×25cm, không quá 15kg. Vượt quá sẽ tính phí bổ sung." },
                                        { num: "5", icon: "⚠️", title: "Giá Trị Tài Sản Cá Nhân", desc: "Công ty không chịu trách nhiệm với điện thoại, laptop, tiền bạc, trang sức v.v..." },
                                    ].map((item) => (
                                        <div key={item.num} className="flex gap-4">
                                            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 border-2 border-orange-400">
                                                <span className="text-orange-600 font-bold text-sm">{item.num}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-orange-900">{item.icon} {item.title}</p>
                                                <p className="text-xs text-orange-800 mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ════ RIGHT SIDEBAR ════ */}
                        <div className="space-y-8 lg:sticky lg:top-6 h-fit">
                            {/* Thông tin chuyến đi */}
                            <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-8 shadow-lg border-2 border-orange-200">
                                <h3 className="text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
                                    <span className="text-2xl">🚌</span> Thông tin chuyến đi
                                </h3>
                                <div className="space-y-4 text-sm">
                                    {tripInfoRows.map((item) => (
                                        <div
                                            key={item.label}
                                            className="pb-4 border-b-2 border-orange-100 last:border-0 last:pb-0"
                                        >
                                            <p className="text-orange-600 text-xs font-bold uppercase tracking-wide mb-1">
                                                {item.label}
                                            </p>
                                            <p className="font-semibold text-slate-900">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                    <div className="pb-4 border-b-2 border-orange-100">
                                        <p className="text-orange-600 text-xs font-bold uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-500 text-white text-[9px] font-black">
                                                A
                                            </span>
                                            Điểm đón
                                        </p>
                                        {pickupPoint ? (
                                            <div className="space-y-0.5">
                                                <p className="font-semibold text-slate-900">
                                                    {pickupPoint.stop_id.province} —{" "}
                                                    {pickupPoint.stop_id.name}
                                                </p>
                                                {pickupLocationPoint && (
                                                    <p className="text-xs text-green-700 font-medium flex items-center gap-1">
                                                        <MapPin size={11} className="flex-shrink-0" />
                                                        {pickupLocationPoint.location_name}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-semibold text-slate-400 italic text-xs">
                                                Chưa có thông tin
                                            </p>
                                        )}
                                    </div>
                                    <div className="pb-0">
                                        <p className="text-orange-600 text-xs font-bold uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-black">
                                                B
                                            </span>
                                            Điểm trả
                                        </p>
                                        {dropoffPoint ? (
                                            <div className="space-y-0.5">
                                                <p className="font-semibold text-slate-900">
                                                    {dropoffPoint.stop_id.province} —{" "}
                                                    {dropoffPoint.stop_id.name}
                                                </p>
                                                {dropoffLocationPoint && (
                                                    <p className="text-xs text-orange-700 font-medium flex items-center gap-1">
                                                        <Navigation size={11} className="flex-shrink-0" />
                                                        {dropoffLocationPoint.location_name}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="font-semibold text-slate-400 italic text-xs">
                                                Chưa có thông tin
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Chi tiết giá */}
                            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-8 shadow-lg border-2 border-orange-300">
                                <h3 className="text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
                                    <span className="text-2xl">💰</span> Chi tiết giá
                                </h3>
                                <div className="space-y-4 text-sm mb-6 pb-6 border-b-2 border-orange-300">
                                    <div className="flex justify-between items-center bg-white bg-opacity-60 p-3 rounded-lg">
                                        <span className="text-slate-700 font-medium">
                                            Giá vé (1 ghế)
                                        </span>
                                        <span className="font-bold text-orange-600">
                                            {ticketPrice.toLocaleString("vi-VN")}đ
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white bg-opacity-60 p-3 rounded-lg">
                                        <span className="text-slate-700 font-medium">
                                            Số ghế đã chọn
                                        </span>
                                        <span className="font-bold text-orange-600 text-lg">
                                            {selectedCount}
                                        </span>
                                    </div>
                                    {selectedCount > 0 && (
                                        <div className="flex justify-between items-start bg-white bg-opacity-60 p-3 rounded-lg">
                                            <span className="text-slate-700 font-medium">Ghế</span>
                                            <div className="flex flex-wrap gap-1 justify-end max-w-[160px]">
                                                {(selectedSeatLabels.length > 0
                                                    ? selectedSeatLabels
                                                    : selectedSeats
                                                ).map((s: string) => (
                                                    <span
                                                        key={s}
                                                        className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded"
                                                    >
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center bg-white bg-opacity-60 p-3 rounded-lg">
                                        <span className="text-slate-700 font-medium">
                                            Thanh toán
                                        </span>
                                        <span className="font-bold text-slate-700 text-xs">
                                            {paymentMethod === "CASH_ON_BOARD"
                                                ? "💵 Trên xe"
                                                : "📱 Online"}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
                                    <div className="text-center">
                                        <p className="text-orange-100 text-sm mb-1 font-medium">
                                            Tổng tiền
                                        </p>
                                        <p className="text-4xl font-black">
                                            {totalPrice.toLocaleString("vi-VN")}₫
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Thông báo lỗi */}
                            {errorMsg && (
                                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-sm text-red-700 font-semibold">
                                    ⚠️ {errorMsg}
                                </div>
                            )}

                            {/* Nút thanh toán */}
                            <button
                                disabled={!isFormValid || isSubmitting}
                                onClick={handleBooking}
                                className={`w-full py-4 rounded-lg font-bold text-white transition-all text-lg shadow-lg flex items-center justify-center gap-2 ${isFormValid && !isSubmitting
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl active:scale-95 cursor-pointer"
                                    : "bg-slate-300 cursor-not-allowed opacity-60"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : isFormValid ? (
                                    `💳 Xác nhận đặt ${selectedCount} ghế`
                                ) : (
                                    "Điền đầy đủ thông tin & đồng ý điều khoản"
                                )}
                            </button>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-xs text-blue-900 shadow-sm">
                                <p className="font-bold mb-2">ℹ️ Hỗ trợ thanh toán</p>
                                <p>
                                    Liên hệ{" "}
                                    <span className="font-bold text-blue-700">1800-XXXXX</span>{" "}
                                    nếu có bất kỳ thắc mắc
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ SUCCESS MODAL ══ */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
                        {/* Icon tick */}
                        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <svg
                                className="h-10 w-10 text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 mb-2">
                            Đặt vé thành công!
                        </h2>
                        <p className="text-slate-500 text-sm mb-1">
                            Cảm ơn{" "}
                            <span className="font-bold text-slate-700">
                                {customerInfo.name}
                            </span>{" "}
                            đã đặt vé.
                        </p>
                        <p className="text-slate-500 text-sm mb-6">
                            Chúng tôi sẽ liên hệ qua{" "}
                            <span className="font-bold text-slate-700">
                                {customerInfo.phone}
                            </span>{" "}
                            để xác nhận.
                        </p>

                        {/* Tóm tắt */}
                        <div className="mb-6 rounded-xl bg-orange-50 border border-orange-200 p-4 text-left space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tuyến xe</span>
                                <span className="font-semibold text-slate-800 text-right max-w-[55%]">
                                    {routeLabel}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Ngày đi</span>
                                <span className="font-semibold text-slate-800">
                                    {formatDate(trip?.departure_time)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Ghế</span>
                                <span className="font-semibold text-orange-600">
                                    {actualSeatList.join(", ")}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-orange-200 pt-2">
                                <span className="text-slate-500 font-bold">Tổng tiền</span>
                                <span className="font-black text-orange-600 text-base">
                                    {totalPrice.toLocaleString("vi-VN")}₫
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/")}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base hover:from-orange-600 hover:to-orange-700 transition-all active:scale-95 shadow-lg"
                        >
                            🏠 Về trang chủ
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                .page-enter-copy { opacity: 0; animation: fadeUp 1.08s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.2s; }
                .hero-title-line { opacity: 0; animation: titleReveal 1.12s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                .hero-title-line:nth-child(1) { animation-delay: 0.36s; }
                .hero-title-line:nth-child(2) { animation-delay: 0.54s; }
                .hero-title-line:nth-child(3) { animation-delay: 0.72s; }
                .hero-title-shimmer { color: #ff7a1b; background: linear-gradient(100deg, #ff7a1b, #ffb347); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .bus-bob { animation: busBob 1.9s cubic-bezier(0.36, 0.06, 0.29, 0.97) infinite; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes titleReveal { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes busBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            `}</style>
        </div>
    );
}
