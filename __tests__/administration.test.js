import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { ConnectivityProvider } from "../src/connectivity/ConnectivityProvider";
import { AdministrationScreen } from "../src/features/administration/AdministrationScreen";
import { LanguageProvider } from "../src/i18n/LanguageProvider";
import { SessionProvider } from "../src/session/SessionProvider";
import { ThemeProvider } from "../src/theme/ThemeProvider";

jest.mock("@react-native-community/netinfo", () => ({ __esModule: true, default: { addEventListener: jest.fn() } }));
jest.mock("expo-router", () => ({ useRouter: () => ({ push: jest.fn() }) }));
const admin = { id: 1, name: "Admin UMG", email: "admin@umg.edu.gt", role: { id: 1, name: "Administrador" } };
const teacher = { id: 2, name: "Ana Docente", email: "ana@umg.edu.gt", role: { id: 2, name: "Docente" } };
const storageFor = (identity) => ({ deleteItemAsync: jest.fn(), getItemAsync: jest.fn().mockResolvedValue(JSON.stringify(identity)), setItemAsync: jest.fn() });
function Foundation({ children, identity = admin, online = true }) { return <ThemeProvider initialTheme="light"><LanguageProvider><ConnectivityProvider initialOnline={online} subscribe={() => jest.fn()}><SessionProvider storage={storageFor(identity)}>{children}</SessionProvider></ConnectivityProvider></LanguageProvider></ThemeProvider>; }
const labs = [{ id: 2, name: "Laboratorio de redes", status: 1 }]; const conditions = [{ id: 3, labId: 2, labName: "Laboratorio de redes", date: "2099-08-15", startTime: "08:00", endTime: "09:00", type: "Clase", reason: "Práctica", status: 1 }];

describe("administration", () => {
  it("shows published labs and conditions to a professor without administrative mutations", async () => {
    const api = { listLabs: jest.fn().mockResolvedValue(labs), listLabConditions: jest.fn().mockResolvedValue(conditions) };
    await render(<Foundation identity={teacher}><AdministrationScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByText("Laboratorio de redes")).toBeTruthy();
    expect(screen.getByText("Práctica")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Crear laboratorio" })).toBeNull();
    expect(api.listLabs).toHaveBeenCalledTimes(1);
  });
  it("lets an administrator create a lab and condition through published operations", async () => {
    const api = { createLab: jest.fn().mockResolvedValue({}), createLabCondition: jest.fn().mockResolvedValue({}), listLabs: jest.fn().mockResolvedValue(labs), listLabConditions: jest.fn().mockResolvedValue(conditions) };
    await render(<Foundation><AdministrationScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByRole("button", { name: "Crear laboratorio" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Crear laboratorio" }));
    await fireEvent.changeText(screen.getByLabelText("Nombre de laboratorio"), "Laboratorio móvil");
    await waitFor(() => expect(screen.getByLabelText("Nombre de laboratorio").props.value).toBe("Laboratorio móvil"));
    await fireEvent.press(screen.getByRole("button", { name: "Guardar laboratorio" }));
    await waitFor(() => expect(api.createLab).toHaveBeenCalledWith({ name: "Laboratorio móvil" }));
    await fireEvent.press(screen.getByRole("button", { name: "Crear condición" }));
    const fields = [["ID de laboratorio", "2"], ["Fecha", "2099-08-15"], ["Inicio", "08:00"], ["Fin", "09:00"], ["Tipo", "Clase"], ["Motivo", "Mantenimiento"]];
    for (const [label, value] of fields) await fireEvent.changeText(screen.getByLabelText(label), value);
    await fireEvent.press(screen.getByRole("button", { name: "Guardar condición" }));
    await waitFor(() => expect(api.createLabCondition).toHaveBeenCalledWith({ labId: 2, date: "2099-08-15", startTime: "08:00", endTime: "09:00", type: "Clase", reason: "Mantenimiento" }));
  });
  it("updates existing laboratory and condition records", async () => {
    const api = { listLabs: jest.fn().mockResolvedValue(labs), listLabConditions: jest.fn().mockResolvedValue(conditions), updateLab: jest.fn().mockResolvedValue({}), updateLabCondition: jest.fn().mockResolvedValue({}) };
    await render(<Foundation><AdministrationScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByRole("button", { name: "Modificar laboratorio: Laboratorio de redes" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Modificar laboratorio: Laboratorio de redes" }));
    await fireEvent.changeText(screen.getByLabelText("Nombre de laboratorio"), "Laboratorio actualizado");
    await fireEvent.press(screen.getByRole("button", { name: "Guardar laboratorio" }));
    await waitFor(() => expect(api.updateLab).toHaveBeenCalledWith({ id: 2, name: "Laboratorio actualizado", status: 1 }));
    await fireEvent.press(screen.getByRole("button", { name: "Modificar condición: Clase" }));
    await fireEvent.changeText(screen.getByLabelText("Motivo"), "Práctica actualizada");
    await fireEvent.press(screen.getByRole("button", { name: "Guardar condición" }));
    await waitFor(() => expect(api.updateLabCondition).toHaveBeenCalledWith({ id: 3, labId: 2, date: "2099-08-15", startTime: "08:00", endTime: "09:00", type: "Clase", reason: "Práctica actualizada", status: 1 }));
  });
  it("blocks administrative mutations while offline", async () => {
    const api = { listLabs: jest.fn(), listLabConditions: jest.fn() };
    await render(<Foundation online={false}><AdministrationScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByText(/Sin conexión\. Los cambios/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Crear laboratorio" }).props.accessibilityState.disabled).toBe(true);
    expect(api.listLabs).not.toHaveBeenCalled();
  });
  it("shows a recoverable state when the published data cannot be loaded", async () => {
    const api = { listLabs: jest.fn().mockRejectedValueOnce(new Error("network")).mockResolvedValue(labs), listLabConditions: jest.fn().mockResolvedValue(conditions) };
    await render(<Foundation><AdministrationScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Reintentar" }));
    expect(await screen.findByText("Laboratorio de redes")).toBeTruthy();
    expect(api.listLabs).toHaveBeenCalledTimes(2);
  });
  it("does not submit incomplete administrative forms", async () => {
    const api = { createLab: jest.fn(), createLabCondition: jest.fn(), listLabs: jest.fn().mockResolvedValue(labs), listLabConditions: jest.fn().mockResolvedValue(conditions) };
    await render(<Foundation><AdministrationScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByRole("button", { name: "Crear laboratorio" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Crear laboratorio" }));
    await fireEvent.press(screen.getByRole("button", { name: "Guardar laboratorio" }));
    expect(api.createLab).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
    await fireEvent.press(screen.getByRole("button", { name: "Crear condición" }));
    await fireEvent.press(screen.getByRole("button", { name: "Guardar condición" }));
    expect(api.createLabCondition).not.toHaveBeenCalled();
  });
});
