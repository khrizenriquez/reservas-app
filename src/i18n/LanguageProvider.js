import { createContext, useCallback, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

export const messages = {
  en: {
    access: { description: "Use your institutional account to access laboratory reservations.", password: "Password", submit: "Sign in", submitting: "Signing in…", title: "Institutional access", username: "Institutional email" },
    admin: { active: "Active", conditions: "Conditions", createCondition: "Create condition", createLab: "Create laboratory", date: "Date", description: "Review published laboratories and academic conditions.", editCondition: "Edit condition", editLab: "Edit laboratory", end: "End", error: "Administration could not be loaded.", eyebrow: "INSTITUTIONAL OPERATIONS", inactive: "Inactive", lab: "Laboratory ID", labName: "Laboratory name", labs: "Laboratories", manageLogs: "Review logs", manageUsers: "Manage users", reason: "Reason", saveCondition: "Save condition", saveLab: "Save laboratory", start: "Start", title: "Administration", type: "Type" },
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
    logs: { applyPeriod: "Apply period", byModule: "Activity by module", description: "Review real institutional activity using only logs returned by Render.", empty: "There are no audit records for this user.", emptyPeriod: "There is no activity in this period.", endDate: "End date", error: "Logs could not be loaded.", eyebrow: "AUDIT ACTIVITY", invalidRange: "Enter valid dates in YYYY-MM-DD format.", invalidRangeOrder: "The end date must not precede the start date.", invalidWeek: "Enter a valid week in YYYY-MM-DD format.", load: "Load logs", metricsLabel: "Audit metrics", modules: "Modules", next: "Next", noActivity: "No activity", of: "of", page: "Page", pagination: "Log pagination", perPage: "Show", previous: "Previous", rangeMode: "Date range", records: "Audit records", requiredUser: "Enter an institutional user ID.", selectedPeriod: "Selected period", startDate: "Start date", title: "Audit logs", topAction: "Most frequent action", total: "Records", userId: "Institutional user ID", weekMode: "Week", weekOf: "Week of (YYYY-MM-DD)", weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], weeklyBand: "WEEKLY RHYTHM", weeklyChartLabel: "Activity by day", weeklyDescription: "Each bar represents audit records already returned for the selected period.", weeklyTitle: "Activity timeline" },
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
    users: { active: "Active", create: "Create user", createTitle: "Create institutional user", deactivate: "Deactivate", deactivateAsk: "This account will be inactivated:", deactivateConfirm: "Deactivate user", deactivateTitle: "Confirm deactivation", description: "Manage the institutional user directory published by Render.", empty: "There are no users to display.", error: "Users could not be loaded.", eyebrow: "INSTITUTIONAL OPERATIONS", inactive: "Inactive", lastName: "Last name", list: "Published users", name: "First name", password: "Initial password", reset: "Reset password", resetConfirm: "Set temporary password", resetTitle: "Set temporary password", role: "Role ID", save: "Save user", selfProtected: "Your own account cannot be deactivated.", temporaryPassword: "Temporary password", title: "Users", username: "Institutional email" },
    profile: { change: "Change password", description: "View your institutional identity and change only your own password.", eyebrow: "INSTITUTIONAL ACCOUNT", help: "The new password is sent directly to Render and is never stored on this device.", identity: "Institutional identity", noRole: "Institutional user", password: "New password", required: "Enter a new password.", submit: "Update password", success: "Password updated.", title: "My profile" },
    navigation: { administration: "Admin", availability: "Availability", home: "Home", profile: "Profile", reservations: "Reservations" },
    shell: { brand: "UMG · Engineering", identity: "Institutional session", portal: "Reservations" },
    states: { empty: "Nothing to show yet", error: "We could not load this information", loading: "Loading information", retry: "Try again", soon: "This workflow will arrive in its planned delivery." },
    theme: { dark: "Use dark theme", light: "Use light theme" }
  },
  es: {
    access: { description: "Usa tu cuenta institucional para acceder a las reservas de laboratorios.", password: "Contraseña", submit: "Iniciar sesión", submitting: "Accediendo…", title: "Acceso institucional", username: "Correo institucional" },
    admin: { active: "Activo", conditions: "Condiciones", createCondition: "Crear condición", createLab: "Crear laboratorio", date: "Fecha", description: "Consulta los laboratorios y condiciones académicas publicadas.", editCondition: "Modificar condición", editLab: "Modificar laboratorio", end: "Fin", error: "No pudimos cargar la administración.", eyebrow: "OPERACIÓN INSTITUCIONAL", inactive: "Inactivo", lab: "ID de laboratorio", labName: "Nombre de laboratorio", labs: "Laboratorios", manageLogs: "Consultar logs", manageUsers: "Gestionar usuarios", reason: "Motivo", saveCondition: "Guardar condición", saveLab: "Guardar laboratorio", start: "Inicio", title: "Administración", type: "Tipo" },
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
    logs: { applyPeriod: "Aplicar periodo", byModule: "Actividad por módulo", description: "Consulta la actividad institucional real usando únicamente los logs devueltos por Render.", empty: "No hay registros de auditoría para este usuario.", emptyPeriod: "No hay actividad en este periodo.", endDate: "Fecha final", error: "No pudimos cargar los logs.", eyebrow: "ACTIVIDAD DE AUDITORÍA", invalidRange: "Ingresa fechas válidas en formato AAAA-MM-DD.", invalidRangeOrder: "La fecha final no puede ser anterior a la inicial.", invalidWeek: "Ingresa una semana válida en formato AAAA-MM-DD.", load: "Cargar logs", metricsLabel: "Métricas de auditoría", modules: "Módulos", next: "Siguiente", noActivity: "Sin actividad", of: "de", page: "Página", pagination: "Paginación de logs", perPage: "Mostrar", previous: "Anterior", rangeMode: "Rango de fechas", records: "Registros de auditoría", requiredUser: "Ingresa un ID de usuario institucional.", selectedPeriod: "Periodo seleccionado", startDate: "Fecha inicial", title: "Logs de auditoría", topAction: "Acción más frecuente", total: "Registros", userId: "ID de usuario institucional", weekMode: "Semana", weekOf: "Semana de (AAAA-MM-DD)", weekdays: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"], weeklyBand: "RITMO SEMANAL", weeklyChartLabel: "Actividad por día", weeklyDescription: "Cada barra representa registros de auditoría ya devueltos para el periodo seleccionado.", weeklyTitle: "Línea de actividad" },
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
    users: { active: "Activo", create: "Crear usuario", createTitle: "Crear usuario institucional", deactivate: "Inactivar", deactivateAsk: "Esta cuenta se inactivará:", deactivateConfirm: "Inactivar usuario", deactivateTitle: "Confirmar inactivación", description: "Gestiona el directorio de usuarios institucionales publicado por Render.", empty: "No hay usuarios para mostrar.", error: "No pudimos cargar los usuarios.", eyebrow: "OPERACIÓN INSTITUCIONAL", inactive: "Inactivo", lastName: "Apellido", list: "Usuarios publicados", name: "Nombre", password: "Contraseña inicial", reset: "Restablecer contraseña", resetConfirm: "Definir contraseña temporal", resetTitle: "Definir contraseña temporal", role: "ID de rol", save: "Guardar usuario", selfProtected: "Tu propia cuenta no se puede inactivar.", temporaryPassword: "Contraseña temporal", title: "Usuarios", username: "Correo institucional" },
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
