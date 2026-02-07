import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Trip {
    id: number;
    departureTime: string;
    departureLocation: string;
    arrivalTime: string;
    arrivalLocation: string;
    duration: string;
    distance: string;
    vehicleType: string;
    date: string;
}

const trips: Trip[] = [
    {
        id: 1,
        departureTime: '15:00',
        departureLocation: 'An Hữu (Tiền Giang)',
        arrivalTime: '17:00',
        arrivalLocation: 'TP. Hồ Chí Minh',
        duration: '2 giờ',
        distance: '115km',
        vehicleType: 'Limousine',
        date: '28/1/2026',
    },
    {
        id: 2,
        departureTime: '13:00',
        departureLocation: 'Huế',
        arrivalTime: '15:00',
        arrivalLocation: 'Đà Nẵng',
        duration: '2 giờ',
        distance: '96km',
        vehicleType: 'Limousine',
        date: '30/1/2026',
    },
    {
        id: 3,
        departureTime: '17:00',
        departureLocation: 'TP. Hồ Chí Minh',
        arrivalTime: '19:00',
        arrivalLocation: 'Tiền Giang',
        duration: '2 giờ',
        distance: '115km',
        vehicleType: 'Limousine',
        date: '5/2/2026',
    },
];

export function ViewTrip() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTrip, setSelectedTrip] = useState<number | null>(null);
    const itemsPerPage = 1;
    const totalPages = Math.ceil(trips.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedTrips = trips.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    const handleSelectTrip = (tripId: number) => {
        setSelectedTrip(selectedTrip === tripId ? null : tripId);
    };
    return (
        <>


            {/* Main Content */}
            <div
                className="
                w-full
                border border-black/10
                rounded-3xl
                bg-white
                shadow-md
                p-8
            "
            >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-8">
                    Danh sách Chuyến lái
                </h2>

                {/* Trips Display */}
                <div className="space-y-6">
                    {displayedTrips.map(trip => (
                        <div
                            key={trip.id}
                            className={`border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg ${selectedTrip === trip.id
                                ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 shadow-lg'
                                : 'border-orange-200 hover:border-orange-400 hover:shadow-lg'
                                }`}
                            onClick={() => handleSelectTrip(trip.id)}
                        >
                            {/* Header with times and locations */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-gray-900">{trip.departureTime}</div>
                                    <div className="text-sm text-gray-600 mt-1">{trip.departureLocation}</div>
                                </div>

                                {/* Timeline/Route */}
                                <div className="flex-1 px-8">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full border-2 border-green-500 bg-white"></div>
                                        <div className="flex-1 h-1 bg-gray-300"></div>
                                        <div className="w-3 h-3 rounded-full border-2 border-orange-300 bg-white"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-semibold text-gray-900">{trip.duration}</div>
                                        <div className="text-sm text-gray-500">{trip.distance}</div>
                                    </div>
                                </div>

                                <div className="flex-1 text-right">
                                    <div className="text-2xl font-bold text-gray-900">{trip.arrivalTime}</div>
                                    <div className="text-sm text-gray-600 mt-1">{trip.arrivalLocation}</div>
                                </div>
                            </div>

                            {/* Vehicle and Date Info */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span className="text-sm">•</span>
                                    <span className="text-sm font-medium">{trip.vehicleType}</span>
                                    <span className="text-sm text-gray-500 ml-2">{trip.date}</span>
                                </div>
                                <Link to={"/driverBooking/tripdetail"} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    Xác Nhận
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-3 mt-10 p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-md"
                    >
                        <ChevronLeft size={22} className="text-orange-600 font-bold" />
                    </button>

                    <div className="flex gap-3">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg font-bold transition-all duration-300 transform hover:scale-110 ${page === currentPage
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                    : 'bg-white text-orange-600 border-2 border-orange-300 hover:bg-orange-100'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-md"
                    >
                        <ChevronRight size={22} className="text-orange-600 font-bold" />
                    </button>
                </div>
            </div>
        </>
    )
}