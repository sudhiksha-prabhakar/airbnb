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
    <div className="flex justify-center p-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 border border-gray-300 rounded-2xl bg-white">
        <h2 className="text-2xl font-bold mb-6">List Your Property</h2>
        
        {message && (
          <p className={`p-3 rounded mb-4 ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message}
          </p>
        )}
        
        <input
          type="text"
          placeholder="Property Title (e.g., Luxury Bali Villa)"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-3 m-2.5 rounded border border-gray-300"
          required
        />
        
        <input
          type="text"
          placeholder="Location (City, Country)"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full p-3 m-2.5 rounded border border-gray-300"
          required
        />
        
        <input
          type="number"
          placeholder="Price per night (₹)"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full p-3 m-2.5 rounded border border-gray-300"
          required
        />
        
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-3 m-2.5 rounded border border-gray-300 h-24"
          required
        />
        
        <input
          type="text"
          placeholder="Image URLs (comma separated)"
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
          className="w-full p-3 m-2.5 rounded border border-gray-300"
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-red-500 text-white border-none rounded font-bold text-base cursor-pointer hover:bg-red-600 disabled:opacity-50 mt-4"
        >
          {loading ? "Listing..." : "List Property"}
        </button>
      </form>
    </div>
  );
};

export default HostDashboard;