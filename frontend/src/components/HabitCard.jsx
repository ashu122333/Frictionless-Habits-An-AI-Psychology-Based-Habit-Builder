import React, { useState } from "react";

const statusLabel = {
  COMPLETED: "Completed",
  SKIPPED: "Skipped",
  FAILED: "Failed",
  DELAYED: "Delayed",
  BROKEN: "Broken",
  PENDING: "Mark Done",
  ARCHIVED: "Archived"
};

const statusStyles = {
  COMPLETED: "bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700",
  SKIPPED: "bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700",
  FAILED: "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700",
  DELAYED: "bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-500 hover:to-orange-700",
  BROKEN: "bg-gradient-to-r from-red-600 to-rose-700 text-white hover:from-red-700 hover:to-rose-800",
  PENDING: "bg-gradient-to-r from-indigo-400 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-700",
  ARCHIVED: "bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200"
};

const HabitCard = ({ habit, onStatusChange, onDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const todayStatus = habit.todayStatus || "PENDING";

  const getStreakGradient = (streak) => {
    if (streak >= 30) return 'from-fuchsia-500 via-purple-500 to-indigo-600';
    if (streak >= 14) return 'from-cyan-500 via-sky-500 to-blue-600';
    if (streak >= 7) return 'from-lime-500 via-green-500 to-emerald-600';
    return 'from-gray-400 via-slate-500 to-zinc-600';
  };

  const getTypeStyle = (type) =>
    type === "good"
      ? "from-teal-500 to-cyan-600"
      : "from-pink-500 to-rose-600";

  const updateStatus = (status) => {
    onStatusChange(habit.id, status);
    setDropdownOpen(false);
  };

  return (
    <div className="relative group">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
      
      <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-3xl p-6 shadow-xl border border-slate-200 transition-all">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {habit.title}
            </h3>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${getTypeStyle(habit.type)} shadow-lg`}>
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                {habit.category}
              </span>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit.id);
            }}
            className="text-gray-400 hover:text-red-500 transition-all p-2.5 hover:bg-red-50 rounded-xl hover:scale-110"
          >
            <span className="text-lg">🗑️</span>
          </button>
        </div>

        {/* Streak Display - Big and Bold */}
        <div className={`mb-5 p-6 bg-gradient-to-r ${getStreakGradient(habit.streak || 0)} rounded-2xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-5xl filter drop-shadow-lg">🔥</span>
              <div>
                <p className="text-4xl font-black text-white drop-shadow-md">
                  {habit.streak || 0}
                </p>
                <p className="text-sm text-white/90 font-semibold">Days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/80 font-medium">Current Streak</p>
              <p className="text-2xl font-bold text-white">
                {(habit.streak || 0) >= 30 ? '🏆' : (habit.streak || 0) >= 14 ? '⭐' : (habit.streak || 0) >= 7 ? '💪' : '🌱'}
              </p>
            </div>
          </div>
        </div>

        {/* Status Controls */}
        <div className="relative flex items-center gap-2">
          {/* Main Status Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateStatus("COMPLETED");
            }}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold shadow-lg ${statusStyles[todayStatus]} transition-all`}
          >
            {statusLabel[todayStatus]}
          </button>

          {/* Dropdown Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            className="px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl hover:from-slate-200 hover:to-slate-300 text-gray-700 font-bold shadow-lg transition-all"
          >
            ▼
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-14 right-0 bg-white shadow-2xl border border-slate-200 rounded-2xl w-48 py-2 z-50 animate-slideDown">
              {["COMPLETED", "SKIPPED", "FAILED", "DELAYED", "BROKEN", "PENDING"].map(
                (status) => (
                  <div
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(status);
                    }}
                    className="px-4 py-2.5 text-sm font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all text-gray-700 hover:text-gray-900"
                  >
                    {statusLabel[status]}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HabitCard;