import React, { useState } from 'react';
import { 
  CalendarDays, Users, Search, Filter, Plus, Clock3, MapPin, 
  ChevronLeft, ChevronRight, Activity, Sparkles, Send, MoreHorizontal,
  CloudRain, Sun, Compass, Truck, Layers, Check, X
} from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function DispatchView({ 
  jobs = [], 
  setJobs, 
  setModal, 
  setSelected, 
  notify 
}) {
  const [view, setView] = useState('Day');
  const [tech, setTech] = useState('All technicians');
  const [search, setSearch] = useState('');
  const [mapMode, setMapMode] = useState(false);
  const [suggestModal, setSuggestModal] = useState(false);

  const hours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'];

  const visible = jobs.filter(j => 
    (tech === 'All technicians' || j.tech === tech) &&
    `${j.customer} ${j.type} ${j.id}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dispatch-module-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">FIELD OPERATIONS · INTELLIGENT DISPATCH (#27, #28, #29, #31, #88)</div>
          <h1>Dispatch Board & Route Optimization</h1>
          <p>Real-time visual schedule, technician timeline lanes, weather advisories, and GPS customer ETA tracking.</p>
        </div>
        <div className="heading-actions">
          <button className="button button-quiet" onClick={() => setSuggestModal(true)}>
            <Sparkles size={15}/> Suggest a Time (#88)
          </button>
          <button className={`button ${mapMode ? 'button-primary' : 'button-quiet'}`} onClick={() => setMapMode(!mapMode)}>
            <MapPin size={15}/> {mapMode ? 'Calendar View' : 'Live Map View (#28, #29)'}
          </button>
          <button className="button button-primary" onClick={() => setModal('job')}>
            <Plus size={16}/> Create Job
          </button>
        </div>
      </div>

      {/* Weather Advisory Banner for Outdoor Trades (#84) */}
      <div className="weather-advisory-strip surface">
        <div className="weather-forecast-badge">
          <Sun size={17} style={{ color: '#e5a73e' }}/>
          <span>Austin, TX · 74°F Clear · Light Breeze</span>
        </div>
        <div className="weather-days-row">
          <span>Today: 74° ☀️</span>
          <span>Thu: 71° 🌤️</span>
          <span>Fri: 68° ⛅</span>
          <span style={{ color: '#3883eb', fontWeight: 600 }}>Sat: 59° 🌧️ 70% Rain Alert (Roofing/Septic)</span>
        </div>
        <button className="text-action" onClick={() => notify?.('Weather sensitivities reviewed for outdoor work')}>
          Advisories (#84) →
        </button>
      </div>

      {/* Toolbar */}
      <div className="dispatch-toolbar surface">
        <div className="date-nav">
          <button className="icon-button" onClick={() => notify?.('Previous day')}><ChevronLeft size={16}/></button>
          <div className="date-button">
            <CalendarDays size={16} style={{ color: '#3883eb' }}/>
            <strong>Wednesday, November 19, 2026</strong>
          </div>
          <button className="icon-button" onClick={() => notify?.('Next day')}><ChevronRight size={16}/></button>
          <button className="button button-small" onClick={() => notify?.('Today selected')}>Today</button>
        </div>

        <div className="dispatch-tools">
          <div style={{ width: '180px' }}>
            <CustomSelect 
              value={tech} 
              options={[
                { value: 'All technicians', label: 'All Technicians (4)' },
                { value: 'Alex Morgan', label: 'Alex Morgan (HVAC)' },
                { value: 'Jordan Lee', label: 'Jordan Lee (Plumbing)' },
                { value: 'Taylor Brooks', label: 'Taylor Brooks (Backflow)' },
                { value: 'Sam Rivera', label: 'Sam Rivera (Septic)' }
              ]} 
              onChange={e => setTech(e.target.value)} 
            />
          </div>
          <div className="dispatch-search">
            <Search size={15}/>
            <input placeholder="Find job or address..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="segmented view-switch">
            {['Day', 'Week', 'Month'].map(x => (
              <button key={x} className={view === x ? 'selected' : ''} onClick={() => setView(x)}>{x}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Mode (#28, #29) */}
      {mapMode ? (
        <div className="surface dispatch-map-canvas">
          <div className="map-canvas-header">
            <div>
              <h3>Live Field Fleet Map (#28, #29)</h3>
              <p>Real-time phone GPS positions and active customer tracking links.</p>
            </div>
            <div className="map-legend">
              <span><i style={{ background: '#3883eb' }}/> Truck 01 (Alex)</span>
              <span><i style={{ background: '#8269db' }}/> Truck 02 (Jordan)</span>
              <span><i style={{ background: '#e5a73e' }}/> Truck 03 (Taylor)</span>
              <span><i style={{ background: '#34a994' }}/> Pumper 04 (Sam)</span>
            </div>
          </div>
          <div className="simulated-map-container">
            <div className="map-road mroad-1"/>
            <div className="map-road mroad-2"/>
            <div className="map-road mroad-3"/>
            {/* Live technician pins */}
            <div className="live-tech-pin pin-alex" onClick={() => notify?.('Alex Morgan: 1248 Oakridge Lane · On job')}>
              <Truck size={14}/>
              <span>Alex (HVAC) · North Austin</span>
            </div>
            <div className="live-tech-pin pin-jordan" onClick={() => notify?.('Jordan Lee: 308 Willow Bend · En route (ETA 12m)')}>
              <Truck size={14}/>
              <span>Jordan (Plumb) · Cedar Park (ETA 12m)</span>
            </div>
            <div className="live-tech-pin pin-taylor" onClick={() => notify?.('Taylor Brooks: 92 Bluebonnet · Backflow testing')}>
              <Truck size={14}/>
              <span>Taylor (Backflow) · Round Rock</span>
            </div>
          </div>
        </div>
      ) : (
        /* Calendar Dispatch Board (#27) */
        <div className="surface board-card">
          <div className="board-head">
            <div className="board-time-head">TECHNICIAN / TRUCK</div>
            {hours.map(h => <span key={h}>{h}</span>)}
          </div>

          {['Alex Morgan', 'Jordan Lee', 'Taylor Brooks', 'Sam Rivera'].map((name, i) => {
            const techJobs = visible.filter(j => j.tech === name);
            const color = ['blue', 'violet', 'amber', 'green'][i];

            return (
              <div className="board-row" key={name}>
                <div className="board-tech">
                  <div className={`avatar avatar-${color}`}>
                    {name.split(' ').map(x => x[0]).join('')}
                    <i/>
                  </div>
                  <span>
                    <strong>{name}</strong>
                    <small>{techJobs.length} jobs assigned</small>
                  </span>
                </div>

                <div className="board-track">
                  {hours.map(h => <div className="board-hour" key={h}/>)}

                  {techJobs.map(j => {
                    let left = j.time.startsWith('8') ? 3 : j.time.startsWith('9') ? 16 : j.time.startsWith('10') ? 28 : j.time.startsWith('11') ? 40 : j.time.startsWith('1:') ? 56 : 72;
                    let width = j.duration === '2.5h' ? 24 : j.duration === '2h' ? 20 : 15;

                    return (
                      <button 
                        key={j.id} 
                        className={`board-job ${color} ${j.status === 'In progress' ? 'board-job-live' : ''}`}
                        style={{ left: `${left}%`, width: `${width}%` }}
                        onClick={() => setSelected(j)}
                      >
                        <span className="board-job-time">{j.time} · {j.duration}</span>
                        <strong>{j.customer}</strong>
                        <small>{j.type}</small>
                        <span className="board-job-status">● {j.status}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggest a Time Modal (#88) */}
      {suggestModal && (
        <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setSuggestModal(false)}>
          <div className="modal-card">
            <div className="modal-head">
              <div>
                <span className="modal-kicker">SMART SCHEDULING (#88)</span>
                <h2>Suggest a Time (3 Optimal Slots)</h2>
                <p>System calculates optimal technician openings with minimal driving distance.</p>
              </div>
              <button className="icon-button" onClick={() => setSuggestModal(false)}><X size={18}/></button>
            </div>

            <div className="modal-fields">
              <div className="slot-suggestion-card recommended">
                <span className="tier-tag rec-tag">RECOMMENDED · LEAST DRIVE TIME</span>
                <h4>Tomorrow, 9:00 AM - 11:00 AM</h4>
                <p>Assigned to <strong>Alex Morgan</strong> (Already in North Austin area · saves 28 min driving).</p>
                <button className="button button-primary button-small" onClick={() => { notify?.('Booked slot tomorrow at 9:00 AM'); setSuggestModal(false); }}>
                  Select Slot
                </button>
              </div>

              <div className="slot-suggestion-card">
                <span className="tier-tag">EARLIEST OPENING</span>
                <h4>Today, 3:30 PM - 5:30 PM</h4>
                <p>Assigned to <strong>Jordan Lee</strong> (Immediate open capacity window).</p>
                <button className="button button-quiet button-small" onClick={() => { notify?.('Booked slot today at 3:30 PM'); setSuggestModal(false); }}>
                  Select Slot
                </button>
              </div>

              <div className="slot-suggestion-card">
                <span className="tier-tag">SAME TECHNICIAN AS LAST VISIT</span>
                <h4>Friday, 10:00 AM - 12:00 PM</h4>
                <p>Assigned to <strong>Taylor Brooks</strong> (Serviced customer asset previously).</p>
                <button className="button button-quiet button-small" onClick={() => { notify?.('Booked slot Friday at 10:00 AM'); setSuggestModal(false); }}>
                  Select Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

