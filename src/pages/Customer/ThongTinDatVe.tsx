import React, { useState } from "react";

export default function BusBookingUI() {
    // Mặc định hiển thị Tầng 1
    const activeFloor = 1;

    const [customerInfo, setCustomerInfo] = useState({
        name: "",
        phone: "",
        email: "",
    });

    // Ghế đã được chọn sẵn
    const selectedSeats = [1, 3, 5, 8];
    const selectedCount = selectedSeats.length;
    const totalPrice = selectedCount * 180000;
    const isFormValid = customerInfo.name.trim() && customerInfo.phone.trim();

    // Generate all seats (44 per floor, 4 rows x 11 cols)
    const generateSeats = (floor) => {
        const seats = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 11; j++) {
                const seatNumber = i * 11 + j + 1 + (floor - 1) * 44;
                const isSelected = selectedSeats.includes(seatNumber);
                const isBooked = Math.random() > 0.75 && !isSelected;
                seats.push({
                    id: `${floor}-${i}-${j}`,
                    number: seatNumber,
                    row: i,
                    col: j,
                    floor: floor,
                    label: `${String.fromCharCode(65 + i)}${j + 1}`,
                    status: isSelected ? "selected" : isBooked ? "booked" : "available",
                });
            }
        }
        return seats;
    };

    const floor1Seats = React.useMemo(() => generateSeats(1), []);
    const currentSeats = floor1Seats;

    const getSeatStatus = (seat) => {
        if (selectedSeats.includes(seat.number)) return "selected";
        return seat.status;
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100">
            {/* Background Layers */}
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#f3ece5] to-[#ece7e2]" />

            {/* Bus Animation */}
            <div className="pointer-events-none absolute top-[18%] right-[0%] z-10 w-[66%] max-w-[860px] md:top-[7%] md:w-[62%]">
                <div className="bus-bob relative z-10">
                    <img src="/images/bus7.png" alt="Bus" className="w-full object-contain" style={{ filter: "drop-shadow(0 24px 28px rgba(15,23,42,0.28))" }} />
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative z-20 mx-auto flex min-h-[600px] w-full max-w-[1240px] items-center px-4 pb-20 pt-20">
                <div className="page-enter-copy relative -ml-8 max-w-[760px] space-y-6 sm:-ml-14 lg:-ml-24">
                    <h1 className="hero-title text-[48px] font-black leading-[1.05] tracking-[-0.03em] text-[#0d142a] sm:text-[58px] lg:text-[72px]">
                        <span className="hero-title-line block whitespace-nowrap">Tìm và đặt ngay</span>
                        <span className="hero-title-line mt-2 block whitespace-nowrap">những chuyến xe</span>
                        <span className="hero-title-line mt-2 block whitespace-nowrap font-extrabold italic">
                            <span className="text-[#0d142a]">thật</span> <span className="hero-title-shimmer">Dễ Dàng</span>
                        </span>
                    </h1>
                    <p className="text-base leading-relaxed text-[#475569] lg:text-lg max-w-[510px]">
                        Đặt vé mọi lúc mọi nơi, đi vững ngàn hành trình đa dạng và dịch vụ chất lượng cao nhất.
                    </p>
                </div>
            </div>

            {/* Booking Section */}
            <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-lg shadow-lg">
                        <h1 className="text-4xl font-bold mb-2">Đặt Vé Xe Khách</h1>
                        <p className="text-orange-100 flex items-center gap-2">
                            <span>📍</span> An Hữu (Tiền Giang) → TP. Hồ Chí Minh • 20/01/2024
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Seat Display Card (Read-Only) */}
                            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-orange-300">
                                <h2 className="text-2xl font-bold text-orange-900 mb-6">🪑 Sơ đồ chỗ ngồi</h2>

                                {/* Floor Display - Fixed */}
                                <div className="flex gap-3 mb-8 border-b-2 border-orange-300 pb-4">
                                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md flex items-center gap-2">
                                        <span>🪑</span> Tầng {activeFloor}
                                    </div>
                                </div>

                                {/* Seat Grid - Read Only with Detailed Layout */}
                                <div className="bg-gradient-to-br from-slate-50 to-orange-50/30 rounded-2xl p-8 mb-8">
                                    <div className="text-center mb-6 text-sm font-bold text-orange-700 bg-orange-200 py-2 px-4 rounded-lg inline-block w-full">
                                        🚗 Tài Xế
                                    </div>

                                    {/* Seats Grid - 4 columns layout with detailed seats */}
                                    <div className="grid grid-cols-4 gap-y-4 w-full max-w-4xl mx-auto px-16">
                                        {currentSeats.map((seat) => {
                                            const status = getSeatStatus(seat);

                                            const seatVisual = {
                                                available: {
                                                    detail: "border-green-400 bg-green-50",
                                                    frame: "border-green-400 bg-white text-green-700",
                                                    leg: "bg-green-400",
                                                    label: "text-green-700",
                                                },
                                                selected: {
                                                    detail: "border-red-500 bg-red-100",
                                                    frame: "border-red-500 bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg",
                                                    leg: "bg-red-500",
                                                    label: "text-white",
                                                },
                                                booked: {
                                                    detail: "border-slate-300 bg-slate-100",
                                                    frame: "border-slate-300 bg-slate-200 text-slate-400",
                                                    leg: "bg-slate-300",
                                                    label: "text-slate-400",
                                                },
                                            }[status];

                                            return (
                                                <div
                                                    key={seat.id}
                                                    className={`relative h-[32px] w-[62px] transition-all duration-300 mx-auto ${status === "selected" ? "scale-110" : ""
                                                        }`}
                                                    title={`${seat.label} - ${status}`}
                                                >
                                                    {/* Backrest (Tựa lưng) */}
                                                    <span
                                                        className={`pointer-events-none absolute left-[13px] top-0.5 h-1.5 w-[35px] rounded-t-[4px] border-[1.5px] border-b-0 transition-all duration-300 ${seatVisual.detail}`}
                                                    />

                                                    {/* Seat Frame (Thân ghế) */}
                                                    <span
                                                        className={`pointer-events-none absolute left-[7px] top-2 flex h-[14px] w-[48px] items-center justify-center rounded-[4px] border-[1.5px] text-[9px] font-black leading-none transition-all duration-300 ${seatVisual.frame} ${seatVisual.label}`}
                                                    >
                                                        {seat.label}
                                                    </span>

                                                    {/* Left Leg (Chân trái) */}
                                                    <span
                                                        className={`pointer-events-none absolute left-[20px] top-[18px] h-[4px] w-[2px] rounded-b-[1px] transition-all duration-300 ${seatVisual.leg}`}
                                                    />

                                                    {/* Right Leg (Chân phải) */}
                                                    <span
                                                        className={`pointer-events-none absolute right-[20px] top-[18px] h-[4px] w-[2px] rounded-b-[1px] transition-all duration-300 ${seatVisual.leg}`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap gap-8 text-sm bg-orange-50 p-6 rounded-lg border-2 border-orange-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-500" />
                                        <span className="text-slate-700 font-bold">Trống</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-red-500 border-2 border-red-600" />
                                        <span className="text-slate-700 font-bold">Đã chọn</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-slate-200 border-2 border-slate-400" />
                                        <span className="text-slate-700 font-bold">Đã bán</span>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info Form */}
                            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-orange-300">
                                <h2 className="text-2xl font-bold text-orange-900 mb-6">👤 Thông tin khách hàng</h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-bold text-orange-700 mb-3 uppercase">
                                            Họ và Tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập họ và tên"
                                            className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                            value={customerInfo.name}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-orange-700 mb-3 uppercase">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="Nhập số điện thoại"
                                            className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                            value={customerInfo.phone}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-orange-700 mb-3 uppercase">
                                            Email <span className="text-orange-400">(Tùy chọn)</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="example@gmail.com"
                                            className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                                            value={customerInfo.email}
                                            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-lg p-6 shadow-md">
                                <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-orange-300">
                                    <span className="text-2xl">📋</span>
                                    <h3 className="text-lg font-bold text-orange-900">Điều Khoản & Lưu Ý Quan Trọng</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Item 1 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 border-2 border-blue-500">
                                                <span className="text-blue-600 font-bold text-sm">1</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-orange-900">🆔 Chuẩn Bị Giấy Tờ Tùy Thân</p>
                                            <p className="text-xs text-orange-800 mt-1">
                                                Hành khách bắt buộc phải mang theo giấy CMND/CCCD/Hộ chiếu hợp lệ khi lên xe. Không có giấy tờ sẽ không được phép lên xe.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 2 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 border-2 border-green-500">
                                                <span className="text-green-600 font-bold text-sm">2</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-orange-900">⏱️ Giờ Khởi Hành</p>
                                            <p className="text-xs text-orange-800 mt-1">
                                                Xe khởi hành đúng theo giờ quy định. Quý khách vui lòng <strong>có mặt 15 phút trước</strong> giờ khởi hành để kiểm tra, làm thủ tục. Xe sẽ không chờ hành khách muộn.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 3 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 border-2 border-purple-500">
                                                <span className="text-purple-600 font-bold text-sm">3</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-orange-900">📍 Địa Điểm Xuất Phát</p>
                                            <p className="text-xs text-orange-800 mt-1">
                                                Hành khách phải có mặt tại bến xe hoặc điểm xuất phát <strong>ít nhất 30 phút trước</strong> giờ khởi hành. Không chịu trách nhiệm cho những khách hàng tới muộn hoặc lỡ chuyến.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 4 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 border-2 border-red-500">
                                                <span className="text-red-600 font-bold text-sm">4</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-orange-900">🎒 Quy Định Về Hành Lý</p>
                                            <p className="text-xs text-orange-800 mt-1">
                                                <strong>Miễn phí:</strong> Tối đa 1 hành lý kích thước <strong>50×40×25 cm</strong> trọng lượng không quá <strong>15kg</strong>. Hành lý vượt quá quy định sẽ bị tính phí bổ sung hoặc từ chối vận chuyển.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Item 5 */}
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100 border-2 border-yellow-600">
                                                <span className="text-yellow-700 font-bold text-sm">5</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-orange-900">⚠️ Giá Trị Tài Sản Cá Nhân</p>
                                            <p className="text-xs text-orange-800 mt-1">
                                                Công ty <strong>không chịu trách nhiệm</strong> đối với các tài sản quý giá như: điện thoại, laptop, tiền bạc, trang sức, v.v... Vui lòng giữ gìn các vật dụng này cùng bản thân.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkbox */}
                                <div className="mt-5 pt-4 border-t-2 border-orange-300">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-5 h-5 mt-0.5 accent-orange-500 rounded border-2 border-orange-400" />
                                        <span className="text-xs text-orange-900">
                                            <strong>Tôi đã đọc và đồng ý</strong> với toàn bộ điều khoản, lưu ý và chính sách của công ty vận tải. Tôi hiểu rằng việc vi phạm các quy định sẽ dẫn đến hậu quả như bị từ chối lên xe hoặc cấm sử dụng dịch vụ.
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Trip Info & Payment */}
                        <div className="space-y-8 lg:sticky lg:top-6 h-fit">
                            {/* Trip Details */}
                            <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-8 shadow-lg border-2 border-orange-200">
                                <h3 className="text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
                                    <span className="text-2xl">🚌</span> Thông tin chuyến đi
                                </h3>
                                <div className="space-y-5 text-sm">
                                    {[
                                        { label: "Tuyến xe", value: "An Hữu (Tiền Giang) → TP. HCM" },
                                        { label: "Ngày đi", value: "20/01/2024" },
                                        { label: "Giờ khởi hành", value: "15:00 (Chiều)" },
                                        { label: "Thời gian", value: "~2 giờ" },
                                        { label: "Điểm trả khách", value: "TP. Hồ Chí Minh" },
                                    ].map((item) => (
                                        <div key={item.label} className="pb-4 border-b-2 border-orange-200">
                                            <p className="text-orange-600 text-xs font-bold uppercase tracking-wide mb-2">{item.label}</p>
                                            <p className="font-semibold text-slate-900">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-8 shadow-lg border-2 border-orange-300">
                                <h3 className="text-xl font-bold text-orange-900 mb-6 flex items-center gap-2">
                                    <span className="text-2xl">💰</span> Chi tiết giá
                                </h3>
                                <div className="space-y-4 text-sm mb-6 pb-6 border-b-2 border-orange-300">
                                    <div className="flex justify-between items-center bg-white bg-opacity-60 p-3 rounded-lg">
                                        <span className="text-slate-700 font-medium">Giá vé (1 ghế)</span>
                                        <span className="font-bold text-orange-600">180.000đ</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white bg-opacity-60 p-3 rounded-lg">
                                        <span className="text-slate-700 font-medium">Số ghế đã chọn</span>
                                        <span className="font-bold text-orange-600 text-lg">{selectedCount}</span>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
                                    <div className="text-center">
                                        <p className="text-orange-100 text-sm mb-1 font-medium">Tổng tiền</p>
                                        <p className="text-4xl font-black">{totalPrice.toLocaleString('vi-VN')}₫</p>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Button */}
                            <button
                                disabled={!isFormValid}
                                className={`w-full py-4 rounded-lg font-bold text-white transition-all text-lg shadow-lg ${isFormValid
                                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl active:scale-95 cursor-pointer"
                                    : "bg-slate-300 cursor-not-allowed opacity-60"
                                    }`}
                            >
                                {isFormValid ? `💳 Thanh toán ${selectedCount} ghế` : "Điền đầy đủ thông tin"}
                            </button>

                            {/* Help Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-xs text-blue-900 shadow-sm">
                                <p className="font-bold mb-2">ℹ️ Hỗ trợ thanh toán</p>
                                <p>
                                    Liên hệ <span className="font-bold text-blue-700">1800-XXXXX</span> nếu có bất kỳ thắc mắc
                                </p>
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