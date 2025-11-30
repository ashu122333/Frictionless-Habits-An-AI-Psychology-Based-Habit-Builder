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
  COMPLETED: "bg-green-100 text-green-700 border border-green-300",
  SKIPPED: "bg-red-100 text-red-700 border border-red-300",
  FAILED: "bg-red-200 text-red-800 border border-red-400",
  DELAYED: "bg-yellow-100 text-yellow-800 border border-yellow-400",
  BROKEN: "bg-orange-100 text-orange-800 border border-orange-300",
  PENDING: "bg-gray-100 text-gray-700 border border-gray-300",
  ARCHIVED: "bg-transparent text-gray-500 border border-gray-200",
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
    await setHabitStatus(habitId, status);
    await loadData();
    setDropdownOpen(false);
  };

  const handleComplete = async () => updateStatus("COMPLETED");
  const handleSkip = async () => updateStatus("SKIPPED");

  if (!habit) return <p className="text-center mt-10">Loading Habit...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 underline mb-4"
      >
        ← Back
      </button>

      {/* Habit Header */}
      <div className="p-6 bg-white shadow rounded-xl mb-6">
        <h1 className="text-3xl font-bold">{habit.title}</h1>
        <p className="text-gray-500">{habit.category} — {habit.type}</p>

        {/* Streak */}
        <div className="mt-4 inline-block bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-300">
          Streak: {streak} 🔥
        </div>

        {/* Today's Status */}
        <div className="mt-6 flex items-center gap-3">

          {/* Main Badge */}
          <span
            className={`px-4 py-2 rounded-xl font-semibold text-sm ${statusStyles[todayStatus]}`}
          >
            {todayStatus === "PENDING"
              ? "Pending Today"
              : `Today: ${todayStatus}`}
          </span>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl text-gray-700 font-medium"
            >
              Change Status ▾
            </button>

            {dropdownOpen && (
              <div className="absolute z-20 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg">
                {["COMPLETED", "SKIPPED", "FAILED", "DELAYED", "BROKEN", "PENDING"]
                  .map(status => (
                    <div
                      key={status}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
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

      {/* Calendar */}
      <div className="p-6 bg-white shadow rounded-xl">
        <HabitCalendar logs={logs} />
      </div>

    </div>
  );
};

export default HabitDetail;