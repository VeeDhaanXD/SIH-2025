import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Tooltip } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertTriangle, ShieldCheck, CheckCircle, Bell, Phone } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import colors from 'tailwindcss/colors';

// --- Re-using Geo-Fence Data from our Manager ---
// In a real app, this would come from a shared state or API
const initialZones = [
    { id: 'ZONE-001', name: 'Pangong Tso Restricted Zone', type: 'Restricted', positions: [[33.75, 78.66], [33.76, 78.68], [33.74, 78.70], [33.73, 78.67]] },
    { id: 'ZONE-002', name: 'Jim Corbett Tiger Territory', type: 'High-Risk', positions: [[29.53, 78.77], [29.54, 78.79], [29.52, 78.80], [29.51, 78.78]] },
    { id: 'ZONE-003', name: 'Valley of Flowers - No Network', type: 'Low Network', positions: [[30.72, 79.58], [30.73, 79.60], [30.71, 79.61], [30.70, 79.59]] },
    { id: 'ZONE-004', name: 'Kedarkantha Trek Summit Route', type: 'Trekking Route', positions: [[31.020, 78.175], [31.025, 78.180], [31.022, 78.185], [31.018, 78.182]] },
];

// --- Mock Data for the Dashboard ---
const initialTourists = [
    { id: 'T-78B', name: 'Rohan Sharma', location: [33.755, 78.675], status: 'Alert' },
    { id: 'T-45A', name: 'Priya Patel', location: [30.725, 79.585], status: 'Warning' },
    { id: 'T-12C', name: 'Ankit Verma', location: [29.535, 78.785], status: 'Safe' },
    { id: 'T-99D', name: 'Sneha Reddy', location: [31.021, 78.178], status: 'Safe' },
];

const alertMessages = [
    { touristId: 'T-99D', message: 'Entered high-altitude trekking route.', severity: 'Medium' },
    { touristId: 'T-12C', message: 'Approaching core wildlife zone.', severity: 'Medium' },
    { touristId: 'T-45A', message: 'Device has low network signal.', severity: 'High' },
    { touristId: 'T-78B', message: 'Entered a restricted border area.', severity: 'Critical' },
];

// --- Sub-components & Helpers ---

// A reusable card for the top statistics
const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
        <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}20` }}>
            {React.cloneElement(icon, { style: { color } })}
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <p className="text-slate-800 text-2xl font-bold">{value}</p>
        </div>
    </div>
);

// Custom icons for tourist markers on the map
const getTouristIcon = (status) => {
    const color = {
        Safe: colors.emerald[500],
        Warning: colors.amber[500],
        Alert: colors.red[500],
    }[status];

    return L.divIcon({
        className: 'custom-icon',
        html: `<div class="relative flex items-center justify-center w-5 h-5 rounded-full" style="background-color: ${color};">
                   <div class="absolute w-5 h-5 rounded-full ${status === 'Alert' ? 'animate-ping' : ''}" style="background-color: ${color}; opacity: 0.75;"></div>
                   <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
               </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });
};

const getZoneStyle = (type) => ({
    color: { Restricted: colors.red[500], 'High-Risk': colors.amber[500], 'Low Network': colors.blue[500], 'Trekking Route': colors.emerald[500] }[type] || colors.slate[500],
    weight: 1,
    fillOpacity: 0.1,
});

// --- Main Dashboard Component ---
export default function MonitoringDashboard() {
    const [tourists, setTourists] = useState(initialTourists);
    const [alerts, setAlerts] = useState([]);

    // SIMULATION: Add a new alert every 5 seconds to make the feed feel live
    useEffect(() => {
        const interval = setInterval(() => {
            const newAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
            const alertWithTimestamp = { ...newAlert, id: Date.now(), timestamp: new Date() };
            setAlerts(prev => [alertWithTimestamp, ...prev]);
        }, 5000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);
    
    const summaryStats = {
        total: tourists.length,
        alerts: tourists.filter(t => t.status === 'Alert').length,
        safe: tourists.filter(t => t.status === 'Safe').length,
        warnings: tourists.filter(t => t.status === 'Warning').length,
    };

    return (
        <main className="flex-1 bg-slate-200 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4">
                <h1 className="text-3xl font-bold text-slate-800">Live Monitoring</h1>
                <p className="text-slate-500 mt-1">Real-time overview of tourist safety and active incidents.</p>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 px-6 pb-6 min-h-0">
                
                {/* Left Side: Map View */}
                <section className="w-full lg:w-2/3 bg-white/70 backdrop-blur-sm border border-slate-300 rounded-xl shadow-lg overflow-hidden">
                    <MapContainer center={[30.5, 79.0]} zoom={7} scrollWheelZoom={true} style={{ height: '100%', width: '100%', background: '#f1f5f9' }}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                        {/* Render Geo-Fences */}
                        {initialZones.map(zone => (
                            <Polygon key={zone.id} positions={zone.positions} pathOptions={getZoneStyle(zone.type)}>
                                <Tooltip sticky>{zone.name}</Tooltip>
                            </Polygon>
                        ))}
                        {/* Render Tourists */}
                        {tourists.map(tourist => (
                            <Marker key={tourist.id} position={tourist.location} icon={getTouristIcon(tourist.status)}>
                                <Popup>
                                    <div className="font-bold">{tourist.name} ({tourist.id})</div>
                                    <div>Status: <span className="font-semibold">{tourist.status}</span></div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </section>

                {/* Right Side: Stats and Live Feed */}
                <aside className="w-full lg:w-1/3 flex flex-col gap-6">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={<Users size={24} />} label="Total Tourists" value={summaryStats.total} color={colors.blue[500]} />
                        <StatCard icon={<AlertTriangle size={24} />} label="Active Alerts" value={summaryStats.alerts} color={colors.red[500]} />
                        <StatCard icon={<ShieldCheck size={24} />} label="Safe Tourists" value={summaryStats.safe} color={colors.emerald[500]} />
                        <StatCard icon={<CheckCircle size={24} />} label="Warnings" value={summaryStats.warnings} color={colors.amber[500]} />
                    </div>

                    {/* Live Alert Feed */}
                    <div className="flex-1 bg-white/70 backdrop-blur-sm border border-slate-300 rounded-xl shadow-lg flex flex-col min-h-0">
                        <header className="p-4 border-b border-slate-300/70 flex items-center gap-2">
                            <Bell className="text-slate-600" size={20} />
                            <h2 className="text-lg font-semibold text-slate-700">Live Alert Feed</h2>
                        </header>
                        <div className="flex-1 overflow-y-auto p-2">
                            <AnimatePresence>
                                {alerts.map((alert, index) => (
                                    <motion.div
                                        key={alert.id}
                                        layout
                                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4, type: "spring" }}
                                        className={`p-3 rounded-lg mb-2 flex items-start gap-3 border-l-4 ${
                                            { Critical: 'bg-red-50 border-red-500', High: 'bg-amber-50 border-amber-500', Medium: 'bg-blue-50 border-blue-500' }[alert.severity]
                                        }`}
                                    >
                                        <div className="mt-1">
                                            <AlertTriangle size={18} className={`${{ Critical: 'text-red-500', High: 'text-amber-500', Medium: 'text-blue-500' }[alert.severity]}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-800">
                                                <span className="font-bold">{alert.touristId}</span>: {alert.message}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">{alert.timestamp.toLocaleTimeString()}</p>
                                        </div>
                                        <button className="p-2 rounded-full hover:bg-slate-200/50 transition-colors">
                                            <Phone size={16} className="text-slate-600" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {alerts.length === 0 && <p className="text-center text-slate-500 p-8">Listening for new alerts...</p>}
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}