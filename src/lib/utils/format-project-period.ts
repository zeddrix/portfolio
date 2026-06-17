export function formatProjectPeriodLabel(
  startDate: string,
  endDate?: string,
  note?: string,
): string {
  const start = formatMonthYear(startDate);
  const end = endDate ? formatMonthYear(endDate) : "present";
  const range = `${start} – ${end}`;
  return note ? `${range} (${note})` : range;
}

function formatMonthYear(value: string): string {
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
