import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, X, Plus, Minus } from "lucide-react";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modalRef = useRef(null);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [maxGuests, setMaxGuests] = useState(searchParams.get("maxGuests") || "");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setMaxGuests(searchParams.get("maxGuests") || "");
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) params.append("search", search.trim());
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (maxGuests) params.append("maxGuests", maxGuests);
    params.append("page", "1");

    navigate(`/?${params.toString()}`);
    setShowFilters(false);
  };

  const handleReset = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setMaxGuests("");
    navigate("/");
    setShowFilters(false);
  };

  return (
    <div className="relative w-full" ref={modalRef}>
      
      {/* 3-Part Airbnb Search Box Container */}
      <button
        onClick={() => setShowFilters(true)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-full bg-white shadow-lg hover:shadow-xl transition-all p-2 pl-6 cursor-pointer border-opacity-80"
      >
        <div className="grid grid-cols-3 flex-1 text-left divide-x divide-gray-200 pr-4">
          
          {/* Segment 1: Where */}
          <div className="px-2">
            <span className="block text-[11px] font-bold text-gray-900 leading-tight">Where</span>
            <span className="block text-xs text-gray-500 truncate">
              {search ? search : "Search destinations"}
            </span>
          </div>

          {/* Segment 2: When */}
          <div className="px-4">
            <span className="block text-[11px] font-bold text-gray-900 leading-tight">When</span>
            <span className="block text-xs text-gray-500 truncate">
              Add dates
            </span>
          </div>

          {/* Segment 3: Who */}
          <div className="px-4">
            <span className="block text-[11px] font-bold text-gray-900 leading-tight">Who</span>
            <span className="block text-xs text-gray-500 truncate">
              {maxGuests ? `${maxGuests} guests` : "Add guests"}
            </span>
          </div>

        </div>

        {/* Circular Crimson Search Icon Button */}
        <div className="w-12 h-12 rounded-full bg-[#FF385C] text-white flex items-center justify-center shrink-0 hover:bg-[#E00B41] transition shadow-md">
          <Search size={18} strokeWidth={2.5} />
        </div>
      </button>

      {/* Interactive Search Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in duration-150">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900">Search & Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Where</label>
                <input
                  type="text"
                  placeholder="Search destinations (e.g. North Goa, Baga, Puducherry)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                />
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Price range</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min (₹)</label>
                    <input
                      type="number"
                      placeholder="₹0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max (₹)</label>
                    <input
                      type="number"
                      placeholder="₹50,000+"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Who</h4>
                  <p className="text-xs text-gray-500">Number of guests</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMaxGuests(Math.max(0, (parseInt(maxGuests) || 0) - 1).toString())}
                    disabled={!maxGuests || parseInt(maxGuests) <= 0}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-gray-900">
                    {maxGuests || "0"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMaxGuests(((parseInt(maxGuests) || 0) + 1).toString())}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </form>

            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-gray-800 underline hover:text-black bg-transparent border-none cursor-pointer"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm rounded-xl transition cursor-pointer"
              >
                <Search size={16} />
                <span>Search</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SearchBar;
