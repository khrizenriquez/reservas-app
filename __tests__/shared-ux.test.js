import { Button, Text, View } from "react-native";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { AccessibleDialog } from "../src/components/AccessibleDialog";
import { FeaturePlaceholder } from "../src/components/FeaturePlaceholder";
import { MobileTabBar } from "../src/components/MobileTabBar";
import { PortalHeader } from "../src/components/PortalHeader";
import { ScreenState } from "../src/components/ScreenState";
import { StatusBanner } from "../src/components/StatusBanner";
import { ConnectivityProvider, useConnectivity } from "../src/connectivity/ConnectivityProvider";
import { LanguageProvider, textFor, useLanguage } from "../src/i18n/LanguageProvider";
import { SessionProvider } from "../src/session/SessionProvider";
import { ThemeProvider, useTheme } from "../src/theme/ThemeProvider";

const mockRouter = { replace: jest.fn() };
jest.mock("expo-router", () => ({ useRouter: () => mockRouter }));
jest.mock("@react-native-community/netinfo", () => ({ __esModule: true, default: { addEventListener: jest.fn() } }));

function Foundation({ children, initialLanguage, initialTheme, initialOnline = true, subscribe }) {
  return <ThemeProvider initialTheme={initialTheme}><LanguageProvider initialLanguage={initialLanguage}><ConnectivityProvider initialOnline={initialOnline} subscribe={subscribe}>{children}</ConnectivityProvider></LanguageProvider></ThemeProvider>;
}

function ThemeAndLanguageProbe() {
  const { colors, theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  return <View>
    <Text>{theme}</Text><Text>{language}</Text><Text>{colors.canvas}</Text><Text>{t("navigation.home")}</Text>
    <Button onPress={toggleTheme} title="theme" /><Button onPress={() => setLanguage("en")} title="language" />
  </View>;
}

function ConnectivityProbe() {
  const { isOnline } = useConnectivity();
  return <Text>{isOnline ? "online" : "offline"}</Text>;
}

describe("shared native experience", () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it("uses Spanish by default and switches language and theme without a data call", async () => {
    await render(<Foundation initialTheme="light"><ThemeAndLanguageProbe /></Foundation>);
    expect(screen.getByText("es")).toBeTruthy();
    expect(screen.getByText("Inicio")).toBeTruthy();
    expect(screen.getByText("#F4F1E8")).toBeTruthy();

    await act(async () => { fireEvent.press(screen.getByRole("button", { name: "theme" })); });
    await act(async () => { fireEvent.press(screen.getByRole("button", { name: "language" })); });

    await waitFor(() => expect(screen.getByText("dark")).toBeTruthy());
    expect(screen.getByText("en")).toBeTruthy();
    expect(screen.getByText("Home")).toBeTruthy();
    expect(textFor("unknown", "navigation.home")).toBe("Inicio");
    expect(textFor("en", "missing.key")).toBe("missing.key");
  });

  it("tracks native connectivity and cleans up its subscription", async () => {
    let listener;
    const unsubscribe = jest.fn();
    const subscribe = jest.fn((next) => { listener = next; return unsubscribe; });
    const result = await render(<Foundation subscribe={subscribe}><ConnectivityProbe /></Foundation>);

    expect(screen.getByText("online")).toBeTruthy();
    await act(async () => { listener(false); });
    expect(screen.getByText("offline")).toBeTruthy();
    await result.unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("renders accessible loading, empty, error, stale, and offline states", async () => {
    const retry = jest.fn();
    const result = await render(<Foundation><ScreenState kind="loading" description="Carga de reservas" /></Foundation>);
    expect(screen.getByText("Cargando información")).toBeTruthy();

    await result.rerender(<Foundation><ScreenState kind="empty" /></Foundation>);
    expect(screen.getByText("Aún no hay información para mostrar")).toBeTruthy();
    await result.rerender(<Foundation><ScreenState kind="error" onRetry={retry} /></Foundation>);
    await act(async () => { fireEvent.press(screen.getByRole("button", { name: "Reintentar" })); });
    expect(retry).toHaveBeenCalledTimes(1);
    await result.rerender(<Foundation><StatusBanner status="stale" /></Foundation>);
    expect(screen.getByText("Mostrando información leída anteriormente. Actualiza al reconectarte.")).toBeTruthy();
    await result.rerender(<Foundation><StatusBanner /></Foundation>);
    expect(screen.getByText("Sin conexión. Los cambios siguen desactivados hasta reconectarte.")).toBeTruthy();
  });

  it("provides a labelled dialog, planned screen frame, and a compact tab rail", async () => {
    const close = jest.fn();
    const navigation = { emit: jest.fn(() => ({ defaultPrevented: false })), navigate: jest.fn() };
    const state = { index: 0, routes: [{ key: "home-key", name: "index" }, { key: "availability-key", name: "availability" }] };
    const result = await render(<Foundation><AccessibleDialog onClose={close} title="Confirmar acción" visible><Text>Contenido</Text></AccessibleDialog></Foundation>);

    expect(screen.getByText("Confirmar acción")).toBeTruthy();
    await act(async () => { fireEvent.press(screen.getByRole("button", { name: "Cerrar" })); });
    await result.rerender(<Foundation><View><FeaturePlaceholder titleKey="navigation.reservations" /><MobileTabBar navigation={navigation} state={state} /></View></Foundation>);
    expect(screen.getByText("Reservas")).toBeTruthy();
    await act(async () => { fireEvent.press(screen.getByRole("tab", { name: "Disponibilidad" })); });
    await act(async () => { fireEvent.press(screen.getByRole("tab", { name: "Inicio" })); });
    expect(close).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith("availability");
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    await result.unmount();
  });

  it("grounds portal controls in the restored identity and exposes real offline status", async () => {
    const storage = {
      deleteItemAsync: jest.fn().mockResolvedValue(undefined),
      getItemAsync: jest.fn().mockResolvedValue(JSON.stringify({ id: 18, name: "Chris", email: "chris@umg.edu.gt", role: { id: 1, name: "Administrador" } })),
      setItemAsync: jest.fn()
    };

    await render(<Foundation initialOnline={false}><SessionProvider storage={storage}><PortalHeader /></SessionProvider></Foundation>);

    await screen.findByText("Reservas");
    expect(screen.getByText("Sin conexión. Los cambios siguen desactivados hasta reconectarte.")).toBeTruthy();
    await act(async () => { fireEvent.press(screen.getByRole("button", { name: "Usar tema nocturno" })); });
    await act(async () => { fireEvent.press(screen.getByRole("button", { name: "Idioma" })); });
    await act(async () => { fireEvent.press(screen.getByRole("button", { name: "Sign out" })); });
    expect(storage.deleteItemAsync).toHaveBeenCalledWith("reservas-ui-identity-v1");
    expect(mockRouter.replace).toHaveBeenCalledWith("/access");
  });
});
