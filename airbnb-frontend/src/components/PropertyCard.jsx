import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

const PropertyCard = ({ property, isGuestFavorite = true }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const mockRating = (4.8 + ((property.title?.length || 5) % 3) * 0.08).toFixed(2);
  const nightlyPrice = property.price || 3500;
  const twoNightPrice = (nightlyPrice * 2).toLocaleString("en-IN");

  return (
    <Link 
      to={`/property/${property._id}`} 
      className="group block no-underline text-inherit cursor-pointer shrink-0 w-64 sm:w-72"
    >
      <div className="flex flex-col gap-2">
        
        {/* Image Container with rounded-2xl */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-200 shadow-xs">
          <img
            src={images[currentImageIndex] || images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Guest Favourite Badge (Top-left) */}
          {isGuestFavorite && (
            <div className="absolute top-3 left-3 bg-white/95 text-black text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
              Guest favourite
            </div>
          )}

          {/* Wishlist Heart Button (Top-right) */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-1 rounded-full bg-transparent border-none cursor-pointer z-10"
            aria-label="Add to wishlist"
          >
            <Heart
              size={20}
              className={`transition ${
                isFavorite
                  ? "fill-[#FF385C] text-[#FF385C]"
                  : "fill-black/40 text-white stroke-[2]"
              }`}
            />
          </button>

          {/* Image Navigation Controls */}
          {images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md text-gray-800 hover:scale-110 transition opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronLeft size={14} />
                </button>
              )}

              {currentImageIndex < images.length - 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md text-gray-800 hover:scale-110 transition opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronRight size={14} />
                </button>
              )}
            </>
          )}

        </div>

        {/* Info Rows */}
        <div className="flex flex-col gap-0.5 px-0.5">
          <h3 className="text-sm font-bold text-gray-900 truncate m-0">
            {property.title}
          </h3>

          <p className="text-xs text-gray-600 m-0 font-normal">
            <span className="font-semibold text-gray-900">₹{twoNightPrice}</span> for 2 nights · <span className="font-semibold">★ {mockRating}</span>
          </p>
        </div>

      </div>
    </Link>
  );
};

export default PropertyCard;
