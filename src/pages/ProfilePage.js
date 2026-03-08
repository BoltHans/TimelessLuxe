import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("orders"); // orders | services | details

    useEffect(() => {
        if (!user) { navigate("/login"); return; }

        const fetchProfileData = async () => {
            try {
                const [ordersSnap, servicesSnap] = await Promise.all([
                    getDocs(collection(db, "users", user.uid, "orders")),
                    getDocs(collection(db, "users", user.uid, "services"))
                ]);

                setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => new Date(b.date) - new Date(a.date)));
                setServices(servicesSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => new Date(b.date) - new Date(a.date)));
            } catch (e) { console.error("Profile fetch error:", e); }
            setLoading(false);
        };

        fetchProfileData();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-luxury-bg py-12 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    <div className="w-24 h-24 rounded-full bg-gold-500/10 border border-gold-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl font-serif text-gold-400">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="font-serif text-3xl text-white mb-1">{user.displayName || "Valued Client"}</h1>
                        <p className="text-luxury-muted text-sm">{user.email}</p>
                        {role === "admin" && (
                            <span className="badge-gold mt-3">Administrator</span>
                        )}
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-luxury-border mb-8 overflow-x-auto">
                    {[
                        { id: "orders", label: "Order History", count: orders.length },
                        { id: "services", label: "Service Requests", count: services.length },
                        { id: "details", label: "Account Details" }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 px-6 text-sm tracking-widest uppercase transition-colors whitespace-nowrap border-b-2 ${activeTab === tab.id
                                    ? "border-gold-500 text-gold-400"
                                    : "border-transparent text-luxury-muted hover:text-white"
                                }`}
                        >
                            {tab.label} {tab.count !== undefined && `(${tab.count})`}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {loading ? (
                    <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                    <div className="animate-fade-in">

                        {/* Orders Tab */}
                        {activeTab === "orders" && (
                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <p className="text-luxury-muted text-center py-12 border border-luxury-border">No orders found.</p>
                                ) : (
                                    orders.map(order => (
                                        <div key={order.id} className="bg-luxury-card border border-luxury-border p-6">
                                            <div className="flex flex-wrap justify-between items-center border-b border-luxury-border pb-4 mb-4 gap-4">
                                                <div>
                                                    <p className="text-xs text-luxury-muted uppercase tracking-widest mb-1">Order Placed</p>
                                                    <p className="text-white text-sm">{new Date(order.date).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-luxury-muted uppercase tracking-widest mb-1">Total</p>
                                                    <p className="text-gold-400 text-sm font-semibold">${order.total?.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-luxury-muted uppercase tracking-widest mb-1">Status</p>
                                                    <span className={`text-xs px-2 py-1 rounded inline-block ${order.status === "completed" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                                                        }`}>
                                                        {order.status || "Processing"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                {order.items?.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4">
                                                        <img src={item.imageUrl || "https://via.placeholder.com/40"} alt={item.name} className="w-12 h-12 object-cover" />
                                                        <div className="flex-1">
                                                            <p className="text-white text-sm">{item.name}</p>
                                                        </div>
                                                        <span className="text-luxury-muted text-sm">${item.price?.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Services Tab */}
                        {activeTab === "services" && (
                            <div className="space-y-4">
                                {services.length === 0 ? (
                                    <p className="text-luxury-muted text-center py-12 border border-luxury-border">No service requests found.</p>
                                ) : (
                                    services.map(service => (
                                        <div key={service.id} className="bg-luxury-card border border-luxury-border p-6 flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-serif text-xl text-white">{service.serviceName}</h3>
                                                    <span className="text-gold-400 text-xs tracking-wider uppercase border border-gold-500/30 px-2 py-0.5 bg-gold-500/10">
                                                        {service.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-luxury-muted uppercase tracking-wider mb-3">
                                                    Requested on {new Date(service.date).toLocaleDateString()}
                                                </p>
                                                <div className="border border-luxury-border/50 bg-black/30 p-4">
                                                    <p className="text-gray-400 text-sm whitespace-pre-wrap">"{service.note}"</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Details Tab */}
                        {activeTab === "details" && (
                            <div className="bg-luxury-card border border-luxury-border p-8 max-w-2xl">
                                <h3 className="font-serif text-2xl text-white mb-6">Account Information</h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs text-luxury-muted tracking-widest uppercase mb-1">Full Name</p>
                                        <p className="text-white pb-2 border-b border-luxury-border">{user.displayName || "Not provided"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-luxury-muted tracking-widest uppercase mb-1">Email Address</p>
                                        <p className="text-white pb-2 border-b border-luxury-border">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-luxury-muted tracking-widest uppercase mb-1">Account ID</p>
                                        <p className="text-luxury-muted text-sm pb-2 border-b border-luxury-border font-mono">{user.uid}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </div>
        </div>
    );
}
