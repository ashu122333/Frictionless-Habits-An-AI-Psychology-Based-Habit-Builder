import React, { useState } from 'react';
import { Plus, X, Check, Trash2, Target } from 'lucide-react';
import HabitCard from '../HabitCard';

const HabitList = () => {
  const [habits, setHabits] = useState([
    { id: 1, title: 'Morning Exercise', category: 'Health', type: 'good', streak: 15, completedToday: false },
    { id: 2, title: 'Read 10 Pages', category: 'Learning', type: 'good', streak: 8, completedToday: true },
    { id: 3, title: 'Meditate', category: 'Wellness', type: 'good', streak: 3, completedToday: false },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('good');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !category) return;
    
    const newHabit = {
      id: Date.now(),
      title,
      category,
      type,
      streak: 0,
      completedToday: false
    };
    
    setHabits([...habits, newHabit]);
    setTitle('');
    setCategory('');
    setType('good');
    setIsModalOpen(false);
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { 
            ...habit, 
            completedToday: !habit.completedToday,
            streak: !habit.completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1)
          }
        : habit
    ));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Habit Tracker</h1>
          <p className="text-gray-600">Build better habits, one day at a time</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Habits</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            {/* <Plus size={20} /> */}
            + Add Habit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {habits.map(habit => (
            <HabitCard
              key={habit.id} 
              habit={habit}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />
          ))}
        </div>

        {habits.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {/* <Target size={48} className="text-gray-400" /> */}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-600 mb-6">Start building better habits today!</p>
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
                <h3 className="text-2xl font-bold text-gray-900">Create New Habit</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {/* <X size={24} /> */}
                  ❌
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Habit Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Read 10 pages"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Health"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white"
                      value={type}
                      onChange={e => setType(e.target.value)}
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
                    Create Habit
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