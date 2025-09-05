import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSignOutAlt,
  FaHeartbeat,
  FaShieldAlt,
  FaAddressCard,
} from "react-icons/fa";
import Header from "../components/Header";

export const dummyUser = {
  name: "Raj Pandey",
  email: "veedhaanxd07@gmail.com",
  role: "Tourist",
  location: "Solapur, Maharashtra",
  joined: "2025-08-28",
  digitalID: "TSM-2025-874392",

};

const ProfilePage = () => {
  const [user] = useState({
    name: dummyUser.name,          // ✅ FIXED
    email: dummyUser.email,        // reuse dummyUser
    phone: "+91 8888888899",
    location: "Mumbai, India",
    trips: 0,
    favorites: 5,
    emergencyContact: {
      name: "Aman Pandey",
      relation: "Brother",
      phone: "+91 7979797979",
    },
    medicalInfo: "Allergic to Penicillin",
    insuranceProvider: "TravelSecure Pvt Ltd",
    ID: dummyUser.digitalID,
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-green-100 via-white to-blue-100">
      <Header />

      {/* Profile Card */}
      <div className="w-[480px] bg-white shadow-2xl rounded-2xl mt-20 p-8 relative">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-green-200 flex items-center justify-center text-4xl font-bold text-green-700 shadow-md">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-3">{user.name}</h2>
          <p className="text-gray-500">Traveler</p>
        </div>

        {/* Info Section */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <FaEnvelope className="text-green-500" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaPhone className="text-green-500" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaMapMarkerAlt className="text-green-500" />
            <span>{user.location}</span>
          </div>
        </div>

        {/* Travel Stats */}
        <div className="flex justify-between mt-6 bg-green-50 p-4 rounded-xl">
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">{user.trips}</p>
            <p className="text-gray-500 text-sm">Trips</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">{user.favorites}</p>
            <p className="text-gray-500 text-sm">Favorites</p>
          </div>
        </div>

        {/* Safety & Travel Info */}
        <div className="mt-6 space-y-4 bg-blue-50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Safety & Travel Info
          </h3>
          <div className="flex items-center gap-3 text-gray-700">
            <FaUser className="text-blue-500" />
            <span>
              Emergency Contact: {user.emergencyContact.name} (
              {user.emergencyContact.relation}) - {user.emergencyContact.phone}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaHeartbeat className="text-red-500" />
            <span>Medical Info: {user.medicalInfo}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaShieldAlt className="text-green-600" />
            <span>Insurance: {user.insuranceProvider}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaAddressCard className="text-purple-500" />
            <span>Digital ID: {user.ID}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 shadow-md">
            <FaEdit /> Edit Profile
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 shadow-md"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
