// src/components/ProactiveAlertCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, MessageSquareWarning } from 'lucide-react';

// --- The "AI Brain" Simulation ---
// This helper function identifies risk factors for a tourist.
const getRiskFactors = (tourist) => {
  const factors = [];
  if (tourist.isNearHighRiskZone) factors.push("Nearing High-Risk Zone");
  if (tourist.hasDeviatedFromItinerary) factors.push("Itinerary Deviation");
  if (tourist.isHikingAfterSunset) factors.push("Active After Sunset");
  if (tourist.batteryLevel < 20) factors.push("Low Device Battery");
  if (tourist.networkSignal === 'None') factors.push("No Network Signal");
  return factors;
};

// This function calculates the safety score based on the factors.
export const calculateSafetyScore = (tourist) => {
  let score = 100;
  const factors = getRiskFactors(tourist);

  // Simple weighted scoring
  if (factors.includes("Nearing High-Risk Zone")) score -= 25;
  if (factors.includes("Itinerary Deviation")) score -= 20;
  if (factors.includes("Active After Sunset")) score -= 30;
  if (factors.includes("Low Device Battery")) score -= 15;
  if (factors.includes("No Network Signal")) score -= 10;
  
  const finalScore = Math.max(0, score);
  return { score: finalScore, factors };
};


// --- The UI Card Component ---
export const ProactiveAlertCard = ({ tourist, score, factors }) => {
  const scoreColor = score > 70 ? 'bg-emerald-500' : score > 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
      <div className="flex items-center space-x-4">
        <img className="h-12 w-12 rounded-full" src={tourist.avatar} alt={tourist.name} />
        <div className="flex-1">
          <p className="font-bold text-gray-800 dark:text-white">{tourist.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{tourist.id}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Safety Score</p>
          <p className={`text-2xl font-bold ${score > 70 ? 'text-emerald-600' : score > 40 ? 'text-amber-600' : 'text-red-600'}`}>
            {score}
          </p>
        </div>
      </div>

      {/* Score Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3">
        <motion.div
          className={`h-2 rounded-full ${scoreColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Risk Factors */}
      <div className="mt-3">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Key Risk Factors:</p>
        <div className="flex flex-wrap gap-1.5">
          {factors.map(factor => (
            <span key={factor} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">{factor}</span>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-4 flex space-x-2">
        <button className="flex-1 text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          <UserCheck size={16} /> Monitor
        </button>
        <button className="flex-1 text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          <MessageSquareWarning size={16} /> Send Alert
        </button>
      </div>
    </div>
  );
};