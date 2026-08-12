const dateFormatter = new Intl.DateTimeFormat("es-GT", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-GT", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function toIsoDate(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function dateAfter(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function apiTime(value) {
  return value && value.length === 5 ? `${value}:00` : value;
}

export function shortTime(value) {
  return value ? value.slice(0, 5) : "--:--";
}

export function humanDate(value) {
  if (!value) return "Fecha pendiente";
  return dateFormatter.format(new Date(`${value}T12:00:00`));
}

export function humanDateTime(value) {
  if (!value) return "Fecha pendiente";
  return dateTimeFormatter.format(new Date(value));
}

export function statusLabel(value) {
  return {
    ACTIVE: "Activa",
    CANCELLED: "Cancelada",
    COMPLETED: "Completada",
  }[value] || value;
}
