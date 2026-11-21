import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import confetti from 'canvas-confetti';

export default function Navbar({ activeSection = 'home', onOpenResources }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loginDemo } = useAuth();

  const handleLaunchDemo = async () => {
    try {
      await loginDemo();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.15 },
          colors: ['#145C38', '#F29A38', '#EAF7EE']
        });
      } catch (e) {}
      navigate('/dashboard');
    } catch (e) {
      navigate('/login');
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Features', href: '#features', id: 'features' },
    { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
    { label: 'Solutions', href: '#solutions', id: 'solutions' },
    { label: 'Pricing', href: '#pricing', id: 'pricing' },
    { label: 'Resources', href: '#resources', id: 'resources', isAction: true }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#FAF7F0',
        borderBottom: '1px solid #E8E2D7',
        padding: '16px 28px'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Left: Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo size="normal" />
        </Link>

        {/* Center: Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '30px'
          }}
          className="desktop-nav"
        >
          {navLinks.map(link => {
            const isActive = activeSection === link.id;
            if (link.isAction) {
              return (
                <button
                  key={link.id}
                  onClick={onOpenResources}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#18251C',
                    fontSize: '15px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: '0 0 4px',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={e => (e.target.style.color = '#145C38')}
                  onMouseLeave={e => (e.target.style.color = '#18251C')}
                >
                  {link.label}
                </button>
              );
            }
            return (
              <a
                key={link.id}
                href={link.href}
                style={{
                  color: isActive ? '#145C38' : '#18251C',
                  fontSize: '15px',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px',
                  borderBottom: isActive ? '2px solid #145C38' : '2px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary-forest"
              style={{ padding: '9px 20px', fontSize: '14px' }}
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <>
              <button
                onClick={handleLaunchDemo}
                style={{
                  padding: '7px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  backgroundColor: '#F4EBDD',
                  color: '#145C38',
                  border: '1.5px solid #145C38',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
                className="desktop-nav"
                title="Instant 1-Click Access without Signup"
              >
                <Sparkles size={13} color="#F29A38" />
                <span>Try Live Demo</span>
              </button>

              <button
                onClick={() => navigate('/login')}
                className="btn-outline-forest"
                style={{ padding: '8px 18px', fontSize: '14px', borderRadius: '9999px' }}
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary-forest"
                style={{ padding: '9px 20px', fontSize: '14px' }}
              >
                Get Started
              </button>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#145C38',
              display: 'none'
            }}
            className="mobile-nav-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 859px) {
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
