"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function LeadsChart({ data }: { data: { week: string; leads: number }[] }) {
  return (
    <div className="h-56 w-full" role="img" aria-label="Demandes de devis par semaine">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e3e0ef" />
          <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={11} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
          <Tooltip cursor={{ fill: "#ecebfb" }} contentStyle={{ borderRadius: 12, border: "1px solid #e3e0ef", fontSize: 12 }} />
          <Bar dataKey="leads" name="Demandes" fill="#ba3184" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
