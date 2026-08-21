import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { getRenderErrorMessage } from "../src/api/renderApi";
import { useSession } from "../src/session/SessionProvider";
import { tokens } from "../src/theme/tokens";

export default function AccessScreen() {
  const router = useRouter();
  const { signIn } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!username.trim() || !password) {
      setError("Revisa la información e inténtalo de nuevo.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn({ username: username.trim(), password });
      setPassword("");
      router.replace("/portal");
    } catch (caught) {
      setError(caught?.code ? getRenderErrorMessage(caught) : "No se pudo completar el acceso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <View style={styles.screen}>
    <Text accessibilityRole="header" style={styles.title}>Acceso UMG</Text>
    <Text style={styles.copy}>Ingresa con tu cuenta institucional.</Text>
    <TextInput accessibilityLabel="Usuario institucional" autoCapitalize="none" keyboardType="email-address" onChangeText={setUsername} style={styles.input} value={username} />
    <TextInput accessibilityLabel="Contraseña" autoCapitalize="none" onChangeText={setPassword} secureTextEntry style={styles.input} value={password} />
    {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
    <Button accessibilityLabel="Iniciar sesión" disabled={isSubmitting} onPress={submit} title={isSubmitting ? "Accediendo…" : "Iniciar sesión"} />
  </View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: tokens.paper, flex: 1, justifyContent: "center", padding: 24 },
  title: { color: tokens.academicNavy, fontSize: 30, fontWeight: "700" },
  copy: { color: tokens.ink, fontSize: 16, marginBottom: 24, marginTop: 8 },
  input: { backgroundColor: tokens.surface, borderColor: tokens.reservationBlue, borderRadius: 8, borderWidth: 1, fontSize: 16, marginBottom: 14, minHeight: 48, paddingHorizontal: 12 },
  error: { color: tokens.danger, marginBottom: 14 }
});
