import React, { useState } from 'react';
import { 
  TrendingUp, Plus, Search, Filter, Clock3, CheckCircle2, 
  ArrowRight, DollarSign, Calendar, FileText, Check, Tag, Sparkles
} from 'lucide-react';

export default function SalesView({ 
  leads = [], 
  quotes = [], 
  setLeads, 
  setQuotes, 
  setModal, 
  notify 
}) {
  const [tab, setTab] = useState('Pipeline board (#3)');

  const pipelineStages = [
    { id: 'New lead', label: '1. New Leads', color: 'blue' },
    { id: 'Contacted', label: '2. Contacted', color: 'amber' },
    { id: 'Site visit', label: '3. Site Assessment (#14)', color: 'violet' },
    { id: 'Quoted', label: '4. Quoted (#9)', color: 'teal' },
    { id: 'Won', label: '5. Won / Approved', color: 'green' }
  ];

  return (
    <div className="sales-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">SALES ENGINE & REVENUE INTAKE (#3, #9, #10, #11)</div>
          <h1>Sales Pipeline & Proposals</h1>
          <p>Track leads from initial web/phone contact, schedule on-site assessments, and deliver Good/Better/Best quotes.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => setModal('lead')}>
            <Plus size={16}/> Add Lead (#3)
          </button>
          <button className="button button-primary" onClick={() => setModal('quote')}>
            <Plus size={16}/> Create Quote (#9)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['Pipeline board (#3)', 'Quotes & Proposals (#9)', 'Quote Follow-ups (#11)', 'Consumer Financing (#12)'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Pipeline Board */}
      {tab === 'Pipeline board (#3)' && (
        <div className="kanban-stage-board">
          {pipelineStages.map(st => {
            const stageLeads = leads.filter(l => l.stage === st.id);
            return (
              <div key={st.id} className="kanban-column">
                <div className="kanban-col-header">
                  <div>
                    <span className={`col-dot ${st.color}`}/>
                    <strong>{st.label}</strong>
                    <span className="col-count">{stageLeads.length}</span>
                  </div>
                </div>

                <div className="kanban-col-cards">
                  {stageLeads.map(lead => (
                    <div key={lead.id} className="kanban-card">
                      <div className="kcard-top">
                        <span className="job-id">{lead.id}</span>
                        <span className={`trade-pill ${lead.trade?.toLowerCase()}`}>{lead.trade}</span>
                      </div>
                      <strong className="kcard-title">{lead.title}</strong>
                      <div className="kcard-customer">
                        <span>{lead.customer} · {lead.phone}</span>
                      </div>
                      <div className="kcard-address">
                        <Tag size={12}/>
                        <span>Source: {lead.source}</span>
                      </div>
                      <div className="kcard-footer">
                        <span className="lead-owner-text">Owner: {lead.owner}</span>
                        <strong className="kcard-price">{lead.budget}</strong>
                      </div>
                      <div className="lead-followup-chip">
                        <Clock3 size={11}/>
                        <span>Follow-up: {lead.nextFollowUp}</span>
                      </div>
                    </div>
                  ))}
                  {!stageLeads.length && (
                    <div className="kanban-empty"><span>No active leads</span></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Quotes & Proposals (#9, #10) */}
      {tab === 'Quotes & Proposals (#9)' && (
        <div className="surface" style={{ borderRadius: '9px', overflow: 'hidden' }}>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>QUOTE ID</th>
                  <th>CUSTOMER</th>
                  <th>TRADE & SCOPE</th>
                  <th>PROPOSAL TIERS</th>
                  <th>RECOMMENDED TOTAL</th>
                  <th>DEPOSIT REQUIRED</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(q => (
                  <tr key={q.id}>
                    <td><strong className="job-id">{q.id}</strong></td>
                    <td><strong>{q.customer}</strong></td>
                    <td>
                      <span className={`trade-badge ${q.trade?.toLowerCase()}`}>{q.trade}</span>
                      <span style={{ marginLeft: '6px', fontSize: '11px', color: '#44546a' }}>{q.title}</span>
                    </td>
                    <td>
                      <div className="quote-tiers-badge-row">
                        {q.options?.map(opt => (
                          <span key={opt.name} className={`tier-badge-pill ${opt.recommended ? 'rec' : ''}`}>
                            {opt.name.split(' ')[0]}: ${opt.price}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td><strong style={{ color: '#27364a', fontSize: '12px' }}>${Number(q.total).toLocaleString()}</strong></td>
                    <td><strong>${Number(q.depositRequired || 0).toLocaleString()}</strong></td>
                    <td>
                      <span className={`status-pill ${q.status.includes('Approved') ? 'status-scheduled' : 'status-progress'}`}>
                        <i/> {q.status}
                      </span>
                    </td>
                    <td>
                      <button className="button button-quiet button-small" onClick={() => notify?.(`Opening customer e-sign proposal view for ${q.id}`)}>
                        View Proposal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Quote Follow-ups (#11) */}
      {tab === 'Quote Follow-ups (#11)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '16px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Automated Quote Follow-Up Sequences (#11)</h2>
              <p>Smart timing rules send SMS and email check-ins only during business hours to customers with pending quotes.</p>
            </div>
            <button className="button button-quiet button-small" onClick={() => notify?.('Follow-up schedule settings opened')}>
              Configure Rules (#11)
            </button>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>PROPOSAL</th>
                  <th>CUSTOMER & PHONE</th>
                  <th>STATUS</th>
                  <th>FIRST VIEWED</th>
                  <th>LAST REMINDER</th>
                  <th>NEXT AUTOMATION</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>QUO-160 · Backflow Rebuild</strong></td>
                  <td>Marcus Reed · (737) 555-0162 (SMS verified)</td>
                  <td><span className="status-pill status-progress"><i/> Opened 2x</span></td>
                  <td>Yesterday, 2:10 PM</td>
                  <td>Auto-Reminder 1 sent</td>
                  <td><strong>Tomorrow at 10:00 AM (SMS)</strong></td>
                  <td>
                    <button className="button button-quiet button-small" onClick={() => notify?.('Sent one-click friendly check-in text')}>
                      Send Text Now
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><strong>QUO-148 · Ductless Mini-Split</strong></td>
                  <td>James Park · (512) 555-0144 (SMS verified)</td>
                  <td><span className="status-pill status-attention"><i/> Not opened yet</span></td>
                  <td>Nov 16, 2026</td>
                  <td>Initial email sent</td>
                  <td><strong>Friday at 11:30 AM (Email)</strong></td>
                  <td>
                    <button className="button button-quiet button-small" onClick={() => notify?.('Resending proposal link via SMS')}>
                      Resend via SMS
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Consumer Financing (#12) */}
      {tab === 'Consumer Financing (#12)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '20px' }}>
          <div className="surface-header">
            <div>
              <h2>Integrated Consumer Financing (#12)</h2>
              <p>Offer instant point-of-sale monthly financing (Wisetack / Acorn) inside customer proposals.</p>
            </div>
            <span className="status-pill status-scheduled">Lender Partner Connected</span>
          </div>

          <div className="financing-hero-card">
            <div className="financing-copy">
              <h3>Boost High-Ticket Replacements</h3>
              <p>Show "As low as $129/mo" on quotes over $1,000. Customer receives instant soft-credit approval with no hard hit.</p>
              <div className="financing-stats-row">
                <div><span>Average Ticket Lift</span> <strong>+34%</strong></div>
                <div><span>Approval Rate</span> <strong>89%</strong></div>
                <div><span>Contractor Payout</span> <strong>Next Business Day</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

