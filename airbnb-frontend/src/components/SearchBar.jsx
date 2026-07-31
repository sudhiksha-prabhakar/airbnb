import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const filterRef = useRef(null);
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [maxGuests, setMaxGuests] = useState(searchParams.get('maxGuests') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [justSearched, setJustSearched] = useState(false);

  // Close filter dropdown on page navigation
  useEffect(() => {
    setShowFilters(false);
  }, [location.pathname]);

  // Click outside to close filter modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // sync inputs with URL when user navigates, but skip right after search
  useEffect(() => {
    if (justSearched) {
      setJustSearched(false);
      return;
    }
    setSearch(searchParams.get('search') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setMaxGuests(searchParams.get('maxGuests') || '');
  }, [searchParams, justSearched]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (maxGuests) params.append('maxGuests', maxGuests);
    params.append('page', '1'); // Reset to page 1 on new search

    navigate(`/?${params.toString()}`);
    setSearch('');
    setJustSearched(true);
    setShowFilters(false);
  };

  const handleReset = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setMaxGuests('');
    navigate('/');
    setShowFilters(false);
  };

  return (
    <div ref={filterRef} className="w-full relative">
      <form onSubmit={handleSearch} className="flex gap-1.5 sm:gap-2 items-center">
        <input
          type="text"
          placeholder="Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-0 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-inner"
        />
        
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="px-3 sm:px-4 py-2 bg-white text-red-500 rounded-full font-semibold text-xs sm:text-sm hover:bg-gray-100 transition whitespace-nowrap shadow-sm"
        >
          🎛️ <span className="hidden sm:inline">Filter</span>
        </button>

        <button
          type="submit"
          className="px-4 sm:px-6 py-2 bg-red-600 sm:bg-white text-white sm:text-red-500 rounded-full font-semibold text-xs sm:text-sm hover:opacity-90 transition whitespace-nowrap shadow-sm"
        >
          Search
        </button>
      </form>

      {/* Filter Dropdown Modal */}
      {showFilters && (
        <div className="absolute top-12 sm:top-14 left-0 right-0 bg-white shadow-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 z-50 rounded-2xl border border-gray-200">
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1 text-gray-700">Min Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1 text-gray-700">Max Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1 text-gray-700">Min Guests</label>
            <input
              type="number"
              min="0"
              placeholder="Guests"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex gap-2 items-end">
            <button
              type="button"
              onClick={handleSearch}
              className="flex-1 p-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 p-2 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
