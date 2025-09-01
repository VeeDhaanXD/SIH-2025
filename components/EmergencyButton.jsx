import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { jsPDF } from "jspdf";
import emailjs from "emailjs-com";

const EmergencyButton = ({ user }) => {
  const generateAndSendPDF = (locationText) => {
    // ✅ Generate PDF
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("🚨 Emergency FIR Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${user.name}`, 20, 40);
    doc.text(`Email: ${user.email}`, 20, 50);
    doc.text(`Role: ${user.role}`, 20, 60);
    doc.text(`Location (Profile): ${user.location}`, 20, 70);
    doc.text(`Joined: ${user.joined}`, 20, 80);

    // Emergency details
    doc.text("----- Emergency Details -----", 20, 100);
    doc.text(locationText, 20, 110);
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, 20, 130);

    // ✅ Generate PDF as blob
    const pdfBlob = doc.output("blob");

    // Convert blob to base64 for emailJS
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = function () {
      const base64PDF = reader.result.split(",")[1];

      // ✅ Construct email message
      const emailMessage = `
🚨 Emergency Report
Name: ${user.name}
Email: ${user.email}
Role: ${user.role}
Profile Location: ${user.location}
Joined: ${user.joined}

📍 Location:
${locationText}

⏰ Time: ${new Date().toLocaleString()}

Please check the attached PDF for full details.
      `;

      // ✅ Send Email using EmailJS
      emailjs
        .send(
          "service_bj1k0df", // Your EmailJS Service ID
          "template_sel0mlk", // Your EmailJS Template ID
          {
            to_email: "veedhaanxd07@gmail.com", // Authority email
            subject: "🚨 Emergency FIR Report",
            message: emailMessage,
            attachment: base64PDF,
          },
          "5JC9JxEC1LV1aiFKG" // Your EmailJS public key
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
        console.error(error);
        // ✅ Fallback when location fails
        generateAndSendPDF("⚠️ Location not available (GPS disabled or denied).");
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  };

  return (
    <button
      onClick={handleEmergency}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg text-lg font-semibold"
    >
      <FaExclamationTriangle /> Emergency
    </button>
  );
};

export default EmergencyButton;
