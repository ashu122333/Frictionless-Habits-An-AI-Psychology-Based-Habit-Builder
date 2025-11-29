import React, { useEffect, useState } from "react";
import { Plus, X, Check, Trash2, Target } from "lucide-react";
import HabitCard from "../HabitCard";
import { getHabits, postHabit, deleteHabit } from "../../api/axiosClient";

const HabitList = () => {
  const [habits, setHabits] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("good");

  const [loading, setLoading] = useState(true);
  const [habitLoading, setHabitLoading] = useState(false);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data || []);
    } catch (err) {
      console.error("Error fetching habits:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { title, category, type };

    try {
      setHabitLoading(true);
      const res = await postHabit(payload);
      console.log("Habit Created:", res);

      setTitle("");
      setCategory("");
      setType("");

      // if (onHabitCreated) onHabitCreated();
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

  const toggleHabit = (id) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completedToday: !habit.completedToday,
              streak: !habit.completedToday
                ? habit.streak + 1
                : Math.max(0, habit.streak - 1),
            }
          : habit
      )
    );
  };

  // const deleteHabit = (id) => {
  //   setHabits(habits.filter(habit => habit.id !== id));
  // };
  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      loadHabits(); // refresh list
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Habit Tracker
          </h1>
          <p className="text-gray-600">
            Build better habits, one day at a time
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Habits</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            {/* <Plus size={20} /> */}+ Add Habit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleHabit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {habits.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {/* <Target size={48} className="text-gray-400" /> */}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No habits yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start building better habits today!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 transition-all"
            >
              {/* <Plus size={20} /> */}
              Create Your First Habit
            </button>
          </div>
        )}

        {/* Add Habit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Create New Habit
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {/* <X size={24} /> */}❌
                </button>
              </div>

              <div className="space-y-5">
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
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="good">Good Habit</option>
                      <option value="bad">Bad Habit</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    {habitLoading ? (
                      <>
                        {/* <Loader2 className="h-5 w-5 animate-spin" /> */}
                        Loading...
                      </>
                    ) : (
                      "Create Habit"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitList;
