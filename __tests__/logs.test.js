import { StyleSheet } from "react-native";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import PortalLogsScreen from "../app/portal/logs";
import { ConnectivityProvider } from "../src/connectivity/ConnectivityProvider";
import { addDays, auditDateFor, inRange, mondayFor, validateAuditPeriod, weeklyEntries } from "../src/features/logs/auditPeriods";
import { LogsScreen } from "../src/features/logs/LogsScreen";
import { LanguageProvider } from "../src/i18n/LanguageProvider";
import { SessionProvider } from "../src/session/SessionProvider";
import { ThemeProvider } from "../src/theme/ThemeProvider";

jest.mock("expo-router", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return { Redirect: ({ href }) => React.createElement(Text, null, `Redirect: ${href}`) };
});
jest.mock("@react-native-community/netinfo", () => ({ __esModule: true, default: { addEventListener: jest.fn() } }));

const admin = { id: 1, name: "Admin UMG", email: "admin@umg.edu.gt", role: { id: 1, name: "Administrador" } };
const professor = { id: 7, name: "Ana Docente", email: "ana@umg.edu.gt", role: { id: 2, name: "Docente" } };
const logs = Array.from({ length: 11 }, (_, index) => ({ id: index + 1, userId: 1, action: index % 2 ? "consultar" : "crear", module: index % 2 ? "usuarios" : "reservas", description: `Registro ${index + 1}`, createdAt: "2099-08-10T08:00:00Z" }));
const storageFor = (identity) => ({ deleteItemAsync: jest.fn(), getItemAsync: jest.fn().mockResolvedValue(JSON.stringify(identity)), setItemAsync: jest.fn() });
function Foundation({ children, identity = admin, online = true }) { return <ThemeProvider initialTheme="light"><LanguageProvider><ConnectivityProvider initialOnline={online} subscribe={() => jest.fn()}><SessionProvider storage={storageFor(identity)}>{children}</SessionProvider></ConnectivityProvider></LanguageProvider></ThemeProvider>; }

describe("audit logs", () => {
  it("derives weekly periods and local ranges only from returned dates", () => {
    expect(auditDateFor({ createdAt: "2026-08-19T12:00:00Z" })).toBe("2026-08-19");
    expect(mondayFor("2026-08-19")).toBe("2026-08-17");
    expect(addDays("2026-08-17", 6)).toBe("2026-08-23");
    expect(inRange([{ createdAt: "2026-08-19" }, { createdAt: "2026-08-25" }], "2026-08-17", "2026-08-23")).toHaveLength(1);
    expect(weeklyEntries([{ createdAt: "2026-08-19" }], "2026-08-17", ["L", "M", "X", "J", "V", "S", "D"])[2]).toEqual({ count: 1, date: "2026-08-19", label: "X" });
    expect(validateAuditPeriod({ mode: "range", start: "2026-08-24", end: "2026-08-17" })).toBe("logs.invalidRangeOrder");
  });

  it("guards the direct logs route for a professor", async () => {
    await render(<Foundation identity={professor}><PortalLogsScreen /></Foundation>);
    expect(await screen.findByText("Redirect: /portal/administration")).toBeTruthy();
  });

  it("loads the documented user query and presents local metrics with pagination", async () => {
    const api = { listAuditLogs: jest.fn().mockResolvedValue(logs) };
    await render(<Foundation><LogsScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByText("reservas · Registro 1")).toBeTruthy();
    await waitFor(() => expect(api.listAuditLogs).toHaveBeenCalledWith({ userId: "1" }));
    expect(screen.getByLabelText("Métricas de auditoría")).toBeTruthy();
    expect(screen.getByLabelText(/Actividad por día/)).toBeTruthy();
    expect(StyleSheet.flatten(screen.getByRole("button", { name: "Mostrar: 10" }).props.style).minHeight).toBeGreaterThanOrEqual(44);
    expect(screen.queryByText("Registro 11")).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Siguiente" }));
    expect(await screen.findByText("reservas · Registro 11")).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText("ID de usuario institucional"), "8");
    await fireEvent.press(screen.getByRole("button", { name: "Cargar logs" }));
    await waitFor(() => expect(api.listAuditLogs).toHaveBeenLastCalledWith({ userId: "8" }));
  });

  it("validates a local period without requesting an unpublished date endpoint", async () => {
    const api = { listAuditLogs: jest.fn().mockResolvedValue(logs) };
    await render(<Foundation><LogsScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByRole("button", { name: "Rango de fechas" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Rango de fechas" }));
    await fireEvent.changeText(screen.getByLabelText("Fecha inicial"), "2099-08-11");
    await fireEvent.changeText(screen.getByLabelText("Fecha final"), "2099-08-10");
    await fireEvent.press(screen.getByRole("button", { name: "Aplicar periodo" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(api.listAuditLogs).toHaveBeenCalledTimes(1);
  });

  it("uses an explicit offline state without requesting Render", async () => {
    const api = { listAuditLogs: jest.fn() };
    await render(<Foundation online={false}><LogsScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByText(/Sin conexión\. Los cambios/)).toBeTruthy();
    expect(api.listAuditLogs).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Cargar logs" }).props.accessibilityState.disabled).toBe(true);
  });

  it("offers retry after a Render error", async () => {
    const api = { listAuditLogs: jest.fn().mockRejectedValueOnce(new Error("network")).mockResolvedValue(logs) };
    await render(<Foundation><LogsScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Reintentar" }));
    expect(await screen.findByText("reservas · Registro 1")).toBeTruthy();
    expect(api.listAuditLogs).toHaveBeenCalledTimes(2);
  });
});
