// src/components/SystemSettings.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Globe, User, Save } from 'lucide-react';

// --- Reusable Sub-components for the Settings Page ---

// A custom, animated toggle switch
const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
      enabled ? 'bg-blue-600' : 'bg-slate-300'
    }`}
    onClick={onChange}
  >
    <motion.span
      animate={enabled ? { x: 20 } : { x: 0 }}
      transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0"
    />
  </button>
);

// A container for a group of settings
const SettingsSection = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md">
    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
        {icon}
        {title}
      </h2>
    </div>
    <div className="p-6 space-y-6">{children}</div>
  </div>
);

// A row for a single setting item
const SettingsRow = ({ label, description, children }) => (
  <div className="flex flex-col sm:flex-row items-start justify-between">
    <div className="mb-2 sm:mb-0">
      <label className="font-medium text-slate-700 dark:text-slate-200">{label}</label>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);


// --- Main SystemSettings Component ---
export default function SystemSettings() {
  const [settings, setSettings] = useState({
    criticalAlertsEmail: true,
    geofenceBreachSms: true,
    anomalyDetectionPush: false,
    alertSeverityThreshold: 'High',
    mfaEnabled: true,
    sessionTimeout: 30,
  });

  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'saved'

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveStatus('idle'); // Reset save status on change
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      console.log('Settings saved:', settings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000); // Revert to idle after 2s
    }, 1500);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 bg-slate-100 dark:bg-slate-900 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">System Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage system-wide notifications, security, and general configurations.
          </p>
        </div>

        <div className="space-y-8">
          {/* Notification Settings Section */}
          <SettingsSection title="Notification Settings" icon={<Bell />}>
            <SettingsRow label="Critical Alerts via Email" description="Receive an email for incidents like panic button presses.">
              <ToggleSwitch enabled={settings.criticalAlertsEmail} onChange={() => handleChange('criticalAlertsEmail', !settings.criticalAlertsEmail)} />
            </SettingsRow>
            <SettingsRow label="Geo-Fence Breach via SMS" description="Get an SMS notification when a tourist enters a restricted zone.">
              <ToggleSwitch enabled={settings.geofenceBreachSms} onChange={() => handleChange('geofenceBreachSms', !settings.geofenceBreachSms)} />
            </SettingsRow>
             <SettingsRow label="Anomaly Alerts via Push" description="Mobile push notifications for behavior anomalies.">
              <ToggleSwitch enabled={settings.anomalyDetectionPush} onChange={() => handleChange('anomalyDetectionPush', !settings.anomalyDetectionPush)} />
            </SettingsRow>
          </SettingsSection>

          {/* Security Settings Section */}
          <SettingsSection title="Security Settings" icon={<Shield />}>
            <SettingsRow label="Multi-Factor Authentication (MFA)" description="Require a second verification step to log in.">
              <ToggleSwitch enabled={settings.mfaEnabled} onChange={() => handleChange('mfaEnabled', !settings.mfaEnabled)} />
            </SettingsRow>
            <SettingsRow label="Session Timeout (Minutes)" description="Automatically log out users after a period of inactivity.">
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                className="w-24 bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </SettingsRow>
          </SettingsSection>

           {/* General Settings Section */}
          <SettingsSection title="General Settings" icon={<Globe />}>
             <SettingsRow label="Default Alert Threshold" description="Minimum severity level to display in the live incident feed.">
              <select
                value={settings.alertSeverityThreshold}
                onChange={(e) => handleChange('alertSeverityThreshold', e.target.value)}
                className="bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </SettingsRow>
          </SettingsSection>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving' || saveStatus === 'saved'}
            className={`flex items-center justify-center w-36 h-12 px-6 py-3 font-semibold text-white rounded-lg shadow-md transition-all duration-300
              ${saveStatus === 'saved' ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'}
              ${saveStatus === 'saving' ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {saveStatus === 'idle' && <><Save className="w-5 h-5 mr-2" /><span>Save Changes</span></>}
            {saveStatus === 'saving' && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {saveStatus === 'saved' && <span>Saved!</span>}
          </button>
        </div>
      </div>
    </div>
  );
}