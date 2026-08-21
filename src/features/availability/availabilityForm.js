const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function isIsoDate(value) {
  if (!datePattern.test(value ?? "")) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function isTime(value) {
  return timePattern.test(value ?? "");
}

export function validateAvailabilityCriteria({ date, endTime, startTime }) {
  if (!isIsoDate(date)) return "availability.invalidDate";
  if (!isTime(startTime) || !isTime(endTime)) return "availability.invalidTime";
  if (startTime >= endTime) return "availability.invalidInterval";
  return null;
}
