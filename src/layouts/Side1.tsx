import { Calendar, MapPin, Users } from "lucide-react";

const BusBookingApp: React.FC = () => {
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100">
                <div className="max-w-7xl mx-auto">
                    {/* Main Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl overflow-hidden relative">
                        {/* Background Decorative Elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 opacity-30 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100 opacity-30 rounded-full blur-3xl"></div>

                        <div className="relative grid md:grid-cols-2 gap-8">
                            {/* Left Side - Content */}
                            <div className="flex flex-col justify-center space-y-6 pl-24">

                                {/* Title */}
                                <div>
                                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">
                                        Tìm và đặt
                                    </h1>
                                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">
                                        ngay chuyến xe
                                    </h1>
                                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                                        thật <span className="text-orange-500">Dễ Dáng</span>
                                    </h1>
                                    <p className="text-gray-600 text-lg">
                                        Đặt vé mọi lúc mọi nơi
                                    </p>
                                </div>
                            </div>
                            {/* Right Side - Bus Illustration */}
                            {/* Right Side - Bus Illustration */}
                            <div className="flex items-center justify-center relative">
                                <div className="hidden lg:flex items-center justify-center relative">
                                    <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-300 rounded-full opacity-30 blur-2xl" />
                                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-300 rounded-full opacity-30 blur-2xl" />

                                    <img
                                        src="/images/otocheck.png"
                                        alt="Bus illustration"
                                        className="relative z-10 w-[90%] max-w-none object-contain"
                                    />
                                </div>
                            </div>

                            {/* thêm ở đây  */}
                            {/* FORM ĐẶT VÉ */}
                            <div className="md:col-span-2 flex justify-center -mt-20 mb-12">
                                <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                        {/* Điểm đi */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Điểm đi
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    placeholder="Vị trí hiện tại"
                                                    className="w-full pl-10 pr-4 py-3 border rounded-lg
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        {/* Điểm đến */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Điểm đến
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    placeholder="Chọn điểm đến"
                                                    className="w-full pl-10 pr-4 py-3 border rounded-lg
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        {/* Ngày */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ngày đặt vé
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="date"
                                                    className="w-full pl-10 pr-4 py-3 border rounded-lg
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        {/* Số vé */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số lượng vé
                                            </label>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={20}
                                                    className="w-full pl-10 pr-4 py-3 border rounded-lg
                        focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        {/* Nút đặt vé */}
                                        <div className="flex">
                                            <button
                                                className="w-full h-[52px] rounded-xl bg-orange-500 text-white font-semibold
                    hover:bg-orange-600 transition shadow-lg"
                                            >
                                                🚍 Đặt vé
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BusBookingApp;
