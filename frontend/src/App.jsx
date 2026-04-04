import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Demo from './pages/Demo';
import ClientLanding from './pages/ClientLanding';

const PrivateRoute = ({ children }) => {
         const token = localStorage.getItem('token');
         return token ? children : <Navigate to="/login" />;
};

function App() {
         return (
                  <Router>
                           <div className="min-h-screen bg-gray-900 text-white w-full">
                                    <Routes>
                                             <Route path="/login" element={<Login />} />
                                             <Route
                                                      path="/dashboard"
                                                      element={
                                                               <PrivateRoute>
                                                                        <Dashboard />
                                                               </PrivateRoute>
                                                      }
                                             />
                                             <Route
                                                      path="/demo"
                                                      element={
                                                               <PrivateRoute>
                                                                        <Demo />
                                                               </PrivateRoute>
                                                      }
                                             />
                                             {/* Public route — no login needed */}
                                             <Route path="/landing" element={<ClientLanding />} />
                                             <Route path="/" element={<Navigate to="/dashboard" />} />
                                    </Routes>
                           </div>
                  </Router>
         );
}

export default App;
