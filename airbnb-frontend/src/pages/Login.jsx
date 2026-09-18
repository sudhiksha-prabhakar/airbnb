import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await authAPI.login({ email, password });
      login(res.data, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between bg-white">
      <div className="flex-1 flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200 text-center">
            <h3 className="text-base font-bold text-gray-900">Log in or sign up</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Welcome to Airbnb</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-airbnb-gradient text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? "Logging in..." : "Continue"}
            </button>

            <div className="pt-2 text-center text-xs text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-gray-900 underline hover:text-[#FF385C]">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;