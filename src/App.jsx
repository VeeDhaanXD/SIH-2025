import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import LoginPage from "../components/LoginPage";
import UserProfile from "../components/UserProfile";
import WeatherPage from "../components/WeatherPage";
import SignupPage from "../components/SignupPage.jsx";
import EmergencyButton from "../components/EmergencyButton.jsx";
import PoliceStation from "../components/PoliceStation.jsx";
import AuthorityDashboard from "../components/AuthorityDashboard.jsx";
import NearbyHotels from "../components/NearbyHotels.jsx";
import TouristProfileModal from "../components/TouristProfileModal.jsx";
import IncidentDetailModal from "../components/IncidentDetailModal.jsx";
import GeoFenceManager from "../components/GeoFenceManager.jsx";
import BlockchainExplorer from "../components/BlockchainExplorer.jsx";
import MonitoringDashboard from "../components/MonitoringDashboard.jsx";
import SystemSettings from "../components/SystemSettings.jsx";
import TouristDB from "../components/TouristDB.jsx";
import IncidentManager from "../components/IncidentManager.jsx";
import TouristAppView from "../components/TouristAppView.jsx";
import GetStarted from "../components/GetStarted.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/userProfile" element={<UserProfile />} />
      <Route path="/weather" element={<WeatherPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/emergency" element={<EmergencyButton />} />
      <Route path="/authority" element={<AuthorityDashboard />} />
      <Route path="/police" element={<PoliceStation />} />
      <Route path="/hotels" element={<NearbyHotels />} />
      <Route path="/touristmanagement" element={<TouristProfileModal />} />
      <Route path="/incident" element={<IncidentDetailModal />} />
      <Route path="/geo" element={<GeoFenceManager />} />
      <Route path="/blockchain" element={<BlockchainExplorer />} />
      <Route path="/monitoring" element={<MonitoringDashboard/>} />
      <Route path="/setting" element={<SystemSettings/>} />
      <Route path="/touristdb" element={<TouristDB/>} />
      <Route path="/idt" element={<IncidentManager/>} />
      <Route path="/App" element={<TouristAppView/>} />
      <Route path="/st" element={<GetStarted/>} />
    </Routes>
  );
};

export default App;   // ✅ this must export App
