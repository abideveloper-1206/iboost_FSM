import React, { useState } from 'react';
import {
  ArrowRight, Blocks, CalendarDays, Check, CheckCircle2, ChevronDown,
  ChevronRight, CircleHelp, CreditCard, FileText, LayoutDashboard, MapPin,
  Plus, ShieldCheck, Users, X, Camera, Clock3, Gift, MessageSquare, Receipt, Star,
} from 'lucide-react';
import { FieldSelect } from './TenantWorkflows';

const readDemo = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } };
const pages = [
  ['Overview', LayoutDashboard],
  ['Appointments', CalendarDays],
  ['Service requests', MessageSquare],
  ['Quotes', FileText],
  ['Invoices', FileText],
  ['Equipment', Blocks],
  ['Service history', Clock3],
  ['My profile', Users],
  ['Refer a friend', Gift],
];
const initialQuotes = [{ id: 'QT-2041', title: 'Heat pump replacement', created: 'Nov 17, 2026', expires: 'Dec 17, 2026', status: 'Awaiting response', options: [{ name: 'Standard system', price: '$6,840', detail: 'High-efficiency system · 10-year parts warranty' }, { name: 'Premium system', price: '$8,290', detail: 'Variable speed · extended labor coverage' }] }];

export default function CustomerPortal({ customers, jobs, notify: externalNotify = () => {} }) {
  const [customerName, setCustomerName] = useState(customers[0]?.name || 'Sarah Mitchell');
  const [page, setPage] = useState('Overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const [action, setAction] = useState('');
  const [paid, setPaid] = useState(false);
  const [email, setEmail] = useState('sarah.mitchell@email.com');
  const [phone, setPhone] = useState('(512) 555-0184');
  const [feedback, setFeedback] = useState('');
  const [location, setLocation] = useState('');
  const [extraLocations, setExtraLocations] = useState([]);
  const [locationMenu, setLocationMenu] = useState(false);
  const [requests, setRequests] = useState(() => readDemo('iboost-demo-requests', []));
  const [quotes, setQuotes] = useState(() => JSON.parse(localStorage.getItem('iboost-demo-quotes') || 'null') || initialQuotes);
  const [quoteOption, setQuoteOption] = useState({});
  const [referralSent, setReferralSent] = useState(false);
  const [smsUpdates, setSmsUpdates] = useState(true);
  const [balanceRemaining, setBalanceRemaining] = useState(486);
  const [paymentAmount, setPaymentAmount] = useState(486);
  const [paymentTip, setPaymentTip] = useState('0');
  const [paymentType, setPaymentType] = useState('Pay in full');
  const [quoteConsent, setQuoteConsent] = useState(false);
  const notify = message => { externalNotify(message); setFeedback(message); window.setTimeout(() => setFeedback(''), 2600); };

  const customer = customers.find(item => item.name === customerName) || customers[0];
  const job = jobs.find(item => item.customer === customerName) || jobs[0];
  const currentLocation = location || customer?.detail || 'Home - North Austin';
  const locationChoices = [...new Set([customer?.detail || 'Home - North Austin', ...(customer?.badge === 'Commercial' ? ['Cedar Park · Unit 12', 'Round Rock · Building A'] : ['Vacation home · Cedar Park']), ...extraLocations])];
  const greeting = customer?.name.split(' ')[0] || 'there';

  const submitAction = event => {
    event.preventDefault();
    const form = event.currentTarget.elements;
    if (action === 'Pay invoice') {
      const amount = Math.min(Number(form.amount?.value || balanceRemaining), balanceRemaining);
      if (!Number.isFinite(amount) || amount <= 0) return;
      setBalanceRemaining(Math.max(0, balanceRemaining - amount));
      setPaid(amount >= balanceRemaining);
    }
    if (action === 'Pay deposit') setPaid(true);
    if (action === 'Add service location') {
      const form = event.currentTarget.elements;
      const nickname = form.nickname?.value || 'New property';
      const address = [form.street?.value, form.city?.value, form.zip?.value].filter(Boolean).join(', ');
      const next = [...extraLocations, `${nickname} · ${address}`]; setExtraLocations(next); setLocation(next[next.length-1]);
    }
    if (action === 'Approve quote' || action === 'Request quote changes') {
      const next = quotes.map(quote => quote.id === 'QT-2041' ? { ...quote, status: action === 'Approve quote' ? 'Approved' : 'Change requested', selectedOption: quoteOption[quote.id] || quote.options[0].name } : quote);
      setQuotes(next); localStorage.setItem('iboost-demo-quotes', JSON.stringify(next));
    }
    if (action === 'Request a service' || action === 'Reschedule visit' || action === 'Request cancellation') {
      const row = { id: `REQ-${3105 + requests.length}`, name: customer.name, customerId: customer.name, location: currentLocation, source: 'Customer portal', service: action === 'Request a service' ? (form.service?.value || 'Service request') : action, preferredDate: form.date?.value || '', preferredTime: form.window?.value || 'Flexible', notes: form.message?.value || '', phone: customer.phone || '', status: 'New', createdAt: new Date().toLocaleString() };
      const next = [row, ...readDemo('iboost-demo-requests', requests)]; setRequests(next); localStorage.setItem('iboost-demo-requests', JSON.stringify(next));
    }
    if (action === 'Approve quote') {
      const next = quotes.map(quote => quote.id === 'QT-2041' ? { ...quote, status: 'Approved', selectedOption: quoteOption[quote.id] || quote.options[0].name } : quote);
      setQuotes(next); localStorage.setItem('iboost-demo-quotes', JSON.stringify(next));
    }
    if (action === 'Request quote changes') {
      const next = quotes.map(quote => quote.id === 'QT-2041' ? { ...quote, status: 'Change requested', changeNote: form.message?.value || '' } : quote);
      setQuotes(next); localStorage.setItem('iboost-demo-quotes', JSON.stringify(next));
    }
    notify(action === 'Pay invoice' || action === 'Pay deposit'
      ? 'Demo payment recorded in this browser'
              : action === 'Approve quote' ? 'Quote approval saved in this demo' : `${action} submitted for ${customer.name}`);
    setAction('');
  };

  const heading = {
    Overview: ['YOUR HOME SERVICES', `Welcome back, ${greeting}`, 'Here is your service at a glance.'],
    Appointments: ['YOUR SCHEDULE', 'Appointments', 'Review upcoming service visits and request a change.'],
    Invoices: ['PAYMENTS & DOCUMENTS', 'Invoices', 'Review invoices and your account balance.'],
    Equipment: ['SERVICE HISTORY', 'Home equipment', 'Equipment and warranty information for your service location.'],
    'My profile': ['ACCOUNT DETAILS', 'My profile', 'Keep your contact information up to date.'],
    'Service requests': ['REQUESTS', 'Service requests', 'Track the requests you sent to your service team.'],
    Quotes: ['QUOTES & PROPOSALS', 'Quotes', 'Review options, approve work, or ask for a change.'],
    'Service history': ['PAST VISITS', 'Service history', 'Completed visits and reports for your locations.'],
    'Refer a friend': ['CUSTOMER REFERRALS', 'Refer a friend', 'Share Northstar Services with a friend or neighbor.'],
  }[page];

  return (
    <div className="customer-portal-shell">
      <section className="portal-frame surface">
        <header className="portal-top">
          <div className="portal-brand"><span className="portal-brand-mark"><i /><i /><i /></span><span><strong>Northstar Services</strong><small>Customer portal</small></span></div>
          <div className="portal-top-right">
            <span className="portal-demo-pill">DEMO PREVIEW</span><span className="portal-customer-identity"><span className="avatar avatar-blue">{customer?.initials || 'CU'}</span><strong>{customer?.name}</strong></span><span className="portal-help"><CircleHelp size={15} />Need help? <strong>(512) 555-0100</strong></span>
          </div>
        </header>

        <div className="portal-body">
          <nav className="portal-nav">{pages.map(([label, Icon]) => <button key={label} className={page === label ? 'active' : ''} onClick={() => setPage(label)}><Icon size={17} />{label}{label === 'Appointments' && <span>{job?1:0}</span>}{label === 'Quotes' && quotes.some(quote=>quote.status==='Awaiting response')&&<span>1</span>}</button>)}
            <div className="portal-nav-help"><ShieldCheck size={17} /><span><strong>Your account is secure</strong><small>Your service history is private to you.</small></span></div>
          </nav>
          <main className="portal-content">
            <div className="portal-active-location"><MapPin size={15}/><span><small>SERVICE LOCATION</small><strong>{currentLocation}</strong></span><div className="portal-customer-picker"><button className="portal-location-change" onClick={()=>setLocationMenu(!locationMenu)} aria-expanded={locationMenu}>Change location <ChevronDown size={14}/></button>{locationMenu&&<div className="portal-customer-menu">{locationChoices.map(item=><button key={item} onClick={()=>{setLocation(item);setLocationMenu(false)}}><MapPin size={14}/><span>{item}</span>{currentLocation===item&&<Check size={14}/>}</button>)}<button onClick={()=>{setAction('Add service location');setLocationMenu(false)}}><Plus size={14}/><span>Add a location</span></button></div>}</div></div>
            <div className="portal-welcome"><div><span className="portal-eyebrow">{heading[0]}</span><h2>{heading[1]}</h2><p>{heading[2]}</p></div>{page !== 'Invoices' && page !== 'Equipment' && page !== 'Quotes' && page !== 'Service history' && page !== 'Refer a friend' && <button className="button button-primary" onClick={() => page === 'My profile' ? notify('Profile changes saved in this demo') : setAction('Request a service')}>{page === 'My profile' ? <Check size={15} /> : <Plus size={16} />}{page === 'My profile' ? 'Save changes' : 'Request service'}</button>}</div>

            {page === 'Overview' && <>
              <div className="portal-stat-grid">
                <article><span className="portal-stat-icon blue"><CalendarDays size={17} /></span><small>UPCOMING VISIT</small><strong>{job?.type || 'No upcoming visit'}</strong><span>{job ? `${job.time} · ${job.tech}` : 'Book a service when needed'}</span></article>
                <article><span className="portal-stat-icon violet"><CreditCard size={17} /></span><small>ACCOUNT BALANCE</small><strong>${balanceRemaining.toFixed(2)}</strong><span>{balanceRemaining===0 ? 'All invoices are paid' : 'Invoice INV-1082 due Nov 25'}</span></article>
                <article><span className="portal-stat-icon green"><Blocks size={17} /></span><small>HOME EQUIPMENT</small><strong>3 assets</strong><span>Service history available</span></article>
              </div>
              <div className="portal-card-grid">
                <article className="portal-panel"><div className="portal-panel-head"><div><span className="portal-eyebrow">NEXT APPOINTMENT</span><h3>{job?.type || 'Schedule a visit'}</h3></div><span className="portal-status">{job?.status || 'Not scheduled'}</span></div>
                  <div className="portal-detail-line"><CalendarDays size={17} /><span><strong>Tuesday, November 18, 2026</strong><small>{job?.time || 'Time to be confirmed'} · {job?.duration || 'Service visit'}</small></span></div>
                  <div className="portal-detail-line"><MapPin size={17} /><span><strong>{job?.address || customer?.detail}</strong><small>Service address</small></span></div>
                  <div className="portal-detail-line"><Users size={17} /><span><strong>{job?.tech || 'Service team'}</strong><small>Your technician</small></span></div>
                  <div className="portal-panel-actions"><button className="button button-quiet" onClick={() => setAction('Reschedule visit')}>Reschedule</button><button className="portal-text-button" onClick={() => setAction('Request cancellation')}>Request cancellation</button></div>
                </article>
                <article className="portal-panel"><div className="portal-panel-head"><div><span className="portal-eyebrow">BILLING</span><h3>Latest invoice</h3></div><FileText size={18} /></div><div className="portal-invoice"><span>INV-1082 · AC maintenance</span><strong>{balanceRemaining === 0 ? 'Paid · $486.00' : `$${balanceRemaining.toFixed(2)} remaining`}</strong><small>Issued November 18, 2026</small></div><div className="portal-panel-actions"><button className="button button-primary" disabled={balanceRemaining === 0} onClick={() => setAction('Pay invoice')}>{balanceRemaining === 0 ? 'Paid' : <>Pay invoice <ArrowRight size={14} /></>}</button><button className="portal-text-button" onClick={() => notify('Invoice preview opened')}>View invoice</button></div></article>
                <article className="portal-panel"><div className="portal-panel-head"><div><span className="portal-eyebrow">QUOTE TO REVIEW</span><h3>{quotes.find(quote=>quote.status==='Awaiting response')?.title||'No quote awaiting you'}</h3></div><FileText size={18}/></div>{quotes.find(quote=>quote.status==='Awaiting response')?<><div className="portal-invoice"><span>{quotes[0].id} · expires {quotes[0].expires}</span><strong>From {quotes[0].options[0].price}</strong><small>Choose a service option and approve when ready.</small></div><button className="button button-quiet" onClick={()=>setPage('Quotes')}>Review quote <ArrowRight size={14}/></button></>:<span className="portal-muted-copy">New estimates will appear here.</span>}</article>
              </div>
              <article className="portal-panel portal-equipment-strip"><div className="portal-panel-head"><div><span className="portal-eyebrow">YOUR EQUIPMENT</span><h3>Installed at your home</h3></div><button className="portal-text-button" onClick={() => setPage('Equipment')}>View equipment <ArrowRight size={14} /></button></div><EquipmentItems /></article>
            </>}

            {page === 'Appointments' && <>
              <article className="portal-panel portal-listing"><div className="portal-panel-head"><div><span className="portal-eyebrow">UPCOMING</span><h3>{job?.type || 'Service visit'}</h3></div><span className="portal-status">{job?.status || 'Scheduled'}</span></div><div className="portal-detail-line"><CalendarDays size={17} /><span><strong>Tuesday, November 18, 2026 · {job?.time}</strong><small>Estimated duration {job?.duration}</small></span></div><div className="portal-detail-line"><MapPin size={17} /><span><strong>{job?.address}</strong><small>Service location</small></span></div><div className="portal-panel-actions"><button className="button button-quiet" onClick={() => setAction('Reschedule visit')}>Reschedule visit</button><button className="portal-text-button" onClick={() => setAction('Request cancellation')}>Request cancellation</button></div></article>
              <article className="portal-panel portal-listing"><div className="portal-panel-head"><div><span className="portal-eyebrow">COMPLETED</span><h3>Seasonal maintenance</h3></div><span className="portal-status done">Completed</span></div><div className="portal-detail-line"><CalendarDays size={17} /><span><strong>October 14, 2026</strong><small>Service report available</small></span></div><button className="portal-text-button" onClick={() => notify('Completed service report opened')}>View service report <ArrowRight size={14} /></button></article>
            </>}

            {page === 'Service requests' && <>
              <div className="portal-section-actions"><span>{requests.filter(item=>item.name===customer?.name).length} requests for {customer?.name}</span><button className="button button-primary" onClick={()=>setAction('Request a service')}><Plus size={15}/>New request</button></div>
              {requests.filter(item=>item.name===customer?.name).length ? requests.filter(item=>item.name===customer?.name).map(item=><article className="portal-panel portal-listing" key={item.id}><div className="portal-panel-head"><div><span className="portal-eyebrow">{item.id} · {item.source||'Customer portal'}</span><h3>{item.service||'Service request'}</h3></div><span className="portal-status">{item.status||'New'}</span></div><div className="portal-detail-line"><MapPin size={16}/><span><strong>{item.location||currentLocation}</strong><small>{item.preferredDate||'Date to be confirmed'} · {item.preferredTime||'Flexible'}</small></span></div><p className="portal-muted-copy">{item.notes||'The service team will review your request and follow up.'}</p></article>) : <div className="portal-empty"><MessageSquare size={24}/><strong>No service requests yet</strong><span>New requests and follow-up status will appear here.</span><button className="button button-primary" onClick={()=>setAction('Request a service')}>Request service</button></div>}
            </>}

            {page === 'Quotes' && <div className="portal-record-stack">{quotes.map(quote=><article className="portal-panel portal-listing" key={quote.id}><div className="portal-panel-head"><div><span className="portal-eyebrow">{quote.id} · CREATED {quote.created}</span><h3>{quote.title}</h3></div><span className={`portal-status ${quote.status==='Approved'?'done':''}`}>{quote.status}</span></div><p className="portal-muted-copy">Review the service options below. Ask for changes if you need different scope or timing.</p><div className="portal-quote-options">{quote.options.map(option=><button key={option.name} className={quoteOption[quote.id]===option.name?'selected':''} onClick={()=>setQuoteOption({...quoteOption,[quote.id]:option.name})}><span><strong>{option.name}</strong><small>{option.detail}</small></span><b>{option.price}</b>{quoteOption[quote.id]===option.name&&<CheckCircle2 size={16}/>}</button>)}</div>{quote.status!=='Approved'&&<div className="portal-panel-actions"><button className="button button-primary" onClick={()=>setAction('Approve quote')}>Approve selected option</button><button className="button button-quiet" onClick={()=>setAction('Request quote changes')}>Request changes</button></div>}{quote.status==='Approved'&&<div className="portal-payment-note"><CheckCircle2 size={16}/>Approved: {quote.selectedOption||quote.options[0].name}. Deposit and schedule confirmation are pending.</div>}</article>)}</div>}

            {page === 'Invoices' && <><article className="portal-panel portal-listing"><div className="portal-panel-head"><div><span className="portal-eyebrow">OPEN INVOICE · INV-1082</span><h3>AC maintenance</h3></div><span className={balanceRemaining === 0 ? 'portal-status done' : 'portal-status'}>{balanceRemaining === 0 ? 'Paid' : 'Due Nov 25'}</span></div><div className="portal-invoice"><strong>{balanceRemaining === 0 ? '$486.00 · Paid' : `$${balanceRemaining.toFixed(2)} remaining`}</strong><small>Issued November 18, 2026 · {customer?.name}</small></div><div className="portal-panel-actions"><button className="button button-primary" disabled={balanceRemaining === 0} onClick={() => setAction('Pay invoice')}>{balanceRemaining === 0 ? 'Paid' : <>Pay securely <ArrowRight size={14} /></>}</button><button className="button button-quiet" onClick={() => notify('Invoice PDF preview opened')}>View PDF</button><button className="portal-text-button" onClick={() => notify('Receipt preview opened')}>Receipt <Receipt size={14}/></button></div></article><article className="portal-panel portal-listing"><div className="portal-panel-head"><div><span className="portal-eyebrow">PAID · INV-1044</span><h3>Fall system tune-up</h3></div><span className="portal-status done">Paid · $219.00</span></div><div className="portal-detail-line"><CalendarDays size={17} /><span><strong>October 14, 2026</strong><small>Receipt available</small></span></div></article></>}

            {page === 'Equipment' && <div className="portal-equipment-list">{[['Carrier', 'Central AC unit', 'Installed May 2022', 'Last service Oct 14, 2026', 'Warranty active'], ['Rheem', 'Water heater', 'Installed Mar 2021', 'Maintenance due', 'Warranty ended'], ['Trane', 'Gas furnace', 'Installed Sep 2023', 'Last service Oct 14, 2026', 'Warranty active']].map(([brand, name, installed, last, warranty]) => <article className="portal-panel" key={name}><span className="portal-stat-icon blue"><Blocks size={18} /></span><div><span className="portal-eyebrow">{brand.toUpperCase()}</span><h3>{name}</h3><p>{installed}</p><small>{last} · {warranty}</small></div><ChevronRight size={17} /></article>)}</div>}

            {page === 'Service history' && <div className="portal-record-stack">{jobs.filter(item=>item.customer===customer?.name&&item.status==='Completed').map(item=><article className="portal-panel portal-listing" key={item.id}><div className="portal-panel-head"><div><span className="portal-eyebrow">{item.id} · COMPLETED</span><h3>{item.type}</h3></div><span className="portal-status done">Completed</span></div><div className="portal-detail-line"><CalendarDays size={16}/><span><strong>{item.date||'October 14, 2026'}</strong><small>{item.address||currentLocation}</small></span></div><button className="portal-text-button" onClick={()=>notify('Service report preview opened')}>View service report <ArrowRight size={14}/></button></article>)}{!jobs.some(item=>item.customer===customer?.name&&item.status==='Completed')&&<div className="portal-empty"><Clock3 size={24}/><strong>Service history will appear here</strong><span>Completed visits, reports, and equipment work stay with your account.</span></div>}</div>}

            {page === 'Refer a friend' && <article className="portal-panel portal-referral-card"><span className="portal-stat-icon violet"><Gift size={20}/></span><span className="portal-eyebrow">NORTHSTAR REFERRALS</span><h3>Share great service</h3><p>Invite a friend or neighbor. When they complete their first service, the referral credit will appear on your account.</p><div className="portal-referral-code">NORTHSTAR-{customer?.initials||'CUSTOMER'} <button onClick={()=>{navigator.clipboard?.writeText(`NORTHSTAR-${customer?.initials||'CUSTOMER'}`);notify('Referral code copied')}}>Copy code</button></div><label>Friend email<input id="referral-email" type="email" placeholder="friend@example.com"/></label><button className="button button-primary" onClick={()=>{setReferralSent(true);notify('Referral invitation saved in this demo')}}><Gift size={15}/>Send invitation</button>{referralSent&&<span className="portal-payment-note"><CheckCircle2 size={15}/>Invitation ready. No email was sent.</span>}</article>}

            {page === 'My profile' && <div className="portal-profile-layout"><article className="portal-panel portal-profile-form"><span className="portal-eyebrow">CONTACT DETAILS</span><h3>Your account</h3><label>Full name<input value={customer?.name || ''} readOnly /></label><label>Email address<input value={email} onChange={event => setEmail(event.target.value)} /></label><label>Phone number<input value={phone} onChange={event => setPhone(event.target.value)} /></label><label>Service location<input value={currentLocation} readOnly /></label><button className="button button-primary" onClick={()=>notify('Profile changes saved in this demo')}>Save profile <Check size={15}/></button></article><article className="portal-panel portal-profile-form"><span className="portal-eyebrow">PORTAL PREFERENCES</span><h3>Notifications & access</h3><label className="portal-preference-row">Email visit updates <input type="checkbox" defaultChecked/></label><label className="portal-preference-row">SMS visit updates <input type="checkbox" checked={smsUpdates} onChange={event=>setSmsUpdates(event.target.checked)}/></label><label className="portal-preference-row">Receive estimate and service-plan updates <input type="checkbox" defaultChecked/></label><p className="portal-muted-copy">Your portal is passwordless in this preview. Sign-in code verification is represented in the demo only.</p></article></div>}
          </main>
        </div>
        <footer className="portal-footer"><ShieldCheck size={14} />Your information is protected · Northstar Services<button onClick={() => notify('Privacy information opened')}>Privacy</button></footer>
      </section>
      {feedback && <div className="toast portal-toast"><CheckCircle2 size={17} />{feedback}</div>}
      {action && <div className="portal-dialog-backdrop" onMouseDown={event => event.target === event.currentTarget && setAction('')}><form className="portal-dialog" onSubmit={submitAction}><div className="portal-panel-head"><div><span className="portal-eyebrow">CUSTOMER PORTAL</span><h3>{action}</h3></div><button type="button" className="portal-close" onClick={() => setAction('')}><X size={18} /></button></div>
        {action === 'Pay invoice' ? <><p>Choose a demo payment amount for invoice INV-1082. Remaining balance: <strong>${balanceRemaining.toFixed(2)}</strong>.</p><label>Payment amount<FieldSelect name="paymentType" value={paymentType} options={['Pay in full','Pay a partial amount']} onChange={event=>{setPaymentType(event.target.value);setPaymentAmount(event.target.value==='Pay in full'?balanceRemaining:'100')}}/></label>{paymentType==='Pay a partial amount'&&<label>Amount to pay<input name="amount" type="number" min="1" max={balanceRemaining} step="0.01" value={paymentAmount} onChange={event=>setPaymentAmount(event.target.value)} required/></label>}<label>Optional technician tip<input name="tip" type="number" min="0" step="1" value={paymentTip} onChange={event=>setPaymentTip(event.target.value)}/></label><label>Payment method<div className="portal-payment-method"><CreditCard size={17}/> Visa ending in 4242 <span>Default</span></div></label><div className="portal-payment-total"><span>Invoice payment</span><strong>${(paymentType==='Pay in full'?balanceRemaining:Number(paymentAmount||0)).toFixed(2)}</strong><small>Optional tip is recorded separately in this demo.</small></div></> : action === 'Approve quote' ? <><p>Confirm the selected quote option. The service team will follow up to schedule and collect the deposit.</p><div className="portal-payment-note"><CheckCircle2 size={16}/>{quoteOption['QT-2041']||quotes[0]?.options[0]?.name||'Standard system'} selected</div><label className="portal-check-label"><input name="consent" type="checkbox" required/>I approve this estimate and authorize the team to contact me about scheduling.</label></> : action === 'Request quote changes' ? <><p>Tell the service team what you would like changed in the estimate.</p><label>Requested changes<textarea name="message" rows="4" placeholder="Scope, timing, or option questions" required/></label></> : action === 'Add service location' ? <><p>Add a property to your account for this preview.</p><div className="portal-dialog-grid"><label>Location name<input name="nickname" required placeholder="Vacation home"/></label><label>Street address<input name="street" required placeholder="Street address"/></label><label>City<input name="city" required placeholder="City"/></label><label>ZIP code<input name="zip" required placeholder="ZIP"/></label></div></> : <><p>{action === 'Reschedule visit' ? 'Choose a preferred date and arrival window. Dispatch will confirm availability.' : action === 'Request cancellation' ? 'Send a cancellation request to the service team. The visit remains scheduled until confirmed.' : 'Tell us what service you need and when you are available.'}</p>{action === 'Request a service' && <><label>Service needed<FieldSelect name="service" value={feedback.startsWith('service:')?feedback.slice(8):'AC repair'} options={['AC repair','Heating inspection','Water heater repair','Maintenance visit','Equipment installation','Other']} onChange={event=>setFeedback(`service:${event.target.value}`)}/></label><label>Issue photos<input name="photos" type="file" accept="image/*" multiple/></label></>}{action !== 'Request cancellation' && <><label>Preferred date<input name="date" type="date" defaultValue="2026-11-20" required/></label><label>Arrival window<FieldSelect name="window" value="9:00 AM – 12:00 PM" options={['8:00 AM – 10:00 AM','9:00 AM – 12:00 PM','12:00 PM – 3:00 PM','Flexible']} onChange={event=>setFeedback(`window:${event.target.value}`)}/></label></>}<label>Message<textarea name="message" rows="3" placeholder="Describe the issue or add a note for the service team"/></label><label className="portal-check-label"><input name="smsConsent" type="checkbox" defaultChecked/>Send me service updates by SMS</label></>}
        <div className="portal-dialog-actions"><button type="button" className="button button-quiet" onClick={() => setAction('')}>Cancel</button><button className="button button-primary" type="submit">{action === 'Pay invoice' ? 'Confirm demo payment' : action === 'Approve quote' ? 'Approve quote' : action === 'Request quote changes' ? 'Send change request' : action === 'Add service location' ? 'Save location' : 'Send request'} <ArrowRight size={14} /></button></div></form></div>}
    </div>
  );
}

function EquipmentItems() {
  return <div className="portal-equipment-items"><span><i className="equipment-dot blue" /><b>Carrier AC unit</b><small>Last serviced Oct 14</small></span><span><i className="equipment-dot amber" /><b>Rheem water heater</b><small>Maintenance due</small></span><span><i className="equipment-dot violet" /><b>Trane furnace</b><small>Warranty active</small></span></div>;
}

