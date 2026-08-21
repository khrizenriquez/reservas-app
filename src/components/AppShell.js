import { StyleSheet, Text, View } from "react-native";
import { tokens } from "../theme/tokens";

export function AppShell() {
  return <View accessibilityRole="main" style={styles.screen}>
    <Text accessibilityRole="header" style={styles.eyebrow}>UMG · INGENIERÍA</Text>
    <Text style={styles.title}>Reservas UMG</Text>
    <Text style={styles.description}>La base móvil está lista para conectar Render v1.</Text>
  </View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: tokens.paper, flex: 1, justifyContent: "center", padding: 24 },
  eyebrow: { color: tokens.reservationBlue, fontSize: 13, fontWeight: "700", letterSpacing: 1.2 },
  title: { color: tokens.academicNavy, fontSize: 34, fontWeight: "700", marginTop: 12 },
  description: { color: tokens.ink, fontSize: 16, lineHeight: 24, marginTop: 12 }
});
