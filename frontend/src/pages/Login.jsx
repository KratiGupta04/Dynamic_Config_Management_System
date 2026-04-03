import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, UserPlus, LogIn } from 'lucide-react';

const Login = () => {
         const [isRegister, setIsRegister] = useState(false);
         const [username, setUsername] = useState('');
         const [password, setPassword] = useState('');
         const [confirmPassword, setConfirmPassword] = useState('');
         const [error, setError] = useState('');
         const [success, setSuccess] = useState('');
         const navigate = useNavigate();

         const resetForm = () => {
                  setUsername('');
                  setPassword('');
                  setConfirmPassword('');
                  setError('');
                  setSuccess('');
         };

         const handleToggle = () => {
                  setIsRegister(!isRegister);
                  resetForm();
         };

         const handleSubmit = async (e) => {
                  e.preventDefault();
                  setError('');
                  setSuccess('');

                  if (isRegister) {
                           if (password !== confirmPassword) {
                                    setError('Passwords do not match');
                                    return;
                           }
                           try {
                                    await axios.post('/api/auth/register', { username, password });
                                    setSuccess('Account created! You can now log in.');
                                    setIsRegister(false);
                                    setUsername('');
                                    setPassword('');
                                    setConfirmPassword('');
                           } catch (err) {
                                    setError(err.response?.data?.message || 'Registration failed. Try a different username.');
                           }
                  } else {
                           try {
                                    const response = await axios.post('/api/auth/login', { username, password });
                                    localStorage.setItem('token', response.data.token);
                                    localStorage.setItem('username', response.data.username);
                                    navigate('/dashboard');
                           } catch (err) {
                                    setError('Invalid username or password');
                           }
                  }
         };

         return (
                  <div className="flex items-center justify-center min-h-screen bg-gray-900">
                           <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl">

                                    {/* Header */}
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                             {isRegister
                                                      ? <UserPlus size={28} className="text-blue-400" />
                                                      : <LogIn size={28} className="text-blue-400" />
                                             }
                                             <h2 className="text-3xl font-bold text-white">
                                                      {isRegister ? 'Create Account' : 'Admin Login'}
                                             </h2>
                                    </div>
                                    <p className="text-center text-gray-400 text-sm mb-6">
                                             {isRegister
                                                      ? 'Register to access the config dashboard'
                                                      : 'Sign in to manage your configurations'}
                                    </p>

                                    {/* Error / Success */}
                                    {error && (
                                             <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/40 border border-red-700 rounded">
                                                      {error}
                                             </div>
                                    )}
                                    {success && (
                                             <div className="p-3 mb-4 text-sm text-green-400 bg-green-900/40 border border-green-700 rounded">
                                                      {success}
                                             </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                             {/* Username */}
                                             <div className="mb-4">
                                                      <label className="block mb-2 text-sm font-medium text-gray-300">Username</label>
                                                      <div className="relative">
                                                               <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                                        <User size={18} />
                                                               </span>
                                                               <input
                                                                        type="text"
                                                                        value={username}
                                                                        onChange={(e) => setUsername(e.target.value)}
                                                                        className="w-full py-2 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        placeholder="Enter username"
                                                                        required
                                                               />
                                                      </div>
                                             </div>

                                             {/* Password */}
                                             <div className="mb-4">
                                                      <label className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                                                      <div className="relative">
                                                               <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                                        <Lock size={18} />
                                                               </span>
                                                               <input
                                                                        type="password"
                                                                        value={password}
                                                                        onChange={(e) => setPassword(e.target.value)}
                                                                        className="w-full py-2 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        placeholder="Enter password"
                                                                        required
                                                               />
                                                      </div>
                                             </div>

                                             {/* Confirm Password (Register only) */}
                                             {isRegister && (
                                                      <div className="mb-6">
                                                               <label className="block mb-2 text-sm font-medium text-gray-300">Confirm Password</label>
                                                               <div className="relative">
                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                                                 <Lock size={18} />
                                                                        </span>
                                                                        <input
                                                                                 type="password"
                                                                                 value={confirmPassword}
                                                                                 onChange={(e) => setConfirmPassword(e.target.value)}
                                                                                 className="w-full py-2 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                 placeholder="Confirm your password"
                                                                                 required
                                                                        />
                                                               </div>
                                                      </div>
                                             )}

                                             {!isRegister && <div className="mb-6" />}

                                             {/* Submit */}
                                             <button
                                                      type="submit"
                                                      className="w-full py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                             >
                                                      {isRegister ? 'Create Account' : 'Login'}
                                             </button>
                                    </form>

                                    {/* Toggle */}
                                    <p className="mt-6 text-center text-sm text-gray-400">
                                             {isRegister ? 'Already have an account?' : "Don't have an account?"}
                                             {' '}
                                             <button
                                                      onClick={handleToggle}
                                                      className="text-blue-400 hover:text-blue-300 font-semibold underline-offset-2 hover:underline transition"
                                             >
                                                      {isRegister ? 'Login here' : 'Register here'}
                                             </button>
                                    </p>
                           </div>
                  </div>
         );
};

export default Login;
