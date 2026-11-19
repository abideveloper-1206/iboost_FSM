// iBoost FSM comprehensive mock database
// Covers US residential + commercial trades: HVAC, Plumbing, Electrical, Septic, Backflow, Roofing

export const initialJobs = [
  {
    id: 'JB-2048',
    time: '8:00 AM',
    duration: '2h',
    customer: 'Sarah Mitchell',
    initials: 'SM',
    trade: 'HVAC',
    type: 'AC Seasonal Tune-up',
    address: '1248 Oakridge Lane, North Austin, TX 78758',
    tech: 'Alex Morgan',
    crew: 'Truck 01 (North)',
    color: 'blue',
    status: 'In progress',
    stage: 'In progress',
    priority: 'Normal',
    amount: 189.0,
    depositPaid: 50.0,
    equipmentRef: 'EQ-HVAC-101',
    tags: ['Maintenance plan', 'Residential'],
    notes: 'Seasonal 21-point inspection on Carrier Infinity split system. Outdoor unit coil needs mild wash.'
  },
  {
    id: 'JB-2051',
    time: '9:30 AM',
    duration: '1.5h',
    customer: 'Cedar Grove Homes',
    initials: 'CG',
    trade: 'Plumbing',
    type: 'Commercial Water Heater Repair',
    address: '308 Willow Bend Dr, Cedar Park, TX 78613',
    tech: 'Jordan Lee',
    crew: 'Truck 02 (West)',
    color: 'violet',
    status: 'En route',
    stage: 'Scheduled',
    priority: 'High',
    amount: 480.0,
    depositPaid: 150.0,
    equipmentRef: 'EQ-PLMB-204',
    tags: ['Commercial', 'Property manager'],
    notes: 'Unit 12 pilot assembly failing intermittently. Check thermocouple and gas valve pressure.'
  },
  {
    id: 'JB-2053',
    time: '10:00 AM',
    duration: '2h',
    customer: 'Marcus Reed',
    initials: 'MR',
    trade: 'Backflow',
    type: 'Annual Backflow Assembly Test',
    address: '92 Bluebonnet Trail, Round Rock, TX 78664',
    tech: 'Taylor Brooks',
    crew: 'Truck 03 (East)',
    color: 'amber',
    status: 'Scheduled',
    stage: 'Scheduled',
    priority: 'Normal',
    amount: 145.0,
    depositPaid: 0.0,
    equipmentRef: 'EQ-BKF-301',
    tags: ['Compliance', 'Utility deadline: 5 days'],
    notes: 'Annual water utility compliance test on Febco 850 1-inch RP device. Gauge serial #BK-984.'
  },
  {
    id: 'JB-2057',
    time: '11:30 AM',
    duration: '1h',
    customer: 'Willow Creek Dental',
    initials: 'WC',
    trade: 'Electrical',
    type: 'Dedicated Circuit & Breaker Inspection',
    address: '615 W 5th Street, Downtown Austin, TX 78701',
    tech: 'Alex Morgan',
    crew: 'Truck 01 (North)',
    color: 'blue',
    status: 'Scheduled',
    stage: 'Scheduled',
    priority: 'Normal',
    amount: 320.0,
    depositPaid: 100.0,
    equipmentRef: 'EQ-ELEC-402',
    tags: ['Commercial', 'Active plan'],
    notes: 'Check 20A dedicated circuit for dental imaging station tripping main sub-panel.'
  },
  {
    id: 'JB-2061',
    time: '1:00 PM',
    duration: '2.5h',
    customer: 'Elena Rodriguez',
    initials: 'ER',
    trade: 'Septic',
    type: 'Septic Pumping & Tank Inspection',
    address: '1819 Juniper Way, Pflugerville, TX 78660',
    tech: 'Sam Rivera',
    crew: 'Pumper Truck 04',
    color: 'green',
    status: 'Scheduled',
    stage: 'In-home estimate',
    priority: 'High',
    amount: 550.0,
    depositPaid: 150.0,
    equipmentRef: 'EQ-SEPT-501',
    tags: ['Septic', 'County manifest required'],
    notes: '1,000 gallon two-compartment concrete tank. Buried lid depth ~18 inches. Disposal at Travis County Facility.'
  },
  {
    id: 'JB-2064',
    time: '2:30 PM',
    duration: '1h',
    customer: 'Peakside Apartments',
    initials: 'PA',
    trade: 'HVAC',
    type: 'Emergency AC Diagnostic',
    address: '2001 Lakeshore Blvd, Austin, TX 78741',
    tech: 'Jordan Lee',
    crew: 'Truck 02 (West)',
    color: 'violet',
    status: 'Needs attention',
    stage: 'New request',
    priority: 'Emergency',
    amount: 220.0,
    depositPaid: 0.0,
    equipmentRef: 'EQ-HVAC-105',
    tags: ['Commercial', 'Emergency rotation'],
    notes: 'Rooftop compressor lockout code E4. Building tenant without cooling in lobby.'
  }
];

export const initialCustomers = [
  {
    id: 'CUST-101',
    initials: 'SM',
    color: 'blue',
    name: 'Sarah Mitchell',
    type: 'Residential',
    company: '',
    phone: '(512) 555-0184',
    lineType: 'Mobile (SMS verified)',
    smsConsent: true,
    email: 'sarah.mitchell@example.com',
    billingAddress: '1248 Oakridge Lane, North Austin, TX 78758',
    locations: [
      { id: 'LOC-1', nickname: 'Primary Residence', street: '1248 Oakridge Lane', city: 'North Austin', state: 'TX', zip: '78758', gateCode: '#4412', taxZone: 'Travis County (8.25%)' }
    ],
    jobs: 8,
    spent: '$4,280',
    outstanding: '$0',
    last: 'Today, 8:00 AM',
    badge: 'Active plan',
    leadSource: 'Google Search'
  },
  {
    id: 'CUST-102',
    initials: 'CG',
    color: 'violet',
    name: 'Cedar Grove Homes',
    type: 'Commercial',
    company: 'Cedar Grove Property Mgmt LLC',
    phone: '(512) 555-0126',
    lineType: 'Mobile (SMS verified)',
    smsConsent: true,
    email: 'billing@cedargrovehomes.com',
    billingAddress: '400 Executive Center Dr, Suite 300, Austin, TX 78731',
    locations: [
      { id: 'LOC-2A', nickname: 'Willow Bend Complex', street: '308 Willow Bend Dr', city: 'Cedar Park', state: 'TX', zip: '78613', gateCode: 'Call box 012', taxZone: 'Williamson County (8.25%)' },
      { id: 'LOC-2B', nickname: 'Cypress Creek Townhomes', street: '1504 Cypress Creek Rd', city: 'Cedar Park', state: 'TX', zip: '78613', gateCode: 'Key in lockbox', taxZone: 'Williamson County (8.25%)' }
    ],
    jobs: 16,
    spent: '$12,640',
    outstanding: '$480',
    last: 'Today, 9:30 AM',
    badge: 'Commercial',
    leadSource: 'Referral'
  },
  {
    id: 'CUST-103',
    initials: 'MR',
    color: 'amber',
    name: 'Marcus Reed',
    type: 'Residential',
    company: '',
    phone: '(737) 555-0162',
    lineType: 'Mobile (SMS verified)',
    smsConsent: true,
    email: 'm.reed92@gmail.com',
    billingAddress: '92 Bluebonnet Trail, Round Rock, TX 78664',
    locations: [
      { id: 'LOC-3', nickname: 'Main Residence', street: '92 Bluebonnet Trail', city: 'Round Rock', state: 'TX', zip: '78664', gateCode: '', taxZone: 'Williamson County (8.25%)' }
    ],
    jobs: 3,
    spent: '$1,840',
    outstanding: '$145',
    last: 'Today, 10:00 AM',
    badge: 'New customer',
    leadSource: 'Google Local Services'
  },
  {
    id: 'CUST-104',
    initials: 'WC',
    color: 'green',
    name: 'Willow Creek Dental',
    type: 'Commercial',
    company: 'Dr. Evelyn Adams DDS',
    phone: '(512) 555-0191',
    lineType: 'Landline (Texts routed to email)',
    smsConsent: false,
    email: 'office@willowcreekdental.com',
    billingAddress: '615 W 5th Street, Downtown Austin, TX 78701',
    locations: [
      { id: 'LOC-4', nickname: 'Clinic Downtown', street: '615 W 5th Street', city: 'Austin', state: 'TX', zip: '78701', gateCode: 'Rear alley loading bay', taxZone: 'Austin City (8.25%)' }
    ],
    jobs: 12,
    spent: '$8,900',
    outstanding: '$0',
    last: 'Today, 11:30 AM',
    badge: 'Active plan',
    leadSource: 'Direct Website'
  },
  {
    id: 'CUST-105',
    initials: 'ER',
    color: 'rose',
    name: 'Elena Rodriguez',
    type: 'Residential',
    company: '',
    phone: '(737) 555-0178',
    lineType: 'Mobile (SMS verified)',
    smsConsent: true,
    email: 'elena.rodriguez@outlook.com',
    billingAddress: '1819 Juniper Way, Pflugerville, TX 78660',
    locations: [
      { id: 'LOC-5', nickname: 'Family Ranch Home', street: '1819 Juniper Way', city: 'Pflugerville', state: 'TX', zip: '78660', gateCode: 'Gate code #9921', taxZone: 'Travis County (8.25%)' }
    ],
    jobs: 5,
    spent: '$3,150',
    outstanding: '$550',
    last: 'Oct 28, 2026',
    badge: 'Active',
    leadSource: 'Thumbtack'
  }
];

export const initialRequests = [
  {
    id: 'REQ-3104',
    name: 'Elena Rodriguez',
    phone: '(737) 555-0178',
    email: 'elena.rodriguez@outlook.com',
    address: '1819 Juniper Way, Pflugerville, TX',
    trade: 'Septic',
    service: 'Septic Tank Pumping & Alarm Check',
    source: 'Website Request Form',
    leadSource: 'Google Search',
    preferredDate: '2026-11-20',
    preferredTime: '9:00 AM',
    urgency: 'High',
    score: '94/100 · High value lead',
    status: 'In review',
    createdAt: 'Today, 9:18 AM',
    notes: 'High water alarm activated on pump chamber. Need pumping and float switch diagnostic.'
  },
  {
    id: 'REQ-3102',
    name: 'Sarah Mitchell',
    phone: '(512) 555-0184',
    email: 'sarah.mitchell@example.com',
    address: '1248 Oakridge Lane, North Austin, TX',
    trade: 'HVAC',
    service: 'Annual AC Maintenance',
    source: 'Online Booking Widget',
    leadSource: 'Customer Portal',
    preferredDate: '2026-11-19',
    preferredTime: '8:00 AM',
    urgency: 'Normal',
    score: '88/100 · Existing plan member',
    status: 'Scheduled',
    createdAt: 'Today, 8:47 AM',
    notes: 'Member winter tune-up requested under existing VIP Comfort Membership.'
  },
  {
    id: 'REQ-3098',
    name: 'James Park',
    phone: '(512) 555-0144',
    email: 'jpark.tech@gmail.com',
    address: '4401 Spicewood Springs Rd, Austin, TX',
    trade: 'HVAC',
    service: 'New Heat Pump Assessment Visit',
    source: 'Phone / CSR Intake',
    leadSource: 'Google Local Services Ads',
    preferredDate: '2026-11-21',
    preferredTime: '1:00 PM',
    urgency: 'Normal',
    score: '96/100 · High ticket replacement',
    status: 'New',
    createdAt: 'Yesterday, 4:15 PM',
    notes: '15-year-old R-22 system failed. Wants Good/Better/Best proposal on high-efficiency inverter heat pump.'
  },
  {
    id: 'REQ-3095',
    name: 'David Keller',
    phone: '(512) 555-0171',
    email: 'dkeller@kellerbldg.com',
    address: '1100 Congress Ave, Austin, TX',
    trade: 'Backflow',
    service: 'City Compliance Backflow Inspection',
    source: 'Water Utility Referral',
    leadSource: 'Austin Water Portal',
    preferredDate: '2026-11-22',
    preferredTime: '10:00 AM',
    urgency: 'Normal',
    score: '85/100 · Annual recurring',
    status: 'New',
    createdAt: 'Yesterday, 11:30 AM',
    notes: 'City annual testing notice received. 2 commercial double-check assemblies on commercial irrigation.'
  }
];

export const initialTechnicians = [
  {
    id: 'TECH-01',
    name: 'Alex Morgan',
    role: 'Lead HVAC Specialist',
    initials: 'AM',
    color: 'blue',
    phone: '(512) 555-0101',
    email: 'alex.m@iboostfsm.com',
    trades: ['HVAC', 'Electrical'],
    crew: 'Truck 01 (North Austin)',
    shift: 'Mon - Fri · 7:30 AM - 4:30 PM',
    hourlyPay: 38.0,
    costRate: 52.0,
    rating: 4.9,
    jobsCompleted: 128,
    status: 'On a job',
    licenses: [
      { type: 'EPA Section 608 Universal', number: 'EPA-TX-884129', expires: '2027-10-15', status: 'Valid' },
      { type: 'TDLR Registered HVAC Technician', number: 'TX-HV-44910', expires: '2026-12-30', status: 'Valid (renewal soon)' }
    ]
  },
  {
    id: 'TECH-02',
    name: 'Jordan Lee',
    role: 'Master Plumber',
    initials: 'JL',
    color: 'violet',
    phone: '(512) 555-0102',
    email: 'jordan.l@iboostfsm.com',
    trades: ['Plumbing', 'Gas'],
    crew: 'Truck 02 (West Austin)',
    shift: 'Mon - Fri · 8:00 AM - 5:00 PM',
    hourlyPay: 42.0,
    costRate: 58.0,
    rating: 4.8,
    jobsCompleted: 96,
    status: 'En route',
    licenses: [
      { type: 'Texas Master Plumber License', number: 'TSBPE-M-31902', expires: '2027-04-18', status: 'Valid' },
      { type: 'Medical Gas Endorsement', number: 'MG-8812', expires: '2027-08-01', status: 'Valid' }
    ]
  },
  {
    id: 'TECH-03',
    name: 'Taylor Brooks',
    role: 'Backflow & Inspection Lead',
    initials: 'TB',
    color: 'amber',
    phone: '(512) 555-0103',
    email: 'taylor.b@iboostfsm.com',
    trades: ['Backflow', 'Plumbing'],
    crew: 'Truck 03 (East Austin / Round Rock)',
    shift: 'Mon - Fri · 8:00 AM - 5:00 PM',
    hourlyPay: 36.0,
    costRate: 49.0,
    rating: 4.9,
    jobsCompleted: 84,
    status: 'Available',
    licenses: [
      { type: 'TCEQ Backflow Assembly Tester (BPAT)', number: 'BPAT-0019284', expires: '2027-02-14', status: 'Valid' },
      { type: 'Gauge Calibration Certificate #BK-984', number: 'CAL-984-2026', expires: '2027-03-20', status: 'Valid' }
    ]
  },
  {
    id: 'TECH-04',
    name: 'Sam Rivera',
    role: 'Septic & Fleet Operations',
    initials: 'SR',
    color: 'green',
    phone: '(512) 555-0104',
    email: 'sam.r@iboostfsm.com',
    trades: ['Septic', 'Excavation'],
    crew: 'Pumper Truck 04 (County)',
    shift: 'Mon - Fri · 7:00 AM - 3:30 PM',
    hourlyPay: 35.0,
    costRate: 48.0,
    rating: 5.0,
    jobsCompleted: 63,
    status: 'Available',
    licenses: [
      { type: 'TCEQ Registered Sludge Hauler Permit', number: 'TCEQ-SH-24901', expires: '2027-06-30', status: 'Valid' },
      { type: 'Commercial Driver License (CDL-A Tanker)', number: 'CDL-TX-99120', expires: '2028-09-11', status: 'Valid' }
    ]
  }
];

export const initialEquipment = [
  {
    id: 'EQ-HVAC-101',
    customer: 'Sarah Mitchell',
    location: '1248 Oakridge Lane, North Austin',
    name: 'Carrier Infinity 4-Ton Split AC',
    category: 'HVAC',
    brand: 'Carrier',
    model: '24VNA948A003',
    serial: '4221E19842',
    installDate: '2021-04-12',
    age: '5.6 years',
    mfgWarrantyEnd: '2031-04-12',
    laborWarrantyEnd: '2022-04-12',
    status: 'Warranty active',
    lastService: 'Oct 14, 2026',
    notes: 'Puron R-410A charge 8.5 lbs. Clean filter size 20x25x4 MERV 11.'
  },
  {
    id: 'EQ-PLMB-204',
    customer: 'Cedar Grove Homes',
    location: '308 Willow Bend Dr, Unit 12',
    name: 'Rheem Commercial 75-Gal Gas Water Heater',
    category: 'Plumbing',
    brand: 'Rheem',
    model: 'G75-75N',
    serial: 'RH2020-89104',
    installDate: '2020-09-18',
    age: '6.2 years',
    mfgWarrantyEnd: '2026-09-18',
    laborWarrantyEnd: '2021-09-18',
    status: 'Service due',
    lastService: 'Mar 10, 2026',
    notes: 'Anode rod replacement recommended on next service.'
  },
  {
    id: 'EQ-BKF-301',
    customer: 'Marcus Reed',
    location: '92 Bluebonnet Trail, Round Rock',
    name: 'Febco 1-Inch RP Reduced Pressure Assembly',
    category: 'Backflow',
    brand: 'Febco',
    model: '850-100',
    serial: 'FB-88419',
    installDate: '2022-03-15',
    age: '4.7 years',
    mfgWarrantyEnd: '2027-03-15',
    laborWarrantyEnd: '2023-03-15',
    status: 'Annual test due',
    utilityName: 'City of Round Rock Water Utility',
    utilityAccount: 'RR-WTR-99410',
    hazardClass: 'High Hazard (Chemical fertigation line)',
    testDeadline: '2026-11-25',
    lastService: 'Nov 20, 2025 (Passed: 8.4 psi relief)'
  },
  {
    id: 'EQ-SEPT-501',
    customer: 'Elena Rodriguez',
    location: '1819 Juniper Way, Pflugerville',
    name: '1,000 Gallon Concrete 2-Compartment Septic Tank',
    category: 'Septic',
    brand: 'Precast Standard Tank Co.',
    model: 'ST-1000-2C',
    serial: 'PC-2018-0914',
    installDate: '2018-06-20',
    age: '8.4 years',
    mfgWarrantyEnd: '2028-06-20',
    laborWarrantyEnd: '2019-06-20',
    status: 'Pumping recommended',
    tankGallons: 1000,
    lidDepth: '18 inches',
    pumpIntervalYears: 3,
    lastPumpedDate: '2023-10-15',
    permitNo: 'TRAVIS-OSSF-84192',
    notes: 'Two concrete risers installed at surface level. Effluent filter cleaned annually.'
  }
];

export const initialLeads = [
  {
    id: 'LEAD-248',
    title: 'High-Efficiency Heat Pump Replacement',
    customer: 'Elena Rodriguez',
    phone: '(737) 555-0178',
    email: 'elena.rodriguez@outlook.com',
    trade: 'HVAC',
    budget: '$8,400',
    source: 'Google Search',
    owner: 'Alex Morgan',
    stage: 'Site visit',
    priority: 'High',
    nextFollowUp: 'Tomorrow, 10:00 AM',
    notes: 'Assessment visit completed. Proposed Good/Better/Best options sent via customer portal.'
  },
  {
    id: 'LEAD-251',
    title: 'Commercial Backflow Annual Testing (5 Sites)',
    customer: 'Cedar Grove Homes',
    phone: '(512) 555-0126',
    email: 'billing@cedargrovehomes.com',
    trade: 'Backflow',
    budget: '$1,450',
    source: 'Referral',
    owner: 'Taylor Brooks',
    stage: 'Quoted',
    priority: 'Normal',
    nextFollowUp: 'Friday, 2:00 PM',
    notes: 'Multi-site testing bundle for residential complex irrigation backflow valves.'
  },
  {
    id: 'LEAD-255',
    title: 'Septic Aerobic Treatment Unit Conversion',
    customer: 'David Keller',
    phone: '(512) 555-0171',
    email: 'dkeller@kellerbldg.com',
    trade: 'Septic',
    budget: '$14,200',
    source: 'Direct Website',
    owner: 'Sam Rivera',
    stage: 'New lead',
    priority: 'Normal',
    nextFollowUp: 'Today, 3:30 PM',
    notes: 'County inspection flagged conventional drain field failure. Wants aerobic drip conversion proposal.'
  }
];

export const initialQuotes = [
  {
    id: 'QUO-156',
    title: 'Complete AC & Heat Pump System Replacement',
    customer: 'Sarah Mitchell',
    customerRef: 'CUST-101',
    trade: 'HVAC',
    total: 8400.0,
    depositRequired: 2000.0,
    status: 'Approved (Deposit paid)',
    validUntil: '2026-12-05',
    options: [
      { name: 'Good (15 SEER Single Stage)', price: 6800.0, description: 'Reliable high efficiency system with 10-year parts warranty.' },
      { name: 'Better (17 SEER Two-Stage · Recommended)', price: 8400.0, recommended: true, description: 'Whisper-quiet comfort, smart thermostat, superior humidity removal.' },
      { name: 'Best (20 SEER Variable Inverter)', price: 10900.0, description: 'Ultimate energy savings, continuous climate tuning, 12-year warranty.' }
    ],
    items: [
      { name: 'Carrier 17 SEER Condenser & Air Handler', qty: 1, unitPrice: 6200.0, total: 6200.0 },
      { name: 'Installation Labor & Refrigerant Recovery', qty: 8, unitPrice: 150.0, total: 1200.0 },
      { name: 'Ecobee Smart Pro Thermostat & Supply Plenum', qty: 1, unitPrice: 450.0, total: 450.0 },
      { name: 'City Permit & HERS Duct Leakage Test', qty: 1, unitPrice: 550.0, total: 550.0 }
    ],
    approvedOption: 'Better (17 SEER Two-Stage)',
    depositTransaction: 'STRIPE-CHG-9941',
    createdDate: '2026-11-10'
  },
  {
    id: 'QUO-160',
    title: 'Annual Backflow Inspection & Assembly Rebuild',
    customer: 'Marcus Reed',
    customerRef: 'CUST-103',
    trade: 'Backflow',
    total: 285.0,
    depositRequired: 50.0,
    status: 'Sent (Viewed)',
    validUntil: '2026-11-28',
    options: [
      { name: 'Standard Annual Certification', price: 145.0, description: 'Official certified test and water utility filing.' },
      { name: 'Certification + First Check Valve Rebuild Kit', price: 285.0, recommended: true, description: 'Includes preventive rubber kit overhaul to prevent utility shutoff.' }
    ],
    items: [
      { name: 'TCEQ Backflow Test & City Report Submission', qty: 1, unitPrice: 145.0, total: 145.0 },
      { name: 'Febco 1-Inch Rubber Rebuild Kit', qty: 1, unitPrice: 95.0, total: 95.0 },
      { name: 'Specialist Labor', qty: 0.5, unitPrice: 90.0, total: 45.0 }
    ],
    createdDate: '2026-11-17'
  }
];

export const initialInvoices = [
  {
    id: 'INV-1082',
    jobRef: 'JB-2048',
    customer: 'Sarah Mitchell',
    customerRef: 'CUST-101',
    trade: 'HVAC',
    issueDate: '2026-11-18',
    dueDate: '2026-11-25',
    status: 'Paid',
    amount: 189.0,
    tax: 15.59,
    depositCredited: 50.0,
    balance: 0.0,
    paymentMethod: 'Credit Card (Online via Portal)',
    aging: 'Current',
    lineItems: [
      { description: 'Seasonal AC Multi-Point Inspection & Coil Clean', qty: 1, rate: 149.0, amount: 149.0 },
      { description: 'High Performance MERV 11 Filter Media', qty: 1, rate: 40.0, amount: 40.0 }
    ]
  },
  {
    id: 'INV-1078',
    jobRef: 'JB-2051',
    customer: 'Cedar Grove Homes',
    customerRef: 'CUST-102',
    trade: 'Plumbing',
    issueDate: '2026-11-15',
    dueDate: '2026-11-30',
    status: 'Open',
    amount: 1240.0,
    tax: 102.3,
    depositCredited: 300.0,
    balance: 940.0,
    paymentMethod: 'Net 15 Invoice (Pending)',
    aging: '1-15 days',
    lineItems: [
      { description: 'Commercial Gas Water Heater Burner Assembly Overhaul', qty: 1, rate: 850.0, amount: 850.0 },
      { description: 'Diagnostic Service Call & Safety Gas Test', qty: 1, rate: 390.0, amount: 390.0 }
    ]
  },
  {
    id: 'INV-1071',
    jobRef: 'JB-2057',
    customer: 'Willow Creek Dental',
    customerRef: 'CUST-104',
    trade: 'Electrical',
    issueDate: '2026-10-18',
    dueDate: '2026-11-02',
    status: 'Overdue',
    amount: 320.0,
    tax: 26.4,
    depositCredited: 0.0,
    balance: 320.0,
    paymentMethod: 'Net 15 (Reminder sequence active)',
    aging: '16-30 days overdue',
    lineItems: [
      { description: 'Sub-panel Circuit Breaker Replacement & Wire Trace', qty: 1, rate: 320.0, amount: 320.0 }
    ]
  }
];

export const initialPayments = [
  {
    id: 'PAY-8821',
    invoiceRef: 'INV-1082',
    customer: 'Sarah Mitchell',
    method: 'Online Card (Stripe)',
    amount: 189.0,
    tip: 20.0,
    fee: 5.67,
    net: 203.33,
    date: 'Today, 9:02 AM',
    status: 'Succeeded',
    payoutStatus: 'In transit to bank'
  },
  {
    id: 'PAY-8819',
    invoiceRef: 'INV-1075',
    customer: 'Marcus Reed',
    method: 'UPI / Direct Bank Transfer',
    amount: 285.0,
    tip: 0.0,
    fee: 0.0,
    net: 285.0,
    date: 'Yesterday, 3:45 PM',
    status: 'Succeeded',
    payoutStatus: 'Settled'
  },
  {
    id: 'PAY-8814',
    invoiceRef: 'INV-1069',
    customer: 'Elena Rodriguez',
    method: 'Cash Recorded (Held by Tech Sam)',
    amount: 150.0,
    tip: 15.0,
    fee: 0.0,
    net: 165.0,
    date: 'Nov 16, 2026',
    status: 'Office handover confirmed',
    payoutStatus: 'Cash in drawer'
  }
];

export const initialPricebook = [
  { id: 'PB-001', code: 'SV-HVAC-TUNE', name: 'AC Comprehensive Tune-Up (21-Point)', category: 'HVAC', type: 'Service', unit: 'each', price: 149.0, cost: 42.0, margin: '71.8%', taxable: true },
  { id: 'PB-002', code: 'SV-PLMB-DIAG', name: 'Plumbing Diagnostic & Camera Inspection', category: 'Plumbing', type: 'Service', unit: 'hour', price: 189.0, cost: 50.0, margin: '73.5%', taxable: true },
  { id: 'PB-003', code: 'SV-BKF-TEST', name: 'Backflow Preventer Annual Inspection & Certification', category: 'Backflow', type: 'Service', unit: 'assembly', price: 145.0, cost: 35.0, margin: '75.8%', taxable: true },
  { id: 'PB-004', code: 'SV-SEPT-PUMP', name: 'Residential Septic Tank Pumping (up to 1,000 gal)', category: 'Septic', type: 'Service', unit: 'tank', price: 550.0, cost: 180.0, margin: '67.2%', taxable: true },
  { id: 'PB-005', code: 'MT-FLTR-2025', name: 'High Efficiency 20x25x4 MERV 11 Air Filter', category: 'HVAC', type: 'Material', unit: 'each', price: 42.0, cost: 18.0, margin: '57.1%', taxable: true },
  { id: 'PB-006', code: 'MT-CAP-455', name: 'Dual Run Capacitor 45/5 MFD 440V Turbo', category: 'HVAC', type: 'Material', unit: 'each', price: 85.0, cost: 14.5, margin: '82.9%', taxable: true },
  { id: 'PB-007', code: 'MT-BKF-KIT', name: 'Febco 1-Inch Rubber Maintenance Kit', category: 'Backflow', type: 'Material', unit: 'kit', price: 95.0, cost: 38.0, margin: '60.0%', taxable: true }
];

export const initialInventory = [
  { id: 'INV-SKU-1', code: 'FLT-01', name: 'Air Filters 20x25x4', category: 'HVAC', warehouseQty: 48, truckQty: 8, minReorder: 15, unitCost: 18.0, status: 'In stock' },
  { id: 'INV-SKU-2', code: 'CAP-45', name: 'Dual Capacitor 45/5 MFD', category: 'HVAC', warehouseQty: 24, truckQty: 6, minReorder: 10, unitCost: 14.5, status: 'In stock' },
  { id: 'INV-SKU-3', code: 'PMP-SUB', name: 'Submersible Effluent Pump 1/2 HP', category: 'Septic', warehouseQty: 2, truckQty: 1, minReorder: 4, unitCost: 260.0, status: 'Low stock' },
  { id: 'INV-SKU-4', code: 'KIT-RP1', name: 'Backflow Rubber Rebuild Kit 1-Inch', category: 'Backflow', warehouseQty: 12, truckQty: 4, minReorder: 6, unitCost: 38.0, status: 'In stock' },
  { id: 'INV-SKU-5', code: 'GAS-410A', name: 'Puron R-410A Refrigerant Tank 25 lb', category: 'HVAC', warehouseQty: 6, truckQty: 2, minReorder: 3, unitCost: 195.0, status: 'In stock' }
];

export const initialCommunication = [
  { id: 'COMM-1', channel: 'SMS', direction: 'Outbound', customer: 'Sarah Mitchell', phone: '(512) 555-0184', subject: 'On-My-Way with Live ETA', text: 'Alex Morgan is en route to your location! Track his arrival live: https://ibst.io/t/am-2048', time: 'Today, 7:42 AM', status: 'Delivered', openStatus: 'Clicked' },
  { id: 'COMM-2', channel: 'Call', direction: 'Inbound', customer: 'Elena Rodriguez', phone: '(737) 555-0178', subject: 'Water heater alarm assistance', text: 'Call recording captured (1m 42s). AI transcript: Customer reported septic high water alert. Scheduled urgent pumper truck visit.', time: 'Today, 9:18 AM', status: 'Recorded & Transcribed', openStatus: 'Logged' },
  { id: 'COMM-3', channel: 'Email', direction: 'Outbound', customer: 'Cedar Grove Homes', phone: '(512) 555-0126', subject: 'Invoice INV-1078 & Service Report', text: 'Detailed service report and invoice for water heater overhaul sent to accounting department.', time: 'Yesterday, 4:20 PM', status: 'Delivered', openStatus: 'Opened (2 times)' }
];

export const initialReviews = [
  { id: 'REV-1', customer: 'Sarah Mitchell', rating: 5, source: 'Google Business Profile', date: '2 days ago', text: 'Alex from iBoost was punctual, polite, and explained our AC tune-up clearly. Great experience!', aiReplyDraft: 'Thank you Sarah! We are thrilled Alex provided top-tier service on your AC system. See you at your next seasonal check!' },
  { id: 'REV-2', customer: 'Marcus Reed', rating: 5, source: 'Google Business Profile', date: '5 days ago', text: 'Certified backflow testing done quickly and filed with Round Rock city the same afternoon. Very hassle-free.', aiReplyDraft: 'Thank you Marcus! Keeping your water compliance seamless is our priority. We have logged your annual test for next year!' }
];

export const initialSettings = {
  company: {
    name: 'Northstar Field Services',
    legalName: 'Northstar Service Partners LLC',
    phone: '(512) 555-0100',
    email: 'contact@northstarservices.com',
    website: 'https://northstar.iboostfsm.com',
    address: '1400 Lavaca St, Austin, TX 78701',
    licenses: 'TACLB-19042A (HVAC) · TSBPE-M31902 (Plumbing) · TCEQ-BPAT-19284 (Backflow)',
    insurance: 'Commercial General Liability $2,000,000 (Travelers Insurance)',
    logoColor: '#3883eb',
    timeZone: 'America/Chicago (Central Time)',
    currency: 'USD ($)'
  },
  hours: {
    workDays: 'Monday - Saturday',
    start: '7:30 AM',
    end: '6:00 PM',
    emergencyOnCall: true,
    serviceRadiusMiles: 45,
    territories: ['North Austin', 'Cedar Park', 'Round Rock', 'Pflugerville', 'Downtown Austin']
  },
  compliance: {
    a2p10DLCStatus: 'Registered & Approved',
    brandId: 'A2P-NORTHSTAR-2026',
    quietHours: '8:00 PM to 8:00 AM',
    smsConsentPolicy: 'Mandatory opt-in checkbox on web & phone forms'
  },
  integrations: {
    quickbooks: { connected: true, company: 'Northstar Service Partners QBO', lastSync: '10 min ago', syncDirection: 'Two-way invoices & customers' },
    googleLocalServices: { connected: true, status: 'Google Guaranteed Active', budget: '$1,200/mo' },
    stripe: { connected: true, status: 'Stripe Connect Live', payouts: 'Daily auto-transfer' }
  }
};

export const chartAnalyticsData = {
  revenueTrend: [
    { month: 'Jun', revenue: 42500, cost: 18200, profit: 24300, jobs: 138 },
    { month: 'Jul', revenue: 58900, cost: 24800, profit: 34100, jobs: 182 },
    { month: 'Aug', revenue: 64200, cost: 27100, profit: 37100, jobs: 198 },
    { month: 'Sep', revenue: 52100, cost: 22400, profit: 29700, jobs: 154 },
    { month: 'Oct', revenue: 61800, cost: 25900, profit: 35900, jobs: 176 },
    { month: 'Nov (Projected)', revenue: 69400, cost: 28300, profit: 41100, jobs: 194 }
  ],
  tradeDistribution: [
    { trade: 'HVAC Services', share: 44, value: '$30,500', color: '#3883eb' },
    { trade: 'Plumbing & Gas', share: 22, value: '$15,200', color: '#8269db' },
    { trade: 'Backflow Testing', share: 14, value: '$9,700', color: '#e5a73e' },
    { trade: 'Septic & Pumping', share: 12, value: '$8,300', color: '#34a994' },
    { trade: 'Electrical Repairs', share: 8, value: '$5,500', color: '#ef5b77' }
  ],
  techUtilization: [
    { name: 'Alex Morgan', trade: 'HVAC', hoursLogged: 38.5, billableRate: '92%', rating: 4.9, revenue: '$14,280' },
    { name: 'Jordan Lee', trade: 'Plumbing', hoursLogged: 36.0, billableRate: '88%', rating: 4.8, revenue: '$12,450' },
    { name: 'Taylor Brooks', trade: 'Backflow', hoursLogged: 34.0, billableRate: '85%', rating: 4.9, revenue: '$8,940' },
    { name: 'Sam Rivera', trade: 'Septic', hoursLogged: 32.5, billableRate: '82%', rating: 5.0, revenue: '$9,650' }
  ],
  funnelData: [
    { stage: '1. Inbound Leads / Calls', count: 142, rate: '100%' },
    { stage: '2. Contacted & Qualified', count: 128, rate: '90.1%' },
    { stage: '3. Assessment / Site Visit', count: 104, rate: '73.2%' },
    { stage: '4. Estimates & Quotes Sent', count: 96, rate: '67.6%' },
    { stage: '5. Approved & Jobs Won', count: 82, rate: '57.7%' }
  ],
  invoiceAging: [
    { bucket: 'Current (0-15d)', amount: '$14,820', count: 18, color: '#34a994' },
    { bucket: '16-30 Days', amount: '$4,120', count: 6, color: '#3883eb' },
    { bucket: '31-60 Days', amount: '$1,840', count: 3, color: '#e5a73e' },
    { bucket: '60+ Days Overdue', amount: '$680', count: 2, color: '#ef5b77' }
  ]
};

