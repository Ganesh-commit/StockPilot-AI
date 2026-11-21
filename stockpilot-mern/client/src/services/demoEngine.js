// StockPilot AI - Client-Side Autonomous Demo Engine
// Provides 100% resilient, offline-capable travel procurement simulation

const ITEMS_SEED = [
  ['Goa', 'Hotel Rooms', 900, 0.45, 0.12, 0.14, 3200, 4400, 0.12, 14000, 40, 'Luxury beachfront boutique resort rooms in North & South Goa.', 'Royal Palms Hospitality'],
  ['Dubai', 'Flight Seats', 1400, 0.30, 0.08, 0.12, 14000, 16800, 0.08, 22000, 45, 'Premium economy and business charter seat blocks on tier-1 Gulf carriers.', 'Gulf Aviation Charters'],
  ['Bali', 'Resorts', 500, 0.40, 0.18, 0.18, 6200, 8600, 0.15, 8000, 10, 'Private pool villas and ocean-view suites in Seminyak and Ubud.', 'Nirvana Island Resorts'],
  ['Maldives', 'Villas', 160, 0.35, -0.05, 0.22, 21000, 30000, 0.18, 2600, 15, 'Overwater bungalows with all-inclusive premium transfer packages.', 'Atoll Marine Luxury Villas'],
  ['Singapore', 'Hotel Rooms', 700, 0.20, 0.10, 0.10, 5200, 6900, 0.10, 11000, 30, 'Centrally located business-leisure 4-star hotels near Marina Bay.', 'Merlion City Hotels'],
  ['Jaipur', 'Hotel Rooms', 650, 0.50, 0.06, 0.16, 2600, 3700, 0.11, 10000, 48, 'Heritage palace hotels and royal suites with peak wedding season demand.', 'Heritage Rajputana Group'],
  ['Bangkok', 'Flight Seats', 1000, 0.28, 0.15, 0.13, 9000, 11200, 0.09, 15500, 5, 'Direct return flight inventory blocks connecting major metro hubs.', 'Siam Skyway Airlines'],
  ['Kerala', 'Resorts', 420, 0.38, 0.09, 0.17, 4200, 5900, 0.13, 6500, 35, 'Ayurvedic retreat resorts and backwater luxury houseboat allocations.', 'Backwater Serenity Stays']
];

function rng(s) {
  return () => {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = r => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());

export function generateItems(seed = 7) {
  const r = rng(seed);
  return ITEMS_SEED.map(([name, type, b, a, tr, v, cost, price, cancel, cap, ph, desc, supplier], idx) => {
    const obs = [];
    const soldOut = [];
    const wc = (cap / 12) * 0.95;
    for (let t = 0; t < 104; t++) {
      const d = b * (1 + (tr * t) / 104) * (1 + a * Math.sin((2 * Math.PI * (t + ph)) / 52)) * (1 + v * gauss(r));
      soldOut.push(d > wc);
      obs.push(Math.max(5, Math.min(d, wc)));
    }
    return {
      id: 'inv-' + (idx + 1),
      name,
      type,
      destination: name,
      category: type,
      cost,
      price,
      cancel,
      cap,
      availableQty: Math.round(cap * 0.75),
      purchasedQty: Math.round(cap * 0.25),
      travelDate: 'Q4 2026 - W12',
      supplier: supplier || 'Global Partner Network',
      description: desc,
      obs,
      soldOut
    };
  });
}

const sm = (o, t) => (o[t - 1] + o[t] + o[t + 1]) / 3;

export function fit(it) {
  const o = it.obs;
  const mean = (a, b) => {
    let s = 0;
    for (let i = a; i < b; i++) s += o[i];
    return s / (b - a);
  };
  const gAt = t => Math.min(1.5, Math.max(0.7, mean(t - 8, t) / mean(t - 60, t - 52)));
  let e = 0;
  for (let t = 78; t < 104; t++) {
    e += (o[t] - sm(o, t - 52) * gAt(t)) ** 2;
  }
  const sd = Math.sqrt(e / 26);
  const g = gAt(104);
  const p50 = [];
  const p10 = [];
  const p90 = [];
  for (let h = 0; h < 12; h++) {
    const med = sm(o, 52 + h) * g;
    const bandWidth = 1.28 * sd;
    p50.push(Math.round(med));
    p10.push(Math.max(0, Math.round(med - bandWidth)));
    p90.push(Math.round(med + bandWidth));
  }
  const mu = p50.reduce((a, b) => a + b, 0);
  const sH = sd * Math.sqrt(12);

  const Cu = it.price * (1 - 0.5 * it.cancel) - it.cost;
  const Co = it.cost - 0.25 * it.cost;
  const criticalRatio = Math.max(0.01, Math.min(0.99, Cu / (Cu + Co)));

  return {
    ...it,
    sd,
    g,
    p50,
    p10,
    p90,
    mu,
    sH,
    Cu,
    Co,
    criticalRatio,
    so: it.soldOut.slice(78).filter(Boolean).length
  };
}

const Phi = z => {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const p =
    0.3989423 *
    Math.exp((-z * z) / 2) *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
};

const phi = z => 0.3989423 * Math.exp((-z * z) / 2);

const shortfall = (q, m, s) => {
  if (s <= 0) return Math.max(0, m - q);
  const z = (q - m) / s;
  return s * (phi(z) - z * (1 - Phi(z)));
};

function ev(it, q, lam) {
  const s = Math.min(q, Math.max(0, it.mu - shortfall(q, it.mu, it.sH)));
  const u = Math.max(0, q - s);
  const revenue = it.price * (1 - 0.5 * it.cancel) * s;
  const salvage = 0.25 * it.cost * u;
  const procurementCost = it.cost * q;
  const pr = revenue + salvage - procurementCost;
  const riskPenalty = lam * 0.6 * it.cost * u;
  return {
    s,
    u,
    pr,
    revenue,
    procurementCost,
    salvage,
    riskPenalty,
    j: pr - riskPenalty
  };
}

export function computePlan(rawItems, B = 1e8, lam = 0.4) {
  const S = rawItems.map(fit);
  let left = B;
  const q = S.map(() => 0);
  const cur = S.map(it => ev(it, 0, lam));

  for (let k = 0; k < 1000; k++) {
    let bi = -1;
    let be = 0;
    let bd = 0;
    S.forEach((it, i) => {
      const dq = Math.max(1, Math.round(B / 350 / it.cost));
      const nq = Math.min(it.cap, q[i] + dq);
      const d = nq - q[i];
      if (d <= 0 || d * it.cost > left) return;
      const e = (ev(it, nq, lam).j - cur[i].j) / (d * it.cost);
      if (e > be) {
        be = e;
        bi = i;
        bd = d;
      }
    });
    if (bi < 0) break;
    q[bi] += bd;
    left -= bd * S[bi].cost;
    cur[bi] = ev(S[bi], q[bi], lam);
  }

  const rows = S.map((it, i) => {
    const u = q[i];
    const c = cur[i];
    const cov = u / (it.mu || 1);
    const st = u ? c.s / u : 0;
    const action = u === 0 || c.pr <= 0 ? 'SKIP' : cov >= 0.95 ? 'PRE-BUY' : 'BUY PARTLY';
    const riskScore = Math.min(100, Math.round((1 - st) * 70 + (it.so / 26) * 30));

    return {
      id: it.id,
      name: it.name,
      destination: it.destination,
      type: it.type,
      category: it.category,
      cost: it.cost,
      price: it.price,
      cancelRate: it.cancel,
      supplier: it.supplier,
      availableQty: it.availableQty,
      purchasedQty: it.purchasedQty,
      demandP50: it.mu,
      units: u,
      spend: u * it.cost,
      revenue: c.revenue,
      sellThrough: st,
      profit: c.pr,
      riskScore,
      action,
      criticalRatio: it.criticalRatio,
      reason: `${((it.g - 1) * 100).toFixed(0)}% YoY growth; ${it.so} sold-out backtest weeks; uncertainty ±${Math.round(
        it.sd * 1.28
      )}/wk`,
      forecast: {
        hist: it.obs.slice(78),
        soldOut: it.soldOut.slice(78),
        p50: it.p50,
        p10: it.p10,
        p90: it.p90,
        band: 1.28 * it.sd
      }
    };
  });

  const profit = cur.reduce((a, c) => a + c.pr, 0);
  const unsold = cur.reduce((a, c, i) => a + c.u * S[i].cost, 0);
  const sold = cur.reduce((a, c) => a + c.s, 0);
  const bought = q.reduce((a, b) => a + b, 0);

  let even = 0;
  S.forEach(it => {
    even += ev(it, Math.min(it.cap, Math.floor(B / S.length / it.cost)), 0).pr;
  });

  return {
    rows,
    kpis: {
      budget: B,
      spent: B - left,
      profit,
      unsold,
      sellThrough: bought ? sold / bought : 0,
      vsEven: even > 0 ? profit / even - 1 : 0.15,
      riskScore: Math.round((unsold / (B - left || 1)) * 100),
      activeOpportunities: rows.length,
      expectedDemand: Math.round(rows.reduce((sum, r) => sum + r.demandP50, 0))
    }
  };
}

export function computeAccuracy(rawItems) {
  const S = rawItems.map(fit);
  const results = S.map(it => {
    const o = it.obs;
    const mean = (a, b) => {
      let s = 0;
      for (let i = a; i < b; i++) s += o[i];
      return s / (b - a);
    };
    const gAt = t => Math.min(1.5, Math.max(0.7, mean(t - 8, t) / mean(t - 60, t - 52)));

    let absErrSum = 0;
    let sqErrSum = 0;
    let mapeSum = 0;
    let validMapeCount = 0;
    const comparisons = [];

    for (let t = 78; t < 104; t++) {
      const actual = Math.round(o[t]);
      const predicted = Math.round(sm(o, t - 52) * gAt(t));
      const err = Math.abs(actual - predicted);
      absErrSum += err;
      sqErrSum += err * err;
      if (actual > 0) {
        mapeSum += (err / actual) * 100;
        validMapeCount++;
      }
      comparisons.push({
        week: `W-${104 - t}`,
        actual,
        predicted,
        error: err
      });
    }

    const n = 26;
    const mae = +(absErrSum / n).toFixed(2);
    const rmse = +Math.sqrt(sqErrSum / n).toFixed(2);
    const mape = +(validMapeCount > 0 ? mapeSum / validMapeCount : 0).toFixed(2);
    const accuracyPct = Math.max(0, +(100 - mape).toFixed(1));

    return {
      destination: it.name,
      category: it.type,
      mae,
      rmse,
      mape,
      accuracyPct,
      comparisons
    };
  });

  const avgAccuracy = +(results.reduce((s, r) => s + r.accuracyPct, 0) / results.length).toFixed(1);
  const avgMape = +(results.reduce((s, r) => s + r.mape, 0) / results.length).toFixed(1);

  return {
    overallAccuracy: avgAccuracy,
    overallMape: avgMape,
    items: results
  };
}

function invNormal(p) {
  const a = [-39.696830, 220.946098, -275.928510, 138.357751, -30.664798, 2.506628];
  const b = [-54.476098, 161.585836, -155.698979, 66.801311, -13.280681];
  const c = [-0.007784894, -0.322396458, -2.400758, -2.549732, 4.374664, 2.938163];
  const d = [0.007784695, 0.322467129, 2.445134, 3.754408, 1.0];

  const q = p - 0.5;
  if (Math.abs(q) <= 0.42) {
    const r = q * q;
    return q * (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const r = p < 0.5 ? p : 1 - p;
  const s = Math.log(-Math.log(r));
  let x = c[0] + s * (c[1] + s * (c[2] + s * (c[3] + s * (c[4] + s * c[5])))) /
    (d[0] + s * (d[1] + s * (d[2] + s * (d[3] + s * d[4]))));
  return p < 0.5 ? -x : x;
}

export function computeNewsvendor({ cost = 3200, price = 4400, cancelRate = 0.1, salvageRate = 0.25, mean = 1000, sd = 150 }) {
  const Cu = price * (1 - 0.5 * cancelRate) - cost;
  const Co = cost - salvageRate * cost;
  const criticalRatio = Math.max(0.01, Math.min(0.99, Cu / (Cu + Co)));
  const z = invNormal(criticalRatio);
  const optimalQuantity = Math.max(1, Math.round(mean + z * sd));

  const s = Math.min(optimalQuantity, Math.max(0, mean - shortfall(optimalQuantity, mean, sd)));
  const expectedUnsold = Math.max(0, optimalQuantity - s);
  const expectedLostSales = Math.max(0, shortfall(optimalQuantity, mean, sd));
  const expectedRevenue = price * (1 - 0.5 * cancelRate) * s;
  const salvageValue = salvageRate * cost * expectedUnsold;
  const procurementCost = cost * optimalQuantity;
  const expectedProfit = expectedRevenue + salvageValue - procurementCost;

  return {
    cost,
    price,
    cancelRate,
    salvageRate,
    mean,
    sd,
    Cu: Math.round(Cu),
    Co: Math.round(Co),
    criticalRatio: +criticalRatio.toFixed(3),
    optimalQuantity,
    expectedSales: Math.round(s),
    expectedUnsold: Math.round(expectedUnsold),
    expectedLostSales: Math.round(expectedLostSales),
    expectedRevenue: Math.round(expectedRevenue),
    procurementCost: Math.round(procurementCost),
    expectedProfit: Math.round(expectedProfit),
    recommendationReason: `Underage margin ₹${Math.round(Cu)} vs overage risk ₹${Math.round(Co)} dictates an optimal target service level of ${(criticalRatio * 100).toFixed(1)}%.`
  };
}

export function computeSimulation({ baseItems, budget = 1e8, lambda = 0.4, demandDeltaPct = 0, costDeltaPct = 0, priceDeltaPct = 0, cancelDeltaPct = 0 }) {
  const baseline = computePlan(baseItems, budget, lambda);

  const modifiedItems = baseItems.map(item => {
    const costMult = 1 + costDeltaPct / 100;
    const priceMult = 1 + priceDeltaPct / 100;
    const demandMult = 1 + demandDeltaPct / 100;
    const cancelAdd = cancelDeltaPct / 100;

    return {
      ...item,
      cost: Math.round(item.cost * costMult),
      price: Math.round(item.price * priceMult),
      cancel: Math.max(0.01, Math.min(0.5, item.cancel + cancelAdd)),
      obs: item.obs.map(v => Math.round(v * demandMult))
    };
  });

  const modified = computePlan(modifiedItems, budget, lambda);

  return {
    baseline: {
      budget: baseline.kpis.budget,
      spent: baseline.kpis.spent,
      profit: baseline.kpis.profit,
      unsold: baseline.kpis.unsold,
      sellThrough: baseline.kpis.sellThrough,
      rows: baseline.rows
    },
    modified: {
      budget: modified.kpis.budget,
      spent: modified.kpis.spent,
      profit: modified.kpis.profit,
      unsold: modified.kpis.unsold,
      sellThrough: modified.kpis.sellThrough,
      rows: modified.rows
    },
    deltas: {
      spentDelta: modified.kpis.spent - baseline.kpis.spent,
      profitDelta: modified.kpis.profit - baseline.kpis.profit,
      unsoldDelta: modified.kpis.unsold - baseline.kpis.unsold,
      sellThroughDelta: +(modified.kpis.sellThrough - baseline.kpis.sellThrough).toFixed(3)
    }
  };
}

// In-Memory Live Demo Store
let demoItems = generateItems(7);
let demoPortfolio = [
  {
    id: 'port-1',
    destination: 'Goa',
    category: 'Hotel Rooms',
    units: 240,
    cost: 3200,
    price: 4400,
    totalCommitted: 768000,
    expectedRevenue: 1056000,
    expectedProfit: 288000,
    status: 'ACTIVE',
    committedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'port-2',
    destination: 'Dubai',
    category: 'Flight Seats',
    units: 180,
    cost: 14000,
    price: 16800,
    totalCommitted: 2520000,
    expectedRevenue: 3024000,
    expectedProfit: 504000,
    status: 'ACTIVE',
    committedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'port-3',
    destination: 'Bali',
    category: 'Resorts',
    units: 120,
    cost: 6200,
    price: 8600,
    totalCommitted: 744000,
    expectedRevenue: 1032000,
    expectedProfit: 288000,
    status: 'ACTIVE',
    committedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

let demoNotifications = [
  {
    id: 'notif-1',
    type: 'ALERT',
    title: 'Surge Demand Detected in Goa',
    message: 'Q4 holiday travel spike predicted. +22% YoY expected in beachfront rooms.',
    date: '10m ago',
    read: false
  },
  {
    id: 'notif-2',
    type: 'SUCCESS',
    title: 'Budget Optimization Generated',
    message: '₹10 Cr capital allocated across 8 inventory blocks with 96% expected sell-through.',
    date: '1h ago',
    read: false
  },
  {
    id: 'notif-3',
    type: 'INFO',
    title: 'Newsvendor Critical Ratio Adjusted',
    message: 'Maldives cancellation rate increased to 18%; critical ratio lowered to 0.72.',
    date: '4h ago',
    read: true
  }
];

export const demoStore = {
  getItems: () => [...demoItems],
  addItem: item => {
    const newItem = {
      id: 'inv-' + Date.now(),
      name: item.name || 'Custom Destination',
      type: item.type || 'Hotel Rooms',
      destination: item.name || 'Custom Destination',
      category: item.type || 'Hotel Rooms',
      cost: +item.cost || 3500,
      price: +item.price || 4900,
      cancel: +item.cancel || 0.12,
      cap: +item.cap || 8000,
      availableQty: Math.round((+item.cap || 8000) * 0.75),
      purchasedQty: Math.round((+item.cap || 8000) * 0.25),
      travelDate: 'Q4 2026 - W12',
      supplier: item.supplier || 'Global Wholesale Partner',
      description: item.description || 'Procured travel inventory block.',
      obs: demoItems[0].obs.map(v => Math.round(v * 0.9)),
      soldOut: demoItems[0].soldOut.slice()
    };
    demoItems.unshift(newItem);
    return newItem;
  },
  deleteItem: id => {
    if (demoItems.length > 3) {
      demoItems = demoItems.filter(i => i.id !== id);
    }
    return { success: true };
  },
  reset: () => {
    demoItems = generateItems(7);
    return { success: true };
  },
  getPlan: (budget = 1e8, lambda = 0.4) => computePlan(demoItems, budget, lambda),
  getAccuracy: () => computeAccuracy(demoItems),
  getSuppliers: () => [
    {
      id: 'sup-1',
      name: 'Royal Palms Hospitality Group',
      destinations: ['Goa', 'Bali'],
      categories: ['Hotel Rooms', 'Resorts'],
      reliabilityScore: 96,
      deliveryRisk: 'LOW',
      activeContracts: 4,
      volumeUnderwritten: '₹3.4 Cr',
      rating: 4.9,
      contact: 'contracts@royalpalms.com',
      notes: 'Premier partner since 2024. Guaranteed 24-hour room release terms.'
    },
    {
      id: 'sup-2',
      name: 'Gulf Aviation & Charter Services',
      destinations: ['Dubai'],
      categories: ['Flight Seats'],
      reliabilityScore: 94,
      deliveryRisk: 'LOW',
      activeContracts: 2,
      volumeUnderwritten: '₹2.5 Cr',
      rating: 4.8,
      contact: 'ops@gulfcharters.ae',
      notes: 'Direct block allocation on Boeing 777-300ER and Airbus A380 routes.'
    },
    {
      id: 'sup-3',
      name: 'Siam Skyway Airlines & Transit',
      destinations: ['Bangkok'],
      categories: ['Flight Seats'],
      reliabilityScore: 92,
      deliveryRisk: 'LOW',
      activeContracts: 3,
      volumeUnderwritten: '₹1.8 Cr',
      rating: 4.7,
      contact: 'procurement@siamsky.th',
      notes: 'Southeast Asia connection blocks with flexible cancellation waivers.'
    },
    {
      id: 'sup-4',
      name: 'Heritage Rajputana Palace Hotels',
      destinations: ['Jaipur'],
      categories: ['Hotel Rooms'],
      reliabilityScore: 90,
      deliveryRisk: 'LOW',
      activeContracts: 2,
      volumeUnderwritten: '₹1.1 Cr',
      rating: 4.6,
      contact: 'sales@heritagepalaces.in',
      notes: 'High peak wedding seasonality; requires firm non-refundable deposit.'
    },
    {
      id: 'sup-5',
      name: 'Atoll Marine Luxury Villas Ltd',
      destinations: ['Maldives'],
      categories: ['Villas'],
      reliabilityScore: 88,
      deliveryRisk: 'MODERATE',
      activeContracts: 1,
      volumeUnderwritten: '₹95 Lakhs',
      rating: 4.5,
      contact: 'reservations@atollvillas.mv',
      notes: 'High cancellation sensitivity; recommended for selective high-budget allocation.'
    },
    {
      id: 'sup-6',
      name: 'Backwater Serenity Ayurvedic Stays',
      destinations: ['Kerala'],
      categories: ['Resorts'],
      reliabilityScore: 89,
      deliveryRisk: 'MODERATE',
      activeContracts: 2,
      volumeUnderwritten: '₹75 Lakhs',
      rating: 4.5,
      contact: 'partner@backwaterserenity.com',
      notes: 'Wellness travel demand with steady shoulder-season occupancy.'
    }
  ],
  getPortfolio: () => [...demoPortfolio],
  addPortfolioOrder: order => {
    const newOrder = {
      id: 'port-' + Date.now(),
      ...order,
      totalCommitted: +order.units * +order.cost,
      expectedRevenue: +order.units * +order.price,
      expectedProfit: +order.expectedProfit,
      status: 'ACTIVE',
      committedAt: new Date().toISOString()
    };
    demoPortfolio.unshift(newOrder);
    demoNotifications.unshift({
      id: 'notif-' + Date.now(),
      type: 'SUCCESS',
      title: `Order Executed: ${order.destination} ${order.category}`,
      message: `Procured ${order.units} units for ₹${((order.units * order.cost) / 1e5).toFixed(1)} Lakhs.`,
      date: 'Just now',
      read: false
    });
    return newOrder;
  },
  getNotifications: () => [...demoNotifications],
  markNotificationsRead: () => {
    demoNotifications.forEach(n => (n.read = true));
    return { success: true };
  }
};
