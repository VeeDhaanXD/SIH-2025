import React, { useState } from "react";
import { FaSearch, FaBars, FaTimes, FaComments, FaEnvelope  } from "react-icons/fa";
import { MdLocationOn, MdHotel, MdLocalHospital, MdWarning, MdWbSunny } from "react-icons/md";
import Header from "./Header";
import Chatbot from "./Chatbot";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* <Header/> */}
      {/* Header */}
      <header className="w-full shadow-md bg-white fixed top-0 left-0 z-40">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-600 rounded-md"></div>
            <h1 className="text-xl font-bold text-teal-700">Travel Safety</h1>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">

            <a href="#" className="hover:text-teal-600">Dashboard</a>
            <a href="#" className="hover:text-teal-600">Services</a>
            <a href="#" className="hover:text-teal-600">Booked Plan</a>

            {/* Other dropdown */}
            <div className="relative">
              <button
                onClick={() => setOtherOpen(!otherOpen)}
                className="hover:text-teal-600 focus:outline-none"
              >
                Other
              </button>
              {otherOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2">
                  <a href="#" className="block px-3 py-2 hover:bg-gray-100">About Us</a>
                  <a href="#" className="block px-3 py-2 hover:bg-gray-100">Contact Us</a>
                  <a href="#" className="block px-3 py-2 hover:bg-gray-100">FAQ</a>
                  <a href="#" className="block px-3 py-2 hover:bg-gray-100">Help</a>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Btn */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl text-gray-700">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md mt-16">
          <nav className="flex flex-col items-center space-y-4 py-6 text-gray-700 font-medium">
            <a href="#" className="hover:text-teal-600">Dashboard</a>
            <a href="#" className="hover:text-teal-600">Services</a>
            <a href="#" className="hover:text-teal-600">Booked Plan</a>
            <a href="#" className="hover:text-teal-600">Other</a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 mt-24">
        {/* Search */}
        <div className="flex items-center bg-white shadow-md rounded-lg p-4 mb-6">
          <FaSearch className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Search places, services..."
            className="flex-1 outline-none"
          />
          <button className="ml-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
            Filter
          </button>
        </div>

        {/* Important Aspects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg flex items-center space-x-4">
            <MdLocationOn className="text-3xl text-teal-600" />
            <div>
              <h3 className="font-bold text-lg">Nearby Police</h3>
              <p className="text-gray-600">Check nearest police stations</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg flex items-center space-x-4">
            <MdHotel className="text-3xl text-teal-600" />
            <div>
              <h3 className="font-bold text-lg">Nearby Hotels</h3>
              <p className="text-gray-600">Safe & verified stays</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg flex items-center space-x-4">
            <MdLocalHospital className="text-3xl text-teal-600" />
            <div>
              <h3 className="font-bold text-lg">Hospitals</h3>
              <p className="text-gray-600">Emergency medical support</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg flex items-center space-x-4">
            <MdWarning className="text-3xl text-red-500" />
            <div>
              <h3 className="font-bold text-lg">Restricted Areas</h3>
              <p className="text-gray-600">Avoid unsafe zones</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg flex items-center space-x-4">
            <MdWbSunny className="text-3xl text-yellow-500" />
            <div>
              <h3 className="font-bold text-lg">Weather</h3>
              <p className="text-gray-600">Current conditions</p>
            </div>
          </div>
        </div>

        {/* Services & Booked Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
            <h3 className="font-bold text-lg mb-4">Booked Plan</h3>
            <p className="text-gray-600">You haven’t booked any plans yet.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg">
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <p className="text-gray-600">Explore travel & safety services.</p>
          </div>
        </div>
      </main>

      {/* Floating Chatbot Button */}
      <button className="fixed bottom-6 right-6 bg-teal-600 text-black p-4 rounded-full shadow-lg hover:bg-teal-700">
      
        <Chatbot />
      </button>

      
    </div>
  );
};

export default Dashboard;
