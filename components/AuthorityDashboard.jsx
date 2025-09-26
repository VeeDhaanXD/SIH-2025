import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, MapPin, BarChart3, Bell, AlertTriangle, ChevronsRight, Phone, Map, Video, Shield, Cog, BrainCircuit, UserCheck, MessageSquareWarning } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Polygon, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Mock Data ---
const mockStats = {
    totalTourists: 17,
    activeAlerts: 12,
    highRiskZones: 7,
    touristsInDistress: 3,
};
const mockAlerts = [
    { id: 1, type: 'Panic Button', tourist: 'Ananya Sharma', location: 'Tiger Hill, Darjeeling', time: '2m ago', severity: 'critical' },
    { id: 2, type: 'Geo-Fence Breach', tourist: 'John Doe', location: 'Restricted Area, Tawang', time: '5m ago', severity: 'high' },
    { id: 3, type: 'Anomaly Detected', tourist: 'Priya Patel', location: 'Ziro Valley Trail', time: '15m ago', severity: 'medium' },
];
const mockHighRiskTourists = [
    { id: 101, name: 'Ravi Kumar', safetyScore: 45, location: 'Nathula Pass', reason: 'Low network area, solo travel', position: [27.385, 88.831] },
    { id: 102, name: 'Sophie Dubois', safetyScore: 52, location: 'Gurudongmar Lake', reason: 'Itinerary deviation', position: [28.025, 88.709] },
    { id: 103, name: 'Ahmed Al-Jamil', safetyScore: 58, location: 'Kaziranga National Park', reason: 'Entering dense forest zone', position: [26.666, 93.366] },
];
const mockZones = [
    { id: 'zone-tawang', positions: [[27.58, 91.85], [27.60, 91.87], [27.57, 91.88]] },
    { id: 'zone-kaziranga', positions: [[26.65, 93.35], [26.68, 93.38], [26.66, 93.40]] }
];
const riskIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1008/1008031.png',
    iconSize: [25, 25],
});
const mockTouristsForAI = [
  { id: 'T-78B', name: 'Rohan Sharma', avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267', batteryLevel: 12, networkSignal: 'Poor', isNearHighRiskZone: true, isHikingAfterSunset: false, hasDeviatedFromItinerary: true },
  { id: 'T-45A', name: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', batteryLevel: 35, networkSignal: 'None', isNearHighRiskZone: false, isHikingAfterSunset: true, hasDeviatedFromItinerary: false },
  { id: 'T-90J', name: 'Fatima Al-Sayed', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026713d', batteryLevel: 80, networkSignal: 'Strong', isNearHighRiskZone: false, isHikingAfterSunset: false, hasDeviatedFromItinerary: true },
];

// --- Sub-components (Full Definitions) ---

const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md flex items-center justify-between">
        <div><p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p><p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p></div>
        <div className={`p-4 rounded-full ${color}`}>{icon}</div>
    </div>
);

const AlertItem = ({ alert }) => {
    const severityStyles = {
        critical: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-600 dark:text-red-300', icon: <ShieldAlert className="w-5 h-5" /> },
        high: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-600 dark:text-orange-300', icon: <AlertTriangle className="w-5 h-5" /> },
        medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-600 dark:text-yellow-300', icon: <Bell className="w-5 h-5" /> },
    };
    const style = severityStyles[alert.severity] || severityStyles.medium;
    return (
        <div className={`p-4 rounded-lg flex items-start space-x-4 ${style.bg}`}>
            <div className={`mt-1 ${style.text}`}>{style.icon}</div>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <p className={`font-bold ${style.text}`}>{alert.type}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200">Tourist: <span className="font-semibold">{alert.tourist}</span></p>
                <p className="text-xs text-gray-600 dark:text-gray-300">Location: {alert.location}</p>
            </div>
            <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <ChevronsRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
        </div>
    );
};

const TouristDistributionChart = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md h-full">
        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Tourist Demographics</h3>
        <div className="space-y-4">
            <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-600 dark:text-gray-300">Domestic</span><span className="font-semibold text-gray-800 dark:text-white">72%</span></div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '72%' }}></div></div>
            </div>
            <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-600 dark:text-gray-300">International</span><span className="font-semibold text-gray-800 dark:text-white">28%</span></div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: '28%' }}></div></div>
            </div>
            <div className="pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Top Nationalities:</p>
                <ul className="text-sm list-disc list-inside text-gray-700 dark:text-gray-300"><li>USA: 8%</li><li>UK: 5%</li><li>Bangladesh: 4%</li></ul>
            </div>
        </div>
    </div>
);

const HighRiskTouristCard = ({ tourist }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
        <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 text-red-500`}><span className="font-bold text-lg">{tourist.safetyScore}</span></div>
            <div className="flex-1"><p className="font-bold text-gray-800 dark:text-white">{tourist.name}</p><p className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><MapPin className="w-3 h-3 mr-1" /> {tourist.location}</p></div>
        </div>
        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-md">{tourist.reason}</p>
        <div className="mt-4 flex space-x-2">
            <button className="flex-1 text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors">View Details</button>
            <button className="flex-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold py-2 px-3 rounded-lg transition-colors">Contact</button>
        </div>
    </div>
);

const NavCard = ({ to, icon, title, description, color }) => (
    <Link to={to} className="block p-5 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>{React.cloneElement(icon, { style: { color }, size: 24 })}</div>
            <div><h3 className="font-bold text-gray-800 dark:text-white">{title}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{description}</p></div>
        </div>
    </Link>
);

const getRiskFactors = (tourist) => {
  const factors = [];
  if (tourist.isNearHighRiskZone) factors.push("Nearing High-Risk Zone");
  if (tourist.hasDeviatedFromItinerary) factors.push("Itinerary Deviation");
  if (tourist.isHikingAfterSunset) factors.push("Active After Sunset");
  if (tourist.batteryLevel < 20) factors.push("Low Device Battery");
  if (tourist.networkSignal === 'None') factors.push("No Network Signal");
  return factors;
};

const calculateSafetyScore = (tourist) => {
  let score = 100;
  const factors = getRiskFactors(tourist);
  if (factors.includes("Nearing High-Risk Zone")) score -= 25;
  if (factors.includes("Itinerary Deviation")) score -= 20;
  if (factors.includes("Active After Sunset")) score -= 30;
  if (factors.includes("Low Device Battery")) score -= 15;
  if (factors.includes("No Network Signal")) score -= 10;
  const finalScore = Math.max(0, score);
  return { score: finalScore, factors };
};

const ProactiveAlertCard = ({ tourist, score, factors }) => {
  const scoreColor = score > 70 ? 'bg-emerald-500' : score > 40 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
      <div className="flex items-center space-x-4">
        <img className="h-12 w-12 rounded-full" src={tourist.avatar} alt={tourist.name} />
        <div className="flex-1"><p className="font-bold text-gray-800 dark:text-white">{tourist.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{tourist.id}</p></div>
        <div className="text-right"><p className="text-xs text-slate-500">Safety Score</p><p className={`text-2xl font-bold ${score > 70 ? 'text-emerald-600' : score > 40 ? 'text-amber-600' : 'text-red-600'}`}>{score}</p></div>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3"><motion.div className={`h-2 rounded-full ${scoreColor}`} initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, ease: "easeOut" }}/></div>
      <div className="mt-3"><p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Key Risk Factors:</p><div className="flex flex-wrap gap-1.5">{factors.map(factor => (<span key={factor} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">{factor}</span>))}</div></div>
      <div className="mt-4 flex space-x-2">
        <a href="/idt"><button className="flex-1 text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"><UserCheck size={16} /> Manage</button></a>
       <a href="/emergency">
        <button className="flex-1 text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"><MessageSquareWarning size={16} /> Send Alert</button>
     
     </a> 

      </div>
    </div>
  );
};

// --- Main AuthorityDashboard Component ---
export default function AuthorityDashboard() {
  const atRiskTourists = useMemo(() => {
    return mockTouristsForAI
      .map(tourist => ({ ...tourist, aiAssessment: calculateSafetyScore(tourist) }))
      .filter(tourist => tourist.aiAssessment.score < 70)
      .sort((a, b) => a.aiAssessment.score - b.aiAssessment.score);
  }, []);

  return (
    <div className="flex-1 p-6 lg:p-8 bg-slate-100 dark:bg-slate-900 overflow-y-auto">
    
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div><h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1><p className="text-gray-500 dark:text-gray-400 mt-1">Real-time tourist safety and incident overview.</p></div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2"><button className="bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700">Generate Report</button><button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm">New E-FIR</button></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard icon={<Users className="w-8 h-8 text-blue-500" />} title="Total Tourists" value={mockStats.totalTourists.toLocaleString('en-IN')} color="bg-blue-100 dark:bg-blue-900/50" />
          <Link to="/monitoring" className="transition-transform duration-200 hover:-translate-y-1"><StatCard icon={<ShieldAlert className="w-8 h-8 text-red-500" />} title="Active Alerts" value={mockStats.activeAlerts} color="bg-red-100 dark:bg-red-900/50" /></Link>
          <Link to="/geofence-manager" className="transition-transform duration-200 hover:-translate-y-1"><StatCard icon={<MapPin className="w-8 h-8 text-orange-500" />} title="High-Risk Zones" value={mockStats.highRiskZones} color="bg-orange-100 dark:bg-orange-900/50" /></Link>
          <StatCard icon={<Phone className="w-8 h-8 text-yellow-500" />} title="Tourists in Distress" value={mockStats.touristsInDistress} color="bg-yellow-100 dark:bg-yellow-900/50" />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NavCard to="/monitoring" title="Live Monitoring" description="Go to real-time map view" icon={<Video />} color="#ef4444" />
            <NavCard to="/geo" title="Geo-Fence Manager" description="Manage all safety zones" icon={<Map />} color="#3b82f6" />
            <NavCard to="/incident" title="Incident Reports" description="View analytics & logs" icon={<BarChart3 />} color="#f59e0b" />
            <NavCard to="/touristdb" title="Tourist Database" description="Search & manage tourists" icon={<Users />} color="#22c55e" />
            <NavCard to="/blockchain" title="Blockchain Ledger" description="View immutable incident logs" icon={<Shield />} color="#6366f1" />
            <NavCard to="/setting" title="System Settings" description="Configure system parameters" icon={<Cog />} color="#64748b" />
        
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <BrainCircuit size={22} className="mr-2 text-blue-500" />
            AI Risk Assessment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {atRiskTourists.map(tourist => (
              <ProactiveAlertCard 
                key={tourist.id} 
                tourist={tourist} 
                score={tourist.aiAssessment.score}
                factors={tourist.aiAssessment.factors}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md h-[450px]">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2">High-Risk Overview</h3>
              <MapContainer center={[27.5, 91.0]} zoom={6} scrollWheelZoom={false} zoomControl={false} dragging={false} style={{ height: 'calc(100% - 2rem)', width: '100%', borderRadius: '0.5rem', background: '#e2e8f0' }}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                {mockZones.map(zone => ( <Polygon key={zone.id} positions={zone.positions} pathOptions={{ color: '#f59e0b', weight: 1, fillOpacity: 0.1 }} /> ))}
                {mockHighRiskTourists.map(tourist => ( <Marker key={tourist.id} position={tourist.position} icon={riskIcon}><Tooltip><strong>{tourist.name}</strong><br />Safety Score: {tourist.safetyScore}</Tooltip></Marker> ))}
              </MapContainer>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Live Incident Feed</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {mockAlerts.map(alert => <AlertItem key={alert.id} alert={alert} />)}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">High-Risk Tourists</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {mockHighRiskTourists.map(tourist => <HighRiskTouristCard key={tourist.id} tourist={tourist} />)}
              </div>
            </div>
            <TouristDistributionChart />
          </div>
        </div>
      </div>
    </div>
  );
}