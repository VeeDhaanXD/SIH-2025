import React, { useState, useMemo } from 'react';
import { ShieldAlert, User, Clock, MapPin, Phone, Siren, FileText, Plus, X, MessageSquare } from 'lucide-react';

// --- MOCK DATA & HELPERS ---

// We'll use a fixed "current" time for consistent relative time display
const now = new Date('2025-09-25T00:24:00.000Z'); // Thursday, September 25, 2025 at 12:24 AM IST

const initialIncidents = [
    {
        id: 'INC-001',
        touristName: 'Ananya Sharma',
        photoUrl: `https://placehold.co/100x100/E2E8F0/4A5568?text=AS`,
        alertType: 'Panic Button',
        severity: 'Critical',
        timestamp: new Date('2025-09-25T00:22:00.000Z'), // 2 mins ago
        status: 'New',
        location: 'Tiger Hill, Darjeeling',
        details: 'Triggered near viewpoint. No further communication.',
        log: [],
        emergencyContact: { name: 'Rohan Sharma', phone: '+91-98XXXXXX01' }
    },
    {
        id: 'INC-002',
        touristName: 'Priya Patel',
        photoUrl: `https://placehold.co/100x100/E2E8F0/4A5568?text=PP`,
        alertType: 'AI Anomaly Detected',
        severity: 'High',
        timestamp: new Date('2025-09-25T00:09:00.000Z'), // 15 mins ago
        status: 'Investigating',
        location: 'Ziro Valley, AP',
        details: 'Prolonged inactivity for over 30 minutes in a low-signal area.',
        log: [
            { user: 'Admin', action: 'Contacted local guide, awaiting response.', time: new Date('2025-09-25T00:15:00.000Z') }
        ],
        emergencyContact: { name: 'Amit Patel', phone: '+91-99XXXXXX03' }
    },
    {
        id: 'INC-003',
        touristName: 'Michael Chen',
        photoUrl: `https://placehold.co/100x100/E2E8F0/4A5568?text=MC`,
        alertType: 'Device Offline',
        severity: 'Medium',
        timestamp: new Date('2025-09-24T23:54:00.000Z'), // 30 mins ago
        status: 'Investigating',
        location: 'Last seen: Sela Pass',
        details: 'Device lost signal in a known low-network zone. Standard procedure initiated.',
        log: [
            { user: 'System', action: 'Standard 30-min offline alert triggered.', time: new Date('2025-09-24T23:54:00.000Z') }
        ],
        emergencyContact: { name: 'Emily Chen', phone: '+1-64XXXXXX04' }
    },
     {
        id: 'INC-004',
        touristName: 'John Doe',
        photoUrl: `https://placehold.co/100x100/E2E8F0/4A5568?text=JD`,
        alertType: 'Geo-Fence Alert',
        severity: 'Medium',
        timestamp: new Date('2025-09-24T18:24:00.000Z'), // 6 hours ago
        status: 'Resolved',
        location: 'Near Restricted Area, Tawang',
        details: 'User briefly entered a restricted military zone. Responded to automated warning and moved away.',
        log: [
             { user: 'System', action: 'Automated warning sent to device.', time: new Date('2025-09-24T18:25:00.000Z') },
             { user: 'Admin', action: 'Confirmed user has left the area. Case closed.', time: new Date('2025-09-24T18:40:00.000Z') }
        ],
        emergencyContact: { name: 'Jane Doe', phone: '+1-55XXXXXX02' }
    },
];

const formatRelativeTime = (date) => {
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

// --- Kanban Board Columns ---
const columns = {
    'New': { name: 'New Alerts', style: 'border-t-red-500' },
    'Investigating': { name: 'Under Investigation', style: 'border-t-yellow-500' },
    'Dispatched': { name: 'Action Dispatched', style: 'border-t-blue-500' },
    'Resolved': { name: 'Resolved', style: 'border-t-green-500' },
};

// --- Sub-components ---

const SeverityBadge = ({ severity }) => {
    const styles = {
        'Critical': 'bg-red-500/20 text-red-500 border border-red-500/30',
        'High': 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30',
        'Medium': 'bg-blue-500/20 text-blue-500 border border-blue-500/30',
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[severity]}`}>{severity}</span>;
};

const IncidentCard = ({ incident, onCardClick, onDragStart }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, incident.id)}
        onClick={() => onCardClick(incident)}
        className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all duration-200"
    >
        <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-gray-800 dark:text-slate-100">{incident.alertType}</h4>
            <SeverityBadge severity={incident.severity} />
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-slate-300 mb-3">
            <img src={incident.photoUrl} alt={incident.touristName} className="w-8 h-8 rounded-full" />
            <span>{incident.touristName}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-slate-500">
            <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1.5" />
                <span>{formatRelativeTime(incident.timestamp)}</span>
            </div>
            <span className="font-mono">{incident.id}</span>
        </div>
    </div>
);

const IncidentDetailModal = ({ incident, onClose, onUpdateLog, onGenerateFIR }) => {
    const [newLogEntry, setNewLogEntry] = useState('');

    if (!incident) return null;

    const handleAddLog = () => {
        if (newLogEntry.trim()) {
            onUpdateLog(incident.id, newLogEntry);
            setNewLogEntry('');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Incident Details - {incident.id}</h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{incident.alertType} for {incident.touristName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                        <X className="w-6 h-6 text-gray-600 dark:text-slate-300" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="md:col-span-1 space-y-4">
                         <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <h4 className="font-bold mb-2 text-gray-800 dark:text-slate-200">Incident Info</h4>
                            <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                                <p><strong>Severity:</strong> <SeverityBadge severity={incident.severity} /></p>
                                <p><strong>Time:</strong> {incident.timestamp.toLocaleString()}</p>
                                <p><strong>Location:</strong> {incident.location}</p>
                                <p><strong>Details:</strong> {incident.details}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                             <h4 className="font-bold mb-2 text-gray-800 dark:text-slate-200">Communication</h4>
                             <div className="space-y-2">
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-center space-x-2">
                                    <Phone className="w-4 h-4" /><span>Call Tourist</span>
                                </button>
                                 <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-center space-x-2">
                                    <User className="w-4 h-4" /><span>Call Emergency Contact</span>
                                </button>
                             </div>
                        </div>
                        <button 
                            onClick={() => onGenerateFIR(incident)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-3 rounded-lg flex items-center justify-center space-x-2 text-md">
                            <FileText className="w-5 h-5" /><span>Generate E-FIR</span>
                        </button>
                    </div>

                    {/* Right Column */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg h-60">
                             <h4 className="font-bold mb-2 text-gray-800 dark:text-slate-200">Live Location & Response Units</h4>
                             <div className="w-full h-[calc(100%-2rem)] bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center text-center text-gray-500 dark:text-slate-400">
                                <MapPin className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                                <p className="ml-2 font-semibold">Live Map Area</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <h4 className="font-bold mb-2 text-gray-800 dark:text-slate-200">Action Log</h4>
                            <div className="space-y-3 max-h-48 overflow-y-auto mb-3 pr-2">
                               {incident.log.length > 0 ? incident.log.map((entry, i) => (
                                   <div key={i} className="text-sm">
                                       <p className="text-gray-800 dark:text-slate-200"><strong>{entry.user}:</strong> {entry.action}</p>
                                       <p className="text-xs text-gray-500 dark:text-slate-400">{entry.time.toLocaleTimeString()}</p>
                                   </div>
                               )) : <p className="text-sm text-gray-500 dark:text-slate-400">No actions logged yet.</p>}
                            </div>
                            <div className="flex space-x-2">
                                <input type="text" value={newLogEntry} onChange={e => setNewLogEntry(e.target.value)} placeholder="Add a new log entry..." className="flex-1 bg-slate-100 dark:bg-slate-600 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
                                <button onClick={handleAddLog} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg"><Plus className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main IncidentResponseView Component ---
export default function IncidentResponseView() {
    const [incidents, setIncidents] = useState(initialIncidents);
    const [selectedIncident, setSelectedIncident] = useState(null);

    const onDragStart = (e, id) => {
        e.dataTransfer.setData("incidentId", id);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };



    const onDrop = (e, newStatus) => {
        const incidentId = e.dataTransfer.getData("incidentId");
        const updatedIncidents = incidents.map(inc => {
            if (inc.id === incidentId) {
                // Add a system log for status change
                const newLog = {
                    user: 'System',
                    action: `Status changed to ${columns[newStatus].name}.`,
                    time: new Date()
                };
                return { ...inc, status: newStatus, log: [...inc.log, newLog] };
            }
            return inc;
        });
        setIncidents(updatedIncidents);
    };
    
    const updateLog = (id, newEntry) => {
        const updatedIncidents = incidents.map(inc => {
            if(inc.id === id) {
                 const newLog = { user: 'Admin', action: newEntry, time: new Date() };
                 return {...inc, log: [...inc.log, newLog]};
            }
            return inc;
        });
        setIncidents(updatedIncidents);
        // Also update the selected incident if it's the one being viewed
        if (selectedIncident && selectedIncident.id === id) {
            setSelectedIncident(updatedIncidents.find(i => i.id === id));
        }
    };

    const generateFIR = (incident) => {
        // In a real app, this would trigger a PDF generation or API call
        alert(`Generating E-FIR for incident ${incident.id} involving ${incident.touristName}.`);
    }

    return (
        <main className="flex-1 p-6 lg:p-8 bg-slate-100 dark:bg-slate-900 flex flex-col">
            <IncidentDetailModal 
                incident={selectedIncident} 
                onClose={() => setSelectedIncident(null)} 
                onUpdateLog={updateLog}
                onGenerateFIR={generateFIR}
            />
            <div className="max-w-full mx-auto flex flex-col flex-1">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Incident Response Center</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track active tourist safety incidents.</p>
                </div>
                
                <div className="flex-1 grid grid-flow-col auto-cols-fr gap-6 min-w-[1200px] overflow-x-auto pb-4">
                    {Object.entries(columns).map(([statusKey, col]) => (
                        <div 
                            key={statusKey}
                            className="flex flex-col bg-slate-200/50 dark:bg-slate-900/50 rounded-xl"
                            onDragOver={onDragOver}
                            onDrop={(e) => onDrop(e, statusKey)}
                        >
                            <div className={`p-4 border-b-2 ${col.style} border-t-4 border-t-transparent`}>
                                <h3 className="font-bold text-lg text-gray-700 dark:text-slate-200">{col.name}</h3>
                            </div>
                            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                                {incidents.filter(inc => inc.status === statusKey).map(inc => (
                                    <IncidentCard 
                                        key={inc.id} 
                                        incident={inc} 
                                        onCardClick={setSelectedIncident}
                                        onDragStart={onDragStart}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

