import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { UserContext } from "../App";
import { storeIsSession } from "../utils/session";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; // Added missing import

function Login() {
  let { userAuth, setUserAuth } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();

  // Load "Remember me" preference from localStorage on mount
  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    setFormData((prev) => ({ ...prev, rememberMe: savedRememberMe }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store "Remember me" preference in localStorage
    localStorage.setItem("rememberMe", formData.rememberMe);
    axios
      .post(import.meta.env.VITE_BASE_URL + "/api/auth/login", {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })
      .then(({ data }) => {
        storeIsSession("user", JSON.stringify(data));
        setUserAuth(data);
        toast.success("Login successful!");
        navigate("/dashboard");
      })
      .catch((response) => {
        console.error(response);
        toast.error(response.response.data.message);
        navigate("/dashboard");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="text-center">
          <div className="flex justify-center">
            <LogIn className="h-14 w-14 text-indigo-600 animate-pulse" />
          </div>
          <h2 className="mt-6 text-4xl font-bold text-gray-800 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            New here?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Create an account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-14 py-4 border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-14 py-4 border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105"
            >
              Sign in
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;