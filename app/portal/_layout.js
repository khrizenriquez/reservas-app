import { ActivityIndicator, View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import { MobileTabBar } from "../../src/components/MobileTabBar";
import { PortalHeader } from "../../src/components/PortalHeader";
import { useSession } from "../../src/session/SessionProvider";

export default function PortalLayout() {
  const { identity, isReady } = useSession();
  if (!isReady) return <View accessibilityLabel="Cargando sesión"><ActivityIndicator /></View>;
  if (!identity) return <Redirect href="/access" />;
  return <Tabs screenOptions={{ header: () => <PortalHeader /> }} tabBar={(props) => <MobileTabBar {...props} />}>
    <Tabs.Screen name="index" options={{ title: "Inicio" }} />
    <Tabs.Screen name="availability" options={{ title: "Disponibilidad" }} />
    <Tabs.Screen name="reservations" options={{ title: "Reservas" }} />
    <Tabs.Screen name="administration" options={{ title: "Administración" }} />
    <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
  </Tabs>;
}
