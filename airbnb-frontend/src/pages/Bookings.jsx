import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { Calendar, MapPin, Users } from "lucide-react";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await bookingAPI.getUserBookings();
        setBookings(res.data || []);
      } catch (err) {
        setError("Failed to load your reservations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await bookingAPI.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      console.error("Cancel failed", err);
      alert(err.response?.data?.message || "Cancellation failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        <div className="border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trips & Reservations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your upcoming and past Airbnb property stays</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-gray-100 rounded-3xl animate-shimmer" />
            <div className="h-48 bg-gray-100 rounded-3xl animate-shimmer" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-3xl text-center my-6 border border-red-200">
            <p className="font-semibold text-sm">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200 my-4 max-w-2xl mx-auto">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No trips booked... yet!</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Time to dust off your bags and start planning your next great stay.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-black text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition no-underline"
            >
              Start searching
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {bookings.map((booking) => {
              const prop = booking.property || {};
              const images = Array.isArray(prop.images) && prop.images.length > 0 
                ? prop.images 
                : [prop.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80"];
              const mainImg = typeof images[0] === 'string' ? images[0].replace(/"/g, '') : images[0];

              return (
                <div
                  key={booking._id}
                  className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col sm:flex-row bg-white"
                >
                  {/* Property Image */}
                  <div className="w-full sm:w-2/5 aspect-video sm:aspect-auto bg-gray-200">
                    <img
                      src={mainImg}
                      alt={prop.title || "Property"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details Container */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.status}
                        </span>

                        <span className="text-xs font-bold text-gray-900">
                          ₹{booking.totalPrice ? booking.totalPrice.toLocaleString("en-IN") : "0"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 truncate">
                        {prop.title || "Reserved Property"}
                      </h3>

                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                        <MapPin size={12} />
                        <span>{prop.location || "Location unavailable"}</span>
                      </p>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span>Check-in:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(booking.fromDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Check-out:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(booking.toDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                        <span className="flex items-center gap-1">
                          <Users size={12} /> Guests:
                        </span>
                        <span className="font-semibold text-gray-900">{booking.guests || 1}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <Link
                        to={`/property/${prop._id}`}
                        className="text-xs font-bold text-[#FF385C] underline hover:text-[#E00B41] no-underline"
                      >
                        View listing
                      </Link>

                      {booking.status === "confirmed" && new Date(booking.toDate) > new Date() && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          Cancel trip
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Bookings;
