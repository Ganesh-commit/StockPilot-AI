import React, { useState } from 'react';

export default function Chart({ f, name }) {
  if (!f || !f.hist) return null;

  const [hoverIndex, setHoverIndex] = useState(null);

  const o = f.hist; // 26 historical weeks
  const k = f.band; // confidence band half-width
  const W = 880;
  const H = 320;
  const P = 44;
  const n = o.length + 12; // 26 historical + 12 forecast = 38 weeks
  
  const X = i => P + i * (W - P - 24) / (n - 1);
  const up = f.p50.map(v => v + k);
  const lo = f.p50.map(v => Math.max(0, v - k));
  const mx = Math.max(...o, ...up) * 1.12;
  const Y = v => H - 36 - (v / mx) * (H - 64);
  
  const fx = i => X(o.length + i);
  const pts = a => a.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  
  // Area fill under historical data
  const histArea = `${X(0)},${H - 36} ${pts(o)} ${X(o.length - 1)},${H - 36}`;

  // Confidence band polygon
  const band = up.map((v, i) => `${fx(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ') + ' ' +
               lo.map((v, i) => [fx(i).toFixed(1), Y(v).toFixed(1)]).reverse().map(a => a.join(',')).join(' ');

  // Forecast polyline
  const fc = `${X(o.length - 1).toFixed(1)},${Y(o[o.length - 1]).toFixed(1)} ` +
             f.p50.map((v, i) => `${fx(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');

  // Forecast area fill
  const fcArea = `${X(o.length - 1)},${H - 36} ` +
                 `${X(o.length - 1)},${Y(o[o.length - 1])} ` +
                 f.p50.map((v, i) => `${fx(i)},${Y(v)}`).join(' ') +
                 ` ${fx(11)},${H - 36}`;

  // Find hover details
  let hoverData = null;
  if (hoverIndex !== null) {
    if (hoverIndex < o.length) {
      hoverData = {
        label: `Historical Week -${o.length - hoverIndex}`,
        val: Math.round(o[hoverIndex]),
        x: X(hoverIndex),
        y: Y(o[hoverIndex]),
        isSoldOut: f.soldOut[hoverIndex],
        type: 'observed'
      };
    } else {
      const fi = hoverIndex - o.length;
      hoverData = {
        label: `Forecast Week +${fi + 1}`,
        val: Math.round(f.p50[fi]),
        bandLow: Math.round(lo[fi]),
        bandHigh: Math.round(up[fi]),
        x: fx(fi),
        y: Y(f.p50[fi]),
        type: 'forecast'
      };
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Demand forecast chart for ${name}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="histGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="fcGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.05" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(r => {
          const yVal = H - 36 - r * (H - 64);
          const val = Math.round(r * mx);
          return (
            <g key={r}>
              <line
                x1={P}
                x2={W - 24}
                y1={yVal}
                y2={yVal}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="4 4"
              />
              <text
                x={P - 10}
                y={yVal + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748B"
                fontFamily="var(--font-mono)"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Confidence Band */}
        <polygon points={band} fill="url(#bandGradient)" />

        {/* Historical Area fill */}
        <polygon points={histArea} fill="url(#histGradient)" />
        {/* Forecast Area fill */}
        <polygon points={fcArea} fill="url(#fcGradient)" />

        {/* Historical Line */}
        <polyline
          points={pts(o)}
          fill="none"
          stroke="#94A3B8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Forecast Line */}
        <polyline
          points={fc}
          fill="none"
          stroke="#06B6D4"
          strokeWidth="3"
          strokeDasharray="6 5"
          filter="url(#glow)"
        />

        {/* Today vertical separation marker */}
        <line
          x1={X(o.length - 1)}
          x2={X(o.length - 1)}
          y1="18"
          y2={H - 36}
          stroke="rgba(99, 102, 241, 0.5)"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <rect
          x={X(o.length - 1) - 28}
          y="8"
          width="56"
          height="20"
          rx="6"
          fill="#1E293B"
          stroke="rgba(99, 102, 241, 0.6)"
        />
        <text
          x={X(o.length - 1)}
          y="22"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#A5B4FC"
          fontFamily="var(--font-mono)"
        >
          TODAY
        </text>

        {/* Historical Data Points */}
        {o.map((v, i) => {
          const isSold = f.soldOut[i];
          const cx = X(i);
          const cy = Y(v);
          return (
            <g key={i}>
              {isSold && (
                <circle
                  cx={cx}
                  cy={cy}
                  r="7"
                  fill="rgba(244, 63, 94, 0.25)"
                  className="pulse-circle"
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={isSold ? "4.5" : "3"}
                fill={isSold ? "#F43F5E" : "#94A3B8"}
                stroke="#0B1124"
                strokeWidth="1.5"
              />
            </g>
          );
        })}

        {/* Forecast P50 Data Points */}
        {f.p50.map((v, i) => {
          const cx = fx(i);
          const cy = Y(v);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="3.5"
              fill="#06B6D4"
              stroke="#0B1124"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Interactive hover catchers across all columns */}
        {Array.from({ length: n }).map((_, i) => {
          const x = i < o.length ? X(i) : fx(i - o.length);
          const colWidth = (W - P - 24) / (n - 1);
          return (
            <rect
              key={i}
              x={x - colWidth / 2}
              y={0}
              width={colWidth}
              height={H}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setHoverIndex(i)}
            />
          );
        })}

        {/* Active crosshair and highlight circle on hover */}
        {hoverData && (
          <g pointerEvents="none">
            <line
              x1={hoverData.x}
              x2={hoverData.x}
              y1={18}
              y2={H - 36}
              stroke="rgba(255, 255, 255, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <circle
              cx={hoverData.x}
              cy={hoverData.y}
              r="6"
              fill={hoverData.type === 'forecast' ? '#06B6D4' : (hoverData.isSoldOut ? '#F43F5E' : '#FFFFFF')}
              stroke="#0B1124"
              strokeWidth="2"
              filter="url(#glow)"
            />
          </g>
        )}
      </svg>

      {/* Dynamic Hover Tooltip Card */}
      {hoverData && (
        <div
          style={{
            position: 'absolute',
            left: `${Math.min(Math.max(10, (hoverData.x / W) * 100), 82)}%`,
            top: '16px',
            background: 'rgba(11, 17, 36, 0.95)',
            border: `1px solid ${hoverData.isSoldOut ? 'var(--rose)' : 'var(--border-glow)'}`,
            borderRadius: '10px',
            padding: '8px 12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            pointerEvents: 'none',
            zIndex: 10,
            minWidth: '150px'
          }}
        >
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
            {hoverData.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F8FAFC' }}>
              {hoverData.val} <span style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8' }}>units</span>
            </span>
            {hoverData.isSoldOut && (
              <span style={{ fontSize: '10px', background: 'rgba(244,63,94,0.2)', color: '#F43F5E', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                SOLD OUT
              </span>
            )}
          </div>
          {hoverData.type === 'forecast' && (
            <div style={{ fontSize: '11px', color: '#06B6D4', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              P10–P90: [{hoverData.bandLow} – {hoverData.bandHigh}]
            </div>
          )}
        </div>
      )}
    </div>
  );
}
