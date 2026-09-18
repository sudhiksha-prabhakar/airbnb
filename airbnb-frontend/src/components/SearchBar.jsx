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

  // Sync state on navigation change
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setMaxGuests(searchParams.get("maxGuests") || "");
  }, [searchParams]);

  // Click outside to close filter modal
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
      
      {/* Authentic Airbnb Oval Search Bar Pill */}
      <button
        onClick={() => setShowFilters(true)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-full py-2 px-3 shadow-xs hover:shadow-md transition cursor-pointer bg-white"
      >
        <div className="flex items-center divide-x divide-gray-300 text-xs sm:text-sm font-semibold text-gray-800 flex-1 overflow-hidden">
          <span className="px-2.5 sm:px-3 text-ellipsis overflow-hidden whitespace-nowrap text-gray-900">
            {search ? search : "Anywhere"}
          </span>
          <span className="px-2.5 sm:px-3 text-ellipsis overflow-hidden whitespace-nowrap text-gray-700 hidden sm:inline">
            Any week
          </span>
          <span className="px-2.5 sm:px-3 text-gray-500 font-normal text-ellipsis overflow-hidden whitespace-nowrap">
            {maxGuests ? `${maxGuests} guests` : "Add guests"}
          </span>
        </div>

        {/* Circular Search Icon Button */}
        <div className="w-8 h-8 rounded-full bg-[#FF385C] text-white flex items-center justify-center shrink-0 hover:bg-[#E00B41] transition">
          <Search size={14} strokeWidth={2.5} />
        </div>
      </button>

      {/* Expanded Airbnb Search & Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-bold text-gray-900">Filters & Search</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSearchSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Destination Search */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Where to?</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search destinations (e.g., Goa, Mumbai, Villa)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Price range</h4>
                <p className="text-xs text-gray-500 mb-3">Nightly prices before taxes and fees</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="₹0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum (₹)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="₹50,000+"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                    />
                  </div>
                </div>
              </div>

              {/* Guests Count Selector */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Guests</h4>
                  <p className="text-xs text-gray-500">Ages 13 or above</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMaxGuests(Math.max(0, (parseInt(maxGuests) || 0) - 1).toString())}
                    disabled={!maxGuests || parseInt(maxGuests) <= 0}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="w-6 text-center font-bold text-sm text-gray-900">
                    {maxGuests || "0"}
                  </span>

                  <button
                    type="button"
                    onClick={() => setMaxGuests(((parseInt(maxGuests) || 0) + 1).toString())}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-black transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

            </form>

            {/* Modal Footer */}
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
                className="flex items-center gap-2 px-6 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-md"
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
