import { useState } from "react";
import {
    TrendingUp,
    DollarSign,
    Package,
    Ticket,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    ChevronDown,
    Sparkles,
    BarChart3,
    PieChart as PieChartIcon,
    TableProperties,
    Zap,
    Crown,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── Types ──────────────────────────────────────────────────────────────────
type TimeRange = "week" | "month" | "year";

interface RevenueData {
    date: string;
    label: string;
    fullDate?: string;
    bookings: number;
    parcels: number;
    growth?: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────
// FIX: typed as Record<string, RevenueData[]> to allow string indexing
const weekDataMap: Record<string, RevenueData[]> = {
    "2023-01": [
        { date: "2023-01-02", label: "02/01 (T2)", fullDate: "Thứ 2, 2 tháng 1, 2023", bookings: 1500000, parcels: 450000, growth: 5 },
        { date: "2023-01-03", label: "03/01 (T3)", fullDate: "Thứ 3, 3 tháng 1, 2023", bookings: 1650000, parcels: 520000, growth: 10 },
        { date: "2023-01-04", label: "04/01 (T4)", fullDate: "Thứ 4, 4 tháng 1, 2023", bookings: 1420000, parcels: 450000, growth: -14 },
        { date: "2023-01-05", label: "05/01 (T5)", fullDate: "Thứ 5, 5 tháng 1, 2023", bookings: 1780000, parcels: 560000, growth: 25 },
        { date: "2023-01-06", label: "06/01 (T6)", fullDate: "Thứ 6, 6 tháng 1, 2023", bookings: 1920000, parcels: 600000, growth: 8 },
    ],
    "2023-02": [
        { date: "2023-02-03", label: "03/02 (T2)", fullDate: "Thứ 2, 3 tháng 2, 2023", bookings: 1850000, parcels: 580000, growth: 3 },
        { date: "2023-02-04", label: "04/02 (T3)", fullDate: "Thứ 3, 4 tháng 2, 2023", bookings: 1520000, parcels: 480000, growth: -12 },
        { date: "2023-02-05", label: "05/02 (T4)", fullDate: "Thứ 4, 5 tháng 2, 2023", bookings: 2100000, parcels: 650000, growth: 38 },
        { date: "2023-02-06", label: "06/02 (T5)", fullDate: "Thứ 5, 6 tháng 2, 2023", bookings: 2350000, parcels: 750000, growth: 12 },
        { date: "2023-02-07", label: "07/02 (T6)", fullDate: "Thứ 6, 7 tháng 2, 2023", bookings: 1980000, parcels: 620000, growth: -16 },
    ],
    "2024-01": [
        { date: "2024-01-02", label: "02/01 (T3)", fullDate: "Thứ 3, 2 tháng 1, 2024", bookings: 1950000, parcels: 620000, growth: 30 },
        { date: "2024-01-03", label: "03/01 (T4)", fullDate: "Thứ 4, 3 tháng 1, 2024", bookings: 1750000, parcels: 550000, growth: -10 },
        { date: "2024-01-04", label: "04/01 (T5)", fullDate: "Thứ 5, 4 tháng 1, 2024", bookings: 2050000, parcels: 650000, growth: 17 },
        { date: "2024-01-05", label: "05/01 (T6)", fullDate: "Thứ 6, 5 tháng 1, 2024", bookings: 2250000, parcels: 700000, growth: 10 },
        { date: "2024-01-06", label: "06/01 (T7)", fullDate: "Thứ 7, 6 tháng 1, 2024", bookings: 2100000, parcels: 680000, growth: -7 },
    ],
    "2024-02": [
        { date: "2024-02-03", label: "03/02 (T3)", fullDate: "Thứ 3, 3 tháng 2, 2024", bookings: 2150000, parcels: 650000, growth: 8 },
        { date: "2024-02-04", label: "04/02 (T4)", fullDate: "Thứ 4, 4 tháng 2, 2024", bookings: 1820000, parcels: 580000, growth: -15 },
        { date: "2024-02-05", label: "05/02 (T5)", fullDate: "Thứ 5, 5 tháng 2, 2024", bookings: 2480000, parcels: 780000, growth: 36 },
        { date: "2024-02-06", label: "06/02 (T6)", fullDate: "Thứ 6, 6 tháng 2, 2024", bookings: 2650000, parcels: 850000, growth: 7 },
        { date: "2024-02-07", label: "07/02 (T7)", fullDate: "Thứ 7, 7 tháng 2, 2024", bookings: 2280000, parcels: 720000, growth: -14 },
    ],
    "2025-01": [
        { date: "2025-01-02", label: "02/01 (T2)", fullDate: "Thứ 2, 2 tháng 1, 2025", bookings: 2350000, parcels: 710000, growth: 10 },
        { date: "2025-01-03", label: "03/01 (T3)", fullDate: "Thứ 3, 3 tháng 1, 2025", bookings: 2100000, parcels: 650000, growth: -11 },
        { date: "2025-01-04", label: "04/01 (T4)", fullDate: "Thứ 4, 4 tháng 1, 2025", bookings: 2650000, parcels: 820000, growth: 26 },
        { date: "2025-01-05", label: "05/01 (T5)", fullDate: "Thứ 5, 5 tháng 1, 2025", bookings: 2850000, parcels: 900000, growth: 7 },
        { date: "2025-01-06", label: "06/01 (T6)", fullDate: "Thứ 6, 6 tháng 1, 2025", bookings: 2680000, parcels: 850000, growth: -6 },
    ],
    "2025-02": [
        { date: "2025-02-03", label: "03/02 (T2)", fullDate: "Thứ 2, 3 tháng 2, 2025", bookings: 2450000, parcels: 720000, growth: 16 },
        { date: "2025-02-04", label: "04/02 (T3)", fullDate: "Thứ 3, 4 tháng 2, 2025", bookings: 1750000, parcels: 580000, growth: -28 },
        { date: "2025-02-05", label: "05/02 (T4)", fullDate: "Thứ 4, 5 tháng 2, 2025", bookings: 2800000, parcels: 850000, growth: 60 },
        { date: "2025-02-06", label: "06/02 (T5)", fullDate: "Thứ 5, 6 tháng 2, 2025", bookings: 3150000, parcels: 980000, growth: 12 },
        { date: "2025-02-07", label: "07/02 (T6)", fullDate: "Thứ 6, 7 tháng 2, 2025", bookings: 2450000, parcels: 780000, growth: -22 },
    ],
};

const monthlyData2023: RevenueData[] = [
    { date: "2023-01", label: "Tháng 1", fullDate: "Tháng 1 năm 2023", bookings: 35200000, parcels: 11000000, growth: 2 },
    { date: "2023-02", label: "Tháng 2", fullDate: "Tháng 2 năm 2023", bookings: 38500000, parcels: 12100000, growth: 9 },
    { date: "2023-03", label: "Tháng 3", fullDate: "Tháng 3 năm 2023", bookings: 42100000, parcels: 13200000, growth: 9 },
    { date: "2023-04", label: "Tháng 4", fullDate: "Tháng 4 năm 2023", bookings: 39800000, parcels: 12500000, growth: -5 },
    { date: "2023-05", label: "Tháng 5", fullDate: "Tháng 5 năm 2023", bookings: 45200000, parcels: 14200000, growth: 13 },
    { date: "2023-06", label: "Tháng 6", fullDate: "Tháng 6 năm 2023", bookings: 48900000, parcels: 15300000, growth: 8 },
    { date: "2023-07", label: "Tháng 7", fullDate: "Tháng 7 năm 2023", bookings: 51200000, parcels: 16100000, growth: 5 },
    { date: "2023-08", label: "Tháng 8", fullDate: "Tháng 8 năm 2023", bookings: 52800000, parcels: 16500000, growth: 3 },
    { date: "2023-09", label: "Tháng 9", fullDate: "Tháng 9 năm 2023", bookings: 49500000, parcels: 15500000, growth: -6 },
    { date: "2023-10", label: "Tháng 10", fullDate: "Tháng 10 năm 2023", bookings: 54100000, parcels: 17000000, growth: 9 },
    { date: "2023-11", label: "Tháng 11", fullDate: "Tháng 11 năm 2023", bookings: 58900000, parcels: 18500000, growth: 9 },
    { date: "2023-12", label: "Tháng 12", fullDate: "Tháng 12 năm 2023", bookings: 68200000, parcels: 21400000, growth: 16 },
];

const monthlyData2024: RevenueData[] = [
    { date: "2024-01", label: "Tháng 1", fullDate: "Tháng 1 năm 2024", bookings: 45200000, parcels: 14200000, growth: 3 },
    { date: "2024-02", label: "Tháng 2", fullDate: "Tháng 2 năm 2024", bookings: 52100000, parcels: 16300000, growth: 15 },
    { date: "2024-03", label: "Tháng 3", fullDate: "Tháng 3 năm 2024", bookings: 58900000, parcels: 18500000, growth: 13 },
    { date: "2024-04", label: "Tháng 4", fullDate: "Tháng 4 năm 2024", bookings: 55300000, parcels: 17200000, growth: -6 },
    { date: "2024-05", label: "Tháng 5", fullDate: "Tháng 5 năm 2024", bookings: 62100000, parcels: 19400000, growth: 12 },
    { date: "2024-06", label: "Tháng 6", fullDate: "Tháng 6 năm 2024", bookings: 68500000, parcels: 21200000, growth: 10 },
    { date: "2024-07", label: "Tháng 7", fullDate: "Tháng 7 năm 2024", bookings: 71200000, parcels: 22100000, growth: 4 },
    { date: "2024-08", label: "Tháng 8", fullDate: "Tháng 8 năm 2024", bookings: 73800000, parcels: 23000000, growth: 3 },
    { date: "2024-09", label: "Tháng 9", fullDate: "Tháng 9 năm 2024", bookings: 69500000, parcels: 21500000, growth: -6 },
    { date: "2024-10", label: "Tháng 10", fullDate: "Tháng 10 năm 2024", bookings: 76200000, parcels: 23800000, growth: 9 },
    { date: "2024-11", label: "Tháng 11", fullDate: "Tháng 11 năm 2024", bookings: 82100000, parcels: 25600000, growth: 8 },
    { date: "2024-12", label: "Tháng 12", fullDate: "Tháng 12 năm 2024", bookings: 95300000, parcels: 29700000, growth: 16 },
];

const monthlyData2025: RevenueData[] = [
    { date: "2025-01", label: "Tháng 1", fullDate: "Tháng 1 năm 2025", bookings: 58900000, parcels: 18500000, growth: 5 },
    { date: "2025-02", label: "Tháng 2", fullDate: "Tháng 2 năm 2025", bookings: 69230000, parcels: 21160000, growth: 18 },
    { date: "2025-03", label: "Tháng 3", fullDate: "Tháng 3 năm 2025", bookings: 72150000, parcels: 23420000, growth: 4 },
    { date: "2025-04", label: "Tháng 4", fullDate: "Tháng 4 năm 2025", bookings: 68900000, parcels: 20850000, growth: -4 },
    { date: "2025-05", label: "Tháng 5", fullDate: "Tháng 5 năm 2025", bookings: 75620000, parcels: 24200000, growth: 10 },
    { date: "2025-06", label: "Tháng 6", fullDate: "Tháng 6 năm 2025", bookings: 82450000, parcels: 26900000, growth: 9 },
    { date: "2025-07", label: "Tháng 7", fullDate: "Tháng 7 năm 2025", bookings: 78900000, parcels: 25100000, growth: -4 },
    { date: "2025-08", label: "Tháng 8", fullDate: "Tháng 8 năm 2025", bookings: 85200000, parcels: 27850000, growth: 8 },
    { date: "2025-09", label: "Tháng 9", fullDate: "Tháng 9 năm 2025", bookings: 81450000, parcels: 26200000, growth: -4 },
    { date: "2025-10", label: "Tháng 10", fullDate: "Tháng 10 năm 2025", bookings: 88900000, parcels: 29100000, growth: 9 },
    { date: "2025-11", label: "Tháng 11", fullDate: "Tháng 11 năm 2025", bookings: 95200000, parcels: 31200000, growth: 7 },
    { date: "2025-12", label: "Tháng 12", fullDate: "Tháng 12 năm 2025", bookings: 102300000, parcels: 34500000, growth: 8 },
];

const yearlyData: RevenueData[] = [
    { date: "2023", label: "2023", fullDate: "Năm 2023", bookings: 587800000, parcels: 184400000, growth: 0 },
    { date: "2024", label: "2024", fullDate: "Năm 2024", bookings: 812200000, parcels: 252300000, growth: 8 },
    { date: "2025", label: "2025", fullDate: "Năm 2025", bookings: 950230000, parcels: 299600000, growth: 17 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);

const fmtShort = (n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toString();
};

// ─── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, unit, trend, subtext, gradient }: {
    icon: React.ElementType; label: string; value: string; unit?: string;
    trend: number; subtext?: string; gradient: string;
}) => {
    const isPositive = trend >= 0;
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-orange-100/50 hover:-translate-y-1">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${gradient} opacity-[0.04] group-hover:opacity-[0.08] transition-opacity`} />
            <div className="relative">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                        {Math.abs(trend)}%
                    </div>
                </div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</p>
                {unit && <p className="text-xs text-gray-400 mt-1.5">{unit}</p>}
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
        </div>
    );
};

// ─── Custom Tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-2xl border border-gray-700/50">
            <p className="text-gray-300 text-xs font-medium mb-2">{label}</p>
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-gray-400 text-xs">{entry.name}:</span>
                    <span className="text-white text-xs font-bold">{fmt(entry.value)}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function RevenueDetail() {
    const [timeRange, setTimeRange] = useState<TimeRange>("week");
    const [selectedYear, setSelectedYear] = useState<number>(2025);
    const [selectedMonth, setSelectedMonth] = useState<number>(2);

    const getCurrentData = (): RevenueData[] => {
        switch (timeRange) {
            case "week": {
                const key = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
                return weekDataMap[key] ?? weekDataMap["2025-02"];
            }
            case "month":
                if (selectedYear === 2023) return monthlyData2023;
                if (selectedYear === 2024) return monthlyData2024;
                return monthlyData2025;
            case "year":
                return yearlyData;
            default:
                return weekDataMap["2025-02"];
        }
    };

    const currentData = getCurrentData();

    // FIX: typed callbacks (s: number, d: RevenueData)
    const bookingTotal = currentData.reduce((s: number, d: RevenueData) => s + d.bookings, 0);
    const parcelTotal = currentData.reduce((s: number, d: RevenueData) => s + d.parcels, 0);
    const grandTotal = bookingTotal + parcelTotal;
    const bookingPercent = grandTotal > 0 ? Math.round((bookingTotal / grandTotal) * 100) : 0;
    const parcelPercent = 100 - bookingPercent;

    const avgDaily = currentData.length > 0 ? Math.round(grandTotal / currentData.length) : 0;
    const maxDay = currentData.length > 0 ? Math.max(...currentData.map((d: RevenueData) => d.bookings + d.parcels)) : 0;
    const maxDayData = currentData.find((d: RevenueData) => d.bookings + d.parcels === maxDay);
    const maxDayLabel = maxDayData?.label ?? "-";

    const getTimeRangeLabel = () => {
        switch (timeRange) {
            case "week": return `Tuần (Tháng ${selectedMonth}/${selectedYear})`;
            case "month": return `Năm ${selectedYear}`;
            case "year": return "2023 - 2025";
            default: return "";
        }
    };

    const getChartTitle = () => {
        switch (timeRange) {
            case "week": return `Doanh thu theo ngày - T${selectedMonth}/${selectedYear}`;
            case "month": return `Doanh thu theo tháng - ${selectedYear}`;
            case "year": return "Doanh thu theo năm";
            default: return "Doanh thu";
        }
    };

    const getTableTitle = () => {
        switch (timeRange) {
            case "week": return { title: "Chi tiết theo ngày", subtitle: `Tháng ${selectedMonth}/${selectedYear}` };
            case "month": return { title: "Chi tiết theo tháng", subtitle: `Năm ${selectedYear}` };
            case "year": return { title: "Chi tiết theo năm", subtitle: "2023 - 2025" };
            default: return { title: "Chi tiết", subtitle: "" };
        }
    };

    const chartData = currentData.map((d: RevenueData) => ({
        name: d.label,
        "Vé xe": d.bookings,
        "Hàng hóa": d.parcels,
        total: d.bookings + d.parcels,
        growth: d.growth,
    }));

    const tableInfo = getTableTitle();

    return (
        <div className="min-h-screen bg-[#f8f9fc]">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/60">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-200">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Doanh thu</h1>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5 ml-[52px]">
                                <Calendar className="w-3.5 h-3.5" />
                                {getTimeRangeLabel()}
                            </p>
                        </div>

                        <div className="flex items-end gap-3 flex-wrap">
                            <div>
                                <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">Năm</label>
                                <div className="relative">
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 bg-white hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 cursor-pointer transition-all"
                                    >
                                        <option value={2023}>2023</option>
                                        <option value={2024}>2024</option>
                                        <option value={2025}>2025</option>
                                    </select>
                                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {timeRange === "week" && (
                                <div>
                                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">Tháng</label>
                                    <div className="relative">
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                            className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 bg-white hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 cursor-pointer transition-all"
                                        >
                                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                                                <option key={m} value={m}>Tháng {m}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            )}

                            <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
                                {(["week", "month", "year"] as TimeRange[]).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTimeRange(t)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${timeRange === t
                                            ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md shadow-orange-200"
                                            : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
                                        }`}
                                    >
                                        {t === "week" ? "Tuần" : t === "month" ? "Tháng" : "Năm"}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatCard icon={DollarSign} label="Tổng Doanh thu" value={fmt(grandTotal)} trend={18} subtext={getTimeRangeLabel()} gradient="from-orange-400 to-amber-500" />
                    <StatCard icon={Ticket} label="Doanh thu Vé Xe" value={fmt(bookingTotal)} unit={`${bookingPercent}% tổng doanh thu`} trend={12} gradient="from-orange-500 to-red-500" />
                    <StatCard icon={Package} label="Doanh thu Hàng Hóa" value={fmt(parcelTotal)} unit={`${parcelPercent}% tổng doanh thu`} trend={25} gradient="from-blue-400 to-blue-600" />
                    <StatCard
                        icon={TrendingUp}
                        label={timeRange === "year" ? "Trung bình / Năm" : timeRange === "month" ? "Trung bình / Tháng" : "Trung bình / Ngày"}
                        value={fmt(avgDaily)}
                        trend={8}
                        subtext={`Cao nhất: ${maxDayLabel}`}
                        gradient="from-emerald-400 to-teal-500"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Bar Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <BarChart3 className="w-4 h-4 text-orange-500" />
                                    <h2 className="text-lg font-bold text-gray-900">{getChartTitle()}</h2>
                                </div>
                                <p className="text-xs text-gray-400">So sánh doanh thu vé xe và hàng hóa</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                                    <span className="text-gray-500">Vé xe</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                                    <span className="text-gray-500">Hàng hóa</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-2 pb-4">
                            <ResponsiveContainer width="100%" height={340}>
                                <BarChart data={chartData} barCategoryGap="20%">
                                    <defs>
                                        <linearGradient id="gradBooking" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#FB923C" />
                                            <stop offset="100%" stopColor="#EA580C" />
                                        </linearGradient>
                                        <linearGradient id="gradParcel" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#60A5FA" />
                                            <stop offset="100%" stopColor="#2563EB" />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        angle={timeRange === "year" ? 0 : -35}
                                        textAnchor={timeRange === "year" ? "middle" : "end"}
                                        height={timeRange === "year" ? 40 : 70}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v: number) => fmtShort(v)}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(249,115,22,0.04)" }} />
                                    <Bar dataKey="Vé xe" fill="url(#gradBooking)" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="Hàng hóa" fill="url(#gradParcel)" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 pt-6 pb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <PieChartIcon className="w-4 h-4 text-blue-500" />
                                <h2 className="text-lg font-bold text-gray-900">Phân bổ</h2>
                            </div>
                            <p className="text-xs text-gray-400">Tỷ lệ doanh thu theo loại</p>
                        </div>
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <defs>
                                    <linearGradient id="pieOrange" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#FB923C" />
                                        <stop offset="100%" stopColor="#EA580C" />
                                    </linearGradient>
                                    <linearGradient id="pieBlue" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#60A5FA" />
                                        <stop offset="100%" stopColor="#2563EB" />
                                    </linearGradient>
                                </defs>
                                <Pie
                                    data={[
                                        { name: "Vé xe", value: bookingTotal },
                                        { name: "Hàng hóa", value: parcelTotal },
                                    ]}
                                    cx="50%" cy="50%"
                                    innerRadius={55} outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    <Cell fill="url(#pieOrange)" />
                                    <Cell fill="url(#pieBlue)" />
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
                                        if (!active || !payload?.length) return null;
                                        const item = payload[0];
                                        return (
                                            <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-2xl border border-gray-700/50">
                                                <p className="text-white text-xs font-bold">{item.name}</p>
                                                <p className="text-gray-300 text-xs">{fmt(item.value)}</p>
                                                <p className="text-orange-300 text-xs font-semibold">
                                                    {grandTotal > 0 ? ((item.value / grandTotal) * 100).toFixed(1) : 0}%
                                                </p>
                                            </div>
                                        );
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="px-6 pb-6 space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/70">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
                                    <span className="text-sm font-medium text-gray-700">Vé xe</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-extrabold text-gray-900">{bookingPercent}%</span>
                                    <p className="text-[10px] text-gray-400">{fmt(bookingTotal)}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">Hàng hóa</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-extrabold text-gray-900">{parcelPercent}%</span>
                                    <p className="text-[10px] text-gray-400">{fmt(parcelTotal)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <TableProperties className="w-4 h-4 text-gray-400" />
                                <h2 className="text-lg font-bold text-gray-900">{tableInfo.title}</h2>
                            </div>
                            <p className="text-xs text-gray-400">{tableInfo.subtitle} — Phân tích chi tiết</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-y border-gray-100 bg-gray-50/60">
                                    <th className="text-left py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">
                                        {timeRange === "year" ? "Năm" : timeRange === "month" ? "Tháng" : "Ngày"}
                                    </th>
                                    <th className="text-right py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">Vé xe</th>
                                    <th className="text-right py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">Hàng hóa</th>
                                    <th className="text-right py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">Tổng cộng</th>
                                    <th className="text-right py-3 px-6 text-[10px] uppercase tracking-wider font-bold text-gray-400">Tăng trưởng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* FIX: typed item, removed unused idx */}
                                {currentData.map((item: RevenueData) => {
                                    const total = item.bookings + item.parcels;
                                    const isGrowth = (item.growth ?? 0) >= 0;
                                    const isMax = total === maxDay;
                                    return (
                                        <tr key={item.date} className={`border-b border-gray-50 transition-colors hover:bg-orange-50/40 ${isMax ? "bg-orange-50/30" : ""}`}>
                                            <td className="py-3.5 px-6">
                                                <div className="flex items-center gap-2.5">
                                                    {isMax && <Crown className="w-3.5 h-3.5 text-orange-400" />}
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                                                        {item.fullDate && <p className="text-[11px] text-gray-400">{item.fullDate}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-right py-3.5 px-6">
                                                <span className="text-sm font-medium text-gray-700">{fmt(item.bookings)}</span>
                                            </td>
                                            <td className="text-right py-3.5 px-6">
                                                <span className="text-sm font-medium text-gray-700">{fmt(item.parcels)}</span>
                                            </td>
                                            <td className="text-right py-3.5 px-6">
                                                <span className={`text-sm font-bold ${isMax ? "text-orange-600" : "text-gray-900"}`}>{fmt(total)}</span>
                                            </td>
                                            <td className="text-right py-3.5 px-6">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isGrowth ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                                                    {isGrowth ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                                                    {Math.abs(item.growth ?? 0)}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-gray-200 bg-gray-50/80">
                                    <td className="py-4 px-6 font-bold text-gray-900 text-sm">Tổng cộng</td>
                                    <td className="text-right py-4 px-6"><span className="font-bold text-orange-600">{fmt(bookingTotal)}</span></td>
                                    <td className="text-right py-4 px-6"><span className="font-bold text-blue-600">{fmt(parcelTotal)}</span></td>
                                    <td className="text-right py-4 px-6"><span className="font-extrabold text-gray-900 text-base">{fmt(grandTotal)}</span></td>
                                    <td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Insight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-6 text-white shadow-xl shadow-orange-200/40">
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
                        <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1">
                                        {timeRange === "year" ? "Năm cao nhất" : timeRange === "month" ? "Tháng cao nhất" : "Ngày cao nhất"}
                                    </p>
                                    <p className="text-3xl font-extrabold">{maxDayLabel}</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                                    <Zap className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold mb-2">{fmt(maxDay)}</p>
                            <div className="flex items-center gap-2 text-orange-100 text-sm">
                                <ArrowUpRight className="w-4 h-4" />
                                Cao hơn TB {fmt(maxDay - avgDaily)} ({avgDaily > 0 ? Math.round(((maxDay - avgDaily) / avgDaily) * 100) : 0}%)
                            </div>
                            {maxDayData?.fullDate && <p className="text-orange-200/70 text-xs mt-3">{maxDayData.fullDate}</p>}
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-xl shadow-blue-200/40">
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
                        <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">Loại doanh thu dẫn đầu</p>
                                    <p className="text-3xl font-extrabold">Vé Xe</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                                    <Crown className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold mb-2">{fmt(bookingTotal)}</p>
                            <div className="flex items-center gap-2 text-blue-100 text-sm">
                                <Sparkles className="w-4 h-4" />
                                {bookingPercent}% tổng DT — hơn hàng hóa {fmt(bookingTotal - parcelTotal)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}