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
