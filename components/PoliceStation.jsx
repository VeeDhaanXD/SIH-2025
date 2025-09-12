import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const PoliceStation = () => {
  const navigate = useNavigate();

  // Dummy police station data
  const stations = [
    {
      name: "Central Police Station",
      address: "123 Main Street",
      distance: "1.2 km",
      phone: "+91100",
      mapsUrl: "https://maps.google.com?q=Central+Police+Station",
    },
    {
      name: "East Side Police Station",
      address: "45 East Avenue",
      distance: "2.8 km",
      phone: "+91100",
      mapsUrl: "https://maps.google.com?q=East+Side+Police+Station",
    },
    {
      name: "West Town Police Station",
      address: "78 West Road",
      distance: "3.5 km",
      phone: "+91100",
      mapsUrl: "https://maps.google.com?q=West+Town+Police+Station",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="mr-3 text-teal-600 hover:text-teal-700"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-xl text-gray-800">
          Nearby Police Stations
        </h1>
      </header>

      {/* Search & Filter */}
      <div className="p-4 flex gap-2">
        <input
          type="text"
          placeholder="Search location..."
          className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 shadow">
          Filter
        </button>
      </div>

       <div className="rounded-lg bg-gradient-to-r from-gray-800 via-gray-700 to-teal-600 text-white p-6 shadow-md">
          <h2 className="text-xl font-bold mb-2">Travel Comfort Made Easy 🏨</h2>
          <p className="text-white/90">
           Search for Nearby Police stations 
          </p>
        </div>

      {/* Police Stations List */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {stations.map((station, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold text-lg text-gray-800">
                {station.name}
              </h2>
              <p className="text-sm text-gray-600">{station.address}</p>
              <p className="text-xs text-gray-500">{station.distance} away</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${station.phone}`}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-1"
              >
                <FaPhoneAlt /> Call
              </a>
              <a
                href={station.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1"
              >
                <FaMapMarkerAlt /> Directions
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Emergency Button */}
      <button className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg">
        🚨
      </button>
    </div>
  );
};

export default PoliceStation;
