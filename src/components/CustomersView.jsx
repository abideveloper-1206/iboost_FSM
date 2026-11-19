import React, { useState } from 'react';
import { 
  Users, Plus, Search, Filter, ShieldCheck, CheckCircle2, 
  ArrowUpRight, ArrowRight, MapPin, Phone, Mail, Building, FileText
} from 'lucide-react';

export default function CustomersView({ 
  customers = [], 
  setCustomers, 
  setModal, 
  notify 
}) {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = customers.filter(c => {
    const matchFilter = filter === 'All' || 
      (filter === 'Commercial' && c.type === 'Commercial') ||
      (filter === 'Active plan' && c.badge === 'Active plan');
    const matchSearch = `${c.name} ${c.phone} ${c.billingAddress} ${c.email}`.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="customers-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">CUSTOMER RELATIONSHIPS (#1, #2, #4, #5, #7)</div>
          <h1>Customers & Service Locations</h1>
          <p>Multi-location commercial and residential accounts, separate bill-to entities, and verified SMS channels.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => window.open('/customer-portal', '_blank', 'noopener,noreferrer')}>
            <ArrowUpRight size={15}/> Customer Portal Preview (#7)
          </button>
          <button className="button button-quiet" onClick={() => setModal('import')}>
            Import CSV (#83)
          </button>
          <button className="button button-primary" onClick={() => setModal('customer')}>
            <Plus size={16}/> Add Customer (#1)
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['All', 'Commercial', 'Active plan'].map(f => (
            <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {f === 'All' ? 'All Customers' : f}
            </button>
          ))}
        </div>
        <div className="module-tools">
          <div className="dispatch-search" style={{ width: '220px' }}>
            <Search size={15}/>
            <input placeholder="Search name, phone, address..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="surface" style={{ borderRadius: '9px', overflow: 'hidden' }}>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>CUSTOMER / ENTITY</th>
                <th>PHONE & SMS STATUS (#1, #4)</th>
                <th>ACCOUNT TYPE</th>
                <th>SERVICE SITES (#1)</th>
                <th>JOBS DONE</th>
                <th>LIFETIME SPENT</th>
                <th>LAST SERVICE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id || c.name} onClick={() => setSelectedCustomer(c)}>
                  <td>
                    <div className="table-person">
                      <div className={`avatar avatar-${c.color || 'blue'}`}>{c.initials}</div>
                      <span>
                        <strong>{c.name}</strong>
                        <small>{c.company ? `${c.company} · ` : ''}{c.email}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{c.phone}</strong>
                      <small style={{ display: 'block', color: c.smsConsent ? '#34a994' : '#d99c45', fontSize: '10px' }}>
                        <CheckCircle2 size={10} style={{ display: 'inline', marginRight: '3px' }}/>
                        {c.lineType}
                      </small>
                    </div>
                  </td>
                  <td>
                    <span className={`customer-type ${c.type === 'Commercial' ? 'commercial' : ''}`}>
                      {c.type}
                    </span>
                  </td>
                  <td>
                    <strong>{c.locations?.length || 1} Property Sites</strong>
                    <small style={{ display: 'block', color: '#8898aa', fontSize: '10px' }}>
                      {c.locations?.[0]?.street || c.billingAddress?.split(',')[0]}
                    </small>
                  </td>
                  <td><strong>{c.jobs}</strong></td>
                  <td><strong style={{ color: '#27364a' }}>{c.spent}</strong></td>
                  <td>{c.last}</td>
                  <td>
                    <button className="button button-quiet button-small" onClick={e => { e.stopPropagation(); setSelectedCustomer(c); }}>
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Customer Drawer */}
      {selectedCustomer && (
        <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setSelectedCustomer(null)}>
          <div className="detail-panel" style={{ width: 'min(580px, 100%)' }}>
            <div className="detail-top">
              <button className="back-button" onClick={() => setSelectedCustomer(null)}>
                ← Back to customer list
              </button>
              <span className="detail-id">{selectedCustomer.id} · {selectedCustomer.badge}</span>
            </div>

            <h2>{selectedCustomer.name}</h2>
            {selectedCustomer.company && <p className="detail-customer">Bill-To Entity: <strong>{selectedCustomer.company}</strong></p>}

            <div className="customer-contact-grid">
              <div><span>Phone:</span> <strong>{selectedCustomer.phone}</strong> ({selectedCustomer.lineType})</div>
              <div><span>Email:</span> <strong>{selectedCustomer.email}</strong></div>
              <div><span>Billing Address:</span> <strong>{selectedCustomer.billingAddress}</strong></div>
              <div><span>Lifetime Spend:</span> <strong style={{ color: '#34a994' }}>{selectedCustomer.spent}</strong></div>
            </div>

            <div className="detail-section">
              <h3><span>PROPERTIES & LOCATIONS (#1)</span></h3>
              {selectedCustomer.locations?.map(loc => (
                <div key={loc.id} className="surface" style={{ padding: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={15} style={{ color: '#3883eb' }}/>
                    <div>
                      <strong>{loc.nickname}</strong>
                      <small style={{ display: 'block', color: '#68778d' }}>{loc.street}, {loc.city}, {loc.state} {loc.zip}</small>
                      {loc.gateCode && <small style={{ color: '#d99c45' }}>Access code: {loc.gateCode}</small>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="detail-actions">
              <button className="button button-quiet" onClick={() => setSelectedCustomer(null)}>Close</button>
              <button className="button button-primary" onClick={() => { setModal('job'); setSelectedCustomer(null); }}>
                Book Job for Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

