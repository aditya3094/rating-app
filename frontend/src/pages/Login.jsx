import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });

      // Save token & role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user?.role || "user");

      // Redirect based on role
      if (res.data.user?.role === "admin") {
        navigate("/admin-dashboard");
      } else if (res.data.user?.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/stores");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials, try again!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome Back 👋
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
          >
            Sign In
          </button>
        </form>

        {/* Signup link */}
        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-600 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
