import React from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-orange-400 text-white py-10 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div
                    className="
                        grid grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-5
                        gap-8 mb-10
                        text-center sm:text-left
                    "
                >
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                                <span className="text-orange-400 font-bold">B</span>
                            </div>
                            <span className="text-xl font-bold">BUSTRIP</span>
                        </div>

                        <div className="flex gap-3 text-sm justify-center sm:justify-start">
                            <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <div>FPT University</div>
                                <div>Da Nang Campus</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm justify-center sm:justify-start">
                            <Phone className="w-5 h-5 flex-shrink-0" />
                            <span>+803 4784 273 12</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm justify-center sm:justify-start">
                            <Mail className="w-5 h-5 flex-shrink-0" />
                            <span>Bustrip@gmail.com</span>
                        </div>
                    </div>

                    {/* Our Product */}
                    <div>
                        <h3 className="font-semibold text-base sm:text-lg mb-3">
                            Our Product
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:underline">Career</a></li>
                            <li><a href="#" className="hover:underline">Car</a></li>
                            <li><a href="#" className="hover:underline">Packages</a></li>
                            <li><a href="#" className="hover:underline">Features</a></li>
                            <li><a href="#" className="hover:underline">Priceline</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-base sm:text-lg mb-3">
                            Resources
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:underline">Download</a></li>
                            <li><a href="#" className="hover:underline">Help Centre</a></li>
                            <li><a href="#" className="hover:underline">Guides</a></li>
                            <li><a href="#" className="hover:underline">Partner Network</a></li>
                            <li><a href="#" className="hover:underline">Cruises</a></li>
                            <li><a href="#" className="hover:underline">Developer</a></li>
                        </ul>
                    </div>

                    {/* About Rentcars */}
                    <div>
                        <h3 className="font-semibold text-base sm:text-lg mb-3">
                            About Rentcars
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:underline">Why choose us</a></li>
                            <li><a href="#" className="hover:underline">Our Story</a></li>
                            <li><a href="#" className="hover:underline">Investor Relations</a></li>
                            <li><a href="#" className="hover:underline">Press Center</a></li>
                            <li><a href="#" className="hover:underline">Advertise</a></li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="font-semibold text-base sm:text-lg mb-3">
                            Follow Us
                        </h3>
                        <div className="flex gap-4 justify-center sm:justify-start">
                            <a
                                href="#"
                                className="w-10 h-10 border-2 border-white rounded flex items-center justify-center hover:bg-white hover:text-orange-400 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 border-2 border-white rounded flex items-center justify-center hover:bg-white hover:text-orange-400 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 border-2 border-white rounded flex items-center justify-center hover:bg-white hover:text-orange-400 transition-colors"
                                aria-label="YouTube"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-6 border-t border-orange-300 text-center sm:text-left">
                    <p className="text-sm">
                        Copyright 2023 · Bustrip , All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
