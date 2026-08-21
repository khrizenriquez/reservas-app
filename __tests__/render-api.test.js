import {
  createRenderApiClient,
  getRenderErrorMessage,
  mapAuditLog,
  mapLab,
  mapLabCondition,
  mapReservation,
  mapUser,
  RenderApiError
} from "../src/api/renderApi";

const response = (status, body) => ({
  ok: status < 400,
  status,
  text: async () => typeof body === "string" ? body : JSON.stringify(body)
});

const requestList = (fetchImpl) => fetchImpl.mock.calls.map(([url, options]) => ({
  path: new URL(url).pathname,
  method: options.method,
  body: options.body
}));

describe("Render v1 API client", () => {
  it("uses the Render URL, published availability filters, and no authentication header", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response(200, []));
    const client = createRenderApiClient({ baseUrl: "https://render.test/", fetchImpl });

    await client.getLabAvailability({ fecha: "2099-08-15", hora_inicio: "08:00", hora_fin: "09:00" });

    const [url, options] = fetchImpl.mock.calls[0];
    expect(url.toString()).toBe("https://render.test/api/labs/disponibles/?fecha=2099-08-15&hora_inicio=08%3A00&hora_fin=09%3A00");
    expect(options).toEqual(expect.objectContaining({ method: "GET", credentials: "omit", headers: undefined, body: undefined }));
  });

  it("maps every resource response to native UI records", async () => {
    expect(mapUser({ UMG_ID: 1, UMG_Usuario: "ana@umg.edu.gt", UMG_Nombre: "Ana", UMG_Apellido: "López", UMG_Rol_ID: 2, UMG_Rol_Nombre: "Docente", UMG_Estado: 1, UMG_Ingreso: 1, UMG_Fecha_Creacion: "2026-01-01", UMG_Ultimo_Acceso: "2026-01-02" }))
      .toEqual(expect.objectContaining({ id: 1, username: "ana@umg.edu.gt", roleName: "Docente" }));
    expect(mapLab({ UMG_ID: 2, UMG_Nombre: "Lab A", UMG_Estado: 1, UMG_Reserva: "Libre", UMG_Fecha_Registro: "2026-01-01" }))
      .toEqual({ id: 2, name: "Lab A", status: 1, reservation: "Libre", createdAt: "2026-01-01" });
    expect(mapLabCondition({ UMG_ID: 3, UMG_Lab_ID: 2, UMG_Lab_Nombre: "Lab A", UMG_Fecha: "2099-08-15", UMG_Hora_Inicio: "08:00", UMG_Hora_Fin: "09:00", UMG_Tipo: "Clase", UMG_Motivo: "Práctica", UMG_Estado: 1, UMG_Fecha_Registro: "2026-01-01" }))
      .toEqual(expect.objectContaining({ id: 3, labId: 2, type: "Clase" }));
    expect(mapReservation({ UMG_ID: 4, UMG_User_ID: 1, UMG_Docente_Nombre: "Ana", UMG_Docente_Correo: "ana@umg.edu.gt", UMG_Lab_ID: 2, UMG_Lab_Nombre: "Lab A", UMG_Fecha_Reserva: "2099-08-15", UMG_Hora_Inicio: "08:00", UMG_Hora_Fin: "09:00", UMG_Motivo: "Examen", UMG_Estado: "Activa", UMG_Fecha_Registro: "2026-01-01" }))
      .toEqual(expect.objectContaining({ id: 4, userId: 1, labName: "Lab A", reason: "Examen" }));
    expect(mapAuditLog({ umg_id: 5, umg_user: 1, umg_accion: "crear", umg_modulo: "reservas", umg_descripcion: "Reserva creada", umg_fecha_registro: "2026-01-01" }))
      .toEqual({ id: 5, userId: 1, action: "crear", module: "reservas", description: "Reserva creada", createdAt: "2026-01-01" });
    expect(mapUser({ data: { usuario: { UMG_ID: 6, UMG_Usuario: "nested@umg.edu.gt", UMG_Rol_Nombre: "Administrador" } } }))
      .toEqual(expect.objectContaining({ id: 6, username: "nested@umg.edu.gt", roleName: "Administrador" }));
  });

  it("sends every published mutation with its Render body and maps its response", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response(200, { UMG_ID: 1 }));
    const client = createRenderApiClient({ baseUrl: "https://render.test", fetchImpl });

    await client.login({ username: "ana@umg.edu.gt", password: "secret" });
    await client.changePassword({ userId: 1, newPassword: "Nueva123" });
    await client.createUser({ username: "beto@umg.edu.gt", password: "Temporal123", name: "Beto", lastName: "Díaz", roleId: 2 });
    await client.deactivateUser({ id: 7 });
    await client.resetUserPassword({ id: 7, temporaryPassword: "Temporal123" });
    await client.createLab({ name: "Lab B" });
    await client.updateLab({ id: 2, name: "Lab C", status: 0 });
    await client.createLabCondition({ labId: 2, date: "2099-08-15", startTime: "08:00", endTime: "09:00", type: "Clase", reason: "Práctica" });
    await client.updateLabCondition({ id: 3, labId: 2, date: "2099-08-16", startTime: "10:00", endTime: "11:00", type: "Bloqueo", reason: "Limpieza", status: 1 });
    await client.createReservation({ userId: 1, labId: 2, date: "2099-08-15", startTime: "08:00", endTime: "09:00", reason: "Examen" });
    await client.updateReservation({ id: 4, userId: 1, labId: 2, date: "2099-08-16", startTime: "10:00", endTime: "11:00", reason: "Examen", requesterId: 1 });
    await client.cancelReservation({ id: 4, requesterId: 1 });

    expect(requestList(fetchImpl)).toEqual(expect.arrayContaining([
      { path: "/api/auth/login/", method: "POST", body: JSON.stringify({ UMG_Usuario: "ana@umg.edu.gt", UMG_Contrasena: "secret" }) },
      { path: "/api/auth/cambiar-contrasena/", method: "POST", body: JSON.stringify({ UMG_ID: 1, NuevaContrasena: "Nueva123" }) },
      { path: "/api/usuarios/", method: "POST", body: JSON.stringify({ UMG_Contrasena: "Temporal123", UMG_Rol_ID: 2, UMG_Nombre: "Beto", UMG_Apellido: "Díaz", UMG_Usuario: "beto@umg.edu.gt" }) },
      { path: "/api/usuarios/7/inactivar/", method: "PATCH", body: undefined },
      { path: "/api/usuarios/7/resetear-contrasena/", method: "PATCH", body: JSON.stringify({ ContrasenaTemporal: "Temporal123" }) },
      { path: "/api/labs/", method: "POST", body: JSON.stringify({ UMG_Nombre: "Lab B" }) },
      { path: "/api/labs/2/", method: "PUT", body: JSON.stringify({ UMG_Nombre: "Lab C", UMG_Estado: 0 }) },
      { path: "/api/condiciones/", method: "POST", body: JSON.stringify({ UMG_Lab_ID: 2, UMG_Fecha: "2099-08-15", UMG_Hora_Inicio: "08:00", UMG_Hora_Fin: "09:00", UMG_Tipo: "Clase", UMG_Motivo: "Práctica" }) },
      { path: "/api/condiciones/3/", method: "PUT", body: JSON.stringify({ UMG_Lab_ID: 2, UMG_Fecha: "2099-08-16", UMG_Hora_Inicio: "10:00", UMG_Hora_Fin: "11:00", UMG_Tipo: "Bloqueo", UMG_Motivo: "Limpieza", UMG_Estado: 1 }) },
      { path: "/api/reservas/", method: "POST", body: JSON.stringify({ UMG_User_ID: 1, UMG_Lab_ID: 2, UMG_Fecha_Reserva: "2099-08-15", UMG_Hora_Inicio: "08:00", UMG_Hora_Fin: "09:00", UMG_Motivo: "Examen" }) },
      { path: "/api/reservas/4/modificar/", method: "PUT", body: JSON.stringify({ UMG_User_ID: 1, UMG_Lab_ID: 2, UMG_Fecha_Reserva: "2099-08-16", UMG_Hora_Inicio: "10:00", UMG_Hora_Fin: "11:00", UMG_Motivo: "Examen", UMG_Solicitante_ID: 1 }) },
      { path: "/api/reservas/4/cancelar/", method: "PATCH", body: JSON.stringify({ UMG_Solicitante_ID: 1 }) }
    ]));
  });

  it("uses only documented list filters and paths", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response(200, []));
    const client = createRenderApiClient({ baseUrl: "https://render.test", fetchImpl });

    await client.listUsers();
    await client.listLabs();
    await client.listLabConditions();
    await client.listReservations({ labId: 2, fecha: "2099-08-15", userId: 1 });
    await client.getReservation({ id: "4/a" });
    await client.listAuditLogs({ userId: 1 });

    expect(fetchImpl.mock.calls.map(([url]) => url.toString())).toEqual([
      "https://render.test/api/usuarios/",
      "https://render.test/api/labs/",
      "https://render.test/api/condiciones/",
      "https://render.test/api/reservas/?labId=2&fecha=2099-08-15&userId=1",
      "https://render.test/api/reservas/4%2Fa/",
      "https://render.test/api/logs/?UMG_User_ID=1"
    ]);
  });

  it("normalizes transport, malformed response, status, and missing-id errors", async () => {
    const network = createRenderApiClient({ fetchImpl: jest.fn().mockRejectedValue(new Error("offline")) });
    await expect(network.listLabs()).rejects.toMatchObject({ name: "RenderApiError", code: "api.network", status: 0 });

    const malformed = createRenderApiClient({ fetchImpl: jest.fn().mockResolvedValue(response(200, "not-json")) });
    await expect(malformed.listLabs()).rejects.toMatchObject({ code: "api.server", status: 200 });

    const missingId = createRenderApiClient({ fetchImpl: jest.fn() });
    await expect(missingId.getReservation({})).rejects.toMatchObject({ code: "api.validation" });

    for (const [status, code] of [[400, "api.validation"], [401, "api.unauthorized"], [403, "api.forbidden"], [404, "api.notFound"], [409, "api.conflict"], [500, "api.server"]]) {
      const client = createRenderApiClient({ fetchImpl: jest.fn().mockResolvedValue(response(status, { detail: "error" })) });
      await expect(client.listLabs()).rejects.toMatchObject({ code, details: { detail: "error" } });
    }
  });

  it("provides safe localized error messages", () => {
    expect(getRenderErrorMessage(new RenderApiError({ code: "api.forbidden" }), "es")).toBe("No tienes permiso para realizar esta acción.");
    expect(getRenderErrorMessage(new RenderApiError({ code: "api.notFound" }), "en")).toBe("The requested record was not found.");
    expect(getRenderErrorMessage(new RenderApiError({ code: "api.unknown" }), "en")).toBe("Connect to the internet and try again.");
    expect(getRenderErrorMessage({ code: "api.server" }, "es")).toBe("El servicio no pudo completar la solicitud. Inténtalo pronto.");
    expect(getRenderErrorMessage(new Error("unknown"), "fr")).toBe("Conéctate a internet e inténtalo de nuevo.");
  });

  it("handles omitted optional values and valid empty Render responses", async () => {
    expect(mapUser()).toEqual(expect.objectContaining({ id: undefined, username: undefined }));
    expect(mapLab()).toEqual(expect.objectContaining({ id: undefined, name: undefined }));
    expect(mapLabCondition()).toEqual(expect.objectContaining({ id: undefined, labId: undefined }));
    expect(mapReservation()).toEqual(expect.objectContaining({ id: undefined, userId: undefined }));
    expect(mapAuditLog()).toEqual(expect.objectContaining({ id: undefined, userId: undefined }));

    const fetchImpl = jest.fn()
      .mockResolvedValueOnce({ ok: true, status: 204, text: async () => "" })
      .mockResolvedValueOnce(response(200, 7))
      .mockResolvedValueOnce(response(418, {}))
      .mockResolvedValueOnce({ ok: false, status: 401, text: async () => "not-json" });
    const client = createRenderApiClient({ fetchImpl });

    await expect(client.listReservations()).resolves.toBeNull();
    await expect(client.getLabAvailability()).resolves.toBe(7);
    await expect(client.cancelReservation({ id: 4 })).rejects.toMatchObject({ code: "api.network" });
    await expect(client.listAuditLogs()).rejects.toMatchObject({ code: "api.unauthorized", status: 401 });

    expect(fetchImpl.mock.calls[0][0].toString()).toBe("https://umg-api-django.onrender.com/api/reservas/");
    expect(fetchImpl.mock.calls[1][0].toString()).toBe("https://umg-api-django.onrender.com/api/labs/disponibles/");
    expect(requestList(fetchImpl)[2]).toEqual({ path: "/api/reservas/4/cancelar/", method: "PATCH", body: undefined });
  });
});
