import React, { useState } from 'react';
import { 
  MessageSquare, Phone, Mail, Send, Clock3, CheckCircle2, 
  ShieldCheck, Mic, Play, Plus, Search, Filter, AlertCircle
} from 'lucide-react';

export default function CommunicationView({ 
  communication = [], 
  calls = [], 
  setCommunication, 
  notify, 
  setCallOpen 
}) {
  const [tab, setTab] = useState('All messages');
  const [selectedThread, setSelectedThread] = useState(communication[0] || null);
  const [replyText, setReplyText] = useState('');

  const sendReply = () => {
    if (!replyText.trim() || !selectedThread) return;
    const msg = {
      id: `COMM-${Date.now()}`,
      channel: 'SMS',
      direction: 'Outbound',
      customer: selectedThread.customer,
      phone: selectedThread.phone,
      subject: 'Office Direct SMS',
      text: replyText,
      time: 'Just now',
      status: 'Delivered',
      openStatus: 'Sent'
    };
    setCommunication([msg, ...communication]);
    setReplyText('');
    notify?.(`SMS sent to ${selectedThread.customer}`);
  };

  return (
    <div className="communication-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">OMNICHANNEL INBOX & CALL TRACKING (#4, #17, #35, #36, #122)</div>
          <h1>Customer Communication History</h1>
          <p>Two-way text messaging, business phone call recordings with AI transcripts, and automated visit reminders.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => setCallOpen(true)}>
            <Phone size={15}/> Log Phone Call (#17)
          </button>
          <button className="button button-primary" onClick={() => notify?.('Message composer ready')}>
            <Plus size={16}/> Compose Message
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="surface module-toolbar" style={{ marginBottom: '16px' }}>
        <div className="module-tabs">
          {['All messages', '2-Way SMS Thread (#36)', 'Call Recordings & Transcripts (#17)', 'Automated Visit Reminders (#35)'].map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Split Inbox View for 2-Way SMS & Calls */}
      <div className="comm-split-layout">
        {/* Left Column: Messages List */}
        <div className="surface comm-threads-list">
          <div className="comm-threads-head">
            <strong>CONVERSATIONS & CALLS</strong>
            <small>{communication.length} active threads</small>
          </div>

          <div className="comm-items-scroll">
            {communication.map(item => (
              <div 
                key={item.id} 
                className={`comm-item-card ${selectedThread?.id === item.id ? 'active' : ''}`}
                onClick={() => setSelectedThread(item)}
              >
                <div className="comm-item-top">
                  <div className="comm-item-badge">
                    {item.channel === 'SMS' ? <MessageSquare size={13}/> : item.channel === 'Call' ? <Phone size={13}/> : <Mail size={13}/>}
                    <span>{item.channel}</span>
                  </div>
                  <small>{item.time}</small>
                </div>
                <strong>{item.customer}</strong>
                <span className="comm-phone-sub">{item.phone}</span>
                <p className="comm-snippet">{item.text}</p>
                <div className="comm-item-foot">
                  <span className="status-pill status-scheduled"><CheckCircle2 size={11}/> {item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Conversation / Call Audio Drawer */}
        <div className="surface comm-active-pane">
          {selectedThread ? (
            <div className="active-pane-inner">
              <div className="active-pane-head">
                <div>
                  <h3>{selectedThread.customer}</h3>
                  <small>{selectedThread.phone} · SMS Capable & Consented</small>
                </div>
                <span className="status-pill status-progress">
                  <ShieldCheck size={13}/> Verified A2P 10DLC
                </span>
              </div>

              {/* Chat timeline display */}
              <div className="chat-bubbles-timeline">
                <div className="chat-bubble incoming">
                  <span className="bubble-sender">{selectedThread.customer}</span>
                  <p>{selectedThread.text}</p>
                  <small>{selectedThread.time}</small>
                </div>

                <div className="chat-bubble outgoing">
                  <span className="bubble-sender">iBoost Dispatch</span>
                  <p>Thank you! Our lead technician Alex Morgan has your job scheduled. You will receive an ETA text before arrival.</p>
                  <small>Today, 8:02 AM · Delivered</small>
                </div>
              </div>

              {/* Reply Box */}
              <div className="chat-reply-box">
                <div className="chat-templates-bar">
                  <button onClick={() => setReplyText('Our technician is on the way to your location with an estimated arrival in 20 minutes.')}>
                    On My Way ETA
                  </button>
                  <button onClick={() => setReplyText('Here is the link to review and approve your proposal: https://ibst.io/q/160')}>
                    Send Quote Link
                  </button>
                  <button onClick={() => setReplyText('Your service invoice is ready for payment: https://ibst.io/i/1082')}>
                    Send Pay Link
                  </button>
                </div>
                <div className="chat-input-row">
                  <textarea 
                    rows="2" 
                    placeholder="Type a text message to customer (A2P 10DLC compliant)..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                  <button className="button button-primary" onClick={sendReply}>
                    <Send size={15}/> Send SMS
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <MessageSquare size={32}/>
              <strong>Select a customer conversation</strong>
              <span>View call recordings, SMS threads, and send text updates.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

