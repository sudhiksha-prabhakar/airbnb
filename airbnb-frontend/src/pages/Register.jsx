import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.register(formData);
      login(res.data, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-12">
      <form onSubmit={handleSubmit} className="p-8 border border-gray-300 rounded-lg w-80">
        <h2 className="text-2xl font-semibold mb-4">Create Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2.5 m-2.5 rounded border border-gray-300"
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2.5 m-2.5 rounded border border-gray-300"
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2.5 m-2.5 rounded border border-gray-300"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2.5 bg-red-500 text-white border-none rounded cursor-pointer font-semibold hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;