import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [maxGuests, setMaxGuests] = useState(searchParams.get('maxGuests') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [justSearched, setJustSearched] = useState(false);

  // sync inputs with URL when user navigates, but skip right after search
  React.useEffect(() => {
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
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (maxGuests) params.append('maxGuests', maxGuests);
    params.append('page', '1'); // Reset to page 1 on new search

    navigate(`/?${params.toString()}`);
    // clear search input and mark we just navigated via search
    setSearch('');
    setJustSearched(true);
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
    <div className="flex-1 mx-6 relative">
      <form onSubmit={handleSearch} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search location or property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
        />
        
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-white text-red-500 rounded-full font-semibold hover:bg-gray-100"
        >
          🔽 Filter
        </button>

        <button
          type="submit"
          className="px-6 py-2 bg-white text-red-500 rounded-full font-semibold hover:bg-gray-100"
        >
          Search
        </button>
      </form>

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4 z-40 rounded-lg">
          <div>
            <label className="block text-sm font-semibold mb-2">Min Price (₹)</label>
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Max Price (₹)</label>
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Min Guests</label>
            <input
              type="number"
              placeholder="Number of guests"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSearch}
              className="flex-1 p-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 p-2 bg-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-400"
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
