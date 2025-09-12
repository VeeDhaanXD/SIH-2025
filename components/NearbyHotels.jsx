import React from "react";
import { MdHotel, MdLocationOn, MdStar } from "react-icons/md";

const NearbyHotels = () => {
  // ✅ Dummy hotels data for prototype
  const hotels = [
    {
      name: "Taj Mahal Palace",
      vicinity: "Apollo Bunder, Mumbai",
      rating: 4.8,
    },
    {
      name: "The Oberoi",
      vicinity: "Nariman Point, Mumbai",
      rating: 4.7,
    },
    {
      name: "ITC Grand Central",
      vicinity: "Parel, Mumbai",
      rating: 4.5,
    },
    {
      name: "Holiday Inn",
      vicinity: "Andheri East, Mumbai",
      rating: 4.3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MdHotel className="text-teal-600" /> Nearby Hotels
        </h1>
        <p className="text-gray-600">Safe & verified hotels near your location</p>
      </header>

      <main className="flex-1 container mx-auto px-6 py-6 space-y-6">
        {/* Info / Description Card instead of map */}
        <div className="rounded-lg bg-gradient-to-r from-gray-800 via-gray-700 to-teal-600 text-white p-6 shadow-md">
          <h2 className="text-xl font-bold mb-2">Travel Comfort Made Easy 🏨</h2>
          <p className="text-white/90">
            Find hotels nearby that are safe, verified, and traveler-friendly. 
            Perfect for emergency stays, quick breaks, or safe shelter during late hours.
          </p>
        </div>

        {/* Hotels List */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Available Hotels</h2>
          <ul className="space-y-4 max-h-80 overflow-y-auto">
            {hotels.map((hotel, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-lg transition"
              >
                <MdHotel className="text-3xl text-teal-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {hotel.name}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <MdLocationOn className="text-red-500" /> {hotel.vicinity}
                  </p>
                  <p className="text-gray-600 flex items-center gap-1">
                    <MdStar className="text-yellow-500" /> {hotel.rating} ★
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default NearbyHotels;
