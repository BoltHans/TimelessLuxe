import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const SearchBar = ({ onClose }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const snap = await getDocs(collection(db, "products"));
                setAllProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            } catch (e) { console.error("SearchBar fetch:", e); }
        };
        fetchAll();
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        const q = query.toLowerCase();
        setResults(
            allProducts
                .filter((p) =>
                    p.name?.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q) ||
                    p.subCategory?.toLowerCase().includes(q)
                )
                .slice(0, 6)
        );
    }, [query, allProducts]);

    const handleSelect = (id) => {
        navigate(`/product/${id}`);
        if (onClose) onClose();
    };

    return (
        <div className="relative w-full max-w-xl">
            <div className="flex items-center border border-luxury-border bg-luxury-card">
                <svg className="w-4 h-4 ml-4 text-luxury-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search luxury pieces..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="luxury-input border-0 bg-transparent py-3 px-3 text-sm"
                />
                {query && (
                    <button onClick={() => setQuery("")} className="pr-4 text-luxury-muted hover:text-gold-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-luxury-card border border-luxury-border z-50 shadow-xl">
                    {results.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => handleSelect(p.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-luxury-border transition-colors text-left"
                        >
                            <img
                                src={p.imageUrl || "https://via.placeholder.com/40"}
                                alt={p.name}
                                className="w-10 h-10 object-cover flex-shrink-0"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{p.name}</p>
                                <p className="text-gold-500 text-xs">${p.price}</p>
                            </div>
                            <span className="text-luxury-muted text-xs">{p.subCategory}</span>
                        </button>
                    ))}
                </div>
            )}

            {query && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 bg-luxury-card border border-luxury-border px-4 py-6 text-center text-luxury-muted text-sm">
                    No results for "{query}"
                </div>
            )}
        </div>
    );
};

export default SearchBar;
