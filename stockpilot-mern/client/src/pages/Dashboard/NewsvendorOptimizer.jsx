import React, { useState, useEffect } from 'react';
import { solveNewsvendorStandalone } from '../../services/api';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Info,
  DollarSign,
  CheckCircle2
} from 'lucide-react';

const formatCurrency = n => {
  if (n == null) return '₹0';
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1) + ' L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
};

export default function NewsvendorOptimizer() {
  const [cost, setCost] = useState(3200);
  const [price, setPrice] = useState(4400);
  const [cancelRate, setCancelRate] = useState(0.12);
  const [salvageRate, setSalvageRate] = useState(0.25);
  const [meanDemand, setMeanDemand] = useState(1200);
  const [sdDemand, setSdDemand] = useState(180);
  const [result, setResult] = useState(null);

  const calculate = async () => {
    try {
      const d = await solveNewsvendorStandalone({
        cost,
        price,
        cancelRate,
        salvageRate,
        mean: meanDemand,
        sd: sdDemand
      });
      setResult(d);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    calculate();
  }, [cost, price, cancelRate, salvageRate, meanDemand, sdDemand]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
          Newsvendor Economic Order Quantity Optimizer
        </h1>
        <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
          Mathematically balanced procurement solving for underage profit loss vs overage perishability
        </p>
      </div>

      {/* Inputs Card */}
      <div className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
        <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: '#18251C', marginBottom: '18px' }}>
          Economic & Demand Distribution Inputs
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#18251C', marginBottom: '6px' }}>
              Procurement Unit Cost (₹)
            </label>
            <input
              type="number"
              value={cost}
              onChange={e => setCost(+e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#18251C', marginBottom: '6px' }}>
              Selling Price (₹)
            </label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(+e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#18251C', marginBottom: '6px' }}>
              Cancellation Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={cancelRate}
              onChange={e => setCancelRate(+e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#18251C', marginBottom: '6px' }}>
              Salvage Recovery Floor (%)
            </label>
            <input
              type="number"
              step="0.05"
              value={salvageRate}
              onChange={e => setSalvageRate(+e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#18251C', marginBottom: '6px' }}>
              Expected Mean Demand (μ)
            </label>
            <input
              type="number"
              value={meanDemand}
              onChange={e => setMeanDemand(+e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#18251C', marginBottom: '6px' }}>
              Forecast Standard Dev (σ)
            </label>
            <input
              type="number"
              value={sdDemand}
              onChange={e => setSdDemand(+e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}
            />
          </div>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Key Metric Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
            <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>CRITICAL RATIO (CR)</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace', marginTop: '4px' }}>
                {result.criticalRatio}
              </div>
              <div style={{ fontSize: '12px', color: '#145C38', marginTop: '4px' }}>
                Optimal service level: {(result.criticalRatio * 100).toFixed(1)}%
              </div>
            </div>

            <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>OPTIMAL BUY QUANTITY (q*)</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace', marginTop: '4px' }}>
                {result.optimalQuantity.toLocaleString('en-IN')} units
              </div>
              <div style={{ fontSize: '12px', color: '#687369', marginTop: '4px' }}>
                Procurement spend: {formatCurrency(result.procurementCost)}
              </div>
            </div>

            <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>EXPECTED NET PROFIT</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace', marginTop: '4px' }}>
                {formatCurrency(result.expectedProfit)}
              </div>
              <div style={{ fontSize: '12px', color: '#145C38', marginTop: '4px' }}>
                {((result.expectedProfit / result.procurementCost) * 100).toFixed(1)}% Margin on Cost
              </div>
            </div>

            <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>EXPECTED LEFTOVER UNITS</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#C07119', fontFamily: 'monospace', marginTop: '4px' }}>
                {result.expectedUnsold} units
              </div>
              <div style={{ fontSize: '12px', color: '#687369', marginTop: '4px' }}>
                Salvage value recovered: {formatCurrency(result.expectedUnsold * cost * salvageRate)}
              </div>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
            <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: '#18251C', marginBottom: '8px' }}>
              Model Explanation & Economic Balance
            </h3>
            <p style={{ fontSize: '14px', color: '#687369', lineHeight: 1.6 }}>
              {result.recommendationReason}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div style={{ padding: '14px', backgroundColor: '#FAF7F0', borderRadius: '10px', border: '1px solid #E8E2D7' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#145C38' }}>Underage Cost (Cu):</span>
                <p style={{ fontSize: '13px', color: '#18251C', marginTop: '4px' }}>
                  If you buy 1 unit too few, you lose ₹{result.Cu} in net margin.
                </p>
              </div>
              <div style={{ padding: '14px', backgroundColor: '#FAF7F0', borderRadius: '10px', border: '1px solid #E8E2D7' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#C07119' }}>Overage Cost (Co):</span>
                <p style={{ fontSize: '13px', color: '#18251C', marginTop: '4px' }}>
                  If you buy 1 unit too many, you forfeit ₹{result.Co} after 25% salvage liquidation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
