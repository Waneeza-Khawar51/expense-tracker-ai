"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendBucket } from "@/lib/analytics";
import { formatCurrency } from "@/lib/format";

interface SpendingTrendChartProps {
  buckets: TrendBucket[];
}

export function SpendingTrendChart({ buckets }: SpendingTrendChartProps) {
  const data = useMemo(
    () => buckets.map((b) => ({ label: b.label, total: b.total })),
    [buckets]
  );

  const average = useMemo(() => {
    if (data.length === 0) return 0;
    return data.reduce((sum, d) => sum + d.total, 0) / data.length;
  }, [data]);

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="spendingTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
            width={56}
          />
          {average > 0 && (
            <ReferenceLine
              y={average}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{
                value: `avg ${formatCurrency(average)}`,
                position: "insideTopRight",
                fontSize: 11,
                fill: "#94a3b8",
              }}
            />
          )}
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              borderRadius: 8,
              borderColor: "#e2e8f0",
              fontSize: 13,
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#spendingTrendFill)"
            isAnimationActive={false}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
