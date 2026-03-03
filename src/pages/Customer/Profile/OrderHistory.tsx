import React, { useState } from 'react';

interface Order {
    id: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    departureLocation: string;
    arrivalLocation: string;
    duration: string;
    distance: string;
    seats: number;
    schedule: string;
    vehicleType: string;
    seatClass: string;
    status: 'completed' | 'pending' | 'cancelled';
    statusText: string;
}

const OrderHistory: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const orders: Order[] = [
        {
            id: '1',
            date: '28/01/2026',
            departureTime: '15:00',
            arrivalTime: '17:00',
            departureLocation: 'An hữu (Trên Giang)',
            arrivalLocation: 'TP. Hồ Chí Minh',
            duration: '2 giờ',
            distance: '640km',
            seats: 1,
            schedule: 'Lịch Trình',
            vehicleType: 'Limosine',
            seatClass: 'Ghế A03',
            status: 'completed',
            statusText: 'Hoàn thành'
        },
        {
            id: '2',
            date: '30/01/2026',
            departureTime: '15:00',
            arrivalTime: '17:00',
            departureLocation: 'An hữu (Trên Giang)',
            arrivalLocation: 'TP. Hồ Chí Minh',
            duration: '2 giờ',
            distance: '640km',
            seats: 0,
            schedule: 'Lịch Trình',
            vehicleType: 'Limosine',
            seatClass: 'Gửi hàng',
            status: 'pending',
            statusText: 'Chờ tiết'
        }
    ];

    const totalPages = 3;

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-orange-500 text-white';
            case 'pending':
                return 'bg-orange-500 text-white';
            case 'cancelled':
                return 'bg-gray-400 text-white';
            default:
                return 'bg-gray-400 text-white';
        }
    };

    const getSeatClassColor = (seatClass: string) => {
        if (seatClass.startsWith('Ghế')) {
            return 'bg-green-100 text-green-700';
        }
        return 'bg-green-100 text-green-700';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                        >
                            {/* Header with time and date */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-gray-800">{order.departureTime}</div>
                                        <div className="text-xs text-gray-500">{order.departureLocation}</div>
                                    </div>

                                    <div className="flex flex-col items-center flex-1 px-4">
                                        <div className="flex items-center w-full">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <div className="flex-1 h-0.5 bg-gradient-to-r from-green-500 to-orange-500 mx-2"></div>
                                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">{order.date}</div>
                                        <div className="text-xs text-gray-500">{order.duration} {order.distance}</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-xl font-bold text-gray-800">{order.arrivalTime}</div>
                                        <div className="text-xs text-gray-500">{order.arrivalLocation}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="font-semibold text-gray-700">{order.seats} ghế</span>
                                    <span className="text-gray-500">{order.schedule}</span>
                                    <span className="text-gray-500">• {order.vehicleType}</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeatClassColor(order.seatClass)}`}>
                                        {order.seatClass}
                                    </span>
                                </div>

                                <button className={`px-6 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)} transition-all hover:shadow-md`}>
                                    {order.statusText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center space-x-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        disabled={currentPage === 1}
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {[1, 2, 3].map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full font-medium transition-all ${currentPage === page
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        disabled={currentPage === totalPages}
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;