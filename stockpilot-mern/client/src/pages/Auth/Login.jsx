import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Plane,
  Building,
  CheckCircle2,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.2 },
          colors: ['#145C38', '#F29A38', '#367A4D']
        });
      } catch (err) {}
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleExploreDemo = async () => {
    setError('');
    setDemoLoading(true);
    try {
      await loginDemo();
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.2 },
          colors: ['#145C38', '#F29A38', '#EAF7EE']
        });
      } catch (err) {}
      navigate('/dashboard');
    } catch (err) {
      setError('Unable to initialize demo account. Please try standard sign-in.');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@stockpilot.ai');
    setPassword('demo123');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAF7F0',
        display: 'flex',
        alignItems: 'stretch',
        overflowX: 'hidden'
      }}
      className="login-container"
    >
      {/* ================= LEFT SIDE: LOGIN FORM (~45%) ================= */}
      <div
        style={{
          flex: '1 1 45%',
          minWidth: '320px',
          maxWidth: '620px',
          padding: '40px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E8E2D7'
        }}
        className="login-form-panel"
      >
        {/* Brand Header */}
        <div>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo size="normal" />
          </Link>
        </div>

        {/* Center Card Content */}
        <div style={{ maxWidth: '420px', width: '100%', margin: '36px auto 24px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1
              className="font-serif"
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#18251C',
                letterSpacing: '-0.5px',
                marginBottom: '8px'
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: '15px', color: '#687369' }}>
              Please enter your details to access your portal.
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FDF0EE',
                border: '1px solid #F6BEB5',
                padding: '12px 16px',
                borderRadius: '10px',
                color: '#B93826',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#18251C',
                  marginBottom: '6px'
                }}
              >
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
                  color="#8E998F"
                  style={{ position: 'absolute', left: '14px', top: '13px', pointerEvents: 'none' }}
                />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid #DCE6DE',
                    backgroundColor: '#FAF7F0',
                    fontSize: '14px',
                    color: '#18251C',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={e => (e.target.style.borderColor = '#145C38')}
                  onBlur={e => (e.target.style.borderColor = '#DCE6DE')}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#18251C',
                  marginBottom: '6px'
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  color="#8E998F"
                  style={{ position: 'absolute', left: '14px', top: '13px', pointerEvents: 'none' }}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '10px',
                    border: '1px solid #DCE6DE',
                    backgroundColor: '#FAF7F0',
                    fontSize: '14px',
                    color: '#18251C',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={e => (e.target.style.borderColor = '#145C38')}
                  onBlur={e => (e.target.style.borderColor = '#DCE6DE')}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password Row matching Reference */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '13px'
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#526054',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{
                    accentColor: '#145C38',
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <span>Remember for 30 days</span>
              </label>

              <span
                style={{
                  color: '#145C38',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                onClick={() => alert('Password reset link has been dispatched to your work email.')}
              >
                Forgot password
              </span>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-forest"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '15px',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '10px'
              }}
            >
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Elegant OR Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '22px 0 18px'
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E2D7' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#8E998F', letterSpacing: '0.8px' }}>
              OR INSTANT ACCESS
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#E8E2D7' }} />
          </div>

          {/* Prominent 1-Click "Explore Demo Account" Button */}
          <button
            type="button"
            onClick={handleExploreDemo}
            disabled={demoLoading}
            style={{
              width: '100%',
              padding: '13px 18px',
              backgroundColor: '#F4EBDD',
              border: '1.5px solid #E8E2D7',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: '#145C38',
              fontWeight: 700,
              fontSize: '14.5px',
              boxShadow: '0 2px 6px rgba(20, 92, 56, 0.06)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#EAF7EE';
              e.currentTarget.style.borderColor = '#145C38';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#F4EBDD';
              e.currentTarget.style.borderColor = '#E8E2D7';
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#145C38',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={13} color="#FAF7F0" />
            </div>
            <span>{demoLoading ? 'Launching Demo...' : 'Explore StockPilot AI Demo'}</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: '#145C38',
                color: '#FAF7F0',
                padding: '2px 8px',
                borderRadius: '9999px',
                marginLeft: '4px'
              }}
            >
              1-CLICK
            </span>
          </button>

          {/* Quick Demo Credentials Autofill Pill */}
          <div
            onClick={handleFillDemo}
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: '#FAF7F0',
              border: '1px dashed #D6CEBF',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11.5px',
              color: '#687369',
              transition: 'all 0.15s ease'
            }}
            title="Click to autofill form fields with demo credentials"
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#145C38')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#D6CEBF')}
          >
            <span style={{ fontWeight: 700, color: '#145C38' }}>⚡ Autofill Credentials:</span>
            <code>demo@stockpilot.ai / demo123</code>
          </div>

          {/* Sign up prompt */}
          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              fontSize: '13.5px',
              color: '#687369'
            }}
          >
            Don't have an enterprise account?{' '}
            <Link
              to="/signup"
              style={{ color: '#145C38', fontWeight: 700, textDecoration: 'none' }}
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#8E998F',
            paddingTop: '20px',
            borderTop: '1px solid #F4EBDD'
          }}
        >
          <span>© StockPilot AI 2026</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#145C38" /> SOC2 Type II Certified
          </span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: VISUAL PANEL (~55%) ================= */}
      <div
        style={{
          flex: '1 1 55%',
          backgroundColor: '#FAF7F0',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        className="login-visual-panel"
      >
        <div
          style={{
            flex: 1,
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundColor: '#F4EBDD',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '28px',
            boxShadow: '0 20px 45px rgba(20, 92, 56, 0.10)',
            border: '1px solid #E8E2D7'
          }}
        >
          {/* Top: Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 2,
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #E8E2D7',
                padding: '8px 16px',
                borderRadius: '9999px',
                color: '#145C38',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              <Plane size={15} color="#145C38" />
              <span>Global Travel Procurement Network</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#145C38',
                padding: '6px 14px',
                borderRadius: '9999px',
                color: '#FAF7F0',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#4ADE80',
                  boxShadow: '0 0 8px #4ADE80'
                }}
              />
              <span>Live Market Engine</span>
            </div>
          </div>

          {/* Center: The User's Exact First Pic Graphic */}
          <div
            style={{
              margin: 'auto 0',
              borderRadius: '22px',
              overflow: 'hidden',
              boxShadow: '0 18px 45px rgba(20, 92, 56, 0.16)',
              border: '3px solid #FFFFFF',
              backgroundColor: '#FAF7F0',
              position: 'relative'
            }}
          >
            <img
              src="/hero-travel-banner.jpg"
              alt="StockPilot AI — Travel Inventory Procurement & Revenue Optimization"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '440px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>

          {/* Bottom Marketing Headline & Subtext matching user specification */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px 24px',
              border: '1px solid #E8E2D7',
              boxShadow: '0 8px 24px rgba(20, 92, 56, 0.06)',
              marginTop: '16px',
              zIndex: 2
            }}
          >
            <h2
              className="font-serif"
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: '#18251C',
                letterSpacing: '-0.3px',
                marginBottom: '6px'
              }}
            >
              Make smarter travel procurement decisions.
            </h2>
            <p
              style={{
                fontSize: '13.5px',
                color: '#687369',
                lineHeight: 1.5,
                margin: 0
              }}
            >
              Forecast demand, optimize inventory and maximize your procurement returns with StockPilot AI.
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 960px) {
          .login-container {
            flex-direction: column !important;
          }
          .login-form-panel {
            max-width: 100% !important;
            flex: 1 1 auto !important;
            border-right: none !important;
            padding: 32px 24px !important;
          }
          .login-visual-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
