import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../api';
import { useAuth } from '../context/AuthContext';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingAPI.getUserBookings();
        setBookings(res.data);
      } catch (err) {
        setError('Failed to load bookings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-12"><h2 className="text-2xl font-semibold">Loading bookings...</h2></div>;
  }

  if (error) {
    return <div className="text-center py-12"><h2 className="text-2xl font-semibold text-red-500">{error}</h2></div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">No bookings yet</h2>
        <p className="text-gray-500 mt-2">Start booking properties to see them here!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="border border-gray-300 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">{booking.property?.title || 'Property'}</h3>
            <p className="text-gray-600 mb-4">
              Location: {booking.property?.location || 'N/A'}
            </p>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Check-in: {new Date(booking.fromDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Check-out: {new Date(booking.toDate).toLocaleDateString()}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Guests: {booking.guests || '1'}
              </p>
              <p className="text-lg font-bold">₹{booking.totalPrice}</p>
              <p className="text-sm text-gray-500">
                Status:{' '}
                <span
                  className={`font-semibold ${
                    booking.status === 'confirmed'
                      ? 'text-green-600'
                      : booking.status === 'cancelled'
                      ? 'text-red-600'
                      : 'text-blue-600'
                  }`}
                >
                  {booking.status.toUpperCase()}
                </span>
              </p>

              {/* Cancel button for active future bookings */}
              {booking.status === 'confirmed' && new Date(booking.toDate) > new Date() && (
                <button
                  onClick={async () => {
                    try {
                      await bookingAPI.cancelBooking(booking._id);
                      setBookings((prev) =>
                        prev.map((b) =>
                          b._id === booking._id ? { ...b, status: 'cancelled' } : b
                        )
                      );
                    } catch (err) {
                      console.error('Cancel failed', err);
                      alert(err.response?.data?.message || 'Cancel failed');
                    }
                  }}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;
