import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useConnectivity } from "../src/connectivity/ConnectivityProvider";
import { getRenderErrorMessage } from "../src/api/renderApi";
import { useLanguage } from "../src/i18n/LanguageProvider";
import { useSession } from "../src/session/SessionProvider";
import { radius, spacing } from "../src/theme/tokens";
import { useTheme } from "../src/theme/ThemeProvider";
import { StatusBanner } from "../src/components/StatusBanner";

export default function AccessScreen() {
  const router = useRouter();
  const { isOnline } = useConnectivity();
  const { t } = useLanguage();
  const { signIn } = useSession();
  const { colors } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const styles = makeStyles(colors);

  const submit = async () => {
    if (!username.trim() || !password) {
      setError(getRenderErrorMessage({ code: "api.validation" }));
      return;
    }
    if (!isOnline) {
      setError(t("connection.offline"));
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn({ username: username.trim(), password });
      setPassword("");
      router.replace("/portal");
    } catch (caught) {
      setError(caught?.code ? getRenderErrorMessage(caught) : t("states.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return <View style={styles.screen}>
    {!isOnline ? <StatusBanner /> : null}
    <View style={styles.content}>
    <Text style={styles.eyebrow}>UMG · INGENIERÍA</Text>
    <Text accessibilityRole="header" style={styles.title}>{t("access.title")}</Text>
    <Text style={styles.copy}>{t("access.description")}</Text>
    <TextInput accessibilityLabel={t("access.username")} autoCapitalize="none" keyboardType="email-address" onChangeText={setUsername} placeholder={t("access.username")} placeholderTextColor={colors.textMuted} style={styles.input} value={username} />
    <TextInput accessibilityLabel={t("access.password")} autoCapitalize="none" onChangeText={setPassword} placeholder={t("access.password")} placeholderTextColor={colors.textMuted} secureTextEntry style={styles.input} value={password} />
    {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
    <Pressable accessibilityRole="button" accessibilityLabel={t("access.submit")} accessibilityState={{ disabled: isSubmitting || !isOnline }} disabled={isSubmitting || !isOnline} onPress={submit} style={[styles.submit, (isSubmitting || !isOnline) && styles.submitDisabled]}><Text style={styles.submitText}>{isSubmitting ? t("access.submitting") : t("access.submit")}</Text></Pressable>
    </View>
  </View>;
}

const makeStyles = (colors) => StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: spacing.section },
  eyebrow: { color: colors.action, fontSize: 12, fontWeight: "800", letterSpacing: 1.3 },
  title: { color: colors.brand, fontSize: 32, fontWeight: "700", letterSpacing: -0.6, marginTop: spacing.compact },
  copy: { color: colors.textSecondary, fontSize: 16, lineHeight: 24, marginBottom: spacing.section, marginTop: spacing.compact },
  input: { backgroundColor: colors.control, borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, color: colors.ink, fontSize: 16, marginBottom: spacing.control, minHeight: 48, paddingHorizontal: spacing.control },
  error: { color: colors.danger, marginBottom: spacing.control },
  submit: { alignItems: "center", backgroundColor: colors.action, borderRadius: radius.control, justifyContent: "center", minHeight: 48, paddingHorizontal: spacing.card },
  submitDisabled: { opacity: 0.55 },
  submitText: { color: colors.onBrand, fontSize: 16, fontWeight: "800" }
});
