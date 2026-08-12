import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { messageForError } from "../api/problem";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { Screen } from "../components/Screen";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useSession } from "../session/SessionProvider";
import theme from "../theme/tokens";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const online = useOnlineStatus();
  const { status, legacy, request, clearSession } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [action, setAction] = useState({ busy: false, error: "" });

  if (status === "anonymous") return <Redirect href="/login" />;

  async function submit() {
    if (!online || newPassword.length < 6 || newPassword !== confirmation || (!legacy && !currentPassword)) return;
    setAction({ busy: true, error: "" });
    try {
      await request("changePassword", { body: { currentPassword, newPassword } });
      await clearSession();
      router.replace("/login");
    } catch (error) {
      setAction({ busy: false, error: messageForError(error) });
    }
  }

  const invalid = !online || newPassword.length < 6 || newPassword !== confirmation || (!legacy && !currentPassword);
  return (
    <Screen>
      <PageHeader eyebrow="Seguridad" title="Cambiar contraseña" description="Después del cambio deberás ingresar nuevamente." />
      <Panel>
        {legacy ? <Text style={styles.warning}>La API legacy no solicita la contraseña actual y no autentica esta operación.</Text> : null}
        {!legacy ? <FormField autoCapitalize="none" label="Contraseña actual" onChangeText={setCurrentPassword} secureTextEntry value={currentPassword} /> : null}
        <FormField autoCapitalize="none" label="Nueva contraseña" help="Mínimo 6 caracteres" onChangeText={setNewPassword} secureTextEntry value={newPassword} />
        <FormField autoCapitalize="none" label="Confirmar nueva contraseña" onChangeText={setConfirmation} secureTextEntry value={confirmation} />
        {confirmation && confirmation !== newPassword ? <Text accessibilityRole="alert" style={styles.error}>Las contraseñas no coinciden.</Text> : null}
        {action.error ? <Text accessibilityRole="alert" style={styles.error}>{action.error}</Text> : null}
        <Button disabled={invalid} loading={action.busy} onPress={submit}>Guardar contraseña</Button>
        <Button onPress={() => router.back()} variant="ghost">Cancelar</Button>
      </Panel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  warning: { backgroundColor: "#FFF6E5", borderRadius: theme.radius.small, color: "#684609", fontSize: 13, lineHeight: 19, padding: theme.space[3] },
  error: { color: theme.color.danger, fontSize: 13, lineHeight: 18 },
});
