import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, getDocs, doc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const CartContext = createContext({ cartItems: [], cartCount: 0, addToCart: () => { }, removeFromCart: () => { }, clearCart: () => { } });

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!user) { setCartItems([]); return; }
        try {
            const snap = await getDocs(collection(db, "users", user.uid, "cart"));
            setCartItems(snap.docs.map((d) => ({ docId: d.id, ...d.data() })));
        } catch (e) {
            console.error("Cart fetch failed:", e);
        }
    }, [user]);

    useEffect(() => { fetchCart(); }, [fetchCart]);

    const addToCart = useCallback(async (product) => {
        if (!user) return false;
        // prevent duplicates
        const exists = cartItems.find((i) => i.productId === product.id);
        if (exists) return false;
        try {
            const ref = await addDoc(collection(db, "users", user.uid, "cart"), {
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl || "",
                gender: product.gender || "",
                subCategory: product.subCategory || "",
            });
            setCartItems((prev) => [...prev, { docId: ref.id, productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl || "" }]);
            return true;
        } catch (e) {
            console.error("Add to cart failed:", e);
            return false;
        }
    }, [user, cartItems]);

    const removeFromCart = useCallback(async (docId) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, "users", user.uid, "cart", docId));
            setCartItems((prev) => prev.filter((i) => i.docId !== docId));
        } catch (e) {
            console.error("Remove from cart failed:", e);
        }
    }, [user]);

    const clearCart = useCallback(async () => {
        if (!user) return;
        try {
            await Promise.all(cartItems.map((i) => deleteDoc(doc(db, "users", user.uid, "cart", i.docId))));
            setCartItems([]);
        } catch (e) {
            console.error("Clear cart failed:", e);
        }
    }, [user, cartItems]);

    return (
        <CartContext.Provider value={{ cartItems, cartCount: cartItems.length, addToCart, removeFromCart, clearCart, refetchCart: fetchCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() { return useContext(CartContext); }
