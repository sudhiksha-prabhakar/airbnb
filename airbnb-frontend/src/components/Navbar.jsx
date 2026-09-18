import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Globe, Menu, User, ShieldCheck, LogOut, Home, Calendar, PlusCircle } from "lucide-react";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, isHost, user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo - Airbnb Belo */}
        <Link 
          to="/" 
          className="flex items-center gap-1.5 no-underline group shrink-0"
        >
          {/* Official Airbnb Belo SVG logo */}
          <svg className="h-8 w-8 text-[#FF385C]" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.008-3.297 7.806-7.5 7.806-3.13 0-5.719-1.996-6.852-4.707l-.148-.372c-.22-.577-.521-1.423-.86-2.42l-.14-.415c-.218.636-.453 1.258-.674 1.835l-.18.461c-1.127 2.766-3.722 4.818-6.896 4.818-4.203 0-7.5-3.798-7.5-7.806 0-.96.22-1.874.887-3.463l.17-.384c.96-2.235 5.12-10.947 7.074-14.777l.559-1.084C12.537 1.963 13.992 1 16 1zm0 2c-1.24 0-2.227.618-3.25 2.45l-.465.903C10.375 10.11 6.275 18.7 5.347 20.87l-.133.303c-.538 1.282-.714 1.967-.747 2.628l-.007.205c0 2.923 2.373 5.806 5.54 5.806 2.378 0 4.385-1.523 5.253-3.665l.135-.357c.414-1.125.867-2.473 1.34-3.957l.272-.852.272.852c.473 1.484.926 2.832 1.34 3.957l.135.357c.868 2.142 2.875 3.665 5.253 3.665 3.167 0 5.54-2.883 5.54-5.806 0-.69-.153-1.4-.73-2.775l-.157-.361c-.928-2.17-5.028-10.76-6.956-14.517l-.487-.946C18.227 3.618 17.24 3 16 3zm0 10c2.761 0 5 2.239 5 5 0 2.21-1.436 4.084-3.418 4.734l-.328.098c-1.343.359-2.765.176-3.967-.512l-.287-.174C11.758 21.364 11 19.78 11 18c0-2.761 2.239-5 5-5zm0 2c-1.657 0-3 1.343-3 3 0 1.077.568 2.023 1.442 2.548l.245.134c.732.366 1.58.46 2.378.261l.241-.07C18.398 20.485 19 19.313 19 18c0-1.657-1.343-3-3-3z"/>
          </svg>
          <span className="text-xl font-bold tracking-tight text-[#FF385C] hidden sm:inline">
            airbnb
          </span>
        </Link>

        {/* Center Search Bar Pill Component */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-4">
          <SearchBar onOpenFullSearch={() => setSearchModalOpen(true)} />
        </div>

        {/* Right Menu Links & User Profile Dropdown */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Become a Host Button */}
          {(!isAuthenticated || !isHost) && (
            <Link
              to={isAuthenticated ? "/become-host" : "/login"}
              className="hidden lg:block text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-100 rounded-full px-3.5 py-2.5 transition no-underline"
            >
              Airbnb your home
            </Link>
          )}

          {/* Globe Button */}
          <button 
            className="hidden sm:flex p-2.5 hover:bg-gray-100 rounded-full text-gray-700 transition cursor-pointer bg-transparent border-none"
            aria-label="Language and currency"
          >
            <Globe size={18} />
          </button>

          {/* User Profile Pill */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 border border-gray-300 hover:shadow-md rounded-full px-3 py-1.5 transition cursor-pointer bg-white"
              aria-label="User menu"
            >
              <Menu size={16} className="text-gray-700" />
              
              <div className="w-7 h-7 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                {isAuthenticated && user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <User size={16} className="text-white" />
                )}
              </div>
            </button>

            {/* Dropdown Menu Modal */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 text-sm animate-in fade-in duration-150">
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
                      to="/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:bg-gray-100 no-underline"
                    >
                      Airbnb your home
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
    </header>
  );
};

export default Navbar;