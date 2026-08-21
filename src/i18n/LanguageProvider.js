import { createContext, useCallback, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

export const messages = {
  en: {
    access: { description: "Use your institutional account to access laboratory reservations.", password: "Password", submit: "Sign in", submitting: "Signing in…", title: "Institutional access", username: "Institutional email" },
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
