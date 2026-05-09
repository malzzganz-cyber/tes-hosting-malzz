"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  value2?: number;
}

interface MalzzAreaChartProps {
  data: DataPoint[];
  color?: string;
  color2?: string;
  height?: number;
  label?: string;
  label2?: string;
}

export function MalzzAreaChart({
  data,
  color = "#6C9EFF",
  color2,
  height = 200,
  label = "Value",
  label2 = "Value 2",
}: MalzzAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.15} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color2 || "#B19DFF"} stopOpacity={0.15} />
            <stop offset="95%" stopColor={color2 || "#B19DFF"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#868E96" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#868E96" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(108,158,255,0.15)",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(108,158,255,0.12)",
            fontSize: "13px",
            fontWeight: "500",
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          name={label}
          stroke={color}
          strokeWidth={2.5}
          fill="url(#colorValue)"
          dot={false}
          activeDot={{ r: 5, fill: color, stroke: "white", strokeWidth: 2 }}
        />
        {color2 && (
          <Area
            type="monotone"
            dataKey="value2"
            name={label2}
            stroke={color2}
            strokeWidth={2.5}
            fill="url(#colorValue2)"
            dot={false}
            activeDot={{ r: 5, fill: color2, stroke: "white", strokeWidth: 2 }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
