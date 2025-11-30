import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#4F46E5", // indigo
  "#16A34A", // green
  "#F59E0B", // yellow
  "#EF4444", // red
  "#0EA5E9", // blue
  "#9333EA", // purple
  "#A855F7", // violet
];

const statusColors = {
  COMPLETED: "#16A34A",
  SKIPPED: "#EF4444",
  FAILED: "#7F1D1D",
  DELAYED: "#FACC15",
  BROKEN: "#FB923C",
  PENDING: "#9CA3AF",
};

const HabitAnalytics = ({ habits }) => {
  // 1. Category Breakdown
  const categoryData = useMemo(() => {
    const freq = {};
    habits.forEach((h) => {
      freq[h.category] = (freq[h.category] || 0) + 1;
    });
    return Object.entries(freq).map(([name, value]) => ({ name, value }));
  }, [habits]);

  // 2. Good vs Bad Habits
  const typeData = useMemo(() => {
    const good = habits.filter((h) => h.type === "good").length;
    const bad = habits.filter((h) => h.type === "bad").length;

    return [
      { name: "Good", value: good },
      { name: "Bad", value: bad },
    ];
  }, [habits]);

  // 3. Best Habit (Highest Streak)
  const bestHabit = useMemo(() => {
    return habits.length
      ? habits.reduce((max, h) => (h.streak > max.streak ? h : max))
      : null;
  }, [habits]);

  // 4. Today’s Status Summary
  const statusSummary = useMemo(() => {
    const freq = {};
    habits.forEach((h) => {
      const s = h.todayStatus || "PENDING";
      freq[s] = (freq[s] || 0) + 1;
    });

    return Object.entries(freq).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || "#9CA3AF",
    }));
  }, [habits]);

  return (
    <div className="mt-12 p-6 bg-white rounded-2xl shadow-xl border border-gray-200">

      <h2 className="text-3xl font-bold text-gray-900 mb-6">📊 Habit Analytics</h2>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Category Breakdown */}
        <div className="rounded-xl p-4 border border-gray-100 shadow-md">
          <h3 className="text-lg font-semibold mb-3">Category Breakdown</h3>
          <div className="w-full h-60">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Good vs Bad */}
        <div className="rounded-xl p-4 border border-gray-100 shadow-md">
          <h3 className="text-lg font-semibold mb-3">Good vs Bad Habits</h3>
          <div className="w-full h-60">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label
                >
                  <Cell fill="#16A34A" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Habit (Streak) */}
        <div className="rounded-xl p-6 border border-gray-100 shadow-md">
          <h3 className="text-lg font-semibold mb-4">🏆 Best Habit</h3>

          {bestHabit ? (
            <>
              <p className="text-2xl font-bold text-gray-900">{bestHabit.title}</p>
              <p className="text-gray-600 mt-1">{bestHabit.category}</p>
              <p className="text-xl font-bold text-green-600 mt-2">
                🔥 {bestHabit.streak} day streak
              </p>
            </>
          ) : (
            <p className="text-gray-500">No habits yet</p>
          )}
        </div>

        {/* Today's Status Summary */}
        <div className="rounded-xl p-6 border border-gray-100 shadow-md">
          <h3 className="text-lg font-semibold mb-4">📅 Today’s Habit Status</h3>

          {statusSummary.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2">
              <span className="font-medium">{item.name}</span>
              <span
                className="px-3 py-1 rounded-full text-white font-semibold"
                style={{ backgroundColor: item.color }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HabitAnalytics;
