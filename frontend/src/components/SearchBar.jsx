import React, { useEffect } from "react";

function SearchBar({ searchQuery, setSearchQuery }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        const input = document.getElementById("global-search");
        input?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="relative group">
        
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-slate-400 group-focus-within:text-blue-500 transition-colors">
            🔍
          </span>
        </div>

        <input
          id="global-search"
          type="text"
          placeholder="Search for books, electronics, or rooms in Ramtek..."
          className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-white placeholder:text-slate-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <span className="hidden md:block text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
            Press /
          </span>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;