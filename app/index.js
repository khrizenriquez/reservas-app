import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "../src/session/SessionProvider";

export default function IndexScreen() {
  const { identity, isReady } = useSession();
  if (!isReady) return <View accessibilityLabel="Cargando sesión"><ActivityIndicator /></View>;
  return <Redirect href={identity ? "/portal" : "/access"} />;
}
