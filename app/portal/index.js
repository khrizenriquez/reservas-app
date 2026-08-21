import { Button, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSession } from "../../src/session/SessionProvider";
import { tokens } from "../../src/theme/tokens";

export default function PortalScreen() {
  const router = useRouter();
  const { identity, navigation, signOut } = useSession();

  const exit = async () => {
    await signOut();
    router.replace("/access");
  };

  return <View style={styles.screen}>
    <Text accessibilityRole="header" style={styles.title}>Hola, {identity.name}</Text>
    <Text style={styles.copy}>Sesión restaurada para {identity.role.name || "usuario UMG"}.</Text>
    <Text style={styles.copy}>Opciones disponibles: {navigation.map((item) => item.key).join(", ")}.</Text>
    <Button accessibilityLabel="Cerrar sesión" onPress={exit} title="Cerrar sesión" />
  </View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: tokens.paper, flex: 1, justifyContent: "center", padding: 24 },
  title: { color: tokens.academicNavy, fontSize: 30, fontWeight: "700" },
  copy: { color: tokens.ink, fontSize: 16, lineHeight: 24, marginBottom: 12, marginTop: 8 }
});
