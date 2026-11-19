import React, { useState } from 'react';
import { 
  Blocks, Plus, Camera, Search, Filter, ShieldCheck, Clock3, AlertCircle, 
  Droplet, Flame, CheckCircle2, ChevronRight, Sparkles, MapPin, Award
} from 'lucide-react';

export default function EquipmentView({ 
  equipment = [], 
  setEquipment, 
  setModal, 
  notify 
}) {
  const [tab, setTab] = useState('All assets');
  const [search, setSearch] = useState('');

  const filtered = equipment.filter(eq => {
    const matchCategory = tab === 'All assets' || 
      (tab.includes('Backflow') && eq.category === 'Backflow') || 
      (tab.includes('Septic') && eq.category === 'Septic') ||
      (tab.includes('HVAC') && (eq.category === 'HVAC' || eq.category === 'Plumbing'));
    const matchSearch = `${eq.name} ${eq.customer} ${eq.brand} ${eq.model} ${eq.serial}`.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="equipment-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">ASSETS & COMPLIANCE (#2, #46, #89, #92)</div>
          <h1>Customer Equipment & System Registries</h1>
          <p>Track installed systems by location: serial numbers, warranties, annual backflow tests, and septic pumping intervals.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => setModal('equipment')}>
            <Camera size={15}/> Scan Nameplate (#46)
          </button>
          <button className="button button-primary" onClick={() => setModal('equipment')}>
            <Plus size={16}/> Add Equipment Asset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['All assets', 'HVAC & Plumbing Units', 'Backflow Prevention Register (#89)', 'Septic Tank Registry (#92)'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="module-tools">
          <div className="dispatch-search">
            <Search size={15}/>
            <input placeholder="Search brand, serial, site..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Backflow Specialized Notice */}
      {tab.includes('Backflow') && (
        <div className="trade-callout-box" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="trade-box-badge">BACKFLOW TEST TIMER & UTILITY SUBMISSION (#90, #91)</span>
              <p>Municipal water utilities (e.g. Austin Water, Round Rock) enforce mandatory annual testing within 5-10 business days of notice.</p>
            </div>
            <button className="button button-quiet button-small" onClick={() => notify?.('Utility submission queue: 3 tests pending upload')}>
              View Utility Submission Queue (#91)
            </button>
          </div>
        </div>
      )}

      {/* Septic Specialized Notice */}
      {tab.includes('Septic') && (
        <div className="trade-callout-box" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="trade-box-badge">SEPTIC TANK PUMPING INTERVAL REMINDERS (#92, #93)</span>
              <p>Residential & commercial septic systems require pumping every 3 to 5 years based on tank size and occupancy.</p>
            </div>
            <button className="button button-quiet button-small" onClick={() => notify?.('Disposal manifests exported for county health department')}>
              County Manifest Log (#93)
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="surface" style={{ borderRadius: '9px', overflow: 'hidden' }}>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ASSET / NAME</th>
                <th>CUSTOMER & LOCATION</th>
                <th>CATEGORY</th>
                <th>BRAND & MODEL</th>
                <th>SERIAL NUMBER</th>
                <th>WARRANTY / COMPLIANCE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(eq => (
                <tr key={eq.id}>
                  <td>
                    <div className="table-person">
                      <div className={`avatar avatar-${eq.category === 'Backflow' ? 'amber' : eq.category === 'Septic' ? 'green' : 'blue'}`}>
                        {eq.category.slice(0, 2)}
                      </div>
                      <span>
                        <strong>{eq.name}</strong>
                        <small>{eq.id}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    <strong>{eq.customer}</strong>
                    <small style={{ display: 'block', color: '#8898aa', fontSize: '10px' }}>{eq.location}</small>
                  </td>
                  <td>
                    <span className={`trade-badge ${eq.category?.toLowerCase()}`}>{eq.category}</span>
                  </td>
                  <td>
                    <strong>{eq.brand}</strong>
                    <small style={{ display: 'block', color: '#68778d', fontSize: '10px' }}>Model: {eq.model}</small>
                  </td>
                  <td><code>{eq.serial}</code></td>
                  <td>
                    {eq.category === 'Backflow' ? (
                      <div>
                        <strong style={{ color: '#d99c45' }}>Test Due: {eq.testDeadline || 'Dec 2026'}</strong>
                        <small style={{ display: 'block', color: '#8898aa', fontSize: '10px' }}>{eq.utilityName}</small>
                      </div>
                    ) : eq.category === 'Septic' ? (
                      <div>
                        <strong style={{ color: '#37a77a' }}>{eq.tankGallons || 1000} gal ({eq.lidDepth || '18"'} lid)</strong>
                        <small style={{ display: 'block', color: '#8898aa', fontSize: '10px' }}>Interval: {eq.pumpIntervalYears || 3} yrs</small>
                      </div>
                    ) : (
                      <div>
                        <strong>Mfg End: {eq.mfgWarrantyEnd}</strong>
                        <small style={{ display: 'block', color: '#8898aa', fontSize: '10px' }}>Installed {eq.installDate}</small>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`status-pill ${eq.status?.includes('active') ? 'status-scheduled' : 'status-attention'}`}>
                      <i/> {eq.status}
                    </span>
                  </td>
                  <td>
                    <button className="button button-quiet button-small" onClick={() => notify?.(`Opening service history for ${eq.name}`)}>
                      History
                    </button>
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

