import React from 'react'

function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-gray-400 group-focus-within:text-ramtekRed transition-colors">🔍</span>
        </div>
        
        <input
          type="text"
          placeholder="Search for books, electronics, or rooms in Ramtek..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-ramtekRed transition-all text-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {/* Shortcut hint (Nice UI touch) */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <span className="hidden md:block text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            Press / to search
          </span>
        </div>
      </div>
    </div>
  )
}

export default SearchBar