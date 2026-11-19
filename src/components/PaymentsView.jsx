import React, { useState } from 'react';
import { 
  DollarSign, Plus, Search, Filter, CheckCircle2, CreditCard, 
  ArrowRight, ShieldCheck, Download, AlertCircle, RefreshCw
} from 'lucide-react';

export default function PaymentsView({ 
  payments = [], 
  setPayments, 
  setModal, 
  notify 
}) {
  const [tab, setTab] = useState('All transactions');
  const [search, setSearch] = useState('');

  const filtered = payments.filter(p => {
    const matchTab = tab === 'All transactions' || 
      (tab === 'Online Gateway' && p.method.includes('Online')) ||
      (tab === 'Cash & Cheque Ledger (#58)' && (p.method.includes('Cash') || p.method.includes('Cheque')));
    const matchSearch = `${p.id} ${p.customer} ${p.method} ${p.invoiceRef}`.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="payments-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">PAYMENT GATEWAYS & CASH RECONCILIATION (#54, #57, #58, #101)</div>
          <h1>Payments & Settlement</h1>
          <p>Online credit card & UPI gateway processing, field card readers, and physical cash/cheque handover ledger.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => notify?.('Processing simulated instant payout to merchant checking account (#57)')}>
            <RefreshCw size={15}/> Instant Payout (#57)
          </button>
          <button className="button button-primary" onClick={() => setModal('payment')}>
            <Plus size={16}/> Record Payment (#58)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['All transactions', 'Online Gateway', 'Cash & Cheque Ledger (#58)', 'Refunds & Disputes (#101)'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="module-tools">
          <div className="dispatch-search">
            <Search size={15}/>
            <input placeholder="Search payments, customers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Tab: Refunds & Disputes */}
      {tab === 'Refunds & Disputes (#101)' ? (
        <div className="surface" style={{ borderRadius: '9px', padding: '16px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Refunds, Credit Memos & Dispute Shield (#101)</h2>
              <p>Audit-logged adjustments, customer wallet credits, and chargeback evidence submission.</p>
            </div>
            <button className="button button-primary button-small" onClick={() => notify?.('Issue refund dialog opened')}>
              + Issue Credit Memo
            </button>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>REF #</th>
                  <th>ORIGINAL INVOICE</th>
                  <th>CUSTOMER</th>
                  <th>AMOUNT</th>
                  <th>REASON</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>RF-209</code></td>
                  <td>INV-1064</td>
                  <td>Marcus Reed</td>
                  <td><strong style={{ color: '#ef5b77' }}>-$45.00</strong></td>
                  <td>Part discount adjustment</td>
                  <td><span className="status-pill status-scheduled">Completed</span></td>
                  <td><button className="button button-quiet button-small" onClick={() => notify?.('Credit memo PDF generated')}>View Memo</button></td>
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
                  <th>TRANSACTION ID</th>
                  <th>INVOICE REF</th>
                  <th>CUSTOMER</th>
                  <th>METHOD</th>
                  <th>AMOUNT</th>
                  <th>TIP</th>
                  <th>NET SETTLED</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>SETTLEMENT</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td><strong className="job-id">{p.id}</strong></td>
                    <td><strong>{p.invoiceRef}</strong></td>
                    <td><strong>{p.customer}</strong></td>
                    <td>
                      <span className="payment-method-chip">
                        <CreditCard size={13}/> {p.method}
                      </span>
                    </td>
                    <td><strong style={{ color: '#27364a' }}>${Number(p.amount).toFixed(2)}</strong></td>
                    <td><strong style={{ color: '#34a994' }}>${Number(p.tip || 0).toFixed(2)}</strong></td>
                    <td><strong>${Number((p.amount || 0) + (p.tip || 0) - (p.fee || 0)).toFixed(2)}</strong></td>
                    <td>{p.date}</td>
                    <td>
                      <span className="status-pill status-scheduled"><i/> {p.status}</span>
                    </td>
                    <td>
                      <span className="payout-note">{p.payoutStatus}</span>
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

