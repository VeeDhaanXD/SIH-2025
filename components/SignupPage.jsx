import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaPassport, FaIdCard } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import IMG1 from "../src/img1.jpg"; 
import Header from "./Header";
import axios from "axios";


const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    nationality: "",
    passport: "",
    govId: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/signup", formData);
      alert(res.data.message);
      if (res.data.message === "User registered successfully") {
        navigate("/");
      }
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <Header />

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl flex w-[1000px] overflow-hidden">
        {/* Left Side - Image */}
        <div
          className="w-1/2 flex flex-col justify-end text-white p-10"
          style={{
            backgroundImage: `url(${IMG1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-3xl font-bold leading-tight mb-3">
            Travel Smart. <br /> Verified for Safety.
          </h1>
          <p className="text-gray-200 text-sm">
            Secure signup with KYC verification ensures your protection.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="w-1/2 p-10 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account with KYC Verification !</h2>
          <p className="text-gray-500 mb-5">Fill in your details to get started.</p>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaPhone className="text-gray-400 mr-2" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Address */}
            <div className="flex items-center border rounded-md px-3 py-2">
              <MdLocationOn className="text-gray-400 mr-2" />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Nationality */}
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaPassport className="text-gray-400 mr-2" />
              <input
                type="text"
                name="nationality"
                placeholder="Nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Passport Number */}
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaPassport className="text-gray-400 mr-2" />
              <input
                type="text"
                name="passport"
                placeholder="Passport Number"
                value={formData.passport}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Govt ID */}
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaIdCard className="text-gray-400 mr-2" />
              <input
                type="text"
                name="govId"
                placeholder="Government ID (e.g. Aadhaar)"
                value={formData.govId}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Emergency Contact Name */}
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="emergencyContactName"
                placeholder="Emergency Contact Name"
                value={formData.emergencyContactName}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Emergency Contact Phone */}
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaPhone className="text-gray-400 mr-2" />
              <input
                type="tel"
                name="emergencyContactPhone"
                placeholder="Emergency Contact Phone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md flex items-center justify-center gap-2 shadow-md mt-6"
          >
            Sign Up
          </button>

          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <a href="/" className="text-green-600 font-medium hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
