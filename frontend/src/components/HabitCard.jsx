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
  COMPLETED: "bg-green-500 text-white hover:bg-green-600",
  SKIPPED: "bg-red-400 text-white hover:bg-red-500",
  FAILED: "bg-red-700 text-white hover:bg-red-800",
  DELAYED: "bg-yellow-400 text-white hover:bg-yellow-500",
  BROKEN: "bg-orange-500 text-white hover:bg-orange-600",
  PENDING: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  ARCHIVED: "bg-transparent text-gray-500 border border-gray-300"
};

const HabitCard = ({ habit, onStatusChange, onDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const todayStatus = habit.todayStatus || "PENDING";

  const getStreakColor = (streak) => {
    if (streak >= 30) return "text-purple-600";
    if (streak >= 14) return "text-blue-600";
    if (streak >= 7) return "text-green-600";
    return "text-gray-500";
  };

  const getTypeColor = (type) =>
    type === "good"
      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
      : "bg-rose-100 text-rose-700 border border-rose-200";

  const updateStatus = (status) => {
    onStatusChange(habit.id, status);
    setDropdownOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100">

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{habit.title}</h3>

          <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(habit.type)}`}>
            {habit.category}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(habit.id);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
        >
          🗑️
        </button>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">

        {/* Streak */}
        <div className="flex items-center gap-2">
          🔥
          <span className={`text-2xl font-bold ${getStreakColor(habit.streak)}`}>
            {habit.streak}
          </span>
          <span className="text-sm text-gray-500">day streak</span>
        </div>

        {/* Status Controls */}
        <div className="relative flex items-center gap-2">

          {/* Main Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateStatus("COMPLETED");
            }}
            className={`px-4 py-2 rounded-xl font-medium ${statusStyles[todayStatus]} transition-all`}
          >
            {statusLabel[todayStatus]}
          </button>

          {/* Dropdown Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 text-gray-600"
          >
            ▼
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-12 right-0 bg-white shadow-xl border border-gray-200 rounded-xl w-40 py-1 z-50">
              {["COMPLETED", "SKIPPED", "FAILED", "DELAYED", "BROKEN", "PENDING"].map(
                (status) => (
                  <div
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(status);
                    }}
                    className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {statusLabel[status]}
                  </div>
                )
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HabitCard;
