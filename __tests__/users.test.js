import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import PortalUsersScreen from "../app/portal/users";
import { ConnectivityProvider } from "../src/connectivity/ConnectivityProvider";
import { UsersScreen } from "../src/features/users/UsersScreen";
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
const users = [
  { id: 1, name: "Admin", lastName: "UMG", username: "admin@umg.edu.gt", roleId: 1, roleName: "Administrador", status: 1 },
  { id: 7, name: "Ana", lastName: "Docente", username: "ana@umg.edu.gt", roleId: 2, roleName: "Docente", status: 1 },
  { id: 8, name: "Beto", lastName: "Inactivo", username: "beto@umg.edu.gt", roleId: 2, roleName: "Docente", status: 0 }
];

const storageFor = (identity) => ({ deleteItemAsync: jest.fn(), getItemAsync: jest.fn().mockResolvedValue(JSON.stringify(identity)), setItemAsync: jest.fn() });
function Foundation({ children, identity = admin, online = true }) {
  return <ThemeProvider initialTheme="light"><LanguageProvider><ConnectivityProvider initialOnline={online} subscribe={() => jest.fn()}><SessionProvider storage={storageFor(identity)}>{children}</SessionProvider></ConnectivityProvider></LanguageProvider></ThemeProvider>;
}

describe("users", () => {
  it("guards the direct route for a non-administrator", async () => {
    await render(<Foundation identity={professor}><PortalUsersScreen /></Foundation>);
    expect(await screen.findByText("Redirect: /portal/administration")).toBeTruthy();
  });

  it("lists Render users and protects the current administrator from deactivation", async () => {
    const api = { listUsers: jest.fn().mockResolvedValue(users) };
    await render(<Foundation><UsersScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByText("ana@umg.edu.gt")).toBeTruthy();
    expect(screen.getByText("Tu propia cuenta no se puede inactivar.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Inactivar: admin@umg.edu.gt" })).toBeNull();
    expect(screen.getByText("Inactivo")).toBeTruthy();
  });

  it("creates, resets, and deactivates another user with documented operations", async () => {
    const api = {
      createUser: jest.fn().mockResolvedValue({}), deactivateUser: jest.fn().mockResolvedValue({}), listUsers: jest.fn().mockResolvedValue(users), resetUserPassword: jest.fn().mockResolvedValue({})
    };
    await render(<Foundation><UsersScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByRole("button", { name: "Crear usuario" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Crear usuario" }));
    await fireEvent.changeText(screen.getByLabelText("Correo institucional"), "nuevo@umg.edu.gt");
    await fireEvent.changeText(screen.getByLabelText("Nombre"), "Nuevo");
    await fireEvent.changeText(screen.getByLabelText("Apellido"), "Usuario");
    await fireEvent.changeText(screen.getByLabelText("ID de rol"), "2");
    await fireEvent.changeText(screen.getByLabelText("Contraseña inicial"), "Temporal123");
    await fireEvent.press(screen.getByRole("button", { name: "Guardar usuario" }));
    await waitFor(() => expect(api.createUser).toHaveBeenCalledWith({ username: "nuevo@umg.edu.gt", password: "Temporal123", name: "Nuevo", lastName: "Usuario", roleId: 2 }));
    await fireEvent.press(screen.getByRole("button", { name: "Restablecer contraseña: ana@umg.edu.gt" }));
    await fireEvent.changeText(screen.getByLabelText("Contraseña temporal"), "NuevaTemporal123");
    await fireEvent.press(screen.getByRole("button", { name: "Definir contraseña temporal" }));
    await waitFor(() => expect(api.resetUserPassword).toHaveBeenCalledWith({ id: 7, temporaryPassword: "NuevaTemporal123" }));
    await fireEvent.press(screen.getByRole("button", { name: "Inactivar: ana@umg.edu.gt" }));
    await fireEvent.press(screen.getByRole("button", { name: "Inactivar usuario" }));
    await waitFor(() => expect(api.deactivateUser).toHaveBeenCalledWith({ id: 7 }));
  });

  it("does not request data or enable user mutations while offline", async () => {
    const api = { listUsers: jest.fn() };
    await render(<Foundation online={false}><UsersScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByText(/Sin conexión\. Los cambios/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Crear usuario" }).props.accessibilityState.disabled).toBe(true);
    expect(api.listUsers).not.toHaveBeenCalled();
  });

  it("shows a recoverable state when Render users cannot be loaded", async () => {
    const api = { listUsers: jest.fn().mockRejectedValueOnce(new Error("network")).mockResolvedValue(users) };
    await render(<Foundation><UsersScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Reintentar" }));
    expect(await screen.findByText("ana@umg.edu.gt")).toBeTruthy();
    expect(api.listUsers).toHaveBeenCalledTimes(2);
  });

  it("does not submit an incomplete new user", async () => {
    const api = { createUser: jest.fn(), listUsers: jest.fn().mockResolvedValue(users) };
    await render(<Foundation><UsersScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByRole("button", { name: "Crear usuario" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Crear usuario" }));
    await fireEvent.press(screen.getByRole("button", { name: "Guardar usuario" }));
    expect(api.createUser).not.toHaveBeenCalled();
  });

  it("clears a temporary password when a reset request fails", async () => {
    const api = { listUsers: jest.fn().mockResolvedValue(users), resetUserPassword: jest.fn().mockRejectedValue(new Error("network")) };
    await render(<Foundation><UsersScreen apiFactory={() => api} /></Foundation>);
    expect(await screen.findByRole("button", { name: "Restablecer contraseña: ana@umg.edu.gt" })).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Restablecer contraseña: ana@umg.edu.gt" }));
    await fireEvent.changeText(screen.getByLabelText("Contraseña temporal"), "Temporal123");
    await fireEvent.press(screen.getByRole("button", { name: "Definir contraseña temporal" }));
    await waitFor(() => expect(api.resetUserPassword).toHaveBeenCalledWith({ id: 7, temporaryPassword: "Temporal123" }));
    expect(screen.getByLabelText("Contraseña temporal").props.value).toBe("");
  });

  it("renders a minimal published user with role fallback text", async () => {
    const api = { listUsers: jest.fn().mockResolvedValue([{ id: 9, roleId: 3, status: 1, username: "sin-perfil@umg.edu.gt" }]) };
    await render(<Foundation><UsersScreen apiFactory={() => api} /></Foundation>);
    expect((await screen.findAllByText("sin-perfil@umg.edu.gt")).length).toBe(2);
    expect(screen.getByText("ID de rol: 3")).toBeTruthy();
  });
});
