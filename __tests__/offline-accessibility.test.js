import { AccessibilityInfo, Text, View } from "react-native";
import { act, render, screen } from "@testing-library/react-native";
import { AccessibleDialog } from "../src/components/AccessibleDialog";
import { StatusBanner } from "../src/components/StatusBanner";
import { PortalHeader } from "../src/components/PortalHeader";
import { useReducedMotion } from "../src/accessibility/useReducedMotion";
import { ConnectivityProvider } from "../src/connectivity/ConnectivityProvider";
import { readStatusFor } from "../src/connectivity/readState";
import { AdministrationScreen } from "../src/features/administration/AdministrationScreen";
import { LanguageProvider } from "../src/i18n/LanguageProvider";
import { SessionProvider } from "../src/session/SessionProvider";
import { ThemeProvider } from "../src/theme/ThemeProvider";

jest.mock("expo-router", () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock("@react-native-community/netinfo", () => ({ __esModule: true, default: { addEventListener: jest.fn() } }));

const identity = { id: 1, name: "Admin UMG", email: "admin@umg.edu.gt", role: { id: 1, name: "Administrador" } };
const storage = { deleteItemAsync: jest.fn(), getItemAsync: jest.fn().mockResolvedValue(JSON.stringify(identity)), setItemAsync: jest.fn() };
function Foundation({ children, subscribe }) { return <ThemeProvider initialTheme="light"><LanguageProvider><ConnectivityProvider subscribe={subscribe}><SessionProvider storage={storage}>{children}</SessionProvider></ConnectivityProvider></LanguageProvider></ThemeProvider>; }
function MotionProbe() { return <Text>{useReducedMotion() ? "reduced" : "full"}</Text>; }

describe("offline and accessibility closure", () => {
  const originalReduceMotion = AccessibilityInfo.isReduceMotionEnabled;
  const originalSubscribe = AccessibilityInfo.addEventListener;
  const originalAnnounce = AccessibilityInfo.announceForAccessibility;

  afterEach(() => {
    AccessibilityInfo.isReduceMotionEnabled = originalReduceMotion;
    AccessibilityInfo.addEventListener = originalSubscribe;
    AccessibilityInfo.announceForAccessibility = originalAnnounce;
  });

  it("distinguishes an unavailable read from retained stale data", () => {
    expect(readStatusFor({ hasRead: false, isOnline: false })).toBe("offline");
    expect(readStatusFor({ hasRead: true, isOnline: false })).toBe("stale");
    expect(readStatusFor({ hasRead: true, isOnline: true })).toBeNull();
  });

  it("retains administration results and announces a stale state after connectivity changes", async () => {
    let listener;
    const unsubscribe = jest.fn();
    const subscribe = jest.fn((next) => { listener = next; return unsubscribe; });
    const api = { listLabConditions: jest.fn().mockResolvedValue([]), listLabs: jest.fn().mockResolvedValue([{ id: 2, name: "Laboratorio de redes", status: 1 }]) };
    AccessibilityInfo.announceForAccessibility = jest.fn();
    await render(<Foundation subscribe={subscribe}><View><PortalHeader /><AdministrationScreen apiFactory={() => api} /></View></Foundation>);
    expect(await screen.findByText("Laboratorio de redes")).toBeTruthy();
    await act(async () => { listener(false); });
    expect(await screen.findByText("Mostrando información leída anteriormente. Actualiza al reconectarte.")).toBeTruthy();
    expect(screen.getByText("Laboratorio de redes")).toBeTruthy();
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith("Mostrando información leída anteriormente. Actualiza al reconectarte.");
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(1);
    expect(unsubscribe).not.toHaveBeenCalled();
  });

  it("announces dialogs and disables their transition when the device requests reduced motion", async () => {
    AccessibilityInfo.announceForAccessibility = jest.fn();
    AccessibilityInfo.isReduceMotionEnabled = jest.fn().mockResolvedValue(true);
    AccessibilityInfo.addEventListener = jest.fn(() => ({ remove: jest.fn() }));
    const result = await render(<ThemeProvider initialTheme="light"><LanguageProvider><View><MotionProbe /><AccessibleDialog onClose={jest.fn()} title="Confirmar cambio" visible><Text>Contenido</Text></AccessibleDialog></View></LanguageProvider></ThemeProvider>);
    const tree = JSON.stringify(result.toJSON());
    expect(tree).toContain("reduced");
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith("Confirmar cambio");
    expect(tree).toContain("animationType");
    expect(tree).toContain("none");
  });

  it("keeps live status and dialog controls exposed to assistive technology", async () => {
    AccessibilityInfo.announceForAccessibility = jest.fn();
    const result = await render(<ThemeProvider initialTheme="light"><LanguageProvider><View><StatusBanner status="offline" /><AccessibleDialog onClose={jest.fn()} title="Detalle accesible" visible><Text>Contenido</Text></AccessibleDialog></View></LanguageProvider></ThemeProvider>);
    const tree = JSON.stringify(result.toJSON());
    expect(tree).toContain("Sin conexión. Los cambios siguen desactivados hasta reconectarte.");
    expect(tree).toContain("Cerrar");
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith("Sin conexión. Los cambios siguen desactivados hasta reconectarte.");
    expect(tree).toContain("accessibilityRole");
  });
});
