const FRIENDLY_MESSAGES = Object.freeze({
  AUTHENTICATION_REQUIRED: "Tu sesión finalizó. Ingresa nuevamente.",
  FORBIDDEN: "No tienes permiso para realizar esta acción.",
  IDEMPOTENCY_KEY_REUSED: "La solicitud ya fue utilizada con otros datos.",
  IDEMPOTENCY_REQUEST_IN_PROGRESS: "La reserva ya se está procesando.",
  LAB_NOT_AVAILABLE: "El laboratorio ya no está disponible en ese horario.",
  RESERVATION_CONFLICT: "El horario coincide con otra reserva.",
  RESERVATION_NOT_MODIFIABLE: "Esta reserva ya no puede modificarse.",
});

export class ApiProblem extends Error {
  constructor(problem = {}, status = 0) {
    super(problem.detail || problem.title || "La solicitud no pudo completarse.");
    this.name = "ApiProblem";
    this.status = status;
    this.code = problem.code || "UNKNOWN_API_ERROR";
    this.problem = problem;
  }
}

export function messageForError(error) {
  if (error instanceof ApiProblem) {
    return FRIENDLY_MESSAGES[error.code] || error.message;
  }
  if (error instanceof TypeError) {
    return "No fue posible conectar con el servicio. Revisa tu conexión.";
  }
  return "Ocurrió un error inesperado. Intenta nuevamente.";
}
