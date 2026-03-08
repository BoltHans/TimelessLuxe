import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function AdminDashboard() {
    const { role, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && role !== "admin") navigate("/login");
    }, [loading, role, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-luxury-bg py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-2">Control Panel</p>
                    <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">Admin Dashboard</h1>
                    <div className="gold-divider ml-0" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/admin/manage-products" className="group luxury-card p-8 block relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-4xl mb-4 block">✧</span>
                                <h3 className="font-serif text-2xl text-white mb-2">Manage Products</h3>
                                <p className="text-luxury-muted text-sm">Add, edit, delete, or toggle visibility of your luxury inventory.</p>
                            </div>
                            <span className="text-gold-500 border border-gold-500/30 p-2 rounded-full group-hover:bg-gold-500 group-hover:text-black transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                            </span>
                        </div>
                    </Link>

                    <Link to="/admin/manage-users" className="group luxury-card p-8 block relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-4xl mb-4 block">👥</span>
                                <h3 className="font-serif text-2xl text-white mb-2">Manage Users</h3>
                                <p className="text-luxury-muted text-sm">View registered clients and promote staff to administrator roles.</p>
                            </div>
                            <span className="text-gold-500 border border-gold-500/30 p-2 rounded-full group-hover:bg-gold-500 group-hover:text-black transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}