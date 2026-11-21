import React, { useState, useEffect } from 'react';
import { fetchPlan } from '../../services/api';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  BarChart3,
  FileText
} from 'lucide-react';

const formatCurrency = n => {
  if (n == null) return '₹0';
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1) + ' L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
};

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchPlan(1e8, 0.4)
      .then(setData)
      .catch(console.error);
  }, []);

  const downloadCSV = () => {
    if (!data || !data.rows) return;
    const headers = ['Destination,Category,DemandP50,BuyUnits,Spend,ExpectedProfit,SellThrough,Action,Reason\n'];
    const csvRows = data.rows.map(r =>
      `"${r.name}","${r.type}",${r.demandP50},${r.units},${r.spend},${r.profit},${(r.sellThrough * 100).toFixed(1)}%,"${r.action}","${r.reason}"`
    );
    const blob = new Blob([headers.concat(csvRows.join('\n'))], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StockPilot_Procurement_Plan_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const rows = data && data.rows ? data.rows : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
            Procurement Reports & Performance Export
          </h1>
          <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
            Audit trails, demand forecasts, capital allocation breakdowns & CSV data exports
          </p>
        </div>

        <button
          onClick={downloadCSV}
          className="btn-primary-forest"
          style={{ padding: '9px 18px', fontSize: '13px' }}
        >
          <Download size={15} />
          <span>Export Plan as CSV</span>
        </button>
      </div>

      {/* Summary Audit Card */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <FileText size={20} color="#145C38" />
          <h2 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C' }}>
            Executive Procurement Summary
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="travel-table">
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Category</th>
                <th>Demand P50</th>
                <th>Units</th>
                <th>Capital Spend</th>
                <th>Expected Profit</th>
                <th>Sell-Through</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td><b>{r.name}</b></td>
                  <td style={{ color: '#687369' }}>{r.type}</td>
                  <td style={{ fontFamily: 'monospace' }}>{Math.round(r.demandP50).toLocaleString('en-IN')}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{r.units.toLocaleString('en-IN')} units</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>{formatCurrency(r.spend)}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>{formatCurrency(r.profit)}</td>
                  <td style={{ fontFamily: 'monospace' }}>{Math.round(r.sellThrough * 100)}%</td>
                  <td>
                    <span className={`status-pill ${r.action === 'PRE-BUY' ? 'status-prebuy' : r.action === 'BUY PARTLY' ? 'status-buypartly' : 'status-skip'}`}>
                      {r.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
