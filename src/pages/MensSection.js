import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";

const SUBCATEGORIES = ["All", "Bags", "Wallets", "Watches", "Jewelry"];

export default function MensSection() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        const fetchMen = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "products"), where("gender", "==", "men"));
                const snap = await getDocs(q);
                const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
                    .filter((p) => p.status === "active");
                setProducts(items);
            } catch (e) { console.error("MensSection:", e); }
            setLoading(false);
        };
        fetchMen();
    }, []);

    const filtered = activeFilter === "All"
        ? products
        : products.filter((p) => p.subCategory === activeFilter);

    return (
        <div className="min-h-screen bg-luxury-bg">
            {/* Hero Banner */}
            <div className="relative h-64 md:h-80 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
                    <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-3">Collection</p>
                    <h1 className="font-serif text-4xl md:text-6xl text-white mb-2">Men's Luxury</h1>
                    <div className="w-12 h-px bg-gold-500 mt-2" />
                </div>
            </div>

            {/* Filter Bar */}
            <div className="border-b border-luxury-border bg-luxury-card sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 py-3 overflow-x-auto">
                    <span className="text-luxury-muted text-xs tracking-widest uppercase mr-2 flex-shrink-0">Filter:</span>
                    {SUBCATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`flex-shrink-0 px-4 py-1.5 text-xs tracking-widest uppercase transition-all border ${activeFilter === cat
                                    ? "border-gold-500 text-gold-400 bg-gold-500/10"
                                    : "border-luxury-border text-luxury-muted hover:border-gold-600 hover:text-gold-500"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                    <span className="ml-auto text-luxury-muted text-xs flex-shrink-0">{filtered.length} items</span>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => <div key={i} className="h-72 skeleton" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-3xl mb-4">✦</p>
                        <p className="text-luxury-muted text-lg">No {activeFilter !== "All" ? activeFilter : ""} pieces available yet</p>
                        <p className="text-luxury-muted text-sm mt-2">Check back soon or explore other categories.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
