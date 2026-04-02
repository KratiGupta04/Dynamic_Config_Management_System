import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload, FileJson, Save } from 'lucide-react';

const ENVIRONMENTS = ['global', 'dev', 'staging', 'prod'];

const UploadConfig = ({ isOpen, onClose, onSave }) => {
         const [clientId, setClientId] = useState('');
         const [environment, setEnvironment] = useState('dev');
         const [version, setVersion] = useState('1.0.0');
         const [jsonData, setJsonData] = useState('{\n  \n}');
         const [error, setError] = useState('');
         const [success, setSuccess] = useState('');
         const [loading, setLoading] = useState(false);

         if (!isOpen) return null;

         const handleFileUpload = (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  // Auto-parse filename: clientId_environment_version.json
                  const name = file.name.replace('.json', '');
                  const parts = name.split('_');
                  if (parts.length >= 3) {
                           setClientId(parts[0]);
                           setEnvironment(parts[1]);
                           setVersion(parts.slice(2).join('.'));
                  }

                  const reader = new FileReader();
                  reader.onload = (ev) => {
                           try {
                                    const parsed = JSON.parse(ev.target.result);
                                    setJsonData(JSON.stringify(parsed, null, 2));
                                    setError('');
                           } catch {
                                    setError('Invalid JSON in uploaded file');
                           }
                  };
                  reader.readAsText(file);
         };

         const handleSubmit = async () => {
                  setError('');
                  setSuccess('');

                  if (!clientId.trim()) return setError('Client ID is required');
                  if (!version.trim()) return setError('Version is required');

                  let parsedData;
                  try {
                           parsedData = JSON.parse(jsonData);
                  } catch {
                           return setError('Invalid JSON — please fix the format');
                  }

                  setLoading(true);
                  try {
                           const token = localStorage.getItem('token');
                           await axios.post('/api/configs/update', {
                                    clientId: clientId.trim().toLowerCase(),
                                    environment,
                                    version: version.trim(),
                                    data: parsedData,
                           }, {
                                    headers: { Authorization: `Bearer ${token}` }
                           });

                           setSuccess(`✅ Config saved for "${clientId}" in ${environment} (v${version})`);
                           onSave();
                           setTimeout(() => {
                                    setSuccess('');
                                    onClose();
                           }, 2000);
                  } catch (err) {
                           setError(err.response?.data?.message || 'Failed to save config');
                  } finally {
                           setLoading(false);
                  }
         };

         const handleReset = () => {
                  setClientId('');
                  setEnvironment('dev');
                  setVersion('1.0.0');
                  setJsonData('{\n  \n}');
                  setError('');
                  setSuccess('');
         };

         return (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                           <div className="bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                                             <div className="flex items-center gap-2">
                                                      <FileJson size={22} className="text-green-400" />
                                                      <h3 className="text-lg font-bold">Upload New Config</h3>
                                             </div>
                                             <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                                                      <X size={20} />
                                             </button>
                                    </div>

                                    <div className="p-6 space-y-5">
                                             {/* File Upload */}
                                             <div>
                                                      <label className="block text-sm text-gray-400 mb-2">
                                                               📁 Upload a JSON file <span className="text-gray-500">(auto-fills fields if named correctly)</span>
                                                      </label>
                                                      <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-green-500 transition">
                                                               <Upload size={18} className="text-green-400" />
                                                               <span className="text-sm text-gray-400">Click to choose a .json file</span>
                                                               <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                                                      </label>
                                                      <p className="text-xs text-gray-500 mt-1">
                                                               Tip: name your file <code className="text-blue-300">clientId_environment_version.json</code> — fields fill automatically!
                                                      </p>
                                             </div>

                                             <div className="border-t border-gray-700 pt-4">
                                                      <p className="text-sm text-gray-400 mb-4">— or fill manually —</p>

                                                      {/* Fields Row */}
                                                      <div className="grid grid-cols-3 gap-4 mb-4">
                                                               <div>
                                                                        <label className="block text-xs text-gray-400 mb-1">Client ID *</label>
                                                                        <input
                                                                                 value={clientId}
                                                                                 onChange={(e) => setClientId(e.target.value)}
                                                                                 placeholder="e.g. clientA"
                                                                                 className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:border-green-500 focus:outline-none font-mono"
                                                                        />
                                                               </div>
                                                               <div>
                                                                        <label className="block text-xs text-gray-400 mb-1">Environment *</label>
                                                                        <select
                                                                                 value={environment}
                                                                                 onChange={(e) => setEnvironment(e.target.value)}
                                                                                 className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                                                                        >
                                                                                 {ENVIRONMENTS.map(env => (
                                                                                          <option key={env} value={env}>{env}</option>
                                                                                 ))}
                                                                        </select>
                                                               </div>
                                                               <div>
                                                                        <label className="block text-xs text-gray-400 mb-1">Version *</label>
                                                                        <input
                                                                                 value={version}
                                                                                 onChange={(e) => setVersion(e.target.value)}
                                                                                 placeholder="e.g. 1.0.0"
                                                                                 className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:border-green-500 focus:outline-none font-mono"
                                                                        />
                                                               </div>
                                                      </div>

                                                      {/* JSON Editor */}
                                                      <div>
                                                               <label className="block text-xs text-gray-400 mb-1">JSON Config Data *</label>
                                                               <textarea
                                                                        value={jsonData}
                                                                        onChange={(e) => setJsonData(e.target.value)}
                                                                        className="w-full h-52 bg-gray-900 text-green-400 font-mono text-sm p-4 border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none resize-none"
                                                                        spellCheck={false}
                                                               />
                                                      </div>
                                             </div>

                                             {/* Error / Success */}
                                             {error && (
                                                      <div className="text-red-400 bg-red-900 bg-opacity-30 border border-red-700 px-4 py-2 rounded text-sm">
                                                               ❌ {error}
                                                      </div>
                                             )}
                                             {success && (
                                                      <div className="text-green-400 bg-green-900 bg-opacity-30 border border-green-700 px-4 py-2 rounded text-sm">
                                                               {success}
                                                      </div>
                                             )}

                                             {/* Actions */}
                                             <div className="flex justify-between items-center pt-2">
                                                      <button
                                                               onClick={handleReset}
                                                               className="text-sm text-gray-400 hover:text-white transition"
                                                      >
                                                               Reset form
                                                      </button>
                                                      <div className="flex gap-3">
                                                               <button onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white text-sm">
                                                                        Cancel
                                                               </button>
                                                               <button
                                                                        onClick={handleSubmit}
                                                                        disabled={loading}
                                                                        className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                                                               >
                                                                        <Save size={16} />
                                                                        {loading ? 'Saving...' : 'Save Config'}
                                                               </button>
                                                      </div>
                                             </div>
                                    </div>
                           </div>
                  </div>
         );
};

export default UploadConfig;
