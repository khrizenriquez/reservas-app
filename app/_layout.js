import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ConnectivityProvider } from "../src/connectivity/ConnectivityProvider";
import { LanguageProvider } from "../src/i18n/LanguageProvider";
import { SessionProvider } from "../src/session/SessionProvider";
import { ThemeProvider } from "../src/theme/ThemeProvider";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ConnectivityProvider>
            <SessionProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </SessionProvider>
          </ConnectivityProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
