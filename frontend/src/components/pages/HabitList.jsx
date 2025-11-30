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

import HabitAnalytics from ".//HabitAnalytics";

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
      <h2 className="text-center text-gray-500 mt-20 text-xl animate-pulse">
        Loading habits...
      </h2>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Habit Tracker
          </h1>
          <p className="text-gray-600">
            Build better habits, one day at a time
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Habits</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-medium shadow-lg"
          >
            + Add Habit
          </button>
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
          <div className="text-center py-20 opacity-80">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No habits yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start building better habits today!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg"
            >
              Create Your First Habit
            </button>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-scaleIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Create New Habit
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✖
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-gray-700 font-medium text-sm">
                    Habit Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Read 10 pages"
                    className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-700 font-medium text-sm">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Health"
                      className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-gray-700 font-medium text-sm">
                      Type
                    </label>
                    <select
                      className="w-full mt-1 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl shadow-lg font-semibold hover:shadow-xl"
                >
                  {habitLoading ? "Creating..." : "Create Habit"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Section */}
<HabitAnalytics habits={habits} />

    </div>
  );
};

export default HabitList;
