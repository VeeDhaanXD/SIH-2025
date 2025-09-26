// src/components/TouristDatabase.jsx

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, ChevronUp, ChevronDown, SlidersHorizontal, MoreVertical } from 'lucide-react';

// --- Comprehensive Mock Data ---
const mockTourists = [
  { id: 'T-78B', name: 'Rohan Sharma', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', status: 'Alert', safetyScore: 32, location: 'Pangong Tso, Ladakh', lastSeen: '5m ago', assignedOfficer: 'Sgt. Verma' },
  { id: 'T-45A', name: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', status: 'Warning', safetyScore: 55, location: 'Valley of Flowers, UK', lastSeen: '25m ago', assignedOfficer: 'Insp. Kaur' },
  { id: 'T-12C', name: 'Ankit Verma', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', status: 'Safe', safetyScore: 95, location: 'Jim Corbett, UK', lastSeen: '2h ago', assignedOfficer: 'Sgt. Verma' },
  { id: 'T-99D', name: 'Sneha Reddy', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', status: 'Safe', safetyScore: 88, location: 'Kedarkantha Trek, UK', lastSeen: '45m ago', assignedOfficer: 'Insp. Kaur' },
  { id: 'T-34E', name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d', status: 'Warning', safetyScore: 62, location: 'Sela Pass, AP', lastSeen: '1h ago', assignedOfficer: 'Sgt. Singh' },
  { id: 'T-56F', name: 'Emily White', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d', status: 'Safe', safetyScore: 91, location: 'Ziro Valley, AP', lastSeen: '3h ago', assignedOfficer: 'Insp. Joshi' },
  // Add more mock data to test pagination
  { id: 'T-67G', name: 'David Lee', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026710d', status: 'Safe', safetyScore: 98, location: 'Goa', lastSeen: '10m ago', assignedOfficer: 'Insp. Joshi' },
  { id: 'T-78H', name: 'Maria Garcia', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026711d', status: 'Alert', safetyScore: 25, location: 'Mumbai', lastSeen: '1m ago', assignedOfficer: 'Sgt. Singh' },
  { id: 'T-89I', name: 'Kenji Tanaka', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026712d', status: 'Safe', safetyScore: 85, location: 'Jaipur', lastSeen: '5h ago', assignedOfficer: 'Insp. Kaur' },
  { id: 'T-90J', name: 'Fatima Al-Sayed', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026713d', status: 'Warning', safetyScore: 48, location: 'Srinagar', lastSeen: '30m ago', assignedOfficer: 'Sgt. Verma' },
];

// --- Sub-components for UI elements ---
const StatusBadge = ({ status }) => {
  const styles = {
    Safe: 'bg-emerald-100 text-emerald-700',
    Warning: 'bg-amber-100 text-amber-700',
    Alert: 'bg-red-100 text-red-700',
  };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
};

const SafetyScore = ({ score }) => {
  const color = score > 75 ? 'text-emerald-600' : score > 50 ? 'text-amber-600' : 'text-red-600';
  return <span className={`font-bold ${color}`}>{score}</span>;
};

// --- Main TouristDatabase Component ---
export default function TouristDatabase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Memoized calculation for filtering, searching, and sorting
  const filteredTourists = useMemo(() => {
    let sortableItems = [...mockTourists];

    // Filter by status
    if (statusFilter !== 'All') {
      sortableItems = sortableItems.filter(tourist => tourist.status === statusFilter);
    }
    // Filter by search term
    if (searchTerm) {
      sortableItems = sortableItems.filter(tourist =>
        tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tourist.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Sort items
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [searchTerm, statusFilter, sortConfig]);

  // Pagination Logic
  const paginatedTourists = filteredTourists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredTourists.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const SortableHeader = ({ label, sortKey }) => (
    <th onClick={() => requestSort(sortKey)} className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider cursor-pointer">
      <div className="flex items-center gap-1">
        {label}
        {sortConfig.key === sortKey && (sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </div>
    </th>
  );

  return (
    <div className="flex-1 p-6 lg:p-8 bg-slate-100 dark:bg-slate-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tourist Database</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Search, manage, and monitor all registered tourists.</p>
          </div>
          <button className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm">
            <UserPlus size={18} />
            Add New Tourist
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All</option>
              <option>Safe</option>
              <option>Warning</option>
              <option>Alert</option>
            </select>
          </div>
        </div>

        {/* Tourist Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <SortableHeader label="Tourist" sortKey="name" />
                <SortableHeader label="Status" sortKey="status" />
                <SortableHeader label="Safety Score" sortKey="safetyScore" />
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Current Location</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Last Seen</th>
                <th className="p-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {paginatedTourists.map(tourist => (
                <tr key={tourist.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img className="h-10 w-10 rounded-full" src={tourist.avatar} alt={tourist.name} />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{tourist.name}</p>
                        <p className="text-xs text-slate-500">{tourist.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap"><StatusBadge status={tourist.status} /></td>
                  <td className="p-4 whitespace-nowrap"><SafetyScore score={tourist.safetyScore} /></td>
                  <td className="p-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{tourist.location}</td>
                  <td className="p-4 whitespace-nowrap text-sm text-slate-500">{tourist.lastSeen}</td>
                  <td className="p-4 whitespace-nowrap">
                    <button className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
                      <MoreVertical size={18} className="text-slate-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-slate-600">Showing {paginatedTourists.length} of {filteredTourists.length} tourists</span>
            <div className="flex gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded-md bg-white disabled:opacity-50">Prev</button>
                <span className="px-3 py-1">{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded-md bg-white disabled:opacity-50">Next</button>
            </div>
        </div>

      </div>
    </div>
  );
}