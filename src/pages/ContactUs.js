import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ContactUs = () => {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "contactMessages"), {
                ...form,
                timestamp: serverTimestamp(),
            });
            setSuccess(true);
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            console.error("Contact form error:", err);
            alert("Failed to send. Please try again.");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-luxury-bg py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-3">Get in Touch</p>
                    <h1 className="font-serif text-4xl text-white mb-2">Contact Us</h1>
                    <div className="gold-divider" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                    {/* Info */}
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <p className="text-xs text-luxury-muted tracking-widest uppercase mb-4">Reach Us</p>
                            {[
                                { icon: "✉", label: "Email", val: "hello@timelessluxe.com" },
                                { icon: "📞", label: "Phone", val: "+1 (800) LUXE-001" },
                                { icon: "📍", label: "Address", val: "123 Bond Street, London" },
                            ].map((item) => (
                                <div key={item.label} className="flex gap-4 mb-5 border-b border-luxury-border pb-5 last:border-0">
                                    <span className="text-lg">{item.icon}</span>
                                    <div>
                                        <p className="text-xs text-luxury-muted tracking-wider uppercase mb-0.5">{item.label}</p>
                                        <p className="text-gray-300 text-sm">{item.val}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="md:col-span-3">
                        {success ? (
                            <div className="bg-luxury-card border border-gold-500/30 p-10 text-center animate-fade-in">
                                <p className="text-gold-400 text-3xl mb-4">✦</p>
                                <h3 className="font-serif text-2xl text-white mb-3">Message Sent</h3>
                                <p className="text-luxury-muted text-sm">Thank you for reaching out. We'll respond within 24 hours.</p>
                                <button onClick={() => setSuccess(false)} className="btn-ghost text-xs mt-6 py-2 px-6">Send Another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-luxury-card border border-luxury-border p-8 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs text-luxury-muted tracking-widest uppercase mb-2 block">Name</label>
                                        <input type="text" placeholder="Your Name" value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="luxury-input" required />
                                    </div>
                                    <div>
                                        <label className="text-xs text-luxury-muted tracking-widest uppercase mb-2 block">Email</label>
                                        <input type="email" placeholder="your@email.com" value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="luxury-input" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-luxury-muted tracking-widest uppercase mb-2 block">Subject</label>
                                    <input type="text" placeholder="How can we help?" value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        className="luxury-input" required />
                                </div>
                                <div>
                                    <label className="text-xs text-luxury-muted tracking-widest uppercase mb-2 block">Message</label>
                                    <textarea rows={5} placeholder="Your message..." value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="luxury-input resize-none" required />
                                </div>
                                <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3">
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            Sending...
                                        </span>
                                    ) : "Send Message"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
