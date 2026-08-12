import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../../../components/Button";
import { PageHeader } from "../../../components/PageHeader";
import { Panel } from "../../../components/Panel";
import { Screen } from "../../../components/Screen";
import { useSession } from "../../../session/SessionProvider";
import theme from "../../../theme/tokens";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, legacy, apiProfile, logout } = useSession();
  const [busy, setBusy] = useState(false);

  async function closeCurrent() {
    setBusy(true);
    try {
      await logout();
    } catch {
      // SessionProvider always removes the local credentials.
    } finally {
      router.replace("/login");
    }
  }

  return (
    <Screen>
      <PageHeader eyebrow="Cuenta" title="Perfil" description="Consulta tu identidad y administra tu contraseña." />
      <Panel accessibilityLabel="Identidad institucional" style={styles.identity}>
        <View style={styles.initials}><Text style={styles.initialsText}>{user.firstName?.[0]}{user.lastName?.[0]}</Text></View>
        <View style={styles.identityCopy}>
          <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.role}>{user.role?.name}</Text>
        </View>
      </Panel>

      <Panel accessibilityLabel="Perfil de API">
        <Text style={styles.eyebrow}>Contrato activo</Text>
        <Text style={styles.sectionTitle}>{apiProfile.toUpperCase()}</Text>
        <Text style={styles.copy}>
          {legacy
            ? "Modo legacy sin autenticación. Cerrar sesión únicamente elimina el usuario recordado en este dispositivo."
            : "JWT v2 verifica la identidad y los permisos en el servidor. Los tokens se guardan con SecureStore."}
        </Text>
      </Panel>

      <Button onPress={() => router.push("/change-password")} variant="secondary">Cambiar contraseña</Button>
      <Button loading={busy} onPress={closeCurrent} variant="secondary">Cerrar sesión</Button>
      <Text style={styles.localNote}>La API adoptada no ofrece una lista ni revocación global de sesiones.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: "center", flexDirection: "row" },
  initials: { alignItems: "center", backgroundColor: theme.color.navy, borderRadius: theme.radius.pill, height: 64, justifyContent: "center", width: 64 },
  initialsText: { color: theme.color.surface, fontFamily: "serif", fontSize: 23, fontWeight: "700" },
  identityCopy: { flex: 1, gap: theme.space[1] },
  name: { color: theme.color.navy, fontFamily: "serif", fontSize: 22, fontWeight: "700" },
  username: { color: theme.color.muted, fontSize: 13 },
  role: { alignSelf: "flex-start", backgroundColor: "#E2F0FC", borderRadius: theme.radius.pill, color: "#155980", fontSize: 11, fontWeight: "800", paddingHorizontal: theme.space[3], paddingVertical: theme.space[1] },
  eyebrow: { color: theme.color.blue, fontSize: 11, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  sectionTitle: { color: theme.color.navy, fontFamily: "serif", fontSize: 22, fontWeight: "700" },
  copy: { color: theme.color.muted, fontSize: 13, lineHeight: 19 },
  localNote: { color: theme.color.muted, fontSize: 12, lineHeight: 17, textAlign: "center" },
});
