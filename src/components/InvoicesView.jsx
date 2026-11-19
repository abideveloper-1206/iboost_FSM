import React, { useState } from 'react';
import { 
  CreditCard, Plus, Search, Filter, Clock3, CheckCircle2, 
  ArrowRight, DollarSign, Calendar, FileText, Check, AlertCircle, Download, Mail
} from 'lucide-react';

export default function InvoicesView({ 
  invoices = [], 
  setInvoices, 
  setModal, 
  notify 
}) {
  const [tab, setTab] = useState('All invoices');
  const [search, setSearch] = useState('');

  const filtered = invoices.filter(inv => {
    const matchTab = tab === 'All invoices' || 
      (tab === 'Open & Overdue' && (inv.status === 'Open' || inv.status === 'Overdue')) ||
      (tab === 'Paid invoices' && inv.status === 'Paid');
    const matchSearch = `${inv.id} ${inv.customer} ${inv.trade}`.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalOutstanding = invoices
    .filter(i => i.status !== 'Paid')
    .reduce((sum, i) => sum + (Number(i.balance) || 0), 0);

  return (
    <div className="invoices-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">BILLING & ACCOUNTS RECEIVABLE (#51, #52, #53, #102)</div>
          <h1>Invoices & Receivables</h1>
          <p>Deliver professional invoices with automatic tax jurisdiction, online payment links, and reminder sequences.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => notify?.('Batch invoicing wizard opened: 4 completed jobs ready (#52)')}>
            Batch Invoicing (#52)
          </button>
          <button className="button button-primary" onClick={() => setModal('invoice')}>
            <Plus size={16}/> Create Invoice (#51)
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="invoice-summary-strip">
        <div className="surface inv-stat-card">
          <span>TOTAL RECEIVABLES OUTSTANDING</span>
          <strong style={{ color: '#ef5b77' }}>${totalOutstanding.toFixed(2)}</strong>
          <small>Across {invoices.filter(i => i.status !== 'Paid').length} open invoices</small>
        </div>
        <div className="surface inv-stat-card">
          <span>COLLECTED THIS MONTH</span>
          <strong style={{ color: '#34a994' }}>$54,280.00</strong>
          <small>98.4% collection success rate</small>
        </div>
        <div className="surface inv-stat-card">
          <span>AVERAGE DAYS TO PAY</span>
          <strong style={{ color: '#3883eb' }}>4.2 Days</strong>
          <small>Instant online portal link</small>
        </div>
      </div>

      {/* Toolbar */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['All invoices', 'Open & Overdue', 'Paid invoices', 'AR Aging Buckets (#102)', 'Progress Billing Milestones (#53)'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="module-tools">
          <div className="dispatch-search">
            <Search size={15}/>
            <input placeholder="Search invoice #, customer..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {tab === 'AR Aging Buckets (#102)' ? (
        <div className="surface" style={{ borderRadius: '9px', padding: '16px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Accounts Receivable Aging Report (#102)</h2>
              <p>Segregation of overdue invoices into 0-15, 16-30, 31-60, and 60+ day buckets.</p>
            </div>
            <button className="button button-quiet button-small" onClick={() => notify?.('Exporting aging ledger for accounting')}>
              <Download size={14}/> Export Aging Ledger
            </button>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>AGING BRACKET</th>
                  <th>INVOICE COUNT</th>
                  <th>TOTAL VALUE</th>
                  <th>TOP OVERDUE CUSTOMER</th>
                  <th>AUTOMATED ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style={{ color: '#34a994' }}>Current (0 - 15 Days)</strong></td>
                  <td>18 invoices</td>
                  <td><strong>$14,820.00</strong></td>
                  <td>Cedar Grove Homes ($940.00)</td>
                  <td>Friendly SMS reminder scheduled at day 12</td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#3883eb' }}>16 - 30 Days Overdue</strong></td>
                  <td>6 invoices</td>
                  <td><strong>$4,120.00</strong></td>
                  <td>Willow Creek Dental ($320.00)</td>
                  <td>Notice 2 sent via email + payment link</td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#e5a73e' }}>31 - 60 Days Overdue</strong></td>
                  <td>3 invoices</td>
                  <td><strong>$1,840.00</strong></td>
                  <td>Peakside Apartments ($680.00)</td>
                  <td>Task created for office CSR to phone customer</td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#ef5b77' }}>60+ Days Overdue</strong></td>
                  <td>2 invoices</td>
                  <td><strong>$680.00</strong></td>
                  <td>Heritage Commercial ($680.00)</td>
                  <td>Service hold alert placed on property record</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : tab === 'Progress Billing Milestones (#53)' ? (
        <div className="surface" style={{ borderRadius: '9px', padding: '16px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Commercial Progress Billing & Pay Applications (#53)</h2>
              <p>Stage-based billing for multi-phase installations and commercial contracts.</p>
            </div>
            <button className="button button-primary button-small" onClick={() => notify?.('New progress billing schedule started')}>
              + New Payment Schedule
            </button>
          </div>

          <div className="progress-project-card">
            <div className="progress-project-head">
              <div>
                <strong>PRJ-401 · Willow Creek Multi-Zone Heat Pump Retrofit</strong>
                <small>Contract Value: $38,500.00 · Billed to Date: $23,100.00 (60%)</small>
              </div>
              <span className="status-pill status-progress"><i/> Phase 3 Active</span>
            </div>
            <div className="milestones-track">
              <div className="m-step done"><span>1. Deposit (30%)</span> <strong>$11,550 · Paid</strong></div>
              <div className="m-step done"><span>2. Rough-in (30%)</span> <strong>$11,550 · Paid</strong></div>
              <div className="m-step active"><span>3. Equipment Drop (20%)</span> <strong>$7,700 · Invoiced</strong></div>
              <div className="m-step"><span>4. Final Commissioning (20%)</span> <strong>$7,700 · Scheduled</strong></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="surface" style={{ borderRadius: '9px', overflow: 'hidden' }}>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>INVOICE #</th>
                  <th>CUSTOMER</th>
                  <th>TRADE</th>
                  <th>ISSUE DATE</th>
                  <th>DUE DATE</th>
                  <th>TOTAL</th>
                  <th>BALANCE DUE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id}>
                    <td><strong className="job-id">{inv.id}</strong></td>
                    <td><strong>{inv.customer}</strong></td>
                    <td><span className={`trade-badge ${inv.trade?.toLowerCase()}`}>{inv.trade}</span></td>
                    <td>{inv.issueDate}</td>
                    <td><strong>{inv.dueDate}</strong></td>
                    <td><strong>${Number(inv.amount).toFixed(2)}</strong></td>
                    <td>
                      <strong style={{ color: inv.balance > 0 ? '#ef5b77' : '#34a994' }}>
                        ${Number(inv.balance).toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <span className={`status-pill ${inv.status === 'Paid' ? 'status-scheduled' : inv.status === 'Overdue' ? 'status-attention' : 'status-progress'}`}>
                        <i/> {inv.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {inv.balance > 0 && (
                          <button className="button button-quiet button-small" onClick={() => setModal('payment')}>
                            Record Pay
                          </button>
                        )}
                        <button className="button button-quiet button-small" onClick={() => notify?.(`Payment link for ${inv.id} copied`)}>
                          Share Link
                        </button>
                      </div>
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

