import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../utils/socket';
import { Settings, RefreshCw, AlertCircle, LogOut, Code, Pencil, Play, Plus, Globe } from 'lucide-react';
import ConfigEditor from '../components/ConfigEditor';
import UploadConfig from '../components/UploadConfig';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
         const [configs, setConfigs] = useState([]);
         const [loading, setLoading] = useState(true);
         const [notifications, setNotifications] = useState([]);
         const [selectedConfig, setSelectedConfig] = useState(null);
         const [showUpload, setShowUpload] = useState(false);
         const navigate = useNavigate();

         useEffect(() => {
                  fetchConfigs();

                  socket.on('configUpdated', (data) => {
                           const msg = `Config Updated: ${data.clientId} (${data.environment}) - v${data.version}`;
                           setNotifications(prev => [msg, ...prev].slice(0, 5));
                           fetchConfigs();
                  });

                  return () => socket.off('configUpdated');
         }, []);

         const fetchConfigs = async () => {
                  try {
                           const token = localStorage.getItem('token');
                           const response = await axios.get('/api/configs/all', {
                                    headers: { Authorization: `Bearer ${token}` }
                           });
                           setConfigs(response.data);
                           setLoading(false);
                  } catch (err) {
                           console.error('Error fetching configs:', err);
                           if (err.response?.status === 401) handleLogout();
                  }
         };

         const handleLogout = () => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('username');
                  window.location.href = '/login';
         };

         return (
                  <div className="p-8">
                           {/* Header */}
                           <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                             <Settings className="text-blue-500" size={32} />
                                             <h1 className="text-3xl font-bold">Config Dashboard</h1>
                                    </div>
                                    <div className="flex items-center gap-3">
                                             <button
                                                      onClick={() => setShowUpload(true)}
                                                      className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                                             >
                                                      <Plus size={18} /> Upload Config
                                             </button>
                                             <button
                                                      onClick={() => window.open('/landing', '_blank')}
                                                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                                             >
                                                      <Globe size={18} /> Client Landing
                                             </button>
                                             <button
                                                      onClick={() => navigate('/demo')}
                                                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
                                             >
                                                      <Play size={18} /> View Demo
                                             </button>
                                             <button
                                                      onClick={handleLogout}
                                                      className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                                             >
                                                      <LogOut size={18} /> Logout
                                             </button>
                                    </div>
                           </div>

                           {/* Main Grid */}
                           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Configs Table */}
                                    <div className="lg:col-span-2">
                                             <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                                                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                                               <Code size={20} className="text-blue-400" /> Active Configurations
                                                      </h2>
                                                      {loading ? (
                                                               <div className="flex items-center gap-2 py-8 text-gray-400">
                                                                        <RefreshCw size={20} className="animate-spin" /> Loading...
                                                               </div>
                                                      ) : configs.length === 0 ? (
                                                               <p className="text-gray-500 py-4">No configurations found. Upload one!</p>
                                                      ) : (
                                                               <div className="overflow-x-auto">
                                                                        <table className="w-full text-left">
                                                                                 <thead>
                                                                                          <tr className="border-b border-gray-700 text-gray-400 text-sm uppercase">
                                                                                                   <th className="py-3 px-4">Client ID</th>
                                                                                                   <th className="py-3 px-4">Environment</th>
                                                                                                   <th className="py-3 px-4">Version</th>
                                                                                                   <th className="py-3 px-4">Last Updated</th>
                                                                                                   <th className="py-3 px-4">Actions</th>
                                                                                          </tr>
                                                                                 </thead>
                                                                                 <tbody>
                                                                                          {configs.map((config) => (
                                                                                                   <tr key={config._id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                                                                                                            <td className="py-3 px-4 font-mono font-semibold">{config.clientId}</td>
                                                                                                            <td className="py-3 px-4">
                                                                                                                     <span className={`px-2 py-1 rounded text-xs ${config.environment === 'prod' ? 'bg-red-900 text-red-100' :
                                                                                                                              config.environment === 'dev' ? 'bg-green-900 text-green-100' :
                                                                                                                                       config.environment === 'staging' ? 'bg-orange-900 text-orange-100' :
                                                                                                                                                'bg-blue-900 text-blue-100'
                                                                                                                              }`}>
                                                                                                                              {config.environment}
                                                                                                                     </span>
                                                                                                            </td>
                                                                                                            <td className="py-3 px-4">{config.version}</td>
                                                                                                            <td className="py-3 px-4 text-gray-400 text-sm">
                                                                                                                     {new Date(config.lastUpdated).toLocaleString()}
                                                                                                            </td>
                                                                                                            <td className="py-3 px-4">
                                                                                                                     <button
                                                                                                                              onClick={() => setSelectedConfig(config)}
                                                                                                                              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                                                                                                                     >
                                                                                                                              <Pencil size={14} /> Edit
                                                                                                                     </button>
                                                                                                            </td>
                                                                                                   </tr>
                                                                                          ))}
                                                                                 </tbody>
                                                                        </table>
                                                               </div>
                                                      )}
                                             </div>
                                    </div>

                                    {/* Right Panel */}
                                    <div className="space-y-6">
                                             {/* Live Updates */}
                                             <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                                                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                                               <AlertCircle size={20} className="text-yellow-400" /> Live Updates
                                                      </h2>
                                                      <div className="space-y-3">
                                                               {notifications.length === 0 ? (
                                                                        <p className="text-gray-500 text-sm">Waiting for updates...</p>
                                                               ) : (
                                                                        notifications.map((note, i) => (
                                                                                 <div key={i} className="p-3 bg-gray-700 border-l-4 border-yellow-500 rounded text-sm">
                                                                                          {note}
                                                                                 </div>
                                                                        ))
                                                               )}
                                                      </div>
                                             </div>

                                             {/* Instructions */}
                                             <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                                                      <h3 className="font-semibold mb-2">How to add configs</h3>
                                                      <ul className="text-gray-400 text-sm space-y-2">
                                                               <li>🟢 Click <strong>Upload Config</strong> to add via form</li>
                                                               <li>✏️ Click <strong>Edit</strong> on any row to modify it</li>
                                                               <li>📁 Drop a <code className="text-blue-300">.json</code> file in the <code className="text-blue-300">/configs</code> folder</li>
                                                               <li>📋 Format: <code className="text-blue-300">clientId_env_version.json</code></li>
                                                      </ul>
                                             </div>
                                    </div>
                           </div>

                           {/* Modals */}
                           {selectedConfig && (
                                    <ConfigEditor
                                             config={selectedConfig}
                                             isOpen={!!selectedConfig}
                                             onClose={() => setSelectedConfig(null)}
                                             onSave={() => { fetchConfigs(); setSelectedConfig(null); }}
                                    />
                           )}

                           <UploadConfig
                                    isOpen={showUpload}
                                    onClose={() => setShowUpload(false)}
                                    onSave={() => { fetchConfigs(); }}
                           />
                  </div>
         );
};

export default Dashboard;
