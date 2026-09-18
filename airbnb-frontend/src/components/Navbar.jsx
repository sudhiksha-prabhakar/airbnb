import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";
import { Globe, Menu, ShieldCheck, LogOut, Home, Calendar, PlusCircle } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, isHost, user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 pt-4 pb-6 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Top Header Row: Logo | Mode Navigation Tabs | Right Controls */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Airbnb Logo */}
          <Link to="/" className="flex items-center gap-1.5 no-underline shrink-0">
            <svg className="h-8 w-8 text-[#FF385C]" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.008-3.297 7.806-7.5 7.806-3.13 0-5.719-1.996-6.852-4.707l-.148-.372c-.22-.577-.521-1.423-.86-2.42l-.14-.415c-.218.636-.453 1.258-.674 1.835l-.18.461c-1.127 2.766-3.722 4.818-6.896 4.818-4.203 0-7.5-3.798-7.5-7.806 0-.96.22-1.874.887-3.463l.17-.384c.96-2.235 5.12-10.947 7.074-14.777l.559-1.084C12.537 1.963 13.992 1 16 1zm0 2c-1.24 0-2.227.618-3.25 2.45l-.465.903C10.375 10.11 6.275 18.7 5.347 20.87l-.133.303c-.538 1.282-.714 1.967-.747 2.628l-.007.205c0 2.923 2.373 5.806 5.54 5.806 2.378 0 4.385-1.523 5.253-3.665l.135-.357c.414-1.125.867-2.473 1.34-3.957l.272-.852.272.852c.473 1.484.926 2.832 1.34 3.957l.135.357c.868 2.142 2.875 3.665 5.253 3.665 3.167 0 5.54-2.883 5.54-5.806 0-.69-.153-1.4-.73-2.775l-.157-.361c-.928-2.17-5.028-10.76-6.956-14.517l-.487-.946C18.227 3.618 17.24 3 16 3zm0 10c2.761 0 5 2.239 5 5 0 2.21-1.436 4.084-3.418 4.734l-.328.098c-1.343.359-2.765.176-3.967-.512l-.287-.174C11.758 21.364 11 19.78 11 18c0-2.761 2.239-5 5-5zm0 2c-1.657 0-3 1.343-3 3 0 1.077.568 2.023 1.442 2.548l.245.134c.732.366 1.58.46 2.378.261l.241-.07C18.398 20.485 19 19.313 19 18c0-1.657-1.343-3-3-3z"/>
            </svg>
            <span className="text-xl font-extrabold tracking-tight text-[#FF385C] hidden sm:inline">
              airbnb
            </span>
          </Link>

          {/* Center: Top Mode Tabs (All, Homes) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
            
            {/* All */}
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 pb-1.5 border-b-2 transition cursor-pointer bg-transparent ${
                activeTab === "all"
                  ? "border-black text-black font-bold"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              <span className="text-xl">🌐</span>
              <span>All</span>
            </button>

            {/* Homes */}
            <button
              onClick={() => setActiveTab("homes")}
              className={`flex items-center gap-2 pb-1.5 border-b-2 transition cursor-pointer bg-transparent ${
                activeTab === "homes"
                  ? "border-black text-black font-bold"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              <span className="text-xl">🏡</span>
              <span>Homes</span>
            </button>

          </div>

          {/* Right Menu Controls */}
          <div className="flex items-center gap-2">
            {(!isAuthenticated || !isHost) && (
              <Link
                to={isAuthenticated ? "/become-host" : "/login"}
                className="hidden sm:block text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-100 rounded-full px-3.5 py-2 transition no-underline"
              >
                Become a host
              </Link>
            )}

            <button 
              className="p-2 hover:bg-gray-100 rounded-full text-gray-700 transition cursor-pointer bg-transparent border-none"
              aria-label="Language and currency"
            >
              <Globe size={18} />
            </button>

            {/* User Pill Button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center border border-gray-300 hover:shadow-md rounded-full w-10 h-10 transition cursor-pointer bg-gray-100 text-gray-700"
                aria-label="User menu"
              >
                <Menu size={18} />
              </button>

              {/* User Dropdown Modal */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 text-sm">
                  {!isAuthenticated ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 font-semibold text-gray-900 hover:bg-gray-100 no-underline"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 no-underline"
                      >
                        Sign up
                      </Link>
                      <div className="my-1 border-t border-gray-200" />
                      <Link
                        to="/become-host"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 no-underline"
                      >
                        Become a host
                      </Link>
                      <Link
                        to="/admin/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-100 no-underline"
                      >
                        <ShieldCheck size={14} className="text-slate-700" />
                        <span>Admin Portal</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 mb-1">
                        <p className="font-semibold text-gray-900 text-xs truncate">{user?.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/bookings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 font-medium text-gray-800 hover:bg-gray-100 no-underline"
                      >
                        <Calendar size={16} className="text-gray-500" />
                        <span>My Bookings</span>
                      </Link>

                      {isHost && (
                        <Link
                          to="/host"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 font-medium text-gray-800 hover:bg-gray-100 no-underline"
                        >
                          <Home size={16} className="text-gray-500" />
                          <span>Host Dashboard</span>
                        </Link>
                      )}

                      {!isHost && user?.role !== "admin" && (
                        <Link
                          to="/become-host"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-gray-800 hover:bg-gray-100 no-underline"
                        >
                          <PlusCircle size={16} className="text-gray-500" />
                          <span>Become a Host</span>
                        </Link>
                      )}

                      {user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-800 font-semibold hover:bg-slate-100 no-underline"
                        >
                          <ShieldCheck size={16} className="text-slate-700" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}

                      <div className="my-1 border-t border-gray-200" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-red-600 hover:bg-gray-100 font-medium bg-transparent border-none cursor-pointer"
                      >
                        <LogOut size={16} />
                        <span>Log out</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Centered Floating Search Bar Box */}
        <div className="flex justify-center pt-2">
          <div className="w-full max-w-3xl">
            <SearchBar />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;