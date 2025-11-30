import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHabits,
  postHabit,
  deleteHabit,
  setHabitStatus,
  getTodayStatus,
  getHabitStreak
} from "../../api/axiosClient";

import HabitAnalytics from "./HabitAnalytics";
import HabitCard from "../HabitCard";

const HabitList = () => {
  const [habits, setHabits] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("good");

  const [loading, setLoading] = useState(true);
  const [habitLoading, setHabitLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const list = await getHabits();

      const enriched = await Promise.all(
        list.map(async (h) => {
          const [todayStatus, streak] = await Promise.all([
            getTodayStatus(h.id),
            getHabitStreak(h.id),
          ]);

          return {
            ...h,
            todayStatus,
            streak,
          };
        })
      );

      setHabits(enriched);
    } catch (err) {
      console.error("Error fetching habits:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (habitId, status) => {
    await setHabitStatus(habitId, status);
    loadHabits(); // refresh
  };

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      loadHabits();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { title, category, type };

    try {
      setHabitLoading(true);
      await postHabit(payload);
      setIsModalOpen(false);

      setTitle("");
      setCategory("");
      setType("good");

      loadHabits();
    } catch (error) {
      console.error("Error creating habit:", error);
    } finally {
      setHabitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-700">Loading habits...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Hero Header with 3D Effects */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">🎯</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">
                Habit Tracker
              </h1>
              <p className="text-blue-100 text-lg">
                Build better habits, one day at a time
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Habits</h2>
              <p className="text-sm text-gray-600 mt-1">
                {habits.length} active habit{habits.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Habit
            </button>
          </div>
        </div>

        {/* Habit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="cursor-pointer"
              onClick={() => navigate(`/habit/${habit.id}`)}
            >
              <HabitCard
                habit={habit}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>

        {/* Blank state */}
        {habits.length === 0 && (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl border border-slate-100">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No habits yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start building better habits today! Create your first habit to begin tracking your progress.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Create Your First Habit
            </button>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Create New Habit
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-2xl hover:bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Habit Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Read 10 pages"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Health"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="good">Good Habit</option>
                      <option value="bad">Bad Habit</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={habitLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl shadow-lg hover:shadow-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {habitLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </span>
                  ) : (
                    "Create Habit"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="max-w-7xl mx-auto">
        <HabitAnalytics habits={habits} />
      </div>
    </div>
  );
};

export default HabitList;