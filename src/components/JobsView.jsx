import React, { useState } from 'react';
import { 
  ClipboardList, Plus, Search, Filter, Clock3, Users, MapPin, 
  CheckCircle2, ArrowRight, MoreHorizontal, Sparkles, AlertCircle,
  Calendar, Layers, Check, ChevronDown, FileText, Wrench
} from 'lucide-react';

export default function JobsView({ 
  jobs = [], 
  setJobs, 
  setModal, 
  setSelected, 
  notify 
}) {
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'table'
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [search, setSearch] = useState('');

  const stages = [
    { id: 'New request', label: 'New Request', color: 'blue' },
    { id: 'In-home estimate', label: 'Site Assessment', color: 'amber' },
    { id: 'Quoted', label: 'Quoted', color: 'violet' },
    { id: 'Scheduled', label: 'Scheduled', color: 'teal' },
    { id: 'In progress', label: 'In Progress', color: 'indigo' },
    { id: 'Completed', label: 'Completed', color: 'green' }
  ];

  const filtered = jobs.filter(j => {
    const matchTrade = selectedTrade === 'All' || j.trade?.toLowerCase() === selectedTrade.toLowerCase();
    const matchSearch = `${j.customer} ${j.type} ${j.id} ${j.tech} ${j.address}`.toLowerCase().includes(search.toLowerCase());
    return matchTrade && matchSearch;
  });

  const moveJobStage = (jobId, newStage) => {
    const next = jobs.map(j => j.id === jobId ? { ...j, stage: newStage, status: newStage === 'Completed' ? 'Completed' : newStage === 'In progress' ? 'In progress' : 'Scheduled' } : j);
    setJobs(next);
    localStorage.setItem('iboost-demo-jobs', JSON.stringify(next));
    notify?.(`Job ${jobId} moved to ${newStage}`);
  };

  return (
    <div className="jobs-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">FIELD OPERATIONS · WORK ORDER LIFECYCLE (#75, #86)</div>
          <h1>Service Jobs & Work Orders</h1>
          <p>Track multi-trade jobs from initial inquiry through site visit, quote, dispatch, and final sign-off.</p>
        </div>
        <div className="heading-actions">
          <div className="segmented">
            <button className={viewMode === 'board' ? 'selected' : ''} onClick={() => setViewMode('board')}>
              Kanban Stage Board (#86)
            </button>
            <button className={viewMode === 'table' ? 'selected' : ''} onClick={() => setViewMode('table')}>
              Data Table View
            </button>
          </div>
          <button className="button button-primary" onClick={() => setModal('job')}>
            <Plus size={16}/> Create job
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['All', 'HVAC', 'Plumbing', 'Backflow', 'Septic', 'Electrical'].map(t => (
            <button key={t} className={selectedTrade === t ? 'active' : ''} onClick={() => setSelectedTrade(t)}>
              {t} Jobs
            </button>
          ))}
        </div>
        <div className="module-tools">
          <div className="dispatch-search">
            <Search size={15}/>
            <input placeholder="Search jobs, address, tech..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Kanban Board Mode (#86) */}
      {viewMode === 'board' ? (
        <div className="kanban-stage-board">
          {stages.map(st => {
            const stageJobs = filtered.filter(j => (j.stage || j.status) === st.id);
            const stageTotal = stageJobs.reduce((sum, j) => sum + (Number(j.amount) || 0), 0);

            return (
              <div key={st.id} className="kanban-column">
                <div className="kanban-col-header">
                  <div>
                    <span className={`col-dot ${st.color}`}/>
                    <strong>{st.label}</strong>
                    <span className="col-count">{stageJobs.length}</span>
                  </div>
                  <small>${stageTotal.toLocaleString()}</small>
                </div>

                <div className="kanban-col-cards">
                  {stageJobs.map(job => (
                    <div 
                      key={job.id} 
                      className={`kanban-card ${job.priority === 'Emergency' ? 'is-emergency' : ''}`}
                      onClick={() => setSelected(job)}
                    >
                      <div className="kcard-top">
                        <span className="job-id">{job.id}</span>
                        <span className={`trade-pill ${job.trade?.toLowerCase()}`}>{job.trade}</span>
                      </div>

                      <strong className="kcard-title">{job.type}</strong>
                      <div className="kcard-customer">
                        <Users size={12}/>
                        <span>{job.customer}</span>
                      </div>

                      <div className="kcard-address">
                        <MapPin size={12}/>
                        <span>{job.address?.split(',')[0]}</span>
                      </div>

                      <div className="kcard-footer">
                        <div className="kcard-tech">
                          <div className={`avatar avatar-${job.color}`}>{job.initials}</div>
                          <span>{job.tech}</span>
                        </div>
                        <strong className="kcard-price">${Number(job.amount || 0).toLocaleString()}</strong>
                      </div>

                      {/* Quick stage transition buttons */}
                      <div className="kcard-actions-quick" onClick={e => e.stopPropagation()}>
                        {st.id !== 'New request' && (
                          <button 
                            title="Move Back"
                            onClick={() => {
                              const currIdx = stages.findIndex(s => s.id === st.id);
                              if (currIdx > 0) moveJobStage(job.id, stages[currIdx - 1].id);
                            }}
                          >
                            ←
                          </button>
                        )}
                        {st.id !== 'Completed' && (
                          <button 
                            className="advance-btn"
                            title="Advance to next stage"
                            onClick={() => {
                              const currIdx = stages.findIndex(s => s.id === st.id);
                              if (currIdx < stages.length - 1) moveJobStage(job.id, stages[currIdx + 1].id);
                            }}
                          >
                            Advance →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {!stageJobs.length && (
                    <div className="kanban-empty">
                      <span>No jobs in {st.label}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Data Table Mode */
        <div className="surface" style={{ borderRadius: '9px', overflow: 'hidden' }}>
          <div className="table-scroll">
            <table className="data-table job-table">
              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>CUSTOMER</th>
                  <th>TRADE & SERVICE</th>
                  <th>CREW / TECH</th>
                  <th>SCHEDULE</th>
                  <th>VALUE</th>
                  <th>STAGE / STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(j => (
                  <tr key={j.id} onClick={() => setSelected(j)}>
                    <td><strong className="job-id">{j.id}</strong></td>
                    <td>
                      <div className="table-person">
                        <div className={`avatar avatar-${j.color}`}>{j.initials}</div>
                        <span>
                          <strong>{j.customer}</strong>
                          <small>{j.address?.split(',')[0]}</small>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`trade-badge ${j.trade?.toLowerCase()}`}>{j.trade}</span>
                      <strong style={{ marginLeft: '6px', fontSize: '11px', color: '#3d4d62' }}>{j.type}</strong>
                    </td>
                    <td>
                      <strong>{j.tech}</strong>
                      <small style={{ display: 'block', color: '#8898aa', fontSize: '10px' }}>{j.crew}</small>
                    </td>
                    <td>
                      <span className="table-time"><Clock3 size={13}/>{j.time} ({j.duration})</span>
                    </td>
                    <td><strong>${Number(j.amount || 0).toFixed(2)}</strong></td>
                    <td>
                      <span className={`status-pill ${j.status === 'In progress' ? 'status-progress' : j.status === 'Completed' ? 'status-scheduled' : 'status-enroute'}`}>
                        <i/> {j.stage || j.status}
                      </span>
                    </td>
                    <td>
                      <button className="button button-quiet button-small" onClick={e => { e.stopPropagation(); setSelected(j); }}>
                        View Details
                      </button>
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

