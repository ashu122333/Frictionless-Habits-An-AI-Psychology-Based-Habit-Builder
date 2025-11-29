import { Target, Trash2 } from "lucide-react";

const HabitCard = ({ habit, onToggle, onDelete }) => {
  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 14) return 'text-blue-600';
    if (streak >= 7) return 'text-green-600';
    return 'text-gray-600';
  };

  const getTypeColor = (type) => {
    return type === 'good' 
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
      : 'bg-rose-100 text-rose-700 border-rose-200'; 
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{habit.title}</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(habit.type)}`}>
            {habit.category}
          </span>
        </div>
        <button 
          onClick={() => onDelete(habit.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          {/* <Trash2 size={18} /> */}
          🗑️
        </button>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {/* <Target className={`${getStreakColor(habit.streak)}`} size={20} /> */}
          🎯
          <span className={`text-2xl font-bold ${getStreakColor(habit.streak)}`}>
            {habit.streak}
          </span>
          <span className="text-sm text-gray-500">day streak</span>
        </div>
        
        <button 
          onClick={() => onToggle(habit.id)}
          className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
            habit.completedToday 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {habit.completedToday ? <Check size={16} /> : null}
          {habit.completedToday ? 'Done' : 'Mark Done'}
        </button>
      </div>
    </div>
  ); 
};

export default HabitCard;