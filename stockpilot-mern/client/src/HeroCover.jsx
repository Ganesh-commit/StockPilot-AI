import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function HeroCover({ onLaunchEngine, onOpenMath, kpis }) {
  const tickerItems = [
    { dest: 'Goa', cat: 'Hotels', price: '₹4,400', trend: '+14% YoY', status: 'Pre-buy' },
    { dest: 'Dubai', cat: 'Flights', price: '₹16,800', trend: '+12% YoY', status: 'Pre-buy' },
    { dest: 'Bali', cat: 'Resorts', price: '₹8,600', trend: '+18% YoY', status: 'Pre-buy' },
    { dest: 'Maldives', cat: 'Villas', price: '₹30,000', trend: '-5% Soft', status: 'Skip' },
    { dest: 'Singapore', cat: 'Hotels', price: '₹6,900', trend: '+10% YoY', status: 'Pre-buy' },
    { dest: 'Jaipur', cat: 'Hotels', price: '₹3,700', trend: '+16% YoY', status: 'Pre-buy' },
    { dest: 'Bangkok', cat: 'Flights', price: '₹11,200', trend: '+13% YoY', status: 'Buy partly' },
    { dest: 'Kerala', cat: 'Resorts', price: '₹5,900', trend: '+17% YoY', status: 'Pre-buy' },
  ];

  return (
    <div>
      {/* Live Marquee Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-content">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={idx} className="ticker-item">
              <b>{item.dest}</b>
              <span>({item.cat})</span>
              <span className="font-mono">{item.price}</span>
              <span className="badge-up">{item.trend}</span>
              <span style={{ color: item.status === 'Pre-buy' ? 'var(--emerald)' : (item.status === 'Skip' ? 'var(--rose)' : 'var(--amber)'), fontWeight: 700, fontSize: '11px' }}>
                [{item.status}]
              </span>
              <span style={{ color: 'var(--border-subtle)' }}>•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-back"></div>

        <div className="hero-content">
          <div className="hero-badge-pill">
            <Sparkles size={14} color="#38BDF8" />
            <span>AI-Driven Procurement Protocol</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span className="highlight">Prasunex Innovathon 2026</span>
          </div>

          <h1 className="hero-title">
            What to Buy, When, & At What Price —{' '}
            <span className="gradient-text">Zero Guesswork.</span>
          </h1>

          <p className="hero-description">
            StockPilot AI models 104 weeks of booking dynamics, forecasts demand confidence tunnels (P10–P90), and optimizes capital allocation using Newsvendor economics to maximize risk-adjusted profit under strict budget caps.
          </p>

          <div className="hero-actions">
            <button className="btn-primary-glow" onClick={onLaunchEngine}>
              <span>Launch Decision Engine</span>
              <ArrowRight size={18} />
            </button>

            <button className="btn-secondary" onClick={onOpenMath}>
              <Zap size={16} color="#38BDF8" />
              <span>Explore Model Math</span>
            </button>
          </div>

          {/* Holographic Stats Grid */}
          <div className="hero-stats-grid">
            <div className="glass-card stat-pill interactive-glow">
              <div className="stat-pill-label">Optimization Horizon</div>
              <div className="stat-pill-val" style={{ color: '#38BDF8' }}>12 WEEKS</div>
              <div className="stat-pill-sub">Forward inventory buy plan</div>
            </div>

            <div className="glass-card stat-pill interactive-glow">
              <div className="stat-pill-label">Backtested Training</div>
              <div className="stat-pill-val" style={{ color: '#818CF8' }}>104 WEEKS</div>
              <div className="stat-pill-sub">Historical seasonal patterns</div>
            </div>

            <div className="glass-card stat-pill interactive-glow">
              <div className="stat-pill-label">Newsvendor Efficiency</div>
              <div className="stat-pill-val" style={{ color: '#34D399' }}>
                {kpis ? `${Math.round(kpis.sellThrough * 100)}%` : '96%'}
              </div>
              <div className="stat-pill-sub">Expected inventory sell-through</div>
            </div>

            <div className="glass-card stat-pill interactive-glow">
              <div className="stat-pill-label">Capital Outperformance</div>
              <div className="stat-pill-val" style={{ color: '#FBBF24' }}>
                {kpis && kpis.vsEven != null ? `+${(kpis.vsEven * 100).toFixed(0)}%` : '+18%'}
              </div>
              <div className="stat-pill-sub">Vs equal budget allocation</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
