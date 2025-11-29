import React, { useMemo } from "react";

/**
 * YearHeatmap
 * Props:
 *  - year?: number              // defaults to current year
 *  - data?: Record<YYYY-MM-DD, { good?: number, bad?: number }>
 *  - maxBucket?: number         // intensity buckets (default 4)
 *  - startOnMonday?: boolean    // default false (Sunday-first)
 *
 * Example data:
 *   { "2025-01-02": { good: 2 }, "2025-01-03": { bad: 1 }, ... }
 */
export default function ActivityHeatmap({
  year = new Date().getFullYear(),
  data = {},
  maxBucket = 4,
  startOnMonday = false,
}) {
  // --- utils
  const toYMD = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate())
      .toISOString()
      .slice(0, 10);

  const startOfYear = useMemo(() => new Date(year, 0, 1), [year]);
  const endOfYear = useMemo(() => new Date(year, 11, 31), [year]);

  // Days in the year
  const days = useMemo(() => {
    const arr = [];
    const d = new Date(startOfYear);
    while (d <= endOfYear) {
      arr.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return arr;
  }, [startOfYear, endOfYear]);

  // Map day index: Sun..Sat OR Mon..Sun
  const dayIndex = (date) => {
    const raw = date.getDay(); // 0..6, 0=Sun
    return startOnMonday ? (raw + 6) % 7 : raw;
  };

  // Build weeks (columns)
  const weeks = useMemo(() => {
    const cols = [];
    let week = new Array(7).fill(null);

    // leading blanks for first week
    const firstIdx = dayIndex(days[0] || startOfYear);
    for (let i = 0; i < firstIdx; i++) week[i] = { empty: true };

    days.forEach((date, i) => {
      const di = dayIndex(date);
      week[di] = { date };

      const isLast = i === days.length - 1;
      if (di === (startOnMonday ? 6 : 6) || isLast) {
        cols.push(week);
        week = new Array(7).fill(null);
      }
    });

    // trailing blanks (if any)
    if (week.some(Boolean) && week.some((x) => x?.date || x?.empty)) {
      for (let i = 0; i < 7; i++) if (!week[i]) week[i] = { empty: true };
      cols.push(week);
    }

    return cols;
  }, [days, startOnMonday]);

  // Month labels (top)
  const monthLabels = useMemo(() => {
    // record the first column index a month appears
    const firstSeen = new Map(); // month -> column
    weeks.forEach((w, col) => {
      for (const cell of w) {
        if (cell?.date) {
          const m = cell.date.getMonth(); // 0..11
          if (!firstSeen.has(m)) firstSeen.set(m, col);
        }
      }
    });
    return Array.from(firstSeen.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([m, col]) => ({ month: m, col }));
  }, [weeks]);

  // Color scale
  const colorFor = (ymd) => {
    const v = data[ymd] || {};
    const good = Math.max(0, v.good || 0);
    const bad = Math.max(0, v.bad || 0);

    if (good === 0 && bad === 0) return "bg-slate-200/80"; // no data

    const net = good - bad;
    const magnitude = Math.abs(net);
    const bucket = Math.max(1, Math.min(maxBucket, Math.ceil(magnitude)));

    if (net > 0) {
      // greens
      switch (bucket) {
        case 1: return "bg-emerald-200";
        case 2: return "bg-emerald-400";
        case 3: return "bg-emerald-600";
        default: return "bg-emerald-700";
      }
    } else if (net < 0) {
      // reds
      switch (bucket) {
        case 1: return "bg-rose-200";
        case 2: return "bg-rose-400";
        case 3: return "bg-rose-600";
        default: return "bg-rose-700";
      }
    }
    return "bg-slate-300";
  };

  const monthName = (m) =>
    new Date(2000, m, 1).toLocaleString(undefined, { month: "short" });

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-white/70 p-5 shadow-md ring-1 ring-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {year} Activity
        </h3>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-600">
          <span>Less</span>
          <span className="h-3.5 w-3.5 rounded-md bg-slate-200/80" />
          <span className="h-3.5 w-3.5 rounded-md bg-emerald-200" />
          <span className="h-3.5 w-3.5 rounded-md bg-emerald-400" />
          <span className="h-3.5 w-3.5 rounded-md bg-emerald-600" />
          <span className="h-3.5 w-3.5 rounded-md bg-emerald-700" />
          <span className="mx-1">Good</span>
          <span className="h-3.5 w-3.5 rounded-md bg-rose-200" />
          <span className="h-3.5 w-3.5 rounded-md bg-rose-400" />
          <span className="h-3.5 w-3.5 rounded-md bg-rose-600" />
          <span className="h-3.5 w-3.5 rounded-md bg-rose-700" />
          <span>Bad</span>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Month labels row */}
        <div className="w-10" />
        <div className="relative">
          <div className="mb-1 grid auto-cols-[16px] grid-flow-col gap-1">
            {weeks.map((_, i) => {
              const label = monthLabels.find((x) => x.col === i) ;
              return (
                <div key={i} className="h-4 text-[10px] text-slate-500">
                  {label ? monthName(label.month) : ""}
                </div>
              );
            })}
          </div>

        {/* Heatmap grid */}
          <div className="flex">
            {/* Weekday labels */}
            <div className="mr-2 grid grid-rows-7 gap-1 text-[10px] text-slate-500 pt-0.5">
              {startOnMonday ? (
                <>
                  <div>Mon</div><div>Tue</div><div>Wed</div>
                  <div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
                </>
              ) : (
                <>
                  <div>Sun</div><div>Mon</div><div>Tue</div>
                  <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </>
              )}
            </div>

            {/* Squares */}
            <div className="grid grid-rows-7 grid-flow-col auto-cols-[16px] gap-1">
              {weeks.map((week, wi) =>
                week.map((cell, di) => {
  // handle nulls or empties
  if (!cell || cell.empty) {
    return (
      <div
        key={`${wi}-${di}-empty`}
        className="h-4 w-4 rounded-md bg-transparent"
      />
    );
  }

  const ymd = toYMD(cell.date);
  const v = data[ymd] || {};
  const title = `${ymd}\nGood: ${v.good || 0}\nBad: ${v.bad || 0}`;

  return (
    <div
      key={ymd}
      title={title}
      aria-label={title}
      className={`h-4 w-4 rounded-[5px] ${colorFor(
        ymd
      )} ring-1 ring-slate-900/5 hover:ring-2 hover:ring-slate-400/40 transition-shadow`}
    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
