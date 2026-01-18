import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Side2: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    KHUYẾN MÃI
                </h2>
                <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
            </div>

            {/* Static 3 images */}
            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <img
                            src="./images/Image1.png"
                            alt="Promo 3"
                            className="w-full h-full object-cover"
                        />

                        {/* Button overlay */}
                        <a
                            href="#"
                            className="
        absolute
        bottom-6
        left-1/2
        translate-x-8        /* đẩy sang phải thêm */
        -translate-x-1/2
        z-10
        inline-flex
        items-center
        px-4                 /* nhỏ hơn */
        py-2                 /* nhỏ hơn */
        bg-yellow-400        /* màu vàng */
        hover:bg-yellow-500
        text-gray-900        /* chữ đen cho dễ đọc */
        font-semibold        /* nhẹ hơn bold */
        text-base            /* chữ nhỏ hơn */
        rounded-full
        shadow-md            /* bóng nhẹ hơn */
        transition-all
        duration-300
        transform
        hover:scale-105
    "
                        >
                            View More →
                        </a>

                    </div>

                    {/* Card 2 */}
                    <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <img
                            src="./images/Image2.png"
                            alt="Promo 3"
                            className="w-full h-full object-cover"
                        />

                        {/* Button overlay */}
                        <a
                            href="#"
                            className="
        absolute
        bottom-6
        left-1/2
        translate-x-8        /* đẩy sang phải thêm */
        -translate-x-1/2
        z-10
        inline-flex
        items-center
        px-4                 /* nhỏ hơn */
        py-2                 /* nhỏ hơn */
        bg-yellow-400        /* màu vàng */
        hover:bg-yellow-500
        text-gray-900        /* chữ đen cho dễ đọc */
        font-semibold        /* nhẹ hơn bold */
        text-base            /* chữ nhỏ hơn */
        rounded-full
        shadow-md            /* bóng nhẹ hơn */
        transition-all
        duration-300
        transform
        hover:scale-105
    "
                        >
                            View More →
                        </a>

                    </div>

                    {/* Card 3 */}
                    <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <img
                            src="./images/Image3.png"
                            alt="Promo 3"
                            className="w-full h-full object-cover"
                        />

                        {/* Button overlay */}
                        <a
                            href="#"
                            className="
        absolute
        bottom-6
        left-1/2
        translate-x-8        /* đẩy sang phải thêm */
        -translate-x-1/2
        z-10
        inline-flex
        items-center
        px-4                 /* nhỏ hơn */
        py-2                 /* nhỏ hơn */
        bg-yellow-400        /* màu vàng */
        hover:bg-yellow-500
        text-gray-900        /* chữ đen cho dễ đọc */
        font-semibold        /* nhẹ hơn bold */
        text-base            /* chữ nhỏ hơn */
        rounded-full
        shadow-md            /* bóng nhẹ hơn */
        transition-all
        duration-300
        transform
        hover:scale-105
    "
                        >
                            View More →
                        </a>

                    </div>

                </div>

                {/* Optional arrows (nếu muốn để trang trí) */}
                <button className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
                    <ChevronLeft />
                </button>
                <button className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
};

export default Side2;
