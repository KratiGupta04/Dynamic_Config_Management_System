import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../utils/socket';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const CLIENT_ID = 'clientA';
const ENVIRONMENT = 'dev';
const VERSION = '1.0.0';

const Demo = () => {
         const [config, setConfig] = useState(null);
         const [loading, setLoading] = useState(true);
         const [connected, setConnected] = useState(true);
         const [lastUpdated, setLastUpdated] = useState(null);
         const [flash, setFlash] = useState(false);
         const navigate = useNavigate();

         const fetchConfig = async () => {
                  try {
                           const res = await axios.get(
                                    `/api/configs?clientId=${CLIENT_ID}&environment=${ENVIRONMENT}&version=${VERSION}`
                           );
                           setConfig(res.data);
                           setLastUpdated(new Date().toLocaleTimeString());
                           setLoading(false);
                           // Flash effect to show update
                           setFlash(true);
                           setTimeout(() => setFlash(false), 800);
                  } catch (err) {
                           console.error('Failed to fetch config:', err);
                           setConnected(false);
                           setLoading(false);
                  }
         };

         useEffect(() => {
                  fetchConfig();

                  socket.on('connect', () => setConnected(true));
                  socket.on('disconnect', () => setConnected(false));

                  socket.on('configUpdated', (data) => {
                           // Only re-fetch if this client's config changed
                           if (
                                    (data.clientId === CLIENT_ID || data.clientId === 'global') &&
                                    (data.environment === ENVIRONMENT || data.environment === 'global')
                           ) {
                                    fetchConfig();
                           }
                  });

                  return () => {
                           socket.off('configUpdated');
                           socket.off('connect');
                           socket.off('disconnect');
                  };
         }, []);

         const themeColors = {
                  dark: { bg: 'bg-gray-900', card: 'bg-gray-800', accent: 'text-blue-400', btn: 'bg-blue-600 hover:bg-blue-700', border: 'border-gray-700' },
                  blue: { bg: 'bg-blue-950', card: 'bg-blue-900', accent: 'text-cyan-400', btn: 'bg-cyan-500 hover:bg-cyan-600', border: 'border-blue-700' },
                  light: { bg: 'bg-gray-100', card: 'bg-white', accent: 'text-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-700', border: 'border-gray-300' },
                  red: { bg: 'bg-red-950', card: 'bg-red-900', accent: 'text-rose-400', btn: 'bg-rose-500 hover:bg-rose-600', border: 'border-red-700' },
                  green: { bg: 'bg-green-950', card: 'bg-green-900', accent: 'text-lime-400', btn: 'bg-lime-500 hover:bg-lime-600', border: 'border-green-700' },
                  yellow: { bg: 'bg-yellow-900', card: 'bg-yellow-800', accent: 'text-yellow-300', btn: 'bg-yellow-500 hover:bg-yellow-600', border: 'border-yellow-600' },
                  purple: { bg: 'bg-purple-950', card: 'bg-purple-900', accent: 'text-violet-400', btn: 'bg-violet-500 hover:bg-violet-600', border: 'border-purple-700' },
         };

         const theme = themeColors[config?.theme] || themeColors.dark;
         const textColor = config?.theme === 'light' ? 'text-gray-800' : 'text-white';
         const subTextColor = config?.theme === 'light' ? 'text-gray-500' : 'text-gray-400';

         return (
                  <div className={`min-h-screen ${theme.bg} ${textColor} transition-all duration-700`}>
                           {/* Maintenance Banner */}
                           {config?.maintenanceMode && (
                                    <div className="w-full bg-yellow-500 text-black text-center py-2 font-semibold text-sm flex items-center justify-center gap-2">
                                             <AlertTriangle size={16} /> Maintenance Mode Active — Some features may be unavailable
                                    </div>
                           )}

                           <div className="max-w-4xl mx-auto p-8">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-8">
                                             <div>
                                                      <button
                                                               onClick={() => navigate('/dashboard')}
                                                               className={`flex items-center gap-2 mb-3 ${subTextColor} hover:${textColor} transition text-sm`}
                                                      >
                                                               <ArrowLeft size={16} /> Back to Dashboard
                                                      </button>
                                                      <h1 className={`text-3xl font-bold ${theme.accent}`}>
                                                               {config?.appName || 'Client App'} Demo
                                                      </h1>
                                                      <p className={`text-sm mt-1 ${subTextColor}`}>
                                                               Client: <span className="font-mono font-bold">{CLIENT_ID}</span> |
                                                               Env: <span className="font-mono font-bold">{ENVIRONMENT}</span> |
                                                               v{VERSION}
                                                      </p>
                                             </div>

                                             {/* Live status */}
                                             <div className={`flex flex-col items-end gap-2`}>
                                                      <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full border ${theme.border} ${connected ? 'text-green-400' : 'text-red-400'}`}>
                                                               {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
                                                               {connected ? 'Live' : 'Disconnected'}
                                                      </div>
                                                      {lastUpdated && (
                                                               <p className={`text-xs ${subTextColor}`}>Last synced: {lastUpdated}</p>
                                                      )}
                                             </div>
                                    </div>

                                    {loading ? (
                                             <div className="flex items-center gap-3 py-20 justify-center">
                                                      <RefreshCw size={24} className="animate-spin text-blue-400" />
                                                      <span className={subTextColor}>Fetching config from server...</span>
                                             </div>
                                    ) : (
                                             <div className={`transition-all duration-300 ${flash ? 'scale-[1.01] brightness-125' : 'scale-100'}`}>
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                                               {/* Theme Card */}
                                                               <div className={`${theme.card} border ${theme.border} rounded-xl p-6`}>
                                                                        <h2 className={`text-lg font-semibold mb-3 ${theme.accent}`}>🎨 Theme</h2>
                                                                        <div className="flex items-center gap-3">
                                                                                 <div className={`w-10 h-10 rounded-full ${theme.btn.split(' ')[0]}`} />
                                                                                 <div>
                                                                                          <p className="font-bold capitalize">{config?.theme || 'default'}</p>
                                                                                          <p className={`text-xs ${subTextColor}`}>Active theme from config</p>
                                                                                 </div>
                                                                        </div>
                                                                        <p className={`text-xs mt-4 ${subTextColor}`}>
                                                                                 Change <code className={theme.accent}>"theme"</code> in the dashboard to see this page transform!
                                                                        </p>
                                                               </div>

                                                               {/* Retry & Timeout Card */}
                                                               <div className={`${theme.card} border ${theme.border} rounded-xl p-6`}>
                                                                        <h2 className={`text-lg font-semibold mb-3 ${theme.accent}`}>⚙️ App Settings</h2>
                                                                        <div className="space-y-2 text-sm">
                                                                                 <div className="flex justify-between">
                                                                                          <span className={subTextColor}>Max Retries</span>
                                                                                          <span className="font-mono font-bold">{config?.maxRetries ?? '—'}</span>
                                                                                 </div>
                                                                                 <div className="flex justify-between">
                                                                                          <span className={subTextColor}>Session Timeout</span>
                                                                                          <span className="font-mono font-bold">{config?.sessionTimeout ? `${config.sessionTimeout}s` : '—'}</span>
                                                                                 </div>
                                                                                 <div className="flex justify-between">
                                                                                          <span className={subTextColor}>Log Level</span>
                                                                                          <span className="font-mono font-bold">{config?.logLevel ?? '—'}</span>
                                                                                 </div>
                                                                                 <div className="flex justify-between">
                                                                                          <span className={subTextColor}>API URL</span>
                                                                                          <span className="font-mono font-bold text-xs truncate max-w-[150px]">{config?.apiUrl ?? '—'}</span>
                                                                                 </div>
                                                                        </div>
                                                               </div>

                                                               {/* Feature Flags Card */}
                                                               <div className={`${theme.card} border ${theme.border} rounded-xl p-6`}>
                                                                        <h2 className={`text-lg font-semibold mb-3 ${theme.accent}`}>🚩 Feature Flags</h2>
                                                                        {config?.featureFlags ? (
                                                                                 <div className="space-y-2">
                                                                                          {Object.entries(config.featureFlags).map(([key, val]) => (
                                                                                                   <div key={key} className="flex items-center justify-between">
                                                                                                            <span className={`text-sm ${subTextColor} font-mono`}>{key}</span>
                                                                                                            <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${val ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                                                                                     {val ? <CheckCircle size={12} /> : null}
                                                                                                                     {val ? 'ON' : 'OFF'}
                                                                                                            </div>
                                                                                                   </div>
                                                                                          ))}
                                                                                 </div>
                                                                        ) : (
                                                                                 <p className={`text-sm ${subTextColor}`}>No feature flags defined</p>
                                                                        )}
                                                               </div>

                                                               {/* Maintenance Mode Card */}
                                                               <div className={`${theme.card} border ${theme.border} rounded-xl p-6`}>
                                                                        <h2 className={`text-lg font-semibold mb-3 ${theme.accent}`}>🛠️ System Status</h2>
                                                                        <div className="space-y-3">
                                                                                 <div className="flex items-center justify-between">
                                                                                          <span className={`text-sm ${subTextColor}`}>Maintenance Mode</span>
                                                                                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${config?.maintenanceMode ? 'bg-yellow-800 text-yellow-300' : 'bg-green-900 text-green-300'}`}>
                                                                                                   {config?.maintenanceMode ? '⚠️ ON' : '✅ OFF'}
                                                                                          </span>
                                                                                 </div>
                                                                                 <div className="flex items-center justify-between">
                                                                                          <span className={`text-sm ${subTextColor}`}>New UI</span>
                                                                                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${config?.featureFlags?.newUI ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                                                                                                   {config?.featureFlags?.newUI ? '✅ Enabled' : 'Disabled'}
                                                                                          </span>
                                                                                 </div>
                                                                                 <div className="flex items-center justify-between">
                                                                                          <span className={`text-sm ${subTextColor}`}>Beta Mode</span>
                                                                                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${config?.featureFlags?.betaMode ? 'bg-purple-900 text-purple-300' : 'bg-gray-700 text-gray-400'}`}>
                                                                                                   {config?.featureFlags?.betaMode ? '🔬 Active' : 'Inactive'}
                                                                                          </span>
                                                                                 </div>
                                                                        </div>
                                                               </div>

                                                               {/* Raw Config */}
                                                               <div className={`${theme.card} border ${theme.border} rounded-xl p-6 md:col-span-2`}>
                                                                        <h2 className={`text-lg font-semibold mb-3 ${theme.accent}`}>📦 Raw Merged Config (what clientA receives)</h2>
                                                                        <pre className={`text-xs font-mono ${subTextColor} overflow-auto max-h-48 bg-black bg-opacity-30 p-4 rounded-lg`}>
                                                                                 {JSON.stringify(config, null, 2)}
                                                                        </pre>
                                                               </div>
                                                      </div>
                                             </div>
                                    )}
                           </div>
                  </div>
         );
};

export default Demo;
