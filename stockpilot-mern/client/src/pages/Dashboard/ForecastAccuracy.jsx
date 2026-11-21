import React, { useState, useEffect } from 'react';
import { fetchAccuracy } from '../../services/api';
import {
  TrendingUp,
  CheckCircle2,
  BarChart3,
  Calculator,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export default function ForecastAccuracy() {
  const [data, setData] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const d = await fetchAccuracy();
      setData(d);
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

  if (loading || !data) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#145C38' }}>Calculating Backtest Accuracy...</div>;
  }

  const items = data.items || [];
  const selectedItem = items[selectedIdx] || items[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
            Empirical Forecast Accuracy & Backtest Performance
          </h1>
          <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
            Evaluating MAE, RMSE, and MAPE across 26 rolling historical backtest weeks
          </p>
        </div>

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
            outline: 'none'
          }}
        >
          {items.map((it, i) => (
            <option key={i} value={i}>
              {it.destination} · {it.category}
            </option>
          ))}
        </select>
      </div>

      {/* Aggregate Accuracy KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>OVERALL MODEL ACCURACY</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace', marginTop: '4px' }}>
            {data.overallAccuracy}%
          </div>
          <div style={{ fontSize: '12px', color: '#145C38', marginTop: '4px' }}>High predictive reliability</div>
        </div>

        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>MEAN ABS ERROR (MAE)</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace', marginTop: '4px' }}>
            {selectedItem.mae} units
          </div>
          <div style={{ fontSize: '12px', color: '#687369', marginTop: '4px' }}>Average deviation per week</div>
        </div>

        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>ROOT MEAN SQ ERROR (RMSE)</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#C07119', fontFamily: 'monospace', marginTop: '4px' }}>
            {selectedItem.rmse} units
          </div>
          <div style={{ fontSize: '12px', color: '#687369', marginTop: '4px' }}>Penalizes large outlier shocks</div>
        </div>

        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>MEAN ABS PCT ERROR (MAPE)</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace', marginTop: '4px' }}>
            {selectedItem.mape}%
          </div>
          <div style={{ fontSize: '12px', color: '#145C38', marginTop: '4px' }}>Normalized error rate</div>
        </div>
      </div>

      {/* Actual vs Predicted Chart */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <h2 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C', marginBottom: '16px' }}>
          {selectedItem.destination} ({selectedItem.category}): Actual Bookings vs AI Baseline
        </h2>

        <div style={{ width: '100%', height: '340px' }}>
          <ResponsiveContainer>
            <LineChart data={selectedItem.comparisons} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="week" stroke="#8E998F" fontSize={11} interval={2} />
              <YAxis stroke="#8E998F" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E2D7',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="actual" stroke="#18251C" strokeWidth={2.5} dot={{ r: 3 }} name="Actual Observed" />
              <Line type="monotone" dataKey="predicted" stroke="#145C38" strokeWidth={3} strokeDasharray="5 5" dot={false} name="Model Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
