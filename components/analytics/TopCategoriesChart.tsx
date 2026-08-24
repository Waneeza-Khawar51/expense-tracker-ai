"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Category, CATEGORY_COLORS } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export interface TopCategoryDatum {
  category: Category;
  total: number;
  count: number;
}

interface TopCategoriesChartProps {
  data: TopCategoryDatum[];
}

export function TopCategoriesChart({ data }: TopCategoriesChartProps) {
  const height = Math.max(data.length * 44, 120);

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
        >
          <XAxis
            type="number"
            tickFormatter={(value) => formatCurrency(Number(value))}
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="category"
            width={110}
            tick={{ fontSize: 13, fill: "#334155" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "#f1f5f9" }}
            formatter={(value) => formatCurrency(Number(value))}
          />
          <Bar dataKey="total" radius={[0, 6, 6, 0]} isAnimationActive={false}>
            {data.map((entry) => (
              <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
