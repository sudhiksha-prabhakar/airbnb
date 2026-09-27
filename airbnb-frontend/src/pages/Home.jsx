import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { propertyAPI } from "../api";
import PropertyCard from "../components/PropertyCard";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import { 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  Compass, 
  RotateCcw 
} from "lucide-react";

const POPULAR_DESTINATIONS = [
  { id: "all", label: "All Destinations", search: "" },
  { id: "bali", label: "🌴 Bali, Indonesia", search: "Bali" },
  { id: "austin", label: "⛵ Austin & Lake Travis", search: "Austin" },
  { id: "canggu", label: "🏄 Canggu, Bali", search: "Canggu" },
  { id: "lagovista", label: "🌊 Lago Vista, TX", search: "Lago Vista" },
  { id: "marblefalls", label: "⛰️ Marble Falls, TX", search: "Marble Falls" },
  { id: "villas", label: "✨ Luxury Villas", search: "Villa" },
];

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search & filter state from URL
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const maxGuests = searchParams.get("maxGuests") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Data states
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Destination rails states for homepage
  const [baliProperties, setBaliProperties] = useState([]);
  const [texasProperties, setTexasProperties] = useState([]);
  const [luxuryProperties, setLuxuryProperties] = useState([]);

  // Carousel scroll refs
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const isSearchActive = Boolean(
    search || 
    (category && category !== "all") || 
    minPrice || 
    maxPrice || 
    maxGuests
  );

  // Fetch featured destination sections once on mount
  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const [baliRes, texasRes, luxeRes] = await Promise.all([
          propertyAPI.getAllProperties({ search: "Bali", limit: 8 }),
          propertyAPI.getAllProperties({ search: "Texas", limit: 8 }),
          propertyAPI.getAllProperties({ search: "Villa", limit: 8 }),
        ]);

        if (isMounted) {
          setBaliProperties(baliRes.data.properties || []);
          setTexasProperties(texasRes.data.properties || []);
          setLuxuryProperties(luxeRes.data.properties || []);
        }
      } catch (err) {
        console.error("Error fetching featured destination collections:", err);
      }
    };

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch paginated main properties matching filters
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Combine category keyword with search for maximum backend compatibility
        const effectiveSearch = category && category !== "all" 
          ? (search ? `${search} ${category}` : category) 
          : search;

        const res = await propertyAPI.getAllProperties({
          search: effectiveSearch,
          category: category !== "all" ? category : undefined,
          minPrice,
          maxPrice,
          maxGuests,
          page,
          limit: 20,
        });

        setProperties(res.data.properties || []);
        setPagination(
          res.data.pagination || {
            currentPage: page,
            totalPages: Math.ceil((res.data.properties?.length || 0) / 20) || 1,
            totalCount: res.data.properties?.length || 0,
          }
        );
        setError("");
      } catch (err) {
        setError("Failed to load properties");
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [search, category, minPrice, maxPrice, maxGuests, page]);

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSelectCategory = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId === "all") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    params.set("page", "1");
    navigate(`/?${params.toString()}`);
  };

  const handleSelectDestination = (destSearch) => {
    const params = new URLSearchParams(searchParams);
    if (!destSearch) {
      params.delete("search");
    } else {
      params.set("search", destSearch);
    }
    params.set("page", "1");
    navigate(`/?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    navigate(`/?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      
      {/* Category Bar Navigation */}
      <CategoryBar
        selectedCategory={category}
        onSelectCategory={handleSelectCategory}
        onOpenFilters={() => {}}
      />

      {/* Destination Quick-Pills Filter Bar */}
      <div className="bg-gray-50 border-b border-gray-200 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 shrink-0 mr-1">
            <Compass size={14} className="text-[#FF385C]" />
            <span>Destinations:</span>
          </span>
          {POPULAR_DESTINATIONS.map((dest) => {
            const isSelected = 
              (dest.id === "all" && !search) || 
              (dest.search && search.toLowerCase().includes(dest.search.toLowerCase()));

            return (
              <button
                key={dest.id}
                onClick={() => handleSelectDestination(dest.search)}
                className={`text-xs px-3 py-1.5 rounded-full transition whitespace-nowrap cursor-pointer font-medium ${
                  isSelected
                    ? "bg-black text-white shadow-xs"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:text-black"
                }`}
              >
                {dest.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        
        {loading && properties.length === 0 ? (
          /* Loading Skeleton */
          <div className="space-y-8">
            <div className="h-8 w-64 bg-gray-200 rounded animate-shimmer" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl animate-shimmer" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-shimmer" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-shimmer" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100 my-8">
            <h3 className="text-lg font-bold text-red-600 mb-2">{error}</h3>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : isSearchActive ? (
          /* Filtered Search / Category Results Grid View */
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                  <MapPin size={22} className="text-[#FF385C]" />
                  <span>
                    {search 
                      ? `Stays in "${search}"` 
                      : category && category !== "all" 
                        ? `${category.charAt(0).toUpperCase() + category.slice(1)} stays`
                        : "Matching stays"}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {pagination.totalCount > 0 
                    ? `${pagination.totalCount} ${pagination.totalCount === 1 ? "stay" : "stays"} available in database`
                    : `${properties.length} stays available`}
                </p>
              </div>

              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-black hover:underline cursor-pointer bg-transparent border-none"
              >
                <RotateCcw size={13} />
                <span>Clear all filters</span>
              </button>
            </div>

            {properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {properties.map((property, idx) => (
                    <PropertyCard 
                      key={property._id} 
                      property={property} 
                      isGuestFavorite={idx % 2 === 0}
                      className="w-full"
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="flex flex-col items-center gap-3 pt-8 pb-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Showing page <span className="font-bold text-gray-900">{pagination.currentPage}</span> of{" "}
                      <span className="font-bold text-gray-900">{pagination.totalPages}</span> ({pagination.totalCount} listings)
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage <= 1}
                        className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        ← Previous
                      </button>

                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                                pageNum === pagination.currentPage
                                  ? "bg-black text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        {pagination.totalPages > 5 && (
                          <span className="px-2 py-1 text-xs text-gray-400 self-center">...</span>
                        )}
                      </div>

                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage >= pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200 max-w-xl mx-auto my-6 px-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">No matching stays found</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Try searching for Bali, Austin, Canggu, or Lago Vista, or clear your filters to view all 1,000+ stays.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition cursor-pointer"
                >
                  Show all stays
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Default Rich Homepage View with Real Destination Rails & Full Grid */
          <>
            {/* Section 1: Popular Villas & Stays in Bali, Indonesia */}
            {baliProperties.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleSelectDestination("Bali")}
                    className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-gray-900 group border-none bg-transparent cursor-pointer p-0 text-left"
                  >
                    <span>Popular villas in Bali, Indonesia</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition text-gray-700" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollContainer(section1Ref, "left")}
                      className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => scrollContainer(section1Ref, "right")}
                      className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={16} className="text-gray-700" />
                    </button>
                  </div>
                </div>

                <div
                  ref={section1Ref}
                  className="flex items-center gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
                >
                  {baliProperties.map((property, idx) => (
                    <PropertyCard 
                      key={property._id} 
                      property={property} 
                      isGuestFavorite={idx % 2 === 0} 
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section 2: Lakeside & Hill Country Stays in Texas */}
            {texasProperties.length > 0 && (
              <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleSelectDestination("Texas")}
                    className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-gray-900 group border-none bg-transparent cursor-pointer p-0 text-left"
                  >
                    <span>Lakefront & hill country stays in Texas</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition text-gray-700" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollContainer(section2Ref, "left")}
                      className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => scrollContainer(section2Ref, "right")}
                      className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={16} className="text-gray-700" />
                    </button>
                  </div>
                </div>

                <div
                  ref={section2Ref}
                  className="flex items-center gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
                >
                  {texasProperties.map((property, idx) => (
                    <PropertyCard 
                      key={property._id} 
                      property={property} 
                      isGuestFavorite={idx % 3 === 0} 
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Top Rated Luxury Stays & Villas */}
            {luxuryProperties.length > 0 && (
              <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleSelectDestination("Villa")}
                    className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-gray-900 group border-none bg-transparent cursor-pointer p-0 text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles size={20} className="text-[#FF385C]" />
                      <span>Top-rated luxury villas & private retreats</span>
                    </span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition text-gray-700" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollContainer(section3Ref, "left")}
                      className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => scrollContainer(section3Ref, "right")}
                      className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                      aria-label="Scroll right"
                    >
                      <ChevronRight size={16} className="text-gray-700" />
                    </button>
                  </div>
                </div>

                <div
                  ref={section3Ref}
                  className="flex items-center gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
                >
                  {luxuryProperties.map((property) => (
                    <PropertyCard 
                      key={property._id} 
                      property={property} 
                      isGuestFavorite={true} 
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section 4: Explore All Stays Worldwide (Full 1,000+ Grid with Pagination) */}
            <section className="space-y-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                    Explore all stays & properties
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {pagination.totalCount > 0 
                      ? `Over ${pagination.totalCount.toLocaleString()} verified stays available` 
                      : "Verified stays available"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {properties.map((property, idx) => (
                  <PropertyCard 
                    key={property._id} 
                    property={property} 
                    isGuestFavorite={idx % 2 === 0}
                    className="w-full"
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col items-center gap-3 pt-8 pb-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Showing page <span className="font-bold text-gray-900">{pagination.currentPage}</span> of{" "}
                    <span className="font-bold text-gray-900">{pagination.totalPages}</span> ({pagination.totalCount} listings)
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage <= 1}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      ← Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                              pageNum === pagination.currentPage
                                ? "bg-black text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {pagination.totalPages > 5 && (
                        <span className="px-2 py-1 text-xs text-gray-400 self-center">...</span>
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage >= pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

      </main>

      {/* Floating Center Badge: Prices Include All Fees */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-full shadow-2xl text-xs font-bold hover:scale-105 transition cursor-pointer">
          <Tag size={16} className="text-[#FF385C] fill-[#FF385C]" />
          <span>Prices include all fees</span>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;