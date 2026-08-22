import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { createRenderApiClient, getRenderErrorMessage } from "../../api/renderApi";
import { AccessibleDialog } from "../../components/AccessibleDialog";
import { ScreenState } from "../../components/ScreenState";
import { StatusBanner } from "../../components/StatusBanner";
import { useConnectivity } from "../../connectivity/ConnectivityProvider";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useSession } from "../../session/SessionProvider";
import { radius, spacing } from "../../theme/tokens";
import { useTheme } from "../../theme/ThemeProvider";

const emptyForm = { lastName: "", name: "", password: "", roleId: "", username: "" };
const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];

function Field({ label, onChangeText, secureTextEntry = false, value }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput accessibilityLabel={label} autoCapitalize="none" onChangeText={onChangeText} secureTextEntry={secureTextEntry} style={styles.input} value={value} />
  </View>;
}

export function UsersScreen({ apiFactory = createRenderApiClient }) {
  const { isOnline } = useConnectivity();
  const { language, t } = useLanguage();
  const { identity } = useSession();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [users, setUsers] = useState([]);
  const [state, setState] = useState({ error: null, status: "loading" });
  const [form, setForm] = useState(emptyForm);
  const [isCreating, setIsCreating] = useState(false);
  const [resetTarget, setResetTarget] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [temporaryPassword, setTemporaryPassword] = useState("");

  const load = useCallback(async () => {
    if (!isOnline) return;
    setState({ error: null, status: "loading" });
    try {
      const response = await apiFactory().listUsers();
      setUsers(asList(response));
      setState({ error: null, status: "success" });
    } catch (error) {
      setState({ error, status: "error" });
    }
  }, [apiFactory, isOnline]);

  useEffect(() => { queueMicrotask(load); }, [load]);

  const closeCreate = () => {
    setForm(emptyForm);
    setIsCreating(false);
  };

  const saveUser = async () => {
    if (!isOnline || !form.username.trim() || !form.password || !form.name.trim() || !form.lastName.trim() || !form.roleId) return;
    try {
      await apiFactory().createUser({
        username: form.username.trim(), password: form.password, name: form.name.trim(), lastName: form.lastName.trim(), roleId: Number(form.roleId)
      });
      closeCreate();
      await load();
    } catch (error) {
      setForm((current) => ({ ...current, password: "" }));
      setState({ error, status: "error" });
    }
  };

  const resetPassword = async () => {
    if (!isOnline || !resetTarget?.id || !temporaryPassword) return;
    try {
      await apiFactory().resetUserPassword({ id: resetTarget.id, temporaryPassword });
      setTemporaryPassword("");
      setResetTarget(null);
      await load();
    } catch (error) {
      setTemporaryPassword("");
      setState({ error, status: "error" });
    }
  };

  const deactivate = async () => {
    if (!isOnline || !deactivateTarget?.id || deactivateTarget.id === identity?.id) return;
    try {
      await apiFactory().deactivateUser({ id: deactivateTarget.id });
      setDeactivateTarget(null);
      await load();
    } catch (error) {
      setState({ error, status: "error" });
    }
  };

  const errorMessage = getRenderErrorMessage(state.error, language);
  return <View style={styles.screen}>
    {!isOnline ? <StatusBanner status="offline" /> : null}
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>{t("users.eyebrow")}</Text>
      <Text accessibilityRole="header" style={styles.title}>{t("users.title")}</Text>
      <Text style={styles.description}>{t("users.description")}</Text>
      {state.status === "loading" ? <ScreenState kind="loading" /> : null}
      {state.status === "error" ? <ScreenState description={errorMessage} kind="error" onRetry={load} title={t("users.error")} /> : null}
      <View style={styles.section}>
        <View style={styles.heading}>
          <Text style={styles.sectionTitle}>{t("users.list")}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={t("users.create")} disabled={!isOnline} onPress={() => setIsCreating(true)} style={styles.primary}>
            <Text style={styles.primaryText}>{t("users.create")}</Text>
          </Pressable>
        </View>
        {state.status === "success" && users.length === 0 ? <ScreenState kind="empty" title={t("users.empty")} /> : null}
        {users.map((user) => {
          const isSelf = user.id === identity?.id;
          return <View key={user.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.identity}><Text style={styles.name}>{[user.name, user.lastName].filter(Boolean).join(" ") || user.username}</Text><Text style={styles.username}>{user.username}</Text></View>
              <Text style={[styles.status, user.status === 1 ? styles.active : styles.inactive]}>{user.status === 1 ? t("users.active") : t("users.inactive")}</Text>
            </View>
            <Text style={styles.role}>{user.roleName || `${t("users.role")}: ${user.roleId ?? "—"}`}</Text>
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" accessibilityLabel={`${t("users.reset")}: ${user.username}`} disabled={!isOnline} onPress={() => { setResetTarget(user); setTemporaryPassword(""); }} style={styles.secondary}>
                <Text style={styles.secondaryText}>{t("users.reset")}</Text>
              </Pressable>
              {!isSelf && user.status !== 0 ? <Pressable accessibilityRole="button" accessibilityLabel={`${t("users.deactivate")}: ${user.username}`} disabled={!isOnline} onPress={() => setDeactivateTarget(user)} style={styles.danger}>
                <Text style={styles.dangerText}>{t("users.deactivate")}</Text>
              </Pressable> : null}
              {isSelf ? <Text style={styles.self}>{t("users.selfProtected")}</Text> : null}
            </View>
          </View>;
        })}
      </View>
    </ScrollView>
    <AccessibleDialog onClose={closeCreate} title={t("users.createTitle")} visible={isCreating}>
      <ScrollView><View style={styles.dialog}>{[["username", "users.username", false], ["name", "users.name", false], ["lastName", "users.lastName", false], ["roleId", "users.role", false], ["password", "users.password", true]].map(([key, label, secure]) => <Field key={key} label={t(label)} onChangeText={(value) => setForm((current) => ({ ...current, [key]: value }))} secureTextEntry={secure} value={form[key]} />)}</View></ScrollView>
      <Pressable accessibilityRole="button" accessibilityLabel={t("users.save")} disabled={!isOnline} onPress={saveUser} style={styles.primary}><Text style={styles.primaryText}>{t("users.save")}</Text></Pressable>
    </AccessibleDialog>
    <AccessibleDialog onClose={() => { setTemporaryPassword(""); setResetTarget(null); }} title={t("users.resetTitle")} visible={Boolean(resetTarget)}>
      <Text style={styles.dialogText}>{resetTarget?.username}</Text>
      <Field label={t("users.temporaryPassword")} onChangeText={setTemporaryPassword} secureTextEntry value={temporaryPassword} />
      <Pressable accessibilityRole="button" accessibilityLabel={t("users.resetConfirm")} disabled={!isOnline} onPress={resetPassword} style={styles.primary}><Text style={styles.primaryText}>{t("users.resetConfirm")}</Text></Pressable>
    </AccessibleDialog>
    <AccessibleDialog onClose={() => setDeactivateTarget(null)} title={t("users.deactivateTitle")} visible={Boolean(deactivateTarget)}>
      <Text style={styles.dialogText}>{`${t("users.deactivateAsk")} ${deactivateTarget?.username ?? ""}`}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={t("users.deactivateConfirm")} disabled={!isOnline} onPress={deactivate} style={styles.danger}><Text style={styles.dangerText}>{t("users.deactivateConfirm")}</Text></Pressable>
    </AccessibleDialog>
  </View>;
}

const makeStyles = (colors) => StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 }, content: { gap: spacing.card, padding: spacing.section }, eyebrow: { color: colors.action, fontSize: 12, fontWeight: "800", letterSpacing: 1.1 }, title: { color: colors.brand, fontSize: 30, fontWeight: "700" }, description: { color: colors.textSecondary, fontSize: 16, lineHeight: 23 }, section: { gap: spacing.control }, heading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }, sectionTitle: { color: colors.ink, fontSize: 20, fontWeight: "700" }, card: { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSoft, borderRadius: radius.card, borderWidth: 1, gap: spacing.compact, padding: spacing.card }, cardHeader: { alignItems: "flex-start", flexDirection: "row", gap: spacing.control, justifyContent: "space-between" }, identity: { flex: 1, gap: spacing.micro }, name: { color: colors.ink, fontSize: 17, fontWeight: "700" }, username: { color: colors.textSecondary }, role: { color: colors.action, fontSize: 13, fontWeight: "800" }, status: { fontSize: 12, fontWeight: "800" }, active: { color: colors.success }, inactive: { color: colors.textMuted }, actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.compact }, primary: { alignItems: "center", backgroundColor: colors.action, borderRadius: radius.control, justifyContent: "center", minHeight: 44, paddingHorizontal: spacing.control }, primaryText: { color: colors.onBrand, fontWeight: "800" }, secondary: { alignItems: "center", borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, justifyContent: "center", minHeight: 44, paddingHorizontal: spacing.control }, secondaryText: { color: colors.action, fontWeight: "800" }, danger: { alignItems: "center", borderColor: colors.danger, borderRadius: radius.control, borderWidth: 1, justifyContent: "center", minHeight: 44, paddingHorizontal: spacing.control }, dangerText: { color: colors.danger, fontWeight: "800" }, self: { alignSelf: "center", color: colors.textMuted, fontSize: 12, fontWeight: "700" }, dialog: { gap: spacing.control }, dialogText: { color: colors.textSecondary }, field: { gap: spacing.micro }, label: { color: colors.ink, fontWeight: "700" }, input: { backgroundColor: colors.control, borderRadius: radius.control, color: colors.ink, minHeight: 46, paddingHorizontal: spacing.control }
});
