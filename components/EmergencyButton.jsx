import React, { use } from "react";
import { FaExclamationTriangle , FaArrowLeft} from "react-icons/fa";

import { jsPDF } from "jspdf";
import { dummyUser } from "./UserProfile";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";

const EmergencyButton = () => {
  const navigate = useNavigate();
  // ✅ Static test user details
  const user = {
   name: dummyUser.name,
    email: "veedhaanxd07@gmail.com",
    role: "Tourist",
    location: "Solapur, Maharashtra",
    joined: "2025-08-28",
    id : dummyUser.digitalID
    
  };

  const generateAndSendPDF = (locationText) => {
    if (!user) {
      console.error("❌ User data is not available.");
      alert("User details are missing. Please log in again.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("🚨 Emergency FIR Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${user.name || "N/A"}`, 20, 40);
    doc.text(`Email: ${user.id || "N/A"}`, 20, 50);
    doc.text(`Role: ${user.role || "N/A"}`, 20, 60);
    doc.text(`Location (Profile): ${user.location || "N/A"}`, 20, 70);
    doc.text(`Joined: ${user.joined || "N/A"}`, 20, 80);

    // Emergency details
    doc.text("----- Emergency Details -----", 20, 100);
    doc.text(locationText, 20, 110);
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, 20, 130);

    const pdfBlob = doc.output("blob");

    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = function () {
      const base64PDF = reader.result.split(",")[1];

      const emailMessage = `
🚨 Emergency Report
Name: ${user.name || "N/A"}
Email: ${user.email || "N/A"}
Role: ${user.role || "N/A"}
Profile Location: ${user.location || "N/A"}
Joined: ${user.joined || "N/A"}

📍 Location:
${locationText}

⏰ Time: ${new Date().toLocaleString()}

Please check the attached PDF for full details.
      `;

      emailjs
        .send(
          "service_bj1k0df",
          "template_sel0mlk",
          {
            to_email: "veedhaanxd07@gmail.com",
            subject: "🚨 Emergency FIR Report",
            message: emailMessage,
            attachment: base64PDF,
          },
          "5JC9JxEC1LV1aiFKG"
        )
        .then(
          () => {
            alert("🚨 Emergency report sent to authorities!");
          },
          (err) => {
            console.error(err);
            alert("❌ Failed to send report.");
          }
        );
    };
  };

  const handleEmergency = () => {
    const confirmSend = window.confirm(
      "⚠️ Do you want to send your emergency details to the authorities?"
    );
    if (!confirmSend) return;

    if (!navigator.geolocation) {
      generateAndSendPDF("⚠️ Geolocation not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationText = `Current Latitude: ${latitude}\nCurrent Longitude: ${longitude}`;
        generateAndSendPDF(locationText);
      },
      (error) => {
        console.error("❌ Geolocation error:", error.message);
        generateAndSendPDF("⚠️ Location not available (GPS disabled or denied).");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black relative text-center px-4">
  {/* Back Button */}
  <header className="absolute top-5 left-5">
    <button
      onClick={() => navigate("/dashboard")}
      className="flex items-center text-gray-300 hover:text-white transition"
    >
      <FaArrowLeft size={22} className="mr-2" />
      <span className="text-sm">Back</span>
    </button>
  </header>

  {/* Title */}
  <h1 className="text-3xl font-bold text-white mb-8 tracking-wide">
    🚨 Emergency Action
  </h1>

  {/* Emergency Button */}
  <button
    onClick={handleEmergency}
    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white px-10 py-5 rounded-full flex items-center gap-3 shadow-2xl text-2xl font-bold tracking-wide animate-pulse"
  >
    <FaExclamationTriangle className="text-3xl" />
    Emergency
  </button>


</div>

  );
};

export default EmergencyButton;
