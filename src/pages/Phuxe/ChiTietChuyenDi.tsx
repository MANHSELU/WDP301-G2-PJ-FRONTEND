import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CrewMember {
    name: string;
    phone: string;
    license?: string;
    role: string;
    status: 'accepted' | 'not_accepted';
    avatar: string;
}

interface TripDetail {
    id: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    from: string;
    to: string;
    vehicle: string;
    licensePlate: string;
    totalSeats: number;
    bookedSeats: number;
    tripStatus: 'not_started' | 'in_progress' | 'completed';
    drivers: CrewMember[];
    assistants: CrewMember[];
}

interface Passenger {
    id: string;
    name: string;
    phone: string;
    seat: string;
    pickup: string;
    dropoff: string;
    bookingStatus: 'confirmed' | 'pending' | 'cancelled';
    paymentStatus: 'paid' | 'unpaid';
    paymentMethod: 'cash' | 'banking' | 'momo';
    price: string;
    bookedAt: string;
}

interface CargoItem {
    id: string;
    name: string;
    weight: string;
    senderName: string;
    senderPhone: string;
    receiverName: string;
    receiverPhone: string;
    pickup: string;
    dropoff: string;
    price: string;
    paymentStatus: 'paid' | 'unpaid';
    deliveryStatus: 'delivered' | 'undelivered';
    bookedAt: string;
    note?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const trip: TripDetail = {
    id: 'TX001',
    date: '28/01/2026',
    departureTime: '15:00',
    arrivalTime: '17:00',
    from: 'An hữu (Tiền Giang)',
    to: 'TP. Hồ Chí Minh',
    vehicle: 'Limousine 16 chỗ',
    licensePlate: '51B-12345',
    totalSeats: 16,
    bookedSeats: 12,
    tripStatus: 'in_progress',
    drivers: [
        { name: 'Nguyễn Văn Tài', phone: '0901 234 567', license: 'B2-098765', role: 'Tài xế chính', status: 'accepted', avatar: 'NT' },
        { name: 'Lê Hoàng Nam', phone: '0911 222 333', license: 'B2-112233', role: 'Tài xế phụ', status: 'accepted', avatar: 'LN' },
    ],
    assistants: [
        { name: 'Trần Minh Phụ', phone: '0912 345 678', role: 'Phụ xe ca ngày', status: 'accepted', avatar: 'TP' },
        { name: 'Đinh Thị Lan', phone: '0933 444 555', role: 'Phụ xe ca chiều', status: 'not_accepted', avatar: 'DL' },
    ],
};

const passengers: Passenger[] = [
    { id: '1', name: 'Trần Thị Mai', phone: '0901 234 567', seat: 'A01', pickup: 'An hữu', dropoff: 'Quận 1', bookingStatus: 'confirmed', paymentStatus: 'paid', paymentMethod: 'momo', price: '350,000đ', bookedAt: '27/01 14:30' },
    { id: '2', name: 'Nguyễn Văn Bình', phone: '0912 345 678', seat: 'A02', pickup: 'An hữu', dropoff: 'Quận 3', bookingStatus: 'confirmed', paymentStatus: 'paid', paymentMethod: 'cash', price: '350,000đ', bookedAt: '27/01 15:00' },
    { id: '3', name: 'Lê Thị Hoa', phone: '0923 456 789', seat: 'B01', pickup: 'An hữu', dropoff: 'Quận 5', bookingStatus: 'pending', paymentStatus: 'unpaid', paymentMethod: 'banking', price: '350,000đ', bookedAt: '27/01 16:10' },
    { id: '4', name: 'Phạm Minh Tuấn', phone: '0934 567 890', seat: 'B02', pickup: 'An hữu', dropoff: 'Thủ Đức', bookingStatus: 'confirmed', paymentStatus: 'paid', paymentMethod: 'momo', price: '350,000đ', bookedAt: '27/01 16:45' },
    { id: '5', name: 'Đặng Mỹ Linh', phone: '0945 678 901', seat: 'C01', pickup: 'An hữu', dropoff: 'Bình Thạnh', bookingStatus: 'cancelled', paymentStatus: 'unpaid', paymentMethod: 'banking', price: '350,000đ', bookedAt: '27/01 17:00' },
    { id: '6', name: 'Vũ Hoàng Sơn', phone: '0956 789 012', seat: 'C02', pickup: 'An hữu', dropoff: 'Tân Bình', bookingStatus: 'confirmed', paymentStatus: 'paid', paymentMethod: 'cash', price: '350,000đ', bookedAt: '27/01 17:30' },
];

const cargoList: CargoItem[] = [
    { id: '1', name: 'Thùng trái cây', weight: '5kg', senderName: 'Nguyễn Văn A', senderPhone: '0901 111 111', receiverName: 'Lê Văn B', receiverPhone: '0902 222 222', pickup: 'An hữu', dropoff: 'Quận 5', price: '200,000đ', paymentStatus: 'paid', deliveryStatus: 'delivered', bookedAt: '27/01 12:00' },
    { id: '2', name: 'Linh kiện điện tử', weight: '10kg', senderName: 'Phạm Văn C', senderPhone: '0903 333 333', receiverName: 'Trần Văn D', receiverPhone: '0904 444 444', pickup: 'An hữu', dropoff: 'Thủ Đức', price: '350,000đ', paymentStatus: 'unpaid', deliveryStatus: 'undelivered', bookedAt: '27/01 13:00', note: 'Hàng dễ vỡ, cẩn thận' },
    { id: '3', name: 'Quần áo thời trang', weight: '3kg', senderName: 'Hoàng Thị E', senderPhone: '0905 555 555', receiverName: 'Đinh Văn F', receiverPhone: '0906 666 666', pickup: 'An hữu', dropoff: 'Quận 1', price: '150,000đ', paymentStatus: 'paid', deliveryStatus: 'undelivered', bookedAt: '27/01 14:00' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const paymentMethodLabel = (m: string) => {
    if (m === 'momo') return '💜 MoMo';
    if (m === 'banking') return '🏦 Banking';
    return '💵 Tiền mặt';
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusPill: React.FC<{ label: string; color: string }> = ({ label, color }) => (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>{label}</span>
);

const InfoBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-white rounded-xl p-3">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
);

const CrewCard: React.FC<{ member: CrewMember; accentFrom: string; accentTo: string; labelColor: string; label: string }> = ({
    member, accentFrom, accentTo, labelColor, label
}) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col">
        <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${labelColor}`}>{label}</p>
        <div className="flex items-center gap-3 flex-1">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accentFrom} ${accentTo} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                {member.avatar}
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-sm truncate">{member.name}</p>
                <p className="text-xs text-gray-500">{member.phone}</p>
                {member.license && <p className="text-xs text-gray-400">GPLX: {member.license}</p>}
                <p className="text-xs text-gray-400">{member.role}</p>
            </div>
        </div>
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">Nhận việc</span>
            {member.status === 'accepted'
                ? <StatusPill label="✓ Đã nhận" color="bg-green-100 text-green-700" />
                : <StatusPill label="✗ Chưa nhận" color="bg-red-100 text-red-700" />
            }
        </div>
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const TripDetailPage: React.FC = () => {
    const [tab, setTab] = useState<'passengers' | 'cargo'>('passengers');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const PER_PAGE = 3;

    const data = tab === 'passengers' ? passengers : cargoList;
    const totalPages = Math.ceil(data.length / PER_PAGE);
    const currentData = data.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const paidPassengers = passengers.filter(p => p.paymentStatus === 'paid').length;
    const confirmedPassengers = passengers.filter(p => p.bookingStatus === 'confirmed').length;
    const deliveredCargo = cargoList.filter(c => c.deliveryStatus === 'delivered').length;

    const tripStatusConfig = {
        not_started: { label: 'Chưa khởi hành', pill: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', bar: '0%' },
        in_progress: { label: 'Đang di chuyển', pill: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', bar: '55%' },
        completed: { label: 'Đã hoàn thành', pill: 'bg-green-100 text-green-700', dot: 'bg-green-500', bar: '100%' },
    };
    const ts = tripStatusConfig[trip.tripStatus];

    const bookingColors: Record<string, string> = {
        confirmed: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        cancelled: 'bg-red-100 text-red-700',
    };
    const bookingLabels: Record<string, string> = {
        confirmed: 'Xác nhận',
        pending: 'Chờ xác nhận',
        cancelled: 'Đã hủy',
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Top bar ────────────────────────────────────────────────── */}
            <div className="bg-white border-b border-gray-200 px-4 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <button className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-bold text-gray-900 text-lg leading-tight">Chi tiết chuyến đi</h1>
                        <p className="text-sm text-gray-400">#{trip.id} • {trip.date}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 ${ts.pill}`}>
                        <span className={`w-2 h-2 rounded-full ${ts.dot}`}></span>
                        {ts.label}
                    </span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">

                {/* ── Route card ─────────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center gap-3">
                        <div className="text-center min-w-0">
                            <p className="text-3xl font-black text-gray-900">{trip.departureTime}</p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{trip.from}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1 px-2">
                            <div className="flex items-center w-full gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0 ring-2 ring-green-200"></div>
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-green-400 to-orange-400 rounded-full" style={{ width: ts.bar }}></div>
                                </div>
                                <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 ring-2 ring-orange-200"></div>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">2 giờ • 115km</p>
                        </div>
                        <div className="text-center min-w-0">
                            <p className="text-3xl font-black text-gray-900">{trip.arrivalTime}</p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{trip.to}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 pt-3 mt-3 border-t border-gray-100">
                        <span>🚌 {trip.vehicle}</span>
                        <span>🔑 {trip.licensePlate}</span>
                        <span>💺 {trip.bookedSeats}/{trip.totalSeats} ghế đã đặt</span>
                    </div>
                </div>

                {/* ── Crew — 2 Tài xế + 2 Phụ xe ────────────────────────────── */}
                <div>
                    {/* Section label */}
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">👥 Danh sách nhân viên</p>

                    {/* Tài xế row */}
                    <p className="text-xs font-semibold text-orange-500 mb-2 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold">2</span>
                        Tài xế
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        {trip.drivers.map((d, i) => (
                            <CrewCard
                                key={i}
                                member={d}
                                label={`🚗 ${d.role}`}
                                labelColor="text-orange-500"
                                accentFrom="from-orange-400"
                                accentTo="to-orange-600"
                            />
                        ))}
                    </div>

                    {/* Phụ xe row */}
                    <p className="text-xs font-semibold text-blue-500 mb-2 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">2</span>
                        Phụ xe
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {trip.assistants.map((a, i) => (
                            <CrewCard
                                key={i}
                                member={a}
                                label={`👤 ${a.role}`}
                                labelColor="text-blue-500"
                                accentFrom="from-blue-400"
                                accentTo="to-blue-600"
                            />
                        ))}
                    </div>
                </div>

                {/* ── Stats ──────────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Hành khách', value: `${trip.bookedSeats}`, sub: `${confirmedPassengers} xác nhận`, border: 'border-orange-200', bg: 'bg-orange-50', val: 'text-orange-600' },
                        { label: 'Đã thanh toán', value: `${paidPassengers}/${passengers.length}`, sub: 'khách', border: 'border-green-200', bg: 'bg-green-50', val: 'text-green-600' },
                        { label: 'Hàng hóa', value: `${cargoList.length}`, sub: `${deliveredCargo} đã giao`, border: 'border-blue-200', bg: 'bg-blue-50', val: 'text-blue-600' },
                        { label: 'Doanh thu', value: '4.8M', sub: 'VNĐ', border: 'border-purple-200', bg: 'bg-purple-50', val: 'text-purple-600' },
                    ].map((s, i) => (
                        <div key={i} className={`rounded-2xl border ${s.border} ${s.bg} p-4`}>
                            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                            <p className={`text-2xl font-black ${s.val}`}>{s.value}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Tabs + List ────────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                    <div className="flex">
                        {(['passengers', 'cargo'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setPage(1); setExpandedId(null); }}
                                className={`flex-1 py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tab === t ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {t === 'passengers'
                                    ? <>👥 Hành khách ({passengers.length})</>
                                    : <>📦 Hàng hóa ({cargoList.length})</>
                                }
                            </button>
                        ))}
                    </div>

                    <div className="p-4 space-y-3">

                        {/* Passengers */}
                        {tab === 'passengers' && (currentData as Passenger[]).map((p) => {
                            const open = expandedId === p.id;
                            return (
                                <div key={p.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-4 flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-bold text-base flex-shrink-0">
                                            {p.name.trim().split(' ').pop()![0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-bold text-gray-900 truncate">{p.name}</p>
                                                    <p className="text-sm text-gray-400">{p.phone}</p>
                                                </div>
                                                <p className="font-bold text-gray-900 text-sm flex-shrink-0">{p.price}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                <StatusPill label={`Ghế ${p.seat}`} color="bg-orange-100 text-orange-700" />
                                                <StatusPill label={bookingLabels[p.bookingStatus]} color={bookingColors[p.bookingStatus]} />
                                                <StatusPill
                                                    label={p.paymentStatus === 'paid' ? '✓ Đã TT' : '✗ Chưa TT'}
                                                    color={p.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 pb-3 flex justify-end">
                                        <button onClick={() => setExpandedId(open ? null : p.id)} className="text-xs text-orange-500 font-semibold hover:text-orange-700">
                                            {open ? '▲ Thu gọn' : '▼ Xem chi tiết'}
                                        </button>
                                    </div>
                                    {open && (
                                        <div className="border-t border-gray-100 bg-gray-50 p-4 grid grid-cols-2 gap-2">
                                            <InfoBox label="Điểm đón" value={p.pickup} />
                                            <InfoBox label="Điểm xuống" value={p.dropoff} />
                                            <InfoBox label="Thanh toán" value={paymentMethodLabel(p.paymentMethod)} />
                                            <InfoBox label="Đặt lúc" value={p.bookedAt} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Cargo */}
                        {tab === 'cargo' && (currentData as CargoItem[]).map((c) => {
                            const open = expandedId === c.id;
                            return (
                                <div key={c.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-4 flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-bold text-gray-900 truncate">{c.name}</p>
                                                    <p className="text-sm text-gray-400">{c.senderName} → {c.receiverName}</p>
                                                </div>
                                                <p className="font-bold text-gray-900 text-sm flex-shrink-0">{c.price}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                <StatusPill label={c.weight} color="bg-gray-100 text-gray-600" />
                                                <StatusPill label={c.paymentStatus === 'paid' ? '✓ Đã TT' : '✗ Chưa TT'} color={c.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} />
                                                <StatusPill label={c.deliveryStatus === 'delivered' ? '📦 Đã giao' : '⏳ Chưa giao'} color={c.deliveryStatus === 'delivered' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 pb-3 flex justify-end">
                                        <button onClick={() => setExpandedId(open ? null : c.id)} className="text-xs text-orange-500 font-semibold hover:text-orange-700">
                                            {open ? '▲ Thu gọn' : '▼ Xem chi tiết'}
                                        </button>
                                    </div>
                                    {open && (
                                        <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <InfoBox label="Người gửi" value={c.senderName} />
                                                <InfoBox label="SĐT gửi" value={c.senderPhone} />
                                                <InfoBox label="Người nhận" value={c.receiverName} />
                                                <InfoBox label="SĐT nhận" value={c.receiverPhone} />
                                                <InfoBox label="Lấy hàng tại" value={c.pickup} />
                                                <InfoBox label="Giao đến" value={c.dropoff} />
                                                <InfoBox label="Gửi lúc" value={c.bookedAt} />
                                            </div>
                                            {c.note && (
                                                <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2.5">
                                                    <span className="flex-shrink-0">⚠️</span>
                                                    <p className="text-sm text-yellow-800 font-medium">{c.note}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-center gap-2">
                            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-orange-50 text-gray-700'}`}>
                                Trước
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button key={i} onClick={() => setPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg text-sm font-bold border transition-colors ${page === i + 1 ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-orange-50 text-gray-700'}`}>
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-orange-50 text-gray-700'}`}>
                                Sau
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Actions ────────────────────────────────────────────────── */}
                <div className="flex justify-end gap-3 pb-4">
                    <button className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                        Xuất báo cáo
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm">
                        In danh sách
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TripDetailPage;