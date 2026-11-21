import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  User,
  Building,
  Mail,
  Shield,
  Sliders,
  Save,
  Check
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'K Sai Goud');
  const [company, setCompany] = useState(user?.company || 'SkyRoute Travels OTA');
  const [email, setEmail] = useState(user?.email || 'sai@stockpilot.ai');
  const [defaultLambda, setDefaultLambda] = useState(0.4);
  const [salvageFloor, setSalvageFloor] = useState(25);
  const [saved, setSaved] = useState(false);

  const handleSave = e => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      {/* Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
              Platform & Organization Settings
            </h1>
            <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
              Manage team roles, default Newsvendor risk parameters, and salvage floors
            </p>
          </div>
          {user?.isDemo && (
            <span
              style={{
                backgroundColor: '#F4EBDD',
                border: '1px solid #D6CEBF',
                color: '#145C38',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '9999px',
                letterSpacing: '0.4px'
              }}
            >
              DEMO MODE: SIMULATED SETTINGS
            </span>
          )}
        </div>
      </div>

      {saved && (
        <div style={{ backgroundColor: '#EAF7EE', border: '1px solid #B8E4C5', padding: '12px 18px', borderRadius: '10px', color: '#145C38', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSave} className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: '#18251C' }}>
          Procurement Profile
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#18251C', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#18251C', marginBottom: '6px' }}>
              Organization / OTA Name
            </label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#18251C', marginBottom: '6px' }}>
            Work Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #E8E2D7', margin: '8px 0' }} />

        <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: '#18251C' }}>
          Algorithm Defaults
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#18251C', marginBottom: '6px' }}>
              Default Risk Aversion (λ)
            </label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={defaultLambda}
              onChange={e => setDefaultLambda(+e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#18251C', marginBottom: '6px' }}>
              Distress Salvage Floor (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={salvageFloor}
              onChange={e => setSalvageFloor(+e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <button type="submit" className="btn-primary-forest" style={{ padding: '10px 22px' }}>
            <Save size={16} />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
