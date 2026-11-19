import React, { useState } from 'react';
import { 
  CalendarDays, Users, CreditCard, Sparkles, Plus, ArrowUpRight, ArrowRight, 
  FileText, CheckCircle2, Inbox, TrendingUp, Clock3, MoreHorizontal, DollarSign, 
  Wrench, Activity, AlertCircle, ShieldCheck, Filter, ChevronDown, Check, Zap,
  BarChart3, PieChart, Layers, Droplets, Flame, Award, ChevronRight, X
} from 'lucide-react';

export default function DashboardView({ 
  jobs = [], 
  requests = [], 
  customers = [], 
  setActive, 
  setModal, 
  setSelected, 
  notify, 
  chartData 
}) {
  const [period, setPeriod] = useState('This Month');
  const [selectedTrade, setSelectedTrade] = useState('All Trades');
  const [activeChartTab, setActiveChartTab] = useState('revenue');

  // Computed metrics
  const scheduledCount = jobs.filter(j => j.status === 'Scheduled').length;
  const inProgressCount = jobs.filter(j => j.status === 'In progress' || j.status === 'En route').length;
  const completedJobs = jobs.filter(j => j.status === 'Completed');
  const completedCount = completedJobs.length;
  const totalRevenue = 69400; // Projected monthly

  const filteredJobs = selectedTrade === 'All Trades' 
    ? jobs 
    : jobs.filter(j => j.trade?.toLowerCase() === selectedTrade.toLowerCase());

  return (
    <div className="dashboard-view-wrap">
      {/* 1. Header & Quick Actions */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">IBOOST FSM · OPERATIONS COMMAND CENTER</div>
          <h1>Good morning, Alex</h1>
          <p>Real-time overview of field dispatch, trade performance, revenue analytics, and crew velocity.</p>
        </div>
        <div className="heading-actions">
          <div className="trade-quick-pill-filter">
            {['All Trades', 'HVAC', 'Plumbing', 'Backflow', 'Septic'].map(trade => (
              <button 
                key={trade}
                className={selectedTrade === trade ? 'active' : ''}
                onClick={() => { setSelectedTrade(trade); notify?.(`Showing ${trade} analytics`); }}
              >
                {trade}
              </button>
            ))}
          </div>
          <button className="button button-quiet" onClick={() => notify?.('Exporting executive KPI summary PDF')}>
            <FileText size={15}/> Export PDF
          </button>
          <button className="button button-primary" onClick={() => setModal('job')}>
            <Plus size={16}/> Create job
          </button>
        </div>
      </div>

      {/* 2. Top AI Recommendation Banner */}
      <div className="welcome-banner">
        <div className="welcome-icon">
          <Sparkles size={19}/>
        </div>
        <div>
          <strong>iBoost Intelligence Alert (#18, #24)</strong>
          <span>
            3 jobs in North Austin can be grouped to save <strong>42 min</strong> of drive time. 2 commercial quotes have not been answered in 4 days.
          </span>
        </div>
        <div className="welcome-right">
          <button className="button button-small" onClick={() => setActive('AI workspace')}>
            Review suggestions <ArrowRight size={13}/>
          </button>
        </div>
      </div>

      {/* 3. Primary KPI Metric Cards */}
      <section className="metric-grid">
        <div className="surface metric-card">
          <div className="metric-top">
            <div className="metric-icon metric-blue"><CalendarDays size={17}/></div>
            <span className="metric-mini-tag">ACTIVE DISPATCH</span>
          </div>
          <span className="metric-label">Jobs Scheduled</span>
          <div className="metric-value-row">
            <strong>{jobs.length}</strong>
            <span className="metric-badge-status green">{inProgressCount} in field</span>
          </div>
          <div className="metric-foot">
            <span className="metric-delta"><ArrowUpRight size={13}/> +12%</span>
            <span>vs previous week</span>
          </div>
        </div>

        <div className="surface metric-card">
          <div className="metric-top">
            <div className="metric-icon metric-violet"><DollarSign size={17}/></div>
            <span className="metric-mini-tag">MONTH TO DATE</span>
          </div>
          <span className="metric-label">Gross Revenue</span>
          <div className="metric-value-row">
            <strong>$69,400</strong>
            <span className="metric-badge-status purple">Margin: 59.2%</span>
          </div>
          <div className="metric-foot">
            <span className="metric-delta"><ArrowUpRight size={13}/> +14.2%</span>
            <span>$41.1k net profit</span>
          </div>
        </div>

        <div className="surface metric-card">
          <div className="metric-top">
            <div className="metric-icon metric-teal"><Users size={17}/></div>
            <span className="metric-mini-tag">CREW EFFICIENCY</span>
          </div>
          <span className="metric-label">Technician Billable Rate</span>
          <div className="metric-value-row">
            <strong>88.4%</strong>
            <span className="metric-badge-status teal">4 active trucks</span>
          </div>
          <div className="metric-foot">
            <span className="metric-delta"><ArrowUpRight size={13}/> 4.9 ★</span>
            <span>Customer satisfaction</span>
          </div>
        </div>

        <div className="surface metric-card">
          <div className="metric-top">
            <div className="metric-icon metric-amber"><Inbox size={17}/></div>
            <span className="metric-mini-tag">CONVERSION</span>
          </div>
          <span className="metric-label">Open Leads & Requests</span>
          <div className="metric-value-row">
            <strong>{requests.length || 6}</strong>
            <span className="metric-badge-status orange">94% high score</span>
          </div>
          <div className="metric-foot">
            <span className="metric-delta"><ArrowUpRight size={13}/> 57.7%</span>
            <span>Quote closing rate</span>
          </div>
        </div>
      </section>

      {/* 4. Rich Interactive Visual Analytics & Charts Section */}
      <section className="surface charts-panel-card">
        <div className="charts-card-header">
          <div>
            <h2>Operations & Revenue Analytics</h2>
            <p>Interactive breakdown of monthly cash flow, trade distribution, and sales conversion.</p>
          </div>
          <div className="charts-tab-controls">
            <div className="segmented">
              <button 
                className={activeChartTab === 'revenue' ? 'selected' : ''} 
                onClick={() => setActiveChartTab('revenue')}
              >
                Revenue & Cost Trend
              </button>
              <button 
                className={activeChartTab === 'trades' ? 'selected' : ''} 
                onClick={() => setActiveChartTab('trades')}
              >
                Revenue by Trade
              </button>
              <button 
                className={activeChartTab === 'funnel' ? 'selected' : ''} 
                onClick={() => setActiveChartTab('funnel')}
              >
                Sales Funnel
              </button>
              <button 
                className={activeChartTab === 'aging' ? 'selected' : ''} 
                onClick={() => setActiveChartTab('aging')}
              >
                AR Aging & Cash
              </button>
            </div>
            <div className="segmented">
              {['This Month', 'Last 90 Days', 'Year to Date'].map(p => (
                <button 
                  key={p} 
                  className={period === p ? 'selected' : ''} 
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="charts-body">
          {activeChartTab === 'revenue' && (
            <div className="chart-revenue-view">
              <div className="chart-legend-row">
                <span><i className="legend-box blue"/> Revenue ($)</span>
                <span><i className="legend-box red"/> Operating & Labor Cost ($)</span>
                <span><i className="legend-box green"/> Net Profit Margin</span>
                <span className="chart-stat-right">Average Ticket Size: <strong>$384.20</strong></span>
              </div>

              {/* Responsive SVG Bar & Line Chart */}
              <div className="svg-chart-container">
                <svg viewBox="0 0 760 220" className="revenue-trend-svg">
                  {/* Grid Lines */}
                  <line x1="50" y1="30" x2="740" y2="30" stroke="#f0f3f7" strokeDasharray="3 3"/>
                  <line x1="50" y1="80" x2="740" y2="80" stroke="#f0f3f7" strokeDasharray="3 3"/>
                  <line x1="50" y1="130" x2="740" y2="130" stroke="#f0f3f7" strokeDasharray="3 3"/>
                  <line x1="50" y1="180" x2="740" y2="180" stroke="#e8edf3"/>

                  {/* Y Axis labels */}
                  <text x="40" y="34" className="chart-axis-text" textAnchor="end">$70k</text>
                  <text x="40" y="84" className="chart-axis-text" textAnchor="end">$50k</text>
                  <text x="40" y="134" className="chart-axis-text" textAnchor="end">$30k</text>
                  <text x="40" y="184" className="chart-axis-text" textAnchor="end">$10k</text>

                  {/* Bars for each month */}
                  {chartData.revenueTrend.map((d, i) => {
                    const x = 90 + i * 110;
                    const maxVal = 75000;
                    const revHeight = (d.revenue / maxVal) * 150;
                    const costHeight = (d.cost / maxVal) * 150;
                    return (
                      <g key={d.month} className="bar-group">
                        {/* Revenue Bar */}
                        <rect 
                          x={x} 
                          y={180 - revHeight} 
                          width="24" 
                          height={revHeight} 
                          rx="4" 
                          fill="#3883eb"
                        />
                        {/* Cost Bar */}
                        <rect 
                          x={x + 28} 
                          y={180 - costHeight} 
                          width="24" 
                          height={costHeight} 
                          rx="4" 
                          fill="#ff887d"
                        />
                        {/* X-axis label */}
                        <text x={x + 26} y="202" className="chart-label-text" textAnchor="middle">
                          {d.month}
                        </text>
                        {/* Hover hint */}
                        <text x={x + 26} y={170 - revHeight} className="chart-hover-text" textAnchor="middle">
                          ${(d.revenue / 1000).toFixed(1)}k
                        </text>
                      </g>
                    );
                  })}

                  {/* Profit Trend Line */}
                  <polyline
                    fill="none"
                    stroke="#34a994"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points="116,131 226,111 336,105 446,120 556,108 666,97"
                  />
                  {[
                    [116, 131], [226, 111], [336, 105], [446, 120], [556, 108], [666, 97]
                  ].map(([px, py], idx) => (
                    <circle key={idx} cx={px} cy={py} r="4" fill="#34a994" stroke="#fff" strokeWidth="2"/>
                  ))}
                </svg>
              </div>
            </div>
          )}

          {activeChartTab === 'trades' && (
            <div className="chart-trades-view">
              <div className="trades-donut-grid">
                <div className="donut-graphic-wrap">
                  <svg viewBox="0 0 180 180" className="donut-svg">
                    <circle cx="90" cy="90" r="70" fill="transparent" stroke="#f0f3f7" strokeWidth="24"/>
                    {/* HVAC 44% */}
                    <circle cx="90" cy="90" r="70" fill="transparent" stroke="#3883eb" strokeWidth="24" strokeDasharray="193 440" strokeDashoffset="0"/>
                    {/* Plumbing 22% */}
                    <circle cx="90" cy="90" r="70" fill="transparent" stroke="#8269db" strokeWidth="24" strokeDasharray="96 440" strokeDashoffset="-193"/>
                    {/* Backflow 14% */}
                    <circle cx="90" cy="90" r="70" fill="transparent" stroke="#e5a73e" strokeWidth="24" strokeDasharray="61 440" strokeDashoffset="-289"/>
                    {/* Septic 12% */}
                    <circle cx="90" cy="90" r="70" fill="transparent" stroke="#34a994" strokeWidth="24" strokeDasharray="52 440" strokeDashoffset="-350"/>
                    {/* Electrical 8% */}
                    <circle cx="90" cy="90" r="70" fill="transparent" stroke="#ef5b77" strokeWidth="24" strokeDasharray="35 440" strokeDashoffset="-402"/>
                  </svg>
                  <div className="donut-center-label">
                    <strong>$69.4k</strong>
                    <small>Total Volume</small>
                  </div>
                </div>

                <div className="trade-breakdown-list">
                  {chartData.tradeDistribution.map(t => (
                    <div key={t.trade} className="trade-bar-item">
                      <div className="trade-bar-top">
                        <span className="trade-name">
                          <i style={{ background: t.color }}/> {t.trade}
                        </span>
                        <strong>{t.value} ({t.share}%)</strong>
                      </div>
                      <div className="trade-bar-track">
                        <div style={{ width: `${t.share}%`, background: t.color }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeChartTab === 'funnel' && (
            <div className="chart-funnel-view">
              <div className="funnel-grid">
                {chartData.funnelData.map((f, idx) => (
                  <div key={f.stage} className="funnel-step-card">
                    <span className="funnel-step-num">0{idx + 1}</span>
                    <strong className="funnel-step-title">{f.stage}</strong>
                    <div className="funnel-metric">
                      <span className="funnel-count">{f.count}</span>
                      <span className="funnel-pct">{f.rate}</span>
                    </div>
                    <div className="funnel-step-bar">
                      <div style={{ width: f.rate }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeChartTab === 'aging' && (
            <div className="chart-aging-view">
              <div className="aging-grid">
                {chartData.invoiceAging.map(a => (
                  <div key={a.bucket} className="aging-card" style={{ borderTop: `4px solid ${a.color}` }}>
                    <span className="aging-bucket">{a.bucket}</span>
                    <strong className="aging-amount">{a.amount}</strong>
                    <span className="aging-count">{a.count} pending invoices</span>
                    <button 
                      className="button button-quiet button-small" 
                      onClick={() => setActive('Invoices')}
                    >
                      View invoices <ArrowRight size={12}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Dispatch Schedule & Live Crew Lane */}
      <section className="content-grid">
        <div className="surface schedule-card">
          <div className="surface-header">
            <div>
              <h2>Today's Live Dispatch Timeline</h2>
              <p>Active technician tracking, arrival windows, and job assignments.</p>
            </div>
            <div className="header-controls">
              <button className="button button-quiet button-small" onClick={() => setActive('Dispatch')}>
                Open Full Board <ArrowUpRight size={14}/>
              </button>
            </div>
          </div>

          <div className="dispatch-legend">
            <span><i className="legend-dot blue-dot"/> In progress <b>{inProgressCount}</b></span>
            <span><i className="legend-dot violet-dot"/> Upcoming <b>{scheduledCount}</b></span>
            <span><i className="legend-dot green-dot"/> Completed <b>{completedCount}</b></span>
          </div>

          <div className="table-scroll" style={{ marginTop: '12px' }}>
            <table className="data-table job-table">
              <thead>
                <tr>
                  <th>JOB ID</th>
                  <th>CUSTOMER</th>
                  <th>TRADE & SERVICE</th>
                  <th>TECHNICIAN</th>
                  <th>TIME WINDOW</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(j => (
                  <tr key={j.id} onClick={() => setSelected(j)}>
                    <td><strong className="job-id">{j.id}</strong></td>
                    <td>
                      <div className="table-person">
                        <div className={`avatar avatar-${j.color}`}>{j.initials}</div>
                        <span>
                          <strong>{j.customer}</strong>
                          <small>{j.address?.split(',')[1] || 'Austin, TX'}</small>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`trade-badge ${j.trade?.toLowerCase()}`}>
                        {j.trade}
                      </span>
                      <span style={{ marginLeft: '6px', fontSize: '11px', color: '#44546a' }}>{j.type}</span>
                    </td>
                    <td><strong>{j.tech}</strong></td>
                    <td>
                      <span className="table-time"><Clock3 size={13}/>{j.time}</span>
                    </td>
                    <td>
                      <span className={`status-pill ${j.status === 'In progress' ? 'status-progress' : j.status === 'En route' ? 'status-enroute' : 'status-scheduled'}`}>
                        <i/> {j.status}
                      </span>
                    </td>
                    <td>
                      <button className="button button-quiet button-small" onClick={e => { e.stopPropagation(); setSelected(j); }}>
                        Open View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Technician Fleet Status & AI Insights Sidebar */}
        <div className="dashboard-side-col">
          <div className="surface crew-card">
            <div className="surface-header">
              <div>
                <h2>Technician Fleet & Licenses</h2>
                <p>On-duty status & certifications (#94).</p>
              </div>
              <button className="text-action" onClick={() => setActive('Technicians')}>
                All Staff <ArrowRight size={13}/>
              </button>
            </div>

            <div className="crew-list">
              {chartData.techUtilization.map(t => (
                <div key={t.name} className="crew-row">
                  <div className="avatar avatar-blue">
                    {t.name.split(' ').map(x => x[0]).join('')}
                    <i/>
                  </div>
                  <div className="crew-detail">
                    <strong>{t.name} ({t.trade})</strong>
                    <small>★ {t.rating} · {t.billableRate} billable · {t.revenue}</small>
                  </div>
                  <span className="crew-status available">On shift</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-card" style={{ marginTop: '14px' }}>
            <div className="ai-card-top">
              <div className="ai-card-icon"><Sparkles size={17}/></div>
              <span>IBOOST AI OPTIMIZER</span>
              <span className="ai-live"><i/> LIVE</span>
            </div>
            <h3>Route Optimization Ready</h3>
            <p>Alex Morgan's 3 scheduled visits can be re-ordered to save <strong>42 minutes</strong> of transit across North Austin.</p>
            <button className="ai-insight-action" onClick={() => { setActive('Dispatch'); notify?.('Route optimized for Alex Morgan'); }}>
              Apply Route Suggestion <ArrowRight size={14}/>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

