import { afterEach, describe, expect, it, jest } from "@jest/globals";

import { apiRequest, makeApiUrl } from "../src/api/client";
import { API_BASE_URL, API_PROFILE } from "../src/api/profile";
import { ApiProblem, messageForError } from "../src/api/problem";

describe("mobile API client", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("encodes availability query values", () => {
    expect(
      makeApiUrl("/api/v1/labs/availability", {
        date: "2026-08-01",
        startTime: "08:00:00",
        ignored: "",
      }),
    ).toBe(
      `${API_BASE_URL}/api/v1/labs/availability?date=2026-08-01&startTime=08%3A00%3A00`,
    );
  });

  it("adds the bearer token and serializes the request body", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        UMG_ID: 91, UMG_User_ID: 7, UMG_Lab_ID: 1, UMG_Fecha_Reserva: "2026-08-10",
        UMG_Hora_Inicio: "08:00:00", UMG_Hora_Fin: "09:00:00", UMG_Motivo: "Clase", UMG_Estado: "R",
      }),
    });

    await expect(
      apiRequest("createReservation", {
        accessToken: "access-token",
        actor: { id: 7 },
        body: { labId: 1, date: "2026-08-10", startTime: "08:00", endTime: "09:00", reason: "Clase" },
        headers: { "Idempotency-Key": "mobile-request-0001" },
      }),
    ).resolves.toEqual(expect.objectContaining({ id: 91, userId: 7, labId: 1, status: "ACTIVE" }));

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/${API_PROFILE === "v2" ? "api/v2" : "api"}/reservas/`,
      expect.objectContaining({ method: "POST", body: JSON.stringify({
        UMG_User_ID: 7, UMG_Lab_ID: 1, UMG_Fecha_Reserva: "2026-08-10",
        UMG_Hora_Inicio: "08:00", UMG_Hora_Fin: "09:00", UMG_Motivo: "Clase", UMG_Solicitante_ID: 7,
      }) }),
    );
    const requestHeaders = fetchMock.mock.calls[0][1].headers;
    expect(requestHeaders.get("Authorization")).toBe("Bearer access-token");
    expect(requestHeaders.get("Idempotency-Key")).toBe("mobile-request-0001");
  });

  it("uses stable API codes for friendly messages", () => {
    const problem = new ApiProblem(
      { code: "LAB_NOT_AVAILABLE", detail: "Localized API prose" },
      409,
    );
    expect(messageForError(problem)).toBe(
      "El laboratorio ya no está disponible en ese horario.",
    );
  });
});
