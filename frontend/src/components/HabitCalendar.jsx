import React from "react";
import { calendarUtils } from "./utils/calendarUtils";

const colors = {
  COMPLETED: "bg-green-500",
  SKIPPED: "bg-red-400",
  FAILED: "bg-red-700",
  DELAYED: "bg-yellow-400",
  BROKEN: "bg-orange-500",
  PENDING: "bg-transparent border border-gray-300",
  ARCHIVED: "bg-transparent"
};

// Month names
const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const todayStr = new Date().toISOString().split("T")[0];

const HabitCalendar = ({ logs }) => {
  const weeks = calendarUtils(logs);

  return (
    <div className="overflow-x-auto py-4">

      {/* Month Labels */}
      <div className="flex ml-8 mb-3">
        {weeks.map((week, idx) => {
          const showMonth =
            idx === 0 ||
            week[0].month !== weeks[idx - 1][0].month;

          return (
            <div
              key={idx}
              className="w-5 text-xs text-gray-500 text-center font-medium"
            >
              {showMonth ? months[week[0].month] : ""}
            </div>
          );
        })}
      </div>

      {/* Calendar Grid */}
      <div className="flex gap-1 p-3 bg-white rounded-xl shadow border border-gray-200">

        {weeks.map((week, wi) => {
          const isNewMonth =
            wi > 0 && week[0].month !== weeks[wi - 1][0].month;

          return (
            <div
              key={wi}
              className={`flex flex-col gap-[4px] ${
                isNewMonth ? "ml-4" : ""
              }`}
            >
              {week.map((day, di) => {
                const isToday = day.date === todayStr;

                return (
                  <div
                    key={di}
                    className={`
                      w-4 h-4 rounded-[3px]
                      ${colors[day.status]}
                      transition-all duration-200

                      hover:scale-110 hover:brightness-110
                      ${isToday ? "ring-2 ring-blue-300 ring-offset-[1px]" : ""}
                    `}
                    title={`${day.date} — ${day.status}`}
                  ></div>
                );
              })}
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default HabitCalendar;
