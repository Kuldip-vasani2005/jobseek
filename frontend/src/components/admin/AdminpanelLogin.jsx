import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "@/redux/authSlice";

const AdminpanelLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/adminpanel/checkauth",
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setUser(res.data.user));
          navigate("/adminpanel");
        }
      } catch (err) {
        // Not logged in
      }
    };
    checkAuth();
  }, [navigate, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/adminpanel/adminpanellogin",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/adminpanel");
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <form
        onSubmit={handleLogin}
        className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Admin Login
        </h2>

        {error && (
          <div className="text-red-600 text-center mb-4 font-medium">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
          className="w-full p-3 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
          className="w-full p-3 mb-6 border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-300"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-xl font-bold text-white text-lg transition-all duration-300 shadow-md ${
            loading
              ? "bg-pink-300 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 hover:scale-105 hover:shadow-xl"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminpanelLogin;
