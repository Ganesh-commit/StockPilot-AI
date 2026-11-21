import React, { useState, useEffect } from 'react';
import { fetchSuppliers } from '../../services/api';
import {
  Building2,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertTriangle,
  Mail,
  FileText,
  DollarSign
} from 'lucide-react';

export default function SupplierIntelligence() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers()
      .then(d => {
        setSuppliers(d || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#145C38' }}>Loading Supplier Intelligence...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
        <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
          Supplier Intelligence & Reliability Management
        </h1>
        <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
          Wholesale supplier ratings, contract underwritings, delivery risk indicators & fulfillment scores
        </p>
      </div>

      {/* Supplier Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {suppliers.map((sup, idx) => {
          const isLowRisk = sup.deliveryRisk === 'LOW';
          const badgeClass = isLowRisk ? 'status-prebuy' : 'status-buypartly';

          return (
            <div key={sup.id || idx} className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EAF7EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={18} color="#145C38" />
                    </div>
                    <div>
                      <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 800, color: '#18251C' }}>
                        {sup.name}
                      </h3>
                      <div style={{ fontSize: '11px', color: '#687369' }}>
                        Rank #{idx + 1} Wholesale Partner
                      </div>
                    </div>
                  </div>
                  <span className={`status-pill ${badgeClass}`}>{sup.deliveryRisk} RISK</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#FAF7F0', padding: '14px', borderRadius: '12px', border: '1px solid #E8E2D7', margin: '14px 0' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#687369' }}>RELIABILITY SCORE</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#145C38', fontFamily: 'monospace' }}>
                      {sup.reliabilityScore}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#687369' }}>VOLUME UNDERWRITTEN</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#18251C', fontFamily: 'monospace' }}>
                      {sup.volumeUnderwritten}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#687369' }}>ACTIVE CONTRACTS</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#18251C' }}>
                      {sup.activeContracts} Blocks
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#687369' }}>PARTNER RATING</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#F29A38', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} fill="#F29A38" />
                      <span>{sup.rating} / 5.0</span>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#18251C', marginBottom: '8px' }}>
                  <b>Destinations Covered:</b> {sup.destinations.join(', ')} ({sup.categories.join(', ')})
                </div>

                <p style={{ fontSize: '12px', color: '#687369', lineHeight: 1.5, marginBottom: '16px' }}>
                  {sup.notes}
                </p>
              </div>

              <div style={{ paddingTop: '14px', borderTop: '1px solid #E8E2D7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#687369' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} color="#145C38" />
                  <span>{sup.contact}</span>
                </span>
                <span style={{ color: '#145C38', fontWeight: 700, cursor: 'pointer' }}>
                  View Contracts →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
