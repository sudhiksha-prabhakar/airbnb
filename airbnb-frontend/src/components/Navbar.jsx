import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, isHost, user } = useAuth();

  console.log('Navbar render:', { isAuthenticated, isHost, user });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-10 py-4 bg-red-500 text-white sticky top-0 z-50 shadow-md gap-4">
      {/* LEFT - Logo */}
      <div>
        <Link to="/" className="text-white text-2xl font-bold no-underline hover:opacity-80 whitespace-nowrap">
          Airbnb
        </Link>
      </div>

      {/* CENTER - Search Bar */}
      <SearchBar />

      {/* RIGHT - Navigation Links */}
      <div className="flex gap-4 items-center whitespace-nowrap">
        {/* Become Host */}
        {isAuthenticated && !isHost && (
          <Link
            to="/become-host"
            className="px-4 py-2 bg-white text-red-500 rounded-full font-semibold hover:bg-gray-100 no-underline"
          >
            Host
          </Link>
        )}

        {/* Auth Links */}
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="text-white no-underline font-medium hover:opacity-80">
              Login
            </Link>
            <Link to="/register" className="text-white no-underline font-medium hover:opacity-80">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm bg-red-600 px-3 py-1 rounded-full">
              {isHost ? `🏠 ${user?.name}` : `👤 ${user?.name}`}
            </span>
            <Link to="/bookings" className="text-white no-underline font-medium hover:opacity-80">
              Bookings
            </Link>
            {isHost && (
              <Link to="/host" className="text-white no-underline font-medium hover:opacity-80">
                Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-white text-red-500 border-none px-3 py-1 rounded font-semibold cursor-pointer hover:opacity-80"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;