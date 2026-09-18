import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { propertyAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { CheckCircle2, Image as ImageIcon } from "lucide-react";

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
      setMessage("You must be logged in to list a property.");
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
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-10">
          
          <div className="border-b border-gray-200 pb-6 mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Create a new listing</h1>
            <p className="text-sm text-gray-500 mt-1">Publish your property on Airbnb</p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-2xl text-xs font-semibold mb-6 flex items-center gap-2 ${
                message.includes("success") || message.includes("successfully")
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.includes("success") && <CheckCircle2 size={16} className="text-emerald-600" />}
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Listing Title</label>
              <input
                type="text"
                placeholder="e.g. Luxury Beachfront Villa with Private Pool"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Goa, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nightly Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 4500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Describe what makes your property unique, nearby attractions, amenities..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C] h-32 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Image URLs (Comma separated)
              </label>
              <div className="relative">
                <ImageIcon size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-airbnb-gradient text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? "Publishing listing..." : "Publish Listing"}
            </button>
          </form>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default HostDashboard;