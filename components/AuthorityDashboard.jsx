// components/AuthorityDashboard.jsx
import React, { useState } from "react";
import { FaUsers, FaExclamationTriangle, FaFilePdf, FaMapMarkerAlt } from "react-icons/fa";
import DashboardWelcome from "./DashboardWelcome"; // Reuse welcome card (can customize for authority)
import AuthWC from "./AuthWC.JSX";
import Header from "./Header";



// Dummy Data
const emergencyReports = [
  {
    id: 1,
    name: "Jawed Chaurasiya",
    blockchain_id :"TSM-2025-874392",
    location: "Mumbai, India",
    latitude: "19.0760",
    longitude: "72.8777",
    time: "2025-09-01 14:23",
  },
  {
    id: 2,
    name: "Ranjan Tiwari",
    blockchain_id :"TSM-2025-772901",
    location: "Delhi, India",
    latitude: "28.7041",
    longitude: "77.1025",
    time: "2025-09-01 13:15",
  },
];

const AuthorityDashboard = () => {
  const [stats] = useState({
    tourists: 120,
    emergencies: 5,
    reports: 32,
  });

  return (
    <div className="p-6 space-y-6">

        <Header/>
      {/* Welcome Banner */}
      <div className="mb-4">

      <AuthWC/>
        
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaUsers className="text-green-500 text-3xl" />
          <div>
            <h3 className="text-xl font-bold">{stats.tourists}</h3>
            <p className="text-gray-500">Active Tourists</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaExclamationTriangle className="text-red-500 text-3xl" />
          <div>
            <h3 className="text-xl font-bold">{stats.emergencies}</h3>
            <p className="text-gray-500">Active Emergencies</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <FaFilePdf className="text-blue-500 text-3xl" />
          <div>
            <h3 className="text-xl font-bold">{stats.reports}</h3>
            <p className="text-gray-500">Reports Generated</p>
          </div>
        </div>
      </div>

      {/* Emergency Reports Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaExclamationTriangle className="text-red-500" /> Recent Emergency Alerts
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="p-3">Name</th>
              <th className="p-3">Digital-ID</th>
              <th className="p-3">Location</th>
              <th className="p-3">Coordinates</th>
              <th className="p-3">Time</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {emergencyReports.map((report) => (
              <tr key={report.id} className="border-b">
                <td className="p-3">{report.name}</td>
                <td className="p-3">{report.blockchain_id}</td>
                <td className="p-3">{report.location}</td>
                <td className="p-3">
                  <a
                    href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-green-600 hover:underline"
                  >
                    <FaMapMarkerAlt /> View Map
                  </a>
                </td>
                <td className="p-3">{report.time}</td>
                <td className="p-3">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm">
                    Respond
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
