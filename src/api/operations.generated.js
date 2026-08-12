const legacy = Object.freeze({
  login: { method: "POST", path: "/api/auth/login/", public: true },
  changePassword: { method: "POST", path: "/api/auth/cambiar-contrasena/" },
  listLabs: { method: "GET", path: "/api/labs/" },
  getLabAvailability: { method: "GET", path: "/api/labs/disponibles/" },
  listReservations: { method: "GET", path: "/api/reservas/" },
  createReservation: { method: "POST", path: "/api/reservas/" },
  getReservation: { method: "GET", path: ({ reservationId }) => `/api/reservas/${encodeURIComponent(reservationId)}/` },
  updateReservation: { method: "PUT", path: ({ reservationId }) => `/api/reservas/${encodeURIComponent(reservationId)}/modificar/` },
  cancelReservation: { method: "PATCH", path: ({ reservationId }) => `/api/reservas/${encodeURIComponent(reservationId)}/cancelar/` },
});

const v2 = Object.freeze({
  ...Object.fromEntries(Object.entries(legacy).map(([id, operation]) => [id, {
    ...operation,
    path: typeof operation.path === "string"
      ? operation.path.replace("/api/", "/api/v2/")
      : (params) => operation.path(params).replace("/api/", "/api/v2/"),
  }])),
  login: { method: "POST", path: "/api/v2/auth/login/", public: true },
  refreshSession: { method: "POST", path: "/api/v2/auth/refresh/", public: true },
  logout: { method: "POST", path: "/api/v2/auth/logout/" },
  getCurrentUser: { method: "GET", path: "/api/v2/auth/me/" },
  changePassword: { method: "POST", path: "/api/v2/auth/change-password/" },
});

export const operationsByProfile = Object.freeze({ legacy, v2 });
