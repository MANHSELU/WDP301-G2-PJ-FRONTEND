import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Trip } from '../../model/trip';
import API_TRIP from '../../services/Driver/trips-api';

export function ViewTrip() {
    const [trips, setTrip] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

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

    const handleSelectTrip = (tripId: string) => {
        setSelectedTrip(selectedTrip === tripId ? null : tripId);
    };

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                const res = await fetch(`${API_TRIP.trips}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("Fetch trips failed");

                const result = await res.json();
                setTrip(result.data);
            } catch (error) {
                console.error("Lỗi lấy trips:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    if (loading) return <p>Đang tải...</p>;
    const hanldSumit = async (id: string) => {
        try {
            const token = localStorage.getItem("accessToken");

            const res = await fetch(`${API_TRIP.trips}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            });

            if (!res.ok) throw new Error("Update trip failed");

            const result = await res.json();
            const updatedTrip = result.data; // trip vừa update

            // 🔥 update lại state trips
            setTrip(prevTrips =>
                prevTrips.map(trip =>
                    trip._id === updatedTrip._id ? updatedTrip : trip
                )
            );

        } catch (error) {
            console.error("Lỗi update trip:", error);
        }
    };

    return (
        <div className="w-full border border-black/10 rounded-3xl bg-white shadow-md p-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-8">
                Danh sách Chuyến lái
            </h2>

            <div className="space-y-6">
                {displayedTrips.map(trip => {
                    const startTime = new Date(trip.departure_time);

                    const endTime =
                        trip.drivers.length > 0
                            ? new Date(trip.drivers[trip.drivers.length - 1].shift_end)
                            : startTime;

                    const durationMs = endTime.getTime() - startTime.getTime();
                    const hours = Math.floor(durationMs / (1000 * 60 * 60));
                    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);

                    return (
                        <div
                            key={trip._id}
                            className={`border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg ${selectedTrip === trip._id
                                ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 shadow-lg'
                                : 'border-orange-200 hover:border-orange-400 hover:shadow-lg'
                                }`}
                            onClick={() => handleSelectTrip(trip._id)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {trip.route_id.start_id.name}
                                    </div>
                                </div>

                                <div className="flex-1 px-8">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full border-2 border-green-500 bg-white"></div>
                                        <div className="flex-1 h-1 bg-gray-300"></div>
                                        <div className="w-3 h-3 rounded-full border-2 border-orange-300 bg-white"></div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {hours}h {minutes}m
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {trip.route_id.distance_km} km
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 text-right">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {trip.route_id.stop_id.name}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span className="text-sm">•</span>
                                    <span className="text-sm font-medium">
                                        {trip.bus_id.bus_type_id.name ?? "Chưa có xe"}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">
                                        {new Date(trip.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                {trip.status === "SCHEDULED" && (
                                    <button
                                        onClick={() => hanldSumit(trip._id)}
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-8 py-2 rounded-lg"
                                    >
                                        Xác nhận
                                    </button>
                                )}

                                {trip.status === "RUNNING" && (
                                    <button
                                        disabled
                                        className="bg-blue-500 text-white font-bold px-8 py-2 rounded-lg"
                                    >
                                        Đang đi
                                    </button>
                                )}

                                {trip.status === "FINISHED" && (
                                    <button
                                        disabled
                                        className="bg-gray-400 text-white font-bold px-8 py-2 rounded-lg"
                                    >
                                        Đã kết thúc
                                    </button>
                                )}


                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-center gap-3 mt-10 p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
                <button onClick={handlePrevious} disabled={currentPage === 1}>
                    <ChevronLeft size={22} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}>
                        {page}
                    </button>
                ))}

                <button onClick={handleNext} disabled={currentPage === totalPages}>
                    <ChevronRight size={22} />
                </button>
            </div>
        </div>
    );
}
