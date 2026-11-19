import React, { useState } from 'react';
import { 
  MessageSquare, Star, Sparkles, Send, CheckCircle2, 
  ArrowRight, ShieldCheck, Globe, Users, Gift, Plus, Calendar,
  Phone, Clock, MapPin, Check, Award, Lock, ExternalLink
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function MarketingView({ 
  reviews = [], 
  notify 
}) {
  const [tab, setTab] = useState('Contractor Public Website (#73)');
  const [reviewList, setReviewList] = useState(reviews);

  // Online request interactive form state
  const [reqForm, setReqForm] = useState({
    name: 'Sarah Mitchell',
    phone: '(512) 555-0184',
    service: 'AC Seasonal Tune-Up (21-Point)',
    address: '1248 Oakridge Lane, North Austin, TX 78758',
    timeSlot: 'Morning (8:00 AM - 12:00 PM)',
    notes: 'Seasonal maintenance before summer heat.'
  });
  const [reqSubmitted, setReqSubmitted] = useState(false);

  const handleReqSubmit = (e) => {
    e.preventDefault();
    setReqSubmitted(true);
    notify?.('Online service request submitted! Feeds directly into Requests Inbox (#13)');
  };

  const approveReply = (id) => {
    notify?.('AI response approved and posted to Google Business Profile (#23)');
  };

  const serviceOptions = [
    { value: 'AC Seasonal Tune-Up (21-Point)', label: 'AC Seasonal Tune-Up (21-Point) · $149' },
    { value: 'Water Heater Repair & Flush', label: 'Water Heater Repair & Flush · $189' },
    { value: 'Backflow Annual Test (BPAT Certified)', label: 'Backflow Annual Test (BPAT Certified) · $145', badge: 'Compliance' },
    { value: 'Septic Tank Pumping (up to 1,000 gal)', label: 'Septic Tank Pumping (up to 1,000 gal) · $550', badge: 'County' },
    { value: 'Emergency Diagnostic Service', label: 'Emergency Diagnostic Call · $110', badge: 'Immediate' }
  ];

  const timeOptions = [
    { value: 'Morning (8:00 AM - 12:00 PM)', label: 'Morning (8:00 AM - 12:00 PM)' },
    { value: 'Afternoon (12:00 PM - 4:00 PM)', label: 'Afternoon (12:00 PM - 4:00 PM)' },
    { value: 'Late Afternoon (3:00 PM - 6:00 PM)', label: 'Late Afternoon (3:00 PM - 6:00 PM)' },
    { value: 'First Available / Emergency', label: '🚨 First Available / Emergency ASAP' }
  ];

  return (
    <div className="marketing-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">REPUTATION & GROWTH (#22, #23, #24, #25, #73)</div>
          <h1>Marketing, Reviews & Contractor Website</h1>
          <p>Automate post-job Google review requests, generate AI review responses, manage referral credits, and publish your SEO contractor site.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => notify?.('Simulated 5-day post-job review request sequence triggered (#22)')}>
            Send Review Request (#22)
          </button>
          <button className="button button-primary" onClick={() => notify?.('Campaign composer opened (#24)')}>
            <Plus size={16}/> New Campaign (#24)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {[
            'Contractor Public Website (#73)',
            'Google Reviews & AI Replies (#22, #23)', 
            '5-Day Review Automation (#22)', 
            'Customer Referral Credits (#25)'
          ].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Contractor Public Website & Request Service Online Showcase (#73) */}
      {tab === 'Contractor Public Website (#73)' && (
        <div className="contractor-website-showcase">
          {/* Browser Mockup Container */}
          <div className="browser-mockup surface">
            {/* Top Browser Window Bar */}
            <div className="browser-window-bar">
              <div className="browser-dots">
                <span className="dot red"/>
                <span className="dot yellow"/>
                <span className="dot green"/>
              </div>
              <div className="browser-address-pill">
                <Lock size={12} style={{ color: '#2f936b' }}/>
                <span>https://northstarservices.com</span>
                <span className="ssl-secure">SSL Secure</span>
              </div>
              <div className="browser-actions-right">
                <span className="live-status-chip">
                  <span className="live-pulse"/> Live Public Website (#73)
                </span>
                <button 
                  className="icon-button" 
                  title="Open in new window"
                  onClick={() => notify?.('Opening public website preview in new window')}
                >
                  <ExternalLink size={14}/>
                </button>
              </div>
            </div>

            {/* Website Navbar */}
            <header className="site-header-preview">
              <div className="site-brand">
                <div className="site-logo-icon">
                  <span className="logo-spark"/>
                </div>
                <div>
                  <strong>Northstar Services</strong>
                  <small>HVAC · PLUMBING · BACKFLOW</small>
                </div>
              </div>

              <nav className="site-nav-links">
                <a href="#services" onClick={e => e.preventDefault()}>Services</a>
                <a href="#areas" onClick={e => e.preventDefault()}>Service Areas</a>
                <a href="#about" onClick={e => e.preventDefault()}>About Us</a>
                <a href="#reviews" onClick={e => e.preventDefault()}>Reviews (4.9 ★)</a>
              </nav>

              <div className="site-header-cta">
                <div className="phone-cta-block">
                  <small>24/7 EMERGENCY DISPATCH</small>
                  <strong>(512) 555-0100</strong>
                </div>
                <button className="button button-primary button-small" onClick={() => notify?.('Direct call triggered')}>
                  Call Now
                </button>
              </div>
            </header>

            {/* Hero Banner Section */}
            <div className="site-hero-layout">
              {/* Left Column: Authority & Trust */}
              <div className="site-hero-copy">
                <div className="hero-trust-badge">
                  <div className="stars-mini">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={13} fill="#f4b400" color="#f4b400"/>)}
                  </div>
                  <strong>4.9 Rating (148 Google Reviews)</strong>
                  <span className="divider-dot">·</span>
                  <span className="badge-guaranteed">Google Guaranteed</span>
                </div>

                <h1>Austin's Premier Multi-Trade Field Service Specialists</h1>
                <p>
                  Professional, licensed, and certified technicians for AC repair, commercial water heaters, 
                  municipal backflow testing, and septic tank pumping across North Austin, Cedar Park, and Round Rock.
                </p>

                {/* Service Highlights Pills */}
                <div className="hero-service-chips">
                  <span>❄️ AC Tune-up & Repair</span>
                  <span>🔥 Water Heater Replacement</span>
                  <span>🛡️ Backflow Annual Testing (BPAT)</span>
                  <span>🚜 Septic Pumping & Inspection</span>
                  <span>⚡ 200A Electrical Panels</span>
                </div>

                <div className="hero-commitments-grid">
                  <div className="commit-item">
                    <CheckCircle2 size={16} className="commit-check"/>
                    <div>
                      <strong>Same-Day Dispatch</strong>
                      <small>Fast arrival with GPS tracking link</small>
                    </div>
                  </div>
                  <div className="commit-item">
                    <CheckCircle2 size={16} className="commit-check"/>
                    <div>
                      <strong>Upfront Flat-Rate Pricing</strong>
                      <small>No hidden fees · Free estimates</small>
                    </div>
                  </div>
                  <div className="commit-item">
                    <CheckCircle2 size={16} className="commit-check"/>
                    <div>
                      <strong>Fully Licensed & Insured</strong>
                      <small>TACLB-19042A · Master Plumber M31902</small>
                    </div>
                  </div>
                  <div className="commit-item">
                    <CheckCircle2 size={16} className="commit-check"/>
                    <div>
                      <strong>100% Satisfaction Guarantee</strong>
                      <small>1-Year warranty on all labor</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Converting Online Request Card */}
              <div className="site-request-card-wrapper">
                <div className="online-request-card">
                  <div className="req-card-header">
                    <div>
                      <span className="req-card-kicker">INSTANT ONLINE INTAKE</span>
                      <h3>⚡ Request Service Online</h3>
                    </div>
                    <span className="resp-speed-badge">
                      <Clock size={12}/> Avg. reply in 6 mins
                    </span>
                  </div>

                  <p className="req-card-sub">
                    Directly feeds your request into the tenant inbox (#13). No phone wait required.
                  </p>

                  {reqSubmitted ? (
                    <div className="req-success-view">
                      <div className="success-icon-wrap">
                        <Check size={28}/>
                      </div>
                      <h4>Service Request Confirmed!</h4>
                      <p>
                        Thank you, <strong>{reqForm.name}</strong>. Your request for <strong>{reqForm.service}</strong> has 
                        been received in our dispatch queue. An SMS confirmation was sent to <strong>{reqForm.phone}</strong>.
                      </p>
                      <div className="req-success-details">
                        <div><span>Service Location:</span> <strong>{reqForm.address}</strong></div>
                        <div><span>Preferred Window:</span> <strong>{reqForm.timeSlot}</strong></div>
                      </div>
                      <button 
                        className="button button-quiet button-small" 
                        onClick={() => setReqSubmitted(false)}
                      >
                        Submit Another Request
                      </button>
                    </div>
                  ) : (
                    <form className="req-form" onSubmit={handleReqSubmit}>
                      <div className="field-row">
                        <label className="custom-input-label">
                          Your Full Name
                          <input 
                            required
                            value={reqForm.name}
                            onChange={e => setReqForm({ ...reqForm, name: e.target.value })}
                            placeholder="e.g. Sarah Mitchell"
                          />
                        </label>
                        <label className="custom-input-label">
                          Mobile Phone (For SMS ETA)
                          <input 
                            required
                            value={reqForm.phone}
                            onChange={e => setReqForm({ ...reqForm, phone: e.target.value })}
                            placeholder="(512) 555-0184"
                          />
                        </label>
                      </div>

                      <label className="custom-input-label">
                        Service Needed
                        <CustomSelect 
                          value={reqForm.service}
                          options={serviceOptions}
                          onChange={e => setReqForm({ ...reqForm, service: e.target.value })}
                        />
                      </label>

                      <label className="custom-input-label">
                        Service Street Address
                        <div className="input-with-badge">
                          <input 
                            required
                            value={reqForm.address}
                            onChange={e => setReqForm({ ...reqForm, address: e.target.value })}
                            placeholder="Street, City, State, ZIP"
                          />
                          <span className="coverage-badge"><Check size={11}/> In Service Area</span>
                        </div>
                      </label>

                      <label className="custom-input-label">
                        Preferred Arrival Window
                        <CustomSelect 
                          value={reqForm.timeSlot}
                          options={timeOptions}
                          onChange={e => setReqForm({ ...reqForm, timeSlot: e.target.value })}
                        />
                      </label>

                      <label className="custom-input-label">
                        Describe the Problem or Request
                        <textarea 
                          rows="2"
                          value={reqForm.notes}
                          onChange={e => setReqForm({ ...reqForm, notes: e.target.value })}
                          placeholder="Tell us what you're experiencing, access codes, or questions..."
                        />
                      </label>

                      <button type="submit" className="button button-primary req-submit-btn">
                        <span>Request Service Appointment</span>
                        <ArrowRight size={16}/>
                      </button>

                      <div className="form-safety-footer">
                        <ShieldCheck size={14}/>
                        <span>Your data is protected. By submitting, you agree to receive appointment SMS updates.</span>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Coverage Strip */}
            <div className="site-coverage-strip">
              <div className="coverage-label">
                <MapPin size={14}/>
                <strong>Fast Service Across Central Texas:</strong>
              </div>
              <div className="coverage-cities">
                <span>North Austin</span>
                <span>·</span>
                <span>Cedar Park</span>
                <span>·</span>
                <span>Round Rock</span>
                <span>·</span>
                <span>Pflugerville</span>
                <span>·</span>
                <span>Leander</span>
                <span>·</span>
                <span>Georgetown</span>
                <span>·</span>
                <span>Lakeway</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Google Reviews & AI Replies */}
      {tab === 'Google Reviews & AI Replies (#22, #23)' && (
        <div className="reviews-feed-container">
          <div className="reviews-score-hero surface">
            <div className="stars-summary">
              <strong>4.9</strong>
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={18} fill="#f4b400" color="#f4b400"/>)}
              </div>
              <span>Based on 148 verified Google reviews</span>
            </div>
            <div className="reviews-hero-badge">
              <ShieldCheck size={16}/>
              <span>Google Guaranteed & Verified Business Profile</span>
            </div>
          </div>

          <div className="review-cards-list">
            {reviewList.map(r => (
              <div key={r.id} className="surface review-card">
                <div className="review-card-head">
                  <div>
                    <strong>{r.customer}</strong>
                    <div className="review-stars-sub">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={13} fill="#f4b400" color="#f4b400"/>)}
                      <small>· {r.date} via {r.source}</small>
                    </div>
                  </div>
                  <span className="status-pill status-scheduled">Verified Customer</span>
                </div>

                <p className="review-text">"{r.text}"</p>

                {/* AI Review Reply Drafter (#23) */}
                <div className="ai-reply-box">
                  <div className="ai-reply-head">
                    <Sparkles size={14}/>
                    <span>AI-Generated Response Draft (#23)</span>
                  </div>
                  <p className="ai-draft-body">{r.aiReplyDraft}</p>
                  <div className="ai-reply-actions">
                    <button className="button button-quiet button-small" onClick={() => notify?.('Edit draft dialog opened')}>
                      Edit Draft
                    </button>
                    <button className="button button-primary button-small" onClick={() => approveReply(r.id)}>
                      Approve & Post to Google
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: 5-Day Review Automation (#22) */}
      {tab === '5-Day Review Automation (#22)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '20px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Kalfigo-Inspired 5-Day Review Sequence (#22)</h2>
              <p>Rules trigger 1 friendly review request immediately after job completion, and exactly 1 follow-up after 5 business days.</p>
            </div>
            <span className="metric-badge-status green">Automation Active</span>
          </div>

          <div className="workflow-steps-horizontal">
            <div className="wstep-card">
              <span className="wstep-num">Step 1</span>
              <strong>Job Completed or Invoice Paid</strong>
              <p>First review request email & SMS sent automatically with direct Google link.</p>
            </div>
            <div className="wstep-card">
              <span className="wstep-num">Step 2 (Day 1 - 4)</span>
              <strong>System Monitors for Review</strong>
              <p>If customer submits a review or opts out, the follow-up reminder is cancelled.</p>
            </div>
            <div className="wstep-card active">
              <span className="wstep-num">Step 3 (Day 5)</span>
              <strong>Business Hours Reminder</strong>
              <p>One gentle reminder sent strictly between 9:00 AM and 5:00 PM on weekday.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Customer Referral Program (#25) */}
      {tab === 'Customer Referral Credits (#25)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '20px' }}>
          <div className="surface-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2>Referral Program & Automatic Invoice Credits (#25)</h2>
              <p>Reward existing customers with a $50 service credit when their friend books their first job.</p>
            </div>
            <span className="status-pill status-scheduled">Program Enabled</span>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>REFERRING CLIENT</th>
                  <th>REFERRED FRIEND</th>
                  <th>FIRST SERVICE COMPLETED</th>
                  <th>REWARD EARNED</th>
                  <th>CREDIT APPLIED TO INVOICE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Sarah Mitchell</strong></td>
                  <td>David Keller</td>
                  <td>Commercial Backflow Testing</td>
                  <td><strong style={{ color: '#34a994' }}>$50.00 Credit</strong></td>
                  <td>INV-1082 (Applied under subtotal)</td>
                  <td><span className="status-pill status-scheduled">Redeemed</span></td>
                </tr>
                <tr>
                  <td><strong>Elena Rodriguez</strong></td>
                  <td>Marcus Reed</td>
                  <td>AC Seasonal Maintenance</td>
                  <td><strong style={{ color: '#34a994' }}>$50.00 Credit</strong></td>
                  <td>Account Credit Balance ($50 available)</td>
                  <td><span className="status-pill status-progress">Available</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
