import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { propertyAPI } from "../api";
import PropertyCard from "../components/PropertyCard";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import { RefreshCw } from "lucide-react";

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showTaxes, setShowTaxes] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const maxGuests = searchParams.get("maxGuests") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Combine category filter with search query if category is selected
        const activeSearch = selectedCategory !== "all" 
          ? (search ? `${search} ${selectedCategory}` : selectedCategory)
          : search;

        const res = await propertyAPI.getAllProperties({
          search: activeSearch,
          minPrice,
          maxPrice,
          maxGuests,
          page,
        });

        setProperties(res.data.properties || []);
        setPagination(res.data.pagination || { currentPage: 1, totalPages: 1, totalCount: 0 });
        setError("");
      } catch (err) {
        setError("Failed to load properties from server");
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [search, minPrice, maxPrice, maxGuests, page, selectedCategory]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    navigate(`/?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* Airbnb Category Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* Taxes Display Toggle Banner */}
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Display total price</h4>
            <p className="text-xs text-gray-500">Includes all fees, before taxes</p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showTaxes}
              onChange={(e) => setShowTaxes(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#222222]"></div>
          </label>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <div className="w-full aspect-square rounded-2xl animate-shimmer" />
                <div className="h-4 w-3/4 rounded animate-shimmer" />
                <div className="h-3 w-1/2 rounded animate-shimmer" />
                <div className="h-4 w-1/3 rounded animate-shimmer" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100 my-8">
            <h3 className="text-lg font-bold text-red-600 mb-2">{error}</h3>
            <p className="text-sm text-gray-600 mb-4">Please check your connection or database configuration</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-xl text-xs hover:bg-red-600 transition cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200 my-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No properties found</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Try changing your search destination, clearing price filters, or picking a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                navigate("/");
              }}
              className="px-6 py-2.5 bg-black text-white font-semibold text-xs rounded-xl hover:bg-gray-800 transition cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Properties Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-12">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {/* Airbnb Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col items-center gap-3 my-12 border-t border-gray-200 pt-8">
                <p className="text-xs text-gray-500">
                  Showing page <span className="font-bold text-gray-900">{pagination.currentPage}</span> of{" "}
                  <span className="font-bold text-gray-900">{pagination.totalPages}</span> ({pagination.totalCount} listings)
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    ← Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
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
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer Component */}
      <Footer />

    </div>
  );
};

export default Home;