// components/UserProfile.jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const UserProfile = () => {
  const [user] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    role: "Traveler",
    location: "Mumbai, India",
    joined: "Aug 2025",
    avatar: "https://i.pravatar.cc/150?img=3", // sample avatar
  });

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center">
        <img
          src={user.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-green-500"
        />
        <h2 className="mt-3 text-xl font-semibold text-gray-800">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <span className="mt-1 px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">
          {user.role}
        </span>
      </div>

      {/* Profile Info */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="text-gray-800">{user.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Joined:</span>
          <span className="text-gray-800">{user.joined}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
          Edit Profile
        </button>
        <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
