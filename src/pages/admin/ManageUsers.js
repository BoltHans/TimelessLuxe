import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
    const { role, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!authLoading && role !== "admin") navigate("/login");
    }, [authLoading, role, navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            setFetching(true);
            try {
                const snapshot = await getDocs(collection(db, "users"));
                // Sort admins first, then by date (if available) or email
                const fetchedUsers = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => {
                    if (a.role === "admin" && b.role !== "admin") return -1;
                    if (a.role !== "admin" && b.role === "admin") return 1;
                    const nameA = (a.displayName || a.email || "").toLowerCase();
                    const nameB = (b.displayName || b.email || "").toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                setUsers(fetchedUsers);
            } catch (e) {
                console.error("Failed to fetch users", e);
            } finally {
                setFetching(false);
            }
        };
        fetchUsers();
    }, []);

    const toggleRole = async (user) => {
        // Prevent removing the only admin (basic check)
        if (user.role === "admin" && users.filter(u => u.role === "admin").length <= 1) {
            alert("Cannot demote the last administrator.");
            return;
        }

        if (!window.confirm(`Are you sure you want to change ${user.displayName || user.email}'s role to ${user.role === "admin" ? "user" : "admin"}?`)) {
            return;
        }

        const newRole = user.role === "admin" ? "user" : "admin";
        try {
            await updateDoc(doc(db, "users", user.id), { role: newRole });
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
            );
        } catch (e) {
            console.error("Role update failed", e);
            alert("Failed to update role. Please ensure you have sufficient permissions.");
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
                    <p className="text-gold-400 text-xs tracking-[0.4em] uppercase mb-2">Client Management</p>
                    <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">Manage Users</h1>
                    <div className="gold-divider ml-0" />
                </div>

                <div className="bg-luxury-card border border-luxury-border p-6 sm:p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-luxury-border">
                        <h3 className="font-serif text-xl text-white">All Accounts</h3>
                        <span className="text-luxury-muted text-xs tracking-widest uppercase">{users.length} total</span>
                    </div>

                    {fetching ? (
                        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-16 border border-luxury-border border-dashed">
                            <p className="text-luxury-muted text-sm">No users found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-luxury-border">
                                        <th className="pb-3 text-xs tracking-widest uppercase text-luxury-muted font-medium">Client</th>
                                        <th className="pb-3 text-xs tracking-widest uppercase text-luxury-muted font-medium">Email Address</th>
                                        <th className="pb-3 text-xs tracking-widest uppercase text-luxury-muted font-medium">Role</th>
                                        <th className="pb-3 text-xs tracking-widest uppercase text-luxury-muted font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-luxury-border">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-luxury-border/30 transition-colors">
                                            <td className="py-4 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-xs font-serif text-gold-400">
                                                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{user.displayName || "Not provided"}</p>
                                                        <p className="text-luxury-muted text-xs font-mono">{user.id.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span className="text-gray-300 text-sm">{user.email}</span>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span className={`text-[10px] px-2 py-1 uppercase tracking-wider border ${user.role === "admin"
                                                        ? "border-gold-500/50 text-gold-400 bg-gold-500/10"
                                                        : "border-luxury-border text-luxury-muted"
                                                    }`}>
                                                    {user.role || "user"}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button
                                                    onClick={() => toggleRole(user)}
                                                    className={`text-xs px-3 py-1.5 transition-colors border ${user.role === "admin"
                                                            ? "border-luxury-border text-luxury-muted hover:border-red-500/50 hover:text-red-400"
                                                            : "border-gold-500/30 text-gold-400 hover:bg-gold-500/10"
                                                        }`}
                                                >
                                                    {user.role === "admin" ? "Demote" : "Promote to Admin"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
