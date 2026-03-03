import { useState } from "react";
import { Link } from "react-router-dom";

interface Trip {
    id: string;
    departureTime: string;
    arrivalTime: string;
    departureLocation: string;
    arrivalLocation: string;
    duration: string;
    distance: string;
    vehicleType: string;
    date: string;
}
export function DanhSachChuyenDi() {
    const [currentPage, setCurrentPage] = useState(1);

    const trips: Trip[] = [
        {
            id: "1",
            departureTime: "15:00",
            arrivalTime: "17:00",
            departureLocation: "An Hữu (Tiền Giang)",
            arrivalLocation: "TP. Hồ Chí Minh",
            duration: "2 giờ",
            distance: "115km",
            vehicleType: "Limousine",
            date: "28/1/2026",
        },
        {
            id: "2",
            departureTime: "13:00",
            arrivalTime: "15:00",
            departureLocation: "Huế",
            arrivalLocation: "Đà Nẵng",
            duration: "2 giờ",
            distance: "96km",
            vehicleType: "Limousine",
            date: "30/1/2026",
        },
        {
            id: "3",
            departureTime: "17:00",
            arrivalTime: "19:00",
            departureLocation: "TP. Hồ Chí Minh",
            arrivalLocation: "Tiền Giang",
            duration: "2 giờ",
            distance: "115km",
            vehicleType: "Limousine",
            date: "5/2/2026",
        },
        {
            id: "4",
            departureTime: "08:00",
            arrivalTime: "10:00",
            departureLocation: "Long An",
            arrivalLocation: "TP. Hồ Chí Minh",
            duration: "2 giờ",
            distance: "90km",
            vehicleType: "Limousine",
            date: "6/2/2026",
        },
        {
            id: "5",
            departureTime: "09:00",
            arrivalTime: "11:30",
            departureLocation: "Cần Thơ",
            arrivalLocation: "TP. Hồ Chí Minh",
            duration: "2.5 giờ",
            distance: "170km",
            vehicleType: "Limousine",
            date: "7/2/2026",
        },
    ];
    const itemsPerPage = 3;
    const totalPages = Math.ceil(trips.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTrips = trips.slice(startIndex, startIndex + itemsPerPage);
    return (
        <>
            <h1 className="text-2xl font-extrabold text-gray-800 mb-8">
                Danh sách chuyến lái
            </h1>

            <div className="space-y-6">
                {currentTrips.map((trip) => (
                    <div
                        key={trip.id}
                        className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border"
                    >
                        <div className="flex items-center justify-between">

                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {trip.departureTime}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {trip.departureLocation}
                                </div>
                            </div>

                            <div className="flex-1 px-10">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>

                                    <div className="flex-1 relative">
                                        <div className="h-[2px] bg-gray-300"></div>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-gray-500">
                                            <span className="font-medium">
                                                {trip.duration}
                                            </span>
                                            <span>{trip.distance}</span>
                                        </div>
                                    </div>

                                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {trip.arrivalTime}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {trip.arrivalLocation}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-600">
                                    • {trip.vehicleType}
                                </span>
                                <span className="font-semibold text-green-600">
                                    {trip.date}
                                </span>
                            </div>

                            <Link to={"/letan/chitietchuyendi"} >
                                <button className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                                    ChiTiet
                                </button>
                            </Link>

                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2 mt-10 mb-8">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-40"
                >
                    ❮
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold transition-all
                                ${currentPage === page
                                ? "bg-orange-500 text-white shadow-md"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-40"
                >
                    ❯
                </button>
            </div>

        </>
    )
}