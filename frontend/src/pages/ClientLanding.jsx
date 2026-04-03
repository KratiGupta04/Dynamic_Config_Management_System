import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../utils/socket';
import { Wifi, WifiOff, Zap, Star, Shield, Globe, Mail, Phone, MapPin, ArrowRight, AlertTriangle, X, Wrench } from 'lucide-react';

const CLIENT_ID = 'clientA';
const ENVIRONMENT = 'dev';
const VERSION = '1.0.0';

// ── Theme map ─────────────────────────────────────────────────────────────────
const themes = {
         dark: { bg: '#0f172a', surface: '#1e293b', card: '#1e293b', border: '#334155', primary: '#3b82f6', primaryText: '#60a5fa', text: '#f1f5f9', sub: '#94a3b8', btnText: '#fff' },
         blue: { bg: '#0c1a3a', surface: '#0f2a5e', card: '#102952', border: '#1e4080', primary: '#3b82f6', primaryText: '#93c5fd', text: '#e0f2fe', sub: '#90caf9', btnText: '#fff' },
         light: { bg: '#f8fafc', surface: '#ffffff', card: '#ffffff', border: '#e2e8f0', primary: '#4f46e5', primaryText: '#4f46e5', text: '#1e293b', sub: '#64748b', btnText: '#fff' },
         red: { bg: '#1a0a0a', surface: '#2d1010', card: '#2d1010', border: '#7f1d1d', primary: '#ef4444', primaryText: '#f87171', text: '#fef2f2', sub: '#fca5a5', btnText: '#fff' },
         green: { bg: '#052010', surface: '#063a18', card: '#063a18', border: '#14532d', primary: '#22c55e', primaryText: '#4ade80', text: '#f0fdf4', sub: '#86efac', btnText: '#fff' },
         yellow: { bg: '#1a1200', surface: '#2d1f00', card: '#2d1f00', border: '#78350f', primary: '#f59e0b', primaryText: '#fcd34d', text: '#fffbeb', sub: '#fde68a', btnText: '#1a1200' },
         purple: { bg: '#0f0a1e', surface: '#1e1040', card: '#1e1040', border: '#4c1d95', primary: '#8b5cf6', primaryText: '#a78bfa', text: '#f5f3ff', sub: '#c4b5fd', btnText: '#fff' },
};

const features = [
         { icon: <Zap size={28} />, title: 'Lightning Fast', desc: 'Optimized for speed and performance at every level.' },
         { icon: <Shield size={28} />, title: 'Secure by Default', desc: 'Enterprise-grade security baked in from the start.' },
         { icon: <Globe size={28} />, title: 'Global Scale', desc: 'Deploy anywhere, scale to millions effortlessly.' },
];

const pricingPlans = [
         { name: 'Starter', price: '$0', desc: 'For individuals and small projects', features: ['5 Projects', '10GB Storage', 'Basic Support'] },
         { name: 'Pro', price: '$29/mo', desc: 'For growing teams', features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'Analytics'] },
         { name: 'Enterprise', price: 'Custom', desc: 'For large organizations', features: ['Everything in Pro', 'Dedicated Server', 'SLA', 'Custom Integrations'] },
];

// ─────────────────────────────────────────────────────────────────────────────

const ClientLanding = () => {
         const [config, setConfig] = useState(null);
         const [connected, setConnected] = useState(true);
         const [announcement, setAnnouncement] = useState('');
         const [flash, setFlash] = useState(false);

         const fetchConfig = async () => {
                  try {
                           const res = await axios.get(`/api/configs?clientId=${CLIENT_ID}&environment=${ENVIRONMENT}&version=${VERSION}`);
                           setConfig(res.data);
                           setAnnouncement(res.data?.announcement || '');
                           setFlash(true);
                           setTimeout(() => setFlash(false), 600);
                  } catch (err) {
                           console.error('Config fetch failed:', err);
                  }
         };

         useEffect(() => {
                  fetchConfig();
                  socket.on('connect', () => setConnected(true));
                  socket.on('disconnect', () => setConnected(false));
                  socket.on('configUpdated', (data) => {
                           if (
                                    (data.clientId === CLIENT_ID || data.clientId === 'global') &&
                                    (data.environment === ENVIRONMENT || data.environment === 'global')
                           ) fetchConfig();
                  });
                  return () => { socket.off('configUpdated'); socket.off('connect'); socket.off('disconnect'); };
         }, []);

         const t = themes[config?.theme] || themes.dark;

         if (!config) {
                  return (
                           <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ color: '#94a3b8', fontSize: 18 }}>Loading client page…</p>
                           </div>
                  );
         }

         // Maintenance overlay
         if (config.maintenanceMode) {
                  return (
                           <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24, textAlign: 'center', padding: 32 }}>
                                    <Wrench size={64} color="#f59e0b" />
                                    <h1 style={{ color: '#f1f5f9', fontSize: 36, fontWeight: 800 }}>{config.companyName || 'We'}&apos;re Under Maintenance</h1>
                                    <p style={{ color: '#94a3b8', fontSize: 18 }}>We&apos;ll be back shortly. Sorry for the inconvenience!</p>
                                    <div style={{ padding: '6px 16px', background: '#1e293b', borderRadius: 999, color: '#fcd34d', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                                             <AlertTriangle size={14} /> Maintenance Mode — enabled from admin portal
                                    </div>
                           </div>
                  );
         }

         return (
                  <div style={{ background: t.bg, color: t.text, minHeight: '100vh', fontFamily: "'Inter', sans-serif", transition: 'all 0.5s ease' }}>
                           <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />

                           {/* Announcement Banner */}
                           {announcement && (
                                    <div style={{ background: t.primary, color: t.btnText, padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, fontWeight: 600 }}>
                                             <span>📢 {announcement}</span>
                                             <button onClick={() => setAnnouncement('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.btnText }}>
                                                      <X size={16} />
                                             </button>
                                    </div>
                           )}

                           {/* Navbar */}
                           <nav style={{ borderBottom: `1px solid ${t.border}`, padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 100, background: t.bg + 'ee' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                             <div style={{ width: 32, height: 32, borderRadius: 8, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: t.btnText }}>
                                                      {(config.companyName || 'C')[0]}
                                             </div>
                                             <span style={{ fontWeight: 700, fontSize: 18 }}>{config.companyName || 'Company'}</span>
                                             {config.featureFlags?.newUI && (
                                                      <span style={{ fontSize: 10, padding: '2px 8px', background: t.primary + '33', color: t.primaryText, borderRadius: 999, fontWeight: 700 }}>NEW</span>
                                             )}
                                    </div>
                                    <div style={{ display: 'flex', gap: 32, fontSize: 14, color: t.sub }}>
                                             {['Features', config.showPricing && 'Pricing', config.showContactForm && 'Contact'].filter(Boolean).map(link => (
                                                      <a key={link} href={`#${link.toLowerCase()}`} style={{ color: t.sub, textDecoration: 'none', transition: 'color 0.2s' }}
                                                               onMouseEnter={e => e.target.style.color = t.primaryText}
                                                               onMouseLeave={e => e.target.style.color = t.sub}>
                                                               {link}
                                                      </a>
                                             ))}
                                    </div>
                                    {/* Live indicator */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: connected ? '#4ade80' : '#f87171', padding: '4px 12px', border: `1px solid ${connected ? '#4ade8044' : '#f8717144'}`, borderRadius: 999 }}>
                                             {connected ? <Wifi size={12} /> : <WifiOff size={12} />} {connected ? 'Live' : 'Offline'}
                                    </div>
                           </nav>

                           {/* Hero */}
                           <section style={{ padding: '100px 48px 80px', textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
                                    <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: t.primary + '22', color: t.primaryText, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
                                             ⚡ Config-powered landing page
                                    </div>
                                    <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20, transition: 'all 0.4s' }}>
                                             {config.companyName || 'Your Company'} — <br />
                                             <span style={{ color: t.primaryText }}>{config.tagline || 'Building something great'}</span>
                                    </h1>
                                    <p style={{ color: t.sub, fontSize: 18, marginBottom: 36, lineHeight: 1.7 }}>
                                             This entire page is powered by your config. Change the theme, text, or toggle sections from the admin portal — it updates here instantly.
                                    </p>
                                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                                             <button style={{ padding: '14px 32px', background: t.primary, color: t.btnText, border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity 0.2s' }}
                                                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                                      {config.heroButtonText || 'Get Started'} <ArrowRight size={18} />
                                             </button>
                                             <button style={{ padding: '14px 32px', background: 'transparent', color: t.text, border: `1px solid ${t.border}`, borderRadius: 10, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                                                      Learn More
                                             </button>
                                    </div>
                           </section>

                           {/* Features */}
                           <section id="features" style={{ padding: '60px 48px', maxWidth: 1100, margin: '0 auto' }}>
                                    <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 48 }}>Why Choose Us</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                                             {features.map((f, i) => (
                                                      <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 32, transition: 'transform 0.2s, box-shadow 0.2s' }}
                                                               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${t.primary}22`; }}
                                                               onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                                                               <div style={{ color: t.primaryText, marginBottom: 16 }}>{f.icon}</div>
                                                               <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                                                               <p style={{ color: t.sub, lineHeight: 1.6 }}>{f.desc}</p>
                                                      </div>
                                             ))}
                                    </div>
                           </section>

                           {/* Pricing — config-controlled */}
                           {config.showPricing && (
                                    <section id="pricing" style={{ padding: '60px 48px', maxWidth: 1100, margin: '0 auto' }}>
                                             <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Pricing</h2>
                                             <p style={{ textAlign: 'center', color: t.sub, marginBottom: 48 }}>Simple, transparent pricing</p>
                                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                                                      {pricingPlans.map((plan, i) => (
                                                               <div key={i} style={{ background: i === 1 ? t.primary : t.card, border: `1px solid ${i === 1 ? t.primary : t.border}`, borderRadius: 16, padding: 32 }}>
                                                                        <h3 style={{ fontSize: 20, fontWeight: 700, color: i === 1 ? t.btnText : t.text }}>{plan.name}</h3>
                                                                        <div style={{ fontSize: 36, fontWeight: 800, margin: '12px 0', color: i === 1 ? t.btnText : t.primaryText }}>{plan.price}</div>
                                                                        <p style={{ color: i === 1 ? t.btnText + 'bb' : t.sub, marginBottom: 24, fontSize: 14 }}>{plan.desc}</p>
                                                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                                                 {plan.features.map((feat, j) => (
                                                                                          <li key={j} style={{ padding: '6px 0', color: i === 1 ? t.btnText : t.sub, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                                                   <Star size={12} /> {feat}
                                                                                          </li>
                                                                                 ))}
                                                                        </ul>
                                                               </div>
                                                      ))}
                                             </div>
                                    </section>
                           )}

                           {/* Contact — config-controlled */}
                           {config.showContactForm && (
                                    <section id="contact" style={{ padding: '60px 48px', maxWidth: 600, margin: '0 auto' }}>
                                             <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Get in Touch</h2>
                                             <p style={{ textAlign: 'center', color: t.sub, marginBottom: 40 }}>We&apos;d love to hear from you</p>
                                             <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: 36 }}>
                                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                                               {['Your Name', 'Your Email', 'Your Message'].map((ph, i) => (
                                                                        i < 2
                                                                                 ? <input key={ph} placeholder={ph} style={{ padding: '12px 16px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontSize: 14, outline: 'none', fontFamily: 'inherit' }} />
                                                                                 : <textarea key={ph} placeholder={ph} rows={4} style={{ padding: '12px 16px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text, fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit' }} />
                                                               ))}
                                                               <button style={{ padding: '12px', background: t.primary, color: t.btnText, border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                                                                        Send Message
                                                               </button>
                                                      </div>
                                                      <div style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
                                                               {[{ icon: <Mail size={14} />, text: 'hello@clienta.com' }, { icon: <Phone size={14} />, text: '+1 234 567 8900' }, { icon: <MapPin size={14} />, text: 'New York, USA' }].map((c, i) => (
                                                                        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: t.sub, fontSize: 13 }}>{c.icon}{c.text}</span>
                                                               ))}
                                                      </div>
                                             </div>
                                    </section>
                           )}

                           {/* Footer */}
                           <footer style={{ borderTop: `1px solid ${t.border}`, padding: '24px 48px', textAlign: 'center', color: t.sub, fontSize: 13, marginTop: 40 }}>
                                    {config.footerText || `© 2026 ${config.companyName || 'Company'}. All rights reserved.`}
                                    <div style={{ marginTop: 8, fontSize: 11, color: t.sub + '88' }}>
                                             Powered by Dynamic Config System • Theme: <strong>{config.theme}</strong>
                                    </div>
                           </footer>
                  </div>
         );
};

export default ClientLanding;
