import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { ConnectivityProvider } from "../src/connectivity/ConnectivityProvider";
import { AvailabilityScreen } from "../src/features/availability/AvailabilityScreen";
import { isIsoDate, isTime, validateAvailabilityCriteria } from "../src/features/availability/availabilityForm";
import { LanguageProvider } from "../src/i18n/LanguageProvider";
import { ThemeProvider } from "../src/theme/ThemeProvider";

const mockRouter = { navigate: jest.fn() };
jest.mock("expo-router", () => ({ useRouter: () => mockRouter }));
jest.mock("@react-native-community/netinfo", () => ({ __esModule: true, default: { addEventListener: jest.fn() } }));

function Foundation({ children, online = true }) {
  return <ThemeProvider initialTheme="light"><LanguageProvider><ConnectivityProvider initialOnline={online} subscribe={() => jest.fn()}>{children}</ConnectivityProvider></LanguageProvider></ThemeProvider>;
}

async function populateValidForm() {
  await fireEvent.changeText(screen.getByLabelText("Fecha"), "2099-08-15");
  await waitFor(() => expect(screen.getByLabelText("Fecha").props.value).toBe("2099-08-15"));
  await fireEvent.changeText(screen.getByLabelText("Hora de inicio"), "08:00");
  await waitFor(() => expect(screen.getByLabelText("Hora de inicio").props.value).toBe("08:00"));
  await fireEvent.changeText(screen.getByLabelText("Hora de fin"), "09:00");
  await waitFor(() => expect(screen.getByLabelText("Hora de fin").props.value).toBe("09:00"));
}

describe("availability", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("accepts only real calendar dates and an increasing 24-hour interval", () => {
    expect(isIsoDate("2099-02-28")).toBe(true);
    expect(isIsoDate("2099-02-29")).toBe(false);
    expect(isTime("23:59")).toBe(true);
    expect(isTime("24:00")).toBe(false);
    expect(validateAvailabilityCriteria({ date: "2099-08-15", startTime: "09:00", endTime: "08:00" })).toBe("availability.invalidInterval");
    expect(validateAvailabilityCriteria({ date: "2099-08-15", startTime: "08:00", endTime: "09:00" })).toBeNull();
  });

  it("keeps invalid input local and requests only documented availability criteria", async () => {
    const api = { getLabAvailability: jest.fn() };
    await render(<Foundation><AvailabilityScreen apiFactory={() => api} /></Foundation>);

    await fireEvent.changeText(screen.getByLabelText("Fecha"), "15/08/2099");
    await fireEvent.press(screen.getByRole("button", { name: "Buscar disponibilidad" }));
    expect(await screen.findByText("Ingresa una fecha válida en formato AAAA-MM-DD.")).toBeTruthy();
    expect(api.getLabAvailability).not.toHaveBeenCalled();

    api.getLabAvailability.mockResolvedValue({ id: 4, name: "Laboratorio de redes" });
    await populateValidForm();
    await fireEvent.press(screen.getByRole("button", { name: "Buscar disponibilidad" }));
    await waitFor(() => expect(api.getLabAvailability).toHaveBeenCalledWith({ fecha: "2099-08-15", hora_inicio: "08:00", hora_fin: "09:00" }));
    expect(await screen.findByText("Laboratorio de redes")).toBeTruthy();
    expect(screen.getByLabelText("Laboratorios disponibles")).toBeTruthy();
  });

  it("shows real available labs with a time rail and hands off only documented values", async () => {
    const api = { getLabAvailability: jest.fn().mockResolvedValue([{ id: 7, name: "Aula de cómputo" }]) };
    await render(<Foundation><AvailabilityScreen apiFactory={() => api} /></Foundation>);

    await populateValidForm();
    await fireEvent.press(screen.getByRole("button", { name: "Buscar disponibilidad" }));
    expect(await screen.findByLabelText("08:00 Disponible 09:00")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Reservar este laboratorio: Aula de cómputo" }));
    expect(mockRouter.navigate).toHaveBeenCalledWith({ params: { date: "2099-08-15", endTime: "09:00", labId: "7", startTime: "08:00" }, pathname: "/portal/reservations" });
  });

  it("reports empty, API failure, and offline states without making unavailable requests", async () => {
    const emptyApi = { getLabAvailability: jest.fn().mockResolvedValue([]) };
    const result = await render(<Foundation><AvailabilityScreen apiFactory={() => emptyApi} /></Foundation>);
    await populateValidForm();
    await fireEvent.press(screen.getByRole("button", { name: "Buscar disponibilidad" }));
    expect(await screen.findByText("No hay laboratorios disponibles para ese horario.")).toBeTruthy();

    const failedApi = { getLabAvailability: jest.fn().mockRejectedValue({ code: "api.server" }) };
    await result.rerender(<Foundation><AvailabilityScreen apiFactory={() => failedApi} /></Foundation>);
    await populateValidForm();
    await fireEvent.press(screen.getByRole("button", { name: "Buscar disponibilidad" }));
    expect(await screen.findByText("El servicio no pudo completar la solicitud. Inténtalo pronto.")).toBeTruthy();

    const offlineApi = { getLabAvailability: jest.fn() };
    await result.rerender(<Foundation key="offline" online={false}><AvailabilityScreen apiFactory={() => offlineApi} /></Foundation>);
    expect(await screen.findByText("Sin conexión. Los cambios siguen desactivados hasta reconectarte.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Buscar disponibilidad" }));
    expect(offlineApi.getLabAvailability).not.toHaveBeenCalled();
  });

  it("keeps previously read availability visible when a refresh fails", async () => {
    const api = { getLabAvailability: jest.fn().mockResolvedValueOnce([{ id: 9, name: "Laboratorio aplicado" }]).mockRejectedValueOnce({ code: "api.server" }) };
    await render(<Foundation><AvailabilityScreen apiFactory={() => api} /></Foundation>);
    await populateValidForm();
    await fireEvent.press(screen.getByRole("button", { name: "Buscar disponibilidad" }));
    expect(await screen.findByText("Laboratorio aplicado")).toBeTruthy();

    await fireEvent.press(screen.getByRole("button", { name: "Buscar disponibilidad" }));
    expect(await screen.findByText("El servicio no pudo completar la solicitud. Inténtalo pronto.")).toBeTruthy();
    expect(screen.getByText("Laboratorio aplicado")).toBeTruthy();
  });
});
