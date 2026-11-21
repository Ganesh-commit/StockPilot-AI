import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
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

          {/* Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Application Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Overview />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/forecasting"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Forecasting />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/accuracy"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ForecastAccuracy />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/inventory"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Inventory />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/procurement"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Procurement />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/newsvendor"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <NewsvendorOptimizer />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/optimizer"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <BudgetOptimizer />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/simulator"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ScenarioSimulator />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/suppliers"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SupplierIntelligence />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/risk"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <RiskAnalysis />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/portfolio"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Portfolio />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reports"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Reports />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/notifications"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Notifications />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
