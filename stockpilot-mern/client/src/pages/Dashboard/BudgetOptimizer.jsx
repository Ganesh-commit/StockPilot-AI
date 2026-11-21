import React, { useState, useEffect } from 'react';
import { fetchPlan } from '../../services/api';
import {
  Sliders,
  DollarSign,
  ShieldAlert,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  PieChart as PieIcon,
  CheckCircle2
} from 'lucide-react';
import NewsvendorModal from '../../components/NewsvendorModal.jsx';

const formatCurrency = n => {
  if (n == null) return '₹0';
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1) + ' L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
};

const formatNumber = n => Math.round(n || 0).toLocaleString('en-IN');

export default function BudgetOptimizer() {
  const [cr, setCr] = useState(10);
  const [lam, setLam] = useState(0.4);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMathOpen, setIsMathOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const d = await fetchPlan(cr * 1e7, lam);
        setResult(d);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [cr, lam]);

  const k = result && result.kpis;
  const rows = result && result.rows ? result.rows : [];

  const getRiskLabel = l => {
    if (l <= 0.25) return { text: 'Aggressive Volume Acquisition', color: '#B93826' };
    if (l <= 0.6) return { text: 'Balanced Profit & Risk Target', color: '#145C38' };
    return { text: 'Conservative Unsold Minimization', color: '#367A4D' };
  };

  const riskLabel = getRiskLabel(lam);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
            Capital Budget Optimizer
          </h1>
          <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
            Greedy fractional knapsack allocation based on risk-adjusted marginal profit per rupee
          </p>
        </div>

        <button
          onClick={() => setIsMathOpen(true)}
          className="btn-secondary-neutral"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <HelpCircle size={15} color="#145C38" />
          <span>How Algorithm Works</span>
        </button>
      </div>

      {/* Control Sliders Card */}
      <div className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px' }} className="optimizer-sliders">
          {/* Slider 1: Budget */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#18251C' }}>
                Total Procurement Budget Ceiling
              </span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace' }}>
                ₹{cr} Crores
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={cr}
              onChange={e => setCr(+e.target.value)}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              {[5, 10, 20, 35, 50].map(val => (
                <button
                  key={val}
                  onClick={() => setCr(val)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid #E8E2D7',
                    backgroundColor: cr === val ? '#145C38' : '#FAF7F0',
                    color: cr === val ? '#ffffff' : '#18251C',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  ₹{val} Cr
                </button>
              ))}
            </div>
          </div>

          {/* Slider 2: Risk Aversion */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#18251C' }}>
                  Unsold-Risk Aversion Parameter (λ)
                </span>
                <div style={{ fontSize: '11px', color: riskLabel.color, fontWeight: 700 }}>
                  {riskLabel.text}
                </div>
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#C07119', fontFamily: 'monospace' }}>
                {lam.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={lam}
              onChange={e => setLam(+e.target.value)}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              {[
                { label: 'Aggressive (0.1)', v: 0.1 },
                { label: 'Balanced (0.4)', v: 0.4 },
                { label: 'Conservative (0.8)', v: 0.8 }
              ].map(p => (
                <button
                  key={p.v}
                  onClick={() => setLam(p.v)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid #E8E2D7',
                    backgroundColor: lam === p.v ? '#F29A38' : '#FAF7F0',
                    color: lam === p.v ? '#ffffff' : '#18251C',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Outcomes Strip */}
      {k && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>ALLOCATED SPEND</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace', marginTop: '4px' }}>
              {formatCurrency(k.spent)}
            </div>
            <div style={{ fontSize: '12px', color: '#145C38', marginTop: '4px' }}>
              {Math.round((k.spent / k.budget) * 100)}% capital deployed
            </div>
          </div>

          <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>EXPECTED PROFIT</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace', marginTop: '4px' }}>
              {formatCurrency(k.profit)}
            </div>
            <div style={{ fontSize: '12px', color: '#145C38', marginTop: '4px' }}>
              {((k.profit / (k.spent || 1)) * 100).toFixed(1)}% ROI on deployed cash
            </div>
          </div>

          <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>EXPECTED SELL-THROUGH</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace', marginTop: '4px' }}>
              {Math.round(k.sellThrough * 100)}%
            </div>
            <div style={{ fontSize: '12px', color: '#687369', marginTop: '4px' }}>
              Minimal leftover unit spoilage
            </div>
          </div>

          <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>ALPHA VS EVEN ALLOCATION</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#C07119', fontFamily: 'monospace', marginTop: '4px' }}>
              {k.vsEven == null ? '–' : `+${(k.vsEven * 100).toFixed(0)}%`}
            </div>
            <div style={{ fontSize: '12px', color: '#687369', marginTop: '4px' }}>
              Algorithm improvement over naive split
            </div>
          </div>
        </div>
      )}

      {/* Allocation Matrix Table */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <h2 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C', marginBottom: '16px' }}>
          Optimal Capital Distribution Across Assets
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table className="travel-table">
            <thead>
              <tr>
                <th>Destination Asset</th>
                <th>Category</th>
                <th>Units Bought</th>
                <th>Allocated Capital</th>
                <th>% of Budget</th>
                <th>Expected Profit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const pct = k && k.spent > 0 ? ((r.spend / k.spent) * 100).toFixed(1) : '0';
                return (
                  <tr key={i}>
                    <td><b>{r.name}</b></td>
                    <td style={{ color: '#687369' }}>{r.type}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{formatNumber(r.units)} units</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>{formatCurrency(r.spend)}</td>
                    <td style={{ fontFamily: 'monospace' }}>{pct}%</td>
                    <td style={{ fontFamily: 'monospace', color: '#145C38', fontWeight: 700 }}>{formatCurrency(r.profit)}</td>
                    <td>
                      <span className={`status-pill ${r.action === 'PRE-BUY' ? 'status-prebuy' : r.action === 'BUY PARTLY' ? 'status-buypartly' : 'status-skip'}`}>
                        {r.action}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <NewsvendorModal isOpen={isMathOpen} onClose={() => setIsMathOpen(false)} />

      <style>{`
        @media (max-width: 800px) {
          .optimizer-sliders {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
