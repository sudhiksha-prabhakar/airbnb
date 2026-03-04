import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { propertyAPI, bookingAPI } from "../api";
import { useAuth } from "../context/AuthContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await propertyAPI.getPropertyById(id);
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!fromDate || !toDate) {
      setBookingError("Please select both check-in and check-out dates");
      return;
    }

    if (!guests || guests < 1) {
      setBookingError("Please specify number of guests");
      return;
    }

    if (property.maxGuests && guests > property.maxGuests) {
      setBookingError(`Maximum allowed guests is ${property.maxGuests}`);
      return;
    }

    setBookingLoading(true);
    setBookingError("");

    try {
      await bookingAPI.createBooking({
        property: id,
        fromDate,
        toDate,
        guests,
      });
      setBookingSuccess(true);
      setFromDate("");
      setToDate("");
      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    } catch (err) {
      setBookingError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <h2 className="text-center py-12">Loading details...</h2>;
  }

  if (!property) {
    return <h2 className="text-center py-12">Property not found</h2>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
      <p className="text-gray-600 text-xl mb-4">{property.location}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Image and Description */}
        <div className="lg:col-span-2">
          <img 
            src={property.images?.[0] || "https://via.placeholder.com/800x500"} 
            alt={property.title} 
            className="w-full rounded-lg h-96 object-cover"
          />
          
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">About this place</h3>
            <p className="leading-relaxed text-gray-700">{property.description}</p>
          </div>
        </div>

        {/* Booking Card */}
        <div className="h-fit">
          <div className="border border-gray-300 rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">₹{property.price} <span className="text-sm font-normal text-gray-600">/ night</span></h3>
            
            {bookingSuccess && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                ✓ Booking successful! Redirecting...
              </div>
            )}

            {bookingError && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Check-in</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Check-out</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Guests</label>
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                />
                {property.maxGuests && (
                  <p className="text-xs text-gray-500 mt-1">
                    Max {property.maxGuests} guests
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 disabled:opacity-50"
              >
                {bookingLoading ? "Booking..." : "Reserve Now"}
              </button>
            </form>

            {!isAuthenticated && (
              <p className="text-center text-sm text-gray-600 mt-4">
                <button
                  onClick={() => navigate("/login")}
                  className="text-red-500 font-semibold hover:underline"
                >
                  Login
                </button>
                {" "}to make a booking
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;