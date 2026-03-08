import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";

export default function Category() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            setLoading(true);
            try {
                // Fetch Category Info
                const catRef = doc(db, "categories", id);
                const catSnap = await getDoc(catRef);
                if (catSnap.exists()) {
                    setCategory({ id: catSnap.id, ...catSnap.data() });
                } else {
                    navigate("/"); // Fallback if category doesn't exist
                    return;
                }

                // Fetch Products for this Category
                const q = query(
                    collection(db, "products"),
                    where("subCategory", "==", catSnap.data().name)
                );
                const prodSnap = await getDocs(q);
                const items = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }))
                    .filter(p => p.status === "active");
                setProducts(items);

            } catch (e) {
                console.error("Category fetch error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryAndProducts();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-luxury-bg">
            {/* Hero Banner */}
            {category && (
                <div className="relative h-64 md:h-80 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${category.bannerUrl || "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200&q=80"}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
                        <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-3">Category</p>
                        <h1 className="font-serif text-4xl md:text-6xl text-white mb-2">{category.name}</h1>
                        {category.description && (
                            <p className="text-luxury-muted max-w-xl text-sm leading-relaxed mt-2">{category.description}</p>
                        )}
                        <div className="w-12 h-px bg-gold-500 mt-4" />
                    </div>
                </div>
            )}

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-10 pb-4 border-b border-luxury-border">
                    <h2 className="font-serif text-2xl text-white">Discovered Pieces</h2>
                    <span className="text-luxury-muted text-xs tracking-widest uppercase">{products.length} items</span>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-3xl mb-4">✦</p>
                        <p className="text-luxury-muted text-lg">No pieces available in this category yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((p) => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
