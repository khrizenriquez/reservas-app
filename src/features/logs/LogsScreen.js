import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { createRenderApiClient, getRenderErrorMessage } from "../../api/renderApi";
import { ScreenState } from "../../components/ScreenState";
import { StatusBanner } from "../../components/StatusBanner";
import { useConnectivity } from "../../connectivity/ConnectivityProvider";
import { readStatusFor } from "../../connectivity/readState";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useSession } from "../../session/SessionProvider";
import { radius, spacing } from "../../theme/tokens";
import { useTheme } from "../../theme/ThemeProvider";
import { addDays, countBy, inRange, latestAuditDate, mondayFor, rangeEntries, validateAuditPeriod, weeklyEntries } from "./auditPeriods";

const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const pageSizes = [10, 20, 50];

function Field({ label, onChangeText, value }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} autoCapitalize="none" keyboardType="numeric" onChangeText={onChangeText} style={styles.input} value={value} /></View>;
}

function ActivityBars({ entries, label }) {
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const maximum = Math.max(...entries.map((entry) => entry.count), 1);
  const description = entries.map((entry) => `${entry.label} ${entry.count}`).join(", ");
  return <View accessibilityLabel={`${label}: ${description}`} accessibilityRole="summary" style={styles.chart}>{entries.map((entry) => <View key={entry.date} style={styles.barGroup}><Text style={styles.barCount}>{entry.count}</Text><View style={styles.barTrack}><View style={[styles.bar, { height: `${Math.max((entry.count / maximum) * 100, entry.count ? 10 : 2)}%` }]} /></View><Text numberOfLines={1} style={styles.barLabel}>{entry.label}</Text></View>)}</View>;
}

export function LogsScreen({ apiFactory = createRenderApiClient }) {
  const { isOnline } = useConnectivity();
  const { language, t } = useLanguage();
  const { identity } = useSession();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [logs, setLogs] = useState([]);
  const [state, setState] = useState({ error: null, status: "loading" });
  const [userId, setUserId] = useState(String(identity?.id ?? ""));
  const [draft, setDraft] = useState({ end: "", mode: "week", start: "", week: "" });
  const [period, setPeriod] = useState({ end: "", mode: "week", start: "", week: "" });
  const [periodError, setPeriodError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const load = useCallback(async (nextUserId) => {
    if (!isOnline) return;
    const requestedUserId = String(nextUserId ?? "").trim();
    if (!requestedUserId) { setState({ error: "required", status: "error" }); return; }
    setUserId(requestedUserId);
    setState({ error: null, status: "loading" });
    try {
      const response = await apiFactory().listAuditLogs({ userId: requestedUserId });
      setLogs(asList(response));
      setPage(1);
      setState({ error: null, status: "success" });
    } catch (error) {
      setState({ error, status: "error" });
    }
  }, [apiFactory, isOnline]);

  useEffect(() => { queueMicrotask(() => load(String(identity?.id ?? ""))); }, [identity?.id, load]);

  const defaultWeek = useMemo(() => mondayFor(latestAuditDate(logs) ?? "") ?? "", [logs]);
  const selectedWeek = period.week || defaultWeek;
  const activeLogs = useMemo(() => period.mode === "range"
    ? inRange(logs, period.start, period.end)
    : selectedWeek ? inRange(logs, selectedWeek, addDays(selectedWeek, 6)) : [], [logs, period, selectedWeek]);
  const entries = useMemo(() => period.mode === "range" ? rangeEntries(activeLogs) : selectedWeek ? weeklyEntries(activeLogs, selectedWeek, t("logs.weekdays")) : [], [activeLogs, period.mode, selectedWeek, t]);
  const moduleCounts = useMemo(() => countBy(activeLogs, (log) => log.module), [activeLogs]);
  const actionCounts = useMemo(() => countBy(activeLogs, (log) => log.action), [activeLogs]);
  const topAction = useMemo(() => Object.entries(actionCounts).sort(([, left], [, right]) => right - left)[0]?.[0], [actionCounts]);
  const totalPages = Math.max(1, Math.ceil(activeLogs.length / pageSize));
  const pageItems = activeLogs.slice((page - 1) * pageSize, page * pageSize);
  const periodDescription = period.mode === "range" ? `${period.start} – ${period.end}` : selectedWeek ? `${selectedWeek} – ${addDays(selectedWeek, 6)}` : "";
  const errorMessage = state.error === "required" ? t("logs.requiredUser") : getRenderErrorMessage(state.error, language);

  const applyPeriod = () => {
    const next = { ...draft, week: draft.week || defaultWeek };
    const validation = validateAuditPeriod(next);
    if (validation) { setPeriodError(validation); return; }
    setPage(1);
    setPeriodError(null);
    setPeriod(next);
  };

  return <View style={styles.screen}>
    {!isOnline ? <StatusBanner status={readStatusFor({ hasRead: state.status === "success", isOnline })} /> : null}
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>{t("logs.eyebrow")}</Text><Text accessibilityRole="header" style={styles.title}>{t("logs.title")}</Text><Text style={styles.description}>{t("logs.description")}</Text>
      <View style={styles.filters}><Field label={t("logs.userId")} onChangeText={setUserId} value={userId} /><Pressable accessibilityRole="button" accessibilityLabel={t("logs.load")} disabled={!isOnline} onPress={() => load(userId)} style={styles.primary}><Text style={styles.primaryText}>{t("logs.load")}</Text></Pressable></View>
      {state.status === "loading" ? <ScreenState kind="loading" /> : null}
      {state.status === "error" ? <ScreenState description={errorMessage} kind="error" onRetry={() => load(userId)} title={t("logs.error")} /> : null}
      {state.status === "success" && logs.length === 0 ? <ScreenState kind="empty" title={t("logs.empty")} /> : null}
      {state.status === "success" && logs.length > 0 ? <>
        <View style={styles.panel}><Text style={styles.panelEyebrow}>{t("logs.weeklyBand")}</Text><Text style={styles.panelTitle}>{t("logs.weeklyTitle")}</Text><Text style={styles.description}>{t("logs.weeklyDescription")}</Text>
          <View style={styles.periodControls}><Pressable accessibilityRole="button" accessibilityLabel={t("logs.weekMode")} onPress={() => setDraft((current) => ({ ...current, mode: "week" }))} style={[styles.choice, draft.mode === "week" && styles.choiceSelected]}><Text style={styles.choiceText}>{t("logs.weekMode")}</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={t("logs.rangeMode")} onPress={() => setDraft((current) => ({ ...current, mode: "range" }))} style={[styles.choice, draft.mode === "range" && styles.choiceSelected]}><Text style={styles.choiceText}>{t("logs.rangeMode")}</Text></Pressable></View>
          {draft.mode === "week" ? <Field label={t("logs.weekOf")} onChangeText={(week) => setDraft((current) => ({ ...current, week }))} value={draft.week || defaultWeek} /> : <View style={styles.rangeFields}><Field label={t("logs.startDate")} onChangeText={(start) => setDraft((current) => ({ ...current, start }))} value={draft.start} /><Field label={t("logs.endDate")} onChangeText={(end) => setDraft((current) => ({ ...current, end }))} value={draft.end} /></View>}
          <Pressable accessibilityRole="button" accessibilityLabel={t("logs.applyPeriod")} onPress={applyPeriod} style={styles.secondary}><Text style={styles.secondaryText}>{t("logs.applyPeriod")}</Text></Pressable>
          {periodError ? <Text accessibilityRole="alert" style={styles.warning}>{t(periodError)}</Text> : null}<Text accessibilityLiveRegion="polite" style={styles.period}>{`${t("logs.selectedPeriod")}: ${periodDescription}`}</Text><ActivityBars entries={entries} label={t("logs.weeklyChartLabel")} />
        </View>
        <View accessibilityLabel={t("logs.metricsLabel")} accessibilityRole="summary" style={styles.metrics}><Metric label={t("logs.total")} value={activeLogs.length} /><Metric label={t("logs.modules")} value={Object.keys(moduleCounts).length} /><Metric label={t("logs.topAction")} value={topAction ?? t("logs.noActivity")} /></View>
        <View style={styles.panel}><Text style={styles.panelTitle}>{t("logs.byModule")}</Text>{Object.entries(moduleCounts).sort(([, left], [, right]) => right - left).map(([module, count]) => <View key={module} style={styles.module}><Text style={styles.moduleName}>{module}</Text><Text style={styles.moduleCount}>{count}</Text></View>)}</View>
        <View style={styles.panel}><Text style={styles.panelTitle}>{t("logs.records")}</Text>{pageItems.map((log) => <View key={log.id} style={styles.record}><Text style={styles.recordAction}>{log.action}</Text><Text style={styles.recordCopy}>{`${log.module} · ${log.description}`}</Text><Text style={styles.recordDate}>{log.createdAt}</Text></View>)}{activeLogs.length === 0 ? <Text accessibilityRole="status" style={styles.description}>{t("logs.emptyPeriod")}</Text> : null}
          <View accessibilityLabel={t("logs.pagination")} accessibilityRole="summary" style={styles.pagination}><View style={styles.pageSizes}>{pageSizes.map((size) => <Pressable key={size} accessibilityRole="button" accessibilityLabel={`${t("logs.perPage")}: ${size}`} onPress={() => { setPageSize(size); setPage(1); }} style={[styles.choice, pageSize === size && styles.choiceSelected]}><Text style={styles.choiceText}>{size}</Text></Pressable>)}</View><View style={styles.pageNav}><Pressable accessibilityRole="button" accessibilityLabel={t("logs.previous")} disabled={page === 1} onPress={() => setPage((current) => Math.max(1, current - 1))} style={styles.secondary}><Text style={styles.secondaryText}>{t("logs.previous")}</Text></Pressable><Text style={styles.pageText}>{`${t("logs.page")} ${page} ${t("logs.of")} ${totalPages}`}</Text><Pressable accessibilityRole="button" accessibilityLabel={t("logs.next")} disabled={page === totalPages} onPress={() => setPage((current) => Math.min(totalPages, current + 1))} style={styles.secondary}><Text style={styles.secondaryText}>{t("logs.next")}</Text></Pressable></View></View>
        </View>
      </> : null}
    </ScrollView>
  </View>;
}

function Metric({ label, value }) { const { colors } = useTheme(); const styles = makeStyles(colors); return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>; }

const makeStyles = (colors) => StyleSheet.create({
  screen: { backgroundColor: colors.canvas, flex: 1 }, content: { gap: spacing.card, padding: spacing.section }, eyebrow: { color: colors.action, fontSize: 12, fontWeight: "800", letterSpacing: 1.1 }, title: { color: colors.brand, fontSize: 30, fontWeight: "700" }, description: { color: colors.textSecondary, fontSize: 15, lineHeight: 22 }, filters: { gap: spacing.control }, field: { gap: spacing.micro }, label: { color: colors.ink, fontWeight: "700" }, input: { backgroundColor: colors.control, borderRadius: radius.control, color: colors.ink, minHeight: 46, paddingHorizontal: spacing.control }, primary: { alignItems: "center", backgroundColor: colors.action, borderRadius: radius.control, justifyContent: "center", minHeight: 44, paddingHorizontal: spacing.control }, primaryText: { color: colors.onBrand, fontWeight: "800" }, secondary: { alignItems: "center", borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, justifyContent: "center", minHeight: 44, paddingHorizontal: spacing.control }, secondaryText: { color: colors.action, fontWeight: "800" }, panel: { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSoft, borderRadius: radius.card, borderWidth: 1, gap: spacing.control, padding: spacing.card }, panelEyebrow: { color: colors.action, fontSize: 11, fontWeight: "800", letterSpacing: 1 }, panelTitle: { color: colors.ink, fontSize: 20, fontWeight: "700" }, periodControls: { flexDirection: "row", gap: spacing.compact }, choice: { alignItems: "center", borderColor: colors.border, borderRadius: radius.control, borderWidth: 1, justifyContent: "center", minHeight: 40, paddingHorizontal: spacing.control }, choiceSelected: { backgroundColor: colors.control, borderColor: colors.action }, choiceText: { color: colors.ink, fontWeight: "700" }, rangeFields: { gap: spacing.control }, warning: { color: colors.warning, fontWeight: "700" }, period: { color: colors.textSecondary, fontWeight: "700" }, chart: { alignItems: "flex-end", flexDirection: "row", gap: spacing.micro, height: 176, justifyContent: "space-between" }, barGroup: { alignItems: "center", flex: 1, gap: spacing.micro, height: "100%" }, barCount: { color: colors.ink, fontSize: 12, fontWeight: "800" }, barTrack: { backgroundColor: colors.control, flex: 1, justifyContent: "flex-end", width: "100%" }, bar: { backgroundColor: colors.action, width: "100%" }, barLabel: { color: colors.textMuted, fontSize: 10 }, metrics: { flexDirection: "row", gap: spacing.compact }, metric: { backgroundColor: colors.surfaceRaised, borderColor: colors.borderSoft, borderRadius: radius.card, borderWidth: 1, flex: 1, gap: spacing.micro, minHeight: 96, padding: spacing.control }, metricLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: "700" }, metricValue: { color: colors.brand, fontSize: 21, fontWeight: "800" }, module: { alignItems: "center", borderTopColor: colors.borderSoft, borderTopWidth: 1, flexDirection: "row", justifyContent: "space-between", paddingTop: spacing.compact }, moduleName: { color: colors.ink, fontWeight: "700" }, moduleCount: { color: colors.action, fontWeight: "800" }, record: { borderTopColor: colors.borderSoft, borderTopWidth: 1, gap: spacing.micro, paddingTop: spacing.control }, recordAction: { color: colors.ink, fontWeight: "800" }, recordCopy: { color: colors.textSecondary }, recordDate: { color: colors.textMuted, fontSize: 12 }, pagination: { gap: spacing.control }, pageSizes: { flexDirection: "row", gap: spacing.compact }, pageNav: { alignItems: "center", flexDirection: "row", gap: spacing.compact, justifyContent: "space-between" }, pageText: { color: colors.textSecondary, fontWeight: "700" }
});
