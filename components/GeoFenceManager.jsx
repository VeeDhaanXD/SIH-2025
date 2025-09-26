import React, { useState, useEffect } from 'react';
import { Map, AlertTriangle, WifiOff, Mountain, Plus, X, Trash2, Edit, Save, Globe, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Popup, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { motion, AnimatePresence } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import colors from 'tailwindcss/colors';

// --- Icon Fix ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// --- SIH-Specific Mock Data ---
const initialZones = [
    { id: 'ZONE-001', leafletId: 1, name: 'Pangong Tso Restricted Zone', type: 'Restricted', severity: 'Critical', alertMessage: 'CRITICAL: You are near a sensitive border area. Photography is prohibited. Turn back immediately.', createdBy: 'Admin', lastModified: '2025-09-24T11:00:00.000Z', positions: [[33.75, 78.66], [33.76, 78.68], [33.74, 78.70], [33.73, 78.67]] },
    { id: 'ZONE-002', leafletId: 2, name: 'Jim Corbett Tiger Territory', type: 'High-Risk', severity: 'High', alertMessage: 'Warning: High probability of wildlife encounter. Do not exit your vehicle. Keep a safe distance from animals.', createdBy: 'Admin', lastModified: '2025-09-22T14:30:00.000Z', positions: [[29.53, 78.77], [29.54, 78.79], [29.52, 78.80], [29.51, 78.78]] },
    { id: 'ZONE-003', leafletId: 3, name: 'Valley of Flowers - No Network', type: 'Low Network', severity: 'Medium', alertMessage: 'You are entering a zero connectivity zone. Ensure your offline maps are downloaded.', createdBy: 'Admin', lastModified: '2025-09-20T09:15:00.000Z', positions: [[30.72, 79.58], [30.73, 79.60], [30.71, 79.61], [30.70, 79.59]] },
    { id: 'ZONE-004', leafletId: 4, name: 'Kedarkantha Trek Summit Route', type: 'Trekking Route', severity: 'High', alertMessage: 'High altitude trekking route ahead. Be aware of Acute Mountain Sickness (AMS) symptoms. Weather can change rapidly.', createdBy: 'Admin', lastModified: '2025-08-15T18:00:00.000Z', positions: [[31.020, 78.175], [31.025, 78.180], [31.022, 78.185], [31.018, 78.182]] },
];

// --- Helpers & Sub-components ---
const formatDistanceToNow = (dateString) => {
    const date = new Date(dateString); const now = new Date(); const seconds = Math.floor((now - date) / 1000); let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + " years ago"; interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + " months ago"; interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + " days ago"; interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + " hours ago"; interval = seconds / 60; if (interval > 1) return Math.floor(interval) + " minutes ago"; return "just now";
};

const getZoneStyle = (type, isHovered, isActive) => {
    const styles = {
        Restricted: { color: colors.red[600], fillColor: colors.red[400] },
        'High-Risk': { color: colors.amber[600], fillColor: colors.amber[400] },
        'Low Network': { color: colors.blue[600], fillColor: colors.blue[400] },
        'Trekking Route': { color: colors.emerald[600], fillColor: colors.emerald[400] },
        default: { color: colors.slate[600], fillColor: colors.slate[400] },
    };
    const style = styles[type] || styles.default;
    
    if (isActive) {
        return { ...style, weight: 4, fillOpacity: 0.7, color: style.color };
    }
    if (isHovered) {
        return { ...style, weight: 3, fillOpacity: 0.6 };
    }
    return { ...style, weight: 2, fillOpacity: 0.4, dashArray: '5, 5' };
};

const ZoneTypeIcon = ({ type, className = 'w-5 h-5' }) => {
    const icons = { Restricted: <AlertTriangle className={className} />, 'High-Risk': <Mountain className={className} />, 'Low Network': <WifiOff className={className} />, 'Trekking Route': <Map className={className} /> }; return icons[type] || <Globe className={className} />;
};
const ZoneTypeBadge = ({ type }) => {
    const styles = { Restricted: 'bg-red-100 text-red-800', 'High-Risk': 'bg-amber-100 text-amber-800', 'Low Network': 'bg-blue-100 text-blue-800', 'Trekking Route': 'bg-emerald-100 text-emerald-800' }; return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type]}`}>{type}</span>;
};

const ZoneEditModal = ({ zone, onClose, onSave }) => {
    const [formData, setFormData] = useState(zone || { name: '', type: 'Restricted', severity: 'Medium', alertMessage: '' });
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSave({ ...formData, id: zone ? zone.id : null }); onClose(); };
    
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[1001] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} transition={{ duration: 0.2 }} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <header className="flex items-center justify-between p-4 border-b dark:border-slate-700"><h2 className="text-xl font-bold">{zone ? 'Edit Geo-Fence' : 'Create Geo-Fence'}</h2><button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-6 h-6" /></button></header>
                    <div className="p-6 space-y-4"><div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Zone Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><div className="grid grid-cols-2 gap-4"><div><label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Zone Type</label><select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Restricted</option><option>High-Risk</option><option>Low Network</option><option>Trekking Route</option></select></div><div><label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">Alert Severity</label><select id="severity" name="severity" value={formData.severity} onChange={handleChange} className="w-full bg-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Medium</option><option>High</option><option>Critical</option></select></div></div><div><label htmlFor="alertMessage" className="block text-sm font-medium text-gray-700 mb-1">Alert Message</label><textarea id="alertMessage" name="alertMessage" value={formData.alertMessage} onChange={handleChange} rows="3" required className="w-full bg-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea></div></div>
                    <footer className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-white border rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"><Save className="w-4 h-4" /> Save Zone</button></footer>
                </form>
            </motion.div>
        </motion.div>
    );
};

const MapController = ({ flyTo }) => {
    const map = useMap(); useEffect(() => { if (flyTo) { const [lat, lng, zoom] = flyTo; map.flyTo([lat, lng], zoom, { animate: true, duration: 1.5 }); } }, [flyTo, map]); return null;
};

// --- Main GeoFenceManager Component ---
export default function GeoFenceManager() {
    const [zones, setZones] = useState(initialZones);
    const [selectedZone, setSelectedZone] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLayer, setNewLayer] = useState(null);
    const [hoveredZoneId, setHoveredZoneId] = useState(null);
    const [activeZoneId, setActiveZoneId] = useState(null);
    const [mapFlyTo, setMapFlyTo] = useState(null);

    const handleZoneInteraction = (zone) => {
        setActiveZoneId(zone.id);
        const [lat, lng] = zone.positions[0];
        setMapFlyTo([lat, lng, 14]);
    };

    // Placeholder handlers to be fully implemented
    const handleCreated = (e) => {
        const { layer } = e;
        const leafletId = layer._leaflet_id;
        const coordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
        setNewLayer({ leafletId, coordinates });
        setIsModalOpen(true);
    };
    const handleEdited = (e) => {
        e.layers.eachLayer(layer => {
            const leafletId = layer._leaflet_id;
            const updatedCoordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
            setZones(prev => prev.map(z => z.leafletId === leafletId ? { ...z, positions: updatedCoordinates, lastModified: new Date().toISOString() } : z));
        });
    };
    const handleDeleted = (e) => {
        const deletedIds = [];
        e.layers.eachLayer(layer => deletedIds.push(layer._leaflet_id));
        setZones(prev => prev.filter(z => !deletedIds.includes(z.leafletId)));
    };
    const handleSave = (zoneData) => {
        const now = new Date().toISOString();
        if (selectedZone) {
            setZones(zones.map((z) => (z.id === zoneData.id ? { ...selectedZone, ...zoneData, lastModified: now } : z)));
        } else if (newLayer) {
            const newZone = { ...zoneData, id: `ZONE-${Date.now()}`, createdBy: 'Admin', lastModified: now, positions: newLayer.coordinates, leafletId: newLayer.leafletId };
            setZones(prev => [newZone, ...prev]);
        }
        closeModal();
    };
    const closeModal = () => { setIsModalOpen(false); setSelectedZone(null); setNewLayer(null); };
    const handleEditFromSidebar = (zone) => { setSelectedZone(zone); setIsModalOpen(true); };
    const handleDeleteFromSidebar = (zoneId) => { if (window.confirm('Are you sure?')) setZones(zones.filter((z) => z.id !== zoneId)); };

    return (
        <main className="flex-1 bg-gray-200 flex flex-col h-full overflow-hidden">
            <AnimatePresence>
                {isModalOpen && <ZoneEditModal zone={selectedZone} onClose={closeModal} onSave={handleSave} />}
            </AnimatePresence>
            <div className="p-6"><h1 className="text-3xl font-bold text-gray-800">Geo-Fence Manager</h1><p className="text-gray-500 mt-1">Smart Tourist Safety Monitoring & Incident Response System</p></div>
            <div className="flex-1 flex gap-6 px-6 pb-6 min-h-0">
                <aside className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-xl shadow-md flex flex-col">
                    <header className="p-4 border-b text-center"><p className="text-sm text-gray-500"><Plus className="w-4 h-4 inline-block mr-1"/>Use map tools to create a zone</p></header>
                    <motion.div
                        className="flex-1 overflow-y-auto p-2"
                        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                        initial="hidden"
                        animate="visible"
                    >
                        {zones.length > 0 ? zones.map((zone) => (
                            <motion.div
                                key={zone.id}
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                                onMouseEnter={() => setHoveredZoneId(zone.id)}
                                onMouseLeave={() => setHoveredZoneId(null)}
                                onClick={() => handleZoneInteraction(zone)}
                                className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${activeZoneId === zone.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-3"><div className="text-gray-400 mt-1"><ZoneTypeIcon type={zone.type} /></div><div><p className="font-semibold text-gray-800">{zone.name}</p><ZoneTypeBadge type={zone.type} /></div></div>
                                    <div className="flex gap-1 opacity-50 hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); handleEditFromSidebar(zone); }} className="p-1 hover:text-blue-500"><Edit className="w-4 h-4" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteFromSidebar(zone.id); }} className="p-1 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 text-right">Updated {formatDistanceToNow(zone.lastModified)}</p>
                            </motion.div>
                        )) : (
                            <div className="text-center p-8 text-gray-500">
                                <Globe className="w-16 h-16 mx-auto text-gray-300" />
                                <h3 className="mt-2 font-semibold">No Zones Created</h3>
                                <p className="text-sm">Draw a polygon on the map to define your first geo-fence.</p>
                            </div>
                        )}
                    </motion.div>
                </aside>
                <section className="flex-1 bg-white rounded-xl shadow-md overflow-hidden">
                    <MapContainer center={[28.6139, 77.2090]} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                        <MapController flyTo={mapFlyTo} />
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>' />
                        <FeatureGroup>
                            <EditControl position="topright" onCreated={handleCreated} onEdited={handleEdited} onDeleted={handleDeleted} draw={{rectangle: false, circle: false, circlemarker: false, marker: false, polyline: false}} />
                            {zones.map((zone) => (
                                <Polygon key={zone.id}
                                    pathOptions={getZoneStyle(zone.type, hoveredZoneId === zone.id, activeZoneId === zone.id)}
                                    positions={zone.positions}
                                    eventHandlers={{ click: () => handleZoneInteraction(zone) }}
                                >
                                    <Popup><div className="p-1"><h3 className="font-bold text-lg mb-2">{zone.name}</h3><div className="mb-2"><ZoneTypeBadge type={zone.type} /> <span className='ml-2 text-xs font-semibold'>Severity: {zone.severity}</span></div><p className="text-sm bg-gray-100 p-2 rounded">{zone.alertMessage}</p></div></Popup>
                                </Polygon>
                            ))}
                        </FeatureGroup>
                    </MapContainer>
                </section>
            </div>
        </main>
    );
}