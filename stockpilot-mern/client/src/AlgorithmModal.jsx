import React from 'react';
import { X, CheckCircle, Calculator, Database, ShieldAlert, Cpu } from 'lucide-react';

export default function AlgorithmModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div className="brand-icon-box" style={{ width: '36px', height: '36px', borderRadius: '10px' }}>
            <Cpu size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>StockPilot AI Model Architecture</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Theoretical formulations powering the autonomous procurement decisions
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px', fontSize: '14px', lineHeight: 1.6 }}>
          {/* Step 1 */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontWeight: 700, marginBottom: '6px' }}>
              <Database size={16} />
              <span>1. Synthetic Demand Generation & Sold-Out Censoring</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Simulates 104 historical weeks of booking transactions. Each travel asset embeds organic secular trend, 52-week sinusoidal seasonality, and Gaussian shock perturbations. When demand outstrips supplier capacity, demand observations are realistically censored at inventory ceilings.
            </p>
          </div>

          {/* Step 2 */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818CF8', fontWeight: 700, marginBottom: '6px' }}>
              <Calculator size={16} />
              <span>2. Multi-Horizon Forecast & P10/P50/P90 Uncertainty Bands</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Decomposes seasonal momentum with moving window smoothed YoY growth multipliers. A 26-week historical rolling backtest computes standard forecast variance ($\sigma$). Uncertainty tunnels expand across the 12-week buying horizon with $\sigma \cdot \sqrt{H}$.
            </p>
          </div>

          {/* Step 3 */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontWeight: 700, marginBottom: '6px' }}>
              <ShieldAlert size={16} />
              <span>3. Newsvendor Risk-Adjusted Profit Formulation</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Computes expected sales $S(q)$ and expected unsold inventory $U(q) = q - S(q)$ using Gaussian loss functions. Expected cancellation discounts and 25% salvage liquidation recovery are factored:
            </p>
            <div style={{ background: '#070C1E', padding: '10px 14px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#A5B4FC', margin: '8px 0' }}>
              Objective: J(q) = ExpectedProfit(q) - λ · UnsoldPenalty(q)
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Parameter $\lambda$ (0 to 1) allows procurement managers to dial between aggressive volume acquisition and conservative risk minimization.
            </p>
          </div>

          {/* Step 4 */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24', fontWeight: 700, marginBottom: '6px' }}>
              <CheckCircle size={16} />
              <span>4. Greedy Fractional Knapsack Allocation</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Allocates fixed capital (₹1 Cr to ₹50 Cr) iteratively to the inventory unit offering the highest marginal risk-adjusted profit per rupee ($\Delta J / \Delta \text{Cost}$), respecting supplier quotas and liquidity caps.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button className="btn-primary-glow" onClick={onClose} style={{ padding: '10px 20px', fontSize: '13px' }}>
            Got it, take me to Engine
          </button>
        </div>
      </div>
    </div>
  );
}
