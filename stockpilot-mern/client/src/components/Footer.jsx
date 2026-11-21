import React from 'react';
import Logo from './Logo.jsx';
import { ArrowUpRight, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#F4EBDD', borderTop: '1px solid #E8E2D7', padding: '64px 28px 36px', marginTop: '60px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
        {/* Brand Column */}
        <div style={{ maxWidth: '320px' }}>
          <Logo size="normal" />
          <p style={{ marginTop: '16px', fontSize: '14px', color: '#687369', lineHeight: 1.6 }}>
            Autonomous travel inventory procurement, multi-horizon demand forecasting, and risk-adjusted capital allocation engine.
          </p>
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#145C38', fontWeight: 600 }}>
            ✦ Prasunex Innovathon 2026 Prototype
          </div>
        </div>

        {/* Product Column */}
        <div>
          <h4 className="font-serif" style={{ fontSize: '17px', color: '#18251C', fontWeight: 700, marginBottom: '16px' }}>
            Core Platform
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#687369' }}>
            <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Hotel Rooms Engine</a></li>
            <li><a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Flight Seat Blocks</a></li>
            <li><a href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>Demand Forecasting (P10/P50/P90)</a></li>
            <li><a href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>Newsvendor Optimization</a></li>
            <li><a href="#solutions" style={{ color: 'inherit', textDecoration: 'none' }}>Budget Knapsack Allocator</a></li>
          </ul>
        </div>

        {/* Solutions Column */}
        <div>
          <h4 className="font-serif" style={{ fontSize: '17px', color: '#18251C', fontWeight: 700, marginBottom: '16px' }}>
            Target Solutions
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#687369' }}>
            <li>Online Travel Agencies (OTAs)</li>
            <li>Hotel Procurement Teams</li>
            <li>Charter & Flight Wholesalers</li>
            <li>Inbound Tour Operators</li>
            <li>Travel Tech Aggregators</li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="font-serif" style={{ fontSize: '17px', color: '#18251C', fontWeight: 700, marginBottom: '16px' }}>
            Contact & Support
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#687369' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#145C38" />
              <span>contact@stockpilot.ai</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="#145C38" />
              <span>www.stockpilot.ai</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#145C38" />
              <span>Hyderabad · Bangalore · Dubai</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '24px', borderTop: '1px solid #E8E2D7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#8E998F' }}>
        <div>
          © 2026 StockPilot AI. All rights reserved. Travel Inventory & Revenue Optimization Engine.
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security & Compliance</span>
        </div>
      </div>
    </footer>
  );
}
