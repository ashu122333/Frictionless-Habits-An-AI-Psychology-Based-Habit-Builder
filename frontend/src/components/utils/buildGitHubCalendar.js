export function buildGitHubCalendar(logs) {
  const logMap = {};
  logs.forEach(log => {
    logMap[log.date] = log.status;
  });

  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1); // last 12 months
  start.setDate(start.getDate() - start.getDay()); // align to Sunday

  let current = new Date(start);
  const days = [];

  while (current <= end) {
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    const dd = String(current.getDate()).padStart(2, "0");

    const key = `${yyyy}-${mm}-${dd}`;

    days.push({
      date: key,
      status: logMap[key] || "PENDING",
      month: current.getMonth(),
      day: current.getDay()
    });

    current.setDate(current.getDate() + 1);
  }

  // Convert flat list → weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}
