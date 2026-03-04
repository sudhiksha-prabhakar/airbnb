import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BecomeHost = () => {
  const [hostDescription, setHostDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { becomeHost, isHost } = useAuth();

  if (isHost) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">✓ You are already a host!</h2>
        <p className="text-gray-600 mb-6">You can list properties from your Host Dashboard.</p>
        <button
          onClick={() => navigate('/host')}
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
        >
          Go to Host Dashboard
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await becomeHost(hostDescription);
      setSuccess(true);
      setTimeout(() => {
        navigate('/host');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to become a host');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 my-8">
      <div className="bg-white rounded-lg shadow-lg p-10">
        <h1 className="text-4xl font-bold mb-2">Become a Host</h1>
        <p className="text-gray-600 mb-8">Start earning by listing your properties on Airbnb</p>

        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
            ✓ Congratulations! You are now a host. Redirecting to dashboard...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-3">About You (Optional)</label>
            <textarea
              placeholder="Tell guests about yourself, your properties, and what makes you a great host..."
              value={hostDescription}
              onChange={(e) => setHostDescription(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows="6"
            />
            <p className="text-sm text-gray-500 mt-2">This helps guests get to know you better</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">What you can do as a host:</h3>
            <ul className="text-blue-900 space-y-2">
              <li>✓ List multiple properties</li>
              <li>✓ Set your own prices</li>
              <li>✓ Manage bookings and guests</li>
              <li>✓ Earn money from bookings</li>
              <li>✓ Build reviews and credibility</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-500 text-white rounded-lg font-bold text-lg hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Become a Host'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          You can update your profile information anytime from your account settings.
        </p>
      </div>
    </div>
  );
};

export default BecomeHost;
