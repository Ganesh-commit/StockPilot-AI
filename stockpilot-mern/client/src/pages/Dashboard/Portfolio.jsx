import React, { useState, useEffect } from 'react';
import { fetchPortfolio } from '../../services/api';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

const formatCurrency = n => {
  if (n == null) return '₹0';
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1) + ' L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
};

export default function Portfolio() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio()
      .then(d => {
        setOrders(d || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalCommitted = orders.reduce((sum, o) => sum + (o.totalCommitted || 0), 0);
  const totalProfit = orders.reduce((sum, o) => sum + (o.expectedProfit || 0), 0);
  const totalUnits = orders.reduce((sum, o) => sum + (o.units || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
          Committed Travel Inventory Portfolio
        </h1>
        <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
          Active wholesale purchase contracts underwritten by procurement team
        </p>
      </div>

      {/* Portfolio Totals Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>TOTAL CAPITAL COMMITTED</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace', marginTop: '4px' }}>
            {formatCurrency(totalCommitted)}
          </div>
          <div style={{ fontSize: '12px', color: '#687369', marginTop: '4px' }}>Across {orders.length} active orders</div>
        </div>

        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>EXPECTED NET RETURN</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace', marginTop: '4px' }}>
            {formatCurrency(totalProfit)}
          </div>
          <div style={{ fontSize: '12px', color: '#145C38', marginTop: '4px' }}>
            {totalCommitted > 0 ? ((totalProfit / totalCommitted) * 100).toFixed(1) : 0}% Projected Margin
          </div>
        </div>

        <div className="travel-card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#687369' }}>PROCURED INVENTORY UNITS</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace', marginTop: '4px' }}>
            {totalUnits.toLocaleString('en-IN')} units
          </div>
          <div style={{ fontSize: '12px', color: '#687369', marginTop: '4px' }}>Rooms & seat blocks secured</div>
        </div>
      </div>

      {/* Committed Orders Table */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <h2 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C', marginBottom: '16px' }}>
          Active Procurement Contracts
        </h2>

        {orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#687369' }}>
            No active orders committed yet. Go to the Procurement Engine to commit recommended buy decisions.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="travel-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Destination</th>
                  <th>Category</th>
                  <th>Units Secured</th>
                  <th>Cost / Unit</th>
                  <th>Total Deployed</th>
                  <th>Expected Profit</th>
                  <th>Contract Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{o.id}</td>
                    <td><b>{o.destination}</b></td>
                    <td style={{ color: '#687369' }}>{o.category}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{o.units.toLocaleString('en-IN')} units</td>
                    <td style={{ fontFamily: 'monospace' }}>₹{o.cost.toLocaleString('en-IN')}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>{formatCurrency(o.totalCommitted)}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>{formatCurrency(o.expectedProfit)}</td>
                    <td>
                      <span className="status-pill status-prebuy">
                        {o.status || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
