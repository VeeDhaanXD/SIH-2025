import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../src/logo.png"
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [otherOpen, setOtherOpen] = useState(false);

  return (
    <header className="w-full h-[80px] shadow-md bg-white fixed top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 justify-center">
          {/* Replace this with your logo img later */}
          <div className="w-16 h-16 rounded-md">
           <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-teal-600 transition">Home</a>
          <a href="#" className="hover:text-teal-600 transition">Destinations</a>
          <a href="#" className="hover:text-teal-600 transition">Safety</a>
          <a href="#" className="hover:text-teal-600 transition">Guides</a>
          <a href="#" className="hover:text-teal-600 transition">Contact</a>
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl text-gray-700"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col items-center space-y-4 py-6 text-gray-700 font-medium">
            <a href="#" className="hover:text-teal-600 transition">Home</a>
            <a href="#" className="hover:text-teal-600 transition">Destinations</a>
            <a href="#" className="hover:text-teal-600 transition">Safety</a>
            <a href="#" className="hover:text-teal-600 transition">Guides</a>
            <a href="#" className="hover:text-teal-600 transition">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
