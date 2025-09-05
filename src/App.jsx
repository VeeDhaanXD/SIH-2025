import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import LoginPage from "../components/LoginPage";
import UserProfile from "../components/UserProfile";
import WeatherPage from "../components/WeatherPage";
import SignupPage from "../components/SignupPage.jsx";
import EmergencyButton from "../components/EmergencyButton.jsx";
import AuthorityDashboard from "../components/AuthorityDashboard.jsx";

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
    </Routes>
  );
};

export default App;   // ✅ this must export App
