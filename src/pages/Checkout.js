import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CheckoutPage() {
    const { cartItems, cartCount, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [payment, setPayment] = useState({ cardNumber: "", expiry: "", cvv: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

    const formatCard = (val) =>
        val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const formatExpiry = (val) =>
        val.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!user) { navigate("/login"); return; }
        if (cartCount === 0) return;
        setLoading(true);
        try {
            await addDoc(collection(db, "users", user.uid, "orders"), {
                items: cartItems.map((i) => ({ name: i.name, price: i.price, imageUrl: i.imageUrl })),
                total,
                status: "completed",
                date: new Date().toISOString(),
            });
            await clearCart();
            setSuccess(true);
        } catch (err) {
            console.error("Checkout error:", err);
            alert("Something went wrong. Please try again.");
        } finally { setLoading(false); }
    };

    if (!user) return (
        <div className="min-h-screen bg-luxury-bg flex flex-col items-center justify-center text-center px-4">
            <p className="text-luxury-muted text-lg mb-6">Please sign in to checkout</p>
            <Link to="/login" className="btn-gold">Sign In</Link>
        </div>
    );

    if (success) return (
        <div className="min-h-screen bg-luxury-bg flex flex-col items-center justify-center text-center px-4 animate-fade-in">
            <div className="w-16 h-16 border border-gold-500 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="font-serif text-3xl text-white mb-3">Order Confirmed</h2>
            <div className="gold-divider mb-6" />
            <p className="text-luxury-muted mb-8">Thank you for your purchase. We'll be in touch shortly.</p>
            <div className="flex gap-4">
                <Link to="/" className="btn-gold">Continue Shopping</Link>
                <Link to="/profile" className="btn-ghost">View Orders</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-luxury-bg py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="font-serif text-3xl text-white mb-2">Checkout</h1>
                <div className="gold-divider mb-10" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Order Summary */}
                    <div>
                        <h2 className="text-xs text-luxury-muted tracking-widest uppercase mb-5">Order Summary</h2>
                        {cartItems.length === 0 ? (
                            <div className="border border-luxury-border p-8 text-center">
                                <p className="text-luxury-muted mb-4">Your cart is empty</p>
                                <Link to="/" className="btn-ghost text-xs">Browse Products</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cartItems.map((item) => (
                                    <div key={item.docId} className="flex items-center gap-4 border border-luxury-border p-4">
                                        <img
                                            src={item.imageUrl || "https://via.placeholder.com/60"}
                                            alt={item.name}
                                            className="w-14 h-14 object-cover flex-shrink-0"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{item.name}</p>
                                        </div>
                                        <span className="text-gold-400 font-semibold">${item.price?.toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="border-t border-luxury-border pt-4 flex justify-between items-center">
                                    <span className="text-luxury-muted text-sm uppercase tracking-wider">Total</span>
                                    <span className="text-gold-400 text-2xl font-light">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment */}
                    <div>
                        <h2 className="text-xs text-luxury-muted tracking-widest uppercase mb-5">Payment Details</h2>
                        <div className="bg-luxury-card border border-luxury-border p-6">
                            <form onSubmit={handlePayment} className="space-y-5">
                                <div>
                                    <label className="text-xs text-luxury-muted tracking-widest uppercase mb-2 block">Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        value={payment.cardNumber}
                                        onChange={(e) => setPayment({ ...payment, cardNumber: formatCard(e.target.value) })}
                                        className="luxury-input font-mono tracking-widest"
                                        required
                                        maxLength={19}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-luxury-muted tracking-widest uppercase mb-2 block">Expiry</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={payment.expiry}
                                            onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                                            className="luxury-input font-mono"
                                            required
                                            maxLength={5}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-luxury-muted tracking-widest uppercase mb-2 block">CVV</label>
                                        <input
                                            type="password"
                                            placeholder="•••"
                                            value={payment.cvv}
                                            onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                                            className="luxury-input font-mono"
                                            required
                                            maxLength={4}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || cartCount === 0}
                                    className="btn-gold w-full justify-center py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            Processing...
                                        </span>
                                    ) : `Pay $${total.toFixed(2)}`}
                                </button>
                            </form>

                            <div className="mt-5 flex items-center justify-center gap-2 text-luxury-muted">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                </svg>
                                <span className="text-xs tracking-wider">Secured & Encrypted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
