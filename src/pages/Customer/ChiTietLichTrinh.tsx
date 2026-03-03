import { useState } from "react";
import { Clock, Bus, DollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

/* ================= TYPES ================= */

type BusTrip = {
    id: string;
    departureTime: string;
    arrivalTime: string;
    departureLocation: string;
    arrivalLocation: string;
    duration: string;
    distance: string;
    busType: string;
    price: string;
    seatsAvailable: number;
};

/* ================= COMPONENT ================= */

export default function BusTripSearch() {
    const location = useLocation();
    const id = location.state?.id;
    console.log("id được gửi đến là : ", id)
    const [selectedFilters, setSelectedFilters] = useState({
        timeSlots: [] as string[],
        busTypes: [] as string[],
        tiers: [] as string[],
    });

    // Mock data
    const trips: BusTrip[] = [
        {
            id: "1",
            departureTime: "15:00",
            arrivalTime: "17:00",
            departureLocation: "An Hữu (Tiền Giang)",
            arrivalLocation: "TP. Hồ Chí Minh",
            duration: "2 giờ",
            distance: "64.0km",
            busType: "Limousine",
            price: "20 CHỈ TRỐNG",
            seatsAvailable: 20,
        },
        {
            id: "2",
            departureTime: "15:00",
            arrivalTime: "17:00",
            departureLocation: "An Hữu (Tiền Giang)",
            arrivalLocation: "TP. Hồ Chí Minh",
            duration: "2 giờ",
            distance: "64.0km",
            busType: "Limousine",
            price: "20 CHỈ TRỐNG",
            seatsAvailable: 20,
        },
        {
            id: "3",
            departureTime: "15:00",
            arrivalTime: "17:00",
            departureLocation: "An Hữu (Tiền Giang)",
            arrivalLocation: "TP. Hồ Chí Minh",
            duration: "2 giờ",
            distance: "64.0km",
            busType: "Limousine",
            price: "28 CHỈ TRỐNG",
            seatsAvailable: 28,
        },
    ];

    const timeSlots = [
        "Sáng sớm: 0h - 6h",
        "Buổi Sáng: 6h - 12h",
        "Buổi Chiều: 12h - 18h",
        "Buổi Tối: 18h - 24h",
    ];

    const busTypes = ["Ghế Phổ", "Giường nằm", "Limousine"];

    const tiers = ["Tiêu chuẩn", "Tiêu tiết", "Tiêu cao"];

    const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter((item) => item !== value)
                : [...prev[category], value],
        }));
    };

    // const [trips, setTrip] = useState([])
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

            {/* Search Results Section */}
            <div className="relative z-20 py-8 pb-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
                        {/* ================= SIDEBAR FILTERS ================= */}
                        <aside className="space-y-6">
                            {/* Time Slot Filter */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                <div className="relative bg-white rounded-2xl shadow-xl border-2 border-orange-100/50 p-6 hover:shadow-2xl transition-all duration-300">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                            <Clock className="text-orange-500" size={20} />
                                            Bộ lọc tìm kiếm
                                        </h3>
                                        <button className="text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors">
                                            Bỏ lọc
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {timeSlots.map((slot) => (
                                            <label
                                                key={slot}
                                                className="flex items-center gap-3 cursor-pointer group/item hover:bg-orange-50 p-2 rounded-lg transition-all"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.timeSlots.includes(slot)}
                                                    onChange={() => toggleFilter("timeSlots", slot)}
                                                    className="w-5 h-5 rounded border-2 border-slate-300 text-orange-500 focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700 group-hover/item:text-slate-900 font-medium">
                                                    {slot}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bus Type Filter */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                <div className="relative bg-white rounded-2xl shadow-xl border-2 border-orange-100/50 p-6 hover:shadow-2xl transition-all duration-300">
                                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                        <Bus className="text-orange-500" size={20} />
                                        Loại xe
                                    </h3>

                                    <div className="space-y-3">
                                        {busTypes.map((type) => (
                                            <label
                                                key={type}
                                                className="flex items-center gap-3 cursor-pointer group/item hover:bg-orange-50 p-2 rounded-lg transition-all"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.busTypes.includes(type)}
                                                    onChange={() => toggleFilter("busTypes", type)}
                                                    className="w-5 h-5 rounded border-2 border-slate-300 text-orange-500 focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700 group-hover/item:text-slate-900 font-medium">
                                                    {type}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Tier Filter */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-orange-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                <div className="relative bg-white rounded-2xl shadow-xl border-2 border-orange-100/50 p-6 hover:shadow-2xl transition-all duration-300">
                                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                        <DollarSign className="text-orange-500" size={20} />
                                        Tầng
                                    </h3>

                                    <div className="space-y-3">
                                        {tiers.map((tier) => (
                                            <label
                                                key={tier}
                                                className="flex items-center gap-3 cursor-pointer group/item hover:bg-orange-50 p-2 rounded-lg transition-all"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.tiers.includes(tier)}
                                                    onChange={() => toggleFilter("tiers", tier)}
                                                    className="w-5 h-5 rounded border-2 border-slate-300 text-orange-500 focus:ring-2 focus:ring-orange-500/50 cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-700 group-hover/item:text-slate-900 font-medium">
                                                    {tier}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Reset All Button */}
                            <button className="w-full bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                                Đặt lại
                            </button>
                        </aside>

                        {/* ================= TRIP RESULTS ================= */}
                        <main className="space-y-5">
                            {trips.map((trip, index) => (
                                <div
                                    key={trip.id}
                                    className="relative group"
                                    style={{
                                        animation: "fadeInUp 0.5s ease-out forwards",
                                        animationDelay: `${index * 0.1}s`,
                                        opacity: 0,
                                    }}
                                >
                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-500/30 to-orange-400/0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                                    <div className="bg-gradient-to-br from-white via-white to-orange-50/30 rounded-2xl shadow-xl border-2 border-orange-100/50 p-7 hover:shadow-2xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                                        {/* Decorative top border */}
                                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Time Section */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-6">
                                                {/* Departure */}
                                                <div className="text-center">
                                                    <div className="text-3xl font-black text-slate-800 mb-1">
                                                        {trip.departureTime}
                                                    </div>
                                                    <div className="text-sm text-slate-500 font-medium">
                                                        {trip.departureLocation}
                                                    </div>
                                                </div>

                                                {/* Journey Line */}
                                                <div className="flex flex-col items-center px-8 relative">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-3 h-3 rounded-full bg-orange-400 ring-4 ring-orange-100" />
                                                        <div className="h-0.5 w-24 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 relative">
                                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                                <Bus className="text-orange-500 bg-white rounded-full p-1" size={24} />
                                                            </div>
                                                        </div>
                                                        <div className="w-3 h-3 rounded-full bg-orange-600 ring-4 ring-orange-100" />
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold bg-orange-50 px-3 py-1 rounded-full">
                                                        <span>{trip.duration}</span>
                                                        <span>•</span>
                                                        <span>{trip.distance}</span>
                                                    </div>
                                                </div>

                                                {/* Arrival */}
                                                <div className="text-center">
                                                    <div className="text-3xl font-black text-slate-800 mb-1">
                                                        {trip.arrivalTime}
                                                    </div>
                                                    <div className="text-sm text-slate-500 font-medium">
                                                        {trip.arrivalLocation}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info Row */}
                                        <div className="flex items-center justify-between pt-5 border-t-2 border-orange-100">
                                            <div className="flex items-center gap-6">
                                                {/* Bus Type Badge */}
                                                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                                                    <span className="text-xs font-semibold text-slate-600">
                                                        Chọn Ghế
                                                    </span>
                                                </div>

                                                {/* Bus Type */}
                                                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                                                    <span className="text-xs font-semibold text-slate-600">
                                                        Lịch Trình
                                                    </span>
                                                </div>

                                                {/* Limousine Badge */}
                                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-2 rounded-xl border border-purple-200">
                                                    <span className="text-xs font-bold text-purple-700">
                                                        {trip.busType}
                                                    </span>
                                                </div>

                                                {/* Seats Available */}
                                                <div className="bg-gradient-to-br from-green-50 to-green-100 px-4 py-2 rounded-xl border border-green-200">
                                                    <span className="text-xs font-bold text-green-700">
                                                        {trip.price}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Book Button */}
                                            <Link to={"/datve"} className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 text-white px-10 py-3.5 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                <span className="relative z-10">Chọn chuyến</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </main>
                    </div>
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

        input[type="checkbox"]:checked::before {
          content: "✓";
          display: block;
          text-align: center;
          color: white;
          font-size: 14px;
          font-weight: bold;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
        </div>
    );
}