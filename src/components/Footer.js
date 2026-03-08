import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-black border-t border-luxury-border mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-1 mb-4">
                            <span className="font-serif text-xl font-semibold text-gold-400 tracking-widest">TIMELESS</span>
                            <span className="font-serif text-xl text-white tracking-widest">LUXE</span>
                        </div>
                        <p className="text-luxury-muted text-sm leading-relaxed max-w-xs">
                            Curating timeless luxury pieces for the discerning individual. Each item tells a story of craftsmanship and elegance.
                        </p>
                        {/* Social */}
                        <div className="flex gap-4 mt-6">
                            {["instagram", "facebook", "twitter"].map((s) => (
                                <a key={s} href={`https://${s}.com`} target="_blank" rel="noreferrer" className="w-8 h-8 border border-luxury-border flex items-center justify-center text-luxury-muted hover:border-gold-500 hover:text-gold-400 transition-all">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        {s === "instagram" && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />}
                                        {s === "facebook" && <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />}
                                        {s === "twitter" && <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-white text-xs tracking-[0.2em] uppercase font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2">
                            {[["Women", "/women"], ["Men", "/men"], ["Services", "/services"]].map(([label, href]) => (
                                <li key={label}><Link to={href} className="text-luxury-muted hover:text-gold-400 text-sm transition-colors">{label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white text-xs tracking-[0.2em] uppercase font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            {[["Contact Us", "/contact"], ["Privacy Policy", "#"], ["Terms", "#"]].map(([label, href]) => (
                                <li key={label}><Link to={href} className="text-luxury-muted hover:text-gold-400 text-sm transition-colors">{label}</Link></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-luxury-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-luxury-muted text-xs">
                        © {new Date().getFullYear()} Timeless Luxe. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-luxury-muted text-xs">Crafted with</span>
                        <span className="text-gold-500 text-xs">✦</span>
                        <span className="text-luxury-muted text-xs">for luxury connoisseurs</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;