import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { createRenderApiClient, getRenderErrorMessage } from "../../api/renderApi";
import { ScreenState } from "../../components/ScreenState";
import { StatusBanner } from "../../components/StatusBanner";
import { useConnectivity } from "../../connectivity/ConnectivityProvider";
import { useLanguage } from "../../i18n/LanguageProvider";
import { radius, spacing } from "../../theme/tokens";
import { useTheme } from "../../theme/ThemeProvider";
import { validateAvailabilityCriteria } from "./availabilityForm";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];

function Field({ label, maxLength, onChangeText, placeholder, value }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} autoCapitalize="none" autoCorrect={false} maxLength={maxLength} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.textMuted} style={styles.input} value={value} /></View>;
}

function TimeRail({ criteria }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  return <View accessibilityRole="summary" accessibilityLabel={`${criteria.startTime} ${t("availability.available")} ${criteria.endTime}`} style={styles.rail}>
    <Text style={styles.railTime}>{criteria.startTime}</Text><View style={styles.railBand}><View style={styles.railTick} /><Text style={styles.railText}>{t("availability.available")}</Text><View style={styles.railTick} /></View><Text style={styles.railTime}>{criteria.endTime}</Text>
  </View>;
}

function LabCard({ criteria, lab, onReserve }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = makeStyles(colors);
  return <View accessibilityRole="summary" accessibilityLabel={`${lab.name ?? "—"}. ${t("availability.available")}`} style={styles.labCard}>
    <TimeRail criteria={criteria} />
    <View style={styles.labCopy}><View><Text style={styles.labName}>{lab.name ?? "—"}</Text><Text style={styles.date}>{criteria.date}</Text></View><Text style={styles.available}>{t("availability.available")}</Text></View>
    <Pressable accessibilityRole="button" accessibilityLabel={`${t("availability.reserve")}: ${lab.name ?? "—"}`} onPress={onReserve} style={styles.reserve}><Text style={styles.reserveText}>{t("availability.reserve")}</Text></Pressable>
  </View>;
}

export function AvailabilityScreen({ apiFactory = createRenderApiClient }) {
  const router = useRouter();
  const { isOnline } = useConnectivity();
  const { language, t } = useLanguage();
  const { colors } = useTheme();
  const [form, setForm] = useState({ date: "", endTime: "", startTime: "" });
  const [state, setState] = useState({ criteria: null, error: null, hasRead: false, labs: null, status: "idle" });
  const styles = makeStyles(colors);
  const hasRead = state.hasRead;

  const search = useCallback(async (criteria) => {
    const validationKey = validateAvailabilityCriteria(criteria);
    if (validationKey) {
      setState((current) => ({ ...current, error: { code: validationKey }, status: "validation" }));
      return;
    }
    if (!isOnline) return;
    setState((current) => ({ ...current, criteria, error: null, status: "loading" }));
    try {
      const labs = asList(await apiFactory().getLabAvailability({ fecha: criteria.date, hora_inicio: criteria.startTime, hora_fin: criteria.endTime }));
      setState({ criteria, error: null, hasRead: true, labs, status: "success" });
    } catch (error) {
      setState((current) => ({ ...current, criteria, error, status: "error" }));
    }
  }, [apiFactory, isOnline]);

  const reserve = (lab) => router.navigate({ params: { date: state.criteria.date, endTime: state.criteria.endTime, labId: String(lab.id), startTime: state.criteria.startTime }, pathname: "/portal/reservations" });
  const isLoading = state.status === "loading";
  const message = state.error?.code?.startsWith("availability.") ? t(state.error.code) : getRenderErrorMessage(state.error, language);

  return <View style={styles.screen}>
    {!isOnline ? <StatusBanner status={hasRead ? "stale" : "offline"} /> : null}
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>{t("availability.eyebrow")}</Text>
      <Text accessibilityRole="header" style={styles.title}>{t("availability.title")}</Text>
      <Text style={styles.description}>{t("availability.description")}</Text>
      <View style={styles.form}>
        <Field label={t("availability.date")} maxLength={10} onChangeText={(date) => setForm((current) => ({ ...current, date }))} placeholder={t("availability.datePlaceholder")} value={form.date} />
        <View style={styles.timeFields}><View style={styles.timeField}><Field label={t("availability.start")} maxLength={5} onChangeText={(startTime) => setForm((current) => ({ ...current, startTime }))} placeholder={t("availability.timePlaceholder")} value={form.startTime} /></View><View style={styles.timeField}><Field label={t("availability.end")} maxLength={5} onChangeText={(endTime) => setForm((current) => ({ ...current, endTime }))} placeholder={t("availability.timePlaceholder")} value={form.endTime} /></View></View>
        <Text style={styles.hint}>{t("availability.formatHint")}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={t("availability.submit")} disabled={!isOnline || isLoading} onPress={() => search(form)} style={[styles.submit, (!isOnline || isLoading) && styles.disabled]}><Text style={styles.submitText}>{isLoading ? t("availability.searching") : t("availability.submit")}</Text></Pressable>
      </View>
      {state.status === "loading" ? <ScreenState description={t("availability.searching")} kind="loading" /> : null}
      {state.status === "validation" ? <View accessibilityRole="alert" style={styles.error}><Text style={styles.errorText}>{message}</Text></View> : null}
      {state.status === "error" && !hasRead ? <ScreenState description={message} kind="error" onRetry={() => search(state.criteria)} title={t("availability.error")} /> : null}
      {state.status === "error" && hasRead ? <View accessibilityRole="alert" style={styles.error}><Text style={styles.errorText}>{message}</Text></View> : null}
      {state.status === "success" && state.labs.length === 0 ? <ScreenState title={t("availability.empty")} /> : null}
      {state.labs?.length ? <View accessibilityLabel={t("availability.list")} style={styles.results}><Text style={styles.resultsTitle}>{t("availability.list")}</Text>{state.labs.map((lab) => <LabCard criteria={state.criteria} key={lab.id} lab={lab} onReserve={() => reserve(lab)} />)}</View> : null}
    </ScrollView>
  </View>;
}

const makeStyles = (colors) => StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 },
  content: { gap: spacing.card, padding: spacing.section },
  eyebrow: { color: colors.action, fontSize: 12, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: colors.brand, fontSize: 30, fontWeight: "700", letterSpacing: -0.6, marginTop: -6 },
  description: { color: colors.textSecondary, fontSize: 16, lineHeight: 23, marginTop: -8 },
  form: { backgroundColor: colors.surface, borderColor: colors.borderSoft, borderRadius: radius.card, borderWidth: 1, gap: spacing.control, padding: spacing.card },
  field: { gap: spacing.micro },
  label: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  input: { backgroundColor: colors.control, borderColor: colors.borderSoft, borderRadius: radius.control, borderWidth: 1, color: colors.ink, fontSize: 16, minHeight: 48, paddingHorizontal: spacing.control },
  timeFields: { flexDirection: "row", gap: spacing.control },
  timeField: { flex: 1 },
  hint: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  submit: { alignItems: "center", backgroundColor: colors.action, borderRadius: radius.control, justifyContent: "center", minHeight: 48, paddingHorizontal: spacing.card },
  disabled: { opacity: 0.48 },
  submitText: { color: colors.onBrand, fontSize: 16, fontWeight: "800" },
  error: { backgroundColor: colors.surface, borderColor: colors.danger, borderRadius: radius.control, borderWidth: 1, padding: spacing.card },
  errorText: { color: colors.danger, fontSize: 15, fontWeight: "600", lineHeight: 21 },
  results: { gap: spacing.control },
  resultsTitle: { color: colors.ink, fontSize: 20, fontWeight: "700" },
  labCard: { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSoft, borderRadius: radius.card, borderWidth: 1, overflow: "hidden" },
  rail: { alignItems: "center", backgroundColor: colors.brand, flexDirection: "row", gap: spacing.compact, justifyContent: "space-between", minHeight: 54, paddingHorizontal: spacing.card },
  railTime: { color: colors.onBrand, fontSize: 13, fontWeight: "800", width: 42 },
  railBand: { alignItems: "center", flex: 1, flexDirection: "row", gap: spacing.compact, justifyContent: "center" },
  railTick: { backgroundColor: colors.action, height: 2, width: 12 },
  railText: { color: colors.onBrand, fontSize: 12, fontWeight: "800" },
  labCopy: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.card, paddingTop: spacing.card },
  labName: { color: colors.ink, fontSize: 18, fontWeight: "700" },
  date: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.micro },
  available: { color: colors.success, fontSize: 13, fontWeight: "800" },
  reserve: { alignItems: "center", alignSelf: "flex-start", backgroundColor: colors.action, borderRadius: radius.control, justifyContent: "center", margin: spacing.card, minHeight: 44, paddingHorizontal: spacing.card },
  reserveText: { color: colors.onBrand, fontSize: 14, fontWeight: "800" }
});
