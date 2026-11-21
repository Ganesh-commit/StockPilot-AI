import React, { useState, useEffect } from 'react';
import { runScenarioSimulation } from '../../services/api';
import {
  Sliders,
  TrendingUp,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  GitCompare,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const formatCurrency = n => {
  if (n == null) return '₹0';
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1) + ' L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
};

export default function ScenarioSimulator() {
  const [budgetCr, setBudgetCr] = useState(10);
  const [demandDelta, setDemandDelta] = useState(15); // +15% demand surge
  const [costDelta, setCostDelta] = useState(5);     // +5% supplier cost inflation
  const [priceDelta, setPriceDelta] = useState(10);   // +10% selling price hike
  const [cancelDelta, setCancelDelta] = useState(0);  // 0% cancellation shift
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const d = await runScenarioSimulation({
        budget: budgetCr * 1e7,
        lambda: 0.4,
        demandDeltaPct: demandDelta,
        costDeltaPct: costDelta,
        priceDeltaPct: priceDelta,
        cancelDeltaPct: cancelDelta
      });
      setSimulation(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [budgetCr, demandDelta, costDelta, priceDelta, cancelDelta]);

  if (!simulation) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#145C38' }}>Simulating Market Scenarios...</div>;
  }

  const base = simulation.baseline;
  const mod = simulation.modified;
  const deltas = simulation.deltas;

  const comparisonChartData = [
    {
      metric: 'Deployed Capital',
      Baseline: +(base.spent / 1e7).toFixed(2),
      Scenario: +(mod.spent / 1e7).toFixed(2)
    },
    {
      metric: 'Expected Profit',
      Baseline: +(base.profit / 1e7).toFixed(2),
      Scenario: +(mod.profit / 1e7).toFixed(2)
    },
    {
      metric: 'Unsold Risk',
      Baseline: +(base.unsold / 1e7).toFixed(2),
      Scenario: +(mod.unsold / 1e7).toFixed(2)
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
            What-If Scenario Simulator
          </h1>
          <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
            Stress test market shocks, supplier inflation, festive demand surges, and cancellation spikes
          </p>
        </div>

        <button
          onClick={() => {
            setDemandDelta(0);
            setCostDelta(0);
            setPriceDelta(0);
            setCancelDelta(0);
          }}
          className="btn-secondary-neutral"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <RefreshCw size={14} />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Scenario Sliders Grid */}
      <div className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
        <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: '#18251C', marginBottom: '20px' }}>
          Simulated Market Perturbations
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {/* Demand Surge */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              <span>Demand Shock</span>
              <span style={{ color: demandDelta >= 0 ? '#145C38' : '#B93826', fontFamily: 'monospace' }}>
                {demandDelta >= 0 ? `+${demandDelta}%` : `${demandDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="50"
              step="5"
              value={demandDelta}
              onChange={e => setDemandDelta(+e.target.value)}
            />
            <div style={{ fontSize: '11px', color: '#8E998F', marginTop: '4px' }}>Simulate festive surge or sudden travel slowdown</div>
          </div>

          {/* Supplier Cost Inflation */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              <span>Supplier Cost Inflation</span>
              <span style={{ color: costDelta > 0 ? '#C07119' : '#145C38', fontFamily: 'monospace' }}>
                {costDelta >= 0 ? `+${costDelta}%` : `${costDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="5"
              value={costDelta}
              onChange={e => setCostDelta(+e.target.value)}
            />
            <div style={{ fontSize: '11px', color: '#8E998F', marginTop: '4px' }}>Airlines/hotels raising wholesale contract rates</div>
          </div>

          {/* Selling Price Adjustment */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              <span>Selling Price Adjustment</span>
              <span style={{ color: priceDelta >= 0 ? '#145C38' : '#B93826', fontFamily: 'monospace' }}>
                {priceDelta >= 0 ? `+${priceDelta}%` : `${priceDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="5"
              value={priceDelta}
              onChange={e => setPriceDelta(+e.target.value)}
            />
            <div style={{ fontSize: '11px', color: '#8E998F', marginTop: '4px' }}>Consumer price elasticity adjustments</div>
          </div>

          {/* Budget */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              <span>Capital Budget</span>
              <span style={{ color: '#145C38', fontFamily: 'monospace' }}>
                ₹{budgetCr} Cr
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              step="1"
              value={budgetCr}
              onChange={e => setBudgetCr(+e.target.value)}
            />
            <div style={{ fontSize: '11px', color: '#8E998F', marginTop: '4px' }}>Available cash allocated for testing</div>
          </div>
        </div>
      </div>

      {/* Comparison KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Profit Comparison */}
        <div className="travel-card" style={{ padding: '22px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>EXPECTED NET PROFIT</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace', margin: '4px 0' }}>
            {formatCurrency(mod.profit)}
          </div>
          <div style={{ fontSize: '12px', color: deltas.profitDelta >= 0 ? '#145C38' : '#B93826', fontWeight: 700 }}>
            {deltas.profitDelta >= 0 ? '▲ +' : '▼ '}
            {formatCurrency(deltas.profitDelta)} vs Baseline ({formatCurrency(base.profit)})
          </div>
        </div>

        {/* Capital Spent */}
        <div className="travel-card" style={{ padding: '22px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>BUDGET DEPLOYMENT</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace', margin: '4px 0' }}>
            {formatCurrency(mod.spent)}
          </div>
          <div style={{ fontSize: '12px', color: '#687369' }}>
            Baseline: {formatCurrency(base.spent)} ({Math.round((mod.spent / (mod.budget || 1)) * 100)}% utilized)
          </div>
        </div>

        {/* Sell-Through Velocity */}
        <div className="travel-card" style={{ padding: '22px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>EXPECTED SELL-THROUGH</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace', margin: '4px 0' }}>
            {Math.round(mod.sellThrough * 100)}%
          </div>
          <div style={{ fontSize: '12px', color: deltas.sellThroughDelta >= 0 ? '#145C38' : '#C07119', fontWeight: 700 }}>
            {deltas.sellThroughDelta >= 0 ? '▲ +' : '▼ '}
            {(deltas.sellThroughDelta * 100).toFixed(1)}% vs Baseline ({Math.round(base.sellThrough * 100)}%)
          </div>
        </div>

        {/* Unsold Inventory Risk */}
        <div className="travel-card" style={{ padding: '22px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>UNSOLD RISK EXPOSURE</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#C07119', fontFamily: 'monospace', margin: '4px 0' }}>
            {formatCurrency(mod.unsold)}
          </div>
          <div style={{ fontSize: '12px', color: '#687369' }}>
            Baseline: {formatCurrency(base.unsold)}
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <h2 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C', marginBottom: '16px' }}>
          Scenario Stress Comparison (₹ Crores)
        </h2>

        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer>
            <BarChart data={comparisonChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="metric" stroke="#8E998F" fontSize={12} />
              <YAxis stroke="#8E998F" fontSize={12} />
              <Tooltip
                formatter={val => `₹${val} Cr`}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E2D7',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Baseline" fill="#687369" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Scenario" fill="#145C38" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
