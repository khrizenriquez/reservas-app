import { isIsoDate, isTime } from "../availability/availabilityForm";

const positiveId = (value) => Number.isFinite(Number(value)) && Number(value) > 0;
const today = () => new Date().toISOString().slice(0, 10);

export function canManageReservation(reservation, { isAdmin, userId, todayDate = today() }) {
  return Boolean(reservation?.date >= todayDate && (isAdmin || reservation?.userId === userId));
}

export function validateReservation(form, { isAdmin, todayDate = today() }) {
  if (!positiveId(form.labId) || (isAdmin && !positiveId(form.userId))) return "reservations.invalidId";
  if (!isIsoDate(form.date)) return "reservations.invalidDate";
  if (form.date < todayDate) return "reservations.invalidPast";
  if (!isTime(form.startTime) || !isTime(form.endTime)) return "reservations.invalidTime";
  if (form.startTime >= form.endTime) return "reservations.invalidInterval";
  if (!String(form.reason ?? "").trim()) return "reservations.invalidReason";
  return null;
}
