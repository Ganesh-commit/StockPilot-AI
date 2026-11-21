import React, { useState, useEffect } from 'react';
import { fetchPlan } from '../../services/api';
import {
  TrendingUp,
  Calendar,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export default function Forecasting() {
  const [items, setItems] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [horizon, setHorizon] = useState(12);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const d = await fetchPlan(1e8, 0.4);
      setItems(d.rows || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('stockpilot-reseeded', loadData);
    return () => window.removeEventListener('stockpilot-reseeded', loadData);
  }, []);

  if (loading || !items.length) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#145C38' }}>Loading Demand Model...</div>;
  }

  const it = items[selectedIdx] || items[0];
  const f = it.forecast;

  const chartData = [];
  if (f) {
    const o = f.hist;
    o.forEach((val, i) => {
      chartData.push({
        week: `W-${o.length - i}`,
        historical: val,
        soldOut: f.soldOut[i] ? val : null
      });
    });

    chartData[chartData.length - 1].forecastP50 = o[o.length - 1];
    chartData[chartData.length - 1].p10 = o[o.length - 1];
    chartData[chartData.length - 1].p90 = o[o.length - 1];

    const displayWeeks = Math.min(horizon, f.p50.length);
    for (let i = 0; i < displayWeeks; i++) {
      chartData.push({
        week: `W+${i + 1}`,
        forecastP50: f.p50[i],
        p10: f.p10[i],
        p90: f.p90[i]
      });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
            Multi-Horizon Demand Forecasting
          </h1>
          <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
            Seasonal decomposition, YoY trend extrapolation & P10/P50/P90 uncertainty tunnels
          </p>
        </div>

        {/* Destination Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={selectedIdx}
            onChange={e => setSelectedIdx(+e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #E8E2D7',
              backgroundColor: '#FAF7F0',
              fontSize: '14px',
              fontWeight: 600,
              color: '#18251C',
              outline: 'none'
            }}
          >
            {items.map((row, i) => (
              <option key={i} value={i}>
                {row.name} · {row.type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Model Parameters Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="travel-card" style={{ padding: '18px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>CUMULATIVE P50 DEMAND</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace', marginTop: '4px' }}>
            {Math.round(it.demandP50).toLocaleString('en-IN')} units
          </div>
          <div style={{ fontSize: '12px', color: '#145C38', marginTop: '4px' }}>Across 12-week buying window</div>
        </div>

        <div className="travel-card" style={{ padding: '18px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>FORECAST HORIZON</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#145C38' }}>{horizon} Weeks</span>
          </div>
          <input
            type="range"
            min="4"
            max="12"
            step="1"
            value={horizon}
            onChange={e => setHorizon(+e.target.value)}
            style={{ marginTop: '12px' }}
          />
        </div>

        <div className="travel-card" style={{ padding: '18px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>BACKTEST STANDARD ERROR</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace', marginTop: '4px' }}>
            ±{Math.round(f.band)} units / wk
          </div>
          <div style={{ fontSize: '12px', color: '#687369', marginTop: '4px' }}>Derived from 26-week backtest</div>
        </div>

        <div className="travel-card" style={{ padding: '18px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>SOLD-OUT FREQUENCY</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#C07119', fontFamily: 'monospace', marginTop: '4px' }}>
            {f.soldOut.filter(Boolean).length} Weeks
          </div>
          <div style={{ fontSize: '12px', color: '#687369', marginTop: '4px' }}>Censored at capacity ceilings</div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C' }}>
              Historical Demand & Confidence Tunnel (P10–P90)
            </h2>
            <p style={{ fontSize: '12px', color: '#687369' }}>
              Shaded green region represents 80% confidence interval under normal loss assumption
            </p>
          </div>
        </div>

        <div style={{ width: '100%', height: '360px' }}>
          <ResponsiveContainer>
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="week" stroke="#8E998F" fontSize={11} interval={3} />
              <YAxis stroke="#8E998F" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E2D7',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="p90" stroke="transparent" fill="#EAF7EE" name="P90 Optimistic Band" />
              <Area type="monotone" dataKey="p10" stroke="transparent" fill="#FFFFFF" name="P10 Conservative Band" />
              <Line type="monotone" dataKey="historical" stroke="#687369" strokeWidth={2.5} dot={false} name="Observed Historical" />
              <Line type="monotone" dataKey="forecastP50" stroke="#145C38" strokeWidth={3} strokeDasharray="5 5" dot={false} name="Forecast P50 Baseline" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
