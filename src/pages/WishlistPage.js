import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) { navigate("/login"); return; }
        const fetchWishlist = async () => {
            try {
                const snap = await getDocs(collection(db, "users", user.uid, "wishlist"));
                setWishlist(snap.docs.map((d) => ({ docId: d.id, ...d.data() })));
            } catch (e) { console.error("Wishlist:", e); }
            setLoading(false);
        };
        fetchWishlist();
    }, [user, navigate]);

    const handleRemove = async (docId) => {
        try {
            await deleteDoc(doc(db, "users", user.uid, "wishlist", docId));
            setWishlist((prev) => prev.filter((i) => i.docId !== docId));
        } catch (e) { console.error("Remove wishlist:", e); }
    };

    const handleMoveToCart = async (item) => {
        const product = { id: item.productId || item.docId, name: item.name, price: item.price, imageUrl: item.imageUrl };
        const added = await addToCart(product);
        if (added) {
            await handleRemove(item.docId);
        } else {
            alert("Already in cart");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-luxury-bg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-luxury-bg py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-3">Your</p>
                    <h1 className="font-serif text-4xl text-white mb-2">Wishlist</h1>
                    <div className="gold-divider" />
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-6">♡</p>
                        <h2 className="font-serif text-2xl text-white mb-3">Your wishlist is empty</h2>
                        <p className="text-luxury-muted mb-8">Save pieces you love and they'll appear here.</p>
                        <div className="flex gap-4 justify-center">
                            <Link to="/women" className="btn-ghost">Shop Women</Link>
                            <Link to="/men" className="btn-ghost">Shop Men</Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Wishlist table */}
                        <div className="space-y-3 mb-10">
                            {wishlist.map((item) => (
                                <div key={item.docId} className="flex items-center gap-4 bg-luxury-card border border-luxury-border p-4">
                                    <img
                                        src={item.imageUrl || "https://via.placeholder.com/80"}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover flex-shrink-0"
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/80"; }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{item.name}</p>
                                        <p className="text-gold-400 text-sm">${item.price?.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleMoveToCart(item)}
                                            className="btn-gold text-xs py-2 px-4"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => handleRemove(item.docId)}
                                            className="p-2 text-luxury-muted hover:text-red-400 transition-colors"
                                            title="Remove"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-luxury-border pt-6">
                            <p className="text-luxury-muted text-sm">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</p>
                            <Link to="/checkout" className="btn-gold">Proceed to Checkout</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
