import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

const BecomeHost = () => {
  const [hostDescription, setHostDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { becomeHost, isHost } = useAuth();

  if (isHost) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-white">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You are an Airbnb Host!</h2>
          <p className="text-sm text-gray-500 mb-6">List new properties or manage your reservations from your dashboard.</p>
          <button
            onClick={() => navigate("/host")}
            className="px-6 py-3 bg-[#FF385C] text-white rounded-xl font-bold text-xs hover:bg-[#E00B41] transition cursor-pointer"
          >
            Go to Host Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await becomeHost(hostDescription);
      setSuccess(true);
      setTimeout(() => {
        navigate("/host");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to become a host");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-10 space-y-8">
          
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-[#FF385C] rounded-full text-xs font-bold mb-3">
              <Sparkles size={14} /> Airbnb Setup
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Airbnb it with confidence
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Join millions of hosts sharing unique homes around the world.
            </p>
          </div>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>Congratulations! You are now an Airbnb Host. Redirecting...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">About Your Hosting Profile</label>
              <textarea
                placeholder="Share a little bit about yourself, your hospitality experience, or your property..."
                value={hostDescription}
                onChange={(e) => setHostDescription(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C] resize-none"
                rows="4"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl space-y-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#FF385C]" />
                Airbnb Host Protection Included
              </h3>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-2">✓ Top-to-bottom protection for every stay</li>
                <li className="flex items-center gap-2">✓ Damage protection & liability insurance</li>
                <li className="flex items-center gap-2">✓ Fast payout directly into your account</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-airbnb-gradient text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? "Setting up host profile..." : "Become an Airbnb Host"}
            </button>
          </form>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default BecomeHost;
