import { createContext, useCallback, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

export const messages = {
  en: {
    access: { description: "Use your institutional account to access laboratory reservations.", password: "Password", submit: "Sign in", submitting: "Signing in…", title: "Institutional access", username: "Institutional email" },
    availability: { available: "Available", date: "Date", datePlaceholder: "YYYY-MM-DD", description: "Find free laboratories for your class schedule.", empty: "No laboratories are available for that time.", end: "End time", error: "Availability could not be loaded.", eyebrow: "PLANNING", formatHint: "Use YYYY-MM-DD and 24-hour HH:MM time.", invalidDate: "Enter a valid date in YYYY-MM-DD format.", invalidInterval: "The end time must be later than the start time.", invalidTime: "Enter valid times in HH:MM format.", list: "Available laboratories", reserve: "Reserve this laboratory", searching: "Checking availability…", start: "Start time", submit: "Search availability", timePlaceholder: "HH:MM", title: "Availability" },
    common: { close: "Close", loading: "Loading…", signOut: "Sign out" },
    connection: { offline: "Offline. Changes stay disabled until you reconnect.", stale: "Showing previously read information. Refresh when you reconnect." },
    language: { en: "EN", es: "ES", label: "Language" },
    landing: {
      access: "Institutional access",
      description: "Plan the practical learning space your class needs, directly from your phone.",
      eyebrow: "ACADEMIC OPERATIONS",
      labs: ["Programming studio", "Networks room", "Project workshop"],
      process: ["Choose a time", "Find a free room", "Confirm the class reason"],
      processTitle: "One academic rhythm",
      title: "The right laboratory, at the right hour."
    },
    home: {
      adminTitle: "Institutional horizon",
      availability: "Check availability",
      error: "Reservations could not be loaded.",
      greeting: "Your academic day",
      noReservations: "There are no upcoming reservations for this view.",
      professorTitle: "Your next laboratory sessions",
      refresh: "Refresh reservations",
      upcoming: "Upcoming reservations"
    },
    reservations: { assigned: "Assigned institutional user", cancel: "Cancel", cancelAsk: "This reservation will be cancelled. Continue?", cancelTitle: "Confirm cancellation", cancelled: "Reservation cancelled.", confirm: "Confirm reservation", created: "Reservation created.", createTitle: "Create reservation", date: "Date", description: "Review published reservations and keep your next laboratory session current.", detail: "View details", detailTitle: "Reservation details", edit: "Edit", editTitle: "Edit reservation", empty: "There are no reservations for these filters.", end: "End", error: "Reservations could not be loaded.", eyebrow: "ACADEMIC OPERATIONS", filter: "Apply filters", filterDate: "Filter date", filterLab: "Laboratory ID", invalidDate: "Enter a valid date in YYYY-MM-DD format.", invalidId: "Enter a valid laboratory and user ID.", invalidInterval: "The end time must be later than the start time.", invalidPast: "Reservations can only be scheduled for a future date.", invalidReason: "Enter the class reason.", invalidTime: "Enter valid times in HH:MM format.", lab: "Laboratory ID", list: "Published reservations", new: "New reservation", pending: "Pending", reason: "Class reason", save: "Save changes", start: "Start", title: "Reservations", updated: "Reservation updated.", userId: "Requesting user ID" },
    profile: { change: "Change password", description: "View your institutional identity and change only your own password.", eyebrow: "INSTITUTIONAL ACCOUNT", help: "The new password is sent directly to Render and is never stored on this device.", identity: "Institutional identity", noRole: "Institutional user", password: "New password", required: "Enter a new password.", submit: "Update password", success: "Password updated.", title: "My profile" },
    navigation: { administration: "Admin", availability: "Availability", home: "Home", profile: "Profile", reservations: "Reservations" },
    shell: { brand: "UMG · Engineering", identity: "Institutional session", portal: "Reservations" },
    states: { empty: "Nothing to show yet", error: "We could not load this information", loading: "Loading information", retry: "Try again", soon: "This workflow will arrive in its planned delivery." },
    theme: { dark: "Use dark theme", light: "Use light theme" }
  },
  es: {
    access: { description: "Usa tu cuenta institucional para acceder a las reservas de laboratorios.", password: "Contraseña", submit: "Iniciar sesión", submitting: "Accediendo…", title: "Acceso institucional", username: "Correo institucional" },
    availability: { available: "Disponible", date: "Fecha", datePlaceholder: "AAAA-MM-DD", description: "Busca laboratorios libres para el horario de tu clase.", empty: "No hay laboratorios disponibles para ese horario.", end: "Hora de fin", error: "No pudimos cargar la disponibilidad.", eyebrow: "PLANIFICACIÓN", formatHint: "Usa fecha AAAA-MM-DD y hora de 24 horas HH:MM.", invalidDate: "Ingresa una fecha válida en formato AAAA-MM-DD.", invalidInterval: "La hora de fin debe ser posterior a la hora de inicio.", invalidTime: "Ingresa horas válidas en formato HH:MM.", list: "Laboratorios disponibles", reserve: "Reservar este laboratorio", searching: "Consultando disponibilidad…", start: "Hora de inicio", submit: "Buscar disponibilidad", timePlaceholder: "HH:MM", title: "Disponibilidad" },
    common: { close: "Cerrar", loading: "Cargando…", signOut: "Cerrar sesión" },
    connection: { offline: "Sin conexión. Los cambios siguen desactivados hasta reconectarte.", stale: "Mostrando información leída anteriormente. Actualiza al reconectarte." },
    language: { en: "EN", es: "ES", label: "Idioma" },
    landing: {
      access: "Acceso institucional",
      description: "Planifica el espacio de aprendizaje práctico que necesita tu clase, directamente desde tu teléfono.",
      eyebrow: "OPERACIÓN ACADÉMICA",
      labs: ["Estudio de programación", "Sala de redes", "Taller de proyectos"],
      process: ["Elige un horario", "Encuentra un laboratorio libre", "Confirma el motivo de clase"],
      processTitle: "Un ritmo académico claro",
      title: "El laboratorio correcto, a la hora correcta."
    },
    home: {
      adminTitle: "Horizonte institucional",
      availability: "Consultar disponibilidad",
      error: "No pudimos cargar las reservas.",
      greeting: "Tu jornada académica",
      noReservations: "No hay reservas próximas para esta vista.",
      professorTitle: "Tus próximas sesiones de laboratorio",
      refresh: "Actualizar reservas",
      upcoming: "Próximas reservas"
    },
    reservations: { assigned: "Usuario institucional asignado", cancel: "Cancelar", cancelAsk: "Esta reserva se cancelará. ¿Deseas continuar?", cancelTitle: "Confirmar cancelación", cancelled: "Reserva cancelada.", confirm: "Confirmar reserva", created: "Reserva creada.", createTitle: "Crear reserva", date: "Fecha", description: "Consulta las reservas publicadas y mantén al día tu próxima sesión de laboratorio.", detail: "Ver detalle", detailTitle: "Detalle de reserva", edit: "Modificar", editTitle: "Modificar reserva", empty: "No hay reservas para estos filtros.", end: "Fin", error: "No pudimos cargar las reservas.", eyebrow: "OPERACIÓN ACADÉMICA", filter: "Aplicar filtros", filterDate: "Filtrar fecha", filterLab: "ID de laboratorio", invalidDate: "Ingresa una fecha válida en formato AAAA-MM-DD.", invalidId: "Ingresa un ID de laboratorio y usuario válidos.", invalidInterval: "La hora de fin debe ser posterior a la hora de inicio.", invalidPast: "Las reservas solo pueden programarse para una fecha futura.", invalidReason: "Ingresa el motivo de clase.", invalidTime: "Ingresa horas válidas en formato HH:MM.", lab: "ID de laboratorio", list: "Reservas publicadas", new: "Nueva reserva", pending: "Pendiente", reason: "Motivo de clase", save: "Guardar cambios", start: "Inicio", title: "Reservas", updated: "Reserva modificada.", userId: "ID de usuario solicitante" },
    profile: { change: "Cambiar contraseña", description: "Consulta tu identidad institucional y cambia únicamente tu propia contraseña.", eyebrow: "CUENTA INSTITUCIONAL", help: "La contraseña nueva se envía directamente a Render y nunca se almacena en este dispositivo.", identity: "Identidad institucional", noRole: "Usuario institucional", password: "Nueva contraseña", required: "Ingresa una nueva contraseña.", submit: "Actualizar contraseña", success: "Contraseña actualizada.", title: "Mi perfil" },
    navigation: { administration: "Administración", availability: "Disponibilidad", home: "Inicio", profile: "Perfil", reservations: "Reservas" },
    shell: { brand: "UMG · Ingeniería", identity: "Sesión institucional", portal: "Reservas" },
    states: { empty: "Aún no hay información para mostrar", error: "No pudimos cargar esta información", loading: "Cargando información", retry: "Reintentar", soon: "Este flujo llegará en su entrega planificada." },
    theme: { dark: "Usar tema nocturno", light: "Usar tema claro" }
  }
};

export function textFor(language, key) {
  return key.split(".").reduce((value, part) => value?.[part], messages[language] ?? messages.es) ?? key;
}

export function LanguageProvider({ children, initialLanguage = "es" }) {
  const [language, setLanguage] = useState(initialLanguage === "en" ? "en" : "es");
  const t = useCallback((key) => textFor(language, key), [language]);
  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("LanguageProvider is required");
  return value;
}
