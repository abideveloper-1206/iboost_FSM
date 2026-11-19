import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  Activity, AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight,
  Award, Battery, BatteryCharging, Bell, Blocks, Bluetooth, Camera, Check,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, CircleCheck,
  CircleHelp, ClipboardCheck, ClipboardList, Clock, Clock3, CreditCard,
  DollarSign, Download, Eye, FileCheck, FileSignature, FileText, Filter,
  Fuel, Gauge, HelpCircle, Info, Layers, LayoutDashboard, Map, MapPin,
  Menu, MessageSquare, Mic, MicOff, MoreHorizontal, Navigation, Navigation2,
  Package, Phone, PhoneCall, Play, Plus, QrCode, Radio, RefreshCw,
  RotateCcw, Scan, Search, Send, Settings, Shield, ShieldAlert,
  ShieldCheck, Smartphone, Sparkles, Star, Tag, Thermometer, Timer,
  Trash2, Truck, UploadCloud, User, UserCheck, UserRound, Volume2,
  Wifi, WifiOff, Wrench, X, Zap, ChevronUp, CheckCheck
} from 'lucide-react';

// Technician roster for quick switching
const techRoster = [
  { id: 'TECH-01', name: 'Alex Morgan', trade: 'HVAC & Electrical', truck: 'Truck 01 (North)', avatar: 'AM', phone: '(512) 555-0199', license: 'TACLB-19042A · EPA Universal' },
  { id: 'TECH-02', name: 'Jordan Lee', trade: 'Plumbing & Gas', truck: 'Truck 02 (West)', avatar: 'JL', phone: '(512) 555-0182', license: 'MPL-41098 (Master Plumber)' },
  { id: 'TECH-03', name: 'Taylor Brooks', trade: 'Backflow Testing', truck: 'Truck 03 (East)', avatar: 'TB', phone: '(512) 555-0174', license: 'BPAT-88219 (TCEQ Certified)' },
  { id: 'TECH-04', name: 'Marcus Vance', trade: 'Septic & Environmental', truck: 'Truck 04 (South Pumper)', avatar: 'MV', phone: '(512) 555-0163', license: 'TCEQ OSSF II · Manifest #882' }
];

// Truck stock inventory for quick parts picker
const initialTruckParts = [
  { id: 'PRT-1', code: 'CAP-45', name: 'Dual Run Capacitor 45/5 MFD 440V', trade: 'HVAC', truckQty: 6, price: 48.0, category: 'Electrical' },
  { id: 'PRT-2', code: 'FLT-2025', name: 'Air Filter 20x25x4 MERV 11', trade: 'HVAC', truckQty: 8, price: 34.0, category: 'Filters' },
  { id: 'PRT-3', code: 'CON-24', name: 'Single Pole Contactor 24V 30A', trade: 'HVAC', truckQty: 4, price: 52.0, category: 'Electrical' },
  { id: 'PRT-4', code: 'BKF-KIT', name: 'RPZ 1" Rubber Rebuild Kit', trade: 'Backflow', truckQty: 3, price: 85.0, category: 'Rebuild Kits' },
  { id: 'PRT-5', code: 'PVC-TRAP', name: '3/4" Schedule 40 Condensate P-Trap', trade: 'Plumbing', truckQty: 10, price: 16.5, category: 'Fittings' },
  { id: 'PRT-6', code: 'GAS-410', name: 'Puron R-410A Virgin Refrigerant (1 lb)', trade: 'HVAC', truckQty: 18, price: 42.0, category: 'Refrigerants' },
  { id: 'PRT-7', code: 'PMP-FLOAT', name: 'Sump / Septic Mechanical Float Switch', trade: 'Septic', truckQty: 2, price: 79.0, category: 'Pumps' }
];

// Initial mock chat messages
const initialChatMessages = [
  { id: 'msg-1', sender: 'Dispatch (Karen)', time: '8:02 AM', text: 'Alex, customer Sarah Mitchell called to say the side gate code is #4821.', isDispatch: true },
  { id: 'msg-2', sender: 'Alex Morgan', time: '8:05 AM', text: 'Got it, thanks Karen! Just finishing up pre-trip truck check.', isDispatch: false },
  { id: 'msg-3', sender: 'Jordan Lee (Truck 02)', time: '8:30 AM', text: 'Hey Alex, do you have an extra 45/5 capacitor if I need one later in Cedar Park?', isDispatch: true },
  { id: 'msg-4', sender: 'Alex Morgan', time: '8:32 AM', text: 'Yeah Jordan, I have 6 on Truck 01. Ping me if you need one.', isDispatch: false }
];

export default function TechnicianApp({ jobs: propJobs = [] }) {
  // Device Preview Frame State
  const [deviceMode, setDeviceMode] = useState('phone'); // 'phone' | 'wide' | 'fullscreen'
  const [activeTech, setActiveTech] = useState(techRoster[0]);

  // App Navigation State
  const [screen, setScreen] = useState('Today'); // 'Today' | 'Jobs' | 'Job' | 'Time' | 'Messages' | 'TruckStock' | 'More'
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobFilter, setJobFilter] = useState('All');
  const [jobTradeFilter, setJobTradeFilter] = useState('All');
  const [jobSearch, setJobSearch] = useState('');

  // Shift & Clock Tracker State
  const [shiftRunning, setShiftRunning] = useState(true);
  const [shiftSeconds, setShiftSeconds] = useState(9840); // 2h 44m initial
  const [onBreak, setOnBreak] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Offline Sync State (#76)
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState(2);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState('');

  // Interactive Modals State
  const [showNavMap, setShowNavMap] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showOcrScanner, setShowOcrScanner] = useState(false);
  const [showPartsPicker, setShowPartsPicker] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
  const [showOnMyWayModal, setShowOnMyWayModal] = useState(false);
  const [showAiBrief, setShowAiBrief] = useState(false);

  // Active Job Working State
  const [jobStage, setJobStage] = useState('In progress'); // 'En route' | 'Arrived' | 'In progress' | 'Completed'
  const [jobTimerRunning, setJobTimerRunning] = useState(true);
  const [jobTimerSeconds, setJobTimerSeconds] = useState(2850); // 47m 30s
  const [jobChecklist, setJobChecklist] = useState({
    safetyCheck: true,
    diagnosed: true,
    customerApproved: true,
    testedOperational: false,
    cleanedWorkArea: false
  });

  // Trade Specific Form Inputs
  const [hvacDeltaT, setHvacDeltaT] = useState({ returnTemp: 74, supplyTemp: 56 });
  const [hvacCapacitor, setHvacCapacitor] = useState({ rated: 45, actual: 41 });
  const [backflowReadings, setBackflowReadings] = useState({ cv1: 6.8, reliefValve: 2.4, cv2: 2.2 });
  const [septicPumping, setSepticPumping] = useState({ gallons: 1000, lidDepth: 18, manifestId: 'MNF-2026-991' });

  // Job Work Order Items, Photos, and Signatures
  const [usedParts, setUsedParts] = useState([
    { id: 'PRT-1', code: 'CAP-45', name: 'Dual Run Capacitor 45/5 MFD', qty: 1, price: 48.0 }
  ]);
  const [truckInventory, setTruckInventory] = useState(initialTruckParts);
  const [jobPhotos, setJobPhotos] = useState([
    { id: 'p1', tag: 'Before', label: 'Restricted Air Filter', time: '8:14 AM', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
    { id: 'p2', tag: 'Defect', label: 'Bulging Run Capacitor', time: '8:22 AM', url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80' }
  ]);
  const [workNotes, setWorkNotes] = useState('Inspected Carrier central split system. Outdoor unit capacitor was bulging and reading 41 MFD (below 45 MFD specification). Installed replacement capacitor from truck stock. Cleaned outdoor coil and verified 18°F Delta-T split across evaporator coil.');
  const [customerSignature, setCustomerSignature] = useState(null);
  const [paymentCollected, setPaymentCollected] = useState(false);
  const [paidMethod, setPaidMethod] = useState('');

  // Chat Feed State
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [newChatText, setNewChatText] = useState('');

  // Signature Canvas Ref
  const sigCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Time & Timer Effects
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (shiftRunning && !onBreak) {
        setShiftSeconds(s => s + 1);
      }
      if (jobTimerRunning && screen === 'Job' && jobStage === 'In progress') {
        setJobTimerSeconds(s => s + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [shiftRunning, onBreak, jobTimerRunning, screen, jobStage]);

  const notify = text => {
    setToast(text);
    setTimeout(() => setToast(''), 2600);
  };

  // Format seconds to HH:MM:SS
  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs > 0 ? hrs + 'h ' : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Job List
  const activeJob = selectedJob || propJobs[0] || {
    id: 'JB-2048',
    customer: 'Sarah Mitchell',
    type: 'AC Seasonal Tune-up',
    trade: 'HVAC',
    time: '8:00 AM',
    duration: '2h',
    address: '1248 Oakridge Lane, North Austin, TX 78758',
    status: 'In progress',
    amount: 189.0,
    equipmentRef: 'Carrier Infinity 16 SEER (EQ-HVAC-101)'
  };

  // Sync jobs filter
  const filteredJobs = useMemo(() => {
    return propJobs.filter(j => {
      const matchesSearch = `${j.id} ${j.customer} ${j.type} ${j.address}`.toLowerCase().includes(jobSearch.toLowerCase());
      const matchesFilter = jobFilter === 'All' || (jobFilter === 'Active' ? ['In progress', 'En route'].includes(j.status) : j.status === jobFilter);
      const matchesTrade = jobTradeFilter === 'All' || j.trade === jobTradeFilter;
      return matchesSearch && matchesFilter && matchesTrade;
    });
  }, [propJobs, jobSearch, jobFilter, jobTradeFilter]);

  // Sync Now action
  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setOfflineQueue(0);
      setIsOffline(false);
      notify('All local changes synced with dispatch cloud');
    }, 1200);
  };

  // Add Part to Job
  const handleAddPartToJob = (part) => {
    setUsedParts(prev => {
      const existing = prev.find(p => p.id === part.id);
      if (existing) {
        return prev.map(p => p.id === part.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...part, qty: 1 }];
    });
    // Deduct from truck
    setTruckInventory(prev => prev.map(p => p.id === part.id ? { ...p, truckQty: Math.max(0, p.truckQty - 1) } : p));
    setShowPartsPicker(false);
    notify(`Added ${part.name} to job. Deducted 1 from Truck 01`);
  };

  // Calculate Job Total
  const jobTotalAmount = useMemo(() => {
    const base = Number(activeJob.amount || 189);
    const partsSum = usedParts.reduce((acc, p) => acc + (p.price * p.qty), 0);
    return base + partsSum;
  }, [activeJob.amount, usedParts]);

  // Handle Signature Drawing
  const startDrawing = (e) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const drawSignature = (e) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCustomerSignature(null);
    }
  };

  const saveSignature = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      setCustomerSignature(canvas.toDataURL());
      setShowSignaturePad(false);
      notify('Customer signature captured with GPS timestamp');
    }
  };

  // Send Chat message
  const handleSendChat = () => {
    if (!newChatText.trim()) return;
    const msg = {
      id: `msg-${Date.now()}`,
      sender: activeTech.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newChatText,
      isDispatch: false
    };
    setChatMessages(prev => [...prev, msg]);
    setNewChatText('');
    notify('Message sent to dispatch');
  };

  // Quick Chat canned reply
  const sendQuickReply = (text) => {
    const msg = {
      id: `msg-${Date.now()}`,
      sender: activeTech.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      isDispatch: false
    };
    setChatMessages(prev => [...prev, msg]);
    notify(`Sent: "${text}"`);
  };

  return (
    <div className={`tech-page-container device-mode-${deviceMode}`}>
      {/* Top Demo Bar / Controls for Presentation */}
      <aside className="tech-demo-topbar">
        <div className="tech-demo-left">
          <div className="tech-logo-badge">
            <Smartphone size={16} />
            <span>iBoost Mobile Tech App</span>
          </div>
          <span className="tech-route-tag">Route: <strong>/mobile</strong></span>
          <div className="tech-profile-dropdown">
            <span className="tech-label-muted">Active Tech:</span>
            <div className="tech-user-select-wrap">
              {techRoster.map(t => (
                <button 
                  key={t.id}
                  className={`tech-user-pill-btn ${activeTech.id === t.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTech(t);
                    if (t.trade.includes('HVAC')) {
                      setJobTradeFilter('All');
                      const j = propJobs.find(x => x.trade === 'HVAC');
                      if (j) setSelectedJob(j);
                    } else if (t.trade.includes('Plumbing')) {
                      const j = propJobs.find(x => x.trade === 'Plumbing');
                      if (j) setSelectedJob(j);
                    } else if (t.trade.includes('Backflow')) {
                      const j = propJobs.find(x => x.trade === 'Backflow');
                      if (j) setSelectedJob(j);
                    } else if (t.trade.includes('Septic')) {
                      const j = propJobs.find(x => x.trade === 'Septic');
                      if (j) setSelectedJob(j);
                    }
                    notify(`Switched to ${t.name} (${t.trade})`);
                  }}
                  title={`${t.name} - ${t.trade}`}
                >
                  <span className="tech-avatar-mini">{t.avatar}</span>
                  <span>{t.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="tech-demo-right">
          <div className="tech-view-modes">
            <span className="tech-label-muted">Preview Frame:</span>
            <button 
              className={`mode-btn ${deviceMode === 'phone' ? 'active' : ''}`}
              onClick={() => setDeviceMode('phone')}
              title="Standard iPhone View (390px)"
            >
              <Smartphone size={14} /> Phone (390px)
            </button>
            <button 
              className={`mode-btn ${deviceMode === 'wide' ? 'active' : ''}`}
              onClick={() => setDeviceMode('wide')}
              title="Wide / Tablet View (520px)"
            >
              <Layers size={14} /> Tablet (520px)
            </button>
            <button 
              className={`mode-btn ${deviceMode === 'fullscreen' ? 'active' : ''}`}
              onClick={() => setDeviceMode('fullscreen')}
              title="Full Screen View"
            >
              <MaximizeMobileIcon /> Fullscreen
            </button>
          </div>

          <a href="/" className="tech-back-portal-link" title="Return to Desktop Tenant Panel">
            <LayoutDashboard size={14} /> Desktop Portal ↗
          </a>
        </div>
      </aside>

      {/* Mobile Device Frame Shell */}
      <div className="tech-shell-wrapper">
        <main className="tech-mobile-device">
          {/* Phone Top Notch / Status Bar */}
          <header className="mobile-status-bar">
            <span className="status-time">{currentTimeStr || '10:42 AM'}</span>
            <div className="mobile-dynamic-island">
              {jobStage === 'In progress' && (
                <span className="island-job-pulse">
                  <span className="pulse-dot" /> On Job: {activeJob.id}
                </span>
              )}
            </div>
            <div className="status-icons">
              <span className="signal-bars">
                <i/><i/><i/><i/>
              </span>
              <Wifi size={13} className={isOffline ? 'wifi-off-icon' : ''} />
              <BatteryCharging size={14} />
            </div>
          </header>

          {/* Mobile App Bar Header */}
          <div className="mobile-app-header">
            {screen !== 'Today' ? (
              <button className="header-icon-btn back-btn" onClick={() => setScreen('Today')}>
                <ArrowLeft size={19} />
              </button>
            ) : (
              <div className="header-logo-icon">
                <Wrench size={18} />
              </div>
            )}

            <div className="header-title-block">
              <strong>
                {screen === 'Today' ? `Hi, ${activeTech.name.split(' ')[0]}` :
                 screen === 'Job' ? `${activeJob.customer}` :
                 screen === 'Jobs' ? 'Assigned Jobs' :
                 screen === 'Time' ? 'Time & Timesheet' :
                 screen === 'Messages' ? 'Dispatch Chat' :
                 screen === 'TruckStock' ? 'Truck 01 Inventory' : 'Field Tools'}
              </strong>
              <small>
                {screen === 'Today' ? `${activeTech.truck} · Online` :
                 screen === 'Job' ? `${activeJob.id} · ${activeJob.trade}` :
                 activeTech.license}
              </small>
            </div>

            <div className="header-actions">
              {/* Offline Toggle Badge (#76) */}
              <button 
                className={`offline-toggle-badge ${isOffline ? 'is-offline' : 'is-online'}`}
                onClick={() => {
                  setIsOffline(!isOffline);
                  notify(!isOffline ? 'Offline mode enabled (Local SQLite active)' : 'Connected to live dispatch');
                }}
                title={isOffline ? 'Offline Mode active' : 'Connected'}
              >
                {isOffline ? <WifiOff size={13}/> : <Wifi size={13}/>}
                <span>{isOffline ? 'Offline' : 'Online'}</span>
              </button>

              <button className="header-icon-btn" onClick={() => notify('No critical dispatch alerts')}>
                <Bell size={18} />
              </button>
            </div>
          </div>

          {/* Sync status alert banner if offline or pending queue */}
          {(isOffline || offlineQueue > 0) && (
            <div className={`mobile-sync-strip ${isOffline ? 'offline' : 'synced'}`}>
              <div className="sync-strip-info">
                {isOffline ? <AlertTriangle size={15}/> : <CheckCircle2 size={15}/>}
                <span>
                  <strong>{isOffline ? 'Working in Offline Mode' : 'Cloud Sync Complete'}</strong>
                  <small>{offlineQueue} updates queued locally in SQLite store</small>
                </span>
              </div>
              <button className="sync-action-btn" onClick={handleSyncNow} disabled={isSyncing}>
                <RefreshCw size={12} className={isSyncing ? 'spin-anim' : ''} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          )}

          {/* MAIN SCROLLABLE MOBILE CONTENT AREA */}
          <div className="mobile-scrollable-content">

            {/* SCREEN 1: TODAY (SCHEDULE & ROUTE) */}
            {screen === 'Today' && (
              <div className="mobile-view-today">
                {/* Shift Clock Card (#103) */}
                <div className="tech-shift-box">
                  <div className="shift-box-header">
                    <div className="shift-label-wrap">
                      <Clock3 size={15} />
                      <span>CURRENT SHIFT</span>
                    </div>
                    <span className={`shift-status-pill ${onBreak ? 'on-break' : shiftRunning ? 'active' : 'paused'}`}>
                      <span className="live-dot" /> {onBreak ? 'On Lunch Break' : shiftRunning ? 'Clocked In' : 'Shift Paused'}
                    </span>
                  </div>

                  <div className="shift-timer-display">
                    <h2>{formatTime(shiftSeconds)}</h2>
                    <span className="shift-geo-tag">
                      <MapPin size={11} /> GPS Geofence: North Austin Zone
                    </span>
                  </div>

                  <div className="shift-meter-row">
                    <div className="meter-label">
                      <span>Daily Progress</span>
                      <strong>2 of 4 visits done (50%)</strong>
                    </div>
                    <div className="meter-track">
                      <div className="meter-fill" style={{ width: '50%' }} />
                    </div>
                  </div>

                  <div className="shift-button-group">
                    <button 
                      className={`shift-action-btn ${shiftRunning ? 'btn-pause' : 'btn-start'}`}
                      onClick={() => {
                        setShiftRunning(!shiftRunning);
                        notify(shiftRunning ? 'Shift paused' : 'Shift resumed');
                      }}
                    >
                      <Timer size={14} /> {shiftRunning ? 'Pause Shift' : 'Clock In'}
                    </button>
                    <button 
                      className="shift-action-btn btn-break"
                      onClick={() => {
                        setOnBreak(!onBreak);
                        notify(onBreak ? 'Break ended. Clock running.' : '30-minute lunch break recorded');
                      }}
                    >
                      <Fuel size={14} /> {onBreak ? 'End Break' : 'Take Break'}
                    </button>
                  </div>
                </div>

                {/* Today's Route Overview (#20) */}
                <div className="route-overview-card">
                  <div className="route-info-left">
                    <Navigation size={18} className="route-icon" />
                    <div>
                      <strong>Today's Optimized Route (#20)</strong>
                      <small>4 stops · 18.2 miles · North Austin</small>
                    </div>
                  </div>
                  <button className="route-map-btn" onClick={() => setShowNavMap(true)}>
                    <Map size={14} /> Live Map <ArrowRight size={13} />
                  </button>
                </div>

                {/* AI Daily Pre-Job Briefing (#15, #18) */}
                <div className="ai-brief-card" onClick={() => setShowAiBrief(true)}>
                  <div className="ai-brief-badge">
                    <Sparkles size={13} />
                    <span>AI MORNING BRIEF (#15)</span>
                  </div>
                  <p>
                    Clear weather (78°F). Carrier recall notice on Model 24ACC series for capacitor bulging. Sarah Mitchell (#JB-2048) is VIP Gold member.
                  </p>
                  <span className="ai-brief-tap">Tap for equipment history & safety tips <ChevronRight size={13}/></span>
                </div>

                {/* Timeline of Visits */}
                <div className="section-title-strip">
                  <h3>Today's Visits ({propJobs.slice(0, 4).length})</h3>
                  <span className="route-date">Tuesday, Nov 19</span>
                </div>

                <div className="mobile-job-timeline">
                  {propJobs.slice(0, 4).map((job, idx) => (
                    <article 
                      key={job.id} 
                      className={`timeline-job-card ${job.id === activeJob.id ? 'is-focused' : ''} ${job.status === 'Completed' ? 'is-done' : ''}`}
                    >
                      <div className="timeline-spine">
                        <span className={`spine-bullet ${job.status === 'In progress' ? 'pulsing' : job.status === 'Completed' ? 'done' : ''}`}>
                          {job.status === 'Completed' ? <Check size={11}/> : idx + 1}
                        </span>
                        {idx < 3 && <div className="spine-connector" />}
                      </div>

                      <div className="timeline-card-content">
                        <div className="card-top-row">
                          <span className="card-time-slot">{job.time} ({job.duration || '2h'})</span>
                          <span className={`trade-chip trade-${job.trade?.toLowerCase()}`}>
                            {job.trade}
                          </span>
                        </div>

                        <h4 onClick={() => { setSelectedJob(job); setScreen('Job'); }}>
                          {job.type}
                        </h4>
                        <span className="card-cust-name">{job.customer}</span>

                        <div className="card-address-row">
                          <MapPin size={12} />
                          <span>{job.address?.split(',')[0]}</span>
                        </div>

                        <div className="card-quick-actions">
                          <button 
                            className="quick-act-btn nav-btn"
                            onClick={() => { setSelectedJob(job); setShowNavMap(true); }}
                            title="Turn-by-turn Navigation"
                          >
                            <Navigation size={13}/> Nav
                          </button>
                          <button 
                            className="quick-act-btn sms-btn"
                            onClick={() => { setSelectedJob(job); setShowOnMyWayModal(true); }}
                            title="Send On My Way SMS"
                          >
                            <Send size={12}/> On-My-Way
                          </button>
                          <button 
                            className="quick-act-btn open-btn"
                            onClick={() => { setSelectedJob(job); setScreen('Job'); }}
                          >
                            Open Visit <ArrowRight size={13}/>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* End of Shift Review Button */}
                <button 
                  className="end-shift-btn" 
                  onClick={() => notify('Daily technician log filed to dispatch office (#103)')}
                >
                  <ClipboardCheck size={16} /> Complete & Close Daily Shift
                </button>
              </div>
            )}

            {/* SCREEN 2: ALL JOBS LIST */}
            {screen === 'Jobs' && (
              <div className="mobile-view-jobs">
                {/* Search Bar */}
                <div className="mobile-search-bar">
                  <Search size={15} />
                  <input 
                    placeholder="Search by customer, job ID, address..."
                    value={jobSearch}
                    onChange={e => setJobSearch(e.target.value)}
                  />
                  {jobSearch && <button onClick={() => setJobSearch('')}><X size={14}/></button>}
                </div>

                {/* Filter Chips */}
                <div className="mobile-filter-scroll">
                  {['All', 'Active', 'Scheduled', 'Completed'].map(f => (
                    <button 
                      key={f} 
                      className={`filter-chip ${jobFilter === f ? 'selected' : ''}`}
                      onClick={() => setJobFilter(f)}
                    >
                      {f}
                    </button>
                  ))}
                  <span className="filter-divider" />
                  {['All', 'HVAC', 'Plumbing', 'Backflow', 'Septic'].map(t => (
                    <button 
                      key={t} 
                      className={`filter-chip trade-chip-btn ${jobTradeFilter === t ? 'selected' : ''}`}
                      onClick={() => setJobTradeFilter(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Job Cards */}
                <div className="jobs-vertical-list">
                  {filteredJobs.map(job => (
                    <div 
                      key={job.id} 
                      className="job-item-card"
                      onClick={() => { setSelectedJob(job); setScreen('Job'); }}
                    >
                      <div className="job-item-header">
                        <span className="job-num">{job.id}</span>
                        <span className={`status-pill ${job.status === 'Completed' ? 'status-completed' : 'status-progress'}`}>
                          {job.status}
                        </span>
                      </div>

                      <div className="job-item-body">
                        <h4>{job.type}</h4>
                        <span className="job-item-cust">{job.customer}</span>
                        <p className="job-item-addr"><MapPin size={11} /> {job.address}</p>
                      </div>

                      <div className="job-item-footer">
                        <span className="job-item-time"><Clock size={11} /> {job.time}</span>
                        <span className="job-item-price">${Number(job.amount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 3: ACTIVE JOB WORKSPACE (THE COMPREHENSIVE FIELD TOOL) */}
            {screen === 'Job' && (
              <div className="mobile-view-active-job">
                {/* Active Job Hero Banner */}
                <div className="active-job-banner">
                  <div className="job-banner-top">
                    <span className="banner-job-id">{activeJob.id}</span>
                    <span className="banner-trade-tag">{activeJob.trade}</span>
                    <span className="banner-timer-badge">
                      <span className="live-dot" /> {formatTime(jobTimerSeconds)}
                    </span>
                  </div>

                  <h2>{activeJob.type}</h2>
                  <p className="banner-cust-name">{activeJob.customer}</p>

                  <div className="banner-address-row">
                    <MapPin size={14} />
                    <span>{activeJob.address}</span>
                  </div>

                  {/* 3 Main Action Pills: Call, Directions, On-My-Way */}
                  <div className="banner-action-pills">
                    <button className="pill-btn" onClick={() => notify(`Dialing ${activeJob.customer} at (512) 555-0184`)}>
                      <PhoneCall size={14} /> Call
                    </button>
                    <button className="pill-btn" onClick={() => setShowNavMap(true)}>
                      <Navigation size={14} /> Directions
                    </button>
                    <button className="pill-btn highlight" onClick={() => setShowOnMyWayModal(true)}>
                      <Send size={14} /> On-My-Way
                    </button>
                  </div>
                </div>

                {/* Job Lifecycle Stepper (#86) */}
                <div className="job-lifecycle-stepper">
                  <span className="stepper-title">JOB STAGES (#86)</span>
                  <div className="lifecycle-track">
                    {['En route', 'Arrived', 'In progress', 'Completed'].map((stage, sIdx) => {
                      const isPassed = ['En route', 'Arrived', 'In progress', 'Completed'].indexOf(jobStage) >= sIdx;
                      return (
                        <button 
                          key={stage} 
                          className={`stage-step ${jobStage === stage ? 'current' : isPassed ? 'done' : ''}`}
                          onClick={() => {
                            setJobStage(stage);
                            notify(`Job stage advanced to: ${stage}`);
                          }}
                        >
                          <span className="step-circle">{isPassed ? <Check size={11}/> : sIdx + 1}</span>
                          <span className="step-name">{stage}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Pre-Job Briefing (#15, #18) */}
                <div className="job-card-section ai-brief-widget" onClick={() => setShowAiBrief(true)}>
                  <div className="section-head-row">
                    <span className="section-badge-ai"><Sparkles size={12}/> AI PRE-JOB BRIEF (#15)</span>
                    <span className="tap-hint">Tap details ↗</span>
                  </div>
                  <p>
                    <strong>Installed Asset:</strong> Carrier Infinity Split (Installed 2021). Filter: 20x25x4. Customer has active VIP maintenance agreement.
                  </p>
                </div>

                {/* Multi-Trade Specific Interactive Form */}
                <div className="job-card-section trade-form-section">
                  <div className="section-head-row">
                    <h3>{activeJob.trade} Diagnostics & Test Form</h3>
                    <span className="form-req-badge">Required</span>
                  </div>

                  {/* 1. HVAC Specific Fields */}
                  {activeJob.trade === 'HVAC' && (
                    <div className="trade-fields-hvac">
                      <div className="calc-group">
                        <label className="field-label">
                          <span>Delta-T Air Temperature Split (°F)</span>
                          <small>Measures cooling efficiency across evaporator coil</small>
                        </label>
                        <div className="delta-inputs-grid">
                          <div className="delta-box">
                            <span>Return Air Temp</span>
                            <div className="input-unit">
                              <input 
                                type="number" 
                                value={hvacDeltaT.returnTemp} 
                                onChange={e => setHvacDeltaT({ ...hvacDeltaT, returnTemp: Number(e.target.value) })}
                              />
                              <small>°F</small>
                            </div>
                          </div>
                          <div className="delta-box">
                            <span>Supply Air Temp</span>
                            <div className="input-unit">
                              <input 
                                type="number" 
                                value={hvacDeltaT.supplyTemp} 
                                onChange={e => setHvacDeltaT({ ...hvacDeltaT, supplyTemp: Number(e.target.value) })}
                              />
                              <small>°F</small>
                            </div>
                          </div>
                        </div>

                        {/* Calculated Delta T Result */}
                        <div className="delta-result-bar">
                          <span>Calculated Split:</span>
                          <strong>{hvacDeltaT.returnTemp - hvacDeltaT.supplyTemp}°F</strong>
                          <span className="badge-pass">
                            {hvacDeltaT.returnTemp - hvacDeltaT.supplyTemp >= 16 && hvacDeltaT.returnTemp - hvacDeltaT.supplyTemp <= 22 ? '✅ Normal (16-22°F)' : '⚠️ Low Split - Check Charge'}
                          </span>
                        </div>
                      </div>

                      <div className="calc-group">
                        <label className="field-label">
                          <span>Dual Run Capacitor Test (MFD)</span>
                        </label>
                        <div className="delta-inputs-grid">
                          <div className="delta-box">
                            <span>Rated MFD</span>
                            <input 
                              type="number" 
                              value={hvacCapacitor.rated} 
                              onChange={e => setHvacCapacitor({ ...hvacCapacitor, rated: Number(e.target.value) })}
                            />
                          </div>
                          <div className="delta-box">
                            <span>Measured MFD</span>
                            <input 
                              type="number" 
                              value={hvacCapacitor.actual} 
                              onChange={e => setHvacCapacitor({ ...hvacCapacitor, actual: Number(e.target.value) })}
                            />
                          </div>
                        </div>
                        <div className="delta-result-bar">
                          <span>Condition:</span>
                          <strong>{((hvacCapacitor.actual / hvacCapacitor.rated) * 100).toFixed(0)}% Capacity</strong>
                          <span className={hvacCapacitor.actual < 42 ? 'badge-fail' : 'badge-pass'}>
                            {hvacCapacitor.actual < 42 ? '⚠️ Degraded (Replaced from stock)' : '✅ Optimal'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Backflow Specific Fields (#89, #90) */}
                  {activeJob.trade === 'Backflow' && (
                    <div className="trade-fields-backflow">
                      <div className="bpat-device-header">
                        <ShieldCheck size={16} />
                        <div>
                          <strong>RPZ Assembly #449102-B</strong>
                          <small>Wilkins 975XL2 1" · Test Kit Calibrated Oct 2026</small>
                        </div>
                      </div>

                      <div className="bpat-inputs-list">
                        <div className="bpat-row">
                          <div className="bpat-info">
                            <strong>Check Valve 1 (PSID)</strong>
                            <small>Minimum 5.0 psid</small>
                          </div>
                          <div className="bpat-val-input">
                            <input 
                              type="number" 
                              step="0.1" 
                              value={backflowReadings.cv1} 
                              onChange={e => setBackflowReadings({ ...backflowReadings, cv1: Number(e.target.value) })}
                            />
                            <span>psid</span>
                          </div>
                        </div>

                        <div className="bpat-row">
                          <div className="bpat-info">
                            <strong>Relief Valve Opening (PSID)</strong>
                            <small>Minimum 2.0 psid</small>
                          </div>
                          <div className="bpat-val-input">
                            <input 
                              type="number" 
                              step="0.1" 
                              value={backflowReadings.reliefValve} 
                              onChange={e => setBackflowReadings({ ...backflowReadings, reliefValve: Number(e.target.value) })}
                            />
                            <span>psid</span>
                          </div>
                        </div>

                        <div className="bpat-row">
                          <div className="bpat-info">
                            <strong>Check Valve 2 (PSID)</strong>
                            <small>Minimum 1.0 psid</small>
                          </div>
                          <div className="bpat-val-input">
                            <input 
                              type="number" 
                              step="0.1" 
                              value={backflowReadings.cv2} 
                              onChange={e => setBackflowReadings({ ...backflowReadings, cv2: Number(e.target.value) })}
                            />
                            <span>psid</span>
                          </div>
                        </div>
                      </div>

                      <div className="bpat-cert-result">
                        <CheckCircle2 size={18} className="pass-icon" />
                        <div>
                          <strong>ASSEMBLY TEST STATUS: PASS</strong>
                          <small>Complies with TCEQ & City of Austin cross-connection regulations.</small>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Septic Pumping Specific Fields (#92, #93) */}
                  {activeJob.trade === 'Septic' && (
                    <div className="trade-fields-septic">
                      <div className="septic-pumping-grid">
                        <div className="septic-box">
                          <span>Gallons Pumped</span>
                          <input 
                            type="number" 
                            value={septicPumping.gallons} 
                            onChange={e => setSepticPumping({ ...septicPumping, gallons: Number(e.target.value) })}
                          />
                          <small>Gal</small>
                        </div>
                        <div className="septic-box">
                          <span>Lid Depth Below Grade</span>
                          <input 
                            type="number" 
                            value={septicPumping.lidDepth} 
                            onChange={e => setSepticPumping({ ...septicPumping, lidDepth: Number(e.target.value) })}
                          />
                          <small>Inches</small>
                        </div>
                      </div>

                      <div className="manifest-strip">
                        <FileText size={15} />
                        <span>County Disposal Manifest: <strong>{septicPumping.manifestId}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Universal Checklist Items */}
                  <div className="universal-checklist">
                    <span className="check-subhead">Safety & Completion Checklist (#41)</span>
                    {[
                      ['safetyCheck', 'Lockout / Tagout power verified safe'],
                      ['diagnosed', 'Initial diagnosis verified with customer'],
                      ['customerApproved', 'Quote / Scope of repair approved'],
                      ['testedOperational', 'Post-service functional test complete'],
                      ['cleanedWorkArea', 'Work area cleaned and debris removed']
                    ].map(([key, label]) => (
                      <label key={key} className="check-row-label">
                        <input 
                          type="checkbox" 
                          checked={jobChecklist[key]} 
                          onChange={() => setJobChecklist({ ...jobChecklist, [key]: !jobChecklist[key] })}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Voice-to-Report & Equipment Scanner Bar (#5, #46) */}
                <div className="ai-tools-action-bar">
                  <button className="ai-tool-pill voice-pill" onClick={() => setShowVoiceRecorder(true)}>
                    <Mic size={16} />
                    <span>Voice-to-Report (#5)</span>
                  </button>
                  <button className="ai-tool-pill ocr-pill" onClick={() => setShowOcrScanner(true)}>
                    <Camera size={16} />
                    <span>OCR Nameplate Scan (#46)</span>
                  </button>
                </div>

                {/* Field Notes & Findings */}
                <div className="job-card-section">
                  <div className="section-head-row">
                    <h3>Service Findings & Work Summary (#5)</h3>
                    <button className="text-action-btn" onClick={() => setShowVoiceRecorder(true)}>
                      <Mic size={13} /> Dictate
                    </button>
                  </div>
                  <textarea 
                    className="mobile-textarea" 
                    rows={4}
                    value={workNotes}
                    onChange={e => setWorkNotes(e.target.value)}
                    placeholder="Describe diagnosis, repairs made, measurements, and customer recommendations..."
                  />
                </div>

                {/* Truck Parts Used (#49) */}
                <div className="job-card-section">
                  <div className="section-head-row">
                    <h3>Truck Parts Used on Job ({usedParts.length})</h3>
                    <button className="text-action-btn" onClick={() => setShowPartsPicker(true)}>
                      <Plus size={14} /> Add Part
                    </button>
                  </div>

                  {usedParts.length > 0 ? (
                    <div className="used-parts-list">
                      {usedParts.map(part => (
                        <div key={part.id} className="used-part-row">
                          <div className="part-info">
                            <strong>{part.name}</strong>
                            <small>SKU: {part.code} · Qty: {part.qty}</small>
                          </div>
                          <div className="part-cost">
                            <strong>${(part.price * part.qty).toFixed(2)}</strong>
                            <button 
                              className="remove-part-btn" 
                              onClick={() => {
                                setUsedParts(usedParts.filter(p => p.id !== part.id));
                                notify(`Removed ${part.name}`);
                              }}
                            >
                              <X size={13}/>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-subtext">No truck parts billed yet. Tap '+ Add Part' to log inventory.</p>
                  )}
                </div>

                {/* Before & After Job Photos (#43) */}
                <div className="job-card-section">
                  <div className="section-head-row">
                    <h3>Before / After Job Photos ({jobPhotos.length})</h3>
                    <button 
                      className="text-action-btn" 
                      onClick={() => {
                        const newP = {
                          id: `p-${Date.now()}`,
                          tag: 'After',
                          label: 'Cleaned Condenser Coil',
                          time: '9:05 AM',
                          url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80'
                        };
                        setJobPhotos([...jobPhotos, newP]);
                        notify('New photo added with GPS timestamp');
                      }}
                    >
                      <Camera size={14} /> Snap Photo
                    </button>
                  </div>

                  <div className="job-photos-grid">
                    {jobPhotos.map(photo => (
                      <div key={photo.id} className="photo-thumbnail-card">
                        <img src={photo.url} alt={photo.label} />
                        <span className={`photo-tag tag-${photo.tag.toLowerCase()}`}>{photo.tag}</span>
                        <div className="photo-meta">
                          <small>{photo.label}</small>
                          <small>{photo.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Signature & Sign-Off (#40) */}
                <div className="job-card-section">
                  <div className="section-head-row">
                    <h3>Customer Sign-Off (#40)</h3>
                    {customerSignature ? (
                      <span className="badge-pass">✅ Signed</span>
                    ) : (
                      <span className="badge-pending">Pending Signature</span>
                    )}
                  </div>

                  {customerSignature ? (
                    <div className="signature-preview-box">
                      <img src={customerSignature} alt="Customer Signature" />
                      <div className="sig-meta-strip">
                        <span>Signed by: <strong>{activeJob.customer}</strong></span>
                        <button className="text-action-btn" onClick={() => setShowSignaturePad(true)}>Re-sign</button>
                      </div>
                    </div>
                  ) : (
                    <button className="signature-trigger-btn" onClick={() => setShowSignaturePad(true)}>
                      <FileSignature size={18} />
                      <span>Capture Customer Digital Signature</span>
                    </button>
                  )}
                </div>

                {/* On-Site Payment Summary Bar (#56, #58) */}
                <div className="mobile-payment-summary-box">
                  <div className="pay-summary-left">
                    <span>TOTAL AMOUNT DUE</span>
                    <h3>${jobTotalAmount.toFixed(2)}</h3>
                    <small>{paymentCollected ? `Paid via ${paidMethod}` : 'Invoice ready for collection'}</small>
                  </div>
                  <button 
                    className={`collect-pay-btn ${paymentCollected ? 'btn-paid' : 'btn-collect'}`}
                    onClick={() => setShowPaymentDrawer(true)}
                  >
                    {paymentCollected ? <CheckCircle2 size={16}/> : <CreditCard size={16}/>}
                    {paymentCollected ? 'Payment Collected' : 'Collect Payment'}
                  </button>
                </div>

                {/* Complete Job Primary Action */}
                <button 
                  className="complete-job-cta-btn"
                  onClick={() => {
                    setJobStage('Completed');
                    notify(`Job ${activeJob.id} completed! Digital work report & invoice sent to ${activeJob.customer}`);
                    setScreen('Today');
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>Complete & Finalize Work Order</span>
                </button>
              </div>
            )}

            {/* SCREEN 4: TIME & TIMESHEET (#103) */}
            {screen === 'Time' && (
              <div className="mobile-view-time">
                <div className="timesheet-hero-card">
                  <span className="hero-eyebrow">PAYROLL TIMESHEET · THIS WEEK</span>
                  <div className="hero-hours-display">
                    <h2>34.5 <span>/ 40.0 hrs</span></h2>
                    <span className="overtime-badge">0.0 OT hrs</span>
                  </div>

                  <div className="meter-track">
                    <div className="meter-fill" style={{ width: '86%' }} />
                  </div>
                  <small className="meter-subtext">86% of weekly target reached</small>
                </div>

                <div className="time-log-group">
                  <span className="time-group-title">TODAY'S CLOCK ENTRIES (TUE, NOV 19)</span>

                  <div className="time-entry-card">
                    <div className="entry-icon"><Clock size={16}/></div>
                    <div className="entry-details">
                      <strong>Regular Shift Time</strong>
                      <small>7:30 AM - Current · GPS Verified</small>
                    </div>
                    <span className="entry-duration">{formatTime(shiftSeconds)}</span>
                  </div>

                  <div className="time-entry-card">
                    <div className="entry-icon"><Truck size={16}/></div>
                    <div className="entry-details">
                      <strong>Drive & Travel Time (#20)</strong>
                      <small>Round Rock ➔ North Austin (14.2 mi)</small>
                    </div>
                    <span className="entry-duration">42m</span>
                  </div>

                  <div className="time-entry-card">
                    <div className="entry-icon"><Wrench size={16}/></div>
                    <div className="entry-details">
                      <strong>On-Site Job Time (JB-2048)</strong>
                      <small>Sarah Mitchell AC Tune-up</small>
                    </div>
                    <span className="entry-duration">{formatTime(jobTimerSeconds)}</span>
                  </div>
                </div>

                <button 
                  className="submit-timesheet-btn" 
                  onClick={() => notify('Timesheet submitted to Northstar payroll office (#103)')}
                >
                  <CheckCheck size={16} /> Submit Timesheet for Approval
                </button>
              </div>
            )}

            {/* SCREEN 5: TEAM DISPATCH CHAT (#37, #38) */}
            {screen === 'Messages' && (
              <div className="mobile-view-chat">
                <div className="chat-dispatch-banner">
                  <ShieldCheck size={14} />
                  <span>Direct link with Dispatch & Crew. All messages logged to job record.</span>
                </div>

                <div className="chat-message-stream">
                  {chatMessages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`chat-bubble-wrap ${msg.isDispatch ? 'from-dispatch' : 'from-me'}`}
                    >
                      <div className="bubble-header">
                        <strong>{msg.sender}</strong>
                        <small>{msg.time}</small>
                      </div>
                      <div className="bubble-body">
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Canned Quick Reply Chips */}
                <div className="quick-replies-scroll">
                  {[
                    'On my way now',
                    'Gate code received',
                    'Capacitor replaced',
                    'Need extra parts from warehouse',
                    'Job complete, departing'
                  ].map(reply => (
                    <button 
                      key={reply} 
                      className="canned-reply-btn"
                      onClick={() => sendQuickReply(reply)}
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                {/* Chat Composer */}
                <div className="chat-composer-bar">
                  <input 
                    placeholder="Type message to dispatch..."
                    value={newChatText}
                    onChange={e => setNewChatText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  />
                  <button className="chat-send-btn" onClick={handleSendChat}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 6: TRUCK 01 STOCK INVENTORY (#49) */}
            {screen === 'TruckStock' && (
              <div className="mobile-view-truck-stock">
                <div className="truck-stock-header-card">
                  <Truck size={20} className="truck-hero-icon" />
                  <div>
                    <strong>{activeTech.truck} Allotment</strong>
                    <small>Assigned to {activeTech.name} · Central Warehouse Sync</small>
                  </div>
                </div>

                <div className="truck-inventory-list">
                  {truckInventory.map(part => (
                    <div key={part.id} className="truck-part-card">
                      <div className="truck-part-main">
                        <span className="part-trade-tag">{part.trade}</span>
                        <strong>{part.name}</strong>
                        <small>SKU: {part.code} · ${part.price.toFixed(2)} ea</small>
                      </div>

                      <div className="truck-qty-badge-group">
                        <span className={`truck-qty-pill ${part.truckQty <= 2 ? 'qty-low' : 'qty-ok'}`}>
                          {part.truckQty} on truck
                        </span>
                        <button 
                          className="quick-add-job-btn"
                          onClick={() => handleAddPartToJob(part)}
                          title="Add to current job"
                        >
                          <Plus size={13}/> Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  className="restock-request-btn"
                  onClick={() => notify('Central Warehouse Restock PO generated (#62)')}
                >
                  <Package size={15}/> Request Truck Restock from Warehouse
                </button>
              </div>
            )}

            {/* SCREEN 7: MORE & FIELD TOOLS */}
            {screen === 'More' && (
              <div className="mobile-view-more">
                <div className="more-profile-hero">
                  <div className="profile-avatar-large">{activeTech.avatar}</div>
                  <h3>{activeTech.name}</h3>
                  <p>{activeTech.trade} · {activeTech.truck}</p>
                  <span className="tech-cert-badge">{activeTech.license}</span>
                </div>

                <div className="more-tools-grid">
                  <button className="tool-tile" onClick={() => setScreen('TruckStock')}>
                    <Package size={20} />
                    <strong>Truck 01 Inventory</strong>
                    <small>Bin stock & par levels (#49)</small>
                  </button>

                  <button className="tool-tile" onClick={() => setShowAiBrief(true)}>
                    <Sparkles size={20} />
                    <strong>AI Field Intelligence</strong>
                    <small>Pre-job briefing & OCR (#15)</small>
                  </button>

                  <button className="tool-tile" onClick={() => setShowNavMap(true)}>
                    <Navigation size={20} />
                    <strong>GPS Route Map</strong>
                    <small>Turn-by-turn navigation (#20)</small>
                  </button>

                  <button className="tool-tile" onClick={() => setShowVoiceRecorder(true)}>
                    <Mic size={20} />
                    <strong>Voice Dictation</strong>
                    <small>Audio to service report (#5)</small>
                  </button>
                </div>

                <div className="more-settings-list">
                  <div className="settings-item-row" onClick={() => notify('Offline storage: 12.4 MB cached in SQLite')}>
                    <div className="item-label-group">
                      <WifiOff size={16} />
                      <div>
                        <strong>Offline Cache Storage</strong>
                        <small>12.4 MB SQLite cache · Auto sync on reconnect</small>
                      </div>
                    </div>
                    <ChevronRight size={16} />
                  </div>

                  <div className="settings-item-row" onClick={() => notify('Emergency Dispatch Hotline: (512) 555-0100 connected')}>
                    <div className="item-label-group">
                      <Phone size={16} />
                      <div>
                        <strong>Office Emergency Dispatch</strong>
                        <small>Direct phone connection to dispatch center</small>
                      </div>
                    </div>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* BOTTOM MOBILE APP TAB BAR */}
          <nav className="mobile-bottom-tabs">
            {[
              ['Today', ClipboardList, 'Today'],
              ['Jobs', Blocks, 'Jobs'],
              ['Time', Clock3, 'Time'],
              ['Messages', MessageSquare, 'Chat', chatMessages.length > 2 ? '2' : ''],
              ['TruckStock', Truck, 'Truck'],
              ['More', MoreHorizontal, 'More']
            ].map(([tabId, TabIcon, label, badge]) => (
              <button 
                key={tabId}
                className={`tab-btn ${screen === tabId ? 'active' : ''}`}
                onClick={() => setScreen(tabId)}
              >
                <div className="tab-icon-wrap">
                  <TabIcon size={19} />
                  {badge && <span className="tab-badge">{badge}</span>}
                </div>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Phone Bottom Home Indicator */}
          <div className="mobile-home-bar" />

          {/* ======================================================== */}
          {/* INTERACTIVE MODALS & DRAWERS (INSIDE MOBILE PHONE FRAME) */}
          {/* ======================================================== */}

      {/* 1. Turn-by-Turn GPS Map Navigation Modal (#20) */}
      {showNavMap && (
        <div className="mobile-modal-overlay" onClick={() => setShowNavMap(false)}>
          <div className="mobile-modal-sheet map-modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-handle" />
            <div className="modal-sheet-header">
              <div className="sheet-title-group">
                <Navigation size={18} className="sheet-icon" />
                <div>
                  <strong>Turn-by-Turn GPS Directions (#20)</strong>
                  <small>To {activeJob.customer} · {activeJob.address?.split(',')[0]}</small>
                </div>
              </div>
              <button className="sheet-close-btn" onClick={() => setShowNavMap(false)}><X size={17}/></button>
            </div>

            <div className="simulated-map-display">
              {/* Simulated SVG Street Map */}
              <svg className="map-svg-canvas" viewBox="0 0 360 220" preserveAspectRatio="none">
                <rect width="360" height="220" fill="#e9eff7" />
                {/* Secondary roads */}
                <path d="M0 60 Q120 70 360 40" stroke="#d5dfec" strokeWidth="12" fill="none" />
                <path d="M80 0 L100 220" stroke="#d5dfec" strokeWidth="10" fill="none" />
                <path d="M260 0 L240 220" stroke="#d5dfec" strokeWidth="10" fill="none" />
                <path d="M0 160 Q180 140 360 170" stroke="#d5dfec" strokeWidth="14" fill="none" />

                {/* Primary Route Line with Dash Animation */}
                <path 
                  d="M40 180 L140 160 L150 90 L270 70" 
                  stroke="#3b82f6" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  strokeDasharray="8 4" 
                  className="route-animated-path"
                  fill="none" 
                />

                {/* Tech Vehicle Pin */}
                <circle cx="40" cy="180" r="10" fill="#2563eb" />
                <circle cx="40" cy="180" r="16" fill="#3b82f6" opacity="0.3" className="pin-pulse" />
                <text x="32" y="184" fill="#fff" fontSize="10" fontWeight="bold">🚗</text>

                {/* Destination Pin */}
                <circle cx="270" cy="70" r="10" fill="#dc2626" />
                <text x="264" y="74" fill="#fff" fontSize="10" fontWeight="bold">📍</text>
              </svg>

              {/* Turn Direction Card Overlay */}
              <div className="map-turn-overlay">
                <div className="turn-arrow-badge">
                  <ArrowUpRight size={20} />
                </div>
                <div className="turn-instructions">
                  <strong>In 400 ft, turn right on Oakridge Lane</strong>
                  <small>Next: Arrive at destination on left</small>
                </div>
              </div>

              {/* Route Metric Bar */}
              <div className="map-metrics-bar">
                <div>
                  <span>ETA</span>
                  <strong>11 mins</strong>
                </div>
                <div>
                  <span>Distance</span>
                  <strong>4.2 miles</strong>
                </div>
                <div>
                  <span>Traffic</span>
                  <strong className="text-green">Light</strong>
                </div>
              </div>
            </div>

            <div className="map-modal-footer">
              <button 
                className="full-action-btn primary"
                onClick={() => {
                  setShowNavMap(false);
                  notify('Navigating with voice turn-by-turn guidance...');
                }}
              >
                <Navigation2 size={16} /> Open Native Google / Apple Maps
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Voice-to-Report Recording Modal (#5) */}
      {showVoiceRecorder && (
        <VoiceReportModal 
          onClose={() => setShowVoiceRecorder(false)}
          onApplySummary={text => {
            setWorkNotes(prev => prev + '\n\n' + text);
            setShowVoiceRecorder(false);
            notify('AI voice summary inserted into service report');
          }}
        />
      )}

      {/* 3. AI Nameplate OCR Camera Scanner Modal (#46) */}
      {showOcrScanner && (
        <OcrNameplateModal 
          onClose={() => setShowOcrScanner(false)}
          onApplyOcr={data => {
            notify(`OCR Identified: ${data.brand} ${data.model} (Serial: ${data.serial})`);
            setShowOcrScanner(false);
          }}
        />
      )}

      {/* 4. Truck Parts Picker Modal (#49) */}
      {showPartsPicker && (
        <div className="mobile-modal-overlay" onClick={() => setShowPartsPicker(false)}>
          <div className="mobile-modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-handle" />
            <div className="modal-sheet-header">
              <div className="sheet-title-group">
                <Package size={18} className="sheet-icon" />
                <div>
                  <strong>Truck 01 Inventory Picker (#49)</strong>
                  <small>Tap item to add to job and deduct from truck</small>
                </div>
              </div>
              <button className="sheet-close-btn" onClick={() => setShowPartsPicker(false)}><X size={17}/></button>
            </div>

            <div className="parts-picker-scroll">
              {truckInventory.map(part => (
                <div key={part.id} className="picker-part-card">
                  <div className="picker-part-info">
                    <span className="picker-trade-tag">{part.trade}</span>
                    <strong>{part.name}</strong>
                    <small>SKU: {part.code} · ${part.price.toFixed(2)}</small>
                  </div>
                  <div className="picker-action-side">
                    <span className="picker-qty-count">{part.truckQty} left</span>
                    <button 
                      className="picker-add-btn"
                      onClick={() => handleAddPartToJob(part)}
                      disabled={part.truckQty <= 0}
                    >
                      <Plus size={14}/> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Customer Digital Signature Modal (#40) */}
      {showSignaturePad && (
        <div className="mobile-modal-overlay" onClick={() => setShowSignaturePad(false)}>
          <div className="mobile-modal-sheet sig-modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-handle" />
            <div className="modal-sheet-header">
              <div className="sheet-title-group">
                <FileSignature size={18} className="sheet-icon" />
                <div>
                  <strong>Customer Work Sign-off (#40)</strong>
                  <small>Draw signature inside canvas below</small>
                </div>
              </div>
              <button className="sheet-close-btn" onClick={() => setShowSignaturePad(false)}><X size={17}/></button>
            </div>

            <div className="signature-pad-container">
              <p className="sig-legal-text">
                I hereby accept that the services described above have been completed satisfactorily by Northstar Field Services.
              </p>

              <div className="sig-canvas-wrap">
                <canvas 
                  ref={sigCanvasRef}
                  width={340}
                  height={150}
                  className="sig-html-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={drawSignature}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={drawSignature}
                  onTouchEnd={stopDrawing}
                />
                <span className="canvas-watermark">Sign with finger or stylus here</span>
              </div>

              <div className="sig-actions-row">
                <button className="sig-btn-clear" onClick={clearCanvas}>
                  <RotateCcw size={14} /> Clear
                </button>
                <button className="sig-btn-save" onClick={saveSignature}>
                  <Check size={15} /> Accept Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. On-Site Payment Drawer (#56, #58) */}
      {showPaymentDrawer && (
        <PaymentDrawerModal 
          totalAmount={jobTotalAmount}
          onClose={() => setShowPaymentDrawer(false)}
          onPaid={method => {
            setPaymentCollected(true);
            setPaidMethod(method);
            setShowPaymentDrawer(false);
            notify(`Payment of $${jobTotalAmount.toFixed(2)} received via ${method}! Receipt sent.`);
          }}
        />
      )}

      {/* 7. On-My-Way Customer SMS Simulation Modal */}
      {showOnMyWayModal && (
        <div className="mobile-modal-overlay" onClick={() => setShowOnMyWayModal(false)}>
          <div className="mobile-modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-handle" />
            <div className="modal-sheet-header">
              <div className="sheet-title-group">
                <Send size={18} className="sheet-icon" />
                <div>
                  <strong>Send On-My-Way SMS to Customer</strong>
                  <small>Automated dispatch SMS with live GPS ETA</small>
                </div>
              </div>
              <button className="sheet-close-btn" onClick={() => setShowOnMyWayModal(false)}><X size={17}/></button>
            </div>

            <div className="on-my-way-content">
              <div className="sms-preview-bubble">
                <span className="sms-from">SMS to {activeJob.customer} ((512) 555-0184):</span>
                <p>
                  "Hi {activeJob.customer.split(' ')[0]}! Alex Morgan with Northstar Services is on the way to your property for your {activeJob.type}. Estimated arrival: 15 minutes. Track truck live: https://ibst.io/t/am-2048"
                </p>
              </div>

              <div className="eta-picker-row">
                <span>Select ETA:</span>
                {['10 mins', '15 mins', '30 mins', '45 mins'].map(t => (
                  <button key={t} className="eta-chip" onClick={() => notify(`ETA updated to ${t}`)}>
                    {t}
                  </button>
                ))}
              </div>

              <button 
                className="full-action-btn primary"
                onClick={() => {
                  setShowOnMyWayModal(false);
                  setJobStage('En route');
                  notify(`On-My-Way SMS dispatched to ${activeJob.customer}`);
                }}
              >
                <Send size={15} /> Send SMS & Set En Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. AI Daily Briefing Popup (#15) */}
      {showAiBrief && (
        <div className="mobile-modal-overlay" onClick={() => setShowAiBrief(false)}>
          <div className="mobile-modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-handle" />
            <div className="modal-sheet-header">
              <div className="sheet-title-group">
                <Sparkles size={18} className="sheet-icon-ai" />
                <div>
                  <strong>AI Pre-Job Intelligence (#15, #18)</strong>
                  <small>Customer: {activeJob.customer} · Asset History</small>
                </div>
              </div>
              <button className="sheet-close-btn" onClick={() => setShowAiBrief(false)}><X size={17}/></button>
            </div>

            <div className="ai-brief-full-body">
              <div className="ai-insight-box">
                <strong>Equipment Profile</strong>
                <p>Carrier Infinity 16 SEER Condenser (Model: 24ACC636A003, Serial: 1821E49201). Installed 2021 (5.4 years old). Filter size: 20x25x4.</p>
              </div>

              <div className="ai-insight-box">
                <strong>Service History (#18)</strong>
                <p>Last tune-up performed 6 months ago by Jordan Lee. Capacitor reading was 43 MFD. Recommend testing capacitor tolerance today.</p>
              </div>

              <div className="ai-insight-box">
                <strong>Recommended Upsells / Maintenance</strong>
                <p>Customer qualifies for UV Air Purifier add-on with 15% VIP member discount.</p>
              </div>

              <button className="full-action-btn primary" onClick={() => setShowAiBrief(false)}>
                Done / Return to Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Toast Feedback */}
      {toast && (
        <div className="tech-mobile-toast">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}
        </main>
      </div>
    </div>
  );
}

// =========================================================================
// SUB-COMPONENT: Voice-to-Report Modal with Animated Soundwaves (#5)
// =========================================================================
function VoiceReportModal({ onClose, onApplySummary }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordSeconds(0);
      setTranscribedText('');
    } else {
      setIsRecording(false);
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setTranscribedText('Completed 21-point seasonal inspection on Carrier Infinity split system. Outdoor unit capacitor was bulging and reading 41 MFD (below 45 MFD specification). Installed replacement capacitor from truck stock. Cleaned outdoor coil and verified 18°F Delta-T split across evaporator coil.');
      }, 1500);
    }
  };

  return (
    <div className="mobile-modal-overlay" onClick={onClose}>
      <div className="mobile-modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-sheet-handle" />
        <div className="modal-sheet-header">
          <div className="sheet-title-group">
            <Mic size={18} className="sheet-icon" />
            <div>
              <strong>Voice-to-Report Dictation (#5)</strong>
              <small>Speak findings naturally · AI generates work report</small>
            </div>
          </div>
          <button className="sheet-close-btn" onClick={onClose}><X size={17}/></button>
        </div>

        <div className="voice-record-body">
          <div className="mic-animation-container">
            <button 
              className={`big-mic-button ${isRecording ? 'recording' : ''}`}
              onClick={handleToggleRecord}
            >
              {isRecording ? <MicOff size={32}/> : <Mic size={32}/>}
            </button>

            {isRecording && (
              <div className="soundwave-bars">
                <span/><span/><span/><span/><span/><span/><span/><span/>
              </div>
            )}

            <span className="voice-status-label">
              {isRecording ? `Recording audio: 00:${recordSeconds < 10 ? '0' : ''}${recordSeconds}` :
               isGenerating ? 'AI transcribing and structuring report...' :
               'Tap microphone and describe your findings'}
            </span>
          </div>

          {transcribedText && (
            <div className="transcription-preview">
              <span className="preview-heading"><Sparkles size={13}/> AI Formatted Service Report:</span>
              <p>{transcribedText}</p>
            </div>
          )}

          <div className="voice-modal-actions">
            <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
            <button 
              className="modal-apply-btn"
              disabled={!transcribedText}
              onClick={() => onApplySummary(transcribedText)}
            >
              Insert into Work Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// SUB-COMPONENT: AI Nameplate OCR Camera Scanner Modal (#46)
// =========================================================================
function OcrNameplateModal({ onClose, onApplyOcr }) {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const triggerScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedData({
        brand: 'Carrier',
        model: '24ACC636A003',
        serial: '1821E49201',
        tons: '3.0 Ton',
        seer: '16.0 SEER',
        refrigerant: 'R-410A (Puron)',
        voltage: '208/230V 1-Ph'
      });
    }, 1800);
  };

  return (
    <div className="mobile-modal-overlay" onClick={onClose}>
      <div className="mobile-modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-sheet-handle" />
        <div className="modal-sheet-header">
          <div className="sheet-title-group">
            <Scan size={18} className="sheet-icon" />
            <div>
              <strong>AI Equipment Nameplate Scanner (#46)</strong>
              <small>Aim camera at equipment data plate or serial sticker</small>
            </div>
          </div>
          <button className="sheet-close-btn" onClick={onClose}><X size={17}/></button>
        </div>

        <div className="ocr-scanner-body">
          {/* Simulated Camera Viewfinder */}
          <div className="camera-viewfinder">
            <div className="viewfinder-frame">
              <div className="corner tl"/><div className="corner tr"/>
              <div className="corner bl"/><div className="corner br"/>
              {scanning && <div className="laser-scan-line" />}
              <div className="plate-simulation">
                <span>CARRIER CORP · CONDENSING UNIT</span>
                <span>MOD: 24ACC636A003 · SER: 1821E49201</span>
                <span>VOLTS: 208/230 · REFRIG: R-410A</span>
              </div>
            </div>
          </div>

          {!scannedData ? (
            <button 
              className="scan-trigger-btn"
              onClick={triggerScan}
              disabled={scanning}
            >
              <Camera size={18} /> {scanning ? 'Analyzing Data Plate...' : 'Capture & Extract Nameplate'}
            </button>
          ) : (
            <div className="ocr-results-card">
              <div className="ocr-head">
                <CheckCircle2 size={16} className="text-green" />
                <strong>OCR Recognition Confirmed (99.4% confidence)</strong>
              </div>
              <div className="ocr-specs-grid">
                <div><span>Brand:</span> <strong>{scannedData.brand}</strong></div>
                <div><span>Model:</span> <strong>{scannedData.model}</strong></div>
                <div><span>Serial:</span> <strong>{scannedData.serial}</strong></div>
                <div><span>Capacity:</span> <strong>{scannedData.tons}</strong></div>
                <div><span>Refrigerant:</span> <strong>{scannedData.refrigerant}</strong></div>
                <div><span>Efficiency:</span> <strong>{scannedData.seer}</strong></div>
              </div>
              <button 
                className="full-action-btn primary"
                onClick={() => onApplyOcr(scannedData)}
              >
                Save to Customer Asset Register (#46)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// SUB-COMPONENT: On-Site Payment Drawer Modal (#56, #58)
// =========================================================================
function PaymentDrawerModal({ totalAmount, onClose, onPaid }) {
  const [payMethod, setPayMethod] = useState('card'); // 'card' | 'upi' | 'cash'
  const [cashGiven, setCashGiven] = useState(200);
  const [processingNfc, setProcessingNfc] = useState(false);

  const handleNfcTap = () => {
    setProcessingNfc(true);
    setTimeout(() => {
      setProcessingNfc(false);
      onPaid('Contactless Card (NFC)');
    }, 1600);
  };

  return (
    <div className="mobile-modal-overlay" onClick={onClose}>
      <div className="mobile-modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-sheet-handle" />
        <div className="modal-sheet-header">
          <div className="sheet-title-group">
            <DollarSign size={18} className="sheet-icon" />
            <div>
              <strong>Collect On-Site Payment (#56, #58)</strong>
              <small>Invoice Total: <strong>${totalAmount.toFixed(2)}</strong></small>
            </div>
          </div>
          <button className="sheet-close-btn" onClick={onClose}><X size={17}/></button>
        </div>

        <div className="payment-drawer-content">
          {/* Method Selector Tabs */}
          <div className="pay-methods-tabs">
            <button 
              className={`method-tab ${payMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPayMethod('card')}
            >
              <CreditCard size={15}/> Tap to Pay (NFC)
            </button>
            <button 
              className={`method-tab ${payMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPayMethod('upi')}
            >
              <QrCode size={15}/> UPI / QR Code
            </button>
            <button 
              className={`method-tab ${payMethod === 'cash' ? 'active' : ''}`}
              onClick={() => setPayMethod('cash')}
            >
              <DollarSign size={15}/> Cash / Cheque
            </button>
          </div>

          {/* METHOD 1: Contactless Card (NFC Tap to Pay) */}
          {payMethod === 'card' && (
            <div className="nfc-tap-container">
              <div className="nfc-animation-ring">
                <Radio size={42} className={processingNfc ? 'nfc-pulse-anim' : ''} />
              </div>
              <h4>Hold Contactless Card or Phone to Device</h4>
              <p>Supports Visa, MasterCard, Amex, Apple Pay & Google Pay</p>
              <button 
                className="simulate-tap-btn"
                onClick={handleNfcTap}
                disabled={processingNfc}
              >
                {processingNfc ? 'Authorizing $189.00...' : 'Simulate Customer Card Tap'}
              </button>
            </div>
          )}

          {/* METHOD 2: UPI / Dynamic QR Code */}
          {payMethod === 'upi' && (
            <div className="qr-pay-container">
              <div className="qr-code-box">
                {/* High Resolution Simulated SVG QR Code */}
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <rect width="160" height="160" fill="#fff" rx="8" />
                  {/* Outer position markers */}
                  <rect x="15" y="15" width="40" height="40" fill="#1e293b" rx="4" />
                  <rect x="23" y="23" width="24" height="24" fill="#fff" rx="2" />
                  <rect x="29" y="29" width="12" height="12" fill="#1e293b" />

                  <rect x="105" y="15" width="40" height="40" fill="#1e293b" rx="4" />
                  <rect x="113" y="23" width="24" height="24" fill="#fff" rx="2" />
                  <rect x="119" y="29" width="12" height="12" fill="#1e293b" />

                  <rect x="15" y="105" width="40" height="40" fill="#1e293b" rx="4" />
                  <rect x="23" y="113" width="24" height="24" fill="#fff" rx="2" />
                  <rect x="29" y="119" width="12" height="12" fill="#1e293b" />

                  {/* QR Pattern dots */}
                  <rect x="65" y="25" width="10" height="10" fill="#1e293b" />
                  <rect x="85" y="25" width="10" height="10" fill="#1e293b" />
                  <rect x="65" y="45" width="10" height="10" fill="#1e293b" />
                  <rect x="85" y="45" width="10" height="10" fill="#1e293b" />
                  <rect x="65" y="65" width="30" height="30" fill="#1e293b" />
                  <rect x="73" y="73" width="14" height="14" fill="#fff" />
                  <rect x="115" y="75" width="10" height="10" fill="#1e293b" />
                  <rect x="135" y="75" width="10" height="10" fill="#1e293b" />
                  <rect x="65" y="115" width="10" height="10" fill="#1e293b" />
                  <rect x="85" y="115" width="10" height="10" fill="#1e293b" />
                  <rect x="105" y="115" width="40" height="10" fill="#1e293b" />
                  <rect x="115" y="135" width="30" height="10" fill="#1e293b" />
                </svg>
              </div>
              <span className="qr-scan-label">Customer scans with any banking / UPI app</span>
              <button 
                className="simulate-tap-btn"
                onClick={() => onPaid('UPI / QR Code')}
              >
                Simulate QR Payment Received
              </button>
            </div>
          )}

          {/* METHOD 3: Cash / Cheque Handover */}
          {payMethod === 'cash' && (
            <div className="cash-handover-container">
              <div className="cash-calc-row">
                <label>Amount Tendered ($)</label>
                <input 
                  type="number" 
                  value={cashGiven} 
                  onChange={e => setCashGiven(Number(e.target.value))}
                />
              </div>

              <div className="cash-change-display">
                <span>Change Due to Customer:</span>
                <strong>${Math.max(0, cashGiven - totalAmount).toFixed(2)}</strong>
              </div>

              <button 
                className="simulate-tap-btn"
                onClick={() => onPaid('Cash Handover')}
              >
                Record Cash Received & Issue Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MaximizeMobileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}
