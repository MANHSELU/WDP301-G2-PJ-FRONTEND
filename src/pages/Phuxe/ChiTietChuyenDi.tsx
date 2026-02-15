import React, { useState } from 'react';

interface Customer {
    id: string;
    name: string;
    phone: string;
    email: string;
    seatNumber: string;
    seatRow: number;
    seatColumn: number;
    pickupLocation: string;
    dropoffLocation: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    ticketPrice: string;
    bookingTime: string;
    paymentMethod: 'cash' | 'banking' | 'momo';
    paymentStatus: 'paid' | 'unpaid';
}

interface Cargo {
    id: string;
    cargoName: string;
    senderName: string;
    senderPhone: string;
    receiverName: string;
    receiverPhone: string;
    pickupLocation: string;
    dropoffLocation: string;
    weight: string;
    price: string;
    bookingTime: string;
    paymentMethod: 'cash' | 'banking' | 'momo';
    paymentStatus: 'paid' | 'unpaid';
    deliveryStatus: 'delivered' | 'undelivered';
}

interface TripDetail {
    id: string;
    departureTime: string;
    arrivalTime: string;
    departureLocation: string;
    arrivalLocation: string;
    vehicleType: string;
    date: string;
    licensePlate: string;
    totalSeats: number;
    bookedSeats: number;
    totalRevenue: string;
}

const TripDetailPage: React.FC = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'customers' | 'cargo'>('customers');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const tripDetail: TripDetail = {
        id: '1',
        departureTime: '15:00',
        arrivalTime: '17:00',
        departureLocation: 'An hữu (Tiền Giang)',
        arrivalLocation: 'TP. Hồ Chí Minh',
        vehicleType: 'Limousine 16 chỗ',
        date: '28/01/2026',
        licensePlate: '51B-12345',
        totalSeats: 16,
        bookedSeats: 12,
        totalRevenue: '4,800,000đ'
    };

    const customers: Customer[] = [
        {
            id: '1',
            name: 'Trần Thị Mai',
            phone: '0901234567',
            email: 'tran@email.com',
            seatNumber: 'A01',
            seatRow: 1,
            seatColumn: 1,
            pickupLocation: 'An hữu',
            dropoffLocation: 'Quận 1',
            status: 'confirmed',
            ticketPrice: '350,000đ',
            bookingTime: '27/01/2026 14:30',
            paymentMethod: 'momo',
            paymentStatus: 'paid'
        },
        {
            id: '2',
            name: 'Nguyễn Văn Bình',
            phone: '0912345678',
            email: 'binh@email.com',
            seatNumber: 'A02',
            seatRow: 1,
            seatColumn: 2,
            pickupLocation: 'An hữu',
            dropoffLocation: 'Quận 3',
            status: 'confirmed',
            ticketPrice: '350,000đ',
            bookingTime: '27/01/2026 15:00',
            paymentMethod: 'cash',
            paymentStatus: 'paid'
        },
        {
            id: '3',
            name: 'Lê Thị Hoa',
            phone: '0923456789',
            email: 'hoa@email.com',
            seatNumber: 'B01',
            seatRow: 2,
            seatColumn: 1,
            pickupLocation: 'An hữu',
            dropoffLocation: 'Quận 5',
            status: 'pending',
            ticketPrice: '350,000đ',
            bookingTime: '27/01/2026 16:10',
            paymentMethod: 'banking',
            paymentStatus: 'unpaid'
        },
        {
            id: '4',
            name: 'Phạm Minh Tuấn',
            phone: '0934567890',
            email: 'tuan@email.com',
            seatNumber: 'B02',
            seatRow: 2,
            seatColumn: 2,
            pickupLocation: 'An hữu',
            dropoffLocation: 'Thủ Đức',
            status: 'confirmed',
            ticketPrice: '350,000đ',
            bookingTime: '27/01/2026 16:45',
            paymentMethod: 'momo',
            paymentStatus: 'paid'
        },
        {
            id: '5',
            name: 'Đặng Mỹ Linh',
            phone: '0945678901',
            email: 'linh@email.com',
            seatNumber: 'C01',
            seatRow: 3,
            seatColumn: 1,
            pickupLocation: 'An hữu',
            dropoffLocation: 'Bình Thạnh',
            status: 'cancelled',
            ticketPrice: '350,000đ',
            bookingTime: '27/01/2026 17:00',
            paymentMethod: 'banking',
            paymentStatus: 'unpaid'
        }
    ];

    const cargoList: Cargo[] = [
        {
            id: '1',
            cargoName: 'Thùng trái cây',
            senderName: 'Nguyễn Văn A',
            senderPhone: '0901111111',
            receiverName: 'Lê Văn B',
            receiverPhone: '0902222222',
            pickupLocation: 'An hữu',
            dropoffLocation: 'Quận 5',
            weight: '5kg',
            price: '200,000đ',
            bookingTime: '27/01/2026 12:00',
            paymentMethod: 'cash',
            paymentStatus: 'paid',
            deliveryStatus: 'delivered'
        },
        {
            id: '2',
            cargoName: 'Linh kiện điện tử',
            senderName: 'Phạm Văn C',
            senderPhone: '0903333333',
            receiverName: 'Trần Văn D',
            receiverPhone: '0904444444',
            pickupLocation: 'An hữu',
            dropoffLocation: 'Thủ Đức',
            weight: '10kg',
            price: '350,000đ',
            bookingTime: '27/01/2026 13:00',
            paymentMethod: 'momo',
            paymentStatus: 'unpaid',
            deliveryStatus: 'undelivered'
        }
    ];

    const data = activeTab === 'customers' ? customers : cargoList;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const getPaymentStatusColor = (status: 'paid' | 'unpaid') =>
        status === 'paid'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700';

    const getDeliveryStatusColor = (status: Cargo['deliveryStatus']) =>
        status === 'delivered'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-yellow-100 text-yellow-700';

    return (
        <div className="space-y-6">

            {/* Tabs */}
            <div className="flex gap-4">
                <button
                    onClick={() => {
                        setActiveTab('customers');
                        setCurrentPage(1);
                        setExpandedId(null);
                    }}
                    className={`px-4 py-2 rounded-xl border ${activeTab === 'customers'
                        ? 'bg-orange-500 text-white'
                        : ''}`}
                >
                    Danh sách khách hàng
                </button>

                <button
                    onClick={() => {
                        setActiveTab('cargo');
                        setCurrentPage(1);
                        setExpandedId(null);
                    }}
                    className={`px-4 py-2 rounded-xl border ${activeTab === 'cargo'
                        ? 'bg-orange-500 text-white'
                        : ''}`}
                >
                    Danh sách hàng hóa
                </button>
            </div>

            {/* Trip Info */}
            <div className="bg-white rounded-3xl shadow-sm border p-6">
                <h2 className="text-xl font-bold">
                    {tripDetail.departureLocation} → {tripDetail.arrivalLocation}
                </h2>
                <p className="text-gray-600">
                    {tripDetail.date} • {tripDetail.vehicleType}
                </p>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl shadow-sm border p-6 space-y-4">
                {currentData.map((item) => {
                    const isExpanded = expandedId === item.id;

                    return (
                        <div key={item.id} className="border rounded-2xl p-5">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg">
                                        {activeTab === 'customers'
                                            ? (item as Customer).name
                                            : (item as Cargo).cargoName}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {activeTab === 'customers'
                                            ? `Ghế ${(item as Customer).seatNumber} • Xuống ${(item as Customer).dropoffLocation}`
                                            : `Nhận tại ${(item as Cargo).pickupLocation} • ${(item as Cargo).weight} • ${(item as Cargo).price}`}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getPaymentStatusColor(item.paymentStatus)}`}>
                                        {item.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>

                                    {activeTab === 'cargo' && (
                                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getDeliveryStatusColor((item as Cargo).deliveryStatus)}`}>
                                            {(item as Cargo).deliveryStatus === 'delivered'
                                                ? 'Đã giao'
                                                : 'Chưa giao'}
                                        </span>
                                    )}

                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                        className="text-sm text-orange-500 font-semibold"
                                    >
                                        {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="mt-4 pt-4 border-t grid md:grid-cols-3 gap-4 text-sm">
                                    {activeTab === 'customers' ? (
                                        <>
                                            <InfoBox label="SĐT" value={(item as Customer).phone} />
                                            <InfoBox label="Email" value={(item as Customer).email} />
                                            <InfoBox label="Điểm đón" value={(item as Customer).pickupLocation} />
                                            <InfoBox label="Điểm xuống" value={(item as Customer).dropoffLocation} />
                                            <InfoBox label="Thời gian đặt" value={(item as Customer).bookingTime} />
                                        </>
                                    ) : (
                                        <>
                                            <InfoBox label="Người gửi" value={(item as Cargo).senderName} />
                                            <InfoBox label="SĐT gửi" value={(item as Cargo).senderPhone} />
                                            <InfoBox label="Người nhận" value={(item as Cargo).receiverName} />
                                            <InfoBox label="SĐT nhận" value={(item as Cargo).receiverPhone} />
                                            <InfoBox label="Điểm giao hàng" value={(item as Cargo).dropoffLocation} />
                                            <InfoBox label="Thời gian gửi" value={(item as Cargo).bookingTime} />
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    {/* Previous */}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-xl border text-sm font-semibold ${currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'hover:bg-orange-50'
                            }`}
                    >
                        Trước
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-4 py-2 rounded-xl border text-sm font-semibold ${currentPage === index + 1
                                    ? 'bg-orange-500 text-white'
                                    : 'hover:bg-orange-50'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    {/* Next */}
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-xl border text-sm font-semibold ${currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'hover:bg-orange-50'
                            }`}
                    >
                        Sau
                    </button>
                </div>
            )}

        </div>
    );
};

const InfoBox = ({ label, value }: { label: string; value: string }) => (
    <div className="p-3 bg-gray-50 rounded-xl">
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="font-semibold">{value}</p>
    </div>
);

export default TripDetailPage;
