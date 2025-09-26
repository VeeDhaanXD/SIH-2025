// src/components/IncidentManager.jsx

import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ShieldAlert, User, MapPin, Clock, Check, Send, Phone, Edit, MessageSquare, Siren, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { AIResponseCard, getAIRecommendations } from './AIResponseCard';


// --- Mock Data for a Single, Active Incident ---
const initialIncidentData = {
  id: 'INC-098',
  tourist: {
    id: 'T-78B',
    name: 'Rohan Sharma',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267',
    age: 28,
    bloodType: 'O+',
    emergencyContact: '+91 98765 43210'
  },
  type: 'Panic Button Pressed',
  location: 'Near Tiger Hill, Darjeeling',
  position: [27.0415, 88.2636],
  timestamp: new Date('2025-09-26T21:30:15Z'),
  status: 'Acknowledged',
  assignedTeam: null,
  communicationLog: [
    { time: '9:30 PM', user: 'System', message: 'Panic button alert triggered by T-78B.' },
    { time: '9:31 PM', user: 'Operator', message: 'Incident acknowledged. Attempting to contact tourist.' },
  ],
  blockchainLog: [
    { block: 345, hash: '0000a1b...', data: 'Incident INC-098 Created' }
  ]
};

const statusSteps = ['Acknowledged', 'Team Assigned', 'En Route', 'On-Site', 'Resolved'];

// --- Sub-components ---
const StatusStepper = ({ currentStatus }) => {
  const currentIndex = statusSteps.indexOf(currentStatus);
  return (
    <div className="flex items-center justify-between text-xs text-center">
      {statusSteps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${index <= currentIndex ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>
              {index < currentIndex ? <Check size={16} /> : index + 1}
            </div>
            <p className={`mt-1 font-semibold ${index <= currentIndex ? 'text-blue-600' : 'text-slate-500'}`}>{step}</p>
          </div>
          {index < statusSteps.length - 1 && <div className={`flex-1 h-0.5 mt-[-1rem] ${index < currentIndex ? 'bg-blue-600' : 'bg-slate-300'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- Main Incident Manager Component ---
export default function IncidentManager() {
  const [incident, setIncident] = useState(initialIncidentData);
  const [note, setNote] = useState('');

  const aiProtocol = useMemo(() => getAIRecommendations(incident.type), [incident.type]);

  const handleLogAction = (message, statusUpdate = null, team = null) => {
    const newLog = { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), user: 'Operator', message };
    
    const lastBlock = incident.blockchainLog[incident.blockchainLog.length - 1];
    const newBlock = {
      block: lastBlock.block + 1,
      hash: '0000' + Math.random().toString(16).slice(2, 10) + '...',
      data: message
    };

    setIncident(prev => ({
      ...prev,
      status: statusUpdate || prev.status,
      assignedTeam: team || prev.assignedTeam,
      communicationLog: [...prev.communicationLog, newLog],
      blockchainLog: [...prev.blockchainLog, newBlock]
    }));
    setNote('');
  };

  const incidentIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1008/1008031.png',
    iconSize: [35, 35],
  });

  return (
    <div className="flex-1 p-6 lg:p-8 bg-slate-100 dark:bg-slate-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <Siren className="w-8 h-8 mr-3 text-red-500" />
            Incident Command: {incident.id}
          </h1>
          <p className="text-red-500 dark:text-red-400 mt-1 font-semibold animate-pulse">{incident.type}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md">
              <h3 className="font-bold text-lg mb-4">Incident Status</h3>
              <StatusStepper currentStatus={incident.status} />
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md">
                <h3 className="font-bold text-lg mb-3">Tourist Details</h3>
                <div className="flex items-center gap-4 mb-4">
                    <img className="h-16 w-16 rounded-full" src={incident.tourist.avatar} alt={incident.tourist.name} />
                    <div>
                        <p className="font-bold text-lg">{incident.tourist.name}</p>
                        <p className="text-sm text-slate-500">{incident.tourist.id}</p>
                    </div>
                </div>
                <div className="text-sm space-y-2">
                    <p><strong>Age:</strong> {incident.tourist.age}</p>
                    <p><strong>Blood Type:</strong> {incident.tourist.bloodType}</p>
                    <p><strong>Emergency Contact:</strong> {incident.tourist.emergencyContact}</p>
                </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <AIResponseCard protocol={aiProtocol} />
            
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md">
                <h3 className="font-bold text-lg mb-3">Action Panel</h3>
                <div className="space-y-3">
                    <button onClick={() => handleLogAction('Response Team P-12 Dispatched.', 'Team Assigned', 'Patrol Unit P-12')} className="w-full p-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 font-semibold disabled:opacity-50" disabled={incident.status !== 'Acknowledged'}> <Send size={16}/> Dispatch Team</button>
                    <button onClick={() => handleLogAction('Status updated to Resolved.', 'Resolved')} className="w-full p-3 bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-emerald-700 font-semibold disabled:opacity-50" disabled={incident.status === 'Resolved'}> <Check size={16}/> Mark as Resolved</button>
                    <div className="flex gap-2 pt-2">
                        <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Log a note..." className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button onClick={() => handleLogAction(`Note added: "${note}"`)} className="p-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600"><Edit size={16}/></button>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-3">Communication Log</h3>
              <div className="flex-1 space-y-3 overflow-y-auto pr-2 max-h-64">
                {incident.communicationLog.slice().reverse().map((log) => (
                  <div key={log.time+log.message} className="text-sm">
                    <p className="text-slate-500">{log.time} - <span className="font-semibold text-slate-600 dark:text-slate-300">{log.user}</span></p>
                    <p className="text-slate-800 dark:text-slate-100 pl-2">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md h-64">
              <h3 className="font-bold text-lg mb-2">Incident Location</h3>
              <MapContainer center={incident.position} zoom={13} style={{ height: 'calc(100% - 2rem)', width: '100%', borderRadius: '0.5rem' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                <Marker position={incident.position} icon={incidentIcon}><Tooltip permanent>{incident.location}</Tooltip></Marker>
              </MapContainer>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md flex-1 flex flex-col">
              <h3 className="font-bold text-lg mb-3">Blockchain Audit Trail</h3>
              <div className="flex-1 space-y-3 overflow-y-auto pr-2 max-h-64 font-mono text-xs">
                {incident.blockchainLog.slice().reverse().map((log) => (
                  <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{duration: 0.5}} key={log.block} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                    <p className="font-bold text-blue-500">Block #{log.block}</p>
                    <p className="text-slate-600 dark:text-slate-300 break-words">Data: <span className="text-slate-800 dark:text-slate-100">{log.data}</span></p>
                    <p className="text-slate-500 break-words flex items-center gap-1"><Hash size={10} /> {log.hash}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}