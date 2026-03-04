import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Armchair } from "lucide-react";

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

/* ================= COMPONENT ================= */
export default function BusBookingUI() {
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Nhận toàn bộ data từ Trang 1
    const {
        selectedSeats = [] as string[],
        selectedSeatLabels = [] as string[],
        trip = null,
    } = location.state || {};

    const activeFloor = 1;
    const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", email: "" });
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const selectedCount = selectedSeats.length;
    const ticketPrice = trip?.price || 180000;
    const totalPrice = selectedCount * ticketPrice;
    const isFormValid = customerInfo.name.trim() && customerInfo.phone.trim() && agreedToTerms;

    /* ── Helpers ── */
    const formatTime = (d?: string) => {
        if (!d) return "--:--";
        return new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    };
    const formatDate = (d?: string) => {
        if (!d) return "--/--/----";
        return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    };
    const calcDuration = (s?: string, e?: string) => {
        if (!s || !e) return "--";
        const h = Math.floor((new Date(e).getTime() - new Date(s).getTime()) / 3600000);
        return `~${h} giờ`;
    };

    const startLabel = trip?.route_id?.start_id
        ? `${trip.route_id.start_id.province} (${trip.route_id.start_id.name})`
        : "Điểm đi";
    const stopLabel = trip?.route_id?.stop_id
        ? `${trip.route_id.stop_id.province} (${trip.route_id.stop_id.name})`
        : "Điểm đến";
    const routeLabel = `${startLabel} → ${stopLabel}`;

    /* ── Tái tạo sơ đồ ghế từ seat_layout (giống hệt Trang 1) ── */
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
                    // Tô màu đúng ghế đã chọn từ Trang 1
                    const isSelected =
                        selectedSeats.includes(id) ||
                        selectedSeatLabels.includes(label);
                    seats.push({
                        id,
                        floor,
                        row,
                        col: colIndex,
                        status: isSelected ? "selected" : "available",
                        label,
                    });
                }
            });
        }
        return seats;
    };

    const floor1Seats = useMemo(() => generateSeatsFromLayout(1), [trip, selectedSeats, selectedSeatLabels]);

    /* ── Nhóm ghế theo hàng (LEFT / RIGHT) giống Trang 1 ── */
    const groupedSeats = useMemo(() => {
        const grouped: Record<number, { LEFT: Seat[]; RIGHT: Seat[] }> = {};
        floor1Seats.forEach((seat) => {
            if (!grouped[seat.row]) grouped[seat.row] = { LEFT: [], RIGHT: [] };
            if (seat.col === 0) grouped[seat.row].LEFT.push(seat);
            else grouped[seat.row].RIGHT.push(seat);
        });
        return grouped;
    }, [floor1Seats]);

    /* ── Render 1 ghế (read-only, giống hệt Trang 1) ── */
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
                frame: "border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg",
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
                className={`relative h-[32px] w-[62px] transition-all duration-300 ${status === "selected" ? "scale-110" : ""}`}
            >
                <span className={`pointer-events-none absolute left-[13px] top-0.5 h-1.5 w-[35px] rounded-t-[4px] border-[1.5px] border-b-0 ${v.detail}`} />
                <span className={`pointer-events-none absolute left-[7px] top-2 flex h-[14px] w-[48px] items-center justify-center rounded-[4px] border-[1.5px] text-[9px] font-black ${v.frame}`}>
                    {seat.label}
                </span>
                <span className={`pointer-events-none absolute left-[20px] top-[18px] h-[4px] w-[2px] ${v.leg}`} />
                <span className={`pointer-events-none absolute right-[20px] top-[18px] h-[4px] w-[2px] ${v.leg}`} />
            </div>
        );
    };

    const tripInfoRows = [
        { label: "Tuyến xe", value: routeLabel },
        { label: "Ngày đi", value: formatDate(trip?.departure_time) },
        { label: "Giờ khởi hành", value: formatTime(trip?.departure_time) },
        { label: "Thời gian", value: calcDuration(trip?.departure_time, trip?.arrival_time) },
        { label: "Điểm trả khách", value: stopLabel },
        { label: "Loại xe", value: trip?.bus_id?.bus_type_id?.name || "---" },
    ];

    /* ── RENDER ── */
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100">
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#f3ece5] to-[#ece7e2]" />

            {/* Bus animation */}
            <div className="pointer-events-none absolute top-[18%] right-[0%] z-10 w-[66%] max-w-[860px] md:top-[7%] md:w-[62%]">
                <div className="bus-bob relative z-10">
                    <img src="/images/bus7.png" alt="Bus" className="w-full object-contain"
                        style={{ filter: "drop-shadow(0 24px 28px rgba(15,23,42,0.28))" }} />
                </div>
            </div>

            {/* Hero */}
            <div className="relative z-20 mx-auto flex min-h-[600px] w-full max-w-[1240px] items-center px-4 pb-20 pt-20">
                <div className="page-enter-copy relative -ml-8 max-w-[760px] space-y-6 sm:-ml-14 lg:-ml-24">
                    <h1 className="hero-title text-[48px] font-black leading-[1.05] tracking-[-0.03em] text-[#0d142a] sm:text-[58px] lg:text-[72px]">
                        <span className="hero-title-line block whitespace-nowrap">Tìm và đặt ngay</span>
                        <span className="hero-title-line mt-2 block whitespace-nowrap">những chuyến xe</span>
                        <span className="hero-title-line mt-2 block whitespace-nowrap font-extrabold italic">
                            <span className="text-[#0d142a]">thật</span>{" "}
                            <span className="hero-title-shimmer">Dễ Dàng</span>
                        </span>
                    </h1>
                    <p className="text-base leading-relaxed text-[#475569] lg:text-lg max-w-[510px]">
                        Đặt vé mọi lúc mọi nơi, đi vững ngàn hành trình đa dạng và dịch vụ chất lượng cao nhất.
                    </p>
                </div>
            </div>

            {/* ══ BOOKING SECTION ══ */}
            <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto">

                    {/* Header Banner */}
                    <div className="mb-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-lg shadow-lg">
                        <button onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-orange-100 hover:text-white text-sm font-semibold mb-4 transition-colors">
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

                            {/* Sơ đồ chỗ ngồi */}
                            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-orange-300">
                                <h2 className="text-2xl font-bold text-orange-900 mb-6">🪑 Sơ đồ chỗ ngồi</h2>

                                {/* Badges ghế đã chọn */}
                                {selectedCount > 0 && (
                                    <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                                        <p className="text-sm font-bold text-orange-700 mb-3">
                                            ✅ Ghế đã chọn ({selectedCount} ghế):
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {(selectedSeatLabels.length > 0 ? selectedSeatLabels : selectedSeats).map((s: string) => (
                                                <span key={s}
                                                    className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow">
                                                    Ghế {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Floor tab */}
                                <div className="flex gap-3 mb-8 border-b-2 border-orange-300 pb-4">
                                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md flex items-center gap-2">
                                        <Armchair size={17} /> Tầng {activeFloor}
                                    </div>
                                </div>

                                {/* ── Sơ đồ ghế (giống hệt Trang 1) ── */}
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
                                                        <div key={rowKey} className="flex justify-center gap-6 mb-10">
                                                            {[...row.LEFT, ...row.RIGHT].map(renderSeat)}
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div key={rowKey} className="grid grid-cols-[1fr_120px_1fr] items-center mb-10 w-full max-w-3xl mx-auto">
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

                                {/* Legend */}
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
                                        { key: "email", type: "email", label: "Email", placeholder: "example@gmail.com", required: false },
                                    ].map((field) => (
                                        <div key={field.key}>
                                            <label className="block text-sm font-bold text-orange-700 mb-3 uppercase">
                                                {field.label}{" "}
                                                {field.required
                                                    ? <span className="text-red-500">*</span>
                                                    : <span className="text-orange-400">(Tùy chọn)</span>
                                                }
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

                            {/* Điều khoản */}
                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-lg p-6 shadow-md">
                                <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-orange-300">
                                    <span className="text-2xl">📋</span>
                                    <h3 className="text-lg font-bold text-orange-900">Điều Khoản & Lưu Ý Quan Trọng</h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { num: "1", color: "blue", icon: "🆔", title: "Chuẩn Bị Giấy Tờ Tùy Thân", desc: "Hành khách bắt buộc phải mang theo giấy CMND/CCCD/Hộ chiếu hợp lệ khi lên xe." },
                                        { num: "2", color: "green", icon: "⏱️", title: "Giờ Khởi Hành", desc: "Xe khởi hành đúng theo giờ quy định. Quý khách vui lòng có mặt 15 phút trước." },
                                        { num: "3", color: "purple", icon: "📍", title: "Địa Điểm Xuất Phát", desc: "Có mặt tại bến xe ít nhất 30 phút trước giờ khởi hành. Không chịu trách nhiệm cho khách lỡ chuyến." },
                                        { num: "4", color: "red", icon: "🎒", title: "Quy Định Về Hành Lý", desc: "Miễn phí: Tối đa 1 hành lý 50×40×25cm, không quá 15kg. Vượt quá sẽ tính phí bổ sung." },
                                        { num: "5", color: "yellow", icon: "⚠️", title: "Giá Trị Tài Sản Cá Nhân", desc: "Công ty không chịu trách nhiệm với điện thoại, laptop, tiền bạc, trang sức v.v..." },
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
                                <div className="mt-5 pt-4 border-t-2 border-orange-300">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="w-5 h-5 mt-0.5 accent-orange-500 rounded border-2 border-orange-400"
                                        />
                                        <span className="text-xs text-orange-900">
                                            <strong>Tôi đã đọc và đồng ý</strong> với toàn bộ điều khoản, lưu ý và chính sách của công ty vận tải.
                                        </span>
                                    </label>
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
                                <div className="space-y-5 text-sm">
                                    {tripInfoRows.map((item) => (
                                        <div key={item.label} className="pb-4 border-b-2 border-orange-200 last:border-0 last:pb-0">
                                            <p className="text-orange-600 text-xs font-bold uppercase tracking-wide mb-2">{item.label}</p>
                                            <p className="font-semibold text-slate-900">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Chi tiết giá */}
                            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-8 shadow-lg border-2 border-orange-300">
                                <h3 className="text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
                                    <span className="text-2xl">💰</span> Chi tiết giá
                                </h3>
                                <div className="space-y-4 text-sm mb-6 pb-6 border-b-2 border-orange-300">
                                    <div className="flex justify-between items-center bg-white bg-opacity-60 p-3 rounded-lg">
                                        <span className="text-slate-700 font-medium">Giá vé (1 ghế)</span>
                                        <span className="font-bold text-orange-600">{ticketPrice.toLocaleString("vi-VN")}đ</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white bg-opacity-60 p-3 rounded-lg">
                                        <span className="text-slate-700 font-medium">Số ghế đã chọn</span>
                                        <span className="font-bold text-orange-600 text-lg">{selectedCount}</span>
                                    </div>
                                    {/* Danh sách ghế đã chọn */}
                                    {selectedCount > 0 && (
                                        <div className="flex justify-between items-start bg-white bg-opacity-60 p-3 rounded-lg">
                                            <span className="text-slate-700 font-medium">Ghế</span>
                                            <div className="flex flex-wrap gap-1 justify-end max-w-[160px]">
                                                {(selectedSeatLabels.length > 0 ? selectedSeatLabels : selectedSeats).map((s: string) => (
                                                    <span key={s} className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
                                    <div className="text-center">
                                        <p className="text-orange-100 text-sm mb-1 font-medium">Tổng tiền</p>
                                        <p className="text-4xl font-black">{totalPrice.toLocaleString("vi-VN")}₫</p>
                                    </div>
                                </div>
                            </div>

                            {/* Nút thanh toán */}
                            <button
                                disabled={!isFormValid}
                                className={`w-full py-4 rounded-lg font-bold text-white transition-all text-lg shadow-lg ${isFormValid
                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl active:scale-95 cursor-pointer"
                                        : "bg-slate-300 cursor-not-allowed opacity-60"
                                    }`}
                            >
                                {isFormValid
                                    ? `💳 Thanh toán ${selectedCount} ghế`
                                    : "Điền đầy đủ thông tin & đồng ý điều khoản"}
                            </button>

                            {/* Hỗ trợ */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-xs text-blue-900 shadow-sm">
                                <p className="font-bold mb-2">ℹ️ Hỗ trợ thanh toán</p>
                                <p>Liên hệ <span className="font-bold text-blue-700">1800-XXXXX</span> nếu có bất kỳ thắc mắc</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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