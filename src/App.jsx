import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import LoginPage from "../components/LoginPage";
import UserProfile from "../components/UserProfile";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/userProfile" element={<UserProfile />} />
    </Routes>
  );
};

export default App;   // ✅ this must export App
