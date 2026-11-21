import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import NewsvendorModal from './NewsvendorModal.jsx';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  CheckSquare,
  Sliders,
  ShieldAlert,
  Briefcase,
  FileSpreadsheet,
  Bell,
  Settings,
  LogOut,
  RefreshCw,
  RotateCcw,
  HelpCircle,
  ChevronRight,
  User,
  Sparkles,
  GitCompare,
  Building2,
  BarChart3,
  Calculator
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import confetti from 'canvas-confetti';
import { reseedMarket } from '../services/api';

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, resetDemoData } = useAuth();
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDemo = async () => {
    try {
      setIsResetting(true);
      await reseedMarket(7);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.15 },
          colors: ['#145C38', '#F29A38', '#367A4D']
        });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsResetting(false), 500);
    }
  };

  const menuItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Demand Forecasting', path: '/dashboard/forecasting', icon: TrendingUp },
    { label: 'Forecast Accuracy', path: '/dashboard/accuracy', icon: BarChart3 },
    { label: 'Inventory Opportunities', path: '/dashboard/inventory', icon: Package },
    { label: 'Procurement Engine', path: '/dashboard/procurement', icon: CheckSquare },
    { label: 'Newsvendor Calculator', path: '/dashboard/newsvendor', icon: Calculator },
    { label: 'Budget Optimizer', path: '/dashboard/optimizer', icon: Sliders },
    { label: 'Scenario Simulator', path: '/dashboard/simulator', icon: GitCompare },
    { label: 'Supplier Intelligence', path: '/dashboard/suppliers', icon: Building2 },
    { label: 'Risk Analysis', path: '/dashboard/risk', icon: ShieldAlert },
    { label: 'Committed Portfolio', path: '/dashboard/portfolio', icon: Briefcase },
    { label: 'Reports & Export', path: '/dashboard/reports', icon: FileSpreadsheet },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings }
  ];

  const handleReseed = async () => {
    try {
      setIsReseeding(true);
      await reseedMarket();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.15 },
          colors: ['#145C38', '#F29A38', '#367A4D']
        });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsReseeding(false), 600);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF7F0' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E8E2D7',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40
        }}
      >
        {/* Brand header */}
        <div style={{ padding: '22px 20px', borderBottom: '1px solid #E8E2D7' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo size="normal" />
          </Link>
          <div style={{ fontSize: '11px', color: '#687369', marginTop: '6px' }}>
            Travel Procurement & Revenue Engine
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ flex: 1, padding: '14px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`dash-nav-item ${isActive ? 'active' : ''}`}
                style={{ padding: '8px 14px', fontSize: '13px' }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div style={{ padding: '16px', borderTop: '1px solid #E8E2D7', backgroundColor: '#FAF7F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#145C38',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#18251C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                  {user?.name || 'Travel Specialist'}
                </div>
                <div style={{ fontSize: '11px', color: '#687369' }}>
                  {user?.company || 'SkyRoute OTA'}
                </div>
                {user?.isDemo && (
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '9.5px',
                      fontWeight: 800,
                      color: '#145C38',
                      backgroundColor: '#EAF7EE',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      marginTop: '3px',
                      letterSpacing: '0.4px'
                    }}
                  >
                    DEMO ACCESS
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Log out"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#687369',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px'
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header
          style={{
            height: '66px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E8E2D7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          {/* Breadcrumb / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <span style={{ color: '#687369' }}>StockPilot</span>
            <ChevronRight size={14} color="#8E998F" />
            <span style={{ fontWeight: 700, color: '#18251C' }}>
              {menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard'}
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setIsMathOpen(true)}
              className="btn-secondary-neutral"
              style={{ padding: '7px 14px', fontSize: '13px' }}
            >
              <HelpCircle size={15} color="#145C38" />
              <span>Newsvendor Math</span>
            </button>

            <button
              onClick={handleReseed}
              disabled={isReseeding}
              className="btn-secondary-neutral"
              style={{ padding: '7px 14px', fontSize: '13px' }}
              title="Regenerate synthetic demand signals"
            >
              <RefreshCw size={15} className={isReseeding ? 'animate-spin' : ''} color="#F29A38" />
              <span>{isReseeding ? 'Simulating...' : 'Reseed Market'}</span>
            </button>

            <Link
              to="/dashboard/notifications"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: '1px solid #E8E2D7',
                backgroundColor: '#FAF7F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#145C38',
                position: 'relative',
                textDecoration: 'none'
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: '7px',
                  right: '7px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#F29A38'
                }}
              />
            </Link>

            <Link
              to="/"
              className="btn-outline-forest"
              style={{ padding: '7px 16px', fontSize: '13px' }}
            >
              Exit to Home
            </Link>
          </div>
        </header>

        {/* Subtle Demo Mode Indicator Bar */}
        {user?.isDemo && (
          <div
            style={{
              backgroundColor: '#F4EBDD',
              borderBottom: '1px solid #E8E2D7',
              padding: '9px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12.5px',
              color: '#18251C',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  backgroundColor: '#145C38',
                  color: '#FAF7F0',
                  fontWeight: 800,
                  fontSize: '10.5px',
                  padding: '2.5px 8px',
                  borderRadius: '9999px',
                  letterSpacing: '0.6px'
                }}
              >
                DEMO MODE
              </span>
              <span style={{ fontWeight: 600 }}>
                Explore StockPilot AI using sample data.
              </span>
              <span style={{ color: '#687369' }}>
                All modules (forecasting, knapsack optimizer, risk analysis) are fully interactive.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleResetDemo}
                disabled={isResetting}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D6CEBF',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#145C38',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
                title="Restore pristine sample inventory and allocations"
              >
                <RotateCcw size={12} className={isResetting ? 'animate-spin' : ''} />
                <span>{isResetting ? 'Restoring...' : 'Reset Demo Data'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <main style={{ flex: 1, padding: '28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {/* Newsvendor Model Explanation */}
      <NewsvendorModal isOpen={isMathOpen} onClose={() => setIsMathOpen(false)} />
    </div>
  );
}
