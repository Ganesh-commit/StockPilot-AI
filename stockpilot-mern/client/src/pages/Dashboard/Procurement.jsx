import React, { useState, useEffect } from 'react';
import { fetchPlan, createPortfolioOrder } from '../../services/api';
import {
  CheckSquare,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import NewsvendorModal from '../../components/NewsvendorModal.jsx';

const formatCurrency = n => {
  if (n == null) return '₹0';
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1) + ' L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
};

const formatNumber = n => Math.round(n || 0).toLocaleString('en-IN');

export default function Procurement() {
  const [data, setData] = useState(null);
  const [filterAction, setFilterAction] = useState('ALL');
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [committingId, setCommittingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = async () => {
    try {
      const d = await fetchPlan(1e8, 0.4);
      setData(d);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('stockpilot-reseeded', loadData);
    return () => window.removeEventListener('stockpilot-reseeded', loadData);
  }, []);

  const handleCommitOrder = async row => {
    try {
      setCommittingId(row.name);
      await createPortfolioOrder({
        destination: row.name,
        category: row.type,
        units: row.units,
        cost: row.cost,
        price: row.price,
        expectedProfit: row.profit
      });
      setSuccessMessage(`Order committed: ${row.name} (${row.units} units) placed in portfolio!`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setCommittingId(null);
    }
  };

  if (!data) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#145C38' }}>Evaluating Procurement Engine...</div>;
  }

  const rows = data.rows || [];
  const filtered = rows.filter(r => {
    if (filterAction === 'ALL') return true;
    return r.action === filterAction;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
            Autonomous Procurement Recommendations
          </h1>
          <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
            Actionable purchase decisions calculated from Newsvendor economic loss ratios & capital limits
          </p>
        </div>

        <button
          onClick={() => setIsMathOpen(true)}
          className="btn-secondary-neutral"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          <HelpCircle size={15} color="#145C38" />
          <span>Newsvendor Math</span>
        </button>
      </div>

      {successMessage && (
        <div style={{ backgroundColor: '#EAF7EE', border: '1px solid #B8E4C5', padding: '12px 18px', borderRadius: '10px', color: '#145C38', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter Chips */}
      <div className="travel-card" style={{ padding: '16px 20px', backgroundColor: '#FFFFFF', display: 'flex', gap: '10px' }}>
        {['ALL', 'PRE-BUY', 'BUY PARTLY', 'SKIP'].map(act => (
          <button
            key={act}
            onClick={() => setFilterAction(act)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #E8E2D7',
              backgroundColor: filterAction === act ? '#145C38' : '#FAF7F0',
              color: filterAction === act ? '#ffffff' : '#18251C',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {act === 'ALL' ? 'All Decisions' : act}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map((row, idx) => {
          const actionClass =
            row.action === 'PRE-BUY'
              ? 'status-prebuy'
              : row.action === 'BUY PARTLY'
              ? 'status-buypartly'
              : 'status-skip';

          return (
            <div key={idx} className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 800, color: '#18251C' }}>
                      {row.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#687369' }}>{row.type}</div>
                  </div>
                  <span className={`status-pill ${actionClass}`}>{row.action}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#FAF7F0', padding: '14px', borderRadius: '12px', border: '1px solid #E8E2D7', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#687369' }}>RECOMMENDED UNITS</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace' }}>
                      {formatNumber(row.units)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#687369' }}>TOTAL CAPITAL SPEND</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace' }}>
                      {formatCurrency(row.spend)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#687369' }}>EXPECTED PROFIT</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#145C38', fontFamily: 'monospace' }}>
                      {formatCurrency(row.profit)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#687369' }}>SELL-THROUGH</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#C07119', fontFamily: 'monospace' }}>
                      {row.units ? `${Math.round(row.sellThrough * 100)}%` : '–'}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: '#18251C', lineHeight: 1.5, marginBottom: '16px' }}>
                  <b>AI Rationalization:</b> {row.reason}. Critical service level ratio: <b>{((row.criticalRatio || 0.75) * 100).toFixed(0)}%</b>.
                </div>
              </div>

              {row.units > 0 && (
                <button
                  onClick={() => handleCommitOrder(row)}
                  disabled={committingId === row.name}
                  className="btn-primary-forest"
                  style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                >
                  <Briefcase size={15} />
                  <span>{committingId === row.name ? 'Committing...' : 'Commit to Portfolio'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <NewsvendorModal isOpen={isMathOpen} onClose={() => setIsMathOpen(false)} />
    </div>
  );
}
