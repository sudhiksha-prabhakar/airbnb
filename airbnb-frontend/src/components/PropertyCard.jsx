import React from "react";
import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
  // Ensure we have an image URL, even if the array is empty
  const mainImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : "https://via.placeholder.com/400x300?text=No+Image+Available";

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-md transition-transform duration-200 hover:scale-102 cursor-pointer border border-gray-200">
      <img 
        src={mainImage} 
        alt={property.title} 
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <h3 className="text-lg font-semibold m-0 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
          {property.title}
        </h3>
        <p className="text-gray-500 text-sm m-0 mb-2">
          {property.location}
        </p>
        <p className="text-base m-0 mb-4">
          <b>₹{property.price}</b> / night
        </p>
        
        <Link 
          to={`/property/${property._id}`} 
          className="block text-center bg-red-500 text-white no-underline p-2 rounded font-bold text-sm hover:bg-red-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
