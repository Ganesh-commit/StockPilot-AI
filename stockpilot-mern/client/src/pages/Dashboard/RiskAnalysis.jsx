import React, { useState, useEffect } from 'react';
import { fetchPlan } from '../../services/api';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  DollarSign
} from 'lucide-react';

export default function RiskAnalysis() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchPlan(1e8, 0.4)
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#145C38' }}>Analyzing Portfolio Risk Vectors...</div>;
  }

  const rows = data.rows || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
          Travel Inventory Risk Analysis
        </h1>
        <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
          Overstock risk, understock opportunity costs, cancellation exposure & salvage liquidation modeling
        </p>
      </div>

      {/* 3 Core Risk Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#B93826', marginBottom: '12px' }}>
            <AlertTriangle size={20} />
            <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 700 }}>
              Perishable Spoilage Risk
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#687369', lineHeight: 1.6 }}>
            Unsold inventory automatically loses 75% of purchase value. StockPilot assumes a conservative 25% salvage recovery rate through B2B distress flash sales.
          </p>
          <div style={{ marginTop: '16px', padding: '10px 14px', backgroundColor: '#FDF0EE', borderRadius: '8px', fontSize: '12px', color: '#B93826', fontWeight: 600 }}>
            Salvage Liquidation Floor: 25% of Wholesale Cost
          </div>
        </div>

        <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#C07119', marginBottom: '12px' }}>
            <TrendingDown size={20} />
            <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 700 }}>
              Cancellation Slippage Risk
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#687369', lineHeight: 1.6 }}>
            Customer cancellations erode realized margins. The Newsvendor formulation explicitly deducts 50% of the cancellation rate from gross realized revenue expectations.
          </p>
          <div style={{ marginTop: '16px', padding: '10px 14px', backgroundColor: '#FEF6EA', borderRadius: '8px', fontSize: '12px', color: '#C07119', fontWeight: 600 }}>
            Model Penalty: Revenue · (1 - 0.5 · CancelRate)
          </div>
        </div>

        <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#145C38', marginBottom: '12px' }}>
            <CheckCircle2 size={20} />
            <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 700 }}>
              Unsold Penalty Control (λ)
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#687369', lineHeight: 1.6 }}>
            The objective function penalizes leftover inventory proportional to manager risk aversion ($\lambda$). Increasing $\lambda$ shifts procurement from volume to certainty.
          </p>
          <div style={{ marginTop: '16px', padding: '10px 14px', backgroundColor: '#EAF7EE', borderRadius: '8px', fontSize: '12px', color: '#145C38', fontWeight: 600 }}>
            Penalty: λ · 0.60 · UnitCost · LeftoverUnits
          </div>
        </div>
      </div>

      {/* Risk Scores Table */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <h2 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C', marginBottom: '16px' }}>
          Destination Inventory Risk Breakdown
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table className="travel-table">
            <thead>
              <tr>
                <th>Destination</th>
                <th>Category</th>
                <th>Procured Units</th>
                <th>Sell-Through</th>
                <th>Cancellation Rate</th>
                <th>Risk Score</th>
                <th>Risk Rating</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isHighRisk = row.riskScore > 40;
                const isMedRisk = row.riskScore > 20 && row.riskScore <= 40;
                const badgeClass = isHighRisk ? 'status-skip' : isMedRisk ? 'status-buypartly' : 'status-prebuy';
                const label = isHighRisk ? 'HIGH RISK' : isMedRisk ? 'MODERATE' : 'LOW RISK';

                return (
                  <tr key={i}>
                    <td><b>{row.name}</b></td>
                    <td style={{ color: '#687369' }}>{row.type}</td>
                    <td style={{ fontFamily: 'monospace' }}>{row.units.toLocaleString('en-IN')} units</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>
                      {row.units ? `${Math.round(row.sellThrough * 100)}%` : '–'}
                    </td>
                    <td style={{ fontFamily: 'monospace', color: '#C07119', fontWeight: 600 }}>
                      {Math.round((row.cancelRate || 0.12) * 100)}%
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '80px', height: '6px', backgroundColor: '#E8E2D7', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${row.riskScore}%`, height: '100%', backgroundColor: isHighRisk ? '#B93826' : isMedRisk ? '#F29A38' : '#145C38' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700 }}>
                          {row.riskScore}/100
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${badgeClass}`}>{label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
