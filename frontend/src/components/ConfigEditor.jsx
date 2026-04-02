import React, { useState } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';

const ConfigEditor = ({ config, isOpen, onClose, onSave }) => {
         if (!isOpen) return null;

         const [jsonData, setJsonData] = useState(JSON.stringify(config.data, null, 2));
         const [error, setError] = useState('');

         const handleSave = async () => {
                  try {
                           const parsedData = JSON.parse(jsonData);
                           const token = localStorage.getItem('token');
                           await axios.post('/api/configs/update', {
                                    clientId: config.clientId,
                                    environment: config.environment,
                                    version: config.version,
                                    data: parsedData
                           }, {
                                    headers: { Authorization: `Bearer ${token}` }
                           });
                           onSave();
                           onClose();
                  } catch (err) {
                           setError(err.message === 'JSON parse error' ? 'Invalid JSON format' : 'Failed to save configuration');
                  }
         };

         return (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                           <div className="bg-gray-800 w-full max-w-2xl rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                             <h3 className="text-lg font-bold">Edit Config: {config.clientId}</h3>
                                             <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                                                      <X size={20} />
                                             </button>
                                    </div>
                                    <div className="p-6">
                                             {error && <div className="mb-4 text-red-500 bg-red-900 bg-opacity-20 p-2 rounded text-sm">{error}</div>}
                                             <div className="mb-4">
                                                      <label className="block text-sm text-gray-400 mb-2">JSON Content</label>
                                                      <textarea
                                                               value={jsonData}
                                                               onChange={(e) => setJsonData(e.target.value)}
                                                               className="w-full h-80 bg-gray-900 text-green-400 font-mono p-4 border border-gray-600 rounded focus:border-blue-500 focus:outline-none"
                                                      />
                                             </div>
                                             <div className="flex justify-end gap-3">
                                                      <button
                                                               onClick={onClose}
                                                               className="px-4 py-2 text-gray-300 hover:text-white"
                                                      >
                                                               Cancel
                                                      </button>
                                                      <button
                                                               onClick={handleSave}
                                                               className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                                                      >
                                                               <Save size={18} /> Save Changes
                                                      </button>
                                             </div>
                                    </div>
                           </div>
                  </div>
         );
};

export default ConfigEditor;
