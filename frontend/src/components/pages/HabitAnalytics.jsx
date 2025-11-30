import React, { useMemo } from "react";

const COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
  "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"
];

const statusColors = {
  COMPLETED: "#10B981",
  SKIPPED: "#F59E0B",
  FAILED: "#EF4444",
  DELAYED: "#FBBF24",
  BROKEN: "#FB923C",
  PENDING: "#94A3B8",
};

const HabitAnalytics = ({ habits = [] }) => {
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
    const total = good + bad || 1;
    return { good, bad, goodPercent: Math.round((good / total) * 100) };
  }, [habits]);

  // 3. Best Habit (Highest Streak)
  const bestHabit = useMemo(() => {
    return habits.length
      ? habits.reduce((max, h) => (h.streak > max.streak ? h : max))
      : null;
  }, [habits]);

  // 4. Today's Status Summary
  const statusSummary = useMemo(() => {
    const freq = {};
    habits.forEach((h) => {
      const s = h.todayStatus || "PENDING";
      freq[s] = (freq[s] || 0) + 1;
    });

    return Object.entries(freq).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || "#94A3B8",
    }));
  }, [habits]);

  // Custom Donut Chart
  const DonutChart = ({ data, centerText }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="relative w-full h-64 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const radius = 70;
            const circumference = 2 * Math.PI * radius;
            const strokeDasharray = `${(angle / 360) * circumference} ${circumference}`;
            const rotation = currentAngle;
            currentAngle += angle;

            return (
              <circle
                key={index}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={COLORS[index % COLORS.length]}
                strokeWidth="28"
                strokeDasharray={strokeDasharray}
                strokeDashoffset="0"
                transform={`rotate(${rotation} 100 100)`}
                className="transition-all duration-500 hover:stroke-width-32"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800">{total}</div>
            <div className="text-sm text-gray-500 font-medium">{centerText}</div>
          </div>
        </div>
      </div>
    );
  };

  // Progress Ring
  const ProgressRing = ({ percentage, color, size = 160 }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 140 140" className="transform -rotate-90">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Header with 3D effect */}
      <div className="relative bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-4xl">📊</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-1">Habit Analytics</h2>
            <p className="text-blue-100">Visualize your progress and patterns</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Category Breakdown - Creative Donut */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Category Distribution</h3>
          </div>
          
          <DonutChart data={categoryData} centerText="Categories" />
          
          <div className="mt-6 space-y-2">
            {categoryData.map((item, index) => {
              const total = categoryData.reduce((sum, d) => sum + d.value, 0);
              const percent = Math.round((item.value / total) * 100);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-linear-to-r from-slate-50 to-transparent rounded-xl hover:from-slate-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-semibold text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{percent}%</span>
                    <span className="px-3 py-1 bg-slate-200 rounded-full text-sm font-bold text-gray-700">
                      {item.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Good vs Bad with Progress Ring */}
        <div className="lg:col-span-4 bg-linear-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl p-6 shadow-xl border border-emerald-200 hover:shadow-2xl transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">⚖️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Good vs Bad</h3>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <ProgressRing percentage={typeData.goodPercent} color="#10B981" />
            
            <div className="mt-6 w-full space-y-3">
              <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur rounded-2xl shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="font-bold text-gray-700">Good Habits</span>
                </div>
                <span className="text-2xl font-bold text-emerald-600">{typeData.good}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur rounded-2xl shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-bold text-gray-700">Bad Habits</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{typeData.bad}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Best Habit - Premium Card */}
        <div className="lg:col-span-3 bg-linear-to-br from-amber-400 via-orange-500 to-red-500 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🏆</span>
              <h3 className="text-lg font-bold text-white">Best Streak</h3>
            </div>

            {bestHabit ? (
              <div className="space-y-4">
                <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30">
                  <p className="text-xl font-bold text-white mb-1">{bestHabit.title}</p>
                  <span className="text-sm text-white/80 font-medium">{bestHabit.category}</span>
                </div>
                
                <div className="flex items-center justify-center gap-3 p-6 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30">
                  <span className="text-5xl">🔥</span>
                  <div>
                    <p className="text-4xl font-black text-white">{bestHabit.streak}</p>
                    <p className="text-sm text-white/90 font-semibold">days strong</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/80 text-lg">No habits yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Status - Modern Cards */}
        <div className="lg:col-span-12 bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Today's Activity</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statusSummary.length > 0 ? (
              statusSummary.map((item, i) => (
                <div 
                  key={i} 
                  className="relative group overflow-hidden rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  style={{ 
                    background: `linear-gradient(135deg, ${item.color}dd, ${item.color})`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <p className="text-sm font-semibold text-white/90 mb-2">{item.name}</p>
                    <p className="text-4xl font-black text-white">{item.value}</p>
                    <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${(item.value / habits.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No status data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitAnalytics;
