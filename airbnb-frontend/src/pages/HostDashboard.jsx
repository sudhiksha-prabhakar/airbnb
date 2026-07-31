import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { propertyAPI } from "../api";
import { useAuth } from "../context/AuthContext";

const HostDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    images: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setMessage("You must be logged in to host a property.");
      return;
    }

    setLoading(true);

    try {
      const propertyData = {
        title: formData.title,
        location: formData.location,
        price: Number(formData.price),
        description: formData.description,
        images: formData.images.split(",").map((url) => url.trim()),
      };

      await propertyAPI.createProperty(propertyData);

      setMessage("Property listed successfully! 🎉");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4 py-8 sm:py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 sm:p-8 border border-gray-200 shadow-xl rounded-2xl bg-white space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">List Your Property</h2>
        
        {message && (
          <p className={`p-3 rounded-lg text-sm text-center font-medium ${message.includes("success") || message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </p>
        )}
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Property Title</label>
          <input
            type="text"
            placeholder="Property Title (e.g., Luxury Villa)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
          <input
            type="text"
            placeholder="Location (City, Country)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Price per night (₹)</label>
          <input
            type="number"
            placeholder="Price per night (₹)"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            placeholder="Description of your property..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm h-28 resize-none"
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Image URLs (comma separated)</label>
          <input
            type="text"
            placeholder="Image URLs (comma separated)"
            value={formData.images}
            onChange={(e) => setFormData({ ...formData, images: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3.5 bg-red-500 text-white rounded-xl font-bold text-base cursor-pointer hover:bg-red-600 disabled:opacity-50 transition shadow-sm mt-4"
        >
          {loading ? "Listing..." : "List Property"}
        </button>
      </form>
    </div>
  );
};

export default HostDashboard;