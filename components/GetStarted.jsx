// src/components/GetStartedPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Map, BrainCircuit, Shield, MoveRight, CheckCircle, Server } from 'lucide-react';
import logo from "../src/logo.jpg";
// --- Reusable Animated Card for Features ---
const FeatureCard = ({ icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">{icon}</div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <p className="mt-3 text-sm text-slate-400">{description}</p>
  </motion.div>
);


// --- Main Get Started Page Component ---
export default function GetStartedPage() {
  const currentDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return (
    <div className="flex-1 bg-slate-900 text-white overflow-y-auto">
      {/* Hero Section */}
      <div className="relative text-center py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
            
          <ShieldCheck className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            TravelSOS Command Center
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
            A proactive, AI-powered platform for ensuring tourist safety and managing incident response with unparalleled efficiency and immutable logging.
          </p>
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              Get Started <MoveRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Core Features */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">The Future of Tourist Safety</h2>
          <p className="mt-2 text-slate-400">Our platform integrates cutting-edge technology to move from reactive to proactive safety.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard index={0} icon={<Map size={24} />} title="Live Geo-Monitoring" description="Track all tourists in real-time on an interactive map with custom-defined safety and hazard zones." />
          <FeatureCard index={1} icon={<BrainCircuit size={24} />} title="AI Risk Assessment" description="Our AI proactively identifies at-risk tourists by analyzing location, device vitals, and behavior patterns." />
          <FeatureCard index={2} icon={<Shield size={24} />} title="Blockchain Ledger" description="Every incident and action is logged on a tamper-proof blockchain, ensuring a verifiable audit trail." />
          <FeatureCard index={3} icon={<Server size={24} />} title="Incident Command" description="A dedicated workflow manager to handle incidents from alert to resolution with AI-powered protocols." />
        </div>
        
        {/* System Status Section */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-20 bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
            <div>
                <h3 className="font-bold text-white">Live System Status</h3>
                <p className="text-sm text-slate-400">All systems are currently online and fully operational.</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle size={16} />
                    <span>Operational</span>
                </div>
                <div className="h-6 w-px bg-slate-700"></div>
                <div className="text-slate-400">
                    Last Check: {currentDate}
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}