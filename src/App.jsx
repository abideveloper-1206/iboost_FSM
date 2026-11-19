import React, { useMemo, useState, useEffect } from 'react';
import CustomerPortal from './CustomerPortal';
import TechnicianApp from './TechnicianApp';
import { BookingSetupModal, CallRecordingModal, FieldSelect, PhoneBookingModal } from './TenantWorkflows';

// Feature Views
import DashboardView from './components/DashboardView';
import DispatchView from './components/DispatchView';
import JobsView from './components/JobsView';
import CustomersView from './components/CustomersView';
import RequestsView from './components/RequestsView';
import TechniciansView from './components/TechniciansView';
import EquipmentView from './components/EquipmentView';
import SalesView from './components/SalesView';
import InvoicesView from './components/InvoicesView';
import PaymentsView from './components/PaymentsView';
import ReportsView from './components/ReportsView';
import CommunicationView from './components/CommunicationView';
import StockTrucksView from './components/StockTrucksView';
import PricebookView from './components/PricebookView';
import MarketingView from './components/MarketingView';
import SettingsView from './components/SettingsView';
import AIWorkspaceView from './components/AIWorkspaceView';

// Dedicated Full-Schema CRUD Modals
import {
  JobModal,
  CustomerModal,
  EquipmentModal,
  LeadModal,
  QuoteModal,
  InvoiceModal,
  PaymentModal,
  TechnicianModal,
  PartModal,
  PricebookModal
} from './components/CrudModals';

// Mock Data
import {
  initialJobs,
  initialCustomers,
  initialRequests,
  initialTechnicians,
  initialEquipment,
  initialLeads,
  initialQuotes,
  initialInvoices,
  initialPayments,
  initialPricebook,
  initialInventory,
  initialCommunication,
  initialReviews,
  initialSettings,
  chartAnalyticsData
} from './data/mockData';

import {
  Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bell, Blocks, Bot,
  BriefcaseBusiness, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, ClipboardList, Clock3, CreditCard, Ellipsis, FileClock,
  FileText, Filter, Inbox, LayoutDashboard, MapPin, Menu, MessageSquare, MoreHorizontal,
  Plus, Search, Send, Settings2, ShieldCheck, Sparkles, TrendingUp, Users, Wrench,
  X, Zap, Package, Phone, Mail, DollarSign, FilePlus2, Tag, Gauge, Clock4,
  SlidersHorizontal, ChevronUp, PanelLeftClose, PanelLeftOpen, Smartphone
} from 'lucide-react';

const navGroups = [
  {
    title: 'Workspace',
    items: [
      ['Dashboard', LayoutDashboard],
      ['Dispatch', CalendarDays, '8'],
      ['Jobs', ClipboardList, '12'],
      ['Customers', Users],
      ['Requests', Inbox, '4']
    ]
  },
  {
    title: 'Manage',
    items: [
      ['Technicians', Wrench],
      ['Equipment', Blocks],
      ['Sales', TrendingUp],
      ['Invoices', CreditCard],
      ['Payments', DollarSign],
      ['Reports', FileText],
      ['Communication', MessageSquare],
      ['Stock & trucks', Package]
    ]
  },
  {
    title: 'Platform',
    items: [
      ['AI workspace', Sparkles, 'AI'],
      ['Pricebook', Tag],
      ['Marketing', MessageSquare],
      ['Settings', Settings2]
    ]
  }
];

const moduleSlug = label => label.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const moduleFromPath = path => {
  const slug = path.replace(/\/+$/, '').split('/').pop();
  return navGroups.flatMap(group => group.items.map(([label]) => label)).find(label => moduleSlug(label) === slug) || 'Dashboard';
};

const safeRead = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

function TenantApp() {
  const [active, setActive] = useState(() => moduleFromPath(window.location.pathname));
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState('');
  const [toast, setToast] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [workspace, setWorkspace] = useState('Northstar Services');
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [planExpanded, setPlanExpanded] = useState(false);
  const [selected, setSelected] = useState(null);

  // Tenant Collections with LocalStorage Persistence
  const [jobs, setJobs] = useState(() => safeRead('iboost-demo-jobs', initialJobs));
  const [customers, setCustomers] = useState(() => safeRead('iboost-demo-customers', initialCustomers));
  const [requests, setRequests] = useState(() => safeRead('iboost-demo-requests', initialRequests));
  const [technicians, setTechnicians] = useState(() => safeRead('iboost-demo-technicians', initialTechnicians));
  const [equipment, setEquipment] = useState(() => safeRead('iboost-demo-equipment', initialEquipment));
  const [leads, setLeads] = useState(() => safeRead('iboost-demo-leads', initialLeads));
  const [quotes, setQuotes] = useState(() => safeRead('iboost-demo-quotes', initialQuotes));
  const [invoices, setInvoices] = useState(() => safeRead('iboost-demo-invoices', initialInvoices));
  const [payments, setPayments] = useState(() => safeRead('iboost-demo-payments', initialPayments));
  const [pricebook, setPricebook] = useState(() => safeRead('iboost-demo-pricebook', initialPricebook));
  const [inventory, setInventory] = useState(() => safeRead('iboost-demo-inventory', initialInventory));
  const [communication, setCommunication] = useState(() => safeRead('iboost-demo-communication', initialCommunication));
  const [reviews, setReviews] = useState(() => safeRead('iboost-demo-reviews', initialReviews));
  const [settings, setSettings] = useState(() => safeRead('iboost-demo-settings', initialSettings));

  // Request intake modals
  const [activeRequest, setActiveRequest] = useState(false);
  const [requestMode, setRequestMode] = useState('request');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [phoneBookingOpen, setPhoneBookingOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [bookingSettings, setBookingSettings] = useState(() => safeRead('iboost-demo-booking-settings', null));

  const notify = msg => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 2600);
  };

  // Sync navigation path
  useEffect(() => {
    const syncPath = () => {
      const path = '/' + moduleSlug(active);
      if (window.location.pathname !== path) {
        window.history.pushState({ module: active }, '', path);
      }
    };
    syncPath();
    const onPopState = () => {
      setSelected(null);
      setActive(moduleFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    document.querySelector('.page-content')?.scrollTo({ top: 0 });
    return () => window.removeEventListener('popstate', onPopState);
  }, [active]);

  // Persistence helpers
  const saveJob = (j) => {
    const next = [j, ...jobs.filter(x => x.id !== j.id)];
    setJobs(next);
    localStorage.setItem('iboost-demo-jobs', JSON.stringify(next));
    notify(`Job ${j.id} saved to schedule`);
  };

  const saveCustomer = (c) => {
    const next = [c, ...customers.filter(x => x.id !== c.id)];
    setCustomers(next);
    localStorage.setItem('iboost-demo-customers', JSON.stringify(next));
    notify(`Customer ${c.name} saved`);
  };

  const saveEquipment = (eq) => {
    const next = [eq, ...equipment.filter(x => x.id !== eq.id)];
    setEquipment(next);
    localStorage.setItem('iboost-demo-equipment', JSON.stringify(next));
    notify(`Equipment asset ${eq.name} saved`);
  };

  const saveLead = (l) => {
    const next = [l, ...leads.filter(x => x.id !== l.id)];
    setLeads(next);
    localStorage.setItem('iboost-demo-leads', JSON.stringify(next));
    notify(`Lead ${l.title} added to pipeline`);
  };

  const saveQuote = (q) => {
    const next = [q, ...quotes.filter(x => x.id !== q.id)];
    setQuotes(next);
    localStorage.setItem('iboost-demo-quotes', JSON.stringify(next));
    notify(`Tiered quote ${q.id} saved`);
  };

  const saveInvoice = (inv) => {
    const next = [inv, ...invoices.filter(x => x.id !== inv.id)];
    setInvoices(next);
    localStorage.setItem('iboost-demo-invoices', JSON.stringify(next));
    notify(`Invoice ${inv.id} created`);
  };

  const savePayment = (p) => {
    const next = [p, ...payments.filter(x => x.id !== p.id)];
    setPayments(next);
    localStorage.setItem('iboost-demo-payments', JSON.stringify(next));
    notify(`Payment ${p.id} recorded`);
  };

  const saveTechnician = (t) => {
    const next = [t, ...technicians.filter(x => x.id !== t.id)];
    setTechnicians(next);
    localStorage.setItem('iboost-demo-technicians', JSON.stringify(next));
    notify(`Technician ${t.name} added`);
  };

  const savePart = (pt) => {
    const next = [pt, ...inventory.filter(x => x.id !== pt.id)];
    setInventory(next);
    localStorage.setItem('iboost-demo-inventory', JSON.stringify(next));
    notify(`Inventory item ${pt.name} saved`);
  };

  const savePricebook = (pb) => {
    const next = [pb, ...pricebook.filter(x => x.id !== pb.id)];
    setPricebook(next);
    localStorage.setItem('iboost-demo-pricebook', JSON.stringify(next));
    notify(`Pricebook item ${pb.name} saved`);
  };

  const saveRequest = (form) => {
    const row = {
      ...form,
      id: form.id || `REQ-${Math.floor(3110 + Math.random() * 80)}`,
      status: form.status || 'New',
      createdAt: 'Just now'
    };
    const next = [row, ...requests];
    setRequests(next);
    localStorage.setItem('iboost-demo-requests', JSON.stringify(next));
    notify('Request saved to the tenant inbox');
  };

  const changeStatus = (id) => {
    const next = jobs.map(j => j.id === id ? { ...j, status: j.status === 'Completed' ? 'Scheduled' : 'Completed' } : j);
    setJobs(next);
    localStorage.setItem('iboost-demo-jobs', JSON.stringify(next));
    setSelected(s => s ? { ...s, status: s.status === 'Completed' ? 'Scheduled' : 'Completed' } : null);
    notify('Job status updated');
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${mobile ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-symbol">
            <i/><i/><i/>
          </div>
          <div>
            <strong>iboost<span></span></strong>
            <small>FIELD SERVICE</small>
          </div>
          <button className="sidebar-collapse" onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expand' : 'Collapse'}>
            {collapsed ? <PanelLeftOpen size={16}/> : <PanelLeftClose size={16}/>}
          </button>
        </div>

        <div className="workspace-wrap">
          <button className="workspace-switch" aria-expanded={workspaceOpen} onClick={() => setWorkspaceOpen(!workspaceOpen)}>
            <span className="workspace-mark">{workspace.split(' ').map(x => x[0]).slice(0, 2).join('')}</span>
            <span className="workspace-copy">
              <small>WORKSPACE</small>
              <strong>{workspace}</strong>
            </span>
            <ChevronDown size={15}/>
          </button>
          {workspaceOpen && (
            <div className="workspace-menu">
              {['Northstar Services', 'Summit Heating & Air', 'Bluebonnet Plumbing'].map(name => (
                <button 
                  key={name} 
                  className={workspace === name ? 'selected' : ''} 
                  onClick={() => {
                    setWorkspace(name);
                    setWorkspaceOpen(false);
                    notify(`${name} workspace selected`);
                  }}
                >
                  <span>{name.split(' ').map(x => x[0]).slice(0, 2).join('')}</span>
                  <div>
                    <strong>{name}</strong>
                    <small>{name === 'Northstar Services' ? 'Current multi-trade workspace' : 'Demo workspace'}</small>
                  </div>
                  {workspace === name && <Check size={15}/>}
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navGroups.map(g => (
            <div className="nav-group" key={g.title}>
              <p className="nav-heading">{g.title}</p>
              {g.items.map(([label, Icon, badge]) => (
                <button 
                  key={label} 
                  className={`nav-link ${active === label ? 'active' : ''} ${badge === 'AI' ? 'ai-nav' : ''}`}
                  onClick={() => {
                    setActive(label);
                    setSelected(null);
                    setMobile(false);
                    setShowAI(false);
                  }}
                >
                  <Icon size={17}/>
                  <span>{label}</span>
                  {badge === 'AI' ? <span className="nav-new">AI</span> : badge && <span className="nav-badge">{badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="help-link" onClick={() => notify('Help center: Documentation and training guides')}>
            <CircleHelp size={16}/> Help center <span>↗</span>
          </button>
          <div className="profile">
            <div className="avatar profile-avatar">AM</div>
            <div className="profile-copy">
              <strong>Alex Morgan</strong>
              <small>Owner · Multi-Trade Admin</small>
            </div>
            <MoreHorizontal size={17}/>
          </div>
        </div>
      </aside>

      {mobile && <button className="mobile-scrim" onClick={() => setMobile(false)} aria-label="Close navigation"/>}

      {/* Main Area */}
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMobile(true)}>
              <Menu size={19}/>
            </button>
            <div className="breadcrumb">
              <span>{workspace}</span>
              <ChevronRight size={14}/>
              <strong>{active}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="global-search">
              <Search size={16}/>
              <input 
                placeholder="Search jobs, customers, serials..." 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (setActive('Customers'), notify(`Searching for "${query}"`))}
              />
              <kbd>Ctrl K</kbd>
            </div>

            <span className="top-divider"/>

            <div className="plan-usage-wrap">
              <button className={`plan-usage-icon ${planExpanded ? 'active' : ''}`} onClick={() => setPlanExpanded(!planExpanded)}>
                <Zap size={18}/><i/>
              </button>
              {planExpanded && (
                <div className="plan-usage-popover">
                  <div className="plan-usage-heading">
                    <span><Zap size={16}/></span>
                    <div>
                      <small>YOUR PLAN</small>
                      <strong>Field Service Pro ($149/mo)</strong>
                    </div>
                    <button onClick={() => setPlanExpanded(false)}><X size={15}/></button>
                  </div>
                  <div className="plan-usage-meter">
                    <div><span>Monthly jobs & SMS used</span> <strong>68%</strong></div>
                    <div className="plan-progress"><i style={{ width: '68%' }}/></div>
                  </div>
                  <button className="plan-usage-manage" onClick={() => { setActive('Settings'); setPlanExpanded(false); }}>
                    Manage plan & usage (#119) <ArrowRight size={14}/>
                  </button>
                </div>
              )}
            </div>

            <a 
              href="/mobile" 
              target="_blank" 
              rel="noreferrer" 
              className="top-mobile-pill" 
              title="Launch Field Technician Mobile App (/mobile)"
            >
              <Smartphone size={14}/> Tech App (/mobile) ↗
            </a>

            <button className="top-ai" onClick={() => setShowAI(!showAI)}>
              <Sparkles size={15}/> Ask AI (#12)
            </button>

            <button className="icon-button notification-button" onClick={() => notify('Notifications: 2 backflow tests due this week')}>
              <Bell size={18}/><i/>
            </button>

            <div className="avatar top-avatar">AM</div>
          </div>
        </header>

        {/* Page Content View Router */}
        <div className="page-content">
          {selected ? (
            <JobDetail 
              job={selected} 
              onClose={() => setSelected(null)} 
              onEdit={() => setModal('job')} 
              changeStatus={changeStatus}
            />
          ) : active === 'Dashboard' ? (
            <DashboardView 
              jobs={jobs} 
              requests={requests}
              customers={customers}
              setActive={setActive} 
              setModal={setModal} 
              setSelected={setSelected} 
              notify={notify}
              chartData={chartAnalyticsData}
            />
          ) : active === 'Dispatch' ? (
            <DispatchView 
              jobs={jobs} 
              setJobs={setJobs} 
              setModal={setModal} 
              setSelected={setSelected} 
              notify={notify}
            />
          ) : active === 'Jobs' ? (
            <JobsView 
              jobs={jobs} 
              setJobs={setJobs} 
              setModal={setModal} 
              setSelected={setSelected} 
              notify={notify}
            />
          ) : active === 'Customers' ? (
            <CustomersView 
              customers={customers} 
              setCustomers={setCustomers} 
              setModal={setModal} 
              notify={notify}
            />
          ) : active === 'Requests' ? (
            <RequestsView 
              requests={requests}
              setRequests={setRequests}
              setActiveRequest={setActiveRequest}
              setRequestMode={setRequestMode}
              setBookingOpen={setBookingOpen}
              setPhoneBookingOpen={setPhoneBookingOpen}
              setModal={setModal}
              notify={notify}
            />
          ) : active === 'Technicians' ? (
            <TechniciansView 
              technicians={technicians}
              setTechnicians={setTechnicians}
              setModal={setModal}
              notify={notify}
            />
          ) : active === 'Equipment' ? (
            <EquipmentView 
              equipment={equipment}
              setEquipment={setEquipment}
              setModal={setModal}
              notify={notify}
            />
          ) : active === 'Sales' ? (
            <SalesView 
              leads={leads}
              quotes={quotes}
              setLeads={setLeads}
              setQuotes={setQuotes}
              setModal={setModal}
              notify={notify}
            />
          ) : active === 'Invoices' ? (
            <InvoicesView 
              invoices={invoices}
              setInvoices={setInvoices}
              setModal={setModal}
              notify={notify}
            />
          ) : active === 'Payments' ? (
            <PaymentsView 
              payments={payments}
              setPayments={setPayments}
              setModal={setModal}
              notify={notify}
            />
          ) : active === 'Reports' ? (
            <ReportsView 
              notify={notify}
              chartData={chartAnalyticsData}
            />
          ) : active === 'Communication' ? (
            <CommunicationView 
              communication={communication}
              calls={[]}
              setCommunication={setCommunication}
              notify={notify}
              setCallOpen={setCallOpen}
            />
          ) : active === 'Stock & trucks' ? (
            <StockTrucksView 
              inventory={inventory}
              setInventory={setInventory}
              setModal={setModal}
              notify={notify}
            />
          ) : active === 'Pricebook' ? (
            <PricebookView 
              pricebook={pricebook}
              setPricebook={setPricebook}
              setModal={setModal}
              notify={notify}
            />
          ) : active === 'Marketing' ? (
            <MarketingView 
              reviews={reviews}
              notify={notify}
            />
          ) : active === 'Settings' ? (
            <SettingsView 
              settings={settings}
              setSettings={setSettings}
              notify={notify}
            />
          ) : (
            <AIWorkspaceView notify={notify} />
          )}
        </div>
      </main>

      {/* Dedicated Schema-Accurate Modals */}
      {modal === 'job' && (
        <JobModal 
          customers={customers} 
          technicians={technicians} 
          onClose={() => setModal('')} 
          onSave={saveJob} 
        />
      )}

      {modal === 'customer' && (
        <CustomerModal 
          onClose={() => setModal('')} 
          onSave={saveCustomer} 
        />
      )}

      {modal === 'equipment' && (
        <EquipmentModal 
          customers={customers} 
          onClose={() => setModal('')} 
          onSave={saveEquipment} 
        />
      )}

      {modal === 'lead' && (
        <LeadModal 
          customers={customers} 
          onClose={() => setModal('')} 
          onSave={saveLead} 
        />
      )}

      {modal === 'quote' && (
        <QuoteModal 
          customers={customers} 
          onClose={() => setModal('')} 
          onSave={saveQuote} 
        />
      )}

      {modal === 'invoice' && (
        <InvoiceModal 
          customers={customers} 
          onClose={() => setModal('')} 
          onSave={saveInvoice} 
        />
      )}

      {modal === 'payment' && (
        <PaymentModal 
          invoices={invoices} 
          onClose={() => setModal('')} 
          onSave={savePayment} 
        />
      )}

      {modal === 'technician' && (
        <TechnicianModal 
          onClose={() => setModal('')} 
          onSave={saveTechnician} 
        />
      )}

      {modal === 'part' && (
        <PartModal 
          onClose={() => setModal('')} 
          onSave={savePart} 
        />
      )}

      {modal === 'pricebook' && (
        <PricebookModal 
          onClose={() => setModal('')} 
          onSave={savePricebook} 
        />
      )}

      {/* Auxiliary Tenant Modals */}
      {bookingOpen && (
        <BookingSetupModal 
          settings={bookingSettings} 
          customers={customers} 
          onClose={() => setBookingOpen(false)} 
          onSave={val => val.source ? saveRequest(val) : setBookingSettings(val)} 
          notify={notify} 
        />
      )}

      {phoneBookingOpen && (
        <PhoneBookingModal 
          customers={customers} 
          onClose={() => setPhoneBookingOpen(false)} 
          onSave={form => { saveRequest(form); saveJob(form); }} 
          notify={notify} 
        />
      )}

      {callOpen && (
        <CallRecordingModal 
          calls={[]} 
          onClose={() => setCallOpen(false)} 
          onSave={form => notify('Call log saved')} 
          notify={notify} 
        />
      )}

      {showAI && (
        <AIWidget 
          onClose={() => setShowAI(false)} 
          notify={notify} 
        />
      )}

      {/* Toast Feedback */}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={17}/>
          {toast}
        </div>
      )}
    </div>
  );
}

// Job Detail Component
function JobDetail({ job, onClose, onEdit, changeStatus }) {
  return (
    <section className="surface job-workspace">
      <div className="job-workspace-top">
        <button className="back-button" onClick={onClose}>
          <ArrowLeft size={16}/> Back to work orders
        </button>
        <span className="detail-id">{job.id} · <span className="status-pill status-progress">{job.status}</span></span>
      </div>

      <div className="job-workspace-body">
        <div className="job-main">
          <span className="eyebrow">{job.trade?.toUpperCase() || 'FIELD WORK ORDER'}</span>
          <h1>{job.type}</h1>
          <p>Service visit for <strong>{job.customer}</strong></p>

          <div className="job-action-row">
            <button className="button button-primary" onClick={() => changeStatus(job.id)}>
              <CheckCircle2 size={15}/> {job.status === 'Completed' ? 'Mark In Progress' : 'Mark Complete'}
            </button>
            <button className="button button-quiet" onClick={onEdit}>
              <Wrench size={15}/> Edit Job
            </button>
            <button className="button button-quiet" onClick={() => window.print()}>
              <FileText size={15}/> Print Report
            </button>
          </div>

          <div className="job-detail-grid">
            <article className="surface detail-card">
              <h2>Customer & Location</h2>
              <div className="detail-info-row">
                <Users size={17}/>
                <span><strong>{job.customer}</strong><small>Customer record</small></span>
              </div>
              <div className="detail-info-row">
                <MapPin size={17}/>
                <span><strong>{job.address?.split(',')[0]}</strong><small>{job.address?.split(',')[1] || 'Austin, TX'}</small></span>
              </div>
              <div className="detail-info-row">
                <Phone size={16}/>
                <span><strong>(512) 555-0184</strong><small>Mobile · SMS capable</small></span>
              </div>
            </article>

            <article className="surface detail-card">
              <h2>Schedule & Assignment</h2>
              <div className="detail-info-row">
                <CalendarDays size={17}/>
                <span><strong>{job.time} ({job.duration || '2h'})</strong><small>Arrival window</small></span>
              </div>
              <div className="detail-info-row">
                <Users size={17}/>
                <span><strong>{job.tech}</strong><small>{job.crew || 'Assigned Crew'}</small></span>
              </div>
            </article>

            <article className="surface detail-card">
              <h2>Field Service Report & Findings (#5, #42)</h2>
              <div className="checklist-item"><CheckCircle2 size={16}/><span>Arrival & Safety Check</span><small>Done</small></div>
              <div className="checklist-item"><CheckCircle2 size={16}/><span>Diagnostic & Measurements</span><small>Done</small></div>
              <div className="checklist-item pending"><Clock3 size={16}/><span>Customer Work Sign-off</span><small>Pending</small></div>
              <textarea 
                className="report-notes" 
                defaultValue={job.notes || 'Routine check completed. Pressures verified within normal manufacturer tolerances.'} 
                rows="3"
              />
            </article>

            <article className="surface detail-card">
              <div className="surface-heading-row">
                <h2>AI Customer Summary (#15, #18)</h2>
                <span className="suggestion-badge">AI BRIEF</span>
              </div>
              <div className="customer-snapshot">
                <Sparkles size={15}/>
                <p>Returning VIP Comfort Plan member. Installed Carrier unit is 5.6 years old. No unpaid balance.</p>
              </div>
              <div className="detail-info-row" style={{ marginTop: '8px' }}>
                <DollarSign size={16}/>
                <span><strong>Job Value: ${Number(job.amount || 0).toFixed(2)}</strong><small>Due on completion</small></span>
              </div>
            </article>
          </div>
        </div>

        <footer className="job-workspace-footer">
          <span><ShieldCheck size={15}/> Customer signature and before/after photos required before closing</span>
          <div>
            <button className="button button-quiet" onClick={onClose}>Close</button>
            <button className="button button-primary" onClick={() => changeStatus(job.id)}>
              <Check size={15}/> Save Job
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}

// AI Quick Widget
function AIWidget({ onClose, notify }) {
  const [q, setQ] = useState('');
  return (
    <div className="ai-widget surface">
      <div className="ai-widget-head">
        <div className="widget-icon"><Sparkles size={16}/></div>
        <span><strong>Ask iBoost Intelligence</strong><small>Operations Assistant</small></span>
        <button className="icon-button" onClick={onClose}><X size={16}/></button>
      </div>
      <div className="ai-widget-intro">
        <div className="widget-bot"><Bot size={18}/></div>
        <p>Hi Alex! How can I assist with jobs, technician capacity, or customer records?</p>
      </div>
      <div className="widget-prompts">
        <button onClick={() => notify('Daily dispatch briefing: 6 jobs scheduled, 4 technicians active')}>
          Today's schedule summary <ArrowRight size={13}/>
        </button>
        <button onClick={() => notify('2 open customer quotes need follow-up')}>
          Who needs quote follow-up? <ArrowRight size={13}/>
        </button>
      </div>
      <div className="widget-input">
        <input 
          placeholder="Ask anything about your business..." 
          value={q} 
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (notify(`Query "${q}" analyzed`), setQ(''))}
        />
        <button onClick={() => { notify(`Query "${q}" analyzed`); setQ(''); }}><Send size={15}/></button>
      </div>
    </div>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/customer-portal') return <CustomerPortal customers={safeRead('iboost-demo-customers', initialCustomers)} jobs={safeRead('iboost-demo-jobs', initialJobs)} />;
  if (path === '/technician-app' || path === '/mobile' || path === '/tech') {
    return <TechnicianApp jobs={safeRead('iboost-demo-jobs', initialJobs)} />;
  }
  return <TenantApp />;
}
