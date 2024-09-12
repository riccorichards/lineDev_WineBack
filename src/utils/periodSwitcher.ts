export function periodSwitcher(inPeriod: string) {
  const now = new Date();
  let startDate: Date;

  switch (inPeriod) {
    case "day":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
      break;
    case "week":
      const firstDayOfWeek = now.getDate() - now.getDay(); // Sunday as the start of the week
      startDate = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
      break;
    default:
      throw new Error("Invalid period, must be 'day', 'week', or 'month'");
  }

  return { startDate, now };
}
