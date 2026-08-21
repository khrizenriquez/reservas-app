import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { ConnectivityProvider } from "../src/connectivity/ConnectivityProvider";
import { ProfileScreen } from "../src/features/profile/ProfileScreen";
import { LanguageProvider } from "../src/i18n/LanguageProvider";
import { SessionProvider } from "../src/session/SessionProvider";
import { ThemeProvider } from "../src/theme/ThemeProvider";

jest.mock("@react-native-community/netinfo", () => ({ __esModule: true, default: { addEventListener: jest.fn() } }));
const identity = { id: 7, name: "Ana Docente", email: "ana@umg.edu.gt", role: { id: 2, name: "Docente" } };
const storage = { deleteItemAsync: jest.fn(), getItemAsync: jest.fn().mockResolvedValue(JSON.stringify(identity)), setItemAsync: jest.fn() };
function Foundation({ children, online = true }) { return <ThemeProvider initialTheme="light"><LanguageProvider><ConnectivityProvider initialOnline={online} subscribe={() => jest.fn()}><SessionProvider storage={storage}>{children}</SessionProvider></ConnectivityProvider></LanguageProvider></ThemeProvider>; }
describe("profile", () => {
  it("shows only restored identity and sends a new password for that identity without storing it", async () => {
    const api = { changePassword: jest.fn().mockResolvedValue({}) };
    await render(<Foundation><ProfileScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByText("Ana Docente")).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText("Nueva contraseña"), "Nueva123");
    await fireEvent.press(screen.getByRole("button", { name: "Actualizar contraseña" }));
    await waitFor(() => expect(api.changePassword).toHaveBeenCalledWith({ userId: 7, newPassword: "Nueva123" }));
    expect(screen.getByLabelText("Nueva contraseña").props.value).toBe("");
    expect(storage.setItemAsync.mock.calls.flat().join(" ")).not.toContain("Nueva123");
  });
  it("blocks the request offline and clears password after failure", async () => {
    const offlineApi = { changePassword: jest.fn() };
    await render(<Foundation online={false}><ProfileScreen apiFactory={() => offlineApi} /></Foundation>);
    expect(await screen.findByText("Sin conexión. Los cambios siguen desactivados hasta reconectarte.")).toBeTruthy();
    expect(offlineApi.changePassword).not.toHaveBeenCalled();
  });
});
