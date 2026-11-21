import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPlan } from '../../services/api';
import {
  TrendingUp,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  PieChart,
  ArrowRight,
  Package,
  Calendar,
  AlertCircle,
  Activity,
  Layers,
  Sparkles,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell
} from 'recharts';

const formatCurrency = n => {
  if (n == null) return '₹0';
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1) + ' L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
};

const formatNumber = n => Math.round(n || 0).toLocaleString('en-IN');

const COLORS = ['#145C38', '#F29A38', '#367A4D', '#10452C', '#C07119', '#E4DDD1', '#687369', '#B93826'];

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const d = await fetchPlan(1e8, 0.4);
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
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#145C38' }}>Loading Procurement Engine...</div>
          <div style={{ fontSize: '13px', color: '#687369', marginTop: '6px' }}>Evaluating Newsvendor risk-adjusted allocations</div>
        </div>
      </div>
    );
  }

  const kpis = data.kpis;
  const rows = data.rows || [];
  const selectedRow = rows[selectedIdx] || rows[0];

  // Prepare chart series combining historical and forecast
  const chartSeries = [];
  if (selectedRow && selectedRow.forecast) {
    const o = selectedRow.forecast.hist;
    const p50 = selectedRow.forecast.p50;
    const p10 = selectedRow.forecast.p10;
    const p90 = selectedRow.forecast.p90;
    const soldOut = selectedRow.forecast.soldOut;

    // Historical weeks
    o.forEach((val, i) => {
      chartSeries.push({
        week: `W-${o.length - i}`,
        historical: val,
        soldOut: soldOut[i] ? val : null
      });
    });

    // Today transition
    chartSeries[chartSeries.length - 1].forecastP50 = o[o.length - 1];
    chartSeries[chartSeries.length - 1].p10 = o[o.length - 1];
    chartSeries[chartSeries.length - 1].p90 = o[o.length - 1];

    // Forecast weeks
    p50.forEach((val, i) => {
      chartSeries.push({
        week: `W+${i + 1}`,
        forecastP50: val,
        p10: p10[i],
        p90: p90[i]
      });
    });
  }

  // Budget Allocation Pie Data
  const pieData = rows
    .filter(r => r.spend > 0)
    .map(r => ({
      name: `${r.name} (${r.type})`,
      value: r.spend
    }));

  const recentActivities = [
    {
      title: 'Demand Forecast Model Retrained',
      desc: '104-week seasonal decomposition completed across 8 travel assets.',
      time: '12m ago',
      type: 'model'
    },
    {
      title: 'Capital Budget Allocation Optimized',
      desc: '₹10 Cr deployed with 96% expected sell-through rate.',
      time: '1h ago',
      type: 'budget'
    },
    {
      title: 'Inventory Quota Verified',
      desc: 'Dubai flight seats block confirmed with Gulf Aviation Charters.',
      time: '3h ago',
      type: 'inventory'
    },
    {
      title: 'Procurement Order Underwritten',
      desc: '240 units of Goa beachfront rooms committed to portfolio.',
      time: '1d ago',
      type: 'order'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header Card */}
      <div
        className="travel-card"
        style={{
          padding: '24px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="font-serif" style={{ fontSize: '26px', fontWeight: 800, color: '#18251C' }}>
              Travel Procurement Dashboard
            </h1>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#EAF7EE', color: '#145C38' }}>
              LIVE OPTIMIZATION
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
            Autonomous capital allocation across travel inventory opportunities (12-week buying horizon)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/dashboard/optimizer')}
            className="btn-primary-forest"
            style={{ padding: '9px 18px', fontSize: '13px' }}
          >
            <span>Adjust Capital Budget</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          THE 5 DASHBOARD KPI CARDS SPECIFIED BY USER
          1. Total Budget
          2. Budget Utilized
          3. Projected Profit
          4. Expected Demand
          5. Active Opportunities
          ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        {/* KPI 1: Total Budget */}
        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>TOTAL BUDGET</span>
            <DollarSign size={18} color="#145C38" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace' }}>
            {formatCurrency(kpis.budget)}
          </div>
          <div style={{ fontSize: '12px', color: '#687369', marginTop: '6px' }}>
            Procurement capital ceiling
          </div>
        </div>

        {/* KPI 2: Budget Utilized */}
        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>BUDGET UTILIZED</span>
            <PieChart size={18} color="#145C38" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace' }}>
            {formatCurrency(kpis.spent)}
          </div>
          <div style={{ fontSize: '12px', color: '#145C38', fontWeight: 600, marginTop: '6px' }}>
            {Math.round((kpis.spent / kpis.budget) * 100)}% capital deployed
          </div>
        </div>

        {/* KPI 3: Projected Profit */}
        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>PROJECTED PROFIT</span>
            <TrendingUp size={18} color="#145C38" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace' }}>
            {formatCurrency(kpis.profit)}
          </div>
          <div style={{ fontSize: '12px', color: '#145C38', fontWeight: 600, marginTop: '6px' }}>
            {((kpis.profit / (kpis.spent || 1)) * 100).toFixed(1)}% Return on Capital
          </div>
        </div>

        {/* KPI 4: Expected Demand */}
        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>EXPECTED DEMAND</span>
            <CheckCircle2 size={18} color="#F29A38" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace' }}>
            {formatNumber(kpis.expectedDemand || 5420)}
          </div>
          <div style={{ fontSize: '12px', color: '#687369', marginTop: '6px' }}>
            P50 cumulative booked units
          </div>
        </div>

        {/* KPI 5: Active Opportunities */}
        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>ACTIVE OPPORTUNITIES</span>
            <Layers size={18} color="#C07119" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace' }}>
            {kpis.activeOpportunities || rows.length} Destinations
          </div>
          <div style={{ fontSize: '12px', color: '#145C38', fontWeight: 600, marginTop: '6px' }}>
            Hotels, flights & resorts
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }} className="overview-charts-grid">
        {/* Left: Demand Forecast Chart */}
        <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: '#18251C' }}>
                {selectedRow.name} · {selectedRow.type} Demand Forecast
              </h2>
              <p style={{ fontSize: '12px', color: '#687369' }}>
                Historical bookings vs 12-week forward P10/P50/P90 confidence tunnel
              </p>
            </div>

            <select
              value={selectedIdx}
              onChange={e => setSelectedIdx(+e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #E8E2D7',
                backgroundColor: '#FAF7F0',
                fontSize: '13px',
                color: '#18251C',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              {rows.map((r, i) => (
                <option key={r.id || i} value={i}>
                  {r.name} ({r.type})
                </option>
              ))}
            </select>
          </div>

          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <ComposedChart data={chartSeries} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="week" stroke="#8E998F" fontSize={11} interval={4} />
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
                {/* Confidence band area */}
                <Area type="monotone" dataKey="p90" stroke="transparent" fill="#EAF7EE" name="P90 Upper Band" />
                <Area type="monotone" dataKey="p10" stroke="transparent" fill="#FFFFFF" name="P10 Lower Band" />
                {/* Historical Observed */}
                <Line type="monotone" dataKey="historical" stroke="#687369" strokeWidth={2.5} dot={false} name="Observed Bookings" />
                {/* Forecast P50 */}
                <Line type="monotone" dataKey="forecastP50" stroke="#145C38" strokeWidth={3} strokeDasharray="5 5" dot={false} name="Forecast P50" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #E8E2D7', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#687369' }}>
            <span><b>Verdict:</b> {selectedRow.reason}</span>
            <span>Allocated: <b>{formatNumber(selectedRow.units)} units</b> ({formatCurrency(selectedRow.spend)})</span>
          </div>
        </div>

        {/* Right: Capital Allocation Donut */}
        <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: '#18251C', marginBottom: '4px' }}>
            Capital Allocation Split
          </h2>
          <p style={{ fontSize: '12px', color: '#687369', marginBottom: '16px' }}>
            Procurement deployment across destinations
          </p>

          <div style={{ width: '100%', height: '230px' }}>
            <ResponsiveContainer>
              <RechartsPie>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={value => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8E2D7',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            {pieData.slice(0, 4).map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span style={{ color: '#18251C', fontWeight: 600 }}>{p.name}</span>
                </div>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>
                  {formatCurrency(p.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Procurement Recommendations Table & Recent Activity Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }} className="overview-tables-grid">
        {/* Left: Recommendations */}
        <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C' }}>
                Recent Procurement Recommendations
              </h2>
              <p style={{ fontSize: '12px', color: '#687369' }}>
                Newsvendor risk-adjusted purchase allocations
              </p>
            </div>

            <button
              onClick={() => navigate('/dashboard/procurement')}
              className="btn-outline-forest"
              style={{ padding: '7px 14px', fontSize: '12px' }}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="travel-table">
              <thead>
                <tr>
                  <th>Opportunity</th>
                  <th>Demand P50</th>
                  <th>Buy Units</th>
                  <th>Capital Spend</th>
                  <th>Decision</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((row, idx) => {
                  const actionClass =
                    row.action === 'PRE-BUY'
                      ? 'status-prebuy'
                      : row.action === 'BUY PARTLY'
                      ? 'status-buypartly'
                      : 'status-skip';

                  return (
                    <tr
                      key={row.id || idx}
                      onClick={() => setSelectedIdx(idx)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedIdx === idx ? '#F5EFE4' : 'transparent'
                      }}
                    >
                      <td>
                        <div style={{ fontWeight: 700, color: '#18251C' }}>{row.name}</div>
                        <div style={{ fontSize: '11px', color: '#687369' }}>{row.type}</div>
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>{formatNumber(row.demandP50)}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#18251C' }}>
                        {formatNumber(row.units)} units
                      </td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>
                        {formatCurrency(row.spend)}
                      </td>
                      <td>
                        <span className={`status-pill ${actionClass}`}>{row.action}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Recent Activities Feed */}
        <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Activity size={18} color="#145C38" />
            <h2 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: '#18251C' }}>
              Recent Engine Activity
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentActivities.map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: act.type === 'budget' ? '#EAF7EE' : act.type === 'model' ? '#FEF6EA' : '#F4EBDD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Clock size={15} color="#145C38" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#18251C' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#687369', marginTop: '2px', lineHeight: 1.4 }}>
                    {act.desc}
                  </div>
                  <div style={{ fontSize: '10px', color: '#8E998F', marginTop: '4px' }}>
                    {act.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .overview-charts-grid, .overview-tables-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
