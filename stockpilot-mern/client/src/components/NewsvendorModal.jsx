import React from 'react';
import { X, Calculator, ShieldCheck, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';

export default function NewsvendorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(24, 37, 28, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E2D7',
          borderRadius: '20px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          boxShadow: '0 20px 40px rgba(20, 92, 56, 0.15)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F4EBDD',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#18251C'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EAF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={22} color="#145C38" />
          </div>
          <div>
            <h3 className="font-serif" style={{ fontSize: '22px', color: '#18251C', fontWeight: 800 }}>
              The Newsvendor Model & Critical Ratio
            </h3>
            <p style={{ fontSize: '13px', color: '#687369' }}>
              How StockPilot AI balances overstock risk vs unmet demand
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '14px', color: '#18251C', lineHeight: 1.6 }}>
          <p>
            In perishable travel procurement (hotel room nights, flight seats, villa bookings), unsold stock expires with zero value at check-in or departure. The <b>Newsvendor Model</b> calculates the mathematically optimal purchase quantity $q^*$ by weighing two opposing risks:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ background: '#FAF7F0', border: '1px solid #E8E2D7', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#145C38', marginBottom: '6px' }}>
                1. Underage Cost ($C_u$)
              </div>
              <p style={{ fontSize: '13px', color: '#687369' }}>
                Lost profit when customer demand exceeds procured units:
              </p>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#145C38', marginTop: '6px' }}>
                Cu = Price · (1 - 0.5·Cancel) - Cost
              </div>
            </div>

            <div style={{ background: '#FAF7F0', border: '1px solid #E8E2D7', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#C07119', marginBottom: '6px' }}>
                2. Overage Cost ($C_o$)
              </div>
              <p style={{ fontSize: '13px', color: '#687369' }}>
                Net loss on an unsold unit after 25% salvage liquidation recovery:
              </p>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#C07119', marginTop: '6px' }}>
                Co = Cost - Salvage (0.25·Cost)
              </div>
            </div>
          </div>

          <div style={{ background: '#EAF7EE', border: '1px solid #B8E4C5', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontWeight: 700, color: '#145C38', marginBottom: '4px' }}>
              Critical Ratio Formula ($CR$):
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 800, color: '#10452C' }}>
              Critical Ratio = Cu / (Cu + Co)
            </div>
            <p style={{ fontSize: '12px', color: '#367A4D', marginTop: '6px' }}>
              $CR$ represents the optimal service level percentile. If $CR = 0.80$, StockPilot AI aims to satisfy 80% of possible demand distributions, capping purchases where additional inventory risk outweighs expected revenue.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>Greedy Capital Allocation with Risk Penalty ($\lambda$)</h4>
            <p style={{ fontSize: '13px', color: '#687369' }}>
              The platform evaluates marginal profit per invested rupee across all destinations, penalized by unsold risk:
            </p>
            <div style={{ background: '#FAF7F0', padding: '10px 14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', color: '#145C38', marginTop: '6px' }}>
              J(q) = ExpectedProfit(q) - λ · 0.6 · Cost · ExpectedUnsold(q)
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-primary-forest" style={{ padding: '9px 20px', fontSize: '14px' }}>
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
