const DEFAULT_BASE_URL = "https://umg-api-django.onrender.com";

const errorMessages = {
  en: {
    "api.validation": "Review the information and try again.",
    "api.unauthorized": "Your access could not be verified.",
    "api.forbidden": "You do not have permission for this action.",
    "api.notFound": "The requested record was not found.",
    "api.conflict": "This action conflicts with the current reservation data.",
    "api.server": "The service could not complete the request. Try again shortly.",
    "api.network": "Connect to the internet and try again."
  },
  es: {
    "api.validation": "Revisa la información e inténtalo de nuevo.",
    "api.unauthorized": "No se pudo verificar tu acceso.",
    "api.forbidden": "No tienes permiso para realizar esta acción.",
    "api.notFound": "No se encontró el registro solicitado.",
    "api.conflict": "Esta acción entra en conflicto con los datos actuales de reserva.",
    "api.server": "El servicio no pudo completar la solicitud. Inténtalo pronto.",
    "api.network": "Conéctate a internet e inténtalo de nuevo."
  }
};

export class RenderApiError extends Error {
  constructor({ status = 0, code, details = null }) {
    super(code);
    this.name = "RenderApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function getRenderErrorMessage(error, locale = "es") {
  const language = locale === "en" ? "en" : "es";
  const code = error instanceof RenderApiError ? error.code : "api.network";
  return errorMessages[language][code] ?? errorMessages[language]["api.network"];
}

export function mapUser(record = {}) {
  const user = record.usuario ?? record.user ?? record.data?.usuario ?? record.data ?? record;
  return {
    id: user.UMG_ID ?? user.id,
    username: user.UMG_Usuario ?? user.username ?? user.email,
    name: user.UMG_Nombre ?? user.name,
    lastName: user.UMG_Apellido ?? user.lastName,
    roleId: user.UMG_Rol_ID ?? user.roleId ?? user.role?.id,
    roleName: user.UMG_Rol_Nombre ?? user.roleName ?? user.role?.name,
    status: user.UMG_Estado ?? user.status,
    admission: user.UMG_Ingreso ?? user.admission,
    createdAt: user.UMG_Fecha_Creacion ?? user.createdAt,
    lastAccess: user.UMG_Ultimo_Acceso ?? user.lastAccess
  };
}

export function mapLab(record = {}) {
  return {
    id: record.UMG_ID,
    name: record.UMG_Nombre,
    status: record.UMG_Estado,
    reservation: record.UMG_Reserva,
    createdAt: record.UMG_Fecha_Registro
  };
}

export function mapLabCondition(record = {}) {
  return {
    id: record.UMG_ID,
    labId: record.UMG_Lab_ID,
    labName: record.UMG_Lab_Nombre,
    date: record.UMG_Fecha,
    startTime: record.UMG_Hora_Inicio,
    endTime: record.UMG_Hora_Fin,
    type: record.UMG_Tipo,
    reason: record.UMG_Motivo,
    status: record.UMG_Estado,
    createdAt: record.UMG_Fecha_Registro
  };
}

export function mapReservation(record = {}) {
  return {
    id: record.UMG_ID,
    userId: record.UMG_User_ID,
    teacherName: record.UMG_Docente_Nombre,
    teacherEmail: record.UMG_Docente_Correo,
    labId: record.UMG_Lab_ID,
    labName: record.UMG_Lab_Nombre,
    date: record.UMG_Fecha_Reserva,
    startTime: record.UMG_Hora_Inicio,
    endTime: record.UMG_Hora_Fin,
    reason: record.UMG_Motivo,
    status: record.UMG_Estado,
    createdAt: record.UMG_Fecha_Registro
  };
}

export function mapAuditLog(record = {}) {
  return {
    id: record.umg_id,
    userId: record.umg_user,
    action: record.umg_accion,
    module: record.umg_modulo,
    description: record.umg_descripcion,
    createdAt: record.umg_fecha_registro
  };
}

const omitEmpty = (record) => Object.fromEntries(
  Object.entries(record).filter(([, value]) => value !== undefined && value !== ""),
);

const mapResponse = (data, mapper) => Array.isArray(data)
  ? data.map(mapper)
  : data && typeof data === "object"
    ? mapper(data)
    : data;

const codeForStatus = (status) => {
  if (status === 400) return "api.validation";
  if (status === 401) return "api.unauthorized";
  if (status === 403) return "api.forbidden";
  if (status === 404) return "api.notFound";
  if (status === 409) return "api.conflict";
  return status >= 500 ? "api.server" : "api.network";
};

const pathId = (id) => {
  if (id === undefined || id === null || id === "") {
    throw new RenderApiError({ code: "api.validation" });
  }
  return encodeURIComponent(String(id));
};

const reservationPayload = ({ userId, labId, date, startTime, endTime, reason, requesterId } = {}) => omitEmpty({
  UMG_User_ID: userId,
  UMG_Lab_ID: labId,
  UMG_Fecha_Reserva: date,
  UMG_Hora_Inicio: startTime,
  UMG_Hora_Fin: endTime,
  UMG_Motivo: reason,
  UMG_Solicitante_ID: requesterId
});

const configuredBaseUrl = () => (
  typeof process !== "undefined" ? process.env?.EXPO_PUBLIC_API_BASE_URL : undefined
) || DEFAULT_BASE_URL;

export function createRenderApiClient({ baseUrl = configuredBaseUrl(), fetchImpl = fetch } = {}) {
  const request = async (path, { method = "GET", body, query, mapper = (value) => value } = {}) => {
    const url = new URL(path, `${baseUrl.replace(/\/+$/, "")}/`);
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    });

    let response;
    try {
      response = await fetchImpl(url, {
        method,
        credentials: "omit",
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body)
      });
    } catch {
      throw new RenderApiError({ code: "api.network" });
    }

    let data = null;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new RenderApiError({ status: response.status, code: response.ok ? "api.server" : codeForStatus(response.status) });
    }

    if (!response.ok) {
      throw new RenderApiError({ status: response.status, code: codeForStatus(response.status), details: data });
    }
    return mapResponse(data, mapper);
  };

  return {
    login: ({ username, password }) => request("/api/auth/login/", {
      method: "POST",
      body: { UMG_Usuario: username, UMG_Contrasena: password },
      mapper: mapUser
    }),
    changePassword: ({ userId, newPassword }) => request("/api/auth/cambiar-contrasena/", {
      method: "POST",
      body: { UMG_ID: userId, NuevaContrasena: newPassword },
      mapper: mapUser
    }),
    listUsers: () => request("/api/usuarios/", { mapper: mapUser }),
    createUser: ({ password, roleId, name, lastName, username }) => request("/api/usuarios/", {
      method: "POST",
      body: omitEmpty({ UMG_Contrasena: password, UMG_Rol_ID: roleId, UMG_Nombre: name, UMG_Apellido: lastName, UMG_Usuario: username }),
      mapper: mapUser
    }),
    deactivateUser: async ({ id }) => request(`/api/usuarios/${pathId(id)}/inactivar/`, { method: "PATCH", mapper: mapUser }),
    resetUserPassword: async ({ id, temporaryPassword }) => request(`/api/usuarios/${pathId(id)}/resetear-contrasena/`, {
      method: "PATCH",
      body: omitEmpty({ ContrasenaTemporal: temporaryPassword }),
      mapper: mapUser
    }),
    listLabs: () => request("/api/labs/", { mapper: mapLab }),
    createLab: ({ name }) => request("/api/labs/", { method: "POST", body: { UMG_Nombre: name }, mapper: mapLab }),
    updateLab: async ({ id, name, status }) => request(`/api/labs/${pathId(id)}/`, {
      method: "PUT",
      body: omitEmpty({ UMG_Nombre: name, UMG_Estado: status }),
      mapper: mapLab
    }),
    getLabAvailability: ({ fecha, hora_inicio: startTime, hora_fin: endTime } = {}) => request("/api/labs/disponibles/", {
      query: { fecha, hora_inicio: startTime, hora_fin: endTime },
      mapper: mapLab
    }),
    listLabConditions: () => request("/api/condiciones/", { mapper: mapLabCondition }),
    createLabCondition: ({ labId, date, startTime, endTime, type, reason }) => request("/api/condiciones/", {
      method: "POST",
      body: omitEmpty({ UMG_Lab_ID: labId, UMG_Fecha: date, UMG_Hora_Inicio: startTime, UMG_Hora_Fin: endTime, UMG_Tipo: type, UMG_Motivo: reason }),
      mapper: mapLabCondition
    }),
    updateLabCondition: async ({ id, labId, date, startTime, endTime, type, reason, status }) => request(`/api/condiciones/${pathId(id)}/`, {
      method: "PUT",
      body: omitEmpty({ UMG_Lab_ID: labId, UMG_Fecha: date, UMG_Hora_Inicio: startTime, UMG_Hora_Fin: endTime, UMG_Tipo: type, UMG_Motivo: reason, UMG_Estado: status }),
      mapper: mapLabCondition
    }),
    listReservations: ({ labId, fecha, userId } = {}) => request("/api/reservas/", {
      query: { labId, fecha, userId },
      mapper: mapReservation
    }),
    createReservation: (input) => request("/api/reservas/", { method: "POST", body: reservationPayload(input), mapper: mapReservation }),
    getReservation: async ({ id }) => request(`/api/reservas/${pathId(id)}/`, { mapper: mapReservation }),
    updateReservation: async ({ id, ...input }) => request(`/api/reservas/${pathId(id)}/modificar/`, {
      method: "PUT",
      body: reservationPayload(input),
      mapper: mapReservation
    }),
    cancelReservation: async ({ id, requesterId }) => request(`/api/reservas/${pathId(id)}/cancelar/`, {
      method: "PATCH",
      body: requesterId === undefined ? undefined : { UMG_Solicitante_ID: requesterId },
      mapper: mapReservation
    }),
    listAuditLogs: ({ userId } = {}) => request("/api/logs/", { query: { UMG_User_ID: userId }, mapper: mapAuditLog })
  };
}
