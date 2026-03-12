'use client';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', padding: '10px 16px', fontFamily: 'var(--mono)', fontSize: 12 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4, fontSize: 10 }}>{label}</div>
      <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
        {typeof payload[0].value === 'number' ? payload[0].value.toLocaleString('it-IT') : payload[0].value} {unit}
      </div>
    </div>
  );
};

// Compact Y-axis: abbreviate large numbers
const formatY = (value) => {
  if (Math.abs(value) >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (Math.abs(value) >= 1_000_000)     return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (Math.abs(value) >= 1_000)         return (value / 1_000).toFixed(0) + 'k';
  return value % 1 === 0 ? value : value.toFixed(1);
};

// Show only every other year on X axis to avoid crowding
const formatX = (year, index, data) => {
  if (!data || data.length <= 7) return year;
  return index % 2 === 0 ? year : '';
};

const AXIS = { fontFamily: 'var(--mono)', fontSize: 9, fill: 'var(--text-muted)' };
const GRID = <CartesianGrid stroke="var(--border)" strokeDasharray="0" vertical={false} />;

export default function IndicatorChart({ data = [], unit = '', type = 'area', color = '#0a0a09', showZeroLine = false, height = 200 }) {
  const tickFormatter = (v) => formatY(v);
  const xFormatter    = (v, i) => formatX(v, i, data);

  const commonProps = {
    data,
    margin: { top: 8, right: 4, left: -8, bottom: 0 },
  };

  const xAxis = <XAxis dataKey="year" tick={AXIS} axisLine={false} tickLine={false} tickFormatter={xFormatter} interval={0} />;
  const yAxis = <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={tickFormatter} width={38} />;
  const tip   = <Tooltip content={<CustomTooltip unit={unit} />} />;
  const zero  = showZeroLine ? <ReferenceLine y={0} stroke="var(--text-primary)" strokeWidth={1} /> : null;

  if (type === 'bar') return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart {...commonProps} barCategoryGap="30%">
        {GRID}{xAxis}{yAxis}{zero}{tip}
        <Bar dataKey="value" fill={color} opacity={0.85} radius={[1, 1, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  if (type === 'line') return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart {...commonProps}>
        {GRID}{xAxis}{yAxis}{zero}{tip}
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5}
          dot={{ r: 2, fill: 'white', stroke: color, strokeWidth: 1.5 }} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart {...commonProps}>
        {GRID}{xAxis}{yAxis}{zero}{tip}
        <defs>
          <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.08} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5}
          fill={`url(#grad-${color.replace('#','')})`} dot={false} activeDot={{ r: 3, fill: color }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
