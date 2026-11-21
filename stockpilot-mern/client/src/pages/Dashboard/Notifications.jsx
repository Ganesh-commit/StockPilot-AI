import React, { useState, useEffect } from 'react';
import { fetchNotifications, markNotificationsRead } from '../../services/api';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check
} from 'lucide-react';

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);

  const loadNotifs = async () => {
    try {
      const d = await fetchNotifications();
      setNotifs(d || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const markAllRead = async () => {
    await markNotificationsRead();
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      {/* Header */}
      <div className="travel-card" style={{ padding: '24px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '24px', fontWeight: 800, color: '#18251C' }}>
            System Alerts & Signals
          </h1>
          <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>
            Demand surges, critical ratio triggers, and budget optimization status
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="btn-secondary-neutral"
          style={{ padding: '7px 14px', fontSize: '12px' }}
        >
          <Check size={14} />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifs.map(n => {
          const isAlert = n.type === 'ALERT';
          const isSuccess = n.type === 'SUCCESS';
          const Icon = isAlert ? AlertTriangle : isSuccess ? CheckCircle2 : Info;
          const iconColor = isAlert ? '#C07119' : isSuccess ? '#145C38' : '#367A4D';
          const bgColor = isAlert ? '#FEF6EA' : isSuccess ? '#EAF7EE' : '#F4EBDD';

          return (
            <div
              key={n.id}
              className="travel-card"
              style={{
                padding: '18px 20px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                opacity: n.read ? 0.75 : 1,
                borderLeft: !n.read ? '4px solid #145C38' : '1px solid #E8E2D7'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon size={18} color={iconColor} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#18251C' }}>
                    {n.title}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#8E998F' }}>{n.date}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px', lineHeight: 1.5 }}>
                  {n.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
