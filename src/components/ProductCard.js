import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useState } from "react";

export default function ProductCard({ product }) {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);
    const [cartMsg, setCartMsg] = useState("");

    const handleWishlist = async (e) => {
        e.stopPropagation();
        if (!user) { navigate("/login"); return; }
        setWishlistLoading(true);
        try {
            const ref = doc(db, "users", user.uid, "wishlist", product.id);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                await deleteDoc(ref);
                setInWishlist(false);
            } else {
                await setDoc(ref, { productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || "" });
                setInWishlist(true);
            }
        } catch (e) { console.error("Wishlist error:", e); }
        setWishlistLoading(false);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!user) { navigate("/login"); return; }
        setCartLoading(true);
        const added = await addToCart(product);
        setCartLoading(false);
        setCartMsg(added ? "Added!" : "In cart");
        setTimeout(() => setCartMsg(""), 2000);
    };

    return (
        <div
            onClick={() => navigate(`/product/${product.id}`)}
            className="luxury-card group cursor-pointer flex flex-col overflow-hidden"
        >
            {/* Image */}
            <div className="product-img-wrap h-64 bg-luxury-border flex-shrink-0">
                <img
                    src={product.imageUrl || "https://via.placeholder.com/400x400/141414/d4982a?text=Timeless+Luxe"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x400/141414/d4982a?text=Timeless+Luxe"; }}
                />
                {/* Wishlist heart */}
                <button
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/70 rounded-full transition-all hover:bg-gold-500/80 z-10"
                    title="Add to Wishlist"
                >
                    <svg className={`w-4 h-4 ${inWishlist ? "text-gold-400 fill-gold-400" : "text-white"}`}
                        fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                {product.subCategory && (
                    <span className="text-gold-500 text-xs tracking-[0.2em] uppercase mb-1">{product.subCategory}</span>
                )}
                <h3 className="font-serif text-white text-base font-medium leading-snug mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-luxury-muted text-xs line-clamp-2 mb-3 flex-1">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-gold-400 font-semibold text-lg">
                        ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        disabled={cartLoading}
                        className={`text-xs px-3 py-1.5 uppercase tracking-wider font-semibold transition-all border ${cartMsg === "Added!"
                                ? "border-emerald-500 text-emerald-400"
                                : cartMsg === "In cart"
                                    ? "border-gold-500 text-gold-400"
                                    : "border-luxury-border text-gray-400 hover:border-gold-500 hover:text-gold-400"
                            }`}
                    >
                        {cartLoading ? "..." : cartMsg || "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}