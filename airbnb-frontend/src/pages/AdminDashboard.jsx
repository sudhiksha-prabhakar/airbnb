import React, { useEffect, useState } from "react";
import { adminAPI } from "../api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalProperties: 0, totalBookings: 0 });
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes, bookingsRes, propertiesRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getUsers(),
          adminAPI.getBookings(),
          adminAPI.getProperties({ limit: 50 })
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setBookings(bookingsRes.data);
        setProperties(propertiesRes.data.properties || []);
      } catch (err) {
        console.error("Error loading admin data", err);
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <h2 className="text-center py-16 text-xl font-semibold text-slate-700">Loading Admin Dashboard...</h2>;
  }

  if (error) {
    return <h2 className="text-center py-16 text-xl font-semibold text-red-500">{error}</h2>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>🛡️</span> Admin System Control
          </h1>
          <p className="text-gray-500 text-sm mt-1">Platform overview and user/booking oversight</p>
        </div>
        <span className="bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
          System Admin Logged In
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div 
          onClick={() => setActiveTab("users")}
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition"
        >
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Total Registered Users</p>
          <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{stats.totalUsers}</h2>
        </div>

        <div 
          onClick={() => setActiveTab("properties")}
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm border-l-4 border-l-red-500 cursor-pointer hover:shadow-md transition"
        >
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Total Listed Properties</p>
          <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{stats.totalProperties}</h2>
        </div>

        <div 
          onClick={() => setActiveTab("bookings")}
          className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm border-l-4 border-l-green-500 cursor-pointer hover:shadow-md transition"
        >
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Total Platform Bookings</p>
          <h2 className="text-3xl font-extrabold text-slate-800 mt-2">{stats.totalBookings}</h2>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-2 font-bold text-sm border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "users"
              ? "border-slate-800 text-slate-800"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          👥 User Directory ({stats.totalUsers})
        </button>

        <button
          onClick={() => setActiveTab("properties")}
          className={`pb-3 px-2 font-bold text-sm border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "properties"
              ? "border-slate-800 text-slate-800"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          🏠 Listed Properties ({stats.totalProperties})
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 px-2 font-bold text-sm border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === "bookings"
              ? "border-slate-800 text-slate-800"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          📅 System Bookings ({stats.totalBookings})
        </button>
      </div>

      {/* Users Tab Table */}
      {activeTab === "users" && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-gray-200">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Host Status</th>
                  <th className="p-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-800">{u.name}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        u.role === "admin" 
                          ? "bg-slate-800 text-white" 
                          : u.role === "host" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{u.isHost ? "✅ Host" : "👤 Guest"}</td>
                    <td className="p-4 text-gray-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Properties Tab Table */}
      {activeTab === "properties" && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-gray-200">
                  <th className="p-4">Title</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price / Night</th>
                  <th className="p-4">Host</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {properties.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-800">{p.title}</td>
                    <td className="p-4 text-gray-600">📍 {p.location}</td>
                    <td className="p-4 font-bold text-red-500">₹{p.price}</td>
                    <td className="p-4 text-gray-600">{p.host?.name || "System Admin"} ({p.host?.email || "admin@example.com"})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Tab Table */}
      {activeTab === "bookings" && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-gray-200">
                  <th className="p-4">Property</th>
                  <th className="p-4">Guest</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-800">{b.property?.title || "Property"}</td>
                    <td className="p-4 text-gray-600">{b.user?.name || "Guest"} ({b.user?.email})</td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(b.fromDate).toLocaleDateString()} – {new Date(b.toDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-slate-800">₹{b.totalPrice}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
