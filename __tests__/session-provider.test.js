import { Button, Text, View } from "react-native";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import {
  isAdminIdentity,
  navigationFor,
  normalizeIdentity,
  SessionProvider,
  useSession
} from "../src/session/SessionProvider";

const identity = { id: 18, name: "Chris Admin", email: "chrisadmin@umg.edu.gt", role: { id: 1, name: "Administrador" } };

function Probe() {
  const { identity: currentIdentity, isAdmin, isReady, navigation, signIn, signOut } = useSession();
  return <View>
    <Text>{isReady ? "ready" : "loading"}</Text>
    <Text>{currentIdentity?.email ?? "guest"}</Text>
    <Text>{isAdmin ? "admin" : "member"}</Text>
    <Text>{navigation.map((item) => item.key).join(",")}</Text>
    <Button onPress={() => signIn({ username: "chrisadmin@umg.edu.gt", password: "secret" })} title="sign in" />
    <Button onPress={() => signOut()} title="sign out" />
  </View>;
}

const storageFor = (stored = null) => ({
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(stored),
  setItemAsync: jest.fn().mockResolvedValue(undefined)
});

describe("SessionProvider", () => {
  it("normalizes only the persistent UI identity and derives role-aware navigation", () => {
    expect(normalizeIdentity({ UMG_ID: "18", UMG_Nombre: "Chris", UMG_Apellido: "Admin", UMG_Usuario: "chrisadmin@umg.edu.gt", UMG_Rol_ID: 1, UMG_Rol_Nombre: "Administrador", UMG_Contrasena: "secret" }))
      .toEqual(identity);
    expect(normalizeIdentity({ id: 0, email: "invalid@umg.edu.gt" })).toBeNull();
    expect(normalizeIdentity({ id: 2 })).toBeNull();
    expect(isAdminIdentity(identity)).toBe(true);
    expect(isAdminIdentity({ role: { id: 2, name: "Docente" } })).toBe(false);
    expect(navigationFor(identity).map((item) => item.key)).toEqual(["home", "availability", "reservations", "administration", "profile", "users", "logs"]);
    expect(navigationFor({ role: { id: 2, name: "Docente" } }).map((item) => item.key)).toEqual(["home", "availability", "reservations", "administration", "profile"]);
  });

  it("restores a password-free identity from SecureStore", async () => {
    const storage = storageFor(JSON.stringify({ ...identity, password: "never-restore", token: "never-restore" }));
    const apiFactory = jest.fn();

    await render(<SessionProvider apiFactory={apiFactory} storage={storage}><Probe /></SessionProvider>);

    await waitFor(() => expect(screen.getByText(identity.email)).toBeTruthy());
    expect(screen.getByText("admin")).toBeTruthy();
    expect(storage.getItemAsync).toHaveBeenCalledWith("reservas-ui-identity-v1");
    expect(apiFactory).not.toHaveBeenCalled();
  });

  it("persists normalized login identity without a password", async () => {
    const storage = storageFor();
    const api = {
      listUsers: jest.fn(),
      login: jest.fn().mockResolvedValue({ id: 18, username: identity.email, name: "Chris", lastName: "Admin", roleId: 1, roleName: "Administrador" })
    };

    await render(<SessionProvider apiFactory={() => api} storage={storage}><Probe /></SessionProvider>);
    await screen.findByText("ready");
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "sign in" }));
    });

    await waitFor(() => expect(screen.getByText(identity.email)).toBeTruthy());
    expect(api.login).toHaveBeenCalledWith({ username: identity.email, password: "secret" });
    expect(api.listUsers).not.toHaveBeenCalled();
    expect(storage.setItemAsync).toHaveBeenCalledWith("reservas-ui-identity-v1", JSON.stringify(identity));
    expect(storage.setItemAsync.mock.calls[0][1]).not.toContain("secret");
  });

  it("uses the published user list only when Render login omits identity", async () => {
    const storage = storageFor();
    const api = {
      login: jest.fn().mockResolvedValue({ message: "Acceso correcto" }),
      listUsers: jest.fn().mockResolvedValue([{ id: 18, username: identity.email, name: "Chris", lastName: "Admin", roleId: 1, roleName: "Administrador" }])
    };

    await render(<SessionProvider apiFactory={() => api} storage={storage}><Probe /></SessionProvider>);
    await screen.findByText("ready");
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "sign in" }));
    });

    await waitFor(() => expect(screen.getByText(identity.email)).toBeTruthy());
    expect(api.listUsers).toHaveBeenCalledTimes(1);
  });

  it("clears the stored identity on sign out", async () => {
    const storage = storageFor(JSON.stringify(identity));

    await render(<SessionProvider storage={storage}><Probe /></SessionProvider>);
    await screen.findByText(identity.email);
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "sign out" }));
    });

    await waitFor(() => expect(screen.getByText("guest")).toBeTruthy());
    expect(storage.deleteItemAsync).toHaveBeenCalledWith("reservas-ui-identity-v1");
  });
});
