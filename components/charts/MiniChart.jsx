'use client';
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

export default function MiniChart({ data = [], color = "#0a0a09", unit = "" }) {
  if (!data.length) return <div style={{ height: 40 }} />;
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} />
        <Tooltip
          contentStyle={{ fontFamily: "var(--mono)", fontSize: 11, border: "1px solid var(--border)", borderRadius: 0, background: "white", padding: "4px 10px" }}
          formatter={(v) => [typeof v === "number" ? v.toLocaleString("it-IT") : v, unit]}
          labelFormatter={(l) => l}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
