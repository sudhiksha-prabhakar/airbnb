import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { propertyAPI } from "../api";
import PropertyCard from "../components/PropertyCard";

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  // Get filters from URL
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const maxGuests = searchParams.get("maxGuests") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await propertyAPI.getAllProperties({
          search,
          minPrice,
          maxPrice,
          maxGuests,
          page,
        });
        console.log("Fetched properties:", res.data);
        setProperties(res.data.properties);
        setPagination(res.data.pagination);
        setError("");
      } catch (err) {
        setError("Failed to load properties");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [search, minPrice, maxPrice, maxGuests, page]);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (maxGuests) params.append("maxGuests", maxGuests);
    params.append("page", newPage);

    navigate(`/?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return <h2 className="text-center py-12 text-2xl font-semibold">Loading properties...</h2>;
  }

  if (error) {
    return <h2 className="text-center py-12 text-2xl font-semibold text-red-500">{error}</h2>;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600">No properties found</h2>
        <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Results Info */}
      <div className="mb-6">
        <p className="text-gray-600 text-lg">
          Found <span className="font-bold text-red-500">{pagination.totalCount}</span> properties
          {pagination.totalPages > 1 && (
            <span> • Page {pagination.currentPage} of {pagination.totalPages}</span>
          )}
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-8">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => {
              const pageNum = i + 1;
              // Show first page, last page, current page, and pages around current
              const isVisible =
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                Math.abs(pageNum - pagination.currentPage) <= 1;

              if (!isVisible && pageNum === 2) {
                return <span key="dots1" className="px-2 py-2">...</span>;
              }
              if (!isVisible && pageNum === pagination.totalPages - 1) {
                return <span key="dots2" className="px-2 py-2">...</span>;
              }
              if (!isVisible) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    pageNum === pagination.currentPage
                      ? "bg-red-500 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;