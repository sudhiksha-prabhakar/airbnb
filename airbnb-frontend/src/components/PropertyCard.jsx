import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Normalize images array
  const rawImages = property.images && property.images.length > 0 
    ? property.images 
    : [property.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"];

  const images = rawImages.map(img => typeof img === 'string' ? img.replace(/"/g, '') : img);

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Mock deterministic rating based on title length for realistic presentation
  const mockRating = (4.7 + ((property.title?.length || 5) % 3) * 0.1).toFixed(2);

  return (
    <Link 
      to={`/property/${property._id}`} 
      className="group block no-underline text-inherit cursor-pointer focus:outline-none"
    >
      <div className="flex flex-col gap-2.5">
        
        {/* Image Container */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-200 shadow-xs">
          <img
            src={images[currentImageIndex] || images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Favorite Heart Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:scale-110 transition bg-transparent border-none cursor-pointer z-10"
            aria-label="Add to wishlist"
          >
            <Heart
              size={22}
              className={`transition ${
                isFavorite
                  ? "fill-[#FF385C] text-[#FF385C]"
                  : "fill-black/30 text-white stroke-[2]"
              }`}
            />
          </button>

          {/* Image Navigation Arrows (Hover visible if multiple images) */}
          {images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md text-gray-800 hover:scale-110 transition opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronLeft size={16} />
                </button>
              )}

              {currentImageIndex < images.length - 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md text-gray-800 hover:scale-110 transition opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronRight size={16} />
                </button>
              )}

              {/* Carousel Dot Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {images.slice(0, 5).map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? "w-3 bg-white"
                        : "w-1.5 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

        </div>

        {/* Property Metadata Info */}
        <div className="flex flex-col gap-0.5 px-0.5">
          
          {/* Row 1: Location & Star Rating */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 truncate m-0">
              {property.location || "Beautiful Stay"}
            </h3>

            <div className="flex items-center gap-1 shrink-0 text-xs font-semibold text-gray-900">
              <Star size={12} className="fill-black text-black" />
              <span>{mockRating}</span>
            </div>
          </div>

          {/* Row 2: Property Title / Category details */}
          <p className="text-xs text-gray-500 truncate m-0 font-normal">
            {property.title}
          </p>

          {/* Row 3: Capacity / Dates metadata */}
          <p className="text-xs text-gray-500 m-0 font-normal">
            {property.maxGuests ? `Up to ${property.maxGuests} guests` : "Self check-in"}
          </p>

          {/* Row 4: Pricing */}
          <div className="mt-1 flex items-baseline gap-1 text-sm text-gray-900">
            <span className="font-bold">₹{property.price ? property.price.toLocaleString("en-IN") : "3,500"}</span>
            <span className="text-xs text-gray-600 font-normal">night</span>
          </div>

        </div>

      </div>
    </Link>
  );
};

export default PropertyCard;
