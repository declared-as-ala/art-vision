"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ViewsChart({ data }: { data: { day: string; views: number }[] }) {
  return (
    <div className="h-64 w-full" role="img" aria-label="Pages vues par jour">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e3e0ef" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} minTickGap={24} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
          <Tooltip cursor={{ fill: "#ecebfb" }} contentStyle={{ borderRadius: 12, border: "1px solid #e3e0ef", fontSize: 12 }} />
          <Bar dataKey="views" name="Pages vues" fill="#ba3184" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
