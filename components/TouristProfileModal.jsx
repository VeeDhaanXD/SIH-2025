import React, { useState, useMemo } from 'react';
import { Shield, Search, MapPin, AlertCircle as AlertCircleIcon, Phone, X } from 'lucide-react';

// --- MOCK DATA for Tourist Management ---
// In a real application, this would come from an API call
const mockTourists = [
    {
        id: 'TID-84392',
        name: 'Ananya Sharma',
        photoUrl: `https://placehold.co/100x100/E2E8F0/4A5568?text=AS`,
        nationality: 'Indian',
        age: 28,
        gender: 'Female',
        kycStatus: 'Verified',
        passport: 'LXXXXXXX1',
        location: 'Tiger Hill, Darjeeling',
        safetyScore: 35,
        status: 'Alert',
        device: { type: 'Mobile App', battery: '75%', signal: 'Strong' },
        itinerary: ['Darjeeling (2 days)', 'Pelling (3 days)', 'Gangtok (4 days)'],
        emergencyContacts: [{ name: 'Rohan Sharma', relation: 'Brother', phone: '+91-98XXXXXX01' }],
        alertHistory: [{ time: '2 mins ago', event: 'Panic Button Activated', details: 'Triggered near viewpoint.' }],
    },
    {
        id: 'TID-19847',
        name: 'John Doe',
        photoUrl: `https://placehold.co/100x100/E2E8F0/4A5568?text=JD`,
        nationality: 'American',
        age: 45,
        gender: 'Male',
        kycStatus: 'Verified',
        passport: '9XXXXXX8',
        location: 'Tawang Monastery, AP',
        safetyScore: 92,
        status: 'Active',
        device: { type: 'IoT Band', battery: '90%', signal: 'Good' },
        itinerary: ['Guwahati (1 day)', 'Tawang (4 days)', 'Bomdila (2 days)'],
        emergencyContacts: [{ name: 'Jane Doe', relation: 'Spouse', phone: '+1-55XXXXXX02' }],
        alertHistory: [],
    },
    {
        id: 'TID-55432',
        name: 'Priya Patel',
        photoUrl: `https://placehold.co/100x100/E2E8F0/4A5568?text=PP`,
        nationality: 'Indian',
        age: 34,
        gender: 'Female',
        kycStatus: 'Verified',
        passport: 'MXXXXXXX2',
        location: 'Ziro Valley, AP',
        safetyScore: 68,
        status: 'Active',
        device: { type: 'Mobile App', battery: '82%', signal: 'Moderate' },
        itinerary: ['Ziro (5 days)', 'Itanagar (2 days)'],
        emergencyContacts: [{ name: 'Amit Patel', relation: 'Husband', phone: '+91-99XXXXXX03' }],
        alertHistory: [{ time: '15 mins ago', event: 'Anomaly Detected', details: 'Prolonged inactivity.' }],
    },
    {
        id: 'TID-78901',
        name: 'Michael Chen',
        photoUrl: `https://placehold.co/100x100/E2E8F0/4A5568?text=MC`,
        nationality: 'Canadian',
        age: 52,
        gender: 'Male',
        kycStatus: 'Pending',
        passport: 'GXXXXXX34',
        location: 'Last seen: Sela Pass',
        safetyScore: 55,
        status: 'Offline',
        device: { type: 'Mobile App', battery: 'N/A', signal: 'Lost' },
        itinerary: ['Tawang (3 days)', 'Dirang (2 days)'],
        emergencyContacts: [{ name: 'Emily Chen', relation: 'Daughter', phone: '+1-64XXXXXX04' }],
        alertHistory: [{ time: '30 mins ago', event: 'Device Offline', details: 'Lost signal in a low-network area.' }],
    },
];


// --- Sub-components ---

const StatusBadge = ({ status }) => {
    const styles = {
        Active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        Alert: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 animate-pulse',
        Offline: 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

const SafetyScore = ({ score }) => {
    let colorClass = 'text-green-500';
    if (score < 70) colorClass = 'text-yellow-500';
    if (score < 40) colorClass = 'text-red-500';
    return (
        <div className="flex items-center space-x-2">
            <Shield className={`w-5 h-5 ${colorClass}`} />
            <span className={`font-bold text-lg ${colorClass}`}>{score}</span>
        </div>
    );
};

const TouristProfileModal = ({ tourist, onClose }) => {
    if (!tourist) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="flex items-center justify-between p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Tourist Profile - {tourist.id}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                        <X className="w-6 h-6 text-gray-600 dark:text-slate-300" />
                    </button>
                </header>
                
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="flex flex-col items-center">
                                <img src={tourist.photoUrl} alt={tourist.name} className="w-32 h-32 rounded-full border-4 border-slate-200 dark:border-slate-600" />
                                <h3 className="text-2xl font-bold mt-4 text-gray-900 dark:text-slate-100">{tourist.name}</h3>
                                <p className="text-gray-500 dark:text-slate-400">{tourist.age}, {tourist.gender}</p>
                                <p className="text-gray-500 dark:text-slate-400">{tourist.nationality}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                <h4 className="font-bold mb-2 text-gray-800 dark:text-slate-200">Vitals</h4>
                                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex justify-between"><span>KYC Status:</span> <span className={`font-semibold ${tourist.kycStatus === 'Verified' ? 'text-green-500' : 'text-yellow-500'}`}>{tourist.kycStatus}</span></div>
                                    <div className="flex justify-between"><span>Passport/ID:</span> <span className="font-mono">{tourist.passport}</span></div>
                                    <div className="flex justify-between"><span>Device:</span> <span>{tourist.device.type}</span></div>
                                    <div className="flex justify-between"><span>Battery:</span> <span>{tourist.device.battery}</span></div>
                                    <div className="flex justify-between"><span>Signal:</span> <span>{tourist.device.signal}</span></div>
                                </div>
                            </div>
                             <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                <h4 className="font-bold mb-2 text-gray-800 dark:text-slate-200">Emergency Contact</h4>
                                {tourist.emergencyContacts.map(contact => (
                                    <div key={contact.name}>
                                        <p className="font-semibold dark:text-slate-200">{contact.name} ({contact.relation})</p>
                                        <p className="text-sm text-gray-600 dark:text-slate-400">{contact.phone}</p>
                                        <button className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg text-sm flex items-center justify-center space-x-2">
                                            <Phone className="w-4 h-4" />
                                            <span>Initiate Call</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                             <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg h-64">
                                <h4 className="font-bold mb-2 text-gray-800 dark:text-slate-200">Live Location & Recent Path</h4>
                                <div className="w-full h-[calc(100%-2rem)] bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center text-center text-gray-500 dark:text-slate-400">
                                    <MapPin className="w-10 h-10 text-gray-400 dark:text-slate-500" />
                                    <p className="ml-2 font-semibold">Live Map Area</p>
                                </div>
                             </div>
                             <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                <h4 className="font-bold mb-2 text-gray-800 dark:text-slate-200">Trip Itinerary</h4>
                                <ol className="relative border-l border-gray-200 dark:border-slate-600 ml-2">
                                   {tourist.itinerary.map((stop, index) => (
                                       <li key={index} className="mb-4 ml-4">
                                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-slate-800 dark:bg-slate-600"></div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-200">{stop}</p>
                                        </li>
                                   ))}
                                </ol>
                             </div>
                             <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                <h4 className="font-bold mb-2 text-gray-800 dark:text-slate-200">Alert History</h4>
                                {tourist.alertHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        {tourist.alertHistory.map((alert, index) => (
                                             <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                                                <AlertCircleIcon className="w-5 h-5 text-red-500 mt-1" />
                                                <div>
                                                    <p className="font-semibold text-red-700 dark:text-red-300">{alert.event}</p>
                                                    <p className="text-sm text-gray-600 dark:text-slate-300">{alert.details}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{alert.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-slate-400">No alerts on record.</p>
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main TouristManagementView Component ---
export default function TouristManagementView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedTourist, setSelectedTourist] = useState(null);

    const filteredTourists = useMemo(() => {
        return mockTourists
            .filter(tourist =>
                tourist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tourist.id.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .filter(tourist =>
                statusFilter === 'All' || tourist.status === statusFilter
            );
    }, [searchQuery, statusFilter]);
    
    return (
        <main className="flex-1 p-6 lg:p-8 bg-slate-100 dark:bg-slate-900 overflow-y-auto h-full">
             <TouristProfileModal tourist={selectedTourist} onClose={() => setSelectedTourist(null)} />
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tourist Management</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Search, view, and manage tourist details.</p>
                    </div>
                     <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm">
                        Register New Tourist
                    </button>
                </div>

                <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full md:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or Tourist ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-slate-100 dark:bg-slate-700 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <label htmlFor="status-filter" className="text-sm font-medium text-gray-600 dark:text-gray-300">Status:</label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                             className="bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                        >
                            <option>All</option>
                            <option>Active</option>
                            <option>Alert</option>
                            <option>Offline</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Tourist</th>
                                    <th scope="col" className="px-6 py-3">Nationality</th>
                                    <th scope="col" className="px-6 py-3">Current Location</th>
                                    <th scope="col" className="px-6 py-3">Safety Score</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTourists.map((tourist) => (
                                    <tr key={tourist.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600/50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                           <div className="flex items-center space-x-3">
                                                <img className="h-10 w-10 rounded-full" src={tourist.photoUrl} alt={tourist.name} />
                                                <div>
                                                    <div className="font-bold">{tourist.name}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{tourist.id}</div>
                                                </div>
                                           </div>
                                        </td>
                                        <td className="px-6 py-4">{tourist.nationality}</td>
                                        <td className="px-6 py-4">{tourist.location}</td>
                                        <td className="px-6 py-4"><SafetyScore score={tourist.safetyScore} /></td>
                                        <td className="px-6 py-4"><StatusBadge status={tourist.status} /></td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => setSelectedTourist(tourist)}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {filteredTourists.length === 0 && (
                        <div className="text-center p-8 text-gray-500">
                            No tourists found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

