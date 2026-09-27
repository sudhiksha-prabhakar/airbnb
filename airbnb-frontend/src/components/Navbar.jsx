import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";
import { Globe, Menu, ShieldCheck, LogOut, Home, Calendar, PlusCircle } from "lucide-react";
import AirbnbLogo from "./AirbnbLogo";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
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

  const handleLogoClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    if (window.location.pathname === "/" && !window.location.search && !window.location.hash) {
      window.location.reload();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 pt-4 ${isHomePage ? "pb-6" : "pb-4"} shadow-xs`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isHomePage ? "space-y-4" : ""}`}>
        
        {/* Top Header Row: Logo | Mode Navigation Tabs | Right Controls */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Airbnb Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center no-underline shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
            aria-label="Airbnb home"
          >
            <AirbnbLogo className="text-[#FF385C]" style={{ height: "36px", width: "auto" }} />
          </a>

          {/* Center: Top Mode Tabs (All, Homes) */}
          {isHomePage && (
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
          )}

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
        {isHomePage && (
          <div className="flex justify-center pt-2">
            <div className="w-full max-w-3xl">
              <SearchBar />
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;