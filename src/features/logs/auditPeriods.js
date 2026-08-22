const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const atUtcMidday = (value) => new Date(`${value}T12:00:00Z`);
const isoFromDate = (value) => value.toISOString().slice(0, 10);

export const isIsoDate = (value) => {
  if (!isoDatePattern.test(String(value ?? ""))) return false;
  const date = atUtcMidday(value);
  return !Number.isNaN(date.valueOf()) && isoFromDate(date) === value;
};

export const auditDateFor = (log) => {
  const value = String(log?.createdAt ?? "").slice(0, 10);
  return isIsoDate(value) ? value : null;
};

export const mondayFor = (value) => {
  if (!isIsoDate(value)) return null;
  const date = atUtcMidday(value);
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return isoFromDate(date);
};

export const addDays = (value, days) => {
  const date = atUtcMidday(value);
  date.setUTCDate(date.getUTCDate() + days);
  return isoFromDate(date);
};

export const latestAuditDate = (logs) => logs.reduce((latest, log) => {
  const date = auditDateFor(log);
  return date && (!latest || date > latest) ? date : latest;
}, null);

export const inRange = (logs, start, end) => logs.filter((log) => {
  const date = auditDateFor(log);
  return date && date >= start && date <= end;
});

const countByDate = (logs) => logs.reduce((counts, log) => {
  const date = auditDateFor(log);
  if (date) counts[date] = (counts[date] ?? 0) + 1;
  return counts;
}, {});

export const weeklyEntries = (logs, monday, labels) => {
  const counts = countByDate(logs);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(monday, index);
    return { count: counts[date] ?? 0, date, label: labels[index] };
  });
};

export const rangeEntries = (logs) => Object.entries(countByDate(logs))
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([date, count]) => ({ count, date, label: date }));

export const countBy = (logs, valueFor) => logs.reduce((counts, log) => {
  const value = valueFor(log) || "—";
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});

export const validateAuditPeriod = ({ end, mode, start, week }) => {
  if (mode === "week") return isIsoDate(week) ? null : "logs.invalidWeek";
  if (!isIsoDate(start) || !isIsoDate(end)) return "logs.invalidRange";
  return start > end ? "logs.invalidRangeOrder" : null;
};
