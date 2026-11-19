import React, { useState } from 'react';
import { 
  X, Check, Plus, AlertCircle, Sparkles, Camera, Phone, Mail, MapPin, 
  DollarSign, Calendar, Clock, Wrench, ShieldCheck, Tag, Upload, 
  CheckCircle2, FileText, ChevronDown, Droplet, Flame, Zap, Package, RefreshCw
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export function ModalBackdrop({ children, onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      {children}
    </div>
  );
}

// 1. CREATE / EDIT JOB MODAL
export function JobModal({ onClose, onSave, customers = [], technicians = [], initialData = null }) {
  const [form, setForm] = useState(initialData || {
    customer: customers[0]?.name || 'Sarah Mitchell',
    trade: 'HVAC',
    type: 'AC Seasonal Tune-up',
    address: '1248 Oakridge Lane, North Austin, TX',
    tech: technicians[0]?.name || 'Alex Morgan',
    crew: 'Truck 01 (North Austin)',
    date: '2026-11-20',
    time: '8:00 AM - 10:00 AM',
    duration: '2h',
    priority: 'Normal',
    amount: 189.0,
    depositPaid: 0,
    paymentTerms: 'Due on completion',
    notes: '',
    tags: 'Maintenance plan',
    backflowAssembly: '',
    septicGallons: 1000,
    refrigerantType: 'R-410A'
  });

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const setField = (name, val) => setForm(prev => ({ ...prev, [name]: val }));

  const handleCustomerChange = name => {
    const cust = customers.find(c => c.name === name);
    setForm(prev => ({
      ...prev,
      customer: name,
      address: cust?.locations?.[0]?.street ? `${cust.locations[0].street}, ${cust.locations[0].city}, ${cust.locations[0].state}` : prev.address
    }));
  };

  const submit = () => {
    if (!form.customer.trim()) return;
    onSave({
      ...form,
      id: form.id || `JB-${Math.floor(2065 + Math.random() * 800)}`,
      status: 'Scheduled',
      stage: 'Scheduled',
      initials: form.customer.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase(),
      color: form.trade === 'HVAC' ? 'blue' : form.trade === 'Plumbing' ? 'violet' : form.trade === 'Backflow' ? 'amber' : 'green'
    });
    onClose();
  };

  const tradeOptions = [
    { value: 'HVAC', label: 'HVAC (Heating & Air Conditioning)', badge: 'Primary' },
    { value: 'Plumbing', label: 'Plumbing & Gas' },
    { value: 'Electrical', label: 'Electrical Systems' },
    { value: 'Backflow', label: 'Backflow Prevention (BPAT)', badge: 'Compliance' },
    { value: 'Septic', label: 'Septic Tank & Pumping', badge: 'County' },
    { value: 'Roofing', label: 'Roofing & Waterproofing' }
  ];

  const priorityOptions = [
    { value: 'Normal', label: 'Normal Priority' },
    { value: 'High', label: 'High Priority' },
    { value: 'Emergency', label: '🚨 Emergency (Immediate Escalation)', badge: 'Urgent' }
  ];

  const customerOptions = customers.map(c => ({
    value: c.name,
    label: `${c.name} ${c.badge ? `(${c.badge})` : ''}`,
    badge: c.type
  }));

  const techOptions = [
    ...technicians.map(t => ({
      value: t.name,
      label: `${t.name} (${t.trades ? t.trades.join(', ') : 'Tech'})`,
      badge: t.status || 'Available'
    })),
    { value: 'Unassigned', label: 'Unassigned (Place in Dispatch Tray)' }
  ];

  const crewOptions = [
    { value: 'Truck 01 (North Austin)', label: 'Truck 01 (North Austin)' },
    { value: 'Truck 02 (West Austin)', label: 'Truck 02 (West Austin)' },
    { value: 'Truck 03 (East / Round Rock)', label: 'Truck 03 (East / Round Rock)' },
    { value: 'Pumper Truck 04 (County)', label: 'Pumper Truck 04 (County)' }
  ];

  const timeOptions = [
    { value: '8:00 AM - 10:00 AM', label: '8:00 AM - 10:00 AM (Morning Slot 1)' },
    { value: '9:30 AM - 11:30 AM', label: '9:30 AM - 11:30 AM (Morning Slot 2)' },
    { value: '11:30 AM - 1:30 PM', label: '11:30 AM - 1:30 PM (Midday Slot)' },
    { value: '1:00 PM - 3:00 PM', label: '1:00 PM - 3:00 PM (Afternoon Slot 1)' },
    { value: '3:00 PM - 5:00 PM', label: '3:00 PM - 5:00 PM (Afternoon Slot 2)' }
  ];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-card modal-lg">
        <div className="modal-head">
          <div>
            <span className="modal-kicker">WORK ORDER · DISPATCH ENGINE</span>
            <h2>{initialData ? 'Edit Service Job' : 'Create New Service Job'}</h2>
            <p>Assign qualified technicians, specify trade details, and schedule dispatch.</p>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="modal-fields">
          <div className="field-row">
            <label>
              Trade Specialty
              <CustomSelect 
                name="trade" 
                value={form.trade} 
                options={tradeOptions} 
                onChange={e => setField('trade', e.target.value)} 
              />
            </label>
            <label>
              Job Priority
              <CustomSelect 
                name="priority" 
                value={form.priority} 
                options={priorityOptions} 
                onChange={e => setField('priority', e.target.value)} 
              />
            </label>
          </div>

          <div className="field-row">
            <label>
              Customer Name
              <CustomSelect 
                name="customer" 
                value={form.customer} 
                options={customerOptions} 
                onChange={e => handleCustomerChange(e.target.value)} 
              />
            </label>
            <label>
              Service Type Description
              <input name="type" value={form.type} onChange={update} placeholder="e.g. AC Tune-Up / Leak Repair / Backflow Test" />
            </label>
          </div>

          <label>
            Service Location Address
            <input name="address" value={form.address} onChange={update} placeholder="Street, City, State, ZIP" />
          </label>

          <div className="field-row">
            <label>
              Assign Technician
              <CustomSelect 
                name="tech" 
                value={form.tech} 
                options={techOptions} 
                onChange={e => setField('tech', e.target.value)} 
              />
            </label>
            <label>
              Assigned Crew / Truck
              <CustomSelect 
                name="crew" 
                value={form.crew} 
                options={crewOptions} 
                onChange={e => setField('crew', e.target.value)} 
              />
            </label>
          </div>

          <div className="field-row">
            <label>
              Service Date
              <input type="date" name="date" value={form.date} onChange={update} />
            </label>
            <label>
              Arrival Window
              <CustomSelect 
                name="time" 
                value={form.time} 
                options={timeOptions} 
                onChange={e => setField('time', e.target.value)} 
              />
            </label>
            <label>
              Estimated Value ($)
              <input type="number" step="0.01" name="amount" value={form.amount} onChange={update} />
            </label>
          </div>

          {form.trade === 'Backflow' && (
            <div className="trade-callout-box">
              <span className="trade-box-badge">BACKFLOW COMPLIANCE (#89-#91)</span>
              <p>Water utility annual testing requires tester license & calibration verification.</p>
              <div className="field-row">
                <input name="backflowAssembly" value={form.backflowAssembly} onChange={update} placeholder="Assembly make & size (e.g. Febco 850 1-inch RP)" />
                <input placeholder="Utility Account # (e.g. RR-WTR-99410)" />
              </div>
            </div>
          )}

          {form.trade === 'Septic' && (
            <div className="trade-callout-box">
              <span className="trade-box-badge">SEPTIC PUMPING & MANIFEST (#92-#93)</span>
              <p>County disposal manifest will be generated automatically upon pumping completion.</p>
              <div className="field-row">
                <input type="number" name="septicGallons" value={form.septicGallons} onChange={update} placeholder="Gallons (e.g. 1000)" />
                <input placeholder="Disposal facility (e.g. Travis County Plant)" />
              </div>
            </div>
          )}

          <label>
            Job Instructions & Context Notes
            <textarea rows="3" name="notes" value={form.notes} onChange={update} placeholder="Access gate codes, customer complaints, safety cautions..." />
          </label>
        </div>

        <div className="modal-actions">
          <button className="button button-quiet" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}><Check size={16}/>Save Job & Schedule</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 2. CREATE / EDIT CUSTOMER MODAL
export function CustomerModal({ onClose, onSave, initialData = null }) {
  const [form, setForm] = useState(initialData || {
    name: '',
    type: 'Residential',
    company: '',
    phone: '',
    email: '',
    street: '',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    gateCode: '',
    taxZone: 'Travis County (8.25%)',
    leadSource: 'Google Search',
    badge: 'New customer',
    notes: ''
  });

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const setField = (name, val) => setForm(prev => ({ ...prev, [name]: val }));

  const submit = () => {
    if (!form.name.trim()) return;
    const isLandline = form.phone.includes('0191') || form.phone.toLowerCase().includes('land');
    onSave({
      id: form.id || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: form.name,
      initials: form.name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase(),
      color: 'blue',
      type: form.type,
      company: form.company,
      phone: form.phone || '(512) 555-0100',
      lineType: isLandline ? 'Landline (Email only)' : 'Mobile (SMS verified)',
      smsConsent: !isLandline,
      email: form.email,
      billingAddress: `${form.street}, ${form.city}, ${form.state} ${form.zip}`,
      locations: [
        {
          id: 'LOC-1',
          nickname: 'Primary Location',
          street: form.street || '100 Main St',
          city: form.city,
          state: form.state,
          zip: form.zip,
          gateCode: form.gateCode,
          taxZone: form.taxZone
        }
      ],
      jobs: 0,
      spent: '$0',
      outstanding: '$0',
      last: 'Just added',
      badge: form.type === 'Commercial' ? 'Commercial' : 'New customer',
      leadSource: form.leadSource
    });
    onClose();
  };

  const typeOptions = [
    { value: 'Residential', label: 'Residential Homeowner' },
    { value: 'Commercial', label: 'Commercial / Business' },
    { value: 'Property Manager', label: 'Property Manager / Landlord' }
  ];

  const taxOptions = [
    { value: 'Travis County (8.25%)', label: 'Travis County (8.25%)' },
    { value: 'Williamson County (8.25%)', label: 'Williamson County (8.25%)' },
    { value: 'Austin City Commercial (8.25%)', label: 'Austin City Commercial (8.25%)' },
    { value: 'Tax Exempt (Certificate on file)', label: 'Tax Exempt (Certificate on file)' }
  ];

  const sourceOptions = [
    { value: 'Google Search', label: 'Google Search' },
    { value: 'Google Local Services', label: 'Google Local Services' },
    { value: 'Website Booking', label: 'Website Booking' },
    { value: 'Referral', label: 'Customer Referral' },
    { value: 'Repeat Client', label: 'Repeat Client' }
  ];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-card modal-lg">
        <div className="modal-head">
          <div>
            <span className="modal-kicker">CRM & RELATIONSHIPS (#1-#5)</span>
            <h2>{initialData ? 'Edit Customer' : 'Add New Customer & Location'}</h2>
            <p>Save customer contact, verify phone line type for SMS, and configure service addresses.</p>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="modal-fields">
          <div className="field-row">
            <label>
              Account Type
              <CustomSelect 
                name="type" 
                value={form.type} 
                options={typeOptions} 
                onChange={e => setField('type', e.target.value)} 
              />
            </label>
            <label>
              Customer / Contact Name
              <input name="name" value={form.name} onChange={update} placeholder="e.g. John Doe or Acme Corp" autoFocus />
            </label>
          </div>

          {form.type !== 'Residential' && (
            <label>
              Company / Entity Name (Bill-To Party #5)
              <input name="company" value={form.company} onChange={update} placeholder="e.g. Acme Commercial Real Estate LLC" />
            </label>
          )}

          <div className="field-row">
            <label>
              Phone Number (Line Type Auto-Verified)
              <input name="phone" value={form.phone} onChange={update} placeholder="(512) 555-0100" />
            </label>
            <label>
              Email Address (Invoicing & Reminders)
              <input name="email" type="email" value={form.email} onChange={update} placeholder="billing@domain.com" />
            </label>
          </div>

          <div className="sms-line-notice">
            <ShieldCheck size={15}/>
            <span><strong>SMS / Landline Check (#1, #4):</strong> Phone will be checked for SMS capability. Landlines automatically route reminders to email.</span>
          </div>

          <div className="field-section-title">SERVICE LOCATION DETAILS</div>

          <label>
            Street Address
            <input name="street" value={form.street} onChange={update} placeholder="1234 Highland Terrace" />
          </label>

          <div className="field-row">
            <label>City <input name="city" value={form.city} onChange={update} /></label>
            <label>State <input name="state" value={form.state} onChange={update} /></label>
            <label>ZIP Code <input name="zip" value={form.zip} onChange={update} /></label>
          </div>

          <div className="field-row">
            <label>
              Gate / Access Code
              <input name="gateCode" value={form.gateCode} onChange={update} placeholder="e.g. #9921 or key in lockbox" />
            </label>
            <label>
              Sales Tax Jurisdiction (#98)
              <CustomSelect 
                name="taxZone" 
                value={form.taxZone} 
                options={taxOptions} 
                onChange={e => setField('taxZone', e.target.value)} 
              />
            </label>
            <label>
              Lead Source Attribution (#80)
              <CustomSelect 
                name="leadSource" 
                value={form.leadSource} 
                options={sourceOptions} 
                onChange={e => setField('leadSource', e.target.value)} 
              />
            </label>
          </div>
        </div>

        <div className="modal-actions">
          <button className="button button-quiet" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}><Check size={16}/>Save Customer Record</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 3. CREATE / EDIT EQUIPMENT & ASSET MODAL
export function EquipmentModal({ onClose, onSave, customers = [], initialData = null }) {
  const [form, setForm] = useState(initialData || {
    name: 'Carrier 4-Ton Split AC',
    category: 'HVAC',
    customer: customers[0]?.name || 'Sarah Mitchell',
    brand: 'Carrier',
    model: '24VNA948A003',
    serial: '4221E19842',
    installDate: '2021-04-12',
    mfgWarrantyEnd: '2031-04-12',
    laborWarrantyEnd: '2022-04-12',
    status: 'Warranty active',
    notes: '',
    utilityName: 'City of Austin Water Utility',
    utilityAccount: 'AUS-WTR-8819',
    hazardClass: 'High Hazard (Chemical / Fertilizer)',
    testDeadline: '2026-12-01',
    tankGallons: 1000,
    lidDepth: '18 inches',
    pumpIntervalYears: 3,
    lastPumpedDate: '2023-10-15'
  });

  const [scanning, setScanning] = useState(false);

  const simulateOCRScan = () => {
    setScanning(true);
    setTimeout(() => {
      setForm(prev => ({
        ...prev,
        brand: 'Carrier Infinity',
        model: '25VNA436A003',
        serial: '3822E94812',
        name: 'Carrier Infinity 3-Ton Variable Heat Pump',
        mfgWarrantyEnd: '2032-05-15',
        notes: 'AI Nameplate scan extracted: R-410A factory charge 9.2 lbs. Voltage 208/230V 1-Phase.'
      }));
      setScanning(false);
    }, 1200);
  };

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const setField = (name, val) => setForm(prev => ({ ...prev, [name]: val }));

  const submit = () => {
    onSave({
      ...form,
      id: form.id || `EQ-${form.category.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      location: `${form.customer} · Main Site`
    });
    onClose();
  };

  const categoryOptions = [
    { value: 'HVAC', label: 'HVAC Condenser / Air Handler' },
    { value: 'Plumbing', label: 'Water Heater / Tankless' },
    { value: 'Backflow', label: 'Backflow Prevention Assembly (#89)', badge: 'Compliance' },
    { value: 'Septic', label: 'Septic Tank / Aerobic System (#92)', badge: 'County' },
    { value: 'Electrical', label: 'Electrical Main Panel' }
  ];

  const customerOptions = customers.map(c => ({ value: c.name, label: c.name }));

  const hazardOptions = [
    { value: 'High Hazard (Chemical / Fertilizer)', label: 'High Hazard (Chemical / Fertilizer)' },
    { value: 'Medium Hazard (Commercial Irrigation)', label: 'Medium Hazard (Commercial Irrigation)' },
    { value: 'Low Hazard (Fire Line / Domestic)', label: 'Low Hazard (Fire Line / Domestic)' }
  ];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-card modal-lg">
        <div className="modal-head">
          <div>
            <span className="modal-kicker">ASSET MANAGEMENT (#2, #46, #89, #92)</span>
            <h2>{initialData ? 'Edit Equipment Asset' : 'Add Installed Equipment'}</h2>
            <p>Track serial numbers, warranties, backflow devices, and septic registry by site.</p>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="modal-fields">
          <div className="ai-ocr-banner">
            <div>
              <Sparkles size={17}/>
              <div>
                <strong>Equipment Nameplate AI Scanner (#46)</strong>
                <small>Scan or upload a nameplate photo to auto-fill brand, model, serial, and specs.</small>
              </div>
            </div>
            <button className="button button-quiet" onClick={simulateOCRScan} disabled={scanning}>
              {scanning ? <RefreshCw size={14} className="spin-animate"/> : <Camera size={14}/>}
              {scanning ? 'Analyzing photo...' : 'Simulate Nameplate Scan'}
            </button>
          </div>

          <div className="field-row">
            <label>
              Asset Category
              <CustomSelect 
                name="category" 
                value={form.category} 
                options={categoryOptions} 
                onChange={e => setField('category', e.target.value)} 
              />
            </label>
            <label>
              Installed at Customer Site
              <CustomSelect 
                name="customer" 
                value={form.customer} 
                options={customerOptions} 
                onChange={e => setField('customer', e.target.value)} 
              />
            </label>
          </div>

          <label>
            Equipment Name / Tag
            <input name="name" value={form.name} onChange={update} placeholder="e.g. Carrier Infinity 4-Ton Split AC" />
          </label>

          <div className="field-row">
            <label>Manufacturer / Brand <input name="brand" value={form.brand} onChange={update} /></label>
            <label>Model Number <input name="model" value={form.model} onChange={update} /></label>
            <label>Serial Number <input name="serial" value={form.serial} onChange={update} /></label>
          </div>

          <div className="field-row">
            <label>Install Date <input type="date" name="installDate" value={form.installDate} onChange={update} /></label>
            <label>Mfg Warranty Expiry <input type="date" name="mfgWarrantyEnd" value={form.mfgWarrantyEnd} onChange={update} /></label>
            <label>Labor Warranty Expiry <input type="date" name="laborWarrantyEnd" value={form.laborWarrantyEnd} onChange={update} /></label>
          </div>

          {form.category === 'Backflow' && (
            <div className="trade-callout-box">
              <span className="trade-box-badge">BACKFLOW SPECIFIC FIELDS (#89)</span>
              <div className="field-row">
                <label>Water Utility Name <input name="utilityName" value={form.utilityName} onChange={update} /></label>
                <label>Utility Account # <input name="utilityAccount" value={form.utilityAccount} onChange={update} /></label>
              </div>
              <div className="field-row">
                <label>
                  Hazard Level
                  <CustomSelect 
                    name="hazardClass" 
                    value={form.hazardClass} 
                    options={hazardOptions} 
                    onChange={e => setField('hazardClass', e.target.value)} 
                  />
                </label>
                <label>Next Annual Test Due Date <input type="date" name="testDeadline" value={form.testDeadline} onChange={update} /></label>
              </div>
            </div>
          )}

          {form.category === 'Septic' && (
            <div className="trade-callout-box">
              <span className="trade-box-badge">SEPTIC TANK REGISTRY (#92)</span>
              <div className="field-row">
                <label>Tank Size (Gallons) <input type="number" name="tankGallons" value={form.tankGallons} onChange={update} /></label>
                <label>Lid Access Depth <input name="lidDepth" value={form.lidDepth} onChange={update} placeholder="e.g. 18 inches buried" /></label>
                <label>Recommended Pump Interval (Years) <input type="number" name="pumpIntervalYears" value={form.pumpIntervalYears} onChange={update} /></label>
              </div>
            </div>
          )}

          <label>
            Equipment Notes & Maintenance History
            <textarea rows="2" name="notes" value={form.notes} onChange={update} placeholder="Filter sizes, refrigerant type, coil location, previous repairs..." />
          </label>
        </div>

        <div className="modal-actions">
          <button className="button button-quiet" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}><Check size={16}/>Save Equipment Asset</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 4. CREATE / EDIT LEAD MODAL
export function LeadModal({ onClose, onSave, customers = [] }) {
  const [form, setForm] = useState({
    title: 'AC Inverter Replacement',
    customer: customers[0]?.name || 'Sarah Mitchell',
    phone: customers[0]?.phone || '(512) 555-0184',
    email: customers[0]?.email || 'sarah.mitchell@example.com',
    trade: 'HVAC',
    budget: '$7,500',
    source: 'Google Search',
    owner: 'Alex Morgan',
    stage: 'New lead',
    notes: 'Customer inquired through website request form about high summer electric bills.'
  });

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const setField = (name, val) => setForm(prev => ({ ...prev, [name]: val }));

  const submit = () => {
    if (!form.title.trim()) return;
    onSave({
      ...form,
      id: `LEAD-${Math.floor(250 + Math.random() * 500)}`,
      priority: 'Normal',
      nextFollowUp: 'Tomorrow, 9:00 AM'
    });
    onClose();
  };

  const tradeOptions = [
    { value: 'HVAC', label: 'HVAC' },
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Backflow', label: 'Backflow' },
    { value: 'Septic', label: 'Septic' }
  ];

  const stageOptions = [
    { value: 'New lead', label: '1. New Lead' },
    { value: 'Contacted', label: '2. Contacted' },
    { value: 'Site visit', label: '3. Site Visit / Assessment' },
    { value: 'Quoted', label: '4. Quoted' }
  ];

  const sourceOptions = [
    { value: 'Google Search', label: 'Google Search' },
    { value: 'Google Local Services Ads', label: 'Google Local Services Ads' },
    { value: 'Website Form', label: 'Website Form' },
    { value: 'Referral', label: 'Customer Referral' },
    { value: 'Phone Call', label: 'Inbound Phone Call' }
  ];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <span className="modal-kicker">SALES PIPELINE (#3)</span>
            <h2>Add Sales Opportunity / Lead</h2>
            <p>Capture incoming job leads, track expected revenue, and set follow-ups.</p>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="modal-fields">
          <label>
            Opportunity Title
            <input name="title" value={form.title} onChange={update} placeholder="e.g. Complete System Replacement" autoFocus />
          </label>

          <div className="field-row">
            <label>
              Customer Name
              <input name="customer" value={form.customer} onChange={update} />
            </label>
            <label>
              Trade
              <CustomSelect 
                name="trade" 
                value={form.trade} 
                options={tradeOptions} 
                onChange={e => setField('trade', e.target.value)} 
              />
            </label>
          </div>

          <div className="field-row">
            <label>Phone Number <input name="phone" value={form.phone} onChange={update} /></label>
            <label>Expected Budget ($) <input name="budget" value={form.budget} onChange={update} /></label>
          </div>

          <div className="field-row">
            <label>
              Initial Pipeline Stage
              <CustomSelect 
                name="stage" 
                value={form.stage} 
                options={stageOptions} 
                onChange={e => setField('stage', e.target.value)} 
              />
            </label>
            <label>
              Lead Source
              <CustomSelect 
                name="source" 
                value={form.source} 
                options={sourceOptions} 
                onChange={e => setField('source', e.target.value)} 
              />
            </label>
          </div>

          <label>
            Opportunity Notes
            <textarea rows="3" name="notes" value={form.notes} onChange={update} placeholder="Customer priorities, equipment age, timeline..." />
          </label>
        </div>

        <div className="modal-actions">
          <button className="button button-quiet" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}><Check size={16}/>Save Lead to Pipeline</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 5. CREATE QUOTE MODAL (GOOD / BETTER / BEST #9, #10)
export function QuoteModal({ onClose, onSave, customers = [] }) {
  const [form, setForm] = useState({
    title: 'HVAC System Upgrade & Duct Sealing',
    customer: customers[0]?.name || 'Sarah Mitchell',
    trade: 'HVAC',
    validUntil: '2026-12-15',
    depositRequired: 1500.0,
    goodPrice: 5800.0,
    betterPrice: 7900.0,
    bestPrice: 10500.0,
    notes: 'Includes full manufacturer 10-year parts warranty, 1-year labor warranty, and city permits.'
  });

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const setField = (name, val) => setForm(prev => ({ ...prev, [name]: val }));

  const submit = () => {
    onSave({
      id: `QUO-${Math.floor(160 + Math.random() * 400)}`,
      title: form.title,
      customer: form.customer,
      trade: form.trade,
      total: Number(form.betterPrice),
      depositRequired: Number(form.depositRequired),
      status: 'Sent (Viewed)',
      validUntil: form.validUntil,
      options: [
        { name: 'Good (15 SEER Single Stage)', price: Number(form.goodPrice), description: 'Reliable entry-level cooling with high efficiency parts warranty.' },
        { name: 'Better (17 SEER Two-Stage · Recommended)', price: Number(form.betterPrice), recommended: true, description: 'Superior humidity control, quieter operation, smart WiFi thermostat.' },
        { name: 'Best (20 SEER Variable Inverter)', price: Number(form.bestPrice), description: 'Ultimate climate comfort, ultra-low sound, highest electric bill savings.' }
      ],
      createdDate: new Date().toLocaleDateString()
    });
    onClose();
  };

  const customerOptions = customers.map(c => ({ value: c.name, label: c.name }));

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-card modal-lg">
        <div className="modal-head">
          <div>
            <span className="modal-kicker">PROPOSALS & OPTIONS (#9, #10)</span>
            <h2>Create Good / Better / Best Quote</h2>
            <p>Give customers choice with tiered options, add-ons, and online deposit approval.</p>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="modal-fields">
          <div className="field-row">
            <label>
              Proposal Title
              <input name="title" value={form.title} onChange={update} autoFocus />
            </label>
            <label>
              Customer
              <CustomSelect 
                name="customer" 
                value={form.customer} 
                options={customerOptions} 
                onChange={e => setField('customer', e.target.value)} 
              />
            </label>
          </div>

          <div className="tiered-quote-builder">
            <div className="tier-col tier-good">
              <span className="tier-tag">TIER 1</span>
              <h4>Good Option</h4>
              <p>Base reliable replacement</p>
              <label>Price ($)
                <input type="number" name="goodPrice" value={form.goodPrice} onChange={update} />
              </label>
            </div>
            <div className="tier-col tier-better recommended">
              <span className="tier-tag rec-tag">RECOMMENDED</span>
              <h4>Better Option</h4>
              <p>Best balance of efficiency & value</p>
              <label>Price ($)
                <input type="number" name="betterPrice" value={form.betterPrice} onChange={update} />
              </label>
            </div>
            <div className="tier-col tier-best">
              <span className="tier-tag">TIER 3</span>
              <h4>Best Option</h4>
              <p>Premium inverter / maximum warranty</p>
              <label>Price ($)
                <input type="number" name="bestPrice" value={form.bestPrice} onChange={update} />
              </label>
            </div>
          </div>

          <div className="field-row">
            <label>
              Required Deposit ($) (#10)
              <input type="number" name="depositRequired" value={form.depositRequired} onChange={update} />
            </label>
            <label>
              Proposal Valid Until
              <input type="date" name="validUntil" value={form.validUntil} onChange={update} />
            </label>
          </div>

          <label>
            Terms & Client Message
            <textarea rows="3" name="notes" value={form.notes} onChange={update} />
          </label>
        </div>

        <div className="modal-actions">
          <button className="button button-quiet" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}><Check size={16}/>Send Tiered Proposal</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 6. CREATE INVOICE MODAL (#51, #98)
export function InvoiceModal({ onClose, onSave, customers = [] }) {
  const [form, setForm] = useState({
    customer: customers[0]?.name || 'Sarah Mitchell',
    invoiceNumber: `INV-${Math.floor(1085 + Math.random() * 200)}`,
    issueDate: '2026-11-20',
    dueDate: '2026-11-27',
    trade: 'HVAC',
    itemDescription: 'AC Seasonal Tune-Up & Coil Service',
    rate: 189.0,
    qty: 1,
    taxRate: 8.25,
    depositCredited: 0,
    notes: 'Thank you for choosing iBoost Field Service!'
  });

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const setField = (name, val) => setForm(prev => ({ ...prev, [name]: val }));

  const subtotal = Number(form.rate) * Number(form.qty);
  const tax = Number((subtotal * (form.taxRate / 100)).toFixed(2));
  const total = subtotal + tax - Number(form.depositCredited);

  const submit = () => {
    onSave({
      id: form.invoiceNumber,
      customer: form.customer,
      trade: form.trade,
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      status: 'Open',
      amount: total,
      tax: tax,
      depositCredited: Number(form.depositCredited),
      balance: total,
      aging: 'Current',
      lineItems: [
        { description: form.itemDescription, qty: Number(form.qty), rate: Number(form.rate), amount: subtotal }
      ]
    });
    onClose();
  };

  const customerOptions = customers.map(c => ({ value: c.name, label: c.name }));

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <span className="modal-kicker">BILLING & INVOICING (#51, #98)</span>
            <h2>Create Customer Invoice</h2>
            <p>Generate invoice with automatic sales tax jurisdiction and deposit deductions.</p>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="modal-fields">
          <div className="field-row">
            <label>Invoice Number <input name="invoiceNumber" value={form.invoiceNumber} onChange={update} /></label>
            <label>
              Customer
              <CustomSelect 
                name="customer" 
                value={form.customer} 
                options={customerOptions} 
                onChange={e => setField('customer', e.target.value)} 
              />
            </label>
          </div>

          <div className="field-row">
            <label>Issue Date <input type="date" name="issueDate" value={form.issueDate} onChange={update} /></label>
            <label>Due Date <input type="date" name="dueDate" value={form.dueDate} onChange={update} /></label>
          </div>

          <label>Primary Service Line Description
            <input name="itemDescription" value={form.itemDescription} onChange={update} />
          </label>

          <div className="field-row">
            <label>Quantity <input type="number" name="qty" value={form.qty} onChange={update} /></label>
            <label>Unit Rate ($) <input type="number" step="0.01" name="rate" value={form.rate} onChange={update} /></label>
            <label>Sales Tax % (#98) <input type="number" step="0.01" name="taxRate" value={form.taxRate} onChange={update} /></label>
          </div>

          <div className="field-row">
            <label>Deposit Already Credited ($)
              <input type="number" step="0.01" name="depositCredited" value={form.depositCredited} onChange={update} />
            </label>
            <div className="invoice-calc-summary">
              <div>Subtotal: <strong>${subtotal.toFixed(2)}</strong></div>
              <div>Tax: <strong>${tax.toFixed(2)}</strong></div>
              <div>Total Due: <strong className="highlight-price">${total.toFixed(2)}</strong></div>
            </div>
          </div>

          <label>Notes & Payment Instructions
            <textarea rows="2" name="notes" value={form.notes} onChange={update} />
          </label>
        </div>

        <div className="modal-actions">
          <button className="button button-quiet" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}><Check size={16}/>Create & Send Invoice</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 7. RECORD PAYMENT MODAL (#54, #58)
export function PaymentModal({ onClose, onSave, invoices = [] }) {
  const [form, setForm] = useState({
    invoiceRef: invoices[0]?.id || 'INV-1078',
    customer: invoices[0]?.customer || 'Cedar Grove Homes',
    amount: invoices[0]?.balance || 940.0,
    tip: 0.0,
    method: 'Online Card (Stripe)',
    date: 'Today',
    refNumber: 'CHG-99412',
    techHandover: false,
    notes: 'Payment collected and confirmed'
  });

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const setField = (name, val) => setForm(prev => ({ ...prev, [name]: val }));

  const submit = () => {
    onSave({
      id: `PAY-${Math.floor(8830 + Math.random() * 200)}`,
      invoiceRef: form.invoiceRef,
      customer: form.customer,
      amount: Number(form.amount),
      tip: Number(form.tip),
      method: form.method,
      date: form.date,
      status: 'Succeeded',
      payoutStatus: form.method.includes('Cash') ? 'Cash in office drawer' : 'Settled to Bank'
    });
    onClose();
  };

  const invoiceOptions = invoices.map(inv => ({
    value: inv.id,
    label: `${inv.id} · ${inv.customer} ($${inv.balance || inv.amount})`,
    badge: inv.status
  }));

  const methodOptions = [
    { value: 'Online Card (Stripe)', label: 'Online Card (Stripe Connect)' },
    { value: 'UPI / Direct Bank Transfer', label: 'UPI / Instant Bank Mandate' },
    { value: 'Cash (Recorded #58)', label: 'Cash Received' },
    { value: 'Cheque (Recorded #58)', label: 'Cheque Received' },
    { value: 'Field Card Tap (Terminal)', label: 'Field Card Tap / Bluetooth Reader' }
  ];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <span className="modal-kicker">COLLECTIONS & PAYMENTS (#54, #58)</span>
            <h2>Record Payment</h2>
            <p>Record online card, cash, cheque, or UPI payment with receipt logging.</p>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="modal-fields">
          <div className="field-row">
            <label>
              Invoice Reference
              <CustomSelect 
                name="invoiceRef" 
                value={form.invoiceRef} 
                options={invoiceOptions} 
                onChange={e => setField('invoiceRef', e.target.value)} 
              />
            </label>
            <label>Payment Method (#54, #58)
              <CustomSelect 
                name="method" 
                value={form.method} 
                options={methodOptions} 
                onChange={e => setField('method', e.target.value)} 
              />
            </label>
          </div>

          <div className="field-row">
            <label>Amount Collected ($) <input type="number" step="0.01" name="amount" value={form.amount} onChange={update} /></label>
            <label>Technician Tip ($) (#54) <input type="number" step="0.01" name="tip" value={form.tip} onChange={update} /></label>
          </div>

          <div className="field-row">
            <label>Transaction / Cheque / UTR Ref #
              <input name="refNumber" value={form.refNumber} onChange={update} placeholder="e.g. CHQ-4491 or UTR-998" />
            </label>
          </div>

          {form.method.includes('Cash') && (
            <div className="trade-callout-box">
              <span className="trade-box-badge">CASH RECORDING & HANDOVER (#58)</span>
              <label className="checkbox-row">
                <input type="checkbox" checked={form.techHandover} onChange={e => setForm({ ...form, techHandover: e.target.checked })} />
                <span>Technician has physically handed over cash to the office safe.</span>
              </label>
            </div>
          )}

          <label>Payment Notes
            <textarea rows="2" name="notes" value={form.notes} onChange={update} />
          </label>
        </div>

        <div className="modal-actions">
          <button className="button button-quiet" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}><Check size={16}/>Record Payment & Issue Receipt</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 8. ADD TECHNICIAN MODAL (#8, #34, #94)
export function TechnicianModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    role: 'HVAC Specialist',
    phone: '',
    email: '',
    trade1: 'HVAC',
    trade2: 'Electrical',
    hourlyPay: 36.0,
    costRate: 50.0,
    shift: 'Mon - Fri · 8:00 AM - 5:00 PM',
    crew: 'Truck 01 (North Austin)',
    licenseType: 'EPA Section 608 Universal',
    licenseNumber: 'EPA-TX-99418',
    licenseExpiry: '2027-10-15'
  });

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const setField = (name, val) => setForm(prev => ({ ...prev, [name]: val }));

  const submit = () => {
    if (!form.name.trim()) return;
    onSave({
      id: `TECH-0${Math.floor(5 + Math.random() * 5)}`,
      name: form.name,
      role: form.role,
      initials: form.name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase(),
      color: 'blue',
      phone: form.phone || '(512) 555-0105',
      email: form.email || `${form.name.toLowerCase().replace(/\s+/g, '.')}@iboostfsm.com`,
      trades: [form.trade1, form.trade2].filter(Boolean),
      crew: form.crew,
      shift: form.shift,
      hourlyPay: Number(form.hourlyPay),
      costRate: Number(form.costRate),
      rating: 5.0,
      jobsCompleted: 0,
      status: 'Available',
      licenses: [
        { type: form.licenseType, number: form.licenseNumber, expires: form.licenseExpiry, status: 'Valid' }
      ]
    });
    onClose();
  };

  const crewOptions = [
    { value: 'Truck 01 (North Austin)', label: 'Truck 01 (North Austin)' },
    { value: 'Truck 02 (West Austin)', label: 'Truck 02 (West Austin)' },
    { value: 'Truck 03 (East / Round Rock)', label: 'Truck 03 (East / Round Rock)' },
    { value: 'Pumper Truck 04 (County)', label: 'Pumper Truck 04 (County)' }
  ];

  const tradeOptions = [
    { value: 'HVAC', label: 'HVAC' },
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Backflow', label: 'Backflow Certified (BPAT)' },
    { value: 'Septic', label: 'Septic Tank Hauler' }
  ];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <span className="modal-kicker">TEAM & LICENSES (#8, #94)</span>
            <h2>Invite New Technician / Staff</h2>
            <p>Set labor cost rates, assigned crew, and professional trade license expiries.</p>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="modal-fields">
          <label>Full Name <input name="name" value={form.name} onChange={update} placeholder="e.g. Robert Vance" autoFocus /></label>

          <div className="field-row">
            <label>Job Title / Role <input name="role" value={form.role} onChange={update} placeholder="e.g. Master Plumber" /></label>
            <label>Assigned Crew / Truck
              <CustomSelect 
                name="crew" 
                value={form.crew} 
                options={crewOptions} 
                onChange={e => setField('crew', e.target.value)} 
              />
            </label>
          </div>

          <div className="field-row">
            <label>Mobile Phone <input name="phone" value={form.phone} onChange={update} placeholder="(512) 555-0105" /></label>
            <label>Email Address <input name="email" type="email" value={form.email} onChange={update} placeholder="tech@company.com" /></label>
          </div>

          <div className="field-row">
            <label>Primary Trade
              <CustomSelect 
                name="trade1" 
                value={form.trade1} 
                options={tradeOptions} 
                onChange={e => setField('trade1', e.target.value)} 
              />
            </label>
            <label>Hourly Pay Rate ($) <input type="number" name="hourlyPay" value={form.hourlyPay} onChange={update} /></label>
            <label>Labor Cost Rate ($) <input type="number" name="costRate" value={form.costRate} onChange={update} /></label>
          </div>

          <div className="trade-callout-box">
            <span className="trade-box-badge">LICENSE / CERTIFICATION EXPIRY TRACKER (#94)</span>
            <div className="field-row">
              <label>License Name <input name="licenseType" value={form.licenseType} onChange={update} /></label>
              <label>License / Certificate # <input name="licenseNumber" value={form.licenseNumber} onChange={update} /></label>
            </div>
            <label>License Expiry Date <input type="date" name="licenseExpiry" value={form.licenseExpiry} onChange={update} /></label>
          </div>
        </div>

        <div className="modal-actions">
          <button className="button button-quiet" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}><Check size={16}/>Add Technician</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 9. ADD PART / INVENTORY ITEM MODAL (#49, #77)
export function PartModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    code: 'PRT-99',
    name: 'Condenser Fan Motor 1/3 HP',
    category: 'HVAC',
    unitCost: 85.0,
    warehouseQty: 12,
    truckQty: 3,
    minReorder: 5,
    supplier: 'Johnstone Supply'
  });

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const setField = (name, val) => setForm(prev => ({ ...prev, [name]: val }));

  const submit = () => {
    onSave({
      id: `INV-SKU-${Math.floor(10 + Math.random() * 90)}`,
      code: form.code,
      name: form.name,
      category: form.category,
      warehouseQty: Number(form.warehouseQty),
      truckQty: Number(form.truckQty),
      minReorder: Number(form.minReorder),
      unitCost: Number(form.unitCost),
      status: Number(form.warehouseQty) <= Number(form.minReorder) ? 'Low stock' : 'In stock'
    });
    onClose();
  };

  const categoryOptions = [
    { value: 'HVAC', label: 'HVAC' },
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Backflow', label: 'Backflow Prevention' },
    { value: 'Septic', label: 'Septic System' },
    { value: 'Electrical', label: 'Electrical' }
  ];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <span className="modal-kicker">INVENTORY & FLEET (#49, #77)</span>
            <h2>Add Inventory Part</h2>
            <p>Manage parts levels in warehouse and service trucks with reorder points.</p>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="modal-fields">
          <div className="field-row">
            <label>Part SKU / Code <input name="code" value={form.code} onChange={update} /></label>
            <label>Trade Category
              <CustomSelect 
                name="category" 
                value={form.category} 
                options={categoryOptions} 
                onChange={e => setField('category', e.target.value)} 
              />
            </label>
          </div>

          <label>Part Name & Specification
            <input name="name" value={form.name} onChange={update} placeholder="e.g. Dual Run Capacitor 45/5 MFD" />
          </label>

          <div className="field-row">
            <label>Unit Cost ($) <input type="number" step="0.01" name="unitCost" value={form.unitCost} onChange={update} /></label>
            <label>Reorder Point Alert (#77) <input type="number" name="minReorder" value={form.minReorder} onChange={update} /></label>
          </div>

          <div className="field-row">
            <label>Warehouse Qty <input type="number" name="warehouseQty" value={form.warehouseQty} onChange={update} /></label>
            <label>Truck Allotment Qty (#49) <input type="number" name="truckQty" value={form.truckQty} onChange={update} /></label>
          </div>
        </div>

        <div className="modal-actions">
          <button className="button button-quiet" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}><Check size={16}/>Add to Inventory</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// 10. ADD PRICEBOOK ITEM MODAL (#74)
export function PricebookModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    code: 'SV-PLMB-09',
    name: 'Tankless Water Heater Descale Service',
    category: 'Plumbing',
    type: 'Service',
    unit: 'each',
    price: 249.0,
    cost: 55.0,
    taxable: true
  });

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  const setField = (name, val) => setForm(prev => ({ ...prev, [name]: val }));

  const margin = (((form.price - form.cost) / form.price) * 100).toFixed(1);

  const submit = () => {
    onSave({
      id: `PB-${Math.floor(100 + Math.random() * 900)}`,
      code: form.code,
      name: form.name,
      category: form.category,
      type: form.type,
      unit: form.unit,
      price: Number(form.price),
      cost: Number(form.cost),
      margin: `${margin}%`,
      taxable: form.taxable
    });
    onClose();
  };

  const typeOptions = [
    { value: 'Service', label: 'Flat-Rate Service' },
    { value: 'Material', label: 'Material / Part' },
    { value: 'Labor', label: 'Hourly Labor' },
    { value: 'Fee', label: 'Trip / Diagnostic Fee' }
  ];

  const categoryOptions = [
    { value: 'HVAC', label: 'HVAC' },
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Backflow', label: 'Backflow' },
    { value: 'Septic', label: 'Septic' },
    { value: 'Electrical', label: 'Electrical' }
  ];

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="modal-card">
        <div className="modal-head">
          <div>
            <span className="modal-kicker">PRICEBOOK CATALOGUE (#74)</span>
            <h2>Add Flat-Rate Pricebook Item</h2>
            <p>Configure services and materials with cost, margin control, and sales tax.</p>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18}/></button>
        </div>

        <div className="modal-fields">
          <div className="field-row">
            <label>Item Code <input name="code" value={form.code} onChange={update} /></label>
            <label>Item Type
              <CustomSelect 
                name="type" 
                value={form.type} 
                options={typeOptions} 
                onChange={e => setField('type', e.target.value)} 
              />
            </label>
            <label>Trade
              <CustomSelect 
                name="category" 
                value={form.category} 
                options={categoryOptions} 
                onChange={e => setField('category', e.target.value)} 
              />
            </label>
          </div>

          <label>Item Name & Customer Description
            <input name="name" value={form.name} onChange={update} />
          </label>

          <div className="field-row">
            <label>Customer Price ($) <input type="number" step="0.01" name="price" value={form.price} onChange={update} /></label>
            <label>Direct Cost ($) <input type="number" step="0.01" name="cost" value={form.cost} onChange={update} /></label>
            <div className="margin-indicator-box">
              <span>Gross Margin</span>
              <strong>{margin}%</strong>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="button button-quiet" onClick={onClose}>Cancel</button>
          <button className="button button-primary" onClick={submit}><Check size={16}/>Save Pricebook Item</button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
