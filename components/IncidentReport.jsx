// src/components/IncidentReport.jsx

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FileText, Printer, ShieldCheck, Clock, User, MapPin, Hash } from 'lucide-react';

export default function IncidentReport() {
  const location = useLocation();
  // Get the incident data passed from the previous page
  const { incident } = location.state || { incident: null };

  if (!incident) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">No incident data provided.</h1>
        <Link to="/" className="text-blue-500 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-slate-200 dark:bg-slate-900 flex justify-center overflow-y-auto">
      <div className="w-full max-w-4xl">
        {/* Action Header */}
        <div className="mb-4 flex justify-between items-center print:hidden">
          <Link to="/" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm"
          >
            <Printer size={16} /> Print / Save as PDF
          </button>
        </div>
        
        {/* Report Content */}
        <div className="bg-white dark:bg-slate-800 p-8 lg:p-12 rounded-lg shadow-lg">
          <header className="flex items-center pb-6 border-b border-slate-300 dark:border-slate-700">
            <FileText className="w-10 h-10 mr-4 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Official Incident Report</h1>
              <p className="text-slate-500 dark:text-slate-400">ID: {incident.id}</p>
            </div>
          </header>

          <section className="my-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Incident Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2"><User size={14} className="text-slate-500"/><strong>Tourist:</strong> {incident.tourist.name} ({incident.tourist.id})</div>
              <div className="flex items-center gap-2"><ShieldAlert size={14} className="text-slate-500"/><strong>Type:</strong> {incident.type}</div>
              <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-500"/><strong>Location:</strong> {incident.location}</div>
              <div className="flex items-center gap-2"><Clock size={14} className="text-slate-500"/><strong>Report Generated:</strong> {new Date().toLocaleString()}</div>
            </div>
          </section>

          <section className="my-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Response Timeline</h2>
            <div className="space-y-4">
              {incident.communicationLog.map((log, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="text-xs text-slate-500 w-20 flex-shrink-0">{log.time}</div>
                  <div className="relative w-full">
                    <div className="absolute left-[-22px] top-1 w-3 h-3 bg-slate-300 rounded-full"></div>
                    <div className="border-l-2 border-slate-300 pl-6 pb-4">
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{log.user}</p>
                      <p className="text-slate-600 dark:text-slate-300">{log.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="my-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500"/> Blockchain Verification
            </h2>
            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg font-mono text-xs space-y-2">
              <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">This incident is immutably recorded on the blockchain. The following hashes verify the integrity of the response timeline.</p>
              {incident.blockchainLog.map(log => (
                <div key={log.block} className="flex items-center gap-2 text-slate-500">
                  <Hash size={12}/> <span className="font-bold">Block #{log.block}:</span> <span className="truncate">{log.hash}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}