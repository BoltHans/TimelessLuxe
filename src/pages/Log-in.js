import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            const snap = await getDoc(doc(db, "users", cred.user.uid));
            const role = snap.exists() ? snap.data().role || "user" : "user";
            navigate(role === "admin" ? "/admin" : redirectTo);
        } catch (err) {
            setError(
                err.code === "auth/invalid-credential"
                    ? "Invalid email or password"
                    : err.message || "Login failed"
            );
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-luxury-bg flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-1 mb-4">
                        <span className="font-serif text-2xl font-semibold text-gold-400 tracking-widest">TIMELESS</span>
                        <span className="font-serif text-2xl text-white tracking-widest">LUXE</span>
                    </div>
                    <h2 className="font-serif text-3xl text-white mb-2">Welcome Back</h2>
                    <div className="gold-divider" />
                </div>

                {/* Card */}
                <div className="bg-luxury-card border border-luxury-border p-8">
                    {error && (
                        <div className="border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-3 text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-xs text-luxury-muted tracking-widest uppercase mb-2 block">Email</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="luxury-input"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs text-luxury-muted tracking-widest uppercase mb-2 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="luxury-input pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-gold-400 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showPw
                                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        }
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gold w-full justify-center py-4 text-sm mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    Signing In...
                                </span>
                            ) : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-luxury-muted text-sm">
                            New to Timeless Luxe?{" "}
                            <Link to="/register" className="text-gold-400 hover:text-gold-300 transition-colors">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
