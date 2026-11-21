import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import Login from './pages/Auth/Login.jsx';
import Signup from './pages/Auth/Signup.jsx';
import AppLayout from './components/AppLayout.jsx';

import Overview from './pages/Dashboard/Overview.jsx';
import Forecasting from './pages/Dashboard/Forecasting.jsx';
import ForecastAccuracy from './pages/Dashboard/ForecastAccuracy.jsx';
import Inventory from './pages/Dashboard/Inventory.jsx';
import Procurement from './pages/Dashboard/Procurement.jsx';
import NewsvendorOptimizer from './pages/Dashboard/NewsvendorOptimizer.jsx';
import BudgetOptimizer from './pages/Dashboard/BudgetOptimizer.jsx';
import ScenarioSimulator from './pages/Dashboard/ScenarioSimulator.jsx';
import SupplierIntelligence from './pages/Dashboard/SupplierIntelligence.jsx';
import RiskAnalysis from './pages/Dashboard/RiskAnalysis.jsx';
import Portfolio from './pages/Dashboard/Portfolio.jsx';
import Reports from './pages/Dashboard/Reports.jsx';
import Notifications from './pages/Dashboard/Notifications.jsx';
import Settings from './pages/Dashboard/Settings.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Application Dashboard */}
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <Overview />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/forecasting"
            element={
              <AppLayout>
                <Forecasting />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/accuracy"
            element={
              <AppLayout>
                <ForecastAccuracy />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/inventory"
            element={
              <AppLayout>
                <Inventory />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/procurement"
            element={
              <AppLayout>
                <Procurement />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/newsvendor"
            element={
              <AppLayout>
                <NewsvendorOptimizer />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/optimizer"
            element={
              <AppLayout>
                <BudgetOptimizer />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/simulator"
            element={
              <AppLayout>
                <ScenarioSimulator />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/suppliers"
            element={
              <AppLayout>
                <SupplierIntelligence />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/risk"
            element={
              <AppLayout>
                <RiskAnalysis />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/portfolio"
            element={
              <AppLayout>
                <Portfolio />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/reports"
            element={
              <AppLayout>
                <Reports />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/notifications"
            element={
              <AppLayout>
                <Notifications />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
