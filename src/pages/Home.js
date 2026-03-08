import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const q = query(
                    collection(db, "products"),
                    where("status", "==", "active"),
                    orderBy("createdAt", "desc"),
                    limit(8)
                );
                const snap = await getDocs(q);
                setFeaturedProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            } catch (e) {
                // Fallback without orderBy if no index
                try {
                    const snap = await getDocs(collection(db, "products"));
                    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
                        .filter((p) => p.status === "active")
                        .slice(0, 8);
                    setFeaturedProducts(all);
                } catch (err) { console.error("Featured products:", err); }
            } finally { setLoading(false); }
        };
        fetchFeatured();
    }, []);

    const categories = [
        { label: "Women", href: "/women", desc: "Bags · Jewelry · Watches", gradient: "from-rose-900/60 to-black/80" },
        { label: "Men", href: "/men", desc: "Wallets · Watches · Accessories", gradient: "from-slate-900/60 to-black/80" },
        { label: "Services", href: "/services", desc: "Repair · Restoration · Custom", gradient: "from-gold-900/40 to-black/80" },
    ];

    return (
        <div className="min-h-screen bg-luxury-bg">
            {/* ── Hero ── */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=1600&q=80')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />

                {/* Content */}
                <div className="relative z-10 text-center px-4 animate-fade-in">
                    <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-6 font-medium">The Art of Luxury</p>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight">
                        Timeless<br />
                        <span className="text-gold-400 italic">Luxe</span>
                    </h1>
                    <div className="gold-divider mb-8" />
                    <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed">
                        Curated luxury accessories and bespoke services for those who demand the extraordinary.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/women" className="btn-gold">Shop Women</Link>
                        <Link to="/men" className="btn-ghost">Shop Men</Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-luxury-muted animate-bounce">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </section>

            {/* ── Search Bar ── */}
            <section className="bg-luxury-card border-b border-luxury-border py-6">
                <div className="max-w-3xl mx-auto px-4">
                    <SearchBar />
                </div>
            </section>

            {/* ── Shop By Category ── */}
            <section className="py-20 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <p className="section-subheading">Discover</p>
                    <h2 className="section-heading">Shop By Category</h2>
                    <div className="gold-divider mb-12" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.map((cat) => (
                            <Link
                                key={cat.label}
                                to={cat.href}
                                className="group relative h-72 overflow-hidden flex items-end p-8 cursor-pointer"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} transition-all duration-500 group-hover:opacity-90`} />
                                <div className="absolute inset-0 bg-luxury-card opacity-50" />
                                {/* Decorative lines */}
                                <div className="absolute top-6 left-6 w-8 h-px bg-gold-500 transition-all duration-500 group-hover:w-16" />
                                <div className="absolute top-6 left-6 h-8 w-px bg-gold-500" />
                                <div className="relative z-10">
                                    <p className="text-gold-400 text-xs tracking-[0.2em] uppercase mb-2">{cat.desc}</p>
                                    <h3 className="font-serif text-3xl text-white group-hover:text-gold-300 transition-colors">{cat.label}</h3>
                                </div>
                                <div className="absolute bottom-6 right-6 w-8 h-8 border border-gold-500/40 flex items-center justify-center group-hover:border-gold-400 transition-colors">
                                    <svg className="w-4 h-4 text-gold-500 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Brand Strip ── */}
            <section className="bg-gold-500 py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-6 md:gap-16 items-center">
                        {["Free Worldwide Shipping", "Authenticity Guaranteed", "Expert Restoration", "Bespoke Services"].map((t) => (
                            <div key={t} className="flex items-center gap-2 text-black">
                                <span className="text-xs">✦</span>
                                <span className="text-xs tracking-widest uppercase font-semibold">{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Products ── */}
            <section className="py-20 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <p className="section-subheading">Latest Arrivals</p>
                    <h2 className="section-heading">Featured Pieces</h2>
                    <div className="gold-divider mb-12" />

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-72 skeleton rounded" />
                            ))}
                        </div>
                    ) : featuredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-luxury-muted text-lg mb-2">No products yet</p>
                            <p className="text-luxury-muted text-sm">Add products via the admin panel to see them here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}

                    {featuredProducts.length > 0 && (
                        <div className="text-center mt-12">
                            <Link to="/women" className="btn-ghost mr-4">View Women</Link>
                            <Link to="/men" className="btn-ghost">View Men</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Services Teaser ── */}
            <section className="py-20 px-4 bg-luxury-card border-t border-luxury-border">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="section-subheading">White Glove Care</p>
                    <h2 className="section-heading">Luxury Services</h2>
                    <div className="gold-divider mb-8" />
                    <p className="text-luxury-muted max-w-lg mx-auto mb-10">
                        From expert restoration to personalised engraving — we breathe new life into your treasured pieces.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {[
                            { icon: "🧳", title: "Bag Repair", desc: "Professional cleaning & restoration for designer bags" },
                            { icon: "⌚", title: "Watch Service", desc: "Strap customisation & engraving for timepieces" },
                            { icon: "💎", title: "Jewelry Polish", desc: "Expert polishing to restore original brilliance" },
                        ].map((s) => (
                            <div key={s.title} className="border border-luxury-border p-6 text-center hover:border-gold-600 transition-colors">
                                <div className="text-3xl mb-3">{s.icon}</div>
                                <h3 className="font-serif text-white text-lg mb-2">{s.title}</h3>
                                <p className="text-luxury-muted text-sm">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                    <Link to="/services" className="btn-gold">Explore Services</Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
