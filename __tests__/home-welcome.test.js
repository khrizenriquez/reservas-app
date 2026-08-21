import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { ConnectivityProvider } from "../src/connectivity/ConnectivityProvider";
import { HomeDashboard } from "../src/features/home/HomeDashboard";
import { selectUpcomingReservations } from "../src/features/home/useUpcomingReservations";
import { WelcomeScreen } from "../src/features/welcome/WelcomeScreen";
import { LanguageProvider } from "../src/i18n/LanguageProvider";
import { SessionProvider } from "../src/session/SessionProvider";
import { ThemeProvider } from "../src/theme/ThemeProvider";

const mockRouter = { navigate: jest.fn() };
jest.mock("expo-router", () => ({ useRouter: () => mockRouter }));
jest.mock("@react-native-community/netinfo", () => ({ __esModule: true, default: { addEventListener: jest.fn() } }));

const storageFor = (identity = null) => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn().mockResolvedValue(identity ? JSON.stringify(identity) : null),
  setItemAsync: jest.fn()
});

function Foundation({ children, identity, online = true }) {
  return <ThemeProvider initialTheme="light"><LanguageProvider><ConnectivityProvider initialOnline={online} subscribe={() => jest.fn()}><SessionProvider storage={storageFor(identity)}>{children}</SessionProvider></ConnectivityProvider></LanguageProvider></ThemeProvider>;
}

describe("welcome and home", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("selects only future role-appropriate reservations in chronological order", () => {
    const records = [
      { id: 1, userId: 2, date: "2099-08-17", startTime: "10:00" },
      { id: 2, userId: 3, date: "2099-08-15", startTime: "08:00" },
      { id: 3, userId: 2, date: "2099-08-15", startTime: "09:00" },
      { id: 4, userId: 2, date: "2020-08-15", startTime: "08:00" }
    ];

    expect(selectUpcomingReservations(records, { isAdmin: false, userId: 2, today: "2099-08-15" }).map((item) => item.id)).toEqual([3, 1]);
    expect(selectUpcomingReservations(records, { isAdmin: true, userId: 2, today: "2099-08-15" }).map((item) => item.id)).toEqual([2, 3, 1]);
    expect(selectUpcomingReservations(null, { isAdmin: false, userId: 2, today: "2099-08-15" })).toEqual([]);
  });

  it("renders a professor summary from Render reservations and links to availability", async () => {
    const identity = { id: 2, name: "Ana Docente", email: "ana@umg.edu.gt", role: { id: 2, name: "Docente" } };
    const api = { listReservations: jest.fn().mockResolvedValue([
      { id: 1, userId: 2, labName: "Lab A", date: "2099-08-15", startTime: "08:00", endTime: "09:00", reason: "Práctica" },
      { id: 2, userId: 3, labName: "Lab B", date: "2099-08-15", startTime: "10:00", endTime: "11:00", reason: "Otra clase" }
    ]) };

    await render(<Foundation identity={identity}><HomeDashboard apiFactory={() => api} /></Foundation>);

    expect(await screen.findByText("Lab A")).toBeTruthy();
    expect(screen.queryByText("Lab B")).toBeNull();
    expect(api.listReservations).toHaveBeenCalledWith({ userId: 2 });
    await act(async () => { fireEvent.press(screen.getByRole("button", { name: "Consultar disponibilidad" })); });
    expect(mockRouter.navigate).toHaveBeenCalledWith("/portal/availability");
  });

  it("shows local empty, localized error, and offline states without inventing data", async () => {
    const identity = { id: 1, name: "Admin", email: "admin@umg.edu.gt", role: { id: 1, name: "Administrador" } };
    const emptyApi = { listReservations: jest.fn().mockResolvedValue([]) };
    const result = await render(<Foundation identity={identity}><HomeDashboard apiFactory={() => emptyApi} /></Foundation>);
    expect(await screen.findByText("Aún no hay información para mostrar")).toBeTruthy();
    expect(emptyApi.listReservations).toHaveBeenCalledWith({});

    const failedApi = { listReservations: jest.fn().mockRejectedValue({ code: "api.server" }) };
    await result.rerender(<Foundation identity={identity}><HomeDashboard apiFactory={() => failedApi} /></Foundation>);
    expect(await screen.findByText("No pudimos cargar las reservas.")).toBeTruthy();
    expect(screen.getByText("El servicio no pudo completar la solicitud. Inténtalo pronto.")).toBeTruthy();

    const offlineApi = { listReservations: jest.fn() };
    await result.rerender(<Foundation key="offline" identity={identity} online={false}><HomeDashboard apiFactory={() => offlineApi} /></Foundation>);
    expect(await screen.findByText("Sin conexión. Los cambios siguen desactivados hasta reconectarte.")).toBeTruthy();
    expect(offlineApi.listReservations).not.toHaveBeenCalled();
  });

  it("presents the public academic welcome and routes access according to restored identity", async () => {
    const guest = await render(<Foundation><WelcomeScreen /></Foundation>);
    expect(screen.getByText("El laboratorio correcto, a la hora correcta.")).toBeTruthy();
    expect(screen.getByText("Estudio de programación")).toBeTruthy();
    expect(screen.getByText("Un ritmo académico claro")).toBeTruthy();
    await act(async () => { fireEvent.press(screen.getByRole("button", { name: "Acceso institucional" })); });
    expect(mockRouter.navigate).toHaveBeenCalledWith("/access");

    const identity = { id: 2, name: "Ana", email: "ana@umg.edu.gt", role: { id: 2, name: "Docente" } };
    await guest.rerender(<Foundation identity={identity}><WelcomeScreen /></Foundation>);
    await waitFor(() => expect(screen.getByRole("button", { name: "Acceso institucional" })).toBeTruthy());
    await act(async () => { fireEvent.press(screen.getByRole("button", { name: "Acceso institucional" })); });
    expect(mockRouter.navigate).toHaveBeenCalledWith("/portal");
  });
});
