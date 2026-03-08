import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, role } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/");
    };

    const initials = user?.displayName
        ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : user?.email?.slice(0, 2).toUpperCase();

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/50 border-b border-luxury-border"
                : "bg-black/80 backdrop-blur-sm border-b border-luxury-border"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-1">
                        <span className="font-serif text-xl font-semibold text-gold-400 tracking-widest">TIMELESS</span>
                        <span className="font-serif text-xl text-white tracking-widest">LUXE</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-gray-300 hover:text-gold-400 text-sm tracking-widest uppercase transition-colors">Home</Link>
                        <Link to="/women" className="text-gray-300 hover:text-gold-400 text-sm tracking-widest uppercase transition-colors">Women</Link>
                        <Link to="/men" className="text-gray-300 hover:text-gold-400 text-sm tracking-widest uppercase transition-colors">Men</Link>
                        <Link to="/services" className="text-gray-300 hover:text-gold-400 text-sm tracking-widest uppercase transition-colors">Services</Link>
                        <Link to="/contact" className="text-gray-300 hover:text-gold-400 text-sm tracking-widest uppercase transition-colors">Contact</Link>
                    </div>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Cart */}
                        <Link to="/checkout" className="relative p-2 text-gray-300 hover:text-gold-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-gold-500 text-black text-[10px] font-bold rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {!user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-gray-300 hover:text-gold-400 text-sm tracking-widest uppercase transition-colors">Login</Link>
                                <Link to="/register" className="btn-gold text-xs py-2 px-4">Register</Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                {user && <Link to="/wishlist" className="text-gray-300 hover:text-gold-400 text-sm tracking-widest uppercase transition-colors">Wishlist</Link>}
                                {role === "admin" && (
                                    <Link to="/admin" className="badge-gold text-xs py-1 px-3 uppercase tracking-wider">Admin</Link>
                                )}
                                <Link to="/profile" className="w-8 h-8 rounded-full bg-gold-500 text-black flex items-center justify-center text-xs font-bold hover:bg-gold-400 transition-colors">
                                    {initials}
                                </Link>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-xs tracking-wider uppercase transition-colors">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-3">
                        <Link to="/checkout" className="relative p-2 text-gray-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-gold-500 text-black text-[10px] font-bold rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 p-2">
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-luxury-border py-4 space-y-3 animate-fade-in">
                        {[
                            { to: "/", label: "Home" },
                            { to: "/women", label: "Women" },
                            { to: "/men", label: "Men" },
                            { to: "/services", label: "Services" },
                            { to: "/contact", label: "Contact" },
                        ].map((link) => (
                            <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)}
                                className="block text-gray-300 hover:text-gold-400 text-sm tracking-widest uppercase py-2 transition-colors">
                                {link.label}
                            </Link>
                        ))}
                        <div className="border-t border-luxury-border pt-3">
                            {!user ? (
                                <div className="flex gap-3">
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-300 text-sm uppercase tracking-wider">Login</Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-gold text-xs py-2 px-4">Register</Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 text-sm uppercase tracking-wider">Wishlist</Link>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 text-sm uppercase tracking-wider">Profile</Link>
                                    {role === "admin" && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-gold-400 text-sm uppercase tracking-wider">Admin</Link>}
                                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-red-400 text-sm uppercase tracking-wider">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;