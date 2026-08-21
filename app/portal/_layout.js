import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSession } from "../../src/session/SessionProvider";

export default function PortalLayout() {
  const { identity, isReady } = useSession();
  if (!isReady) return <View accessibilityLabel="Cargando sesión"><ActivityIndicator /></View>;
  if (!identity) return <Redirect href="/access" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
