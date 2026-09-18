import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { propertyAPI } from "../api";
import PropertyCard from "../components/PropertyCard";
import Footer from "../components/Footer";
import { ChevronLeft, ChevronRight, Tag, ArrowRight } from "lucide-react";

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const maxGuests = searchParams.get("maxGuests") || "";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await propertyAPI.getAllProperties({
          search,
          minPrice,
          maxPrice,
          maxGuests,
          page: 1,
        });

        setProperties(res.data.properties || []);
        setError("");
      } catch (err) {
        setError("Failed to load properties");
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [search, minPrice, maxPrice, maxGuests]);

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Group properties into realistic location sections
  const northGoaHomes = properties.slice(0, 6);
  const puducherryHomes = properties.length > 6 ? properties.slice(6, 12) : properties.slice(0, 6);
  const topVillas = properties.length > 12 ? properties.slice(12) : properties;

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        
        {loading ? (
          <div className="space-y-8">
            <div className="h-8 w-64 bg-gray-200 rounded animate-shimmer" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-64 h-64 bg-gray-200 rounded-2xl animate-shimmer shrink-0" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100 my-8">
            <h3 className="text-lg font-bold text-red-600 mb-2">{error}</h3>
          </div>
        ) : (
          <>
            {/* Section 1: Popular homes in North Goa */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => navigate("/?search=Goa")}
                  className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-gray-900 group border-none bg-transparent cursor-pointer p-0"
                >
                  <span>Popular homes in North Goa</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition text-gray-700" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollContainer(section1Ref, "left")}
                    className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                  >
                    <ChevronLeft size={16} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => scrollContainer(section1Ref, "right")}
                    className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                  >
                    <ChevronRight size={16} className="text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Container */}
              <div
                ref={section1Ref}
                className="flex items-center gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
              >
                {northGoaHomes.map((property, idx) => (
                  <PropertyCard key={property._id} property={property} isGuestFavorite={idx % 2 === 0} />
                ))}
              </div>
            </section>

            {/* Section 2: Available in Puducherry this weekend */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => navigate("/?search=Puducherry")}
                  className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold text-gray-900 group border-none bg-transparent cursor-pointer p-0"
                >
                  <span>Available in Puducherry this weekend</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition text-gray-700" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollContainer(section2Ref, "left")}
                    className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                  >
                    <ChevronLeft size={16} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => scrollContainer(section2Ref, "right")}
                    className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                  >
                    <ChevronRight size={16} className="text-gray-700" />
                  </button>
                </div>
              </div>

              <div
                ref={section2Ref}
                className="flex items-center gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
              >
                {puducherryHomes.map((property, idx) => (
                  <PropertyCard key={property._id} property={property} isGuestFavorite={idx % 3 === 0} />
                ))}
              </div>
            </section>

            {/* Section 3: Top Rated Stays & Villas */}
            {topVillas.length > 0 && (
              <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                    Top rated stays & luxury villas
                  </h2>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => scrollContainer(section3Ref, "left")}
                      className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                    >
                      <ChevronLeft size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => scrollContainer(section3Ref, "right")}
                      className="p-2 rounded-full border border-gray-300 hover:border-black bg-white shadow-xs transition cursor-pointer"
                    >
                      <ChevronRight size={16} className="text-gray-700" />
                    </button>
                  </div>
                </div>

                <div
                  ref={section3Ref}
                  className="flex items-center gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
                >
                  {topVillas.map((property, idx) => (
                    <PropertyCard key={property._id} property={property} isGuestFavorite={true} />
                  ))}
                </div>
              </section>
            )}
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