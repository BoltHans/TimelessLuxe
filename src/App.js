import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import WishlistPage from "./pages/WishlistPage";
import Register from "./pages/Register";
import LogIn from "./pages/Log-in";
import WomensSection from "./pages/WomensSection";
import MensSection from "./pages/MensSection";
import CheckoutPage from "./pages/Checkout";
import ServicesPage from "./pages/Services";
import ProductDetail from "./pages/ProductDetail";
import ProfilePage from "./pages/ProfilePage";
import Category from "./pages/Category";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProducts from "./pages/admin/ManageProduct";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Routes>
                        {/* Public Layout */}
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="contact" element={<ContactUs />} />
                            <Route path="wishlist" element={<WishlistPage />} />
                            <Route path="register" element={<Register />} />
                            <Route path="login" element={<LogIn />} />
                            <Route path="women" element={<WomensSection />} />
                            <Route path="men" element={<MensSection />} />
                            <Route path="checkout" element={<CheckoutPage />} />
                            <Route path="services" element={<ServicesPage />} />
                            <Route path="product/:id" element={<ProductDetail />} />
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="category/:id" element={<Category />} />
                        </Route>

                        {/* Admin Layout */}
                        <Route path="/admin" element={<Layout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="manage-users" element={<ManageUsers />} />
                            <Route path="manage-products" element={<ManageProducts />} />
                        </Route>
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;