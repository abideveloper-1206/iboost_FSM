import React, { useState } from 'react';
import { 
  Settings2, Building, Clock, MapPin, Users, ShieldCheck, 
  Tag, Calendar, MessageSquare, CreditCard, Layers, Download, Check, RefreshCw,
  Sliders, Plus, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight, FileSpreadsheet, Lock
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function SettingsView({ settings, setSettings, notify }) {
  const [section, setSection] = useState('company');

  // Company Profile State
  const [companyForm, setCompanyForm] = useState(settings?.company || {
    name: 'Northstar Field Services',
    legalName: 'Northstar Service Partners LLC',
    phone: '(512) 555-0100',
    email: 'contact@northstarservices.com',
    website: 'https://northstar.iboostfsm.com',
    address: '1400 Lavaca St, Austin, TX 78701',
    licenses: 'TACLB-19042A (HVAC) · TSBPE-M31902 (Plumbing) · TCEQ-BPAT-19284 (Backflow)',
    insurance: 'Commercial General Liability $2,000,000 (Travelers Insurance Policy #TRV-88219)',
    timeZone: 'America/Chicago (Central Time)',
    currency: 'USD ($)',
    hideAddress: false
  });

  // Hours & Territory State
  const [hoursConfig, setHoursConfig] = useState({
    workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    start: '7:30 AM',
    end: '6:00 PM',
    buffer: '30 minutes',
    emergencyOnCall: true,
    territories: 'North Austin, Cedar Park, Round Rock, Pflugerville, Leander, 78758, 78613, 78664'
  });

  // Tax Jurisdictions State
  const [taxRates, setTaxRates] = useState([
    { id: 'TX-1', jurisdiction: 'Travis County & Austin City', rate: 8.25, laborTaxable: false, materialTaxable: true, isDefault: true },
    { id: 'TX-2', jurisdiction: 'Williamson County (Round Rock / Cedar Park)', rate: 8.25, laborTaxable: false, materialTaxable: true, isDefault: false },
    { id: 'TX-3', jurisdiction: 'Commercial Direct (State-wide)', rate: 8.25, laborTaxable: true, materialTaxable: true, isDefault: false }
  ]);

  // Roles & Permissions State
  const [selectedRole, setSelectedRole] = useState('Technician');
  const [permissions, setPermissions] = useState({
    'Technician': { viewJobs: 'Assigned Only', viewCosts: false, editPrices: false, issueRefunds: false, accessSettings: false },
    'Dispatcher': { viewJobs: 'All Jobs', viewCosts: false, editPrices: true, issueRefunds: false, accessSettings: false },
    'Bookkeeper': { viewJobs: 'View Only', viewCosts: true, editPrices: false, issueRefunds: true, accessSettings: false },
    'Owner / Admin': { viewJobs: 'All Jobs', viewCosts: true, editPrices: true, issueRefunds: true, accessSettings: true }
  });

  // Trade Workflows State
  const [selectedTradeWorkflow, setSelectedTradeWorkflow] = useState('HVAC');
  const [workflowRules, setWorkflowRules] = useState({
    HVAC: { requirePhotos: true, requireSignature: true, requireChecklist: true },
    Backflow: { requireGaugeCalibration: true, requireTestReadings: true, requireSignature: true },
    Septic: { requireDepthMeasurement: true, requireGallonsPumped: true, requireManifestSignature: true }
  });

  // Billing & Payments State
  const [billingConfig, setBillingConfig] = useState({
    paymentTerms: 'Due on receipt',
    depositPct: 20,
    enableTips: true,
    enableSurcharge: true,
    surchargePct: 3.0,
    enableCashLedger: true
  });

  // Save feedback
  const handleSaveAll = () => {
    if (setSettings) {
      setSettings(prev => ({
        ...prev,
        company: companyForm,
        hours: hoursConfig,
        billing: billingConfig
      }));
    }
    notify?.('All tenant configuration settings saved to active workspace!');
  };

  const navItems = [
    { id: 'company', label: 'Company Profile & Branding', icon: Building },
    { id: 'hours', label: 'Hours & Service Territory (#15, #108)', icon: Clock },
    { id: 'tax', label: 'Regional & Sales Tax (#98)', icon: Tag },
    { id: 'roles', label: 'Roles & Granular Permissions (#8)', icon: ShieldCheck },
    { id: 'workflows', label: 'Trade Stages & Workflows (#75)', icon: Layers },
    { id: 'compliance', label: 'Messaging Compliance (#122)', icon: MessageSquare },
    { id: 'billing', label: 'Invoices & Payments Setup (#51)', icon: CreditCard },
    { id: 'integrations', label: 'QuickBooks & Integrations (#61)', icon: RefreshCw },
    { id: 'export', label: 'Data Export & iBoost Plan (#85, #119)', icon: Download }
  ];

  return (
    <div className="settings-module-wrap">
      {/* Top Heading */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">TENANT CONFIGURATION · SETTINGS ARCHITECTURE (DOCUMENT 3)</div>
          <h1>Tenant Administration & Settings</h1>
          <p>Configure company branding, trade workflows, compliance registrations, and accounting integrations.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-primary" onClick={handleSaveAll}>
            <Check size={16}/> Save Settings
          </button>
        </div>
      </div>

      <div className="settings-layout-grid">
        {/* Left Side Settings Navigation */}
        <div className="surface settings-nav-card">
          <div className="settings-nav-header">
            <strong>ADMIN SETTINGS MENU</strong>
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`settings-nav-btn ${section === item.id ? 'active' : ''}`}
                onClick={() => setSection(item.id)}
              >
                <Icon size={16}/>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side Settings Pane */}
        <div className="surface settings-content-card">
          {/* SECTION 1: Company Profile & Branding */}
          {section === 'company' && (
            <div className="settings-form-pane">
              <div className="pane-title-row">
                <div>
                  <h3>Company Profile & Branding (#1)</h3>
                  <p>These details appear on customer quotes, invoices, emails, and the public website.</p>
                </div>
                <div className="brand-logo-preview">
                  <div className="brand-mark-box">NS</div>
                  <span>Logo on PDFs</span>
                </div>
              </div>

              <div className="settings-fields-stack">
                <div className="field-row">
                  <div className="settings-field-group">
                    <label>Company Trading Name</label>
                    <input 
                      name="name" 
                      value={companyForm.name} 
                      onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })} 
                    />
                  </div>
                  <div className="settings-field-group">
                    <label>Legal Entity Name</label>
                    <input 
                      name="legalName" 
                      value={companyForm.legalName} 
                      onChange={e => setCompanyForm({ ...companyForm, legalName: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="settings-field-group">
                    <label>Business Phone Number</label>
                    <input 
                      name="phone" 
                      value={companyForm.phone} 
                      onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })} 
                    />
                  </div>
                  <div className="settings-field-group">
                    <label>Public Support Email</label>
                    <input 
                      name="email" 
                      type="email"
                      value={companyForm.email} 
                      onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="settings-field-group">
                  <label>Business Physical Address & Headquarters</label>
                  <input 
                    name="address" 
                    value={companyForm.address} 
                    onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })} 
                  />
                </div>

                <div className="settings-field-group">
                  <label>State Trade Licenses (Printed on Invoices & Reports)</label>
                  <input 
                    name="licenses" 
                    value={companyForm.licenses} 
                    onChange={e => setCompanyForm({ ...companyForm, licenses: e.target.value })} 
                  />
                  <small>Example: TACLB-19042A (HVAC) · TSBPE-M31902 (Plumbing) · TCEQ-BPAT-19284 (Backflow)</small>
                </div>

                <div className="settings-field-group">
                  <label>Commercial Insurance Policy Certificate</label>
                  <input 
                    name="insurance" 
                    value={companyForm.insurance} 
                    onChange={e => setCompanyForm({ ...companyForm, insurance: e.target.value })} 
                  />
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <strong>Keep Shop Physical Address Private</strong>
                    <small>Only display city, state, and phone on public estimates to prevent walk-ins.</small>
                  </div>
                  <button 
                    type="button"
                    className={`switch-control ${companyForm.hideAddress ? 'on' : ''}`}
                    onClick={() => setCompanyForm({ ...companyForm, hideAddress: !companyForm.hideAddress })}
                  >
                    <i/>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Hours & Territory */}
          {section === 'hours' && (
            <div className="settings-form-pane">
              <h3>Business Hours & Service Territory (#15, #108)</h3>
              <p>Controls bookable windows in the online widget and prevents after-hours dispatch conflicts.</p>

              <div className="settings-fields-stack">
                <div className="settings-field-group">
                  <label>Operating Days of the Week</label>
                  <div className="days-checkbox-group">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isActive = hoursConfig.workDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          className={`day-pill-btn ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            const next = isActive 
                              ? hoursConfig.workDays.filter(d => d !== day)
                              : [...hoursConfig.workDays, day];
                            setHoursConfig({ ...hoursConfig, workDays: next });
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="field-row">
                  <div className="settings-field-group">
                    <label>Opening Time</label>
                    <input 
                      value={hoursConfig.start}
                      onChange={e => setHoursConfig({ ...hoursConfig, start: e.target.value })}
                    />
                  </div>
                  <div className="settings-field-group">
                    <label>Closing Time</label>
                    <input 
                      value={hoursConfig.end}
                      onChange={e => setHoursConfig({ ...hoursConfig, end: e.target.value })}
                    />
                  </div>
                  <div className="settings-field-group">
                    <label>Buffer Between Jobs</label>
                    <input 
                      value={hoursConfig.buffer}
                      onChange={e => setHoursConfig({ ...hoursConfig, buffer: e.target.value })}
                    />
                  </div>
                </div>

                <div className="settings-field-group">
                  <label>Service Area Covered ZIP Codes & Municipalities (#108)</label>
                  <textarea 
                    rows="3"
                    value={hoursConfig.territories}
                    onChange={e => setHoursConfig({ ...hoursConfig, territories: e.target.value })}
                  />
                  <small>Addresses outside these zones will be flagged politely on online booking.</small>
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <strong>24/7 Emergency On-Call Rotation (#109)</strong>
                    <small>Route emergency calls and high-priority requests to the on-call tech roster.</small>
                  </div>
                  <button 
                    type="button"
                    className={`switch-control ${hoursConfig.emergencyOnCall ? 'on' : ''}`}
                    onClick={() => setHoursConfig({ ...hoursConfig, emergencyOnCall: !hoursConfig.emergencyOnCall })}
                  >
                    <i/>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Sales Tax */}
          {section === 'tax' && (
            <div className="settings-form-pane">
              <div className="pane-title-row">
                <div>
                  <h3>Regional & Sales Tax Jurisdictions (#98)</h3>
                  <p>Tax rates applied to invoices based on customer job service location.</p>
                </div>
                <button className="button button-quiet button-small" onClick={() => notify?.('New tax jurisdiction added')}>
                  + Add Tax Rate
                </button>
              </div>

              <div className="table-scroll" style={{ marginTop: '16px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>JURISDICTION NAME</th>
                      <th>RATE (%)</th>
                      <th>LABOR TAXABLE</th>
                      <th>MATERIAL TAXABLE</th>
                      <th>DEFAULT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxRates.map(t => (
                      <tr key={t.id}>
                        <td><strong>{t.jurisdiction}</strong></td>
                        <td><strong style={{ color: '#27364a' }}>{t.rate}%</strong></td>
                        <td>
                          <button 
                            className={`badge-toggle-btn ${t.laborTaxable ? 'on' : 'off'}`}
                            onClick={() => {
                              setTaxRates(taxRates.map(r => r.id === t.id ? { ...r, laborTaxable: !r.laborTaxable } : r));
                            }}
                          >
                            {t.laborTaxable ? 'Taxable' : 'Non-Taxable'}
                          </button>
                        </td>
                        <td>
                          <button 
                            className={`badge-toggle-btn ${t.materialTaxable ? 'on' : 'off'}`}
                            onClick={() => {
                              setTaxRates(taxRates.map(r => r.id === t.id ? { ...r, materialTaxable: !r.materialTaxable } : r));
                            }}
                          >
                            {t.materialTaxable ? 'Taxable' : 'Non-Taxable'}
                          </button>
                        </td>
                        <td>
                          {t.isDefault ? (
                            <span className="status-pill status-scheduled">Default</span>
                          ) : (
                            <button 
                              className="button button-quiet button-small"
                              onClick={() => {
                                setTaxRates(taxRates.map(r => ({ ...r, isDefault: r.id === t.id })));
                                notify?.(`Set ${t.jurisdiction} as default tax`);
                              }}
                            >
                              Make Default
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 4: Roles & Permissions */}
          {section === 'roles' && (
            <div className="settings-form-pane">
              <h3>Role-Based Permissions Grid (#8)</h3>
              <p>Granular access control enforcing who can see costs, edit prices, or issue refunds.</p>

              <div className="role-selector-bar">
                {['Owner / Admin', 'Dispatcher', 'Technician', 'Bookkeeper'].map(role => (
                  <button 
                    key={role}
                    type="button"
                    className={`role-tab-btn ${selectedRole === role ? 'active' : ''}`}
                    onClick={() => setSelectedRole(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="permissions-matrix-box">
                <div className="perm-row">
                  <div>
                    <strong>View Work Orders & Schedule</strong>
                    <small>Controls which customer visits are visible on calendar and app.</small>
                  </div>
                  <span className="perm-value-badge">{permissions[selectedRole]?.viewJobs}</span>
                </div>

                <div className="perm-row">
                  <div>
                    <strong>View Material Costs & Profit Margins (#8, #64)</strong>
                    <small>Hides gross margin and part cost rate from field staff.</small>
                  </div>
                  <button 
                    type="button"
                    className={`switch-control ${permissions[selectedRole]?.viewCosts ? 'on' : ''}`}
                    onClick={() => {
                      setPermissions({
                        ...permissions,
                        [selectedRole]: { ...permissions[selectedRole], viewCosts: !permissions[selectedRole].viewCosts }
                      });
                    }}
                  >
                    <i/>
                  </button>
                </div>

                <div className="perm-row">
                  <div>
                    <strong>Edit Flat-Rate Prices on Invoice</strong>
                    <small>Allow overriding pricebook catalogue pricing on site.</small>
                  </div>
                  <button 
                    type="button"
                    className={`switch-control ${permissions[selectedRole]?.editPrices ? 'on' : ''}`}
                    onClick={() => {
                      setPermissions({
                        ...permissions,
                        [selectedRole]: { ...permissions[selectedRole], editPrices: !permissions[selectedRole].editPrices }
                      });
                    }}
                  >
                    <i/>
                  </button>
                </div>

                <div className="perm-row">
                  <div>
                    <strong>Issue Customer Refunds & Credit Memos (#101)</strong>
                    <small>Permission to adjust payments and approve billing credits.</small>
                  </div>
                  <button 
                    type="button"
                    className={`switch-control ${permissions[selectedRole]?.issueRefunds ? 'on' : ''}`}
                    onClick={() => {
                      setPermissions({
                        ...permissions,
                        [selectedRole]: { ...permissions[selectedRole], issueRefunds: !permissions[selectedRole].issueRefunds }
                      });
                    }}
                  >
                    <i/>
                  </button>
                </div>

                <div className="perm-row">
                  <div>
                    <strong>Access Company Administration Settings</strong>
                    <small>Master permission to configure tax, users, and integrations.</small>
                  </div>
                  <button 
                    type="button"
                    className={`switch-control ${permissions[selectedRole]?.accessSettings ? 'on' : ''}`}
                    onClick={() => {
                      setPermissions({
                        ...permissions,
                        [selectedRole]: { ...permissions[selectedRole], accessSettings: !permissions[selectedRole].accessSettings }
                      });
                    }}
                  >
                    <i/>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: Trade Workflows */}
          {section === 'workflows' && (
            <div className="settings-form-pane">
              <h3>Trade Stages & Configurable Workflows (#75)</h3>
              <p>Specify the required technician actions before a work order can transition to Completed.</p>

              <div className="role-selector-bar">
                {['HVAC', 'Backflow', 'Septic'].map(tr => (
                  <button 
                    key={tr}
                    type="button"
                    className={`role-tab-btn ${selectedTradeWorkflow === tr ? 'active' : ''}`}
                    onClick={() => setSelectedTradeWorkflow(tr)}
                  >
                    {tr} Workflow
                  </button>
                ))}
              </div>

              {selectedTradeWorkflow === 'HVAC' && (
                <div className="workflow-stage-config">
                  <div className="stage-config-item">
                    <strong>1. Dispatch & Arrival</strong>
                    <span>Tech taps "On My Way" → GPS live tracking link sent to customer (#29).</span>
                  </div>
                  <div className="stage-config-item">
                    <strong>2. Mandatory Diagnostic Checklist</strong>
                    <span>Refrigerant pressures (psi), temperature delta, capacitor rating must be filled.</span>
                  </div>
                  <div className="stage-config-item">
                    <strong>3. Customer Sign-off & Invoicing</strong>
                    <span>Customer signature captured on mobile app before job completion is unlocked.</span>
                  </div>
                </div>
              )}

              {selectedTradeWorkflow === 'Backflow' && (
                <div className="workflow-stage-config">
                  <div className="stage-config-item">
                    <strong>1. BPAT License Verification (#90, #94)</strong>
                    <span>System verifies tester license & test kit gauge calibration are not expired.</span>
                  </div>
                  <div className="stage-config-item">
                    <strong>2. Digital Test Report Gauge Form</strong>
                    <span>Check Valve 1 & 2 pressure readings and relief valve opening psi logged.</span>
                  </div>
                  <div className="stage-config-item">
                    <strong>3. Water Utility Submission Queue (#91)</strong>
                    <span>Report auto-formatted for Austin Water / Round Rock city portal with deadline timer.</span>
                  </div>
                </div>
              )}

              {selectedTradeWorkflow === 'Septic' && (
                <div className="workflow-stage-config">
                  <div className="stage-config-item">
                    <strong>1. Tank Registry & Lid Access (#92)</strong>
                    <span>Lid depth and buried tank GPS coordinates displayed on technician app.</span>
                  </div>
                  <div className="stage-config-item">
                    <strong>2. Pumping Log & Depth Check (#93)</strong>
                    <span>Record gallons pumped, scum layer thickness, and inlet/outlet baffle condition.</span>
                  </div>
                  <div className="stage-config-item">
                    <strong>3. County Disposal Manifest Generation</strong>
                    <span>Auto-generates sludge hauler disposal manifest for approved county facility.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 6: Messaging Compliance */}
          {section === 'compliance' && (
            <div className="settings-form-pane">
              <h3>Messaging Compliance Center (#122)</h3>
              <p>A2P 10DLC carrier registration, customer consent records, and quiet-hours enforcement.</p>

              <div className="compliance-status-box">
                <div className="comp-row">
                  <span>A2P 10DLC Brand Registration:</span>
                  <strong style={{ color: '#34a994' }}>✅ Approved & Active (Campaign: Field Service Updates)</strong>
                </div>
                <div className="comp-row">
                  <span>Enforced Quiet Hours:</span>
                  <strong>8:00 PM to 8:00 AM (Customer Local Time)</strong>
                </div>
                <div className="comp-row">
                  <span>Automated STOP / START Keyword Handling:</span>
                  <strong style={{ color: '#3883eb' }}>Enabled (Carrier Verified)</strong>
                </div>
                <div className="comp-row">
                  <span>Landline Auto-Check Policy (#1, #8):</span>
                  <strong>Active (Routes to Email when Landline Detected)</strong>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: Invoices & Payments Setup */}
          {section === 'billing' && (
            <div className="settings-form-pane">
              <h3>Invoicing & Payment Defaults (#51, #54)</h3>
              <p>Payment gateways, advance deposit rules, and credit card convenience fees.</p>

              <div className="settings-fields-stack">
                <div className="field-row">
                  <div className="settings-field-group">
                    <label>Default Payment Terms</label>
                    <CustomSelect 
                      value={billingConfig.paymentTerms}
                      options={['Due on receipt', 'Net 15 Days', 'Net 30 Days']}
                      onChange={e => setBillingConfig({ ...billingConfig, paymentTerms: e.target.value })}
                    />
                  </div>
                  <div className="settings-field-group">
                    <label>Default Proposal Deposit % (#10)</label>
                    <input 
                      type="number"
                      value={billingConfig.depositPct}
                      onChange={e => setBillingConfig({ ...billingConfig, depositPct: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <strong>Allow Online Tipping (#54)</strong>
                    <small>Enable tip selection buttons (5%, 10%, 15%) on customer payment portal.</small>
                  </div>
                  <button 
                    type="button"
                    className={`switch-control ${billingConfig.enableTips ? 'on' : ''}`}
                    onClick={() => setBillingConfig({ ...billingConfig, enableTips: !billingConfig.enableTips })}
                  >
                    <i/>
                  </button>
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <strong>Credit Card Surcharge / Convenience Fee (#100)</strong>
                    <small>Pass 3.0% merchant card processing fee where legally permitted.</small>
                  </div>
                  <button 
                    type="button"
                    className={`switch-control ${billingConfig.enableSurcharge ? 'on' : ''}`}
                    onClick={() => setBillingConfig({ ...billingConfig, enableSurcharge: !billingConfig.enableSurcharge })}
                  >
                    <i/>
                  </button>
                </div>

                <div className="settings-toggle-row">
                  <div>
                    <strong>Manual Cash & Cheque Ledger (#58)</strong>
                    <small>Record field payments with technician-to-office handover confirmation.</small>
                  </div>
                  <button 
                    type="button"
                    className={`switch-control ${billingConfig.enableCashLedger ? 'on' : ''}`}
                    onClick={() => setBillingConfig({ ...billingConfig, enableCashLedger: !billingConfig.enableCashLedger })}
                  >
                    <i/>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: Integrations */}
          {section === 'integrations' && (
            <div className="settings-form-pane">
              <h3>Accounting & Connected Apps (#61, #21)</h3>
              <p>Connect QuickBooks Online, Google Local Services, and Zapier APIs.</p>

              <div className="integrations-list" style={{ marginTop: '16px' }}>
                <div className="integration-item surface">
                  <div>
                    <strong>QuickBooks Online Two-Way Sync (#61)</strong>
                    <small>Syncs invoices, customers, payments, and sales tax codes automatically.</small>
                  </div>
                  <span className="status-pill status-scheduled">Connected (Syncing)</span>
                </div>

                <div className="integration-item surface">
                  <div>
                    <strong>Google Local Services Ads (#21)</strong>
                    <small>Pulls Google Guaranteed booking requests directly into tenant Requests inbox.</small>
                  </div>
                  <span className="status-pill status-scheduled">Connected</span>
                </div>

                <div className="integration-item surface">
                  <div>
                    <strong>Stripe Connect Gateway (#54)</strong>
                    <small>Processes customer credit cards, Apple Pay, Google Pay, and instant payouts.</small>
                  </div>
                  <span className="status-pill status-scheduled">Live</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: Export & Plans */}
          {section === 'export' && (
            <div className="settings-form-pane">
              <h3>Export All Data & Plan Tiers (#85, #119)</h3>
              <p>Download complete customer, equipment, job, and invoice records in CSV format.</p>

              <div className="export-action-box" style={{ marginTop: '16px' }}>
                <div>
                  <strong>Complete Tenant Data Archive (#85)</strong>
                  <small>Download full ZIP archive with customers, jobs, invoices, and photos.</small>
                </div>
                <button 
                  className="button button-primary" 
                  onClick={() => notify?.('Full tenant data export initiated: download link sent to admin email')}
                >
                  <Download size={14}/> Export All CSV Data
                </button>
              </div>

              <div className="plan-tier-card" style={{ marginTop: '20px' }}>
                <span className="tier-tag rec-tag">CURRENT SUBSCRIPTION TIER (#119)</span>
                <h4>iBoost Field Service Pro ($149/mo)</h4>
                <p>Includes unlimited users, all 5 trade modules, AI Assistant, and two-way QuickBooks sync.</p>
                <div className="plan-usage-meter" style={{ marginTop: '12px' }}>
                  <div><span>Monthly SMS & AI Usage Meter</span> <strong>42% used</strong></div>
                  <div className="plan-progress"><i style={{ width: '42%' }}/></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
