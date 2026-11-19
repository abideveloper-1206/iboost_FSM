import React, { useState } from 'react';
import { 
  Sparkles, Bot, Send, ShieldCheck, Camera, Mic, MapPin, 
  FileText, CheckCircle2, ArrowRight, ArrowUpRight, Zap, RefreshCw, AlertCircle
} from 'lucide-react';

export default function AIWorkspaceView({ notify }) {
  const [tab, setTab] = useState('Ask your data (#12, #81)');
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'bot',
      text: 'Good morning Alex! I am your iBoost Operations Assistant. You can ask natural-language questions about jobs, cash flow, equipment warranties, or dispatch efficiency.'
    }
  ]);

  // Voice to report simulation
  const [recordingVoice, setRecordingVoice] = useState(false);
  const [voiceReport, setVoiceReport] = useState(null);

  // Photo to quote simulation
  const [photoQuote, setPhotoQuote] = useState(null);

  const handleAsk = () => {
    if (!query.trim()) return;
    const userMsg = { sender: 'user', text: query };
    let reply = "Based on your active records, Northstar Services has 6 jobs scheduled today with $69,400 projected revenue this month. All 4 technicians have valid state licenses.";
    if (query.toLowerCase().includes('revenue') || query.toLowerCase().includes('money')) {
      reply = "Revenue this month is $69,400 across 194 jobs. Operating margin is 59.2%, with HVAC contributing 44% ($30,500) and Plumbing 22% ($15,200).";
    } else if (query.toLowerCase().includes('overdue') || query.toLowerCase().includes('unpaid')) {
      reply = "You have 2 overdue invoices totaling $680.00: INV-1071 (Willow Creek Dental, $320) and INV-1065 (Peakside Apartments, $360). Smart reminder sequences are active.";
    } else if (query.toLowerCase().includes('backflow') || query.toLowerCase().includes('compliance')) {
      reply = "Marcus Reed's Febco 1-inch assembly (EQ-BKF-301) has an annual test due in 5 days for the Round Rock water utility. Taylor Brooks is scheduled today at 10 AM.";
    }

    setChatLog([...chatLog, userMsg, { sender: 'bot', text: reply }]);
    setQuery('');
  };

  const simulateVoiceToReport = () => {
    setRecordingVoice(true);
    setTimeout(() => {
      setRecordingVoice(false);
      setVoiceReport({
        summary: 'Replaced faulty 45/5 MFD dual capacitor on Carrier condenser. Cleaned outdoor coil and measured refrigerant pressures: suction 118 psi, head 340 psi (R-410A normal).',
        partsUsed: ['1x Dual Run Capacitor 45/5 MFD ($85.00)', '1x Coil Cleaner Solution ($24.00)'],
        recommendations: 'Air filter MERV 11 replacement recommended on next seasonal inspection.',
        invoiceLine: 'AC Diagnostic, Capacitor Overhaul & Coil Wash · $229.00'
      });
      notify?.('Voice notes converted into structured work report (#5)');
    }, 1500);
  };

  const simulatePhotoToQuote = () => {
    setPhotoQuote({
      detected: 'Rusted 50-Gallon Atmospheric Gas Water Heater with leaking temperature relief valve.',
      suggestedItems: [
        { name: 'Rheem 50-Gal Gas Water Heater & Flue Connection', price: '$1,450.00' },
        { name: 'Thermal Expansion Tank & Pressure Regulator', price: '$320.00' },
        { name: 'City Plumbing Permit & Inspection', price: '$180.00' }
      ],
      draftProposalTotal: '$1,950.00 (Margin: 64.2%)'
    });
    notify?.('Photo analyzed: draft Good/Better/Best quote generated (#1)');
  };

  return (
    <div className="ai-workspace-module">
      <div className="page-heading">
        <div>
          <div className="eyebrow">IBOOST TITAN INTELLIGENCE · 26 AI FIELD SERVICE CAPABILITIES</div>
          <h1>AI Operations Workspace</h1>
          <p>Thoughtful AI assistance designed with human-in-the-loop guardrails: draft first, role-based security, and audit logs.</p>
        </div>
        <div className="heading-actions">
          <div className="ai-approval-chip">
            <ShieldCheck size={16}/> People approve every action (#9 Guardrails)
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {[
            'Ask your data (#12, #81)', 
            'Voice to Job Report (#5)', 
            'Photo to Quote (#1)', 
            'AI Guardrails & Safety (#9, #26)'
          ].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Ask Your Data Natural Language */}
      {tab === 'Ask your data (#12, #81)' && (
        <div className="ai-assistant-card surface">
          <div className="ai-chat-header">
            <div className="widget-icon"><Sparkles size={18}/></div>
            <div>
              <h3>Ask Your Data Assistant (Jobber AI / ServiceTitan Atlas equivalent)</h3>
              <p>Natural language Q&A querying live customer records, jobs, financials, and equipment.</p>
            </div>
            <span className="status-pill status-scheduled">Claude & Gemini 3.8 Powered</span>
          </div>

          <div className="ai-chat-scroll">
            {chatLog.map((m, idx) => (
              <div key={idx} className={`ai-msg-row ${m.sender}`}>
                <div className="ai-msg-avatar">
                  {m.sender === 'bot' ? <Bot size={15}/> : 'AM'}
                </div>
                <div className="ai-msg-bubble">
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="ai-quick-prompts">
            <button onClick={() => setQuery('What is our revenue and margin this month?')}>
              What is our revenue this month?
            </button>
            <button onClick={() => setQuery('Which customer invoices are overdue?')}>
              Which customer invoices are overdue?
            </button>
            <button onClick={() => setQuery('Are any backflow test deadlines coming up?')}>
              Any backflow test deadlines?
            </button>
          </div>

          <div className="ai-chat-input-bar">
            <input 
              placeholder="Ask anything about jobs, customers, technicians, or cash flow..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
            />
            <button className="button button-primary" onClick={handleAsk}>
              <Send size={15}/> Ask iBoost
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Voice Notes to Job Report (#5) */}
      {tab === 'Voice to Job Report (#5)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '24px' }}>
          <div className="surface-header">
            <div>
              <h2>Voice Notes to Structured Job Report (#5)</h2>
              <p>Technicians speak rough notes in the field; AI formats a professional work summary, parts list, and invoice line.</p>
            </div>
          </div>

          <div className="voice-simulation-box">
            <button 
              className={`record-call-button ${recordingVoice ? 'recording' : ''}`}
              onClick={simulateVoiceToReport}
            >
              <Mic size={16}/> {recordingVoice ? 'Transcribing speech notes...' : 'Tap to Record Voice Notes (Demo)'}
            </button>

            {voiceReport && (
              <div className="voice-report-output">
                <div className="report-out-head">
                  <Sparkles size={16}/>
                  <strong>Structured Service Report Ready for Approval</strong>
                </div>
                <div className="report-out-body">
                  <div><span>Work Summary:</span> <p>{voiceReport.summary}</p></div>
                  <div><span>Parts Used:</span> 
                    <ul>{voiceReport.partsUsed.map((p, i) => <li key={i}>{p}</li>)}</ul>
                  </div>
                  <div><span>Recommendations:</span> <p>{voiceReport.recommendations}</p></div>
                  <div><span>Invoice Line:</span> <strong>{voiceReport.invoiceLine}</strong></div>
                </div>
                <button className="button button-primary button-small" onClick={() => notify?.('Work report attached to job record')}>
                  Attach to Work Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Photo to Quote (#1) */}
      {tab === 'Photo to Quote (#1)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '24px' }}>
          <div className="surface-header">
            <div>
              <h2>Photo-to-Quote Drafter (#1)</h2>
              <p>Upload site photos of damaged or aged equipment; AI identifies issues and drafts line items from your pricebook.</p>
            </div>
          </div>

          <div className="photo-quote-box">
            <button className="button button-primary" onClick={simulatePhotoToQuote}>
              <Camera size={16}/> Upload Photo / Simulate AI Quoter
            </button>

            {photoQuote && (
              <div className="photo-quote-result">
                <div className="photo-result-head">
                  <Sparkles size={16}/>
                  <strong>Visual AI Analysis Result</strong>
                </div>
                <p><strong>Identified Condition:</strong> {photoQuote.detected}</p>
                <div className="photo-items-list">
                  <strong>Recommended Pricebook Lines (#74):</strong>
                  {photoQuote.suggestedItems.map((item, idx) => (
                    <div key={idx} className="photo-item-row">
                      <span>{item.name}</span>
                      <strong>{item.price}</strong>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong>Draft Estimate Total: {photoQuote.draftProposalTotal}</strong>
                  <button className="button button-primary button-small" onClick={() => notify?.('Converted into draft customer proposal')}>
                    Convert to Good/Better/Best Quote (#9)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: AI Guardrails & Safety (#9, #26) */}
      {tab === 'AI Guardrails & Safety (#9, #26)' && (
        <div className="surface" style={{ borderRadius: '9px', padding: '24px' }}>
          <div className="surface-header">
            <div>
              <h2>AI Safety & Governance Guardrails (Document 1 Section 9)</h2>
              <p>Security rules guaranteeing that AI never sends, bills, or modifies records without staff verification.</p>
            </div>
            <span className="status-pill status-scheduled">All Guardrails Active</span>
          </div>

          <div className="guardrails-grid">
            <div className="guardrail-card">
              <span className="guardrail-icon"><ShieldCheck size={18}/></span>
              <strong>1. Draft First Policy</strong>
              <p>AI creates drafts only. It never sends a message, charges a card, or changes prices without a person clicking approve.</p>
            </div>
            <div className="guardrail-card">
              <span className="guardrail-icon"><ShieldCheck size={18}/></span>
              <strong>2. Role-Based Permissions (#8)</strong>
              <p>AI only accesses data the signed-in user has permission to see. Technicians cannot see costs or company-wide profit.</p>
            </div>
            <div className="guardrail-card">
              <span className="guardrail-icon"><ShieldCheck size={18}/></span>
              <strong>3. Prompt Injection Defense (#26)</strong>
              <p>Inbound customer texts, emails, and notes are sanitized as pure text data, preventing malicious prompt overrides.</p>
            </div>
            <div className="guardrail-card">
              <span className="guardrail-icon"><ShieldCheck size={18}/></span>
              <strong>4. Complete Audit Trail (#69)</strong>
              <p>Every AI query, draft generation, and staff modification is permanently logged with timestamp and user ID.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

