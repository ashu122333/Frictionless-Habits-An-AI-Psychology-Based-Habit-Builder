import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getHabits,
  getHabitCalendar,
  getHabitStreak,
  completeHabit,
  skipHabit,
  getTodayStatus,
  setHabitStatus,
} from "../api/axiosClient";

import HabitCalendar from "./HabitCalendar";

const statusStyles = {
  COMPLETED: "bg-gradient-to-r from-teal-500 to-cyan-600 text-white",
  SKIPPED: "bg-gradient-to-r from-yellow-500 to-amber-600 text-white",
  FAILED: "bg-gradient-to-r from-rose-500 to-pink-600 text-white",
  DELAYED: "bg-gradient-to-r from-orange-400 to-orange-600 text-white",
  BROKEN: "bg-gradient-to-r from-red-600 to-rose-700 text-white",
  PENDING: "bg-gradient-to-r from-indigo-400 to-purple-600 text-white",
  ARCHIVED: "bg-gray-100 text-gray-500 border border-gray-300",
};

const HabitDetail = () => {
  const { habitId } = useParams();
  const navigate = useNavigate();

  const [habit, setHabit] = useState(null);
  const [logs, setLogs] = useState([]);
  const [streak, setStreak] = useState(0);
  const [todayStatus, setTodayStatusState] = useState("PENDING");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const loadData = async () => {
    const allHabits = await getHabits();
    setHabit(allHabits.find(h => h.id === parseInt(habitId)));

    setLogs(await getHabitCalendar(habitId));
    setStreak(await getHabitStreak(habitId));
    setTodayStatusState(await getTodayStatus(habitId));
  };

  useEffect(() => {
    loadData();
  }, []);

const updateStatus = async (status) => {
  // 1️⃣ Store previous status for rollback
  const prevStatus = todayStatus;

  // 2️⃣ Optimistically update UI immediately
  setTodayStatusState(status);
  setDropdownOpen(false);

  try {
    // 3️⃣ Send to backend in background
    await setHabitStatus(habitId, status);

    // 4️⃣ Optionally refetch logs or streak (if needed)
    const updatedLogs = await getHabitCalendar(habitId);
    const updatedStreak = await getHabitStreak(habitId);
    setLogs(updatedLogs);
    setStreak(updatedStreak);

  } catch (error) {
    console.error("Failed to update habit status:", error);

    // 5️⃣ Rollback UI if request failed
    setTodayStatusState(prevStatus);

    // Optional: show a toast or small inline message
    alert("⚠️ Failed to update status. Please try again.");
  }
};


  const handleComplete = async () => updateStatus("COMPLETED");
  const handleSkip = async () => updateStatus("SKIPPED");

  const getStreakGradient = (streak) => {
    if (streak >= 30) return 'from-fuchsia-500 via-purple-500 to-indigo-600';
    if (streak >= 14) return 'from-cyan-500 via-sky-500 to-blue-600';
    if (streak >= 7) return 'from-lime-500 via-green-500 to-emerald-600';
    return 'from-gray-400 via-slate-500 to-zinc-600';
  };

  const getStreakBadge = (streak) => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '⭐';
    if (streak >= 7) return '💪';
    return '🌱';
  };

  if (!habit) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-700">Loading Habit...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all border border-slate-200"
        >
          <span>←</span>
          Back
        </button>

        {/* Hero Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {habit.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full font-semibold text-sm border border-cyan-200">
              {habit.category}
            </span>
            <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm border border-purple-200">
              {habit.type === 'good' ? '✅ Good Habit' : '❌ Bad Habit'}
            </span>
          </div>
        </div>

        {/* Streak Card */}
        <div className={`p-6 bg-linear-to-r ${getStreakGradient(streak)} rounded-2xl shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🔥</span>
              <div>
                <p className="text-4xl font-bold text-white">
                  {streak}
                </p>
                <p className="text-sm text-white/90 font-semibold">Day Streak</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/80 font-medium mb-1">Achievement</p>
              <p className="text-4xl font-bold text-white">
                {getStreakBadge(streak)}
              </p>
            </div>
          </div>
        </div>

        {/* Status Control Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Status</h2>
          
          <div className="flex items-center gap-3 flex-wrap">
            {/* Current Status Badge */}
            <div className={`px-5 py-2.5 rounded-xl font-semibold shadow-md ${statusStyles[todayStatus]}`}>
              {todayStatus === "PENDING" ? "⏳ Pending Today" : `${todayStatus}`}
            </div>

            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl shadow-md transition-all"
              >
                Change Status ▼
              </button>

              {dropdownOpen && (
                <div className="absolute z-20 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-slideDown">
                  {["COMPLETED", "SKIPPED", "FAILED", "DELAYED", "BROKEN", "PENDING"].map(status => (
                    <div
                      key={status}
                      className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm font-semibold text-gray-700 transition-all"
                      onClick={() => updateStatus(status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Activity Calendar</h2>
          <HabitCalendar logs={logs} />
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

export default HabitDetail;