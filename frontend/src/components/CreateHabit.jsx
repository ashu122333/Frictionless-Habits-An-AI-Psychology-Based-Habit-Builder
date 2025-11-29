import React, { useState } from "react";
import { postHabit } from "../api/axiosClient";

const CreateHabit = ({ onHabitCreated }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { title, category, type };

    try {
      setLoading(true);
      const res = await postHabit(payload);
      console.log("Habit Created:", res);

      setTitle("");
      setCategory("");
      setType("");

      if (onHabitCreated) onHabitCreated();
    } catch (error) {
      console.error("Error creating habit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white/60 backdrop-blur-md border border-gray-200 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Create New Habit
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="text-sm font-medium text-gray-600">Habit Title</label>
          <input
            type="text"
            placeholder="e.g., Study 1 hour"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Category</label>
          <input
            type="text"
            placeholder="e.g., Study, Fitness, Mindset"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Habit Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mt-1 p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          >
            <option value="">Select Type</option>
            <option value="good">Good Habit</option>
            <option value="bad">Bad Habit</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-xl text-white font-semibold shadow-md transition-all 
            ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700 active:scale-95"}`}
        >
          {loading ? "Creating..." : "Create Habit"}
        </button>
      </form>
    </div>
  );
};

export default CreateHabit;
