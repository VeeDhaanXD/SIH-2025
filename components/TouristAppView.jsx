// src/components/TouristAppView.jsx

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, MessageSquare, User, Wifi, Battery, AlertTriangle, ShieldCheck } from 'lucide-react';

// --- Mock Data for a Single Tourist's Perspective ---
const touristData = {
  name: 'Ananya Sharma',
  id: 'T-78B',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  currentPosition: [27.0415, 88.2636],
  plannedRoute: [
    [27.03, 88.25],
    [27.035, 88.255],
    [27.04, 88.26],
    [27.045, 88.268],
    [27.05, 88.27]
  ],
  safetyStatus: {
    level: 'Warning', // 'Safe', 'Warning', 'Danger'
    message: 'Approaching restricted area.',
  },
  nearbyZones: [
    { id: 'zone-safe', type: 'Safe', positions: [[27.05, 88.27], [27.055, 88.275], [27.048, 88.278]]},
    { id: 'zone-danger', type: 'Danger', positions: [[27.03, 88.26], [27.035, 88.265], [27.032, 88.268]]}
  ],
  messages: [
    { id: 1, from: 'Authority', text: 'Weather Alert: Heavy fog expected in your area after 10 PM.', time: '9:15 PM' },
    { id: 2, from: 'System', text: 'You have deviated from your planned itinerary.', time: '8:50 PM' },
  ],
};

const touristIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448659.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35]
});

// --- Main Tourist App View Component ---
export default function TouristAppView() {
  const [activeView, setActiveView] = useState('map'); // 'map' or 'messages'
  const [sosState, setSosState] = useState('idle'); // 'idle', 'sending', 'sent'

  const handleSosClick = () => {
    if (sosState !== 'idle') return;
    setSosState('sending');
    console.log(`--- EMERGENCY SOS TRIGGERED by ${touristData.name} (${touristData.id}) ---`);
    console.log(`Location: ${touristData.currentPosition}`);
    // Simulate API call
    setTimeout(() => {
      setSosState('sent');
      console.log('--- SOS SIGNAL CONFIRMED by Command Center ---');
    }, 2000);
  };

  const StatusBanner = () => {
    const styles = {
      Safe: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: <ShieldCheck /> },
      Warning: { bg: 'bg-amber-100', text: 'text-amber-800', icon: <AlertTriangle /> },
      Danger: { bg: 'bg-red-100', text: 'text-red-800', icon: <AlertTriangle /> }
    };
    const style = styles[touristData.safetyStatus.level] || styles.Warning;
    return (
      <div className={`p-3 ${style.bg} ${style.text} flex items-center gap-3`}>
        {React.cloneElement(style.icon, {className: 'w-5 h-5 flex-shrink-0'})}
        <p className="text-sm font-medium">{touristData.safetyStatus.message}</p>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 lg:p-8 bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4 text-center">Tourist Mobile App Simulation</h1>
        
        {/* Phone Container */}
        <div className="w-[380px] h-[820px] bg-slate-800 rounded-[40px] shadow-2xl p-4">
          <div className="w-full h-full bg-white rounded-[32px] overflow-hidden flex flex-col relative">
            
            {/* Phone Notch & Status Bar */}
            <div className="absolute top-0 left-0 w-full h-10 bg-white z-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-xl"></div>
                <div className="absolute top-2.5 left-6 text-sm font-bold text-slate-700">10:00 PM</div>
                <div className="absolute top-2.5 right-6 flex items-center gap-1.5 text-slate-700">
                    <Wifi size={14} />
                    <Battery size={18} />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col pt-10">
              <StatusBanner />
              <div className="flex-1 relative">
                {activeView === 'map' && (
                  <MapContainer center={touristData.currentPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    {touristData.nearbyZones.map(zone => (
                      <Polygon key={zone.id} positions={zone.positions} pathOptions={{color: zone.type === 'Safe' ? '#22c55e' : '#ef4444', fillOpacity: 0.1, weight: 1}} />
                    ))}
                    <Polyline positions={touristData.plannedRoute} color="#3b82f6" dashArray="5, 5" />
                    <Marker position={touristData.currentPosition} icon={touristIcon} />
                  </MapContainer>
                )}
                {activeView === 'messages' && (
                  <div className="p-4 space-y-3 overflow-y-auto h-full">
                    {touristData.messages.map(msg => (
                      <div key={msg.id} className="p-3 bg-slate-100 rounded-lg">
                        <p className="text-xs font-bold text-slate-500">{msg.from} - {msg.time}</p>
                        <p className="text-sm text-slate-800">{msg.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </main>

            {/* SOS Button */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
                <motion.button 
                    onClick={handleSosClick}
                    className={`w-24 h-24 rounded-full text-white font-bold text-2xl flex flex-col items-center justify-center shadow-xl
                        ${sosState === 'idle' && 'bg-red-500 hover:bg-red-600'}
                        ${sosState === 'sending' && 'bg-amber-500 animate-pulse'}
                        ${sosState === 'sent' && 'bg-emerald-500'}
                    `}
                    whileTap={{ scale: 0.9 }}
                >
                    {sosState === 'idle' && <>SOS</>}
                    {sosState === 'sending' && <><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span className="text-xs mt-1">SENDING</span></>}
                    {sosState === 'sent' && <><ShieldCheck size={32} /><span className="text-xs mt-1">SENT</span></>}
                </motion.button>
            </div>
            
            {/* Bottom Nav */}
            <footer className="h-20 bg-white/70 backdrop-blur-sm border-t border-slate-200 flex items-center justify-around flex-shrink-0">
                <button onClick={() => setActiveView('map')} className={`p-2 rounded-lg ${activeView === 'map' ? 'text-blue-600' : 'text-slate-500'}`}><Map /></button>
                <button onClick={() => setActiveView('messages')} className={`p-2 rounded-lg relative ${activeView === 'messages' ? 'text-blue-600' : 'text-slate-500'}`}>
                    <MessageSquare />
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                <button className="p-2 text-slate-500"><User /></button>
            </footer>
          </div>
        </div>
    </div>
  );
}