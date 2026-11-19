import React, { useState } from 'react';
import { 
  Package, Plus, Search, Filter, AlertCircle, Truck, 
  CheckCircle2, ArrowRight, RefreshCw, Download
} from 'lucide-react';

export default function StockTrucksView({ 
  inventory = [], 
  setInventory, 
  setModal, 
  notify 
}) {
  const [tab, setTab] = useState('All inventory');
  const [search, setSearch] = useState('');

  const filtered = inventory.filter(item => {
    const matchTab = tab === 'All inventory' || 
      (tab === 'Low stock alerts (#77)' && item.status === 'Low stock') ||
      (tab === 'Truck inventories (#49)' && item.truckQty > 0);
    const matchSearch = `${item.code} ${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="stock-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">SUPPLY CHAIN & FLEET STOCK (#49, #62, #77)</div>
          <h1>Inventory & Truck Replenishment</h1>
          <p>Track warehouse inventory, parts carried in technician service vans, and automate supplier replenishment.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => notify?.('Simulated purchase order created for low-stock supplier (#62)')}>
            Create PO (#62)
          </button>
          <button className="button button-primary" onClick={() => setModal('part')}>
            <Plus size={16}/> Add Part SKU (#77)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['All inventory', 'Truck inventories (#49)', 'Low stock alerts (#77)', 'Purchase Orders & Suppliers (#62)'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="module-tools">
          <div className="dispatch-search">
            <Search size={15}/>
            <input placeholder="Search SKU, part name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Tab: Purchase Orders */}
      {tab === 'Purchase Orders & Suppliers (#62)' ? (
        <div className="surface" style={{ borderRadius: '9px', padding: '16px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Supplier Purchase Orders & 3-Way Match (#62)</h2>
              <p>Reconcile purchase orders against parts received and supplier bills.</p>
            </div>
            <button className="button button-primary button-small" onClick={() => notify?.('New supplier purchase order started')}>
              + New Purchase Order
            </button>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>PO NUMBER</th>
                  <th>SUPPLIER</th>
                  <th>ITEMS</th>
                  <th>DESTINATION</th>
                  <th>TOTAL VALUE</th>
                  <th>EXPECTED DATE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>PO-2026-88</code></td>
                  <td>Johnstone Supply Austin</td>
                  <td>12x Air Filters 20x25x4, 4x Capacitors</td>
                  <td>Central Warehouse A</td>
                  <td><strong>$328.00</strong></td>
                  <td>Tomorrow</td>
                  <td><span className="status-pill status-progress">Partially Received</span></td>
                </tr>
                <tr>
                  <td><code>PO-2026-84</code></td>
                  <td>Ferguson Waterworks</td>
                  <td>2x Febco 1-Inch Backflow Kits</td>
                  <td>Truck 03 (Taylor)</td>
                  <td><strong>$190.00</strong></td>
                  <td>Nov 17, 2026</td>
                  <td><span className="status-pill status-scheduled">Matched & Paid</span></td>
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
                  <th>PART SKU</th>
                  <th>ITEM NAME</th>
                  <th>TRADE</th>
                  <th>WAREHOUSE QTY</th>
                  <th>TRUCK STOCK (#49)</th>
                  <th>REORDER POINT (#77)</th>
                  <th>UNIT COST</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id}>
                    <td><code>{item.code}</code></td>
                    <td><strong>{item.name}</strong></td>
                    <td><span className={`trade-badge ${item.category.toLowerCase()}`}>{item.category}</span></td>
                    <td><strong>{item.warehouseQty} in stock</strong></td>
                    <td>
                      <span className="truck-qty-badge">
                        <Truck size={12}/> {item.truckQty} across trucks
                      </span>
                    </td>
                    <td>{item.minReorder} min</td>
                    <td><strong>${Number(item.unitCost).toFixed(2)}</strong></td>
                    <td>
                      <span className={`status-pill ${item.status === 'Low stock' ? 'status-attention' : 'status-scheduled'}`}>
                        <i/> {item.status}
                      </span>
                    </td>
                    <td>
                      <button className="button button-quiet button-small" onClick={() => notify?.(`Transfer request created for ${item.name}`)}>
                        Transfer to Truck
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

