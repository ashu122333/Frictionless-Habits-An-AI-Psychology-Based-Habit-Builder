import React, { useMemo } from "react";
import ActivityHeatmap from "../ActivityHeatmap";

function aggregateMock(year) {
  // Generate demo values; replace with your API aggregation
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const out = {};
  const d = new Date(start);
  while (d <= end) {
    const y = d.toISOString().slice(0, 10);
    const lucky = Math.random();
    const good = lucky < 0.65 ? Math.floor(Math.random() * 4) : 0;
    const bad = lucky > 0.8 ? Math.floor(Math.random() * 3) : 0;
    if (good || bad) out[y] = { good, bad };
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export default function Dashboard() {
  const year = new Date().getFullYear();
  const data = useMemo(() => aggregateMock(year), [year]);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Yearly Habit Activity</h2>
      <p className="text-slate-600">
        Green = positive habits; Red = negative habits. Darker = higher intensity.
      </p>
      <ActivityHeatmap year={year} data={data} startOnMonday={false} />
    </section>
  );
}
