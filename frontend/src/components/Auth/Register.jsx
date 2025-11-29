import React, { useState } from "react";
import { registerUser } from "../../api/axiosClient";

const AuthImagePattern = ({ title, subtitle }) => (
  <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-12">
    <div className="max-w-md text-center">
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl bg-white/10 backdrop-blur-sm animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
      <p className="text-white/80 text-lg">{subtitle}</p>
    </div>
  </div>
);

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      setMessage("✅ Registration successfull! You can now log in.");

      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err) {
      setMessage("❌ Registration failed. Try again.");
    }
    finally{
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
              <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transp<arent">
                Create Account
              </h1>
              <p className="text-slate-600">Get started with your free account</p>
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
                  {/* <User className="h-5 w-5 text-cyan-400" />> */}
                </div>
                <input
                  type="text"
                  name="username"
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all bg-white"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {/* <Mail className="h-5 w-5 text-cyan-400" /> */}
                </div>
                <input
                  type="email"
                  name="email"
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all bg-white"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
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
                  name="password"
                  className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all bg-white"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {/* <Lock className="h-5 w-5 text-cyan-400" /> */}
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all bg-white"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-400 hover:text-cyan-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {/* {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )} */}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 focus:ring-4 focus:ring-cyan-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  {/* <Loader2 className="h-5 w-5 animate-spin" /> */}
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-slate-600">
              Already have an account?{" "}
              <a href="login" className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default Register;