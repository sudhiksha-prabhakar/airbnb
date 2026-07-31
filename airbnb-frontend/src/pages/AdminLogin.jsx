import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
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
      
      if (res.data.role !== "admin") {
        setError("Access denied: This account does not have Admin privileges.");
        setLoading(false);
        return;
      }

      login(res.data, res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] px-4 py-8 bg-slate-50">
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 border border-slate-300 shadow-2xl rounded-2xl w-full max-w-md bg-white">
        <div className="text-center mb-6">
          <span className="text-4xl inline-block mb-2">🛡️</span>
          <h2 className="text-2xl font-extrabold text-slate-800">Admin Portal</h2>
          <p className="text-xs text-slate-500 mt-1">System Management & Oversight</p>
        </div>

        {error && (
          <div className="text-red-600 text-xs sm:text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-200 text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-700 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-700 text-sm"
              required
            />
          </div>

          <div className="bg-slate-100 p-3 rounded-lg text-xs text-slate-600">
            <span className="font-bold">Default Admin:</span> admin@example.com / password123
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 bg-slate-800 text-white rounded-xl cursor-pointer font-bold text-sm hover:bg-slate-900 disabled:opacity-50 transition shadow-md"
          >
            {loading ? "Authenticating Admin..." : "Login to Admin Portal"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
