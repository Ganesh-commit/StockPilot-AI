import React from 'react';
import { Cpu, RefreshCw, BarChart3, BookOpen, Layers } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onReseed, isReseeding, isConnected }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand" onClick={() => setActiveTab('overview')}>
          <div className="brand-icon-box">
            <Cpu size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-title">StockPilot AI</span>
              <span className="brand-badge">PROTOTYPE</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Prasunex Innovathon 2026 · Round 3
            </div>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Layers size={15} />
            <span>Executive Cover</span>
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'optimizer' ? 'active' : ''}`}
            onClick={() => setActiveTab('optimizer')}
          >
            <BarChart3 size={15} />
            <span>Decision Engine</span>
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'math' ? 'active' : ''}`}
            onClick={() => setActiveTab('math')}
          >
            <BookOpen size={15} />
            <span>Math & Architecture</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          <div className="status-beacon-box">
            <span className="beacon-dot"></span>
            <span>{isConnected ? 'API Live (Node/Express)' : 'Offline'}</span>
          </div>

          <button
            className="btn-secondary"
            onClick={onReseed}
            disabled={isReseeding}
            title="Generate new synthetic market patterns"
          >
            <RefreshCw size={14} className={isReseeding ? 'spin-active' : ''} />
            <span>{isReseeding ? 'Regenerating...' : 'Reseed Data'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
