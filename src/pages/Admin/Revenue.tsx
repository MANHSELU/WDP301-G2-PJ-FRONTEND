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
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
// Week Data by month and year
const weekDataMap = {
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

// Monthly Data
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

// Yearly Data
const yearlyData: RevenueData[] = [
    { date: "2023", label: "2023", fullDate: "Năm 2023", bookings: 587800000, parcels: 184400000, growth: 0 },
    { date: "2024", label: "2024", fullDate: "Năm 2024", bookings: 812200000, parcels: 252300000, growth: 8 },
    { date: "2025", label: "2025", fullDate: "Năm 2025", bookings: 950230000, parcels: 299600000, growth: 17 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) => new Intl.NumberFormat("vi-VN").format(Math.round(n));

const COLORS = {
    bookings: "#F97316",
    parcels: "#3B82F6",
    success: "#10B981",
    danger: "#EF4444",
    neutral: "#6B7280",
};

// ─── Stat Card ──────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, unit, trend, subtext }) => {
    const isPositive = trend >= 0;
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-orange-300 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-xl">
                    <Icon className="w-6 h-6 text-orange-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    {Math.abs(trend)}%
                </div>
            </div>
            <div className="mb-2">
                <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
            {unit && <p className="text-xs text-gray-500">{unit}</p>}
            {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
        </div>
    );
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function RevenueDetail() {
    const [timeRange, setTimeRange] = useState<TimeRange>("week");
    const [selectedYear, setSelectedYear] = useState<number>(2025);
    const [selectedMonth, setSelectedMonth] = useState<number>(2);

    // Get data based on time range and selections
    const getCurrentData = () => {
        switch (timeRange) {
            case "week": {
                const key = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
                return weekDataMap[key] || weekDataMap["2025-02"];
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

    // Calculate totals
    const bookingTotal = currentData.reduce((s, d) => s + d.bookings, 0);
    const parcelTotal = currentData.reduce((s, d) => s + d.parcels, 0);
    const grandTotal = bookingTotal + parcelTotal;
    const bookingPercent = Math.round((bookingTotal / grandTotal) * 100);
    const parcelPercent = 100 - bookingPercent;

    // Calculate metrics
    const avgDaily = Math.round(grandTotal / currentData.length);
    const maxDay = Math.max(...currentData.map(d => d.bookings + d.parcels));
    const maxDayData = currentData.find(d => d.bookings + d.parcels === maxDay);
    const maxDayLabel = maxDayData?.label;

    // Time range labels
    const getTimeRangeLabel = () => {
        switch (timeRange) {
            case "week":
                return `Tuần (Tháng ${selectedMonth}/${selectedYear})`;
            case "month":
                return `Năm ${selectedYear}`;
            case "year":
                return "2023 - 2025";
            default:
                return "";
        }
    };

    const getChartTitle = () => {
        switch (timeRange) {
            case "week":
                return `Xu hướng Doanh thu (Theo ngày) - Tháng ${selectedMonth}/${selectedYear}`;
            case "month":
                return `Xu hướng Doanh thu (Theo tháng) - Năm ${selectedYear}`;
            case "year":
                return "Xu hướng Doanh thu (Theo năm)";
            default:
                return "Xu hướng Doanh thu";
        }
    };

    const getTableTitle = () => {
        switch (timeRange) {
            case "week":
                return { title: "Chi tiết theo từng ngày", subtitle: `Tháng ${selectedMonth}/${selectedYear}` };
            case "month":
                return { title: "Chi tiết theo từng tháng", subtitle: `Năm ${selectedYear}` };
            case "year":
                return { title: "Chi tiết theo năm", subtitle: "2023 - 2025" };
            default:
                return { title: "Chi tiết", subtitle: "" };
        }
    };

    // Chart data
    const chartData = currentData.map(d => ({
        name: d.label,
        "Vé xe": d.bookings,
        "Hàng hóa": d.parcels,
        growth: d.growth,
    }));

    const tableInfo = getTableTitle();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chi tiết Doanh thu</h1>
                            <p className="text-gray-600 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {getTimeRangeLabel()}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {/* Year Selector */}
                            <div className="w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn Năm</label>
                                <div className="relative">
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 bg-white hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                                    >
                                        <option value={2023}>Năm 2023</option>
                                        <option value={2024}>Năm 2024</option>
                                        <option value={2025}>Năm 2025</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                                </div>
                            </div>

                            {/* Month Selector (only for week view) */}
                            {timeRange === "week" && (
                                <div className="w-40">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Chọn Tháng</label>
                                    <div className="relative">
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                            className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 bg-white hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                                <option key={m} value={m}>Tháng {m}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                                    </div>
                                </div>
                            )}

                            {/* Time Range Buttons */}
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                                <div className="flex gap-2">
                                    {(["week", "month", "year"] as TimeRange[]).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTimeRange(t)}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${timeRange === t
                                                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* KPI Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        icon={DollarSign}
                        label="Tổng Doanh thu"
                        value={fmt(grandTotal)}
                        trend={18}
                        subtext={`${getTimeRangeLabel()}`}
                    />
                    <StatCard
                        icon={Ticket}
                        label="Vé Xe"
                        value={fmt(bookingTotal)}
                        unit={`${bookingPercent}% tổng doanh thu`}
                        trend={12}
                        subtext="Chi tiết doanh thu vé"
                    />
                    <StatCard
                        icon={Package}
                        label="Hàng Hóa"
                        value={fmt(parcelTotal)}
                        unit={`${parcelPercent}% tổng doanh thu`}
                        trend={25}
                        subtext="Chi tiết doanh thu hàng"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label={timeRange === "year" ? "Trung bình/Năm" : timeRange === "month" ? "Trung bình/Tháng" : "Trung bình/Ngày"}
                        value={fmt(avgDaily)}
                        trend={8}
                        subtext={`Cao nhất: ${maxDayLabel}`}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    {/* Revenue Trend Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{getChartTitle()}</h2>
                            <p className="text-sm text-gray-600">Biểu đồ doanh thu {getTimeRangeLabel()}</p>
                        </div>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#6b7280"
                                    angle={timeRange === "year" ? 0 : -45}
                                    textAnchor={timeRange === "year" ? "middle" : "end"}
                                    height={timeRange === "year" ? 40 : 80}
                                />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1f2937",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: "#fff",
                                    }}
                                    formatter={(value) => fmt(value)}
                                />
                                <Legend />
                                <Bar dataKey="Vé xe" fill={COLORS.bookings} radius={[8, 8, 0, 0]} />
                                <Bar dataKey="Hàng hóa" fill={COLORS.parcels} radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Revenue Distribution */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Phân bổ Doanh thu</h2>
                            <p className="text-sm text-gray-600">Tỷ lệ % theo loại</p>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: "Vé xe", value: bookingTotal },
                                        { name: "Hàng hóa", value: parcelTotal },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    <Cell fill={COLORS.bookings} />
                                    <Cell fill={COLORS.parcels} />
                                </Pie>
                                <Tooltip formatter={(value) => `${((value / grandTotal) * 100).toFixed(1)}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col gap-3 mt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.bookings }}></div>
                                    <span className="text-sm text-gray-700">Vé xe</span>
                                </div>
                                <span className="font-bold text-gray-900">{bookingPercent}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.parcels }}></div>
                                    <span className="text-sm text-gray-700">Hàng hóa</span>
                                </div>
                                <span className="font-bold text-gray-900">{parcelPercent}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Breakdown Table */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-10">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{tableInfo.title}</h2>
                        <p className="text-sm text-gray-600">{tableInfo.subtitle} - Phân tích chi tiết doanh thu</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                                        {timeRange === "year" ? "Năm" : timeRange === "month" ? "Tháng" : "Ngày"}
                                    </th>
                                    <th className="text-right py-4 px-4 font-semibold text-gray-900">Vé xe</th>
                                    <th className="text-right py-4 px-4 font-semibold text-gray-900">Hàng hóa</th>
                                    <th className="text-right py-4 px-4 font-semibold text-gray-900">Tổng</th>
                                    <th className="text-right py-4 px-4 font-semibold text-gray-900">Tăng/Giảm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.map((item) => {
                                    const total = item.bookings + item.parcels;
                                    const isGrowth = item.growth >= 0;
                                    return (
                                        <tr key={item.date} className="border-b border-gray-100 hover:bg-orange-50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{item.label}</p>
                                                    <p className="text-xs text-gray-500">{item.fullDate}</p>
                                                </div>
                                            </td>
                                            <td className="text-right py-4 px-4">
                                                <p className="font-semibold text-gray-900">{fmt(item.bookings)}</p>
                                            </td>
                                            <td className="text-right py-4 px-4">
                                                <p className="font-semibold text-gray-900">{fmt(item.parcels)}</p>
                                            </td>
                                            <td className="text-right py-4 px-4">
                                                <p className="font-bold text-orange-600 text-lg">{fmt(total)}</p>
                                            </td>
                                            <td className="text-right py-4 px-4">
                                                <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-sm ${isGrowth ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {isGrowth ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                                    {Math.abs(item.growth)}%
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-gray-200 bg-gray-50">
                                    <td className="py-4 px-4 font-bold text-gray-900">Tổng cộng</td>
                                    <td className="text-right py-4 px-4 font-bold text-orange-600 text-lg">{fmt(bookingTotal)}</td>
                                    <td className="text-right py-4 px-4 font-bold text-blue-600 text-lg">{fmt(parcelTotal)}</td>
                                    <td className="text-right py-4 px-4 font-bold text-gray-900 text-lg">{fmt(grandTotal)}</td>
                                    <td className="text-right py-4 px-4"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Performance Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Top Day */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-orange-700 text-sm font-medium mb-1">
                                    {timeRange === "year" ? "Năm Có Doanh Thu Cao Nhất" : timeRange === "month" ? "Tháng Có Doanh Thu Cao Nhất" : "Ngày Có Doanh Thu Cao Nhất"}
                                </p>
                                <p className="text-3xl font-bold text-orange-900">{maxDayLabel}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-orange-600" />
                        </div>
                        <p className="text-orange-800 font-semibold">{fmt(maxDay)}</p>
                        <p className="text-orange-700 text-sm mt-2">
                            Cao hơn trung bình {fmt(maxDay - avgDaily)} ({Math.round(((maxDay - avgDaily) / avgDaily) * 100)}%)
                        </p>
                        {maxDayData?.fullDate && (
                            <p className="text-orange-600 text-xs mt-2 italic">{maxDayData.fullDate}</p>
                        )}
                    </div>

                    {/* Best Performer */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-blue-700 text-sm font-medium mb-1">Loại Doanh Thu Cao Nhất</p>
                                <p className="text-3xl font-bold text-blue-900">Vé Xe</p>
                            </div>
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-blue-800 font-semibold">{fmt(bookingTotal)}</p>
                        <p className="text-blue-700 text-sm mt-2">
                            {bookingPercent}% tổng doanh thu (cao hơn hàng hóa {fmt(bookingTotal - parcelTotal)})
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}