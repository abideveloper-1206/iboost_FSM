import React, { useState } from 'react';
import { 
  Tag, Plus, Search, Filter, DollarSign, TrendingUp, 
  CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Layers
} from 'lucide-react';

export default function PricebookView({ 
  pricebook = [], 
  setPricebook, 
  setModal, 
  notify 
}) {
  const [tab, setTab] = useState('All items');
  const [search, setSearch] = useState('');

  const filtered = pricebook.filter(item => {
    const matchTab = tab === 'All items' || 
      (tab === 'Services' && item.type === 'Service') ||
      (tab === 'Materials' && item.type === 'Material');
    const matchSearch = `${item.code} ${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="pricebook-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">FLAT-RATE PRICING & MARGIN GUARDRAILS (#6, #22, #74)</div>
          <h1>Flat-Rate Pricebook Catalogue</h1>
          <p>Standardized service pricing, parts markup, customer contract rate sheets, and regional market benchmarks.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => notify?.('New customer contract rate sheet created (#6)')}>
            + Rate Sheet (#6)
          </button>
          <button className="button button-primary" onClick={() => setModal('pricebook')}>
            <Plus size={16}/> Add Pricebook Item (#74)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['All items', 'Services', 'Materials', 'Customer Rate Sheets (#6)', 'Regional Benchmarks (#22)'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="module-tools">
          <div className="dispatch-search">
            <Search size={15}/>
            <input placeholder="Search services, parts, codes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Tab: Customer Rate Sheets */}
      {tab === 'Customer Rate Sheets (#6)' ? (
        <div className="surface" style={{ borderRadius: '9px', padding: '16px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Client-Specific Pricing & Rate Sheets (#6)</h2>
              <p>Special contract pricing, labor discounts, and fixed rates automatically applied for commercial clients.</p>
            </div>
            <button className="button button-primary button-small" onClick={() => notify?.('Create rate sheet wizard opened')}>
              + New Contract Rate Sheet
            </button>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>RATE SHEET NAME</th>
                  <th>APPLIES TO CUSTOMER</th>
                  <th>DISCOUNT / OVERRIDE RULE</th>
                  <th>VALID PERIOD</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Commercial Property Partner Tier</strong></td>
                  <td>Cedar Grove Homes (All 16 sites)</td>
                  <td>15% off standard labor · Fixed $110/hr diagnostic</td>
                  <td>Jan 2026 - Dec 2027</td>
                  <td><span className="status-pill status-scheduled">Active</span></td>
                  <td><button className="button button-quiet button-small" onClick={() => notify?.('Rate sheet rules opened')}>Edit Rules</button></td>
                </tr>
                <tr>
                  <td><strong>Dental Clinic Preferred Rate</strong></td>
                  <td>Willow Creek Dental</td>
                  <td>10% off electrical parts & preventive maintenance</td>
                  <td>Annual Renewable</td>
                  <td><span className="status-pill status-scheduled">Active</span></td>
                  <td><button className="button button-quiet button-small" onClick={() => notify?.('Rate sheet rules opened')}>Edit Rules</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : tab === 'Regional Benchmarks (#22)' ? (
        <div className="surface" style={{ borderRadius: '9px', padding: '20px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>AI Pricebook Benchmark Insights (#22)</h2>
              <p>Compare company rates against anonymized regional field service averages across Austin & Central Texas.</p>
            </div>
            <span className="metric-badge-status green"><Sparkles size={14}/> Market Verified</span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SERVICE ITEM</th>
                  <th>OUR PRICE</th>
                  <th>REGIONAL AVG</th>
                  <th>PRICE POSITION</th>
                  <th>AI RECOMMENDATION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>AC Comprehensive Tune-Up</strong></td>
                  <td><strong>$149.00</strong></td>
                  <td>$165.00</td>
                  <td><span className="metric-badge-status orange">10% Below Market</span></td>
                  <td>Consider adjusting to $169 with free filter replacement inclusion.</td>
                </tr>
                <tr>
                  <td><strong>Backflow Assembly Annual Test</strong></td>
                  <td><strong>$145.00</strong></td>
                  <td>$140.00</td>
                  <td><span className="metric-badge-status teal">Competitive</span></td>
                  <td>Price is optimal for municipal water compliance turnaround.</td>
                </tr>
                <tr>
                  <td><strong>Septic Tank Pumping (1,000 gal)</strong></td>
                  <td><strong>$550.00</strong></td>
                  <td>$585.00</td>
                  <td><span className="metric-badge-status green">Strong Value</span></td>
                  <td>High conversion rate; recommended to maintain.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Data Table */
        <div className="surface" style={{ borderRadius: '9px', overflow: 'hidden' }}>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>CODE</th>
                  <th>ITEM NAME & DESCRIPTION</th>
                  <th>TRADE</th>
                  <th>TYPE</th>
                  <th>UNIT</th>
                  <th>CUSTOMER PRICE</th>
                  <th>DIRECT COST</th>
                  <th>MARGIN %</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id}>
                    <td><code>{item.code}</code></td>
                    <td>
                      <strong>{item.name}</strong>
                      <small style={{ display: 'block', color: '#8898aa', fontSize: '10px' }}>{item.type} line item</small>
                    </td>
                    <td><span className={`trade-badge ${item.category.toLowerCase()}`}>{item.category}</span></td>
                    <td>{item.type}</td>
                    <td>{item.unit}</td>
                    <td><strong style={{ color: '#27364a' }}>${Number(item.price).toFixed(2)}</strong></td>
                    <td>${Number(item.cost).toFixed(2)}</td>
                    <td>
                      <span className="metric-badge-status green">
                        {item.margin}
                      </span>
                    </td>
                    <td>
                      <button className="button button-quiet button-small" onClick={() => notify?.(`Pricing editor for ${item.name} opened`)}>
                        Edit Price
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

