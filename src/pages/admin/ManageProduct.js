import { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductSubmission from "../../components/ProductSubmission";

export default function ManageProducts() {
    const { role, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [fetching, setFetching] = useState(true);

    const fetchProducts = useCallback(async () => {
        setFetching(true);
        try {
            const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        } catch (e) {
            // Fallback if index isn't created yet
            try {
                const snapshot = await getDocs(collection(db, "products"));
                setProducts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
            } catch (err) {
                console.error("Failed to fetch products", err);
            }
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && role !== "admin") navigate("/login");
    }, [authLoading, role, navigate]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this product?")) return;
        try {
            await deleteDoc(doc(db, "products", id));
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (e) {
            console.error("Delete failed", e);
            alert("Delete failed");
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        try {
            await updateDoc(doc(db, "products", id), { status: newStatus });
            setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        } catch (e) {
            console.error("Status update failed", e);
            alert("Status update failed");
        }
    };

    if (authLoading) return (
        <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-luxury-bg py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-2">Inventory Room</p>
                    <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">Manage Products</h1>
                    <div className="gold-divider ml-0" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Add Product Form */}
                    <div className="lg:col-span-1">
                        <ProductSubmission onAdded={fetchProducts} />
                    </div>

                    {/* Product List */}
                    <div className="lg:col-span-2">
                        <div className="bg-luxury-card border border-luxury-border p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-luxury-border">
                                <h3 className="font-serif text-xl text-white">All Products</h3>
                                <span className="text-luxury-muted text-xs tracking-widest uppercase">{products.length} items</span>
                            </div>

                            {fetching ? (
                                <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-16 border border-luxury-border border-dashed">
                                    <p className="text-luxury-muted text-sm">No products found. Add the first piece to your collection.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {products.map((product) => (
                                        <div key={product.id} className="border border-luxury-border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-gold-500/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.imageUrl || "https://via.placeholder.com/60"}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover bg-black"
                                                    onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }}
                                                />
                                                <div>
                                                    <p className="text-white text-sm font-medium mb-1 line-clamp-1" title={product.name}>{product.name}</p>
                                                    <div className="flex flex-wrap gap-2 items-center">
                                                        <span className="text-gold-400 text-xs">${product.price?.toLocaleString() || product.price}</span>
                                                        <span className="text-luxury-muted text-xs">•</span>
                                                        <span className="text-luxury-muted text-xs capitalize">{product.gender}</span>
                                                        <span className="text-luxury-muted text-xs">•</span>
                                                        <span className="text-luxury-muted text-xs">{product.subCategory}</span>
                                                        <span className="text-luxury-muted text-xs">•</span>
                                                        <button
                                                            onClick={() => toggleStatus(product.id, product.status)}
                                                            className={`text-[10px] px-1.5 py-0.5 uppercase tracking-wider border transition-colors ${product.status === "active"
                                                                    ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                                                                    : "border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20"
                                                                }`}
                                                        >
                                                            {product.status || "active"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-luxury-border sm:border-0 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="text-xs text-luxury-muted hover:text-red-400 uppercase tracking-widest pl-2 transition-colors"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}