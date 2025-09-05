import React, { useState } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import IMG1 from "../src/img2.jpg";
import Header from "../components/Header";

const LoginPage = () => {
  const [role, setRole] = useState("tourist");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Dummy Users DB
  const users = {
    tourist: { userid: "tourist123", password: "pass123" },
    authority: { userid: "admin001", password: "admin123" },
  };
const handleLogin = () => {
  setError(""); // reset error
  const validUser = users[role];

  if (userId === validUser.userid && password === validUser.password) {
    // ✅ correct login → navigate based on role
    if (role === "tourist") {
      navigate("/dashboard");
    } else if (role === "authority") {
      navigate("/authority");
    }
  } else {
    setError("Invalid User ID or Password ❌");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <Header />
  

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl flex w-[900px] overflow-hidden">
        {/* Left Side */}
        <div
          className="w-1/2 flex flex-col justify-end text-white p-10"
          style={{
            backgroundImage: `url(${IMG1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-3xl font-bold leading-tight mb-3">
            Discover the Unseen. <br /> Travel with Confidence.
          </h1>
          <p className="text-gray-200 text-sm">
            Your safety, powered by smart technology.
          </p>
        </div>

        {/* Right Side (Form) */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-5">Sign in to travel safely.</p>

          {/* Role Tabs */}
          <div className="flex bg-green-50 rounded-md p-1 mb-6">
            <button
              onClick={() => setRole("tourist")}
              className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 ${
                role === "tourist"
                  ? "bg-green-500 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              <FaUser /> Tourist
            </button>
            <button
              onClick={() => setRole("authority")}
              className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 ${
                role === "authority"
                  ? "bg-green-500 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              <MdSecurity /> Authority
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}

          {/* Remember Me + Forgot */}
          <div className="flex justify-between items-center text-sm mt-3 mb-5">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="text-green-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md flex items-center justify-center gap-2 shadow-md mb-4"
          >
            <FaSignInAlt /> Log In
          </button>

          {/* Sign Up */}
          <p className="text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <button onClick={() =>navigate("/signup")} className="text-green-600 font-medium hover:underline">

              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
