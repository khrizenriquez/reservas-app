import { Redirect, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { messageForError } from "../api/problem";
import { BrandMark } from "../components/BrandMark";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";
import { OfflineBanner } from "../components/OfflineBanner";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useSession } from "../session/SessionProvider";
import theme from "../theme/tokens";

export default function LoginScreen() {
  const router = useRouter();
  const online = useOnlineStatus();
  const { status, login, legacy } = useSession();
  const passwordInputRef = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState({ busy: false, error: "" });

  if (status === "authenticated") return <Redirect href="/(app)/(tabs)" />;

  async function submit() {
    if (!online || !username.trim() || password.length < 6) return;
    setAction({ busy: true, error: "" });
    try {
      const user = await login({ username, password });
      router.replace(user.mustChangePassword ? "/change-password" : "/(app)/(tabs)");
    } catch (error) {
      setAction({ busy: false, error: messageForError(error) });
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <OfflineBanner online={online} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboard}
      >
        <View style={styles.hero}>
          <BrandMark />
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>{legacy ? "Compatibilidad con API legacy" : "Acceso institucional JWT"}</Text>
            <Text accessibilityRole="header" style={styles.title}>Tu laboratorio, a tiempo.</Text>
            <Text style={styles.description}>
              Consulta disponibilidad y administra tus reservas desde cualquier lugar.
            </Text>
          </View>
        </View>
        <View style={styles.form}>
          <Text accessibilityRole="header" style={styles.formTitle}>Iniciar sesión</Text>
          <FormField
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            label="Correo institucional"
            onChangeText={setUsername}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            placeholder="nombre@umg.edu.gt"
            returnKeyType="next"
            testID="login-email"
            value={username}
          />
          <FormField
            autoCapitalize="none"
            autoComplete="password"
            label="Contraseña"
            inputRef={passwordInputRef}
            onChangeText={setPassword}
            onSubmitEditing={submit}
            placeholder="Mínimo 6 caracteres"
            returnKeyType="go"
            secureTextEntry
            testID="login-password"
            value={password}
          />
          {action.error ? (
            <Text accessibilityLiveRegion="assertive" accessibilityRole="alert" style={styles.error}>
              {action.error}
            </Text>
          ) : null}
          <Button
            disabled={!online || !username.trim() || password.length < 6}
            loading={action.busy}
            onPress={submit}
          >
            Ingresar
          </Button>
          <Text style={styles.security}>
            {legacy
              ? "Modo legacy sin autenticación: el dispositivo solo recuerda el usuario devuelto por la API."
              : "Los tokens JWT se guardan con SecureStore y el acceso se renueva una sola vez cuando expira."}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: theme.color.navy, flex: 1 },
  keyboard: { flex: 1 },
  hero: {
    backgroundColor: theme.color.navy,
    gap: theme.space[8],
    paddingHorizontal: theme.space[6],
    paddingVertical: theme.space[6],
  },
  heroCopy: { gap: theme.space[2] },
  eyebrow: { color: "#98CDE1", fontSize: 11, fontWeight: "800", letterSpacing: 1.1, textTransform: "uppercase" },
  title: { color: theme.color.surface, fontFamily: "serif", fontSize: 38, fontWeight: "700", lineHeight: 42 },
  description: { color: "#D9E5EE", fontSize: 15, lineHeight: 22 },
  form: {
    backgroundColor: theme.color.paper,
    borderTopLeftRadius: theme.radius.large,
    borderTopRightRadius: theme.radius.large,
    flex: 1,
    gap: theme.space[4],
    padding: theme.space[6],
  },
  formTitle: { color: theme.color.navy, fontFamily: "serif", fontSize: 28, fontWeight: "700" },
  error: { backgroundColor: "#FFF0F0", borderRadius: theme.radius.small, color: theme.color.danger, padding: theme.space[3] },
  security: { color: theme.color.muted, fontSize: 12, lineHeight: 17, textAlign: "center" },
});
