import React, { useState } from 'react';
import { 
  Wrench, Users, Plus, ShieldCheck, Clock3, AlertCircle, Award, 
  Calendar, Check, ChevronRight, FileSpreadsheet, Download, CheckCircle2
} from 'lucide-react';

export default function TechniciansView({ 
  technicians = [], 
  setTechnicians, 
  setModal, 
  notify 
}) {
  const [tab, setTab] = useState('Team');

  const crews = [
    { name: 'Truck 01 (North Austin)', lead: 'Alex Morgan', helper: 'Taylor Brooks', vehicle: 'Ford Transit 250 (TX-9921)', trade: 'HVAC & Electrical' },
    { name: 'Truck 02 (West Austin)', lead: 'Jordan Lee', helper: 'Sam Rivera', vehicle: 'Chevy Express 3500 (TX-4402)', trade: 'Plumbing & Gas' },
    { name: 'Truck 03 (East / Round Rock)', lead: 'Taylor Brooks', helper: 'Apprentice Cole', vehicle: 'Ram ProMaster (TX-8819)', trade: 'Backflow & Water' },
    { name: 'Pumper Truck 04 (County)', lead: 'Sam Rivera', helper: 'Driver Luis', vehicle: 'Freightliner 2500-Gal Tanker (TX-7731)', trade: 'Septic & OSSF' }
  ];

  return (
    <div className="technicians-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">WORKFORCE & FLEET (#8, #34, #44, #94)</div>
          <h1>Technicians & Crew Operations</h1>
          <p>Manage field staff, assigned truck crews, professional trade licenses, and weekly billable timesheets.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => window.open('/technician-app', '_blank', 'noopener,noreferrer')}>
            Technician Mobile App Preview ↗
          </button>
          <button className="button button-primary" onClick={() => setModal('technician')}>
            <Plus size={16}/> Invite Technician
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['Team', 'Crews & Trucks (#34)', 'License Tracker (#94)', 'Timesheets & Labor (#44, #103)'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Team Members */}
      {tab === 'Team' && (
        <div className="surface" style={{ borderRadius: '9px', overflow: 'hidden' }}>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>TECHNICIAN</th>
                  <th>ROLE & TITLE</th>
                  <th>TRADE SKILLS</th>
                  <th>ASSIGNED TRUCK</th>
                  <th>SHIFT SCHEDULE</th>
                  <th>PAY & COST RATE</th>
                  <th>RATING</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {technicians.map(t => (
                  <tr key={t.id || t.name}>
                    <td>
                      <div className="table-person">
                        <div className={`avatar avatar-${t.color || 'blue'}`}>{t.initials}</div>
                        <span>
                          <strong>{t.name}</strong>
                          <small>{t.email}</small>
                        </span>
                      </div>
                    </td>
                    <td><strong>{t.role}</strong></td>
                    <td>
                      <div className="tech-skill-tags">
                        {t.trades?.map(tr => (
                          <span key={tr} className={`trade-badge ${tr.toLowerCase()}`}>{tr}</span>
                        ))}
                      </div>
                    </td>
                    <td><span className="crew-label">{t.crew}</span></td>
                    <td><span className="table-time"><Clock3 size={13}/>{t.shift}</span></td>
                    <td>
                      <strong>${t.hourlyPay}/hr</strong>
                      <small style={{ display: 'block', color: '#8898aa', fontSize: '10px' }}>Cost: ${t.costRate}/hr</small>
                    </td>
                    <td><strong>★ {t.rating}</strong> ({t.jobsCompleted} jobs)</td>
                    <td>
                      <span className="status-pill status-progress"><i/> {t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Crews & Trucks */}
      {tab === 'Crews & Trucks (#34)' && (
        <div className="crews-grid">
          {crews.map(c => (
            <div key={c.name} className="surface crew-box-card">
              <div className="crew-box-head">
                <div>
                  <span className="modal-kicker">{c.trade.toUpperCase()}</span>
                  <h3>{c.name}</h3>
                </div>
                <span className="status-pill status-scheduled">Active</span>
              </div>
              <div className="crew-box-details">
                <div><span>Crew Lead:</span> <strong>{c.lead}</strong></div>
                <div><span>Assigned Helper:</span> <strong>{c.helper}</strong></div>
                <div><span>Vehicle / Plate:</span> <strong>{c.vehicle}</strong></div>
              </div>
              <div className="crew-box-foot">
                <button className="button button-quiet button-small" onClick={() => notify?.(`Dispatch roster updated for ${c.name}`)}>
                  Adjust Roster
                </button>
                <button className="button button-quiet button-small" onClick={() => notify?.(`Opening vehicle inventory for ${c.name}`)}>
                  Truck Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: License Tracker (#94) */}
      {tab === 'License Tracker (#94)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '16px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Technician Trade Licenses & Certifications (#94)</h2>
              <p>Automatic expiry warnings protect against dispatching staff to jobs without valid permits.</p>
            </div>
            <button className="button button-quiet button-small" onClick={() => notify?.('Syncing with state licensing boards')}>
              Check Renewals
            </button>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>TECHNICIAN</th>
                  <th>LICENSE / CERTIFICATE</th>
                  <th>LICENSE NUMBER</th>
                  <th>EXPIRY DATE</th>
                  <th>STATUS</th>
                  <th>VERIFICATION</th>
                </tr>
              </thead>
              <tbody>
                {technicians.flatMap(t => t.licenses?.map((lic, idx) => (
                  <tr key={`${t.name}-${idx}`}>
                    <td><strong>{t.name}</strong></td>
                    <td><Award size={14} style={{ color: '#4d8be3', marginRight: '6px' }}/><strong>{lic.type}</strong></td>
                    <td><code>{lic.number}</code></td>
                    <td><strong>{lic.expires}</strong></td>
                    <td>
                      <span className={`status-pill ${lic.status.includes('soon') ? 'status-attention' : 'status-progress'}`}>
                        <i/> {lic.status}
                      </span>
                    </td>
                    <td><span className="verified-check"><ShieldCheck size={14}/> State board verified</span></td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Timesheets & Labor (#44, #103) */}
      {tab === 'Timesheets & Labor (#44, #103)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '16px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Weekly Labor Timesheets (#44, #103)</h2>
              <p>Hours tracked from mobile app timers. Approved timesheets export directly for payroll.</p>
            </div>
            <div className="header-controls">
              <button className="button button-quiet button-small" onClick={() => notify?.('Exporting timesheets CSV for Gusto / QuickBooks')}>
                <Download size={14}/> Export Payroll CSV (#103)
              </button>
              <button className="button button-primary button-small" onClick={() => notify?.('All 4 timesheets approved for pay period')}>
                <Check size={14}/> Approve All Weeks
              </button>
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>MON</th>
                  <th>TUE</th>
                  <th>WED</th>
                  <th>THU</th>
                  <th>FRI</th>
                  <th>TOTAL HOURS</th>
                  <th>BILLABLE %</th>
                  <th>LABOR COST</th>
                  <th>APPROVAL</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Alex Morgan', h: [8.0, 7.5, 8.0, 8.5, 6.5], total: 38.5, billable: '92%', cost: '$2,002.00', status: 'Approved' },
                  { name: 'Jordan Lee', h: [7.5, 8.0, 7.0, 7.5, 6.0], total: 36.0, billable: '88%', cost: '$2,088.00', status: 'Approved' },
                  { name: 'Taylor Brooks', h: [7.0, 7.0, 6.5, 7.0, 6.5], total: 34.0, billable: '85%', cost: '$1,666.00', status: 'Pending Review' },
                  { name: 'Sam Rivera', h: [6.5, 7.0, 6.5, 6.5, 6.0], total: 32.5, billable: '82%', cost: '$1,560.00', status: 'Pending Review' }
                ].map(row => (
                  <tr key={row.name}>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.h[0]}h</td>
                    <td>{row.h[1]}h</td>
                    <td>{row.h[2]}h</td>
                    <td>{row.h[3]}h</td>
                    <td>{row.h[4]}h</td>
                    <td><strong style={{ color: '#3883eb' }}>{row.total}h</strong></td>
                    <td><span className="metric-badge-status green">{row.billable}</span></td>
                    <td><strong>{row.cost}</strong></td>
                    <td>
                      <span className={`status-pill ${row.status === 'Approved' ? 'status-scheduled' : 'status-attention'}`}>
                        <i/> {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

