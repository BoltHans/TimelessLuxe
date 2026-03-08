import { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const SERVICES = [
    { id: 1, name: "Luxury Bag Spa", desc: "Professional deep cleaning, leather conditioning, and hardware polishing for designer bags.", price: 150, icon: "🧳" },
    { id: 2, name: "Watch Servicing & Polishing", desc: "Expert movement check, ultrasonic cleaning, and scratch removal for luxury timepieces.", price: 250, icon: "⌚" },
    { id: 3, name: "Jewelry Restoration", desc: "Rhodium plating, prong tightening, and ultrasonic shine restoration for fine jewelry.", price: 120, icon: "💎" },
    { id: 4, name: "Bespoke Engraving", desc: "Personalized hand-engraving for watches, jewelry, or leather goods.", price: 85, icon: "✒️" },
];

export default function ServicesPage() {
    const [selected, setSelected] = useState(null);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Fetch from Firestore if needed, but static is fine for standard services

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) { alert("Please log in to book a service"); return; }
        setLoading(true);
        try {
            await addDoc(collection(db, "users", auth.currentUser.uid, "services"), {
                serviceId: selected.id,
                serviceName: selected.name,
                note,
                status: "requested",
                date: new Date().toISOString(),
            });
            setSuccess(true);
            setSelected(null);
            setNote("");
        } catch (err) {
            console.error("Service booking error:", err);
            alert("Failed to request service.");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-luxury-bg py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-3">White Glove</p>
                    <h1 className="font-serif text-4xl text-white mb-2">Luxury Services</h1>
                    <div className="gold-divider" />
                    <p className="text-luxury-muted max-w-xl mx-auto mt-6">
                        Preserve the pristine condition of your most treasured pieces with our expert restoration and care services.
                    </p>
                </div>

                {success && (
                    <div className="mb-12 bg-emerald-500/10 border border-emerald-500/30 p-6 text-center animate-fade-in max-w-2xl mx-auto">
                        <h3 className="font-serif text-emerald-400 text-xl mb-2">Service Requested Successfully</h3>
                        <p className="text-emerald-500/80 text-sm">Our concierge team will contact you shortly to arrange the details and collection of your item.</p>
                        <button onClick={() => setSuccess(false)} className="mt-4 text-xs uppercase tracking-widest text-emerald-400 hover:text-white transition-colors">Book Another</button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {SERVICES.map((s) => (
                        <div key={s.id} className="luxury-card p-8 flex flex-col items-start text-left">
                            <span className="text-4xl mb-4">{s.icon}</span>
                            <h3 className="font-serif text-2xl text-white mb-2">{s.name}</h3>
                            <p className="text-luxury-muted text-sm leading-relaxed mb-6 flex-1">{s.desc}</p>
                            <div className="flex items-center justify-between w-full mt-auto">
                                <span className="text-gold-400 font-semibold text-lg">Starts at ${s.price}</span>
                                <button
                                    onClick={() => setSelected(s)}
                                    className="btn-ghost text-xs px-4 py-2"
                                >
                                    Request Service
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Booking Modal */}
                {selected && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
                        <div className="bg-luxury-card border border-gold-500/30 w-full max-w-lg p-8 animate-slide-up relative">
                            <button
                                onClick={() => setSelected(null)}
                                className="absolute top-4 right-4 text-luxury-muted hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            <p className="text-gold-400 text-xs tracking-widest uppercase mb-2">Book Service</p>
                            <h3 className="font-serif text-2xl text-white mb-6">{selected.name}</h3>

                            <form onSubmit={handleBooking} className="space-y-5">
                                <div>
                                    <label className="text-xs text-luxury-muted tracking-widest uppercase mb-2 block">Item Details / Special Requests</label>
                                    <textarea
                                        rows={4}
                                        placeholder="E.g., Brand, model, current condition..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="luxury-input resize-none"
                                        required
                                    />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-4 text-sm">
                                        {loading ? "Submitting..." : `Submit Request • Base Price: $${selected.price}`}
                                    </button>
                                    <p className="text-luxury-muted text-xs text-center mt-4">Final price will be confirmed upon physical assessment of the item.</p>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
