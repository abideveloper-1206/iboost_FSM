import React, { useState } from 'react';
import { 
  FileText, Download, Filter, Calendar, TrendingUp, DollarSign, 
  Users, CheckCircle2, ArrowRight, Printer, Share2, Layers
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function ReportsView({ notify, chartData }) {
  const [tab, setTab] = useState('Revenue & Job Costing (#64)');
  const [period, setPeriod] = useState('Month to Date');

  return (
    <div className="reports-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">INTELLIGENCE & PROFITABILITY (#64, #65, #66, #80)</div>
          <h1>Business Reports & Job Costing</h1>
          <p>Analyze gross margins, material and labor costs, technician billable hours, and marketing lead attribution.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => notify?.('Exporting reports to CSV format (#85)')}>
            <Download size={15}/> Export CSV
          </button>
          <button className="button button-quiet" onClick={() => notify?.('Preparing PDF executive report package')}>
            <Printer size={15}/> Export PDF
          </button>
          <button className="button button-primary" onClick={() => notify?.('Automated weekly report email scheduled')}>
            <Calendar size={15}/> Schedule Report (#66)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['Revenue & Job Costing (#64)', 'Technician Leaderboard', 'Marketing Attribution ROI (#80)', 'Custom Report Builder (#66)'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="module-tools">
          <div className="segmented">
            {['Today', 'This Week', 'Month to Date', 'Year to Date'].map(p => (
              <button key={p} className={period === p ? 'selected' : ''} onClick={() => setPeriod(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab 1: Job Costing & Profitability */}
      {tab === 'Revenue & Job Costing (#64)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '16px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Job Costing & Profitability Breakdown (#64)</h2>
              <p>Compare contract revenue with direct material parts, technician labor costs, and net margin %.</p>
            </div>
            <span className="metric-badge-status green">Target Margin: 55.0%</span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>JOB REF</th>
                  <th>TRADE</th>
                  <th>CUSTOMER</th>
                  <th>REVENUE</th>
                  <th>MATERIAL COST</th>
                  <th>LABOR COST</th>
                  <th>NET PROFIT</th>
                  <th>MARGIN %</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'JB-2048', trade: 'HVAC', cust: 'Sarah Mitchell', rev: 189.0, mat: 40.0, lab: 52.0, profit: 97.0, margin: '51.3%' },
                  { id: 'JB-2051', trade: 'Plumbing', cust: 'Cedar Grove Homes', rev: 1240.0, mat: 280.0, lab: 174.0, profit: 786.0, margin: '63.4%' },
                  { id: 'JB-2053', trade: 'Backflow', cust: 'Marcus Reed', rev: 285.0, mat: 45.0, lab: 49.0, profit: 191.0, margin: '67.0%' },
                  { id: 'JB-2061', trade: 'Septic', cust: 'Elena Rodriguez', rev: 550.0, mat: 60.0, lab: 120.0, profit: 370.0, margin: '67.3%' }
                ].map(r => (
                  <tr key={r.id}>
                    <td><strong className="job-id">{r.id}</strong></td>
                    <td><span className={`trade-badge ${r.trade.toLowerCase()}`}>{r.trade}</span></td>
                    <td><strong>{r.cust}</strong></td>
                    <td><strong style={{ color: '#27364a' }}>${r.rev.toFixed(2)}</strong></td>
                    <td>${r.mat.toFixed(2)}</td>
                    <td>${r.lab.toFixed(2)}</td>
                    <td><strong style={{ color: '#34a994' }}>${r.profit.toFixed(2)}</strong></td>
                    <td><span className="metric-badge-status green">{r.margin}</span></td>
                    <td><span className="status-pill status-scheduled">Above Target</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Technician Leaderboard */}
      {tab === 'Technician Leaderboard' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '16px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Technician Performance Leaderboard</h2>
              <p>Rankings by completed work orders, customer satisfaction rating, and revenue generated.</p>
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>TECHNICIAN</th>
                  <th>TRADE</th>
                  <th>JOBS DONE</th>
                  <th>BILLABLE HOURS</th>
                  <th>AVG TICKET</th>
                  <th>TOTAL REVENUE</th>
                  <th>RATING</th>
                </tr>
              </thead>
              <tbody>
                {chartData.techUtilization.map((t, idx) => (
                  <tr key={t.name}>
                    <td><strong style={{ color: '#3883eb' }}>#{idx + 1}</strong></td>
                    <td><strong>{t.name}</strong></td>
                    <td><span className={`trade-badge ${t.trade.toLowerCase()}`}>{t.trade}</span></td>
                    <td>28 completed</td>
                    <td>{t.hoursLogged} hrs ({t.billableRate})</td>
                    <td>$495.00</td>
                    <td><strong style={{ color: '#34a994' }}>{t.revenue}</strong></td>
                    <td><strong>★ {t.rating}</strong> (100% 5-star)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Marketing Attribution ROI (#80) */}
      {tab === 'Marketing Attribution ROI (#80)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '16px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Lead Source Revenue Attribution (#80)</h2>
              <p>Connect search ads, website widgets, and customer referrals directly to closed quotes and paid invoices.</p>
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>LEAD CHANNEL</th>
                  <th>INBOUND LEADS</th>
                  <th>CONVERTED TO JOBS</th>
                  <th>CONVERSION RATE</th>
                  <th>CLOSED REVENUE</th>
                  <th>AD SPEND</th>
                  <th>ROI MULTIPLIER</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { channel: 'Google Local Services Ads (#21)', leads: 48, jobs: 36, rate: '75.0%', rev: '$28,400', spend: '$1,200', roi: '23.6x' },
                  { channel: 'Contractor Public Website (#73)', leads: 38, jobs: 28, rate: '73.6%', rev: '$19,800', spend: '$350', roi: '56.5x' },
                  { channel: 'Customer Referrals (#25)', leads: 24, jobs: 21, rate: '87.5%', rev: '$16,200', spend: '$500 (Credits)', roi: '32.4x' },
                  { channel: 'Repeat Maintenance Members (#33)', leads: 32, jobs: 31, rate: '96.8%', rev: '$11,400', spend: '$0', roi: 'Infinite' }
                ].map(row => (
                  <tr key={row.channel}>
                    <td><strong>{row.channel}</strong></td>
                    <td>{row.leads}</td>
                    <td>{row.jobs}</td>
                    <td><span className="metric-badge-status green">{row.rate}</span></td>
                    <td><strong style={{ color: '#27364a' }}>{row.rev}</strong></td>
                    <td>{row.spend}</td>
                    <td><strong style={{ color: '#34a994' }}>{row.roi}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Custom Report Builder (#66) */}
      {tab === 'Custom Report Builder (#66)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '20px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Custom Report Builder (#66)</h2>
              <p>Select custom dimensions, metrics, date ranges, and schedule automated email deliveries.</p>
            </div>
            <button className="button button-primary button-small" onClick={() => notify?.('Custom report generated')}>
              Run Custom Query
            </button>
          </div>

          <div className="report-builder-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px', marginTop: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#43546b', marginBottom: '6px' }}>Data Entity</label>
              <CustomSelect 
                value="Invoices"
                options={[
                  { value: 'Jobs', label: 'Work Orders / Jobs' },
                  { value: 'Invoices', label: 'Invoices & Receivables' },
                  { value: 'Customers', label: 'Customer Accounts' },
                  { value: 'Equipment', label: 'Installed Assets' },
                  { value: 'Backflow', label: 'Backflow Compliance Registry' }
                ]}
                onChange={() => {}}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#43546b', marginBottom: '6px' }}>Group By</label>
              <CustomSelect 
                value="Technician"
                options={[
                  { value: 'Technician', label: 'Assigned Technician' },
                  { value: 'Trade', label: 'Trade Specialization' },
                  { value: 'LeadSource', label: 'Marketing Lead Source' },
                  { value: 'ZipCode', label: 'Service Area / ZIP Code' }
                ]}
                onChange={() => {}}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#43546b', marginBottom: '6px' }}>Date Filter</label>
              <CustomSelect 
                value="LastMonth"
                options={[
                  { value: 'LastMonth', label: 'Last 30 Days' },
                  { value: 'ThisQuarter', label: 'This Quarter' },
                  { value: 'YTD', label: 'Year to Date' }
                ]}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

