// StockPilot AI Unified API Client with Instant Offline Demo Fallback
import { demoStore, computeNewsvendor, computeSimulation } from './demoEngine';
import { buildApiUrl } from './apiConfig';

const API_TIMEOUT = 5000; // 5.0 seconds max wait for live server before falling back to demo store

async function safeFetch(url, options = {}) {
  const token = localStorage.getItem('stockpilot_token');
  const headers = { ...(options.headers || {}) };
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  try {
    const fullUrl = buildApiUrl(url);
    const res = await fetch(fullUrl, { ...options, headers, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// 1. Procurement Plan & KPIs (Overview, Procurement, BudgetOptimizer, RiskAnalysis, Reports)
export async function fetchPlan(budget = 1e8, lambda = 0.4) {
  try {
    const data = await safeFetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ budget, lambda })
    });
    if (data && data.rows && data.rows.length) return data;
  } catch (err) {
    // Fallback to local deterministic demo engine
  }
  return demoStore.getPlan(budget, lambda);
}

// 2. Inventory Opportunities (Inventory, Forecasting)
export async function fetchInventory() {
  try {
    const data = await safeFetch('/api/inventory');
    if (Array.isArray(data) && data.length) return data;
  } catch (err) {
    // Fallback
  }
  return demoStore.getItems();
}

export async function createInventoryItem(item) {
  try {
    const data = await safeFetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (data) {
      demoStore.addItem(data);
      return data;
    }
  } catch (err) {
    // Fallback
  }
  return demoStore.addItem(item);
}

export async function deleteInventoryItem(id) {
  try {
    const data = await safeFetch(`/api/inventory/${id}`, { method: 'DELETE' });
    if (data) {
      demoStore.deleteItem(id);
      return data;
    }
  } catch (err) {
    // Fallback
  }
  return demoStore.deleteItem(id);
}

// 3. Reseed Market Simulation
export async function reseedMarket(seed) {
  try {
    await safeFetch('/api/reseed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seed })
    });
  } catch (err) {
    // Fallback
  }
  demoStore.reset();
  window.dispatchEvent(new Event('stockpilot-reseeded'));
  return { success: true };
}

// 4. Forecast Accuracy Backtest (ForecastAccuracy)
export async function fetchAccuracy() {
  try {
    const data = await safeFetch('/api/accuracy');
    if (data && data.items && data.items.length) return data;
  } catch (err) {
    // Fallback
  }
  return demoStore.getAccuracy();
}

// 5. Supplier Intelligence (SupplierIntelligence)
export async function fetchSuppliers() {
  try {
    const data = await safeFetch('/api/suppliers');
    if (Array.isArray(data) && data.length) return data;
  } catch (err) {
    // Fallback
  }
  return demoStore.getSuppliers();
}

// 6. Committed Portfolio (Portfolio)
export async function fetchPortfolio() {
  try {
    const data = await safeFetch('/api/portfolio');
    if (Array.isArray(data) && data.length) return data;
  } catch (err) {
    // Fallback
  }
  return demoStore.getPortfolio();
}

export async function createPortfolioOrder(order) {
  try {
    const data = await safeFetch('/api/portfolio/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (data) {
      demoStore.addPortfolioOrder(data);
      return data;
    }
  } catch (err) {
    // Fallback
  }
  return demoStore.addPortfolioOrder(order);
}

// 7. System Notifications (Notifications)
export async function fetchNotifications() {
  try {
    const data = await safeFetch('/api/notifications');
    if (Array.isArray(data) && data.length) return data;
  } catch (err) {
    // Fallback
  }
  return demoStore.getNotifications();
}

export async function markNotificationsRead() {
  try {
    await safeFetch('/api/notifications/mark-read', { method: 'POST' });
  } catch (err) {
    // Fallback
  }
  return demoStore.markNotificationsRead();
}

// 8. Scenario Simulator (ScenarioSimulator)
export async function runScenarioSimulation(params) {
  try {
    const data = await safeFetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (data && data.baseline && data.modified) return data;
  } catch (err) {
    // Fallback
  }
  return computeSimulation({
    baseItems: demoStore.getItems(),
    budget: params.budget,
    lambda: params.lambda,
    demandDeltaPct: params.demandDeltaPct,
    costDeltaPct: params.costDeltaPct,
    priceDeltaPct: params.priceDeltaPct,
    cancelDeltaPct: params.cancelDeltaPct
  });
}

// 9. Standalone Newsvendor Solver (NewsvendorOptimizer)
export async function solveNewsvendorStandalone(params) {
  try {
    const data = await safeFetch('/api/newsvendor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (data && data.criticalRatio != null) return data;
  } catch (err) {
    // Fallback
  }
  return computeNewsvendor(params);
}
