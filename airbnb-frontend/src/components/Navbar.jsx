import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, isHost, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-red-500 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Top bar on mobile: Logo + Mobile Toggle */}
        <div className="w-full md:w-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="text-white text-2xl font-bold no-underline hover:opacity-90 tracking-wide flex items-center gap-2"
          >
            <span className="text-3xl">🏠</span>
            <span>airbnb</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-red-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Center: Search Bar */}
        <div className="w-full md:flex-1 md:max-w-2xl">
          <SearchBar />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-3 items-center whitespace-nowrap">
          {isAuthenticated && !isHost && (
            <Link
              to="/become-host"
              className="px-4 py-2 bg-white text-red-500 rounded-full font-semibold hover:bg-gray-100 no-underline text-sm transition"
            >
              Become a Host
            </Link>
          )}

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-white no-underline font-medium hover:opacity-80 text-sm">
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-white text-red-500 rounded-full font-semibold hover:bg-gray-100 no-underline text-sm transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs bg-red-600 px-3 py-1.5 rounded-full font-medium">
                {isHost ? `🏠 ${user?.name}` : `👤 ${user?.name}`}
              </span>
              <Link to="/bookings" className="text-white no-underline font-medium hover:opacity-80 text-sm">
                Bookings
              </Link>
              {isHost && (
                <Link to="/host" className="text-white no-underline font-medium hover:opacity-80 text-sm">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-white text-red-500 border-none px-3 py-1.5 rounded-full font-semibold text-sm cursor-pointer hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="w-full md:hidden pt-3 pb-2 border-t border-red-400 flex flex-col gap-2">
            {isAuthenticated && (
              <div className="px-2 py-1 text-sm bg-red-600 rounded font-medium text-center">
                {isHost ? `🏠 ${user?.name}` : `👤 ${user?.name}`}
              </div>
            )}
            
            {isAuthenticated && !isHost && (
              <Link
                to="/become-host"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-white text-red-500 rounded font-semibold no-underline text-sm"
              >
                Become a Host
              </Link>
            )}

            {!isAuthenticated ? (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-red-600 text-white rounded font-medium text-sm no-underline"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-white text-red-500 rounded font-semibold text-sm no-underline"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-white no-underline font-medium text-sm hover:bg-red-600 px-3 rounded"
                >
                  My Bookings
                </Link>
                {isHost && (
                  <Link
                    to="/host"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 text-white no-underline font-medium text-sm hover:bg-red-600 px-3 rounded"
                  >
                    Host Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-white font-medium text-sm hover:bg-red-600 px-3 rounded bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;