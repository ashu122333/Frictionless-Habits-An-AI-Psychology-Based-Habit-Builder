
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loginUser } from "../../api/axiosClient";

import AuthImagePattern from "../AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await loginUser(formData); // CLEAN API CALL

      const token = res.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      localStorage.setItem("username", decoded.sub);

      setMessage(`✅ Login successful! ${decoded.sub}`);

      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "❌ Invalid username or password!";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/50">
                {/* <MessageSquare className="w-8 h-8 text-white" /> */}
              </div>
              <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-slate-600">Sign in to your account</p>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-xl ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {/* <Mail className="h-5 w-5 text-cyan-400" /> */}
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all bg-white"
                  placeholder="you@example.com"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {/* <Lock className="h-5 w-5 text-cyan-400" /> */}
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all bg-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-400 hover:text-cyan-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {/* {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )} */}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 focus:ring-4 focus:ring-cyan-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  {/* <Loader2 className="h-5 w-5 animate-spin" /> */}
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <a href="/register" className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline transition-colors">
                Create account
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title="Welcome back!"
        subtitle="Sign in to continue your conversations and catch up with your messages."
      />
    </div>
  );
};

export default Login;