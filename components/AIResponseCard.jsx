// src/components/AIResponseCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Check } from 'lucide-react';

// --- The "AI Brain" Simulation ---
// This function takes an incident type and returns a recommended protocol.
export function getAIRecommendations(incidentType) {
  switch (incidentType) {
    case 'Panic Button Pressed':
      return {
        priority: 'CRITICAL',
        priorityColor: 'bg-red-500',
        actions: [
          'Establish immediate voice contact with tourist.',
          'Advise tourist to stay put and describe surroundings.',
          'Dispatch nearest High-Altitude Rescue unit (Team H-04).',
          'Notify nearest hospital of incoming patient.',
        ],
        summary: 'AI suggests immediate dispatch due to a direct distress signal in a potentially remote area.'
      };
    case 'Geo-Fence Breach':
      return {
        priority: 'HIGH',
        priorityColor: 'bg-orange-500',
        actions: [
          'Send automated warning message to tourist device.',
          'Attempt non-emergency voice contact.',
          'Monitor tourist movement for 5 minutes for course correction.',
          'Alert nearest patrol unit (Team P-12) to be on standby.',
        ],
        summary: 'AI suggests initial contact and monitoring before escalating to a full dispatch.'
      };
    default:
      return {
        priority: 'MEDIUM',
        priorityColor: 'bg-amber-500',
        actions: [
          'Verify anomaly with secondary device data (e.g., heart rate).',
          'Cross-reference location with known safe zones.',
          'Log event for pattern analysis.'
        ],
        summary: 'AI suggests verification of data anomaly before taking direct action.'
      };
  }
}

// --- The UI Card Component ---
export const AIResponseCard = ({ protocol }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-blue-500/50"
    >
      <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center mb-3">
        <BrainCircuit size={20} className="mr-2 text-blue-500" />
        AI Response Protocol
      </h3>

      <div className="mb-4">
        <span className="text-xs font-bold uppercase text-slate-500">Priority Level</span>
        <div className={`mt-1 text-white text-sm font-bold inline-flex items-center px-3 py-1 rounded-full ${protocol.priorityColor}`}>
          {protocol.priority}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-xs font-bold uppercase text-slate-500">Suggested Actions</span>
        <ul className="mt-2 space-y-2">
          {protocol.actions.map((action, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
              <Check className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <span className="text-xs font-bold uppercase text-slate-500">AI Summary</span>
         <blockquote className="mt-2 text-sm text-slate-600 dark:text-slate-300 border-l-4 border-blue-500 pl-4 py-1">
          {protocol.summary}
        </blockquote>
      </div>
    </motion.div>
  );
};