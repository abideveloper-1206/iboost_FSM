import React, { useState } from 'react';
import { 
  Inbox, Plus, Search, Filter, Clock3, Users, MapPin, 
  CheckCircle2, ArrowRight, Sparkles, Phone, Globe, Calendar, FileText
} from 'lucide-react';

export default function RequestsView({ 
  requests = [], 
  setRequests, 
  setActiveRequest, 
  setRequestMode, 
  setBookingOpen, 
  setPhoneBookingOpen, 
  setModal, 
  notify 
}) {
  const [tab, setTab] = useState('All requests');
  const [search, setSearch] = useState('');

  const filtered = requests.filter(r => {
    const matchTab = tab === 'All requests' || 
      (tab === 'New & In review' && (r.status === 'New' || r.status === 'In review')) ||
      (tab === 'Scheduled' && r.status === 'Scheduled');
    const matchSearch = `${r.name} ${r.service} ${r.address} ${r.source}`.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const convertToJob = (req) => {
    setModal('job');
    notify?.(`Converting ${req.id} into a scheduled work order`);
  };

  return (
    <div className="requests-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">CUSTOMER INTAKE & REQUEST INBOX (#13, #14, #15, #16)</div>
          <h1>Service Requests Inbox</h1>
          <p>Capture incoming work from your public website form, online booking widget, phone calls, and customer portal.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => setPhoneBookingOpen(true)}>
            <Phone size={15}/> Phone / CSR Booking (#16)
          </button>
          <button className="button button-quiet" onClick={() => setBookingOpen(true)}>
            <Globe size={15}/> Online Booking Widget (#15)
          </button>
          <button className="button button-primary" onClick={() => { setRequestMode('request'); setActiveRequest(true); }}>
            <Plus size={16}/> New Service Request (#13)
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['All requests', 'New & In review', 'Scheduled', 'Needs reply'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="module-tools">
          <div className="dispatch-search">
            <Search size={15}/>
            <input placeholder="Search callers, issue..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Requests Data Table */}
      <div className="surface" style={{ borderRadius: '9px', overflow: 'hidden' }}>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>REQUEST ID</th>
                <th>CALLER / CUSTOMER</th>
                <th>TRADE & SERVICE</th>
                <th>INTAKE SOURCE</th>
                <th>LEAD SCORE & VALUE</th>
                <th>PREFERRED TIME</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <tr key={req.id}>
                  <td><strong className="job-id">{req.id}</strong></td>
                  <td>
                    <strong>{req.name}</strong>
                    <small style={{ display: 'block', color: '#8898aa', fontSize: '10px' }}>{req.phone} · {req.email}</small>
                  </td>
                  <td>
                    <span className={`trade-badge ${req.trade?.toLowerCase() || 'blue'}`}>{req.trade || 'General'}</span>
                    <strong style={{ marginLeft: '6px', fontSize: '11px', color: '#3d4d62' }}>{req.service}</strong>
                  </td>
                  <td>
                    <span className="request-source-tag">{req.source}</span>
                  </td>
                  <td>
                    <span className="metric-badge-status green"><Sparkles size={11}/> {req.score || '90/100 · High priority'}</span>
                  </td>
                  <td>
                    <span className="table-time"><Clock3 size={13}/>{req.preferredDate} ({req.preferredTime})</span>
                  </td>
                  <td>
                    <span className={`status-pill ${req.status === 'Scheduled' ? 'status-scheduled' : 'status-attention'}`}>
                      <i/> {req.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="button button-primary button-small" onClick={() => convertToJob(req)}>
                        Convert to Job
                      </button>
                      <button className="button button-quiet button-small" onClick={() => notify?.(`Assessment visit scheduled for ${req.name} (#14)`)}>
                        Assessment (#14)
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

