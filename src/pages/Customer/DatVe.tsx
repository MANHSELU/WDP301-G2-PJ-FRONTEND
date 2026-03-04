import React, { useState, useMemo, useEffect } from "react";
import { X, ArrowRight, Armchair } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

/* ================= TYPES ================= */

type SeatStatus = "available" | "selected" | "booked";

type Seat = {
    id: string;
    floor: 1 | 2;
    row: number;
    col: number;
    status: SeatStatus;
    label: string;
};

/* ================= COMPONENT ================= */

export default function BusSeatSelection() {
    const [activeTab, setActiveTab] = useState<"booking" | "return">("booking");
    const [selectedFloor, setSelectedFloor] = useState<1 | 2>(1);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    const [filters, setFilters] = useState({
        timeSlots: [] as string[],
        busTypes: [] as string[],
        tiers: [] as string[],
    });
    //lấy id của tríp chuyến đi 
    const location = useLocation();
    const route_id = location.state?.tripId;
    const [trip, setTrip] = useState<any>(null);
    useEffect(() => {
        if (!route_id) return;

        const fetchDiagramBus = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/customer/notcheck/diagram-bus",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            route_id: route_id,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Fetch failed");
                }

                const result = await response.json();

                setTrip(result.data); // 👈 LƯU TRIP

            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchDiagramBus();
    }, [route_id]);
    // Mock seat data - Generate once and memoize
    const generateSeatsFromLayout = (floor: number): Seat[] => {
        if (!trip?.bus_id?.seat_layout) return [];

        const { rows, columns, row_overrides } =
            trip.bus_id.seat_layout;

        const seats: Seat[] = [];
        let seatCounter = 1;

        for (let row = 1; row <= rows; row++) {
            // tìm override nếu có
            const override = row_overrides?.find(
                (r: any) => r.row_index === row && r.floor === floor
            );

            columns.forEach((col: any, colIndex: number) => {
                let seatsInColumn = col.seats_per_row;

                // nếu có override cho column này
                if (override) {
                    const colOverride = override.column_overrides.find(
                        (c: any) => c.column_name === col.name
                    );

                    if (colOverride) {
                        seatsInColumn = colOverride.seats;
                    }
                }

                for (let i = 0; i < seatsInColumn; i++) {
                    seats.push({
                        id: `${floor}-${row}-${colIndex}-${i}`,
                        floor,
                        row,
                        col: colIndex,
                        status: "available",
                        label: `A${seatCounter++}`,
                    });
                }
            });
        }

        return seats;
    };

    const floor1Seats = useMemo(() => generateSeatsFromLayout(1), [trip]);
    const floor2Seats = useMemo(() => generateSeatsFromLayout(2), [trip]);

    const currentSeats = selectedFloor === 1 ? floor1Seats : floor2Seats;

    // Calculate available and booked seats
    const availableSeats = useMemo(() => {
        return currentSeats.filter(
            (s) => s.status === "available" && !selectedSeats.includes(s.id)
        ).length;
    }, [currentSeats, selectedSeats]);

    const bookedSeats = useMemo(() => {
        return currentSeats.filter((s) => s.status === "booked").length;
    }, [currentSeats]);

    const timeSlots = [
        "Sáng sớm: 0h - 6h",
        "Buổi Sáng: 6h - 12h",
        "Buổi Chiều: 12h - 18h",
        "Buổi Tối: 18h - 24h",
    ];

    const busTypes = ["Ghế ngồi", "Giường nằm", "Limousine"];
    const tiers = ["Tầng trên", "Tầng dưới"];

    const toggleFilter = (
        category: keyof typeof filters,
        value: string
    ) => {
        setFilters((prev) => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter((item) => item !== value)
                : [...prev[category], value],
        }));
    };

    const toggleSeat = (seatId: string, status: SeatStatus) => {
        if (status === "booked") return;

        setSelectedSeats((prev) =>
            prev.includes(seatId)
                ? prev.filter((id) => id !== seatId)
                : [...prev, seatId]
        );
    };

    const getSeatStatus = (seat: Seat): SeatStatus => {
        if (selectedSeats.includes(seat.id)) return "selected";
        return seat.status;
    };

    const clearFilters = () => {
        setFilters({
            timeSlots: [],
            busTypes: [],
            tiers: [],
        });
    };
    const groupedSeats = useMemo(() => {
        const grouped: Record<number, { LEFT: Seat[]; RIGHT: Seat[] }> = {};

        currentSeats.forEach((seat) => {
            if (!grouped[seat.row]) {
                grouped[seat.row] = { LEFT: [], RIGHT: [] };
            }

            // col = 0 là LEFT, col = 1 là RIGHT
            if (seat.col === 0) {
                grouped[seat.row].LEFT.push(seat);
            } else {
                grouped[seat.row].RIGHT.push(seat);
            }
        });

        return grouped;
    }, [currentSeats]);
    const renderSeat = (seat: Seat) => {
        const status = getSeatStatus(seat);

        const seatVisual = {
            available: {
                detail: "border-green-400 bg-green-50",
                frame: "border-green-400 bg-white text-green-700",
                leg: "bg-green-400",
                label: "text-green-700",
            },
            selected: {
                detail: "border-orange-500 bg-orange-100",
                frame: "border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg",
                leg: "bg-orange-500",
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
            <button
                key={seat.id}
                onClick={() => toggleSeat(seat.id, seat.status)}
                disabled={status === "booked"}
                className={`relative h-[32px] w-[62px] transition-all duration-300 ${status === "available"
                    ? "hover:scale-110 cursor-pointer"
                    : status === "selected"
                        ? "scale-110"
                        : "cursor-not-allowed opacity-60"
                    }`}
            >
                <span
                    className={`absolute left-[13px] top-0.5 h-1.5 w-[35px] rounded-t-[4px] border-[1.5px] border-b-0 ${seatVisual.detail}`}
                />
                <span
                    className={`absolute left-[7px] top-2 flex h-[14px] w-[48px] items-center justify-center rounded-[4px] border-[1.5px] text-[9px] font-black ${seatVisual.frame}`}
                >
                    {seat.label}
                </span>
                <span
                    className={`absolute left-[20px] top-[18px] h-[4px] w-[2px] ${seatVisual.leg}`}
                />
                <span
                    className={`absolute right-[20px] top-[18px] h-[4px] w-[2px] ${seatVisual.leg}`}
                />
            </button>
        );
    };
    const formatTime = (dateString?: string) => {
        if (!dateString) return "--:--";
        const date = new Date(dateString);
        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const calculateDuration = (start?: string, end?: string) => {
        if (!start || !end) return "";
        const diff =
            new Date(end).getTime() - new Date(start).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        return `${hours} giờ`;
    };
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-100">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-[linear-gradient(96deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.93)_34%,rgba(255,255,255,0.64)_56%,rgba(255,255,255,0.16)_78%,rgba(255,255,255,0)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#f3ece5] to-[#ece7e2]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-[#ece7e2]" />

            {/* Bus Animation */}
            <div className="pointer-events-none absolute top-[18%] right-[0%] z-10 w-[66%] max-w-[860px] md:top-[9%] md:w-[62%]">
                <div className="bus-aero-overlay absolute inset-[-16%] z-0">
                    <span className="bus-cloud bus-cloud-1 absolute left-[-10%] top-[-10%] h-[28%] w-[68%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.74)_0%,rgba(255,255,255,0.25)_54%,rgba(255,255,255,0)_100%)] blur-[30px]" />
                    <span className="bus-cloud bus-cloud-2 absolute left-[-20%] top-[28%] h-[26%] w-[42%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.66)_0%,rgba(255,255,255,0.2)_54%,rgba(255,255,255,0)_100%)] blur-[24px]" />
                    <span className="bus-cloud bus-cloud-3 absolute right-[-16%] top-[34%] h-[26%] w-[42%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.64)_0%,rgba(255,255,255,0.18)_54%,rgba(255,255,255,0)_100%)] blur-[24px]" />
                    <span className="bus-cloud bus-cloud-4 absolute left-[-16%] top-[66%] h-[30%] w-[58%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.24)_54%,rgba(255,255,255,0)_100%)] blur-[28px]" />
                    <span className="bus-cloud bus-cloud-5 absolute right-[-4%] top-[70%] h-[28%] w-[54%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.64)_0%,rgba(255,255,255,0.2)_54%,rgba(255,255,255,0)_100%)] blur-[26px]" />
                    <span className="bus-cloud bus-cloud-6 absolute left-[4%] top-[90%] h-[16%] w-[72%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0.14)_54%,rgba(255,255,255,0)_100%)] blur-[24px]" />
                </div>

                <div className="bus-aero-trail absolute right-[-14%] top-[30%] z-0 h-[54%] w-[46%]">
                    <span className="bus-tail-cloud bus-tail-cloud-1 absolute right-[10%] top-[14%] h-[42%] w-[34%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.48)_54%,rgba(255,255,255,0)_100%)] blur-[8px]" />
                    <span className="bus-tail-cloud bus-tail-cloud-2 absolute right-[28%] top-[28%] h-[38%] w-[32%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.84)_0%,rgba(255,255,255,0.4)_54%,rgba(255,255,255,0)_100%)] blur-[8px]" />
                    <span className="bus-tail-cloud bus-tail-cloud-3 absolute right-[12%] top-[50%] h-[34%] w-[30%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.36)_54%,rgba(255,255,255,0)_100%)] blur-[10px]" />
                    <span className="bus-tail-cloud bus-tail-cloud-4 absolute right-[38%] top-[20%] h-[26%] w-[24%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.32)_54%,rgba(255,255,255,0)_100%)] blur-[8px]" />
                    <span className="bus-tail-cloud bus-tail-cloud-5 absolute right-[44%] top-[42%] h-[24%] w-[22%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.74)_0%,rgba(255,255,255,0.3)_54%,rgba(255,255,255,0)_100%)] blur-[8px]" />
                    <span className="bus-tail-cloud bus-tail-cloud-6 absolute right-[24%] top-[44%] h-[26%] w-[24%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.38)_54%,rgba(255,255,255,0)_100%)] blur-[8px]" />
                    <span className="bus-tail-cloud bus-tail-cloud-7 absolute right-[18%] top-[64%] h-[22%] w-[22%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0.34)_54%,rgba(255,255,255,0)_100%)] blur-[9px]" />
                </div>

                <div className="bus-bob relative z-10">
                    <img
                        src="/images/bus7.png"
                        alt="Bus overlay"
                        className="w-full object-contain block relative"
                        style={{
                            imageRendering: "auto",
                            filter:
                                "drop-shadow(0 24px 28px rgba(15,23,42,0.28)) drop-shadow(0 0 22px rgba(255,255,255,0.5))",
                        }}
                    />

                    <div className="pointer-events-none absolute inset-0">
                        <div className="bus-front-left-passenger">
                            <img
                                src="/images/loxe1.png"
                                alt="Front passenger"
                                className="bus-front-left-passenger-img"
                            />
                        </div>
                        <div className="bus-driver-fit">
                            <img
                                src="/images/1me1.png"
                                alt="Driver"
                                className="bus-driver-fit-img"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative z-20 mx-auto flex min-h-[520px] w-full max-w-[1240px] items-center px-4 pb-16 pt-24 lg:min-h-[580px] lg:pt-20">
                <div className="page-enter-copy relative isolate -ml-8 max-w-[760px] space-y-6 sm:-ml-14 lg:-ml-24">
                    <div className="pointer-events-none absolute left-[46%] top-[46%] z-0 h-[360px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.46)_34%,rgba(255,255,255,0.18)_56%,rgba(255,255,255,0)_78%)] blur-[26px]" />
                    <div className="pointer-events-none absolute left-[46%] top-[46%] z-0 h-[300px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(248,250,252,0.46)_0%,rgba(248,250,252,0.14)_58%,rgba(248,250,252,0)_84%)] blur-[18px]" />
                    <h1 className="hero-title relative z-10 py-1 text-[48px] font-black leading-[1.05] tracking-[-0.03em] text-[#0d142a] sm:text-[58px] lg:text-[72px]">
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
                    <p className="relative z-10 max-w-[510px] text-base leading-relaxed text-[#475569] lg:text-lg">
                        Đặt vé mọi lúc mọi nơi, đi vững ngàn hành trình đa dạng và dịch vụ
                        chất lượng cao nhất.
                    </p>
                </div>
            </div>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-100 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Tab Navigation */}
                    <div className="relative z-30 flex gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab("booking")}
                            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${activeTab === "booking"
                                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30"
                                : "bg-white text-slate-600 hover:shadow-lg"
                                }`}
                        >
                            Đặt vé đi
                        </button>
                        <button
                            onClick={() => setActiveTab("return")}
                            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${activeTab === "return"
                                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/30"
                                : "bg-white text-slate-600 hover:shadow-lg"
                                }`}
                        >
                            Gửi hàng
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                        {/* ================= SIDEBAR FILTERS ================= */}
                        <aside className="space-y-6">
                            {/* Filter Header */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                <div className="relative bg-white rounded-2xl shadow-xl border-2 border-orange-100/50 p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-bold text-lg text-slate-800">
                                            Bộ lọc tìm kiếm
                                        </h3>
                                        <button
                                            onClick={clearFilters}
                                            className="text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Time Slots */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-sm text-slate-700 mb-3">
                                            Giờ đi
                                        </h4>
                                        <div className="space-y-2">
                                            {timeSlots.map((slot) => (
                                                <label
                                                    key={slot}
                                                    className="flex items-center gap-2 cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-all"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.timeSlots.includes(slot)}
                                                        onChange={() => toggleFilter("timeSlots", slot)}
                                                        className="w-4 h-4 rounded border-2 border-slate-300 text-orange-500 cursor-pointer"
                                                    />
                                                    <span className="text-sm text-slate-700">{slot}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bus Types */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-sm text-slate-700 mb-3">
                                            Loại xe
                                        </h4>
                                        <div className="space-y-2">
                                            {busTypes.map((type) => (
                                                <label
                                                    key={type}
                                                    className="flex items-center gap-2 cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-all"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.busTypes.includes(type)}
                                                        onChange={() => toggleFilter("busTypes", type)}
                                                        className="w-4 h-4 rounded border-2 border-slate-300 text-orange-500 cursor-pointer"
                                                    />
                                                    <span className="text-sm text-slate-700">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tiers */}
                                    <div>
                                        <h4 className="font-semibold text-sm text-slate-700 mb-3">
                                            Tầng
                                        </h4>
                                        <div className="space-y-2">
                                            {tiers.map((tier) => (
                                                <label
                                                    key={tier}
                                                    className="flex items-center gap-2 cursor-pointer hover:bg-orange-50 p-2 rounded-lg transition-all"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.tiers.includes(tier)}
                                                        onChange={() => toggleFilter("tiers", tier)}
                                                        className="w-4 h-4 rounded border-2 border-slate-300 text-orange-500 cursor-pointer"
                                                    />
                                                    <span className="text-sm text-slate-700">{tier}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={clearFilters}
                                className="w-full bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Tìm lại
                            </button>
                        </aside>

                        {/* ================= SEAT SELECTION ================= */}
                        <main className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-orange-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                            <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-orange-100/50 p-8">
                                {/* Trip Info Header */}
                                <div className="mb-8 pb-6 border-b-2 border-orange-100">
                                    <div className="flex items-center justify-between mb-4 flex-wrap gap-4">

                                        {/* Thời gian */}
                                        <div className="flex items-center gap-6 flex-wrap">

                                            {/* Giờ đi */}
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-slate-800">
                                                    {formatTime(trip?.departure_time)}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {`${trip?.route_id?.start_id.province} (${trip?.route_id?.start_id.name})` || "Điểm đi"}
                                                </div>
                                            </div>

                                            {/* Timeline */}
                                            <div className="flex items-center gap-2 px-4">
                                                <div className="w-2 h-2 rounded-full bg-orange-400" />
                                                <div className="h-0.5 w-20 bg-gradient-to-r from-orange-400 to-orange-600" />
                                                <div className="w-2 h-2 rounded-full bg-orange-600" />
                                            </div>

                                            {/* Giờ đến */}
                                            <div className="text-center">
                                                <div className="text-2xl font-black text-slate-800">
                                                    {formatTime(trip?.arrival_time)}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {`${trip?.route_id?.stop_id.province} (${trip?.route_id?.stop_id.name})` || "Điểm đến"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Thời lượng */}
                                        <div className="bg-orange-50 px-4 py-2 rounded-xl">
                                            <span className="text-xs font-bold text-orange-600">
                                                {calculateDuration(
                                                    trip?.departure_time,
                                                    trip?.arrival_time
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Meta info */}
                                    <div className="flex items-center gap-3 flex-wrap">

                                        <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600">
                                            Chọn Ghế
                                        </span>

                                        <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600">
                                            Lịch Trình
                                        </span>

                                        {/* Loại xe */}
                                        <span className="bg-purple-50 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 border border-purple-200">
                                            {trip?.bus_id?.bus_type_id?.name}
                                        </span>

                                        {/* Ghế trống */}
                                        <span className="bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold text-green-700 border border-green-200">
                                            {availableSeats} CHỈ TRỐNG
                                        </span>

                                        <button className="ml-auto bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                            Chọn Chuyến
                                        </button>

                                    </div>
                                </div>

                                {/* Floor Tabs */}
                                {trip?.bus_id?.seat_layout?.floors > 0 && (
                                    <div className="flex gap-3 mb-6">
                                        {Array.from(
                                            { length: trip.bus_id.seat_layout.floors },
                                            (_, index) => {
                                                const floorNumber = index + 1;

                                                return (
                                                    <button
                                                        key={floorNumber}
                                                        onClick={() => setSelectedFloor(floorNumber)}
                                                        className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${selectedFloor === floorNumber
                                                            ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                            }`}
                                                    >
                                                        <Armchair size={18} />
                                                        Tầng {floorNumber}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                )}

                                {/* Seat Map */}
                                {/* Seat Map */}
                                <div className="bg-gradient-to-br from-slate-50 to-orange-50/30 rounded-2xl p-10 mb-8 border-2 border-orange-100">

                                    {/* Body xe */}
                                    <div className="w-full max-w-6xl mx-auto border-2 border-slate-300 rounded-[40px] p-12 bg-white shadow-inner">

                                        {/* Đầu xe */}
                                        <div className="text-center text-slate-400 font-bold mb-10 tracking-widest">
                                            🚍 ĐẦU XE
                                        </div>

                                        {/* Layout ghế */}
                                        <div className="flex flex-col gap-10 items-center w-full">

                                            {Object.keys(groupedSeats).map((rowKey) => {
                                                const row = groupedSeats[Number(rowKey)];

                                                const totalSeats = row.LEFT.length + row.RIGHT.length;

                                                // 🔥 Nếu là hàng đặc biệt (5 ghế)
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
                                                        {/* LEFT */}
                                                        <div className="flex justify-end gap-6">
                                                            {row.LEFT.map(renderSeat)}
                                                        </div>

                                                        {/* AISLE */}
                                                        <div />

                                                        {/* RIGHT */}
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
                                <div className="flex items-center justify-center gap-6 py-4 bg-slate-50 rounded-xl flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-white border-2 border-green-400" />
                                        <span className="text-sm font-medium text-slate-700">Trống</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600" />
                                        <span className="text-sm font-medium text-slate-700">Đang chọn</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-slate-200 border-2 border-slate-300" />
                                        <span className="text-sm font-medium text-slate-700">Đã bán</span>
                                    </div>
                                </div>

                                {/* Selected Seats Summary */}
                                {selectedSeats.length > 0 && (
                                    <div className="mt-6 bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200 rounded-2xl p-6">
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-2">
                                                    Ghế đã chọn: {selectedSeats.length}
                                                </h4>
                                                <p className="text-sm text-slate-600">
                                                    Vui lòng kiểm tra kỹ thông tin trước khi tiếp tục
                                                </p>
                                            </div>
                                            <Link
                                                to="/thongtindatve"
                                                state={{
                                                    // Mảng id ghế đã chọn (dùng để check trạng thái)
                                                    selectedSeats: selectedSeats,

                                                    // Mảng label ghế ["A1","B2",...] để hiển thị badge
                                                    selectedSeatLabels: (() => {
                                                        const allSeats = selectedFloor === 1 ? floor1Seats : floor2Seats;
                                                        return allSeats
                                                            .filter((s) => selectedSeats.includes(s.id))
                                                            .map((s) => s.label);
                                                    })(),

                                                    // Toàn bộ object trip từ API (chứa route, bus, giá...)
                                                    trip: trip,
                                                }}
                                                className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                                            >
                                                Tiếp tục
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>

                <style>{`
        .page-enter-copy {
          opacity: 0;
          will-change: transform, opacity;
          animation: page-fade-up 1.08s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 0.2s;
        }

        .hero-title-line {
          opacity: 0;
          transform: translateY(14px);
          animation: hero-title-reveal 1.12s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .hero-title-line:nth-child(1) {
          animation-delay: 0.36s;
        }

        .hero-title-line:nth-child(2) {
          animation-delay: 0.54s;
        }

        .hero-title-line:nth-child(3) {
          animation-delay: 0.72s;
        }

        .hero-title-shimmer {
          color: #ff7a1b;
          display: inline-block;
          line-height: 1.12;
          padding-bottom: 0.14em;
          background-image: repeating-linear-gradient(
            100deg,
            #ff7a1b 0px,
            #ff7a1b 120px,
            #ff9226 185px,
            #ffb347 260px,
            #ff9226 335px,
            #ff7a1b 400px,
            #e8791c 520px
          );
          background-size: 520px 100%;
          background-position: 0 50%;
          background-repeat: repeat;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow:
            0 1px 0 rgba(255, 181, 88, 0.36),
            0 2px 0 rgba(234, 121, 27, 0.38),
            0 4px 0 rgba(178, 76, 16, 0.3),
            0 10px 16px rgba(94, 40, 9, 0.22);
          -webkit-text-stroke: 0.26px rgba(136, 57, 12, 0.26);
          filter: saturate(1.16) contrast(1.12) brightness(1.06);
          animation: hero-title-shimmer-soft 5.8s linear infinite;
          will-change: background-position;
        }

        .bus-bob {
          animation: bus-bob 1.9s cubic-bezier(0.36, 0.06, 0.29, 0.97) infinite;
          transform-origin: 56% 74%;
          will-change: transform;
        }

        .bus-aero-overlay {
          transform: rotate(12deg);
          transform-origin: 22% 50%;
        }

        .bus-cloud {
          animation: bus-cloud-drift 1.75s ease-out infinite;
          will-change: transform, opacity;
        }

        .bus-cloud-1 { animation-delay: 0.06s; animation-duration: 1.95s; }
        .bus-cloud-2 { animation-delay: 0.26s; animation-duration: 1.55s; }
        .bus-cloud-3 { animation-delay: 0.42s; animation-duration: 1.58s; }
        .bus-cloud-4 { animation-delay: 0.62s; animation-duration: 1.84s; }
        .bus-cloud-5 { animation-delay: 0.78s; animation-duration: 1.72s; }
        .bus-cloud-6 { animation-delay: 0.94s; animation-duration: 1.6s; }

        .bus-aero-trail {
          transform: rotate(12deg);
          transform-origin: 22% 50%;
        }

        .bus-tail-cloud {
          animation: bus-trail-cloud 1.55s ease-out infinite;
          will-change: transform, opacity;
        }

        .bus-tail-cloud-1 { animation-delay: 0.06s; }
        .bus-tail-cloud-2 { animation-delay: 0.32s; }
        .bus-tail-cloud-3 { animation-delay: 0.54s; }
        .bus-tail-cloud-4 { animation-delay: 0.76s; }
        .bus-tail-cloud-5 { animation-delay: 0.9s; animation-duration: 1.7s; }
        .bus-tail-cloud-6 { animation-delay: 0.22s; animation-duration: 1.45s; }
        .bus-tail-cloud-7 { animation-delay: 0.48s; animation-duration: 1.55s; }

        .bus-driver-fit {
          position: absolute;
          left: 26.3%; top: 30.7%;
          width: 11.6%; height: 15.8%;
          overflow: hidden;
          clip-path: polygon(8% 1%, 96% 5%, 100% 95%, 22% 98%, 2% 56%);
          transform: perspective(760px) rotateY(-12deg) rotate(-0.55deg);
          transform-origin: 54% 50%;
          box-shadow: inset 0 -14px 16px rgba(2, 6, 23, 0.28);
          animation: bus-driver-settle 1.9s cubic-bezier(0.36, 0.06, 0.29, 0.97) infinite;
        }

        .bus-front-left-passenger {
          position: absolute;
          left: 48.4%; top: 26.2%;
          width: 11.6%; height: 15.6%;
          overflow: hidden;
          clip-path: polygon(18% 2%, 94% 6%, 98% 95%, 10% 97%, 4% 52%);
          transform: perspective(760px) rotateY(14deg) rotate(0.7deg);
          transform-origin: 50% 50%;
          box-shadow: inset 0 -14px 16px rgba(2, 6, 23, 0.34);
          animation: bus-driver-settle 2s cubic-bezier(0.36, 0.06, 0.29, 0.97) infinite;
          z-index: 1;
        }

        .bus-front-left-passenger-img {
          position: absolute;
          left: 2%; top: 3%;
          width: 130%; height: 166%;
          object-fit: cover;
          object-position: center 10%;
          filter: saturate(0.8) contrast(1.05) brightness(0.88);
          opacity: 0.93;
          transform: scaleX(-1) rotate(-2deg);
          animation: bus-passenger-idle 1.8s ease-in-out infinite;
        }

        .bus-driver-fit-img {
          position: absolute;
          left: -2%; top: 3%;
          width: 95%; height: 112%;
          object-fit: cover;
          object-position: center 8%;
          filter: saturate(0.82) contrast(1.08) brightness(0.9);
          opacity: 0.95;
          transform: scaleX(-1) rotate(5deg);
          animation: bus-driver-idle 1.65s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bus-bob {
          0%, 100% { transform: translateY(0) rotate(-0.35deg); }
          32% { transform: translateY(-4px) rotate(0.12deg); }
          62% { transform: translateY(-8px) rotate(0.24deg); }
          82% { transform: translateY(2px) rotate(-0.16deg); }
        }

        @keyframes bus-cloud-drift {
          0% { opacity: 0.2; transform: translateX(-18px) scale(0.84); }
          36% { opacity: 0.76; }
          100% { opacity: 0; transform: translateX(172px) scale(1.3); }
        }

        @keyframes bus-trail-cloud {
          0% { opacity: 0.62; transform: translateX(-6px) scale(0.78); }
          34% { opacity: 0.96; }
          100% { opacity: 0; transform: translateX(92px) scale(1.22); }
        }

        @keyframes bus-driver-settle {
          0%, 100% { transform: perspective(760px) rotateY(-12deg) rotate(-0.55deg) translateY(0); }
          34% { transform: perspective(760px) rotateY(-12deg) rotate(-0.4deg) translateY(-1px); }
          68% { transform: perspective(760px) rotateY(-12deg) rotate(-0.75deg) translateY(1px); }
        }

        @keyframes bus-driver-idle {
          0%, 100% { transform: scaleX(-1) rotate(5deg) translateY(0); }
          28% { transform: scaleX(-1) rotate(4.1deg) translateY(-1px); }
          62% { transform: scaleX(-1) rotate(5.9deg) translateY(1px); }
          82% { transform: scaleX(-1) rotate(4.6deg) translateY(0); }
        }

        @keyframes bus-passenger-idle {
          0%, 100% { transform: scaleX(-1) rotate(-2deg) translateY(0); }
          34% { transform: scaleX(-1) rotate(-1.3deg) translateY(-1px); }
          72% { transform: scaleX(-1) rotate(-2.6deg) translateY(1px); }
        }

        @keyframes page-fade-up {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes hero-title-reveal {
          0% { opacity: 0; transform: translateY(14px); filter: blur(3px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        @keyframes hero-title-shimmer-soft {
          0% { background-position: 0 50%; }
          100% { background-position: -520px 50%; }
        }

        input[type="checkbox"]:checked {
          background-color: #f97316;
          border-color: #f97316;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
            </div>
        </div>
    );
}