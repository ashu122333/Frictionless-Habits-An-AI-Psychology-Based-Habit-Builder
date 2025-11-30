export function calendarUtils(logs) {
  const logMap = {};
  logs.forEach(log => {
    logMap[log.date] = log.status;
  });

  const today = new Date();

  // 2 previous months → startMonth = today - 2 months
  const startMonth = new Date(today.getFullYear(), today.getMonth() - 2, 1);

  // 2 next months → endMonth = today + 2 months
  const endMonth = new Date(today.getFullYear(), today.getMonth() + 3, 0);

  // Align start to Sunday
  startMonth.setDate(startMonth.getDate() - startMonth.getDay());

  const days = [];
  let current = new Date(startMonth);

  while (current <= endMonth) {
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");

    const dateKey = `${yyyy}-${mm}-${dd}`;

    days.push({
      date: dateKey,
      status: logMap[dateKey] || "PENDING",
      month: current.getMonth(),
      weekday: current.getDay(),
    });

    current.setDate(current.getDate() + 1);
  }

  // Split into weeks of 7 days
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}
