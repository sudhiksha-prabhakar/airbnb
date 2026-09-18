import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { propertyAPI, bookingAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { 
  Star, 
  Share2, 
  Heart, 
  ShieldCheck, 
  Wifi, 
  Tv, 
  Car, 
  Utensils, 
  Wind, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Clock, 
  MapPin 
} from "lucide-react";

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
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await propertyAPI.getPropertyById(id);
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching property details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Calculate nights and prices
  const calculateNights = () => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights();
  const nightlyPrice = property?.price || 3500;
  const basePrice = nightlyPrice * (nights || 1);
  const cleaningFee = 1200;
  const serviceFee = Math.round(basePrice * 0.12);
  const totalPrice = basePrice + cleaningFee + serviceFee;

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!fromDate || !toDate) {
      setBookingError("Please select check-in and check-out dates");
      return;
    }

    if (nights <= 0) {
      setBookingError("Check-out date must be after check-in date");
      return;
    }

    if (!guests || guests < 1) {
      setBookingError("Please specify at least 1 guest");
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
      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    } catch (err) {
      setBookingError(err.response?.data?.message || "Booking request failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-8 w-2/3 bg-gray-200 rounded animate-shimmer mb-4" />
        <div className="h-4 w-1/3 bg-gray-200 rounded animate-shimmer mb-6" />
        <div className="h-[420px] w-full bg-gray-200 rounded-3xl animate-shimmer mb-8" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
        <p className="text-gray-500 mb-6">The property you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Normalize image gallery
  const rawImages = property.images && property.images.length > 0 
    ? property.images 
    : [
        property.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"
      ];
  
  const images = rawImages.map(img => typeof img === 'string' ? img.replace(/"/g, '') : img);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Title Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {property.title}
        </h1>

        {/* Action Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 text-sm text-gray-700 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-gray-900">
              <Star size={14} className="fill-black text-black" />
              <span>4.92</span>
            </span>
            <span>·</span>
            <span className="underline font-semibold text-gray-900 cursor-pointer">128 reviews</span>
            <span>·</span>
            <span className="flex items-center gap-1 font-medium text-gray-800">
              <Award size={14} className="text-[#FF385C]" />
              <span>Superhost</span>
            </span>
            <span>·</span>
            <span className="underline cursor-pointer text-gray-700 flex items-center gap-1">
              <MapPin size={14} />
              <span>{property.location}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button className="flex items-center gap-1.5 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition bg-transparent border-none cursor-pointer">
              <Share2 size={16} />
              <span className="underline">Share</span>
            </button>

            <button 
              onClick={() => setIsSaved(!isSaved)}
              className="flex items-center gap-1.5 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition bg-transparent border-none cursor-pointer"
            >
              <Heart size={16} className={isSaved ? "fill-[#FF385C] text-[#FF385C]" : ""} />
              <span className="underline">{isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Airbnb Multi-Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 my-6 rounded-3xl overflow-hidden aspect-video md:aspect-[2/1] bg-gray-100">
          {/* Main Large Image */}
          <div className="md:col-span-2 h-full relative group">
            <img
              src={images[0]}
              alt={property.title}
              className="w-full h-full object-cover hover:opacity-95 transition cursor-pointer"
            />
          </div>

          {/* Grid Side Images */}
          <div className="hidden md:grid col-span-2 grid-cols-2 gap-2 h-full">
            {images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative h-full overflow-hidden">
                <img
                  src={img || images[0]}
                  alt={`${property.title} preview ${idx}`}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content & Sticky Reservation Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 my-8">
          
          {/* Left Column (Details, Host Info, Amenities, AirCover) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Host Banner */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Entire home hosted by Superhost
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {property.maxGuests || 4} guests · 2 bedrooms · 2 beds · 2 bathrooms
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF385C] to-red-400 text-white font-bold flex items-center justify-center text-lg shadow-md shrink-0">
                S
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-5 pb-6 border-b border-gray-200">
              <div className="flex gap-4">
                <Sparkles size={22} className="text-gray-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Experienced Superhost</h4>
                  <p className="text-xs text-gray-500">Superhosts are highly rated, experienced hosts who are committed to providing great stays.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock size={22} className="text-gray-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Self check-in</h4>
                  <p className="text-xs text-gray-500">Check yourself in with the keypad or lockbox.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Calendar size={22} className="text-gray-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Free cancellation before check-in</h4>
                  <p className="text-xs text-gray-500">Get a full refund if you change your plans before your check-in date.</p>
                </div>
              </div>
            </div>

            {/* AirCover Guarantee */}
            <div className="pb-6 border-b border-gray-200 space-y-2">
              <div className="flex items-center gap-1 text-[#FF385C] font-extrabold text-xl tracking-tight">
                <span>air</span>
                <span className="text-black">cover</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like trouble checking in.
              </p>
            </div>

            {/* About Description */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About this space</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description || "Enjoy a luxurious stay at this beautiful property equipped with state-of-the-art amenities, gorgeous views, fast Wi-Fi, and top-tier hospitality."}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What this place offers</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
                <div className="flex items-center gap-3"><Wifi size={20} className="text-gray-600" /> Fast Wi-Fi</div>
                <div className="flex items-center gap-3"><Car size={20} className="text-gray-600" /> Free parking on premises</div>
                <div className="flex items-center gap-3"><Utensils size={20} className="text-gray-600" /> Kitchen & dining</div>
                <div className="flex items-center gap-3"><Wind size={20} className="text-gray-600" /> Air conditioning</div>
                <div className="flex items-center gap-3"><Tv size={20} className="text-gray-600" /> 55" HDTV with Netflix</div>
                <div className="flex items-center gap-3"><ShieldCheck size={20} className="text-gray-600" /> Security cameras</div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Reservation Box */}
          <div>
            <div className="sticky top-28 bg-white rounded-3xl border border-gray-200 p-6 shadow-xl space-y-4">
              
              {/* Header Price */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{nightlyPrice.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-gray-500 font-normal"> / night</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold">
                  <Star size={12} className="fill-black text-black" />
                  <span>4.92</span>
                  <span className="text-gray-400">· 128 reviews</span>
                </div>
              </div>

              {/* Status Alert */}
              {bookingSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Reservation confirmed! Redirecting to your bookings...</span>
                </div>
              )}

              {bookingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs">
                  {bookingError}
                </div>
              )}

              {/* Form Controls */}
              <form onSubmit={handleBooking} className="space-y-4">
                
                {/* Date Grid */}
                <div className="border border-gray-300 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-black">
                  <div className="grid grid-cols-2 divide-x divide-gray-300 border-b border-gray-300">
                    <div className="p-2.5">
                      <label className="block text-[10px] font-extrabold tracking-wider uppercase text-gray-700">CHECK-IN</label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full text-xs font-medium text-gray-900 focus:outline-none bg-transparent cursor-pointer"
                        required
                      />
                    </div>

                    <div className="p-2.5">
                      <label className="block text-[10px] font-extrabold tracking-wider uppercase text-gray-700">CHECKOUT</label>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full text-xs font-medium text-gray-900 focus:outline-none bg-transparent cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-2.5">
                    <label className="block text-[10px] font-extrabold tracking-wider uppercase text-gray-700">GUESTS</label>
                    <input
                      type="number"
                      min="1"
                      max={property.maxGuests || 10}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full text-xs font-medium text-gray-900 focus:outline-none bg-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Reserve Action Button */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 bg-airbnb-gradient text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition cursor-pointer"
                >
                  {bookingLoading ? "Processing..." : "Reserve"}
                </button>
              </form>

              <p className="text-center text-xs text-gray-500 font-normal">
                You won't be charged yet
              </p>

              {/* Price Calculation Breakdown */}
              <div className="pt-4 border-t border-gray-200 space-y-2.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span className="underline">₹{nightlyPrice.toLocaleString("en-IN")} x {nights || 1} nights</span>
                  <span>₹{basePrice.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>₹{cleaningFee.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                  <span className="underline">Airbnb service fee</span>
                  <span>₹{serviceFee.toLocaleString("en-IN")}</span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
                  <span>Total before taxes</span>
                  <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;