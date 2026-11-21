import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Footer from '../../components/Footer.jsx';
import NewsvendorModal from '../../components/NewsvendorModal.jsx';
import WatchDemoModal from '../../components/WatchDemoModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import confetti from 'canvas-confetti';
import {
  Bed,
  Plane,
  TrendingUp,
  Target,
  ArrowRight,
  Play,
  ShieldCheck,
  PieChart,
  Zap,
  CheckCircle2,
  ChevronDown,
  Building2,
  Compass,
  Briefcase,
  Layers,
  Sparkles,
  BarChart3,
  Sliders,
  Database,
  Calculator,
  ShieldAlert,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginDemo } = useAuth();
  const [activeFaq, setActiveFaq] = useState(0);
  const [isMathOpen, setIsMathOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isDemoLaunching, setIsDemoLaunching] = useState(false);

  const handleTryLiveDemo = async () => {
    try {
      setIsDemoLaunching(true);
      await loginDemo();
      try {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.2 },
          colors: ['#145C38', '#F29A38', '#367A4D']
        });
      } catch (e) {}
      navigate('/dashboard');
    } catch (e) {
      navigate('/login');
    } finally {
      setIsDemoLaunching(false);
    }
  };

  const faqs = [
    {
      q: 'What is StockPilot AI?',
      a: 'StockPilot AI is an enterprise decision-support platform designed specifically for travel companies (OTAs, aggregators, tour operators). It combines 104-week time-series demand forecasting with Newsvendor economic modeling and greedy capital allocation to tell buyers what to purchase, how many, when, and at what price within a fixed capital budget.'
    },
    {
      q: 'How does demand forecasting work with uncertainty?',
      a: 'The engine examines up to 104 historical weeks of booking demand, extracting seasonal oscillations and secular growth trends while adjusting for sold-out censored capacity. A 26-week backtest variance calculation powers multi-horizon confidence intervals (P10 median low, P50 expected baseline, P90 optimistic surge).'
    },
    {
      q: 'What is the Newsvendor model in travel procurement?',
      a: 'Perishable travel assets (flight seats, hotel room nights) spoil immediately once departure or check-in passes. The Newsvendor formula calculates the exact optimal stock level by balancing the underage cost (missed margin from unsatisfied customers) against the overage cost (net loss on unsold units after 25% salvage liquidation recovery).'
    },
    {
      q: 'How does budget optimization allocate capital?',
      a: 'Given a procurement ceiling (e.g., ₹10 Cr to ₹50 Cr), the optimizer prioritizes inventory by marginal risk-adjusted profit contribution per rupee. This guarantees capital flows into high-margin, high-sell-through opportunities before filling secondary buffer allocations.'
    },
    {
      q: 'Can our travel organization upload proprietary data?',
      a: 'Yes. StockPilot AI connects to standard GDS, PMS, channel managers, or simple CSV historical booking exports, automatically retraining seasonal parameters on new booking signals.'
    },
    {
      q: 'Who can use this platform?',
      a: 'Online Travel Agencies (OTAs), airline seat charterers, hotel revenue procurement teams, DMCs, and wholesale package creators who commit capital in advance to lock in wholesale rates.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F0', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Top Sticky Navigation */}
      <Navbar onOpenResources={() => setIsResourcesOpen(true)} />

      {/* =========================================================================
          HERO SECTION (FAITHFUL REPLICA OF OPTION 1 REFERENCE DESIGN)
          ========================================================================= */}
      <section
        id="home"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '48px 28px 40px',
          position: 'relative'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 1fr',
            gap: '48px',
            alignItems: 'center'
          }}
          className="hero-grid"
        >
          {/* LEFT COLUMN */}
          <div>
            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F4EBDD',
                border: '1px solid #E8E2D7',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#18251C',
                marginBottom: '20px'
              }}
            >
              <Sparkles size={14} color="#F29A38" />
              <span>AI-Powered Travel Procurement</span>
            </div>

            {/* Main Headline: "Smarter Travel Inventory Buying for Higher Profits" */}
            <h1
              className="font-serif"
              style={{
                fontSize: '48px',
                fontWeight: 800,
                color: '#18251C',
                letterSpacing: '-1px',
                lineHeight: 1.18,
                marginBottom: '20px'
              }}
            >
              Smarter Travel Inventory Buying for{' '}
              <span style={{ position: 'relative', display: 'inline-block', color: '#145C38', fontStyle: 'italic', fontWeight: 800 }}>
                Higher Profits
                {/* Curved Orange Underline Flourish matching Reference Image */}
                <svg
                  width="180"
                  height="12"
                  viewBox="0 0 180 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ position: 'absolute', bottom: '-4px', left: '0', pointerEvents: 'none' }}
                >
                  <path
                    d="M3 8C45 2 120 2 177 10C125 5 60 6 3 11Z"
                    fill="#F29A38"
                  />
                </svg>
              </span>
            </h1>

            {/* Description Paragraph */}
            <p
              style={{
                fontSize: '16px',
                color: '#687369',
                lineHeight: 1.65,
                maxWidth: '520px',
                marginBottom: '32px'
              }}
            >
              An AI-powered decision-support platform that helps travel businesses forecast demand, optimize inventory purchases, and allocate budgets intelligently to maximize profit while minimizing unsold inventory risk.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary-forest"
                style={{ padding: '14px 28px', fontSize: '15px' }}
              >
                <span>Get Started Free</span>
                <ArrowRight size={17} />
              </button>

              {/* Prominent Try Live Demo Button */}
              <button
                onClick={handleTryLiveDemo}
                disabled={isDemoLaunching}
                style={{
                  padding: '13px 24px',
                  fontSize: '15px',
                  fontWeight: 700,
                  backgroundColor: '#F4EBDD',
                  color: '#145C38',
                  border: '1.5px solid #145C38',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(20, 92, 56, 0.08)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#EAF7EE';
                  e.currentTarget.style.borderColor = '#10452C';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#F4EBDD';
                  e.currentTarget.style.borderColor = '#145C38';
                }}
                title="Instant 1-Click Access to Live Demo"
              >
                <Sparkles size={16} color="#F29A38" />
                <span>{isDemoLaunching ? 'Launching Demo...' : 'Try Live Demo'}</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: '#145C38',
                    color: '#FAF7F0',
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    letterSpacing: '0.4px'
                  }}
                >
                  INSTANT
                </span>
              </button>

              <button
                onClick={() => setIsDemoOpen(true)}
                className="btn-outline-forest"
                style={{ padding: '13px 24px', fontSize: '15px' }}
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
                  <Play size={11} color="#ffffff" fill="#ffffff" style={{ marginLeft: '1px' }} />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Clean Value Proposition Indicators */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                flexWrap: 'wrap',
                paddingTop: '16px',
                borderTop: '1px solid #E8E2D7'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#18251C' }}>
                <TrendingUp size={16} color="#145C38" />
                <span>Higher Profit</span>
              </div>
              <span style={{ color: '#D6CEBF' }}>|</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#18251C' }}>
                <ShieldCheck size={16} color="#145C38" />
                <span>Lower Inventory Risk</span>
              </div>
              <span style={{ color: '#D6CEBF' }}>|</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#18251C' }}>
                <PieChart size={16} color="#145C38" />
                <span>Smart Budget Allocation</span>
              </div>
              <span style={{ color: '#D6CEBF' }}>|</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#145C38' }}>
                <Zap size={16} color="#145C38" />
                <span>AI Demand Forecasting</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: HERO TRAVEL BANNER (MATCHING USER FIRST PIC) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hero-collage"
          >
            {/* Decorative Warm Orange Backdrop Shape */}
            <div
              style={{
                position: 'absolute',
                top: '-15px',
                left: '20px',
                width: '180px',
                height: '140px',
                backgroundColor: '#F29A38',
                borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
                zIndex: 0
              }}
            />

            {/* Decorative Forest Green Backdrop Shape */}
            <div
              style={{
                position: 'absolute',
                bottom: '-15px',
                right: '15px',
                width: '190px',
                height: '130px',
                backgroundColor: '#145C38',
                borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%',
                zIndex: 0
              }}
            />

            {/* Dotted Flight Path with Soaring Green Airplane */}
            <svg
              width="240"
              height="100"
              viewBox="0 0 240 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: 'absolute', top: '-25px', right: '30px', zIndex: 10, pointerEvents: 'none' }}
            >
              <path
                d="M10 80C60 60 120 40 210 20"
                stroke="#145C38"
                strokeWidth="2.5"
                strokeDasharray="5 6"
              />
              <g transform="translate(210, 16) rotate(-15) scale(0.9)">
                <path
                  d="M14 6L22 10L14 14L10 22L8 20L10 13L2 11L1 8L10 9L11 4L14 6Z"
                  fill="#145C38"
                />
              </g>
            </svg>

            {/* User's Exact First Pic Hero Graphic */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 20px 48px rgba(20, 92, 56, 0.16)',
                border: '4px solid #FFFFFF',
                backgroundColor: '#FAF7F0',
                transition: 'transform 0.3s ease'
              }}
            >
              <img
                src="/hero-travel-banner.jpg"
                alt="StockPilot AI — Smarter Travel Inventory Buying for Higher Profits"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE SECTION (4 PREMIUM CARDS SPECIFIED BY USER)
          ========================================================================= */}
      <section
        id="features"
        style={{
          maxWidth: '1280px',
          margin: '40px auto 70px',
          padding: '0 28px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '22px'
          }}
        >
          {/* Card 1: AI Demand Forecasting */}
          <div className="travel-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#EAF7EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <TrendingUp size={24} color="#145C38" />
            </div>
            <h3 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C', marginBottom: '8px' }}>
              AI Demand Forecasting
            </h3>
            <p style={{ fontSize: '13px', color: '#687369', lineHeight: 1.6 }}>
              Predict future travel demand with historical data, seasonality and P10/P50/P90 forecast ranges.
            </p>
          </div>

          {/* Card 2: Optimal Procurement */}
          <div className="travel-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#FEF6EA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <Target size={24} color="#F29A38" />
            </div>
            <h3 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C', marginBottom: '8px' }}>
              Optimal Procurement
            </h3>
            <p style={{ fontSize: '13px', color: '#687369', lineHeight: 1.6 }}>
              Calculate optimal inventory purchase quantities using the Newsvendor model.
            </p>
          </div>

          {/* Card 3: Budget Optimization */}
          <div className="travel-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#EAF7EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <Sliders size={24} color="#145C38" />
            </div>
            <h3 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C', marginBottom: '8px' }}>
              Budget Optimization
            </h3>
            <p style={{ fontSize: '13px', color: '#687369', lineHeight: 1.6 }}>
              Allocate budgets across inventory opportunities to maximize expected returns.
            </p>
          </div>

          {/* Card 4: Risk Analysis */}
          <div className="travel-card" style={{ padding: '26px 22px', backgroundColor: '#FFFFFF' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#FEF6EA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <ShieldCheck size={24} color="#F29A38" />
            </div>
            <h3 className="font-serif" style={{ fontSize: '19px', fontWeight: 700, color: '#18251C', marginBottom: '8px' }}>
              Risk Analysis
            </h3>
            <p style={{ fontSize: '13px', color: '#687369', lineHeight: 1.6 }}>
              Analyze overstock, understock, cancellation and financial risks.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: WHY STOCKPILOT AI? (THE REAL BUSINESS PROBLEM)
          ========================================================================= */}
      <section
        id="about"
        style={{
          backgroundColor: '#F4EBDD',
          borderTop: '1px solid #E8E2D7',
          borderBottom: '1px solid #E8E2D7',
          padding: '80px 28px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#145C38' }}>
              The Core Problem in Travel Procurement
            </span>
            <h2 className="font-serif" style={{ fontSize: '38px', fontWeight: 800, color: '#18251C', marginTop: '10px' }}>
              Purchase Smarter. Predict Better. Grow Profitably.
            </h2>
            <p style={{ fontSize: '15px', color: '#687369', marginTop: '14px', lineHeight: 1.6 }}>
              Travel inventory is perishable: once a plane departs or hotel night passes, unsold rooms lose 100% of their value. Traditional buyers rely on spreadsheets and gut feel, creating massive margin leaks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
              <div style={{ color: '#B93826', fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>
                🛑 Over-Purchasing
              </div>
              <p style={{ fontSize: '14px', color: '#687369', lineHeight: 1.6 }}>
                Buying too much inventory leads to perishable unsold stock, emergency flash-discounts, and direct balance-sheet losses.
              </p>
            </div>

            <div className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
              <div style={{ color: '#C07119', fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>
                ⚠️ Under-Purchasing
              </div>
              <p style={{ fontSize: '14px', color: '#687369', lineHeight: 1.6 }}>
                Being overly cautious leaves popular routes and peak holiday destinations sold out, handing profitable bookings directly to competitors.
              </p>
            </div>

            <div className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
              <div style={{ color: '#145C38', fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>
                💡 StockPilot Solution
              </div>
              <p style={{ fontSize: '14px', color: '#687369', lineHeight: 1.6 }}>
                The Newsvendor economic formula calculates the mathematical sweet spot, while our greedy knapsack allocates capital strictly where marginal returns are highest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: HOW IT WORKS (4-STEP CONNECTED PROCESS)
          ========================================================================= */}
      <section
        id="how-it-works"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '80px 28px'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 50px' }}>
          <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#F29A38' }}>
            Methodical Procurement Engine
          </span>
          <h2 className="font-serif" style={{ fontSize: '38px', fontWeight: 800, color: '#18251C', marginTop: '10px' }}>
            Four Steps to Autonomous Procurement
          </h2>
          <p style={{ fontSize: '15px', color: '#687369', marginTop: '12px' }}>
            From raw transaction history to clear, risk-managed procurement orders.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            {
              step: '01',
              title: 'Import Data',
              desc: 'Connect historical booking logs with seasonality, trend, and sold-out censored capacity markers.'
            },
            {
              step: '02',
              title: 'Forecast Demand',
              desc: 'Generate 12-week forward forecasts with P10/P50/P90 confidence bounds derived from rolling backtests.'
            },
            {
              step: '03',
              title: 'Optimize Inventory',
              desc: 'Apply Newsvendor economics to determine optimal order quantities balancing underage margin against overage losses.'
            },
            {
              step: '04',
              title: 'Make Decisions',
              desc: 'Deploy available capital across assets with clear PRE-BUY, BUY PARTLY, or SKIP recommendation verdicts.'
            }
          ].map((item, idx) => (
            <div key={idx} className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF', position: 'relative' }}>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  color: '#145C38',
                  opacity: 0.15,
                  position: 'absolute',
                  top: '16px',
                  right: '20px',
                  fontFamily: 'monospace'
                }}
              >
                {item.step}
              </div>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#145C38',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '13px',
                  marginBottom: '16px'
                }}
              >
                {item.step}
              </div>
              <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: '#18251C', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#687369', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION: PRODUCT DASHBOARD PREVIEW
          ========================================================================= */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E8E2D7',
          borderBottom: '1px solid #E8E2D7',
          padding: '80px 28px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#145C38' }}>
              Enterprise SaaS Dashboard
            </span>
            <h2 className="font-serif" style={{ fontSize: '38px', fontWeight: 800, color: '#18251C', marginTop: '10px' }}>
              Designed for Travel Decision Makers
            </h2>
            <p style={{ fontSize: '15px', color: '#687369', marginTop: '12px' }}>
              An editorial, data-dense interface built for buyers managing crores of travel capital.
            </p>
          </div>

          <div
            className="travel-card"
            style={{
              padding: '32px',
              backgroundColor: '#FAF7F0',
              border: '1.5px solid #E8E2D7',
              maxWidth: '1080px',
              margin: '0 auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #E8E2D7', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#145C38', letterSpacing: '0.5px' }}>STOCKPILOT AI CONSOLE</span>
                <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 700, color: '#18251C', marginTop: '2px' }}>
                  Procurement Recommendation Engine Preview
                </h3>
              </div>
              <button onClick={() => navigate('/dashboard')} className="btn-primary-forest" style={{ padding: '9px 20px', fontSize: '13px' }}>
                <span>Launch Live Dashboard</span>
                <ArrowRight size={15} />
              </button>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E8E2D7', textAlign: 'left', color: '#687369' }}>
                    <th style={{ padding: '10px 8px' }}>Destination</th>
                    <th style={{ padding: '10px 8px' }}>Category</th>
                    <th style={{ padding: '10px 8px' }}>Demand P50</th>
                    <th style={{ padding: '10px 8px' }}>Buy Units</th>
                    <th style={{ padding: '10px 8px' }}>Spend</th>
                    <th style={{ padding: '10px 8px' }}>Exp. Profit</th>
                    <th style={{ padding: '10px 8px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F5EFE4' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 700 }}>Goa Beachfront</td>
                    <td style={{ padding: '12px 8px', color: '#687369' }}>Hotel Rooms</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>2,450</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700 }}>2,400 units</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>₹76.8 Lakhs</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>₹28.8 Lakhs</td>
                    <td style={{ padding: '12px 8px' }}><span className="status-pill status-prebuy">PRE-BUY</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F5EFE4' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 700 }}>Dubai Gulf Routes</td>
                    <td style={{ padding: '12px 8px', color: '#687369' }}>Flight Seats</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>1,840</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700 }}>1,800 seats</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>₹2.52 Crores</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>₹50.4 Lakhs</td>
                    <td style={{ padding: '12px 8px' }}><span className="status-pill status-prebuy">PRE-BUY</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F5EFE4' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 700 }}>Bali Ocean Suites</td>
                    <td style={{ padding: '12px 8px', color: '#687369' }}>Resorts</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>1,120</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700 }}>880 units</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>₹54.5 Lakhs</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700, color: '#145C38' }}>₹21.1 Lakhs</td>
                    <td style={{ padding: '12px 8px' }}><span className="status-pill status-buypartly">BUY PARTLY</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 8px', fontWeight: 700 }}>Maldives Atoll</td>
                    <td style={{ padding: '12px 8px', color: '#687369' }}>Villas</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>140</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700 }}>0 units</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700, color: '#687369' }}>₹0.00</td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700, color: '#687369' }}>₹0.00</td>
                    <td style={{ padding: '12px 8px' }}><span className="status-pill status-skip">SKIP</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: TARGET SOLUTIONS (FOR OTAS, TOUR OPERATORS, ETC.)
          ========================================================================= */}
      <section id="solutions" style={{ maxWidth: '1280px', margin: '80px auto', padding: '0 28px' }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
          <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#145C38' }}>
            Built for Industry Leaders
          </span>
          <h2 className="font-serif" style={{ fontSize: '38px', fontWeight: 800, color: '#18251C', marginTop: '10px' }}>
            Tailored for Travel Decision Makers
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          <div className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
            <Building2 size={32} color="#145C38" style={{ marginBottom: '16px' }} />
            <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
              Online Travel Agencies
            </h3>
            <p style={{ fontSize: '14px', color: '#687369', lineHeight: 1.6 }}>
              Lock in wholesale hotel blocks and airline charter seat allocations months before peak festive seasons without over-extending working capital.
            </p>
          </div>

          <div className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
            <Compass size={32} color="#F29A38" style={{ marginBottom: '16px' }} />
            <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
              Tour Operators & DMCs
            </h3>
            <p style={{ fontSize: '14px', color: '#687369', lineHeight: 1.6 }}>
              Construct bundled fixed-departure packages backed by statistical certainty that accommodations won’t go unbooked.
            </p>
          </div>

          <div className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
            <Briefcase size={32} color="#145C38" style={{ marginBottom: '16px' }} />
            <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
              Hotel Procurement Teams
            </h3>
            <p style={{ fontSize: '14px', color: '#687369', lineHeight: 1.6 }}>
              Determine the exact volume of guaranteed contract rooms to underwrite while managing cancellation exposure.
            </p>
          </div>

          <div className="travel-card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
            <Layers size={32} color="#F29A38" style={{ marginBottom: '16px' }} />
            <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>
              Travel Aggregators
            </h3>
            <p style={{ fontSize: '14px', color: '#687369', lineHeight: 1.6 }}>
              Centrally optimize multi-destination procurement budgets across hundreds of hotel chains and flight sectors.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: PRICING (DEMONSTRATION CONTENT)
          ========================================================================= */}
      <section
        id="pricing"
        style={{
          backgroundColor: '#F4EBDD',
          borderTop: '1px solid #E8E2D7',
          borderBottom: '1px solid #E8E2D7',
          padding: '80px 28px'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#145C38' }}>
              Transparent Commercial Plans
            </span>
            <h2 className="font-serif" style={{ fontSize: '38px', fontWeight: 800, color: '#18251C', marginTop: '10px' }}>
              Procurement Scale for Every Team
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Plan 1 */}
            <div className="travel-card" style={{ padding: '32px', backgroundColor: '#FFFFFF' }}>
              <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 700 }}>Starter</h3>
              <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>For boutique travel agencies</p>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#145C38', margin: '20px 0 10px', fontFamily: 'monospace' }}>
                ₹49,000<span style={{ fontSize: '14px', fontWeight: 500, color: '#687369' }}> / mo</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#18251C', margin: '20px 0 28px' }}>
                <li>✓ Up to ₹5 Cr Monthly Capital Managed</li>
                <li>✓ 8 Destination Feeds</li>
                <li>✓ Standard Demand Forecasting</li>
                <li>✓ Newsvendor Critical Ratios</li>
              </ul>
              <button onClick={() => navigate('/signup')} className="btn-outline-forest" style={{ width: '100%' }}>
                Get Started
              </button>
            </div>

            {/* Plan 2: Highlighted */}
            <div
              className="travel-card"
              style={{
                padding: '32px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #145C38',
                position: 'relative',
                boxShadow: '0 16px 36px rgba(20, 92, 56, 0.15)'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '24px',
                  backgroundColor: '#145C38',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  letterSpacing: '0.5px'
                }}
              >
                MOST POPULAR
              </div>
              <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 700 }}>Professional</h3>
              <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>For fast-growing mid-market OTAs</p>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#145C38', margin: '20px 0 10px', fontFamily: 'monospace' }}>
                ₹1,49,000<span style={{ fontSize: '14px', fontWeight: 500, color: '#687369' }}> / mo</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#18251C', margin: '20px 0 28px' }}>
                <li>✓ Up to ₹25 Cr Capital Managed</li>
                <li>✓ Unlimited Destination Feeds</li>
                <li>✓ P10/P50/P90 Confidence Bands</li>
                <li>✓ Greedy Knapsack Budget Optimization</li>
                <li>✓ Export Reports & CSV Downloads</li>
              </ul>
              <button onClick={() => navigate('/signup')} className="btn-primary-forest" style={{ width: '100%' }}>
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Plan 3 */}
            <div className="travel-card" style={{ padding: '32px', backgroundColor: '#FFFFFF' }}>
              <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 700 }}>Enterprise</h3>
              <p style={{ fontSize: '13px', color: '#687369', marginTop: '4px' }}>For large OTAs & airline charterers</p>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#145C38', margin: '20px 0 10px', fontFamily: 'monospace' }}>
                Custom
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#18251C', margin: '20px 0 28px' }}>
                <li>✓ Unlimited Procurement Volume</li>
                <li>✓ Live GDS & Channel Manager Sync</li>
                <li>✓ Dedicated Machine Learning Tuning</li>
                <li>✓ Custom Supplier Quota Enforcements</li>
                <li>✓ 24/7 Enterprise SLA Support</li>
              </ul>
              <button onClick={() => navigate('/signup')} className="btn-outline-forest" style={{ width: '100%' }}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: FAQ ACCORDION
          ========================================================================= */}
      <section style={{ maxWidth: '840px', margin: '80px auto', padding: '0 28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: '#F29A38' }}>
            Frequently Asked Questions
          </span>
          <h2 className="font-serif" style={{ fontSize: '36px', fontWeight: 800, color: '#18251C', marginTop: '8px' }}>
            Everything You Need to Know
          </h2>
        </div>

        <div>
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="faq-item"
                onClick={() => setActiveFaq(isOpen ? -1 : idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: '#18251C' }}>
                    {faq.q}
                  </h3>
                  <ChevronDown
                    size={18}
                    color="#145C38"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                  />
                </div>
                {isOpen && (
                  <p style={{ marginTop: '12px', fontSize: '14px', color: '#687369', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Math Modal */}
      <NewsvendorModal isOpen={isMathOpen} onClose={() => setIsMathOpen(false)} />

      {/* Guided Product Demo Walkthrough Video Modal */}
      <WatchDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* Resources Modal */}
      {isResourcesOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(24, 37, 28, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsResourcesOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E2D7',
              borderRadius: '20px',
              maxWidth: '600px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <BookOpen size={24} color="#145C38" />
              <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 700 }}>
                Procurement Knowledge Hub
              </h3>
            </div>
            <p style={{ fontSize: '14px', color: '#687369', lineHeight: 1.6, marginBottom: '20px' }}>
              StockPilot AI provides research papers, optimization formulas, and sample booking datasets to train procurement teams on Newsvendor risk management.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                onClick={() => {
                  setIsResourcesOpen(false);
                  setIsMathOpen(true);
                }}
                style={{ padding: '14px', border: '1px solid #E8E2D7', borderRadius: '10px', cursor: 'pointer', backgroundColor: '#FAF7F0' }}
              >
                <div style={{ fontWeight: 700, color: '#145C38', fontSize: '14px' }}>
                  📘 Newsvendor Formulation Whitepaper
                </div>
                <div style={{ fontSize: '12px', color: '#687369', marginTop: '2px' }}>
                  Critical ratio, salvage floors, and underage/overage risk balances.
                </div>
              </div>

              <div
                onClick={() => {
                  setIsResourcesOpen(false);
                  navigate('/dashboard/accuracy');
                }}
                style={{ padding: '14px', border: '1px solid #E8E2D7', borderRadius: '10px', cursor: 'pointer', backgroundColor: '#FAF7F0' }}
              >
                <div style={{ fontWeight: 700, color: '#F29A38', fontSize: '14px' }}>
                  📊 Forecast Accuracy Benchmark (MAE / RMSE / MAPE)
                </div>
                <div style={{ fontSize: '12px', color: '#687369', marginTop: '2px' }}>
                  Empirical backtesting comparisons across 104 seasonal weeks.
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button onClick={() => setIsResourcesOpen(false)} className="btn-primary-forest" style={{ padding: '8px 20px', fontSize: '13px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive media query tweaks */}
      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .hero-collage {
            min-height: 380px !important;
          }
        }
      `}</style>
    </div>
  );
}
