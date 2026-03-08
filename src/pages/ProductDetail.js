import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { setDoc, deleteDoc } from "firebase/firestore";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartMsg, setCartMsg] = useState("");
    const [wishlistMsg, setWishlistMsg] = useState("");

    useEffect(() => {
        const fetch = async () => {
            try {
                const snap = await getDoc(doc(db, "products", id));
                if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
            } catch (e) { console.error("ProductDetail:", e); }
            setLoading(false);
        };
        fetch();
    }, [id]);

    const handleCart = async () => {
        if (!user) { navigate("/login"); return; }
        const added = await addToCart(product);
        setCartMsg(added ? "Added to cart!" : "Already in cart");
        setTimeout(() => setCartMsg(""), 2500);
    };

    const handleWishlist = async () => {
        if (!user) { navigate("/login"); return; }
        try {
            const ref = doc(db, "users", user.uid, "wishlist", product.id);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                await deleteDoc(ref);
                setWishlistMsg("Removed from wishlist");
            } else {
                await setDoc(ref, { productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || "" });
                setWishlistMsg("Added to wishlist!");
            }
            setTimeout(() => setWishlistMsg(""), 2500);
        } catch (e) { console.error("Wishlist:", e); }
    };

    if (loading) return (
        <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-luxury-bg flex flex-col items-center justify-center text-luxury-muted">
            <p className="text-xl mb-4">Product not found</p>
            <button onClick={() => navigate(-1)} className="btn-ghost">Go Back</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-luxury-bg py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="text-luxury-muted text-xs tracking-widest uppercase mb-8 flex items-center gap-2">
                    <button onClick={() => navigate("/")} className="hover:text-gold-400 transition-colors">Home</button>
                    <span>/</span>
                    <button onClick={() => navigate(`/${product.gender}`)} className="hover:text-gold-400 transition-colors capitalize">{product.gender}</button>
                    <span>/</span>
                    <span className="text-gold-400">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="product-img-wrap aspect-square bg-luxury-card border border-luxury-border">
                        <img
                            src={product.imageUrl || "https://via.placeholder.com/600"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/600/141414/d4982a?text=Timeless+Luxe"; }}
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        {product.subCategory && (
                            <span className="text-gold-400 text-xs tracking-[0.3em] uppercase mb-3">{product.subCategory}</span>
                        )}
                        <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">{product.name}</h1>
                        <div className="w-12 h-px bg-gold-500 mb-6" />

                        <p className="text-3xl font-light text-gold-400 mb-6">
                            ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                        </p>

                        <p className="text-gray-400 leading-relaxed mb-8">{product.description}</p>

                        {/* Status */}
                        <div className="flex items-center gap-2 mb-8">
                            <div className={`w-2 h-2 rounded-full ${product.status === "active" ? "bg-emerald-500 animate-pulse-gold" : "bg-red-500"}`} />
                            <span className="text-xs text-luxury-muted uppercase tracking-wider">
                                {product.status === "active" ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2 flex-wrap mb-8">
                            {product.gender && <span className="badge-gold capitalize">{product.gender}</span>}
                            {product.subCategory && <span className="badge-gold">{product.subCategory}</span>}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button onClick={handleCart} className="btn-gold w-full justify-center py-4 text-sm">
                                {cartMsg || "Add to Cart"}
                            </button>
                            <button onClick={handleWishlist} className="btn-ghost w-full justify-center py-4 text-sm">
                                {wishlistMsg || "♡  Save to Wishlist"}
                            </button>
                        </div>

                        {/* Extra info */}
                        <div className="border-t border-luxury-border mt-8 pt-6 space-y-3">
                            {[["Shipping", "Free worldwide shipping on all orders"], ["Returns", "30-day returns on all items"], ["Authenticity", "All items verified authentic"]].map(([k, v]) => (
                                <div key={k} className="flex gap-3">
                                    <span className="text-gold-500 text-xs tracking-widest uppercase w-24 flex-shrink-0">{k}</span>
                                    <span className="text-luxury-muted text-xs">{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
