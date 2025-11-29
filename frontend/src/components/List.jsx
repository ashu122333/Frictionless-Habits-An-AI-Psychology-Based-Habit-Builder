import React, { useEffect, useState } from "react";
import { deleteHabit, getHabits } from "../api/axiosClient";
import CreateHabit from "./CreateHabit";

const List = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id);
      loadHabits(); // refresh list
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading)
    return (
      <h2 className="text-center text-gray-500 mt-20 text-xl animate-pulse">
        Loading habits...
      </h2>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      {/* Title Section */}
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Your Habits
      </h1>

      {/* Habit Cards */}
      <div className="grid sm:grid-cols-2 gap-6">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="p-5 bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all"
          >
            {/* Category */}
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-600">
              {habit.category || "Uncategorized"}
            </span>

            {/* Title */}
            <h2 className="mt-3 text-xl font-semibold text-gray-800">
              {habit.title}
            </h2>

            {/* Created Date */}
            <p className="text-sm text-gray-500 mt-1">
              Created: {habit.createdAt?.split("T")[0]}
            </p>

            {/* Type Tag */}
            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-white text-sm ${
                habit.type === "good"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {habit.type?.toUpperCase()}
            </span>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(habit.id)}
              className="mt-4 w-full py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 active:scale-95 transition-all"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Create Section */}
      <div className="mt-8">
        <CreateHabit onHabitCreated={loadHabits} />
      </div>
    </div>
  );
};

export default List;
