import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { ConnectivityProvider } from "../src/connectivity/ConnectivityProvider";
import { ReservationsScreen } from "../src/features/reservations/ReservationsScreen";
import { canManageReservation, validateReservation } from "../src/features/reservations/reservationRules";
import { LanguageProvider } from "../src/i18n/LanguageProvider";
import { SessionProvider } from "../src/session/SessionProvider";
import { ThemeProvider } from "../src/theme/ThemeProvider";

let mockRouteParams = {};
jest.mock("expo-router", () => ({ useLocalSearchParams: () => mockRouteParams }));
jest.mock("@react-native-community/netinfo", () => ({ __esModule: true, default: { addEventListener: jest.fn() } }));

const professor = { id: 7, name: "Ana Docente", email: "ana@umg.edu.gt", role: { id: 2, name: "Docente" } };
const storageFor = (identity = professor) => ({ deleteItemAsync: jest.fn(), getItemAsync: jest.fn().mockResolvedValue(JSON.stringify(identity)), setItemAsync: jest.fn() });
const reservation = { id: 3, labId: 2, labName: "Redes", userId: 7, date: "2099-08-15", startTime: "08:00", endTime: "09:00", reason: "Práctica", status: "Activa" };

function Foundation({ children, online = true }) {
  return <ThemeProvider initialTheme="light"><LanguageProvider><ConnectivityProvider initialOnline={online} subscribe={() => jest.fn()}><SessionProvider storage={storageFor()}>{children}</SessionProvider></ConnectivityProvider></LanguageProvider></ThemeProvider>;
}

async function fillReservation({ reason = "Práctica" } = {}) {
  const labs = screen.getAllByLabelText("ID de laboratorio");
  await fireEvent.changeText(labs[labs.length - 1], "2");
  await fireEvent.changeText(screen.getByLabelText("Fecha"), "2099-08-15");
  await fireEvent.changeText(screen.getByLabelText("Inicio"), "08:00");
  await fireEvent.changeText(screen.getByLabelText("Fin"), "09:00");
  await fireEvent.changeText(screen.getByLabelText("Motivo de clase"), reason);
}

describe("reservations", () => {
  beforeEach(() => { mockRouteParams = {}; });

  it("allows mutation only for own future reservations and validates a future payload", () => {
    expect(canManageReservation(reservation, { isAdmin: false, userId: 7, todayDate: "2099-08-01" })).toBe(true);
    expect(canManageReservation({ ...reservation, userId: 8 }, { isAdmin: false, userId: 7, todayDate: "2099-08-01" })).toBe(false);
    expect(canManageReservation({ ...reservation, date: "2099-07-31" }, { isAdmin: true, userId: 7, todayDate: "2099-08-01" })).toBe(false);
    expect(validateReservation({ labId: "2", userId: "7", date: "2099-08-15", startTime: "09:00", endTime: "08:00", reason: "Clase" }, { isAdmin: false, todayDate: "2099-08-01" })).toBe("reservations.invalidInterval");
    expect(validateReservation({ labId: "2", userId: "7", date: "2099-08-15", startTime: "08:00", endTime: "09:00", reason: "Clase" }, { isAdmin: false, todayDate: "2099-08-01" })).toBeNull();
  });

  it("lists Render records, filters by documented parameters, and hides another professor's mutations", async () => {
    const api = { listReservations: jest.fn().mockResolvedValue([reservation, { ...reservation, id: 4, userId: 8, labName: "Cómputo" }]) };
    await render(<Foundation api={api}><ReservationsScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByText("Redes")).toBeTruthy();
    await waitFor(() => expect(api.listReservations).toHaveBeenCalledWith({}));
    expect(screen.getAllByRole("button", { name: /Modificar:/ })).toHaveLength(1);
    await fireEvent.changeText(screen.getByLabelText("ID de laboratorio"), "2");
    await fireEvent.changeText(screen.getByLabelText("Filtrar fecha"), "2099-08-15");
    await fireEvent.press(screen.getByRole("button", { name: "Aplicar filtros" }));
    await waitFor(() => expect(api.listReservations).toHaveBeenLastCalledWith({ labId: "2", fecha: "2099-08-15" }));
  });

  it("prefills from availability and creates a professor reservation with only Render fields", async () => {
    mockRouteParams = { labId: "2", date: "2099-08-15", startTime: "08:00", endTime: "09:00" };
    const api = { createReservation: jest.fn().mockResolvedValue({}), listReservations: jest.fn().mockResolvedValue([]) };
    await render(<Foundation api={api}><ReservationsScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByText("Crear reserva")).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText("Motivo de clase"), "Reserva desde disponibilidad");
    await fireEvent.press(screen.getByRole("button", { name: "Confirmar reserva" }));
    await waitFor(() => expect(api.createReservation).toHaveBeenCalledWith({ userId: 7, labId: 2, date: "2099-08-15", startTime: "08:00", endTime: "09:00", reason: "Reserva desde disponibilidad" }));
    expect(await screen.findByText("Reserva creada.")).toBeTruthy();
  });

  it("retrieves detail, modifies an own future record, and only cancels after confirmation", async () => {
    const api = { cancelReservation: jest.fn().mockResolvedValue({}), getReservation: jest.fn().mockResolvedValue(reservation), listReservations: jest.fn().mockResolvedValue([reservation]), updateReservation: jest.fn().mockResolvedValue({}) };
    await render(<Foundation api={api}><ReservationsScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByText("Redes")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Ver detalle: Redes" }));
    await waitFor(() => expect(api.getReservation).toHaveBeenCalledWith({ id: 3 }));
    expect(await screen.findByText("Detalle de reserva")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
    await fireEvent.press(screen.getByRole("button", { name: "Modificar: Redes" }));
    await fireEvent.changeText(screen.getByLabelText("Motivo de clase"), "Examen");
    await fireEvent.press(screen.getByRole("button", { name: "Guardar cambios" }));
    await waitFor(() => expect(api.updateReservation).toHaveBeenCalledWith({ id: 3, userId: 7, labId: 2, date: "2099-08-15", startTime: "08:00", endTime: "09:00", reason: "Examen", requesterId: 7 }));
    await fireEvent.press(screen.getByRole("button", { name: "Cancelar: Redes" }));
    expect(api.cancelReservation).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
    await waitFor(() => expect(api.cancelReservation).toHaveBeenCalledWith({ id: 3, requesterId: 7 }));
  });

  it("does not call Render mutations while offline", async () => {
    const api = { createReservation: jest.fn(), listReservations: jest.fn() };
    await render(<Foundation api={api} online={false}><ReservationsScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByText("Sin conexión. Los cambios siguen desactivados hasta reconectarte.")).toBeTruthy();
    expect(api.listReservations).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Nueva reserva" }).props.accessibilityState.disabled).toBe(true);
  });
});
