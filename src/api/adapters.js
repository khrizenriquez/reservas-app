const STATUS = Object.freeze({ R: "ACTIVE", C: "CANCELLED", F: "COMPLETED" });

function roleName(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "admin" || normalized === "administrador") return "ADMIN";
  if (normalized === "docente") return "TEACHER";
  return String(value || "UNKNOWN").toUpperCase();
}

export function mapUser(value) {
  return {
    id: Number(value.UMG_ID), username: value.UMG_Usuario,
    firstName: value.UMG_Nombre, lastName: value.UMG_Apellido,
    role: { id: Number(value.UMG_Rol_ID), name: roleName(value.UMG_Rol_Nombre) },
    active: Number(value.UMG_Estado ?? 1) === 1,
    mustChangePassword: Boolean(value.RequiereCambioContrasena ?? Number(value.UMG_Ingreso) === 0),
  };
}

export const mapLab = (value) => ({ id: Number(value.UMG_ID), name: value.UMG_Nombre, active: Number(value.UMG_Estado) === 1 });
export const mapReservation = (value) => ({
  id: Number(value.UMG_ID), userId: Number(value.UMG_User_ID), labId: Number(value.UMG_Lab_ID),
  labName: value.UMG_Lab_Nombre, teacherName: value.UMG_Docente_Nombre,
  date: value.UMG_Fecha_Reserva, startTime: value.UMG_Hora_Inicio, endTime: value.UMG_Hora_Fin,
  reason: value.UMG_Motivo, status: STATUS[value.UMG_Estado] || value.UMG_Estado,
  createdAt: value.UMG_Fecha_Registro,
});

const hhmm = (value) => String(value || "").slice(0, 5);

export function adaptRequest(operationId, { query = {}, body, actor, profile } = {}) {
  const nextQuery = { ...query };
  let nextBody = body === undefined ? undefined : { ...body };
  if (operationId === "login") nextBody = {
    UMG_Usuario: String(body?.username || "").trim(),
    UMG_Contrasena: body?.password || "",
  };
  else if (operationId === "changePassword") nextBody = profile === "v2"
    ? { currentPassword: body.currentPassword, newPassword: body.newPassword }
    : { UMG_ID: actor.id, NuevaContrasena: body.newPassword };
  else if (operationId === "getLabAvailability") {
    Object.assign(nextQuery, { fecha: query.date, hora_inicio: hhmm(query.startTime), hora_fin: hhmm(query.endTime) });
    delete nextQuery.date; delete nextQuery.startTime; delete nextQuery.endTime;
  } else if (operationId === "listReservations") {
    nextQuery.userId = actor?.role?.name === "ADMIN" ? query.userId : actor?.id;
    if (query.date) nextQuery.fecha = query.date;
    delete nextQuery.limit; delete nextQuery.status; delete nextQuery.dateFrom; delete nextQuery.date;
  } else if (operationId === "createReservation" || operationId === "updateReservation") {
    nextBody = {
      UMG_User_ID: actor.id, UMG_Lab_ID: body.labId, UMG_Fecha_Reserva: body.date,
      UMG_Hora_Inicio: body.startTime, UMG_Hora_Fin: body.endTime, UMG_Motivo: body.reason,
      UMG_Solicitante_ID: actor.id,
    };
  } else if (operationId === "cancelReservation") nextBody = { UMG_Solicitante_ID: actor.id };
  return { query: nextQuery, body: nextBody };
}

export function adaptResponse(operationId, payload, { profile, originalQuery = {} } = {}) {
  if (operationId === "login") return profile === "legacy" ? { user: mapUser(payload), legacy: true } : { ...payload, user: mapUser(payload.user) };
  if (operationId === "refreshSession") return { ...payload, user: mapUser(payload.user) };
  if (operationId === "getCurrentUser") return mapUser(payload);
  if (["listLabs", "getLabAvailability"].includes(operationId)) return payload.map(mapLab);
  if (operationId === "listReservations") {
    let items = payload.map(mapReservation);
    if (originalQuery.dateFrom) items = items.filter((item) => item.date >= originalQuery.dateFrom);
    if (originalQuery.status) items = items.filter((item) => item.status === originalQuery.status);
    return { items, total: items.length };
  }
  if (["createReservation", "getReservation"].includes(operationId)) return mapReservation(payload);
  return payload;
}
