import React, { useState } from 'react';
import { MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface TripStop {
    time: string;
    location: string;
    address: string;
    isArrival?: boolean;
}

interface TripDetailProps {
    departureTime: string;
    departureLocation: string;
    arrivalTime: string;
    arrivalLocation: string;
    duration: string;
    distance: string;
    date: string;
    stops: TripStop[];
    vehicleType: string;
}

const TripDetail: React.FC<TripDetailProps> = ({
    departureTime,
    departureLocation,
    arrivalTime,
    arrivalLocation,
    duration,
    distance,
    date,
    stops,
    vehicleType,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="w-full">
            {/* Summary Card */}
            <div className="bg-white border border-black/10 rounded-2xl p-6 mb-4 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <div className="text-2xl font-bold text-gray-900">{departureTime}</div>
                        <div className="text-sm text-gray-600 mt-1">{departureLocation}</div>
                    </div>

                    {/* Timeline */}
                    <div className="flex-1 px-8">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full border-2 border-green-500 bg-white"></div>
                            <div className="flex-1 h-1 bg-gray-300"></div>
                            <div className="w-3 h-3 rounded-full border-2 border-orange-500 bg-white"></div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-semibold text-gray-900">{duration}</div>
                            <div className="text-sm text-gray-500">{distance}</div>
                        </div>
                    </div>

                    <div className="flex-1 text-right">
                        <div className="text-2xl font-bold text-gray-900">{arrivalTime}</div>
                        <div className="text-sm text-gray-600 mt-1">{arrivalLocation}</div>
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-sm">•</span>
                        <span className="text-sm font-medium">{vehicleType}</span>
                        <span className="text-sm text-gray-500 ml-2">{date}</span>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                        {isExpanded ? (
                            <>
                                <span>Thu gọn</span>
                                <ChevronUp size={20} />
                            </>
                        ) : (
                            <>
                                <span>Xem chi tiết</span>
                                <ChevronDown size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Expanded Details - Timeline */}
            {isExpanded && (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 animate-in fade-in duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-8">Lộ trình chuyến đi</h3>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-gray-300 to-orange-500"></div>

                        {/* Stops */}
                        <div className="space-y-8">
                            {stops.map((stop, index) => (
                                <div key={index} className="relative pl-16">
                                    {/* Timeline Dot */}
                                    <div
                                        className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center border-4 bg-white ${index === 0
                                            ? 'border-green-500 bg-green-50'
                                            : index === stops.length - 1
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-400 bg-gray-50'
                                            }`}
                                    >
                                        <MapPin
                                            size={20}
                                            className={`${index === 0
                                                ? 'text-green-600'
                                                : index === stops.length - 1
                                                    ? 'text-orange-600'
                                                    : 'text-gray-600'
                                                }`}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock size={16} className="text-gray-500" />
                                                    <span className="text-sm font-bold text-gray-900">{stop.time}</span>
                                                </div>
                                                <div className="font-semibold text-gray-900 mb-1">{stop.location}</div>
                                                <div className="text-sm text-gray-500">{stop.address}</div>
                                            </div>
                                            {index === 0 && (
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                                                    Khởi hành
                                                </span>
                                            )}
                                            {index === stops.length - 1 && (
                                                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                                                    Kết thúc
                                                </span>
                                            )}
                                            {index > 0 && index < stops.length - 1 && (
                                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                                    Điểm dừng
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-10 flex gap-4 justify-end">
                        <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                            Hủy bỏ
                        </button>
                        <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                            Xác nhận đi chuyên
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function TripDetailsDemo() {
    const sampleTrip: TripDetailProps = {
        departureTime: '15:00',
        departureLocation: 'An Hữu (Tiền Giang)',
        arrivalTime: '17:00',
        arrivalLocation: 'TP. Hồ Chí Minh',
        duration: '2 giờ',
        distance: '115km',
        date: '28/1/2026',
        vehicleType: 'Limousine',
        stops: [
            {
                time: '15:00',
                location: 'An Hữu',
                address: 'An Thái Trung, Cái Bè, Tiền Giang, Việt Nam',
            },
            {
                time: '16:40',
                location: 'An Hữu',
                address: 'ĐCT Bắc - Nam phía Đông/CT01',
            },
            {
                time: '17:00',
                location: 'TP. Hồ Chí Minh',
                address: '',
                isArrival: true,
            },
        ],
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
            <div className="w-full max-w-6xl mx-auto
                border border-black/10
                rounded-3xl
                bg-white
                shadow-md
                p-6
            ">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách Chuyến lái</h1>
                    <p className="text-gray-600">Chi tiết lộ trình và điểm dừng chuyến đi</p>
                </div>
                <TripDetail {...sampleTrip} />
            </div>
        </div>
    );
}